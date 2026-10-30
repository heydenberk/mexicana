import type { ExpressionSpecification, LayerSpecification, LineLayerSpecification, Map as MapLibreMap } from 'maplibre-gl';
import { FONT, FONT_BOLD, FONT_ITALIC, PALETTE } from './basemap';
import { BOUNDARY_COLOR, ROUTE_COLOR, SYMBOL_PIXEL_RATIO, symbolImage } from './symbols';
import { FEATURE_TYPES } from './types';

export const HISTORY_SOURCE = 'history';
export const LABEL_SOURCE = 'history-labels';

const isCurrent: ExpressionSpecification = ['==', ['get', 'state'], 'current'];
const byState = (current: number, past: number): ExpressionSpecification => ['case', isCurrent, current, past];
const selected: ExpressionSpecification = ['boolean', ['feature-state', 'selected'], false];

type Expr = ExpressionSpecification;
const isPolygon: Expr = ['in', ['geometry-type'], ['literal', ['Polygon', 'MultiPolygon']]];
const isLine: Expr = ['in', ['geometry-type'], ['literal', ['LineString', 'MultiLineString']]];
const isPoint: Expr = ['==', ['geometry-type'], 'Point'];
const conf = (c: string): Expr => ['==', ['get', 'confidence'], c];

/** Line dash pattern per confidence level: precise solid, approximate dashed, schematic dotted. */
export const DASH: Record<string, number[] | null> = { precise: null, approximate: [4, 2.5], schematic: [0.6, 2.2] };

const territoryColor: ExpressionSpecification = ['coalesce', ['get', 'color'], BOUNDARY_COLOR];
const routeColor: ExpressionSpecification = ['coalesce', ['get', 'color'], ROUTE_COLOR];

/** Polygon outlines, treaty lines and routes are drawn once per confidence level so each can carry its own dash. */
function perConfidence(base: Omit<LineLayerSpecification, 'filter'> & { filter: Expr }): LineLayerSpecification[] {
  return (['precise', 'approximate', 'schematic'] as const).map((c) => ({
    ...base,
    id: `${base.id}-${c}`,
    filter: ['all', base.filter, conf(c)],
    paint: { ...base.paint, ...(DASH[c] ? { 'line-dasharray': DASH[c]! } : {}) },
  }));
}

export function addHistoryLayers(map: MapLibreMap): void {
  for (const type of FEATURE_TYPES) {
    if (!map.hasImage(`sym-${type}`)) map.addImage(`sym-${type}`, symbolImage(type), { pixelRatio: SYMBOL_PIXEL_RATIO });
  }
  map.addSource(HISTORY_SOURCE, { type: 'geojson', data: { type: 'FeatureCollection', features: [] }, promoteId: 'id', lineMetrics: true });
  map.addSource(LABEL_SOURCE, { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });

  const layers: LayerSpecification[] = [
    // --- territories
    {
      id: 'territory-fill',
      type: 'fill',
      source: HISTORY_SOURCE,
      filter: ['all', isPolygon, ['!', ['get', 'water']]],
      paint: {
        'fill-color': territoryColor,
        // Large territories fade as you zoom in so the relief underneath stays readable.
        'fill-opacity': ['interpolate', ['linear'], ['zoom'],
          4, ['case', selected, 0.32, byState(0.16, 0.05)],
          9, ['case', selected, 0.2, byState(0.05, 0.02)]],
      },
    },
    {
      id: 'water-fill',
      type: 'fill',
      source: HISTORY_SOURCE,
      filter: ['all', isPolygon, ['get', 'water']],
      paint: { 'fill-color': PALETTE.water, 'fill-opacity': byState(0.92, 0.5) },
    },
    ...perConfidence({
      id: 'territory-outline',
      type: 'line',
      source: HISTORY_SOURCE,
      filter: isPolygon,
      layout: { 'line-join': 'round' },
      paint: {
        'line-color': ['case', ['get', 'water'], '#6f93a3', territoryColor],
        'line-width': ['case', selected, 3, byState(1.6, 0.8)],
        'line-opacity': byState(0.9, 0.45),
      },
    }),
    // --- treaty lines and other linear boundaries
    ...perConfidence({
      id: 'boundary-line',
      type: 'line',
      source: HISTORY_SOURCE,
      filter: ['all', isLine, ['==', ['get', 'type'], 'boundary']],
      layout: { 'line-join': 'round' },
      paint: {
        'line-color': territoryColor,
        'line-width': ['case', selected, 4, byState(2.4, 1.2)],
        'line-opacity': byState(0.95, 0.5),
      },
    }),
    // --- routes: a pale casing, the line itself, then direction arrows
    {
      id: 'route-casing',
      type: 'line',
      source: HISTORY_SOURCE,
      filter: ['all', isLine, ['!=', ['get', 'type'], 'boundary']],
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#fffaf0', 'line-width': byState(5.5, 3), 'line-opacity': byState(0.55, 0.25) },
    },
    ...perConfidence({
      id: 'route-line',
      type: 'line',
      source: HISTORY_SOURCE,
      filter: ['all', isLine, ['!=', ['get', 'type'], 'boundary']],
      layout: { 'line-join': 'round' },
      paint: {
        'line-color': routeColor,
        'line-width': ['case', selected, 4.5, byState(2.8, 1.4)],
        'line-opacity': byState(0.95, 0.45),
      },
    }),
    {
      // Animated "flow" overlay; only the selected route is shown (see animateFlow).
      id: 'route-flow',
      type: 'line',
      source: HISTORY_SOURCE,
      filter: ['==', ['get', 'id'], ''],
      layout: { 'line-cap': 'round' },
      paint: { 'line-color': '#fffaf0', 'line-width': 2.2, 'line-opacity': 0.9, 'line-dasharray': [0, 4, 3] },
    },
    {
      id: 'route-arrows',
      type: 'symbol',
      source: HISTORY_SOURCE,
      filter: ['all', isLine, ['!=', ['get', 'type'], 'boundary'], ['get', 'directional']],
      layout: {
        'symbol-placement': 'line',
        'symbol-spacing': ['interpolate', ['linear'], ['zoom'], 4, 70, 10, 120],
        'text-field': '▶',
        'text-font': FONT,
        'text-size': ['interpolate', ['linear'], ['zoom'], 4, 9, 10, 13],
        'text-keep-upright': false,
        'text-allow-overlap': true,
        'text-ignore-placement': true,
        'text-rotation-alignment': 'map',
      },
      paint: { 'text-color': routeColor, 'text-halo-color': '#fffaf0', 'text-halo-width': 1, 'text-opacity': byState(1, 0.4) },
    },
    // --- points
    {
      id: 'point-halo',
      type: 'circle',
      source: HISTORY_SOURCE,
      filter: isPoint,
      // feature-state cannot be used in filters, so unselected halos are drawn fully transparent.
      paint: {
        'circle-radius': 17,
        'circle-color': '#fff6c8',
        'circle-opacity': ['case', selected, 0.85, 0],
        'circle-stroke-color': '#c9a227',
        'circle-stroke-width': 2,
        'circle-stroke-opacity': ['case', selected, 1, 0],
      },
    },
    {
      id: 'points',
      type: 'symbol',
      source: HISTORY_SOURCE,
      filter: isPoint,
      layout: {
        'icon-image': ['concat', 'sym-', ['get', 'type']],
        'icon-size': ['interpolate', ['linear'], ['zoom'], 4, ['case', isCurrent, 0.8, 0.55], 9, ['case', isCurrent, 1.1, 0.75]],
        'icon-allow-overlap': true,
        'symbol-sort-key': ['case', isCurrent, 1, 0],
        // Earlier eras' points (cumulative mode) are labelled only once zoomed in, or they bury the current era's.
        'text-field': ['step', ['zoom'], ['case', isCurrent, ['get', 'label'], ''], 7, ['get', 'label']],
        'text-font': FONT_BOLD,
        'text-size': ['interpolate', ['linear'], ['zoom'], 4, 10.5, 9, 13],
        'text-offset': [0, 1.15],
        'text-anchor': 'top',
        'text-max-width': 9,
        'text-optional': true,
      },
      paint: {
        'icon-opacity': byState(1, 0.5),
        'text-color': ['case', isCurrent, '#2b261f', '#7a7266'],
        'text-halo-color': 'rgba(255,250,240,0.92)',
        'text-halo-width': 1.4,
        'text-opacity': byState(1, 0.75),
      },
    },
    // --- labels for territories and routes
    {
      id: 'territory-labels',
      type: 'symbol',
      source: LABEL_SOURCE,
      filter: isCurrent,
      layout: {
        'text-field': ['get', 'label'],
        'text-font': FONT_ITALIC,
        'text-size': ['interpolate', ['linear'], ['zoom'], 4, 11, 9, 15],
        'text-letter-spacing': 0.06,
        'text-max-width': 8,
        'symbol-sort-key': 2,
      },
      paint: {
        'text-color': ['case', ['get', 'water'], PALETTE.waterLabel, ['coalesce', ['get', 'color'], BOUNDARY_COLOR]],
        'text-halo-color': 'rgba(255,250,240,0.85)',
        'text-halo-width': 1.5,
      },
    },
    {
      id: 'line-labels',
      type: 'symbol',
      source: HISTORY_SOURCE,
      filter: ['all', isLine, isCurrent],
      layout: {
        'symbol-placement': 'line',
        'text-field': ['get', 'label'],
        'text-font': FONT_ITALIC,
        'text-size': 11.5,
        'text-offset': [0, -0.9],
        'symbol-spacing': 350,
        'text-max-angle': 35,
      },
      paint: {
        'text-color': ['case', ['==', ['get', 'type'], 'boundary'], territoryColor, routeColor],
        'text-halo-color': 'rgba(255,250,240,0.9)',
        'text-halo-width': 1.4,
      },
    },
  ];
  for (const layer of layers) map.addLayer(layer);
}

/** Every layer drawn from the history sources, for showing or hiding the history as a whole. */
export function historyLayerIds(map: MapLibreMap): string[] {
  return map.getStyle().layers
    .filter((l) => 'source' in l && (l.source === HISTORY_SOURCE || l.source === LABEL_SOURCE))
    .map((l) => l.id);
}

export const INTERACTIVE_LAYERS = [
  'points',
  ...['precise', 'approximate', 'schematic'].map((c) => `route-line-${c}`),
  ...['precise', 'approximate', 'schematic'].map((c) => `boundary-line-${c}`),
  'territory-fill',
  'water-fill',
];

/** Priority when several features overlap a click: points, then lines, then areas. */
export function clickPriority(layerId: string): number {
  if (layerId === 'points') return 0;
  if (layerId.startsWith('route-line') || layerId.startsWith('boundary-line')) return 1;
  return 2;
}

// Classic "ant line" animation: step through dash offsets by changing the dasharray.
const FLOW_STEPS: number[][] = [
  [0, 4, 3], [0.5, 4, 2.5], [1, 4, 2], [1.5, 4, 1.5], [2, 4, 1], [2.5, 4, 0.5], [3, 4, 0],
  [0, 0.5, 3, 3.5], [0, 1, 3, 3], [0, 1.5, 3, 2.5], [0, 2, 3, 2], [0, 2.5, 3, 1.5], [0, 3, 3, 1], [0, 3.5, 3, 0.5],
];

export function animateFlow(map: MapLibreMap): () => void {
  let step = 0;
  let last = 0;
  let raf = 0;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tick = (t: number) => {
    if (t - last > 70) {
      last = t;
      step = (step + 1) % FLOW_STEPS.length;
      if (map.getLayer('route-flow')) map.setPaintProperty('route-flow', 'line-dasharray', FLOW_STEPS[step]);
    }
    raf = requestAnimationFrame(tick);
  };
  if (!reduced) raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}
