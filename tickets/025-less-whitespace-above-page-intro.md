---
id: 25
title: "Less whitespace above the page intro"
type: fix
status: review
priority: medium
created: 2026-09-28
---

## Goal

Sub-pages start closer to the menu bar: the large section spacing (15rem between home-page sections) no longer applies above the page intro.

## Acceptance criteria

- [x] `SectionRail pageTop` → `--page-top-space` (2.5–4rem) on sub-pages; home-page spacing unchanged
- [x] Intro → content gap 4.5rem → 2rem

## Notes

Branch: `fix/25-less-whitespace-above-the-page-intro` · Commits: `fix(#25): …`
