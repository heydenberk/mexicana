import type { HistoricalProps } from './types';

/** Lower-cases and strips accents, so "queretaro" finds Querétaro and "teotihuacan" finds Teotihuacán. */
export function fold(s: string): string {
  return s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

/** The query's words, folded. Punctuation and quotes separate words but are otherwise ignored. */
export function queryWords(query: string): string[] {
  return fold(query).split(/[\s,.;:()"']+/).filter((w) => w.length > 0);
}

export interface SearchHit<T> {
  item: T;
  score: number;
  /** A short excerpt of the description or note around the first match, when the title itself did not match. */
  snippet?: string;
}

/** Fields searched, from most to least telling. A word in the title outranks one buried in a description. */
const FIELDS: [keyof HistoricalProps, number][] = [
  ['title', 8],
  ['label', 6],
  ['modern_place', 4],
  ['description', 2],
  ['note', 1],
];

function snippetAround(text: string, folded: string, word: string, width = 90): string {
  const i = folded.indexOf(word);
  const start = Math.max(0, i - width / 2);
  const end = Math.min(text.length, i + word.length + width / 2);
  // Snap to word boundaries so the excerpt does not open or close mid-word.
  const from = start === 0 ? 0 : text.indexOf(' ', start) + 1;
  const toSpace = text.lastIndexOf(' ', end);
  const to = end === text.length || toSpace <= i ? end : toSpace;
  return `${from > 0 ? '…' : ''}${text.slice(from, to).trim()}${to < text.length ? '…' : ''}`;
}

/**
 * Finds features whose text contains every word of the query (accent- and case-insensitive; each word may be the
 * start of a longer word or appear anywhere within one). Results are ranked by where the words occur, then by `order`.
 */
export function searchFeatures<T>(items: T[], props: (item: T) => HistoricalProps, query: string, limit = 60): SearchHit<T>[] {
  const words = queryWords(query);
  if (!words.length) return [];
  const hits: SearchHit<T>[] = [];
  for (const item of items) {
    const p = props(item);
    const texts = FIELDS.map(([k, weight]) => {
      const text = String(p[k] ?? '');
      return { k, weight, text, folded: fold(text) };
    });
    let score = 0;
    let ok = true;
    for (const w of words) {
      let best = 0;
      for (const t of texts) {
        if (!t.folded.includes(w)) continue;
        // A match at the start of a word counts for more than one inside it ("mesa" in Mesilla vs in "promesa").
        const atWordStart = new RegExp(`(^|[^\\p{L}\\p{N}])${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'u').test(t.folded);
        best = Math.max(best, t.weight * (atWordStart ? 2 : 1));
      }
      if (!best) {
        ok = false;
        break;
      }
      score += best;
    }
    if (!ok) continue;
    const titleHit = words.some((w) => texts[0].folded.includes(w) || texts[1].folded.includes(w));
    let snippet: string | undefined;
    if (!titleHit) {
      const t = texts.slice(3).find((t) => t.folded.includes(words[0]));
      if (t) snippet = snippetAround(t.text, t.folded, words[0]);
    }
    hits.push({ item, score, snippet });
  }
  // Array.prototype.sort is stable, so equal scores keep the caller's (chronological) order.
  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}

/**
 * Escapes `text` for HTML and wraps the query's words in <mark>. Matching is on the folded text, which has the same
 * length as the original for the precomposed accented letters in the data, so the indices carry over.
 */
export function highlight(text: string, query: string, esc: (s: string) => string): string {
  const words = queryWords(query);
  const folded = fold(text);
  if (!words.length || folded.length !== text.length) return esc(text);
  const marked = new Array<boolean>(text.length).fill(false);
  for (const w of words) {
    for (let i = folded.indexOf(w); i >= 0; i = folded.indexOf(w, i + 1)) marked.fill(true, i, i + w.length);
  }
  let out = '';
  for (let i = 0; i < text.length; ) {
    let j = i;
    while (j < text.length && marked[j] === marked[i]) j++;
    out += marked[i] ? `<mark>${esc(text.slice(i, j))}</mark>` : esc(text.slice(i, j));
    i = j;
  }
  return out;
}
