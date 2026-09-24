# Onboarding (macOS)

From zero to editing, testing and deploying the Ballettschule Hagenaars website.
Run every command in order and check the ✅ **Verify** line before moving on.

> ⚠️ Don't paste the `# comment` parts of commands into zsh
> (or run `setopt interactive_comments` first).

---

## Fast path (machine already set up)

```bash
git clone https://github.com/LucPellinger/ballett_hagenaars.github.io.git
cd ballett_hagenaars.github.io
./scripts/setup.sh
```

Site runs at <http://localhost:5173>. Everything below is for a fresh Mac.

---

## 1 — Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Run the two `echo … >> ~/.zprofile` lines the installer prints, then open a new terminal.

✅ **Verify:** `brew --version`

## 2 — Git (+ GitHub CLI)

```bash
brew install git gh
git config --global user.name  "Your Name"
git config --global user.email "you@example.com"
gh auth login            # choose GitHub.com → HTTPS → login with browser
```

✅ **Verify:** `git --version` and `gh auth status`

## 3 — Node.js via nvm

```bash
brew install nvm
mkdir -p ~/.nvm
cat >> ~/.zshrc <<'ZSH'
export NVM_DIR="$HOME/.nvm"
[ -s "$(brew --prefix nvm)/nvm.sh" ] && . "$(brew --prefix nvm)/nvm.sh"
ZSH
exec zsh
nvm install 22
```

✅ **Verify:** `node -v` prints `v22.x` (or newer) and `which node` points into `~/.nvm/…`
(not `/opt/anaconda3` – if it does: `conda config --set auto_activate_base false && exec zsh`).

## 4 — Yarn via Corepack (do **not** `brew install yarn`)

```bash
corepack enable
```

✅ **Verify:** inside the project folder, `yarn --version` prints `4.x`.

## 5 — Get the project & run it

```bash
cd ~/Documents/private
git clone https://github.com/LucPellinger/ballett_hagenaars.github.io.git   # skip if the folder exists
cd ballett_hagenaars.github.io
nvm use                 # reads .nvmrc
./scripts/setup.sh      # install + git hooks + dev server
```

✅ **Verify:** <http://localhost:5173> shows the red poster hero. Sample content shows a dashed
"Beispielinhalt" badge. Stop the server with `Ctrl+C`.

## 6 — Editor

Install [VS Code](https://code.visualstudio.com/) and open the folder (`code .`). Accept the
recommended extensions (ESLint, EditorConfig). Lint fixes run on save.

Optional: [Claude Code](https://docs.claude.com/en/docs/claude-code) – run `claude` in the project
folder; it reads [CLAUDE.md](CLAUDE.md) automatically.

---

## Daily work

```bash
git switch dev && git pull
yarn board                                   # what's next? → BOARD.md
yarn ticket:move 3 in-progress
git switch -c content/3-replace-sample-timetable-with-the-real-st
yarn dev                                     # edit, watch changes live
yarn check                                   # before committing
git add -A && git commit -m "content(#3): enter timetable 2026/27"
git push -u origin HEAD
gh pr create --base dev --fill               # open the pull request
```

After CI is green: merge the PR on GitHub, `yarn ticket:move 3 done`.

Rules for names & messages: [CONTRIBUTING.md](CONTRIBUTING.md). Editing content:
[docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md).

## Releasing (going live)

```bash
./scripts/promote.sh main      # dev → main, runs all checks
yarn preview                   # optional final look at the production build
./scripts/promote.sh prod      # main → prod → GitHub Actions deploys
```

Watch progress: `gh run watch` or the repository's **Actions** tab.
The deploy **stops if placeholder content remains** (`yarn content:check` shows what's left).

## First-time GitHub setup (once)

Only needed if the repository doesn't exist on GitHub yet (ticket #2):

```bash
cd ~/Documents/private/ballett_hagenaars.github.io
gh repo create ballett_hagenaars.github.io --public --source . --remote origin
git push -u origin main dev prod
gh repo edit --default-branch dev
```

> Using your SSH host alias instead (like the portfolio repo)?
> `git remote set-url origin git@github-private:LucPellinger/ballett_hagenaars.github.io.git`

Then on github.com → repository → **Settings**:

1. **Pages** → *Build and deployment* → Source: **GitHub Actions**
2. **Branches** → add rules for `main` and `prod`: *Require a pull request*, *Require status checks: CI*
3. **Pages** → *Custom domain* (later, ticket #11): `www.hagenaars-ballett.de`

Without a custom domain the site is served at
`https://lucpellinger.github.io/ballett_hagenaars.github.io/` – the build adapts the base path automatically.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `zsh: command not found: nvm` | Step 3 lines missing in `~/.zshrc`, or run `exec zsh` |
| `yarn --version` prints `1.x` | `corepack enable`, then open a new terminal inside the project |
| `YN0028: The lockfile would have been modified` in CI | Run `yarn install` locally and commit `yarn.lock` |
| Commit rejected: *Invalid commit message* | Use `type(#id): summary`, see CONTRIBUTING |
| Push rejected: *Branch name … does not follow the convention* | `git branch -m feat/12-short-name` |
| Page is blank after deploy on `github.io/<repo>/` | Pages source must be **GitHub Actions** (not "Deploy from branch") |
| Old version still visible after deploy | PWA cache – reload twice or close the tab; updates apply automatically |
| Port 5173 busy | `yarn dev --port 5174` |
