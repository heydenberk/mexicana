import type { Era } from '../types';

/** A question as authored in data/quiz/NN-name.json. In a `choice` question the first option is the right one. */
export type Question =
  | { id: string; kind: 'choice'; prompt: string; options: string[]; explanation: string; feature: string }
  | { id: string; kind: 'where'; prompt: string; explanation: string; feature: string; tolerance_km?: number };

export interface QuizBank {
  era: string;
  questions: Question[];
}

/** A question ready to ask: choice options shuffled, with the index of the right one. */
export type AskedQuestion =
  | (Extract<Question, { kind: 'choice' }> & { answer: number })
  | Extract<Question, { kind: 'where' }>;

/** How far (km) a map guess may be from the answer and still count, unless the question sets `tolerance_km`. */
export const DEFAULT_TOLERANCE_KM = 100;

/** Banks are bundled as raw text so that editing them in data/quiz/ hot-reloads the page in dev. */
const BANK_FILES = import.meta.glob('../../data/quiz/*.json', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

/** The quiz bank for each era that has one, keyed by era id. Banks share their basename with the era's GeoJSON. */
export function loadBanks(eras: Era[]): Map<string, QuizBank> {
  const out = new Map<string, QuizBank>();
  for (const era of eras) {
    if (!era.file) continue;
    const raw = BANK_FILES[`../../data/quiz/${era.file.replace(/\.geojson$/, '.json')}`];
    if (!raw) continue;
    try {
      out.set(era.id, JSON.parse(raw) as QuizBank);
    } catch (err) {
      console.error(`Could not parse the quiz for ${era.id}:`, err);
    }
  }
  return out;
}

/** Fisher–Yates shuffle into a new array. `random` returns [0, 1), like Math.random. */
export function shuffled<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Keeps the authored question order (roughly chronological) and shuffles each question's options. */
export function prepareQuestions(bank: QuizBank, random: () => number = Math.random): AskedQuestion[] {
  return bank.questions.map((q) => {
    if (q.kind !== 'choice') return q;
    const order = shuffled(q.options.map((_, i) => i), random);
    return { ...q, options: order.map((i) => q.options[i]), answer: order.indexOf(0) };
  });
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
