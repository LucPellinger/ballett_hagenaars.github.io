import type { HeroContent, LinkItem, Localized, PageHeaderContent, PageId, PageMeta } from './types';

/**
 * Per-page texts: browser title/SEO description and the poster-style page header.
 */
export const pages: Record<PageId, { meta: PageMeta; header: PageHeaderContent }> = {
  home: {
    meta: {
      title: { de: 'Ballettschule Hagenaars · Haßloch', en: 'Hagenaars Ballet School · Haßloch' },
      description: {
        de: 'Kindertanz, Ballett, Ballett für Erwachsene, Modern, Flamenco und Jazz für Teens in Haßloch. Bis zu drei kostenlose Schnupperstunden.',
        en: "Children's dance, ballet for all ages, modern, flamenco and teen jazz in Haßloch. Up to three free trial classes.",
      },
    },
    header: { title: { de: 'Ballettschule Hagenaars', en: 'Hagenaars Ballet School' } },
  },
  courses: {
    meta: {
      title: { de: 'Unterricht', en: 'Classes' },
      description: { de: 'Unser Unterrichtsangebot für Kinder, Jugendliche und Erwachsene.', en: 'Our classes for children, teens and adults.' },
    },
    header: {
      eyebrow: { de: 'Unterrichtsangebot', en: 'What we teach' },
      title: { de: 'Tanz für jedes Alter', en: 'Dance for every age' },
      lead: {
        de: 'Vom ersten Kindertanz bis zum Ballett für Erwachsene – finden Sie den passenden Kurs.',
        en: 'From first steps in creative dance to ballet for adults – find the right class.',
      },
    },
  },
  schedule: {
    meta: {
      title: { de: 'Stundenplan', en: 'Timetable' },
      description: { de: 'Alle Kurse und Zeiten der Ballettschule Hagenaars.', en: 'All classes and times at Hagenaars Ballet School.' },
    },
    header: {
      eyebrow: { de: 'Schuljahr 2026/27', en: 'School year 2026/27' },
      title: { de: 'Stundenplan', en: 'Timetable' },
      lead: {
        de: 'Probieren Sie bis zu drei Schnupperstunden kostenlos und unverbindlich aus.',
        en: 'Try up to three trial classes – free of charge and without obligation.',
      },
    },
  },
  prices: {
    meta: {
      title: { de: 'Preise', en: 'Fees' },
      description: { de: 'Unterrichtsgebühren der Ballettschule Hagenaars.', en: 'Class fees at Hagenaars Ballet School.' },
    },
    header: {
      eyebrow: { de: 'Unterrichtsgebühren', en: 'Tuition' },
      title: { de: 'Preise', en: 'Fees' },
      lead: {
        de: 'Für Geschwisterkinder gewähren wir Ermäßigung – sprechen Sie uns an!',
        en: 'We offer sibling discounts – just ask us!',
      },
    },
  },
  school: {
    meta: {
      title: { de: 'Über uns', en: 'About us' },
      description: { de: 'Team und Qualitätsanspruch der Ballettschule Hagenaars.', en: 'Team and teaching standards of Hagenaars Ballet School.' },
    },
    header: {
      eyebrow: { de: 'Die Ballettschule', en: 'The school' },
      title: { de: 'Unser Team', en: 'Our team' },
      lead: {
        de: 'Unser Team besteht ausschließlich aus qualifiziertem Personal.',
        en: 'Our team consists exclusively of qualified teachers.',
      },
    },
  },
  events: {
    meta: {
      title: { de: 'Events & Workshops', en: 'Events & workshops' },
      description: { de: 'Workshops, Aufführungen und Termine.', en: 'Workshops, performances and dates.' },
    },
    header: {
      eyebrow: { de: 'Workshops & Aufführungen', en: 'Workshops & performances' },
      title: { de: 'Events', en: 'Events' },
    },
  },
  gallery: {
    meta: {
      title: { de: 'Galerie', en: 'Gallery' },
      description: { de: 'Eindrücke aus Unterricht und Aufführungen.', en: 'Impressions from classes and performances.' },
    },
    header: { eyebrow: { de: 'Eindrücke', en: 'Impressions' }, title: { de: 'Galerie', en: 'Gallery' } },
  },
  contact: {
    meta: {
      title: { de: 'Kontakt', en: 'Contact' },
      description: { de: 'So erreichen Sie die Ballettschule Hagenaars in Haßloch.', en: 'How to reach Hagenaars Ballet School in Haßloch.' },
    },
    header: {
      eyebrow: { de: 'Wir freuen uns auf Sie', en: "We'd love to hear from you" },
      title: { de: 'Kontakt', en: 'Contact' },
      lead: {
        de: 'Fragen zu Kursen oder eine Schnupperstunde vereinbaren? Rufen Sie an oder schreiben Sie uns.',
        en: 'Questions about classes or want to book a trial? Call us or send an email.',
      },
    },
  },
  imprint: {
    meta: { title: { de: 'Impressum', en: 'Legal notice' }, description: { de: 'Impressum', en: 'Legal notice' } },
    header: { title: { de: 'Impressum', en: 'Legal notice' } },
  },
  privacy: {
    meta: { title: { de: 'Datenschutz', en: 'Privacy policy' }, description: { de: 'Datenschutzerklärung', en: 'Privacy policy' } },
    header: { title: { de: 'Datenschutz', en: 'Privacy policy' } },
  },
};

/* ---------- Home page ---------- */

export const homeHero: HeroContent = {
  headline: {
    de: ['Tanzen', 'lernen in', 'Haßloch'],
    en: ['Learn to', 'dance in', 'Haßloch'],
  },
  meta: {
    de: ['Ballett · Modern', 'Flamenco · Jazz'],
    en: ['Ballet · Modern', 'Flamenco · Jazz'],
  },
  lead: {
    de: 'Kindertanz, Ballett für Kinder und Erwachsene, Modern, Flamenco und Jazz für Teens – mit Freude, Technik und qualifizierten Tanzpädagog:innen.',
    en: "Children's dance, ballet for children and adults, modern, flamenco and teen jazz – taught with joy, technique and qualified dance teachers.",
  },
  // image: { src: heroImg, alt: { de: '…', en: '…' } },  ← add a black & white dance photo here
  primaryCta: { label: { de: 'Kostenlose Schnupperstunde', en: 'Book a free trial class' }, href: '/kontakt' },
  secondaryCta: { label: { de: 'Stundenplan', en: 'Timetable' }, href: '/stundenplan' },
};

export const homeHighlights: { title: Localized; text: Localized }[] = [
  {
    title: { de: '3 Schnupperstunden gratis', en: '3 free trial classes' },
    text: {
      de: 'Kostenlos und unverbindlich bis zu drei Schnupperstunden ausprobieren.',
      en: 'Try up to three classes for free and without obligation.',
    },
  },
  {
    title: { de: 'Qualifiziertes Team', en: 'Qualified team' },
    text: {
      de: 'Diplomierte Tanzpädagog:innen und staatlich geprüfte Bühnentänzer:innen.',
      en: 'Certified dance teachers and state-certified stage dancers.',
    },
  },
  {
    title: { de: 'Für jedes Alter', en: 'For every age' },
    text: {
      de: 'Vom Eltern-Kind-Kurs „Dance Together“ bis zum Ballett für Erwachsene.',
      en: 'From the parent & child class “Dance Together” to ballet for adults.',
    },
  },
];

export const homeSections = {
  highlights: {
    title: { de: 'Warum die Ballettschule Hagenaars?', en: 'Why Hagenaars Ballet School?' },
  },
  courses: {
    eyebrow: { de: 'Unterricht', en: 'Classes' },
    title: { de: 'Unsere Kurse', en: 'Our classes' },
  },
  events: {
    eyebrow: { de: 'Demnächst', en: 'Coming up' },
    title: { de: 'Workshops & Events', en: 'Workshops & events' },
  },
  cta: {
    title: { de: 'Lust auf Tanz?', en: 'Ready to dance?' },
    text: {
      de: 'Vereinbaren Sie eine kostenlose Schnupperstunde – wir beraten Sie gern, welcher Kurs passt.',
      en: 'Book a free trial class – we are happy to help you find the right course.',
    },
    link: { label: { de: 'Kontakt aufnehmen', en: 'Get in touch' }, href: '/kontakt' } satisfies LinkItem,
  },
} satisfies Record<string, Record<string, Localized | LinkItem>>;
