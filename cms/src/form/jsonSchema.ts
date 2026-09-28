import * as z from 'zod';

/** The subset of JSON Schema (+ our meta keys) that the editor understands. */
export interface JS {
  type?: string | string[];
  properties?: Record<string, JS>;
  required?: string[];
  items?: JS;
  enum?: (string | number)[];
  anyOf?: JS[];
  title?: string;
  description?: string;
  format?: string;
  minItems?: number;
  // meta
  widget?: 'localized' | 'localizedList' | 'image' | 'ref' | 'status' | 'id' | 'textarea' | 'time' | 'date' | 'url';
  multiline?: boolean;
  ref?: string;
  labels?: Record<string, string>;
  maxWidth?: number;
  itemTitle?: string;
}

const cache = new WeakMap<z.ZodType, JS>();
export function toJS(schema: z.ZodType): JS {
  let js = cache.get(schema);
  if (!js) {
    js = z.toJSONSchema(schema, { unrepresentable: 'any', io: 'input' }) as JS;
    cache.set(schema, js);
  }
  return js;
}

/** `anyOf: [X, {type:null}]` → X with nullable flag. */
export function unwrapNullable(s: JS): { schema: JS; nullable: boolean } {
  if (s.anyOf) {
    const nonNull = s.anyOf.filter((x) => x.type !== 'null');
    if (nonNull.length === 1) return { schema: { ...nonNull[0], title: s.title, description: s.description }, nullable: true };
  }
  if (Array.isArray(s.type) && s.type.includes('null')) {
    return { schema: { ...s, type: s.type.find((t) => t !== 'null') }, nullable: true };
  }
  return { schema: s, nullable: false };
}

/** Sensible empty value for a schema (new entries / adding optional parts). */
export function defaultFor(s: JS): unknown {
  const { schema, nullable } = unwrapNullable(s);
  if (nullable) return null;
  switch (schema.widget) {
    case 'localized':
      return { de: '' };
    case 'localizedList':
      return { de: [] };
    case 'image':
      return { src: '', alt: { de: '' } };
    case 'status':
      return 'published';
  }
  if (schema.enum) return schema.enum[0];
  switch (schema.type) {
    case 'object': {
      const out: Record<string, unknown> = {};
      for (const key of schema.required ?? []) out[key] = defaultFor(schema.properties![key]!);
      return out;
    }
    case 'array':
      return [];
    case 'number':
    case 'integer':
      return 0;
    case 'boolean':
      return false;
    default:
      return '';
  }
}

/**
 * Clean data before validating/saving: trim texts, drop empty English texts and empty
 * list lines, remove optional fields left empty.
 */
export function normalize(value: unknown, s?: JS): unknown {
  const schema = s ? unwrapNullable(s).schema : undefined;
  if (schema?.widget === 'localized' && value && typeof value === 'object') {
    const v = value as { de?: string; en?: string };
    const out: { de: string; en?: string } = { de: (v.de ?? '').trim() };
    if (v.en?.trim()) out.en = v.en.trim();
    return out;
  }
  if (schema?.widget === 'localizedList' && value && typeof value === 'object') {
    const v = value as { de?: string[]; en?: string[] };
    const clean = (a?: string[]) => (a ?? []).map((x) => x.trim()).filter(Boolean);
    const out: { de: string[]; en?: string[] } = { de: clean(v.de) };
    const en = clean(v.en);
    if (en.length) out.en = en;
    return out;
  }
  if (Array.isArray(value)) return value.map((v) => normalize(v, schema?.items));
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      const prop = schema?.properties?.[k];
      const required = schema?.required?.includes(k) ?? true;
      const n = normalize(v, prop);
      if (!required && isEmpty(n, prop)) continue;
      out[k] = n;
    }
    return out;
  }
  if (typeof value === 'string') return schema?.widget === 'textarea' ? value.trim() : value.trim();
  return value;
}

function isEmpty(v: unknown, s?: JS): boolean {
  if (v === undefined || v === null || v === '') return true;
  if (s?.widget === 'image') return !(v as { src?: string }).src;
  if (s?.widget === 'status') return false;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === 'object') return Object.values(v).every((x) => isEmpty(x));
  return false;
}

export const pathKey = (p: (string | number)[]) => p.join('.');
