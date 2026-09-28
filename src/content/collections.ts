/**
 * Content collections – which JSON file holds which content type, and how the editor shows it.
 * Shared by the website tests, the editor server (Vite plugin) and the editor UI.
 * No path aliases / browser / Node APIs here.
 */
import * as z from 'zod';
import {
  WEEKDAY_LABELS,
  courseSchema,
  eventSchema,
  galleryItemSchema,
  homeSchema,
  legalPageSchema,
  pagesSchema,
  faqSchema,
  pricesSchema,
  scheduleEntrySchema,
  storyPageSchema,
  siteSchema,
  teamMemberSchema,
} from './schema.ts';

export const COLLECTION_IDS = [
  'site',
  'home',
  'pages',
  'courses',
  'schedule',
  'prices',
  'about',
  'quality',
  'team',
  'pointe',
  'performance',
  'faq',
  'events',
  'gallery',
  'imprint',
  'privacy',
] as const;
export type CollectionId = (typeof COLLECTION_IDS)[number];

/** All content, keyed by collection (raw JSON data). */
export type AllContent = Record<CollectionId, unknown>;

type AnyItem = Record<string, unknown>;
const de = (v: unknown): string => (v && typeof v === 'object' && 'de' in v ? String((v as { de: unknown }).de ?? '') : '');

export interface CollectionDef {
  id: CollectionId;
  /** Menu label in the editor. */
  label: string;
  /** One sentence shown above the form. */
  description: string;
  /** File name in src/content/data/. */
  file: string;
  /** 'list' = array of entries (master/detail editor), 'single' = one object (form). */
  kind: 'list' | 'single';
  schema: z.ZodType;
  /** For list collections: schema of one entry. */
  itemSchema?: z.ZodType;
  group: 'Allgemein' | 'Über uns' | 'Angebot' | 'Aktuelles & Galerie' | 'Rechtliches';
  /** Website path to preview this content. */
  previewPath: string;
  /** Singular noun for "Neuer …" buttons. */
  itemNoun?: string;
  /** Label of an entry in the list. */
  itemLabel?: (item: AnyItem, all: AllContent) => string;
  /** Extra info under the label. */
  itemSubLabel?: (item: AnyItem, all: AllContent) => string;
  /** Template for a new entry. */
  newItem?: () => AnyItem;
  /** Build an id for a new entry from its content (used when the id is left empty). */
  idFrom?: (item: AnyItem, all: AllContent) => string;
  /** Dropping image files onto the list creates one new entry per image in this field. */
  dropCreatesImageIn?: string;
}

const findTitle = (all: AllContent, coll: CollectionId, id: unknown) => {
  const list = Array.isArray(all[coll]) ? (all[coll] as AnyItem[]) : [];
  const hit = list.find((x) => x.id === id);
  return hit ? de(hit.title) || String(hit.name ?? '') : String(id ?? '');
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
    .replace(/-+$/, '');
}

export const collections: CollectionDef[] = [
  {
    id: 'site',
    label: 'Schuldaten',
    description: 'Adresse, Telefon, E-Mail, Bürozeiten und Social-Media-Links – erscheinen in Fußzeile, Kontakt und Impressum.',
    file: 'site.json',
    kind: 'single',
    schema: siteSchema,
    group: 'Allgemein',
    previewPath: '/kontakt',
  },
  {
    id: 'home',
    label: 'Startseite',
    description: 'Der orange Kopfbereich (Willkommen, Schnellzugriff), das Stichwort-Band, die drei Highlights, Philosophie und die Überschriften der Startseite.',
    file: 'home.json',
    kind: 'single',
    schema: homeSchema,
    group: 'Allgemein',
    previewPath: '/',
  },
  {
    id: 'pages',
    label: 'Seitentitel',
    description: 'Überschriften im roten Kopfbereich jeder Seite und die Texte für Google.',
    file: 'pages.json',
    kind: 'single',
    schema: pagesSchema,
    group: 'Allgemein',
    previewPath: '/',
  },
  {
    id: 'courses',
    label: 'Kurse',
    description: 'Das Unterrichtsangebot. Kurse werden im Stundenplan verwendet.',
    file: 'courses.json',
    kind: 'list',
    schema: z.array(courseSchema),
    itemSchema: courseSchema,
    group: 'Angebot',
    previewPath: '/kurse',
    itemNoun: 'Kurs',
    itemLabel: (c) => de(c.title) || 'Neuer Kurs',
    itemSubLabel: (c) => de(c.ageGroup),
    newItem: () => ({
      id: '',
      title: { de: '' },
      audience: ['kids'],
      ageGroup: { de: '' },
      summary: { de: '' },
      description: { de: [] },
      color: 'orange',
      status: 'published',
    }),
    idFrom: (c) => slugify(de(c.title)),
  },
  {
    id: 'schedule',
    label: 'Stundenplan',
    description: 'Wann welcher Kurs stattfindet. Die Reihenfolge ergibt sich automatisch aus Tag und Uhrzeit.',
    file: 'schedule.json',
    kind: 'list',
    schema: z.array(scheduleEntrySchema),
    itemSchema: scheduleEntrySchema,
    group: 'Angebot',
    previewPath: '/stundenplan',
    itemNoun: 'Termin',
    itemLabel: (e, all) => findTitle(all, 'courses', e.courseId) || 'Neuer Termin',
    itemSubLabel: (e) =>
      `${WEEKDAY_LABELS[e.day as keyof typeof WEEKDAY_LABELS] ?? '?'} · ${String(e.start ?? '')}–${String(e.end ?? '')}`,
    newItem: () => ({ id: '', day: 'mon', start: '16:00', end: '17:00', courseId: '', status: 'published' }),
    idFrom: (e) => slugify(`${String(e.day)}-${String(e.start).replace(':', '')}-${String(e.courseId)}`),
  },
  {
    id: 'prices',
    label: 'Preise',
    description: 'Unterrichtsgebühren und Hinweise (z. B. Geschwisterrabatt).',
    file: 'prices.json',
    kind: 'single',
    schema: pricesSchema,
    group: 'Angebot',
    previewPath: '/preise',
  },
  {
    id: 'about',
    label: 'Über uns',
    description: 'Die Seite „Über uns“: Abschnitte mit Text und Bild.',
    file: 'about.json',
    kind: 'single',
    schema: storyPageSchema,
    group: 'Über uns',
    previewPath: '/ueber-uns',
  },
  {
    id: 'quality',
    label: 'Qualität',
    description: 'Die Seite „Qualität“.',
    file: 'quality.json',
    kind: 'single',
    schema: storyPageSchema,
    group: 'Über uns',
    previewPath: '/ueber-uns/qualitaet',
  },
  {
    id: 'team',
    label: 'Team',
    description: 'Lehrkräfte. Werden im Stundenplan als „Lehrkraft“ ausgewählt.',
    file: 'team.json',
    kind: 'list',
    schema: z.array(teamMemberSchema),
    itemSchema: teamMemberSchema,
    group: 'Über uns',
    previewPath: '/ueber-uns/team',
    itemNoun: 'Person',
    itemLabel: (m) => String(m.name || 'Neue Person'),
    itemSubLabel: (m) => de(m.role),
    newItem: () => ({ id: '', name: '', role: { de: '' }, bio: { de: '' }, teaches: { de: [] }, color: 'orange', status: 'published' }),
    idFrom: (m) => slugify(String(m.name ?? '')),
  },
  {
    id: 'pointe',
    label: 'Spitzentanz',
    description: 'Die Seite „Spitzentanz“.',
    file: 'pointe.json',
    kind: 'single',
    schema: storyPageSchema,
    group: 'Über uns',
    previewPath: '/ueber-uns/spitzentanz',
  },
  {
    id: 'performance',
    label: 'Aufführung',
    description: 'Die Seite „Aufführung“.',
    file: 'performance.json',
    kind: 'single',
    schema: storyPageSchema,
    group: 'Über uns',
    previewPath: '/ueber-uns/auffuehrung',
  },
  {
    id: 'faq',
    label: 'FAQ',
    description: 'Häufige Fragen und Antworten.',
    file: 'faq.json',
    kind: 'single',
    schema: faqSchema,
    group: 'Über uns',
    previewPath: '/ueber-uns/faq',
  },
  {
    id: 'events',
    label: 'Events',
    description: 'Workshops, Aufführungen, Termine. Vergangene Events wandern automatisch nach unten.',
    file: 'events.json',
    kind: 'list',
    schema: z.array(eventSchema),
    itemSchema: eventSchema,
    group: 'Aktuelles & Galerie',
    previewPath: '/aktuelles',
    itemNoun: 'Event',
    itemLabel: (e) => de(e.title) || 'Neues Event',
    itemSubLabel: (e) => [e.startDate, e.endDate].filter(Boolean).join(' – '),
    newItem: () => ({
      id: '',
      title: { de: '' },
      startDate: new Date().toISOString().slice(0, 10),
      location: 'Haßloch',
      category: 'workshop',
      description: { de: '' },
      status: 'published',
    }),
    idFrom: (e) => slugify(`${de(e.title)}-${String(e.startDate ?? '').slice(0, 4)}`),
  },
  {
    id: 'gallery',
    label: 'Galerie',
    description: 'Fotos für die Galerie. Einfach Bilder in das Feld ziehen.',
    file: 'gallery.json',
    kind: 'list',
    schema: z.array(galleryItemSchema),
    itemSchema: galleryItemSchema,
    group: 'Aktuelles & Galerie',
    previewPath: '/galerie',
    itemNoun: 'Foto',
    dropCreatesImageIn: 'image',
    itemLabel: (g) => de(g.caption) || de((g.image as AnyItem | undefined)?.alt) || 'Foto',
    itemSubLabel: (g) => String((g.image as AnyItem | undefined)?.src ?? ''),
    newItem: () => ({ id: '', image: { src: '', alt: { de: '' } }, status: 'published' }),
    idFrom: (g) => slugify(String((g.image as AnyItem | undefined)?.src ?? 'foto').replace(/\.[a-z]+$/, '').split('/').pop() ?? 'foto'),
  },
  {
    id: 'imprint',
    label: 'Impressum',
    description: 'Zusätzliche Abschnitte im Impressum. Name, Adresse und Steuernummer kommen aus den Schuldaten.',
    file: 'imprint.json',
    kind: 'single',
    schema: legalPageSchema,
    group: 'Rechtliches',
    previewPath: '/impressum',
  },
  {
    id: 'privacy',
    label: 'Datenschutz',
    description: 'Die Datenschutzerklärung. Änderungen am besten rechtlich prüfen lassen.',
    file: 'privacy.json',
    kind: 'single',
    schema: legalPageSchema,
    group: 'Rechtliches',
    previewPath: '/datenschutz',
  },
];

export const collectionById = Object.fromEntries(collections.map((c) => [c.id, c])) as Record<CollectionId, CollectionDef>;

/** Which collection a data file belongs to (for git status → editor labels). */
export function collectionForFile(path: string): CollectionDef | undefined {
  const name = path.split('/').pop();
  return collections.find((c) => c.file === name);
}
