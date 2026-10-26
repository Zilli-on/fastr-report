# RC3 Bild-Inventur — schwächste zuerst

Stand: 2026-10-26. Lokal gerendert und visuell geprüft; keine Aussage über ein Deployment.

## Messverfahren

Chromium, leere Browserkontexte, 390×844 @3x und 1440×900 @2x. Vollständig in 500-CSS-px-Schritten gescrollt; Netzwerk-Summe aller Bildantworten (inklusive SVG, ohne Schriften/HTML/HTTP-Header). Keine Dialoge geöffnet. 768×900 @2x zusätzlich fotografiert. Screenshots in CSS-Pixeln, Bildauswahl mit echtem DPR.

Pro Bild zählt die größte Verwendung auf der Hauptseite. „Sichtbar“ = CSS-Bildbox × DPR inklusive vorhandener Transformation; „Bitmapbedarf“ berücksichtigt object-fit:cover und ist deshalb bei beschnittenen Bildern größer. Faktor Q = Bitmapbedarf / echte Quellpixel nach Crop; Faktor A = Bitmapbedarf / tatsächlich geladene Asset-Pixel. >1 bedeutet Vergrößerung; Interpolation rekonstruiert keine Details. Bei contain wird der tatsächlich eingepasste Bildbereich gemessen.

Grade-Probe: Mittelwerte L (Grauwert) / S (HSV-Sättigung), 0–255, aus auf 128×128 verkleinerten kodierten Dateien, vor CSS-Filtern/Veil. Gemeinsame p50-Referenz = Median der neun p50-Fotos: 40.2/68.4. ΔL/ΔS zeigt grobe Szenenabweichung, nicht automatisch einen falschen Grade. 00–03 und Produktbilder werden ausdrücklich nicht auf p50 umgegradet. Grain und WebP können geringe Messabweichungen verursachen.

Quell-Pixel nennen den verfügbaren Master. Bei 01/03 ist das der freigegebene retuschierte Master, nicht ein behauptetes Kameraoriginal. Quelldateien/Hashes, Crop-Koordinaten und alle Derivate: `responsive-assets.json`. Lizenzen sind Herkunftsangaben des vorhandenen Pools; keine neue Model-Release-Prüfung.

## Gewicht und Evidenz

| Breite / DPR | Vorher, Bytes | Nachher, Bytes | Änderung |
|---|---:|---:|---:|
| 390 / 3x | 2,799,104 | 2,447,102 | -12.6% |
| 768 / 2x | 2,799,104 | 2,534,674 | -9.4% |
| 1440 / 2x | 2,799,104 | 4,092,280 | +46.2% |

Evidenz: `C:\Users\Fabien\AppData\Local\Temp\og-rc3-evidence/before/` und `C:\Users\Fabien\AppData\Local\Temp\og-rc3-evidence/after/`; je 33 Kapitel-Screenshots plus `measurements.json`. Dateinamen: `<390|768|1440>-<Kapitel>.png`. Kapitel: 00-opening, 01-03-strip, manifest, temple, I-run, II-practice, III-wear, IV-meet, V-make, way-in, signature.

## Entscheidungen

- Eigene Handy-Quellausschnitte nur für I Run und IV Meet, jeweils 4:5 bei maximal 767 px. Meet nutzt die ganze 4000×5000-Quelle, Run einen 5068×6335-Ausschnitt um die zentrale Silhouette. Desktop-Ausschnitte unverändert.
- 00–03 behalten Motiv, CSS-Ausschnitt und Grade. 00 liefert maximal 1373×485 statt der früheren 4×-Interpolation. Die niedrige Originalauflösung bleibt sichtbar und wird nicht als verbessert ausgegeben.
- Alle fünf Tempelkacheln unter 768 px einspaltig 4:5; ab 768 px bisheriges Mosaik (768–899: 1+2+2, ab 900: 2+3). Schatten und Herkunftslabels bleiben.
- STICK-JPEGs und Shop-Originale bleiben hash-identisch. Nur die Hoodie-Auslieferung erhält zusätzliche WebPs aus den Original-JPEGs.

## Einzelbilder

### after-the-run.webp — schwach

- Kapitel: 00 Opening. Nur 1373×485 echte Quellpixel; sehr starke Retina-Vergrößerung. Emotional geschützt, keine erfundene Schärfe.
- Quelle: OG SPORTS / bestehende KI-Bildstudie, keine Fotolizenz.
- Quell-Pixel: 1373×485. Quelle: `site/assets/after-the-run.webp`.
- Gesicht/Motiv angeschnitten (390 / 1440): ja / ja: Randpersonen; geschützter CSS-Ausschnitt.
- Grade: L/S 111.6/30.9; Δ zur p50-Referenz +71.3/-37.5; Δ zur bisherigen Datei +0.1/+2.6.

| Viewport | Sichtbar, Geräte-Pixel | Bitmapbedarf, Pixel | Geladene Datei | Faktor Q / A |
|---|---:|---:|---|---:|
| 1440 @2x | 2880×1800 | 5096×1800 | after-the-run-1373.webp | 3.71 / 3.71 |
| 390 @3x | 1170×2532 | 7168×2532 | after-the-run-1373.webp | 5.22 / 5.22 |

- Original/Fallback: 41,820 Bytes. Derivate: after-the-run-640.webp: 14,436 B; after-the-run-1080.webp: 23,876 B; after-the-run-1373.webp: 32,484 B

### stick-exploded.jpg — schwach

- Kapitel: V Make / Aufbau. 472×708 begrenzt die technischen Details deutlich; Original darf nicht neu kodiert werden.
- Quelle: FASTR / fastr30.com, bestehende Produktvisualisierung; Fotograf/gesonderte Lizenz im Bestand nicht benannt.
- Quell-Pixel: 472×708. Quelle: `unverändertes Shop-JPEG in site/assets`.
- Gesicht/Motiv angeschnitten (390 / 1440): nein / nein.
- Grade: L/S 21.9/18.6; Δ zur p50-Referenz -18.4/-49.8; Δ zur bisherigen Datei +0.0/+0.0.

| Viewport | Sichtbar, Geräte-Pixel | Bitmapbedarf, Pixel | Geladene Datei | Faktor Q / A |
|---|---:|---:|---|---:|
| 1440 @2x | 498×747 | 498×747 | stick-exploded.jpg | 1.05 / 1.05 |
| 390 @3x | 1050×1575 | 1050×1575 | stick-exploded.jpg | 2.22 / 2.22 |

- Original/Fallback: 41,989 Bytes. Derivate: keine (unverändert).

### merch-05-lavender.jpg — schwach

- Kapitel: Tempel III + III Wear. 660×825 reicht für die kleine Produktreihe, aber nicht für die große Retina-Tempelkachel.
- Quelle: FASTR / fastr30.com, bestehende Produktvisualisierung; Fotograf/gesonderte Lizenz im Bestand nicht benannt.
- Quell-Pixel: 660×825. Quelle: `site/assets/merch-05-lavender.jpg`.
- Gesicht/Motiv angeschnitten (390 / 1440): nein / nein.
- Grade: L/S 120.7/36.5; Δ zur p50-Referenz +80.4/-31.8; Δ zur bisherigen Datei +0.1/-0.5.

| Viewport | Sichtbar, Geräte-Pixel | Bitmapbedarf, Pixel | Geladene Datei | Faktor Q / A |
|---|---:|---:|---|---:|
| 1440 @2x | 891×1113 | 891×1113 | merch-05-lavender-660.webp | 1.35 / 1.35 |
| 390 @3x | 1050×1312 | 1050×1312 | merch-05-lavender-660.webp | 1.59 / 1.59 |

- Original/Fallback: 46,967 Bytes. Derivate: merch-05-lavender-320.webp: 7,800 B; merch-05-lavender-640.webp: 19,018 B; merch-05-lavender-660.webp: 20,354 B

### stick-lime.jpg — ok

- Kapitel: Tempel V + V Make. Klares Produktmotiv, aber 880×1100 begrenzt die große Darstellung; Original unverändert.
- Quelle: FASTR / fastr30.com, bestehende Produktvisualisierung; Fotograf/gesonderte Lizenz im Bestand nicht benannt.
- Quell-Pixel: 880×1100. Quelle: `unverändertes Shop-JPEG in site/assets`.
- Gesicht/Motiv angeschnitten (390 / 1440): nein / nein.
- Grade: L/S 27.9/28.0; Δ zur p50-Referenz -12.4/-40.4; Δ zur bisherigen Datei +0.0/+0.0.

| Viewport | Sichtbar, Geräte-Pixel | Bitmapbedarf, Pixel | Geladene Datei | Faktor Q / A |
|---|---:|---:|---|---:|
| 1440 @2x | 1319×1649 | 1319×1649 | stick-lime.jpg | 1.50 / 1.50 |
| 390 @3x | 1050×1312 | 1050×1312 | stick-lime.jpg | 1.19 / 1.19 |

- Original/Fallback: 63,841 Bytes. Derivate: keine (unverändert).

### frame-03-people.webp — ok

- Kapitel: 03 People. Lebendiger Moment; Randpersonen angeschnitten. Geschützter Ausschnitt und bestehende Retusche bleiben.
- Quelle: Leviosa Hou / Unsplash License / 9ZXnEV7k2lI; vorhandener KI-retuschierter PNG-Master.
- Quell-Pixel: 2688×1520. Quelle: `scripts/sources/community-ai.png`.
- Gesicht/Motiv angeschnitten (390 / 1440): ja / ja: Randpersonen, zentrale Gesichter erhalten.
- Grade: L/S 105.1/105.2; Δ zur p50-Referenz +64.9/+36.9; Δ zur bisherigen Datei +0.0/-0.0.

| Viewport | Sichtbar, Geräte-Pixel | Bitmapbedarf, Pixel | Geladene Datei | Faktor Q / A |
|---|---:|---:|---|---:|
| 1440 @2x | 1076×1188 | 2101×1188 | frame-03-people-2400.webp | 0.78 / 0.88 |
| 390 @3x | 1170×994 | 1759×994 | frame-03-people-2400.webp | 0.65 / 0.73 |

- Original/Fallback: 244,996 Bytes. Derivate: frame-03-people-640.webp: 45,958 B; frame-03-people-1080.webp: 91,050 B; frame-03-people-1600.webp: 147,506 B; frame-03-people-2400.webp: 244,996 B; frame-03-people-2688.webp: 281,266 B

### meet-night.webp — ok

- Kapitel: IV Meet. 4:5 zeigt wieder die drei Hauptpersonen, sehr dunkle Kleidung bleibt wenig differenziert. Desktop behält seinen bisherigen engeren Ausschnitt.
- Quelle: liathyrax / Pexels License (https://www.pexels.com/license/) / https://www.pexels.com/photo/group-of-men-running-on-track-at-night-35005203/.
- Quell-Pixel: 4000×5000. Quelle: `C:\Users\Fabien\og-sports-sources\v4-candidates\web\pexels_35005203.jpg`.
- Gesicht/Motiv angeschnitten (390 / 1440): ja / ja: Randläufer; Hauptgruppe vollständig im Handybild.
- Grade: L/S 6.8/111.2; Δ zur p50-Referenz -33.5/+42.9; Δ zur bisherigen Datei -0.0/-1.3.

| Viewport | Sichtbar, Geräte-Pixel | Bitmapbedarf, Pixel | Geladene Datei | Faktor Q / A |
|---|---:|---:|---|---:|
| 1440 @2x | 2938×1689 | 3003×1689 | meet-night-2880.webp | 0.75 / 1.04 |
| 390 @3x | 1170×1462 | 1170×1462 | meet-night-mobile-1280.webp | 0.29 / 0.91 |

- Original/Fallback: 51,430 Bytes. Derivate: meet-night-640.webp: 8,662 B; meet-night-1080.webp: 15,978 B; meet-night-1600.webp: 26,694 B; meet-night-2400.webp: 51,430 B; meet-night-2880.webp: 76,596 B; meet-night-mobile-640.webp: 27,312 B; meet-night-mobile-1080.webp: 64,642 B; meet-night-mobile-1280.webp: 85,410 B; meet-night-mobile-1600.webp: 126,628 B

### pillar-meet.webp — ok

- Kapitel: Tempel IV. Gutes Gegenlicht, zentrale Personen sichtbar; Hochformat kann nicht die ganze breite Gruppe zeigen.
- Quelle: Gabin Vallet / Unsplash License (https://unsplash.com/license) / https://unsplash.com/photos/J154nEkpzlQ.
- Quell-Pixel: 5377×3585. Quelle: `C:\Users\Fabien\og-sports-sources\v4-candidates\web\unsplash_J154nEkpzlQ.jpg`.
- Gesicht/Motiv angeschnitten (390 / 1440): ja / ja: äußere Gruppenmitglieder.
- Grade: L/S 101.5/56.3; Δ zur p50-Referenz +61.2/-12.1; Δ zur bisherigen Datei +0.1/+0.4.

| Viewport | Sichtbar, Geräte-Pixel | Bitmapbedarf, Pixel | Geladene Datei | Faktor Q / A |
|---|---:|---:|---|---:|
| 1440 @2x | 891×1113 | 1670×1113 | pillar-meet-2400.webp | 0.31 / 0.70 |
| 390 @3x | 1050×1312 | 1969×1312 | pillar-meet-2400.webp | 0.37 / 0.82 |

- Original/Fallback: 246,560 Bytes. Derivate: pillar-meet-640.webp: 70,312 B; pillar-meet-1080.webp: 179,718 B; pillar-meet-1600.webp: 353,456 B; pillar-meet-2400.webp: 725,114 B; pillar-meet-2880.webp: 987,080 B

### run-night.webp — ok

- Kapitel: I Run. Absichtliche Bewegungsunschärfe, keine fehlende Pixelauflösung. Handy zeigt die zentrale Figur mit Kopf und Schritt.
- Quelle: Hansheng Zhao / Unsplash License (https://unsplash.com/license) / https://unsplash.com/photos/9FcKpisH7Bo.
- Quell-Pixel: 9520×6336. Quelle: `C:\Users\Fabien\og-sports-sources\v4-candidates\web\unsplash_9FcKpisH7Bo.jpg`.
- Gesicht/Motiv angeschnitten (390 / 1440): ja / ja: Nebenläufer; zentrale Silhouette erhalten.
- Grade: L/S 32.7/47.7; Δ zur p50-Referenz -7.6/-20.6; Δ zur bisherigen Datei -0.1/+4.6.

| Viewport | Sichtbar, Geräte-Pixel | Bitmapbedarf, Pixel | Geladene Datei | Faktor Q / A |
|---|---:|---:|---|---:|
| 1440 @2x | 2938×1836 | 2938×1955 | run-night-2880.webp | 0.31 / 1.02 |
| 390 @3x | 1170×1462 | 1170×1462 | run-night-mobile-1280.webp | 0.23 / 0.91 |

- Original/Fallback: 71,498 Bytes. Derivate: run-night-640.webp: 12,492 B; run-night-1080.webp: 24,840 B; run-night-1600.webp: 42,086 B; run-night-2400.webp: 71,450 B; run-night-2880.webp: 90,808 B; run-night-mobile-640.webp: 15,686 B; run-night-mobile-1080.webp: 31,464 B; run-night-mobile-1280.webp: 38,588 B; run-night-mobile-1600.webp: 53,264 B

### pillar-run.webp — ok

- Kapitel: Tempel I. Starke Bewegung, bewusst unscharf; mehr Pixel erzeugen keine eingefrorenen Details.
- Quelle: Nick Gosset / Unsplash License (https://unsplash.com/license) / https://unsplash.com/photos/3DJfakd6VoU.
- Quell-Pixel: 4000×6000. Quelle: `C:\Users\Fabien\og-sports-sources\v4-candidates\web\unsplash_3DJfakd6VoU.jpg`.
- Gesicht/Motiv angeschnitten (390 / 1440): ja / ja: Unterkörper außerhalb des Kachelausschnitts.
- Grade: L/S 88.4/40.6; Δ zur p50-Referenz +48.2/-27.8; Δ zur bisherigen Datei -0.1/+0.7.

| Viewport | Sichtbar, Geräte-Pixel | Bitmapbedarf, Pixel | Geladene Datei | Faktor Q / A |
|---|---:|---:|---|---:|
| 1440 @2x | 1339×1004 | 1339×2009 | pillar-run-1600.webp | 0.33 / 0.84 |
| 390 @3x | 1050×1312 | 1050×1575 | pillar-run-1080.webp | 0.26 / 0.97 |

- Original/Fallback: 39,570 Bytes. Derivate: pillar-run-640.webp: 13,856 B; pillar-run-1080.webp: 27,498 B; pillar-run-1600.webp: 48,556 B; pillar-run-2400.webp: 91,760 B; pillar-run-2880.webp: 121,336 B

### track-night.webp — ok

- Kapitel: Eingang. Ruhiger Abschluss, aber keine Menschen trotz Community-Überschrift; Desktop bleibt Panorama.
- Quelle: Mikhail K / Unsplash License (https://unsplash.com/license) / https://unsplash.com/photos/jsNI0bh5D-o.
- Quell-Pixel: 3695×2356. Quelle: `C:\Users\Fabien\og-sports-sources\v4-candidates\web\unsplash_jsNI0bh5D-o.jpg`.
- Gesicht/Motiv angeschnitten (390 / 1440): nein / ja: Flutlicht oben angeschnitten.
- Grade: L/S 40.2/114.4; Δ zur p50-Referenz +0.0/+46.1; Δ zur bisherigen Datei +0.2/-2.5.

| Viewport | Sichtbar, Geräte-Pixel | Bitmapbedarf, Pixel | Geladene Datei | Faktor Q / A |
|---|---:|---:|---|---:|
| 1440 @2x | 2880×1234 | 2880×1836 | track-night-2880.webp | 0.78 / 1.00 |
| 390 @3x | 1170×731 | 1170×746 | track-night-1600.webp | 0.32 / 0.73 |

- Original/Fallback: 527,198 Bytes. Derivate: track-night-640.webp: 32,544 B; track-night-1080.webp: 115,770 B; track-night-1600.webp: 305,968 B; track-night-2400.webp: 813,502 B; track-night-2880.webp: 1,243,038 B

### merch-01-black.jpg — ok

- Kapitel: III Wear. Kleine Produktreihe: 660×825 genügt hier; eigenständige Shop-Farbwelt, kein p50-Fotograde.
- Quelle: FASTR / fastr30.com, bestehende Produktvisualisierung; Fotograf/gesonderte Lizenz im Bestand nicht benannt.
- Quell-Pixel: 660×825. Quelle: `site/assets/merch-01-black.jpg`.
- Gesicht/Motiv angeschnitten (390 / 1440): nein / nein.
- Grade: L/S 28.3/15.3; Δ zur p50-Referenz -11.9/-53.0; Δ zur bisherigen Datei +0.1/+2.1.

| Viewport | Sichtbar, Geräte-Pixel | Bitmapbedarf, Pixel | Geladene Datei | Faktor Q / A |
|---|---:|---:|---|---:|
| 1440 @2x | 475×594 | 475×594 | merch-01-black-640.webp | 0.72 / 0.74 |
| 390 @3x | 580×726 | 580×726 | merch-01-black-640.webp | 0.88 / 0.91 |

- Original/Fallback: 40,265 Bytes. Derivate: merch-01-black-320.webp: 6,812 B; merch-01-black-640.webp: 15,176 B; merch-01-black-660.webp: 15,796 B

### merch-02-cherry-red.jpg — ok

- Kapitel: III Wear. Kleine Produktreihe: 660×825 genügt hier; eigenständige Shop-Farbwelt, kein p50-Fotograde.
- Quelle: FASTR / fastr30.com, bestehende Produktvisualisierung; Fotograf/gesonderte Lizenz im Bestand nicht benannt.
- Quell-Pixel: 660×825. Quelle: `site/assets/merch-02-cherry-red.jpg`.
- Gesicht/Motiv angeschnitten (390 / 1440): nein / nein.
- Grade: L/S 60.0/127.3; Δ zur p50-Referenz +19.8/+59.0; Δ zur bisherigen Datei +0.0/-0.6.

| Viewport | Sichtbar, Geräte-Pixel | Bitmapbedarf, Pixel | Geladene Datei | Faktor Q / A |
|---|---:|---:|---|---:|
| 1440 @2x | 475×594 | 475×594 | merch-02-cherry-red-640.webp | 0.72 / 0.74 |
| 390 @3x | 580×726 | 580×726 | merch-02-cherry-red-640.webp | 0.88 / 0.91 |

- Original/Fallback: 53,962 Bytes. Derivate: merch-02-cherry-red-320.webp: 10,482 B; merch-02-cherry-red-640.webp: 22,886 B; merch-02-cherry-red-660.webp: 24,030 B

### merch-03-cobalt-blue.jpg — ok

- Kapitel: III Wear. Kleine Produktreihe: 660×825 genügt hier; eigenständige Shop-Farbwelt, kein p50-Fotograde.
- Quelle: FASTR / fastr30.com, bestehende Produktvisualisierung; Fotograf/gesonderte Lizenz im Bestand nicht benannt.
- Quell-Pixel: 660×825. Quelle: `site/assets/merch-03-cobalt-blue.jpg`.
- Gesicht/Motiv angeschnitten (390 / 1440): nein / nein.
- Grade: L/S 62.7/126.5; Δ zur p50-Referenz +22.5/+58.2; Δ zur bisherigen Datei +0.0/-0.7.

| Viewport | Sichtbar, Geräte-Pixel | Bitmapbedarf, Pixel | Geladene Datei | Faktor Q / A |
|---|---:|---:|---|---:|
| 1440 @2x | 475×594 | 475×594 | merch-03-cobalt-blue-640.webp | 0.72 / 0.74 |
| 390 @3x | 580×726 | 580×726 | merch-03-cobalt-blue-640.webp | 0.88 / 0.91 |

- Original/Fallback: 54,063 Bytes. Derivate: merch-03-cobalt-blue-320.webp: 10,606 B; merch-03-cobalt-blue-640.webp: 23,228 B; merch-03-cobalt-blue-660.webp: 24,454 B

### merch-04-emerald-green.jpg — ok

- Kapitel: III Wear. Kleine Produktreihe: 660×825 genügt hier; eigenständige Shop-Farbwelt, kein p50-Fotograde.
- Quelle: FASTR / fastr30.com, bestehende Produktvisualisierung; Fotograf/gesonderte Lizenz im Bestand nicht benannt.
- Quell-Pixel: 660×825. Quelle: `site/assets/merch-04-emerald-green.jpg`.
- Gesicht/Motiv angeschnitten (390 / 1440): nein / nein.
- Grade: L/S 55.7/115.6; Δ zur p50-Referenz +15.4/+47.2; Δ zur bisherigen Datei +0.0/-0.0.

| Viewport | Sichtbar, Geräte-Pixel | Bitmapbedarf, Pixel | Geladene Datei | Faktor Q / A |
|---|---:|---:|---|---:|
| 1440 @2x | 475×594 | 475×594 | merch-04-emerald-green-640.webp | 0.72 / 0.74 |
| 390 @3x | 580×726 | 580×726 | merch-04-emerald-green-640.webp | 0.88 / 0.91 |

- Original/Fallback: 48,570 Bytes. Derivate: merch-04-emerald-green-320.webp: 8,962 B; merch-04-emerald-green-640.webp: 19,832 B; merch-04-emerald-green-660.webp: 20,624 B

### merch-06-butter-yellow.jpg — ok

- Kapitel: III Wear. Kleine Produktreihe: 660×825 genügt hier; eigenständige Shop-Farbwelt, kein p50-Fotograde.
- Quelle: FASTR / fastr30.com, bestehende Produktvisualisierung; Fotograf/gesonderte Lizenz im Bestand nicht benannt.
- Quell-Pixel: 660×825. Quelle: `site/assets/merch-06-butter-yellow.jpg`.
- Gesicht/Motiv angeschnitten (390 / 1440): nein / nein.
- Grade: L/S 137.3/35.8; Δ zur p50-Referenz +97.0/-32.5; Δ zur bisherigen Datei +0.1/-0.6.

| Viewport | Sichtbar, Geräte-Pixel | Bitmapbedarf, Pixel | Geladene Datei | Faktor Q / A |
|---|---:|---:|---|---:|
| 1440 @2x | 475×594 | 475×594 | merch-06-butter-yellow-640.webp | 0.72 / 0.74 |
| 390 @3x | 580×726 | 580×726 | merch-06-butter-yellow-640.webp | 0.88 / 0.91 |

- Original/Fallback: 49,103 Bytes. Derivate: merch-06-butter-yellow-320.webp: 9,118 B; merch-06-butter-yellow-640.webp: 21,528 B; merch-06-butter-yellow-660.webp: 22,842 B

### frame-01-detail.webp — stark

- Kapitel: 01 Detail. Prägnantes Detail und ruhiger Kontrast; retuschierter Master hat nur 1200×1800, genügt hier weitgehend.
- Quelle: David Moorhouse / Unsplash License / GToHUINXOb4; retuschierter PNG-Master.
- Quell-Pixel: 1200×1800. Quelle: `scripts/sources/run-detail-clean.png`.
- Gesicht/Motiv angeschnitten (390 / 1440): nein / nein: Schuh vollständig, bewusstes Körperdetail.
- Grade: L/S 29.0/0.0; Δ zur p50-Referenz -11.2/-68.4; Δ zur bisherigen Datei +0.0/+0.0.

| Viewport | Sichtbar, Geräte-Pixel | Bitmapbedarf, Pixel | Geladene Datei | Faktor Q / A |
|---|---:|---:|---|---:|
| 1440 @2x | 717×1188 | 792×1188 | frame-01-detail-1080.webp | 0.66 / 0.73 |
| 390 @3x | 1170×1462 | 1170×1755 | frame-01-detail-1200.webp | 0.97 / 0.97 |

- Original/Fallback: 44,478 Bytes. Derivate: frame-01-detail-640.webp: 12,622 B; frame-01-detail-1080.webp: 32,878 B; frame-01-detail-1200.webp: 42,234 B

### run-shadow.webp — stark

- Kapitel: 02 Motion. Grafischer Bewegungsmoment; neu aus der 7008×4672-Quelldatei, gleicher Bildinhalt und CSS-Ausschnitt.
- Quelle: Mathias Reding / Unsplash License / G96xGokbTUM; heruntergeladene Original-JPEG.
- Quell-Pixel: 7008×4672. Quelle: `scripts/sources/run-shadow.jpg`.
- Gesicht/Motiv angeschnitten (390 / 1440): nein / nein: Beine und Schatten als Detailmotiv.
- Grade: L/S 73.5/0.0; Δ zur p50-Referenz +33.3/-68.4; Δ zur bisherigen Datei -0.0/+0.0.

| Viewport | Sichtbar, Geräte-Pixel | Bitmapbedarf, Pixel | Geladene Datei | Faktor Q / A |
|---|---:|---:|---|---:|
| 1440 @2x | 1076×1188 | 1782×1188 | run-shadow-2400.webp | 0.25 / 0.74 |
| 390 @3x | 1170×878 | 1316×878 | run-shadow-1600.webp | 0.19 / 0.82 |

- Original/Fallback: 217,624 Bytes. Derivate: run-shadow-640.webp: 15,492 B; run-shadow-1080.webp: 69,034 B; run-shadow-1600.webp: 187,706 B; run-shadow-2400.webp: 391,804 B; run-shadow-2880.webp: 532,864 B

### photo-ritual.webp — stark

- Kapitel: Manifest. Klarer stiller Moment; bestehender 4:5-Quellausschnitt passt auf beiden Breiten.
- Quelle: Ulf Meyer / Unsplash License (https://unsplash.com/license) / https://unsplash.com/photos/cS0W4GvUUDM.
- Quell-Pixel: 6000×4000. Quelle: `C:\Users\Fabien\og-sports-sources\v4-candidates\web\unsplash_cS0W4GvUUDM.jpg`.
- Gesicht/Motiv angeschnitten (390 / 1440): nein / nein.
- Grade: L/S 26.1/66.7; Δ zur p50-Referenz -14.1/-1.7; Δ zur bisherigen Datei +0.0/+0.1.

| Viewport | Sichtbar, Geräte-Pixel | Bitmapbedarf, Pixel | Geladene Datei | Faktor Q / A |
|---|---:|---:|---|---:|
| 1440 @2x | 1092×1364 | 1092×1364 | photo-ritual-1600.webp | 0.34 / 0.68 |
| 390 @3x | 1050×1312 | 1050×1312 | photo-ritual-1080.webp | 0.33 / 0.97 |

- Original/Fallback: 198,532 Bytes. Derivate: photo-ritual-640.webp: 40,808 B; photo-ritual-1080.webp: 98,274 B; photo-ritual-1600.webp: 198,532 B; photo-ritual-2400.webp: 402,632 B; photo-ritual-2880.webp: 538,810 B

### pillar-practice.webp — stark

- Kapitel: Tempel II. Zentrale Figur und Treppenrichtung sind eindeutig; ausreichend Quellauflösung.
- Quelle: Red John / Unsplash License (https://unsplash.com/license) / https://unsplash.com/photos/mZixsK8OnmE.
- Quell-Pixel: 5304×7952. Quelle: `C:\Users\Fabien\og-sports-sources\v4-candidates\web\unsplash_mZixsK8OnmE.jpg`.
- Gesicht/Motiv angeschnitten (390 / 1440): nein / nein.
- Grade: L/S 15.4/68.4; Δ zur p50-Referenz -24.8/+0.0; Δ zur bisherigen Datei +0.0/+0.8.

| Viewport | Sichtbar, Geräte-Pixel | Bitmapbedarf, Pixel | Geladene Datei | Faktor Q / A |
|---|---:|---:|---|---:|
| 1440 @2x | 1339×1004 | 1339×2008 | pillar-practice-1600.webp | 0.25 / 0.84 |
| 390 @3x | 1050×1312 | 1050×1574 | pillar-practice-1080.webp | 0.20 / 0.97 |

- Original/Fallback: 89,208 Bytes. Derivate: pillar-practice-640.webp: 28,478 B; pillar-practice-1080.webp: 61,382 B; pillar-practice-1600.webp: 106,162 B; pillar-practice-2400.webp: 185,222 B; pillar-practice-2880.webp: 245,752 B

### practice-start.webp — stark

- Kapitel: II Practice. Hand und Bahntextur bleiben lesbar; gute materielle Nähe.
- Quelle: Thomas Ronveaux / Pexels License (https://www.pexels.com/license/) / https://www.pexels.com/photo/a-close-up-shot-of-an-athlete-on-a-race-track-13159243/.
- Quell-Pixel: 3451×5176. Quelle: `C:\Users\Fabien\og-sports-sources\v4-candidates\web\pexels_13159243.jpg`.
- Gesicht/Motiv angeschnitten (390 / 1440): nein / nein: Hand als bewusstes Detailmotiv.
- Grade: L/S 41.6/132.1; Δ zur p50-Referenz +1.4/+63.7; Δ zur bisherigen Datei -0.1/+0.7.

| Viewport | Sichtbar, Geräte-Pixel | Bitmapbedarf, Pixel | Geladene Datei | Faktor Q / A |
|---|---:|---:|---|---:|
| 1440 @2x | 1092×1364 | 1092×1637 | practice-start-1600.webp | 0.32 / 0.68 |
| 390 @3x | 1050×1312 | 1050×1575 | practice-start-1080.webp | 0.30 / 0.97 |

- Original/Fallback: 194,054 Bytes. Derivate: practice-start-640.webp: 58,576 B; practice-start-1080.webp: 130,410 B; practice-start-1600.webp: 243,750 B; practice-start-2400.webp: 661,352 B; practice-start-2880.webp: 952,196 B

### wienerwald-ride.webp — stark

- Kapitel: III Wienerwald. Zwei kleine, vollständige Radfahrer im Nebel; das Motiv passt bereits in 4:5.
- Quelle: Greg Rosenke / Unsplash License (https://unsplash.com/license) / https://unsplash.com/photos/lf3g1p-7FP8.
- Quell-Pixel: 3561×4451. Quelle: `C:\Users\Fabien\og-sports-sources\v4-candidates\web\unsplash_lf3g1p-7FP8.jpg`.
- Gesicht/Motiv angeschnitten (390 / 1440): nein / nein.
- Grade: L/S 57.2/103.1; Δ zur p50-Referenz +17.0/+34.7; Δ zur bisherigen Datei -0.0/+0.3.

| Viewport | Sichtbar, Geräte-Pixel | Bitmapbedarf, Pixel | Geladene Datei | Faktor Q / A |
|---|---:|---:|---|---:|
| 1440 @2x | 864×1080 | 864×1080 | wienerwald-ride-1600.webp | 0.24 / 0.54 |
| 390 @3x | 1050×1312 | 1050×1312 | wienerwald-ride-1080.webp | 0.29 / 0.97 |

- Original/Fallback: 245,900 Bytes. Derivate: wienerwald-ride-640.webp: 86,750 B; wienerwald-ride-1080.webp: 207,952 B; wienerwald-ride-1600.webp: 398,476 B; wienerwald-ride-2400.webp: 752,250 B; wienerwald-ride-2880.webp: 1,002,060 B

## Reproduktion und Grenzen

`prepare_responsive.py` benötigt nur vorhandenes Pillow, OpenCV/numpy und ffmpeg. `responsive_markup.py` aktualisiert die Bildattribute; `pillars.py --check` prüft die generierten Kacheln. Geschützte Retuschiermaster liegen in `scripts/sources`, v4-Originale im genannten Pool. Keine KI-Erzeugung und kein neues Paket.

02 Originaldownload: https://images.unsplash.com/photo-1758506971683-c080e6f16ce9?fm=jpg&q=100 ; Fotograf/Lizenz bestätigt auf https://unsplash.com/photos/runners-legs-in-motion-with-a-long-shadow-G96xGokbTUM .

Safari, Firefox und echte Geräte: ungeprüft. Die Suite nutzt Chromium; Screenshots belegen Layout und Ausschnitt, keine vollständige WCAG-Prüfung. Das absichtlich unscharfe Run-Material wird durch mehr Pixel nicht detailreicher.
