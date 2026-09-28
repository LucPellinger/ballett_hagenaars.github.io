import { existsSync, readFileSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { join, normalize } from 'node:path';
import { collectionById, collections, COLLECTION_IDS, type AllContent, type CollectionId } from '../../src/content/collections.ts';
import { findPlaceholders, validateAll, type ContentIssue } from '../../src/content/validate.ts';
import { git } from './exec.ts';
import { CONTENT_BRANCH, CONTENT_PATHS, currentBranch, remoteInfo, unpushedCount, workingChanges } from './gitInfo.ts';
import { currentJob, startPublish, type PublishMode } from './publish.ts';

const MAX_UPLOAD = 15 * 1024 * 1024;

export function createApi(root: string) {
  const dataDir = join(root, 'src/content/data');
  const imgDir = join(root, 'src/assets/content');
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as { homepage?: string };

  const imageExists = (src: string) => existsSync(join(imgDir, normalize(src)));

  async function readAll(): Promise<AllContent> {
    const entries = await Promise.all(
      collections.map(async (c) => [c.id, JSON.parse(await readFile(join(dataDir, c.file), 'utf8'))] as const),
    );
    return Object.fromEntries(entries) as AllContent;
  }

  const key = (i: ContentIssue) => `${i.collection}|${i.path.join('.')}|${i.message}`;

  async function saveCollection(id: CollectionId, data: unknown) {
    const all = await readAll();
    const before = new Set(validateAll(all, { imageExists }).map(key));
    const next = { ...all, [id]: data };
    const after = validateAll(next, { imageExists });
    // Block when this collection is invalid, or when the change breaks another collection (e.g. a deleted course still in the timetable).
    const blocking = after.filter((i) => i.collection === id || !before.has(key(i)));
    if (blocking.length) return { ok: false as const, issues: blocking };
    await writeFile(join(dataDir, collectionById[id].file), JSON.stringify(data, null, 2) + '\n');
    return { ok: true as const, issues: [] };
  }

  async function status() {
    const branch = await currentBranch(root);
    const changes = await workingChanges(root);
    const remote = await remoteInfo(root);
    const onContentBranch = branch === CONTENT_BRANCH;
    const unpushed = onContentBranch ? await unpushedCount(root) : 0;
    return {
      branch,
      contentBranch: CONTENT_BRANCH,
      onContentBranch,
      changes: changes.content,
      otherChanges: changes.other,
      unpushed,
      remote,
      homepage: pkg.homepage,
      canPublish: onContentBranch && changes.other.length === 0,
      reason: !onContentBranch
        ? `Veröffentlichen ist nur auf dem Zweig „${CONTENT_BRANCH}“ möglich (aktuell: ${branch}). Editor mit „yarn cms“ starten.`
        : changes.other.length
          ? 'Es gibt Änderungen außerhalb der Inhalte – bitte Luc fragen.'
          : undefined,
    };
  }

  async function upload(req: IncomingMessage, url: URL) {
    const folder = url.searchParams.get('folder') ?? '';
    const rawName = url.searchParams.get('name') ?? 'bild';
    if (!(COLLECTION_IDS as readonly string[]).includes(folder)) throw new HttpError(400, 'Unbekannter Ordner.');
    const match = rawName.toLowerCase().match(/^(.*?)(\.(png|jpe?g|webp|svg|gif|avif))?$/);
    const ext = match?.[3] ?? 'webp';
    const base =
      (match?.[1] ?? 'bild')
        .replace(/ä/g, 'ae')
        .replace(/ö/g, 'oe')
        .replace(/ü/g, 'ue')
        .replace(/ß/g, 'ss')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 40) || 'bild';
    const body = await readBody(req, MAX_UPLOAD);
    if (ext === 'svg' && /<script/i.test(body.toString('utf8'))) throw new HttpError(400, 'SVG mit Skript ist nicht erlaubt.');
    await mkdir(join(imgDir, folder), { recursive: true });
    let name = `${base}.${ext}`;
    for (let n = 2; existsSync(join(imgDir, folder, name)); n++) name = `${base}-${n}.${ext}`;
    await writeFile(join(imgDir, folder, name), body);
    return { src: `${folder}/${name}` };
  }

  async function discard() {
    await git(root, 'checkout', '--', ...CONTENT_PATHS);
    await git(root, 'clean', '-fdq', '--', ...CONTENT_PATHS);
    return { ok: true };
  }

  async function sync() {
    const s = await status();
    if (!s.onContentBranch) throw new HttpError(409, s.reason ?? 'Falscher Zweig.');
    if (s.changes.length) throw new HttpError(409, 'Bitte zuerst veröffentlichen oder Änderungen verwerfen.');
    const f = await git(root, 'fetch', 'origin');
    if (f.code !== 0) throw new HttpError(502, 'Keine Verbindung zu GitHub.');
    for (const ref of [`origin/${CONTENT_BRANCH}`, 'origin/prod']) {
      if ((await git(root, 'rev-parse', '--verify', '--quiet', ref)).code !== 0) continue;
      const m = await git(root, 'merge', '--no-edit', ref);
      if (m.code !== 0) {
        await git(root, 'merge', '--abort');
        throw new HttpError(409, `Konflikt mit ${ref} – bitte Luc fragen.`);
      }
    }
    return { ok: true };
  }

  return async function handle(req: IncomingMessage, res: ServerResponse) {
    const url = new URL(req.url ?? '/', 'http://localhost');
    const path = url.pathname.replace(/\/+$/, '');
    const method = req.method ?? 'GET';
    try {
      if (method === 'GET' && path === '/content') {
        const all = await readAll();
        return json(res, 200, { data: all, placeholders: findPlaceholders(all), issues: validateAll(all, { imageExists }) });
      }
      const m = path.match(/^\/content\/([a-z]+)$/);
      if (method === 'PUT' && m) {
        const id = m[1] as CollectionId;
        if (!(COLLECTION_IDS as readonly string[]).includes(id)) throw new HttpError(404, 'Unbekannter Bereich.');
        const body = JSON.parse((await readBody(req, 5 * 1024 * 1024)).toString('utf8')) as unknown;
        const result = await saveCollection(id, body);
        return json(res, result.ok ? 200 : 422, result);
      }
      if (method === 'POST' && path === '/upload') return json(res, 200, await upload(req, url));
      if (method === 'GET' && path === '/status') return json(res, 200, await status());
      if (method === 'POST' && path === '/discard') return json(res, 200, await discard());
      if (method === 'POST' && path === '/sync') return json(res, 200, await sync());
      if (method === 'POST' && path === '/publish') {
        const body = JSON.parse((await readBody(req, 64 * 1024)).toString('utf8')) as { mode?: PublishMode; message?: string };
        const mode: PublishMode = body.mode === 'live' ? 'live' : 'preview';
        const job = startPublish({ root, readAll, imageExists, homepage: pkg.homepage }, mode, body.message ?? '');
        return json(res, 202, job);
      }
      if (method === 'GET' && path === '/publish') return json(res, 200, currentJob());
      throw new HttpError(404, 'Nicht gefunden.');
    } catch (err) {
      const e = err instanceof HttpError ? err : new HttpError(500, err instanceof Error ? err.message : String(err));
      return json(res, e.status, { error: e.message });
    }
  };
}

class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

function json(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function readBody(req: IncomingMessage, limit: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    req.on('data', (c: Buffer) => {
      size += c.length;
      if (size > limit) {
        reject(new HttpError(413, 'Datei zu groß.'));
        req.destroy();
      } else chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}
