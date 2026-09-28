---
id: 2
title: "Create GitHub repo, enable Pages and branch protection"
type: chore
status: in-progress
priority: high
created: 2026-09-24
---

## Goal

Publish the repository on GitHub and configure it so the pipeline works.

## Acceptance criteria

- [x] Repo created and main/dev/prod pushed
- [x] Settings → Pages → Source: GitHub Actions
- [x] Default branch: dev
- [ ] Branch protection on main + prod: PR required, CI must pass
- [ ] First successful deploy from prod (blocked until sample content is replaced – deploy of 2026-09-28 stopped at the placeholder check, as intended)

## Notes

Branch: `chore/2-create-github-repo-enable-pages-and-bran` · Commits: `chore(#2): …`
