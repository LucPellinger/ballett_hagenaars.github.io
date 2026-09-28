/**
 * Validation of ALL content: schema checks per collection + cross-collection rules
 * (unique ids, references, images exist). Messages are German – they are shown in the editor.
 * Used by: content.test.ts (CI), the editor server (before saving/publishing), the editor UI (live).
 */
import * as z from 'zod';
import { collectionById, collections, type AllContent, type CollectionId } from './collections.ts';

z.config(z.locales.de());

export interface ContentIssue {
  collection: CollectionId;
  /** Path inside the collection data, e.g. [2, 'title', 'de']. */
  path: (string | number)[];
  message: string;
}

export interface ValidateOptions {
  /** Return false if an image path (relative to src/assets/content) does not exist. */
  imageExists?: (src: string) => boolean;
}

type Item = Record<string, unknown>;
const asList = (v: unknown): Item[] => (Array.isArray(v) ? (v as Item[]) : []);

export function validateCollection(id: CollectionId, data: unknown): ContentIssue[] {
  const result = collectionById[id].schema.safeParse(data);
  if (result.success) return [];
  return result.error.issues.map((i) => ({
    collection: id,
    path: i.path.filter((p): p is string | number => typeof p !== 'symbol'),
    message: i.message,
  }));
}

/** Collect every image `src` used in a value (deep). */
export function collectImages(value: unknown, path: (string | number)[] = [], out: { src: string; path: (string | number)[] }[] = []) {
  if (Array.isArray(value)) value.forEach((v, i) => collectImages(v, [...path, i], out));
  else if (value && typeof value === 'object') {
    const obj = value as Item;
    if (typeof obj.src === 'string' && 'alt' in obj) out.push({ src: obj.src, path: [...path, 'src'] });
    for (const [k, v] of Object.entries(obj)) collectImages(v, [...path, k], out);
  }
  return out;
}

export function validateAll(all: AllContent, opts: ValidateOptions = {}): ContentIssue[] {
  const issues: ContentIssue[] = [];

  for (const c of collections) issues.push(...validateCollection(c.id, all[c.id]));

  // Unique ids in list collections (and price plans)
  const idLists: [CollectionId, Item[], (string | number)[]][] = [
    ...collections.filter((c) => c.kind === 'list').map((c) => [c.id, asList(all[c.id]), []] as [CollectionId, Item[], (string | number)[]]),
    ['prices', asList((all.prices as Item | undefined)?.plans), ['plans']],
  ];
  for (const [coll, list, base] of idLists) {
    const seen = new Map<unknown, number>();
    list.forEach((item, i) => {
      if (!item.id) return;
      if (seen.has(item.id)) {
        issues.push({ collection: coll, path: [...base, i, 'id'], message: `Die Kennung „${String(item.id)}“ kommt doppelt vor.` });
      }
      seen.set(item.id, i);
    });
  }

  // References: schedule → courses
  const courseIds = new Set(asList(all.courses).map((c) => c.id));
  asList(all.schedule).forEach((e, i) => {
    if (e.courseId && !courseIds.has(e.courseId)) {
      issues.push({ collection: 'schedule', path: [i, 'courseId'], message: `Kurs „${String(e.courseId)}“ gibt es nicht (mehr).` });
    }
  });

  // Images must exist
  if (opts.imageExists) {
    for (const c of collections) {
      for (const img of collectImages(all[c.id])) {
        if (img.src && !opts.imageExists(img.src)) {
          issues.push({ collection: c.id, path: img.path, message: `Bilddatei „${img.src}“ fehlt.` });
        }
      }
    }
  }

  return issues;
}

/** Entries still marked as sample content (block a live release). */
export function findPlaceholders(all: AllContent): { collection: CollectionId; label: string }[] {
  const out: { collection: CollectionId; label: string }[] = [];
  for (const c of collections) {
    const data = all[c.id];
    if (c.kind === 'list') {
      asList(data).forEach((item) => {
        if (item.status === 'placeholder') out.push({ collection: c.id, label: c.itemLabel?.(item, all) ?? String(item.id) });
      });
    } else if (data && typeof data === 'object') {
      if ((data as Item).status === 'placeholder') out.push({ collection: c.id, label: c.label });
      // nested lists with status (e.g. price plans)
      for (const v of Object.values(data as Item)) {
        asList(v).forEach((item) => {
          if (item && item.status === 'placeholder') {
            const t = item.title as { de?: string } | undefined;
            out.push({ collection: c.id, label: `${c.label}: ${t?.de ?? String(item.id ?? '')}` });
          }
        });
      }
    }
  }
  return out;
}

export function formatIssue(i: ContentIssue): string {
  return `${collectionById[i.collection].label} › ${i.path.join('.') || '(gesamt)'}: ${i.message}`;
}
