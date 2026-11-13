import 'maplibre-gl/dist/maplibre-gl.css';
import '../styles.css';
import './quiz.css';
import maplibregl from 'maplibre-gl';
import type { Feature, FeatureCollection } from 'geojson';
import { LAND_URL, baseStyle } from '../basemap';
import { ERAS, indexLand, loadEraCollections, prepareFeatures, toDisplayFeature, toLabelFeature, type BBox, type PreparedFeature } from '../data';
import { formatSpan } from '../dates';
import { HISTORY_SOURCE, LABEL_SOURCE, addHistoryLayers, animateFlow } from '../history-layers';
import { esc } from '../html';
import { DEFAULT_TOLERANCE_KM, distanceKm, formatKm, loadBanks, prepareQuestions, verdict, type AskedQuestion } from './quiz';

type LngLat = [number, number];

interface Answer {
  correct: boolean;
  /** The option picked, for a choice question. */
  choice?: number;
  /** The guess and its distance from the answer, for a map question. */
  guess?: LngLat;
  km?: number;
}

/** Mexico with its old northern frontier and Central America: the view behind the list of eras. */
const OVERVIEW: BBox = [-118, 14, -86, 33];
const GUESS_COLOR = '#8a3b16';
const ANSWER_COLOR = '#2f7a46';
const LINE_SOURCE = 'quiz-line';
const BEST_KEY = 'mexicana-quiz-best';
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const quizEl = $('quiz');
const isNarrow = () => window.matchMedia('(max-width: 820px)').matches;

const banks = loadBanks(ERAS);
const collections = loadEraCollections();
/** Features by id, drawn unclipped until the coastline has loaded (only a revealed territory would show the difference). */
let features = indexById(prepareFeatures(collections, null));

function indexById(list: PreparedFeature[]) {
  return new Map(list.map((p) => [p.feature.properties.id, p]));
}

const state = {
  eraIndex: -1,
  questions: [] as AskedQuestion[],
  index: 0,
  answers: [] as Answer[],
  guess: null as LngLat | null,
};

// ---------------------------------------------------------------- best scores (per browser; the quiz works without them)
function readBest(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(BEST_KEY) ?? '{}') as Record<string, number>;
  } catch {
    return {};
  }
}
function saveBest(eraId: string, score: number) {
  try {
    const best = readBest();
    if (score > (best[eraId] ?? -1)) localStorage.setItem(BEST_KEY, JSON.stringify({ ...best, [eraId]: score }));
  } catch {
    // Storage blocked (private window, cleared site data): nothing to remember.
  }
}

// ---------------------------------------------------------------- map
const map = new maplibregl.Map({
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

const guessMarker = new maplibregl.Marker({ color: GUESS_COLOR, draggable: true });
const answerMarker = new maplibregl.Marker({ color: ANSWER_COLOR });
guessMarker.on('dragend', () => {
  const { lng, lat } = guessMarker.getLngLat();
  state.guess = [lng, lat];
});

const padding = () => (isNarrow() ? 30 : 60);

/** The view the current screen asked for, refitted when the phone layout resizes the map under it. */
let view: BBox = OVERVIEW;

function fit(bbox: BBox, duration = 900) {
  view = bbox;
  map.fitBounds(bbox, { padding: padding(), duration });
}

function setData(source: string, features: Feature[]) {
  (map.getSource(source) as maplibregl.GeoJSONSource | undefined)?.setData({ type: 'FeatureCollection', features } as FeatureCollection);
}

/** Clears the guess, the answer and any revealed feature. */
function clearMap() {
  guessMarker.remove();
  answerMarker.remove();
  setData(LINE_SOURCE, []);
  setData(HISTORY_SOURCE, []);
  setData(LABEL_SOURCE, []);
}

/** Draws a question's feature in the atlas's own style. */
function reveal(p: PreparedFeature) {
  setData(HISTORY_SOURCE, [toDisplayFeature(p, 'current')]);
  const label = toLabelFeature(p, 'current');
  setData(LABEL_SOURCE, label ? [label] : []);
  map.setFilter('route-flow', ['==', ['get', 'id'], p.feature.properties.type === 'route' ? p.feature.properties.id : '']);
}

function pointOf(p: PreparedFeature): LngLat | null {
  return p.feature.geometry.type === 'Point' ? (p.feature.geometry.coordinates as LngLat) : null;
}

map.on('click', (e) => {
  const q = currentQuestion();
  if (!q || q.kind !== 'where' || state.answers[state.index]) return;
  state.guess = [e.lngLat.lng, e.lngLat.lat];
  guessMarker.setLngLat(e.lngLat).addTo(map);
  const confirm = document.getElementById('confirm') as HTMLButtonElement | null;
  if (confirm) {
    confirm.disabled = false;
    confirm.textContent = 'Confirm guess';
  }
  $('map-hint').hidden = true;
});

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
  // A question may already have been answered while the map was loading.
  if (state.answers[state.index]) showOnMap(currentQuestion()!, state.answers[state.index], false);
  try {
    const land = indexLand(await (await fetch(LAND_URL)).json());
    features = indexById(prepareFeatures(collections, land));
  } catch (err) {
    console.warn('Could not load the coastline; territories are drawn unclipped', err);
  }
});

// ---------------------------------------------------------------- screens
function currentQuestion(): AskedQuestion | undefined {
  return state.questions[state.index];
}

/** On a phone, the sheet grows for reading options and shrinks to give the map room for a map question. */
function setLayout(mode: 'home' | 'choice' | 'where' | 'results') {
  $('app').dataset.mode = mode;
  map.getCanvas().style.cursor = mode === 'where' ? 'crosshair' : '';
}
// MapLibre's own resize tracking misses the sheet's height animation, so watch the map's box directly.
let lastHeight = 0;
new ResizeObserver(() => {
  const height = $('map').clientHeight;
  if (!height || height === lastHeight) return;
  lastHeight = height;
  map.resize();
  // An answer has moved the map to show itself; otherwise frame the screen's view in the resized map.
  if (!state.answers[state.index] || state.eraIndex < 0 || $('app').dataset.mode === 'results') fit(view, 0);
}).observe($('map'));

function renderHome() {
  state.eraIndex = -1;
  setLayout('home');
  clearMap();
  $('map-hint').hidden = true;
  fit(OVERVIEW);
  const best = readBest();
  const items = ERAS.map((era, i) => {
    const bank = banks.get(era.id);
    if (!bank) return '';
    const score = best[era.id];
    return `<li><a class="era-card" href="#era=${esc(era.id)}">
      <span class="era-card-num">${i + 1}</span>
      <span class="era-card-title">${esc(era.title)}</span>
      <span class="era-card-years">${era.start}–${era.end}</span>
      ${era.reading ? `<span class="era-card-reading">Gillingham ${esc(era.reading)}</span>` : ''}
      <span class="era-card-best">${score === undefined ? `${bank.questions.length} questions` : `Best ${score}/${bank.questions.length}`}</span>
    </a></li>`;
  }).join('');
  quizEl.innerHTML = `
    <p class="quiz-intro">Ten questions on each era of the atlas, from Cortés's landing to the present. Some are multiple choice; in others you find the place on the map. Each answer links to the event in the <a href="../">atlas</a>.</p>
    <ol class="era-cards">${items}</ol>`;
  $('panel-body').scrollTop = 0;
}

function startQuiz(eraIndex: number) {
  const bank = banks.get(ERAS[eraIndex].id);
  if (!bank) return renderHome();
  state.eraIndex = eraIndex;
  state.questions = prepareQuestions(bank);
  state.index = 0;
  state.answers = [];
  renderQuestion();
}

function score() {
  return state.answers.filter((a) => a.correct).length;
}

function progressHtml() {
  const total = state.questions.length;
  const done = state.answers.filter(Boolean).length;
  return `
    <div class="quiz-progress">
      <span>Question ${Math.min(state.index + 1, total)} of ${total}</span>
      <span>${score()} right${done ? ` of ${done}` : ''}</span>
    </div>
    <div class="progress-bar" aria-hidden="true"><span style="width:${(done / total) * 100}%"></span></div>`;
}

function eraLine() {
  const era = ERAS[state.eraIndex];
  return `<div class="quiz-top"><a class="link" href="#">All eras</a><span class="quiz-era">${esc(era.title)}, ${era.start}–${era.end}</span></div>`;
}

function renderQuestion() {
  const q = currentQuestion()!;
  state.guess = null;
  clearMap();
  setLayout(q.kind);
  fit(ERAS[state.eraIndex].bbox);
  $('map-hint').hidden = q.kind !== 'where';

  const body = q.kind === 'choice'
    ? `<ol class="options">${q.options.map((o, i) =>
        `<li><button class="option" data-option="${i}"><span class="option-key">${LETTERS[i]}</span><span>${esc(o)}</span></button></li>`).join('')}</ol>`
    : `<p class="where-help">${isNarrow() ? 'Tap' : 'Click'} the map to place a pin; drag it to adjust. Within ${q.tolerance_km ?? DEFAULT_TOLERANCE_KM} km counts as right.</p>
       <button id="confirm" class="primary" disabled>Place a pin first</button>`;

  quizEl.innerHTML = `${eraLine()}
    <div id="quiz-progress">${progressHtml()}</div>
    <h2 class="prompt">${esc(q.prompt)}</h2>
    ${body}
    <div id="feedback"></div>`;
  $('panel-body').scrollTop = 0;

  quizEl.querySelectorAll<HTMLButtonElement>('button[data-option]').forEach((b) =>
    b.addEventListener('click', () => answerChoice(Number(b.dataset.option))));
  document.getElementById('confirm')?.addEventListener('click', answerWhere);
  // Ready for the keyboard; on a touch screen a focus ring would look like a preselected answer.
  if (window.matchMedia('(pointer: fine)').matches) (quizEl.querySelector('.option') as HTMLElement | null)?.focus({ preventScroll: true });
}

function answerChoice(choice: number) {
  const q = currentQuestion();
  if (!q || q.kind !== 'choice' || state.answers[state.index]) return;
  const answer: Answer = { correct: choice === q.answer, choice };
  state.answers[state.index] = answer;
  quizEl.querySelectorAll<HTMLButtonElement>('button[data-option]').forEach((b) => {
    const i = Number(b.dataset.option);
    b.disabled = true;
    if (i === q.answer) b.classList.add('right');
    else if (i === choice) b.classList.add('wrong');
  });
  showFeedback(q, answer);
}

function answerWhere() {
  const q = currentQuestion();
  const p = q && features.get(q.feature);
  const target = p && pointOf(p);
  if (!q || q.kind !== 'where' || !state.guess || !target || state.answers[state.index]) return;
  const km = distanceKm(state.guess, target);
  const answer: Answer = { correct: km <= (q.tolerance_km ?? DEFAULT_TOLERANCE_KM), guess: state.guess, km };
  state.answers[state.index] = answer;
  guessMarker.setDraggable(false);
  document.getElementById('confirm')?.remove();
  quizEl.querySelector('.where-help')?.remove();
  showFeedback(q, answer);
}

/** Shows the answer on the map: the feature, and for a map question the guess, the answer and the line between them. */
function showOnMap(q: AskedQuestion, answer: Answer, animate = true) {
  const p = features.get(q.feature);
  if (!p) return;
  reveal(p);
  const target = pointOf(p);
  const duration = animate ? 1000 : 0;
  if (answer.guess && target) {
    answerMarker.setLngLat(target).addTo(map);
    guessMarker.setLngLat(answer.guess).addTo(map);
    setData(LINE_SOURCE, [{ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [answer.guess, target] } }]);
    const box: BBox = [
      Math.min(answer.guess[0], target[0]), Math.min(answer.guess[1], target[1]),
      Math.max(answer.guess[0], target[0]), Math.max(answer.guess[1], target[1]),
    ];
    map.fitBounds(box, { padding: padding() + 30, maxZoom: 8, duration });
  } else if (target) {
    map.flyTo({ center: target, zoom: Math.max(map.getZoom(), 5.5), duration });
  } else {
    map.fitBounds(p.bbox, { padding: padding(), maxZoom: 8, duration });
  }
}

function featureLine(p: PreparedFeature | undefined, eraId: string) {
  if (!p) return '';
  const f = p.feature.properties;
  const href = `../#${new URLSearchParams({ era: eraId, f: f.id })}`;
  return `<p class="feature-ref"><strong>${esc(f.title)}</strong> <span class="muted">${esc(formatSpan(f))}</span><br />
    <a href="${esc(href)}" target="_blank" rel="noopener">See it in the atlas</a></p>`;
}

function showFeedback(q: AskedQuestion, answer: Answer) {
  $('map-hint').hidden = true;
  map.getCanvas().style.cursor = '';
  showOnMap(q, answer);
  const p = features.get(q.feature);
  let result: string;
  if (q.kind === 'choice') result = answer.correct ? 'Right.' : `Not quite: the answer is ${esc(q.options[q.answer])}.`;
  else result = `${answer.correct ? 'Right' : 'Not quite'}: you were ${formatKm(answer.km!)} away.`;
  const last = state.index === state.questions.length - 1;
  $('feedback').innerHTML = `
    <div class="feedback ${answer.correct ? 'is-right' : 'is-wrong'}">
      <p class="result">${result}</p>
      <p>${esc(q.explanation)}</p>
      ${featureLine(p, ERAS[state.eraIndex].id)}
    </div>
    <button id="next" class="primary">${last ? 'See your score' : 'Next question'}</button>`;
  $('quiz-progress').innerHTML = progressHtml();
  const next = $<HTMLButtonElement>('next');
  next.addEventListener('click', () => {
    if (last) renderResults();
    else {
      state.index++;
      renderQuestion();
    }
  });
  next.focus({ preventScroll: true });
  $('feedback').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function renderResults() {
  const era = ERAS[state.eraIndex];
  const total = state.questions.length;
  const right = score();
  saveBest(era.id, right);
  setLayout('results');
  clearMap();
  fit(era.bbox);
  const nextEra = ERAS.findIndex((e, i) => i > state.eraIndex && banks.has(e.id));
  const review = state.questions.map((q, i) => {
    const a = state.answers[i];
    const p = features.get(q.feature);
    const answerText = q.kind === 'choice' ? q.options[q.answer] : `${p?.feature.properties.title ?? ''} (${formatKm(a.km!)} away)`;
    const href = `../#${new URLSearchParams({ era: era.id, f: q.feature })}`;
    return `<li class="${a.correct ? 'is-right' : 'is-wrong'}">
      <span class="mark" aria-label="${a.correct ? 'Right' : 'Wrong'}">${a.correct ? '✓' : '✗'}</span>
      <div><p class="review-prompt">${esc(q.prompt.replace(/ Click the map\.$/, ''))}</p>
      <p class="review-answer">${esc(answerText)} · <a href="${esc(href)}" target="_blank" rel="noopener">atlas</a></p></div>
    </li>`;
  }).join('');
  quizEl.innerHTML = `
    ${eraLine()}
    <div class="results-score"><span class="big">${right}</span><span class="of">/ ${total}</span></div>
    <p class="results-verdict">${esc(verdict(right, total))}</p>
    ${era.reading ? `<p class="muted small">To read: Gillingham, <cite>Mexico: A 500-Year History</cite>, ${esc(era.reading)}.</p>` : ''}
    <div class="results-actions">
      ${nextEra >= 0 ? `<a class="primary" href="#era=${esc(ERAS[nextEra].id)}">Next era: ${esc(ERAS[nextEra].title)}</a>` : ''}
      <button id="again" class="secondary">Try again</button>
    </div>
    <h3 class="list-heading">Your answers</h3>
    <ol class="review">${review}</ol>`;
  $('again').addEventListener('click', () => startQuiz(state.eraIndex));
  $('panel-body').scrollTop = 0;
}

// ---------------------------------------------------------------- routing (#era=conquest) and keys
function route() {
  const id = new URLSearchParams(location.hash.slice(1)).get('era');
  const i = ERAS.findIndex((e) => e.id === id);
  if (i >= 0 && banks.has(ERAS[i].id)) startQuiz(i);
  else renderHome();
}
window.addEventListener('hashchange', route);

document.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey || state.eraIndex < 0) return;
  const q = currentQuestion();
  if (!q || state.answers[state.index] || q.kind !== 'choice') return;
  const i = LETTERS.indexOf(e.key.toUpperCase());
  const n = /^[1-9]$/.test(e.key) ? Number(e.key) - 1 : i;
  if (n >= 0 && n < q.options.length) {
    e.preventDefault();
    answerChoice(n);
  }
});

route();
