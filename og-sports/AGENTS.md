# OG SPORTS — project direction

## Preserve
- This is the OG SPORTS parent brand; FASTR / OG FASTR remains a distinct movement.
- Motto: außergewöhnlich, aber clean. Global top-brand standing, NOT a motorsport aesthetic.
- Continue the approved V16–V21 direction: asymmetric composition, generous space, light large type, open corners, restrained lavender.
- The default Meet photograph `site/assets/after-the-run.webp` is explicitly approved. Do not replace, regenerate, retouch or crop the source asset without a specific request.
- Keep the original OG SPORTS and OG FASTR SVG contours. Do not create replacement marks.
- Maintain German and English together, including dialog labels and alt text.
- Keep real photography, AI image studies and product concepts clearly distinguished. No invented partnerships, finished products, event dates or actual team membership.

## Work
- One project, not one directory per visual version. Work in `site/`. One stylesheet (`site/styles.css`); never add `reviewN.css` layers — change the rule where it lives.
- Use a feature branch and a reviewed pull request. Do not overwrite unrelated FASTR projects.
- Run `npm run check` and actual browser checks before describing a change as tested.
- Do not claim a deployment, commit or completed test without the corresponding result.
- Never bundle fonts, secrets, `.vercel` state, contact form input or authentication data.
- No form submission service, analytics, commerce, database or paid integration without explicit authorization.
- Keep the contact flow accurately labelled as a local draft until a real submission service is approved.
- Keep preview noindex settings until launch requirements are met. `noindex` is NOT access protection.
- Respect reduced motion, keyboard access, visible focus, and touch targets.
- Do not accumulate features just to make a new iteration. Improve composition, clarity, image quality and typographic rhythm first.

## Commands
`npm run dev` serves the working files. `npm test` runs source and HTTP checks.
`npm run build` writes static output to `dist/`. `npm run preview` serves that output.
`python scripts/visual_review.py [site|artefacts|all]` runs the Chromium review against `dist/` (requires Python Playwright + Chromium; run `npm run build` first). CI calls the same suite through `scripts/review7_visual.py` and `scripts/review8_visual.py`; keep those two file names, the workflow file names them and the token used here cannot change workflows.
`python scripts/authored_art.py --write` regenerates the authored plates inside `site/index.html`; `--check` verifies they are in sync.

## Truthful delivery
Separate local preparation from GitHub push and Vercel deployment. The migration package itself is not evidence of an online repository or a live website.

## Review 7 — confirmed visual feedback and delivery requirements (2026-10-22)
- The user explicitly liked **the first OG SPORTS image and the following three editorial photos**. Their composition/crops must be protected from gratuitous redesign.
- **All later photography was rejected.** Do not return to generic runner/cycling rooftop photos lower on the page; use authored typographic brand culture until authentic OG assets can replace them. Do not present stock photos as our events, merchandise, personnel or collaborations.
- The lower half should have the **same premium authority as the hero**, not a stack of corporate/pitch-deck blocks. “Außergewöhnlich, aber clean”; closer in *standing and cultural coherence* to SOM Studios / PROJECT50, never a literal cloned layout or an F1 racing theme.
- First image `after-the-run.webp` is **untouched**. The separately named display copy `after-the-run-display-4x.webp` is a 4× **conventional resample with sharpening**, not genuine AI super-resolution; keep its provenance truthful and preserve the original's hash test.
- The three liked photographs remain sourced and credited directly; below them Review 7 uses **no photos**. Project detail covers likewise use honest typographic concept art.
- Protect parent brand OG SPORTS, OG FASTR as its movement, seven exact FASTR30 rule names, existing original brand SVGs, bilingual DE/EN, accessibility, project/contact flows, and preview disclaimer.
- Every new visual direction must be reviewed as **actual rendered website screenshots** on desktop and mobile, not a speculative mockup. Test for horizontal clipping, accidental word wrapping, readable contrast, real images loading, and no JS errors.
- The GitHub PR is a **draft**; never merge or overwrite `main` or the existing site without explicit approval. Vercel team permissions are separate and not assumed.

## Final direction — every chapter is a frame (2026-10-23)
Full rationale: `docs/ART_DIRECTION.md`.
- The page is a sequence of frames 00–09 with one caption grammar (monospace, 11 px). Photographs where we have honest ones (00–03), authored plates after that (04 routes, 05 FASTR30 practice field, 06 Wienerwald jersey line sheet, 07 gathering, 08 STICK drawing). The caption's right side names the photographer or states the status.
- Two grounds only (paper, night). One display voice for every chapter title: light, mixed case, tight — the voice of "Own greatness.". No uppercase poster headlines, no two-colour headline trick, no arrows on non-links, no corner brackets, no glow.
- Lavender = OG SPORTS, lime `#E7FF1A` = OG FASTR world only.
- Motion: only the three plates move, once, on first view; complete without JS and with reduced motion.
- Project stories reuse the page plate as their cover (cloned in `script.js`), so there is one drawing per project, not two.
- FASTR STICK is drawn from the CAD draft V0 proportions; print no dimensions, keep "untested, not a product".
- The rejected stock photographs (`running-photograph`, `cycling-photograph`, `movement-rooftop`) were removed from `site/assets`; tests fail if they return.

## v2 — campaign, not concept (2026-10-23, Fabi: "noch nicht high end", "keine anderen Marken", SOM-Anfang + große Sportbrands/F1)
Full rationale: `docs/ART_DIRECTION.md` (v2). This replaces the v1 plate decisions above where they conflict.
- Every chapter carries a real image: 01–03 photographs as an edge-to-edge strip, then our own Higgsfield campaign studies (04, 05, 07), an AI visualisation of the apparel colour studies (06) and a Blender render of the STICK CAD (08). Each image below the photographs carries a visible label (KI-…studie / KI-Visualisierung / Render aus CAD-Entwurf V0); a test enforces it.
- No third-party brands anywhere: marks retouched out of 01 and 03; originals must not ship.
- Chapter titles in Archivo (wide, heavy, uppercase); copy in Inter; both self-hosted under SIL OFL in `site/fonts/`. The old "no font files" rule is replaced by "only self-hosted OFL fonts, licence next to the file, no font services".
- Image pipeline: `scripts/prepare_images.py`, `scripts/render_stick.py`; FASTR30 rules are a seven-column grid.

## Video loops (2026-10-23)
- `site/media/*-loop.mp4` sit over the labelled stills (poster + `<img>` fallback); muted, no audio, loaded only when visible and motion is allowed, each with a pause button. Rebuild with `scripts/build_media.py`.
- Do not use footage that shows other clubs' or companies' brands (Vali's Prater clips: "BREIT & SCHNELL" shirts) on OG SPORTS surfaces.
