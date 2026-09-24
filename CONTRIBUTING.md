# Contributing

Rules for working on this repository – for humans and for Claude.

## Branches

| Branch | Purpose | Who writes to it |
|---|---|---|
| `dev` | Integration – all finished tickets land here first. **Default branch.** | PRs from ticket branches |
| `main` | Stable release candidate – what we intend to ship next | `./scripts/promote.sh main` (dev → main) |
| `prod` | **Live website.** Every push triggers the GitHub Pages deploy. | `./scripts/promote.sh prod` (main → prod) or a hotfix PR |
| `<type>/<id>-<slug>` | Work on exactly one ticket | You |

Ticket branch names: `<type>/<ticket-id>-<short-slug>` (lowercase, dashes)

```
feat/13-gallery-lightbox
fix/21-menu-closes-on-scroll
content/3-real-timetable
hotfix/22-wrong-phone-number
chore/2-github-repo-setup
```

The `pre-push` hook and CI reject other names. `yarn ticket:new` prints the correct branch name for you.

### Flow

```
            ┌─────────── ticket branch ───────────┐
dev ────────┴──●──────────────────────────PR──────▶●──────▶ promote ──▶ main ──▶ promote ──▶ prod 🌐
                                                                                         ▲
prod ──▶ hotfix/<id>-… ───────────────────────────────────────────────PR─────────────────┘
                     └── afterwards: merge prod back into main and dev
```

1. `git switch dev && git pull`
2. `git switch -c feat/13-gallery-lightbox`
3. `yarn ticket:move 13 in-progress`
4. Work, commit (see below), `yarn check`
5. Push, open a PR **into `dev`**, `yarn ticket:move 13 review`
6. CI green → squash-merge or merge → `yarn ticket:move 13 done`
7. Release when ready: `./scripts/promote.sh main`, check, then `./scripts/promote.sh prod`

### Hotfixes (something is wrong on the live site)

1. `git switch prod && git pull && git switch -c hotfix/22-wrong-phone-number`
2. Fix, commit as `hotfix(#22): correct phone number`, PR **into `prod`** → deploys on merge
3. Bring the fix back: `git switch main && git merge prod && git push`, then the same for `dev`

## Commit messages

```
<type>(#<ticket-id>): <summary in imperative mood>
<type>: <summary>                      ← allowed when there is no ticket
```

| Type | Use for |
|---|---|
| `feat` | New feature or component |
| `fix` | Bug fix |
| `hotfix` | Urgent fix directly for `prod` |
| `content` | Text/image/timetable/price updates in `src/content/` |
| `docs` | Documentation only |
| `chore` | Tooling, dependencies, config, tickets |
| `refactor` | Code change without behaviour change |
| `style` | Formatting / CSS polish without logic change |
| `test` | Tests only |
| `perf`, `build`, `ci`, `revert` | as the name says |

Examples:

```
feat(#13): add accessible lightbox to gallery
content(#3): enter timetable for school year 2026/27
fix: keep mobile menu closed after language switch
chore: update dependencies
docs: explain hotfix flow in CONTRIBUTING
```

The `commit-msg` hook checks this locally (activated automatically by `yarn install`,
or manually with `yarn hooks:install`). CI checks every commit in a PR again.

## Tickets

The board lives in git: one Markdown file per ticket in [`tickets/`](tickets/), summarised in
[BOARD.md](BOARD.md).

```bash
yarn ticket:new "Gallery lightbox" --type feat --priority low   # creates tickets/0NN-gallery-lightbox.md
yarn ticket:move 13 in-progress                                  # backlog → todo → in-progress → review → done
yarn board                                                       # regenerate BOARD.md
```

Commit ticket changes with the work they belong to. Ticket IDs are never reused.

## Definition of done

- [ ] `yarn check` is green (typecheck, lint incl. jsx-a11y, tests)
- [ ] Mobile (≈ 390 px) and desktop checked
- [ ] Light and dark mode checked
- [ ] German and English checked (English may fall back to German)
- [ ] Keyboard-only navigation works, focus is visible
- [ ] New content types have tests in `src/content/content.test.ts`
- [ ] Ticket moved to `done`

## Code conventions

- One folder per component: `Name.tsx`, `Name.module.css`, `index.ts`, optional `Name.test.tsx`.
- Components get data via props or from `@/content` – **no hard-coded user-facing text in components**
  (put it in `src/content/ui.ts` or the relevant content file).
- Use design tokens (`var(--color-…)`, `var(--space-…)`) – no raw colours in component CSS.
- Semantic HTML first; ARIA only where HTML has no equivalent.
- Keep dependencies minimal. Discuss before adding one.
