import type { AllContent, CollectionId } from '@/content/collections';
import type { ContentIssue } from '@/content/validate';

export interface ChangedFile {
  path: string;
  state: 'geändert' | 'neu' | 'gelöscht';
  label: string;
}

export interface Status {
  branch: string;
  contentBranch: string;
  onContentBranch: boolean;
  changes: ChangedFile[];
  otherChanges: string[];
  unpushed: number;
  remote: { owner: string; repo: string; webUrl: string } | null;
  homepage?: string;
  canPublish: boolean;
  reason?: string;
}

export type StepStatus = 'pending' | 'running' | 'done' | 'failed' | 'skipped';
export interface PublishJob {
  id: string;
  mode: 'preview' | 'live';
  state: 'running' | 'success' | 'failed';
  error?: string;
  siteUrl?: string;
  steps: { id: string; label: string; status: StepStatus; detail?: string; log?: string; link?: string }[];
}

const BASE = '/__cms/api';

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(BASE + path, init);
  const body = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok && res.status !== 422) throw new Error(body.error ?? `Fehler ${res.status}`);
  return body;
}

export const api = {
  content: () =>
    call<{ data: AllContent; placeholders: { collection: CollectionId; label: string }[]; issues: ContentIssue[] }>('/content'),
  save: (id: CollectionId, data: unknown) =>
    call<{ ok: boolean; issues: ContentIssue[] }>(`/content/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  upload: (folder: string, name: string, blob: Blob) =>
    call<{ src: string }>(`/upload?folder=${encodeURIComponent(folder)}&name=${encodeURIComponent(name)}`, {
      method: 'POST',
      body: blob,
    }),
  status: () => call<Status>('/status'),
  discard: () => call<{ ok: boolean }>('/discard', { method: 'POST' }),
  sync: () => call<{ ok: boolean }>('/sync', { method: 'POST' }),
  publish: (mode: 'preview' | 'live', message: string) =>
    call<PublishJob>('/publish', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode, message }) }),
  job: () => call<PublishJob | null>('/publish'),
};

/** URL to show an image from src/assets/content in the editor (served by the dev server). */
export const imagePreviewUrl = (src: string) => `/src/assets/content/${src}`;
