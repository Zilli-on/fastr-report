"""Optional local Chromium checks. Requires Python Playwright and an installed Chromium.

The test blocks non-local network requests deliberately; it checks the documented
photo fallback, not online photo availability or live deployment performance.
"""
from pathlib import Path
from urllib.request import urlopen
import json
import os
import subprocess
import shutil
import time

ROOT = Path(__file__).resolve().parents[1]
BASE = 'http://127.0.0.1:4189'

def main() -> None:
    try:
        from playwright.sync_api import sync_playwright
    except ImportError as exc:
        raise SystemExit('Install Python Playwright and Chromium first; see README.md.') from exc
    process = subprocess.Popen(['node', 'scripts/serve.mjs', '--dist'], cwd=ROOT,
                               env={**os.environ, 'PORT': '4189'},
                               stdout=subprocess.DEVNULL)
    checks, errors = [], []
    try:
        for _ in range(50):
            try:
                with urlopen(BASE, timeout=1) as response:
                    if response.status == 200:
                        break
            except OSError:
                time.sleep(.1)
        else:
            raise RuntimeError('Preview server did not start. Run npm run build first.')
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True, executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or None)
            try:
                for width in (320, 390, 768, 1024, 1440, 1920):
                    page = browser.new_page(viewport={'width': width, 'height': 1000},
                                            reduced_motion='reduce')
                    page.on('pageerror', lambda error: errors.append(str(error)))
                    page.route('**/*', lambda route: route.continue_()
                               if route.request.url.startswith(BASE)
                               else route.abort())
                    page.goto(BASE, wait_until='networkidle')
                    hero = page.locator('#hero-photo')
                    assert hero.evaluate('(img) => img.complete && img.naturalWidth > 0')
                    assert 'after-the-run.webp' in hero.get_attribute('src')
                    for language in ('de', 'en'):
                        if language == 'en':
                            page.locator('.site-header .language').click()
                        assert page.locator('html').get_attribute('lang') == language
                        dimensions = page.evaluate('''() => ({width: innerWidth,
                            scroll: document.documentElement.scrollWidth})''')
                        assert dimensions['scroll'] <= width + 1, dimensions
                        checks.append({'width': width, 'language': language,
                                       'layout': dimensions, 'ok': True})
                    for project in ('apparel', 'challenge', 'live', 'stick'):
                        page.locator(f'#projects [data-project="{project}"]').first.click()
                        dialog = page.locator('#project-dialog')
                        assert dialog.evaluate('(el) => el.open')
                        page.keyboard.press('Escape')
                        assert not dialog.evaluate('(el) => el.open')
                        checks.append({'width': width, 'project': project, 'ok': True})
                    page.close()
                assert not errors, errors
            finally:
                browser.close()
        report = {'target': BASE, 'external_network': 'blocked',
                  'checks': checks, 'page_errors': errors,
                  'not_tested': ['real devices', 'Safari', 'Firefox', 'live deployment',
                                 'remote image availability', 'complete accessibility audit']}
        (ROOT/'qa').mkdir(exist_ok=True)
        (ROOT/'qa/browser-smoke.json').write_text(json.dumps(report, indent=2)+'\n')
        print(f'{len(checks)} browser checks passed.')
    finally:
        process.terminate()
        try:
            process.wait(timeout=3)
        except subprocess.TimeoutExpired:
            process.kill()
            process.wait()

if __name__ == '__main__':
    main()
