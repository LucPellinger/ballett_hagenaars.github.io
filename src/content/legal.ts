import { site } from './site';
import type { LegalPage } from './types';

/**
 * Legal pages. The imprint's contact block is generated from site.ts;
 * add extra sections here.
 */
export const imprint: LegalPage = {
  sections: [
    {
      heading: { de: 'Berufsrechtliche Angaben', en: 'Professional information' },
      paragraphs: { de: site.memberships.map((m) => m.de), en: site.memberships.map((m) => m.en ?? m.de) },
    },
    {
      heading: { de: 'Haftung für Inhalte und Links', en: 'Liability for content and links' },
      paragraphs: {
        de: [
          'Die Inhalte dieser Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Für Inhalte verlinkter externer Seiten sind ausschließlich deren Betreiber verantwortlich.',
        ],
      },
    },
  ],
};

/**
 * PLACEHOLDER – a privacy policy must be reviewed (ideally generated with a trusted
 * generator / legal advice) before launch. It must mention GitHub Pages as hosting provider.
 */
export const privacy: LegalPage = {
  status: 'placeholder',
  sections: [
    {
      heading: { de: 'Verantwortliche Stelle', en: 'Controller' },
      paragraphs: {
        de: [`${site.owner.name}, ${site.name}, ${site.address.street}, ${site.address.zip} ${site.address.city}, E-Mail: ${site.email}`],
      },
    },
    {
      heading: { de: 'Hosting', en: 'Hosting' },
      paragraphs: {
        de: [
          'Diese Website wird bei GitHub Pages (GitHub Inc., USA) gehostet. Beim Aufruf der Seite werden technisch notwendige Daten (z. B. IP-Adresse, Zeitpunkt, Browser) in Server-Logfiles verarbeitet.',
        ],
        en: [
          'This website is hosted on GitHub Pages (GitHub Inc., USA). When you visit the site, technically necessary data (e.g. IP address, time, browser) is processed in server log files.',
        ],
      },
    },
    {
      heading: { de: 'Keine Cookies, kein Tracking', en: 'No cookies, no tracking' },
      paragraphs: {
        de: [
          'Wir verwenden keine Cookies und keine Analyse- oder Tracking-Dienste. Ihre Sprach- und Design-Auswahl wird ausschließlich lokal in Ihrem Browser (localStorage) gespeichert. Es werden keine externen Schriftarten oder Karten geladen.',
        ],
        en: [
          'We use no cookies and no analytics or tracking services. Your language and theme choice is stored only locally in your browser (localStorage). No external fonts or maps are loaded.',
        ],
      },
    },
  ],
};
