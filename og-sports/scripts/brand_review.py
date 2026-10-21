"""Review 3: visible brand narrative and closing chapter, DE/EN at seven widths.

Normal mode checks the exact HTTP-served build. OG_INLINE_REVIEW=1 is only for
restricted local rendering; that mode is identified in the report and embeds the
same assets/styles/scripts without making network requests. Neither mode proves
Safari/Firefox/real-device support or third-party hosting availability.
"""
from pathlib import Path
from urllib.request import urlopen
import base64
import hashlib
import json
import mimetypes
import os
import re
import shutil
import subprocess
import time

ROOT = Path(__file__).resolve().parents[1]
BASE = 'http://127.0.0.1:4193'
WIDTHS = (320, 360, 390, 768, 1024, 1440, 1920)


def main():
    from playwright.sync_api import sync_playwright
    inline = os.environ.get('OG_INLINE_REVIEW') == '1'
    output = ROOT / 'qa'
    output.mkdir(exist_ok=True)
    report = {'mode': 'inline-render' if inline else 'built-http', 'cases': [],
              'page_errors': [], 'external_requests': [], 'status': 'running'}
    process = None
    try:
        html = (ROOT / 'dist/index.html').read_text()
        if inline:
            for name in ('styles.css', 'refinement.css'):
                html = re.sub(r'<link[^>]+href="' + re.escape(name) + r'"[^>]*>',
                              lambda m, n=name: '<style>' + (ROOT / 'dist' / n).read_text() + '</style>', html)
            html = re.sub(r'<script[^>]+src="script.js"[^>]*>\s*</script>',
                          lambda m: '<script>' + (ROOT / 'dist/script.js').read_text() + '</script>', html)
            for file in (ROOT / 'dist/assets').iterdir():
                media_type = mimetypes.guess_type(str(file))[0]
                uri = 'data:' + media_type + ';base64,' + base64.b64encode(file.read_bytes()).decode()
                html = html.replace('assets/' + file.name, uri)
        else:
            process = subprocess.Popen(['node', 'scripts/serve.mjs', '--dist'], cwd=ROOT,
                                       env={**os.environ, 'PORT': '4193'}, stdout=subprocess.DEVNULL)
            for _ in range(80):
                try:
                    with urlopen(BASE, timeout=1) as response:
                        if response.status == 200:
                            break
                except OSError:
                    time.sleep(.1)
            else:
                raise RuntimeError('Review server did not start.')
        with sync_playwright() as pw:
            browser = pw.chromium.launch(headless=True,
                executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or None)
            report['browser'] = browser.version
            try:
                for width in WIDTHS:
                    page = browser.new_page(viewport={'width': width, 'height': 1000 if width > 760 else 844},
                                            reduced_motion='reduce')
                    page.set_default_timeout(12000)
                    page.on('pageerror', lambda err: report['page_errors'].append(str(err)))
                    def request(route):
                        if not inline and (route.request.url == BASE or route.request.url.startswith(BASE + '/')):
                            route.continue_()
                        else:
                            report['external_requests'].append(route.request.url)
                            route.abort()
                    page.route('**/*', request)
                    if inline:
                        page.set_content(html, wait_until='load')
                    else:
                        page.goto(BASE, wait_until='networkidle')
                    page.evaluate("document.querySelectorAll('img[src]').forEach(i => i.loading='eager')")
                    page.wait_for_function("[...document.querySelectorAll('img[src]')].every(i => i.complete && i.naturalWidth > 0)")
                    for language in ('de', 'en'):
                        if language == 'en':
                            page.locator('.site-header .language').click()
                        assert page.locator('html').get_attribute('lang') == language
                        assert page.locator('#brand [role="tablist"]').count() == 0
                        assert page.locator('.brand-principles article').count() == 3
                        assert page.locator('#world-title').inner_text().startswith(
                            'Eigener Antrieb.' if language == 'de' else 'Individual drive.')
                        assert page.locator('.finale-mark img').evaluate('(i) => i.complete && i.naturalWidth > 0')
                        state = page.evaluate('''() => ({
                            width: innerWidth, scroll: document.documentElement.scrollWidth,
                            overflow: [...document.querySelectorAll('main h2,main h3,.manifesto-note,.brand-principles p,.path-copy')]
                                .filter(e => e.scrollWidth > e.clientWidth + 1).map(e => e.textContent),
                            liveBlend: getComputedStyle(document.querySelector('.live-campaign')).mixBlendMode,
                            contactBackground: getComputedStyle(document.querySelector('#connect')).backgroundColor,
                            footerBackground: getComputedStyle(document.querySelector('.footer')).backgroundColor
                        })''')
                        assert state['scroll'] <= width + 1, state
                        assert not state['overflow'], state
                        assert state['liveBlend'] == 'normal', state
                        assert state['contactBackground'] == state['footerBackground'], state
                        page.locator('.brand-principles [data-project="live"]').click()
                        assert page.locator('#project-dialog').evaluate('(d) => d.open')
                        page.keyboard.press('Escape')
                        assert not page.locator('#project-dialog').evaluate('(d) => d.open')
                        page.locator('#connect [data-contact="partner"]').click()
                        assert page.locator('#contact-dialog').evaluate('(d) => d.open')
                        page.keyboard.press('Escape')
                        assert not page.locator('#contact-dialog').evaluate('(d) => d.open')
                        report['cases'].append({'width': width, 'language': language, 'ok': True, 'layout': state})
                        if language == 'de' and width in (390, 1440):
                            for y in range(0, int(page.evaluate('document.body.scrollHeight')), 650):
                                page.evaluate('(y) => scrollTo(0,y)', y)
                                page.wait_for_timeout(20)
                            page.evaluate('scrollTo(0,0)')
                            page.screenshot(path=str(output / f'brand-full-{width}.png'), full_page=True)
                            for name, selector in [('world','#brand'),('projects','#projects'),('closing','#connect'),('footer','.footer')]:
                                page.locator(selector).screenshot(path=str(output / f'brand-{name}-{width}.png'),
                                    style='.chapter-nav { visibility:hidden!important; }')
                    page.close()
                assert not report['page_errors'], report['page_errors']
                assert not report['external_requests'], report['external_requests']
                report['status'] = 'passed'
            finally:
                browser.close()
    except Exception as exc:
        report['status'] = 'failed'
        report['failure'] = str(exc)
        raise
    finally:
        report['source_hashes'] = {name: hashlib.sha256((ROOT/'dist'/name).read_bytes()).hexdigest()
                                 for name in ('index.html','refinement.css')}
        (output / 'brand-review.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
        if process:
            process.terminate()
            try:
                process.wait(timeout=3)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait()
    print(f"{len(report['cases'])} brand-layout cases passed ({report['mode']}).")


if __name__ == '__main__':
    main()
