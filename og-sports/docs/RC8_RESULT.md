# RC8 - Run-Kachel PR2 und Kapitel IV MN1 (27.10.2026)

PR2 ersetzt Nick Gosset durch limoo / Pexels; MN1 ersetzt liathyrax durch Fitsum Admasu / Unsplash. Beide verwendeten SHA-256-Hashes vor Benutzung geprueft. MN1 ist der bereitgestellte retuschierte Master (bearbeitet: Aufdruck entfernt). Keine weitere Retusche, Quellen nicht kopiert, kein Netzwerk ausser localhost, kein Commit/Push/Deployment.

## Aufbereitung und Ausschnitte

Identische p50-Rezeptur, Skalierung vor Grade, WebP Q82/method 6. Keine Hochskalierung. Fallbacks sind die jeweiligen 2400-px-Derivate.
[[og-sports/scripts/prepare_responsive.py:87 "f'scale={width}:{height}:flags=lanczos,{P50}'"]]
[[og-sports/scripts/prepare_responsive.py:93 "rendered.save(OUT / name, 'WEBP', quality=82, method=6)"]]

| Bild | Quellpixel | Desktop-Crop | Handy-Crop | Desktop-Breiten | Handy-Breiten |
|---|---|---|---|---|---|
| pillar-run.webp | [5760, 8640] | [0, 900, 5760, 8100] | [0, 900, 5760, 8100] | 640, 1080, 1600, 2400, 2880 | gleiche Varianten |
| meet-night.webp | [6720, 4480] | [0, 0, 6720, 3780] | [928, 0, 4512, 4480] | 640, 1080, 1600, 2400, 2880, 3200 | 640, 1080, 1280, 1600 |

Run verwendet den vorgeschlagenen 4:5-Crop auf allen Breiten; das bestehende Mosaik beschneidet ihn ab 768 px per cover auf 4:3. Kopf, Schritt und Spiegelung bleiben sichtbar. Die Position bleibt 50% 45%. Meet verwendet 16:9 auf Desktop und 4:5 auf Handy; object-position 30% 50% bewahrt die ganze Gruppe auch im schmaleren Tablet-Rahmen. Der Kopf der linken Laeuferin hat Luft. Die bestehende Ueberschrift ueberlagert Teile der Beine; sie bleibt lesbar. Keine Layout-/Farb-/Typografie-Aenderung.
[[og-sports/scripts/pillars.py:24 ""50% 45%", ("limoo / Pexels", "limoo / Pexels")"]]
[[og-sports/site/index.html:159 "style="object-position:30% 50%""]]

Meet erhaelt eine 3200-px-Stufe fuer den Bitmapbedarf von rund 3003 px und eine sizes-Angabe einschliesslich der bestehenden 1.02-Transformation.
[[og-sports/scripts/responsive_markup.py:45 "'meet-night.webp': 'max(102vw, min(166.8267svh, 1813.34px))'"]]

## Bildbytes und Messung

Installiertes Chrome channel="chrome", ogpw-venv, frische Kontexte, Reduced Motion, normales Lazy Loading, 500-CSS-px-Schritte/100 ms, Decode und Netzwerkruhe. Summe aller Bildantworten inklusive SVG, ohne HTML/Fonts/Header. Screenshots in CSS-Pixeln; Bildauswahl bei DPR 3/2/2. RC7 kommt per git show e8f4890 aus RAM, ohne Seiten-/Build-Kopie.
[[og-sports/scripts/rc8_evidence.py:47 "browser = pw.chromium.launch(channel='chrome')"]]
[[og-sports/scripts/rc8_evidence.py:15 "'e8f4890:og-sports/' + path"]]

| Viewport | RC7 Bytes | RC8 Bytes | Differenz |
|---|---:|---:|---:|
| 390@3x | 1501739 | 1528425 | +26686 (+1.78%) |
| 768@2x | 2156267 | 2303669 | +147402 (+6.84%) |
| 1440@2x | 3428523 | 3575925 | +147402 (+4.30%) |

Alle uebrigen Bildantworten sind zwischen RC7 und RC8 identisch. Mehrgewicht entsteht vor allem durch die detailreichere Run-Kachel; die mobile Meet-Datei wird kleiner. Rohdaten: `rc8-measurements.json`.

| Breite | Bild | Bildbytes RC7 | Bildbytes RC8 |
|---|---|---:|---:|
| 390 | pillar-run.webp | 27498 | 81952 |
| 390 | meet-night.webp | 85410 | 57642 |
| 768 | pillar-run.webp | 48556 | 181284 |
| 768 | meet-night.webp | 76596 | 91270 |
| 1440 | pillar-run.webp | 48556 | 181284 |
| 1440 | meet-night.webp | 76596 | 91270 |

## Aufloesungsfaktoren

Q = Bitmapbedarf / Quellpixel nach Crop; A = Bitmapbedarf / geladene WebP-Pixel. cover und Transformation sind eingerechnet; >1 bedeutet Vergroesserung. Alle neuen Q/A liegen unter 1.

| Breite | Bild | Q/A RC7 | Q/A RC8 | Bedarf RC8 | Datei RC8 |
|---|---|---|---|---|---|
| 390 | pillar-run.webp | 0.2625/0.9722 | 0.1823/0.9722 | [1050.0, 1312.5] | pillar-run-1080.webp |
| 390 | meet-night.webp | 0.2925/0.9141 | 0.3265/0.9141 | [1170.0, 1462.5] | meet-night-mobile-1280.webp |
| 768 | pillar-run.webp | 0.362/0.905 | 0.2514/0.905 | [1448.0, 1810.0] | pillar-run-1600.webp |
| 768 | meet-night.webp | 0.7507/1.0427 | 0.4469/0.9384 | [3002.88, 1689.12] | meet-night-3200.webp |
| 1440 | pillar-run.webp | 0.3348/0.8369 | 0.2325/0.8369 | [1339.09, 1673.87] | pillar-run-1600.webp |
| 1440 | meet-night.webp | 0.7507/1.0427 | 0.4469/0.9384 | [3002.88, 1689.12] | meet-night-3200.webp |

## Grade gegen historische p50-Referenz

L/S-Mittelwerte 0-255 aus auf 128x128 verkleinerten kodierten groessten Desktop-Derivaten, vor CSS/Veil. Historischer Referenzmedian 40.2/68.4 bleibt fest. Abweichungen beschreiben die Szene, keinen zusaetzlichen Grade. MN1 bleibt deutlich blau; PR2 hat warme Architektur gegen dunkle Silhouette. Rohdaten: `rc8-grade.json`.

| Bild | L/S RC7 | L/S RC8 | Delta zur Referenz |
|---|---|---|---|
| pillar-run.webp | [88.4, 40.61] | [27.77, 93.02] | [-12.43, 24.62] |
| meet-night.webp | [6.76, 111.24] | [61.01, 159.89] | [20.81, 91.49] |

## Pruefung und Grenzen

npm test: 21/21 bestanden. prepare_responsive.py --check: 18 Quellen, 106 WebPs, kein Upscaling. pillars.py --check bestanden. Sechs gueltige Chrome-Kontexte ohne JS-Fehler, externe Requests oder horizontalen Overflow; alle ausgewaehlten Bilder decodiert. Zwoelf Screenshots visuell geprueft. Ein erster RC8-Messversuch hatte eine nicht angewandte Stylesheet-Darstellung und wurde verworfen; die endgueltige Messung prueft die angewandte Grid-Darstellung vor dem Scrollen. Browserseitig abgebrochene vorlaeufige Bildauswahlen werden nicht als geladene Bildbytes gezaehlt. Safari, Firefox, echte Geraete und Model-/Property-Releases: ungeprueft.
[[og-sports/scripts/rc8_evidence.py:62 "'stylesheet not applied'"]]

DE/EN-Alttexte und sichtbare Credits sowie die aktiven Bildnachweise sind aktualisiert; historische Auditdaten bleiben erhalten.
[[og-sports/scripts/pillars.py:24 "limoo / Pexels"]]
[[og-sports/site/index.html:163 "Illustrative photo · Fitsum Admasu / Unsplash"]]

## Lesbarkeit

Run 390: kleine, klar erkennbare Silhouette mit vollstaendigem Schritt oberhalb von Run/OG FASTR. Run 768: Laeuferin vor der Saeulenhalle klar und frei von der Kacheltypografie. Run 1440: Silhouette und Schritt deutlich, Spiegelung im unteren Bildteil, Labels frei. Meet 390: alle drei Silhouetten im Bild, Koepfe frei und Titel lesbar, Beine teilweise von der bestehenden Typografie ueberlagert. Meet 768: Gruppe seitlich vollstaendig, linker Kopf mit Luft, Titel und Credits lesbar. Meet 1440: ganze Gruppe im Rahmen, Koepfe frei und Titel klar, Beine teilweise hinter der bestehenden Ueberschrift.

## Screenshots

- `og-sports/qa/rc8-rc7-390-meet.png`
- `og-sports/qa/rc8-rc7-390-temple.png`
- `og-sports/qa/rc8-rc7-768-meet.png`
- `og-sports/qa/rc8-rc7-768-temple.png`
- `og-sports/qa/rc8-rc7-1440-meet.png`
- `og-sports/qa/rc8-rc7-1440-temple.png`
- `og-sports/qa/rc8-rc8-390-meet.png`
- `og-sports/qa/rc8-rc8-390-temple.png`
- `og-sports/qa/rc8-rc8-768-meet.png`
- `og-sports/qa/rc8-rc8-768-temple.png`
- `og-sports/qa/rc8-rc8-1440-meet.png`
- `og-sports/qa/rc8-rc8-1440-temple.png`
