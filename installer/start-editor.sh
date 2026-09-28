#!/usr/bin/env bash
# Startet den Inhalte-Editor mit den Werkzeugen aus ~/.ballettschule (siehe install-mac.sh).
# Wird von der App „Website bearbeiten“ und von „Inhalte bearbeiten.command“ aufgerufen.
TOOLS="${BH_HOME:-$HOME/.ballettschule}"
export PATH="$TOOLS/bin:$TOOLS/node/bin:$PATH"
export COREPACK_ENABLE_DOWNLOAD_PROMPT=0
cd "$(dirname "$0")/.." || exit 1

printf '\033]0;Website bearbeiten\007'
if ! command -v node >/dev/null || ! command -v yarn >/dev/null; then
  echo
  echo "  ✗ Die Werkzeuge fehlen. Bitte die Einrichtung noch einmal ausführen (siehe Anleitung)."
  echo
  read -r -p "  Enter drücken zum Schließen … " _
  exit 1
fi

node scripts/cms.mjs "$@"
code=$?
if [ "$code" -ne 0 ]; then
  echo
  read -r -p "  Enter drücken zum Schließen … " _
fi
exit "$code"
