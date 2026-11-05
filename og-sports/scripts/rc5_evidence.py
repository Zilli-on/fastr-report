"""RC5: identical cold-context full-scroll byte measurements before and after."""
import json
import os
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path(os.environ['TEMP']) / 'og-rc5-evidence'
BASE = os.environ.get('OG_REVIEW_URL', 'http://127.0.0.1:4385')

def phase(page, value):
    page.evaluate('''p => {
      const t = document.querySelector('.stick-track');
      const s = document.querySelector('.stick-stage');
      scrollTo(0, scrollY + t.getBoundingClientRect().top - (innerWidth < 768 ? 12 : 24)
        + p * (t.offsetHeight - s.offsetHeight));
    }''', value)
    page.wait_for_timeout(500)

def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else 'after'
    OUT.mkdir(exist_ok=True)
    report = {'mode': mode, 'cases': [], 'errors': []}
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        for width, height, dpr in [(390, 844, 3), (1440, 900, 2)]:
            context = browser.new_context(viewport={'width': width, 'height': height}, device_scale_factor=dpr)
            page = context.new_page()
            page.on('pageerror', lambda e: report['errors'].append(str(e)))
            page.on('console', lambda m: report['errors'].append(m.text) if m.type == 'error' else None)
            page.goto(BASE, wait_until='networkidle')
            page.add_style_tag(content='html{scroll-behavior:auto!important}')
            bottom = page.evaluate('document.documentElement.scrollHeight - innerHeight')
            for y in range(0, bottom + 600, 600):
                page.evaluate('y => scrollTo(0,y)', y)
                page.wait_for_timeout(100)
            page.wait_for_load_state('networkidle')
            resources = page.evaluate("[...performance.getEntriesByType('navigation'),...performance.getEntriesByType('resource')].map(r=>({url:r.name.split('/').pop() || 'index.html',bytes:r.encodedBodySize,transfer:r.transferSize}))")
            case = {'width': width, 'dpr': dpr, 'resources': resources,
                    'body_bytes': sum(r['bytes'] for r in resources),
                    'transfer_bytes': sum(r['transfer'] for r in resources)}
            report['cases'].append(case)
            if mode == 'after':
                verify(page, width, case)
            context.close()
        browser.close()
    (OUT / f'{mode}.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
    assert not report['errors'], report['errors']
    print(json.dumps({**report, 'cases': [{k:v for k,v in c.items() if k != 'resources'} for c in report['cases']]}, indent=2))

def verify(page, width, case):
    requested = [r['url'] for r in case['resources'] if 'hoodie-' in r['url']]
    assert requested and all('hoodie-black-' in r for r in requested), requested
    stage = page.locator('main .hoodie-stage')
    buttons = stage.locator('[data-hoodie]')
    assert buttons.count() == 6
    boxes = buttons.evaluate_all('es => es.map(e => {const r=e.getBoundingClientRect(); return [r.width,r.height,r.top];})')
    assert all(w >= 44 and h >= 44 for w,h,_ in boxes), boxes
    assert len(set(y for _,_,y in boxes)) == 1, boxes
    for color in ['black', 'lavender']:
        if color == 'lavender':
            stage.locator('[data-hoodie="lavender"]').click()
            page.wait_for_function("document.querySelector('main [data-hoodie=lavender]').getAttribute('aria-pressed') === 'true'")
        page.wait_for_timeout(350)
        page.locator('#apparel').screenshot(path=str(OUT/f'{width}-wear-{color}.png'), scale='css')
        assert stage.locator('[aria-pressed=true]').count() == 1
    # Native keyboard buttons and language changes retain the selected colour.
    button = stage.locator('[data-hoodie="cherry-red"]')
    button.focus()
    page.keyboard.press('Enter')
    page.wait_for_function("document.querySelector('main [data-hoodie=cherry-red]').getAttribute('aria-pressed') === 'true'")
    page.evaluate("document.querySelector('.site-header .language').click()")
    assert stage.locator('.hoodie-disclosure').inner_text() == 'AI visualisation'
    assert stage.locator('.hoodie-selection').text_content() == 'Cherry Red'
    page.evaluate("document.querySelector('.site-header .language').click()")
    page.emulate_media(reduced_motion='reduce')
    stage.locator('[data-hoodie="butter-yellow"]').click()
    page.wait_for_function("document.querySelector('main [data-hoodie=butter-yellow]').getAttribute('aria-pressed') === 'true'")
    assert stage.locator('.hoodie-previous').count() == 0
    for color in ['cobalt-blue', 'emerald-green']:
        stage.locator(f'[data-hoodie="{color}"]').focus()
        page.keyboard.press('Space')
        page.wait_for_function('(c) => document.querySelector(`main [data-hoodie="${c}"]`).getAttribute("aria-pressed") === "true"', arg=color)
        assert stage.locator('.hoodie-image img').evaluate('(e) => e.complete && e.naturalWidth > 0')
    page.emulate_media(reduced_motion='no-preference')
    # Reload for the live viewer after the reduced-motion teardown.
    page.reload(wait_until='networkidle')
    page.add_style_tag(content='html{scroll-behavior:auto!important}')
    page.locator('#stick').scroll_into_view_if_needed()
    page.wait_for_function("document.querySelector('#stick').dataset.viewer === 'ready'", timeout=60000)
    case['fill'] = {}
    for p, name in [(.1, 'assembled'), (.5, 'exploded'), (.98, 'opened')]:
        phase(page, p)
        fill = float(page.locator('#stick').get_attribute('data-fill'))
        case['fill'][name] = fill
        assert .75 <= fill <= .85, (width, name, fill)
        page.screenshot(path=str(OUT/f'{width}-{name}.png'), scale='css')
        if name == 'exploded':
            labels = page.locator('.stick-legend li:visible')
            assert labels.count() == 5
            rects = labels.evaluate_all('es => es.map(e => {const r=e.getBoundingClientRect(); return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,font:parseFloat(getComputedStyle(e).fontSize)};})')
            assert all(r['font'] >= 11 for r in rects)
            for i, a in enumerate(rects):
                for b in rects[i+1:]:
                    assert a['right'] <= b['left'] or b['right'] <= a['left'] or a['bottom'] <= b['top'] or b['bottom'] <= a['top'], rects
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    # Buttons animate through intermediate scroll positions instead of jumping.
    page.locator('[data-stick-phase="0"]').click()
    page.wait_for_function("Math.abs(+document.querySelector('#stick').dataset.progress - .1) < .005")
    page.evaluate('''() => {
      window.rc5Progress = [];
      window.rc5Sample = () => window.rc5Progress.push(+document.querySelector('#stick').dataset.progress);
      window.addEventListener('scroll', window.rc5Sample);
      document.querySelector('[data-stick-phase="1"]').click();
    }''')
    page.wait_for_function("Math.abs(+document.querySelector('#stick').dataset.progress - .5) < .005")
    samples = page.evaluate('''() => {
      window.removeEventListener('scroll', window.rc5Sample);
      return window.rc5Progress;
    }''')
    assert any(.10005 < p < .49995 for p in samples), samples
    case['smooth_scroll_samples'] = samples
    frames = page.locator('#stick').get_attribute('data-frames')
    page.wait_for_timeout(400)
    assert page.locator('#stick').get_attribute('data-frames') == frames, 'idle render loop'

if __name__ == '__main__':
    main()
