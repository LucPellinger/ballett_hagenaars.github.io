---
id: 21
title: "Fix promote.sh on macOS bash 3.2"
type: fix
status: done
priority: medium
created: 2026-09-28
---

## Goal

`./scripts/promote.sh main|prod` runs with the bash 3.2 that ships with macOS.
It aborted with `source?: unbound variable` because bash 3.2 read the `…` after `$source` as part of the variable name.

## Acceptance criteria

- [x] Variable followed by a non-ASCII character braced (`${source}…`)
- [x] No other `$var` directly followed by non-ASCII in `scripts/*.sh`

## Notes

Branch: `fix/21-fix-promote-sh-on-macos-bash-3-2` · Commits: `fix(#21): …`
