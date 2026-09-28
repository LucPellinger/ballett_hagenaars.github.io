# Project status & hand-off

> **Read this first in every new session** (together with `CLAUDE.md`), and **update it at the end of every
> session**: snapshot, next steps, decisions. Tickets (`tickets/`, `BOARD.md`) remain the source of truth for
> individual tasks – this file is the big picture and the "how we work".
>
> Last updated: **2026-09-28** (after release of #22–#26).

## Resume in a new Claude session

Open the project folder (`~/Documents/private/ballett_hagenaars.github.io`) in Claude / Cowork and start with:

```text
Read CLAUDE.md and docs/STATUS.md, then BOARD.md. Check `git status` and which branch I'm on,
compare dev/main/prod with GitHub, and tell me where we left off before changing anything.
```

## Snapshot

| Item | State |
|---|---|
| `dev` = `main` = `prod` | `e21402e` – everything up to #26 released |
| Live URL | <https://lucpellinger.eu/ballett_hagenaars.github.io/> – shows a **preview** build (banner, noindex) |
| Real deploy from `prod` | Blocked on purpose: 42 `"status": "placeholder"` entries (courses 8, schedule 11, team 6, events 5, gallery 4, prices 3, faq/pointe/performance/privacy/site 1 each). CI + tests are green; only the step „Refuse to publish sample/placeholder content“ fails |
| `content-management` | 2 **local, unpushed** commits (Maricel's portrait + dance photo, team text); 14 commits behind `prod` – the editor merges prod in on start/publish |
| Branch protection / rulesets | **none** on dev/main/prod |
| `github-pages` environment | allows `prod`, `dev`, `content-management` ✓ |
| Editor installer (#22) | Released; **not yet tested on a real Mac or Windows PC**; dad not yet invited as collaborator |

Released features (details in the tickets): redesign in Readymag style (#20), visual content editor with
one-click publishing (#19), one-line installer + app icon (#22), visitor text size + per-component text size in
the editor (#23), compact page tops (#25), header switches to the mobile menu when large text doesn't fit (#26).

## Next steps (suggested order)

1. **Test the editor for real** – `yarn cms` (or the app) → edit → „Veröffentlichen“ → **Vorschau**. This pushes
   `content-management` for the first time and closes #19.
2. **Test the installer** on the Mac with test folders:
   `BH_HOME=/tmp/bh-test BH_PROJECT=/tmp/bh-site bash installer/install-mac.sh` (remove the test app/Dock icon after).
   Windows: needs a real PC. Then invite dad's GitHub account (Settings → Collaborators, role *Write*) and send him
   `docs/CMS_GUIDE.md` §1.
3. **Replace sample content** (#3 timetable, #4 fees, #5 course texts, #6 team texts + photos incl. the „X“
   placeholders, #10 events, #9 gallery) – ideally by dad in the editor. When `yarn content:check` shows 0, a live
   publish / `promote.sh prod` puts the site properly online.
4. **Legal review** (#8) of Impressum + Datenschutz before going properly live.
5. **Branch protection** (#2): ruleset for `main`, `prod`, `dev` – PR required, CI must pass; bypass for the repo
   admin and GitHub Actions (needed for the editor's live publish → merge into prod).
6. Backlog: custom domain (#11), SEO (#12), lightbox (#13), accessibility audit (#14), staging preview (#15),
   contact form (#16), cookies/consent (#27).

## How we work (Luc + Claude)

### Flow for a change
1. New ticket (`yarn ticket:new "Title" --type feat|fix|chore`) → branch `<type>/<id>-<slug>` from `origin/dev`.
2. Change + tests → `yarn check` must pass → visual check (desktop ≥ 1280 px **and** ~390 px; light/dark;
   DE/EN; all three text sizes if layout is involved).
3. Commit `type(#id): …`, push, PR into `dev`, merge when CI is green.
4. Release: `bash scripts/promote.sh main` then `bash scripts/promote.sh prod` (use `bash …` – see below).
5. While sample content exists, show the result with a preview deploy:
   `gh workflow run deploy.yml --ref prod -f preview=true`.
6. Move tickets to done (`yarn ticket:move <id> done`), delete merged branches
   (`git push origin --delete …`, `git branch -d …`, `git fetch --prune`), update this file.

### Environment facts (important for Claude)
- **Only Luc's Mac can push to GitHub** (SSH alias `github-private`). Claude's cloud workspace and the shell on the
  Mac used by Claude have no GitHub credentials → Claude prepares commits/branches, Luc runs `git push`.
  The stop-hook reminder about „unpushed commits“ in Claude's cloud copy is expected and can be ignored.
- Claude reads GitHub state without credentials via the public API (`api.github.com/repos/LucPellinger/…`:
  branches, PRs, Actions runs/jobs) and can fetch over HTTPS:
  `git fetch https://github.com/LucPellinger/ballett_hagenaars.github.io.git dev:refs/remotes/origin/dev`.
- Moving work between Claude's cloud copy and the Mac: `git bundle` → copy to `~/Documents/private/` →
  `git fetch ../x.bundle branch:branch`. Never switch the Mac's checked-out branch while Luc has editor work open.
- macOS ships **bash 3.2**: in scripts write `${var}` before non-ASCII characters; run scripts with `bash …` if the
  executable bit gets lost. Keep `+x` on scripts (`git update-index --chmod=+x`).
- Yarn via Corepack; if `repo.yarnpkg.com` is blocked: `COREPACK_NPM_REGISTRY=https://registry.npmjs.org`.
- Visual checks in the cloud: `yarn dev --port 5301`, Playwright (`/opt/pw-browsers`), screenshots; for layout
  bugs sweep widths 360–1920 px × DE/EN × text sizes (see #26).
- `BOARD.md` conflicts between branches are normal → `git merge origin/dev --no-edit`, `yarn board`,
  `git add BOARD.md`, `git commit --no-edit`.
- Merges without an editor prompt: `git merge … --no-edit` (default editor is vim: Esc, `:wq`, Enter).
- Test a feature branch next to the editor's working copy with `git worktree add ../bh-test <branch>`.

## Decisions log (why things are the way they are)

- **`content-management` is based on `prod`**, not `dev`: a live publish from the editor must never ship
  unreleased dev work. After a live publish the workflow merges prod back into main and dev.
- **Placeholder block**: real deploys refuse `"status": "placeholder"`; previews (`preview=true`) allow it with a
  banner and `noindex`. `promote.sh prod` only warns.
- **Content = JSON + Zod models** (`src/content/schema.ts`): one model drives types, CI validation, editor forms and
  editor validation. Website code imports Zod types only (bundle size).
- **Design tokens**: brand orange `#ffa600` (logo, hero title, „Willkommen!“), red-orange `#d93a00` (nav, hero
  right). Known contrast trade-off: `#ffa600` on `#d93a00` is 2.35:1 (below AA 3:1 for large text) – chosen by
  Luc; the fix would be a deeper red (`#b83000` → 3.1:1).
- **Hero**: left panel background morphs `#d93a00 ↔ #ffa600` (7 s, alternate); stops on hover/focus and for
  reduced motion; quick links hidden until hover on desktop, always visible on touch/small screens.
- **Spacing**: `--section-space` (15 rem between home sections on desktop), `--page-top-space` (compact
  sub-page tops), `--block-space`.
- **Text size**: visitors scale the root (`html[data-text-size]`, 112.5 % / 125 %); the editor's per-component
  `textSize` sets `data-size` and re-derives `--fs-*` from `--fs-*-0`. All font sizes must use `--fs-*` tokens.
- **Header breakpoint is a container query** (66 rem) so it follows the text size; media queries use the
  browser's default font size and would not.
- **Timetable shows no teachers** (removed from model, data and editor on request).
- **Installer** is downloaded from the `prod` branch (`raw.githubusercontent.com/…/prod/installer/…`), so installer
  changes only reach users after a release. No admin rights, HTTPS + `gh auth login --web` instead of SSH keys.
- **No cookies** today; settings live in localStorage (strictly necessary). Anything optional → #27.
- **License**: proprietary, all rights reserved (#18).
