#!/usr/bin/env bash
# One-command local setup: checks Node/Yarn, installs dependencies, activates git hooks,
# then starts the dev server.   Usage: ./scripts/setup.sh [--no-dev]
set -euo pipefail
cd "$(dirname "$0")/.."

need_major=$(cat .nvmrc)
if ! command -v node >/dev/null 2>&1; then
  echo "✗ Node.js not found. Install it via nvm (see ONBOARDING.md, step 3)." >&2; exit 1
fi
have_major=$(node -p 'process.versions.node.split(".")[0]')
if [ "$have_major" -lt "$need_major" ]; then
  echo "✗ Node $need_major+ required, found $(node -v). Run: nvm install && nvm use" >&2; exit 1
fi
echo "✓ Node $(node -v)"

if ! command -v yarn >/dev/null 2>&1 || ! yarn --version | grep -q '^4\.'; then
  echo "→ Enabling Corepack (provides the pinned Yarn version)…"
  corepack enable
fi
echo "✓ Yarn $(yarn --version)"

echo "→ Installing dependencies…"
yarn install
git config core.hooksPath .githooks
echo "✓ Git hooks active (.githooks)"

yarn content:check || true

if [ "${1:-}" != "--no-dev" ]; then
  echo "→ Starting dev server on http://localhost:5173"
  yarn dev
fi
