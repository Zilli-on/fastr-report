"""Build ASSET_AUDIT.md from actual browser geometry, sources and encoded files.
Run after rc3_evidence.py after with the existing ogcv Python.
Editorial crop judgements refer to the reviewed 390/1440 screenshots.
"""
import json
import os
from pathlib import Path
from statistics import median
from PIL import Image, ImageStat

ROOT = Path(__file__).resolve().parents[1]
EVIDENCE = Path(os.environ['TEMP']) / 'og-rc3-evidence'
# Rank (weakest first), chapter, crop 390 / 1440, verdict and reason.
REVIEW = {
 'after-the-run.webp': (0, '00 Opening', 'ja / ja: Randpersonen; geschützter CSS-Ausschnitt', 'schwach', 'Nur 1373×485 echte Quellpixel; sehr starke Retina-Vergrößerung. Emotional geschützt, keine erfundene Schärfe.'),
 'stick-exploded.jpg': (1, 'V Make / Aufbau', 'nein / nein', 'schwach', '472×708 begrenzt die technischen Details deutlich; Original darf nicht neu kodiert werden.'),
 'stick-lime.jpg': (3, 'Tempel V + V Make', 'nein / nein', 'ok', 'Klares Produktmotiv, aber 880×1100 begrenzt die große Darstellung; Original unverändert.'),
 'frame-03-people.webp': (4, '03 People', 'ja / ja: Randpersonen, zentrale Gesichter erhalten', 'ok', 'Lebendiger Moment; Randpersonen angeschnitten. Geschützter Ausschnitt und bestehende Retusche bleiben.'),
 'meet-night.webp': (5, 'IV Meet', 'ja / ja: Randläufer; Hauptgruppe vollständig im Handybild', 'ok', '4:5 zeigt wieder die drei Hauptpersonen, sehr dunkle Kleidung bleibt wenig differenziert. Desktop behält seinen bisherigen engeren Ausschnitt.'),
 'pillar-meet.webp': (6, 'Tempel IV', 'ja / ja: äußere Gruppenmitglieder', 'ok', 'Gutes Gegenlicht, zentrale Personen sichtbar; Hochformat kann nicht die ganze breite Gruppe zeigen.'),
 'run-night.webp': (7, 'I Run', 'ja / ja: Nebenläufer; zentrale Silhouette erhalten', 'ok', 'Absichtliche Bewegungsunschärfe, keine fehlende Pixelauflösung. Handy zeigt die zentrale Figur mit Kopf und Schritt.'),
 'pillar-run.webp': (8, 'Tempel I', 'ja / ja: Unterkörper außerhalb des Kachelausschnitts', 'ok', 'Starke Bewegung, bewusst unscharf; mehr Pixel erzeugen keine eingefrorenen Details.'),
 'track-night.webp': (9, 'Eingang', 'nein / ja: Flutlicht oben angeschnitten', 'ok', 'Ruhiger Abschluss, aber keine Menschen trotz Community-Überschrift; Desktop bleibt Panorama.'),
 'frame-01-detail.webp': (10, '01 Detail', 'nein / nein: Schuh vollständig, bewusstes Körperdetail', 'stark', 'Prägnantes Detail und ruhiger Kontrast; retuschierter Master hat nur 1200×1800, genügt hier weitgehend.'),
 'run-shadow.webp': (11, '02 Motion', 'nein / nein: Beine und Schatten als Detailmotiv', 'stark', 'Grafischer Bewegungsmoment; neu aus der 7008×4672-Quelldatei, gleicher Bildinhalt und CSS-Ausschnitt.'),
 'photo-ritual.webp': (12, 'Manifest', 'nein / nein', 'stark', 'Klarer stiller Moment; bestehender 4:5-Quellausschnitt passt auf beiden Breiten.'),
 'pillar-practice.webp': (13, 'Tempel II', 'nein / nein', 'stark', 'Zentrale Figur und Treppenrichtung sind eindeutig; ausreichend Quellauflösung.'),
 'practice-start.webp': (14, 'II Practice', 'nein / nein: Hand als bewusstes Detailmotiv', 'stark', 'Hand und Bahntextur bleiben lesbar; gute materielle Nähe.'),
}
# The retired shop hoodies are no longer inputs. RC5 owns their replacement audit.

def main():
    data = json.loads((ROOT/'docs/responsive-assets.json').read_text(encoding='utf-8'))
    before = json.loads((EVIDENCE/'before/measurements.json').read_text())
    after = json.loads((EVIDENCE/'after/measurements.json').read_text())
    pool = json.loads(Path('C:/Users/Fabien/og-sports-sources/v4-candidates/manifest.json').read_text(encoding='utf-8'))
    pool = {Path(p['file']).name:p for p in pool if p.get('file')}
    names = {'after-the-run.webp': 'OG SPORTS / bestehende KI-Bildstudie, keine Fotolizenz',
             'frame-01-detail.webp': 'David Moorhouse / Unsplash License / GToHUINXOb4; retuschierter PNG-Master',
             'run-shadow.webp': 'Mathias Reding / Unsplash License / G96xGokbTUM; heruntergeladene Original-JPEG',
             'frame-03-people.webp': 'Leviosa Hou / Unsplash License / 9ZXnEV7k2lI; vorhandener KI-retuschierter PNG-Master'}
    for src, entry in data.items():
        p = pool.get(Path(entry['source']).name)
        if p:
            names[Path(src).name] = f'{p["photographer"]} / {p["license"]} / {p["source_page"]}'
    p50 = [e['mean_luma_saturation'] for e in data.values() if e['grade'].startswith('p50')]
    ref = [median(v[i] for v in p50) for i in range(2)]
    lines = ['# RC3 Bild-Inventur — schwächste zuerst', '',
        'Stand: 2026-10-26. Lokal gerendert und visuell geprüft; keine Aussage über ein Deployment.', '',
        '## Messverfahren', '',
        'Chromium, leere Browserkontexte, 390×844 @3x und 1440×900 @2x. Vollständig in 500-CSS-px-Schritten gescrollt; Netzwerk-Summe aller Bildantworten (inklusive SVG, ohne Schriften/HTML/HTTP-Header). Keine Dialoge geöffnet. 768×900 @2x zusätzlich fotografiert. Screenshots in CSS-Pixeln, Bildauswahl mit echtem DPR.', '',
        'Pro Bild zählt die größte Verwendung auf der Hauptseite. „Sichtbar“ = CSS-Bildbox × DPR inklusive vorhandener Transformation; „Bitmapbedarf“ berücksichtigt object-fit:cover und ist deshalb bei beschnittenen Bildern größer. Faktor Q = Bitmapbedarf / echte Quellpixel nach Crop; Faktor A = Bitmapbedarf / tatsächlich geladene Asset-Pixel. >1 bedeutet Vergrößerung; Interpolation rekonstruiert keine Details. Bei contain wird der tatsächlich eingepasste Bildbereich gemessen.', '',
        f'Grade-Probe: Mittelwerte L (Grauwert) / S (HSV-Sättigung), 0–255, aus auf 128×128 verkleinerten kodierten Dateien, vor CSS-Filtern/Veil. Gemeinsame p50-Referenz = Median der neun p50-Fotos: {ref[0]:.1f}/{ref[1]:.1f}. ΔL/ΔS zeigt grobe Szenenabweichung, nicht automatisch einen falschen Grade. 00–03 und Produktbilder werden ausdrücklich nicht auf p50 umgegradet. Grain und WebP können geringe Messabweichungen verursachen.', '',
        'Quell-Pixel nennen den verfügbaren Master. Bei 01/03 ist das der freigegebene retuschierte Master, nicht ein behauptetes Kameraoriginal. Quelldateien/Hashes, Crop-Koordinaten und alle Derivate: `responsive-assets.json`. Lizenzen sind Herkunftsangaben des vorhandenen Pools; keine neue Model-Release-Prüfung.', '',
        '## Gewicht und Evidenz', '',
        '| Breite / DPR | Vorher, Bytes | Nachher, Bytes | Änderung |', '|---|---:|---:|---:|']
    for w in ('390','768','1440'):
        a,b=before[w]['image_bytes'],after[w]['image_bytes']
        lines.append(f'| {w} / {after[w]["dpr"]}x | {a:,} | {b:,} | {(b/a-1)*100:+.1f}% |')
    lines += ['', f'Evidenz: `{EVIDENCE}/before/` und `{EVIDENCE}/after/`; je 33 Kapitel-Screenshots plus `measurements.json`. Dateinamen: `<390|768|1440>-<Kapitel>.png`. Kapitel: 00-opening, 01-03-strip, manifest, temple, I-run, II-practice, III-wear, IV-meet, V-make, way-in, signature.', '',
              '## Entscheidungen', '',
              '- Eigene Handy-Quellausschnitte nur für I Run und IV Meet, jeweils 4:5 bei maximal 767 px. Meet nutzt die ganze 4000×5000-Quelle, Run einen 5068×6335-Ausschnitt um die zentrale Silhouette. Desktop-Ausschnitte unverändert.',
              '- 00–03 behalten Motiv, CSS-Ausschnitt und Grade. 00 liefert maximal 1373×485 statt der früheren 4×-Interpolation. Die niedrige Originalauflösung bleibt sichtbar und wird nicht als verbessert ausgegeben.',
              '- Alle fünf Tempelkacheln unter 768 px einspaltig 4:5; ab 768 px bisheriges Mosaik (768–899: 1+2+2, ab 900: 2+3). Schatten und Herkunftslabels bleiben.',
              '- STICK-JPEGs und Shop-Originale bleiben hash-identisch. Nur die Hoodie-Auslieferung erhält zusätzliche WebPs aus den Original-JPEGs.', '', '## Einzelbilder', '']
    for name in sorted(REVIEW, key=lambda n: ({'schwach':0, 'ok':1, 'stark':2}[REVIEW[n][3]], REVIEW[n][0])):
        rank, chapter, clipped, verdict, reason = REVIEW[name]
        src = 'assets/'+name
        entry = data.get(src)
        original = ROOT/'site'/src
        if entry:
            source_size = entry['source_pixels']
            l,s = entry['mean_luma_saturation']
            old = entry['old_mean_luma_saturation']
        else:
            im=Image.open(original)
            source_size=im.size
            im=im.resize((128,128)).convert('RGB')
            l=ImageStat.Stat(im.convert('L')).mean[0]; s=ImageStat.Stat(im.convert('HSV')).mean[1]
            old=(l,s)
        owner=names.get(name, 'FASTR / fastr30.com, bestehende Produktvisualisierung; Fotograf/gesonderte Lizenz im Bestand nicht benannt')
        lines += [f'### {name} — {verdict}', '', f'- Kapitel: {chapter}. {reason}', f'- Quelle: {owner}.',
                  f'- Quell-Pixel: {source_size[0]}×{source_size[1]}. Quelle: `{entry["source"] if entry else "unverändertes Shop-JPEG in site/assets"}`.',
                  f'- Gesicht/Motiv angeschnitten (390 / 1440): {clipped}.',
                  f'- Grade: L/S {l:.1f}/{s:.1f}; Δ zur p50-Referenz {l-ref[0]:+.1f}/{s-ref[1]:+.1f}; Δ zur bisherigen Datei {l-old[0]:+.1f}/{s-old[1]:+.1f}.', '',
                  '| Viewport | Sichtbar, Geräte-Pixel | Bitmapbedarf, Pixel | Geladene Datei | Faktor Q / A |', '|---|---:|---:|---|---:|']
        for width in ('1440','390'):
            occurrences = [i for i in after[width]['images'] if i['src']==src]
            rows=[]
            for i in occurrences:
                chosen=Image.open(ROOT/'site/assets'/('responsive/' if entry else '')/i['current'])
                dpr=after[width]['dpr']; w=i['width']*dpr; h=i['height']*dpr
                scale=(min if i['fit']=='contain' else max)(w/chosen.width,h/chosen.height)
                bw,bh=chosen.width*scale,chosen.height*scale
                crop = entry.get('mobile_crop') if entry and '-mobile-' in i['current'] else (entry.get('crop') if entry else None)
                sw,sh=(crop[2]-crop[0],crop[3]-crop[1]) if crop else source_size
                rows.append((max(bw/sw,bh/sh),scale,w,h,bw,bh,i['current']))
            q,a,w,h,bw,bh,current=max(rows)
            lines.append(f'| {width} @{after[width]["dpr"]}x | {w:.0f}×{h:.0f} | {bw:.0f}×{bh:.0f} | {current} | {q:.2f} / {a:.2f} |')
        variants = (entry['variants']+entry.get('mobile',[])) if entry else []
        lines += ['', f'- Original/Fallback: {original.stat().st_size:,} Bytes. Derivate: '+('; '.join(f'{Path(v["file"]).name}: {v["bytes"]:,} B' for v in variants) if variants else 'keine (unverändert).'), '']
    lines += ['## Reproduktion und Grenzen', '',
              '`prepare_responsive.py` benötigt nur vorhandenes Pillow, OpenCV/numpy und ffmpeg. `responsive_markup.py` aktualisiert die Bildattribute; `pillars.py --check` prüft die generierten Kacheln. Geschützte Retuschiermaster liegen in `scripts/sources`, v4-Originale im genannten Pool. Keine KI-Erzeugung und kein neues Paket.', '',
              '02 Originaldownload: https://images.unsplash.com/photo-1758506971683-c080e6f16ce9?fm=jpg&q=100 ; Fotograf/Lizenz bestätigt auf https://unsplash.com/photos/runners-legs-in-motion-with-a-long-shadow-G96xGokbTUM .', '',
              'Safari, Firefox und echte Geräte: ungeprüft. Die Suite nutzt Chromium; Screenshots belegen Layout und Ausschnitt, keine vollständige WCAG-Prüfung. Das absichtlich unscharfe Run-Material wird durch mehr Pixel nicht detailreicher.']
    (ROOT/'docs/ASSET_AUDIT.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')
    print('ASSET_AUDIT.md:',len(REVIEW),'images, weakest first')

if __name__=='__main__':
    main()
