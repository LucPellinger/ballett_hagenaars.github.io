import { run } from './exec.ts';
import type { RemoteInfo } from './gitInfo.ts';

let token: string | null | undefined;

/** Optional token (public repos work without). Uses $GITHUB_TOKEN or the GitHub CLI if logged in. */
async function authToken(cwd: string): Promise<string | null> {
  if (token !== undefined) return token;
  token = process.env.GITHUB_TOKEN ?? null;
  if (!token) {
    const res = await run('gh', ['auth', 'token'], cwd);
    token = res.code === 0 ? res.stdout.trim() || null : null;
  }
  return token;
}

async function api<T>(cwd: string, path: string): Promise<T> {
  const t = await authToken(cwd);
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'ballett-hagenaars-cms',
      ...(t ? { Authorization: `Bearer ${t}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  return (await res.json()) as T;
}

export interface WorkflowRun {
  id: number;
  name: string;
  status: 'queued' | 'in_progress' | 'completed' | 'waiting' | 'requested' | 'pending';
  conclusion: 'success' | 'failure' | 'cancelled' | 'skipped' | 'timed_out' | 'action_required' | null;
  html_url: string;
}

export async function findRun(cwd: string, remote: RemoteInfo, sha: string, workflowName: string) {
  const data = await api<{ workflow_runs: WorkflowRun[] }>(
    cwd,
    `/repos/${remote.owner}/${remote.repo}/actions/runs?head_sha=${sha}&per_page=20`,
  );
  return data.workflow_runs.find((r) => r.name === workflowName) ?? null;
}

interface Job {
  name: string;
  conclusion: string | null;
  steps?: { name: string; conclusion: string | null }[];
}

/** Human-readable (German) explanation of why a run failed. */
export async function explainFailure(cwd: string, remote: RemoteInfo, runId: number): Promise<string> {
  try {
    const { jobs } = await api<{ jobs: Job[] }>(cwd, `/repos/${remote.owner}/${remote.repo}/actions/runs/${runId}/jobs`);
    const job = jobs.find((j) => j.conclusion === 'failure');
    const step = job?.steps?.find((s) => s.conclusion === 'failure')?.name ?? '';
    const where = `${job?.name ?? '?'} › ${step || '?'}`;
    if (/placeholder/i.test(step)) return `Es gibt noch Beispielinhalte – die Live-Website wurde nicht verändert. (${where})`;
    if (/typecheck|lint|test/i.test(step)) return `Die automatische Prüfung hat einen Fehler gefunden – die Website wurde nicht verändert. (${where})`;
    if (/build/i.test(step)) return `Die Website konnte nicht gebaut werden – sie wurde nicht verändert. (${where})`;
    if (/merge|prod/i.test(step)) return `Die Änderungen konnten nicht mit der Live-Version zusammengeführt werden. (${where})`;
    if (/deploy/i.test(job?.name ?? '') || /deploy/i.test(step))
      return `Das Veröffentlichen bei GitHub Pages ist fehlgeschlagen (evtl. Berechtigung für den Branch). (${where})`;
    return `Fehler bei: ${where}`;
  } catch {
    return 'Fehler bei GitHub (Details im Link).';
  }
}
