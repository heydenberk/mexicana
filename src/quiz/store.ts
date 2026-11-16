// What the page remembers, in this browser only: flashcard progress and best quiz scores. Storage can be blocked
// (private windows, cleared site data), so every read falls back to a fresh start and every write may fail quietly;
// the page then works for the visit and forgets afterwards.
import { dayKey, type CardState } from './srs';

const STUDY_KEY = 'mexicana-study';
const BEST_KEY = 'mexicana-quiz-best';

export const NEW_PER_DAY_CHOICES = [5, 10, 20, 30, 50];

export interface StudyData {
  v: 1;
  /** Scheduling state for every card studied, by card id. */
  cards: Record<string, CardState>;
  /** How many new cards a day to introduce, in one era's session or in a session across all eras. */
  newPerDay: number;
  /** New cards introduced on `date`, by era, and any extra allowance granted that day. */
  today: { date: string; byEra: Record<string, number>; extra: number };
}

function fresh(): StudyData {
  return { v: 1, cards: {}, newPerDay: 20, today: { date: '', byEra: {}, extra: 0 } };
}

let study: StudyData = load();
/** False once a write has failed, so the page can say that progress will not be kept. */
export let canSave = true;

function load(): StudyData {
  try {
    const raw = localStorage.getItem(STUDY_KEY);
    const data = raw ? (JSON.parse(raw) as StudyData) : null;
    if (data?.v === 1 && data.cards && data.today) return data;
  } catch {
    // Unreadable or blocked: start afresh.
  }
  return fresh();
}

function save() {
  try {
    localStorage.setItem(STUDY_KEY, JSON.stringify(study));
    canSave = true;
  } catch {
    canSave = false;
  }
}

export function studyData(): StudyData {
  return study;
}

/** Today's record of new cards, reset when the study day turns over. */
function today(now: number) {
  const date = dayKey(now);
  if (study.today.date !== date) study.today = { date, byEra: {}, extra: 0 };
  return study.today;
}

/** How many more new cards may be introduced today in a session over these eras. */
export function newAllowed(now: number, eraIds: string[]): number {
  const t = today(now);
  const used = eraIds.reduce((n, id) => n + (t.byEra[id] ?? 0), 0);
  return Math.max(0, study.newPerDay + t.extra - used);
}

export function recordAnswer(cardId: string, eraId: string, next: CardState, wasNew: boolean, now: number) {
  study.cards[cardId] = next;
  if (wasNew) {
    const t = today(now);
    t.byEra[eraId] = (t.byEra[eraId] ?? 0) + 1;
  }
  save();
}

/** Lets today's session introduce `n` more new cards than the daily setting. */
export function allowExtra(n: number, now: number) {
  today(now).extra += n;
  save();
}

export function setNewPerDay(n: number) {
  study.newPerDay = n;
  save();
}

/** Updates several cards at once (cards the quiz caught you out on). */
export function updateCards(changes: Record<string, CardState>) {
  Object.assign(study.cards, changes);
  save();
}

// ---------------------------------------------------------------- best quiz scores

export function readBest(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(BEST_KEY) ?? '{}') as Record<string, number>;
  } catch {
    return {};
  }
}

export function saveBest(eraId: string, score: number) {
  try {
    const best = readBest();
    if (score > (best[eraId] ?? -1)) localStorage.setItem(BEST_KEY, JSON.stringify({ ...best, [eraId]: score }));
  } catch {
    // Storage blocked: nothing to remember.
  }
}

/** Forgets everything: flashcard progress, settings and best scores. */
export function clearAll() {
  study = fresh();
  try {
    localStorage.removeItem(STUDY_KEY);
    localStorage.removeItem(BEST_KEY);
  } catch {
    // Storage blocked: there was nothing saved to clear.
  }
}

// Another tab studying at the same time: pick up its progress rather than overwrite it.
window.addEventListener('storage', (e) => {
  if (e.key === STUDY_KEY || e.key === null) study = load();
});
