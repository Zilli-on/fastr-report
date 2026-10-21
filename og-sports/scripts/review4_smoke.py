"""Review 4 browser checks for the fashion/community-led homepage.
The test serves the built site locally and blocks third-party requests.
"""
from pathlib import Path
from urllib.request import urlopen
import json, os, shutil, subprocess, time

ROOT=Path(__file__).resolve().parents[1]
BASE='http://127.0.0.1:4199'
WIDTHS=(320,390,768,1024,1440,1920)

def main():
    from playwright.sync_api import sync_playwright
    qa=ROOT/'qa';qa.mkdir(exist_ok=True)
    report={'target':BASE,'widths':list(WIDTHS),'checks':[],'page_errors':[],'external_requests':[]}
    proc=subprocess.Popen(['node','scripts/serve.mjs','--dist'],cwd=ROOT,env={**os.environ,'PORT':'4199'},stdout=subprocess.DEVNULL)
    try:
        for _ in range(60):
            try:
                with urlopen(BASE,timeout=1) as r:
                    if r.status==200:break
            except OSError:time.sleep(.1)
        else: raise RuntimeError('preview server did not start')
        with sync_playwright() as pw:
            browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or None)
            report['browser']=browser.version
            try:
                for width in WIDTHS:
                    page=browser.new_page(viewport={'width':width,'height':844 if width<761 else 1000},reduced_motion='reduce')
                    page.set_default_timeout(12000)
                    page.on('pageerror',lambda e:report['page_errors'].append(str(e)))
                    def route(rt):
                        if rt.request.url==BASE or rt.request.url.startswith(BASE+'/'):rt.continue_()
                        else:
                            report['external_requests'].append(rt.request.url);rt.abort()
                    page.route('**/*',route)
                    page.goto(BASE,wait_until='networkidle')
                    page.evaluate("document.querySelectorAll('img[src]').forEach(i=>i.loading='eager')")
                    page.wait_for_function("[...document.querySelectorAll('img[src]')].every(i=>i.complete&&i.naturalWidth>0)")
                    state=page.evaluate("""() => ({
                      width:innerWidth,scroll:document.documentElement.scrollWidth,
                      hero:document.querySelector('#hero-photo').getAttribute('src'),
                      culture:document.querySelectorAll('.culture-shot').length,
                      projects:document.querySelectorAll('#project-gallery>.project-card').length,
                      sections:document.querySelectorAll('main>section').length,
                      css:[...document.styleSheets].map(s=>s.href||'inline'),
                      heroHeight:document.querySelector('.fashion-hero').getBoundingClientRect().height
                    })""")
                    assert state['scroll']<=width+1,state
                    assert state['hero']=='assets/after-the-run.webp',state
                    assert state['culture']==3 and state['projects']==4 and state['sections']==5,state
                    assert any('review4.css' in x for x in state['css']),state
                    assert state['heroHeight']>=700 if width<761 else state['heroHeight']>=850,state
                    for project in ('challenge','apparel','live','stick'):
                        page.locator('#projects [data-project="'+project+'"]').first.click()
                        assert page.locator('#project-dialog').evaluate('(d)=>d.open')
                        page.keyboard.press('Escape')
                    page.locator('.site-header .language').click()
                    assert page.locator('html').get_attribute('lang')=='en'
                    page.locator('.site-header .language').click()
                    assert page.locator('html').get_attribute('lang')=='de'
                    page.locator('#connect [data-contact="community"]').first.click()
                    assert page.locator('#contact-dialog').evaluate('(d)=>d.open')
                    page.keyboard.press('Escape')
                    report['checks'].append({'width':width,'ok':True,'state':state})
                    if width in (390,1440):
                        page.evaluate('scrollTo(0,0)')
                        page.screenshot(path=str(qa/f'review4-{width}.png'),full_page=True)
                        page.locator('#brand').screenshot(path=str(qa/f'review4-culture-{width}.png'))
                        page.locator('#projects').screenshot(path=str(qa/f'review4-projects-{width}.png'))
                    page.close()
                assert not report['page_errors'],report['page_errors']
                assert not report['external_requests'],report['external_requests']
                report['status']='passed'
            finally:browser.close()
    except Exception as exc:
        report['status']='failed';report['failure']=str(exc);raise
    finally:
        (qa/'review4-smoke.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
        proc.terminate()
        try:proc.wait(timeout=3)
        except subprocess.TimeoutExpired:proc.kill();proc.wait()
    print(f"{len(report['checks'])} Review 4 browser widths passed.")

if __name__=='__main__':main()
