import type { SiteInfo } from './types';

/**
 * School master data – used in header, footer, contact page, imprint and SEO.
 * Change it here once and it updates everywhere.
 */
export const site: SiteInfo = {
  name: 'Ballettschule Hagenaars',
  shortName: 'Hagenaars',
  tagline: {
    de: 'Kindertanz, Ballett, Modern, Flamenco & Jazz in Haßloch',
    en: "Children's dance, ballet, modern, flamenco & jazz in Haßloch",
  },
  owner: {
    name: 'Maricel Pellinger-Hagenaars',
    title: { de: 'Dipl. Tanzpädagogin', en: 'Certified dance teacher' },
  },
  address: {
    street: 'Langgasse 115',
    zip: '67454',
    city: 'Haßloch',
    country: { de: 'Deutschland', en: 'Germany' },
  },
  phone: { display: '+49 6324 82317', href: 'tel:+49632482317' },
  email: 'info@hagenaars-ballett.de',
  taxId: 'DE-31/214/25366',
  memberships: [
    {
      de: 'Mitglied im Deutschen Berufsverband für Tanzpädagogik e.V.',
      en: 'Member of the German Professional Association for Dance Teachers (DBfT e.V.)',
    },
  ],
  // PLACEHOLDER – opening hours of the office/phone; verify before launch.
  openingHours: [{ days: { de: 'Montag – Freitag', en: 'Monday – Friday' }, hours: '14:00 – 21:00' }],
  socials: [
    // PLACEHOLDER – add the real profile URL
    { platform: 'instagram', href: 'https://www.instagram.com/', label: 'Instagram' },
  ],
  mapUrl: 'https://www.openstreetmap.org/search?query=Langgasse%20115%2C%2067454%20Ha%C3%9Floch',
};
