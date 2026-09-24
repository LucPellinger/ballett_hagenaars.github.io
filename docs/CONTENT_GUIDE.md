# Content guide (developers)

> **Non-developers:** use the visual editor – `yarn cms` – see **[CMS_GUIDE.md](CMS_GUIDE.md)** (German).

All content lives in **`src/content/data/*.json`** and is described by **content models** in
`src/content/schema.ts`. No component code changes for a content update.

## Architecture

```
src/content/
├── data/*.json        ← the content (edited by the CMS or by hand)
├── schema.ts          ← Zod models: shape + rules + editor labels/widgets (.meta)
├── collections.ts     ← which JSON file ↔ which model, editor grouping, list labels, new-item templates
├── validate.ts        ← validateAll(): schema + unique ids + references + images exist (German messages)
├── images.ts          ← maps "gallery/foo.webp" → built asset URL (import.meta.glob)
├── index.ts           ← exports typed content for the website (no Zod in the site bundle)
├── types.ts           ← re-exports z.infer types for components
├── navigation.ts, ui.ts  ← developer-owned (routes, interface strings)
└── content.test.ts    ← runs validateAll in CI → invalid content never deploys
src/assets/content/<collection>/  ← images referenced from the JSON
```

One model feeds four things: **TypeScript types**, **CI validation**, **editor forms**, **editor validation**.

| File | Collection | Editor label |
|---|---|---|
| `site.json` | school master data | Schuldaten |
| `home.json` | hero, highlights, section headings | Startseite |
| `pages.json` | `<title>`, SEO description, red page header per page | Seitentitel |
| `courses.json` | classes | Kurse |
| `schedule.json` | timetable (`courseId` → courses, `teacherId` → team) | Stundenplan |
| `prices.json` | fee plans + notes | Preise |
| `team.json` | teachers | Team |
| `quality.json` | "Qualität" text | Qualität |
| `events.json` | workshops / performances | Events |
| `gallery.json` | photos | Galerie |
| `imprint.json`, `privacy.json` | legal sections | Impressum, Datenschutz |

## Conventions

- Localized text: `{ "de": "…", "en": "…" }` – `de` required, `en` optional (falls back to German).
- Localized lists (paragraphs, bullet lists): `{ "de": ["…", "…"], "en": [...] }`.
- Images: `{ "src": "gallery/foo.webp", "alt": { "de": "…" }, "width": 1600, "height": 1067 }`
  – `src` is relative to `src/assets/content/`; the file must exist (tested).
- IDs: kebab-case, unique per collection (tested); the editor generates them.
- Sample content: `"status": "placeholder"` → dev badge, `yarn content:check`, blocks live deploys.

## Adding a field or content type

1. Add/extend the Zod model in `schema.ts` (with `.meta({ title, description, widget })` for the editor).
2. New collection? Add the JSON file, an entry in `collections.ts` (`COLLECTION_IDS` + definition)
   and an export in `index.ts`.
3. Use it in components via `@/content` (types come from `types.ts`).
4. `yarn check` – the editor picks up the new field automatically.

Editor widgets (`meta.widget`): `localized`, `localizedList`, `image` (`maxWidth`), `ref` (`ref: 'courses'`),
`status`, `id`, `textarea`, `time`, `date`, `url`. Enums get a select (`labels` for names), arrays of
enums get checkboxes, arrays of objects get a repeatable group (`itemTitle`).

## Editing JSON by hand

Fine for developers – run `yarn check` afterwards. Commit as `content(#id): …`.
