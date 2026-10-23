# Next: align OG SPORTS with the brand work already in use (handoff 2026-10-23)

## Fabi's verdict (2026-10-23, late)

- The AI video loops and the brand film "do not look real and professional like the
  things we already worked out, with a lot of effort". → Loops removed (`d2229cb`).
  No AI video on OG SPORTS surfaces. The film in `OG Sport/Content/OG SPORTS Film/`
  is not to be used.
- The page should be built from **assets that are actually in use / were used**, not
  from idea dumps. Named explicitly:
  1. **FASTR brand (deck / design)** — the canonical FASTR look. Per memory
     `fastr-project`: canonical brand = `fastr-design` skill + Investment Deck (NOT the
     vault Brand Book). Find both first (skill path unknown in this session; search
     `~/.claude/skills`, `C:/JARVIS/tools/*`, vault `03_Projects/FASTR/`).
  2. **Real STICK images** — `C:/Users/Fabien/fastr30-website/website/assets/img/stick-lime.jpg`,
     `stick-pink.jpg`, `stick-exploded.jpg` (used on fastr30.com). Replace the Blender
     render `stick-studio.webp` with these; keep "Prototyp, kein Serienprodukt" status.
- Treat as idea dump (do not use without Fabi): `OG Sport/All Assets/ChatGPT Image …`
  (mascot, FASTR30 templates with wrong rules), `03_Library/Mood Boards`.
- Open question for Fabi: are the Higgsfield OG FASTR campaign stills (ramp, spiral,
  garage) "in use" or idea dump? They are currently on the page (04/05/07).

## State

- Branch `feat/og-sports-web` @ `d2229cb`, draft PR #1, CI was green on `9792de0`
  (v2 campaign pass) and `e42d266`; nothing merged or deployed.
- v2 structure, tests and browser suite: see `docs/ART_DIRECTION.md`, `AGENTS.md`.
- Brand marks retouched out of strip photos 01 and 03 (keep).

## Suggested first steps

1. Read the fastr-design skill and the Investment Deck; extract type, colour, grid,
   image rules. Compare with v2 (Archivo wide, lime #E7FF1A vs deck #DEFF00?).
2. Replace STICK chapter imagery with the real product images.
3. Ask Fabi which other images count as "in use" before swapping 04/05/07.
4. Re-run `npm run check` and `scripts/visual_review.py all`; screenshots before push.

## Update 2026-10-24 — STICK chapter done

- Fabi: Higgsfield stills (04 ramp, 05 spiral, 07 garage) = **idea dump** → replace with
  in-use assets, but **never lower quality**: only swap when the replacement is at least
  as strong. AI apparel visual (06) likewise is not an in-use asset.
- 08 STICK now shows the fastr30.com shop renders **byte for byte** (`stick-lime.jpg`,
  `stick-exploded.jpg`, sha256 pinned in `tests/original-assets.json`). A WebP re-encode
  was tried and dropped: it lost edge detail on the small print. Provenance: 3D render
  delivery `final-render.png` (fastr30-website commit `7afee2a`), not AI → label
  "Produktvisualisierung · Prototyp, kein Serienprodukt".
- The pink single shot was dropped: next to the exploded view it shrank to ~125 px on
  desktop; the exploded view already shows both colourways.
- Stale CAD wording removed from story texts, image notes and disclaimer; a test now
  fails if "CAD-Entwurf" / "CAD draft" returns. Blender render, generated half section,
  `authored_art.py` and `render_stick.py` are gone.

## Brand sources compared (2026-10-24, measured, not from memory)

"Deck / design" turned out to be five sources that disagree. Fabi's test is
"actually in use", so the live sites decide.

| Source | Status | Yellow | Black | Type | Imagery |
|---|---|---|---|---|---|
| fastr30.com | **live** | `#E3FF23` | `#0A0A0A` | Archivo expanded 700–900, Space Grotesk 300–500 | STICK renders, b/w motion-blur road (video), concrete corridor, fabric texture |
| fastr-vienna.vercel.app | **live** | `#E3FF23` | `#232323` | Manrope, Space Grotesk (labels) | — |
| Brand Guidelines `00_Brand-Bible/Branding-Doc/Fastr Branding.pdf` (Feb 2026) | "APPROVED CORE" | `#E3FF23` | greys to `#232323` | Ethnocentric It. (logo), Acumin Black/Black It., Avenir, Space Grotesk Light | motion blur, saturated or b/w with lime in the kit, grain, 35° angle |
| Deck v26 `Pitch-Material/fastr-deck-v26.pdf` (May 2026) | pitch | lime with glow | black | condensed italic numerals, mono labels | none: numbers as heroes, timecode, live board, "Garage. Beton. Neon-Tape." |
| `fastr-design` skill | **only uncommitted** in worktree `laughing-buck-d637ee`; built on the Feb deck now in `_archive_dokumente` | `#DEFF00` | `#0a0a0a` | Arial Narrow; bans Inter, Space Grotesk, glow | — |

Also contradictory: `_BRAND_STATUS.md` says `#DEFF00` + pure `#000` right next to the
guidelines PDF that says `#E3FF23`. Logo files: OG FASTR wordmark in `Logo-Master` is
`#DEFF00`, the copy on this site (hash-protected original) is `#E7FF1A`.

**Applied on this site (2026-10-24):** lime `#E7FF1A` → `#E3FF23`, night `#0f100e` →
`#0a0a0a`, copy Inter → Space Grotesk (the fastr30.com file, OFL). Archivo stays: it is
the fastr30.com display face. The wordmark file is untouched (Fabi's call, question 2).

## Images 04–07: what the in-use pool can and cannot do

Live in use: `hero-road` (b/w motion blur, video + 1280×720 still), `corridor` (1254²),
`texture-fabric` (1254²). Prepared but **not live**: merch hoodies "NOT DONE DREAMING."
(6 colourways, 660×825, fastr30 PR #3). All are smaller than the current 2400 px chapter
images and their origin (photo or AI) is not recorded in the repo. None of them carries a
full-bleed chapter without losing quality, so nothing was swapped.

## Open questions for Fabi

1. fastr30.com takes **live pre-orders** for the STICK (€ 14,90, "Launch-Preis,
   unverbindlich"). The OG page said "Keine Vorbestellung" — removed as contradictory.
   Should the OG STICK chapter link to the fastr30.com pre-order? (outward-facing, his call)
2. Which yellow is the master? Recommendation: `#E3FF23`, because it is what people see
   on both live sites and in the approved guidelines. Then the OG FASTR wordmark files
   (`#DEFF00` / `#E7FF1A`), `_BRAND_STATUS.md` and the `fastr-design` skill follow.
3. Do real photos from FASTR runs exist (own, rights clear, no other clubs' shirts)?
   That is the only in-use material that could replace 04/05/07 at full quality.
   Without them: keep the stills labelled, or set 05 FASTR30 / 07 Live as deck-v26
   number frames ("100 M.", live board) — in-use brand language, sharp at any size, but
   close to the typographic plates rejected in v1.
4. 06 apparel: switch to the merch hoodies once fastr30 PR #3 is live? (The lavender
   hoodie matches the OG lavender.)
5. Where are `hero-road`, `corridor`, `texture-fabric` from (own shoot, stock, AI)?
