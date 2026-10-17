# MRT-Quest

**Live spielen:** https://exolinodev.github.io/mrtquest/

Browserbasierte Lern-App zu MRT-Physik und Gerätetechnik für Medizininformatik-Studierende. Gebaut mit React 18, TypeScript und Vite. Der Fortschritt (XP, Level, Abzeichen) wird lokal im Browser gespeichert; es gibt kein Backend.

## Starten

```bash
npm install
npm run dev       # Entwicklungsserver auf http://localhost:5173
npm run build     # Typecheck + Produktions-Build nach dist/
npm run preview   # Build lokal ausliefern (http://localhost:4173)
npm test          # Unit-Tests (Physik, Spiellogik, Lösbarkeit der Szenarien)
npm run test:mobile  # Mobiler Regressionstest (nach npm run build, nutzt lokales Chrome)
```

Der Build nutzt relative Pfade (`base: './'`) und einen Hash-Router. `dist/` lässt sich daher auf jedem statischen Webserver und in jedem Unterverzeichnis ausliefern. Jeder Push auf `main` wird per GitHub Actions getestet, gebaut und auf GitHub Pages veröffentlicht (`.github/workflows/deploy.yml`).

## Inhalte

| Modul | Themen | Simulator |
|---|---|---|
| 1 Kernspin & Larmor | Spin, Zeeman, Boltzmann, Präzession, Resonanz, Flipwinkel | Präzessions-Labor (3D-Vektor, Off-Resonanz, Resonanz-Challenge) |
| 2 T1- & T2-Relaxation | Bloch-Gleichungen, T1/T2/T2*, Spin-Echo, Kontrast | Relaxations-Simulator (Kurven, TR/TE, Phasenfächer) |
| 3 Ortskodierung | Schicht-, Frequenz-, Phasenkodierung | Gradienten-Werkbank (Schicht-Challenge, Auslese, Phasenleiter) |
| 4 K-Raum & Fourier | Ortsfrequenzen, FOV/Auflösung, Trajektorien, Partial Fourier, PI | K-Raum-Studio (echte 2D-FFT, Filter, Unterabtastung, Spike, Bewegung, Basiswellen) |
| 5 Pulssequenzen | SE, TSE, IR (STIR/FLAIR), GRE, EPI | Sequenz-Designer (Pulsdiagramm, synthetisches Bild) |
| 6 SNR, SAR & Artefakte | SNR-Gleichung, IEC-SAR-Grenzwerte, Artefakt-Management | Artefakt-Detektiv (9 Artefakttypen diagnostizieren und beheben) |
| 7 Gerätetechnik | Supraleitung, Quench, Shim, Gradienten, HF-Spulen, Sicherheit | Scanner-Explorer (Querschnitt mit Such-Quiz) |

Dazu kommen:

- **Klinische Fälle**: sechs Szenarien (MS-FLAIR, Klaustrophobie, STIR bei 3 T unter SAR-Limit, Leber im Atemanhalt, Schlaganfall-EPI, Neurostimulator mit 1 W/kg). In der Protokoll-Konsole werden Kontrast, SNR, Auflösung, Messzeit, SAR und Artefakte live berechnet. Pflichtkriterien entscheiden über das Bestehen, Bonuskriterien über bis zu drei Sterne.
- **Challenges**: pro Modul acht Aufgaben aus Verständnisfragen und Rechen-Puzzles. Rechen-Puzzles erzeugen ihre Werte bei jedem Durchlauf neu.
- **Abschlussprüfung**: 21 gemischte Aufgaben. Sie wird freigeschaltet, sobald jede Modul-Challenge einmal gespielt wurde.

## Mobiler Regressionstest

`npm run test:mobile` öffnet alle Seiten in Deutsch und Russisch bei 320, 360, 390, 430, 768, 844 (quer), 901, 1024 und 1280 px Breite. Er prüft auch Challenge-Einstiege, laufende Fragen, die gesperrte und freigeschaltete Prüfung sowie die geöffnete mobile Navigation – inklusive alternativer Gradienten-/Sequenzmodi, maximalem Frequenzoffset, k-Raum-Basiswelle, Scanner-Auswahl und Artefakt-Auswertung insgesamt 1074 Seitenansichten. Horizontales Überlaufen, herausragende Elemente, Touch-Ziele unter 44 × 44 px und Konsolen-/Laufzeitfehler lassen den Test fehlschlagen. Die kleinen SVG-Komponenten des Scanners haben zusätzlich eine native Komponentenauswahl mit großem Touch-Ziel. Ganzseitige Screenshots und `report.json` landen in `mobile-report/`. Mit `VIEWPORTS=320 LANGS=ru` lässt sich der Lauf eingrenzen; `CHROME_PATH` überschreibt den Browserpfad. Der Test läuft bei Pull Requests und vor jeder Veröffentlichung.

Die Oberfläche passt sich auch an den Platz neben der Sidebar an: Diagramme und Simulator-Panels wechseln in eine lesbare Einzelspalte, breite Tabellen und Pulsdiagramme bleiben lokal scrollbar. Auf schmalen Ansichten bietet die Protokoll-Konsole eine haftende Sprungleiste zwischen Parametern, Bild/Kennzahlen und Anforderungen. Die Navigation sperrt den Hintergrund, hält den Tastaturfokus im Menü und lässt sich per Schließen-Taste, Escape oder außerhalb des Menüs schließen. Eingabefelder verwenden mindestens 16 px Schriftgröße, damit iOS beim Fokussieren nicht automatisch zoomt.

## Sprachen

Die gesamte App ist auf Deutsch und Russisch verfügbar: Oberfläche, Theorie, Fragen, Simulatoren, klinische Fälle und Abzeichen. Der Umschalter 🇩🇪 DE | 🇺🇦 РУС sitzt oben in der Kopfleiste; alternativ wechselt **Alt+L** die Sprache. Der Wechsel wirkt sofort und jederzeit, auch mitten in einer Challenge: Fragen werden aus einem gespeicherten Seed in der neuen Sprache neu erzeugt, mit denselben Zahlenwerten, derselben Optionsreihenfolge und derselben Auswahl. Die gewählte Sprache wird lokal gespeichert; beim ersten Besuch entscheidet die Browsersprache.

Technisch liegen alle Inhalte als zweisprachige Datensätze (`{ de, ru }`) vor; Rechen-Puzzles erhalten die Sprache als Parameter. Die Tests prüfen, dass jede Frage in beiden Sprachen existiert und bei gleichem Seed identische Lösungen liefert dass die russischen Theorie-Kapitel strukturgleich zu den deutschen sind und dass in den russischen Texten keine ukrainischen Buchstaben stehen.

## Gamification

- **XP**: 10/15/25 pro richtiger Antwort je nach Schwierigkeit. Ab drei richtigen Antworten in Folge gibt es ×1,2, ab sechs ×1,5. Ein genutzter Hinweis halbiert die XP der Frage. Dazu kommen Abschlussboni, 20 XP pro gelesenem Theorie-Kapitel, XP für Entdeckungen in Simulatoren und für Szenario-Sterne.
- **Level**: Schwelle für Level n ist 50·n·(n−1) XP. Es gibt zehn Titel von „Erstsemester“ bis „Larmor-Legende“.
- **Abzeichen**: 33 in Bronze, Silber und Gold, z. B. für gemeisterte Module, Serien, den FLAIR-Nullpunkt oder ein 3-T-Szenario im Normal Mode.
- **Wiederholungen**: Ist ein Modul mit mindestens 80 % gemeistert, gibt es dort nur noch halbe XP. Szenarien vergeben XP nur für neu erreichte Sterne.
- **Persistenz**: `localStorage` unter dem Schlüssel `mrt-quest:v1`, mit Validierung beim Laden. Export als JSON und Zurücksetzen gibt es im Profil.

## Architektur

```
src/
  physics/      reine Funktionen: Formeln (mri.ts), FFT, Phantome, Protokoll- und Bildmodell
  content/      Module, Theorie, Fragenkataloge (inkl. Generatoren), klinische Szenarien
  game/         Zustand (Reducer), Level, Abzeichen, Persistenz, React-Context
  i18n/         Sprachkontext (DE/RU), Zahlenformat, Typ für zweisprachige Texte
  simulators/   die acht interaktiven Simulatoren + Registry
  components/   UI-Bausteine, Challenge-Engine, KaTeX-Rendering, Router, Layout
  pages/        Übersicht, Modulseiten, Klinik, Labor, Prüfung, Profil
```

Die Physik ist von der UI getrennt und vollständig getestet. `src/game/game.test.ts` enthält für jedes klinische Szenario eine Musterlösung und prüft, dass es lösbar ist und mit dem Startprotokoll noch nicht besteht.

## Physikalisches Modell und Vereinfachungen

- Gewebeparameter (T1, T2, T2*, PD) für 1,5 T und 3 T sind gerundete Literaturwerte (Stanisz et al. 2005 u. a.).
- Signalgleichungen: SE/TSE `ρ(1−e^(−TR/T1))e^(−TE/T2)`, IR als Betragsbild, gespoiltes GRE nach Ernst. In Echozügen wird Fett wegen der J-Kopplung heller dargestellt.
- SNR ∝ B₀ · Voxelvolumen · √(N_PE·NEX/BW_px) / (g·√R), normiert auf eine relative Skala.
- SAR ∝ B₀² · Σ(α/90°)² · Pulse pro Sekunde. Die Konstante ist so kalibriert, dass eine T2-TSE bei 1,5 T bei etwa 1–2 W/kg liegt. Grenzwerte nach IEC 60601-2-33.
- Die Bilder sind synthetische Phantome (Kopf, Knie, Abdomen). Artefakte entstehen physikalisch motiviert: k-Raum-Trunkierung, Phasenfehler pro Zeile, Fettverschiebung, Einfaltung, EPI-Verzerrung und Rician-Rauschen.

Alle Werte sind didaktisch vereinfacht. Die App ist kein Medizinprodukt und ersetzt keine Herstellerangaben zu Protokollen oder Implantatbedingungen.
