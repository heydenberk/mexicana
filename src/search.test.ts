import { describe, expect, it } from 'vitest';
import { fold, highlight, searchFeatures } from './search';
import type { HistoricalProps } from './types';

const f = (id: string, title: string, description = '', extra: Partial<HistoricalProps> = {}): HistoricalProps => ({
  id, era: 'x', title, description, type: 'political', confidence: 'precise', sources: [], ...extra,
});

const items = [
  f('a', 'Gadsden Purchase (La Mesilla) 1853–1854', 'Santa Anna sold the Mesilla Valley to the United States.'),
  f('b', 'Founding of Querétaro', 'An Otomí town on the road north.'),
  f('c', 'Battle of Puebla', 'French troops were repulsed at the forts of Loreto and Guadalupe.', { note: 'Marked at the Fuerte de Loreto.' }),
  f('d', 'Treaty of Guadalupe Hidalgo', 'Ended the war.'),
];
const search = (q: string) => searchFeatures(items, (x) => x, q).map((h) => h.item.id);

describe('search', () => {
  it('folds accents and case', () => {
    expect(fold('Querétaro OTOMÍ')).toBe('queretaro otomi');
    expect(search('queretaro')).toEqual(['b']);
    expect(search('OTOMI')).toEqual(['b']);
  });

  it('finds La Mesilla by any part of its name', () => {
    expect(search('mesilla')).toEqual(['a']);
    expect(search('La Mesilla')).toEqual(['a']);
    expect(search('gadsden')).toEqual(['a']);
  });

  it('requires every word', () => {
    expect(search('mesilla puebla')).toEqual([]);
    expect(search('loreto puebla')).toEqual(['c']);
  });

  it('ranks title matches above description matches', () => {
    expect(search('guadalupe')).toEqual(['d', 'c']);
  });

  it('gives a snippet when only the description or note matches', () => {
    const [hit] = searchFeatures(items, (x) => x, 'repulsed');
    expect(hit.snippet).toContain('repulsed');
    expect(searchFeatures(items, (x) => x, 'puebla')[0].snippet).toBeUndefined();
  });

  it('returns nothing for an empty query', () => {
    expect(search('   ')).toEqual([]);
  });

  it('highlights matches in the original text, accents and all', () => {
    const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    expect(highlight('Founding of Querétaro', 'queretaro', esc)).toBe('Founding of <mark>Querétaro</mark>');
    expect(highlight('A & B', 'b', esc)).toBe('A &amp; <mark>B</mark>');
  });
});
