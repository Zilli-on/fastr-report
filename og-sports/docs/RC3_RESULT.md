# RC3 Ergebnis

Umgesetzt, lokal geprueft; kein Commit, Push oder Deployment.

110 geaenderte/neue Dateien: 87 WebPs, 3 Quellbilder und 20 Text-/Code-Dateien.

## Gate-Ausgaben (Originalzeilen)

```text
ℹ tests 16
ℹ pass 16
ℹ fail 0
Built 123 files into scripts\.rc3-build/
site: 8 cases passed, 20 screenshots
artefacts: 2 cases passed, 16 screenshots
Responsive sources verified: 19 originals; 87 WebPs; no upscaling
```

`pillars.py --check`: Exit 0. `git diff --check`: Exit 0.

Build-Ausgabe wegen der Schreibgrenzen: `OG_BUILD_DIR=scripts/.rc3-build`; Browserberichte: `OG_QA_DIR=%TEMP%/og-rc3-evidence/gates`.

## Bildgewicht (alle geladenen Bildantworten beim Durchscrollen)

| Breite | Vorher Bytes | Nachher Bytes | Aenderung |
|---|---:|---:|---:|
| 390 @3x | 2799104 | 2447102 | -12.6% |
| 768 @2x | 2799104 | 2534674 | -9.4% |
| 1440 @2x | 2799104 | 4092280 | +46.2% |

Desktop liefert mehr Retina-Pixel und benoetigt deshalb mehr Bilddaten; auf dem Handy sinkt die Summe. Kein Produktions-CDN-Test.

## Screenshots

Vorher: `C:\Users\Fabien\AppData\Local\Temp\og-rc3-evidence\before`
Nachher: `C:\Users\Fabien\AppData\Local\Temp\og-rc3-evidence\after`

Je 11 Kapitel bei 390, 768 und 1440 px, insgesamt 66 Vorher-/Nachher-PNGs. Die 36 Gate-Screenshots liegen separat unter `gates/`.

Alle finalen Kapitelaufnahmen visuell angesehen. Das bestehende Tablet-Mosaik ab 768 px bleibt erhalten; nur unter 768 px werden alle Kacheln einspaltig 4:5. Run und Meet erhalten mobile 4:5-Quellausschnitte. 00-03 behalten ihre Komposition und CSS-Ausschnitte.

Inventur mit 21 Bildern, Quellen, Faktoren, Dateigroessen und Grade-Proben: `ASSET_AUDIT.md`. Schwaechste Bilder: after-the-run.webp, stick-exploded.jpg, merch-05-lavender.jpg.

Chromium geprueft; Safari, Firefox und echte Mobilgeraete ungeprueft. Bei einem Evidenzdurchlauf meldete der lokale HTTP-Server Verbindungsabbrueche beim Kontextwechsel; alle aufgenommenen Hauptseitenbilder waren geladen (naturalWidth > 0), die Bildsummen 390/1440 wurden in mehreren Durchlaeufen identisch gemessen. Die abschliessende Browser-Suite bestand.

## Vollstaendige Dateiliste

- `og-sports/docs/ASSET_AUDIT.md`
- `og-sports/docs/PHOTO_CREDITS.md`
- `og-sports/docs/RC3_RESULT.md`
- `og-sports/docs/RESPONSIVE_IMAGES.md`
- `og-sports/docs/asset_manifest.json`
- `og-sports/docs/photo_sources.json`
- `og-sports/docs/responsive-assets.json`
- `og-sports/scripts/.gitignore`
- `og-sports/scripts/build.mjs`
- `og-sports/scripts/pillars.py`
- `og-sports/scripts/prepare_responsive.py`
- `og-sports/scripts/rc3_audit.py`
- `og-sports/scripts/rc3_evidence.py`
- `og-sports/scripts/responsive_markup.py`
- `og-sports/scripts/serve.mjs`
- `og-sports/scripts/sources/community-ai.png`
- `og-sports/scripts/sources/run-detail-clean.png`
- `og-sports/scripts/sources/run-shadow.jpg`
- `og-sports/scripts/visual_review.py`
- `og-sports/site/assets/responsive/after-the-run-1080.webp`
- `og-sports/site/assets/responsive/after-the-run-1373.webp`
- `og-sports/site/assets/responsive/after-the-run-640.webp`
- `og-sports/site/assets/responsive/frame-01-detail-1080.webp`
- `og-sports/site/assets/responsive/frame-01-detail-1200.webp`
- `og-sports/site/assets/responsive/frame-01-detail-640.webp`
- `og-sports/site/assets/responsive/frame-03-people-1080.webp`
- `og-sports/site/assets/responsive/frame-03-people-1600.webp`
- `og-sports/site/assets/responsive/frame-03-people-2400.webp`
- `og-sports/site/assets/responsive/frame-03-people-2688.webp`
- `og-sports/site/assets/responsive/frame-03-people-640.webp`
- `og-sports/site/assets/responsive/meet-night-1080.webp`
- `og-sports/site/assets/responsive/meet-night-1600.webp`
- `og-sports/site/assets/responsive/meet-night-2400.webp`
- `og-sports/site/assets/responsive/meet-night-2880.webp`
- `og-sports/site/assets/responsive/meet-night-640.webp`
- `og-sports/site/assets/responsive/meet-night-mobile-1080.webp`
- `og-sports/site/assets/responsive/meet-night-mobile-1280.webp`
- `og-sports/site/assets/responsive/meet-night-mobile-1600.webp`
- `og-sports/site/assets/responsive/meet-night-mobile-640.webp`
- `og-sports/site/assets/responsive/merch-01-black-320.webp`
- `og-sports/site/assets/responsive/merch-01-black-640.webp`
- `og-sports/site/assets/responsive/merch-01-black-660.webp`
- `og-sports/site/assets/responsive/merch-02-cherry-red-320.webp`
- `og-sports/site/assets/responsive/merch-02-cherry-red-640.webp`
- `og-sports/site/assets/responsive/merch-02-cherry-red-660.webp`
- `og-sports/site/assets/responsive/merch-03-cobalt-blue-320.webp`
- `og-sports/site/assets/responsive/merch-03-cobalt-blue-640.webp`
- `og-sports/site/assets/responsive/merch-03-cobalt-blue-660.webp`
- `og-sports/site/assets/responsive/merch-04-emerald-green-320.webp`
- `og-sports/site/assets/responsive/merch-04-emerald-green-640.webp`
- `og-sports/site/assets/responsive/merch-04-emerald-green-660.webp`
- `og-sports/site/assets/responsive/merch-05-lavender-320.webp`
- `og-sports/site/assets/responsive/merch-05-lavender-640.webp`
- `og-sports/site/assets/responsive/merch-05-lavender-660.webp`
- `og-sports/site/assets/responsive/merch-06-butter-yellow-320.webp`
- `og-sports/site/assets/responsive/merch-06-butter-yellow-640.webp`
- `og-sports/site/assets/responsive/merch-06-butter-yellow-660.webp`
- `og-sports/site/assets/responsive/photo-ritual-1080.webp`
- `og-sports/site/assets/responsive/photo-ritual-1600.webp`
- `og-sports/site/assets/responsive/photo-ritual-2400.webp`
- `og-sports/site/assets/responsive/photo-ritual-2880.webp`
- `og-sports/site/assets/responsive/photo-ritual-640.webp`
- `og-sports/site/assets/responsive/pillar-meet-1080.webp`
- `og-sports/site/assets/responsive/pillar-meet-1600.webp`
- `og-sports/site/assets/responsive/pillar-meet-2400.webp`
- `og-sports/site/assets/responsive/pillar-meet-2880.webp`
- `og-sports/site/assets/responsive/pillar-meet-640.webp`
- `og-sports/site/assets/responsive/pillar-practice-1080.webp`
- `og-sports/site/assets/responsive/pillar-practice-1600.webp`
- `og-sports/site/assets/responsive/pillar-practice-2400.webp`
- `og-sports/site/assets/responsive/pillar-practice-2880.webp`
- `og-sports/site/assets/responsive/pillar-practice-640.webp`
- `og-sports/site/assets/responsive/pillar-run-1080.webp`
- `og-sports/site/assets/responsive/pillar-run-1600.webp`
- `og-sports/site/assets/responsive/pillar-run-2400.webp`
- `og-sports/site/assets/responsive/pillar-run-2880.webp`
- `og-sports/site/assets/responsive/pillar-run-640.webp`
- `og-sports/site/assets/responsive/practice-start-1080.webp`
- `og-sports/site/assets/responsive/practice-start-1600.webp`
- `og-sports/site/assets/responsive/practice-start-2400.webp`
- `og-sports/site/assets/responsive/practice-start-2880.webp`
- `og-sports/site/assets/responsive/practice-start-640.webp`
- `og-sports/site/assets/responsive/run-night-1080.webp`
- `og-sports/site/assets/responsive/run-night-1600.webp`
- `og-sports/site/assets/responsive/run-night-2400.webp`
- `og-sports/site/assets/responsive/run-night-2880.webp`
- `og-sports/site/assets/responsive/run-night-640.webp`
- `og-sports/site/assets/responsive/run-night-mobile-1080.webp`
- `og-sports/site/assets/responsive/run-night-mobile-1280.webp`
- `og-sports/site/assets/responsive/run-night-mobile-1600.webp`
- `og-sports/site/assets/responsive/run-night-mobile-640.webp`
- `og-sports/site/assets/responsive/run-shadow-1080.webp`
- `og-sports/site/assets/responsive/run-shadow-1600.webp`
- `og-sports/site/assets/responsive/run-shadow-2400.webp`
- `og-sports/site/assets/responsive/run-shadow-2880.webp`
- `og-sports/site/assets/responsive/run-shadow-640.webp`
- `og-sports/site/assets/responsive/track-night-1080.webp`
- `og-sports/site/assets/responsive/track-night-1600.webp`
- `og-sports/site/assets/responsive/track-night-2400.webp`
- `og-sports/site/assets/responsive/track-night-2880.webp`
- `og-sports/site/assets/responsive/track-night-640.webp`
- `og-sports/site/assets/responsive/wienerwald-ride-1080.webp`
- `og-sports/site/assets/responsive/wienerwald-ride-1600.webp`
- `og-sports/site/assets/responsive/wienerwald-ride-2400.webp`
- `og-sports/site/assets/responsive/wienerwald-ride-2880.webp`
- `og-sports/site/assets/responsive/wienerwald-ride-640.webp`
- `og-sports/site/index.html`
- `og-sports/site/script.js`
- `og-sports/site/styles.css`
- `og-sports/tests/site.test.mjs`
