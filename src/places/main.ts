import 'maplibre-gl/dist/maplibre-gl.css';
import '../styles.css';
import '../quiz/quiz.css';
import './places.css';
import { esc } from '../html';
import { distanceKm, formatKm } from '../quiz/util';
import labelsUrl from '../../data/reference/state-labels.geojson?url';
import citiesUrl from '../../data/reference/cities.geojson?url';
import { MODES, buildPlaces, verdict, type LngLat, type Mode, type Places, type Question } from './places';
import {
  $, MEXICO, STATES_URL, clearMarks, clearTarget, drawTarget, fit, frameState, isNarrow, markState, pinAnswer, setLayout,
  setPlaces, showModernLabels, stopTaking, takePin, takeStateClick,
} from './map';

const placesReady: Promise<Places> = Promise.all([STATES_URL, labelsUrl, citiesUrl].map((url) => fetch(url).then((r) => r.json())))
  .then(([states, labels, cities]) => buildPlaces(states, labels, cities));
placesReady.then(setPlaces);

// ---------------------------------------------------------------- best scores, in this browser only
const BEST_KEY = 'mexicana-places-best';

type Best = Record<string, { score: number; total: number }>;

function readBest(): Best {
  try {
    return JSON.parse(localStorage.getItem(BEST_KEY) ?? '{}') ?? {};
  } catch {
    return {};
  }
}

function saveBest(mode: string, score: number, total: number) {
  const best = readBest();
  if (score <= (best[mode]?.score ?? -1)) return;
  best[mode] = { score, total };
  try {
    localStorage.setItem(BEST_KEY, JSON.stringify(best));
  } catch {
    // Storage blocked: the score lasts only for this visit.
  }
}

function clearBest() {
  try {
    localStorage.removeItem(BEST_KEY);
  } catch {
    // Nothing saved, then.
  }
}

// ---------------------------------------------------------------- the quiz
interface Answer {
  correct: boolean;
  choice?: number;
  /** The state clicked, for a click question. */
  clicked?: string;
  /** The pin and its distance from the city, for a pin question. */
  guess?: LngLat;
  km?: number;
}

const LETTERS = ['A', 'B', 'C', 'D'];
/** How long a right answer stays up before the next question. */
const NEXT_AFTER_RIGHT_MS = 1100;
const quizEl = () => $('quiz');

const quiz = {
  mode: null as Mode | null,
  places: null as Places | null,
  questions: [] as Question[],
  index: 0,
  answers: [] as Answer[],
  pin: null as LngLat | null,
  /** A round of the questions missed last time, whose score is not kept as a best. */
  retry: false,
  timer: 0,
};

const current = (): Question | undefined => (quiz.mode ? quiz.questions[quiz.index] : undefined);
const score = () => quiz.answers.filter((a) => a.correct).length;
/** The state quizzes leave each state coloured by its answer, so the map fills in as you go. */
const keepsColours = () => quiz.mode?.group === 'States';

function start(mode: Mode, places: Places, questions = mode.questions(places), retry = false) {
  Object.assign(quiz, { mode, places, questions, index: 0, answers: [], retry });
  showModernLabels(false);
  clearMarks();
  fit(MEXICO);
  renderQuestion();
}

function leave() {
  clearTimeout(quiz.timer);
  quiz.mode = null;
  stopTaking();
}

function progressHtml() {
  const total = quiz.questions.length;
  const done = quiz.answers.filter(Boolean).length;
  return `
    <div class="quiz-progress">
      <span>Question ${Math.min(quiz.index + 1, total)} of ${total}</span>
      <span>${score()} right${done ? ` of ${done}` : ''}</span>
    </div>
    <div class="progress-bar" aria-hidden="true"><span style="width:${(done / total) * 100}%"></span></div>`;
}

function topLine() {
  return `<div class="quiz-top"><a class="link" href="#">All quizzes</a><span class="quiz-era">${esc(quiz.mode!.group)} · ${esc(quiz.mode!.title)}${quiz.retry ? ' · retry' : ''}</span></div>`;
}

function renderQuestion() {
  const q = current()!;
  quiz.pin = null;
  clearTarget();
  clearMarks((m) => keepsColours() && (m === 'right' || m === 'wrong'));
  const tap = isNarrow() ? 'Tap' : 'Click';
  let body = '';
  if (q.kind === 'click') {
    setLayout('where');
    $('map-hint').textContent = `${tap} a state`;
    $('map-hint').hidden = false;
    body = `<p class="where-help">${tap} the state on the map; zoom in for the small ones around Mexico City.</p>`;
    takeStateClick(answerClick);
  } else if (q.kind === 'pin') {
    setLayout('where');
    fit(MEXICO);
    $('map-hint').textContent = `${tap} the map to place your pin`;
    body = `<p class="where-help">${tap} the map to place a pin; drag it to adjust. Within ${q.toleranceKm} km counts as right.</p>
       <button id="confirm" class="primary" disabled>Place a pin first</button>`;
    takePin((g) => {
      quiz.pin = g;
      const confirm = document.getElementById('confirm') as HTMLButtonElement | null;
      if (confirm) {
        confirm.disabled = false;
        confirm.textContent = 'Confirm';
      }
    });
  } else {
    setLayout('choice');
    if (q.show?.state) markState(q.show.state, 'asked');
    if (q.show) drawTarget(q.show, false);
    frameState(q.show?.state);
    body = `<ol class="options">${q.options.map((o, i) =>
      `<li><button class="option" data-option="${i}"><span class="option-key">${LETTERS[i]}</span><span>${esc(o)}</span></button></li>`).join('')}</ol>`;
  }

  quizEl().innerHTML = `${topLine()}
    <div id="quiz-progress">${progressHtml()}</div>
    <h2 class="prompt">${esc(q.prompt)}</h2>
    ${body}
    <div id="feedback"></div>`;
  $('panel-body').scrollTop = 0;
  quizEl().querySelectorAll<HTMLButtonElement>('button[data-option]').forEach((b) =>
    b.addEventListener('click', () => answerChoice(Number(b.dataset.option))));
  document.getElementById('confirm')?.addEventListener('click', answerPin);
  if (q.kind === 'choice' && window.matchMedia('(pointer: fine)').matches) (quizEl().querySelector('.option') as HTMLElement | null)?.focus({ preventScroll: true });
}

function answerClick(name: string) {
  const q = current();
  if (!q || q.kind !== 'click' || quiz.answers[quiz.index]) return;
  const answer: Answer = { correct: name === q.state, clicked: name };
  markState(q.state, answer.correct ? 'right' : 'wrong');
  if (!answer.correct) markState(name, 'clicked');
  drawTarget(q.reveal, true, { clicked: answer.correct ? undefined : name });
  quizEl().querySelector('.where-help')?.remove();
  finish(q, answer, answer.correct ? 'Right.' : `That's ${esc(name)}. ${esc(q.state)} is outlined.`);
}

function answerPin() {
  const q = current();
  if (!q || q.kind !== 'pin' || !quiz.pin || quiz.answers[quiz.index]) return;
  const km = distanceKm(quiz.pin, q.city.at);
  const answer: Answer = { correct: km <= q.toleranceKm, guess: quiz.pin, km };
  pinAnswer(q.city, quiz.pin);
  drawTarget(q.reveal, true, { guess: quiz.pin });
  document.getElementById('confirm')?.remove();
  quizEl().querySelector('.where-help')?.remove();
  finish(q, answer, `${answer.correct ? 'Right' : 'Not quite'}: you were ${formatKm(km)} away.`);
}

function answerChoice(choice: number) {
  const q = current();
  if (!q || q.kind !== 'choice' || quiz.answers[quiz.index]) return;
  const answer: Answer = { correct: choice === q.correct, choice };
  quizEl().querySelectorAll<HTMLButtonElement>('button[data-option]').forEach((b) => {
    const i = Number(b.dataset.option);
    b.disabled = true;
    if (i === q.correct) b.classList.add('right');
    else if (i === choice) b.classList.add('wrong');
  });
  if (q.reveal.state && keepsColours()) markState(q.reveal.state, answer.correct ? 'right' : 'wrong');
  drawTarget(q.reveal, true);
  finish(q, answer, answer.correct ? 'Right.' : `Not quite: it's ${esc(q.answer)}.`);
}

/** A line about the place asked for: a state's capital, or a city's state. */
function detail(q: Question): string {
  const city = q.reveal.city;
  if (city) return `${esc(city.name)} is in ${esc(city.state)}${city.capital ? ', and is its capital' : ''}.`;
  const state = quiz.places!.states.find((s) => s.name === q.reveal.state);
  if (!state) return '';
  return state.capital ? `Its capital is ${esc(state.capital)}.` : 'The capital of the country, Mexico City is a federal entity of its own rather than a state.';
}

function finish(q: Question, answer: Answer, result: string) {
  stopTaking();
  quiz.answers[quiz.index] = answer;
  const last = quiz.index === quiz.questions.length - 1;
  $('feedback').innerHTML = `
    <div class="feedback ${answer.correct ? 'is-right' : 'is-wrong'}">
      <p class="result">${result}</p>
      <p>${detail(q)}</p>
    </div>
    <button id="next" class="primary">${last ? 'See your score' : 'Next question'}</button>`;
  $('quiz-progress').innerHTML = progressHtml();
  const next = $<HTMLButtonElement>('next');
  next.addEventListener('click', advance);
  next.focus({ preventScroll: true });
  $('feedback').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  // Right answers move on by themselves; a wrong one waits, so there is time to look at the map.
  if (answer.correct && !last) quiz.timer = window.setTimeout(advance, NEXT_AFTER_RIGHT_MS);
}

function advance() {
  clearTimeout(quiz.timer);
  if (!quiz.mode || !quiz.answers[quiz.index]) return;
  if (quiz.index === quiz.questions.length - 1) return renderResults();
  quiz.index++;
  renderQuestion();
}

function renderResults() {
  const mode = quiz.mode!;
  const total = quiz.questions.length;
  const right = score();
  if (!quiz.retry) saveBest(mode.id, right, total);
  setLayout('results');
  clearTarget();
  clearMarks((m) => m === 'right' || m === 'wrong');
  fit(MEXICO);
  const missed = quiz.questions.filter((_, i) => !quiz.answers[i].correct);
  const review = quiz.questions.map((q, i) => {
    const a = quiz.answers[i];
    const yours = a.correct ? ''
      : q.kind === 'choice' ? ` (you said ${esc(q.options[a.choice!])})`
      : q.kind === 'click' ? ` (you clicked ${esc(a.clicked!)})` : '';
    const answerText = q.kind === 'pin' ? `${esc(q.answer)}, ${esc(q.city.state)}: ${formatKm(a.km!)} away` : `${esc(q.answer)}${yours}`;
    return `<li class="${a.correct ? 'is-right' : 'is-wrong'}">
      <span class="mark" aria-label="${a.correct ? 'Right' : 'Wrong'}">${a.correct ? '✓' : '✗'}</span>
      <div><p class="review-prompt">${esc(q.prompt)}</p><p class="review-answer">${answerText}</p></div>
    </li>`;
  }).join('');
  quizEl().innerHTML = `${topLine()}
    <div class="results-score"><span class="big">${right}</span><span class="of">/ ${total}</span></div>
    <p class="results-verdict">${esc(verdict(right, total))}</p>
    <div class="results-actions">
      ${missed.length ? `<button id="retry" class="primary">Retry the ${missed.length === 1 ? 'one' : missed.length} you missed</button>` : ''}
      <button id="again" class="secondary">New quiz</button>
      <a class="secondary" href="#">All quizzes</a>
    </div>
    <h3 class="list-heading">Your answers</h3>
    <ol class="review">${review}</ol>`;
  document.getElementById('retry')?.addEventListener('click', () => start(mode, quiz.places!, missed, true));
  $('again').addEventListener('click', () => start(mode, quiz.places!));
  $('panel-body').scrollTop = 0;
}

// ---------------------------------------------------------------- home
function renderHome() {
  setLayout('home');
  clearTarget();
  clearMarks();
  showModernLabels(true);
  fit(MEXICO);
  const best = readBest();
  const group = (name: Mode['group']) => MODES.filter((m) => m.group === name).map((m) => {
    const b = best[m.id];
    return `<li><a class="mode-card" href="#mode=${m.id}">
      <span class="mode-title">${esc(m.title)}</span>
      <span class="mode-blurb">${esc(m.blurb)}</span>
      ${b ? `<span class="chip-note">Best ${b.score}/${b.total}</span>` : ''}
    </a></li>`;
  }).join('');
  quizEl().innerHTML = `
    <p class="quiz-intro">Learn the map of modern Mexico: its 31 states and Mexico City, their capitals, and the country's main cities. The map beside this shows them all; during a quiz the names are hidden.</p>
    <h3 class="list-heading">States</h3>
    <ul class="mode-cards">${group('States')}</ul>
    <h3 class="list-heading">Cities</h3>
    <ul class="mode-cards">${group('Cities')}</ul>
    <p class="saved-note small muted">Best scores are saved in this browser only.
      ${Object.keys(best).length ? '<button id="clear" class="link-button">Clear them</button>' : ''}</p>
    <p class="small muted other-quiz">The history of each era: <a href="../quiz/">flashcards and quizzes</a>.</p>`;
  $('panel-body').scrollTop = 0;
  document.getElementById('clear')?.addEventListener('click', () => {
    clearBest();
    renderHome();
  });
}

// ---------------------------------------------------------------- routing: #mode=find-state
async function route() {
  leave();
  const mode = MODES.find((m) => m.id === new URLSearchParams(location.hash.slice(1)).get('mode'));
  if (!mode) return renderHome();
  quizEl().innerHTML = '<p class="muted">Loading the map…</p>';
  const places = await placesReady;
  // The hash may have changed again while the data loaded.
  if (MODES.find((m) => m.id === new URLSearchParams(location.hash.slice(1)).get('mode')) === mode) start(mode, places);
}
window.addEventListener('hashchange', route);

/** Keys 1–4 and A–D answer a choice question, Enter confirms a pin, and Enter or Space moves on from an answer. */
document.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const q = current();
  if (!q) return;
  if (quiz.answers[quiz.index]) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    advance();
    return;
  }
  if (q.kind === 'pin' && quiz.pin && e.key === 'Enter') {
    e.preventDefault();
    answerPin();
    return;
  }
  if (q.kind !== 'choice') return;
  const i = LETTERS.indexOf(e.key.toUpperCase());
  const n = /^[1-4]$/.test(e.key) ? Number(e.key) - 1 : i;
  if (n < 0 || n >= q.options.length) return;
  e.preventDefault();
  answerChoice(n);
});

route();
