// Cross-checks point coordinates against OpenStreetMap's Nominatim geocoder.
// Every Point feature with a `modern_place` property is geocoded (results cached in .cache/geocode.json,
// requests throttled to 1/s per Nominatim's usage policy) and the distance to the stored coordinate is
// reported. Distances above the threshold are flagged for review — a flag is not automatically an
// error (a battlefield may legitimately lie several km from the town it is named after).
//
// Usage: npm run check:places [-- --threshold=5]            check all era files
//        npm run check:places -- --file=02          check only era files whose name contains "02"
//        npm run check:places -- --lookup "Otumba, México, Mexico"   geocode ad-hoc names
//        npm run check:places -- --cities           check the modern cities in data/reference/cities.geojson
//
// Several copies can run at once: a lock file serializes their requests, so the 1/s limit holds overall.
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, rmdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const CACHE_FILE = '.cache/geocode-v2.json';
const args = process.argv.slice(2);
const threshold = Number(args.find((a) => a.startsWith('--threshold='))?.split('=')[1] ?? 5);
const LOCK = '.cache/geocode.lock';
const fileFilter = args.find((a) => a.startsWith('--file='))?.split('=')[1];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const readCache = () => (existsSync(CACHE_FILE) ? JSON.parse(readFileSync(CACHE_FILE, 'utf8')) : {});
let cache = readCache();

async function withLock(fn) {
  mkdirSync('.cache', { recursive: true });
  for (;;) {
    try {
      mkdirSync(LOCK);
      break;
    } catch {
      // Break a lock left behind by a crashed run.
      try { if (Date.now() - statSync(LOCK).mtimeMs > 30000) rmdirSync(LOCK); } catch { /* gone already */ }
      await sleep(200);
    }
  }
  try {
    return await fn();
  } finally {
    rmdirSync(LOCK);
  }
}

async function geocode(q) {
  if (cache[q] !== undefined) return cache[q];
  return withLock(() => fetchPlace(q));
}

async function fetchPlace(q) {
  cache = readCache(); // another run may have looked it up meanwhile
  if (cache[q] !== undefined) return cache[q];
  await sleep(1100);
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&q=${encodeURIComponent(q)}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'mexicana-atlas data check (local script)' } });
  if (!res.ok) throw new Error(`Nominatim ${res.status} for ${q}`);
  const hits = await res.json();
  // Prefer a settlement or site node over an administrative area: for Mexican towns Nominatim often ranks
  // the municipality polygon first, whose centroid can be several km from the town itself.
  const hit = hits.find((h) => h.category !== 'boundary') ?? hits[0];
  cache[q] = hit ? { lon: +hit.lon, lat: +hit.lat, name: hit.display_name } : null;
  mkdirSync('.cache', { recursive: true });
  writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 1));
  return cache[q];
}

function km([lon1, lat1], [lon2, lat2]) {
  const rad = Math.PI / 180;
  const a = Math.sin(((lat2 - lat1) * rad) / 2) ** 2
    + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(((lon2 - lon1) * rad) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

const lookupIndex = args.indexOf('--lookup');
if (lookupIndex > -1) {
  for (const q of args.slice(lookupIndex + 1)) {
    const hit = await geocode(q);
    console.log(hit ? `${hit.lon.toFixed(4)}, ${hit.lat.toFixed(4)}  ${q}  →  ${hit.name}` : `NOT FOUND  ${q}`);
  }
  process.exit(0);
}

let flagged = 0;
let checked = 0;

if (args.includes('--cities')) {
  const fc = JSON.parse(readFileSync('data/reference/cities.geojson', 'utf8'));
  for (const f of fc.features) {
    const { name, adm1, country } = f.properties;
    const q = `${name}, ${adm1}, ${country === 'United States of America' ? 'USA' : country}`;
    const hit = await geocode(q);
    checked++;
    const d = hit ? km(f.geometry.coordinates, [hit.lon, hit.lat]) : Infinity;
    if (d > threshold) flagged++;
    console.log(hit ? `${d > threshold ? '⚠' : '✓'}  ${d.toFixed(1).padStart(6)} km  ${q}  ← ${hit.name}` : `?  "${q}" not found by Nominatim`);
  }
  console.log(`\n${checked} cities checked, ${flagged} flagged (threshold ${threshold} km)`);
  process.exit(0);
}
for (const file of readdirSync('data/eras').filter((f) => f.endsWith('.geojson') && (!fileFilter || f.includes(fileFilter))).sort()) {
  const fc = JSON.parse(readFileSync(join('data/eras', file), 'utf8'));
  for (const f of fc.features) {
    const place = f.properties.modern_place;
    if (!place || f.geometry?.type !== 'Point') continue;
    const hit = await geocode(place);
    checked++;
    if (!hit) {
      console.log(`?  ${f.properties.id}: "${place}" not found by Nominatim`);
      flagged++;
      continue;
    }
    const d = km(f.geometry.coordinates, [hit.lon, hit.lat]);
    const mark = d > threshold ? '⚠' : '✓';
    if (d > threshold) flagged++;
    console.log(`${mark}  ${d.toFixed(1).padStart(6)} km  ${f.properties.id}  (${f.properties.confidence})  ← ${hit.name}`);
  }
}
console.log(`\n${checked} points checked, ${flagged} flagged (threshold ${threshold} km)`);
