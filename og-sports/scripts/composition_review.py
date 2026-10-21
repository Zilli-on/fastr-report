"""Composition checks against the built site, with third-party traffic blocked.

Uses the same optional Playwright installation as browser_smoke.py. Does not send
forms, change repository data, or claim real-device/Safari/Firefox coverage.
"""
from pathlib import Path
from urllib.request import urlopen
import json
import os
import shutil
import subprocess
import time

ROOT = Path(__file__).resolve().parents[1]
BASE = 'http://127.0.0.1:4191'
WIDTHS = (320, 360, 390, 768, 1024, 1440, 1920)


def main() -> None:
    from playwright.sync_api import sync_playwright
    output = ROOT / 'qa'
    output.mkdir(exist_ok=True)
    process = subprocess.Popen(
        ['node', 'scripts/serve.mjs', '--dist'], cwd=ROOT,
        env={**os.environ, 'PORT': '4191'}, stdout=subprocess.DEVNULL)
    checks, errors = [], []
    try:
        for _ in range(80):
            try:
                with urlopen(BASE, timeout=1) as response:
                    if response.status == 200:
                        break
            except OSError:
                time.sleep(.1)
        else:
            raise RuntimeError('Build preview did not start.')
        with sync_playwright() as p:
            browser = p.chromium.launch(
                headless=True,
                executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or None)
            try:
                for width in WIDTHS:
                    page = browser.new_page(
                        viewport={'width': width, 'height': 1000 if width > 760 else 844},
                        reduced_motion='reduce')
                    page.on('pageerror', lambda error: errors.append(str(error)))
                    page.route('**/*', lambda route: route.continue_()
                               if route.request.url.startswith(BASE + '/') or route.request.url == BASE
                               else route.abort())
                    page.goto(BASE, wait_until='networkidle')
                    assert page.locator('link[href="refinement.css"]').count() == 1
                    for y in range(0, int(page.evaluate('document.body.scrollHeight')), 600):
                        page.evaluate('(y) => scrollTo(0, y)', y)
                        page.wait_for_timeout(20)
                    page.wait_for_function('''() => [...document.querySelectorAll('main img')]
                        .every(img => img.complete && img.naturalWidth > 0)''')
                    for language in ('de', 'en'):
                        if language == 'en':
                            page.locator('.site-header .language').click()
                        assert page.locator('html').get_attribute('lang') == language
                        state = page.evaluate('''() => {
                            const box = e => { const r = e.getBoundingClientRect();
                                return {x:r.x, y:r.y, right:r.right, bottom:r.bottom, w:r.width, h:r.height}; };
                            const art = document.querySelector('.challenge-art');
                            const image = document.querySelector('.apparel-art > img');
                            const poster = document.querySelector('.apparel-art');
                            return {
                                width:innerWidth, scroll:document.documentElement.scrollWidth,
                                headingOverflow:[...document.querySelectorAll('main h2, main h3')]
                                    .filter(e => e.scrollWidth > e.clientWidth + 1).map(e => e.textContent),
                                calendar:box(art.querySelector('.calendar-grid')),
                                number:box(art.querySelector('.thirty')), poster:box(art),
                                imageRatio:image.naturalWidth / image.naturalHeight,
                                frameRatio:poster.clientWidth / poster.clientHeight,
                                imagePosition:getComputedStyle(image).objectPosition,
                                cards:[...document.querySelectorAll('#project-gallery > .project-card')].map(box),
                                desktopOverlay:getComputedStyle(document.querySelector('.chapter-nav')).display,
                                hero:document.querySelector('#hero-photo').getAttribute('src')
                            };
                        }''')
                        assert state['scroll'] <= width + 1, state
                        assert not state['headingOverflow'], state
                        assert state['hero'] == 'assets/after-the-run.webp'
                        assert state['number']['right'] + 4 <= state['calendar']['x'], state
                        assert state['calendar']['right'] <= state['poster']['right'] - 8, state
                        assert abs(state['imageRatio'] - state['frameRatio']) < .012, state
                        assert state['imagePosition'] == '50% 50%', state
                        if width > 760:
                            assert state['desktopOverlay'] == 'none', state
                        cards = state['cards']
                        for i, a in enumerate(cards):
                            for b in cards[i + 1:]:
                                overlap_x = min(a['right'], b['right']) - max(a['x'], b['x'])
                                overlap_y = min(a['bottom'], b['bottom']) - max(a['y'], b['y'])
                                assert overlap_x <= 1 or overlap_y <= 1, (a, b)
                        for view in ('index', 'gallery'):
                            button = page.locator('button[data-view="' + view + '"]')
                            button.click()
                            assert button.get_attribute('aria-pressed') == 'true'
                            assert page.evaluate('document.documentElement.scrollWidth') <= width + 1
                        checks.append({'width':width, 'language':language, 'ok':True, 'measurements':state})
                        if language == 'de' and width in (390, 1440):
                            page.evaluate('scrollTo(0,0)')
                            page.wait_for_timeout(80)
                            page.screenshot(path=str(output / f'composition-hero-{width}.png'))
                            page.screenshot(path=str(output / f'composition-full-{width}.png'), full_page=True)
                            for selector, name in (('#projects', 'projects'), ('#fastr', 'movement')):
                                page.locator(selector).screenshot(
                                    path=str(output / f'composition-{name}-{width}.png'),
                                    style='.chapter-nav { visibility: hidden !important; }')
                    page.locator('#projects [data-project="apparel"]').first.click()
                    assert page.locator('#project-dialog').evaluate('(el) => el.open')
                    page.keyboard.press('Escape')
                    page.close()
                assert not errors, errors
            finally:
                browser.close()
    finally:
        report = {'target':BASE, 'external_network':'blocked', 'checks':checks,
                  'page_errors':errors, 'widths':list(WIDTHS),
                  'not_tested':['Safari', 'Firefox', 'real devices', 'production deployment', 'full accessibility audit']}
        (output / 'composition-review.json').write_text(json.dumps(report, indent=2) + '\n')
        process.terminate()
        try:
            process.wait(timeout=3)
        except subprocess.TimeoutExpired:
            process.kill()
            process.wait()
    print(f'{len(checks)} bilingual composition cases passed; no JavaScript page errors.')


if __name__ == '__main__':
    main()
