"""Source-based RC3 WebPs. No upscale, no STICK processing.

Run with the existing ogcv Python (Pillow, numpy, OpenCV) and ffmpeg on PATH:
  python scripts/prepare_responsive.py --pool C:/Users/Fabien/og-sports-sources/v4-candidates
Protected retouched masters and the downloaded original 02 live outside the public repo in
C:/Users/Fabien/og-sports-sources/masters (override with OG_MASTERS).
00 uses the verified RC6 retouched 6122x2160 AI-upscaled master.
The v4 p50 recipe and inpainting masks are preserved. No network calls.
"""
import os
import argparse
import hashlib
import io
import json
from pathlib import Path
import subprocess

import cv2
import numpy as np
from PIL import Image, ImageStat

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'site/assets'
OUT = ASSETS / 'responsive'
SOURCES = Path(os.environ.get('OG_MASTERS', 'C:/Users/Fabien/og-sports-sources/masters'))
HOODIES = Path(os.environ.get('OG_HOODIE_MASTERS', 'C:/Users/Fabien/og-sports-sources/higgsfield-hoodies/final'))
OPENING = Path('C:/Users/Fabien/og-sports-sources/opening-upscale/after-the-run-4k-retouched.png')
OPENING_SHA256 = 'a253cfcdacf2aa7fcd6e08caa3769b75fc78899bce0e106701cde1521b500d52'
OPENING_CROP = (2767, 0, 3765, 2160)
OPENING_ORIGIN = 'Existing AI campaign study (1373x485); Higgsfield ByteDance 4K upscale 2026-10-26; cap logo and glasses-temple lettering removed locally with og-sports-sources/opening-upscale/retouch.py. Same people and grade; no new image concept.'
P50 = 'eq=saturation=0.6:contrast=1.1:gamma=0.86:brightness=-0.015,colorbalance=rm=0.03:gm=0.01:bm=-0.03:rh=0.04:gh=0.02:bh=-0.04,noise=alls=4:allf=u'
RC7_POOL = Path('C:/Users/Fabien/og-sports-sources/rc7-candidates')
RC7 = {
    'run-night.webp': ('R3', (0, 0, 5184, 3456), (1100, 0, 3864, 3455)),
    'pillar-meet.webp': ('M2', (1715, 0, 5451, 4670), (1715, 0, 5451, 4670)),
}
RC8_POOL = Path('C:/Users/Fabien/og-sports-sources/rc8-candidates')
RC8 = {
    'pillar-run.webp': ('PR2', 'pillar-run/PR2_pexels_14532913.jpg',
        'a1242c9cea74b89fa4ad8d577397a8cca561fe406fa5c3ef79c7564fcd791a96',
        (0, 900, 5760, 8100), None),
    'meet-night.webp': ('MN1', 'meet-night/retouch/MN1_retouched.png',
        'e6e13fb793d3c5d00e8fb7b7ef91bfa837044448dc566e9e5f04ecbf5f9d2ca8',
        (0, 0, 6720, 3780), (928, 0, 4512, 4480)),
}
RC9_POOL = Path('C:/Users/Fabien/og-sports-sources/rc9-candidates')
RC9 = {
    # B&W night sprint; kept neutral black and white (no p50 tint), like strip 01-02.
    'run-crew.webp': ('RC1', 'run-crew/RC1_retouched.png',
        '5ec9adacd0e11ff21ed146e2e00be467db9caf7d4cc7f44bd87e43614dd2619a',
        None, (2900, 0, 7969, 6336)),
}
# Remaining desktop crops and masks match prepare_v4.py.
JOBS = {
    'photo-ritual.webp': ('unsplash_cS0W4GvUUDM.jpg', (2300, 0, 5500, 4000), None),
    'pillar-run.webp': (str(RC8_POOL / RC8['pillar-run.webp'][1]), RC8['pillar-run.webp'][3], RC8['pillar-run.webp'][4]),
    'pillar-practice.webp': ('unsplash_mZixsK8OnmE.jpg', None, None),
    'pillar-meet.webp': (str(RC7_POOL / 'pillar-meet/M2_unsplash_T8Lxr7LFN74.jpg'), RC7['pillar-meet.webp'][1], RC7['pillar-meet.webp'][2]),
    'practice-start.webp': ('pexels_13159243.jpg', None, None),
    # RC15: pillar II, lone runner at dusk (lucas Favre / Unsplash), 1:2 portrait for the five-column temple
    'pillar-dusk.webp': ('unsplash_JnoNcfFwrNA.jpg', (1408, 0, 2928, 3040), None),
    'meet-night.webp': (str(RC8_POOL / RC8['meet-night.webp'][1]), RC8['meet-night.webp'][3], RC8['meet-night.webp'][4]),
}

def retouch(im):
    img = cv2.cvtColor(np.array(im), cv2.COLOR_RGB2BGR)
    mask = np.zeros(img.shape[:2], np.uint8)
    mask[2360:2460, 1325:1655] = 255
    mask[2302:2356, 1622:1684] = 255
    sub = img[2000:3000, 900:2900].astype(int)
    b, g, r = sub[..., 0], sub[..., 1], sub[..., 2]
    mask[2000:3000, 900:2900][(r > g+35) & (r > b+35) & (r > 70)] = 255
    img = cv2.inpaint(img, cv2.dilate(mask, np.ones((5, 5), np.uint8)), 7, cv2.INPAINT_TELEA)
    return Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))

def variants(im, stem, grade=False, mobile=False, product=False):
    maximum = min(im.width, 1600 if mobile else 2880)
    steps = (480, 800, 1200, 1600) if product else ((640, 1080, 1280, 1600) if mobile else (640, 1080, 1600, 2400, 2880))
    if stem == 'after-the-run':
        maximum = min(im.width, 998 if mobile else 5120)
        steps = (480, 800, 998) if mobile else (960, 1440, 1920, 2560, 3840, 5120)
    if stem in ('run-crew', 'meet-night') and not mobile:
        maximum = min(im.width, 3200)
        steps = (*steps, 3200)
    widths = sorted({w for w in steps if w <= maximum} | {maximum})
    result = []
    for width in widths:
        height = round(im.height * width / im.width)
        if grade:
            # Match v4: scale first, then p50 + deterministic ffmpeg noise.
            buf = io.BytesIO()
            im.save(buf, format='PNG')
            data = subprocess.run(['ffmpeg', '-v', 'error', '-i', 'pipe:0', '-vf',
                f'scale={width}:{height}:flags=lanczos,{P50}', '-frames:v', '1',
                '-f', 'image2pipe', '-vcodec', 'png', 'pipe:1'], input=buf.getvalue(), capture_output=True, check=True).stdout
            rendered = Image.open(io.BytesIO(data)).convert('RGB')
        else:
            rendered = im.resize((width, height), Image.Resampling.LANCZOS)
        name = f'{stem}{"-mobile" if mobile else ""}-{width}.webp'
        rendered.save(OUT / name, 'WEBP', quality=82, method=6)
        result.append({'file': 'assets/responsive/' + name, 'width': width,
                       'height': height, 'bytes': (OUT / name).stat().st_size})
        if stem == 'after-the-run' or stem + '.webp' in RC8 or stem + '.webp' in RC9:
            result[-1]['sha256'] = hashlib.sha256((OUT / name).read_bytes()).hexdigest()
    return result

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--pool', type=Path, default=Path('C:/Users/Fabien/og-sports-sources/v4-candidates'))
    parser.add_argument('--only', nargs='+', help='Rebuild named assets, retaining other manifest entries')
    parser.add_argument('--check', action='store_true', help='Verify source hashes and real WebP dimensions without rebuilding')
    args = parser.parse_args()
    manifest_path = ROOT / 'docs/responsive-assets.json'
    if args.check:
        manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
        count = 0
        for src, entry in manifest.items():
            source = Path(entry['source'])
            if not source.is_absolute():
                source = ROOT / source
            assert hashlib.sha256(source.read_bytes()).hexdigest() == entry['source_sha256'], src
            for group in ('variants', 'mobile'):
                for v in entry.get(group, []):
                    file = ROOT / 'site' / v['file']
                    im = Image.open(file)
                    crop = entry['mobile_crop'] if group == 'mobile' else entry['crop']
                    w, h = (crop[2]-crop[0], crop[3]-crop[1]) if crop else entry['source_pixels']
                    assert im.size == (v['width'], v['height']), v['file']
                    assert im.width <= w and im.height <= h, v['file']
                    assert file.stat().st_size == v['bytes'], v['file']
                    if 'sha256' in v:
                        assert hashlib.sha256(file.read_bytes()).hexdigest() == v['sha256'], v['file']
                    count += 1
        print(f'Responsive sources verified: {len(manifest)} originals; {count} WebPs; no upscaling')
        return
    OUT.mkdir(exist_ok=True)
    manifest = json.loads(manifest_path.read_text(encoding='utf-8')) if args.only else {}
    protected = {'after-the-run.webp': OPENING,
                 # RC9: side logo + midsole print removed (og-sports-sources/rc9-candidates/shoe/composite.py)
                 'frame-01-detail.webp': SOURCES / 'run-detail-clean-rc9.png',
                 'run-shadow.webp': SOURCES / 'run-shadow.jpg',
                 'frame-03-people.webp': SOURCES / 'community-ai.png'}
    inputs = [(name, path, None, None, False) for name, path in protected.items()]
    inputs += [(name, args.pool / 'web' / src, crop, mobile, True) for name, (src, crop, mobile) in JOBS.items()]
    inputs += [(name, RC9_POOL / rel, crop, mobile, False) for name, (_, rel, _, crop, mobile) in RC9.items()]
    inputs += [(p.stem + '.webp', p, None, None, False) for p in sorted(HOODIES.glob('hoodie-*.png'))]
    for name, source, crop, mobile, grade in inputs:
        if args.only and name not in args.only:
            continue
        if name == 'after-the-run.webp':
            assert hashlib.sha256(source.read_bytes()).hexdigest() == OPENING_SHA256, 'RC6 source hash mismatch; abort'
            mobile = OPENING_CROP
        candidate = None
        if name in RC7:
            candidate_id, crop, mobile = RC7[name]
            candidates = json.loads((RC7_POOL / 'manifest.json').read_text(encoding='utf-8'))
            candidate = next(c for c in candidates['kandidaten'] if c['id'] == candidate_id)
            source = RC7_POOL / candidate['datei']
            assert hashlib.sha256(source.read_bytes()).hexdigest() == candidate['sha256'], 'RC7 source hash mismatch; abort'
        if name in RC8:
            candidate_id, relative, expected_hash, crop, mobile = RC8[name]
            source = RC8_POOL / relative
            assert hashlib.sha256(source.read_bytes()).hexdigest() == expected_hash, 'RC8 source hash mismatch; abort'
            candidates = json.loads((RC8_POOL / 'manifest.json').read_text(encoding='utf-8'))
            candidate = next(c for c in candidates['kandidaten'] if c['id'] == candidate_id)
        if name in RC9:
            candidate_id, _, expected_hash, _, _ = RC9[name]
            assert hashlib.sha256(source.read_bytes()).hexdigest() == expected_hash, 'RC9 source hash mismatch; abort'
            candidates = json.loads((RC9_POOL / 'manifest.json').read_text(encoding='utf-8'))
            candidate = next(c for c in candidates['kandidaten'] if c['id'] == candidate_id)
        im = Image.open(source).convert('RGB')
        if candidate:
            assert list(im.size) == candidate['px'], 'RC7 source dimensions mismatch'
        if name == 'after-the-run.webp':
            assert im.size == (6122, 2160), 'RC6 source dimensions mismatch'
        entry = {'source': source.relative_to(ROOT).as_posix() if source.is_relative_to(ROOT) else str(source), 'source_sha256': hashlib.sha256(source.read_bytes()).hexdigest(),
                 'source_pixels': list(im.size), 'crop': crop, 'mobile_crop': mobile,
                 'grade': 'p50 (v4)' if grade else 'preserved; CSS unchanged'}
        if candidate:
            entry.update(source_url=candidate['quelle_url'], photographer=candidate['fotograf'],
                         license=candidate['lizenz'], label='Symbolbild', candidate=candidate['id'])
        if name in RC9:
            entry.update(edit='bearbeitet: unlesbarer Shirt-Aufdruck weichgezeichnet (' + candidate['bearbeitung'] + ')',
                         original_source_sha256=candidate['sha256'],
                         original_source=str((RC9_POOL / candidate['datei']).resolve()))
        if name == 'meet-night.webp':
            entry.update(edit='bearbeitet: Aufdruck entfernt; bereitgestellter retuschierter Master',
                         original_source_sha256=candidate['sha256'],
                         original_source=str(RC8_POOL / candidate['datei']))
        desktop = im.crop(crop) if crop else im
        entry['crop_pixels'] = list(desktop.size)
        entry['variants'] = variants(desktop, Path(name).stem, grade, product=name.startswith('hoodie-'))
        if mobile:
            entry['mobile'] = variants(im.crop(mobile), Path(name).stem, grade, mobile=True)
        if name == 'after-the-run.webp':
            entry['provenance'] = OPENING_ORIGIN
            fallback = next(v for v in entry['variants'] if v['width'] == 1920)
            entry['fallback'] = dict(fallback, file='assets/' + name)
        # Compare encoded samples at identical small size: descriptive, not a quality score.
        def stats(image):
            image = image.resize((128,128)).convert('RGB')
            return [round(ImageStat.Stat(image.convert('L')).mean[0], 2),
                    round(ImageStat.Stat(image.convert('HSV')).mean[1], 2)]
        if (ASSETS / name).exists():
            entry['old_mean_luma_saturation'] = stats(Image.open(ASSETS / name))
        entry['mean_luma_saturation'] = stats(Image.open(ROOT / 'site' / entry['variants'][-1]['file']))
        if name == 'after-the-run.webp':
            (ASSETS / name).write_bytes((ROOT / 'site' / fallback['file']).read_bytes())
        if candidate:
            fallback = next(v for v in entry['variants'] if v['width'] == 2400)
            (ASSETS / name).write_bytes((ROOT / 'site' / fallback['file']).read_bytes())
            entry['fallback'] = dict(fallback, file='assets/' + name)
        # Hoodie fallbacks are actual 800px variants; do not ship duplicate masters.
        key = 'assets/responsive/' + Path(name).stem + '-800.webp' if name.startswith('hoodie-') else 'assets/' + name
        manifest[key] = entry
        print(name, len(entry['variants']), 'desktop variants', flush=True)
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')

if __name__ == '__main__':
    main()
