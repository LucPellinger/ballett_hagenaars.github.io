#!/bin/bash
# Doppelklick (macOS) startet den Inhalte-Editor der Website.
# Das Terminal-Fenster offen lassen, solange der Editor benutzt wird.
exec bash "$(dirname "$0")/installer/start-editor.sh"
