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
- Image pipeline: `scripts/prepare_images.py`; FASTR30 rules are a seven-column grid.

## v3 — the temple (2026-10-24, Fabi: "der Tempel, der alle Säulen vereint", Gänsehaut, Create your own luck)
Full table: `docs/ART_DIRECTION.md` (v3). Replaces earlier sections where they conflict.
- Order: opening, strip, manifest, temple (pillars I Run · II Practice · III Wear · IV Meet · V Make), chapters I–V, the way in, signature.
- Pillars are written by `python scripts/pillars.py`; edit the rows there, not the HTML, and run `--check` before committing. A unit test guards the result (five pillars, every target exists, every image pillar labelled).
- OG upright, FASTR italic (`.run`, `site/fonts/archivo-italic-latin.woff2` from fastr30.com). Lime = FASTR, lavender = OG SPORTS.
- Images: own footage (rooftop 30.09.2026, Loop100 23.05.2026; marks inpainted, labelled "Eigene Aufnahme" with date and place) and fastr30.com shop assets (STICK, hoodies) byte for byte. No Higgsfield stills, no AI apparel, no AI venue. Live stays a type plate until real event photos exist.
- Hover never reflows: rules and lines grow by transform, not width (a width change broke the 360 px layout).

## Brand alignment — assets in use (2026-10-23 late, Fabi)
Handoff and open questions: `docs/NEXT-brand-alignment.md`. This replaces v2 where they conflict.
- Build from assets that are or were really in use (FASTR deck / design, fastr30.com), not from idea dumps. No AI video on OG surfaces.
- 08 STICK shows the fastr30.com shop renders (`fastr30-website/website/assets/img/stick-*.jpg`, 3D render delivery), copied byte for byte and hash-tested. Label: "Produktvisualisierung · Prototyp, kein Serienprodukt". The Blender render and the generated half section are gone.
- The Higgsfield stills (04, 05, 07) and the apparel visual (06) count as idea dump: replace them only with in-use assets of at least the same quality.
- Tokens follow the live FASTR surfaces (2026-10-24): lime `#E3FF23`, night `#0a0a0a`, copy in Space Grotesk (from fastr30.com), titles stay Archivo. This replaces `#E7FF1A` and Inter above. The `fastr-design` skill (`#DEFF00`, Arial Narrow) is not what is in use; see `docs/NEXT-brand-alignment.md`.

## RC9 — ten out of ten, against leading brands (2026-10-27)
Measure: `docs/TEN_OF_TEN.md` (eight criteria with Fabi's words, blind reviews by Codex and Kimi, calibrated
against Fabi's own verdicts). Benchmark: `docs/BENCHMARK_RC9.md` (SOM Studios, PROJECT50, Creators Club,
Nike Running, Tracksmith, Satisfy). Replaces earlier sections where they conflict.
- Order: I Run · II Practice · III Wear · IV Make · V Meet, then the way in. The page ends with people,
  then the invitation. Pillars follow the same order (`scripts/pillars.py`).
- An image appears once: the temple shows a second view of each product (lavender hoodie, pink STICK),
  the chapters the first one (black hoodie, lime STICK and 3D).
- I Run is a sprint, not a jog, and shows no other city as ours: B&W night sprint crew (Hansheng Zhao).
  The label names FASTR the sprint club of OG SPORTS; the opening says Vienna / Home of FASTR.
- The way in has no stand-in photograph; its three doors are rows in the grammar of the seven standards.
- Image notes describe the files actually shipped (the opening is the RC6 4K upscale, retouched).
