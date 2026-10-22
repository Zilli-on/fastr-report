"""Review 8 browser regression — authored visual studies and approved photography.

Runs Chromium against the built static website. Block all third-party requests.
Ensure the premium visual layer is real source files, original imagery remains,
projects are interactive, and the new studies do not collide or overflow.
"""
from pathlib import Path
from urllib.request import urlopen
import json, os, shutil, subprocess, time

ROOT=Path(__file__).resolve().parents[1]
BASE='http://127.0.0.1:4398'
WIDTHS=(320,360,390,768,1024,1440,1920)
STANDARDS=('RECOVER','OWN YOUR MORNING','MOVE','READ','GET FASTR','FUEL','REFLECT')
STUDIES=('r8-motion.svg','r8-apparel.svg','r8-live.svg','r8-stick.svg')

def main():
    from playwright.sync_api import sync_playwright
    qa=ROOT/'qa';qa.mkdir(exist_ok=True)
    report={'status':'running','viewports':list(WIDTHS),'checks':[],
            'page_errors':[], 'unexpected_external_requests':[],
            'screenshots':[],
            'limitations':['Chromium is not Safari or Firefox','No real-device tests',
                           'No commercially cleared photography',
                           'Illustrations are original concept studies, not product photography or validated CAD',
                           'Not a Vercel or production deployment']}
    server=subprocess.Popen(['node','scripts/serve.mjs','--dist'],cwd=ROOT,
        env={**os.environ,'PORT':'4398'},stdout=subprocess.DEVNULL)
    try:
        for _ in range(55):
            try:
                with urlopen(BASE,timeout=1) as r:
                    if r.status==200:break
            except OSError:time.sleep(.1)
        else:raise RuntimeError('Review 8 static server failed')
        with sync_playwright() as pw:
            browser=pw.chromium.launch(headless=True,
                executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or None)
            report['browser']=browser.version
            try:
                for width in WIDTHS:
                    page=browser.new_page(viewport={'width':width,
                                                    'height':844 if width<=760 else 900},
                                           reduced_motion='reduce')
                    page.set_default_timeout(16000)
                    page.on('pageerror',lambda e:report['page_errors'].append(str(e)))
                    def route(r):
                        if r.request.url==BASE or r.request.url.startswith(BASE+'/'):
                            r.continue_()
                        else:
                            report['unexpected_external_requests'].append(r.request.url)
                            r.abort()
                    page.route('**/*',route)
                    page.goto(BASE,wait_until='networkidle')
                    page.add_style_tag(content='html{scroll-behavior:auto!important}')
                    page.evaluate("document.querySelectorAll('img[src]').forEach(i=>i.loading='eager')")
                    page.wait_for_function(
                       "Array.from(document.querySelectorAll('img[src]')).every(i=>i.complete && i.naturalWidth>0)")
                    info=page.evaluate('''() => {
                      const box=e=>{let r=e.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,w:r.width,h:r.height}};
                      return {
                        width:innerWidth,scrollWidth:document.documentElement.scrollWidth,
                        hero:document.querySelector('#hero-photo').getAttribute('src'),
                        culturePhotos:document.querySelectorAll('#brand .culture-shot img').length,
                        stockBelow:document.querySelectorAll('#fastr img[src$=".webp"],#projects img[src$=".webp"],#connect img[src$=".webp"]').length,
                        studies:[...document.querySelectorAll('.r8-motion-graphic,.r8-apparel-visual img,.r8-live-visual,.r8-stick-visual img')].map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0})),
                        rules:[...document.querySelectorAll('.r7-practice-rules strong')].map(e=>e.textContent.trim()),
                        projects:[...document.querySelectorAll('#project-gallery > .project-card')].map(e=>e.dataset.key),
                        titleOverflow:[...document.querySelectorAll('main h2,.r7-work-title,.r7-work-aside,.r8-apparel-meta')].filter(e=>e.scrollWidth>e.clientWidth+2).map(e=>e.textContent.slice(0,60)),
                        work:box(document.querySelector('#projects')),
                        appendix:box(document.querySelector('.r8-stick-visual'))
                      };
                    }''')
                    assert info['scrollWidth']<=width+1,info
                    assert info['hero']=='assets/after-the-run-display-4x.webp',info
                    assert info['culturePhotos']==3 and info['stockBelow']==0,info
                    assert info['rules']==list(STANDARDS),info
                    assert info['projects']==['challenge','apparel','live','stick'],info
                    assert [s['src'].split('/')[-1] for s in info['studies']]==list(STUDIES),info
                    assert all(s['loaded'] for s in info['studies']),info
                    assert not info['titleOverflow'],info
                    assert 'COLOUR STUDIES' in page.locator('.r8-apparel-meta').inner_text(),info
                    if width<=760:
                        spacing=page.evaluate("""() => {
                          const r=s=>document.querySelector(s).getBoundingClientRect();
                          return {
                            apparelTitleEnd:r('.r7-row-apparel .r7-work-title').bottom,
                            apparelImageTop:r('.r8-apparel-visual').top,
                            apparelImageEnd:r('.r8-apparel-visual').bottom,
                            apparelCreditTop:r('.r8-apparel-meta').top,
                            stickTitleEnd:r('.r7-row-stick .r7-work-title').bottom,
                            stickImageTop:r('.r8-stick-visual').top
                          };
                        }""")
                        assert spacing['apparelTitleEnd'] <= spacing['apparelImageTop']+1, (width,spacing)
                        assert spacing['apparelImageEnd'] <= spacing['apparelCreditTop']+1, (width,spacing)
                        assert spacing['stickTitleEnd'] <= spacing['stickImageTop']+1, (width,spacing)
                    for label in ('#movement-title','#projects-title','#connect-title'):
                        page.locator(label).scroll_into_view_if_needed()
                        r=page.locator(label).evaluate('''e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return {display:s.display,opacity:s.opacity,visible:r.top<innerHeight&&r.bottom>0}}''')
                        assert r['display']!='none' and r['visible'] and r['opacity']=='1',(width,label,r)
                    for key in info['projects']:
                        page.locator('#project-gallery [data-project="'+key+'"]').first.click()
                        dialog=page.locator('#project-dialog')
                        assert dialog.evaluate('(e)=>e.open'),(width,key)
                        assert dialog.locator('.r7-story-cover').count()==1
                        page.keyboard.press('Escape')
                        assert not dialog.evaluate('(e)=>e.open')
                    page.locator('.site-header .language').click()
                    assert page.locator('html').get_attribute('lang')=='en'
                    page.locator('.site-header .language').click()
                    assert page.locator('html').get_attribute('lang')=='de'
                    page.locator('#connect [data-contact="partner"]').first.click()
                    assert page.locator('#contact-dialog').evaluate('(e)=>e.open')
                    page.keyboard.press('Escape')
                    page.evaluate('scrollTo(0,0)')
                    trigger=page.locator('.site-header .menu-button')
                    if not trigger.is_visible():trigger=page.locator('.site-header [data-nav-menu]')
                    trigger.click()
                    assert page.locator('#menu-dialog').evaluate('(e)=>e.open')
                    page.locator('#menu-dialog nav a[href="#projects"]').click()
                    assert not page.locator('#menu-dialog').evaluate('(e)=>e.open')
                    if width in (390,1440):
                        for name,sel in [('hero','.fashion-hero'),('culture','#brand'),('movement','#fastr'),('projects','#projects'),('contact','#connect')]:
                            path=qa/f'r8-{name}-{width}.png'
                            page.locator(sel).screenshot(path=str(path))
                            report['screenshots'].append(str(path.relative_to(ROOT)))
                    report['checks'].append({'width':width,'status':'passed','measurements':info})
                    page.close()
                assert not report['page_errors'],report['page_errors']
                assert not report['unexpected_external_requests'],report['unexpected_external_requests']
                report['status']='passed'
            finally:browser.close()
    except Exception as e:
        report['status']='failed';report['failure']=str(e);raise
    finally:
        (qa/'review8-visual.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
        server.terminate()
        try:server.wait(timeout=3)
        except subprocess.TimeoutExpired:server.kill();server.wait()
    print(f"{len(report['checks'])} viewport checks passed; all approved photography, concept illustrations and interactions verified.")

if __name__=='__main__':main()
