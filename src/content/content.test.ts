import { describe, expect, it } from 'vitest';
import {
  courses,
  events,
  gallery,
  navigation,
  pricePlans,
  schedule,
  team,
  type Localized,
} from './index';

/**
 * Content integrity checks – these run in CI and catch broken content before it goes live.
 */

const unique = (ids: string[]) => new Set(ids).size === ids.length;
const hasGerman = (v: Localized<unknown>) =>
  Array.isArray(v.de) ? v.de.length > 0 : typeof v.de === 'string' && v.de.trim().length > 0;

describe('ids are unique', () => {
  it.each([
    ['courses', courses.map((c) => c.id)],
    ['schedule', schedule.map((s) => s.id)],
    ['team', team.map((m) => m.id)],
    ['events', events.map((e) => e.id)],
    ['gallery', gallery.map((g) => g.id)],
    ['pricePlans', pricePlans.map((p) => p.id)],
    ['navigation paths', navigation.map((n) => n.path)],
  ])('%s', (_name, ids) => {
    expect(unique(ids)).toBe(true);
  });
});

describe('references', () => {
  const courseIds = new Set(courses.map((c) => c.id));
  const teamIds = new Set(team.map((m) => m.id));

  it.each(schedule.map((e) => [e.id, e] as const))('schedule entry %s points to existing course/teacher', (_id, e) => {
    expect(courseIds.has(e.courseId), `unknown courseId "${e.courseId}"`).toBe(true);
    if (e.teacherId) expect(teamIds.has(e.teacherId), `unknown teacherId "${e.teacherId}"`).toBe(true);
  });
});

describe('schedule times', () => {
  const hhmm = /^([01]\d|2[0-3]):[0-5]\d$/;
  it.each(schedule.map((e) => [e.id, e] as const))('%s has valid start < end', (_id, e) => {
    expect(e.start).toMatch(hhmm);
    expect(e.end).toMatch(hhmm);
    expect(e.start < e.end).toBe(true);
  });
});

describe('events', () => {
  const iso = /^\d{4}-\d{2}-\d{2}$/;
  it.each(events.map((e) => [e.id, e] as const))('%s has valid dates', (_id, e) => {
    expect(e.startDate).toMatch(iso);
    if (e.endDate) {
      expect(e.endDate).toMatch(iso);
      expect(e.endDate >= e.startDate).toBe(true);
    }
  });
});

describe('accessibility of content', () => {
  it('every gallery image has German alt text', () => {
    for (const g of gallery) expect(g.image.alt.de.trim(), `alt missing on gallery "${g.id}"`).not.toBe('');
  });

  it('every team photo / course image has German alt text', () => {
    for (const m of team) if (m.photo) expect(m.photo.alt.de.trim()).not.toBe('');
    for (const c of courses) if (c.image) expect(c.image.alt.de.trim()).not.toBe('');
  });
});

describe('German is always present', () => {
  it('courses', () => {
    for (const c of courses) {
      expect(hasGerman(c.title)).toBe(true);
      expect(hasGerman(c.summary)).toBe(true);
      expect(hasGerman(c.description)).toBe(true);
    }
  });
  it('navigation', () => {
    for (const n of navigation) expect(hasGerman(n.label)).toBe(true);
  });
});
