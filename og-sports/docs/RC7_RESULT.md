# RC7 – Run R3 und Meet-Kachel M2 (26.10.2026)

R3: Symbolbild · Iliya Jokic / Unsplash, Melbourne. M2: Symbolbild · Victoria Prymak / Unsplash, Dachgruppe in der Abenddämmerung. Beide SHA-256-Hashes vor Benutzung gegen das externe Kandidatenmanifest geprüft. Quellen nicht kopiert; keine Retusche, kein Netzwerk außer localhost, kein Commit/Push/Deployment.

## Aufbereitung und Ausschnitte

Identischer bestehender p50-Filter, Skalierung vor Grade, WebP Q82/method 6. Die p50-Rezeptur liegt in prepare_responsive.py; prepare_images.py enthält nur die geschützten 01/03-Aufbereitungen.
[[og-sports/scripts/prepare_responsive.py:78 "f'scale={width}:{height}:flags=lanczos,{P50}'"]]
[[og-sports/scripts/prepare_responsive.py:84 "rendered.save(OUT / name, 'WEBP', quality=82, method=6)"]]

Run Desktop bewahrt das volle 5184×3456-Bild: Läuferin im inneren linken Bildbereich, höchste Türme und ruhiger Himmel. Handy 2764×3455 (4:5) enthält Läuferin und beide höchsten Türme. Bestehendes cover schneidet auf Desktop etwas oben/unten und auf Tablet seitlich; der Kopf bleibt frei, die große Überschrift überlagert wie zuvor den unteren Körper. Der Himmel bleibt für die obere Wortmarke und Kapitelzeile frei.
Die gemessene Hauptüberschrift liegt unten, nicht über der Skyline: y=340.25–431.50 bei 390, 671.22–844.00 bei 768, 560.73–799.20 bei 1440 CSS-px. Obere Zeile y=20/23.03/40. Layout unverändert.
[[og-sports/site/styles.css:224 ".movement h2 { position: absolute; left: var(--gutter); bottom:"]]

Meet: identischer 3736×4670-Crop für Mosaik und Handy (4:5). Die ganze im Original sichtbare Gruppe einschließlich Randpersonen bleibt innerhalb des Bildes; Beine sind teilweise schon im Original durch die Dachkante verdeckt. Himmel oben und Fahne erhalten. Auf 390/768/1440 visuell geprüft.

| Bild | Desktop-Crop | Handy-Crop | Desktop-Breiten | Handy-Breiten |
|---|---|---|---|---|
| run-night.webp | [0, 0, 5184, 3456] | [1100, 0, 3864, 3455] | 640, 1080, 1600, 2400, 2880, 3200 | 640, 1080, 1280, 1600 |
| pillar-meet.webp | [1715, 0, 5451, 4670] | [1715, 0, 5451, 4670] | 640, 1080, 1600, 2400, 2880 | 640, 1080, 1280, 1600 |

Run erhält zusätzlich 3200 px und eine sizes-Angabe einschließlich der bestehenden 1.02-Transformation. Die Meet-Auswahl berücksichtigt nun das tatsächliche 4:5-Bild statt des alten 3:2-Overfetch. Fallbacks sind jeweilige 2400-px-Derivate; alle bisherigen Dateinamen bleiben.
[[og-sports/scripts/responsive_markup.py:44 "'run-night.webp': 'max(102vw, min(153svh, 1652.4px))'"]]

## Bildbytes und Messung

Installiertes Chrome channel="chrome", ogpw-venv, frische Kontexte, Reduced Motion, Lazy Loading, 500-CSS-px-Schritte/100 ms, Decode und Netzwerkruhe. Summe der Bildantworten inklusive SVG, ohne HTML/Fonts/Header. Screenshots in CSS-Pixeln; Auswahl mit DPR 3/2/2. RC6 stammt per git show aus 18138d5 und wird nur aus RAM über localhost ausgeliefert. Wegen der verbindlichen Schreibpfadgrenze keine TEMP-Dateien und keine Baseline-/Build-Kopie.
[[og-sports/scripts/rc7_evidence.py:42 "browser = pw.chromium.launch(channel='chrome')"]]
[[og-sports/scripts/rc7_evidence.py:29 "cache[name] = baseline('site/' + name)"]]

| Viewport | RC6 Bytes | RC7 Bytes | Differenz |
|---|---:|---:|---:|
| 390@3x | 2150495 | 1501739 | -648756 (-30.17%) |
| 768@2x | 2342153 | 2156267 | -185886 (-7.94%) |
| 1440@2x | 3942475 | 3428523 | -513952 (-13.04%) |

Alle übrigen Bildantworten sind zwischen RC6 und RC7 identisch, einschließlich meet-night. Rohdaten: rc7-measurements.json.

## Auflösungsfaktoren

Q = Bitmapbedarf / Quellpixel nach Crop; A = Bitmapbedarf / geladene WebP-Pixel. cover und Transformation sind eingerechnet. >1 bedeutet Vergrößerung. Alle neuen Q/A liegen unter 1.

| Breite | Bild | Q/A RC6 | Q/A RC7 | Bedarf RC7 | Geladene Datei RC7 |
|---|---|---|---|---|---|
| 390 | run-night.webp | 0.2309/0.9141 | 0.4233/0.9141 | [1170.0, 1462.5] | run-night-mobile-1280.webp |
| 390 | pillar-meet.webp | 0.3661/0.8203 | 0.281/0.9722 | [1050.0, 1312.5] | pillar-meet-mobile-1080.webp |
| 768 | run-night.webp | 0.2898/0.9579 | 0.5312/0.9563 | [2754.0, 1836.0] | run-night-2880.webp |
| 768 | pillar-meet.webp | 0.2514/0.8448 | 0.193/0.6676 | [721.0, 901.25] | pillar-meet-1080.webp |
| 1440 | run-night.webp | 0.3086/1.02 | 0.5667/0.9181 | [2937.6, 1958.4] | run-night-3200.webp |
| 1440 | pillar-meet.webp | 0.3106/0.6959 | 0.2384/0.8247 | [890.72, 1113.4] | pillar-meet-1080.webp |

## Grade gegen historische p50-Referenz

L/S-Mittelwerte 0–255 aus auf 128×128 verkleinerten kodierten größten Desktop-Derivaten, vor CSS/Veil. Historischer Referenzmedian 40.2/68.4 bleibt fest. Abweichungen beschreiben die Szene, keinen zusätzlichen Grade.

| Bild | L/S RC6 | L/S RC7 | Δ L/S zur Referenz |
|---|---|---|---|
| run-night.webp | [32.67, 47.74] | [95.91, 83.7] | [55.71, 15.3] |
| pillar-meet.webp | [101.5, 56.27] | [71.75, 23.23] | [31.55, -45.17] |

## Prüfung und Grenzen

npm test: 21/21 bestanden. prepare_responsive.py --check: 18 Quellen, 105 WebPs, kein Upscaling. pillars.py --check bestanden. Chrome: sechs Kontexte ohne JS-/Bildfehler, externe Requests oder horizontalen Overflow. Zwölf Screenshots visuell geprüft. Kein Build angelegt (Aufgabe verbietet Seitenkopien). Safari, Firefox, echte Geräte und Model-/Property-Releases: ungeprüft.

Beide sichtbaren Credits und die DE/EN-Alttexte wurden zum neuen Motiv aktualisiert. Alte Credits dieser zwei Bilder sind aus den aktiven Nachweisen entfernt; die unveränderten RC3-Abschnitte im Audit bleiben ausdrücklich historische Messdaten.
[[og-sports/scripts/pillars.py:33 "Victoria Prymak / Unsplash"]]
[[og-sports/site/index.html:95 "I — Run · Iliya Jokic / Unsplash"]]

## Screenshots

- `og-sports/qa/rc7-rc6-390-run.png`
- `og-sports/qa/rc7-rc6-390-temple.png`
- `og-sports/qa/rc7-rc6-768-run.png`
- `og-sports/qa/rc7-rc6-768-temple.png`
- `og-sports/qa/rc7-rc6-1440-run.png`
- `og-sports/qa/rc7-rc6-1440-temple.png`
- `og-sports/qa/rc7-rc7-390-run.png`
- `og-sports/qa/rc7-rc7-390-temple.png`
- `og-sports/qa/rc7-rc7-768-run.png`
- `og-sports/qa/rc7-rc7-768-temple.png`
- `og-sports/qa/rc7-rc7-1440-run.png`
- `og-sports/qa/rc7-rc7-1440-temple.png`
