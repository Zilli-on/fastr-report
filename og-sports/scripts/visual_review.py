"""OG SPORTS — browser review of the built site (Chromium, third-party traffic blocked).

Two parts, both against `dist/` served locally:

  site       seven widths plus a short landscape viewport: no horizontal overflow, the
             approved photographs and nothing photographic below them, heading fit,
             hero composition, four project stories, DE/EN, contact draft, menu,
             contrast of body text, target sizes, section screenshots
  artefacts  the campaign images and their labels, self-hosted fonts, practice field,
             colourways, stick drawing, one-time motion and its reduced-motion fallback,
             keyboard paths (skip link, focus trap, arrow keys, Escape, deep links)

Usage:  python scripts/visual_review.py [site|artefacts|all]
Writes: qa/visual-<part>.json and qa/<part>-*.png (also on failure).
CI calls this through scripts/review7_visual.py (site) and scripts/review8_visual.py
(artefacts); the workflow file names those two entry points.
"""

import json
import os
import shutil
import subprocess
import sys
import time
from pathlib import Path
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[1]
QA = ROOT / "qa"
WIDTHS = (320, 360, 390, 768, 1024, 1440, 1920)
EXTRA = ((1280, 640),)  # short landscape window
STANDARDS = [
    "RECOVER",
    "OWN YOUR MORNING",
    "MOVE",
    "READ",
    "GET FASTR",
    "FUEL",
    "REFLECT",
]
PROJECTS = ["challenge", "apparel", "live", "stick"]
LIMITS = [
    "Chromium only; Safari, Firefox and real devices are not covered",
    "Automated contrast and target checks are partial; no full WCAG audit",
    "The 4x hero copy is a Lanczos resample: larger, not more detailed",
    "Reference photo licences do not confirm model, property or trademark releases",
    "Local static server, not Vercel or production",
]

MEASURE = r"""() => {
  const out = [];
  const box = e => { const r = e.getBoundingClientRect(); return {x: r.x, y: r.y, right: r.right, bottom: r.bottom, w: r.width, h: r.height}; };
  const img = document.querySelector('#hero-photo');
  const hero = document.querySelector('.hero');
  return {
    width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
    hero: img.getAttribute('src'), natural: [img.naturalWidth, img.naturalHeight],
    photos: [...document.querySelectorAll('#brand .tile img')].map(i => i.getAttribute('src')),
    unlabelled: [...document.querySelectorAll('main img')].filter(i => /\.(webp|jpe?g|png)$/i.test(i.getAttribute('src') || '') && !i.closest('.hero, #brand')).filter(i => { const f = i.closest('figure, article'); return !/KI-|AI |Produktvisualisierung|Product visualisation/.test((f && f.textContent) || ''); }).map(i => i.getAttribute('src')),
    rules: [...document.querySelectorAll('#projects .field-rows strong')].map(e => e.textContent.trim()),
    projects: [...document.querySelectorAll('#projects > .project')].map(e => e.dataset.key),
    headings: [...document.querySelectorAll('main h2:not(.sr-only), main h3')].map(e => ({text: e.textContent.trim().slice(0, 40), client: e.clientWidth, scroll: e.scrollWidth, right: e.getBoundingClientRect().right})),
    own: box(document.querySelector('.word-own')), greatness: box(document.querySelector('.word-greatness')),
    heroFoot: box(document.querySelector('.hero-foot')), heroBox: box(hero), kicker: box(document.querySelector('.hero-kicker')),
    beyond: [...document.querySelectorAll('main p, main h2, main h3, main li, main figcaption, main button, footer p, footer button, footer a')]
      .filter(e => e.getClientRects().length && !e.closest('.sr-only'))
      .map(e => ({t: (e.textContent || '').trim().slice(0, 40), r: e.getBoundingClientRect().right, l: e.getBoundingClientRect().left}))
      .filter(e => e.r > innerWidth + 1 || e.l < -1)
  };
}"""

CONTRAST = r"""() => {
  const parse = c => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return {r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1}; };
  const lum = c => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(c.r) + .7152 * f(c.g) + .0722 * f(c.b); };
  const bg = el => { for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c && c.a > .9) return c; } return parse(getComputedStyle(document.body).backgroundColor); };
  const fails = [];
  let checked = 0;
  const nodes = [...document.querySelectorAll('main *, footer *')].filter(e => !e.closest('.hero, svg, .sr-only') && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) && e.getClientRects().length);
  for (const e of nodes) {
    const s = getComputedStyle(e); if (s.visibility === 'hidden' || +s.opacity === 0) continue;
    const fg = parse(s.color), b = bg(e); if (!fg || !b) continue;
    const L1 = lum(fg), L2 = lum(b), ratio = (Math.max(L1, L2) + .05) / (Math.min(L1, L2) + .05);
    const size = parseFloat(s.fontSize), bold = +s.fontWeight >= 700;
    const need = size >= 24 || (bold && size >= 18.66) ? 3 : 4.5;
    checked++;
    if (ratio < need) fails.push({text: e.textContent.trim().slice(0, 40), ratio: +ratio.toFixed(2), need, size});
  }
  return {checked, fails};
}"""

TARGETS = r"""() => [...document.querySelectorAll('header a, header button, main a, main button, footer a, footer button')]
  .filter(e => e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden')
  .map(e => { const r = e.getBoundingClientRect(); return {t: (e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 30), w: Math.round(r.width), h: Math.round(r.height), inline: !!e.closest('.notes-inner p')}; })
  .filter(e => e.h < 24 || e.w < 24)"""


def serve(port):
    proc = subprocess.Popen(
        ["node", "scripts/serve.mjs", "--dist"],
        cwd=ROOT,
        env={**os.environ, "PORT": str(port)},
        stdout=subprocess.DEVNULL,
    )
    base = f"http://127.0.0.1:{port}"
    for _ in range(60):
        try:
            with urlopen(base, timeout=1) as r:
                if r.status == 200:
                    return proc, base
        except OSError:
            time.sleep(0.1)
    proc.kill()
    raise RuntimeError("local review server did not start")


def new_page(browser, base, report, width, height, motion=False):
    page = browser.new_page(
        viewport={"width": width, "height": height},
        reduced_motion="no-preference" if motion else "reduce",
    )
    page.set_default_timeout(16000)
    page.on("pageerror", lambda e: report["page_errors"].append(str(e)))
    page.on(
        "console",
        lambda m: report["console"].append(m.text) if m.type == "error" else None,
    )

    def route(r):
        if r.request.url == base or r.request.url.startswith(base + "/"):
            r.continue_()
        else:
            report["external_requests"].append(r.request.url)
            r.abort()

    page.route("**/*", route)
    return page


def load(page, base, path=""):
    page.goto(base + path, wait_until="networkidle")
    page.add_style_tag(content="html{scroll-behavior:auto!important}")
    page.evaluate(
        "document.querySelectorAll('img[loading=lazy]').forEach(i => i.loading = 'eager')"
    )
    page.wait_for_function(
        "[...document.querySelectorAll('img[src]')].every(i => i.complete && i.naturalWidth > 0)"
    )


def check(cond, message):
    if not cond:
        raise AssertionError(message)


def site(browser, base, report):
    sizes = [(w, 844 if w < 760 else 900) for w in WIDTHS] + list(EXTRA)
    for width, height in sizes:
        page = new_page(browser, base, report, width, height)
        load(page, base)
        m = page.evaluate(MEASURE)
        where = f"{width}x{height}"
        check(
            m["scrollWidth"] <= width + 1,
            (where, "horizontal overflow", m["scrollWidth"]),
        )
        check(
            m["hero"] == "assets/after-the-run-display-4x.webp"
            and m["natural"] == [5492, 1940],
            (where, "hero", m["hero"]),
        )
        check(
            m["photos"]
            == [
                "assets/frame-01-detail.webp",
                "assets/run-shadow.webp",
                "assets/frame-03-people.webp",
            ],
            (where, m["photos"]),
        )
        check(not m["unlabelled"], (where, "image without AI/render label", m["unlabelled"]))
        check(m["rules"] == STANDARDS, (where, m["rules"]))
        check(m["projects"] == PROJECTS, (where, m["projects"]))
        check(
            all(
                h["scroll"] <= h["client"] + 2 and h["right"] <= width + 1
                for h in m["headings"]
            ),
            (where, m["headings"]),
        )
        check(not m["beyond"], (where, "text outside the viewport", m["beyond"]))
        own, great, foot, kick = m["own"], m["greatness"], m["heroFoot"], m["kicker"]
        check(own["bottom"] <= great["y"] + 1, (where, "hero words overlap"))
        check(great["right"] <= width - 8, (where, "greatness touches the edge", great))
        check(
            great["bottom"] <= foot["y"] - 8,
            (where, "hero title collides with the foot rule", great, foot),
        )
        check(
            own["y"] >= kick["bottom"] + 8,
            (where, "hero title collides with the kicker", own, kick),
        )
        for selector in (
            "#world-title",
            "#movement-title",
            "#practice-title",
            "#apparel-title",
            "#live-title",
            "#stick-title",
            "#connect-title",
        ):
            el = page.locator(selector)
            el.scroll_into_view_if_needed()
            info = el.evaluate(
                "e => { const r = e.getBoundingClientRect(), s = getComputedStyle(e); return {visible: r.bottom > 0 && r.top < innerHeight, opacity: s.opacity, display: s.display}; }"
            )
            check(
                info["visible"]
                and info["opacity"] == "1"
                and info["display"] != "none",
                (where, selector, info),
            )
        contrast = page.evaluate(CONTRAST)
        check(
            contrast["checked"] > 40 and not contrast["fails"],
            (where, "contrast", contrast["fails"][:6]),
        )
        small = [t for t in page.evaluate(TARGETS) if not t["inline"]]
        check(not small, (where, "targets below 24px", small[:6]))
        # projects open as stories with the same authored plate as cover
        for key in PROJECTS:
            trigger = page.locator(f'#projects [data-project="{key}"]').first
            trigger.scroll_into_view_if_needed()
            trigger.click()
            dialog = page.locator("#project-dialog")
            check(dialog.evaluate("e => e.open"), (where, key, "dialog did not open"))
            cover = dialog.locator(".story-cover")
            check(cover.count() == 1, (where, key, "cover"))
            if key != "challenge":
                check(
                    cover.locator("img").first.evaluate("i => (i.complete && i.naturalWidth > 0) || new Promise(r => { i.onload = () => r(i.naturalWidth > 0); i.onerror = () => r(false); })"),
                    (where, key, "cover image"),
                )
            check(
                dialog.evaluate("e => e.scrollWidth <= e.clientWidth + 1"),
                (where, key, "dialog overflows"),
            )
            check(
                page.evaluate("location.hash") == f"#project-{key}",
                (where, key, "hash"),
            )
            page.keyboard.press("Escape")
            check(not dialog.evaluate("e => e.open"), (where, key, "Escape"))
            check(
                page.evaluate("document.activeElement") is not None
                and trigger.evaluate("e => e === document.activeElement"),
                (where, key, "focus not returned"),
            )
        # language
        page.evaluate("scrollTo(0,0)")
        page.locator(".site-header .language").click()
        check(page.locator("html").get_attribute("lang") == "en", (where, "lang en"))
        check(
            page.locator('#projects [data-project="challenge"]').text_content().strip()
            == "Explore FASTR30",
            (where, "EN copy"),
        )
        en = page.evaluate(MEASURE)
        check(
            en["scrollWidth"] <= width + 1 and not en["beyond"],
            (where, "EN overflow", en["beyond"]),
        )
        page.locator(".site-header .language").click()
        check(page.locator("html").get_attribute("lang") == "de", (where, "lang de"))
        # contact draft stays local
        page.locator('#connect [data-contact="partner"]').scroll_into_view_if_needed()
        page.locator('#connect [data-contact="partner"]').click()
        contact = page.locator("#contact-dialog")
        check(contact.evaluate("e => e.open"), (where, "contact"))
        check(
            page.locator('#contact-form input[value="partner"]').is_checked(),
            (where, "contact type"),
        )
        page.locator("#contact-name").fill("Review Tester")
        page.locator("#contact-message").fill(
            "A draft in the browser; no message is sent."
        )
        page.locator('#contact-form button[type="submit"]').click()
        check(page.locator(".contact-result").is_visible(), (where, "draft result"))
        check(
            "Review Tester" in page.locator("#draft-fallback").input_value(),
            (where, "draft text"),
        )
        page.keyboard.press("Escape")
        check(not contact.evaluate("e => e.open"), (where, "contact Escape"))
        # menu
        page.evaluate("scrollTo(0,0)")
        trigger = page.locator(".site-header .menu-button")
        if not trigger.is_visible():
            trigger = page.locator(".site-header [data-nav-menu]")
        trigger.click()
        check(page.locator("#menu-dialog").evaluate("e => e.open"), (where, "menu"))
        page.locator('#menu-dialog nav a[href="#projects"]').click()
        check(
            not page.locator("#menu-dialog").evaluate("e => e.open"),
            (where, "menu link"),
        )
        if width in (390, 1440):
            page.evaluate("scrollTo(0,0)")
            for name, selector in (
                ("hero", ".hero"),
                ("culture", "#brand"),
                ("movement", "#fastr"),
                ("practice", ".practice"),
                ("apparel", ".apparel"),
                ("live", ".live"),
                ("stick", ".stick"),
                ("connect", "#connect"),
                ("footer", "footer"),
            ):
                path = QA / f"{NAMES['site'][1]}-{name}-{width}.png"
                page.locator(selector).screenshot(path=str(path))
                report["screenshots"].append(str(path.relative_to(ROOT)))
            path = QA / f"{NAMES['site'][1]}-full-{width}.png"
            page.evaluate("scrollTo(0,0)")
            page.screenshot(path=str(path), full_page=True)
            report["screenshots"].append(str(path.relative_to(ROOT)))
        report["cases"].append(
            {
                "viewport": where,
                "status": "passed",
                "contrast_checked": contrast["checked"],
            }
        )
        page.close()


def artefacts(browser, base, report):
    for width in (390, 1440):
        height = 844 if width < 760 else 900
        where = f"{width}"
        # complete plates without motion
        page = new_page(browser, base, report, width, height)
        load(page, base)
        plates = page.evaluate(r"""() => ({
          motionClass: document.documentElement.classList.contains('motion-ok'),
          images: [...document.querySelectorAll('main img[src$=".webp"], main img[src$=".jpg"]')].map(i => [i.getAttribute('src'), i.naturalWidth]),
          rows: document.querySelectorAll('.practice-field .field-rows li').length,
          cells: [...document.querySelectorAll('.practice-field .field-cells')].map(c => getComputedStyle(c, '::after').clipPath),
          colourways: [...document.querySelectorAll('.colourways li')].map(l => l.textContent.trim()),
          legend: document.querySelectorAll('.stick-legend li').length,
          fonts: [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family.replace(/"/g, '')),
          headingFont: getComputedStyle(document.querySelector('#movement-title')).fontFamily,
          captions: [...document.querySelectorAll('main figcaption, main .frame-caption')].map(c => c.textContent.trim())
        })""")
        check(not plates["motionClass"], (where, "reduced motion must not arm animations"))
        widths = dict(plates["images"])
        for src, minimum in (
            ("assets/frame-01-detail.webp", 1200),
            ("assets/frame-03-people.webp", 2400),
            ("assets/campaign-ramp.webp", 2400),
            ("assets/campaign-spiral.webp", 1600),
            ("assets/apparel-studies.webp", 2400),
            ("assets/live-venue.webp", 2400),
            ("assets/stick-lime.jpg", 880),
            ("assets/stick-exploded.jpg", 472),
        ):
            check(widths.get(src, 0) >= minimum, (where, "image missing or too small", src, widths.get(src)))
        check(
            plates["rows"] == 7
            and all(c in ("none", "inset(0px)", "inset(0px 0px 0px 0px)") for c in plates["cells"]),
            (where, plates["cells"]),
        )
        check(
            [c.split(None, 1)[1] for c in plates["colourways"]] == ["Apple Sky", "Pear Moss", "Rosehip Stone", "Black Design"],
            (where, plates["colourways"]),
        )
        check(
            plates["legend"] == 5,
            (where, plates["legend"]),
        )
        check({"Archivo", "Space Grotesk"} <= set(plates["fonts"]), (where, "self-hosted fonts not loaded", plates["fonts"]))
        check(plates["headingFont"].startswith("Archivo"), (where, plates["headingFont"]))
        for needle in (
            "KI-Kampagnenstudie",
            "KI-Bildstudie",
            "Challenge-Konzept",
            "KI-Visualisierung",
            "KI-Raumstudie",
            "Prototyp, kein Serienprodukt",
            "Unsplash",
        ):
            check(any(needle in c for c in plates["captions"]), (where, "honest caption missing", needle))
        # keyboard: skip link first, visible focus, trap, arrows, deep link
        page.keyboard.press("Tab")
        check(
            page.evaluate("document.activeElement.classList.contains('skip')"),
            (where, "skip link"),
        )
        outline = page.evaluate("getComputedStyle(document.activeElement).outlineStyle")
        check(outline not in ("none", ""), (where, "focus outline", outline))
        page.locator('#projects [data-project="apparel"]').scroll_into_view_if_needed()
        page.locator('#projects [data-project="apparel"]').click()
        for _ in range(40):
            page.keyboard.press("Tab")
            check(
                page.evaluate("!!document.activeElement.closest('#project-dialog')"),
                (where, "focus escaped the dialog"),
            )
        page.keyboard.press("ArrowRight")
        check(page.evaluate("location.hash") == "#project-live", (where, "ArrowRight"))
        page.keyboard.press("Escape")
        page.close()
        page = new_page(browser, base, report, width, height)
        load(page, base, "/#project-stick")
        check(
            page.locator("#project-dialog").evaluate("e => e.open"),
            (where, "deep link"),
        )
        check(
            page.locator("#project-dialog-title").text_content().strip() == "FASTR STICK",
            (where, "deep link title"),
        )
        path = QA / f"{NAMES['artefacts'][1]}-story-stick-{width}.png"
        page.screenshot(path=str(path))
        report["screenshots"].append(str(path.relative_to(ROOT)))
        page.close()
        # motion: armed, then complete once seen
        page = new_page(browser, base, report, width, height, motion=True)
        load(page, base)
        check(
            page.evaluate("document.documentElement.classList.contains('motion-ok')"),
            (where, "motion not armed"),
        )
        before = page.evaluate(r"""() => ({
          field: getComputedStyle(document.querySelector('.field-cells'), '::after').clipPath
        })""")
        check(before["field"].startswith("inset(0px 100%"), (where, "field should wait off-screen", before))
        for selector in ("#fastr .bleed", ".practice-field", ".apparel .bleed", ".live .bleed"):
            page.locator(selector).scroll_into_view_if_needed()
            page.wait_for_timeout(250)
        page.wait_for_timeout(3200)
        done = page.evaluate(r"""() => ({
          seen: [...document.querySelectorAll('main [data-motion], main .bleed')].every(e => e.classList.contains('is-in')),
          cells: getComputedStyle(document.querySelector('.field-cells'), '::after').clipPath
        })""")
        check(done["seen"], (where, done))
        check(done["cells"] in ("inset(0px)", "inset(0px 0px 0px 0px)"), (where, done))
        for name, selector in (
            ("movement", "#fastr .bleed"),
            ("field", ".practice-field"),
            ("apparel", ".apparel .bleed"),
            ("live", ".live .bleed"),
            ("stick", ".stick"),
        ):
            path = QA / f"{NAMES['artefacts'][1]}-{name}-{width}.png"
            page.locator(selector).screenshot(path=str(path))
            report["screenshots"].append(str(path.relative_to(ROOT)))
        report["cases"].append({"viewport": where, "status": "passed"})
        page.close()


# report file and screenshot prefix per part; the CI entry points set the legacy names
NAMES = {"site": ("visual-site.json", "site"), "artefacts": ("visual-artefacts.json", "artefacts")}


def main(part=None):
    from playwright.sync_api import sync_playwright

    part = part or (sys.argv[1] if len(sys.argv) > 1 else "all")
    parts = ["site", "artefacts"] if part == "all" else [part]
    QA.mkdir(exist_ok=True)
    for name in parts:
        report = {
            "part": name,
            "status": "running",
            "cases": [],
            "page_errors": [],
            "console": [],
            "external_requests": [],
            "screenshots": [],
            "limitations": LIMITS,
        }
        proc, base = serve(4300 + len(name))
        try:
            with sync_playwright() as pw:
                browser = pw.chromium.launch(
                    headless=True,
                    executable_path=os.environ.get("CHROMIUM_PATH")
                    or shutil.which("chromium")
                    or None,
                )
                report["browser"] = browser.version
                try:
                    (site if name == "site" else artefacts)(browser, base, report)
                    check(not report["page_errors"], report["page_errors"])
                    check(not report["console"], report["console"])
                    check(not report["external_requests"], report["external_requests"])
                    report["status"] = "passed"
                finally:
                    browser.close()
        except Exception as exc:
            report["status"] = "failed"
            report["failure"] = repr(exc)[:2000]
            raise
        finally:
            (QA / NAMES[name][0]).write_text(
                json.dumps(report, ensure_ascii=False, indent=2) + "\n",
                encoding="utf-8",
            )
            proc.terminate()
            try:
                proc.wait(timeout=3)
            except subprocess.TimeoutExpired:
                proc.kill()
        print(
            f"{name}: {len(report['cases'])} cases passed, {len(report['screenshots'])} screenshots"
        )


if __name__ == "__main__":
    main()
