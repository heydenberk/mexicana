// The map beside the quiz and the flashcards: it frames each era, takes map guesses and shows answers in the atlas's style.
import maplibregl from 'maplibre-gl';
import type { Feature, FeatureCollection } from 'geojson';
import { LAND_URL, baseStyle } from '../basemap';
import { indexLand, loadEraCollections, prepareFeatures, toDisplayFeature, toLabelFeature, type BBox, type PreparedFeature } from '../data';
import { HISTORY_SOURCE, LABEL_SOURCE, addHistoryLayers, animateFlow } from '../history-layers';

export type LngLat = [number, number];

/** Mexico with its old northern frontier and Central America: the view behind the list of eras. */
export const OVERVIEW: BBox = [-118, 14, -86, 33];
const GUESS_COLOR = '#8a3b16';
const ANSWER_COLOR = '#2f7a46';
const LINE_SOURCE = 'quiz-line';

export const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
export const isNarrow = () => window.matchMedia('(max-width: 820px)').matches;

const collections = loadEraCollections();
/** Features by id, drawn unclipped until the coastline has loaded (only a revealed territory would show the difference). */
let features = indexById(prepareFeatures(collections, null));

function indexById(list: PreparedFeature[]) {
  return new Map(list.map((p) => [p.feature.properties.id, p]));
}

export function feature(id: string | undefined): PreparedFeature | undefined {
  return id === undefined ? undefined : features.get(id);
}

export function pointOf(p: PreparedFeature | undefined): LngLat | null {
  return p?.feature.geometry.type === 'Point' ? (p.feature.geometry.coordinates as LngLat) : null;
}

export const map = new maplibregl.Map({
  container: 'map',
  style: baseStyle(),
  bounds: OVERVIEW,
  fitBoundsOptions: { padding: 30 },
  attributionControl: { compact: true },
  dragRotate: false,
  pitchWithRotate: false,
});
map.touchZoomRotate.disableRotation();
// Handy for poking at the map from the browser console during development.
if (import.meta.env.DEV) Object.assign(window, { quizMap: map });
map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-left');

const padding = () => (isNarrow() ? 30 : 60);

// ---------------------------------------------------------------- camera
/** The last camera move a screen asked for, repeated instantly when the phone layout resizes the map under it. */
let lastMove: (duration: number) => void = () => {};

function move(fn: (duration: number) => void, duration: number) {
  lastMove = fn;
  fn(duration);
}

export function fit(bbox: BBox, duration = 900) {
  move((d) => map.fitBounds(bbox, { padding: padding(), duration: d }), duration);
}

// MapLibre's own resize tracking misses the sheet's height animation, so watch the map's box directly.
let lastHeight = 0;
new ResizeObserver(() => {
  const height = $('map').clientHeight;
  if (!height || height === lastHeight) return;
  lastHeight = height;
  map.resize();
  lastMove(0);
}).observe($('map'));

/** On a phone the sheet grows for reading and shrinks to give the map room for a map question. */
export function setLayout(mode: 'home' | 'choice' | 'where' | 'results' | 'study') {
  $('app').dataset.mode = mode;
  map.getCanvas().style.cursor = mode === 'where' ? 'crosshair' : '';
}

// ---------------------------------------------------------------- guesses and answers
const guessMarker = new maplibregl.Marker({ color: GUESS_COLOR, draggable: true });
const answerMarker = new maplibregl.Marker({ color: ANSWER_COLOR });
let onGuess: ((g: LngLat) => void) | null = null;

/** Lets clicks on the map place a pin (draggable afterwards), reporting each placement. */
export function takeGuess(callback: (g: LngLat) => void) {
  onGuess = callback;
  $('map-hint').hidden = false;
}

export function stopGuessing() {
  onGuess = null;
  guessMarker.setDraggable(false);
  $('map-hint').hidden = true;
  map.getCanvas().style.cursor = '';
}

map.on('click', (e) => {
  if (!onGuess) return;
  guessMarker.setLngLat(e.lngLat).setDraggable(true).addTo(map);
  $('map-hint').hidden = true;
  onGuess([e.lngLat.lng, e.lngLat.lat]);
});
guessMarker.on('dragend', () => {
  const { lng, lat } = guessMarker.getLngLat();
  onGuess?.([lng, lat]);
});

function setData(source: string, list: Feature[]) {
  (map.getSource(source) as maplibregl.GeoJSONSource | undefined)?.setData({ type: 'FeatureCollection', features: list } as FeatureCollection);
}

interface ShowOptions {
  /** A map guess, drawn with a line to the answer. */
  guess?: LngLat;
  /** Marks a point answer with a pin even without a guess (a map card's answer). */
  pin?: boolean;
  animate?: boolean;
}

/** What is shown, so it can be drawn again once the map's layers exist. */
let shown: { id: string; options: ShowOptions } | null = null;

/** Clears the guess, the answer and any revealed feature. */
export function clearMap() {
  shown = null;
  onGuess = null;
  guessMarker.remove();
  answerMarker.remove();
  $('map-hint').hidden = true;
  setData(LINE_SOURCE, []);
  setData(HISTORY_SOURCE, []);
  setData(LABEL_SOURCE, []);
}

/** Shows an answer on the map: the feature in the atlas style, and with a guess, both pins and the line between them. */
export function showFeature(id: string, options: ShowOptions = {}) {
  const p = features.get(id);
  if (!p) return;
  shown = { id, options };
  const { guess, pin, animate = true } = options;
  setData(HISTORY_SOURCE, [toDisplayFeature(p, 'current')]);
  const label = toLabelFeature(p, 'current');
  setData(LABEL_SOURCE, label ? [label] : []);
  if (map.getLayer('route-flow')) map.setFilter('route-flow', ['==', ['get', 'id'], p.feature.properties.type === 'route' ? id : '']);
  const target = pointOf(p);
  if (target && (guess || pin)) answerMarker.setLngLat(target).addTo(map);
  const duration = animate ? 1000 : 0;
  if (guess && target) {
    guessMarker.setLngLat(guess).addTo(map);
    setData(LINE_SOURCE, [{ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [guess, target] } }]);
    const box: BBox = [Math.min(guess[0], target[0]), Math.min(guess[1], target[1]), Math.max(guess[0], target[0]), Math.max(guess[1], target[1])];
    move((d) => map.fitBounds(box, { padding: padding() + 30, maxZoom: 8, duration: d }), duration);
  } else if (target) {
    const zoom = Math.max(map.getZoom(), 5.5);
    move((d) => map.flyTo({ center: target, zoom, duration: d }), duration);
  } else {
    move((d) => map.fitBounds(p.bbox, { padding: padding(), maxZoom: 8, duration: d }), duration);
  }
}

map.on('load', async () => {
  // The compact attribution starts open, which on a phone covers much of the map.
  document.querySelector('.maplibregl-ctrl-attrib')?.classList.remove('maplibregl-compact-show');
  addHistoryLayers(map);
  animateFlow(map);
  map.addSource(LINE_SOURCE, { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
  map.addLayer({
    id: LINE_SOURCE,
    type: 'line',
    source: LINE_SOURCE,
    paint: { 'line-color': '#2b261f', 'line-width': 2, 'line-dasharray': [2, 2], 'line-opacity': 0.7 },
  });
  // An answer may already have been shown while the map was loading.
  if (shown) showFeature(shown.id, { ...shown.options, animate: false });
  try {
    const land = indexLand(await (await fetch(LAND_URL)).json());
    features = indexById(prepareFeatures(collections, land));
  } catch (err) {
    console.warn('Could not load the coastline; territories are drawn unclipped', err);
  }
});
