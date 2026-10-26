"""Offline RC5/RC6 audit: installed Chrome, fresh contexts, image bodies only."""
import functools
import http.server
import json
from pathlib import Path
import subprocess
import sys
import threading
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
QA = ROOT / 'qa'

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

def main():
    stage = sys.argv[1]
    assert stage in ('rc5', 'rc6')
    QA.mkdir(exist_ok=True)
    site = ROOT / 'site'
    if stage == 'rc5':
        site = QA / 'rc6-baseline' / 'site'
        paths = subprocess.check_output(['git', 'ls-tree', '-r', '--name-only', '45f9759', '--', 'og-sports/site'], cwd=ROOT.parent).decode().splitlines()
        for name in paths:
            target = site / name.removeprefix('og-sports/site/')
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(subprocess.check_output(['git', 'show', f'45f9759:{name}'], cwd=ROOT.parent))
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(site)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    results = {}
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(channel='chrome')
            for width, height, dpr in ((390, 844, 3), (768, 900, 2), (1440, 900, 2)):
                context = browser.new_context(viewport={'width': width, 'height': height}, device_scale_factor=dpr, reduced_motion='reduce')
                blocked = []
                def route(req):
                    if req.request.url.startswith(f'http://127.0.0.1:{server.server_port}/'):
                        req.continue_()
                    else:
                        blocked.append(req.request.url)
                        req.abort()
                context.route('**/*', route)
                page = context.new_page()
                payloads, errors = [], []
                page.on('pageerror', lambda e: errors.append(str(e)))
                page.on('response', lambda r: payloads.append({'file': r.url.split('/')[-1], 'bytes': int(r.headers.get('content-length', 0)), 'status': r.status}) if r.request.resource_type == 'image' else None)
                page.goto(f'http://127.0.0.1:{server.server_port}/', wait_until='networkidle')
                page.evaluate('document.fonts.ready')
                y = 0
                while y < page.evaluate('document.documentElement.scrollHeight'):
                    page.evaluate('(y) => scrollTo(0,y)', y)
                    page.wait_for_timeout(100)
                    y += 500
                page.wait_for_timeout(700)
                page.evaluate("Promise.all([...document.querySelectorAll('main img')].map(i => i.decode().catch(() => {})))")
                page.wait_for_load_state('networkidle')
                total = sum(p['bytes'] for p in payloads)
                page.evaluate('scrollTo(0,0)')
                hero = page.locator('#hero-photo').evaluate('''i => {const r=i.getBoundingClientRect(), s=getComputedStyle(i); return {current:i.currentSrc.split('/').pop(), box:[r.width,r.height],position:s.objectPosition,fit:s.objectFit,filter:s.filter,alt:i.alt,complete:i.complete && i.naturalWidth>0};}''')
                shot = f'qa/rc6-{stage}-{width}.png'
                page.locator('.hero').screenshot(path=str(ROOT / shot), scale='css')
                assert hero['complete'] and not errors and not blocked
                assert all(p['status'] == 200 for p in payloads)
                assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
                results[f'{width}@{dpr}x'] = {'image_bytes': total, 'requests': payloads, 'hero': hero, 'screenshot': shot, 'errors': errors, 'blocked': blocked}
                context.close()
                print(stage, width, total, flush=True)
            browser.close()
    finally:
        server.shutdown()
    (ROOT / f'docs/rc6-{stage}-measurements.json').write_text(json.dumps(results, indent=2)+'\n', encoding='utf-8')

if __name__ == '__main__':
    main()
