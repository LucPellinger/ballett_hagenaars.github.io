---
id: 22
title: "One-click editor installer for Mac and Windows"
type: feat
status: review
priority: medium
created: 2026-09-28
---

## Goal

A non-developer (Luc's dad) sets up the content editor on Mac or Windows with one pasted line,
without admin rights, Homebrew, nvm or SSH keys, and afterwards starts it from an app icon.

## Acceptance criteria

- [x] `installer/install-mac.sh`: git (Xcode CLT prompt), Node + gh into `~/.ballettschule`, `gh auth login --web`
      (HTTPS), clone to `~/Ballettschule-Website`, `yarn install`, app „Website bearbeiten“ with logo in ~/Applications + Dock
- [x] `installer/install-windows.ps1`: same with MinGit, Desktop + Start-menu shortcut with logo
- [x] Re-running repairs; checks push access and tells the user what to send Luc
- [x] Launchers `installer/start-editor.sh|cmd`; `Inhalte bearbeiten.command` uses them
- [x] `cms.mjs` starts Yarn through a shell on Windows (Node ≥ 20.12 refuses .cmd otherwise)
- [x] CMS_GUIDE: German setup section; setup notes for Luc (collaborator + ruleset)
- [ ] Tested on a real Mac and a real Windows PC

## Notes

Branch: `feat/22-one-click-editor-installer-for-mac-and-w` · Commits: `feat(#22): …`
