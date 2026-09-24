import { INTL_LOCALE, type Locale } from './locales';

export function formatPrice(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(INTL_LOCALE[locale], {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}

/** Parse an ISO date (YYYY-MM-DD) as a local calendar date (no timezone shift). */
export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

export function formatDateRange(startIso: string, endIso: string | undefined, locale: Locale): string {
  const fmt = new Intl.DateTimeFormat(INTL_LOCALE[locale], { day: 'numeric', month: 'long', year: 'numeric' });
  const start = parseIsoDate(startIso);
  if (!endIso || endIso === startIso) return fmt.format(start);
  return fmt.formatRange(start, parseIsoDate(endIso));
}
