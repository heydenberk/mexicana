import { ERAS } from '../data';
import type { Era } from '../types';
import { loadDecks, type Card } from './quiz';

export const decks = loadDecks(ERAS);

/** The eras that have cards, in order. */
export const STUDY_ERAS: Era[] = ERAS.filter((e) => decks.has(e.id));

export type StudyCard = Card & { era: string };

/** Takes one card from each list in turn until all are used up. */
function interleave<T>(lists: T[][]): T[] {
  const out: T[] = [];
  for (let i = 0; out.length < lists.reduce((n, l) => n + l.length, 0); i++) {
    for (const list of lists) if (i < list.length) out.push(list[i]);
  }
  return out;
}

/**
 * Cards in the order new ones are introduced: the core cards first, then the rest, each in its deck's order. Across
 * several eras the eras take turns, so that a session over all of them builds the whole outline from the first day
 * rather than finishing the conquest before reaching independence.
 */
export function studyOrder(eras: Era[]): StudyCard[] {
  const perEra = eras.map((e) => (decks.get(e.id)?.cards ?? []).map((c) => ({ ...c, era: e.id })));
  return [...interleave(perEra.map((cards) => cards.filter((c) => c.core))), ...interleave(perEra.map((cards) => cards.filter((c) => !c.core)))];
}
