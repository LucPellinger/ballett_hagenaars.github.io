import { describe, expect, it } from 'vitest';
import { collections, type AllContent } from './collections';
import { imageExists } from './images';
import { findPlaceholders, formatIssue, validateAll } from './validate';
import { navigation } from './navigation';

/**
 * Content integrity – runs in CI. If this fails, the website is NOT deployed.
 */
const raw = import.meta.glob('./data/*.json', { eager: true, import: 'default' });
const all = Object.fromEntries(collections.map((c) => [c.id, raw[`./data/${c.file}`]])) as AllContent;

describe('content data', () => {
  it('has a JSON file for every collection', () => {
    for (const c of collections) expect(raw[`./data/${c.file}`], `missing src/content/data/${c.file}`).toBeDefined();
  });

  it('matches the content models, references and images', () => {
    const issues = validateAll(all, { imageExists });
    expect(issues.map(formatIssue), 'Invalid content').toEqual([]);
  });

  it('reports placeholders (informational)', () => {
    expect(Array.isArray(findPlaceholders(all))).toBe(true);
  });
});

describe('validation catches mistakes', () => {
  const clone = () => structuredClone(all) as Record<string, unknown>;

  it('unknown course in timetable', () => {
    const c = clone();
    (c.schedule as { courseId: string }[])[0]!.courseId = 'gibt-es-nicht';
    expect(validateAll(c as AllContent).some((i) => i.collection === 'schedule' && i.path.includes('courseId'))).toBe(true);
  });

  it('end before start', () => {
    const c = clone();
    const e = (c.schedule as { start: string; end: string }[])[0]!;
    e.end = '08:00';
    expect(validateAll(c as AllContent).some((i) => i.message.includes('Ende'))).toBe(true);
  });

  it('duplicate ids', () => {
    const c = clone();
    const list = c.courses as { id: string }[];
    list[1]!.id = list[0]!.id;
    expect(validateAll(c as AllContent).some((i) => i.message.includes('doppelt'))).toBe(true);
  });

  it('missing German text', () => {
    const c = clone();
    (c.courses as { title: { de: string } }[])[0]!.title.de = '  ';
    expect(validateAll(c as AllContent).some((i) => i.path.join('.') === '0.title.de')).toBe(true);
  });

  it('missing image file', () => {
    const c = clone();
    (c.gallery as { image: { src: string } }[])[0]!.image.src = 'gallery/nope.webp';
    expect(validateAll(c as AllContent, { imageExists }).some((i) => i.message.includes('fehlt'))).toBe(true);
  });
});

describe('navigation', () => {
  it('has unique paths and German labels', () => {
    expect(new Set(navigation.map((n) => n.path)).size).toBe(navigation.length);
    for (const n of navigation) expect(n.label.de.trim()).not.toBe('');
  });
});
