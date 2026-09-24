#!/usr/bin/env node
/**
 * Lists content that is still marked as placeholder / sample data.
 *
 *   yarn content:check          → report only (exit 0)
 *   yarn content:check:strict   → exit 1 if placeholders remain (used by the production deploy)
 *
 * Markers: `status: 'placeholder'` on content items, or a `PLACEHOLDER` comment.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const strict = process.argv.includes('--strict');
const root = new URL('..', import.meta.url).pathname;
const dir = join(root, 'src', 'content');

const hits = [];
for (const file of readdirSync(dir)) {
  if (!file.endsWith('.ts') || file.endsWith('.test.ts') || file === 'types.ts') continue;
  const lines = readFileSync(join(dir, file), 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (/status:\s*'placeholder'|\bPLACEHOLDER\b/.test(line)) {
      hits.push(`${relative(root, join(dir, file))}:${i + 1}  ${line.trim().slice(0, 100)}`);
    }
  });
}

if (hits.length === 0) {
  console.log('✓ No placeholder content left.');
  process.exit(0);
}

console.log(`${strict ? '✗' : '⚠'} ${hits.length} placeholder marker(s) in src/content:\n`);
for (const h of hits) console.log('  ' + h);
console.log('\nReplace the sample data, then remove the marker / set status to \'published\'.');
process.exit(strict ? 1 : 0);
