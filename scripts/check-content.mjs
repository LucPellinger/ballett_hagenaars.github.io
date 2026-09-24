#!/usr/bin/env node
/**
 * Lists content that is still marked as placeholder / sample data.
 *
 *   yarn content:check          → report only (exit 0)
 *   yarn content:check:strict   → exit 1 if placeholders remain (used by the production deploy)
 *
 * Markers: `"status": "placeholder"` in src/content/data/*.json (set via the editor's
 * "Beispielinhalt" checkbox), or a `PLACEHOLDER` comment in developer-owned .ts files.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const strict = process.argv.includes('--strict');
const root = new URL('..', import.meta.url).pathname;
const dir = join(root, 'src', 'content');

const SKIP = new Set(['types.ts', 'schema.ts', 'collections.ts', 'validate.ts', 'images.ts']);
const hits = [];

function scanTs(file) {
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      if (/\bPLACEHOLDER\b/.test(line)) hits.push(`${relative(root, file)}:${i + 1}  ${line.trim().slice(0, 100)}`);
    });
}

function scanJson(file) {
  const label = (item) => item?.title?.de ?? item?.name ?? item?.caption?.de ?? item?.id ?? '';
  const walk = (value, path) => {
    if (Array.isArray(value)) value.forEach((v, i) => walk(v, `${path}[${i}]`));
    else if (value && typeof value === 'object') {
      if (value.status === 'placeholder') hits.push(`${relative(root, file)}  ${path || '(ganze Datei)'}  ${label(value)}`);
      for (const [k, v] of Object.entries(value)) if (k !== 'status') walk(v, path ? `${path}.${k}` : k);
    }
  };
  walk(JSON.parse(readFileSync(file, 'utf8')), '');
}

for (const file of readdirSync(dir)) {
  if (file.endsWith('.ts') && !file.endsWith('.test.ts') && !SKIP.has(file)) scanTs(join(dir, file));
}
for (const file of readdirSync(join(dir, 'data'))) {
  if (file.endsWith('.json')) scanJson(join(dir, 'data', file));
}

if (hits.length === 0) {
  console.log('✓ No placeholder content left.');
  process.exit(0);
}

console.log(`${strict ? '✗' : '⚠'} ${hits.length} placeholder marker(s) in src/content:\n`);
for (const h of hits) console.log('  ' + h);
console.log('\nReplace the sample data, then remove the marker / set status to \'published\'.');
process.exit(strict ? 1 : 0);
