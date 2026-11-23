"""Real Chromium captures and regression checks for the STICK scroll story.

Existing Playwright environment; no install. Writes only the requested TEMP evidence.
"""
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path(os.environ['TEMP']) / 'og-rc4-evidence'
BASE = os.environ.get('OG_REVIEW_URL', 'http://127.0.0.1:4384')
OUT.mkdir(exist_ok=True)


def phase(page, value):
    page.evaluate('''p => {
      const track = document.querySelector('.stick-track');
      const stage = document.querySelector('.stick-stage');
      scrollTo(0, scrollY + track.getBoundingClientRect().top - (innerWidth < 768 ? 12 : 24) + p * (track.offsetHeight - stage.offsetHeight));
    }''', value)
    page.wait_for_timeout(300)


def main():
    report = {'cases': [], 'screenshots': [], 'errors': []}
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        for width, height, dpr in [(390, 844, 3), (1440, 900, 2)]:
            context = browser.new_context(viewport={'width': width, 'height': height}, device_scale_factor=dpr, has_touch=width==390)
            page = context.new_page()
            page.on('pageerror', lambda e: report['errors'].append(str(e)))
            page.on('console', lambda m: report['errors'].append(m.text) if m.type=='error' else None)
            page.goto(BASE, wait_until='networkidle')
            page.add_style_tag(content='html{scroll-behavior:auto!important}')
            assert page.evaluate("performance.getEntriesByType('resource').every(r => !/three-r170|stick.glb|stick-viewer/.test(r.name))"), 'premature 3D load'
            # Real progressive scroll: count all transferred resources up to Make.
            target = page.locator('#stick').evaluate('e => e.offsetTop')
            y = 0
            while y < target:
                y = min(y + 600, target)
                page.evaluate('y => scrollTo(0,y)', y)
                page.wait_for_timeout(45)
            page.wait_for_function("document.querySelector('#stick').dataset.viewer === 'ready'", timeout=60000)
            page.wait_for_load_state('networkidle')
            page.wait_for_timeout(500)
            resources = page.evaluate("[...performance.getEntriesByType('navigation'),...performance.getEntriesByType('resource')].map(r=>({url:r.name.split('/').pop() || 'index.html',bytes:r.encodedBodySize,transfer:r.transferSize}))")
            case = {'width': width, 'dpr': dpr, 'resources_to_make': resources,
                    'body_bytes_to_make': sum(r['bytes'] for r in resources),
                    'transfer_bytes_to_make': sum(r['transfer'] for r in resources)}
            for value, name in [(.1, 'assembled'), (.5, 'exploded'), (.98, 'opened')]:
                phase(page, value)
                assert page.locator('#stick').get_attribute('data-phase') == str(['assembled', 'exploded', 'opened'].index(name))
                path = OUT/f'{width}-{name}.png'
                page.screenshot(path=str(path), scale='css')
                report['screenshots'].append(str(path))
                assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), 'overflow'
                if name == 'exploded':
                    assert page.locator('.stick-legend li:visible').count() == 5
            case['canvas_pixels'] = page.locator('.stick-canvas').evaluate('e=>[e.width,e.height,e.clientWidth,e.clientHeight]')
            assert case['canvas_pixels'][0] <= case['canvas_pixels'][2]*2+1
            assert case['canvas_pixels'][1] <= case['canvas_pixels'][3]*2+1
            a = page.locator('#stick').get_attribute('data-frames')
            page.wait_for_timeout(400)
            assert a == page.locator('#stick').get_attribute('data-frames'), 'idle rendering'
            canvas = page.locator('.stick-canvas')
            box = canvas.bounding_box()
            x, y = box['x']+box['width']/2, box['y']+box['height']/2
            page.mouse.move(x,y)
            page.mouse.down()
            page.mouse.move(x+60,y,steps=5)
            page.mouse.up()
            page.wait_for_timeout(150)
            assert int(page.locator('#stick').get_attribute('data-frames')) > int(a), 'drag did not render'
            canvas.focus()
            page.keyboard.press('ArrowLeft')
            page.wait_for_timeout(100)
            page.keyboard.press('Home')
            if width == 390:
                session = context.new_cdp_session(page)
                def touch(kind, x, y):
                    session.send('Input.dispatchTouchEvent', {'type':kind, 'touchPoints': [] if kind=='touchEnd' else [{'x':x,'y':y}]})
                before = int(page.locator('#stick').get_attribute('data-frames'))
                touch('touchStart', x, y)
                for dx in range(10, 71, 10):
                    touch('touchMove', x+dx, y)
                    page.wait_for_timeout(25)
                touch('touchEnd', x+70, y)
                page.wait_for_timeout(150)
                assert int(page.locator('#stick').get_attribute('data-frames')) > before
                before = page.evaluate('scrollY')
                touch('touchStart', x,y)
                for dy in range(10, 101, 10):
                    touch('touchMove', x,y-dy)
                    page.wait_for_timeout(25)
                touch('touchEnd', x,y-100)
                page.wait_for_timeout(200)
                assert page.evaluate('scrollY') > before, 'canvas blocks vertical touch scroll'
            page.locator('[data-stick-phase="1"]').click()
            page.wait_for_timeout(200)
            assert page.locator('#stick').get_attribute('data-phase') == '1'
            # Language changes must retain and translate the live DOM labels.
            page.evaluate("document.querySelector('.site-header .language').click()")
            assert page.locator('[data-part="Gehaeuse"]').inner_text() == 'Housing'
            page.evaluate("document.querySelector('.site-header .language').click()")
            page.evaluate('scrollTo(0,0)')
            page.wait_for_timeout(250)
            a = page.locator('#stick').get_attribute('data-frames')
            page.wait_for_timeout(300)
            assert a == page.locator('#stick').get_attribute('data-frames'), 'offscreen rendering'
            # Reduced-motion live change releases WebGL and restores the real image.
            page.emulate_media(reduced_motion='reduce')
            page.locator('#stick').scroll_into_view_if_needed()
            assert page.locator('#stick').get_attribute('data-viewer') == 'fallback'
            assert page.locator('#stick .stick-render img').is_visible()
            path = OUT/f'{width}-reduced-motion.png'
            page.screenshot(path=str(path), scale='css')
            report['screenshots'].append(str(path))
            context.close()
            # Initial reduced-motion never requests any 3D module or mesh.
            page = browser.new_page(viewport={'width': width, 'height': height}, reduced_motion='reduce')
            page.goto(BASE+'/#stick', wait_until='networkidle')
            assert page.evaluate("performance.getEntriesByType('resource').every(r => !/three-r170|stick.glb|stick-viewer/.test(r.name))")
            page.close()
            report['cases'].append(case)
        # Both unsupported WebGL and a failed model must leave the same photograph.
        for failure in ['webgl', 'model', 'module']:
            page = browser.new_page()
            if failure == 'webgl':
                page.add_init_script("const get=HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext=function(type,...args){return type==='webgl2'?null:get.call(this,type,...args)}")
            elif failure == 'model':
                page.route('**/stick.glb', lambda route: route.abort())
            else:
                page.route('**/stick-viewer.js', lambda route: route.abort())
            page.goto(BASE+'/#stick', wait_until='networkidle')
            page.wait_for_timeout(900)
            assert page.locator('#stick').get_attribute('data-viewer') == 'fallback'
            assert page.locator('#stick .stick-render img').is_visible()
            assert not page.locator('.stick-canvas').is_visible()
            page.close()
        page = browser.new_page()
        page.goto(BASE+'/#stick', wait_until='networkidle')
        page.wait_for_function("document.querySelector('#stick').dataset.viewer === 'ready'")
        page.locator('.stick-canvas').evaluate("e => e.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext()")
        page.wait_for_function("document.querySelector('#stick').dataset.viewer === 'fallback'")
        assert page.locator('#stick .stick-render img').is_visible()
        page.close()
        browser.close()
    assert not report['errors'], report['errors']
    report['status'] = 'passed'
    (OUT/'rc4-measurements.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
    print(json.dumps({k:v for k,v in report.items() if k!='cases'}, indent=2))
    for case in report['cases']:
        print(case['width'], case['body_bytes_to_make'], case['transfer_bytes_to_make'])


if __name__ == '__main__':
    main()
