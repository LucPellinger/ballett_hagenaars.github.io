import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { collectionById, collectionForFile, type AllContent, type CollectionId } from '@/content/collections';
import { findPlaceholders, validateAll, type ContentIssue } from '@/content/validate';
import { api, type PublishJob, type Status } from './api';
import { ListEditor } from './components/ListEditor';
import { PublishDialog } from './components/PublishDialog';
import { Sidebar } from './components/Sidebar';
import { SingleEditor } from './components/SingleEditor';
import { Toasts, type Toast } from './components/Toasts';
import { prepare } from './prepare';

type Drafts = Partial<Record<CollectionId, unknown>>;

export function App() {
  const [data, setData] = useState<AllContent | null>(null);
  const [loadError, setLoadError] = useState('');
  const [drafts, setDrafts] = useState<Drafts>({});
  const [active, setActive] = useState<CollectionId>(() => (sessionStorage.getItem('cms-active') as CollectionId) || 'courses');
  const [serverIssues, setServerIssues] = useState<ContentIssue[]>([]);
  const [status, setStatus] = useState<Status | null>(null);
  const [job, setJob] = useState<PublishJob | null>(null);
  const [publishOpen, setPublishOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  const notify = useCallback((msg: string, kind: 'ok' | 'error' = 'ok') => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), kind === 'error' ? 7000 : 4000);
  }, []);

  const loadContent = useCallback(async () => {
    try {
      const res = await api.content();
      setData(res.data);
      setLoadError('');
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : String(err));
    }
  }, []);
  const loadStatus = useCallback(() => api.status().then(setStatus).catch(() => undefined), []);

  useEffect(() => {
    api
      .content()
      .then((res) => setData(res.data))
      .catch((err: unknown) => setLoadError(err instanceof Error ? err.message : String(err)));
    api
      .status()
      .then(setStatus)
      .catch(() => undefined);
    void api.job().then((j) => {
      if (j) {
        setJob(j);
        if (j.state === 'running') setPublishOpen(true);
      }
    });
    const t = setInterval(() => void loadStatus(), 15000);
    return () => clearInterval(t);
  }, [loadStatus]);

  useEffect(() => sessionStorage.setItem('cms-active', active), [active]);

  // Poll the running publish job
  useEffect(() => {
    if (job?.state !== 'running') return;
    const t = setInterval(async () => {
      const j = await api.job();
      if (!j) return;
      setJob(j);
      if (j.state !== 'running') {
        void loadStatus();
        void loadContent();
        notify(j.state === 'success' ? 'Veröffentlicht!' : 'Veröffentlichen fehlgeschlagen – Website unverändert.', j.state === 'success' ? 'ok' : 'error');
      }
    }, 2000);
    return () => clearInterval(t);
  }, [job?.state, loadContent, loadStatus, notify]);

  const def = collectionById[active];
  const saved = data?.[active];
  const current = drafts[active] ?? saved;

  const prepared = useMemo(() => (data && current !== undefined ? prepare(active, current, data) : undefined), [active, current, data]);

  const liveIssues = useMemo(() => {
    if (!data || prepared === undefined) return [];
    return validateAll({ ...data, [active]: prepared }).filter((i) => i.collection === active);
  }, [data, prepared, active]);
  const issues = useMemo(() => {
    const seen = new Set(liveIssues.map((i) => i.path.join('.') + i.message));
    return [...liveIssues, ...serverIssues.filter((i) => i.collection === active && !seen.has(i.path.join('.') + i.message))];
  }, [liveIssues, serverIssues, active]);

  const isDirty = useCallback(
    (id: CollectionId) => drafts[id] !== undefined && !!data && JSON.stringify(prepare(id, drafts[id], data)) !== JSON.stringify(data[id]),
    [drafts, data],
  );
  const unsaved = useMemo(() => new Set((Object.keys(drafts) as CollectionId[]).filter(isDirty)), [drafts, isDirty]);
  const unpublished = useMemo(
    () => new Set((status?.changes ?? []).map((c) => collectionForFile(c.path)?.id).filter((x): x is CollectionId => !!x)),
    [status],
  );
  const placeholders = useMemo(() => (data ? findPlaceholders(data) : []), [data]);
  const placeholderCount = useMemo(() => {
    const m: Record<string, number> = {};
    for (const p of placeholders) m[p.collection] = (m[p.collection] ?? 0) + 1;
    return m;
  }, [placeholders]);

  // Warn before closing the tab with unsaved changes
  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => {
      if (unsaved.size) e.preventDefault();
    };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [unsaved]);

  const setDraft = (v: unknown) => {
    setDrafts((d) => ({ ...d, [active]: v }));
    setServerIssues([]);
  };

  const save = useCallback(async () => {
    if (!data || prepared === undefined || saving) return;
    if (liveIssues.length) {
      notify(`Bitte zuerst ${liveIssues.length} Fehler beheben (rot markiert).`, 'error');
      return;
    }
    setSaving(true);
    try {
      const res = await api.save(active, prepared);
      if (res.ok) {
        setData({ ...data, [active]: prepared });
        setDrafts((d) => {
          const n = { ...d };
          delete n[active];
          return n;
        });
        setServerIssues([]);
        notify('Gespeichert – die Vorschau ist aktualisiert.');
        void loadStatus();
      } else {
        setServerIssues(res.issues);
        const other = res.issues.find((i) => i.collection !== active);
        notify(
          other
            ? `Nicht gespeichert: Das würde „${collectionById[other.collection].label}“ beschädigen – ${other.message}`
            : 'Nicht gespeichert – bitte die rot markierten Felder prüfen.',
          'error',
        );
      }
    } catch (err) {
      notify(err instanceof Error ? err.message : String(err), 'error');
    } finally {
      setSaving(false);
    }
  }, [active, data, prepared, liveIssues.length, saving, notify, loadStatus]);

  const revert = () => {
    setDrafts((d) => {
      const n = { ...d };
      delete n[active];
      return n;
    });
    setServerIssues([]);
  };

  // Ctrl/Cmd + S
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        void save();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [save]);

  const discardAll = async () => {
    if (!window.confirm('Alle gespeicherten, aber noch nicht veröffentlichten Änderungen verwerfen? Das kann nicht rückgängig gemacht werden.')) return;
    await api.discard();
    setDrafts({});
    await loadContent();
    await loadStatus();
    notify('Änderungen verworfen.');
  };

  const sync = async () => {
    try {
      await api.sync();
      await loadContent();
      await loadStatus();
      notify('Auf dem neuesten Stand.');
    } catch (err) {
      notify(err instanceof Error ? err.message : String(err), 'error');
    }
  };

  const startPublish = async (mode: 'preview' | 'live', message: string) => {
    try {
      setJob(await api.publish(mode, message));
    } catch (err) {
      notify(err instanceof Error ? err.message : String(err), 'error');
    }
  };

  if (loadError) {
    return (
      <div className="fatal">
        <h1>Editor nicht erreichbar</h1>
        <p>{loadError}</p>
        <p>Läuft „yarn cms“ im Terminal noch?</p>
      </div>
    );
  }
  if (!data) return <div className="fatal">Lade Inhalte …</div>;

  const dirty = unsaved.has(active);
  const pendingChanges = status?.changes.length ?? 0;

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-small">Ballettschule</span>
          <span className="brand-name">Hagenaars</span>
          <span className="brand-tag">Inhalte-Editor</span>
        </div>
        <div className="topbar-status">
          {!status?.onContentBranch && status && <span className="pill pill--warn">Entwicklermodus ({status.branch})</span>}
          {pendingChanges > 0 && (
            <span className="pill">
              {pendingChanges} {pendingChanges === 1 ? 'Änderung' : 'Änderungen'} noch nicht veröffentlicht
              <button type="button" className="link-btn" onClick={() => void discardAll()}>
                verwerfen
              </button>
            </span>
          )}
          {job?.state === 'running' && (
            <button type="button" className="pill pill--busy" onClick={() => setPublishOpen(true)}>
              Veröffentlichung läuft …
            </button>
          )}
        </div>
        <div className="topbar-actions">
          <a className="btn" href={def.previewPath} target="_blank" rel="noreferrer">
            Vorschau ansehen ↗
          </a>
          <button type="button" className="btn btn--primary" onClick={() => setPublishOpen(true)}>
            Veröffentlichen …
          </button>
        </div>
      </header>

      <Sidebar
        active={active}
        onSelect={setActive}
        unsaved={unsaved}
        unpublished={unpublished}
        placeholders={placeholderCount}
        status={status}
        onSync={() => void sync()}
      />

      <main className="main">
        <div className="main-head">
          <h1>{def.label}</h1>
          <p className="help">{def.description}</p>
        </div>
        {def.kind === 'list' ? (
          <ListEditor
            key={active}
            def={def}
            list={(current as Record<string, unknown>[]) ?? []}
            onChange={setDraft}
            all={data}
            issues={issues}
            notify={notify}
          />
        ) : (
          <SingleEditor key={active} def={def} value={current} onChange={setDraft} all={data} issues={issues} notify={notify} />
        )}
      </main>

      <div className={`savebar ${dirty ? 'is-visible' : ''}`} aria-hidden={!dirty}>
        <span>
          {issues.length ? <strong className="err">{issues.length} Fehler – bitte beheben</strong> : <strong>Ungespeicherte Änderungen</strong>}
          <span className="help"> · Speichern aktualisiert die Vorschau auf diesem Computer (Strg/⌘ + S)</span>
        </span>
        <span className="savebar-actions">
          <button type="button" className="btn" onClick={revert} tabIndex={dirty ? 0 : -1}>
            Rückgängig
          </button>
          <button type="button" className="btn btn--primary" onClick={() => void save()} disabled={saving} tabIndex={dirty ? 0 : -1}>
            {saving ? 'Speichere …' : 'Speichern'}
          </button>
        </span>
      </div>

      <PublishDialog
        open={publishOpen}
        onClose={() => {
          setPublishOpen(false);
          if (job && job.state !== 'running') setJob(null);
        }}
        status={status}
        job={job}
        unsavedCount={unsaved.size}
        placeholders={placeholders}
        onStart={(m, msg) => void startPublish(m, msg)}
      />
      <Toasts toasts={toasts} />
    </div>
  );
}
