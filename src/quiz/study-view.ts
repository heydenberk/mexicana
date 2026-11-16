// Flashcards with spaced repetition, for one era or all of them: recall the answer, reveal it, and say how well you knew it.
import { ERAS } from '../data';
import { esc } from '../html';
import type { Era } from '../types';
import { studyOrder, type StudyCard } from './catalog';
import { $, OVERVIEW, clearMap, fit, setLayout, showFeature } from './map';
import { featureLine } from './quiz-view';
import { GRADES, counts, formatWait, nextCard, nextDue, previews, schedule, type Grade } from './srs';
import { allowExtra, canSave, newAllowed, recordAnswer, studyData } from './store';

const GRADE_LABELS: Record<Grade, string> = { again: 'Again', hard: 'Hard', good: 'Good', easy: 'Easy' };
/** How many more new cards the button at the end of a session adds. */
const EXTRA_NEW = 10;

const quizEl = () => $('quiz');

const session = {
  active: false,
  eras: [] as Era[],
  pool: [] as StudyCard[],
  card: undefined as StudyCard | undefined,
  revealed: false,
  studied: 0,
};

const allowed = (now: number) => newAllowed(now, session.eras.map((e) => e.id));

export function chapterName(chapter: number | undefined): string {
  if (chapter === undefined) return '';
  if (chapter === 0) return 'Introduction';
  if (chapter === 22) return 'Epilogue';
  return `ch. ${chapter}`;
}

/** Starts a session over the given eras (one, or all of them). */
export function startStudy(eras: Era[]) {
  session.active = true;
  session.eras = eras;
  session.pool = studyOrder(eras);
  session.studied = 0;
  showNext();
}

export function leaveStudy() {
  session.active = false;
  session.card = undefined;
}

function scopeTitle() {
  return session.eras.length === 1 ? session.eras[0].title : 'All eras';
}

function topLine() {
  return `<div class="quiz-top"><a class="link" href="#">All eras</a><span class="quiz-era">Flashcards · ${esc(scopeTitle())}</span></div>`;
}

function countsHtml(now: number) {
  const c = counts(session.pool, studyData().cards, now, allowed(now));
  return `<div class="study-counts" aria-label="Cards left">
    <span class="count-new" title="New cards still to learn today">${c.fresh} new</span>
    <span class="count-learning" title="Cards you are learning">${c.learning} learning</span>
    <span class="count-review" title="Cards due for review">${c.review} to review</span>
  </div>`;
}

function showNext() {
  const now = Date.now();
  const card = nextCard(session.pool, studyData().cards, now, allowed(now));
  session.card = card;
  session.revealed = false;
  if (!card) return renderDone();
  renderCard(card, now);
}

function renderCard(card: StudyCard, now: number) {
  const era = ERAS.find((e) => e.id === card.era)!;
  setLayout('study');
  clearMap();
  fit(era.bbox);
  const isNew = !studyData().cards[card.id];
  quizEl().innerHTML = `${topLine()}
    ${countsHtml(now)}
    <article class="flashcard">
      <div class="card-meta">
        <span>${esc(era.title)}, ${era.start}–${era.end}</span>
        ${isNew ? '<span class="card-badge">New</span>' : ''}
      </div>
      <h2 class="prompt">${esc(card.prompt)}</h2>
      <div id="card-back"></div>
    </article>
    <div id="card-actions"><button id="reveal" class="primary wide">Show answer</button></div>`;
  $('panel-body').scrollTop = 0;
  $('reveal').addEventListener('click', reveal);
  if (window.matchMedia('(pointer: fine)').matches) $('reveal').focus({ preventScroll: true });
}

function reveal() {
  const card = session.card;
  if (!card || session.revealed) return;
  session.revealed = true;
  if (card.feature) showFeature(card.feature, { pin: card.kind === 'where' });
  const source = chapterName(card.chapter);
  $('card-back').innerHTML = `
    <p class="card-answer">${esc(card.answer)}</p>
    <p class="card-explanation">${esc(card.explanation)}</p>
    ${featureLine(card.feature, card.era)}
    ${source ? `<p class="card-source">Gillingham, <cite>Mexico</cite>, ${esc(source)}</p>` : ''}`;
  const labels = previews(studyData().cards[card.id], Date.now());
  $('card-actions').innerHTML = `<div class="grades">${GRADES.map((g, i) =>
    `<button class="grade grade-${g}" data-grade="${g}" title="${GRADE_LABELS[g]} (${i + 1})">
      <span class="grade-name">${GRADE_LABELS[g]}</span><span class="grade-wait">${labels[g]}</span>
    </button>`).join('')}</div>`;
  $('card-actions').querySelectorAll<HTMLButtonElement>('[data-grade]').forEach((b) =>
    b.addEventListener('click', () => answer(b.dataset.grade as Grade)));
  if (window.matchMedia('(pointer: fine)').matches) ($('card-actions').querySelector('.grade-good') as HTMLElement).focus({ preventScroll: true });
  $('card-actions').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function answer(grade: Grade) {
  const card = session.card;
  if (!card || !session.revealed) return;
  const now = Date.now();
  const prev = studyData().cards[card.id];
  recordAnswer(card.id, card.era, schedule(prev, grade, now), !prev, now);
  session.studied++;
  showNext();
}

function renderDone() {
  const now = Date.now();
  setLayout('results');
  clearMap();
  fit(session.eras.length === 1 ? session.eras[0].bbox : OVERVIEW);
  const states = studyData().cards;
  const unseen = session.pool.filter((c) => !states[c.id]).length;
  const due = nextDue(session.pool, states);
  const studied = session.studied === 1 ? 'one card' : `${session.studied} cards`;
  const lines: string[] = [];
  if (session.studied) lines.push(`You studied ${studied} this session.`);
  if (due !== undefined) lines.push(due <= now ? 'More cards are due now.' : `The next card is due in ${formatWait(due - now)}.`);
  if (unseen) lines.push(`${unseen} new ${unseen === 1 ? 'card is' : 'cards are'} still to learn; you have had today's allowance.`);
  else lines.push(`You have seen every card in ${session.eras.length === 1 ? 'this era' : 'every era'}.`);
  const era = session.eras.length === 1 ? session.eras[0] : undefined;
  quizEl().innerHTML = `${topLine()}
    <div class="done">
      <h2 class="prompt">Done for now</h2>
      ${lines.map((l) => `<p>${esc(l)}</p>`).join('')}
      ${canSave ? '' : '<p class="small muted">This browser is not letting the page save, so your progress will be lost when you leave.</p>'}
    </div>
    <div class="results-actions">
      ${unseen ? `<button id="more" class="primary">Learn ${Math.min(EXTRA_NEW, unseen)} more new cards</button>` : ''}
      ${era ? `<a class="secondary" href="#era=${esc(era.id)}">Take a quiz on ${esc(era.title)}</a>` : ''}
      <a class="secondary" href="#">All eras</a>
    </div>`;
  document.getElementById('more')?.addEventListener('click', () => {
    allowExtra(EXTRA_NEW, Date.now());
    showNext();
  });
  $('panel-body').scrollTop = 0;
}

/** Space or Enter shows the answer; 1–4 grade it (Space also means Good). Returns whether the key was used. */
export function studyKey(e: KeyboardEvent): boolean {
  if (!session.active || !session.card) return false;
  const onControl = e.target instanceof HTMLElement && e.target.closest('button, a, select, input');
  if (!session.revealed) {
    if ((e.key === ' ' || e.key === 'Enter') && !onControl) {
      reveal();
      return true;
    }
    return false;
  }
  const n = /^[1-4]$/.test(e.key) ? Number(e.key) - 1 : e.key === ' ' && !onControl ? 2 : -1;
  if (n < 0) return false;
  answer(GRADES[n]);
  return true;
}

