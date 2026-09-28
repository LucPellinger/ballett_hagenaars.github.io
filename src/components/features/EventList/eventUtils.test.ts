import { describe, expect, it } from 'vitest';
import type { EventItem } from '@/content';
import { emptyFilter, filterEvents, splitEvents, yearsOf } from './eventUtils';

const ev = (id: string, startDate: string, endDate?: string, category: EventItem['category'] = 'workshop', tags?: string[]): EventItem => ({
  id,
  title: { de: id },
  startDate,
  endDate,
  location: 'X',
  category,
  tags,
  description: { de: '' },
});
const today = new Date(2026, 5, 15);
const list = [
  ev('future', '2026-07-01', undefined, 'auffuehrung', ['Ballett']),
  ev('past', '2026-01-01'),
  ev('running', '2026-06-14', '2026-06-16', 'show'),
  ev('older', '2025-01-31', '2025-02-02', 'ferien'),
];

describe('splitEvents', () => {
  it('multi-day events stay upcoming until they end', () => {
    const { upcoming, past } = splitEvents(list, today);
    expect(upcoming.map((e) => e.id)).toEqual(['running', 'future']);
    expect(past.map((e) => e.id)).toEqual(['past', 'older']);
  });
});

describe('filterEvents', () => {
  const ids = (f: Partial<typeof emptyFilter>) => filterEvents(list, { ...emptyFilter, ...f }, today).map((e) => e.id);

  it('by time', () => {
    expect(ids({ when: 'past' }).sort()).toEqual(['older', 'past']);
    expect(ids({ when: 'upcoming' }).sort()).toEqual(['future', 'running']);
  });
  it('by year / month / day (spanning events match every day)', () => {
    expect(ids({ year: 2025 })).toEqual(['older']);
    expect(ids({ month: 2 })).toEqual(['older']);
    expect(ids({ year: 2026, month: 6, day: 15 })).toEqual(['running']);
  });
  it('by category and keyword (incl. tags)', () => {
    expect(ids({ categories: ['show', 'ferien'] }).sort()).toEqual(['older', 'running']);
    expect(ids({ query: 'ballett' })).toEqual(['future']);
  });
  it('lists years newest first', () => {
    expect(yearsOf(list)).toEqual([2026, 2025]);
  });
});
