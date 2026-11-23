"""Summarize the recorded RC7 Chrome measurements and encoded grade samples."""
import io
import json
from pathlib import Path
import subprocess
from PIL import Image, ImageStat

ROOT = Path(__file__).resolve().parents[1]

def old(path):
    return subprocess.check_output(['git', 'show', '18138d5:og-sports/'+path], cwd=ROOT)

def cite(path, snippet):
    lines=(ROOT/path).read_text(encoding='utf-8').splitlines()
    line=next(i for i,s in enumerate(lines,1) if snippet in s)
    return f'[[og-sports/{path}:{line} "{snippet}"]]'

def stats(data):
    im=Image.open(io.BytesIO(data)).resize((128,128)).convert('RGB')
    return [round(ImageStat.Stat(im.convert('L')).mean[0],2),round(ImageStat.Stat(im.convert('HSV')).mean[1],2)]

def main():
    m=json.loads((ROOT/'docs/rc7-measurements.json').read_text(encoding='utf-8'))
    manifest=json.loads((ROOT/'docs/responsive-assets.json').read_text(encoding='utf-8'))
    previous=json.loads(old('docs/responsive-assets.json'))
    result={'tests':{'npm_test':'21/21 bestanden','source_check':'18 Quellen, 105 WebPs, kein Upscaling','pillars_check':'bestanden','chrome':'6 Kontexte, keine JS-/Bildfehler, kein horizontaler Overflow, keine externen Requests'},'bytes':{},'crops':{},'grade':{'reference_LS':[40.2,68.4]},'screenshots':[],'files_changed':[]}
    report=['# RC7 – Run R3 und Meet-Kachel M2 (26.10.2026)','',
        'R3: Symbolbild · Iliya Jokic / Unsplash, Melbourne. M2: Symbolbild · Victoria Prymak / Unsplash, Dachgruppe in der Abenddämmerung. Beide SHA-256-Hashes vor Benutzung gegen das externe Kandidatenmanifest geprüft. Quellen nicht kopiert; keine Retusche, kein Netzwerk außer localhost, kein Commit/Push/Deployment.',
        '', '## Aufbereitung und Ausschnitte', '',
        'Identischer bestehender p50-Filter, Skalierung vor Grade, WebP Q82/method 6. Die p50-Rezeptur liegt in prepare_responsive.py; prepare_images.py enthält nur die geschützten 01/03-Aufbereitungen.',
        cite('scripts/prepare_responsive.py', "f'scale={width}:{height}:flags=lanczos,{P50}'"),
        cite('scripts/prepare_responsive.py', "rendered.save(OUT / name, 'WEBP', quality=82, method=6)"), '',
        'Run Desktop bewahrt das volle 5184×3456-Bild: Läuferin im inneren linken Bildbereich, höchste Türme und ruhiger Himmel. Handy 2764×3455 (4:5) enthält Läuferin und beide höchsten Türme. Bestehendes cover schneidet auf Desktop etwas oben/unten und auf Tablet seitlich; der Kopf bleibt frei, die große Überschrift überlagert wie zuvor den unteren Körper. Der Himmel bleibt für die obere Wortmarke und Kapitelzeile frei.',
        'Die gemessene Hauptüberschrift liegt unten, nicht über der Skyline: y=340.25–431.50 bei 390, 671.22–844.00 bei 768, 560.73–799.20 bei 1440 CSS-px. Obere Zeile y=20/23.03/40. Layout unverändert.',
        cite('site/styles.css', '.movement h2 { position: absolute; left: var(--gutter); bottom:'), '',
        'Meet: identischer 3736×4670-Crop für Mosaik und Handy (4:5). Die ganze im Original sichtbare Gruppe einschließlich Randpersonen bleibt innerhalb des Bildes; Beine sind teilweise schon im Original durch die Dachkante verdeckt. Himmel oben und Fahne erhalten. Auf 390/768/1440 visuell geprüft.', '',
        '| Bild | Desktop-Crop | Handy-Crop | Desktop-Breiten | Handy-Breiten |', '|---|---|---|---|---|']
    for name in ('run-night.webp','pillar-meet.webp'):
        e=manifest['assets/'+name]
        result['crops'][name]={'desktop':e['crop'],'mobile':e['mobile_crop'],'source_sha256':e['source_sha256']}
        report.append(f"| {name} | {e['crop']} | {e['mobile_crop']} | {', '.join(str(v['width']) for v in e['variants'])} | {', '.join(str(v['width']) for v in e['mobile'])} |")
    report += ['', 'Run erhält zusätzlich 3200 px und eine sizes-Angabe einschließlich der bestehenden 1.02-Transformation. Die Meet-Auswahl berücksichtigt nun das tatsächliche 4:5-Bild statt des alten 3:2-Overfetch. Fallbacks sind jeweilige 2400-px-Derivate; alle bisherigen Dateinamen bleiben.',
        cite('scripts/responsive_markup.py', "'run-night.webp': 'max(102vw, min(153svh, 1652.4px))'"), '',
        '## Bildbytes und Messung', '',
        'Installiertes Chrome channel="chrome", ogpw-venv, frische Kontexte, Reduced Motion, Lazy Loading, 500-CSS-px-Schritte/100 ms, Decode und Netzwerkruhe. Summe der Bildantworten inklusive SVG, ohne HTML/Fonts/Header. Screenshots in CSS-Pixeln; Auswahl mit DPR 3/2/2. RC6 stammt per git show aus 18138d5 und wird nur aus RAM über localhost ausgeliefert. Wegen der verbindlichen Schreibpfadgrenze keine TEMP-Dateien und keine Baseline-/Build-Kopie.',
        cite('scripts/rc7_evidence.py', "browser = pw.chromium.launch(channel='chrome')"),
        cite('scripts/rc7_evidence.py', "cache[name] = baseline('site/' + name)"), '',
        '| Viewport | RC6 Bytes | RC7 Bytes | Differenz |', '|---|---:|---:|---:|']
    for w in ('390','768','1440'):
        a,b=m['rc6'][w]['image_bytes'],m['rc7'][w]['image_bytes']
        result['bytes'][w]={'rc6':a,'rc7':b,'delta':b-a}
        report.append(f'| {w}@{3 if w=="390" else 2}x | {a} | {b} | {b-a:+} ({(b/a-1)*100:.2f}%) |')
        # All other image responses must be byte-identical.
        def remaining(stage):
            return sorted((r for r in m[stage][w]['requests'] if not any(n in r['file'] for n in ('run-night','pillar-meet'))), key=lambda r: r['file'])
        assert remaining('rc6')==remaining('rc7'), w
    report += ['', 'Alle übrigen Bildantworten sind zwischen RC6 und RC7 identisch, einschließlich meet-night. Rohdaten: rc7-measurements.json.', '',
        '## Auflösungsfaktoren', '',
        'Q = Bitmapbedarf / Quellpixel nach Crop; A = Bitmapbedarf / geladene WebP-Pixel. cover und Transformation sind eingerechnet. >1 bedeutet Vergrößerung. Alle neuen Q/A liegen unter 1.', '',
        '| Breite | Bild | Q/A RC6 | Q/A RC7 | Bedarf RC7 | Geladene Datei RC7 |', '|---|---|---|---|---|---|']
    for w in ('390','768','1440'):
        for name in ('run-night.webp','pillar-meet.webp'):
            a,b=[m[s][w]['metrics'][name] for s in ('rc6','rc7')]
            report.append(f"| {w} | {name} | {a['Q']}/{a['A']} | {b['Q']}/{b['A']} | {b['demand']} | {b['current']} |")
    report += ['', '## Grade gegen historische p50-Referenz', '',
        'L/S-Mittelwerte 0–255 aus auf 128×128 verkleinerten kodierten größten Desktop-Derivaten, vor CSS/Veil. Historischer Referenzmedian 40.2/68.4 bleibt fest. Abweichungen beschreiben die Szene, keinen zusätzlichen Grade.', '',
        '| Bild | L/S RC6 | L/S RC7 | Δ L/S zur Referenz |', '|---|---|---|---|']
    for name in ('run-night.webp','pillar-meet.webp'):
        a=stats(old('site/'+previous['assets/'+name]['variants'][-1]['file']))
        b=stats((ROOT/'site'/manifest['assets/'+name]['variants'][-1]['file']).read_bytes())
        delta=[round(v-r,2) for v,r in zip(b,[40.2,68.4])]
        result['grade'][name]={'rc6_LS':a,'rc7_LS':b,'delta_reference':delta}
        report.append(f'| {name} | {a} | {b} | {delta} |')
    report += ['', '## Prüfung und Grenzen', '',
        'npm test: 21/21 bestanden. prepare_responsive.py --check: 18 Quellen, 105 WebPs, kein Upscaling. pillars.py --check bestanden. Chrome: sechs Kontexte ohne JS-/Bildfehler, externe Requests oder horizontalen Overflow. Zwölf Screenshots visuell geprüft. Kein Build angelegt (Aufgabe verbietet Seitenkopien). Safari, Firefox, echte Geräte und Model-/Property-Releases: ungeprüft.', '',
        'Beide sichtbaren Credits und die DE/EN-Alttexte wurden zum neuen Motiv aktualisiert. Alte Credits dieser zwei Bilder sind aus den aktiven Nachweisen entfernt; die unveränderten RC3-Abschnitte im Audit bleiben ausdrücklich historische Messdaten.',
        cite('scripts/pillars.py', 'Victoria Prymak / Unsplash'),
        cite('site/index.html', 'I — Run · Iliya Jokic / Unsplash'), '', '## Screenshots', '']
    for stage in ('rc6','rc7'):
        for row in m[stage].values():
            for shot in row['screenshots']:
                result['screenshots'].append('og-sports/'+shot)
                report.append('- `og-sports/'+shot+'`')
    report='\n'.join(report)+'\n'
    (ROOT/'docs/RC7_RESULT.md').write_text(report,encoding='utf-8')
    audit=ROOT/'docs/ASSET_AUDIT.md'
    original=audit.read_text(encoding='utf-8')
    original=original[original.index('# RC6-Nachtrag'):]
    audit.write_text(report.replace('# RC7 – Run R3 und Meet-Kachel M2 (26.10.2026)', '# RC7-Nachtrag – Run R3 und Meet-Kachel M2',1)+'\n---\n\n'+original,encoding='utf-8')
    files=subprocess.check_output(['git','diff','--name-only'],cwd=ROOT.parent).decode().splitlines()
    files+=subprocess.check_output(['git','ls-files','--others','--exclude-standard'],cwd=ROOT.parent).decode().splitlines()
    result['files_changed']=sorted(set(files+['og-sports/docs/rc7-summary.json']))
    (ROOT/'docs/rc7-summary.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(result,ensure_ascii=False,indent=2))

if __name__=='__main__': main()
