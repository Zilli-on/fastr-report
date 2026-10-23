# OG SPORTS — Art direction (current, 2026-10-23)

Supersedes `REVIEW7_ART_DIRECTION.md` and `REVIEW8_ART_DIRECTION.md` (kept as history).

## The principle: every chapter is a frame

The opening worked because it is one confident image with one light, very large line
of type. Below the fourth image the old page turned into a stack of differently styled
blocks. The fix is one rule for the whole scroll:

**The page is a sequence of ten frames, 00–09. Where we have honest photography we show
photographs; where we do not, we show authored image plates. Every frame carries the
same caption.**

| Frame | Chapter | Ground | Image | Caption, right side |
|---|---|---|---|---|
| 00 | Opening | photo | approved AI image study `after-the-run` | image notes (i) |
| 01–03 | Culture: detail, motion, people | paper | the three approved Unsplash photographs | photographer / Unsplash ↗ |
| 04 | OG FASTR — movement | night | *Routes*: 23 different paths settle into one direction; one lime route is "you" | our routes are never the same. our direction is. |
| 05 | FASTR30 — practice | night | *Practice field*: 30 days × 7 standards; the standards are the row labels | challenge concept · not health advice |
| 06 | Apparel — Wienerwald | paper | *Line sheet*: one jersey flat in four colour studies | concept flats · not a collection, not for sale |
| 07 | Live | paper, dark plate | *Gathering*: people arrive and stand in small circles; one lavender route closes the large circle | format sketch · no date yet |
| 08 | FASTR STICK | paper, studio plate | *Drawing*: view A and half section A–A, proportions from CAD draft V0 | drawn from CAD draft V0 · untested, not a product |
| 09 | Invitation + signature | night | the original OG SPORTS mark, full width | — |

The honesty notes that used to be disclaimers are now part of the caption grammar:
the place where a photograph names its photographer is where a plate states its status.

## System

- **Two grounds only.** Paper `#f1f0eb` and night `#121411`. The rhythm is
  photo → paper → night (OG FASTR, FASTR30) → paper (things we make) → night (close).
  Plates may sit as dark or light frames *inside* paper, like the photographs do.
- **One display voice.** Light, mixed-case, tight display type for every chapter title,
  the same voice as "Own greatness." No uppercase poster headlines, no two-colour
  headline trick. Uppercase is reserved for the FASTR30 standard names (fixed brand terms).
- **One caption voice.** Monospace, 11 px, uppercase, for frame numbers, captions and
  labels. It reads like a contact sheet, which is what the page is.
- **Accents with a job.** Lavender belongs to OG SPORTS (the "you" route in Live, "Same
  feeling."). Lime `#E7FF1A` is taken from the OG FASTR wordmark and appears only in the
  FASTR world (route, practice field, the stick body).
- **No decoration.** No corner brackets, no arrows on non-links, no floating navigation,
  no glow, no radar circles. Links are underlined text.
- **Motion, once.** Three plates draw themselves the first time they are seen: the
  routes, the practice field (day by day, `steps(30)`), the gathering. Nothing loops.
  Without JavaScript or with `prefers-reduced-motion`, every plate is shown complete.

## Fonts

No font files are shipped (project rule). The stack is Inter Display / Inter →
Helvetica Neue → Arial; captions use the system monospace. Windows visitors without
Inter see Arial, Mac visitors Helvetica Neue. The opening words are outlined SVG and
look the same everywhere. **Launch decision:** a self-hosted, licensed webfont (Inter is
SIL OFL) would make the typography identical on every device; that needs an explicit
change of the "no bundled fonts" rule.

## Plates are generated, not hand-pasted

`scripts/authored_art.py` writes the SVG for routes, jersey, gathering and stick between
`<!-- art:name -->` markers in `site/index.html`. Edit the generator, then

    python scripts/authored_art.py --write
    python scripts/authored_art.py --check   # fails if index.html and generator differ

The jersey is one `<symbol>`; colourways are CSS custom properties on `.flat-*`.
The stick proportions come from the CAD draft V0 parameters (outer diameter, closed
height, bore, cup stroke, thread pitch). Those dimensions are proposals, not confirmed
and not tested; the drawing prints no numbers.

## Truthfulness boundaries

- Hero: an AI image study. The 4× file is a Lanczos resample with light sharpening; it
  enlarges the format, not the detail. The image notes show the unchanged 1,373 × 485 px
  original.
- 01–03: real reference photographs, not our people, products or events. The licence is
  not a model, property or trademark release (visible brand marks: On shoe, race bibs).
- No photography below frame 03. The three previously rejected stock files were deleted
  from `site/assets` (they remain in Git history).
- Apparel: colour studies, not production colours, not a collection.
- Live: a format sketch. No date, venue, line-up, partner or ticket is claimed.
- STICK: drawing after a CAD draft; fit, sealing and fill volume untested; 30 ml is a target.
- Contact: a local, copyable draft. Nothing is sent or stored.

## Code structure

- `site/index.html` — content, generated plates between markers
- `site/styles.css` — the only stylesheet: tokens, base, shared parts, one section per
  chapter, dialogs, motion, responsive (≤1180, ≤899, ≤600, ≤420, ≥1700), print
- `site/script.js` — language, dialogs, project stories (cover = clone of the page
  plate), deep links, contact draft, one-time motion trigger
- `scripts/visual_review.py` — the browser suite; `review7_visual.py` / `review8_visual.py`
  are the CI entry points the workflow names
