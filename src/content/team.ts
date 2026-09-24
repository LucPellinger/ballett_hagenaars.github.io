import type { Localized, TeamMember } from './types';

/**
 * Teachers. `id` is referenced by schedule.ts → teacherId.
 * PLACEHOLDER: taken from the old website – please confirm who is still teaching.
 */
export const team: TeamMember[] = [
  {
    id: 'maricel-hagenaars',
    name: 'Maricel Hagenaars',
    role: { de: 'Schulleitung · Dipl. Tanzpädagogin', en: 'Director · certified dance teacher' },
    bio: {
      de: 'Diplomierte Tanzpädagogin aus den Niederlanden – und hat (fast) immer gute Laune.',
      en: 'Certified dance teacher from the Netherlands – and (almost) always in a good mood.',
    },
    teaches: { de: ['Kinderballett', 'Ballett', 'Flamenco', 'Modern'], en: ["Children's ballet", 'Ballet', 'Flamenco', 'Modern'] },
    status: 'placeholder',
  },
  {
    id: 'giovanni-de-buono',
    name: 'Giovanni De Buono',
    role: { de: 'Staatl. gepr. Bühnentänzer & Choreograf', en: 'State-certified stage dancer & choreographer' },
    bio: {
      de: 'Bühnentänzer, Choreograf und Tanzlehrer mit italienischen Wurzeln.',
      en: 'Stage dancer, choreographer and dance teacher with Italian roots.',
    },
    teaches: { de: ['Jazz Teens', 'Ballett', 'Modern', 'Street Jazz'], en: ['Teen jazz', 'Ballet', 'Modern', 'Street jazz'] },
    status: 'placeholder',
  },
  {
    id: 'pascal-stopp',
    name: 'Pascal Stopp',
    role: { de: 'Staatl. gepr. Bühnentänzer & Tanzpädagoge', en: 'State-certified stage dancer & dance teacher' },
    bio: { de: 'Choreograf und Company-Leiter von Urban Pace.', en: 'Choreographer and company director of Urban Pace.' },
    teaches: { de: ['Hip-Hop', 'Ballett'], en: ['Hip-hop', 'Ballet'] },
    status: 'placeholder',
  },
  {
    id: 'agnes-chartrin-wolf',
    name: 'Agnes Chartrin-Wolf',
    role: { de: 'Trainerin für Aerobic, Sport & Gymnastik', en: 'Aerobics, sports & gymnastics trainer' },
    bio: { de: 'Aus Frankreich – spezialisiert auf die jüngsten Tänzer:innen.', en: 'From France – specialised in our youngest dancers.' },
    teaches: { de: ['Kinderballett', 'Fit Gym'], en: ["Children's ballet", 'Fit gym'] },
    status: 'placeholder',
  },
  {
    id: 'tanja-leiser',
    name: 'Tanja Leiser',
    role: { de: 'Integrativer Tanz', en: 'Integrative dance' },
    bio: {
      de: 'Tanzstudium in den USA, Europameisterin im Hip-Hop-Freestyle (Formation); Zusatzqualifikationen in Tanztherapie und Bewegungspädagogik.',
      en: 'Studied dance in the USA, European champion in hip-hop freestyle (formation); additional qualifications in dance therapy and movement education.',
    },
    teaches: { de: ['Integrativer Tanz', 'Hip-Hop', 'Zumba'], en: ['Integrative dance', 'Hip-hop', 'Zumba'] },
    status: 'placeholder',
  },
  {
    id: 'reinhold-ritter',
    name: 'Reinhold Ritter',
    role: { de: 'Step-Lehrer, Tänzer & Choreograf', en: 'Tap teacher, dancer & choreographer' },
    bio: { de: 'Hauptberuflich Physiotherapeut.', en: 'Physiotherapist by profession.' },
    teaches: { de: ['Step'], en: ['Tap'] },
    status: 'placeholder',
  },
];

export const qualityStatement: { title: Localized; paragraphs: Localized<string[]> } = {
  title: { de: 'Qualität', en: 'Quality' },
  paragraphs: {
    de: [
      'Die Ballettschule Hagenaars ist Mitglied im Deutschen Berufsverband für Tanzpädagogik e.V.',
      'Unser Team besteht ausschließlich aus qualifiziertem Personal – diplomierte Tanzpädagog:innen und staatlich geprüfte Bühnentänzer:innen.',
    ],
    en: [
      'Hagenaars Ballet School is a member of the German Professional Association for Dance Teachers (DBfT e.V.).',
      'Our team consists exclusively of qualified staff – certified dance teachers and state-certified stage dancers.',
    ],
  },
};
