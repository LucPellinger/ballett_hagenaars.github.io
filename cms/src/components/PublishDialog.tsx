import { useEffect, useRef, useState } from 'react';
import type { PublishJob, Status } from '../api';

export interface PublishDialogProps {
  open: boolean;
  onClose: () => void;
  status: Status | null;
  job: PublishJob | null;
  unsavedCount: number;
  placeholders: { label: string }[];
  onStart: (mode: 'preview' | 'live', message: string) => void;
}

const ICON = { pending: '○', running: '◐', done: '✓', failed: '✕', skipped: '–' } as const;

export function PublishDialog({ open, onClose, status, job, unsavedCount, placeholders, onStart }: PublishDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const [mode, setMode] = useState<'preview' | 'live'>(placeholders.length ? 'preview' : 'live');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const running = job?.state === 'running';
  const showJob = job && (running || open);
  const changes = [...new Set((status?.changes ?? []).map((c) => c.label))];
  const nothing = changes.length === 0 && (status?.unpushed ?? 0) === 0;
  const liveBlocked = placeholders.length > 0;
  const canStart = !!status?.canPublish && unsavedCount === 0 && !(mode === 'live' && liveBlocked);

  return (
    <dialog ref={ref} className="dialog" onClose={onClose} onCancel={(e) => running && e.preventDefault()}>
      <div className="dialog-head">
        <h2>Veröffentlichen</h2>
        {!running && (
          <button type="button" className="icon-btn" aria-label="Schließen" onClick={onClose}>
            ✕
          </button>
        )}
      </div>

      {showJob && job ? (
        <div className="job">
          <p className="job-mode">{job.mode === 'live' ? 'Live-Website' : 'Vorschau'}</p>
          <ol className="steps">
            {job.steps.map((s) => (
              <li key={s.id} className={`step step--${s.status}`}>
                <span className="step-icon" aria-hidden="true">
                  {ICON[s.status]}
                </span>
                <div>
                  <p className="step-label">{s.label}</p>
                  {s.detail && <p className="step-detail">{s.detail}</p>}
                  {s.log && (
                    <details>
                      <summary>Details</summary>
                      <pre>{s.log}</pre>
                    </details>
                  )}
                  {s.link && (
                    <a href={s.link} target="_blank" rel="noreferrer">
                      Bei GitHub ansehen ↗
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ol>
          {job.state === 'success' && (
            <div className="callout callout--ok">
              <strong>Fertig! Die {job.mode === 'live' ? 'Website' : 'Vorschau'} ist aktualisiert.</strong>
              {job.siteUrl && (
                <p>
                  <a href={job.siteUrl} target="_blank" rel="noreferrer">
                    Website öffnen ↗
                  </a>{' '}
                  (evtl. einmal neu laden)
                </p>
              )}
            </div>
          )}
          {job.state === 'failed' && (
            <div className="callout callout--error">
              <strong>Nicht veröffentlicht – die Website ist unverändert.</strong>
              <p>Ihre Änderungen bleiben hier gespeichert. Fehler beheben und erneut veröffentlichen.</p>
            </div>
          )}
          {running ? <p className="help">Bitte dieses Fenster offen lassen …</p> : (
            <div className="dialog-actions">
              <button type="button" className="btn btn--primary" onClick={onClose}>
                Schließen
              </button>
            </div>
          )}
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (canStart) onStart(mode, message);
          }}
        >
          <section className="dialog-section">
            <h3>Was wird veröffentlicht?</h3>
            {nothing ? (
              <p className="help">Keine neuen Änderungen – die aktuelle Version wird erneut veröffentlicht.</p>
            ) : (
              <ul className="change-list">
                {changes.map((c) => (
                  <li key={c}>{c}</li>
                ))}
                {(status?.unpushed ?? 0) > 0 && <li>{status!.unpushed} gespeicherte Version(en), noch nicht hochgeladen</li>}
              </ul>
            )}
            {unsavedCount > 0 && <p className="callout callout--warn">Es gibt noch {unsavedCount} ungespeicherte Bereiche. Bitte zuerst speichern.</p>}
            {status && !status.canPublish && <p className="callout callout--warn">{status.reason}</p>}
          </section>

          <section className="dialog-section">
            <label htmlFor="pub-msg">
              <h3>Kurze Beschreibung</h3>
            </label>
            <input id="pub-msg" type="text" placeholder="z. B. Stundenplan für Herbst aktualisiert" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={64} />
          </section>

          <fieldset className="dialog-section">
            <legend>
              <h3>Wohin?</h3>
            </legend>
            <label className={`choice ${mode === 'preview' ? 'is-on' : ''}`}>
              <input type="radio" name="mode" value="preview" checked={mode === 'preview'} onChange={() => setMode('preview')} />
              <span>
                <strong>Vorschau</strong> – Testversion mit Hinweis-Banner. Beispielinhalte sind erlaubt. Gut zum Zeigen und Prüfen.
              </span>
            </label>
            <label className={`choice ${mode === 'live' ? 'is-on' : ''} ${liveBlocked ? 'is-disabled' : ''}`}>
              <input type="radio" name="mode" value="live" checked={mode === 'live'} disabled={liveBlocked} onChange={() => setMode('live')} />
              <span>
                <strong>Live-Website</strong> – für alle Besucher.
                {liveBlocked && (
                  <>
                    {' '}
                    Erst möglich, wenn keine Beispielinhalte mehr vorhanden sind ({placeholders.length}):
                    <span className="placeholder-list">{placeholders.slice(0, 8).map((p) => p.label).join(', ')}{placeholders.length > 8 ? ' …' : ''}</span>
                  </>
                )}
              </span>
            </label>
          </fieldset>

          <p className="help">
            Vor dem Veröffentlichen wird alles automatisch geprüft. Wenn etwas nicht stimmt, bleibt die Website unverändert.
          </p>
          <div className="dialog-actions">
            <button type="button" className="btn" onClick={onClose}>
              Abbrechen
            </button>
            <button type="submit" className="btn btn--primary" disabled={!canStart}>
              {mode === 'live' ? 'Jetzt live veröffentlichen' : 'Vorschau veröffentlichen'}
            </button>
          </div>
        </form>
      )}
    </dialog>
  );
}
