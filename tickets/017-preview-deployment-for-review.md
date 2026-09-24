---
id: 17
title: "Preview deployment for review"
type: ci
status: review
priority: high
created: 2026-09-24
---

## Goal

Show the current state (incl. sample content) to family/reviewers on a real URL without weakening the production placeholder guard.

## Acceptance criteria

- [x] `gh workflow run deploy.yml --ref dev -f preview=true` deploys any branch as preview
- [x] Preview shows a banner and "Beispielinhalt" badges, and is `noindex`
- [x] Pushes to `prod` still refuse to publish placeholder content
- [x] Non-preview deploys only allowed from `prod`

## Notes

Branch: `ci/17-preview-deployment-for-review` · Commits: `ci(#17): …`
