// Validates data/eras.json and every era GeoJSON against the atlas data model.
// Runs before every build (npm run build) and on its own with `npm run validate`.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const TYPES = ['battle', 'city', 'route', 'boundary', 'uprising', 'economic', 'political'];
const CONFIDENCE = ['precise', 'approximate', 'schematic'];
const DATE = /^-?\d{1,4}(-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?)?$/;
const REQUIRED = ['id', 'era', 'title', 'type', 'description', 'confidence', 'sources'];
const KNOWN = new Set([...REQUIRED, 'label', 'date', 'start', 'end', 'note', 'modern_place', 'clip', 'exclude', 'directional', 'derived', 'from_states', 'style']);
// Generous box around everything the atlas covers (Central America to the 42nd parallel and Missouri).
const WORLD = [-130, 5, -74, 46];

const errors = [];
const warnings = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);

const eras = JSON.parse(readFileSync('data/eras.json', 'utf8'));
const eraIds = new Set();
for (const era of eras) {
  for (const k of ['id', 'title', 'start', 'end', 'bbox']) if (era[k] === undefined) err(`eras.json ${era.id ?? '?'}`, `missing ${k}`);
  if (eraIds.has(era.id)) err('eras.json', `duplicate era id ${era.id}`);
  eraIds.add(era.id);
  if (era.file && !readdirSync('data/eras').includes(era.file)) err(`eras.json ${era.id}`, `file ${era.file} not found in data/eras/`);
}

const yearOf = (d) => (d ? Number(d.split('-')[0]) : null);
const ids = new Map();
const allFeatures = [];

for (const file of readdirSync('data/eras').filter((f) => f.endsWith('.geojson')).sort()) {
  const path = join('data/eras', file);
  let fc;
  try {
    fc = JSON.parse(readFileSync(path, 'utf8'));
  } catch (e) {
    err(path, `invalid JSON: ${e.message}`);
    continue;
  }
  const era = eras.find((e) => e.file === file);
  if (!era) warn(path, 'not listed in eras.json, so it will not be shown');
  if (fc.type !== 'FeatureCollection' || !Array.isArray(fc.features)) {
    err(path, 'must be a FeatureCollection');
    continue;
  }
  fc.features.forEach((f, i) => {
    const p = f.properties ?? {};
    const where = `${file} #${i} ${p.id ?? ''}`.trim();
    allFeatures.push({ f, where });
    for (const k of REQUIRED) if (p[k] === undefined || p[k] === '') err(where, `missing "${k}"`);
    for (const k of Object.keys(p)) if (!KNOWN.has(k)) warn(where, `unknown property "${k}"`);
    if (p.id) {
      if (ids.has(p.id)) err(where, `duplicate id (also in ${ids.get(p.id)})`);
      ids.set(p.id, file);
    }
    if (era && p.era !== era.id) err(where, `era "${p.era}" does not match eras.json id "${era.id}" for ${file}`);
    if (p.type && !TYPES.includes(p.type)) err(where, `type "${p.type}" must be one of ${TYPES.join(', ')}`);
    if (p.confidence && !CONFIDENCE.includes(p.confidence)) err(where, `confidence "${p.confidence}" must be one of ${CONFIDENCE.join(', ')}`);
    if (!p.date && !p.start) err(where, 'needs "date" or "start"');
    for (const k of ['date', 'start', 'end']) if (p[k] && !DATE.test(p[k])) err(where, `${k} "${p[k]}" must look like 1519, 1519-11 or 1519-11-08`);
    if (p.start && p.end && p.end < p.start && yearOf(p.end) <= yearOf(p.start)) err(where, `end ${p.end} is before start ${p.start}`);
    if (era) {
      const y = yearOf(p.date ?? p.start);
      if (y !== null && (y < era.start - 1 || y > era.end + 1)) warn(where, `date ${p.date ?? p.start} falls outside the era (${era.start}–${era.end})`);
    }
    if (!Array.isArray(p.sources) || p.sources.length === 0) err(where, 'needs at least one source');
    else p.sources.forEach((s, j) => {
      const citation = typeof s === 'string' ? s : s?.citation;
      if (!citation || citation.length < 10) err(where, `source ${j + 1} needs a citation`);
      if (typeof s === 'object' && s.url && !/^https?:\/\//.test(s.url)) err(where, `source ${j + 1} url must start with http(s)://`);
    });
    if (p.description && p.description.length < 60) warn(where, 'description is very short');
    if (p.exclude && !Array.isArray(p.exclude)) err(where, '"exclude" must be a list of feature ids');
    if (p.clip && p.clip !== 'land') err(where, '"clip" must be "land"');
    if (p.from_states && (!Array.isArray(p.from_states) || !p.derived)) err(where, '"from_states" must be a list of state names, on a feature marked "derived": true');

    const g = f.geometry;
    if (!g) {
      err(where, 'missing geometry');
      return;
    }
    if (p.type === 'route' && !['LineString', 'MultiLineString', 'Point'].includes(g.type)) err(where, `a route must be a line (or a Point waypoint), not ${g.type}`);
    let bad = 0;
    const visit = (c) => {
      if (typeof c[0] === 'number') {
        const [x, y] = c;
        if (!Number.isFinite(x) || !Number.isFinite(y) || x < WORLD[0] || x > WORLD[2] || y < WORLD[1] || y > WORLD[3]) bad++;
      } else c.forEach(visit);
    };
    visit(g.coordinates);
    if (bad) err(where, `${bad} coordinate(s) outside the atlas area — check for swapped longitude/latitude`);
  });
}

for (const { f, where } of allFeatures) {
  for (const id of f.properties?.exclude ?? []) if (!ids.has(id)) err(where, `exclude refers to unknown id "${id}"`);
}

for (const w of warnings) console.warn(`warning  ${w}`);
for (const e of errors) console.error(`error    ${e}`);
console.log(`\n${allFeatures.length} features checked: ${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
