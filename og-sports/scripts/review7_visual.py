"""OG SPORTS Review 7 — real browser test against the static build.

Checks the protected hero and three editorial photos, zero lower stock photos,
responsive typography, four project narratives, bilingual UI, keyboard and
honest local contact preview. Third-party network requests are blocked.
"""
from pathlib import Path
from urllib.request import urlopen
import json, os, shutil, subprocess, time

ROOT = Path(__file__).resolve().parents[1]
BASE = 'http://127.0.0.1:4309'
WIDTHS = (320,360,390,768,1024,1440,1920)
RULES = ['RECOVER','OWN YOUR MORNING','MOVE','READ','GET FASTR','FUEL','REFLECT']

def main():
    from playwright.sync_api import sync_playwright
    qa=ROOT/'qa'; qa.mkdir(exist_ok=True)
    report={'status':'running','viewports':list(WIDTHS),'cases':[],'page_errors':[],
            'unexpected_network':[],'screenshots':[],
            'limitations':['Chromium only; Safari, Firefox and real devices untested',
                           'No production deploy; reference photo commercial releases unverified',
                           'Lanczos ×4 improves display dimensions, not underlying image detail']}
    proc=subprocess.Popen(['node','scripts/serve.mjs','--dist'],cwd=ROOT,
                          env={**os.environ,'PORT':'4309'},stdout=subprocess.DEVNULL)
    try:
        for _ in range(50):
            try:
                with urlopen(BASE,timeout=1) as response:
                    if response.status==200:break
            except OSError:time.sleep(.12)
        else:raise RuntimeError('Local review server did not start')
        with sync_playwright() as pw:
            browser=pw.chromium.launch(headless=True,
                executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or None)
            report['chromium']=browser.version
            try:
                for width in WIDTHS:
                    page=browser.new_page(viewport={'width':width,'height':844 if width<=760 else 900},
                                          reduced_motion='reduce')
                    page.set_default_timeout(15000)
                    page.on('pageerror',lambda e:report['page_errors'].append(str(e)))
                    def route_request(route):
                        if route.request.url==BASE or route.request.url.startswith(BASE+'/'):
                            route.continue_()
                        else:
                            report['unexpected_network'].append(route.request.url)
                            route.abort()
                    page.route('**/*',route_request)
                    page.goto(BASE,wait_until='networkidle')
                    page.add_style_tag(content='html{scroll-behavior:auto!important}')
                    page.evaluate("document.querySelectorAll('img[src]').forEach(img=>img.loading='eager')")
                    page.wait_for_function("Array.from(document.querySelectorAll('img[src]')).every(i=>i.complete&&i.naturalWidth>0)")
                    state=page.evaluate('''() => {
                      const rect=e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height};};
                      const img=document.querySelector('#hero-photo');
                      return {
                        width:innerWidth,scroll:document.documentElement.scrollWidth,
                        hero:img.getAttribute('src'),naturalSize:[img.naturalWidth,img.naturalHeight],
                        photoCount:document.querySelectorAll('#brand .culture-shot img').length,
                        stockAfter:document.querySelectorAll('#fastr img[src$=".webp"],#projects img[src$=".webp"],#connect img[src$=".webp"]').length,
                        rules:[...document.querySelectorAll('.r7-practice-rules strong')].map(e=>e.textContent.trim()),
                        projects:[...document.querySelectorAll('#project-gallery>.project-card')].map(e=>e.dataset.key),
                        titles:[...document.querySelectorAll('main h2')].map(e=>({text:e.innerText,width:e.clientWidth,scroll:e.scrollWidth})),
                        word1:rect(document.querySelector('.word-own')),
                        word2:rect(document.querySelector('.word-greatness')),
                        hasHeroTabs:!!document.querySelector('.hero-tabs')
                      };
                    }''')
                    assert state['scroll']<=width+1,state
                    assert state['hero']=='assets/after-the-run-display-4x.webp',state
                    assert state['naturalSize']==[5492,1940],state
                    assert state['photoCount']==3 and state['stockAfter']==0,state
                    assert state['rules']==RULES,state
                    assert state['projects']==['challenge','apparel','live','stick'],state
                    assert not state['hasHeroTabs'],state
                    assert all(t['scroll']<=t['width']+2 for t in state['titles']),state
                    overlap=max(0,min(state['word1']['bottom'],state['word2']['bottom']) -
                                  max(state['word1']['y'],state['word2']['y']))
                    assert overlap<1,(width,overlap)
                    for selector in ['#world-title','#movement-title','#projects-title','#connect-title']:
                        el=page.locator(selector)
                        el.scroll_into_view_if_needed()
                        page.wait_for_timeout(80)
                        info=el.evaluate('''e=>{
                          const r=e.getBoundingClientRect(),s=getComputedStyle(e);
                          return {visible:r.bottom>0&&r.top<innerHeight,opacity:s.opacity,
                                  visibility:s.visibility,display:s.display,height:r.height};
                        }''')
                        assert info['visible'] and info['opacity']=='1' and info['visibility']=='visible' and info['display']!='none' and info['height']>0,(width,selector,info)
                    for project in state['projects']:
                        page.locator('#project-gallery [data-project="'+project+'"]').first.click()
                        dialog=page.locator('#project-dialog')
                        assert dialog.evaluate('(e)=>e.open'),(width,project)
                        assert dialog.locator('.r7-story-cover').count()==1
                        assert dialog.locator('.r7-story-cover img').count()==0
                        page.keyboard.press('Escape')
                        assert not dialog.evaluate('(e)=>e.open')
                    page.locator('.site-header .language').click()
                    assert page.locator('html').get_attribute('lang')=='en'
                    page.locator('.site-header .language').click()
                    assert page.locator('html').get_attribute('lang')=='de'
                    page.locator('#connect [data-contact="partner"]').first.click()
                    dialog=page.locator('#contact-dialog')
                    assert dialog.evaluate('(e)=>e.open')
                    page.locator('#contact-name').fill('Review Tester')
                    page.locator('#contact-message').fill('A draft in the browser; no message is sent.')
                    page.locator('#contact-form button[type="submit"]').click()
                    assert page.locator('.contact-result').is_visible()
                    page.keyboard.press('Escape')
                    assert not dialog.evaluate('(e)=>e.open')
                    page.evaluate('scrollTo(0,0)')
                    menu=page.locator('.site-header .menu-button')
                    if not menu.is_visible():
                        menu=page.locator('.site-header [data-nav-menu]')
                    menu.click()
                    assert page.locator('#menu-dialog').evaluate('(e)=>e.open')
                    assert page.locator('#menu-dialog .menu-stage img').count()==0
                    page.locator('#menu-dialog nav a[href="#projects"]').click()
                    assert not page.locator('#menu-dialog').evaluate('(e)=>e.open')
                    if width in (390,1440):
                        page.evaluate("scrollTo({top:0,behavior:'instant'})")
                        page.wait_for_timeout(130)
                        for key,sel in [('hero','.fashion-hero'),('culture','#brand'),
                                        ('movement','#fastr'),('projects','#projects'),
                                        ('contact','#connect')]:
                            path=qa/f'r7-{key}-{width}.png'
                            page.locator(sel).screenshot(path=str(path))
                            report['screenshots'].append(str(path.relative_to(ROOT)))
                        page.evaluate("scrollTo({top:0,behavior:'instant'})")
                        page.wait_for_timeout(160)
                        path=qa/f'r7-full-{width}.png'
                        page.screenshot(path=str(path),full_page=True)
                        report['screenshots'].append(str(path.relative_to(ROOT)))
                    report['cases'].append({'width':width,'status':'passed','measurements':state})
                    page.close()
                assert not report['page_errors'],report['page_errors']
                assert not report['unexpected_network'],report['unexpected_network']
                report['status']='passed'
            finally:browser.close()
    except Exception as exc:
        report['status']='failed'
        report['failure']=str(exc)
        raise
    finally:
        (qa/'review7-visual.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
        proc.terminate()
        try:proc.wait(timeout=3)
        except subprocess.TimeoutExpired:
            proc.kill();proc.wait()
    print(f"{len(report['cases'])} viewports passed; approved photography, asset scale, project dialogs and bilingual contact verified.")

if __name__=='__main__':main()
