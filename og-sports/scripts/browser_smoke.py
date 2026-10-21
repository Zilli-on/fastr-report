"""Chromium regression checks for the built OG SPORTS review.

All third-party requests are blocked. The two credited photographs must work as
same-origin assets. No real form submissions, email or analytics are involved.
Set CHROMIUM_PATH for an existing browser, or install Playwright's Chromium.
"""
from pathlib import Path
from urllib.request import urlopen
import json
import os
import shutil
import subprocess
import time

ROOT = Path(__file__).resolve().parents[1]
BASE = 'http://127.0.0.1:4189'
WIDTHS = (320, 390, 768, 1024, 1440, 1920)


def main() -> None:
    from playwright.sync_api import sync_playwright
    qa = ROOT / 'qa'
    qa.mkdir(exist_ok=True)
    report = {'target': BASE, 'external_network': 'blocked', 'checks': [],
              'page_errors': [], 'unexpected_external_requests': [],
              'not_tested': ['real devices', 'Safari', 'Firefox',
                             'production deployment', 'complete accessibility audit']}
    process = subprocess.Popen(['node', 'scripts/serve.mjs', '--dist'], cwd=ROOT,
                               env={**os.environ, 'PORT': '4189'}, stdout=subprocess.DEVNULL)
    def passed(width, label):
        report['checks'].append({'width': width, 'check': label, 'ok': True})
    try:
        for _ in range(50):
            try:
                with urlopen(BASE, timeout=1) as response:
                    if response.status == 200:
                        break
            except OSError:
                time.sleep(.1)
        else:
            raise RuntimeError('Preview server did not start; run npm run build.')
        with sync_playwright() as p:
            executable = os.environ.get('CHROMIUM_PATH') or shutil.which('chromium')
            browser = p.chromium.launch(headless=True, executable_path=executable)
            report['browser'] = browser.version
            try:
                for width in WIDTHS:
                    page = browser.new_page(viewport={'width': width, 'height': 1000},
                                            reduced_motion='reduce')
                    page.set_default_timeout(12000)
                    page.on('pageerror', lambda error: report['page_errors'].append(str(error)))
                    def route_request(route):
                        if route.request.url.startswith(BASE + '/'):
                            route.continue_()
                        else:
                            report['unexpected_external_requests'].append(route.request.url)
                            route.abort()
                    page.route('**/*', route_request)
                    page.goto(BASE, wait_until='networkidle')
                    assert page.locator('#hero-photo').evaluate('(i) => i.complete && i.naturalWidth > 0')
                    assert 'after-the-run.webp' in page.locator('#hero-photo').get_attribute('src')
                    passed(width, 'unchanged default Meet image loaded')
                    page.evaluate("document.querySelectorAll('img[src]').forEach(i => i.loading = 'eager')")
                    page.wait_for_function("Array.from(document.querySelectorAll('img[src]')).every(i => i.complete && i.naturalWidth > 0)")
                    passed(width, 'all declared images loaded without external requests')
                    for language in ('de', 'en'):
                        if language == 'en':
                            page.locator('.site-header .language').click()
                        assert page.locator('html').get_attribute('lang') == language
                        dimensions = page.evaluate('({width:innerWidth,scroll:document.documentElement.scrollWidth})')
                        assert dimensions['scroll'] <= width + 1, dimensions
                        passed(width, language + ' horizontal layout')
                    page.locator('.site-header .language').click()
                    for scene in ('move', 'make', 'meet'):
                        page.locator('[data-scene="' + scene + '"]').click()
                        page.wait_for_function('(s) => document.querySelector(".hero-photo").dataset.mode === s', arg=scene)
                        page.wait_for_function('document.querySelector("#hero-photo").complete && document.querySelector("#hero-photo").naturalWidth > 0')
                        passed(width, 'hero scene ' + scene)
                    for project in ('apparel', 'challenge', 'live', 'stick'):
                        page.locator('#projects [data-project="' + project + '"]').first.click()
                        dialog = page.locator('#project-dialog')
                        assert dialog.evaluate('(d) => d.open')
                        assert dialog.locator('#project-dialog-title').inner_text().strip()
                        page.keyboard.press('Escape')
                        assert not dialog.evaluate('(d) => d.open')
                        passed(width, 'project open and Escape close: ' + project)
                    for photo, credit in (('running', 'Mathias Reding'), ('cycling', 'Coen van de Broek')):
                        trigger = page.locator('main [data-photo="' + photo + '"]').first
                        trigger.click()
                        dialog = page.locator('#photo-dialog')
                        assert dialog.evaluate('(d) => d.open')
                        assert credit in dialog.locator('#photo-title').inner_text()
                        page.wait_for_function('document.querySelector("#inspector-image").complete && document.querySelector("#inspector-image").naturalWidth > 0')
                        dialog.locator('[data-photo-treatment="original"]').click()
                        assert 'show-original' in dialog.get_attribute('class')
                        page.keyboard.press('Escape')
                        assert not dialog.evaluate('(d) => d.open')
                        passed(width, 'photo attribution and original colour: ' + photo)
                    for view in ('index', 'gallery'):
                        control = page.locator('button[data-view="' + view + '"]')
                        control.click()
                        assert control.get_attribute('aria-pressed') == 'true'
                        assert page.locator('#project-gallery').get_attribute('data-view') == view
                        passed(width, 'project view ' + view)
                    page.evaluate('scrollTo(0,0)')
                    menu_trigger = page.locator('.site-header .menu-button')
                    if not menu_trigger.is_visible():
                        menu_trigger = page.locator('.site-header [data-nav-menu]')
                    menu_trigger.click()
                    assert page.locator('#menu-dialog').evaluate('(d) => d.open')
                    page.locator('#menu-dialog nav a[href="#projects"]').click()
                    assert not page.locator('#menu-dialog').evaluate('(d) => d.open')
                    passed(width, 'navigation opens and lands on project section')
                    page.locator('#connect [data-contact="partner"]').click()
                    assert page.locator('#contact-dialog').evaluate('(d) => d.open')
                    page.locator('#contact-name').fill('Review Test')
                    page.locator('#contact-message').fill('A local test draft, not a real enquiry.')
                    page.locator('#contact-form button[type="submit"]').click()
                    assert page.locator('.contact-result').is_visible()
                    page.keyboard.press('Escape')
                    passed(width, 'contact produces only a local draft')
                    if width in (390, 1440):
                        page.evaluate('scrollTo(0,0)')
                        page.screenshot(path=str(qa / ('hero-' + str(width) + '.png')))
                    page.close()
                assert not report['page_errors'], report['page_errors']
                assert not report['unexpected_external_requests'], report['unexpected_external_requests']
                report['status'] = 'passed'
            finally:
                browser.close()
    except Exception as exc:
        report['status'] = 'failed'
        report['failure'] = str(exc)
        raise
    finally:
        (qa / 'browser-smoke.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
        process.terminate()
        try:
            process.wait(timeout=3)
        except subprocess.TimeoutExpired:
            process.kill()
            process.wait()
    print(str(len(report['checks'])) + ' browser checks passed; no external requests or page errors.')


if __name__ == '__main__':
    main()
