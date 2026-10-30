import type { StyleSpecification } from 'maplibre-gl';
import landUrl from '../data/reference/land.geojson?url';
import lakesUrl from '../data/reference/lakes.geojson?url';
import riversUrl from '../data/reference/rivers.geojson?url';
import countryBordersUrl from '../data/reference/country-borders.geojson?url';
import stateBordersUrl from '../data/reference/state-borders.geojson?url';
import physiographyUrl from '../data/reference/physiography.geojson?url';
import stateLabelsUrl from '../data/reference/state-labels.geojson?url';
import citiesUrl from '../data/reference/cities.geojson?url';

export const LAND_URL = landUrl;

const TERRARIUM = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png';
const TERRAIN_ATTRIBUTION =
  'Elevation: <a href="https://registry.opendata.aws/terrain-tiles/" target="_blank" rel="noopener">Terrain Tiles</a> (Mapzen/Tilezen on AWS Open Data; SRTM, GMTED2010, ETOPO1 and others)';

export const PALETTE = {
  sea: '#c5d3d8',
  land: '#efe8d8',
  water: '#a9c1cb',
  river: '#7fa1b3',
  border: '#6f6557',
  label: '#5a5145',
  waterLabel: '#4f6f7f',
  /** Modern states and cities: a cool slate, so they read as today's map rather than as history. */
  modern: '#4c5866',
};

/** Rivers worth naming on the map (Natural Earth names). */
const NAMED_RIVERS = ['Rio Grande', 'Lerma', 'Balsas', 'Grijalva', 'Usumacinta', 'Pánuco', 'Papaloapan', 'Gila',
  'Colorado', 'Nueces', 'Sabine', 'Red', 'Arkansas', 'Río Grande de Santiago', 'Conchos', 'Yaqui', 'Fuerte', 'Pecos',
  'Brazos', 'Nazas', 'Mayo', 'Sacramento', 'San Joaquin'];

export const FONT = ['Noto Sans Regular'];
export const FONT_ITALIC = ['Noto Sans Italic'];
export const FONT_BOLD = ['Noto Sans Bold'];

/** Layer ids grouped so the UI can toggle them together. */
export const REFERENCE_GROUPS = {
  borders: ['state-borders', 'country-borders', 'country-labels'],
  hydro: ['rivers', 'river-labels', 'lakes'],
  relief: ['hypsometric', 'hillshade'],
  physiography: ['physiography-labels', 'water-labels'],
  modern: ['state-labels', 'cities', 'city-labels'],
};

export function baseStyle(): StyleSpecification {
  return {
    version: 8,
    glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
    sources: {
      dem: {
        type: 'raster-dem',
        tiles: [TERRARIUM],
        encoding: 'terrarium',
        tileSize: 256,
        maxzoom: 12,
        attribution: TERRAIN_ATTRIBUTION,
      },
      'dem-terrain': {
        type: 'raster-dem',
        tiles: [TERRARIUM],
        encoding: 'terrarium',
        tileSize: 256,
        maxzoom: 12,
      },
      land: { type: 'geojson', data: landUrl, attribution: 'Reference layers: <a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener">Natural Earth</a>' },
      lakes: { type: 'geojson', data: lakesUrl },
      rivers: { type: 'geojson', data: riversUrl },
      'country-borders': { type: 'geojson', data: countryBordersUrl },
      'state-borders': { type: 'geojson', data: stateBordersUrl },
      physiography: { type: 'geojson', data: physiographyUrl },
      'state-labels': { type: 'geojson', data: stateLabelsUrl },
      cities: { type: 'geojson', data: citiesUrl },
    },
    layers: [
      { id: 'sea', type: 'background', paint: { 'background-color': PALETTE.sea } },
      { id: 'land', type: 'fill', source: 'land', paint: { 'fill-color': PALETTE.land } },
      {
        // A muted hypsometric tint so the Altiplano, the Sierras and the coastal lowlands read at a glance.
        id: 'hypsometric',
        type: 'color-relief',
        source: 'dem',
        paint: {
          'color-relief-opacity': 0.55,
          'color-relief-color': [
            'interpolate', ['linear'], ['elevation'],
            -1, 'rgba(0,0,0,0)',
            0, 'rgba(0,0,0,0)',
            1, '#e3e6cf',
            300, '#e8e6cb',
            1000, '#ece0c0',
            1800, '#e6d3ae',
            2600, '#d8c09c',
            3500, '#cbb497',
            4500, '#f2efe9',
          ],
        },
      },
      {
        id: 'hillshade',
        type: 'hillshade',
        source: 'dem',
        paint: {
          'hillshade-exaggeration': ['interpolate', ['linear'], ['zoom'], 3, 0.55, 8, 0.4, 12, 0.3],
          'hillshade-shadow-color': '#5e4f3c',
          'hillshade-highlight-color': '#fffdf6',
          'hillshade-accent-color': '#8a7a62',
          'hillshade-illumination-direction': 315,
        },
      },
      { id: 'lakes', type: 'fill', source: 'lakes', paint: { 'fill-color': PALETTE.water, 'fill-opacity': 0.9 } },
      {
        id: 'rivers',
        type: 'line',
        source: 'rivers',
        paint: {
          'line-color': PALETTE.river,
          'line-opacity': 0.85,
          'line-width': ['interpolate', ['linear'], ['zoom'],
            3, ['case', ['<=', ['coalesce', ['get', 'scalerank'], 9], 4], 0.9, 0.3],
            8, ['case', ['<=', ['coalesce', ['get', 'scalerank'], 9], 4], 2.2, 1]],
        },
        filter: ['any', ['<=', ['coalesce', ['get', 'scalerank'], 9], 6], ['>=', ['zoom'], 6]],
      },
      {
        id: 'state-borders',
        type: 'line',
        source: 'state-borders',
        paint: {
          'line-color': PALETTE.border,
          'line-opacity': 0.55,
          'line-width': ['interpolate', ['linear'], ['zoom'], 4, 1, 9, 1.8],
          'line-dasharray': [4, 2],
        },
      },
      {
        id: 'country-borders',
        type: 'line',
        source: 'country-borders',
        paint: { 'line-color': PALETTE.border, 'line-opacity': 0.5, 'line-width': 1.1 },
      },
      {
        id: 'river-labels',
        type: 'symbol',
        source: 'rivers',
        minzoom: 5.5,
        filter: ['in', ['get', 'name'], ['literal', NAMED_RIVERS]],
        layout: {
          'symbol-placement': 'line',
          'text-field': ['get', 'name'],
          'text-font': FONT_ITALIC,
          'text-size': 11,
          'symbol-spacing': 400,
          'text-max-angle': 30,
        },
        paint: { 'text-color': PALETTE.waterLabel, 'text-halo-color': 'rgba(255,255,255,0.7)', 'text-halo-width': 1.2 },
      },
      {
        id: 'physiography-labels',
        type: 'symbol',
        source: 'physiography',
        filter: ['all', ['in', ['get', 'kind'], ['literal', ['range', 'plateau', 'region']]], ['>=', ['zoom'], ['get', 'minzoom']]],
        layout: {
          'text-field': ['get', 'name'],
          'text-font': FONT_ITALIC,
          'text-size': ['interpolate', ['linear'], ['zoom'], 4, 11, 8, 14],
          'text-letter-spacing': 0.12,
          'text-rotate': ['get', 'rotate'],
          'text-rotation-alignment': 'map',
          'text-max-width': 12,
          'text-allow-overlap': false,
        },
        paint: { 'text-color': PALETTE.label, 'text-opacity': 0.7, 'text-halo-color': 'rgba(255,253,246,0.6)', 'text-halo-width': 1 },
      },
      {
        id: 'water-labels',
        type: 'symbol',
        source: 'physiography',
        filter: ['all', ['==', ['get', 'kind'], 'water'], ['>=', ['zoom'], ['get', 'minzoom']]],
        layout: {
          'text-field': ['get', 'name'],
          'text-font': FONT_ITALIC,
          'text-size': ['interpolate', ['linear'], ['zoom'], 3, 11, 7, 15],
          'text-letter-spacing': 0.2,
          'text-rotate': ['get', 'rotate'],
          'text-rotation-alignment': 'map',
          'text-max-width': 8,
        },
        paint: { 'text-color': PALETTE.waterLabel, 'text-opacity': 0.8 },
      },
      {
        id: 'country-labels',
        type: 'symbol',
        source: 'physiography',
        maxzoom: 7,
        filter: ['all', ['==', ['get', 'kind'], 'country'], ['>=', ['zoom'], ['get', 'minzoom']]],
        layout: {
          'text-field': ['get', 'name'],
          'text-font': FONT,
          'text-size': 10,
          'text-letter-spacing': 0.35,
        },
        paint: { 'text-color': PALETTE.border, 'text-opacity': 0.45 },
      },
      // Modern states and cities, off until "Modern states & cities" is ticked. They sit below the history layers,
      // whose labels therefore win any collision.
      {
        id: 'state-labels',
        type: 'symbol',
        source: 'state-labels',
        minzoom: 4,
        layout: {
          visibility: 'none',
          'text-field': ['get', 'name'],
          'text-font': FONT,
          'text-transform': 'uppercase',
          'text-size': ['interpolate', ['linear'], ['zoom'], 4, 9, 8, 12],
          'text-letter-spacing': 0.12,
          'text-max-width': 7,
          'symbol-sort-key': ['case', ['==', ['get', 'country'], 'MEX'], 0, 1],
        },
        paint: {
          'text-color': PALETTE.modern,
          'text-opacity': ['case', ['==', ['get', 'country'], 'MEX'], 0.75, 0.5],
          'text-halo-color': 'rgba(255,253,246,0.7)',
          'text-halo-width': 1,
        },
      },
      {
        id: 'cities',
        type: 'circle',
        source: 'cities',
        filter: ['>=', ['zoom'], ['get', 'minzoom']],
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'],
            4, ['match', ['get', 'capital'], 2, 4, 1, 3, 2.4],
            9, ['match', ['get', 'capital'], 2, 5, 1, 4, 3.4]],
          'circle-color': ['match', ['get', 'capital'], 0, '#ffffff', PALETTE.modern],
          'circle-stroke-color': ['match', ['get', 'capital'], 0, PALETTE.modern, '#ffffff'],
          'circle-stroke-width': ['match', ['get', 'capital'], 0, 1.2, 1.5],
        },
      },
      {
        id: 'city-labels',
        type: 'symbol',
        source: 'cities',
        filter: ['>=', ['zoom'], ['get', 'minzoom']],
        layout: {
          visibility: 'none',
          'text-field': ['get', 'name'],
          'text-font': FONT,
          'text-size': ['interpolate', ['linear'], ['zoom'], 4, ['match', ['get', 'capital'], 0, 9.5, 10.5], 9, ['match', ['get', 'capital'], 0, 12, 13]],
          'text-variable-anchor': ['left', 'right', 'top', 'bottom'],
          'text-radial-offset': 0.6,
          'text-justify': 'auto',
          'text-max-width': 8,
          // Capitals first, then by population.
          'symbol-sort-key': ['-', 0, ['+', ['get', 'pop'], ['*', ['get', 'capital'], 1e8]]],
        },
        paint: { 'text-color': PALETTE.modern, 'text-halo-color': 'rgba(255,253,246,0.85)', 'text-halo-width': 1.2 },
      },
    ],
  };
}
