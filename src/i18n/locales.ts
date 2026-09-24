/** Supported languages. German is the primary language; English is optional per field. */
export const LOCALES = ['de', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'de';

/** BCP-47 tags used for Intl formatting. */
export const INTL_LOCALE: Record<Locale, string> = { de: 'de-DE', en: 'en-GB' };

/**
 * A value that can be translated. German is required, English falls back to German
 * when missing – so new content can be published in German first.
 */
export type Localized<T = string> = { de: T; en?: T };

export function localize<T>(value: Localized<T>, locale: Locale): T {
  return value[locale] ?? value.de;
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}
