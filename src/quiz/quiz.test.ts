import { describe, expect, it } from 'vitest';
import { distanceKm, formatKm, prepareQuestions, shuffled, type QuizBank } from './quiz';

/** A deterministic stand-in for Math.random (mulberry32). */
function seeded(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const bank: QuizBank = {
  era: 'x',
  questions: [
    { id: 'x-1', kind: 'choice', prompt: 'Who?', options: ['Right', 'Wrong 1', 'Wrong 2', 'Wrong 3'], explanation: '', feature: 'f1' },
    { id: 'x-2', kind: 'where', prompt: 'Where?', explanation: '', feature: 'f2' },
  ],
};

describe('shuffled', () => {
  it('keeps every item and leaves the input alone', () => {
    const input = [1, 2, 3, 4, 5];
    const out = shuffled(input, seeded(7));
    expect([...out].sort()).toEqual(input);
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('prepareQuestions', () => {
  it('tracks the right answer through the shuffle', () => {
    for (let seed = 1; seed < 30; seed++) {
      const [q] = prepareQuestions(bank, seeded(seed));
      if (q.kind !== 'choice') throw new Error('expected a choice question');
      expect(q.options[q.answer]).toBe('Right');
      expect([...q.options].sort()).toEqual(['Right', 'Wrong 1', 'Wrong 2', 'Wrong 3']);
    }
  });

  it('puts the right answer in different places', () => {
    const places = new Set<number>();
    for (let seed = 1; seed < 30; seed++) {
      const [q] = prepareQuestions(bank, seeded(seed));
      if (q.kind === 'choice') places.add(q.answer);
    }
    expect(places.size).toBeGreaterThan(1);
  });

  it('keeps the question order and passes map questions through', () => {
    const qs = prepareQuestions(bank, seeded(3));
    expect(qs.map((q) => q.id)).toEqual(['x-1', 'x-2']);
    expect(qs[1]).toEqual(bank.questions[1]);
  });
});

describe('distanceKm', () => {
  it('measures Mexico City to Puebla at about 105 km', () => {
    const d = distanceKm([-99.133, 19.433], [-98.198, 19.041]);
    expect(d).toBeGreaterThan(100);
    expect(d).toBeLessThan(110);
  });

  it('is zero for the same point', () => {
    expect(distanceKm([-96.1, 19.2], [-96.1, 19.2])).toBe(0);
  });
});

describe('formatKm', () => {
  it('rounds and groups', () => {
    expect(formatKm(0.4)).toBe('less than 1 km');
    expect(formatKm(42.6)).toBe('43 km');
    expect(formatKm(1234.2)).toBe('1,234 km');
  });
});
