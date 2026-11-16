import { describe, expect, it } from 'vitest';
import statesText from '../../data/reference/mexico-states.geojson?raw';
import labelsText from '../../data/reference/state-labels.geojson?raw';
import citiesText from '../../data/reference/cities.geojson?raw';
import { CITY_QUIZ_LENGTH, MODES, buildPlaces, nearbyCities, wrongCapitals, type ChoiceQuestion } from './places';

const places = buildPlaces(JSON.parse(statesText), JSON.parse(labelsText), JSON.parse(citiesText));
const state = (name: string) => places.states.find((s) => s.name === name)!;

/** A seeded generator (mulberry32), so that shuffles are repeatable. */
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('places', () => {
  it('has the 32 federal entities, each state with its capital', () => {
    expect(places.states).toHaveLength(32);
    expect(places.states.filter((s) => s.capital)).toHaveLength(31);
    expect(state('Ciudad de México').capital).toBeUndefined();
    expect(state('Estado de México').capital).toBe('Toluca');
    expect(state('Sonora').capital).toBe('Hermosillo');
  });

  it('puts every city in one of the states', () => {
    const names = new Set(places.states.map((s) => s.name));
    expect(places.cities.filter((c) => !names.has(c.state))).toEqual([]);
    expect(places.cities.find((c) => c.name === 'Nezahualcóyotl')).toBeUndefined();
  });

  it('finds neighbours from shared borders, both ways', () => {
    expect(state('Baja California Sur').neighbours).toEqual(['Baja California']);
    expect(state('Tlaxcala').neighbours).toEqual(['Estado de México', 'Hidalgo', 'Puebla']);
    for (const s of places.states) for (const n of s.neighbours) expect(state(n).neighbours).toContain(s.name);
  });

  it('offers the largest other city among the wrong capitals', () => {
    expect(wrongCapitals(places, state('Baja California'))).toContain('Tijuana');
    expect(wrongCapitals(places, state('Quintana Roo'))).toContain('Cancún');
  });

  it('keeps cities that sit on top of each other apart', () => {
    const mexicoCity = places.cities.find((c) => c.name === 'Mexico City')!;
    for (let i = 0; i < 20; i++) expect(nearbyCities(places, mexicoCity, seeded(i))).not.toContain('Mexico City');
  });

  it('makes questions of every mode with one right answer among four options', () => {
    const lengths: Record<string, number> = { 'find-state': 32, 'name-state': 32, capitals: 31 };
    for (const mode of MODES) {
      const questions = mode.questions(places, seeded(7));
      expect(questions, mode.id).toHaveLength(lengths[mode.id] ?? CITY_QUIZ_LENGTH);
      for (const q of questions.filter((q): q is ChoiceQuestion => q.kind === 'choice')) {
        expect(new Set(q.options).size, `${mode.id}: ${q.prompt}`).toBe(4);
        expect(q.options[q.correct]).toBe(q.answer);
      }
    }
  });

  it('says "the city of" where a city shares its state\'s name', () => {
    const find = MODES.find((m) => m.id === 'find-city')!;
    const prompts = Array.from({ length: 10 }, (_, i) => find.questions(places, seeded(i))).flat().map((q) => q.prompt);
    expect(prompts).toContain('Find the city of Durango');
    expect(prompts).not.toContain('Find Durango');
  });
});
