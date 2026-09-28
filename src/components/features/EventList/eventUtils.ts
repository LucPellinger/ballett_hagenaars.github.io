import type { EventCategory, EventItem, PaletteColor } from '@/content';
import { parseIsoDate } from '@/i18n';

export const CATEGORY_COLOR: Record<EventCategory, PaletteColor> = {
  auffuehrung: 'purple',
  workshop: 'redorange',
  show: 'blue',
  ferien: 'lightblue',
  sonstiges: 'orange',
};

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const isPast = (e: EventItem, today: Date = new Date()) => parseIsoDate(e.endDate ?? e.startDate) < startOfDay(today);

/** Split events into upcoming (soonest first) and past (most recent first). */
export function splitEvents(events: EventItem[], today: Date = new Date()) {
  const byStart = (a: EventItem, b: EventItem) => a.startDate.localeCompare(b.startDate);
  return {
    upcoming: events.filter((e) => !isPast(e, today)).sort(byStart),
    past: events.filter((e) => isPast(e, today)).sort((a, b) => byStart(b, a)),
  };
}

export interface EventFilter {
  when: 'all' | 'upcoming' | 'past';
  year: number | null;
  /** 1–12 */
  month: number | null;
  /** 1–31 */
  day: number | null;
  categories: EventCategory[];
  query: string;
}

export const emptyFilter: EventFilter = { when: 'all', year: null, month: null, day: null, categories: [], query: '' };

/** Does the event touch the given year / month / day (multi-day events count for every day they span)? */
function matchesDate(e: EventItem, f: EventFilter): boolean {
  if (f.year === null && f.month === null && f.day === null) return true;
  const start = parseIsoDate(e.startDate);
  const end = parseIsoDate(e.endDate ?? e.startDate);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    if (f.year !== null && d.getFullYear() !== f.year) continue;
    if (f.month !== null && d.getMonth() + 1 !== f.month) continue;
    if (f.day !== null && d.getDate() !== f.day) continue;
    return true;
  }
  return false;
}

export function filterEvents(events: EventItem[], f: EventFilter, today: Date = new Date(), textOf: (e: EventItem) => string = defaultText) {
  const q = f.query.trim().toLowerCase();
  return events.filter(
    (e) =>
      (f.when === 'all' || (f.when === 'past') === isPast(e, today)) &&
      (f.categories.length === 0 || f.categories.includes(e.category)) &&
      matchesDate(e, f) &&
      (!q || textOf(e).toLowerCase().includes(q)),
  );
}

const defaultText = (e: EventItem) =>
  [e.title.de, e.title.en, e.description.de, e.description.en, e.location, e.category, ...(e.tags ?? [])].filter(Boolean).join(' ');

export function yearsOf(events: EventItem[]): number[] {
  const ys = new Set<number>();
  for (const e of events) {
    ys.add(parseIsoDate(e.startDate).getFullYear());
    ys.add(parseIsoDate(e.endDate ?? e.startDate).getFullYear());
  }
  return [...ys].sort((a, b) => b - a);
}
