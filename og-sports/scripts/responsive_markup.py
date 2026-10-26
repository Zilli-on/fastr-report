"""Shared declarative image markup; used by the page migration and pillar generator."""
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

def attributes(src, sizes):
    entry = json.loads((ROOT / 'docs/responsive-assets.json').read_text(encoding='utf-8')).get(src)
    if not entry:
        # STICK is intentionally byte-identical and has no generated variants.
        return 'width="880" height="1100"' if src.endswith('stick-lime.jpg') else ''
    candidates = ', '.join(f'{v["file"]} {v["width"]}w' for v in entry['variants'])
    w, h = entry['crop_pixels']
    return f'width="{w}" height="{h}" srcset="{candidates}" sizes="{sizes}"'

def enhance(tag, sizes):
    src = re.search(r'\bsrc="([^"]+)"', tag)[1]
    for attr in ('width', 'height', 'srcset', 'sizes'):
        tag = re.sub(rf' {attr}="[^"]*"', '', tag)
    tag = tag.replace('/>', ' ' + attributes(src, sizes) + '/>')
    entry = json.loads((ROOT / 'docs/responsive-assets.json').read_text(encoding='utf-8')).get(src, {})
    if entry.get('mobile'):
        variants = entry['mobile']
        candidates = ', '.join(f'{v["file"]} {v["width"]}w' for v in variants)
        w, h = entry['mobile_crop'][2:]
        w -= entry['mobile_crop'][0]
        h -= entry['mobile_crop'][1]
        mobile_sizes = 'max(100vw, 46.2037svh)' if src == 'assets/after-the-run.webp' else (sizes if src == 'assets/pillar-meet.webp' else '100vw')
        tag = f'<picture><source media="(max-width: 767px)" width="{w}" height="{h}" srcset="{candidates}" sizes="{mobile_sizes}"/>{tag}</picture>'
    return tag

def main():
    path = ROOT / 'site/index.html'
    html = path.read_text(encoding='utf-8')
    html = html.replace('src="assets/after-the-run-display-4x.webp"', 'src="assets/after-the-run.webp" loading="eager"')
    sizes = {
        'after-the-run.webp': 'max(100vw, 283.1svh)',
        'frame-01-detail.webp': '(max-width: 600px) 100vw, (max-width: 899px) 50vw, max(25vw, 44vh)',
        'run-shadow.webp': '(max-width: 600px) 112.5vw, (max-width: 899px) 93.75vw, max(37.5vw, 99vh)',
        'frame-03-people.webp': '(max-width: 600px) 150.4vw, (max-width: 899px) 110.6vw, max(37.5vw, 116.7vh)',
        'photo-ritual.webp': '(max-width: 899px) calc(100vw - 44px), 42vw',
        'practice-start.webp': '(max-width: 899px) calc(100vw - 44px), 42vw',
        'run-night.webp': 'max(102vw, min(153svh, 1652.4px))',
        'meet-night.webp': 'max(100vw, min(163.56svh, 1778px))',
        'track-night.webp': '100vw',
    }
    head, rest = html.split('<!--pillars-->')
    _, tail = rest.split('<!--/pillars-->')
    # Pillars are always generated from pillars.py; do not maintain a second copy.
    def replace(match):
        tag = match[0]
        src = re.search(r'\bsrc="([^"]+)"', tag)
        if not src:
            return tag
        name = src[1].split('/')[-1]
        size = sizes.get(name)
        if name.startswith('hoodie-'):
            size = '(max-width: 899px) 100vw, 50vw'
        return enhance(tag, size) if size else tag
    # Remove existing mobile wrappers so reruns are idempotent.
    def update(part):
        part = re.sub(r'<picture><source\b[^>]+>(<img\b[^>]+>)</picture>', r'\1', part)
        return re.sub(r'<img\b[^>]+>', replace, part)
    from pillars import render
    path.write_text(update(head)+'<!--pillars-->\n'+render()+'\n<!--/pillars-->'+update(tail), encoding='utf-8')

if __name__ == '__main__':
    main()
