import type { NavItem } from './types';

/**
 * Site navigation. Order here = order in the menu.
 * `path` is the URL (German slugs). Adding a *new* page also needs a route in src/routes.tsx.
 */
export const navigation: NavItem[] = [
  { page: 'home', path: '/', label: { de: 'Start', en: 'Home' }, header: false, footer: true },
  { page: 'courses', path: '/unterricht', label: { de: 'Unterricht', en: 'Classes' }, header: true, footer: true },
  { page: 'schedule', path: '/stundenplan', label: { de: 'Stundenplan', en: 'Timetable' }, header: true, footer: true },
  { page: 'prices', path: '/preise', label: { de: 'Preise', en: 'Fees' }, header: true, footer: true },
  { page: 'school', path: '/ballettschule', label: { de: 'Über uns', en: 'About us' }, header: true, footer: true },
  { page: 'events', path: '/events', label: { de: 'Events', en: 'Events' }, header: true, footer: true },
  { page: 'gallery', path: '/galerie', label: { de: 'Galerie', en: 'Gallery' }, header: true, footer: true },
  { page: 'contact', path: '/kontakt', label: { de: 'Kontakt', en: 'Contact' }, header: true, footer: true },
  { page: 'imprint', path: '/impressum', label: { de: 'Impressum', en: 'Legal notice' }, header: false, footer: true },
  { page: 'privacy', path: '/datenschutz', label: { de: 'Datenschutz', en: 'Privacy' }, header: false, footer: true },
];

export function pathFor(page: NavItem['page']): string {
  const item = navigation.find((n) => n.page === page);
  if (!item) throw new Error(`No navigation entry for page "${page}"`);
  return item.path;
}
