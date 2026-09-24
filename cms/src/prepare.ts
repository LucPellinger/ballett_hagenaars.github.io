import { collectionById, slugify, type AllContent, type CollectionId } from '@/content/collections';
import { normalize, toJS, type JS } from './form/jsonSchema';

/** Normalise a draft and fill in missing ids so it can be validated & saved. */
export function prepare(id: CollectionId, draft: unknown, all: AllContent): unknown {
  const def = collectionById[id];
  const js: JS = toJS(def.schema);
  const clean = normalize(draft, js);
  if (def.kind === 'list' && Array.isArray(clean)) {
    const used = new Set(clean.map((x) => (x as { id?: string }).id).filter(Boolean));
    return clean.map((raw) => {
      const item = raw as Record<string, unknown>;
      if (item.id) return fillNestedIds(item);
      const id = unique(def.idFrom?.(item, all) || def.itemNoun?.toLowerCase() || 'eintrag', used);
      used.add(id);
      return fillNestedIds({ ...item, id });
    });
  }
  return fillNestedIds(clean);
}

function unique(base: string, used: Set<unknown>): string {
  const b = slugify(base) || 'eintrag';
  let id = b;
  for (let n = 2; used.has(id); n++) id = `${b}-${n}`;
  return id;
}

/** Nested lists (e.g. price plans) may contain objects with an empty `id`. */
function fillNestedIds<T>(value: T): T {
  if (Array.isArray(value)) {
    const used = new Set(value.map((x) => (x as { id?: string })?.id).filter(Boolean));
    return value.map((v) => {
      const o = v as Record<string, unknown>;
      if (o && typeof o === 'object' && 'id' in o && !o.id) {
        const t = o.title as { de?: string } | undefined;
        const id = unique(t?.de || String(o.name ?? 'eintrag'), used);
        used.add(id);
        return fillNestedIds({ ...o, id });
      }
      return fillNestedIds(v);
    }) as T;
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, fillNestedIds(v)])) as T;
  }
  return value;
}
