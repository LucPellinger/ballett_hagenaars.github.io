import placeholder1 from '@/assets/images/placeholder-1.svg';
import type { EventItem } from './types';

/**
 * Workshops, performances, holidays. Sorted automatically by date;
 * past events move to "Vergangene Termine" on their own.
 */
export const events: EventItem[] = [
  {
    id: 'flamenco-workshop-joaquin-ruiz',
    title: { de: 'Flamenco Workshop mit Joaquín Ruiz', en: 'Flamenco workshop with Joaquín Ruiz' },
    // PLACEHOLDER – confirm the year and details
    startDate: '2027-03-01',
    endDate: '2027-03-02',
    location: 'Haßloch',
    description: {
      de: 'Zwei Tage intensiver Flamenco-Unterricht mit Joaquín Ruiz. Für Teilnehmende mit Vorkenntnissen – Anmeldung über das Büro.',
      en: 'Two days of intensive flamenco classes with Joaquín Ruiz. For dancers with some experience – register via the office.',
    },
    image: { src: placeholder1, alt: { de: '', en: '' } },
    status: 'placeholder',
  },
];
