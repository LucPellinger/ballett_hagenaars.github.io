import { createContext } from 'react';
import type { Locale, Localized } from './locales';

export interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  /** Resolve a localized content value for the active language (falls back to German). */
  t: <T>(value: Localized<T>) => T;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);
