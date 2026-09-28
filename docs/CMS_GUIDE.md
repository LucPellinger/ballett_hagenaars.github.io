# Inhalte-Editor – Anleitung

Mit dem Inhalte-Editor ändern Sie Texte, Kurse, Stundenplan, Preise, Team, Events und Fotos der
Website – ganz ohne Programmierkenntnisse. Alles läuft im Browser.

---

## 1. Einmalige Einrichtung (ca. 5 Minuten)

Vorher: ein **GitHub-Konto** anlegen (<https://github.com/signup>) und Luc den Benutzernamen schicken –
er schaltet das Veröffentlichen frei.

### Mac

1. **Terminal** öffnen: `⌘ + Leertaste` drücken, „Terminal“ tippen, Enter.
2. Diese Zeile kopieren, im Terminal einfügen (`⌘ + V`) und Enter drücken:

   ```bash
   bash -c "$(curl -fsSL https://raw.githubusercontent.com/LucPellinger/ballett_hagenaars.github.io/prod/installer/install-mac.sh)"
   ```

3. Den Anweisungen im Fenster folgen:
   - Fragt macOS nach den **„Befehlszeilen-Entwicklerwerkzeugen“** → **Installieren** klicken und warten.
   - Bei **GitHub-Anmeldung**: Enter drücken, im Browser anmelden, den angezeigten Code eingeben,
     **Authorize** klicken.
4. Fertig: Im **Dock** erscheint das orange Logo **„Website bearbeiten“**.

### Windows

1. **PowerShell** öffnen: Start-Taste drücken, „PowerShell“ tippen, Enter.
2. Diese Zeile kopieren, in PowerShell einfügen (Rechtsklick) und Enter drücken:

   ```powershell
   irm https://raw.githubusercontent.com/LucPellinger/ballett_hagenaars.github.io/prod/installer/install-windows.ps1 | iex
   ```

3. Bei der **GitHub-Anmeldung**: Enter drücken, im Browser anmelden, Code eingeben, **Authorize** klicken.
4. Fertig: Auf dem **Desktop** und im Startmenü erscheint **„Website bearbeiten“**
   (Tipp: Rechtsklick → „An Taskleiste anheften“).

Es wird nichts am System verändert und kein Administrator-Passwort gebraucht. Klappt etwas nicht:
die Zeile einfach noch einmal ausführen – das repariert die Einrichtung. Sonst ein Foto vom Fenster an Luc.

---

## 2. Editor starten

**Auf „Website bearbeiten“ klicken** (Mac: im Dock · Windows: auf dem Desktop).

Es öffnet sich ein schwarzes Fenster und kurz danach der Editor im Browser
(sonst: <http://localhost:5173/cms/>). Das schwarze Fenster **offen lassen**, solange Sie arbeiten.
Zum Beenden: Fenster schließen.

Beim ersten Start fragt der Mac evtl., ob „Website bearbeiten“ das Terminal steuern darf → **OK**.

Beim Start holt der Editor automatisch die neueste Version von GitHub – Updates passieren von selbst.

---

## 3. Inhalte bearbeiten

| Bereich | Was Sie dort finden |
|---|---|
| **Links** | Die Bereiche der Website (Kurse, Stundenplan, Team …) |
| **Mitte (Liste)** | Alle Einträge – anklicken zum Bearbeiten, mit der Maus verschieben für die Reihenfolge |
| **Rechts (Formular)** | Die Felder des gewählten Eintrags |
| **Oben** | „Vorschau ansehen“ und „Veröffentlichen“ |

- **Deutsch** ist Pflicht, **Englisch** optional. Leer gelassen, zeigt die englische Seite den deutschen Text.
- Felder mit „Ein Eintrag pro Zeile“: jede Zeile wird ein Absatz bzw. Listenpunkt.
- **Neuer Eintrag:** Knopf „+ Kurs“, „+ Termin“, „+ Foto“ …
- **Löschen / Duplizieren:** Knöpfe oben rechts im Formular.
- **Rote Felder** zeigen Fehler mit Erklärung (z. B. „Das Ende muss nach dem Beginn liegen“).

### Texte und Bilder hineinziehen

- **Text** aus Word, E-Mail oder einer Webseite markieren und in ein Feld **ziehen** (oder kopieren/einfügen).
- Eine **.txt-Datei** in ein Textfeld ziehen fügt ihren Inhalt ein.
- **Bilder** (JPG, PNG, WebP) in ein Bildfeld ziehen – oder „Datei auswählen“.
  Bilder werden automatisch verkleinert, damit die Website schnell bleibt.
- **Galerie:** mehrere Fotos auf einmal in das Feld „Mehrere Fotos auf einmal hierher ziehen“.
- Danach bei jedem Bild eine kurze **Bildbeschreibung** eintragen (für blinde Menschen und Google).
- Nur Fotos verwenden, bei denen die abgebildeten Personen (bei Kindern: die Eltern) zugestimmt haben.

### Links, Farben und Bilder mit Pinselstrich

- **Links im Text:** `[Linktext](https://adresse.de)` – z. B. `[DBfT](https://www.dbft.de)`. Interne Seiten: `[Kontakt](/kontakt)`.
- **Hervorheben (orange):** `**Wort**`.
- **Farben** (Kurs-Kacheln, Pinselstriche, Einfärbung der Fotos) wählen Sie aus der Liste – immer Farben der Website.
- **Fotos auf Pinselstrich** (Über uns, Qualität, Spitzentanz, Aufführung, Philosophie): am schönsten freigestellte Fotos
  (PNG/WebP mit transparentem Hintergrund). Das Foto wird automatisch in der gewählten Farbe eingefärbt.
- **Team:** Portrait (Farbe, Hochformat) + optional ein Tanzfoto für die Vorstellung „Wer ist …?“.
- **Logo:** unter „Schuldaten“ → Logo. Erscheint oben links im Menü (neben „home“) und groß auf der Startseite.

### „Beispielinhalt“

Einträge, die noch nicht endgültig sind, haben oben den Haken **Beispielinhalt**. Die Zahl
im gestrichelten Kreis links zeigt, wie viele es pro Bereich noch gibt.
Wenn ein Eintrag stimmt: **Haken entfernen**. Solange es Beispielinhalte gibt, kann nur eine
**Vorschau** veröffentlicht werden – nicht die Live-Website.

---

## 4. Speichern

Unten erscheint eine Leiste **„Ungespeicherte Änderungen“** → **Speichern** (oder `⌘ + S`).

Gespeichert heißt: auf **diesem Computer** gespeichert. Mit **„Vorschau ansehen ↗“** sehen Sie
sofort, wie es auf der Website aussieht. Im Internet ist noch nichts geändert.

Farbige Punkte links:

- 🟠 **orange** – noch nicht gespeichert
- 🔵 **blau** – gespeichert, aber noch nicht veröffentlicht

„Rückgängig“ verwirft ungespeicherte Änderungen im aktuellen Bereich. Oben rechts bei
„… Änderungen noch nicht veröffentlicht“ können Sie mit **verwerfen** alle gespeicherten,
aber nicht veröffentlichten Änderungen zurücksetzen.

---

## 5. Veröffentlichen

1. Oben **„Veröffentlichen …“** klicken.
2. Kurz beschreiben, was geändert wurde (z. B. „Stundenplan Herbst 2026“).
3. Wählen:
   - **Vorschau** – eine Testversion mit Hinweis-Banner, zum Zeigen und Prüfen. Beispielinhalte erlaubt.
   - **Live-Website** – für alle Besucher. Nur möglich ohne Beispielinhalte.
4. Starten und **das Fenster offen lassen**. Der Editor zeigt jeden Schritt:

   | Schritt | Was passiert |
   |---|---|
   | Neueste Version holen | Änderungen von anderen werden übernommen |
   | Inhalte prüfen | Alle Pflichtfelder, Verweise (Kurs ↔ Stundenplan), Bilder |
   | Website testen und bauen | Die komplette Website wird probeweise erzeugt |
   | Änderungen speichern / hochladen | Ihre Änderungen gehen zu GitHub |
   | GitHub prüft und veröffentlicht | GitHub prüft alles noch einmal und veröffentlicht (2–3 Minuten) |

5. Bei **„Fertig!“** ist die Website aktualisiert (evtl. im Browser einmal neu laden).

**Wenn ein Schritt rot wird:** Die Website bleibt **unverändert**. Die Meldung erklärt den Grund
(„Details“ zeigt mehr). Fehler beheben und erneut veröffentlichen. Ihre Änderungen gehen nicht verloren.

Adresse der Website: <https://lucpellinger.eu/ballett_hagenaars.github.io/>
(später: www.hagenaars-ballett.de).

---

## Häufige Fragen

**Ich habe einen Kurs gelöscht und kann nicht speichern.**
Der Kurs wird noch im Stundenplan verwendet. Erst die Termine im Stundenplan löschen oder einem
anderen Kurs zuordnen.

**Der Kurs erscheint nicht in der Auswahl im Stundenplan.**
Neue Kurse zuerst anlegen und **speichern**, dann erscheinen sie in der Auswahl.

**„Hochladen fehlgeschlagen“.**
Internetverbindung prüfen. Wenn es bleibt: Luc fragen (Zugang zu GitHub).

**„Konflikt … bitte Luc fragen“.**
Jemand hat gleichzeitig dieselbe Stelle geändert. Nichts ist verloren – Luc hilft beim Zusammenführen.

**Der Editor zeigt „Entwicklermodus“.**
Der Editor wurde nicht über „Website bearbeiten“ gestartet. Schließen und neu starten.

---

## Für Luc: Einrichtung & Technik

- **Einrichtung beim Bearbeiter:** `installer/install-mac.sh` bzw. `installer/install-windows.ps1` (Abschnitt 1).
  Installiert ohne Adminrechte Node, GitHub CLI (und unter Windows MinGit) nach `~/.ballettschule`
  bzw. `%LOCALAPPDATA%\Ballettschule`, meldet per `gh auth login --web` an (HTTPS, kein SSH-Schlüssel),
  klont nach `~/Ballettschule-Website` und legt die App/Verknüpfung an (`installer/start-editor.*`).
  Die Einzeiler laden das Skript vom Branch `prod` – Änderungen am Installer wirken erst nach einem Release.
  Test ohne Anmeldung: `BH_SKIP_LOGIN=1 BH_HOME=/tmp/t BH_PROJECT=/tmp/t/site bash installer/install-mac.sh`.
- **Zugang für den Bearbeiter:** Repository → Settings → Collaborators → GitHub-Namen einladen (Rolle *Write*);
  er muss die Einladung per E-Mail annehmen. Damit er nur `content-management` beschreiben kann:
  Settings → Rules → Rulesets → neues Branch-Ruleset für `main`, `dev`, `prod` mit „Restrict updates“,
  Bypass: Repository-Admin + GitHub Actions.
- **GitHub (einmalig):** Settings → Environments → `github-pages` → Deployment branches: `content-management`
  hinzufügen. Falls `prod`/`main`/`dev` Branch-Protection haben: GitHub Actions das Pushen erlauben
  (Rulesets → Bypass: „GitHub Actions“ / Repository-Admin), sonst schlägt „Merge into prod“ fehl.
- **Branch `content-management`:** basiert auf `prod` (nur freigegebener Code). Der Editor merged beim
  Start und vor jedem Veröffentlichen `origin/prod` hinein → neue Releases kommen automatisch an.
- **Pipeline:** `.github/workflows/content-publish.yml`. Commit-Trailer `Publish: preview|live` steuert:
  - `preview`: Checks → Deploy als Vorschau (Banner, noindex).
  - `live`: Checks + Beispielinhalt-Sperre → Merge in `prod` → Deploy → `prod` zurück in `main` und `dev`.
- **Code:** Server `cms/server/` (Vite-Plugin, nur im Modus `cms`), UI `cms/src/`, Modelle
  `src/content/schema.ts`, Bereiche `src/content/collections.ts`, Daten `src/content/data/*.json`.
- **Entwickeln am Editor:** `yarn cms:here` (bleibt auf dem aktuellen Branch, Veröffentlichen deaktiviert).
