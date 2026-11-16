// Spaced repetition in the manner of Anki's SM-2: new cards climb short learning steps, then graduate to reviews whose
// intervals grow by the card's ease; a forgotten review relearns and comes back sooner. Everything here is pure, with
// time passed in, so the scheduler can be tested without a clock.

export type Grade = 'again' | 'hard' | 'good' | 'easy';
export const GRADES: Grade[] = ['again', 'hard', 'good', 'easy'];

export interface CardState {
  /** learning: a new card on its steps; review: graduated; relearning: a review card that was forgotten. */
  phase: 'learning' | 'review' | 'relearning';
  /** Index into the learning or relearning steps. */
  step: number;
  /** When the card is next due (ms since the epoch). */
  due: number;
  /** Days between reviews; for a relearning card, the interval it returns to. */
  interval: number;
  ease: number;
  reps: number;
  lapses: number;
}

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

export const LEARN_STEPS = [1 * MINUTE, 10 * MINUTE];
export const RELEARN_STEPS = [10 * MINUTE];
const GRADUATING_DAYS = 1;
const EASY_DAYS = 4;
const START_EASE = 2.5;
const MIN_EASE = 1.3;
const EASY_BONUS = 1.3;
const HARD_FACTOR = 1.2;
const LAPSE_FACTOR = 0.5;
const MAX_DAYS = 3650;
/** With nothing else to study, a learning card due within this long is shown early rather than making you wait. */
export const LEARN_AHEAD = 20 * MINUTE;
/** The study day turns over at 4 a.m., so a late-night session counts as the day before. */
const DAY_STARTS_AT_HOUR = 4;

/** The start of the study day containing `now`, in local time. */
export function dayStart(now: number): number {
  const d = new Date(now - DAY_STARTS_AT_HOUR * HOUR);
  d.setHours(DAY_STARTS_AT_HOUR, 0, 0, 0);
  return d.getTime();
}

/** The study day as YYYY-MM-DD, for counting new cards per day. */
export function dayKey(now: number): string {
  const d = new Date(dayStart(now));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Spreads reviews out a little so cards learned together do not stay together forever. */
function fuzz(days: number, random: () => number): number {
  if (days < 3) return days;
  return Math.round(days * (1 + (random() - 0.5) * 0.1));
}

function reviewDue(days: number, now: number): number {
  return dayStart(now) + days * DAY;
}

function graduate(s: CardState, days: number, now: number): CardState {
  const interval = Math.min(MAX_DAYS, Math.max(1, days));
  return { ...s, phase: 'review', step: 0, interval, due: reviewDue(interval, now) };
}

/** The card's state after answering it with `grade` at `now`. A card never seen before has no state. */
export function schedule(prev: CardState | undefined, grade: Grade, now: number, random: () => number = Math.random): CardState {
  const s: CardState = { ...(prev ?? { phase: 'learning', step: 0, due: now, interval: 0, ease: START_EASE, reps: 0, lapses: 0 }) };
  s.reps++;

  if (s.phase === 'review') {
    if (grade === 'again') {
      return {
        ...s,
        phase: 'relearning',
        step: 0,
        lapses: s.lapses + 1,
        ease: Math.max(MIN_EASE, s.ease - 0.2),
        interval: Math.max(1, Math.round(s.interval * LAPSE_FACTOR)),
        due: now + RELEARN_STEPS[0],
      };
    }
    let days: number;
    let ease = s.ease;
    if (grade === 'hard') {
      days = s.interval * HARD_FACTOR;
      ease = Math.max(MIN_EASE, ease - 0.15);
    } else if (grade === 'good') {
      days = s.interval * ease;
    } else {
      days = s.interval * ease * EASY_BONUS;
      ease += 0.15;
    }
    // Every success moves the card at least a day further out.
    days = Math.max(s.interval + 1, fuzz(Math.round(days), random));
    return graduate({ ...s, ease }, days, now);
  }

  // Learning or relearning: work through the steps.
  const steps = s.phase === 'learning' ? LEARN_STEPS : RELEARN_STEPS;
  const step = Math.min(s.step, steps.length - 1);
  if (grade === 'again') return { ...s, step: 0, due: now + steps[0] };
  if (grade === 'hard') {
    const delay = step + 1 < steps.length ? (steps[step] + steps[step + 1]) / 2 : steps[step] * 1.5;
    return { ...s, step, due: now + delay };
  }
  if (grade === 'good' && step + 1 < steps.length) return { ...s, step: step + 1, due: now + steps[step + 1] };
  if (s.phase === 'learning') return graduate(s, grade === 'easy' ? EASY_DAYS : GRADUATING_DAYS, now);
  return graduate(s, grade === 'easy' ? s.interval + 1 : s.interval, now);
}

/** A card the quiz caught you out on: due again now, as if you had pressed Again on it. */
export function missed(prev: CardState | undefined, now: number): CardState {
  if (prev?.phase === 'review') return { ...schedule(prev, 'again', now), due: now };
  return { ...(prev ?? schedule(undefined, 'again', now)), step: 0, due: now };
}

/** "<1m", "10m", "3h", "4d", "2.1mo", "1.3y": how long until `due`. */
export function formatWait(ms: number): string {
  if (ms < MINUTE) return '<1m';
  if (ms < HOUR) return `${Math.round(ms / MINUTE)}m`;
  if (ms < DAY) return `${Math.round(ms / HOUR)}h`;
  const days = ms / DAY;
  if (days < 30) return `${Math.round(days)}d`;
  if (days < 365) return `${(days / 30).toFixed(1).replace(/\.0$/, '')}mo`;
  return `${(days / 365).toFixed(1).replace(/\.0$/, '')}y`;
}

/** What each grade would do to the card, for labelling the buttons. Reviews are labelled by whole days. */
export function previews(prev: CardState | undefined, now: number): Record<Grade, string> {
  const out = {} as Record<Grade, string>;
  for (const g of GRADES) {
    const next = schedule(prev, g, now, () => 0.5);
    out[g] = next.phase === 'review' ? formatWait(next.interval * DAY) : formatWait(next.due - now);
  }
  return out;
}

// ---------------------------------------------------------------- choosing the next card

export interface QueueCard {
  id: string;
}

export interface Counts {
  /** New cards still to be introduced today (within the day's allowance). */
  fresh: number;
  /** Cards on their learning or relearning steps. */
  learning: number;
  /** Graduated cards due now. */
  review: number;
}

const inLearning = (s: CardState | undefined) => s !== undefined && s.phase !== 'review';

/**
 * The next card to study: learning cards that are due, then due reviews, then new cards (in the order given, up to
 * `newAllowed`), then learning cards due soon. Undefined when there is nothing to study for now.
 */
export function nextCard<C extends QueueCard>(cards: readonly C[], states: Record<string, CardState>, now: number, newAllowed: number): C | undefined {
  let learning: C | undefined;
  let review: C | undefined;
  let fresh: C | undefined;
  for (const c of cards) {
    const s = states[c.id];
    if (!s) {
      if (!fresh && newAllowed > 0) fresh = c;
    } else if (inLearning(s)) {
      if (s.due <= now + LEARN_AHEAD && (!learning || s.due < states[learning.id].due)) learning = c;
    } else if (s.due <= now && (!review || s.due < states[review.id].due)) review = c;
  }
  if (learning && states[learning.id].due <= now) return learning;
  return review ?? fresh ?? learning;
}

export function counts(cards: readonly QueueCard[], states: Record<string, CardState>, now: number, newAllowed: number): Counts {
  let fresh = 0;
  let learning = 0;
  let review = 0;
  for (const c of cards) {
    const s = states[c.id];
    if (!s) fresh++;
    else if (inLearning(s)) learning++;
    else if (s.due <= now) review++;
  }
  return { fresh: Math.min(fresh, Math.max(0, newAllowed)), learning, review };
}

/** When the next card in `cards` falls due, if any has been studied. */
export function nextDue(cards: readonly QueueCard[], states: Record<string, CardState>): number | undefined {
  let soonest: number | undefined;
  for (const c of cards) {
    const s = states[c.id];
    if (s && (soonest === undefined || s.due < soonest)) soonest = s.due;
  }
  return soonest;
}
