---
id: 26
title: "Header overlaps at large text sizes – switch to the mobile menu instead"
type: fix
status: review
priority: high
created: 2026-09-28
---

## Goal

With „large“/„extra large“ text (or long English labels) the desktop menu never overlaps the buttons;
when it doesn't fit, the header switches to the mobile menu.

## Acceptance criteria

- [x] Header breakpoint is a container query (`container: header`, 66rem) – rem there follows the chosen
      text size, so the switch moves: 1056 px normal · 1188 px large · 1320 px extra large
- [x] Measured: desktop menu needs ≤ 64rem in DE/EN at every text size; sweep 360–1920 px shows no overlap
- [x] Found on the way: event-card titles and the hero name overflowed narrow screens at large text
      (hyphenation + `minmax(0, 1fr)`); `html { overflow-x: clip }` as a safety net against sideways wobble

## Notes

Branch: `fix/26-header-fits-large-text` · Commits: `fix(#26): …`
Reported at 1032 × 744 with „extra large“ text.
