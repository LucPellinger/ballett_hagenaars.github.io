import type { Localized, PricePlan } from './types';

/**
 * Monthly fees. Amounts in EUR, formatted automatically per language.
 * PLACEHOLDER: amounts are SAMPLES – the old site only had the price table as an image.
 */
export const pricePlans: PricePlan[] = [
  { id: 'kids-45', title: { de: '1 × pro Woche, 45 Min.', en: '1 × per week, 45 min' }, details: { de: 'Kindertanz, Dance Together', en: "Children's dance, Dance Together" }, amount: null, period: { de: 'pro Monat', en: 'per month' }, status: 'placeholder' },
  { id: 'std-60', title: { de: '1 × pro Woche, 60 Min.', en: '1 × per week, 60 min' }, details: { de: 'Ballett Kinder & Jugendliche', en: 'Ballet children & teens' }, amount: null, period: { de: 'pro Monat', en: 'per month' }, highlight: true, status: 'placeholder' },
  { id: 'std-90', title: { de: '1 × pro Woche, 75–90 Min.', en: '1 × per week, 75–90 min' }, details: { de: 'Erwachsene, Modern, Flamenco, Jazz', en: 'Adults, modern, flamenco, jazz' }, amount: null, period: { de: 'pro Monat', en: 'per month' }, status: 'placeholder' },
];

export const priceNotes: Localized[] = [
  { de: 'Bis zu drei Schnupperstunden sind kostenlos und unverbindlich.', en: 'Up to three trial classes are free and without obligation.' },
  { de: 'Für Geschwisterkinder gewähren wir Ermäßigung – bitte sprechen Sie uns an.', en: 'We offer discounts for siblings – please ask us.' },
];
