---
id: 19
title: "Visual content editor (CMS) with one-click publishing"
type: feat
status: review
priority: high
created: 2026-09-24
---

## Goal

Let non-developers (Luc's dad) manage all website content in a local, intuitive editor and publish
with one click – with checks that keep broken content off the live site.

## Acceptance criteria

- [x] Content moved to `src/content/data/*.json`, one Zod model per content type (`schema.ts`)
- [x] Models drive types, CI validation, editor forms and editor validation
- [x] `yarn cms` (or double-click `Inhalte bearbeiten.command`) starts the editor on the `content-management` branch, synced with `prod`
- [x] Forms for all collections; German/English fields; list editor with add/duplicate/delete/reorder
- [x] Drag & drop: text and .txt files into fields, images into image fields, multiple photos into the gallery
- [x] Images resized to WebP in the browser before upload
- [x] Live validation with German messages; references (course/teacher) checked on save
- [x] "Veröffentlichen": sync → validate → typecheck/test/build → commit → push → follow GitHub run
- [x] `content-publish.yml`: preview or live; live merges into prod, deploys, syncs back to main/dev; failures never touch the site
- [ ] GitHub setup: allow `content-management` in the `github-pages` environment
- [ ] First real publish from the editor

## Notes

Branch: `feat/19-visual-content-editor` · Commits: `feat(#19): …`
Docs: docs/CMS_GUIDE.md (users, German), docs/CONTENT_GUIDE.md (developers)
