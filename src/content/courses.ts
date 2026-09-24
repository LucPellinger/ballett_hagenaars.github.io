import type { Course } from './types';

/**
 * Class offering. `id` is referenced by the timetable (schedule.ts → courseId).
 * PLACEHOLDER: descriptions are drafts – please review wording, then set status to 'published'.
 */
export const courses: Course[] = [
  {
    id: 'kindertanz',
    title: { de: 'Kindertanz', en: "Children's creative dance" },
    audience: ['kids'],
    ageGroup: { de: 'ab 4 Jahren', en: 'from age 4' },
    summary: {
      de: 'Spielerisch Rhythmus, Musik und Bewegung entdecken.',
      en: 'Discover rhythm, music and movement through play.',
    },
    description: {
      de: [
        'Im Kindertanz entdecken die Kleinsten ihre Freude an Musik und Bewegung.',
        'Fantasievolle Bewegungsgeschichten fördern Koordination, Körpergefühl und Kreativität – die ideale Vorbereitung auf das Kinderballett.',
      ],
      en: [
        'In creative dance, our youngest dancers discover the joy of music and movement.',
        'Imaginative movement stories build coordination, body awareness and creativity – the perfect preparation for children’s ballet.',
      ],
    },
    status: 'placeholder',
  },
  {
    id: 'dance-together',
    title: { de: 'Dance Together: Mutter & Kind', en: 'Dance Together: parent & child' },
    audience: ['family'],
    ageGroup: { de: 'Kinder ab 2 Jahren mit Begleitung', en: 'children from age 2 with a parent' },
    summary: {
      de: 'Gemeinsam tanzen, lachen und sich bewegen.',
      en: 'Dance, laugh and move together.',
    },
    description: {
      de: ['Eltern und Kinder erleben Tanz gemeinsam – mit Liedern, Spielen und ersten Schritten.'],
      en: ['Parents and children experience dance together – with songs, games and first steps.'],
    },
    status: 'placeholder',
  },
  {
    id: 'ballett-kinder',
    title: { de: 'Ballett für Kinder & Jugendliche', en: 'Ballet for children & teens' },
    audience: ['kids', 'teens'],
    ageGroup: { de: 'ab 6 Jahren', en: 'from age 6' },
    summary: {
      de: 'Klassische Technik, Haltung und Ausdruck – aufbauend nach Stufen.',
      en: 'Classical technique, posture and expression – progressing by level.',
    },
    description: {
      de: [
        'Im klassischen Ballett lernen Kinder und Jugendliche Schritt für Schritt die Grundlagen der Technik an der Stange und im Raum.',
        'Der Unterricht ist nach Alter und Können in Stufen aufgebaut.',
      ],
      en: [
        'In classical ballet, children and teens learn the fundamentals of technique at the barre and in the centre, step by step.',
        'Classes are organised in levels by age and ability.',
      ],
    },
    status: 'placeholder',
  },
  {
    id: 'ballett-erwachsene',
    title: { de: 'Ballett für Erwachsene', en: 'Ballet for adults' },
    audience: ['adults'],
    ageGroup: { de: 'Einsteiger & Wiedereinsteiger', en: 'beginners & returners' },
    summary: {
      de: 'Eleganz, Kraft und Beweglichkeit – nie zu spät zum Anfangen.',
      en: 'Elegance, strength and flexibility – it is never too late to start.',
    },
    description: {
      de: ['Ballett für Erwachsene verbindet klassische Technik mit einem wohltuenden Ganzkörpertraining.'],
      en: ['Adult ballet combines classical technique with a full-body workout that feels good.'],
    },
    status: 'placeholder',
  },
  {
    id: 'modern',
    title: { de: 'Modern Dance', en: 'Modern dance' },
    audience: ['teens', 'adults'],
    ageGroup: { de: 'ab 12 Jahren', en: 'from age 12' },
    summary: {
      de: 'Freier Ausdruck, Bodenarbeit und Improvisation.',
      en: 'Free expression, floor work and improvisation.',
    },
    description: {
      de: ['Modern Dance arbeitet mit Schwerkraft, Atmung und Raum – ausdrucksstark und vielseitig.'],
      en: ['Modern dance works with gravity, breath and space – expressive and versatile.'],
    },
    status: 'placeholder',
  },
  {
    id: 'flamenco',
    title: { de: 'Flamenco', en: 'Flamenco' },
    audience: ['adults', 'teens'],
    ageGroup: { de: 'Jugendliche & Erwachsene', en: 'teens & adults' },
    summary: {
      de: 'Rhythmus, Leidenschaft und Zapateado.',
      en: 'Rhythm, passion and zapateado.',
    },
    description: {
      de: ['Flamenco verbindet präzise Fußtechnik, Armführung und Palmas mit der Energie andalusischer Musik.'],
      en: ['Flamenco combines precise footwork, arm movements and palmas with the energy of Andalusian music.'],
    },
    status: 'placeholder',
  },
  {
    id: 'jazz-teens',
    title: { de: 'Jazz für Teens', en: 'Jazz for teens' },
    audience: ['teens'],
    ageGroup: { de: 'ab 11 Jahren', en: 'from age 11' },
    summary: {
      de: 'Dynamische Choreografien zu aktueller Musik.',
      en: 'Dynamic choreographies to current music.',
    },
    description: {
      de: ['Jazz Dance mit Einflüssen aus Street Jazz und Modern – energiegeladen und mit viel Spaß.'],
      en: ['Jazz dance with influences from street jazz and modern – energetic and lots of fun.'],
    },
    status: 'placeholder',
  },
];
