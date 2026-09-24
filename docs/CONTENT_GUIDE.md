# Content guide

Everything visitors see comes from **`src/content/`**. You never need to touch component code
to change texts, times, prices, people, events or images.

| I want to change… | File |
|---|---|
| Address, phone, email, Instagram, office hours | `site.ts` |
| Menu entries / order | `navigation.ts` |
| Page titles, SEO descriptions, home page texts, hero | `pages.ts` |
| Classes | `courses.ts` |
| Timetable | `schedule.ts` |
| Fees | `prices.ts` |
| Team, quality statement | `team.ts` |
| Workshops / events | `events.ts` |
| Gallery | `gallery.ts` |
| Impressum / Datenschutz | `legal.ts` |
| Button labels, screen-reader texts, weekday names | `ui.ts` |

## Languages

Every text is an object with German (required) and English (optional):

```ts
title: { de: 'Ballett für Erwachsene', en: 'Ballet for adults' }
```

If `en` is missing, the English page shows the German text – so you can publish German first.

## Common tasks

### Change a class time

`schedule.ts`:

```ts
{ id: 'mon-2', day: 'mon', start: '16:00', end: '17:00', courseId: 'ballett-kinder',
  level: { de: 'Stufe 1', en: 'Level 1' }, teacherId: 'maricel-hagenaars' },
```

- `day`: `mon` `tue` `wed` `thu` `fri` `sat` `sun`
- `courseId` must be an `id` from `courses.ts`, `teacherId` an `id` from `team.ts` – the tests fail otherwise.

### Add an event

`events.ts` – dates as `YYYY-MM-DD`. Past events move to "Vergangene Termine" automatically.

```ts
{
  id: 'sommerauffuehrung-2027',
  title: { de: 'Sommeraufführung', en: 'Summer performance' },
  startDate: '2027-07-10',
  location: 'Haßloch',
  description: { de: '…', en: '…' },
},
```

### Add images

1. Optimise: max. ~1600 px wide (gallery) / 800 px (portraits), `.webp` or `.jpg`, ideally < 300 KB.
   (e.g. <https://squoosh.app>)
2. Save under `src/assets/images/…`
3. Import at the top of the content file and reference it:

```ts
import sommer1 from '@/assets/images/gallery/sommer-2026-1.webp';

{ id: 'sommer-1', image: { src: sommer1, alt: { de: 'Kinder in rosa Tutus beim Schlussbild', en: '…' }, width: 1600, height: 1067 } }
```

**Alt text is required**: describe what is visible, as you would on the phone. Only people with
documented consent (parents for children!) may be shown.

### Hero photo

Use a black-and-white cut-out (transparent `.png`/`.webp`) – the design places it over the red
poster background. Set it in `pages.ts → homeHero.image`.

## Placeholders

Sample data is marked with `status: 'placeholder'` or a `// PLACEHOLDER` comment.

- In `yarn dev` these items show a dashed **"Beispielinhalt"** badge.
- `yarn content:check` lists all of them.
- **The production deploy refuses to run while any remain.** Replace the data, then delete the
  marker (or set `status: 'published'`).

## Before you commit

```bash
yarn check
```

Then commit with e.g. `content(#3): enter timetable 2026/27`.
