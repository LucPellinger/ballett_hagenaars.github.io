#!/usr/bin/env bash
# Inhalte-Editor der Ballettschule Hagenaars – Einrichtung für macOS (läuft auch unter Linux).
#
# Einmal im Terminal einfügen und Enter drücken:
#   bash -c "$(curl -fsSL https://raw.githubusercontent.com/LucPellinger/ballett_hagenaars.github.io/prod/installer/install-mac.sh)"
#
# Was passiert (ohne Administrator-Passwort, nichts wird systemweit verändert):
#   1. Git (Apple-Entwicklerwerkzeuge) – falls nötig, fragt macOS einmal nach
#   2. Node.js + GitHub-Programm  → ~/.ballettschule
#   3. Anmeldung bei GitHub im Browser (kein SSH-Schlüssel nötig)
#   4. Website-Projekt           → ~/Ballettschule-Website
#   5. App „Website bearbeiten“ mit Logo in „Programme“ + im Dock
# Erneut ausführen = reparieren / aktualisieren. Entfernen: die beiden Ordner und die App löschen.
# Test-Schalter (nur für Luc): BH_HOME, BH_PROJECT, BH_REPO_URL, BH_NODE_DIST, BH_GH_API, BH_SKIP_LOGIN, BH_NO_START.
set -euo pipefail

REPO="LucPellinger/ballett_hagenaars.github.io"
NODE_MAJOR=22
TOOLS="${BH_HOME:-$HOME/.ballettschule}"
PROJECT="${BH_PROJECT:-$HOME/Ballettschule-Website}"
APP_NAME="Website bearbeiten"
OS="$(uname -s)"

bold=$'\e[1m'; green=$'\e[32m'; red=$'\e[31m'; dim=$'\e[2m'; off=$'\e[0m'
step() { printf '\n%s▸ %s%s\n' "$bold" "$1" "$off"; }
ok() { printf '  %s✓%s %s\n' "$green" "$off" "$1"; }
info() { printf '  %s%s%s\n' "$dim" "$1" "$off"; }
fail() {
  printf '\n  %s✗ %s%s\n' "$red" "$1" "$off"
  printf '  %sBitte dieses Fenster fotografieren und Luc schicken.%s\n\n' "$dim" "$off"
  exit 1
}
trap 'fail "Unerwarteter Fehler (Zeile $LINENO)."' ERR

download() { curl -fL --retry 3 --progress-bar -o "$2" "$1" || fail "Download fehlgeschlagen: $1 – Internetverbindung prüfen."; }
sha256() { if command -v shasum >/dev/null; then shasum -a 256 "$1" | cut -d' ' -f1; else sha256sum "$1" | cut -d' ' -f1; fi; }

case "$(uname -m)" in
  arm64 | aarch64) ARCH_NODE=arm64; ARCH_GH=arm64 ;;
  x86_64) ARCH_NODE=x64; ARCH_GH=amd64 ;;
  *) fail "Unbekannter Prozessor: $(uname -m)" ;;
esac
case "$OS" in
  Darwin) PLAT_NODE=darwin; PLAT_GH=macOS ;;
  Linux) PLAT_NODE=linux; PLAT_GH=linux ;;
  *) fail "Dieses Programm ist für Mac. Für Windows gibt es install-windows.ps1." ;;
esac

printf '\n%s  ✏️  Inhalte-Editor · Ballettschule Hagenaars – Einrichtung%s\n' "$bold" "$off"
info "Dauert etwa 5 Minuten. Das Fenster bitte offen lassen."
mkdir -p "$TOOLS/bin"
export PATH="$TOOLS/bin:$TOOLS/node/bin:$PATH"

# ---------------------------------------------------------------- 1. Git
step "1/5 Git"
if [ "$OS" = Darwin ] && ! xcode-select -p >/dev/null 2>&1; then
  info "macOS fragt gleich, ob die „Befehlszeilen-Entwicklerwerkzeuge“ installiert werden sollen."
  info "Bitte auf „Installieren“ klicken und warten, bis es fertig ist."
  xcode-select --install >/dev/null 2>&1 || true
  for _ in $(seq 1 180); do
    xcode-select -p >/dev/null 2>&1 && break
    sleep 10
  done
  xcode-select -p >/dev/null 2>&1 || fail "Die Entwicklerwerkzeuge wurden nicht installiert. Bitte das Programm noch einmal starten."
fi
command -v git >/dev/null || fail "Git fehlt."
ok "$(git --version)"

# ---------------------------------------------------------------- 2. Node.js + GitHub CLI
step "2/5 Node.js und GitHub-Programm"
if [ -x "$TOOLS/node/bin/node" ] && [ "$("$TOOLS/node/bin/node" -p 'process.versions.node.split(".")[0]')" = "$NODE_MAJOR" ]; then
  ok "Node.js $("$TOOLS/node/bin/node" -v) ist schon da"
else
  base="${BH_NODE_DIST:-https://nodejs.org/dist}/latest-v${NODE_MAJOR}.x"
  sums="$(curl -fsSL "$base/SHASUMS256.txt")" || fail "Node.js-Liste nicht erreichbar – Internetverbindung prüfen."
  line="$(printf '%s\n' "$sums" | grep " node-v.*-${PLAT_NODE}-${ARCH_NODE}\.tar\.gz$" | head -1)"
  [ -n "$line" ] || fail "Keine passende Node.js-Version gefunden."
  file="${line##* }"
  info "Lade $file …"
  tmp="$(mktemp -d)"
  download "$base/$file" "$tmp/$file"
  [ "$(sha256 "$tmp/$file")" = "${line%% *}" ] || fail "Node.js-Download ist beschädigt."
  rm -rf "$TOOLS/node" && mkdir -p "$TOOLS/node"
  tar -xzf "$tmp/$file" -C "$TOOLS/node" --strip-components 1
  rm -rf "$tmp"
  ok "Node.js $("$TOOLS/node/bin/node" -v)"
fi

if [ -x "$TOOLS/bin/gh" ]; then
  ok "GitHub-Programm ist schon da"
else
  rel="$(curl -fsSL "${BH_GH_API:-https://api.github.com/repos/cli/cli/releases/latest}")" || fail "GitHub nicht erreichbar."
  ext=tar.gz; [ "$OS" = Darwin ] && ext=zip
  url="$(printf '%s\n' "$rel" | grep -o "https://[^\"]*_${PLAT_GH}_${ARCH_GH}\.${ext}" | head -1)"
  [ -n "$url" ] || fail "Kein passendes GitHub-Programm gefunden."
  info "Lade ${url##*/} …"
  tmp="$(mktemp -d)"
  download "$url" "$tmp/gh.$ext"
  if [ "$ext" = zip ]; then unzip -q "$tmp/gh.zip" -d "$tmp"; else tar -xzf "$tmp/gh.tar.gz" -C "$tmp"; fi
  exe="$(find "$tmp" -type f -path '*/bin/gh' | head -1)"
  [ -n "$exe" ] || fail "GitHub-Programm nicht im Download gefunden."
  cp "$exe" "$TOOLS/bin/gh"
  chmod +x "$TOOLS/bin/gh"
  rm -rf "$tmp"
  ok "$("$TOOLS/bin/gh" --version | head -1)"
fi

export COREPACK_ENABLE_DOWNLOAD_PROMPT=0
corepack enable --install-directory "$TOOLS/bin" yarn
ok "Yarn bereit"

# ---------------------------------------------------------------- 3. GitHub login
step "3/5 Anmeldung bei GitHub"
if [ -n "${BH_SKIP_LOGIN:-}" ]; then
  info "(Test: Anmeldung übersprungen)"
elif gh auth status --hostname github.com >/dev/null 2>&1; then
  ok "Angemeldet als $(gh api user --jq .login)"
else
  info "Gleich erscheint ein Code (z. B. ABCD-1234). Enter drücken → der Browser öffnet sich."
  info "Dort bei GitHub anmelden, den Code eingeben und „Authorize“ klicken."
  info "Falls gefragt wird „Authenticate Git with your GitHub credentials?“: Enter drücken."
  gh auth login --hostname github.com --git-protocol https --web || fail "Anmeldung bei GitHub hat nicht geklappt."
  ok "Angemeldet als $(gh api user --jq .login)"
fi
if [ -n "${BH_SKIP_LOGIN:-}" ]; then
  LOGIN=test; NO_ACCESS=0
else
gh auth setup-git --hostname github.com
LOGIN="$(gh api user --jq .login)"
if [ "$(gh api "repos/$REPO" --jq .permissions.push 2>/dev/null || echo false)" != true ]; then
  NO_ACCESS=1
  info "Hinweis: „$LOGIN“ darf noch nicht veröffentlichen. Bitte Luc schreiben: GitHub-Name „$LOGIN“."
  info "Bearbeiten und Vorschau funktionieren trotzdem schon."
else
  NO_ACCESS=0
  ok "Darf veröffentlichen"
fi
fi

# ---------------------------------------------------------------- 4. Project
step "4/5 Website-Projekt"
if [ -d "$PROJECT/.git" ]; then
  ok "Schon vorhanden: $PROJECT"
else
  git clone --quiet "${BH_REPO_URL:-https://github.com/$REPO.git}" "$PROJECT" || fail "Herunterladen des Projekts fehlgeschlagen."
  ok "Heruntergeladen nach $PROJECT"
fi
cd "$PROJECT"
if [ -z "${BH_SKIP_LOGIN:-}" ]; then
  git config user.name >/dev/null || git config user.name "$(gh api user --jq '.name // .login')"
  git config user.email >/dev/null || git config user.email "$(gh api user --jq .id)+$LOGIN@users.noreply.github.com"
fi
info "Installiere Bausteine (1–2 Minuten) …"
yarn install >"$TOOLS/install.log" 2>&1 || { tail -20 "$TOOLS/install.log"; fail "Installation der Bausteine fehlgeschlagen."; }
ok "Bausteine installiert"

# ---------------------------------------------------------------- 5. App
step "5/5 App „$APP_NAME“"
LAUNCH="$PROJECT/installer/start-editor.sh"
chmod +x "$LAUNCH" 2>/dev/null || true
if [ "$OS" = Darwin ]; then
  APP="$HOME/Applications/$APP_NAME.app"
  mkdir -p "$HOME/Applications"
  rm -rf "$APP"
  osacompile -o "$APP" -e "tell application \"Terminal\"
  activate
  do script \"exec bash '$LAUNCH'\"
end tell" >/dev/null
  cp "$PROJECT/installer/assets/editor.icns" "$APP/Contents/Resources/applet.icns"
  touch "$APP"
  ok "App in „Programme“ (Benutzerordner)"
  if ! defaults read com.apple.dock persistent-apps 2>/dev/null | grep -q "Website%20bearbeiten"; then
    defaults write com.apple.dock persistent-apps -array-add "<dict><key>tile-data</key><dict><key>file-data</key><dict><key>_CFURLString</key><string>file://${APP// /%20}/</string><key>_CFURLStringType</key><integer>15</integer></dict></dict></dict>"
    killall Dock 2>/dev/null || true
  fi
  ok "Im Dock"
else
  ok "Start: $LAUNCH"
fi

trap - ERR
printf '\n%s  ✓ Fertig!%s\n' "$green$bold" "$off"
if [ "$OS" = Darwin ]; then
  info "Ab jetzt: im Dock auf das orange Logo „$APP_NAME“ klicken."
fi
[ "$NO_ACCESS" = 1 ] && info "Zum Veröffentlichen fehlt noch der Zugang – bitte Luc Bescheid geben (GitHub-Name: $LOGIN)."
if [ -z "${BH_NO_START:-}" ]; then
  printf '\n  Der Editor startet jetzt …\n'
  exec bash "$LAUNCH"
fi
