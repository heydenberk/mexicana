import { describe, expect, it } from 'vitest';
import { formatSpan, parseDate, sortKey } from './dates';

describe('parseDate', () => {
  it('parses year, month and day precision', () => {
    expect(parseDate('1519')).toEqual({ year: 1519 });
    expect(parseDate('1519-11')).toEqual({ year: 1519, month: 11 });
    expect(parseDate('1519-11-08')).toEqual({ year: 1519, month: 11, day: 8 });
  });
  it('rejects malformed values', () => {
    expect(parseDate('Nov 1519')).toBeNull();
    expect(parseDate('1519-13')).toBeNull();
    expect(parseDate(undefined)).toBeNull();
  });
});

describe('formatSpan', () => {
  it('formats single dates at their own precision', () => {
    expect(formatSpan({ date: '1519-11-08' })).toBe('8 November 1519');
    expect(formatSpan({ date: '1520-05' })).toBe('May 1520');
    expect(formatSpan({ date: '1841' })).toBe('1841');
  });
  it('collapses spans within a month or year', () => {
    expect(formatSpan({ start: '1519-09-02', end: '1519-09-05' })).toBe('2–5 September 1519');
    expect(formatSpan({ start: '1847-03-09', end: '1847-09-14' })).toBe('9 March – 14 September 1847');
    expect(formatSpan({ start: '1846-12', end: '1847-05' })).toBe('December 1846 – May 1847');
    expect(formatSpan({ start: '1850', end: '1901' })).toBe('1850 – 1901');
  });
  it('handles spans across years with day precision', () => {
    expect(formatSpan({ start: '1520-12-31', end: '1521-04-28' })).toBe('31 December 1520 – 28 April 1521');
  });
});

describe('sortKey', () => {
  it('orders by earliest date, with unknown dates last', () => {
    const keys = [{ date: '1520-05' }, { start: '1519-08-16' }, { date: '1519' }, {}].map(sortKey);
    expect(keys[2]).toBeLessThan(keys[1]);
    expect(keys[1]).toBeLessThan(keys[0]);
    expect(keys[3]).toBe(Number.POSITIVE_INFINITY);
  });
});
