import type { NavItem, PageId } from './types';

/**
 * Site navigation (developer-owned). Order here = order in the menu.
 * `path` is the URL (German slugs). A new page also needs a route in src/routes.tsx.
 * Items with `children` show a dropdown; the parent link itself opens the first child's page.
 */
export const mainNav: NavItem[] = [
  { page: 'home', path: '/', label: { de: 'home', en: 'home' } },
  {
    page: 'about',
    path: '/ueber-uns',
    label: { de: 'über uns', en: 'about us' },
    children: [
      { page: 'about', path: '/ueber-uns', label: { de: 'Über uns', en: 'About us' } },
      { page: 'quality', path: '/ueber-uns/qualitaet', label: { de: 'Qualität', en: 'Quality' } },
      { page: 'team', path: '/ueber-uns/team', label: { de: 'Team', en: 'Team' } },
      { page: 'pointe', path: '/ueber-uns/spitzentanz', label: { de: 'Spitzentanz', en: 'Pointe' } },
      { page: 'performance', path: '/ueber-uns/auffuehrung', label: { de: 'Aufführung', en: 'Performance' } },
      { page: 'faq', path: '/ueber-uns/faq', label: { de: 'FAQ', en: 'FAQ' } },
    ],
  },
  { page: 'news', path: '/aktuelles', label: { de: 'aktuelles', en: 'news' } },
  {
    page: 'courses',
    path: '/angebot/kurse',
    label: { de: 'angebot', en: 'classes' },
    children: [
      { page: 'courses', path: '/angebot/kurse', label: { de: 'Kurse', en: 'Classes' } },
      { page: 'schedule', path: '/angebot/stundenplan', label: { de: 'Stundenplan', en: 'Timetable' } },
      { page: 'prices', path: '/angebot/preise', label: { de: 'Preise', en: 'Fees' } },
    ],
  },
  { page: 'gallery', path: '/galerie', label: { de: 'galerie', en: 'gallery' } },
  { page: 'contact', path: '/kontakt', label: { de: 'kontakt', en: 'contact' } },
];

export const legalNav: NavItem[] = [
  { page: 'imprint', path: '/impressum', label: { de: 'Impressum', en: 'Legal notice' } },
  { page: 'privacy', path: '/datenschutz', label: { de: 'Datenschutz', en: 'Privacy' } },
];

/** Every page exactly once (children flattened). */
export const navigation: NavItem[] = (() => {
  const seen = new Set<string>();
  const out: NavItem[] = [];
  for (const item of [...mainNav, ...legalNav]) {
    for (const x of item.children ?? [item]) {
      if (!seen.has(x.path)) {
        seen.add(x.path);
        out.push(x);
      }
    }
  }
  return out;
})();

/** Old URLs (previous site version) → new URLs. */
export const redirects: Record<string, string> = {
  '/unterricht': '/angebot/kurse',
  '/stundenplan': '/angebot/stundenplan',
  '/preise': '/angebot/preise',
  '/ballettschule': '/ueber-uns',
  '/events': '/aktuelles',
  '/angebot': '/angebot/kurse',
};

export function pathFor(page: PageId): string {
  const item = navigation.find((n) => n.page === page);
  if (!item) throw new Error(`No navigation entry for page "${page}"`);
  return item.path;
}
