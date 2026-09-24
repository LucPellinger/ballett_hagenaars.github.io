# Ballettschule Hagenaars – Website

Multi-page progressive web app for **Ballettschule Hagenaars**, Haßloch
(Kindertanz, Ballett, Modern, Flamenco, Jazz).

- **Stack:** React 19 · Vite 8 · TypeScript (strict) · React Router 7 · Yarn 4 · Vitest
- **Hosting:** GitHub Pages, deployed automatically from the `prod` branch
- **Languages:** German (primary) + English, switchable in the header
- **Accessibility:** WCAG 2.2 AA colours, light/dark mode, skip link, keyboard & screen-reader friendly
- **PWA:** installable, works offline after the first visit
- **Privacy:** no cookies, no tracking, no external fonts or maps

## Quick start

```bash
corepack enable          # once per machine – provides the pinned Yarn version
./scripts/setup.sh       # installs deps, activates git hooks, starts http://localhost:5173
```

New machine? Follow **[ONBOARDING.md](ONBOARDING.md)** step by step.

## Scripts

| Command | What it does |
|---|---|
| `yarn dev` | Dev server with hot reload (sample content shows a "Beispielinhalt" badge) |
| `yarn build` | Typecheck + production build into `dist/` |
| `yarn preview` | Serve the production build locally |
| `yarn check` | Typecheck + lint + tests + placeholder report – run before every PR |
| `yarn test:watch` | Tests in watch mode |
| `yarn content:check` | Lists content still marked as placeholder |
| `yarn ticket:new "Title" --type feat` | Create a ticket in `tickets/` |
| `yarn ticket:move 12 in-progress` | Change a ticket's status |
| `yarn board` | Regenerate [BOARD.md](BOARD.md) |
| `./scripts/promote.sh main` / `prod` | Release: dev → main → prod (prod = live) |

## Editing content

**All texts, images, links, timetable, prices, team and events live in [`src/content/`](src/content/)** –
no component code needs to change for a content update. Start at
[`src/content/index.ts`](src/content/index.ts), which maps "what you want to change" → file.
Details and examples: **[docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md)**.

## Project structure

```
├── .github/workflows/     ci.yml (every push/PR) · deploy.yml (prod → GitHub Pages)
├── .githooks/             commit-msg + pre-push convention checks
├── docs/                  CONTENT_GUIDE.md
├── public/                favicon, PWA icons, robots.txt (copied as-is)
├── scripts/               setup.sh · promote.sh · ticket.mjs · check-content.mjs
├── tickets/               the ticket board (one .md per ticket) → BOARD.md
└── src/
    ├── content/           ★ all website content + types + integrity tests
    ├── components/
    │   ├── layout/        Layout, Header, Footer, SkipLink
    │   ├── ui/            Hero, PageHeader, SectionHeader, Button, LanguageSwitcher, ThemeToggle, …
    │   └── features/      CourseGrid, ScheduleView, PriceTable, TeamGrid, EventList, Gallery, …
    ├── pages/             one component per route (composes components + content)
    ├── i18n/              language context, `Localized<T>` type, date/price formatting
    ├── theme/             light/dark context
    ├── styles/            tokens.css (design tokens) · global.css
    ├── routes.tsx         URL → page mapping (URLs defined in content/navigation.ts)
    └── main.tsx           entry: PWA registration, deep-link restore
```

Every component lives in its own folder: `Component.tsx` + `Component.module.css`
(scoped CSS Modules) + `index.ts` (+ `Component.test.tsx`).

## Branches & workflow

```
feat/12-gallery-lightbox ──PR──▶ dev ──promote──▶ main ──promote──▶ prod ──▶ 🌐 live
                                                                   ▲
hotfix/20-wrong-phone-number ──────────────────────────────PR──────┘ (then merge back)
```

- `dev` – integration branch, target of all feature PRs (default branch)
- `main` – stable release candidate
- `prod` – what is live; every push deploys to GitHub Pages
- Commits: `feat(#12): add gallery lightbox`, `fix: …`, `hotfix: …`, `chore: …`, `docs: …`, `content(#3): …`

Full rules: **[CONTRIBUTING.md](CONTRIBUTING.md)** · Ticket board: **[BOARD.md](BOARD.md)**

## Deployment

1. One-time: GitHub repo → *Settings → Pages → Source: **GitHub Actions***.
2. `./scripts/promote.sh prod` (or merge a PR into `prod`).
3. The *Deploy (prod)* workflow runs all checks, **refuses to publish while placeholder content remains**,
   builds with the correct base path (custom domain or `/<repo>/`) and publishes.

### Preview for reviewers (sample content allowed)

```bash
gh workflow run deploy.yml --ref dev -f preview=true
gh run watch
```

Deploys the chosen branch with a "Vorschau" banner, visible "Beispielinhalt" badges and `noindex`,
skipping the placeholder check. GitHub Pages hosts one site per repo, so a preview replaces whatever is
currently published – use it only until the real site goes live (then see ticket #15 for a separate staging URL).

## Design

Poster-inspired typography (see the Flamenco-workshop poster): oversized, tightly tracked grotesk
headlines in orange on a grainy deep red, black-and-white photography. Colours and type scale are
defined once in [`src/styles/tokens.css`](src/styles/tokens.css); all colour pairs meet WCAG AA contrast
in both themes.
