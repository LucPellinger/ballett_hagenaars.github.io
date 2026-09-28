import { collectionForFile } from '../../src/content/collections.ts';
import { git } from './exec.ts';

export const CONTENT_BRANCH = 'content-management';
export const CONTENT_PATHS = ['src/content/data', 'src/assets/content'];

export interface ChangedFile {
  path: string;
  state: 'geändert' | 'neu' | 'gelöscht';
  label: string;
}

export async function currentBranch(root: string) {
  return (await git(root, 'rev-parse', '--abbrev-ref', 'HEAD')).stdout.trim();
}

/** Uncommitted changes, split into content (editor) and other files. */
export async function workingChanges(root: string) {
  const res = await git(root, 'status', '--porcelain', '--untracked-files=all');
  const content: ChangedFile[] = [];
  const other: string[] = [];
  for (const line of res.stdout.split('\n').filter(Boolean)) {
    const code = line.slice(0, 2);
    const path = line.slice(3).replace(/^"|"$/g, '');
    if (CONTENT_PATHS.some((p) => path.startsWith(p))) {
      const state = code.includes('?') || code.includes('A') ? 'neu' : code.includes('D') ? 'gelöscht' : 'geändert';
      const coll = collectionForFile(path);
      content.push({ path, state, label: coll ? coll.label : `Bild ${path.replace('src/assets/content/', '')}` });
    } else {
      other.push(path);
    }
  }
  return { content, other };
}

export interface RemoteInfo {
  owner: string;
  repo: string;
  webUrl: string;
}

export async function remoteInfo(root: string): Promise<RemoteInfo | null> {
  const url = (await git(root, 'remote', 'get-url', 'origin')).stdout.trim();
  const m = url.match(/[:/]([^/:]+)\/([^/]+?)(?:\.git)?$/);
  if (!m) return null;
  return { owner: m[1]!, repo: m[2]!, webUrl: `https://github.com/${m[1]}/${m[2]}` };
}

/** Commits on the content branch that are not yet on GitHub. */
export async function unpushedCount(root: string): Promise<number> {
  const res = await git(root, 'rev-list', '--count', `origin/${CONTENT_BRANCH}..HEAD`);
  return res.code === 0 ? Number(res.stdout.trim()) || 0 : 0;
}
