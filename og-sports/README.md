# OG SPORTS — web project

One maintainable website project, migrated from V21. The approved hero, existing layout and interactions are retained. This is a development baseline, not a new visual release and not a live deployment.

## Start

Node.js 22 or newer. The application and build use no third-party npm packages.

```sh
npm ci --ignore-scripts
npm run dev
```

Open `http://127.0.0.1:4173`. Edit `site/` and refresh the browser.

```sh
npm run check     # source + HTTP checks, then static build
npm run preview   # serve dist/ locally
```

Optional browser checks require Python Playwright and Chromium:

```sh
python -m pip install playwright
python -m playwright install chromium
python scripts/browser_smoke.py
```

## Structure

- `site/`: HTML, CSS, JavaScript, assets and preview robots.txt.
- `scripts/`: dependency-free Node build/server and optional browser test.
- `tests/`: static checks, HTTP checks and original-asset SHA-256 checks.
- `.github/workflows/quality.yml`: checks on pushes and pull requests; no deployment secrets.
- `vercel.json`: static deployment configuration, output `dist/`.
- `docs/`: image sources, prior baseline QA and deployment handoff.
- `AGENTS.md`: confirmed design decisions and work rules for subsequent coding sessions.

## Proposed GitHub / Vercel workflow

Use one dedicated repository, provisionally named `og-sports`, rather than overwrite the unrelated content in `Zilli-on/fastr-report`.

1. Import these files into the intended repository in a Git-enabled coding workspace.
2. Connect that repository to one Vercel project in the intended account/team.
3. Use feature branches and preview deployments for design iterations. Review before merging.
4. Keep the existing main/production branch untouched until explicitly approved.

Vercel settings: Framework **Other**, root **repository root**, install `npm ci --ignore-scripts`, build `npm run check`, output `dist`. These settings are also in `vercel.json`.

Official documentation: https://vercel.com/docs/git and https://vercel.com/docs/git/vercel-for-github

The workflow has been prepared locally only. No GitHub repository has been created or pushed, and no Vercel deployment has been performed by this package.

## Preview limits

The two real photographs still load from the original documented Unsplash image URLs. That dependency is unchanged from V21. They are not included as local files. Source image rights and usage notes remain in `docs/PHOTO_CREDITS.md` and in the site.

The first/default group photograph remains the existing AI image study. It and the original logos are byte-for-byte checked. Font files are not included.

The contact form only generates a local text draft; it sends nothing. Product and event descriptions are concepts/in development, not a shop or booking system.

`noindex` / robots restrictions are for the design preview. They do not provide access control. Before a public brand launch, verify the chosen image use, company/contact/legal information, submission handling and accessibility on real devices. Use deployment access protection for an internal review.

Validation of this migration: eight source/HTTP tests passed and the static build succeeded. A new browser run could not be executed because Chromium is missing in the current environment. The optional browser script is supplied for the next coding workspace; it is not a claimed completed test. The historical V21 report is retained separately and must not be described as a new run.

See `docs/HANDOFF.md` for the actual access status and `qa/` for tests performed on this package.
