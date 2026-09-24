#!/bin/zsh -il
# Doppelklick (macOS) startet den Inhalte-Editor der Website.
# Das Terminal-Fenster offen lassen, solange der Editor benutzt wird.
cd "$(dirname "$0")" || exit 1
yarn cms
