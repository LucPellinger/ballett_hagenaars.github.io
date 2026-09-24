import type { ScheduleEntry } from './types';

/**
 * Weekly timetable.
 * - `courseId` must match an id in courses.ts, `teacherId` an id in team.ts (checked by tests).
 * - Times are 24h "HH:MM".
 * PLACEHOLDER: these are SAMPLE times – replace with the real timetable, then set status to 'published'.
 */
export const schedule: ScheduleEntry[] = [
  { id: 'mon-1', day: 'mon', start: '15:00', end: '15:45', courseId: 'kindertanz', teacherId: 'maricel-hagenaars', status: 'placeholder' },
  { id: 'mon-2', day: 'mon', start: '16:00', end: '17:00', courseId: 'ballett-kinder', level: { de: 'Stufe 1', en: 'Level 1' }, teacherId: 'maricel-hagenaars', status: 'placeholder' },
  { id: 'mon-3', day: 'mon', start: '19:30', end: '21:00', courseId: 'ballett-erwachsene', teacherId: 'maricel-hagenaars', status: 'placeholder' },
  { id: 'tue-1', day: 'tue', start: '16:00', end: '16:45', courseId: 'dance-together', status: 'placeholder' },
  { id: 'tue-2', day: 'tue', start: '17:00', end: '18:15', courseId: 'jazz-teens', teacherId: 'giovanni-de-buono', status: 'placeholder' },
  { id: 'wed-1', day: 'wed', start: '17:00', end: '18:00', courseId: 'ballett-kinder', level: { de: 'Stufe 2', en: 'Level 2' }, teacherId: 'maricel-hagenaars', status: 'placeholder' },
  { id: 'wed-2', day: 'wed', start: '19:00', end: '20:30', courseId: 'flamenco', teacherId: 'maricel-hagenaars', status: 'placeholder' },
  { id: 'thu-1', day: 'thu', start: '18:00', end: '19:15', courseId: 'modern', teacherId: 'maricel-hagenaars', status: 'placeholder' },
];
