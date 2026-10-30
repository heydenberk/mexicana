// Builds the faint modern reference layers in data/reference/ from Natural Earth 10m data.
// Usage: npm run build:reference   (downloads into .cache/naturalearth on first run)
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const CACHE = '.cache/naturalearth';
const OUT = 'data/reference';
const BBOX = '-128,5,-74,46'; // Central America to Oregon, Pacific to the Caribbean
const NE = 'https://naciscdn.org/naturalearth/10m';
const DATASETS = {
  land: 'physical/ne_10m_land',
  lakes: 'physical/ne_10m_lakes',
  rivers: 'physical/ne_10m_rivers_lake_centerlines',
  riversNA: 'physical/ne_10m_rivers_north_america',
  countries: 'cultural/ne_10m_admin_0_countries',
  states: 'cultural/ne_10m_admin_1_states_provinces',
  places: 'cultural/ne_10m_populated_places',
};

mkdirSync(CACHE, { recursive: true });
mkdirSync(OUT, { recursive: true });

function shp(key) {
  const name = DATASETS[key].split('/')[1];
  const dir = join(CACHE, name);
  if (!existsSync(dir)) {
    console.log(`downloading ${name}…`);
    execFileSync('curl', ['-sfL', '-o', `${dir}.zip`, `${NE}/${DATASETS[key]}.zip`], { stdio: 'inherit' });
    execFileSync('unzip', ['-qo', `${dir}.zip`, '-d', dir], { stdio: 'inherit' });
  }
  return join(dir, `${name}.shp`);
}

function mapshaper(args) {
  execFileSync('npx', ['mapshaper', '-i', ...args, '-quiet'], { stdio: 'inherit' });
}

const COUNTRIES = ['MEX', 'USA', 'GTM', 'BLZ', 'SLV', 'HND', 'NIC', 'CRI', 'PAN', 'CUB'];
const inList = (field) => `${JSON.stringify(COUNTRIES)}.indexOf(${field}) > -1`;

mapshaper([shp('land'), '-clip', `bbox=${BBOX}`, '-simplify', 'visvalingam', 'interval=250', 'keep-shapes',
  '-drop', 'fields=*', '-o', `${OUT}/land.geojson`, 'precision=0.0001', 'geojson-type=FeatureCollection']);

mapshaper([shp('lakes'), '-clip', `bbox=${BBOX}`, '-filter', 'scalerank <= 8', '-simplify', 'interval=150',
  '-filter-fields', 'name,scalerank', '-o', `${OUT}/lakes.geojson`, 'precision=0.0001', 'geojson-type=FeatureCollection']);

mapshaper([shp('rivers'), '-clip', `bbox=${BBOX}`, '-filter', "featurecla.indexOf('River') > -1",
  '-filter-fields', 'name,scalerank', '-o', `${CACHE}/rivers-main.geojson`, 'geojson-type=FeatureCollection']);
mapshaper([shp('riversNA'), '-clip', `bbox=${BBOX}`, '-filter-fields', 'name,scalerank',
  '-o', `${CACHE}/rivers-na.geojson`, 'geojson-type=FeatureCollection']);
mapshaper([`${CACHE}/rivers-main.geojson`, `${CACHE}/rivers-na.geojson`, 'combine-files', '-merge-layers', 'force',
  '-simplify', 'interval=150', '-o', `${OUT}/rivers.geojson`, 'precision=0.0001', 'geojson-type=FeatureCollection']);

mapshaper([shp('countries'), '-filter', inList('ADM0_A3'), '-clip', `bbox=${BBOX}`, '-simplify', 'interval=200', 'keep-shapes',
  '-innerlines', '-o', `${OUT}/country-borders.geojson`, 'precision=0.0001', 'geojson-type=FeatureCollection']);

mapshaper([shp('states'), '-filter', inList('adm0_a3'), '-clip', `bbox=${BBOX}`, '-simplify', 'interval=200', 'keep-shapes',
  '-innerlines', '-o', `${OUT}/state-borders.geojson`, 'precision=0.0001', 'geojson-type=FeatureCollection']);

// State and province names, placed inside each state (not at its centroid, which can fall outside a crescent-shaped
// state such as Veracruz). Natural Earth still names Mexico City by its pre-2016 name.
const STATE_NAMES = { 'Distrito Federal': 'Ciudad de México', México: 'Estado de México' };
mapshaper([shp('states'), '-filter', `["MEX","USA","GTM","BLZ"].indexOf(adm0_a3) > -1 && !!name`, '-clip', `bbox=${BBOX}`, '-points', 'inner',
  '-each', `name = (${JSON.stringify(STATE_NAMES)})[name] || name; country = adm0_a3`, '-filter-fields', 'name,country',
  '-o', `${OUT}/state-labels.geojson`, 'precision=0.001', 'geojson-type=FeatureCollection']);

// Modern cities: in Mexico every state capital and every city of 100,000 or more. In the US, the capitals and main
// cities of the states that were once New Spain or Mexico, and of Louisiana; elsewhere, national capitals.
// Natural Earth drops some accents and has a few errors in Mexico, corrected here; each point is checked against
// OpenStreetMap by `npm run check:places -- --cities`.
const US_STATES = ['California', 'Nevada', 'Utah', 'Arizona', 'New Mexico', 'Colorado', 'Texas', 'Louisiana'];
const US_CITIES = ['Los Angeles', 'San Francisco', 'San Diego', 'Phoenix', 'Tucson', 'Albuquerque', 'El Paso',
  'San Antonio', 'Houston', 'Dallas', 'New Orleans', 'Las Vegas'];
const CITY_FIXES = {
  'Ciudad Guzman': 'Ciudad Guzmán', 'Ciudad Obregon': 'Ciudad Obregón', Jaltipan: 'Jáltipan', Juchitan: 'Juchitán',
  Navajoa: 'Navojoa', Nezahualcoyotl: 'Nezahualcóyotl', 'Rio Verde': 'Rioverde', 'San Cristobal de Las Casas': 'San Cristóbal de las Casas',
  Tecoman: 'Tecomán', Tehuacan: 'Tehuacán', Tuxpam: 'Tuxpan',
};
// Natural Earth puts a few large cities several km off their centres; these use OpenStreetMap's city node. (The
// check flags Cancún because Nominatim returns Isla Cancún, the hotel strip; the point is ~2 km from the city's node.)
const CITY_COORDS = {
  'Ciudad Juárez': [-106.4832, 31.739], 'Ciudad Madero': [-97.8373, 22.2474], Oaxaca: [-96.7254, 17.0605],
  Tampico: [-97.8578, 22.2158], Tijuana: [-117.0371, 32.5365], Tucson: [-110.9748, 32.2229],
};
mapshaper([shp('places'), '-filter', inList('ADM0_A3'), '-clip', `bbox=${BBOX}`,
  '-o', `${CACHE}/places-sel.geojson`, 'geojson-type=FeatureCollection']);
const places = JSON.parse(readFileSync(`${CACHE}/places-sel.geojson`, 'utf8')).features;
const cities = places.flatMap(({ properties: p, geometry }) => {
  const capital = p.FEATURECLA.startsWith('Admin-0 capital') ? 2 : p.FEATURECLA.startsWith('Admin-1 capital') ? 1 : 0;
  const mexico = p.ADM0_A3 === 'MEX';
  // "Mazatlán, Sonora" is the village of Mazatán, given a population of 500,000 in error.
  if (mexico && p.NAME === 'Mazatlán' && p.ADM1NAME === 'Sonora') return [];
  const name = CITY_FIXES[p.NAME] ?? p.NAME.replace(/\s+/g, ' ');
  const keep = mexico ? capital > 0 || p.POP_MAX >= 100000
    : p.ADM0_A3 === 'USA' ? US_STATES.includes(p.ADM1NAME) && (capital === 1 || (US_CITIES.includes(name) && p.POP_MAX >= 200000))
    : capital === 2;
  if (!keep) return [];
  // When labels appear: capitals early, the rest by size. Natural Earth's own min_zoom hides even large state
  // capitals such as Toluca until zoom 6.7.
  const minzoom = capital === 2 ? 3 : capital === 1 ? (mexico ? 4 : 5) : p.POP_MAX >= 1e6 ? 4 : p.POP_MAX >= 300000 ? 5.5 : 6.5;
  return [{
    type: 'Feature',
    properties: { name, adm1: p.ADM1NAME, country: p.ADM0NAME, pop: p.POP_MAX, capital, minzoom },
    geometry: { type: 'Point', coordinates: CITY_COORDS[name] ?? geometry.coordinates.map((c) => Math.round(c * 1e4) / 1e4) },
  }];
}).sort((a, b) => b.properties.pop - a.properties.pop);
writeFileSync(`${OUT}/cities.geojson`, `{"type":"FeatureCollection","features":[\n${cities.map((f) => JSON.stringify(f)).join(',\n')}\n]}\n`);
console.log(`${cities.length} cities`);

console.log('reference layers written to', OUT);
