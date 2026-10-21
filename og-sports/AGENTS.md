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
- One project, not one directory per visual version. Work in `site/`.
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
`python scripts/browser_smoke.py` runs the optional Chromium check (requires Python Playwright + installed Chromium).

## Truthful delivery
Separate local preparation from GitHub push and Vercel deployment. The migration package itself is not evidence of an online repository or a live website.
