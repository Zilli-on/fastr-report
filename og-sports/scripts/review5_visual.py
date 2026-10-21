"""Visual-quality checks for OG SPORTS Review 5.

Tests *rendered* wordmark separation and the four editorial headings across
phone/tablet/desktop. All third-party requests are blocked. Full-page screenshots
alone are not evidence: section/viewport images are captured after native scroll
settles, so offscreen browser paint optimizations cannot hide content.
"""
from pathlib import Path
from urllib.request import urlopen
import json, os, shutil, subprocess, time

ROOT=Path(__file__).resolve().parents[1]
BASE='http://127.0.0.1:4291'
WIDTHS=(320,360,390,768,1024,1440,1920)
HEADS=('#world-title','#movement-title','#projects-title','#connect-title')

def main():
    from playwright.sync_api import sync_playwright
    out=ROOT/'qa';out.mkdir(parents=True,exist_ok=True)
    report={'widths':list(WIDTHS),'cases':[],'errors':[],'external':[], 'screenshots':[]}
    proc=subprocess.Popen(['node','scripts/serve.mjs','--dist'],cwd=ROOT,
                          env={**os.environ,'PORT':'4291'},stdout=subprocess.DEVNULL)
    try:
        for _ in range(60):
            try:
                with urlopen(BASE, timeout=1) as result:
                    if result.status==200:break
            except OSError:time.sleep(.1)
        else:raise RuntimeError('Review 5 local preview did not start')
        with sync_playwright() as pw:
            browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or None)
            report['browser']=browser.version
            try:
                for width in WIDTHS:
                    page=browser.new_page(viewport={'width':width,'height':844 if width<761 else 900},
                                          reduced_motion='reduce')
                    page.set_default_timeout(12000)
                    page.on('pageerror',lambda exc:report['errors'].append(str(exc)))
                    def route(rt):
                        if rt.request.url==BASE or rt.request.url.startswith(BASE+'/'):rt.continue_()
                        else:report['external'].append(rt.request.url);rt.abort()
                    page.route('**/*',route)
                    page.goto(BASE,wait_until='networkidle')
                    page.add_style_tag(content='html{scroll-behavior:auto!important}')
                    page.evaluate("document.querySelectorAll('img[src]').forEach(i=>i.loading='eager')")
                    page.wait_for_function("[...document.querySelectorAll('img[src]')].every(i=>i.complete && i.naturalWidth>0)")
                    state=page.evaluate('''() => {
                      const rect=el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,w:r.width,h:r.height}};
                      const a=rect(document.querySelector('.word-own'));
                      const b=rect(document.querySelector('.word-greatness'));
                      return {
                        innerWidth,scrollWidth:document.documentElement.scrollWidth,
                        img:document.querySelector('#hero-photo').getAttribute('src'),
                        a,b,heroBlend:getComputedStyle(document.querySelector('.hero-title')).mixBlendMode,
                        overlap:Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.y,b.y)),
                        headings:[...document.querySelectorAll('main h2')].length,
                        note:document.querySelector('.community-overlay .micro').textContent
                      };
                    }''')
                    assert state['scrollWidth']<=width+1,state
                    assert state['img']=='assets/after-the-run.webp',state
                    assert state['overlap']<1,state
                    assert state['a']['x']>=-1 and state['b']['right']<=width+1,state
                    assert state['heroBlend']=='normal',state
                    assert state['headings']>=4,state
                    assert 'REFERENCE PHOTOGRAPHY' in state['note'],state
                    if width in (390,1440):
                        page.evaluate("scrollTo({top:0,behavior:'instant'})")
                        page.wait_for_timeout(180)
                        target=out/f'visual5-hero-{width}.png'
                        page.screenshot(path=str(target))
                        report['screenshots'].append(str(target.relative_to(ROOT)))
                    for selector in HEADS:
                        el=page.locator(selector)
                        el.scroll_into_view_if_needed()
                        page.wait_for_timeout(120)
                        detail=el.evaluate('''e=>{
                          const r=e.getBoundingClientRect(),s=getComputedStyle(e);
                          return {visible:r.bottom>0&&r.top<innerHeight,opacity:s.opacity,display:s.display,visibility:s.visibility,width:r.width,height:r.height,color:s.color,text:e.innerText.trim()};
                        }''')
                        assert detail['visible'] and detail['opacity']=='1' and detail['display']!='none' and detail['visibility']=='visible' and detail['width']>80 and detail['height']>0, (width,selector,detail)
                        if selector == '#movement-title':
                            visual_lines=el.evaluate("""e=>{
                                const style=getComputedStyle(e),height=e.getBoundingClientRect().height;
                                return Math.round(height/parseFloat(style.lineHeight));
                            }""")
                            assert visual_lines == 2, (width,selector,visual_lines)
                        if width in (390,1440):
                            path=out/f'visual5-{selector.lstrip("#")}-{width}.png'
                            page.screenshot(path=str(path))
                            report['screenshots'].append(str(path.relative_to(ROOT)))
                    report['cases'].append({'width':width,'ok':True,'layout':state})
                    page.close()
                assert not report['errors'],report['errors']
                assert not report['external'],report['external']
                report['status']='passed'
            finally:browser.close()
    except Exception as exc:
        report['status']='failed';report['failure']=str(exc);raise
    finally:
        (out/'review5-visual.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
        proc.terminate()
        try:proc.wait(timeout=3)
        except subprocess.TimeoutExpired:proc.kill();proc.wait()
    print(f'{len(report["cases"])} Review 5 viewport cases passed; all headings rendered and no hero type collisions.')

if __name__=='__main__':main()
