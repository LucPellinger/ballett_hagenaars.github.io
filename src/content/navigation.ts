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
  { page: 'courses', path: '/kurse', label: { de: 'kurse', en: 'classes' } },
  { page: 'schedule', path: '/stundenplan', label: { de: 'stundenplan', en: 'timetable' } },
  { page: 'prices', path: '/preise', label: { de: 'preise', en: 'fees' } },
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
  '/unterricht': '/kurse',
  '/angebot': '/kurse',
  '/angebot/kurse': '/kurse',
  '/angebot/stundenplan': '/stundenplan',
  '/angebot/preise': '/preise',
  '/ballettschule': '/ueber-uns',
  '/events': '/aktuelles',
};

export function pathFor(page: PageId): string {
  const item = navigation.find((n) => n.page === page);
  if (!item) throw new Error(`No navigation entry for page "${page}"`);
  return item.path;
}
