// The states and cities quiz: Mexico's 32 states and its main cities, and the questions asked about them.
import type { FeatureCollection, MultiPolygon, Point, Polygon } from 'geojson';
import { distanceKm, shuffled } from '../quiz/util';

export type LngLat = [number, number];

export interface State {
  name: string;
  /** A point inside the state, where its name is written. */
  label: LngLat;
  bbox: [number, number, number, number];
  /** Its capital city; Mexico City, the federal entity that is not a state, has none. */
  capital?: string;
  /** States that share a border with it. */
  neighbours: string[];
  /** Every vertex of its outline, for distances to it. */
  vertices: LngLat[];
}

export interface City {
  name: string;
  state: string;
  at: LngLat;
  pop: number;
  capital: boolean;
}

export interface Places {
  states: State[];
  cities: City[];
}

/** Natural Earth's names for the two entities the map calls by their modern names (as build-reference.mjs does). */
const STATE_NAMES: Record<string, string> = { 'Distrito Federal': 'Ciudad de México', México: 'Estado de México' };
/**
 * Cities in the reference layer left out of the quiz: Nezahualcóyotl is part of Mexico City's sprawl, and Natural
 * Earth gives Zumpango and Escuintla (Chiapas) populations several times their real ones.
 */
const LEFT_OUT = ['Nezahualcóyotl', 'Zumpango', 'Escuintla'];

type CityProps = { name: string; adm1: string; country: string; pop: number; capital: number };

export function buildPlaces(
  statePolygons: FeatureCollection<Polygon | MultiPolygon, { name: string }>,
  stateLabels: FeatureCollection<Point, { name: string; country: string }>,
  cityPoints: FeatureCollection<Point, CityProps>,
): Places {
  const cities: City[] = cityPoints.features
    .filter((f) => f.properties.country === 'Mexico' && !LEFT_OUT.includes(f.properties.name))
    .map(({ properties: p, geometry }) => ({
      name: p.name,
      state: STATE_NAMES[p.adm1] ?? p.adm1,
      at: geometry.coordinates as LngLat,
      pop: p.pop,
      capital: p.capital === 1,
    }));
  const labels = new Map(stateLabels.features.filter((f) => f.properties.country === 'MEX').map((f) => [f.properties.name, f.geometry.coordinates as LngLat]));

  // Neighbouring states share the vertices of their common border.
  const byVertex = new Map<string, Set<string>>();
  const outlines = statePolygons.features.map((f) => {
    const polygons = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
    const vertices = polygons.flat(2) as LngLat[];
    for (const v of vertices) {
      const key = v.join();
      if (!byVertex.has(key)) byVertex.set(key, new Set());
      byVertex.get(key)!.add(f.properties.name);
    }
    return { name: f.properties.name, vertices };
  });

  const states = outlines.map(({ name, vertices }) => {
    const neighbours = new Set<string>();
    for (const v of vertices) for (const other of byVertex.get(v.join())!) if (other !== name) neighbours.add(other);
    const lngs = vertices.map((v) => v[0]);
    const lats = vertices.map((v) => v[1]);
    const label = labels.get(name);
    if (!label) throw new Error(`no label point for ${name}`);
    return {
      name,
      label,
      bbox: [Math.min(...lngs), Math.min(...lats), Math.max(...lngs), Math.max(...lats)] as State['bbox'],
      capital: cities.find((c) => c.capital && c.state === name)?.name,
      neighbours: [...neighbours].sort(),
      vertices,
    };
  });
  return { states, cities };
}

// ---------------------------------------------------------------- questions

/** Something to mark on the map: a state, a city, or both. */
export interface Target {
  state?: string;
  city?: City;
}

interface QuestionBase {
  prompt: string;
  answer: string;
  /** What the map shows with the question (the state or city asked about), if anything. */
  show?: Target;
  /** What the map shows once the question is answered. */
  reveal: Target;
}

/** Answered by clicking a state on the map. */
export type ClickQuestion = QuestionBase & { kind: 'click'; state: string };
/** Answered by placing a pin within `toleranceKm` of a city. */
export type PinQuestion = QuestionBase & { kind: 'pin'; city: City; toleranceKm: number };
export type ChoiceQuestion = QuestionBase & { kind: 'choice'; options: string[]; correct: number };
export type Question = ClickQuestion | PinQuestion | ChoiceQuestion;

/** How close (km) a pin must be to a city to count. */
export const CITY_TOLERANCE_KM = 50;
/** City quizzes ask about this many of the cities; state quizzes go through every state. */
export const CITY_QUIZ_LENGTH = 20;

export interface Mode {
  id: string;
  group: 'States' | 'Cities';
  title: string;
  blurb: string;
  questions: (places: Places, random?: () => number) => Question[];
}

function choice(prompt: string, answer: string, distractors: string[], random: () => number, targets: { show?: Target; reveal: Target }): ChoiceQuestion {
  const options = shuffled([answer, ...distractors], random);
  return { kind: 'choice', prompt, answer, options, correct: options.indexOf(answer), ...targets };
}

const byName = (places: Places, name: string) => places.states.find((s) => s.name === name)!;

/** The states closest to a point, nearest first, measured to the nearest point of each state's outline. */
export function statesNear(places: Places, at: LngLat): State[] {
  const distance = (s: State) => Math.min(...s.vertices.map((v) => distanceKm(v, at)));
  return places.states.map((s) => ({ s, d: distance(s) })).sort((a, b) => a.d - b.d).map(({ s }) => s);
}

/** Three states to confuse with this one: its neighbours where it has three, made up with the states nearest to it. */
export function confusableStates(places: Places, state: State, random: () => number = Math.random): string[] {
  const near = places.states
    .filter((s) => s !== state && !state.neighbours.includes(s.name))
    .sort((a, b) => distanceKm(a.label, state.label) - distanceKm(b.label, state.label))
    .map((s) => s.name);
  return [...shuffled(state.neighbours, random), ...near].slice(0, 3);
}

/** Three wrong capitals: the state's largest other city, if it has one in the list, and its neighbours' capitals. */
export function wrongCapitals(places: Places, state: State, random: () => number = Math.random): string[] {
  const biggest = places.cities.filter((c) => c.state === state.name && !c.capital).sort((a, b) => b.pop - a.pop)[0];
  const others = [...state.neighbours, ...confusableStates(places, state, random)]
    .map((n) => byName(places, n).capital)
    .filter((c): c is string => !!c);
  return [...new Set([...(biggest ? [biggest.name] : []), ...shuffled([...new Set(others)], random)])].slice(0, 3);
}

/** Three of the six cities nearest to this one, leaving out any within 20 km (which would sit on top of it). */
export function nearbyCities(places: Places, city: City, random: () => number = Math.random): string[] {
  const near = places.cities
    .filter((c) => distanceKm(c.at, city.at) > 20)
    .sort((a, b) => distanceKm(a.at, city.at) - distanceKm(b.at, city.at))
    .slice(0, 6)
    .map((c) => c.name);
  return shuffled(near, random).slice(0, 3);
}

/** A city whose name is also its state's, said so the question is not taken to mean the state. */
function cityName(places: Places, city: City) {
  return places.states.some((s) => s.name === city.name) ? `the city of ${city.name}` : city.name;
}

const sampleCities = (cities: City[], random: () => number) => shuffled(cities, random).slice(0, CITY_QUIZ_LENGTH);

export const MODES: Mode[] = [
  {
    id: 'find-state',
    group: 'States',
    title: 'Find the state',
    blurb: 'Click each of the 32 states on the map.',
    questions: (places, random = Math.random) => shuffled(places.states, random).map((s) => ({
      kind: 'click', prompt: `Find ${s.name}`, answer: s.name, state: s.name, reveal: { state: s.name },
    })),
  },
  {
    id: 'name-state',
    group: 'States',
    title: 'Name the state',
    blurb: 'Say which state is highlighted, from four neighbours.',
    questions: (places, random = Math.random) => shuffled(places.states, random).map((s) =>
      choice('Which state is this?', s.name, confusableStates(places, s, random), random, { show: { state: s.name }, reveal: { state: s.name } })),
  },
  {
    id: 'capitals',
    group: 'States',
    title: 'State capitals',
    blurb: 'Name the capital of each of the 31 states.',
    questions: (places, random = Math.random) => shuffled(places.states.filter((s) => s.capital), random).map((s) => {
      const capital = places.cities.find((c) => c.name === s.capital)!;
      return choice(`What is the capital of ${s.name}?`, capital.name, wrongCapitals(places, s, random), random,
        { show: { state: s.name }, reveal: { state: s.name, city: capital } });
    }),
  },
  {
    id: 'find-city',
    group: 'Cities',
    title: 'Find the city',
    blurb: `Place a pin on ${CITY_QUIZ_LENGTH} cities, within ${CITY_TOLERANCE_KM} km.`,
    questions: (places, random = Math.random) => sampleCities(places.cities, random).map((c) => ({
      kind: 'pin', prompt: `Find ${cityName(places, c)}`, answer: c.name, city: c, toleranceKm: CITY_TOLERANCE_KM, reveal: { city: c },
    })),
  },
  {
    id: 'name-city',
    group: 'Cities',
    title: 'Name the city',
    blurb: `Say which city is marked, from four nearby (${CITY_QUIZ_LENGTH} cities).`,
    questions: (places, random = Math.random) => sampleCities(places.cities, random).map((c) =>
      choice('Which city is this?', c.name, nearbyCities(places, c, random), random, { show: { city: c }, reveal: { city: c } })),
  },
  {
    id: 'city-state',
    group: 'Cities',
    title: 'Which state?',
    blurb: `Say which state each city is in (${CITY_QUIZ_LENGTH} cities).`,
    // Not the cities that share their state's name (nor Mexico City), which would answer themselves.
    questions: (places, random = Math.random) =>
      sampleCities(places.cities.filter((c) => c.name !== c.state && c.name !== 'Mexico City'), random).map((c) => {
        const wrong = statesNear(places, c.at).filter((s) => s.name !== c.state).slice(0, 3).map((s) => s.name);
        return choice(`Which state is ${c.name} in?`, c.state, wrong, random, { reveal: { state: c.state, city: c } });
      }),
  },
];

/** A line for the end of a quiz. */
export function verdict(score: number, total: number): string {
  const share = score / total;
  if (share === 1) return 'A perfect score.';
  if (share >= 0.8) return 'Excellent: you know the map well.';
  if (share >= 0.6) return 'Good: a few gaps to fill.';
  if (share >= 0.4) return 'Fair: worth another round.';
  return 'Worth studying the named map on the front page, then another try.';
}
