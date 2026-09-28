#!/usr/bin/env node
/**
 * Starts the content editor.
 *
 *   yarn cms          → switches to the "content-management" branch, gets the latest version
 *                       from GitHub, then opens the editor in the browser.
 *   yarn cms:here     → developer mode: stays on the current branch (publishing disabled).
 *
 * Everything after this is done in the browser – no more terminal needed.
 */
import { execFileSync, spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const BRANCH = 'content-management';
const here = process.argv.includes('--here');
const root = new URL('..', import.meta.url).pathname;
process.chdir(root);

const c = { red: (s) => `\x1b[31m${s}\x1b[0m`, green: (s) => `\x1b[32m${s}\x1b[0m`, dim: (s) => `\x1b[2m${s}\x1b[0m` };
const say = (s) => console.log(`  ${s}`);
const fail = (s) => {
  console.error(`\n  ${c.red('✗')} ${s}\n`);
  process.exit(1);
};

function git(...args) {
  try {
    return { ok: true, out: execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim() };
  } catch (e) {
    return { ok: false, out: String(e.stderr || e.message).trim() };
  }
}

const lockHash = () =>
  createHash('sha1')
    .update(existsSync('yarn.lock') ? readFileSync('yarn.lock') : '')
    .update(readFileSync('package.json'))
    .digest('hex');

console.log('\n  ✏️  Inhalte-Editor · Ballettschule Hagenaars\n');

if (!here) {
  const before = lockHash();
  const branch = git('rev-parse', '--abbrev-ref', 'HEAD').out;
  const dirty = git('status', '--porcelain').out.split('\n').filter(Boolean);
  const nonContent = dirty.filter((l) => !/ src\/(content\/data|assets\/content)\//.test(l));

  if (branch !== BRANCH) {
    if (dirty.length) {
      fail(`Es gibt ungespeicherte Änderungen auf „${branch}“. Bitte erst committen oder stashen – oder „yarn cms:here“ nutzen.`);
    }
    say(`Wechsle zum Inhalts-Zweig „${BRANCH}“ …`);
    git('fetch', 'origin');
    if (git('rev-parse', '--verify', '--quiet', BRANCH).ok) {
      git('switch', BRANCH);
    } else if (git('rev-parse', '--verify', '--quiet', `origin/${BRANCH}`).ok) {
      git('switch', '-c', BRANCH, '--track', `origin/${BRANCH}`);
    } else {
      say(`Lege „${BRANCH}“ neu an (Basis: prod) …`);
      const r = git('switch', '-c', BRANCH, 'origin/prod');
      if (!r.ok) fail(`Konnte den Zweig nicht anlegen: ${r.out}`);
      const p = git('push', '-u', 'origin', BRANCH);
      if (!p.ok) say(c.dim(`(Hochladen später: ${p.out.split('\n')[0]})`));
    }
  } else if (nonContent.length) {
    fail('Es gibt Änderungen außerhalb der Inhalte. Bitte Luc fragen.');
  }

  // Get the latest content + the latest released website code.
  if (!dirty.length || branch !== BRANCH) {
    say('Hole die neueste Version von GitHub …');
    if (git('fetch', 'origin').ok) {
      for (const ref of [`origin/${BRANCH}`, 'origin/prod']) {
        if (!git('rev-parse', '--verify', '--quiet', ref).ok) continue;
        const m = git('merge', '--no-edit', ref);
        if (!m.ok) {
          git('merge', '--abort');
          fail(`Konflikt beim Aktualisieren mit ${ref}. Bitte Luc fragen.`);
        }
      }
    } else {
      say(c.dim('Offline – arbeite mit der vorhandenen Version.'));
    }
  } else {
    say(c.dim('Es gibt noch nicht veröffentlichte Änderungen – Aktualisierung übersprungen.'));
  }

  if (!git('config', 'user.name').out) git('config', 'user.name', 'Inhalte-Editor');
  if (!git('config', 'user.email').out) git('config', 'user.email', 'info@hagenaars-ballett.de');

  if (lockHash() !== before || !existsSync('node_modules')) {
    say('Installiere Aktualisierungen …');
    execFileSync(process.platform === 'win32' ? 'yarn.cmd' : 'yarn', ['install'], { stdio: 'inherit' });
  }
} else {
  say(c.dim('Entwicklermodus: Zweig wird nicht gewechselt, Veröffentlichen ist deaktiviert.'));
}

say(c.green('Starte Editor … (Fenster offen lassen, zum Beenden Ctrl+C)'));
const passThrough = process.argv.slice(2).filter((a) => a !== '--here');
const vite = spawn(
  process.platform === 'win32' ? 'yarn.cmd' : 'yarn',
  ['vite', '--mode', 'cms', '--open', '/cms/', ...passThrough],
  { stdio: 'inherit' },
);
vite.on('exit', (code) => process.exit(code ?? 0));
