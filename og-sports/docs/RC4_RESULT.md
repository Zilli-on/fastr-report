# RC4 — Ergebnis, 2026-10-26

Wienerwald wurde aus Wear, Dialogtexten, aktuellen Assetregistern und Bildpipelines entfernt. Originalbild und fünf responsive Varianten wurden gelöscht. Wear bei 390 und 1440 px visuell geprüft; Hoodie-Originale unverändert. Die Regression schützt die Entfernung. [[og-sports/tests/stick.test.mjs:75 "retired cycling chapter and all its asset variants stay removed"]]

`photo_sources.json` wurde geprüft und enthielt keinen Eintrag dieses Motivs; die Datei bleibt unverändert. Historische Art-Direction-Dokumente bleiben als Historie erhalten.

## Modell und Bundle

| Bestandteil | Bytes roh | Bytes gzip |
|---|---:|---:|
| stick.glb | 428320 | 228828 |
| three.js inkl. benötigter Module | 837336 | 202505 |
| stick-viewer.js | 12089 | 4203 |
| nachgeladener 3D-Code + GLB gesamt | 1277745 | 435536 |

gzip: Level 9, einzeln komprimierte Dateien summiert, ohne Lizenzdatei. Der lokale Server liefert unkomprimiert. Vorhandene Wortmarke und Fallbackbild sind nicht in der 3D-Summe enthalten; ihre tatsächlichen Requests zählen in den Gesamtmessungen unten mit.

Eine GLB aus den fünf bereitgestellten Montage-STLs, ohne Quell-STLs im Repository. Blender-Dezimierung; 16-Bit-Positionen und 8-Bit-Normalen mit KHR_mesh_quantization. Die Grenze beträgt 600000 Bytes. [[og-sports/scripts/build_stick_model.py:112 "if len(glb) > 600_000:"]]

Mit Python 3.12 als Launcher und Blender 4.5.10 LTS zweimal erzeugt, gleicher SHA-256: `e98271bb1b5f1274e5153dd2f4843c5772eb2a4914bc0ce9c77f44ae31235ab0`. Quell-Hashes, Bounds und Dreiecksanzahlen stehen in `stick-model.json`. Der dort angegebene Quantisierungsfehler ist keine Aussage über den gesamten Dezimierungsfehler.

`body.svg` ist eine technische Drahtgitterzeichnung, keine Verpackungstextur. Der Viewer nutzt die originalen Konturen der vorhandenen OG-FASTR-Wortmarke als Aufdruck. [[og-sports/site/stick-viewer.js:105 "ink.drawImage(logo, -330, -61, 660, 122);"]]

three.js ist auf 0.170.0 festgelegt und selbst gehostet: Core, GLTFLoader, dessen BufferGeometryUtils-Abhängigkeit und RoomEnvironment, vollständige MIT-Lizenz. Upstream-URLs und Hashes: `three-vendor.json`. [Offizielle r170-Quelle](https://raw.githubusercontent.com/mrdoob/three.js/r170/examples/jsm/loaders/GLTFLoader.js).

## Steuerung

- Lazy-Import 500 px vor dem Kapitel; initiales Reduced Motion lädt keine 3D-Module. [[og-sports/site/script.js:419 "rootMargin: '500px 0px'"]]
- Der normalisierte Scrollweg des Sticky-Abschnitts steuert die montierte Drehung, Explosion von 23–45 %, Halten bis 58 %, Zusammenbau bis 74 %, Kappe auf ab 75 %, Vorschub ab 83 %. [[og-sports/site/stick-viewer.js:155 "const explosion = ease(.23, .45, progress) * (1 - ease(.58, .74, progress));"]]
- Phase 3 dreht Fuß und Spindel; Hubteller und Spindel bewegen sich nach oben. Die Schnittansicht macht das Innere sichtbar. Inszenierte Prinzipdarstellung, keine physikalische oder kollisionsgeprüfte Simulation. [[og-sports/site/stick-viewer.js:173 "parts.Spindel.position.y += lift * .006;"]] [[og-sports/site/stick-viewer.js:174 "parts.Hubteller.position.y += lift * .075;"]]
- DOM-Texte, fünf Bauteilnamen, Phasenbuttons und Shop-Link bleiben außerhalb der Canvas. Drag, Touch-Drehung, Pfeiltasten und Home; vertikales Touch-Scrollen bleibt frei. [[og-sports/site/styles.css:312 "touch-action: pan-y pinch-zoom;"]]
- DPR maximal 2; Environment, Key-/Fill-Light und weiche VSM-Schatten. Nur angeforderte Frames bei sichtbarem Kapitel, kein permanenter Renderloop. [[og-sports/site/stick-viewer.js:46 "renderer.setPixelRatio(Math.min(devicePixelRatio, 2));"]] [[og-sports/site/stick-viewer.js:143 "if (!frame && visible && !document.hidden && !dead && !reduced.matches)"]]
- Reduced Motion, fehlendes WebGL, Modul-/Modellfehler und Kontextverlust zeigen wieder das vorhandene STICK-Bild. [[og-sports/site/stick-viewer.js:37 "chapter.dataset.viewer = 'fallback';"]]

## Gates

```text
npm run check: 20 tests, 20 pass, 0 fail
Build: 124 files
site: 8 cases passed, 20 screenshots
artefacts: 2 cases passed, 16 screenshots
rc4_evidence.py: passed; errors: []
git diff --check: exit 0
```

Test-/Buildlog: `docs/rc4-check.log`. Browserberichte und Ressourcenlisten liegen unter `C:/Users/Fabien/AppData/Local/Temp/og-rc4-evidence/`: `visual-site.json`, `visual-artefacts.json`, `rc4-measurements.json`.

Zusatzprüfungen: kein vorzeitiger 3D-Download, drei Phasen, fünf Labels, DPR-Limit, Drag, Tastatur, CDP-Touch samt vertikalem Scrollen, Phasenbuttons, DE/EN, kein Rendering im Stillstand oder außerhalb des Viewports, initiales/umgeschaltetes Reduced Motion, fehlendes WebGL, Modell-/Modulfehler, Kontextverlust.

## Geladene Bytes bis Make bereitsteht

Leerer Chromium-Kontext, schrittweises Scrollen vom Seitenanfang, anschließend Viewer-Bereitschaft und networkidle abgewartet. Navigation und alle bis dahin geladenen Ressourcen, keine geöffneten Dialoge. transferSize enthält Chromium-protokollierten Header-Overhead, keine TLS-/Transportmessung.

| Viewport / DPR | Antwortkörper, Bytes | transferSize, Bytes |
|---|---:|---:|
| 390 / 3 | 3756745 | 3768145 |
| 1440 / 2 | 5211399 | 5222799 |

## Screenshots

Alle drei Phasen und Reduced Motion wurden bei beiden Breiten aufgenommen und visuell geprüft:

- `C:/Users/Fabien/AppData/Local/Temp/og-rc4-evidence/390-assembled.png`
- `C:/Users/Fabien/AppData/Local/Temp/og-rc4-evidence/390-exploded.png`
- `C:/Users/Fabien/AppData/Local/Temp/og-rc4-evidence/390-opened.png`
- `C:/Users/Fabien/AppData/Local/Temp/og-rc4-evidence/390-reduced-motion.png`
- `C:/Users/Fabien/AppData/Local/Temp/og-rc4-evidence/1440-assembled.png`
- `C:/Users/Fabien/AppData/Local/Temp/og-rc4-evidence/1440-exploded.png`
- `C:/Users/Fabien/AppData/Local/Temp/og-rc4-evidence/1440-opened.png`
- `C:/Users/Fabien/AppData/Local/Temp/og-rc4-evidence/1440-reduced-motion.png`

Zusätzlich geprüft: `site-apparel-390.png`, `site-apparel-1440.png` im selben Ordner.

## Reproduktion

Im Projektordner `og-sports/`:

```powershell
py -3.12 scripts/build_stick_model.py
$env:OG_BUILD_DIR='scripts/.rc4-dist'
npm run check
$env:OG_QA_DIR=Join-Path $env:TEMP 'og-rc4-evidence'
& "$env:LOCALAPPDATA\Temp\ogpw\Scripts\python" scripts/visual_review.py all
# Für die Zusatzprüfung site/ auf Port 4384 servieren:
$env:PORT='4384'
node scripts/serve.mjs
# In einem zweiten Terminal:
& "$env:LOCALAPPDATA\Temp\ogpw\Scripts\python" scripts/rc4_evidence.py
```

Der temporäre Build blieb im erlaubten scripts/-Pfad. Nach den Prüfungen wurden nur die anhand des Build-Manifests hashgeprüften Ausgabedateien entfernt. Kein Commit, Push, Deployment oder Installationsvorgang.

## Offene Punkte und Grenzen

- Safari, Firefox und echte Mobilgeräte: ungeprüft. Chromium verwendet hier Software-WebGL; keine Aussage über Hardware-Frameraten.
- Die Bewegung illustriert das Funktionsprinzip. Gewindesteigung, Kollisionsfreiheit, Passung, Dichtheit und Füllmenge sind nicht validiert.
- Die separate Hoodie-Überarbeitung bleibt außerhalb dieses Auftrags.

## Geänderte Dateien

- `og-sports/docs/ASSET_AUDIT.md`
- `og-sports/docs/PHOTO_CREDITS.md`
- `og-sports/docs/RC4_RESULT.md`
- `og-sports/docs/asset_manifest.json`
- `og-sports/docs/rc4-check.log`
- `og-sports/docs/responsive-assets.json`
- `og-sports/docs/stick-model.json`
- `og-sports/docs/three-vendor.json`
- `og-sports/scripts/build_stick_model.py`
- `og-sports/scripts/prepare_responsive.py`
- `og-sports/scripts/rc3_audit.py`
- `og-sports/scripts/rc4_evidence.py`
- `og-sports/scripts/responsive_markup.py`
- `og-sports/scripts/serve.mjs`
- `og-sports/scripts/vendor_three.py`
- `og-sports/scripts/visual_review.py`
- geloescht: `og-sports/site/assets/responsive/wienerwald-ride-1080.webp`
- geloescht: `og-sports/site/assets/responsive/wienerwald-ride-1600.webp`
- geloescht: `og-sports/site/assets/responsive/wienerwald-ride-2400.webp`
- geloescht: `og-sports/site/assets/responsive/wienerwald-ride-2880.webp`
- geloescht: `og-sports/site/assets/responsive/wienerwald-ride-640.webp`
- `og-sports/site/assets/stick.glb`
- geloescht: `og-sports/site/assets/wienerwald-ride.webp`
- `og-sports/site/index.html`
- `og-sports/site/script.js`
- `og-sports/site/stick-viewer.js`
- `og-sports/site/styles.css`
- `og-sports/site/vendor/three-r170/BufferGeometryUtils.js`
- `og-sports/site/vendor/three-r170/GLTFLoader.js`
- `og-sports/site/vendor/three-r170/LICENSE.txt`
- `og-sports/site/vendor/three-r170/RoomEnvironment.js`
- `og-sports/site/vendor/three-r170/three.module.min.js`
- `og-sports/tests/site.test.mjs`
- `og-sports/tests/stick.test.mjs`
