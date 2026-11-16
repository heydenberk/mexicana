// The map for the states and cities quiz: the atlas's base map, with the states to click and colour and the cities to mark.
import maplibregl from 'maplibre-gl';
import type { Feature, FeatureCollection } from 'geojson';
import { FONT_BOLD, PALETTE, REFERENCE_GROUPS, baseStyle } from '../basemap';
import statesUrl from '../../data/reference/mexico-states.geojson?url';
import type { City, LngLat, Places, Target } from './places';

export const STATES_URL = statesUrl;
/** Mexico, with a little sea around it. */
export const MEXICO: [number, number, number, number] = [-118.4, 14.5, -86.7, 32.7];
const GUESS_COLOR = '#8a3b16';
const ANSWER_COLOR = '#2f7a46';

export type StateMark = 'right' | 'wrong' | 'asked' | 'clicked';

export const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
export const isNarrow = () => window.matchMedia('(max-width: 820px)').matches;

export const map = new maplibregl.Map({
  container: 'map',
  style: baseStyle(),
  bounds: MEXICO,
  fitBoundsOptions: { padding: 30 },
  attributionControl: { compact: true },
  dragRotate: false,
  pitchWithRotate: false,
});
map.touchZoomRotate.disableRotation();
if (import.meta.env.DEV) Object.assign(window, { placesMap: map });
map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-left');

const padding = () => (isNarrow() ? 24 : 50);

// ---------------------------------------------------------------- camera
/** The last camera move asked for, repeated instantly when the phone layout resizes the map under it. */
let lastMove: (duration: number) => void = () => {};

function move(fn: (duration: number) => void, duration: number) {
  lastMove = fn;
  fn(duration);
}

export function fit(bbox: [number, number, number, number], duration = 800, maxZoom = 9) {
  move((d) => map.fitBounds(bbox, { padding: padding(), duration: d, maxZoom }), duration);
}

let lastHeight = 0;
new ResizeObserver(() => {
  const height = $('map').clientHeight;
  if (!height || height === lastHeight) return;
  lastHeight = height;
  map.resize();
  lastMove(0);
}).observe($('map'));

/** On a phone the panel grows for reading and shrinks to give the map room when the answer is on the map. */
export function setLayout(mode: 'home' | 'choice' | 'where' | 'results') {
  $('app').dataset.mode = mode;
  map.getCanvas().style.cursor = mode === 'where' ? 'crosshair' : '';
}

// ---------------------------------------------------------------- states
/** Colours left on the states by the answers so far, by state name, and the extra marks of the current question. */
let marks = new Map<string, StateMark>();

export function markState(name: string, mark: StateMark | null) {
  if (mark) marks.set(name, mark);
  else marks.delete(name);
  if (map.getSource('states')) map.setFeatureState({ source: 'states', id: name }, { mark });
}

export function clearMarks(keep: (mark: StateMark) => boolean = () => false) {
  for (const [name, mark] of [...marks]) if (!keep(mark)) markState(name, null);
}

// ---------------------------------------------------------------- clicks and pins
const guessMarker = new maplibregl.Marker({ color: GUESS_COLOR, draggable: true });
const answerMarker = new maplibregl.Marker({ color: ANSWER_COLOR });
let onState: ((name: string) => void) | null = null;
let onPin: ((g: LngLat) => void) | null = null;

/** Reports the state under each click. */
export function takeStateClick(callback: (name: string) => void) {
  onState = callback;
}

/** Lets clicks place a pin (draggable afterwards), reporting each placement. */
export function takePin(callback: (g: LngLat) => void) {
  onPin = callback;
  $('map-hint').hidden = false;
}

export function stopTaking() {
  onState = null;
  onPin = null;
  guessMarker.setDraggable(false);
  $('map-hint').hidden = true;
  map.getCanvas().style.cursor = '';
}

map.on('click', (e) => {
  if (onState) {
    const hit = map.queryRenderedFeatures(e.point, { layers: ['quiz-states'] })[0];
    if (hit) onState(hit.properties.name as string);
    else $('map-hint').hidden = false;
  }
  if (onPin) {
    guessMarker.setLngLat(e.lngLat).setDraggable(true).addTo(map);
    $('map-hint').hidden = true;
    onPin([e.lngLat.lng, e.lngLat.lat]);
  }
});
guessMarker.on('dragend', () => {
  const { lng, lat } = guessMarker.getLngLat();
  onPin?.([lng, lat]);
});

// ---------------------------------------------------------------- labels and marked cities
let places: Places | null = null;
/** What is drawn for the current question, to draw again once the map's layers exist. */
let drawn: { target: Target; labelled: boolean; clicked?: string; guess?: LngLat } = { target: {}, labelled: false };

function setData(source: string, list: Feature[]) {
  (map.getSource(source) as maplibregl.GeoJSONSource | undefined)?.setData({ type: 'FeatureCollection', features: list } as FeatureCollection);
}

function point(at: LngLat, properties: Record<string, unknown>): Feature {
  return { type: 'Feature', properties, geometry: { type: 'Point', coordinates: at } };
}

/**
 * Draws a question's target: the state outlined and the city marked, named only when `labelled` (once answered).
 * `clicked` is a state clicked by mistake, named too; `guess` a pin, joined to the city by a line.
 */
export function drawTarget(target: Target, labelled: boolean, extra: { clicked?: string; guess?: LngLat } = {}) {
  drawn = { target, labelled, ...extra };
  const state = places?.states.find((s) => s.name === target.state);
  const clicked = places?.states.find((s) => s.name === extra.clicked);
  const labels: Feature[] = [];
  if (labelled && state) labels.push(point(state.label, { name: state.name, kind: 'state' }));
  if (clicked) labels.push(point(clicked.label, { name: clicked.name, kind: 'clicked' }));
  setData('quiz-labels', labels);
  setData('quiz-cities', target.city ? [point(target.city.at, { name: labelled ? target.city.name : '', capital: target.city.capital })] : []);
  setData('quiz-line', extra.guess && target.city
    ? [{ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [extra.guess, target.city.at] } }] : []);
  if (map.getLayer('quiz-outline')) map.setFilter('quiz-outline', ['==', ['get', 'name'], target.state ?? '']);
}

export function clearTarget() {
  guessMarker.remove();
  answerMarker.remove();
  drawTarget({}, false);
}

/** Pins the city of a map question, with the guess. */
export function pinAnswer(city: City, guess: LngLat) {
  answerMarker.setLngLat(city.at).addTo(map);
  guessMarker.setLngLat(guess).addTo(map);
  const box: [number, number, number, number] = [Math.min(guess[0], city.at[0]), Math.min(guess[1], city.at[1]), Math.max(guess[0], city.at[0]), Math.max(guess[1], city.at[1])];
  move((d) => map.fitBounds(box, { padding: padding() + 40, maxZoom: Math.max(map.getZoom(), 6.5), duration: d }), 900);
}

/** Frames a state for a question: the whole country, or for a small state a closer view that still shows its neighbours. */
export function frameState(name: string | undefined) {
  const state = places?.states.find((s) => s.name === name);
  if (!state) return fit(MEXICO);
  const [w, s, e, n] = state.bbox;
  if (e - w > 2.5 || n - s > 2.5) return fit(MEXICO);
  const cx = (w + e) / 2;
  const cy = (s + n) / 2;
  fit([cx - 4, cy - 3, cx + 4, cy + 3]);
}

// ---------------------------------------------------------------- layers
const MARK_COLORS = ['match', ['feature-state', 'mark'], 'right', ANSWER_COLOR, 'wrong', '#a8442a', 'asked', GUESS_COLOR, 'clicked', PALETTE.border, '#000'];
const MARK_OPACITY = ['match', ['feature-state', 'mark'], 'right', 0.35, 'wrong', 0.35, 'asked', 0.45, 'clicked', 0.25, 0];

/** Gives the map the states and cities, which it needs to name them. */
export function setPlaces(data: Places) {
  places = data;
  drawTarget(drawn.target, drawn.labelled, drawn);
}

map.on('load', () => {
  // The compact attribution starts open, which on a phone covers much of the map.
  document.querySelector('.maplibregl-ctrl-attrib')?.classList.remove('maplibregl-compact-show');
  // Below the borders, so the dashed state lines stay on top of the colours.
  map.addSource('states', { type: 'geojson', data: STATES_URL, promoteId: 'name' });
  map.addLayer({ id: 'quiz-states', type: 'fill', source: 'states', paint: { 'fill-color': MARK_COLORS as never, 'fill-opacity': MARK_OPACITY as never } }, 'state-borders');
  map.addLayer({
    id: 'quiz-outline',
    type: 'line',
    source: 'states',
    filter: ['==', ['get', 'name'], ''],
    paint: { 'line-color': GUESS_COLOR, 'line-width': 2.5 },
  });
  map.addSource('quiz-line', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
  map.addLayer({ id: 'quiz-line', type: 'line', source: 'quiz-line', paint: { 'line-color': '#2b261f', 'line-width': 2, 'line-dasharray': [2, 2], 'line-opacity': 0.7 } });
  map.addSource('quiz-cities', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
  map.addLayer({
    id: 'quiz-cities',
    type: 'circle',
    source: 'quiz-cities',
    paint: { 'circle-radius': 7, 'circle-color': GUESS_COLOR, 'circle-stroke-color': '#fff', 'circle-stroke-width': 2.5 },
  });
  map.addLayer({
    id: 'quiz-city-labels',
    type: 'symbol',
    source: 'quiz-cities',
    layout: {
      'text-field': ['get', 'name'],
      'text-font': FONT_BOLD,
      'text-size': 15,
      'text-variable-anchor': ['left', 'right', 'top', 'bottom'],
      'text-radial-offset': 0.9,
      'text-allow-overlap': true,
    },
    paint: { 'text-color': '#2b261f', 'text-halo-color': 'rgba(255,253,246,0.95)', 'text-halo-width': 2 },
  });
  map.addSource('quiz-labels', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
  map.addLayer({
    id: 'quiz-labels',
    type: 'symbol',
    source: 'quiz-labels',
    layout: {
      'text-field': ['get', 'name'],
      'text-font': FONT_BOLD,
      'text-size': ['match', ['get', 'kind'], 'clicked', 13, 15],
      'text-transform': 'uppercase',
      'text-letter-spacing': 0.08,
      'text-max-width': 8,
      'text-allow-overlap': true,
    },
    paint: {
      'text-color': ['match', ['get', 'kind'], 'clicked', PALETTE.label, '#2b261f'],
      'text-halo-color': 'rgba(255,253,246,0.95)',
      'text-halo-width': 2,
    },
  });
  for (const [name, mark] of marks) map.setFeatureState({ source: 'states', id: name }, { mark });
  drawTarget(drawn.target, drawn.labelled, drawn);
});

let modernShown = false;

/** The modern state names and cities, shown on the home screen to study from and hidden during a quiz. */
export function showModernLabels(show: boolean) {
  modernShown = show;
  for (const id of REFERENCE_GROUPS.modern) if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', show ? 'visible' : 'none');
}
map.on('load', () => {
  // The whole country fits only at about zoom 4, where the atlas has hardly begun naming states and cities. Here the
  // states are named from the start, ahead of the cities, and every state capital is marked; other cities come in as
  // you zoom, as in the atlas.
  map.setLayerZoomRange('state-labels', 3, 24);
  map.moveLayer('state-labels');
  const shown = ['any', ['>=', ['zoom'], ['get', 'minzoom']], ['all', ['==', ['get', 'country'], 'Mexico'], ['>', ['get', 'capital'], 0]]];
  map.setFilter('cities', shown as never);
  map.setFilter('city-labels', shown as never);
  showModernLabels(modernShown);
});
