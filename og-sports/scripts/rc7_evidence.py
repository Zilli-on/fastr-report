"""RC6/RC7 comparison; git blobs served from memory, no baseline/build copy."""
import http.server
import json
import mimetypes
from pathlib import Path
import subprocess
import threading
from urllib.parse import urlsplit, unquote
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]

def baseline(path):
    return subprocess.check_output(['git', 'show', '18138d5:og-sports/' + path], cwd=ROOT)

def main():
    results = {}
    for stage in ('rc6', 'rc7'):
        manifest = json.loads(baseline('docs/responsive-assets.json') if stage == 'rc6' else (ROOT / 'docs/responsive-assets.json').read_bytes())
        cache = {}
        class Handler(http.server.BaseHTTPRequestHandler):
            def log_message(self, *args): pass
            def do_GET(self):
                name = unquote(urlsplit(self.path).path).lstrip('/') or 'index.html'
                if '..' in Path(name).parts:
                    self.send_error(403); return
                try:
                    if name not in cache:
                        cache[name] = baseline('site/' + name) if stage == 'rc6' else (ROOT / 'site' / name).read_bytes()
                    data = cache[name]
                except (OSError, subprocess.CalledProcessError):
                    self.send_error(404); return
                self.send_response(200)
                self.send_header('Content-Type', mimetypes.guess_type(name)[0] or 'application/octet-stream')
                self.send_header('Content-Length', str(len(data)))
                self.end_headers(); self.wfile.write(data)
        server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), Handler)
        threading.Thread(target=server.serve_forever, daemon=True).start()
        results[stage] = {}
        try:
            with sync_playwright() as pw:
                browser = pw.chromium.launch(channel='chrome')
                for width, height, dpr in ((390,844,3),(768,900,2),(1440,900,2)):
                    context = browser.new_context(viewport={'width':width,'height':height}, device_scale_factor=dpr, reduced_motion='reduce')
                    base = f'http://127.0.0.1:{server.server_port}/'
                    blocked, errors, payloads = [], [], []
                    def route(r):
                        if r.request.url.startswith(base): r.continue_()
                        else: blocked.append(r.request.url); r.abort()
                    context.route('**/*', route)
                    page = context.new_page()
                    page.on('pageerror', lambda e: errors.append(str(e)))
                    page.on('response', lambda r: payloads.append({'file':r.url.removeprefix(base),'bytes':int(r.headers.get('content-length',0)),'status':r.status}) if r.request.resource_type == 'image' else None)
                    page.goto(base, wait_until='networkidle')
                    page.evaluate('document.fonts.ready')
                    y = 0
                    while y < page.evaluate('document.documentElement.scrollHeight'):
                        page.evaluate('(y)=>scrollTo(0,y)',y); page.wait_for_timeout(100); y += 500
                    page.wait_for_timeout(700)
                    page.evaluate("Promise.all([...document.querySelectorAll('main img')].map(i=>i.decode().catch(()=>{})))")
                    page.wait_for_load_state('networkidle')
                    metrics = {}
                    for name, selector in [('run-night.webp','.movement .bleed > picture > img'),('pillar-meet.webp','.pillar-meet img')]:
                        m = page.locator(selector).evaluate('''i=>{const r=i.getBoundingClientRect(),s=getComputedStyle(i);return {current:i.currentSrc.split('/').pop(),box:[r.width,r.height],position:s.objectPosition,fit:s.objectFit,complete:i.complete&&i.naturalWidth>0}}''')
                        entry=manifest['assets/'+name]
                        mobile='-mobile-' in m['current']
                        crop=entry.get('mobile_crop') if mobile else entry['crop']
                        sw,sh=(crop[2]-crop[0],crop[3]-crop[1]) if crop else entry['source_pixels']
                        v=next(v for v in entry['mobile' if mobile else 'variants'] if v['file'].endswith('/'+m['current']))
                        scale=max(m['box'][0]*dpr/sw,m['box'][1]*dpr/sh)
                        m.update(demand=[round(sw*scale,2),round(sh*scale,2)],Q=round(scale,4),A=round(max(sw*scale/v['width'],sh*scale/v['height']),4),bytes=v['bytes'])
                        assert m['complete']
                        metrics[name]=m
                    shots=[]
                    for label,selector in [('run','.movement .bleed'),('temple','.temple')]:
                        shot=f'qa/rc7-{stage}-{width}-{label}.png'
                        page.locator(selector).screenshot(path=str(ROOT/shot),scale='css')
                        shots.append(shot)
                    # Actual overlay geometry, relative to the image frame.
                    overlay=page.locator('.movement .bleed').evaluate('''f=>{const r=f.getBoundingClientRect();return [...f.querySelectorAll('.bleed-top,h2,.bleed-caption')].map(e=>{const b=e.getBoundingClientRect();return {text:e.innerText,box:[b.x-r.x,b.y-r.y,b.width,b.height]}})}''')
                    assert not errors and not blocked
                    assert all(p['status']==200 for p in payloads)
                    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
                    results[stage][str(width)]={'image_bytes':sum(p['bytes'] for p in payloads),'requests':payloads,'metrics':metrics,'overlay':overlay,'screenshots':shots,'errors':errors,'blocked':blocked}
                    print(stage,width,results[stage][str(width)]['image_bytes'],flush=True)
                    context.close()
                browser.close()
        finally: server.shutdown()
    (ROOT/'docs/rc7-measurements.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

if __name__ == '__main__': main()
