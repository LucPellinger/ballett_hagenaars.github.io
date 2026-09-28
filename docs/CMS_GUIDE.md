# Inhalte-Editor – Anleitung

Mit dem Inhalte-Editor ändern Sie Texte, Kurse, Stundenplan, Preise, Team, Events und Fotos der
Website – ganz ohne Programmierkenntnisse. Alles läuft im Browser.

---

## 1. Editor starten

**Variante A – Doppelklick (Mac):** Im Projektordner `ballett_hagenaars.github.io` die Datei
**„Inhalte bearbeiten.command“** doppelklicken.

**Variante B – Terminal:**

```bash
cd ~/Documents/private/ballett_hagenaars.github.io
yarn cms
```

Der Browser öffnet sich automatisch mit dem Editor (sonst: <http://localhost:5173/cms/>).
Das Terminal-Fenster **offen lassen**, solange Sie arbeiten. Zum Beenden: Fenster schließen
(oder `Ctrl + C`).

Beim Start holt der Editor automatisch die neueste Version von GitHub.

---

## 2. Inhalte bearbeiten

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

## 3. Speichern

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

## 4. Veröffentlichen

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

**Die Lehrkraft / der Kurs erscheint nicht in der Auswahl im Stundenplan.**
Neue Kurse und Personen zuerst anlegen und **speichern**, dann erscheinen sie in der Auswahl.

**„Hochladen fehlgeschlagen“.**
Internetverbindung prüfen. Wenn es bleibt: Luc fragen (Zugang zu GitHub).

**„Konflikt … bitte Luc fragen“.**
Jemand hat gleichzeitig dieselbe Stelle geändert. Nichts ist verloren – Luc hilft beim Zusammenführen.

**Der Editor zeigt „Entwicklermodus“.**
Der Editor wurde nicht mit `yarn cms` gestartet. Schließen und neu starten.

---

## Für Luc: Einrichtung & Technik

- **Einmalig auf dem Computer des Bearbeiters:** Node + Yarn (ONBOARDING.md Schritt 1–4), Repository
  klonen, SSH-Zugang zu GitHub einrichten (Push auf `content-management`).
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
