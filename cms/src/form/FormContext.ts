import { createContext, useContext } from 'react';
import type { AllContent, CollectionId } from '@/content/collections';

export interface FormCtx {
  all: AllContent;
  collection: CollectionId;
  /** Error messages for an exact path (relative to the edited item). */
  errorsAt: (path: (string | number)[]) => string[];
  notify: (msg: string, kind?: 'ok' | 'error') => void;
}

export const FormContext = createContext<FormCtx | null>(null);
export const useForm = () => {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error('FormContext missing');
  return ctx;
};
