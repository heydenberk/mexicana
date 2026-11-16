// A quiz: ten cards drawn from one era's deck, multiple choice or found on the map, then a score and a review.
import { ERAS } from '../data';
import { formatSpan } from '../dates';
import { esc } from '../html';
import { $, clearMap, feature, fit, isNarrow, pointOf, setLayout, showFeature, stopGuessing, takeGuess, type LngLat } from './map';
import { decks } from './catalog';
import { DEFAULT_TOLERANCE_KM, distanceKm, formatKm, sampleQuiz, verdict, type AskedQuestion } from './quiz';
import { missed } from './srs';
import { saveBest, studyData, updateCards } from './store';

interface Answer {
  correct: boolean;
  /** The option picked, for a choice question. */
  choice?: number;
  /** The guess and its distance from the answer, for a map question. */
  guess?: LngLat;
  km?: number;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
const quizEl = () => $('quiz');

const state = {
  eraIndex: -1,
  questions: [] as AskedQuestion[],
  index: 0,
  answers: [] as Answer[],
  guess: null as LngLat | null,
};

function current(): AskedQuestion | undefined {
  return state.eraIndex < 0 ? undefined : state.questions[state.index];
}

export function startQuiz(eraIndex: number) {
  state.eraIndex = eraIndex;
  state.questions = sampleQuiz(decks.get(ERAS[eraIndex].id)!);
  state.index = 0;
  state.answers = [];
  renderQuestion();
}

/** Leaves the quiz (for the list of eras or the flashcards). */
export function leaveQuiz() {
  state.eraIndex = -1;
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
  return `<div class="quiz-top"><a class="link" href="#">All eras</a><span class="quiz-era">Quiz · ${esc(era.title)}, ${era.start}–${era.end}</span></div>`;
}

function renderQuestion() {
  const q = current()!;
  state.guess = null;
  clearMap();
  setLayout(q.kind);
  fit(ERAS[state.eraIndex].bbox);

  const body = q.kind === 'choice'
    ? `<ol class="options">${q.options.map((o, i) =>
        `<li><button class="option" data-option="${i}"><span class="option-key">${LETTERS[i]}</span><span>${esc(o)}</span></button></li>`).join('')}</ol>`
    : `<p class="where-help">${isNarrow() ? 'Tap' : 'Click'} the map to place a pin; drag it to adjust. Within ${q.tolerance_km ?? DEFAULT_TOLERANCE_KM} km counts as right.</p>
       <button id="confirm" class="primary" disabled>Place a pin first</button>`;

  quizEl().innerHTML = `${eraLine()}
    <div id="quiz-progress">${progressHtml()}</div>
    <h2 class="prompt">${esc(q.prompt)}</h2>
    ${body}
    <div id="feedback"></div>`;
  $('panel-body').scrollTop = 0;

  quizEl().querySelectorAll<HTMLButtonElement>('button[data-option]').forEach((b) =>
    b.addEventListener('click', () => answerChoice(Number(b.dataset.option))));
  if (q.kind === 'where') {
    takeGuess((g) => {
      state.guess = g;
      const confirm = document.getElementById('confirm') as HTMLButtonElement | null;
      if (confirm) {
        confirm.disabled = false;
        confirm.textContent = 'Confirm guess';
      }
    });
    $('confirm').addEventListener('click', answerWhere);
  }
  // Ready for the keyboard; on a touch screen a focus ring would look like a preselected answer.
  if (window.matchMedia('(pointer: fine)').matches) (quizEl().querySelector('.option') as HTMLElement | null)?.focus({ preventScroll: true });
}

function answerChoice(choice: number) {
  const q = current();
  if (!q || q.kind !== 'choice' || state.answers[state.index]) return;
  const answer: Answer = { correct: choice === q.correct, choice };
  state.answers[state.index] = answer;
  quizEl().querySelectorAll<HTMLButtonElement>('button[data-option]').forEach((b) => {
    const i = Number(b.dataset.option);
    b.disabled = true;
    if (i === q.correct) b.classList.add('right');
    else if (i === choice) b.classList.add('wrong');
  });
  showFeedback(q, answer);
}

function answerWhere() {
  const q = current();
  const target = q && pointOf(feature(q.feature));
  if (!q || q.kind !== 'where' || !state.guess || !target || state.answers[state.index]) return;
  const km = distanceKm(state.guess, target);
  const answer: Answer = { correct: km <= (q.tolerance_km ?? DEFAULT_TOLERANCE_KM), guess: state.guess, km };
  state.answers[state.index] = answer;
  document.getElementById('confirm')?.remove();
  quizEl().querySelector('.where-help')?.remove();
  showFeedback(q, answer);
}

export function featureLine(featureId: string | undefined, eraId: string) {
  const p = feature(featureId);
  if (!p) return '';
  const f = p.feature.properties;
  const href = `../#${new URLSearchParams({ era: eraId, f: f.id })}`;
  return `<p class="feature-ref"><strong>${esc(f.title)}</strong> <span class="muted">${esc(formatSpan(f))}</span><br />
    <a href="${esc(href)}" target="_blank" rel="noopener">See it in the atlas</a></p>`;
}

function showFeedback(q: AskedQuestion, answer: Answer) {
  stopGuessing();
  if (q.feature) showFeature(q.feature, { guess: answer.guess, pin: q.kind === 'where' });
  // A miss goes straight into the flashcards, due now.
  if (!answer.correct) updateCards({ [q.id]: missed(studyData().cards[q.id], Date.now()) });
  let result: string;
  if (q.kind === 'choice') result = answer.correct ? 'Right.' : `Not quite: the answer is ${esc(q.answer)}.`;
  else result = `${answer.correct ? 'Right' : 'Not quite'}: you were ${formatKm(answer.km!)} away.`;
  const last = state.index === state.questions.length - 1;
  $('feedback').innerHTML = `
    <div class="feedback ${answer.correct ? 'is-right' : 'is-wrong'}">
      <p class="result">${result}</p>
      <p>${esc(q.explanation)}</p>
      ${featureLine(q.feature, ERAS[state.eraIndex].id)}
      ${answer.correct ? '' : '<p class="small muted">Added to your flashcards to review.</p>'}
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
  const nextEra = ERAS.find((e, i) => i > state.eraIndex && decks.has(e.id));
  const review = state.questions.map((q, i) => {
    const a = state.answers[i];
    const answerText = q.kind === 'choice' ? q.answer : `${q.answer} (${formatKm(a.km!)} away)`;
    const atlas = q.feature ? ` · <a href="${esc(`../#${new URLSearchParams({ era: era.id, f: q.feature })}`)}" target="_blank" rel="noopener">atlas</a>` : '';
    return `<li class="${a.correct ? 'is-right' : 'is-wrong'}">
      <span class="mark" aria-label="${a.correct ? 'Right' : 'Wrong'}">${a.correct ? '✓' : '✗'}</span>
      <div><p class="review-prompt">${esc(q.prompt)}</p>
      <p class="review-answer">${esc(answerText)}${atlas}</p></div>
    </li>`;
  }).join('');
  const missedCount = total - right;
  quizEl().innerHTML = `
    ${eraLine()}
    <div class="results-score"><span class="big">${right}</span><span class="of">/ ${total}</span></div>
    <p class="results-verdict">${esc(verdict(right, total))}</p>
    ${era.reading ? `<p class="muted small">To read: Gillingham, <cite>Mexico: A 500-Year History</cite>, ${esc(era.reading)}.</p>` : ''}
    <div class="results-actions">
      ${missedCount ? `<a class="primary" href="#study=${esc(era.id)}">Review ${missedCount === 1 ? 'the card' : `the ${missedCount} cards`} you missed</a>` : ''}
      <button id="again" class="secondary">New quiz</button>
      ${nextEra ? `<a class="secondary" href="#era=${esc(nextEra.id)}">Next era: ${esc(nextEra.title)}</a>` : ''}
    </div>
    <h3 class="list-heading">Your answers</h3>
    <ol class="review">${review}</ol>`;
  $('again').addEventListener('click', () => startQuiz(state.eraIndex));
  $('panel-body').scrollTop = 0;
}

/** Keys 1–4 and A–D answer a choice question. Returns whether the key was used. */
export function quizKey(e: KeyboardEvent): boolean {
  const q = current();
  if (!q || state.answers[state.index] || q.kind !== 'choice') return false;
  const i = LETTERS.indexOf(e.key.toUpperCase());
  const n = /^[1-9]$/.test(e.key) ? Number(e.key) - 1 : i;
  if (n < 0 || n >= q.options.length) return false;
  answerChoice(n);
  return true;
}
