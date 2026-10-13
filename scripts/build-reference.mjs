// Builds the faint modern reference layers in data/reference/ from Natural Earth 10m data.
// Usage: npm run build:reference   (downloads into .cache/naturalearth on first run)
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
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

console.log('reference layers written to', OUT);
