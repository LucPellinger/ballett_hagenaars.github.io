import type { EventItem } from '@/content';
import { parseIsoDate } from '@/i18n';

/** Split events into upcoming (soonest first) and past (most recent first). */
export function splitEvents(events: EventItem[], today: Date = new Date()) {
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const isPast = (e: EventItem) => parseIsoDate(e.endDate ?? e.startDate) < startOfToday;
  const byStart = (a: EventItem, b: EventItem) => a.startDate.localeCompare(b.startDate);
  return {
    upcoming: events.filter((e) => !isPast(e)).sort(byStart),
    past: events.filter(isPast).sort((a, b) => byStart(b, a)),
  };
}
