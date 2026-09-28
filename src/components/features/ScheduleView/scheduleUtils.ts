import type { AudienceId, Course, ScheduleEntry, Weekday } from '@/content';

export const WEEKDAYS: Weekday[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

/** Group entries by weekday (Mon→Sun), sorted by start time; empty days are omitted. */
export function groupByDay(entries: ScheduleEntry[]): { day: Weekday; entries: ScheduleEntry[] }[] {
  return WEEKDAYS.map((day) => ({
    day,
    entries: entries.filter((e) => e.day === day).sort((a, b) => a.start.localeCompare(b.start)),
  })).filter((g) => g.entries.length > 0);
}

export function filterByAudience(entries: ScheduleEntry[], courses: Course[], audience: AudienceId | 'all'): ScheduleEntry[] {
  if (audience === 'all') return entries;
  const ids = new Set(courses.filter((c) => c.audience.includes(audience)).map((c) => c.id));
  return entries.filter((e) => ids.has(e.courseId));
}

export function filterByCourse(entries: ScheduleEntry[], courseId: string | null): ScheduleEntry[] {
  return courseId ? entries.filter((e) => e.courseId === courseId) : entries;
}

export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
};

/**
 * Week grid for the calendar view: Mon–Fri always, Sat/Sun only when used;
 * time range rounded to full hours around all (unfiltered) entries so the grid doesn't jump.
 */
export function calendarFrame(all: ScheduleEntry[]) {
  const used = new Set(all.map((e) => e.day));
  const days = WEEKDAYS.filter((d, i) => i < 5 || used.has(d));
  const starts = all.map((e) => toMinutes(e.start));
  const ends = all.map((e) => toMinutes(e.end));
  const from = starts.length ? Math.floor(Math.min(...starts) / 60) * 60 : 14 * 60;
  const to = ends.length ? Math.ceil(Math.max(...ends) / 60) * 60 : 21 * 60;
  return { days, from, to };
}
