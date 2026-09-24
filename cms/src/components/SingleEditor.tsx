import { useMemo } from 'react';
import type { AllContent, CollectionDef } from '@/content/collections';
import type { ContentIssue } from '@/content/validate';
import { Field } from '../form/Field';
import { FormContext } from '../form/FormContext';
import { pathKey, toJS } from '../form/jsonSchema';

export interface SingleEditorProps {
  def: CollectionDef;
  value: unknown;
  onChange: (v: unknown) => void;
  all: AllContent;
  issues: ContentIssue[];
  notify: (msg: string, kind?: 'ok' | 'error') => void;
}

export function SingleEditor({ def, value, onChange, all, issues, notify }: SingleEditorProps) {
  const js = useMemo(() => toJS(def.schema), [def]);
  const errorsAt = (path: (string | number)[]) => issues.filter((i) => pathKey(i.path) === pathKey(path)).map((i) => i.message);
  return (
    <div className="single-editor">
      <FormContext.Provider value={{ all, collection: def.id, errorsAt, notify }}>
        <Field schema={js} value={value} onChange={onChange} path={[]} />
      </FormContext.Provider>
    </div>
  );
}
