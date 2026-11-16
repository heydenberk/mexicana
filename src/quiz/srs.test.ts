import { describe, expect, it } from 'vitest';
import { DAY, LEARN_AHEAD, counts, dayKey, dayStart, formatWait, missed, nextCard, nextDue, previews, schedule, type CardState } from './srs';

// 10:00 local time on a fixed day, so day boundaries are predictable.
const NOW = new Date(2026, 2, 10, 10, 0, 0).getTime();
const MIN = 60_000;
const half = () => 0.5;

describe('dayStart and dayKey', () => {
  it('starts the study day at 4 a.m.', () => {
    expect(new Date(dayStart(NOW)).getHours()).toBe(4);
    expect(dayKey(NOW)).toBe('2026-03-10');
  });

  it('counts the small hours as the day before', () => {
    expect(dayKey(new Date(2026, 2, 11, 2, 30).getTime())).toBe('2026-03-10');
    expect(dayKey(new Date(2026, 2, 11, 4, 30).getTime())).toBe('2026-03-11');
  });
});

describe('schedule: learning', () => {
  it('walks a new card through the steps and graduates it to one day', () => {
    const a = schedule(undefined, 'good', NOW, half);
    expect(a).toMatchObject({ phase: 'learning', step: 1, due: NOW + 10 * MIN, reps: 1 });
    const b = schedule(a, 'good', NOW + 10 * MIN, half);
    expect(b).toMatchObject({ phase: 'review', interval: 1 });
    expect(b.due).toBe(dayStart(NOW) + DAY);
  });

  it('sends Again back to the first step', () => {
    const a = schedule(schedule(undefined, 'good', NOW), 'again', NOW + 10 * MIN);
    expect(a).toMatchObject({ phase: 'learning', step: 0, due: NOW + 11 * MIN });
  });

  it('graduates straight to four days on Easy', () => {
    expect(schedule(undefined, 'easy', NOW)).toMatchObject({ phase: 'review', interval: 4 });
  });

  it('puts Hard between the first two steps', () => {
    expect(schedule(undefined, 'hard', NOW).due).toBe(NOW + 5.5 * MIN);
  });
});

describe('schedule: reviews', () => {
  const review: CardState = { phase: 'review', step: 0, due: NOW, interval: 10, ease: 2.5, reps: 5, lapses: 0 };

  it('grows the interval by the ease on Good', () => {
    const s = schedule(review, 'good', NOW, half);
    expect(s.interval).toBe(25);
    expect(s.ease).toBe(2.5);
    expect(s.due).toBe(dayStart(NOW) + 25 * DAY);
  });

  it('orders Hard < Good < Easy and adjusts the ease', () => {
    const hard = schedule(review, 'hard', NOW, half);
    const good = schedule(review, 'good', NOW, half);
    const easy = schedule(review, 'easy', NOW, half);
    expect(hard.interval).toBeLessThan(good.interval);
    expect(good.interval).toBeLessThan(easy.interval);
    expect(hard.ease).toBeCloseTo(2.35);
    expect(easy.ease).toBeCloseTo(2.65);
  });

  it('always moves a card at least a day further out', () => {
    const short: CardState = { ...review, interval: 1, ease: 1.3 };
    expect(schedule(short, 'hard', NOW, half).interval).toBe(2);
  });

  it('relearns a forgotten card, then returns it at half its interval', () => {
    const lapsed = schedule(review, 'again', NOW, half);
    expect(lapsed).toMatchObject({ phase: 'relearning', step: 0, lapses: 1, interval: 5, due: NOW + 10 * MIN });
    expect(lapsed.ease).toBeCloseTo(2.3);
    expect(schedule(lapsed, 'good', NOW + 10 * MIN, half)).toMatchObject({ phase: 'review', interval: 5 });
  });

  it('never lets the ease fall below 1.3', () => {
    let s: CardState = { ...review, ease: 1.35 };
    for (let i = 0; i < 5; i++) s = schedule({ ...s, phase: 'review' }, 'again', NOW);
    expect(s.ease).toBe(1.3);
  });
});

describe('missed', () => {
  it('makes a new card due now', () => {
    expect(missed(undefined, NOW)).toMatchObject({ phase: 'learning', step: 0, due: NOW });
  });

  it('lapses a review card and makes it due now', () => {
    const s = missed({ phase: 'review', step: 0, due: NOW + 9 * DAY, interval: 12, ease: 2.5, reps: 4, lapses: 0 }, NOW);
    expect(s).toMatchObject({ phase: 'relearning', lapses: 1, interval: 6, due: NOW });
  });
});

describe('formatWait and previews', () => {
  it('formats waits', () => {
    expect(formatWait(20_000)).toBe('<1m');
    expect(formatWait(10 * MIN)).toBe('10m');
    expect(formatWait(3 * 60 * MIN)).toBe('3h');
    expect(formatWait(4 * DAY)).toBe('4d');
    expect(formatWait(63 * DAY)).toBe('2.1mo');
    expect(formatWait(365 * DAY)).toBe('1y');
  });

  it('labels the buttons for a new card', () => {
    expect(previews(undefined, NOW)).toEqual({ again: '1m', hard: '6m', good: '10m', easy: '4d' });
  });
});

describe('nextCard and counts', () => {
  const cards = ['a', 'b', 'c', 'd', 'e'].map((id) => ({ id }));
  const states: Record<string, CardState> = {
    a: { phase: 'review', step: 0, due: NOW - DAY, interval: 3, ease: 2.5, reps: 3, lapses: 0 },
    b: { phase: 'review', step: 0, due: NOW + DAY, interval: 3, ease: 2.5, reps: 3, lapses: 0 },
    c: { phase: 'learning', step: 1, due: NOW + 5 * MIN, interval: 0, ease: 2.5, reps: 1, lapses: 0 },
  };

  it('shows due reviews, then new cards in order, then learning cards early', () => {
    expect(nextCard(cards, states, NOW, 20)?.id).toBe('a');
    const afterReview = { ...states, a: { ...states.a, due: NOW + 5 * DAY } };
    expect(nextCard(cards, afterReview, NOW, 20)?.id).toBe('d');
    expect(nextCard(cards, afterReview, NOW, 0)?.id).toBe('c');
  });

  it('puts a due learning card first', () => {
    expect(nextCard(cards, states, NOW + 6 * MIN, 20)?.id).toBe('c');
  });

  it('has nothing to show once the learning card is far off and no new cards are allowed', () => {
    const later = { ...states, a: { ...states.a, due: NOW + DAY }, c: { ...states.c, due: NOW + LEARN_AHEAD + MIN } };
    expect(nextCard(cards, later, NOW, 0)).toBeUndefined();
    expect(nextDue(cards, later)).toBe(NOW + LEARN_AHEAD + MIN);
  });

  it('counts new cards up to the allowance', () => {
    expect(counts(cards, states, NOW, 20)).toEqual({ fresh: 2, learning: 1, review: 1 });
    expect(counts(cards, states, NOW, 1)).toEqual({ fresh: 1, learning: 1, review: 1 });
  });
});
