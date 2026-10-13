import pc from 'polygon-clipping';
import type { MultiPolygon as PcMultiPolygon, Polygon as PcPolygon } from 'polygon-clipping';
import polylabel from 'polylabel';
import type { Feature, FeatureCollection, Geometry, Point, Position } from 'geojson';
import erasJson from '../data/eras.json';
import type { Era, HistoricalCollection, HistoricalFeature, HistoricalProps } from './types';

export const ERAS = erasJson as Era[];

// Era files are bundled as raw text so that editing them in data/eras/ hot-reloads the page in dev.
const ERA_FILES = import.meta.glob('../data/eras/*.geojson', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export type BBox = [number, number, number, number];

/** A feature prepared for display: geometry clipped, plus the extras the UI needs. */
export interface PreparedFeature {
  feature: HistoricalFeature;
  eraIndex: number;
  bbox: BBox;
  labelPoint?: Position;
}

export function loadEraCollections(): Map<string, HistoricalCollection> {
  const out = new Map<string, HistoricalCollection>();
  for (const era of ERAS) {
    if (!era.file) continue;
    const raw = ERA_FILES[`../data/eras/${era.file}`];
    if (!raw) {
      console.error(`eras.json lists ${era.file} but data/eras/${era.file} was not found`);
      continue;
    }
    try {
      out.set(era.id, JSON.parse(raw) as HistoricalCollection);
    } catch (err) {
      console.error(`Could not parse data/eras/${era.file}:`, err);
    }
  }
  return out;
}

type Rings = PcMultiPolygon;

function polygonsOf(g: Geometry): Rings | null {
  if (g.type === 'Polygon') return [g.coordinates as PcPolygon];
  if (g.type === 'MultiPolygon') return g.coordinates as Rings;
  return null;
}

export function bboxOf(g: Geometry): BBox {
  const box: BBox = [Infinity, Infinity, -Infinity, -Infinity];
  const visit = (c: unknown): void => {
    if (typeof (c as number[])[0] === 'number') {
      const [x, y] = c as number[];
      if (x < box[0]) box[0] = x;
      if (y < box[1]) box[1] = y;
      if (x > box[2]) box[2] = x;
      if (y > box[3]) box[3] = y;
    } else (c as unknown[]).forEach(visit);
  };
  const visitGeometry = (x: Geometry): void => {
    if (x.type === 'GeometryCollection') x.geometries.forEach(visitGeometry);
    else visit(x.coordinates);
  };
  visitGeometry(g);
  return box;
}

const overlaps = (a: BBox, b: BBox) => a[0] <= b[2] && b[0] <= a[2] && a[1] <= b[3] && b[1] <= a[3];

function ringArea(ring: Position[]): number {
  let a = 0;
  for (let k = 1; k < ring.length; k++) a += ring[k - 1][0] * ring[k][1] - ring[k][0] * ring[k - 1][1];
  return Math.abs(a / 2);
}

export interface LandIndex {
  polygons: { rings: PcPolygon; bbox: BBox }[];
}

export function indexLand(fc: FeatureCollection): LandIndex {
  const polygons: LandIndex['polygons'] = [];
  for (const f of fc.features) {
    for (const rings of polygonsOf(f.geometry) ?? []) {
      polygons.push({ rings, bbox: bboxOf({ type: 'Polygon', coordinates: rings }) });
    }
  }
  return { polygons };
}

/**
 * Applies the load-time geometry operations an era file can ask for (`exclude`, then `clip: "land"`),
 * so that authors can draw rough polygons that overlap the sea or enclaves.
 */
export function prepareFeatures(collections: Map<string, HistoricalCollection>, land: LandIndex | null): PreparedFeature[] {
  const byId = new Map<string, HistoricalFeature>();
  for (const fc of collections.values()) for (const f of fc.features) byId.set(f.properties.id, f);

  const prepared: PreparedFeature[] = [];
  ERAS.forEach((era, eraIndex) => {
    const fc = collections.get(era.id);
    if (!fc) return;
    for (const original of fc.features) {
      if (!original.geometry) {
        console.warn(`Feature ${original.properties?.id} has no geometry; skipped`);
        continue;
      }
      const feature: HistoricalFeature = { ...original, properties: { ...original.properties } };
      let rings = polygonsOf(feature.geometry);
      if (rings) {
        try {
          const excluded = (feature.properties.exclude ?? [])
            .map((id) => byId.get(id))
            .map((f) => (f ? polygonsOf(f.geometry) : null))
            .filter((r): r is Rings => r !== null);
          if (excluded.length) rings = pc.difference(rings, ...excluded);
          if (feature.properties.clip === 'land' && land) {
            const box = bboxOf(feature.geometry);
            const nearby = land.polygons.filter((p) => overlaps(p.bbox, box)).map((p) => p.rings);
            rings = nearby.length ? pc.intersection(rings, nearby) : [];
          }
          feature.geometry = { type: 'MultiPolygon', coordinates: rings };
        } catch (err) {
          console.error(`Geometry operation failed for ${feature.properties.id}; drawing it unclipped`, err);
        }
      }
      const bbox = bboxOf(feature.geometry);
      let labelPoint: Position | undefined;
      if (rings && rings.length) {
        const largest = rings.reduce((a, b) => (ringArea(b[0]) > ringArea(a[0]) ? b : a));
        labelPoint = polylabel(largest, 0.02);
      } else if (feature.geometry.type === 'Point') {
        labelPoint = feature.geometry.coordinates;
      }
      prepared.push({ feature, eraIndex, bbox, labelPoint });
    }
  });
  return prepared;
}

export type DisplayState = 'current' | 'past';

/** Flattened properties handed to MapLibre (it cannot style on nested objects). */
export function toDisplayFeature(p: PreparedFeature, state: DisplayState): Feature {
  const props: HistoricalProps = p.feature.properties;
  return {
    type: 'Feature',
    id: undefined,
    geometry: p.feature.geometry,
    properties: {
      id: props.id,
      title: props.title,
      label: props.label ?? props.title,
      type: props.type,
      confidence: props.confidence,
      directional: props.directional !== false,
      color: props.style?.color ?? null,
      water: props.style?.fill === 'water',
      state,
    },
  };
}

export function toLabelFeature(p: PreparedFeature, state: DisplayState): Feature<Point> | null {
  if (!p.labelPoint || p.feature.geometry.type === 'Point') return null;
  const props = p.feature.properties;
  return {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: p.labelPoint },
    properties: {
      id: props.id,
      label: props.label ?? props.title,
      type: props.type,
      color: props.style?.color ?? null,
      water: props.style?.fill === 'water',
      state,
    },
  };
}
