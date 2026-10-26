"""Source-based RC3 WebPs. No upscale, no STICK processing.

Run with the existing ogcv Python (Pillow, numpy, OpenCV) and ffmpeg on PATH:
  python scripts/prepare_responsive.py --pool C:/Users/Fabien/og-sports-sources/v4-candidates
Protected retouched masters and the downloaded original 02 live outside the public repo in
C:/Users/Fabien/og-sports-sources/masters (override with OG_MASTERS).
00 uses the original 1373x485 study, never the interpolated display copy.
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
P50 = 'eq=saturation=0.6:contrast=1.1:gamma=0.86:brightness=-0.015,colorbalance=rm=0.03:gm=0.01:bm=-0.03:rh=0.04:gh=0.02:bh=-0.04,noise=alls=4:allf=u'
# Same desktop crop and masks as prepare_v4.py. Mobile uses source coordinates.
JOBS = {
    'photo-ritual.webp': ('unsplash_cS0W4GvUUDM.jpg', (2300, 0, 5500, 4000), None),
    'run-night.webp': ('unsplash_9FcKpisH7Bo.jpg', None, (2600, 0, 7668, 6335)),
    'pillar-run.webp': ('unsplash_3DJfakd6VoU.jpg', None, None),
    'pillar-practice.webp': ('unsplash_mZixsK8OnmE.jpg', None, None),
    'pillar-meet.webp': ('unsplash_J154nEkpzlQ.jpg', None, None),
    'practice-start.webp': ('pexels_13159243.jpg', None, None),
    'meet-night.webp': ('pexels_35005203.jpg', (0, 1250, 4000, 3500), (0, 0, 4000, 5000)),
    'track-night.webp': ('unsplash_jsNI0bh5D-o.jpg', None, None),
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
    steps = (320, 640) if product else ((640, 1080, 1280, 1600) if mobile else (640, 1080, 1600, 2400, 2880))
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
                    count += 1
        print(f'Responsive sources verified: {len(manifest)} originals; {count} WebPs; no upscaling')
        return
    OUT.mkdir(exist_ok=True)
    manifest = json.loads(manifest_path.read_text(encoding='utf-8')) if args.only else {}
    protected = {'after-the-run.webp': ASSETS / 'after-the-run.webp',
                 'frame-01-detail.webp': SOURCES / 'run-detail-clean.png',
                 'run-shadow.webp': SOURCES / 'run-shadow.jpg',
                 'frame-03-people.webp': SOURCES / 'community-ai.png'}
    inputs = [(name, path, None, None, False) for name, path in protected.items()]
    inputs += [(name, args.pool / 'web' / src, crop, mobile, True) for name, (src, crop, mobile) in JOBS.items()]
    inputs += [(p.name, p, None, None, False) for p in sorted(ASSETS.glob('merch-*.jpg'))]
    for name, source, crop, mobile, grade in inputs:
        if args.only and name not in args.only:
            continue
        im = Image.open(source).convert('RGB')
        entry = {'source': source.relative_to(ROOT).as_posix() if source.is_relative_to(ROOT) else str(source), 'source_sha256': hashlib.sha256(source.read_bytes()).hexdigest(),
                 'source_pixels': list(im.size), 'crop': crop, 'mobile_crop': mobile,
                 'grade': 'p50 (v4)' if grade else 'preserved; CSS unchanged'}
        if name == 'meet-night.webp':
            im = retouch(im)
        desktop = im.crop(crop) if crop else im
        entry['crop_pixels'] = list(desktop.size)
        entry['variants'] = variants(desktop, Path(name).stem, grade, product=name.startswith('merch-'))
        if mobile:
            entry['mobile'] = variants(im.crop(mobile), Path(name).stem, grade, mobile=True)
        # Compare encoded samples at identical small size: descriptive, not a quality score.
        def stats(image):
            image = image.resize((128,128)).convert('RGB')
            return [round(ImageStat.Stat(image.convert('L')).mean[0], 2),
                    round(ImageStat.Stat(image.convert('HSV')).mean[1], 2)]
        entry['old_mean_luma_saturation'] = stats(Image.open(ASSETS / name))
        entry['mean_luma_saturation'] = stats(Image.open(ROOT / 'site' / entry['variants'][-1]['file']))
        manifest['assets/' + name] = entry
        print(name, len(entry['variants']), 'desktop variants', flush=True)
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')

if __name__ == '__main__':
    main()
