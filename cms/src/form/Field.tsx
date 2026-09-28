import { useId, useState, type DragEvent, type ReactNode } from 'react';
import { collectionById, type CollectionId } from '@/content/collections';
import { api, imagePreviewUrl } from '../api';
import { isImageFile, isTextFile, prepareImage, readText } from '../imageTools';
import { useForm } from './FormContext';
import { defaultFor, unwrapNullable, type JS } from './jsonSchema';

type Path = (string | number)[];

export interface FieldProps {
  schema: JS;
  value: unknown;
  onChange: (v: unknown) => void;
  path: Path;
  /** Label override (falls back to schema.title). */
  label?: string;
  required?: boolean;
  /** Top-level sections are rendered as collapsible cards. */
  depth?: number;
}

/**
 * Renders the right input for a piece of content, based on its content model.
 * Recursive: objects and lists render their children with <Field>.
 */
export function Field(props: FieldProps) {
  const { schema: raw, value, onChange, path, required = true, depth = 0 } = props;
  const { schema, nullable } = unwrapNullable(raw);
  const label = props.label ?? schema.title ?? String(path[path.length - 1] ?? '');

  // Optional group that is not set yet → "add" button
  if (!required && value === undefined && (schema.type === 'object' || schema.widget === 'localized' || schema.widget === 'image')) {
    return (
      <div className="field field--optional">
        <button type="button" className="btn btn--ghost" onClick={() => onChange(defaultFor(schema))}>
          + {label} hinzufügen
        </button>
        {schema.description && <p className="help">{schema.description}</p>}
      </div>
    );
  }
  const removeBtn = !required ? (
    <button type="button" className="link-btn" onClick={() => onChange(undefined)}>
      entfernen
    </button>
  ) : null;

  switch (schema.widget) {
    case 'localized':
      return <LocalizedField {...props} schema={schema} label={label} extra={removeBtn} />;
    case 'localizedList':
      return <LocalizedListField {...props} schema={schema} label={label} />;
    case 'image':
      return <ImageField {...props} schema={schema} label={label} extra={removeBtn} />;
    case 'status':
      return <StatusField value={value} onChange={onChange} schema={schema} />;
    case 'ref':
      return <RefField {...props} schema={schema} label={label} required={required} />;
  }

  if (schema.type === 'object') return <ObjectField {...props} schema={schema} label={label} extra={removeBtn} depth={depth} />;
  if (schema.type === 'array') {
    if (schema.items?.enum) return <EnumChecks {...props} schema={schema} label={label} />;
    return <ArrayField {...props} schema={schema} label={label} depth={depth} />;
  }
  if (schema.enum) return <EnumSelect {...props} schema={schema} label={label} />;
  if (schema.type === 'boolean') return <BoolField {...props} schema={schema} label={label} />;
  if (schema.type === 'number' || schema.type === 'integer')
    return <NumberField {...props} schema={schema} label={label} nullable={nullable} />;
  return <TextField {...props} schema={schema} label={label} required={required} />;
}

/* ───────────── shared bits ───────────── */

function Errors({ path }: { path: Path }) {
  const { errorsAt } = useForm();
  const errs = errorsAt(path);
  if (!errs.length) return null;
  return (
    <ul className="field-errors" role="alert">
      {errs.map((e) => (
        <li key={e}>{e}</li>
      ))}
    </ul>
  );
}

function Label({ htmlFor, children, extra }: { htmlFor?: string; children: ReactNode; extra?: ReactNode }) {
  return (
    <div className="field-label">
      {htmlFor ? <label htmlFor={htmlFor}>{children}</label> : <span>{children}</span>}
      {extra}
    </div>
  );
}

/** Drop a .txt/.md file on a text input to insert its content. Dropped plain text works natively. */
function textDrop(current: string, set: (v: string) => void, notify: (m: string, k?: 'ok' | 'error') => void) {
  return (e: DragEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const file = e.dataTransfer.files[0];
    if (!file) return; // plain text: browser inserts it
    e.preventDefault();
    if (isTextFile(file)) void readText(file).then((t) => set(current ? `${current}\n${t}` : t));
    else if (isImageFile(file)) notify('Bilder bitte in ein Bildfeld ziehen.', 'error');
  };
}

/* ───────────── widgets ───────────── */

function TextField({ schema, value, onChange, path, label, required }: FieldProps & { label: string }) {
  const id = useId();
  const { notify, errorsAt } = useForm();
  const v = typeof value === 'string' ? value : '';
  const invalid = errorsAt(path).length > 0;
  const common = {
    id,
    value: v,
    'aria-invalid': invalid || undefined,
    onDrop: textDrop(v, onChange, notify),
  };
  const input =
    schema.widget === 'textarea' ? (
      <textarea {...common} rows={4} onChange={(e) => onChange(e.target.value)} />
    ) : (
      <input
        {...common}
        type={schema.widget === 'time' ? 'time' : schema.widget === 'date' ? 'date' : schema.format === 'email' ? 'email' : schema.widget === 'url' || schema.format === 'uri' ? 'url' : 'text'}
        onChange={(e) => onChange(e.target.value === '' && !required ? undefined : e.target.value)}
      />
    );
  if (schema.widget === 'id') {
    return (
      <details className="field field--advanced">
        <summary>Erweitert: {label}</summary>
        {input}
        {schema.description && <p className="help">{schema.description}</p>}
        <Errors path={path} />
      </details>
    );
  }
  return (
    <div className="field">
      <Label htmlFor={id}>
        {label}
        {!required && <span className="optional"> (optional)</span>}
      </Label>
      {input}
      {schema.description && <p className="help">{schema.description}</p>}
      <Errors path={path} />
    </div>
  );
}

function NumberField({ schema, value, onChange, path, label, nullable }: FieldProps & { label: string; nullable: boolean }) {
  const id = useId();
  return (
    <div className="field">
      <Label htmlFor={id}>{label}</Label>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        step="any"
        value={typeof value === 'number' ? value : ''}
        onChange={(e) => onChange(e.target.value === '' ? (nullable ? null : undefined) : Number(e.target.value))}
      />
      {schema.description && <p className="help">{schema.description}</p>}
      <Errors path={path} />
    </div>
  );
}

function BoolField({ value, onChange, label, path }: FieldProps & { label: string }) {
  return (
    <div className="field">
      <label className="check">
        <input type="checkbox" checked={value === true} onChange={(e) => onChange(e.target.checked || undefined)} />
        {label}
      </label>
      <Errors path={path} />
    </div>
  );
}

function StatusField({ value, onChange, schema }: { value: unknown; onChange: (v: unknown) => void; schema: JS }) {
  return (
    <div className={`field status-field ${value === 'placeholder' ? 'is-placeholder' : ''}`}>
      <label className="check">
        <input
          type="checkbox"
          checked={value === 'placeholder'}
          onChange={(e) => onChange(e.target.checked ? 'placeholder' : 'published')}
        />
        <strong>{schema.title}</strong> – noch nicht endgültig
      </label>
      {schema.description && <p className="help">{schema.description}</p>}
    </div>
  );
}

function EnumSelect({ schema, value, onChange, path, label }: FieldProps & { label: string }) {
  const id = useId();
  return (
    <div className="field">
      <Label htmlFor={id}>{label}</Label>
      <select id={id} value={String(value ?? '')} onChange={(e) => onChange(e.target.value)}>
        {schema.enum!.map((opt) => (
          <option key={String(opt)} value={String(opt)}>
            {schema.labels?.[String(opt)] ?? String(opt)}
          </option>
        ))}
      </select>
      <Errors path={path} />
    </div>
  );
}

function EnumChecks({ schema, value, onChange, path, label }: FieldProps & { label: string }) {
  const selected = Array.isArray(value) ? (value as string[]) : [];
  const toggle = (opt: string) =>
    onChange(selected.includes(opt) ? selected.filter((x) => x !== opt) : [...selected, opt].sort((a, b) => schema.items!.enum!.indexOf(a) - schema.items!.enum!.indexOf(b)));
  return (
    <fieldset className="field">
      <legend className="field-label">{label}</legend>
      <div className="chips">
        {schema.items!.enum!.map((opt) => (
          <label key={String(opt)} className={`chip ${selected.includes(String(opt)) ? 'is-on' : ''}`}>
            <input type="checkbox" checked={selected.includes(String(opt))} onChange={() => toggle(String(opt))} />
            {schema.items!.labels?.[String(opt)] ?? String(opt)}
          </label>
        ))}
      </div>
      {schema.description && <p className="help">{schema.description}</p>}
      <Errors path={path} />
    </fieldset>
  );
}

function RefField({ schema, value, onChange, path, label, required }: FieldProps & { label: string }) {
  const id = useId();
  const { all } = useForm();
  const refId = schema.ref as CollectionId;
  const def = collectionById[refId];
  const items = Array.isArray(all[refId]) ? (all[refId] as Record<string, unknown>[]) : [];
  return (
    <div className="field">
      <Label htmlFor={id}>
        {label}
        {!required && <span className="optional"> (optional)</span>}
      </Label>
      <select id={id} value={String(value ?? '')} onChange={(e) => onChange(e.target.value || undefined)}>
        <option value="">{required ? '– bitte wählen –' : '– keine –'}</option>
        {items.map((it) => (
          <option key={String(it.id)} value={String(it.id)}>
            {def.itemLabel?.(it, all) ?? String(it.id)}
          </option>
        ))}
      </select>
      <p className="help">Neue Einträge zuerst unter „{def.label}“ anlegen und speichern.</p>
      <Errors path={path} />
    </div>
  );
}

function LocalizedField({ schema, value, onChange, path, label, extra, required = true }: FieldProps & { label: string; extra?: ReactNode }) {
  const idDe = useId();
  const idEn = useId();
  const { notify, errorsAt } = useForm();
  const v = (value ?? { de: '' }) as { de: string; en?: string };
  const set = (lang: 'de' | 'en', text: string) => onChange({ ...v, [lang]: text });
  const Tag = schema.multiline ? 'textarea' : 'input';
  const invalid = errorsAt([...path, 'de']).length > 0;
  return (
    <div className="field">
      <Label extra={extra}>
        {label}
        {!required && <span className="optional"> (optional)</span>}
      </Label>
      <div className="lang-grid">
        <div className="lang">
          <label htmlFor={idDe} className="lang-tag">
            Deutsch
          </label>
          <Tag
            id={idDe}
            type={schema.multiline ? undefined : 'text'}
            value={v.de}
            aria-invalid={invalid || undefined}
            rows={schema.multiline ? 4 : undefined}
            onChange={(e) => set('de', e.target.value)}
            onDrop={textDrop(v.de, (t) => set('de', t), notify)}
          />
        </div>
        <div className="lang">
          <label htmlFor={idEn} className="lang-tag">
            Englisch <span className="optional">(optional)</span>
          </label>
          <Tag
            id={idEn}
            type={schema.multiline ? undefined : 'text'}
            value={v.en ?? ''}
            placeholder="leer = deutscher Text"
            rows={schema.multiline ? 4 : undefined}
            onChange={(e) => set('en', e.target.value)}
            onDrop={textDrop(v.en ?? '', (t) => set('en', t), notify)}
          />
        </div>
      </div>
      {schema.description && <p className="help">{schema.description}</p>}
      <Errors path={[...path, 'de']} />
      <Errors path={path} />
    </div>
  );
}

function LocalizedListField({ schema, value, onChange, path, label }: FieldProps & { label: string }) {
  const idDe = useId();
  const idEn = useId();
  const { notify } = useForm();
  const v = (value ?? { de: [] }) as { de: string[]; en?: string[] };
  const set = (lang: 'de' | 'en', text: string) => onChange({ ...v, [lang]: text.split('\n') });
  const rows = Math.min(10, Math.max(3, v.de.length + 1));
  return (
    <div className="field">
      <Label>{label}</Label>
      <div className="lang-grid">
        <div className="lang">
          <label htmlFor={idDe} className="lang-tag">
            Deutsch
          </label>
          <textarea
            id={idDe}
            rows={rows}
            value={v.de.join('\n')}
            onChange={(e) => set('de', e.target.value)}
            onDrop={textDrop(v.de.join('\n'), (t) => set('de', t), notify)}
          />
        </div>
        <div className="lang">
          <label htmlFor={idEn} className="lang-tag">
            Englisch <span className="optional">(optional)</span>
          </label>
          <textarea
            id={idEn}
            rows={rows}
            placeholder="leer = deutscher Text"
            value={(v.en ?? []).join('\n')}
            onChange={(e) => set('en', e.target.value)}
            onDrop={textDrop((v.en ?? []).join('\n'), (t) => set('en', t), notify)}
          />
        </div>
      </div>
      <p className="help">{schema.description ?? 'Ein Eintrag pro Zeile.'}</p>
      <Errors path={[...path, 'de']} />
      <Errors path={path} />
    </div>
  );
}

function ImageField({ schema, value, onChange, path, label, extra }: FieldProps & { label: string; extra?: ReactNode }) {
  const { collection, notify } = useForm();
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);
  const inputId = useId();
  const v = (value ?? { src: '', alt: { de: '' } }) as { src: string; alt: { de: string; en?: string }; width?: number; height?: number };

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!isImageFile(file)) return notify('Das ist keine Bilddatei.', 'error');
    setBusy(true);
    try {
      const prepared = await prepareImage(file, schema.maxWidth);
      const { src } = await api.upload(collection, prepared.name, prepared.blob);
      onChange({ ...v, src, width: prepared.width, height: prepared.height });
      notify('Bild hochgeladen. Bitte noch die Bildbeschreibung ausfüllen.');
    } catch (err) {
      notify(err instanceof Error ? err.message : String(err), 'error');
    } finally {
      setBusy(false);
    }
  }

  const altSchema = { widget: 'localized', title: 'Bildbeschreibung', description: 'Was ist auf dem Bild zu sehen? Wird vorgelesen und von Suchmaschinen gelesen.' } as JS;

  return (
    <div className="field">
      <Label extra={extra}>{label}</Label>
      {/* Drop target for the mouse; the "Datei auswählen" button is the keyboard alternative. */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className={`dropzone ${over ? 'is-over' : ''} ${v.src ? 'has-image' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          void handleFile(e.dataTransfer.files[0]);
        }}
      >
        {v.src && <img src={imagePreviewUrl(v.src)} alt="" className="dropzone-preview" />}
        <div className="dropzone-text">
          {busy ? (
            <strong>Wird hochgeladen …</strong>
          ) : (
            <>
              <strong>{v.src ? 'Anderes Bild hierher ziehen' : 'Bild hierher ziehen'}</strong>
              <span>oder</span>
              <label htmlFor={inputId} className="btn btn--small">
                Datei auswählen
              </label>
              <input
                id={inputId}
                type="file"
                accept="image/*"
                className="visually-hidden"
                onChange={(e) => void handleFile(e.target.files?.[0])}
              />
              {v.src && <span className="dropzone-file">{v.src}</span>}
            </>
          )}
        </div>
      </div>
      {schema.description && <p className="help">{schema.description}</p>}
      <Errors path={[...path, 'src']} />
      <Field schema={altSchema} value={v.alt} onChange={(alt) => onChange({ ...v, alt })} path={[...path, 'alt']} />
    </div>
  );
}

function ObjectField({ schema, value, onChange, path, label, extra, depth = 0 }: FieldProps & { label: string; extra?: ReactNode }) {
  const v = (value ?? {}) as Record<string, unknown>;
  const entries = Object.entries(schema.properties ?? {});
  const statusEntry = entries.find(([, s]) => s.widget === 'status');
  const idEntry = entries.find(([, s]) => s.widget === 'id');
  const rest = entries.filter(([, s]) => s.widget !== 'status' && s.widget !== 'id');
  const body = (
    <>
      {statusEntry && (
        <Field schema={statusEntry[1]} value={v[statusEntry[0]]} onChange={(x) => onChange({ ...v, [statusEntry[0]]: x })} path={[...path, statusEntry[0]]} />
      )}
      {rest.map(([key, s]) => (
        <Field
          key={key}
          schema={s}
          value={v[key]}
          required={schema.required?.includes(key) ?? false}
          onChange={(x) => {
            const next = { ...v, [key]: x };
            if (x === undefined) delete next[key];
            onChange(next);
          }}
          path={[...path, key]}
          depth={depth + 1}
        />
      ))}
      {idEntry && <Field schema={idEntry[1]} value={v[idEntry[0]]} onChange={(x) => onChange({ ...v, [idEntry[0]]: x })} path={[...path, idEntry[0]]} />}
      <Errors path={path} />
    </>
  );
  if (path.length === 0 || typeof path[path.length - 1] === 'number') return <div className="form-root">{body}</div>;
  return (
    <details className={`group depth-${Math.min(depth, 3)}`} open>
      <summary>
        <span>{label}</span>
        {extra}
      </summary>
      <div className="group-body">{body}</div>
    </details>
  );
}

function ArrayField({ schema, value, onChange, path, label, depth = 0 }: FieldProps & { label: string }) {
  const list = Array.isArray(value) ? value : [];
  const item = schema.items ?? {};
  const noun = schema.itemTitle ?? 'Eintrag';
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  if (item.type === 'string') {
    // simple list of strings
    return <TextField schema={{ widget: 'textarea', title: label }} value={list.join('\n')} onChange={(t) => onChange(String(t ?? '').split('\n'))} path={path} label={label} />;
  }
  return (
    <fieldset className={`array depth-${Math.min(depth, 3)}`}>
      <legend className="field-label">{label}</legend>
      {schema.description && <p className="help">{schema.description}</p>}
      {list.map((entry, i) => (
        <div key={i} className="array-item">
          <div className="array-item-head">
            <span>
              {noun} {i + 1}
            </span>
            <span className="array-item-actions">
              <button type="button" className="icon-btn" aria-label={`${noun} ${i + 1} nach oben`} onClick={() => move(i, -1)} disabled={i === 0}>
                ↑
              </button>
              <button type="button" className="icon-btn" aria-label={`${noun} ${i + 1} nach unten`} onClick={() => move(i, 1)} disabled={i === list.length - 1}>
                ↓
              </button>
              <button
                type="button"
                className="icon-btn icon-btn--danger"
                aria-label={`${noun} ${i + 1} löschen`}
                onClick={() => window.confirm(`${noun} ${i + 1} wirklich löschen?`) && onChange(list.filter((_, j) => j !== i))}
              >
                ✕
              </button>
            </span>
          </div>
          <Field
            schema={item}
            label={item.widget === 'localized' ? `${noun} ${i + 1}` : undefined}
            value={entry}
            onChange={(x) => onChange(list.map((e, j) => (j === i ? x : e)))}
            path={[...path, i]}
            depth={depth + 1}
          />
        </div>
      ))}
      <button type="button" className="btn btn--ghost" onClick={() => onChange([...list, defaultFor(item)])}>
        + {noun} hinzufügen
      </button>
      <Errors path={path} />
    </fieldset>
  );
}
