import { describe, expect, it } from 'vitest';
import type { EventItem } from '@/content';
import { splitEvents } from './eventUtils';

const ev = (id: string, startDate: string, endDate?: string): EventItem => ({
  id,
  title: { de: id },
  startDate,
  endDate,
  location: 'X',
  description: { de: '' },
});

describe('splitEvents', () => {
  it('separates upcoming and past relative to today (multi-day events stay upcoming until they end)', () => {
    const today = new Date(2026, 5, 15);
    const { upcoming, past } = splitEvents(
      [ev('future', '2026-07-01'), ev('past', '2026-01-01'), ev('running', '2026-06-14', '2026-06-16'), ev('older', '2025-01-01')],
      today,
    );
    expect(upcoming.map((e) => e.id)).toEqual(['running', 'future']);
    expect(past.map((e) => e.id)).toEqual(['past', 'older']);
  });
});
