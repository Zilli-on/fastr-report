# RC5 — Pulli-Produktbühne und STICK, 2026-10-26

Lokale Umsetzung im bereitgestellten Worktree; kein Commit, Push, Deployment oder Installationsvorgang.

## Entscheidungen

- Eine große 4:5-Bühne mit sechs nativen Farbbuttons; Black als Standard auch in Säule III, damit die Tempelkachel keine zweite Farbe vorzeitig lädt. Sichtbare Farbnamen, `aria-pressed`, Fokusrahmen und mindestens 44 px breite Tippflächen. [[og-sports/site/index.html:144 "data-hoodie="black" aria-pressed="true""]]
- Wechsel erst nach erfolgreichem Decoding, 220 ms Überblendung; bei Reduced Motion sofort. Das bestehende Bild bleibt während des Ladens sichtbar; fehlgeschlagene Bilder können erneut angefordert werden. Schnelle Auswahlen werden über eine Request-Nummer geordnet. [[og-sports/site/script.js:183 "const loaded = await loadHoodie(button);"]] [[og-sports/site/script.js:192 "if (!reduced.matches) {"]]
- Andere Farben werden nur bei Hover, Tastaturfokus oder Auswahl angefordert. [[og-sports/site/script.js:170 "for (const event of ['pointerenter', 'focus'])"]]
- Die sechs bereitgestellten, bereits farblich angeglichenen PNG-Masters bleiben außerhalb des Repos. 30 WebPs: pro Farbe 480, 800, 1200, 1600 und 1792 px; keine Hochskalierung und kein zusätzliches Grading. [[og-sports/scripts/prepare_responsive.py:54 "widths = sorted({w for w in steps if w <= maximum} | {maximum})"]]
- Kennzeichnung „KI-Visualisierung“ / „AI visualisation“ am Bild, in der Tempelkachel und im Dialog; Credits aktualisiert. [[og-sports/site/index.html:142 "data-de="KI-Visualisierung" data-en="AI visualisation""]]
- „Earned. Not given.“ und der fastr30.com/merch-Link bleiben HTML. [[og-sports/site/index.html:137 "<p class="apparel-earned">Earned. Not given.</p>"]]
- 24 alte Dateien entfernt: sechs Shop-JPEGs plus je drei WebP-Varianten. Aktuelle Manifeste und Original-Hash-Tests bereinigt; eine neue Regression schützt vor Rückkehr. Historische RC3-Dokumentation ist ausdrücklich als historisch gekennzeichnet. [[og-sports/tests/hoodie.test.mjs:22 ".every(n => !n.startsWith('merch-'))"]]
- STICK-Kamera passt Abstand und Zielpunkt kontinuierlich an die transformierten Bauteilgrenzen an; Zielhöhe 80 %, kompaktere Explosion. Die Phasenbuttons scrollen weich. [[og-sports/site/stick-viewer.js:206 "Math.abs(viewCorner.y) / (tan * .8) + viewCorner.z,"]]
- Teilelabels auf dem Handy 11 px; getrennte Spalten und Mindestabstand vermeiden Kollisionen. [[og-sports/site/styles.css:359 ".stick-legend li { font-size: .6875rem; left: 10px; }"]]

## Gates

```text
npm run check: 21 tests, 21 pass, 0 fail
Build: 130 files
site: 8 cases passed, 20 screenshots
artefacts: 2 cases passed, 16 screenshots
Responsive sources verified: 18 originals; 94 WebPs; no upscaling
pillars.py --check: exit 0
```

Logs: `docs/rc5-check.log`, `docs/rc5-browser.log`. Chromium-Suite: 320, 360, 390,
768, 1024, 1440, 1920 px und 1280×640; Projekt-Dialoge, DE/EN, Tastatur,
Reduced Motion, Layout, Bilder, Konsole und unerwartete externe Requests.

## Messung und Zusatzprüfung

Vorher und nachher mit demselben `scripts/rc5_evidence.py`: leerer Chromium-Kontext,
390×844 @3x bzw. 1440×900 @2x, vom Anfang bis Seitenende in 600-px-Schritten,
100 ms Pause pro Schritt, anschließend networkidle. Summe von Navigation und
Ressourcen; keine Dialoge oder Farbwechsel vor der Gewichtsmessung.
Der lokale Server liefert unkomprimiert. `transferSize` enthält Chromium-Header,
keine TLS-/Transportmessung. Die Werte sind nicht mit der RC3-Bildsumme gleichzusetzen.

Die Zusatzprüfung untersucht verzögertes Laden, alle sechs Farben, Enter/Space,
DE/EN, Reduced Motion, Tippflächen in einer Reihe, Bildfüllung und Labelkollisionen
aller drei STICK-Phasen sowie Zwischenpositionen beim Phasenwechsel und Renderstillstand.

| Viewport / DPR | Body vorher | Body nachher | Differenz | Transfer vorher | Transfer nachher |
|---|---:|---:|---:|---:|---:|
| 390 / 3 | 3755422 | 3692353 | -63069 (-1.68%) | 3766822 | 3701953 |
| 1440 / 2 | 5210076 | 5289933 | +79857 (+1.53%) | 5221476 | 5299833 |

STICK-Bildhoehe bei beiden Breiten: montiert 79.99 %, explodiert 79.45 %, aufgedreht 79.84 %.
Gemessen als projizierte Bauteilgrenzen ohne Schatten. Alle fuenf Labels kollisionsfrei.

```text
rc5_evidence.py after: 2 cases passed; errors: []
git diff --check: exit 0
```

Rohdaten: `docs/rc5-measurements.json` sowie `before.json` / `after.json` im Evidenzordner.

## Screenshots

Alle zehn angeforderten Ansichten wurden als tatsächlich gerenderte Screenshots visuell geprüft.
Wear als vollständiges Kapitel, STICK als Viewport. Verzeichnis:
`C:/Users/Fabien/AppData/Local/Temp/og-rc5-evidence/`

- `390-wear-black.png`
- `390-wear-lavender.png`
- `1440-wear-black.png`
- `1440-wear-lavender.png`
- `390-assembled.png`
- `390-exploded.png`
- `390-opened.png`
- `1440-assembled.png`
- `1440-exploded.png`
- `1440-opened.png`

Zusätzlich liegen dort `before.json`, `after.json`, `visual-site.json`,
`visual-artefacts.json` und die 36 Screenshots der Browser-Suite. Keine Evidenz unter `site/`.

## Reproduktion

Im Ordner `og-sports/`, mit den bereits vorhandenen Python-Umgebungen:

```powershell
$env:OG_BUILD_DIR='scripts/.rc5-dist'
npm run check
$env:OG_QA_DIR=Join-Path $env:TEMP 'og-rc5-evidence'
& "$env:LOCALAPPDATA\Temp\ogpw\Scripts\python" scripts/visual_review.py all
& "$env:LOCALAPPDATA\Temp\ogcv\Scripts\python" scripts/prepare_responsive.py --check
py -3.12 scripts/pillars.py --check
# Separates Terminal, nur lokal:
$env:PORT='4385'
node scripts/serve.mjs
# Zusatzprüfung gegen diesen lokalen Server:
& "$env:LOCALAPPDATA\Temp\ogpw\Scripts\python" scripts/rc5_evidence.py after
```

Die Vorher-Messung wurde vor dem Umbau mit `rc5_evidence.py before` aufgenommen.
Eine neue Vorher-Messung erfordert den alten Stand. Der temporäre Build wurde nach
Abschluss anhand seines Manifests geprüft und entfernt.

## Offene Punkte

- Safari, Firefox und echte Mobilgeräte: ungeprüft. Chromium nutzt Software-WebGL;
  schwankende Renderzeiten sind keine Hardware-Frameratenmessung.
- Die STICK-Bewegung ist eine Prinzipdarstellung; Passungen, Kollisionen,
  Dichtheit und Füllmenge bleiben unvalidiert.
- Drucktreue und Farbabgleich der bereitgestellten KI-Masters beruhen auf der
  beschriebenen Prüfung der Leitstelle; keine erneute externe Produktfreigabe.

## Geänderte Dateien

- `og-sports/docs/ASSET_AUDIT.md`
- `og-sports/docs/PHOTO_CREDITS.md`
- `og-sports/docs/asset_manifest.json`
- `og-sports/docs/responsive-assets.json`
- `og-sports/scripts/pillars.py`
- `og-sports/scripts/prepare_responsive.py`
- `og-sports/scripts/rc3_audit.py`
- `og-sports/scripts/responsive_markup.py`
- `og-sports/scripts/visual_review.py`
- `og-sports/site/assets/merch-01-black.jpg` (entfernt)
- `og-sports/site/assets/merch-02-cherry-red.jpg` (entfernt)
- `og-sports/site/assets/merch-03-cobalt-blue.jpg` (entfernt)
- `og-sports/site/assets/merch-04-emerald-green.jpg` (entfernt)
- `og-sports/site/assets/merch-05-lavender.jpg` (entfernt)
- `og-sports/site/assets/merch-06-butter-yellow.jpg` (entfernt)
- `og-sports/site/assets/responsive/merch-01-black-320.webp` (entfernt)
- `og-sports/site/assets/responsive/merch-01-black-640.webp` (entfernt)
- `og-sports/site/assets/responsive/merch-01-black-660.webp` (entfernt)
- `og-sports/site/assets/responsive/merch-02-cherry-red-320.webp` (entfernt)
- `og-sports/site/assets/responsive/merch-02-cherry-red-640.webp` (entfernt)
- `og-sports/site/assets/responsive/merch-02-cherry-red-660.webp` (entfernt)
- `og-sports/site/assets/responsive/merch-03-cobalt-blue-320.webp` (entfernt)
- `og-sports/site/assets/responsive/merch-03-cobalt-blue-640.webp` (entfernt)
- `og-sports/site/assets/responsive/merch-03-cobalt-blue-660.webp` (entfernt)
- `og-sports/site/assets/responsive/merch-04-emerald-green-320.webp` (entfernt)
- `og-sports/site/assets/responsive/merch-04-emerald-green-640.webp` (entfernt)
- `og-sports/site/assets/responsive/merch-04-emerald-green-660.webp` (entfernt)
- `og-sports/site/assets/responsive/merch-05-lavender-320.webp` (entfernt)
- `og-sports/site/assets/responsive/merch-05-lavender-640.webp` (entfernt)
- `og-sports/site/assets/responsive/merch-05-lavender-660.webp` (entfernt)
- `og-sports/site/assets/responsive/merch-06-butter-yellow-320.webp` (entfernt)
- `og-sports/site/assets/responsive/merch-06-butter-yellow-640.webp` (entfernt)
- `og-sports/site/assets/responsive/merch-06-butter-yellow-660.webp` (entfernt)
- `og-sports/site/index.html`
- `og-sports/site/script.js`
- `og-sports/site/stick-viewer.js`
- `og-sports/site/styles.css`
- `og-sports/tests/original-assets.json`
- `og-sports/tests/site.test.mjs`
- `og-sports/docs/RC5_RESULT.md`
- `og-sports/docs/rc5-browser.log`
- `og-sports/docs/rc5-check.log`
- `og-sports/docs/rc5-measurements.json`
- `og-sports/scripts/rc5_evidence.py`
- `og-sports/site/assets/responsive/hoodie-black-1200.webp`
- `og-sports/site/assets/responsive/hoodie-black-1600.webp`
- `og-sports/site/assets/responsive/hoodie-black-1792.webp`
- `og-sports/site/assets/responsive/hoodie-black-480.webp`
- `og-sports/site/assets/responsive/hoodie-black-800.webp`
- `og-sports/site/assets/responsive/hoodie-butter-yellow-1200.webp`
- `og-sports/site/assets/responsive/hoodie-butter-yellow-1600.webp`
- `og-sports/site/assets/responsive/hoodie-butter-yellow-1792.webp`
- `og-sports/site/assets/responsive/hoodie-butter-yellow-480.webp`
- `og-sports/site/assets/responsive/hoodie-butter-yellow-800.webp`
- `og-sports/site/assets/responsive/hoodie-cherry-red-1200.webp`
- `og-sports/site/assets/responsive/hoodie-cherry-red-1600.webp`
- `og-sports/site/assets/responsive/hoodie-cherry-red-1792.webp`
- `og-sports/site/assets/responsive/hoodie-cherry-red-480.webp`
- `og-sports/site/assets/responsive/hoodie-cherry-red-800.webp`
- `og-sports/site/assets/responsive/hoodie-cobalt-blue-1200.webp`
- `og-sports/site/assets/responsive/hoodie-cobalt-blue-1600.webp`
- `og-sports/site/assets/responsive/hoodie-cobalt-blue-1792.webp`
- `og-sports/site/assets/responsive/hoodie-cobalt-blue-480.webp`
- `og-sports/site/assets/responsive/hoodie-cobalt-blue-800.webp`
- `og-sports/site/assets/responsive/hoodie-emerald-green-1200.webp`
- `og-sports/site/assets/responsive/hoodie-emerald-green-1600.webp`
- `og-sports/site/assets/responsive/hoodie-emerald-green-1792.webp`
- `og-sports/site/assets/responsive/hoodie-emerald-green-480.webp`
- `og-sports/site/assets/responsive/hoodie-emerald-green-800.webp`
- `og-sports/site/assets/responsive/hoodie-lavender-1200.webp`
- `og-sports/site/assets/responsive/hoodie-lavender-1600.webp`
- `og-sports/site/assets/responsive/hoodie-lavender-1792.webp`
- `og-sports/site/assets/responsive/hoodie-lavender-480.webp`
- `og-sports/site/assets/responsive/hoodie-lavender-800.webp`
- `og-sports/tests/hoodie.test.mjs`
