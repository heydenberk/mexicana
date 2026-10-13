// Derives treaty lines and territorial polygons for the 1821–1854 era from their textual
// descriptions, using Natural Earth geometry wherever a treaty follows a river or a line that
// is still a modern boundary. Writes the geometry into any feature in data/eras/*.geojson whose
// `id` matches and whose properties include `"derived": true`.
//
// Usage: npm run build:reference && node scripts/derive-boundaries.mjs
//
// Hand edits to the geometry of a `derived` feature will be overwritten by this script; remove
// the `derived` flag from a feature to edit it by hand.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import pc from 'polygon-clipping';
import { formatFeatureCollection } from './lib/format.mjs';

const CACHE = '.cache/naturalearth';
const read = (p) => JSON.parse(readFileSync(p, 'utf8'));
const mapshaper = (args) => execFileSync('npx', ['mapshaper', '-i', ...args, '-quiet'], { stdio: 'inherit' });

// ---- inputs ---------------------------------------------------------------------------------
const adm1 = join(CACHE, 'ne_10m_admin_1_states_provinces/ne_10m_admin_1_states_provinces.shp');
const adm0 = join(CACHE, 'ne_10m_admin_0_countries/ne_10m_admin_0_countries.shp');
if (!existsSync(adm1)) throw new Error('Run `npm run build:reference` first to download Natural Earth data');

mapshaper([adm1, '-filter', "name=='Texas'", '-filter-fields', 'name', '-simplify', 'interval=100',
  '-o', `${CACHE}/texas.geojson`]);
mapshaper([adm0, '-filter', '["MEX","USA","GTM","BLZ","SLV","HND","NIC","CRI"].indexOf(ADM0_A3)>-1',
  '-filter-fields', 'ADM0_A3', '-clip', 'bbox=-128,5,-74,46', '-simplify', 'interval=100', 'keep-shapes',
  '-o', `${CACHE}/countries-sel.geojson`]);
mapshaper([`${CACHE}/countries-sel.geojson`, '-filter', '["MEX","USA"].indexOf(ADM0_A3)>-1', '-innerlines',
  '-o', `${CACHE}/border-mex-usa.geojson`, 'geojson-type=FeatureCollection']);

const texas = read(`${CACHE}/texas.geojson`).features[0].geometry;
const countries = read(`${CACHE}/countries-sel.geojson`).features;
const country = (a3) => countries.find((f) => f.properties.ADM0_A3 === a3).geometry;
const rivers = read('data/reference/rivers.geojson').features;
const landFile = read('data/reference/land.geojson');
const land = landFile.geometries ?? landFile.features.map((f) => f.geometry);

// ---- helpers --------------------------------------------------------------------------------
const r4 = (n) => Math.round(n * 1e4) / 1e4;
const dist2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
const nearestIndex = (line, pt) => line.reduce((best, p, i) => (dist2(p, pt) < dist2(line[best], pt) ? i : best), 0);

function linesOf(name) {
  return rivers.filter((f) => f.properties.name === name)
    .flatMap((f) => (f.geometry.type === 'LineString' ? [f.geometry.coordinates] : f.geometry.coordinates));
}

/** Chain loose line pieces into one polyline starting at `start`, greedily joining nearest ends. */
function chain(pieces, start) {
  const pool = pieces.map((p) => [...p]);
  const out = [];
  let cursor = start;
  while (pool.length) {
    let best = null;
    pool.forEach((p, i) => {
      const dHead = dist2(p[0], cursor);
      const dTail = dist2(p[p.length - 1], cursor);
      const d = Math.min(dHead, dTail);
      if (!best || d < best.d) best = { i, d, reversed: dTail < dHead };
    });
    if (best.d > 0.25 ** 2 && out.length) break; // stop at gaps wider than ~25 km
    const [piece] = pool.splice(best.i, 1);
    const seq = best.reversed ? piece.reverse() : piece;
    out.push(...(out.length && dist2(out[out.length - 1], seq[0]) < 1e-10 ? seq.slice(1) : seq));
    cursor = out[out.length - 1];
  }
  return out;
}

/** Portion of `line` between the vertices nearest to `from` and `to`, oriented from → to. */
function slice(line, from, to) {
  const i = nearestIndex(line, from);
  const j = nearestIndex(line, to);
  return i <= j ? line.slice(i, j + 1) : line.slice(j, i + 1).reverse();
}

/** Walk a closed ring from `from` to `to`, choosing the direction that passes nearest `via`. */
function ringPath(ring, from, to, via) {
  const r = ring.slice(0, -1);
  const n = r.length;
  const i = nearestIndex(r, from);
  const j = nearestIndex(r, to);
  const walk = (step) => {
    const out = [];
    for (let k = i; ; k = (k + step + n) % n) {
      out.push(r[k]);
      if (k === j) return out;
    }
  };
  const fwd = walk(1);
  const back = walk(-1);
  const near = (path) => Math.min(...path.map((p) => dist2(p, via)));
  return near(fwd) < near(back) ? fwd : back;
}

/** Point where `line` first crosses longitude `lon`, linearly interpolated, plus its index. */
function crossLon(line, lon) {
  for (let k = 1; k < line.length; k++) {
    const [a, b] = [line[k - 1], line[k]];
    if ((a[0] - lon) * (b[0] - lon) <= 0 && a[0] !== b[0]) {
      const t = (lon - a[0]) / (b[0] - a[0]);
      return { point: [lon, a[1] + t * (b[1] - a[1])], index: k };
    }
  }
  throw new Error(`line never crosses ${lon}`);
}
function crossLat(line, lat) {
  for (let k = 1; k < line.length; k++) {
    const [a, b] = [line[k - 1], line[k]];
    if ((a[1] - lat) * (b[1] - lat) <= 0 && a[1] !== b[1]) {
      const t = (lat - a[1]) / (b[1] - a[1]);
      return { point: [a[0] + t * (b[0] - a[0]), lat], index: k };
    }
  }
  throw new Error(`line never crosses ${lat}`);
}

/** Drop repeated vertices and out-and-back spikes (A, B, A) left where river pieces overlap. */
function dedupe(line) {
  const out = [];
  for (const p of line) {
    if (out.length && dist2(p, out[out.length - 1]) < 1e-12) continue;
    if (out.length > 1 && dist2(p, out[out.length - 2]) < 1e-12) { out.pop(); continue; }
    out.push(p);
  }
  return out;
}
const polygonFrom = (line) => [[...dedupe(line), line[0]]];
const asGeometry = (mp) =>
  mp.length === 1 ? { type: 'Polygon', coordinates: mp[0] } : { type: 'MultiPolygon', coordinates: mp };
const roundGeom = (g) => JSON.parse(JSON.stringify(g, (_, v) => (typeof v === 'number' ? r4(v) : v)));
const landCoords = land.map((g) => (g.type === 'Polygon' ? [g.coordinates] : g.coordinates)).flat();
const clipToLand = (poly) => asGeometry(pc.intersection(poly, landCoords));
const minArea = (mp, min) => mp.filter((poly) => Math.abs(ringArea(poly[0])) > min);
function ringArea(ring) {
  let a = 0;
  for (let k = 1; k < ring.length; k++) a += ring[k - 1][0] * ring[k][1] - ring[k][0] * ring[k - 1][1];
  return a / 2;
}

// ---- key places --------------------------------------------------------------------------------
const SABINE_MOUTH = [-93.84, 29.69];
const RED_AT_100W = [-100.0, 34.5605];
const LAT_32_22 = 32 + 22 / 60; // southern boundary of New Mexico per Bartlett–García Conde (1851)
const LAT_31_47 = 31 + 47 / 60; // Gadsden Treaty art. I
const LAT_31_20 = 31 + 20 / 60;
const GADSDEN_100_MILE_LON = -108.2084; // "due west one hundred miles" — the surveyed corner
const MERIDIAN_111 = -111.0747; // as surveyed (the treaty's 111th meridian)
const COLORADO_20_MI_BELOW = [-114.813, 32.4947]; // "twenty English miles below the junction"
const GILA_COLORADO_JUNCTION = [-114.5584, 32.7338]; // NE river end point
const BOUNDARY_ON_COLORADO = [-114.7191, 32.7183]; // where the 1848 straight line crosses the Colorado
const PACIFIC_1848 = [-117.1238, 32.5343]; // one marine league south of the port of San Diego
const PACIFIC_42N = [-124.2105, 42.0];

// ---- Adams–Onís line (1819, in force 1821) ---------------------------------------------------
// Sabine (west bank) to 32°N, due north to the Red River, up the Red River to 100°W, north to the
// Arkansas, up the Arkansas to its source, north to 42°N, then along 42°N to the Pacific.
const texasRing = texas.type === 'Polygon' ? texas.coordinates[0] : texas.coordinates.sort((a, b) => b[0].length - a[0].length)[0][0];
const sabineToRed = ringPath(texasRing, SABINE_MOUTH, RED_AT_100W, [-94.04, 33.0]);
const arkansas = linesOf('Arkansas')[0]; // source → mouth
const ark100 = crossLon(arkansas, -100);
const arkUp = [ark100.point, ...arkansas.slice(0, ark100.index).reverse()]; // 100°W → source
const arkSource = arkansas[0];
const adamsOnis = dedupe([
  ...sabineToRed,
  RED_AT_100W,
  ...arkUp,
  [arkSource[0], 42.0],
  PACIFIC_42N,
]);

// ---- Rio Grande -------------------------------------------------------------------------------
const borderMexUsa = chain(read(`${CACHE}/border-mex-usa.geojson`).features
  .flatMap((f) => (f.geometry.type === 'LineString' ? [f.geometry.coordinates] : f.geometry.coordinates)), [-97.14, 25.96]);
const EL_PASO = [-106.5283, LAT_31_47];
const rioGrandeLower = slice(borderMexUsa, [-97.14, 25.96], EL_PASO); // mouth → El Paso, as the modern border
const rioGrandeUpper = chain(linesOf('Rio Grande').filter((l) => Math.min(...l.map((p) => p[1])) > 31.7), [-106.5663, 31.8195]); // El Paso → source
const rioGrandeSource = rioGrandeUpper[rioGrandeUpper.length - 1];
const rg3222 = crossLat(rioGrandeUpper, LAT_32_22);
const rgElPasoTo3222 = [...rioGrandeUpper.slice(0, rg3222.index), rg3222.point];

// ---- 1848 southern line of New Mexico and the Gila ----------------------------------------------
const nmWestEnd = [rg3222.point[0] - 3, LAT_32_22]; // three degrees of longitude west of the river
const gila = chain(linesOf('Gila'), [-108.2036, 33.5768]); // headwaters → Colorado junction
const gilaAtWestLine = crossLon(gila, nmWestEnd[0]);
const gilaDown = dedupe([gilaAtWestLine.point, ...gila.slice(gilaAtWestLine.index), GILA_COLORADO_JUNCTION]);

const guadalupeHidalgo = dedupe([
  ...rioGrandeLower,
  ...rgElPasoTo3222,
  nmWestEnd,
  ...gilaDown,
  BOUNDARY_ON_COLORADO,
  PACIFIC_1848,
]);

// ---- Gadsden line (1853) --------------------------------------------------------------------------
const gadsdenLine = [
  EL_PASO,
  [GADSDEN_100_MILE_LON, LAT_31_47],
  [GADSDEN_100_MILE_LON, LAT_31_20],
  [MERIDIAN_111, LAT_31_20],
  COLORADO_20_MI_BELOW,
  [-114.7809, 32.5629], // up the Colorado
  [-114.7505, 32.6408],
  BOUNDARY_ON_COLORADO,
];

// ---- polygons ----------------------------------------------------------------------------------------
// Texas as claimed by the Republic's Boundary Act of 19 Dec 1836: Rio Grande to its source, due north
// to 42°N, then along the Adams–Onís line back to the Sabine.
const aoAt42West = adamsOnis.findIndex((p) => p[1] === 42.0);
const texasClaim = pc.intersection(polygonFrom([
  ...adamsOnis.slice(0, aoAt42West + 1), // Sabine mouth … Arkansas source … 42°N
  [rioGrandeSource[0], 42.0],
  ...[...rioGrandeUpper].reverse(), // source → El Paso
  ...[...rioGrandeLower].reverse(), // El Paso → mouth
  [-96.5, 25.8], [-93.5, 29.3], // close through the Gulf
]), landCoords);

// The Nueces Strip: between the Nueces and the Rio Grande, closed schematically at the Nueces headwaters.
const nueces = chain(linesOf('Nueces').filter((l) => !(l[0][0] === -98.1984 && l[0][1] === 28.4254 && l.length === 6)), [-97.5211, 27.8732]);
const rgAtStripWest = [-101.3035, 29.6341];
const nuecesStrip = pc.intersection(polygonFrom([
  ...nueces, // mouth → headwaters
  rgAtStripWest,
  ...slice(rioGrandeLower, rgAtStripWest, [-97.14, 25.96]),
  [-97.0, 25.95], [-97.2, 27.85],
]), landCoords);

// Mexican Cession (1848): between the Texas claim, 42°N, the Pacific and the 1848 line.
const cession = pc.intersection(polygonFrom([
  [-126, 42.0],
  [rioGrandeSource[0], 42.0],
  ...[...rioGrandeUpper].reverse().slice(0, rioGrandeUpper.length - rg3222.index), // source → 32°22′
  rg3222.point,
  nmWestEnd,
  ...gilaDown,
  BOUNDARY_ON_COLORADO,
  PACIFIC_1848,
  [-118.0, 32.3], [-126, 32.3],
]), landCoords);

// Gadsden Purchase (1853–54): between the 1848 line and the Gadsden line.
const gadsden = [polygonFrom([
  ...rgElPasoTo3222,
  nmWestEnd,
  ...gilaDown,
  BOUNDARY_ON_COLORADO,
  ...[...gadsdenLine].reverse().slice(1),
])];

// Mexico at independence: modern Mexico plus everything south of the Adams–Onís line.
const northOfModern = polygonFrom([
  ...adamsOnis,
  [-130, 42.0], [-130, 28.0],
  PACIFIC_1848,
  ...[...borderMexUsa].reverse(), // Pacific → Gulf along the modern border
  [-96.5, 25.8], [-93.5, 29.3],
]);
const mex = country('MEX');
const mexico1821 = pc.intersection(
  pc.union(mex.type === 'Polygon' ? [mex.coordinates] : mex.coordinates, [northOfModern]),
  landCoords,
);

// Central America (in the Mexican Empire Jan 1822 – Jul 1823): the five modern republics.
const ca = ['GTM', 'SLV', 'HND', 'NIC', 'CRI'].map(country)
  .map((g) => (g.type === 'Polygon' ? [g.coordinates] : g.coordinates));
const centralAmerica = pc.union(...ca);

const derived = {
  'e6-adams-onis-line': { type: 'LineString', coordinates: adamsOnis },
  'e6-guadalupe-hidalgo-line': { type: 'LineString', coordinates: guadalupeHidalgo },
  'e6-gadsden-line': { type: 'LineString', coordinates: gadsdenLine },
  'e6-mexico-1821': asGeometry(minArea(mexico1821, 0.002)),
  'e6-central-america-1822': asGeometry(minArea(centralAmerica, 0.002)),
  'e6-texas-claim-1836': asGeometry(minArea(texasClaim, 0.002)),
  'e6-nueces-strip': asGeometry(minArea(nuecesStrip, 0.002)),
  'e6-mexican-cession-1848': asGeometry(minArea(cession, 0.002)),
  'e6-gadsden-purchase-1853': asGeometry(gadsden),
};

// ---- write ----------------------------------------------------------------------------------------
writeFileSync(join(CACHE, 'derived.geojson'), JSON.stringify({
  type: 'FeatureCollection',
  features: Object.entries(derived).map(([id, geometry]) => ({ type: 'Feature', properties: { id }, geometry: roundGeom(geometry) })),
}));

mapshaper([join(CACHE, 'derived.geojson'), '-simplify', 'interval=600', 'keep-shapes',
  '-o', join(CACHE, 'derived-simple.geojson'), 'combine-layers', 'precision=0.0001', 'geojson-type=FeatureCollection']);
const simple = Object.fromEntries(read(join(CACHE, 'derived-simple.geojson')).features.map((f) => [f.properties.id, f.geometry]));

let updated = 0;
for (const file of readdirSync('data/eras').filter((f) => f.endsWith('.geojson'))) {
  const path = join('data/eras', file);
  const fc = read(path);
  let changed = false;
  for (const f of fc.features) {
    if (f.properties.derived && derived[f.properties.id]) {
      f.geometry = simple[f.properties.id];
      changed = true;
      updated++;
    }
  }
  if (changed) writeFileSync(path, formatFeatureCollection(fc));
}
console.log(`derived ${Object.keys(derived).length} geometries; updated ${updated} features (preview: ${CACHE}/derived.geojson)`);
