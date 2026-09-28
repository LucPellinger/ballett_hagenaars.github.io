# Inhalte-Editor der Ballettschule Hagenaars – Einrichtung für Windows 10/11.
#
# PowerShell öffnen (Start-Taste → „PowerShell“ tippen → Enter), diese Zeile einfügen, Enter:
#   irm https://raw.githubusercontent.com/LucPellinger/ballett_hagenaars.github.io/prod/installer/install-windows.ps1 | iex
#
# Was passiert (ohne Administratorrechte, nichts wird systemweit verändert):
#   1. Git, Node.js und GitHub-Programm  → %LOCALAPPDATA%\Ballettschule
#   2. Anmeldung bei GitHub im Browser (kein SSH-Schlüssel nötig)
#   3. Website-Projekt                   → %USERPROFILE%\Ballettschule-Website
#   4. Verknüpfung „Website bearbeiten“ mit Logo auf dem Desktop und im Startmenü
# Erneut ausführen = reparieren / aktualisieren.

# Native programs report errors via exit codes (checked below); 'Stop' would turn their stderr
# output into exceptions in Windows PowerShell 5.1.
$ErrorActionPreference = 'Continue'
$ProgressPreference = 'SilentlyContinue'   # makes Invoke-WebRequest much faster
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$Repo      = 'LucPellinger/ballett_hagenaars.github.io'
$NodeMajor = 22
$Tools     = if ($env:BH_HOME) { $env:BH_HOME } else { Join-Path $env:LOCALAPPDATA 'Ballettschule' }
$Project   = if ($env:BH_PROJECT) { $env:BH_PROJECT } else { Join-Path $env:USERPROFILE 'Ballettschule-Website' }
$AppName   = 'Website bearbeiten'
$Arch      = if ($env:PROCESSOR_ARCHITECTURE -eq 'ARM64') { 'arm64' } else { 'x64' }

function Step($t) { Write-Host "`n> $t" -ForegroundColor White }
function Ok($t)   { Write-Host "  √ $t" -ForegroundColor Green }
function Info($t) { Write-Host "  $t" -ForegroundColor DarkGray }
function Fail($t) {
  Write-Host "`n  X $t" -ForegroundColor Red
  Write-Host '  Bitte dieses Fenster fotografieren und Luc schicken.' -ForegroundColor DarkGray
  Read-Host '  Enter drücken zum Schließen'
  throw $t
}
function Download($url, $out) {
  try { Invoke-WebRequest -UseBasicParsing -Uri $url -OutFile $out } catch { Fail "Download fehlgeschlagen: $url – Internetverbindung prüfen." }
}
function LatestAsset($repo, $pattern) {
  try { $rel = Invoke-RestMethod -UseBasicParsing -ErrorAction Stop "https://api.github.com/repos/$repo/releases/latest" } catch { Fail 'GitHub nicht erreichbar – Internetverbindung prüfen.' }
  $a = $rel.assets | Where-Object { $_.name -match $pattern } | Select-Object -First 1
  if (-not $a) { Fail "Keine passende Datei in $repo gefunden." }
  return $a
}
function Unzip($zip, $dest) {
  if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
  try { Expand-Archive -Path $zip -DestinationPath $dest -Force -ErrorAction Stop } catch { Fail "Entpacken fehlgeschlagen: $zip" }
}

Write-Host "`n  Inhalte-Editor · Ballettschule Hagenaars – Einrichtung" -ForegroundColor White
Info 'Dauert etwa 5 Minuten. Das Fenster bitte offen lassen.'
New-Item -ItemType Directory -Force -Path "$Tools\bin" | Out-Null
$tmp = Join-Path ([IO.Path]::GetTempPath()) ("bh-" + [guid]::NewGuid())
New-Item -ItemType Directory -Force -Path $tmp | Out-Null
$env:Path = "$Tools\bin;$Tools\node;$Tools\git\cmd;$env:Path"
$env:COREPACK_ENABLE_DOWNLOAD_PROMPT = '0'

# ---------------------------------------------------------------- 1. Tools
Step '1/4 Git, Node.js und GitHub-Programm'
if (Get-Command git -ErrorAction SilentlyContinue) {
  Ok ((git --version) -join ' ')
} else {
  $a = LatestAsset 'git-for-windows/git' '^MinGit-[\d.]+(\.windows\.\d+)?-64-bit\.zip$'
  Info "Lade $($a.name) …"
  Download $a.browser_download_url "$tmp\git.zip"
  Unzip "$tmp\git.zip" "$Tools\git"
  Ok ((git --version) -join ' ')
}

$nodeOk = $false
if (Test-Path "$Tools\node\node.exe") { $nodeOk = ((& "$Tools\node\node.exe" -p "process.versions.node.split('.')[0]") -eq "$NodeMajor") }
if ($nodeOk) {
  Ok "Node.js $(& "$Tools\node\node.exe" -v) ist schon da"
} else {
  $base = "https://nodejs.org/dist/latest-v$NodeMajor.x"
  try { $sums = Invoke-RestMethod -UseBasicParsing -ErrorAction Stop "$base/SHASUMS256.txt" } catch { Fail 'Node.js-Liste nicht erreichbar – Internetverbindung prüfen.' }
  $line = $sums -split "`n" | Where-Object { $_ -match "node-v.*-win-$Arch\.zip$" } | Select-Object -First 1
  if (-not $line) { Fail 'Keine passende Node.js-Version gefunden.' }
  $hash, $file = $line.Trim() -split '\s+'
  Info "Lade $file …"
  Download "$base/$file" "$tmp\$file"
  if ((Get-FileHash "$tmp\$file" -Algorithm SHA256).Hash.ToLower() -ne $hash) { Fail 'Node.js-Download ist beschädigt.' }
  Unzip "$tmp\$file" "$tmp\node"
  if (Test-Path "$Tools\node") { Remove-Item "$Tools\node" -Recurse -Force }
  Move-Item (Get-ChildItem "$tmp\node" | Select-Object -First 1).FullName "$Tools\node"
  Ok "Node.js $(& "$Tools\node\node.exe" -v)"
}

if (Test-Path "$Tools\bin\gh.exe") {
  Ok 'GitHub-Programm ist schon da'
} else {
  $ghArch = if ($Arch -eq 'arm64') { 'arm64' } else { 'amd64' }
  $a = LatestAsset 'cli/cli' "^gh_[\d.]+_windows_$ghArch\.zip$"
  Info "Lade $($a.name) …"
  Download $a.browser_download_url "$tmp\gh.zip"
  Unzip "$tmp\gh.zip" "$tmp\gh"
  $exe = Get-ChildItem "$tmp\gh" -Recurse -Filter gh.exe | Select-Object -First 1
  if (-not $exe) { Fail 'GitHub-Programm nicht im Download gefunden.' }
  Copy-Item $exe.FullName "$Tools\bin\gh.exe" -Force
  Ok ((gh --version | Select-Object -First 1))
}

# .cmd explicitly: .ps1 shims may be blocked by the execution policy
corepack.cmd enable --install-directory "$Tools\bin" yarn
if ($LASTEXITCODE -ne 0) { Fail 'Yarn konnte nicht eingerichtet werden.' }
Ok 'Yarn bereit'

# ---------------------------------------------------------------- 2. GitHub login
Step '2/4 Anmeldung bei GitHub'
gh auth status --hostname github.com *> $null
if ($LASTEXITCODE -ne 0) {
  Info 'Gleich erscheint ein Code (z. B. ABCD-1234). Enter drücken → der Browser öffnet sich.'
  Info 'Dort bei GitHub anmelden, den Code eingeben und „Authorize“ klicken.'
  Info 'Falls gefragt wird „Authenticate Git with your GitHub credentials?“: Enter drücken.'
  gh auth login --hostname github.com --git-protocol https --web
  if ($LASTEXITCODE -ne 0) { Fail 'Anmeldung bei GitHub hat nicht geklappt.' }
}
gh auth setup-git --hostname github.com | Out-Null
$Login = gh api user --jq .login
Ok "Angemeldet als $Login"
$canPush = (gh api "repos/$Repo" --jq .permissions.push 2>$null) -eq 'true'
if ($canPush) { Ok 'Darf veröffentlichen' } else {
  Info "Hinweis: „$Login“ darf noch nicht veröffentlichen. Bitte Luc schreiben: GitHub-Name „$Login“."
  Info 'Bearbeiten und Vorschau funktionieren trotzdem schon.'
}

# ---------------------------------------------------------------- 3. Project
Step '3/4 Website-Projekt'
if (Test-Path "$Project\.git") {
  Ok "Schon vorhanden: $Project"
} else {
  $url = if ($env:BH_REPO_URL) { $env:BH_REPO_URL } else { "https://github.com/$Repo.git" }
  git -c core.autocrlf=false clone --quiet $url $Project
  if ($LASTEXITCODE -ne 0) { Fail 'Herunterladen des Projekts fehlgeschlagen.' }
  Ok "Heruntergeladen nach $Project"
}
Set-Location $Project
git config core.autocrlf false
if (-not (git config user.name)) { git config user.name (gh api user --jq '.name // .login') }
if (-not (git config user.email)) { $id = gh api user --jq .id; git config user.email "$id+$Login@users.noreply.github.com" }
Info 'Installiere Bausteine (1–2 Minuten) …'
yarn.cmd install *> "$Tools\install.log"
if ($LASTEXITCODE -ne 0) { Get-Content "$Tools\install.log" -Tail 20; Fail 'Installation der Bausteine fehlgeschlagen.' }
Ok 'Bausteine installiert'

# ---------------------------------------------------------------- 4. Shortcuts
Step "4/4 Verknüpfung „$AppName“"
$launch = Join-Path $Project 'installer\start-editor.cmd'
$shell = New-Object -ComObject WScript.Shell
$places = @(
  [Environment]::GetFolderPath('Desktop'),
  [Environment]::GetFolderPath('Programs')
)
foreach ($dir in $places) {
  $lnk = $shell.CreateShortcut((Join-Path $dir "$AppName.lnk"))
  $lnk.TargetPath = $launch
  $lnk.WorkingDirectory = $Project
  $lnk.IconLocation = (Join-Path $Project 'installer\assets\editor.ico')
  $lnk.Description = 'Inhalte der Website der Ballettschule Hagenaars bearbeiten'
  $lnk.Save()
}
Ok 'Auf dem Desktop und im Startmenü'
Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "`n  √ Fertig!" -ForegroundColor Green
Info "Ab jetzt: auf dem Desktop auf das orange Logo „$AppName“ doppelklicken."
Info 'Tipp: Rechtsklick auf die Verknüpfung → „An Taskleiste anheften“.'
if (-not $canPush) { Info "Zum Veröffentlichen fehlt noch der Zugang – bitte Luc Bescheid geben (GitHub-Name: $Login)." }
if (-not $env:BH_NO_START) {
  Write-Host "`n  Der Editor startet jetzt …"
  & $launch
}
