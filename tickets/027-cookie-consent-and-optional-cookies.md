---
id: 27
title: "Cookies: consent banner and privacy-friendly optional features"
type: feat
status: backlog
priority: low
created: 2026-09-28
---

## Goal

Allow optional features that set cookies (e.g. statistics, embedded map or videos) without losing
GDPR/TDDDG compliance. Today the site sets **no cookies**; only the visitor's own settings (theme,
language, text size) are kept in localStorage, which counts as strictly necessary (no banner needed).

## Decide first

- [ ] What should cookies be used for? (statistics · Google Maps/YouTube/Instagram embeds · other)
- [ ] Prefer options that need no banner: cookieless statistics (e.g. Plausible, GoatCounter) and
      „click to load“ embeds

## Acceptance criteria (if a banner is needed)

- [ ] Consent banner (DE/EN): „Akzeptieren“ and „Ablehnen“ equally prominent, no pre-ticked boxes,
      nothing optional loads before consent
- [ ] Choice stored locally; „Cookie-Einstellungen“ link in the footer to change or withdraw it
- [ ] Embeds as two-click placeholders (load only after a click or consent)
- [ ] Datenschutzerklärung updated (list of cookies, purpose, provider, duration) – together with #8 (legal review)
- [ ] Accessible: keyboard operable, focus handling, WCAG AA contrast, no layout shift on the first visit
- [ ] Tests: nothing optional loads without consent; the choice is respected across visits

## Notes

Branch: `feat/27-cookie-consent` · Commits: `feat(#27): …`
Legal basis: GDPR + TDDDG (formerly TTDSG) § 25 – have the final texts checked (not legal advice).
