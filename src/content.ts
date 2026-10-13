import { formatSpan } from './dates';
import { DASH } from './history-layers';
import { esc, safeUrl } from './html';
import { TYPE_INFO, legendTypes, symbolDataUrl } from './symbols';
import type { Confidence, HistoricalProps, Source } from './types';

export const CONFIDENCE_TEXT: Record<Confidence, { label: string; text: string }> = {
  precise: {
    label: 'Precise',
    text: 'Location known to within a few hundred metres (an excavated site, a surviving building, a surveyed treaty line), and the date is well attested.',
  },
  approximate: {
    label: 'Approximate',
    text: 'The general location is documented but the exact spot, line or outline is not, or sources disagree. Drawn as faithfully as the sources allow.',
  },
  schematic: {
    label: 'Schematic',
    text: 'A deliberately simplified representation of something that had no fixed line on the ground, such as the reach of a tributary empire or the path between documented stops.',
  },
};

function dashSvg(c: Confidence, color = '#55524c'): string {
  const dash = DASH[c];
  const attr = dash ? `stroke-dasharray="${dash.map((d) => d * 3).join(' ')}"` : '';
  return `<svg class="dash" width="34" height="10" viewBox="0 0 34 10" aria-hidden="true"><line x1="2" y1="5" x2="32" y2="5" stroke="${color}" stroke-width="3" stroke-linecap="${c === 'schematic' ? 'round' : 'butt'}" ${attr}/></svg>`;
}

export function confidenceBadge(c: Confidence): string {
  return `<span class="badge conf conf-${c}" title="${esc(CONFIDENCE_TEXT[c].text)}">${dashSvg(c)}${esc(CONFIDENCE_TEXT[c].label)}</span>`;
}

export function typeBadge(type: HistoricalProps['type']): string {
  const info = TYPE_INFO[type];
  return `<span class="badge type"><img src="${symbolDataUrl(type)}" alt="" width="14" height="14" />${esc(info?.label ?? type)}</span>`;
}

function sourceItem(s: Source | string): string {
  const src = typeof s === 'string' ? { citation: s } : s;
  const url = safeUrl(src.url);
  return `<li>${esc(src.citation)}${url ? ` <a href="${esc(url)}" target="_blank" rel="noopener">link</a>` : ''}</li>`;
}

export function detailsHtml(props: HistoricalProps, eraTitle: string, others: { id: string; title: string }[]): string {
  const date = formatSpan(props);
  return `
    <article class="details-content">
      <div class="badges">${typeBadge(props.type)}${confidenceBadge(props.confidence)}</div>
      <h3>${esc(props.title)}</h3>
      <p class="details-date">${esc(date)}${eraTitle ? ` · <span class="muted">${esc(eraTitle)}</span>` : ''}</p>
      <p>${esc(props.description)}</p>
      ${props.note ? `<p class="note"><strong>Mapping note.</strong> ${esc(props.note)}</p>` : ''}
      <details class="sources" ${props.sources.length <= 2 ? 'open' : ''}>
        <summary>Sources (${props.sources.length})</summary>
        <ol>${props.sources.map(sourceItem).join('')}</ol>
      </details>
      ${others.length ? `<div class="also"><span class="muted">Also here:</span> ${others.map((o) => `<button class="link" data-feature="${esc(o.id)}">${esc(o.title)}</button>`).join('')}</div>` : ''}
    </article>`;
}

export function legendHtml(): string {
  const types = legendTypes()
    .filter((t) => t.type !== 'boundary')
    .map((t) => `<li><img src="${symbolDataUrl(t.type)}" alt="" width="18" height="18" />${esc(t.label)}</li>`)
    .join('');
  const lines = (['precise', 'approximate', 'schematic'] as Confidence[])
    .map((c) => `<li>${dashSvg(c)}${esc(CONFIDENCE_TEXT[c].label)}</li>`)
    .join('');
  return `
    <h2>Legend</h2>
    <ul class="legend-list">${types}</ul>
    <h3>Lines and outlines</h3>
    <ul class="legend-list">
      <li><svg class="dash" width="34" height="10" aria-hidden="true"><line x1="2" y1="5" x2="26" y2="5" stroke="${TYPE_INFO.route.color}" stroke-width="3"/><path d="M26 1 L33 5 L26 9 Z" fill="${TYPE_INFO.route.color}"/></svg>Route (arrow shows direction)</li>
      <li><svg class="dash" width="34" height="14" aria-hidden="true"><rect x="2" y="2" width="30" height="10" fill="#b5523b" fill-opacity="0.2" stroke="#b5523b" stroke-width="1.5"/></svg>Territory</li>
      <li><svg class="dash" width="34" height="10" aria-hidden="true"><line x1="2" y1="5" x2="32" y2="5" stroke="#4d4d4d" stroke-width="3"/></svg>Treaty line</li>
    </ul>
    <h3>Confidence (line style)</h3>
    <ul class="legend-list">${lines}</ul>
    <p class="muted small">In “Up to this era” mode, features from earlier eras are drawn faded.</p>`;
}

export function aboutHtml(): string {
  const levels = (Object.keys(CONFIDENCE_TEXT) as Confidence[])
    .map((c) => `<dt>${dashSvg(c)} ${esc(CONFIDENCE_TEXT[c].label)}</dt><dd>${esc(CONFIDENCE_TEXT[c].text)}</dd>`)
    .join('');
  return `
    <h2 id="about-title">About this atlas</h2>
    <p>A companion for reading the history of Mexico: events, routes and territories from the Spanish conquest to the present, plotted on real terrain rather than on period maps. Pick an era on the timeline or in the list; click anything on the map for its date, a short explanation, how confident the mapping is, and sources.</p>
    <p>It was made to accompany Paul Gillingham, <cite>Mexico: A 500-Year History</cite> (Atlantic Monthly Press, 2025); each era lists the chapters to read alongside it, and where the book and the map's other sources differ, the feature's mapping note says so.</p>
    <h3>How confident is each feature?</h3>
    <dl class="confidence-list">${levels}</dl>
    <p>Historical territories (empires, provinces, rebel zones) rarely had surveyed borders. They are drawn simply, from standard historical atlases and descriptions, and marked approximate or schematic. Treaty lines are built from the treaty texts. Coastlines are modern.</p>
    <h3>Data</h3>
    <ul>
      <li>Historical content: one GeoJSON file per era in <code>data/eras/</code>, with citations on every feature. Open questions are listed in <code>UNCERTAIN.md</code>.</li>
      <li>Relief: <a href="https://registry.opendata.aws/terrain-tiles/" target="_blank" rel="noopener">Terrain Tiles</a> on AWS Open Data (Mapzen/Tilezen; SRTM, GMTED2010, ETOPO1 and others).</li>
      <li>Coastlines, rivers, lakes and modern borders: <a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener">Natural Earth</a> (public domain).</li>
      <li>Map fonts: <a href="https://openfreemap.org/" target="_blank" rel="noopener">OpenFreeMap</a>. Map rendering: <a href="https://maplibre.org/" target="_blank" rel="noopener">MapLibre GL JS</a>.</li>
    </ul>`;
}
