import 'maplibre-gl/dist/maplibre-gl.css';
import './styles.css';
import maplibregl, { type MapGeoJSONFeature, type MapMouseEvent } from 'maplibre-gl';
import type { Feature, FeatureCollection } from 'geojson';
import { LAND_URL, REFERENCE_GROUPS, baseStyle } from './basemap';
import { aboutHtml, detailsHtml, legendHtml } from './content';
import { ERAS, indexLand, loadEraCollections, prepareFeatures, toDisplayFeature, toLabelFeature, type PreparedFeature } from './data';
import { formatSpan, sortKey } from './dates';
import { HISTORY_SOURCE, INTERACTIVE_LAYERS, LABEL_SOURCE, addHistoryLayers, animateFlow, clickPriority } from './history-layers';
import { esc } from './html';
import { symbolDataUrl } from './symbols';

type Mode = 'era' | 'cumulative';

/** The general history this atlas accompanies; eras.json's `reading` fields refer to its chapters. */
const BOOK_TITLE = 'Gillingham, <cite>Mexico: A 500-Year History</cite>';

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

const state = {
  eraIndex: 0,
  mode: 'era' as Mode,
  selectedId: null as string | null,
  prepared: [] as PreparedFeature[],
};

// ---------------------------------------------------------------- URL state (#era=conquest&mode=cumulative&f=id)
function readHash() {
  const params = new URLSearchParams(location.hash.slice(1));
  const era = ERAS.findIndex((e) => e.id === params.get('era'));
  if (era >= 0) state.eraIndex = era;
  if (params.get('mode') === 'cumulative') state.mode = 'cumulative';
  return params.get('f');
}
function writeHash() {
  const params = new URLSearchParams({ era: ERAS[state.eraIndex].id });
  if (state.mode === 'cumulative') params.set('mode', 'cumulative');
  if (state.selectedId) params.set('f', state.selectedId);
  history.replaceState(null, '', `#${params}`);
}

const initialFeature = readHash();
const firstEra = ERAS[state.eraIndex];

const map = new maplibregl.Map({
  container: 'map',
  style: baseStyle(),
  bounds: firstEra.bbox,
  fitBoundsOptions: { padding: { top: 70, left: 40, right: 60, bottom: 130 } },
  attributionControl: { compact: true },
  maxPitch: 75,
  dragRotate: true,
});
// Handy for poking at the map from the browser console during development.
if (import.meta.env.DEV) Object.assign(window, { atlasMap: map });
// Bottom left, clear of the details card, which docks at the right.
map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-left');
map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

const details = $('details');
/** Under 820px the panel is a bottom sheet and the details card replaces it rather than floating over the map. */
const isNarrow = () => window.matchMedia('(max-width: 820px)').matches;

// ---------------------------------------------------------------- rendering
function visible(p: PreparedFeature): 'current' | 'past' | null {
  if (p.eraIndex === state.eraIndex) return 'current';
  if (state.mode === 'cumulative' && p.eraIndex < state.eraIndex) return 'past';
  return null;
}

function render() {
  const features: Feature[] = [];
  const labels: Feature[] = [];
  // Past eras first so current features draw on top within each layer.
  const ordered = [...state.prepared].sort((a, b) => a.eraIndex - b.eraIndex);
  for (const p of ordered) {
    const v = visible(p);
    if (!v) continue;
    features.push(toDisplayFeature(p, v));
    const label = toLabelFeature(p, v);
    if (label) labels.push(label);
  }
  (map.getSource(HISTORY_SOURCE) as maplibregl.GeoJSONSource | undefined)?.setData({ type: 'FeatureCollection', features } as FeatureCollection);
  (map.getSource(LABEL_SOURCE) as maplibregl.GeoJSONSource | undefined)?.setData({ type: 'FeatureCollection', features: labels } as FeatureCollection);
}

function byId(id: string) {
  return state.prepared.find((p) => p.feature.properties.id === id);
}

/** The selected era's features in chronological order: the order of the list and of stepping. */
function eraFeatures(): PreparedFeature[] {
  return state.prepared
    .filter((p) => p.eraIndex === state.eraIndex)
    .sort((a, b) => sortKey(a.feature.properties) - sortKey(b.feature.properties));
}

/** Moves the selection to the previous/next event of the era, wrapping to the start when nothing is selected. */
function step(delta: 1 | -1) {
  const list = eraFeatures();
  if (!list.length) return;
  const i = list.findIndex((p) => p.feature.properties.id === state.selectedId);
  const next = i < 0 ? (delta > 0 ? 0 : list.length - 1) : i + delta;
  if (next < 0 || next >= list.length) return;
  select(list[next].feature.properties.id, { fly: true });
}

function renderStepper() {
  const list = eraFeatures();
  const i = list.findIndex((p) => p.feature.properties.id === state.selectedId);
  const prev = $<HTMLButtonElement>('step-prev');
  const next = $<HTMLButtonElement>('step-next');
  prev.disabled = !list.length || i === 0;
  next.disabled = !list.length || i === list.length - 1;
  const label = $('step-label');
  if (!list.length) label.innerHTML = '<span class="muted">No events mapped for this era yet</span>';
  else if (i < 0) label.innerHTML = `<span class="muted">Step through ${list.length} events in date order</span>`;
  else {
    const f = list[i].feature.properties;
    label.innerHTML = `<span class="step-count">${i + 1} / ${list.length}</span><span class="step-title">${esc(f.title)}</span><span class="step-date">${esc(formatSpan(f))}</span>`;
  }
}

// ---------------------------------------------------------------- selection and the details card
/**
 * Selects a feature and shows it in the details card. `fly` frames the feature in the part of the map the card and
 * the other overlays leave clear; otherwise the map only moves if `lngLat` (where it was clicked) ends up under the card.
 */
function select(id: string | null, opts: { fly?: boolean; lngLat?: maplibregl.LngLatLike; others?: string[] } = {}) {
  if (state.selectedId && map.getSource(HISTORY_SOURCE)) {
    map.setFeatureState({ source: HISTORY_SOURCE, id: state.selectedId }, { selected: false });
  }
  state.selectedId = id;
  document.querySelectorAll('.feature-list button[aria-current]').forEach((b) => b.removeAttribute('aria-current'));
  writeHash();
  renderStepper();
  if (!id) {
    map.setFilter('route-flow', ['==', ['get', 'id'], '']);
    details.hidden = true;
    return;
  }
  const p = byId(id);
  if (!p) return;
  map.setFeatureState({ source: HISTORY_SOURCE, id }, { selected: true });
  const isRoute = p.feature.properties.type === 'route' && p.feature.geometry.type !== 'Point';
  map.setFilter('route-flow', ['==', ['get', 'id'], isRoute ? id : '']);
  const listItem = document.querySelector(`.feature-list button[data-feature="${CSS.escape(id)}"]`);
  listItem?.setAttribute('aria-current', 'true');
  listItem?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });

  const others = (opts.others ?? []).filter((o) => o !== id).map((o) => ({ id: o, title: byId(o)?.feature.properties.title ?? o }));
  const body = $('details-body');
  body.innerHTML = detailsHtml(p.feature.properties, ERAS[p.eraIndex].title, others);
  body.querySelectorAll<HTMLButtonElement>('button[data-feature]').forEach((b) =>
    b.addEventListener('click', () => select(b.dataset.feature!, { lngLat: opts.lngLat, others: opts.others })));
  details.hidden = false;
  details.scrollTop = 0;

  // On a narrow screen the card covers the sheet, so size the sheet underneath to match it.
  matchSheetToCard();
  if (opts.fly) frame(p);
  else if (opts.lngLat) reveal(opts.lngLat);
}

/**
 * Narrow screens: opens the bottom sheet under a full card, or collapses it under a shrunk one, so the map's size
 * matches what the card leaves visible. The sheet does not animate while covered (see styles.css), so the map can be
 * resized and framed straight away.
 */
function matchSheetToCard() {
  if (isNarrow() && setPanelOpen(!details.classList.contains('collapsed'))) map.resize();
}

/** The edges of the map hidden by the layer controls, the timeline and the details card, in pixels. */
function clearInsets() {
  const box = $('map').getBoundingClientRect();
  const insets = {
    top: controlsBottom() - box.top + 12,
    bottom: box.bottom - $('timeline').getBoundingClientRect().top + 12,
    left: 40,
    right: 40,
    width: box.width,
    height: box.height,
  };
  // On wide screens the card docks down the right side of the map (on narrow ones it sits over the sheet instead).
  if (!details.hidden && !isNarrow()) insets.right = box.right - details.getBoundingClientRect().left + 16;
  return insets;
}

/** Bottom of the layer toggles and legend button (not of an open legend, which the user can close). */
function controlsBottom() {
  return Math.max($('map-controls').querySelector('.toggles')!.getBoundingClientRect().bottom, $('legend-toggle').getBoundingClientRect().bottom);
}

/** Pixel offset from the map's centre to the centre of its clear area. */
function clearCentreOffset(c = clearInsets()): [number, number] {
  return [(c.left - c.right) / 2, (c.top - c.bottom) / 2];
}

/** Flies to a feature so that it sits in the clear area. */
function frame(p: PreparedFeature) {
  const c = clearInsets();
  if (p.feature.geometry.type === 'Point') {
    // An offset, not `padding`: flyTo's padding persists on the map and would squeeze later fits.
    map.flyTo({ center: p.feature.geometry.coordinates as [number, number], zoom: Math.max(map.getZoom(), 8.5), offset: clearCentreOffset(c) });
    return;
  }
  // If the clear area is too small to fit into (a short landscape screen), ignore the card rather than not moving.
  const roomy = c.width - c.left - c.right > 160 && c.height - c.top - c.bottom > 120;
  const padding = roomy ? { top: c.top, bottom: c.bottom, left: c.left, right: c.right } : 20;
  map.fitBounds(p.bbox as [number, number, number, number], { padding, maxZoom: 9.5 });
}

/** Pans just enough to bring a point out from under the details card, if it is under it. */
function reveal(lngLat: maplibregl.LngLatLike) {
  const c = clearInsets();
  const { x, y } = map.project(lngLat);
  if (x > c.width - c.right || y < c.top) map.easeTo({ center: lngLat, offset: clearCentreOffset(c), duration: 600 });
}

/** Keeps MapLibre's corner controls clear of the timeline, and fits the docked details card between the layer controls and whatever is below it. */
function layoutOverlays() {
  const wrap = $('map-wrap');
  const box = $('map').getBoundingClientRect();
  const timeline = $('timeline').getBoundingClientRect();
  const underTimeline = timeline.left < box.left + 140 || timeline.right > box.right - 140;
  wrap.style.setProperty('--ctrl-bottom', underTimeline ? `${box.bottom - timeline.top + 8}px` : '0px');
  if (isNarrow()) return;

  // Start the card below the layer toggles if they reach across into its column.
  const cardLeft = box.right - 12 - Math.min(360, box.width * 0.45);
  const togglesRight = $('map-controls').querySelector('.toggles')!.getBoundingClientRect().right;
  const top = togglesRight > cardLeft - 8 ? controlsBottom() - box.top + 8 : 12;
  const attribution = document.querySelector('.maplibregl-ctrl-bottom-right')?.getBoundingClientRect();
  const bottom = Math.min(timeline.top, attribution?.height ? attribution.top : Infinity) - box.top - 12;
  wrap.style.setProperty('--details-top', `${top}px`);
  wrap.style.setProperty('--details-max-h', `${Math.max(140, bottom - top)}px`);
}

/** Padding that keeps fitted content clear of the floating controls and the timeline. */
function panelPadding(base = 40) {
  const timeline = $('timeline').getBoundingClientRect().height + 30;
  const controls = controlsBottom() - $('map').getBoundingClientRect().top;
  return { top: Math.max(base, controls + 16), left: base, right: base + 20, bottom: base + timeline };
}

function onMapClick(e: MapMouseEvent) {
  const pad = 6;
  const hits = map.queryRenderedFeatures(
    [[e.point.x - pad, e.point.y - pad], [e.point.x + pad, e.point.y + pad]],
    { layers: INTERACTIVE_LAYERS.filter((l) => map.getLayer(l)) },
  ) as MapGeoJSONFeature[];
  if (!hits.length) {
    select(null);
    return;
  }
  const ranked = hits
    .map((h) => ({ id: String(h.properties.id), current: h.properties.state === 'current', rank: clickPriority(h.layer.id) }))
    .sort((a, b) => Number(b.current) - Number(a.current) || a.rank - b.rank);
  const ids = [...new Set(ranked.map((r) => r.id))];
  select(ids[0], { lngLat: e.lngLat, others: ids });
}

// ---------------------------------------------------------------- panel
function renderEraList() {
  const list = $('era-list');
  list.innerHTML = ERAS.map((era, i) => `
    <li>
      <button data-era="${i}" ${i === state.eraIndex ? 'aria-current="true"' : ''} class="${era.file ? '' : 'planned'}">
        <span class="era-num">${i + 1}</span>
        <span class="era-name">${esc(era.title)}</span>
        <span class="era-years">${era.start}–${era.end}</span>
      </button>
    </li>`).join('');
  list.querySelectorAll<HTMLButtonElement>('button[data-era]').forEach((b) =>
    b.addEventListener('click', () => setEra(Number(b.dataset.era))));
}

function renderEraDetail() {
  const era = ERAS[state.eraIndex];
  const own = eraFeatures();
  const items = own.map((p) => {
    const f = p.feature.properties;
    return `<li><button data-feature="${esc(f.id)}">
      <img src="${symbolDataUrl(f.type)}" alt="" width="16" height="16" />
      <span class="fl-title">${esc(f.title)}</span>
      <span class="fl-date">${esc(formatSpan(f))}</span>
    </button></li>`;
  }).join('');
  $('era-detail').innerHTML = `
    <h2>${esc(era.title)} <span class="years">${era.start}–${era.end}</span></h2>
    ${era.reading ? `<p class="reading"><span class="muted">Read with</span> ${BOOK_TITLE}, ${esc(era.reading)}</p>` : ''}
    ${era.summary ? `<p class="summary">${esc(era.summary)}</p>` : ''}
    ${era.file
      ? `<h3 class="list-heading">On the map <span class="muted">(${own.length})</span></h3><ol class="feature-list">${items}</ol>`
      : '<p class="planned-note">This era has not been mapped yet. Switch to “Up to this era” to see earlier eras in context.</p>'}`;
  $('era-detail').querySelectorAll<HTMLButtonElement>('button[data-feature]').forEach((b) =>
    b.addEventListener('click', () => select(b.dataset.feature!, { fly: true })));
  if (state.selectedId) document.querySelector(`.feature-list button[data-feature="${CSS.escape(state.selectedId)}"]`)?.setAttribute('aria-current', 'true');
}

function setEra(index: number, fit = true) {
  state.eraIndex = Math.max(0, Math.min(ERAS.length - 1, index));
  const slider = $<HTMLInputElement>('era-slider');
  slider.value = String(state.eraIndex);
  slider.setAttribute('aria-valuetext', `${ERAS[state.eraIndex].title}, ${ERAS[state.eraIndex].start}–${ERAS[state.eraIndex].end}`);
  document.querySelectorAll('#era-ticks span').forEach((t, i) => t.classList.toggle('active', i === state.eraIndex));
  if (state.selectedId && byId(state.selectedId)?.eraIndex !== state.eraIndex) select(null);
  renderEraList();
  renderEraDetail();
  renderStepper();
  render();
  writeHash();
  if (fit) map.fitBounds(ERAS[state.eraIndex].bbox, { padding: panelPadding(), duration: 1200 });
}

function setMode(mode: Mode) {
  state.mode = mode;
  $('mode-era').setAttribute('aria-checked', String(mode === 'era'));
  $('mode-cumulative').setAttribute('aria-checked', String(mode === 'cumulative'));
  render();
  writeHash();
}

/** Opens or collapses the bottom sheet (narrow screens). Returns whether that changed anything. */
function setPanelOpen(open: boolean): boolean {
  const panel = $('panel');
  const changed = panel.classList.contains('collapsed') === open;
  panel.classList.toggle('collapsed', !open);
  $('panel-toggle').setAttribute('aria-expanded', String(open));
  return changed;
}

function initControls() {
  const ticks = $('era-ticks');
  ticks.innerHTML = ERAS.map((e) => `<span class="${e.file ? '' : 'planned'}">${e.start}</span>`).join('');
  ticks.querySelectorAll('span').forEach((t, i) => t.addEventListener('click', () => setEra(i)));
  $<HTMLInputElement>('era-slider').max = String(ERAS.length - 1);
  $<HTMLInputElement>('era-slider').addEventListener('input', (e) => setEra(Number((e.target as HTMLInputElement).value)));

  $('step-prev').addEventListener('click', () => step(-1));
  $('step-next').addEventListener('click', () => step(1));
  $('mode-era').addEventListener('click', () => setMode('era'));
  $('mode-cumulative').addEventListener('click', () => setMode('cumulative'));

  const groupToggle = (checkbox: string, layers: string[]) => {
    $<HTMLInputElement>(checkbox).addEventListener('change', (e) => {
      const on = (e.target as HTMLInputElement).checked;
      for (const l of layers) if (map.getLayer(l)) map.setLayoutProperty(l, 'visibility', on ? 'visible' : 'none');
    });
  };
  groupToggle('toggle-borders', REFERENCE_GROUPS.borders);
  groupToggle('toggle-hydro', REFERENCE_GROUPS.hydro);
  groupToggle('toggle-physio', REFERENCE_GROUPS.physiography);

  $<HTMLInputElement>('toggle-terrain').addEventListener('change', (e) => {
    const on = (e.target as HTMLInputElement).checked;
    if (on) {
      map.setTerrain({ source: 'dem-terrain', exaggeration: 1.8 });
      map.easeTo({ pitch: 60, duration: 1000 });
    } else {
      map.setTerrain(null);
      map.easeTo({ pitch: 0, bearing: 0, duration: 800 });
    }
  });

  const legend = $('legend');
  legend.innerHTML = legendHtml();
  $('legend-toggle').addEventListener('click', () => {
    legend.hidden = !legend.hidden;
    $('legend-toggle').setAttribute('aria-expanded', String(!legend.hidden));
  });

  const about = $<HTMLDialogElement>('about');
  $('about-body').innerHTML = aboutHtml();
  $('about-open').addEventListener('click', () => about.showModal());
  about.addEventListener('click', (e) => {
    if (e.target === about) about.close();
  });

  $('panel-toggle').addEventListener('click', () => setPanelOpen($('panel').classList.contains('collapsed')));

  $('details-close').addEventListener('click', () => select(null));
  $('details-collapse').addEventListener('click', () => {
    const collapsed = details.classList.toggle('collapsed');
    const button = $('details-collapse');
    button.textContent = collapsed ? '+' : '−';
    button.title = collapsed ? 'Show the full details' : 'Shrink to the title';
    button.setAttribute('aria-expanded', String(!collapsed));
    // A narrow screen's sheet follows the card; bring the feature back into view in the resized map.
    const p = state.selectedId ? byId(state.selectedId) : undefined;
    if (isNarrow() && p) {
      matchSheetToCard();
      frame(p);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.target instanceof Element && e.target.closest('input, textarea, dialog')) return;
    // ← / → step through events; [ / ] (or Page Up / Page Down) change era.
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === ']' || e.key === 'PageDown') setEra(state.eraIndex + 1);
    if (e.key === '[' || e.key === 'PageUp') setEra(state.eraIndex - 1);
    if (e.key === 'Escape') select(null);
  });
}

// ---------------------------------------------------------------- boot
initControls();
setMode(state.mode);
renderEraList();
renderEraDetail();

map.on('load', async () => {
  addHistoryLayers(map);
  animateFlow(map);

  let land = null;
  try {
    land = indexLand(await (await fetch(LAND_URL)).json());
  } catch (err) {
    console.error('Could not load the land layer for clipping; polygons will be drawn unclipped', err);
  }
  state.prepared = prepareFeatures(loadEraCollections(), land);
  layoutOverlays();
  setEra(state.eraIndex, false);
  if (initialFeature && byId(initialFeature)) select(initialFeature, { fly: true });

  for (const layer of INTERACTIVE_LAYERS) {
    map.on('mouseenter', layer, () => (map.getCanvas().style.cursor = 'pointer'));
    map.on('mouseleave', layer, () => (map.getCanvas().style.cursor = ''));
  }
  map.on('click', onMapClick);
  const overlays = new ResizeObserver(layoutOverlays);
  for (const el of ['map', 'timeline', 'map-controls']) overlays.observe($(el));
  // Start with the attribution collapsed to its (i) button so it does not run under the timeline.
  document.querySelector('.maplibregl-ctrl-attrib')?.classList.remove('maplibregl-compact-show');
});
