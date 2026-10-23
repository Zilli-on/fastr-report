# OG SPORTS — website (design review)

Static website for the OG SPORTS parent brand and its OG FASTR movement, staged in
**Zilli-on/fastr-report** under `og-sports/` on the branch **feat/og-sports-web**
(draft PR #1). Not merged, not deployed to Vercel or a production domain.

## Open the review

Branch preview (follows the branch):
https://raw.githack.com/Zilli-on/fastr-report/refs/heads/feat/og-sports-web/og-sports/site/index.html

The PR description links the exact reviewed commit. raw.githack shows a notice first;
choose **Open the page**. It is a public proxy for review, not hosting; `noindex` is not
access protection.

## What it is

One page in ten frames: the approved opening image, three approved reference
photographs, then authored image plates for OG FASTR, FASTR30, the Wienerwald apparel
studies, live formats and the FASTR STICK. See `docs/ART_DIRECTION.md`.

The contact flow prepares a local, copyable text draft only. Nothing is sent or stored.
No analytics, commerce, booking, database or external font.

## Develop and check

From `og-sports/`, Node.js 22+ (no runtime dependencies):

```sh
npm ci --ignore-scripts
npm run dev        # http://127.0.0.1:4173 (site/)
npm run check      # source, asset-integrity and HTTP tests, then build to dist/
npm run preview    # serve dist/
```

Browser review (Python 3 + Playwright 1.55 + Chromium), against `dist/`:

```sh
python -m pip install playwright==1.55.0
python -m playwright install chromium
npm run build
python scripts/visual_review.py all
```

`site` covers 320–1920 px and a 1280×640 window: overflow, photo boundary, heading fit,
hero composition, text contrast, target sizes, four project stories, DE/EN, contact draft,
menu. `artefacts` covers the authored plates, their one-time motion and reduced-motion
fallback, skip link, focus trap, arrow keys and deep links. Reports and screenshots go to
`qa/` (ignored by Git). CI runs the same suite via `scripts/review7_visual.py` and
`scripts/review8_visual.py` (`../.github/workflows/og-sports-review.yml`).

Authored plates are generated into `site/index.html`:

```sh
python scripts/authored_art.py --write
python scripts/authored_art.py --check
```

## Structure

- `site/index.html` — content and generated plates
- `site/styles.css` — the single stylesheet
- `site/script.js` — language, dialogs, project stories, contact draft, motion trigger
- `site/assets/` — original brand SVGs, opening image (+ 4× display copy), three photographs
- `scripts/` — dev/preview server, build, plate generator, browser review
- `tests/` — Node tests incl. SHA-256 checks of protected originals
- `docs/` — art direction, photo credits and sources, asset manifest, history
- `AGENTS.md` — binding decisions for further work

## Limits of this review

Chromium only; Safari, Firefox and real devices are untested. Contrast and target-size
checks are automated spot checks, not a full WCAG audit. Photo licences do not confirm
model, property or trademark releases. Launch blockers: `docs/ART_DIRECTION.md` and the PR.
