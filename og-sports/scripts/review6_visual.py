"""OG SPORTS Review 6 — visual hierarchy, provenance and daily practice.

Checks the HTTP-served static build with Chromium, without external network.
Use only reviewed screenshots to describe actual mobile and desktop rendering.
"""
from pathlib import Path
from urllib.request import urlopen
import os, json, shutil, subprocess, time

ROOT=Path(__file__).resolve().parents[1]
BASE='http://127.0.0.1:4296'
WIDTHS=(320,360,390,768,1024,1440,1920)
RULES=('RECOVER','OWN YOUR MORNING','MOVE','READ','GET FASTR','FUEL','REFLECT')

def main():
    from playwright.sync_api import sync_playwright
    output=ROOT/'qa';output.mkdir(parents=True,exist_ok=True)
    report={'checks':[],'errors':[],'external_requests':[],'screenshots':[],
            'limits':['Chromium only','no Safari or Firefox','not a real-device audit',
                      'stock photo/model releases not cleared','no production deployment']}
    process=subprocess.Popen(['node','scripts/serve.mjs','--dist'],cwd=ROOT,
                             env={**os.environ,'PORT':'4296'},stdout=subprocess.DEVNULL)
    try:
        for _ in range(50):
            try:
                with urlopen(BASE,timeout=1) as resp:
                    if resp.status==200:break
            except OSError:time.sleep(.1)
        else:raise RuntimeError('Review 6 server did not start')
        with sync_playwright() as pw:
            browser=pw.chromium.launch(headless=True,
                         executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or None)
            report['browser_version']=browser.version
            try:
                for width in WIDTHS:
                    page=browser.new_page(viewport={'width':width,'height':844 if width<=760 else 900},
                                         reduced_motion='reduce')
                    page.set_default_timeout(15000)
                    page.on('pageerror',lambda error:report['errors'].append(str(error)))
                    def route(req):
                        if req.request.url==BASE or req.request.url.startswith(BASE+'/'):
                            req.continue_()
                        else:
                            report['external_requests'].append(req.request.url)
                            req.abort()
                    page.route('**/*',route)
                    page.goto(BASE,wait_until='networkidle')
                    page.add_style_tag(content='html{scroll-behavior:auto!important}')
                    page.evaluate("document.querySelectorAll('img[src]').forEach(i=>i.loading='eager')")
                    page.wait_for_function("[...document.querySelectorAll('img[src]')].every(i => i.complete && i.naturalWidth > 0)")
                    measurements=page.evaluate('''() => {
                      const rect=e=>{let r=e.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height}};
                      const cards=[...document.querySelectorAll('#project-gallery > .project-card')]
                          .map(e=>({key:e.dataset.key,box:rect(e)}));
                      return {
                        width:innerWidth,scroll:document.documentElement.scrollWidth,
                        hero:document.querySelector('#hero-photo').getAttribute('src'),
                        chapterDisplay:getComputedStyle(document.querySelector('.chapter-nav')).display,
                        rules:[...document.querySelectorAll('.standards-list strong')].map(e=>e.textContent.trim()),
                        sectionCount:document.querySelectorAll('main>section').length,
                        imageTreatment:getComputedStyle(document.querySelector('.culture-shot-c img')).filter,
                        backdropTreatment:getComputedStyle(document.querySelector('.community-photo>img')).filter,
                        standards:rect(document.querySelector('.fastr-standards')),
                        cards
                      };
                    }''')
                    assert measurements['scroll']<=width+1, measurements
                    assert measurements['hero']=='assets/after-the-run.webp', measurements
                    assert measurements['chapterDisplay']=='none', measurements
                    assert measurements['rules']==list(RULES), measurements
                    assert measurements['sectionCount']==5, measurements
                    assert 'grayscale(1)' in measurements['imageTreatment'], measurements
                    assert 'grayscale(1)' in measurements['backdropTreatment'], measurements
                    assert measurements['standards']['height']>320, measurements
                    cards={card['key']:card['box'] for card in measurements['cards']}
                    for first,box in cards.items():
                        for second,other in cards.items():
                            if first>=second:continue
                            dx=min(box['right'],other['right'])-max(box['x'],other['x'])
                            dy=min(box['bottom'],other['bottom'])-max(box['y'],other['y'])
                            assert dx<=1 or dy<=1, (width,first,second,dx,dy)
                    if width>1100:
                        assert cards['apparel']['x'] < cards['challenge']['x'], measurements
                        assert cards['stick']['x'] < cards['live']['x'], measurements
                        assert cards['apparel']['width']>=2*cards['challenge']['width'], measurements
                        assert cards['live']['width']>=2*cards['stick']['width'], measurements
                    elif width>760:
                        assert cards['challenge']['x'] < cards['apparel']['x'], measurements
                        assert cards['live']['x'] < cards['stick']['x'], measurements
                    else:
                        assert cards['apparel']['y'] < cards['challenge']['y'] < cards['live']['y'] < cards['stick']['y'], measurements
                    page.locator('.standards-link').click()
                    assert page.locator('#project-dialog').evaluate('(el) => el.open')
                    assert 'FASTR30' in page.locator('#project-dialog-title').inner_text()
                    page.keyboard.press('Escape')
                    assert not page.locator('#project-dialog').evaluate('(el) => el.open')
                    page.locator('.site-header .language').click()
                    assert page.locator('html').get_attribute('lang')=='en'
                    assert 'SEVEN STANDARDS' in page.locator('.standards-list-wrap>.micro').inner_text()
                    page.locator('.site-header .language').click()
                    assert page.locator('html').get_attribute('lang')=='de'
                    report['checks'].append({'width':width,'status':'passed','measurements':measurements})
                    if width in (390,1440):
                        page.evaluate('scrollTo(0,0)')
                        page.wait_for_timeout(170)
                        for short,selector in [
                          ('hero','.fashion-hero'),
                          ('culture','#brand'),
                          ('standards','.fastr-standards'),
                          ('projects','#projects'),
                          ('community','#connect')]:
                            path=output/f'r6-{short}-{width}.png'
                            page.locator(selector).screenshot(path=str(path))
                            report['screenshots'].append(str(path.relative_to(ROOT)))
                    page.close()
                assert not report['errors'],report['errors']
                assert not report['external_requests'],report['external_requests']
                report['status']='passed'
            finally:browser.close()
    except Exception as exc:
        report['status']='failed';report['failure']=str(exc)
        raise
    finally:
        (output/'review6-visual.json').write_text(json.dumps(report,indent=2,ensure_ascii=False)+'\n')
        process.terminate()
        try:process.wait(timeout=3)
        except subprocess.TimeoutExpired:
            process.kill();process.wait()
    print(f"{len(report['checks'])} responsive layouts validated; photo treatment, standards, project hierarchy and interactions passed.")

if __name__=='__main__':main()
