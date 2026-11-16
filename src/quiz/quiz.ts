import type { Era } from '../types';

/**
 * A card as authored in data/cards/NN-name.json. A fact card is a flashcard, and in the quiz a multiple-choice
 * question with its answer among the distractors; a map card asks for a place, which the quiz has you find on the map.
 */
export type Card = FactCard | MapCard;
export type FactCard = CardBase & { kind?: 'fact'; distractors: string[] };
export type MapCard = CardBase & { kind: 'where'; feature: string; tolerance_km?: number };

interface CardBase {
  id: string;
  prompt: string;
  answer: string;
  explanation: string;
  /** The chapter of Gillingham's book the fact comes from: 0 is the Introduction, 22 the Epilogue. */
  chapter?: number;
  /** One of the facts that matter most for the era; studied first. */
  core?: boolean;
  /** An atlas feature of the era to show on the map. */
  feature?: string;
}

export interface Deck {
  era: string;
  cards: Card[];
}

/** A card ready to ask in the quiz: a fact card's options shuffled, with the index of the right one. */
export type AskedQuestion = (Omit<FactCard, 'kind'> & { kind: 'choice'; options: string[]; correct: number }) | MapCard;

export const QUIZ_LENGTH = 10;
/** The most map questions in one quiz. */
const QUIZ_MAP_QUESTIONS = 3;
/** How far (km) a map guess may be from the answer and still count, unless the card sets `tolerance_km`. */
export const DEFAULT_TOLERANCE_KM = 100;

/** Decks are bundled as raw text so that editing them in data/cards/ hot-reloads the page in dev. */
const DECK_FILES = import.meta.glob('../../data/cards/*.json', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

/** The deck for each era that has one, keyed by era id. Decks share their basename with the era's GeoJSON. */
export function loadDecks(eras: Era[]): Map<string, Deck> {
  const out = new Map<string, Deck>();
  for (const era of eras) {
    if (!era.file) continue;
    const raw = DECK_FILES[`../../data/cards/${era.file.replace(/\.geojson$/, '.json')}`];
    if (!raw) continue;
    try {
      out.set(era.id, JSON.parse(raw) as Deck);
    } catch (err) {
      console.error(`Could not parse the cards for ${era.id}:`, err);
    }
  }
  return out;
}

export const isMapCard = (c: Card): c is MapCard => c.kind === 'where';

/** Fisher–Yates shuffle into a new array. `random` returns [0, 1), like Math.random. */
export function shuffled<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** A card as a quiz question, with a fact card's answer shuffled in among its distractors. */
export function toQuestion(card: Card, random: () => number = Math.random): AskedQuestion {
  if (isMapCard(card)) return card;
  const options = shuffled([card.answer, ...card.distractors], random);
  return { ...card, kind: 'choice', options, correct: options.indexOf(card.answer) };
}

/**
 * A quiz drawn from a deck: up to three map questions and the rest multiple choice, asked in the deck's order (which is
 * roughly chronological).
 */
export function sampleQuiz(deck: Deck, random: () => number = Math.random, length = QUIZ_LENGTH): AskedQuestion[] {
  const order = new Map(deck.cards.map((c, i) => [c.id, i]));
  const maps = shuffled(deck.cards.filter(isMapCard), random).slice(0, QUIZ_MAP_QUESTIONS);
  const facts = shuffled(deck.cards.filter((c) => !isMapCard(c)), random).slice(0, length - maps.length);
  // A deck short of fact cards makes up the quiz with more of its map cards.
  const extra = shuffled(deck.cards.filter((c) => isMapCard(c) && !maps.includes(c)), random).slice(0, length - maps.length - facts.length);
  return [...maps, ...facts, ...extra]
    .sort((a, b) => order.get(a.id)! - order.get(b.id)!)
    .map((c) => toQuestion(c, random));
}

/** Great-circle distance in kilometres between two [lng, lat] points. */
export function distanceKm(a: [number, number], b: [number, number]): number {
  const rad = Math.PI / 180;
  const dLat = (b[1] - a[1]) * rad;
  const dLng = (b[0] - a[0]) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[1] * rad) * Math.cos(b[1] * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function formatKm(km: number): string {
  if (km < 1) return 'less than 1 km';
  return `${Math.round(km).toLocaleString('en')} km`;
}

/** A line for the end of a quiz. */
export function verdict(score: number, total: number): string {
  const share = score / total;
  if (share === 1) return 'A perfect score.';
  if (share >= 0.8) return 'Excellent: you know this era well.';
  if (share >= 0.6) return 'Good: a few gaps to fill.';
  if (share >= 0.4) return 'Fair: worth another look at the map and the chapters.';
  return 'A good era to explore in the atlas before trying again.';
}
