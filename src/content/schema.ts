/**
 * Content models – ONE place that defines the shape of every content type.
 *
 * Each model is a Zod schema. It is used for:
 *  - TypeScript types of the website (`z.infer`, re-exported from ./types.ts)
 *  - validation in tests / CI (`yarn test`) and in the content editor (`yarn cms`)
 *  - generating the editor forms (field labels, help texts and widgets come from `.meta()`)
 *
 * This file must stay free of path aliases and browser/Node APIs – it is loaded by the website,
 * the tests, the Vite config (editor server) and the editor UI.
 *
 * Meta keys understood by the editor:
 *   title        – field label (German)
 *   description  – help text below the field
 *   widget       – 'localized' | 'localizedList' | 'image' | 'ref' | 'status' | 'id' |
 *                  'textarea' | 'time' | 'date' | 'url'
 *   multiline    – for 'localized': render textareas
 *   ref          – for 'ref': collection id the value points to
 *   labels       – for enums: { value: 'Anzeigename' }
 *   maxWidth     – for 'image': resize uploads to this width (px)
 *   itemTitle    – for arrays of objects: label of one entry ("Absatz", "Öffnungszeit" …)
 */
import * as z from 'zod';

/* ───────────── building blocks ───────────── */

export const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
export const DATE_PATTERN = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
export const IMAGE_SRC_PATTERN = /^[a-z0-9][a-z0-9/_.-]*\.(png|jpe?g|webp|svg|gif|avif)$/;

interface FieldOpts {
  help?: string;
  multiline?: boolean;
  /** Allow an empty German text (e.g. decorative image alt text). */
  allowEmpty?: boolean;
}

/** Text in German (required) and English (optional – falls back to German). */
export function localized(title: string, opts: FieldOpts = {}) {
  const de = opts.allowEmpty ? z.string() : z.string().trim().min(1, 'Bitte einen deutschen Text eingeben.');
  return z
    .object({ de, en: z.string().optional() })
    .meta({ title, description: opts.help, widget: 'localized', multiline: opts.multiline ?? false });
}

/** A list of texts (one entry per line in the editor), German required, English optional. */
export function localizedList(title: string, opts: FieldOpts & { min?: number } = {}) {
  const min = opts.min ?? 1;
  return z
    .object({
      de: z.array(z.string().trim().min(1, 'Leere Zeile entfernen.')).min(min, `Mindestens ${min} Eintrag nötig.`),
      en: z.array(z.string().trim().min(1, 'Leere Zeile entfernen.')).optional(),
    })
    .meta({ title, description: opts.help ?? 'Ein Eintrag pro Zeile.', widget: 'localizedList' });
}

export const contentId = (help = 'Wird automatisch aus dem Titel erzeugt. Nur ändern, wenn nötig.') =>
  z
    .string()
    .regex(ID_PATTERN, 'Nur Kleinbuchstaben, Zahlen und Bindestriche (z. B. ballett-kinder).')
    .meta({ title: 'Kennung (ID)', description: help, widget: 'id' });

export const status = z
  .enum(['published', 'placeholder'])
  .optional()
  .meta({
    title: 'Beispielinhalt',
    description: 'Angehakt = noch nicht endgültig. Solange Beispielinhalte existieren, kann nur eine Vorschau veröffentlicht werden.',
    widget: 'status',
  });

export const time = (title: string) =>
  z.string().regex(TIME_PATTERN, 'Uhrzeit im Format HH:MM, z. B. 16:30.').meta({ title, widget: 'time' });

export const isoDate = (title: string) =>
  z.string().regex(DATE_PATTERN, 'Datum im Format JJJJ-MM-TT.').meta({ title, widget: 'date' });

export function image(title: string, opts: { maxWidth?: number; help?: string; decorativeAllowed?: boolean } = {}) {
  return z
    .object({
      src: z.string().regex(IMAGE_SRC_PATTERN, 'Bitte ein Bild hochladen.'),
      alt: localized('Bildbeschreibung', {
        help: 'Was ist auf dem Bild zu sehen? Wird von Screenreadern vorgelesen und von Suchmaschinen gelesen.',
        allowEmpty: opts.decorativeAllowed,
      }),
      width: z.number().int().positive().optional(),
      height: z.number().int().positive().optional(),
    })
    .meta({ title, description: opts.help, widget: 'image', maxWidth: opts.maxWidth ?? 1600 });
}

export const link = (title: string) =>
  z
    .object({
      label: localized('Beschriftung'),
      href: z
        .string()
        .trim()
        .min(1, 'Bitte ein Ziel angeben.')
        .meta({ title: 'Ziel', description: 'Interne Seite wie /kontakt oder vollständige Adresse https://…', widget: 'url' }),
    })
    .meta({ title });

/* ───────────── enums ───────────── */

export const WEEKDAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
export const WEEKDAY_LABELS = {
  mon: 'Montag',
  tue: 'Dienstag',
  wed: 'Mittwoch',
  thu: 'Donnerstag',
  fri: 'Freitag',
  sat: 'Samstag',
  sun: 'Sonntag',
} as const;
export const weekday = z.enum(WEEKDAYS).meta({ title: 'Wochentag', labels: WEEKDAY_LABELS });

export const AUDIENCES = ['kids', 'teens', 'adults', 'family'] as const;
export const AUDIENCE_LABELS = { kids: 'Kinder', teens: 'Jugendliche', adults: 'Erwachsene', family: 'Eltern & Kind' } as const;
export const audience = z.enum(AUDIENCES).meta({ labels: AUDIENCE_LABELS });

export const PAGE_IDS = [
  'home',
  'courses',
  'schedule',
  'prices',
  'school',
  'events',
  'gallery',
  'contact',
  'imprint',
  'privacy',
] as const;
export const PAGE_LABELS = {
  home: 'Startseite',
  courses: 'Unterricht',
  schedule: 'Stundenplan',
  prices: 'Preise',
  school: 'Über uns',
  events: 'Events',
  gallery: 'Galerie',
  contact: 'Kontakt',
  imprint: 'Impressum',
  privacy: 'Datenschutz',
} as const;

/* ───────────── content types ───────────── */

export const siteSchema = z
  .object({
    name: z.string().trim().min(1).meta({ title: 'Name der Schule' }),
    shortName: z.string().trim().min(1).meta({ title: 'Kurzname' }),
    tagline: localized('Untertitel', { help: 'Kurzer Satz, erscheint in der Fußzeile.' }),
    owner: z
      .object({
        name: z.string().trim().min(1).meta({ title: 'Name' }),
        title: localized('Berufsbezeichnung'),
      })
      .meta({ title: 'Inhaberin' }),
    address: z
      .object({
        street: z.string().trim().min(1).meta({ title: 'Straße & Hausnummer' }),
        zip: z.string().regex(/^\d{5}$/, 'Fünfstellige Postleitzahl.').meta({ title: 'PLZ' }),
        city: z.string().trim().min(1).meta({ title: 'Ort' }),
        country: localized('Land'),
      })
      .meta({ title: 'Adresse' }),
    phone: z
      .object({
        display: z.string().trim().min(1).meta({ title: 'Telefon (Anzeige)', description: 'So wie es auf der Website steht, z. B. +49 6324 82317' }),
        href: z
          .string()
          .regex(/^tel:\+?\d+$/, 'Format: tel:+49632482317 (ohne Leerzeichen).')
          .meta({ title: 'Telefon (Link)', description: 'Für „Anrufen“ auf dem Handy: tel: + Nummer ohne Leerzeichen.' }),
      })
      .meta({ title: 'Telefon' }),
    email: z.email('Bitte eine gültige E-Mail-Adresse eingeben.').meta({ title: 'E-Mail' }),
    taxId: z.string().trim().min(1).meta({ title: 'Steuernummer' }),
    memberships: z.array(localized('Mitgliedschaft')).meta({ title: 'Mitgliedschaften', itemTitle: 'Mitgliedschaft' }),
    openingHours: z
      .array(
        z.object({
          days: localized('Tage', { help: 'z. B. Montag – Freitag' }),
          hours: z.string().trim().min(1).meta({ title: 'Uhrzeiten', description: 'z. B. 14:00 – 21:00' }),
        }),
      )
      .meta({ title: 'Bürozeiten', itemTitle: 'Bürozeit' }),
    socials: z
      .array(
        z.object({
          platform: z
            .enum(['instagram', 'facebook', 'youtube', 'tiktok'])
            .meta({ title: 'Plattform', labels: { instagram: 'Instagram', facebook: 'Facebook', youtube: 'YouTube', tiktok: 'TikTok' } }),
          href: z.url('Bitte eine vollständige Adresse mit https:// eingeben.').meta({ title: 'Adresse (URL)', widget: 'url' }),
          label: z.string().trim().min(1).meta({ title: 'Beschriftung' }),
        }),
      )
      .meta({ title: 'Soziale Netzwerke', itemTitle: 'Profil' }),
    mapUrl: z.url().meta({ title: 'Karten-Link', description: 'Link zu OpenStreetMap oder Google Maps.', widget: 'url' }),
    foundedYear: z.number().int().min(1900).max(2100).optional().meta({ title: 'Gründungsjahr' }),
    status,
  })
  .meta({ title: 'Schuldaten' });

const pageMeta = z
  .object({
    title: localized('Titel im Browser-Tab'),
    description: localized('Beschreibung für Google', { multiline: true, help: 'Ein bis zwei Sätze, max. ca. 155 Zeichen.' }),
  })
  .meta({ title: 'Suchmaschinen' });

const pageHeader = z
  .object({
    eyebrow: localized('Überzeile', { help: 'Kleine Zeile über der Überschrift.' }).optional(),
    title: localized('Überschrift'),
    lead: localized('Einleitungstext', { multiline: true }).optional(),
  })
  .meta({ title: 'Roter Kopfbereich' });

export const pagesSchema = z
  .object(
    Object.fromEntries(
      PAGE_IDS.map((id) => [id, z.object({ meta: pageMeta, header: pageHeader }).meta({ title: PAGE_LABELS[id] })]),
    ) as Record<(typeof PAGE_IDS)[number], z.ZodObject<{ meta: typeof pageMeta; header: typeof pageHeader }>>,
  )
  .meta({ title: 'Seitentitel & Kopfbereiche' });

export const homeSchema = z
  .object({
    hero: z
      .object({
        headline: localizedList('Große Überschrift', { help: 'Jede Zeile wird eine eigene Zeile im Plakat. Kurz halten (2–4 Zeilen).' }),
        meta: localizedList('Kleiner Text unten rechts', { help: 'Eine oder zwei kurze Zeilen.' }),
        lead: localized('Einleitungstext', { multiline: true }),
        image: image('Foto (schwarz-weiß, freigestellt)', {
          maxWidth: 1200,
          help: 'Am besten ein freigestelltes Tanzfoto (PNG/WebP mit transparentem Hintergrund).',
        }).optional(),
        primaryCta: link('Hauptknopf'),
        secondaryCta: link('Zweiter Knopf').optional(),
      })
      .meta({ title: 'Plakat (oberster Bereich)' }),
    highlights: z
      .array(z.object({ title: localized('Titel'), text: localized('Text', { multiline: true }) }))
      .meta({ title: 'Drei Highlights', itemTitle: 'Highlight' }),
    sections: z
      .object({
        highlights: z.object({ title: localized('Überschrift (unsichtbar, für Screenreader)') }).meta({ title: 'Highlights' }),
        courses: z.object({ eyebrow: localized('Überzeile'), title: localized('Überschrift') }).meta({ title: 'Kurse-Bereich' }),
        events: z.object({ eyebrow: localized('Überzeile'), title: localized('Überschrift') }).meta({ title: 'Events-Bereich' }),
        cta: z
          .object({ title: localized('Überschrift'), text: localized('Text', { multiline: true }), link: link('Knopf') })
          .meta({ title: 'Aufruf am Ende' }),
      })
      .meta({ title: 'Abschnitte' }),
  })
  .meta({ title: 'Startseite' });

export const courseSchema = z
  .object({
    id: contentId(),
    title: localized('Kursname'),
    audience: z
      .array(audience)
      .min(1, 'Mindestens eine Zielgruppe wählen.')
      .meta({ title: 'Zielgruppe', description: 'Für den Filter im Stundenplan.' }),
    ageGroup: localized('Alter', { help: 'z. B. „ab 6 Jahren“' }),
    summary: localized('Kurzbeschreibung', { help: 'Ein Satz – erscheint auf der Startseite.' }),
    description: localizedList('Ausführliche Beschreibung', { help: 'Ein Absatz pro Zeile.' }),
    image: image('Foto', { maxWidth: 1200 }).optional(),
    status,
  })
  .meta({ title: 'Kurs' });

export const scheduleEntrySchema = z
  .object({
    id: contentId(),
    day: weekday,
    start: time('Beginn'),
    end: time('Ende'),
    courseId: z.string().min(1, 'Bitte einen Kurs wählen.').meta({ title: 'Kurs', widget: 'ref', ref: 'courses' }),
    level: localized('Stufe', { help: 'Optional, z. B. „Stufe 1“' }).optional(),
    teacherId: z.string().optional().meta({ title: 'Lehrkraft', widget: 'ref', ref: 'team' }),
    status,
  })
  .refine((e) => e.start < e.end, { message: 'Das Ende muss nach dem Beginn liegen.', path: ['end'] })
  .meta({ title: 'Stundenplan-Eintrag' });

export const pricesSchema = z
  .object({
    plans: z
      .array(
        z.object({
          id: contentId(),
          title: localized('Titel', { help: 'z. B. „1 × pro Woche, 60 Min.“' }),
          details: localized('Für welche Kurse'),
          amount: z
            .number()
            .min(0, 'Der Preis kann nicht negativ sein.')
            .nullable()
            .meta({ title: 'Preis in €', description: 'Leer lassen = „auf Anfrage“.' }),
          period: localized('Zeitraum', { help: 'z. B. „pro Monat“' }),
          highlight: z.boolean().optional().meta({ title: 'Hervorheben (roter Rahmen)' }),
          status,
        }),
      )
      .meta({ title: 'Preisstufen', itemTitle: 'Preisstufe' }),
    notes: z.array(localized('Hinweis', { multiline: true })).meta({ title: 'Hinweise unter den Preisen', itemTitle: 'Hinweis' }),
  })
  .meta({ title: 'Preise' });

export const teamMemberSchema = z
  .object({
    id: contentId(),
    name: z.string().trim().min(1, 'Bitte einen Namen eingeben.').meta({ title: 'Name' }),
    role: localized('Rolle / Qualifikation'),
    bio: localized('Kurzbiografie', { multiline: true }),
    teaches: localizedList('Unterrichtet', { min: 0 }),
    photo: image('Portrait', { maxWidth: 800 }).optional(),
    status,
  })
  .meta({ title: 'Teammitglied' });

export const qualitySchema = z
  .object({
    title: localized('Überschrift'),
    paragraphs: localizedList('Text', { help: 'Ein Absatz pro Zeile.' }),
  })
  .meta({ title: 'Qualität (Über uns)' });

export const eventSchema = z
  .object({
    id: contentId(),
    title: localized('Titel'),
    startDate: isoDate('Datum (Beginn)'),
    endDate: isoDate('Datum (Ende)').optional().meta({ description: 'Nur bei mehrtägigen Events.' }),
    location: z.string().trim().min(1, 'Bitte einen Ort angeben.').meta({ title: 'Ort' }),
    description: localized('Beschreibung', { multiline: true }),
    image: image('Bild / Plakat', { maxWidth: 1200 }).optional(),
    link: link('Link (z. B. Anmeldung)').optional(),
    status,
  })
  .refine((e) => !e.endDate || e.endDate >= e.startDate, { message: 'Das Ende liegt vor dem Beginn.', path: ['endDate'] })
  .meta({ title: 'Event' });

export const galleryItemSchema = z
  .object({
    id: contentId(),
    image: image('Foto'),
    caption: localized('Bildunterschrift').optional(),
    status,
  })
  .meta({ title: 'Galeriebild' });

export const legalPageSchema = z
  .object({
    sections: z
      .array(z.object({ heading: localized('Überschrift'), paragraphs: localizedList('Absätze', { help: 'Ein Absatz pro Zeile.' }) }))
      .meta({ title: 'Abschnitte', itemTitle: 'Abschnitt' }),
    status,
  })
  .meta({ title: 'Rechtstext' });

/* ───────────── inferred TypeScript types ───────────── */

export type SiteInfo = z.infer<typeof siteSchema>;
export type PagesContent = z.infer<typeof pagesSchema>;
export type HomeContent = z.infer<typeof homeSchema>;
export type Course = z.infer<typeof courseSchema>;
export type ScheduleEntry = z.infer<typeof scheduleEntrySchema>;
export type PricesContent = z.infer<typeof pricesSchema>;
export type PricePlan = PricesContent['plans'][number];
export type TeamMember = z.infer<typeof teamMemberSchema>;
export type QualityContent = z.infer<typeof qualitySchema>;
export type EventItem = z.infer<typeof eventSchema>;
export type GalleryItem = z.infer<typeof galleryItemSchema>;
export type LegalPage = z.infer<typeof legalPageSchema>;
export type ImageAsset = NonNullable<Course['image']>;
export type LinkItem = HomeContent['hero']['primaryCta'];
export type ContentStatus = NonNullable<Course['status']>;
export type Weekday = (typeof WEEKDAYS)[number];
export type AudienceId = (typeof AUDIENCES)[number];
export type PageId = (typeof PAGE_IDS)[number];
export type PageMeta = PagesContent['home']['meta'];
export type PageHeaderContent = PagesContent['home']['header'];
export type HeroContent = HomeContent['hero'];
