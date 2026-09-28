---
id: 23
title: "Text size for visitors, smaller page intros, per-component text size in the editor"
type: feat
status: done
priority: medium
created: 2026-09-28
---

## Goal

Visitors can enlarge the text; the instruction line under each page title is less dominant; the editor
can adjust the text size of a single component when absolutely necessary.

## Acceptance criteria

- [x] Text-size switch (A A A: 100 / 112.5 / 125 %) in the nav bar, in the menu on small screens; remembered, applied pre-paint
- [x] Page intro line (`header.lead`, e.g. „Klicke, um mehr zu sehen.“) one step smaller (`--fs-md`)
- [x] Optional `textSize` (xs/sm/lg/xl) on page headers, hero, highlights, philosophy, home sections, story blocks,
      FAQ items, courses, price plans, team, events, legal sections
- [x] Editor: collapsed „Erweiterte Texteinstellungen“ with warning, „Standard (empfohlen)“ and „angepasst“ badge
- [x] Docs: CMS_GUIDE (German), CONTENT_GUIDE, CLAUDE.md

## Notes

Branch: `feat/23-text-size-controls` · Commits: `feat(#23): …`
