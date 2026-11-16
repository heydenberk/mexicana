import { describe, expect, it } from 'vitest';
import { distanceKm, formatKm, sampleQuiz, shuffled, toQuestion, type Card, type Deck } from './quiz';

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

const fact = (id: string): Card => ({ id, prompt: `${id}?`, answer: 'Right', distractors: ['Wrong 1', 'Wrong 2', 'Wrong 3'], explanation: '' });
const place = (id: string): Card => ({ id, kind: 'where', prompt: `Where is ${id}?`, answer: id, explanation: '', feature: `f-${id}` });

describe('shuffled', () => {
  it('keeps every item and leaves the input alone', () => {
    const input = [1, 2, 3, 4, 5];
    const out = shuffled(input, seeded(7));
    expect([...out].sort()).toEqual(input);
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('toQuestion', () => {
  it('tracks the right answer through the shuffle', () => {
    for (let seed = 1; seed < 30; seed++) {
      const q = toQuestion(fact('x'), seeded(seed));
      if (q.kind !== 'choice') throw new Error('expected a choice question');
      expect(q.options[q.correct]).toBe('Right');
      expect([...q.options].sort()).toEqual(['Right', 'Wrong 1', 'Wrong 2', 'Wrong 3']);
    }
  });

  it('puts the right answer in different places', () => {
    const places = new Set<number>();
    for (let seed = 1; seed < 30; seed++) {
      const q = toQuestion(fact('x'), seeded(seed));
      if (q.kind === 'choice') places.add(q.correct);
    }
    expect(places.size).toBeGreaterThan(1);
  });

  it('passes map cards through', () => {
    expect(toQuestion(place('p'))).toEqual(place('p'));
  });
});

describe('sampleQuiz', () => {
  const deck: Deck = {
    era: 'x',
    cards: [...Array.from({ length: 30 }, (_, i) => fact(`x-${i}`)), ...Array.from({ length: 6 }, (_, i) => place(`p-${i}`))],
  };

  it('draws ten questions, three of them on the map, in deck order', () => {
    const qs = sampleQuiz(deck, seeded(5));
    expect(qs).toHaveLength(10);
    expect(qs.filter((q) => q.kind === 'where')).toHaveLength(3);
    const positions = qs.map((q) => deck.cards.findIndex((c) => c.id === q.id));
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(new Set(qs.map((q) => q.id)).size).toBe(10);
  });

  it('draws different questions on different runs', () => {
    const a = sampleQuiz(deck, seeded(1)).map((q) => q.id).join();
    const b = sampleQuiz(deck, seeded(2)).map((q) => q.id).join();
    expect(a).not.toBe(b);
  });

  it('fills a quiz from a small deck with whatever it has', () => {
    const small: Deck = { era: 'x', cards: [fact('a'), fact('b'), place('c'), place('d'), place('e'), place('f')] };
    expect(sampleQuiz(small, seeded(3))).toHaveLength(6);
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
