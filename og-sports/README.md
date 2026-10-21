# OG SPORTS — web review

The approved V21 design is now a committed, maintainable website in **Zilli-on/fastr-report**, isolated under **og-sports/** on **feat/og-sports-web**. Existing FASTR pages and the main branch have not been replaced. This is staging, not a production launch or a newly created standalone repository.

## Open the reviewed website

[Verified online review](https://raw.githack.com/Zilli-on/fastr-report/5b30375d1b35adce354746ec63b20ea0608aa9c9/og-sports/site/index.html)

The preview provider displays an external-content notice first; select **Open the page**. This link fixes the reviewed source commit rather than silently changing with the branch. The page, images and Apparel interaction were inspected in Chromium at desktop and mobile widths. This temporary public proxy is not a Vercel deployment and is not an availability or production-hosting guarantee. No passwords or real enquiry data are needed.

## What is preserved and improved

The first/default Meet image, `after-the-run.webp`, and original brand SVGs are unchanged, with SHA-256 regression checks. The direction remains unusual but clean: asymmetric composition, image-edge typography, open corners, whitespace and restrained lavender.

The two real reference photographs are now **same-origin WebP assets in site/assets/**. Their loading no longer depends on Unsplash or Higgsfield. Photographer attribution, source links and non-endorsement notices remain. See `docs/PHOTO_CREDITS.md` and `docs/photo_sources.json`.

The contact form only creates a local text draft. It sends nothing. Projects remain concepts or work in development, not products for sale or event bookings.

## Develop and check

Run these commands from the **og-sports/** directory. Node.js 22 or newer; the site and Node build have no third-party npm dependencies.

```sh
npm ci --ignore-scripts
npm run dev       # http://127.0.0.1:4173
npm run check     # 8 source/HTTP tests, original-asset checks and static build
npm run preview   # serve the built dist/ directory
```

Browser regression tests require Python Playwright and Chromium:

```sh
python -m pip install playwright==1.55.0
python -m playwright install chromium
npm run build
python scripts/browser_smoke.py
```

The browser suite tests 320, 390, 768, 1024, 1440 and 1920 pixels, DE/EN, all image loading, hero selections, four project views, image attribution/original colour, gallery/index, navigation and local contact drafts. It blocks third-party network requests and fails on page errors. It writes an actual result, including failures, to `qa/browser-smoke.json`. A test being defined does not imply that its latest run passed: check the Actions run for the exact commit.

## Repository workflow

The active workflow is **../.github/workflows/og-sports-review.yml** at the repository root. It checks this directory on review-branch pushes and relevant pull requests, without deployment secrets. Evidence is attached to the Actions run. The nested `.github/workflows/quality.yml` is the original standalone-project template and is not active in this staging layout.

The one-time import workflow checksummed the original archive and photograph pack before importing; it is restricted to its own file on this branch and refuses to overwrite an existing `og-sports/` directory. Normal site commits do not run it.

No merge or production deployment is part of this review. A dedicated OG SPORTS repository can be created later without overwriting the existing FASTR site.

## Structure

- `site/`: HTML, CSS, JavaScript, local assets and preview robots.txt.
- `scripts/`: dependency-free Node build/server and Chromium regression script.
- `tests/`: source, HTTP and original-asset integrity checks.
- `vercel.json`: static deployment configuration, output `dist/`.
- `docs/`: image provenance, review scope and historical migration notes.
- `AGENTS.md`: approved visual decisions and instructions for further development.

## Hosting and review limits

Vercel access to team `fdambock-5448s-projects` remained forbidden during this work; no existing Vercel project or production release was changed. Once authorized, the staging directory is `og-sports`, with framework **Other**, install `npm ci --ignore-scripts`, build `npm run check`, output `dist`. In a future standalone repository the project root would instead be the repository root.

The public preview is marked noindex; this is **not access protection**. Image-use permissions, model/property/trademark releases, company/contact/legal information, real form handling, browser coverage and real-device accessibility still require launch review. No font binaries are included.

`qa/migration-report.json`, `qa/node-checks.txt`, `docs/v21-previous-qa.json` and the original `docs/HANDOFF.md` describe the earlier local migration, not current remote deployment status. This README and the exact-commit Actions evidence supersede their old access/asset/test limitations. Do not describe historical reports as fresh checks.
