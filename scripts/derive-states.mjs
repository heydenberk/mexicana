// Builds territories that are approximated by groups of modern states (colonial intendancies, provinces,
// zones of control). Any feature in data/eras/*.geojson with `"derived": true` and a `from_states` list of
// Natural Earth admin-1 names (Mexican states, US states, Guatemalan departments or Belizean districts,
// e.g. ["Jalisco", "Nayarit"]) gets its geometry rewritten as the union of those states.
//
// Small islands more than ~3° from the territory's main landmass are left out.
//
// Usage: npm run build:reference (once) && npm run derive:states [-- --file=04]   (--file: only era files whose name contains it)
//
// Modern state lines are only a stand-in for historical ones, so such features should be marked
// approximate or schematic and say in their `note` which modern states they are drawn from.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import pc from 'polygon-clipping';
import { formatFeatureCollection } from './lib/format.mjs';

const CACHE = '.cache/naturalearth';
const ADM1 = join(CACHE, 'ne_10m_admin_1_states_provinces/ne_10m_admin_1_states_provinces.shp');
const STATES = join(CACHE, 'states-sel.geojson');
if (!existsSync(ADM1)) throw new Error('Run `npm run build:reference` first to download Natural Earth data');

// Simplified together, so neighbouring states keep identical shared edges and union without slivers.
execFileSync('npx', ['mapshaper', '-i', ADM1,
  '-filter', '["Mexico","United States of America","Guatemala","Belize"].indexOf(admin)>-1 && !!name',
  '-filter-fields', 'name,admin', '-clip', 'bbox=-128,5,-74,46', '-simplify', 'interval=600', 'keep-shapes',
  '-o', STATES, 'precision=0.0001', 'geojson-type=FeatureCollection', '-quiet'], { stdio: 'inherit' });

const states = new Map();
for (const f of JSON.parse(readFileSync(STATES, 'utf8')).features) {
  if (states.has(f.properties.name)) throw new Error(`ambiguous state name ${f.properties.name}`);
  states.set(f.properties.name, f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates);
}

const r4 = (n) => Math.round(n * 1e4) / 1e4;
const ringArea = (ring) => Math.abs(ring.reduce((a, p, i) => {
  const q = ring[(i + 1) % ring.length];
  return a + p[0] * q[1] - q[0] * p[1];
}, 0) / 2);

let updated = 0;
let problems = 0;
const fileFilter = process.argv.find((a) => a.startsWith('--file='))?.split('=')[1];
for (const file of readdirSync('data/eras').filter((f) => f.endsWith('.geojson') && (!fileFilter || f.includes(fileFilter))).sort()) {
  const path = join('data/eras', file);
  const fc = JSON.parse(readFileSync(path, 'utf8'));
  let changed = false;
  for (const f of fc.features) {
    const names = f.properties.from_states;
    if (!f.properties.derived || !Array.isArray(names)) continue;
    const missing = names.filter((n) => !states.has(n));
    if (missing.length) {
      console.error(`${file} ${f.properties.id}: unknown state name(s) ${missing.join(', ')}`);
      problems++;
      continue;
    }
    const pieces = pc.union(...names.map((n) => states.get(n)))
      .filter((poly) => ringArea(poly[0]) > 0.002); // drop specks such as offshore islets
    // Also drop small islands far out to sea (e.g. Colima's Revillagigedo group, ~700 km offshore).
    const main = pieces.reduce((a, b) => (ringArea(b[0]) > ringArea(a[0]) ? b : a));
    const near = (poly) => poly[0].some(([x, y]) => main[0].some(([u, v]) => (x - u) ** 2 + (y - v) ** 2 < 9));
    const union = pieces
      .filter((poly) => poly === main || ringArea(poly[0]) > 0.5 || near(poly))
      .map((poly) => poly.map((ring) => ring.map(([x, y]) => [r4(x), r4(y)])));
    f.geometry = union.length === 1 ? { type: 'Polygon', coordinates: union[0] } : { type: 'MultiPolygon', coordinates: union };
    changed = true;
    updated++;
  }
  if (changed) writeFileSync(path, formatFeatureCollection(fc));
}
console.log(`updated ${updated} state-based territories${problems ? `; ${problems} problem(s)` : ''}`);
process.exit(problems ? 1 : 0);
