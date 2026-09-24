#!/usr/bin/env bash
# Promote code along the release chain:  dev → main → prod
#
#   ./scripts/promote.sh main   # merge dev into main   (release candidate)
#   ./scripts/promote.sh prod   # merge main into prod  (goes LIVE via GitHub Actions)
#
# Runs all checks locally first, uses fast-forward merges only (no surprise merge commits),
# and refuses to run with uncommitted changes.
set -euo pipefail
cd "$(dirname "$0")/.."

target=${1:-}
case "$target" in
  main) source=dev ;;
  prod) source=main ;;
  *) echo "Usage: $0 main|prod" >&2; exit 1 ;;
esac

if [ -n "$(git status --porcelain)" ]; then
  echo "✗ Working tree not clean – commit or stash first." >&2; exit 1
fi

git fetch origin
git switch "$source" && git pull --ff-only origin "$source"

echo "→ Running checks on $source…"
yarn install --immutable
yarn check
if [ "$target" = "prod" ]; then
  yarn content:check:strict
fi
yarn build

git switch "$target" && git pull --ff-only origin "$target"
if ! git merge --ff-only "$source"; then
  echo "✗ $target has commits that $source doesn't (e.g. a hotfix)." >&2
  echo "  Merge $target back into $source first:  git switch $source && git merge $target" >&2
  exit 1
fi
git push origin "$target"
git switch "$source"
echo "✓ Promoted $source → $target"
[ "$target" = "prod" ] && echo "  Deployment runs in GitHub Actions → Actions tab."
exit 0
