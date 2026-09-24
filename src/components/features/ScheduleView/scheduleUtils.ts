import type { AudienceId, Course, ScheduleEntry, Weekday } from '@/content';

export const WEEKDAYS: Weekday[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

/** Group entries by weekday (Mon→Sun), sorted by start time; empty days are omitted. */
export function groupByDay(entries: ScheduleEntry[]): { day: Weekday; entries: ScheduleEntry[] }[] {
  return WEEKDAYS.map((day) => ({
    day,
    entries: entries.filter((e) => e.day === day).sort((a, b) => a.start.localeCompare(b.start)),
  })).filter((g) => g.entries.length > 0);
}

export function filterByAudience(
  entries: ScheduleEntry[],
  courses: Course[],
  audience: AudienceId | 'all',
): ScheduleEntry[] {
  if (audience === 'all') return entries;
  const ids = new Set(courses.filter((c) => c.audience.includes(audience)).map((c) => c.id));
  return entries.filter((e) => ids.has(e.courseId));
}
