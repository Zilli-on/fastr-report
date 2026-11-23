"""Capture every chapter and cold-cache image payloads without writing into site.

Run with ogpw Python: scripts/rc3_evidence.py before|after
390@3x, 768@2x, 1440@2x; 900px desktop / 844px phone viewport height.
Screenshots use CSS pixels; network selection uses the real device scale factor.
"""
import functools
import http.server
import json
import os
from pathlib import Path
import sys
import threading
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ['TEMP']) / 'og-rc3-evidence'
CHAPTERS = {'00-opening': '.hero', '01-03-strip': '.strip',
            'manifest': '.manifest', 'temple': '#pillars', 'I-run': '#fastr',
            'II-practice': '#practice', 'III-wear': '#apparel',
            'IV-meet': '#live', 'V-make': '#stick', 'way-in': '#connect',
            'signature': '.footer'}

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

def main():
    stage = sys.argv[1]
    assert stage in ('before', 'after')
    out = OUT / stage
    out.mkdir(parents=True, exist_ok=True)
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(QuietHandler, directory=str(ROOT / 'site')))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    result = {}
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch()
            for width, dpr in ((390, 3), (768, 2), (1440, 2)):
                context = browser.new_context(viewport={'width': width, 'height': 844 if width == 390 else 900}, device_scale_factor=dpr, reduced_motion='reduce')
                page = context.new_page()
                payloads = []
                page.on('response', lambda response: payloads.append({'url': response.url.split('/')[-1], 'bytes': int(response.headers.get('content-length', 0))}) if response.request.resource_type == 'image' else None)
                page.goto(f'http://127.0.0.1:{server.server_port}/', wait_until='networkidle')
                page.evaluate('document.fonts.ready')
                y = 0
                while y < page.evaluate('document.documentElement.scrollHeight'):
                    page.evaluate('(y) => window.scrollTo(0,y)', y)
                    page.wait_for_timeout(100)
                    y += 500
                page.wait_for_timeout(700)
                page.evaluate("Promise.all([...document.querySelectorAll('main img')].map(i => i.decode().catch(() => {})))")
                images = page.locator('main img[src]').evaluate_all('''imgs => imgs.map(i => {
                  const r=i.getBoundingClientRect(), s=getComputedStyle(i);
                  return {src:i.getAttribute('src'), current:i.currentSrc.split('/').pop(),
                    width:r.width,height:r.height,fit:s.objectFit,position:s.objectPosition,
                    natural:[i.naturalWidth,i.naturalHeight]};})''')
                # Freeze network metric before screenshots can affect lazy loading.
                result[str(width)] = {'dpr':dpr, 'height':844 if width==390 else 900,
                    'image_bytes':sum(p['bytes'] for p in payloads), 'requests':list(payloads), 'images':images}
                for name, selector in CHAPTERS.items():
                    page.locator(selector).screenshot(path=str(out / f'{width}-{name}.png'), scale='css')
                if stage == 'after':
                    boxes = page.locator('.pillar').evaluate_all('es => es.map(e => {const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};})')
                    if width < 768:
                        assert len(boxes)==5 and all(abs(b['w']/b['h']-.8)<.001 for b in boxes)
                        assert all(abs(b['x']-boxes[0]['x'])<1 for b in boxes)
                        assert all(b['y']>=a['y']+a['h'] for a,b in zip(boxes, boxes[1:]))
                    elif width < 900:
                        assert abs(boxes[1]['y']-boxes[2]['y'])<1
                        assert abs(boxes[3]['y']-boxes[4]['y'])<1
                        assert boxes[0]['w']>boxes[1]['w']*1.9
                    else:
                        assert abs(boxes[0]['y']-boxes[1]['y'])<1
                        assert abs(boxes[2]['y']-boxes[4]['y'])<1
                context.close()
                print(stage, width, result[str(width)]['image_bytes'], 'image bytes', flush=True)
            browser.close()
    finally:
        server.shutdown()
    (out / 'measurements.json').write_text(json.dumps(result, indent=2), encoding='utf-8')

if __name__ == '__main__':
    main()
