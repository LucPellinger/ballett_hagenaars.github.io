/**
 * "Veröffentlichen" – the whole release workflow behind one button:
 *   sync → validate → local checks → commit → push → wait for GitHub (CI + deploy).
 * Every step can stop the process; nothing reaches the website unless all steps pass.
 */
import { randomUUID } from 'node:crypto';
import type { AllContent } from '../../src/content/collections.ts';
import { findPlaceholders, formatIssue, validateAll } from '../../src/content/validate.ts';
import { git, tail, yarnRun } from './exec.ts';
import { CONTENT_BRANCH, CONTENT_PATHS, currentBranch, remoteInfo, workingChanges } from './gitInfo.ts';
import { explainFailure, findRun } from './github.ts';

export type PublishMode = 'preview' | 'live';
export type StepStatus = 'pending' | 'running' | 'done' | 'failed' | 'skipped';

export interface Step {
  id: string;
  label: string;
  status: StepStatus;
  detail?: string;
  log?: string;
  link?: string;
}

export interface PublishJob {
  id: string;
  mode: PublishMode;
  message: string;
  steps: Step[];
  state: 'running' | 'success' | 'failed';
  error?: string;
  siteUrl?: string;
  startedAt: number;
}

export const WORKFLOW_NAME = 'Content publish';

class StepError extends Error {
  constructor(
    message: string,
    public log?: string,
    public link?: string,
  ) {
    super(message);
  }
}

interface Ctx {
  root: string;
  readAll: () => Promise<AllContent>;
  imageExists: (src: string) => boolean;
  homepage?: string;
}

let current: PublishJob | null = null;
export const currentJob = () => current;

export function startPublish(ctx: Ctx, mode: PublishMode, message: string): PublishJob {
  if (current?.state === 'running') throw new Error('Es läuft bereits eine Veröffentlichung.');
  const job: PublishJob = {
    id: randomUUID(),
    mode,
    message,
    state: 'running',
    startedAt: Date.now(),
    steps: [
      { id: 'sync', label: 'Neueste Version von GitHub holen', status: 'pending' },
      { id: 'validate', label: 'Inhalte prüfen', status: 'pending' },
      { id: 'checks', label: 'Website testen und bauen', status: 'pending' },
      { id: 'commit', label: 'Änderungen speichern', status: 'pending' },
      { id: 'push', label: 'Zu GitHub hochladen', status: 'pending' },
      {
        id: 'ci',
        label: mode === 'live' ? 'GitHub prüft und veröffentlicht die Live-Website' : 'GitHub prüft und veröffentlicht die Vorschau',
        status: 'pending',
      },
    ],
  };
  current = job;
  void runJob(ctx, job);
  return job;
}

async function runJob(ctx: Ctx, job: PublishJob) {
  const { root } = ctx;
  let sha = '';
  const steps: Record<string, () => Promise<void>> = {
    async sync() {
      const branch = await currentBranch(root);
      if (branch !== CONTENT_BRANCH) {
        throw new StepError(`Der Editor ist nicht auf dem Inhalts-Zweig „${CONTENT_BRANCH}“ (aktuell: ${branch}). Bitte den Editor mit „yarn cms“ neu starten.`);
      }
      const { other } = await workingChanges(root);
      if (other.length) throw new StepError('Es gibt Änderungen außerhalb der Inhalte – bitte Luc fragen.', other.join('\n'));
      const fetch = await git(root, 'fetch', 'origin');
      if (fetch.code !== 0) throw new StepError('Keine Verbindung zu GitHub. Ist das Internet an?', tail(fetch.stderr));
      // Stash editor changes while merging, then restore them.
      const stashCount = async () => (await git(root, 'stash', 'list')).stdout.split('\n').filter(Boolean).length;
      const before = await stashCount();
      await git(root, 'stash', 'push', '--include-untracked', '-m', 'cms-publish', '--', ...CONTENT_PATHS);
      const stashed = (await stashCount()) > before;
      let mergeError: StepError | null = null;
      for (const ref of [`origin/${CONTENT_BRANCH}`, 'origin/prod']) {
        const exists = await git(root, 'rev-parse', '--verify', '--quiet', ref);
        if (exists.code !== 0) continue;
        const merge = await git(root, 'merge', '--no-edit', ref);
        if (merge.code !== 0) {
          await git(root, 'merge', '--abort');
          mergeError = new StepError(`Konflikt beim Zusammenführen mit ${ref} – bitte Luc fragen.`, tail(merge.stdout + merge.stderr));
          break;
        }
      }
      if (stashed) {
        const res = await git(root, 'stash', 'pop');
        if (res.code !== 0) throw new StepError('Ihre Änderungen passen nicht zur neuesten Version – bitte Luc fragen.', tail(res.stdout + res.stderr));
      }
      if (mergeError) throw mergeError;
    },

    async validate() {
      const all = await ctx.readAll();
      const issues = validateAll(all, { imageExists: ctx.imageExists });
      if (issues.length) throw new StepError(`${issues.length} Fehler in den Inhalten.`, issues.map(formatIssue).join('\n'));
      if (job.mode === 'live') {
        const ph = findPlaceholders(all);
        if (ph.length) {
          throw new StepError(
            `Es gibt noch ${ph.length} Beispielinhalte. Bitte ersetzen und den Haken „Beispielinhalt“ entfernen – oder zuerst eine Vorschau veröffentlichen.`,
            ph.map((p) => `• ${p.label}`).join('\n'),
          );
        }
      }
    },

    async checks() {
      for (const [script, label] of [
        ['typecheck', 'Typprüfung'],
        ['test', 'Tests'],
        ['build', 'Build'],
      ] as const) {
        setDetail(job, 'checks', `${label} …`);
        const res = await yarnRun(root, script);
        if (res.code !== 0) throw new StepError(`${label} fehlgeschlagen – die Website bleibt unverändert.`, tail(res.stdout + res.stderr, 40));
      }
      setDetail(job, 'checks', 'Typprüfung, Tests und Build erfolgreich');
    },

    async commit() {
      await git(root, 'add', '-A', '--', ...CONTENT_PATHS);
      const summary = job.message.replace(/\s+/g, ' ').trim().slice(0, 64) || 'Inhalte aktualisiert';
      const msg = `content: ${summary}\n\nPublish: ${job.mode}\nEdited-with: Inhalte-Editor`;
      const res = await git(root, 'commit', '--allow-empty', '-m', msg);
      if (res.code !== 0) throw new StepError('Speichern (Commit) fehlgeschlagen.', tail(res.stdout + res.stderr));
      sha = (await git(root, 'rev-parse', 'HEAD')).stdout.trim();
      setDetail(job, 'commit', `Version ${sha.slice(0, 7)}`);
    },

    async push() {
      const res = await git(root, 'push', '-u', 'origin', `HEAD:${CONTENT_BRANCH}`);
      if (res.code !== 0) {
        throw new StepError(
          'Hochladen fehlgeschlagen. Fehlt der Zugang zu GitHub (SSH-Schlüssel)? Ihre Änderungen sind lokal gespeichert – einfach später erneut versuchen.',
          tail(res.stderr),
        );
      }
    },

    async ci() {
      const remote = await remoteInfo(root);
      if (!remote) throw new StepError('GitHub-Adresse unbekannt.');
      const deadline = Date.now() + 25 * 60_000;
      let seen = false;
      while (Date.now() < deadline) {
        await sleep(seen ? 8000 : 5000);
        let run;
        try {
          run = await findRun(root, remote, sha, WORKFLOW_NAME);
        } catch {
          setDetail(job, 'ci', 'Warte auf GitHub …');
          continue;
        }
        if (!run) {
          if (Date.now() - job.startedAt > 5 * 60_000 && !seen) {
            throw new StepError('GitHub hat die Veröffentlichung nicht gestartet. Bitte Luc fragen.', undefined, `${remote.webUrl}/actions`);
          }
          setDetail(job, 'ci', 'Warte auf GitHub …');
          continue;
        }
        seen = true;
        const step = job.steps.find((s) => s.id === 'ci')!;
        step.link = run.html_url;
        if (run.status !== 'completed') {
          setDetail(job, 'ci', run.status === 'queued' ? 'In der Warteschlange …' : 'Läuft … (dauert ca. 2–3 Minuten)');
          continue;
        }
        if (run.conclusion === 'success') {
          setDetail(job, 'ci', 'Erfolgreich veröffentlicht');
          return;
        }
        throw new StepError(await explainFailure(root, remote, run.id), undefined, run.html_url);
      }
      throw new StepError('GitHub braucht ungewöhnlich lange. Bitte später im Link nachsehen.');
    },
  };

  for (const step of job.steps) {
    step.status = 'running';
    try {
      await steps[step.id]!();
      step.status = 'done';
    } catch (err) {
      step.status = 'failed';
      const e = err instanceof StepError ? err : new StepError(String(err));
      step.detail = e.message;
      step.log = e.log;
      if (e.link) step.link = e.link;
      job.error = e.message;
      job.state = 'failed';
      for (const s of job.steps) if (s.status === 'pending') s.status = 'skipped';
      return;
    }
  }
  job.state = 'success';
  job.siteUrl = ctx.homepage;
}

function setDetail(job: PublishJob, id: string, detail: string) {
  const s = job.steps.find((x) => x.id === id);
  if (s) s.detail = detail;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
