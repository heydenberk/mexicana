const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
  'November', 'December'];

export interface PartialDate {
  year: number;
  month?: number;
  day?: number;
}

/** Parses "1519", "1519-11" or "1519-11-08". Returns null for anything else. */
export function parseDate(value: string | undefined): PartialDate | null {
  if (!value) return null;
  const m = /^(-?\d{1,4})(?:-(\d{2})(?:-(\d{2}))?)?$/.exec(value.trim());
  if (!m) return null;
  const date: PartialDate = { year: Number(m[1]) };
  if (m[2]) {
    date.month = Number(m[2]);
    if (date.month < 1 || date.month > 12) return null;
  }
  if (m[3]) {
    date.day = Number(m[3]);
    if (date.day < 1 || date.day > 31) return null;
  }
  return date;
}

export function formatDate(d: PartialDate): string {
  if (d.month === undefined) return String(d.year);
  if (d.day === undefined) return `${MONTHS[d.month - 1]} ${d.year}`;
  return `${d.day} ${MONTHS[d.month - 1]} ${d.year}`;
}

/** Formats a feature's date or start/end span, collapsing shared month/year ("2–5 September 1519"). */
export function formatSpan(props: { date?: string; start?: string; end?: string }): string {
  const single = parseDate(props.date);
  if (single) return formatDate(single);
  const a = parseDate(props.start);
  const b = parseDate(props.end);
  if (a && !b) return `from ${formatDate(a)}`;
  if (!a && b) return `until ${formatDate(b)}`;
  if (!a || !b) return '';
  if (a.year === b.year && a.month !== undefined && a.month === b.month && a.day !== undefined && b.day !== undefined) {
    return `${a.day}–${b.day} ${MONTHS[a.month - 1]} ${a.year}`;
  }
  if (a.year === b.year && a.day !== undefined && b.day !== undefined) {
    return `${a.day} ${MONTHS[a.month! - 1]} – ${formatDate(b)}`;
  }
  if (a.year === b.year && a.month !== undefined && b.month !== undefined && a.day === undefined && b.day === undefined) {
    return `${MONTHS[a.month - 1]}–${MONTHS[b.month - 1]} ${a.year}`;
  }
  return `${formatDate(a)} – ${formatDate(b)}`;
}

/** A sortable number (fractional year) for a feature's earliest date. */
export function sortKey(props: { date?: string; start?: string }): number {
  const d = parseDate(props.date) ?? parseDate(props.start);
  if (!d) return Number.POSITIVE_INFINITY;
  return d.year + ((d.month ?? 1) - 1) / 12 + ((d.day ?? 1) - 1) / 372;
}
