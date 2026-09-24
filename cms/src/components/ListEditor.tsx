import { useMemo, useState } from 'react';
import type { AllContent, CollectionDef } from '@/content/collections';
import type { ContentIssue } from '@/content/validate';
import { api } from '../api';
import { Field } from '../form/Field';
import { FormContext } from '../form/FormContext';
import { defaultFor, pathKey, toJS } from '../form/jsonSchema';
import { isImageFile, prepareImage } from '../imageTools';

type Item = Record<string, unknown>;

export interface ListEditorProps {
  def: CollectionDef;
  list: Item[];
  onChange: (list: Item[]) => void;
  all: AllContent;
  issues: ContentIssue[];
  notify: (msg: string, kind?: 'ok' | 'error') => void;
}

export function ListEditor({ def, list, onChange, all, issues, notify }: ListEditorProps) {
  const [selected, setSelected] = useState(0);
  const [query, setQuery] = useState('');
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropOver, setDropOver] = useState(false);
  const [uploading, setUploading] = useState(0);
  const itemJS = useMemo(() => toJS(def.itemSchema!), [def]);
  const current = list[selected];

  const errorsByIndex = useMemo(() => {
    const m = new Map<number, number>();
    for (const i of issues) if (typeof i.path[0] === 'number') m.set(i.path[0], (m.get(i.path[0]) ?? 0) + 1);
    return m;
  }, [issues]);

  const visible = list
    .map((item, index) => ({ item, index, label: def.itemLabel?.(item, all) ?? String(item.id), sub: def.itemSubLabel?.(item, all) ?? '' }))
    .filter((x) => !query || `${x.label} ${x.sub}`.toLowerCase().includes(query.toLowerCase()));

  const add = (item?: Item) => {
    const next = [...list, item ?? ((def.newItem?.() ?? defaultFor(itemJS)) as Item)];
    onChange(next);
    setSelected(next.length - 1);
  };
  const duplicate = () => {
    if (!current) return;
    const copy = structuredClone(current);
    copy.id = '';
    const next = [...list.slice(0, selected + 1), copy, ...list.slice(selected + 1)];
    onChange(next);
    setSelected(selected + 1);
  };
  const remove = () => {
    if (!current) return;
    const label = def.itemLabel?.(current, all) ?? 'Eintrag';
    if (!window.confirm(`„${label}“ wirklich löschen?`)) return;
    onChange(list.filter((_, i) => i !== selected));
    setSelected(Math.max(0, selected - 1));
  };
  const move = (from: number, to: number) => {
    if (to < 0 || to >= list.length || from === to) return;
    const next = [...list];
    const [x] = next.splice(from, 1);
    next.splice(to, 0, x!);
    onChange(next);
    setSelected(to);
  };

  async function dropImages(files: FileList) {
    const field = def.dropCreatesImageIn;
    if (!field) return;
    const images = Array.from(files).filter(isImageFile);
    if (!images.length) return notify('Keine Bilddateien gefunden.', 'error');
    setUploading(images.length);
    const created: Item[] = [];
    for (const file of images) {
      try {
        const p = await prepareImage(file, toJS(def.itemSchema!).properties?.[field]?.maxWidth);
        const { src } = await api.upload(def.id, p.name, p.blob);
        const item = (def.newItem?.() ?? {}) as Item;
        item[field] = { src, alt: { de: '' }, width: p.width, height: p.height };
        created.push(item);
      } catch (err) {
        notify(`${file.name}: ${err instanceof Error ? err.message : String(err)}`, 'error');
      }
      setUploading((n) => n - 1);
    }
    if (created.length) {
      onChange([...list, ...created]);
      setSelected(list.length);
      notify(`${created.length} Foto(s) hinzugefügt – bitte jeweils eine Bildbeschreibung eintragen und speichern.`);
    }
  }

  const relErrors = (path: (string | number)[]) => {
    const key = pathKey([selected, ...path]);
    return issues.filter((i) => pathKey(i.path) === key).map((i) => i.message);
  };

  return (
    <div className="list-editor">
      <div className="list-pane">
        <div className="list-tools">
          <input type="search" placeholder="Suchen …" aria-label="Einträge durchsuchen" value={query} onChange={(e) => setQuery(e.target.value)} />
          <button type="button" className="btn btn--primary btn--small" onClick={() => add()}>
            + {def.itemNoun ?? 'Eintrag'}
          </button>
        </div>
        {def.dropCreatesImageIn && (
          // Mouse-only convenience; keyboard users add photos via "+ Foto" and the file picker.
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions
          <div
            className={`dropzone dropzone--list ${dropOver ? 'is-over' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDropOver(true);
            }}
            onDragLeave={() => setDropOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDropOver(false);
              if (e.dataTransfer.files.length) void dropImages(e.dataTransfer.files);
            }}
          >
            {uploading > 0 ? <strong>Lade {uploading} Foto(s) hoch …</strong> : <strong>Mehrere Fotos auf einmal hierher ziehen</strong>}
          </div>
        )}
        <ul className="item-list">
          {visible.map(({ item, index, label, sub }) => (
            // Drag to reorder is a mouse shortcut; the ↑/↓ buttons are the keyboard alternative.
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <li
              key={index}
              draggable={!query}
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (dragIndex !== null) move(dragIndex, index);
                setDragIndex(null);
              }}
              className={dragIndex === index ? 'is-dragging' : ''}
            >
              <button
                type="button"
                className={`item ${index === selected ? 'is-active' : ''}`}
                aria-current={index === selected ? 'true' : undefined}
                onClick={() => setSelected(index)}
              >
                <span className="item-handle" aria-hidden="true">
                  ⋮⋮
                </span>
                <span className="item-text">
                  <span className="item-label">{label}</span>
                  {sub && <span className="item-sub">{sub}</span>}
                </span>
                <span className="item-flags">
                  {item.status === 'placeholder' && <span className="tag tag--placeholder">Beispiel</span>}
                  {errorsByIndex.get(index) ? <span className="tag tag--error">{errorsByIndex.get(index)} Fehler</span> : null}
                </span>
              </button>
            </li>
          ))}
          {visible.length === 0 && <li className="empty">Keine Einträge.</li>}
        </ul>
        <p className="help">Reihenfolge ändern: Eintrag mit der Maus verschieben.</p>
      </div>

      <div className="detail-pane">
        {current ? (
          <>
            <div className="detail-head">
              <h2>{def.itemLabel?.(current, all) ?? 'Eintrag'}</h2>
              <div className="detail-actions">
                <button type="button" className="btn btn--small" onClick={() => move(selected, selected - 1)} disabled={selected === 0} aria-label="Nach oben">
                  ↑
                </button>
                <button type="button" className="btn btn--small" onClick={() => move(selected, selected + 1)} disabled={selected === list.length - 1} aria-label="Nach unten">
                  ↓
                </button>
                <button type="button" className="btn btn--small" onClick={duplicate}>
                  Duplizieren
                </button>
                <button type="button" className="btn btn--small btn--danger" onClick={remove}>
                  Löschen
                </button>
              </div>
            </div>
            <FormContext.Provider value={{ all, collection: def.id, errorsAt: relErrors, notify }}>
              <Field schema={itemJS} value={current} path={[]} onChange={(v) => onChange(list.map((x, i) => (i === selected ? (v as Item) : x)))} />
            </FormContext.Provider>
          </>
        ) : (
          <div className="empty-state">
            <p>Noch keine Einträge.</p>
            <button type="button" className="btn btn--primary" onClick={() => add()}>
              + {def.itemNoun ?? 'Eintrag'} anlegen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
