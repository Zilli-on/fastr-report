# RC6 – Opening 00 (26.10.2026)

Der vorherige RC6-Lauf wurde laut Übergabe wegen externer Schreibpfade abgebrochen.
Dieser Lauf verwendet ausschließlich den bereitgestellten, vor Benutzung geprüften
Master (SHA-256 `a253cfcdacf2aa7fcd6e08caa3769b75fc78899bce0e106701cde1521b500d52`).
Bestehende KI-Studie 1373×485 → Higgsfield/ByteDance 4K am 26.10.2026 →
6122×2160; Kappen-Logo und Brillenbügel-Schrift laut Übergabe lokal retuschiert
(`og-sports-sources/opening-upscale/retouch.py`, Skript ungeprüft).
Quelle nur gelesen, nicht kopiert; kein Netzwerk außer localhost, kein Commit/Push/Deployment.

Desktop 960/1440/1920/2560/3840/5120, Handy 480/800/998; WebP Q82/method 6.
Fallback 1920×677, 67734 Bytes (vorher 41820). Alte 640/1080/1373-Varianten entfernt.
[[og-sports/scripts/prepare_responsive.py:59 "maximum = min(im.width, 998 if mobile else 5120)"]]
[[og-sports/scripts/prepare_responsive.py:76 "rendered.save(OUT / name, 'WEBP', quality=82, method=6)"]]

## Messung

Installiertes Chrome via Playwright `channel="chrome"`, frische Kontexte,
Reduced Motion, normales Lazy Loading; 500-CSS-px-Scrollschritte/100 ms,
anschließend Decode und Netzwerkruhe. Summe aller Bildantworten inklusive SVG,
ohne HTML, Fonts oder HTTP-Header; keine Dialoge/Farbwechsel. Nur localhost erlaubt.
RC5 stammt bytegenau aus `git show 45f9759:og-sports/site/...`.
Screenshots in CSS-Pixeln, Bildauswahl mit DPR 3/2/2, wie im historischen Audit.
[[og-sports/scripts/rc6_evidence.py:35 "browser = pw.chromium.launch(channel='chrome')"]]
[[og-sports/scripts/rc6_evidence.py:56 "y += 500"]]

| Viewport/DPR | RC5 Bildbytes | RC6 Bildbytes | Differenz |
|---|---:|---:|---:|
| 390@3x | 2127397 | 2150495 | +23098 |
| 768@2x | 2123241 | 2342153 | +218912 |
| 1440@2x | 3723563 | 3942475 | +218912 |

| Viewport/DPR | Q/A RC5 | Q/A RC6 | Bedarf RC6 | Datei RC6 |
|---|---:|---:|---|---|
| 390@3x | 5.2206 / 5.2206 | 1.1723 / 1.1723 | 1170.0×2532.26 | after-the-run-mobile-998.webp |
| 768@2x | 3.7113 / 3.7113 | 0.8333 / 0.9967 | 5101.67×1800.0 | after-the-run-5120.webp |
| 1440@2x | 3.7113 / 3.7113 | 0.8333 / 0.9967 | 5101.67×1800.0 | after-the-run-5120.webp |

Q bezieht sich in RC6 auf die Pixel des gelieferten AI-Upscale-Masters nach Crop;
A auf die geladene WebP. Kein Nachweis wiedergewonnener Originaldetails.
Die ursprüngliche KI-Studie bleibt inhaltlich eine 1373×485-Quelle.
Hero-Antwort allein: 32484 → 55582 Bytes auf Handy; 32484 → 251396 auf Tablet/Desktop.
Alle übrigen Bildantworten sind zwischen RC5 und RC6 identisch.

## Handy-Ausschnitt

Bei 390×844 beträgt die Bildbox 390×844 CSS-px. `object-fit:cover` und
`object-position:54% 50%` ergeben für den Master den Maßstab s=844/2160.
Sichtbare Quellbreite=390/s=998.104265; x=(6122−998.104265)×0.54=2766.903697;
y=0. Auf ganze Masterpixel gerundet: [2767,0,3765,2160], also 998×2160.
Mobile sizes=max(100vw,46.2037svh) bildet die Crop-Breite bei cover ab;
die bisherigen Desktop-sizes=max(100vw,283.1svh) bleiben erhalten.
Bei 390@3x reicht die Quelle nur für Q≈1.1723; die Datei wird nicht hochskaliert.
Bei 1440@2x ergibt das neue Masterverhältnis 5101.67×1800 statt der historischen
5095.67×1800. Die minimale Verhältnisabweichung stammt aus dem gelieferten Master
(6122/2160 gegenüber 1373/485), nicht aus einer Layoutänderung.
[[og-sports/site/styles.css:134 "object-fit: cover; object-position: 50% 50%;"]]
[[og-sports/site/styles.css:505 "object-position: 54% 50%;"]]
[[og-sports/scripts/prepare_responsive.py:29 "OPENING_CROP = (2767, 0, 3765, 2160)"]]
[[og-sports/site/index.html:35 "sizes="max(100vw, 46.2037svh)""]]

## Darstellung und Tests

Sechs Screenshots visuell verglichen: gleiche Personen und Komposition, deutlich
schärfere Auslieferung; Retusche wie angeliefert. Geometrie, CSS-Filter, eager/high
und DE/EN-Alttexte erhalten. Das in RC5 nur im Alttext vorhandene Label wurde
zusätzlich sichtbar und zweisprachig in der bestehenden Caption ergänzt.
[[og-sports/site/index.html:35 "fetchpriority="high""]]
[[og-sports/site/index.html:42 "data-de="KI-Kampagnenstudie" data-en="AI campaign study""]]

| Prüfung | Ergebnis |
|---|---|
| npm run check (enthält npm test) | 21/21 bestanden; Build 136 Dateien |
| prepare_responsive.py --check | 18 Quellen, 100 WebPs; kein Upscaling |
| Chrome-Messung RC5/RC6 | 6/6; keine JS-Fehler, externen Requests oder Bildfehler |
| git diff --check | bestanden |

Tests nur für autorisierte Bilddaten geändert: Fallback-Hash auf RC6 aktualisiert,
Opening-Crop und Mastergröße explizit geprüft; Crop-Schutz für 01–03 bleibt.
[[og-sports/tests/site.test.mjs:47 "assert.deepEqual(manifest['assets/'+src].mobile_crop, [2767, 0, 3765, 2160]);"]]

## Restpunkt

Der bestehende Bilddialog behauptet weiterhin „unverändertes Original mit 1.373 × 485 px“.
`site/script.js` ist ausdrücklich außerhalb der erlaubten Schreibpfade; deshalb
hier unverändert und als veraltete Angabe dokumentiert. Safari, Firefox und echte Geräte: ungeprüft.
[[og-sports/site/script.js:253 "Hier das unveränderte Original mit 1.373 × 485 px."]]

## Belege

Rohdaten: `rc6-rc5-measurements.json`, `rc6-rc6-measurements.json`.

- `og-sports/qa/rc6-rc5-390.png`
- `og-sports/qa/rc6-rc5-768.png`
- `og-sports/qa/rc6-rc5-1440.png`
- `og-sports/qa/rc6-rc6-390.png`
- `og-sports/qa/rc6-rc6-768.png`
- `og-sports/qa/rc6-rc6-1440.png`

Temporäre Vergleichsdateien in `qa/rc6-baseline/` und Build in `scripts/.rc6-build/` verbleiben lokal: Die automatische Freigabeprüfung hat die rekursive Bereinigung mit „blocked by policy“ abgelehnt. Keine weitergehende Begründung wurde ausgegeben.
