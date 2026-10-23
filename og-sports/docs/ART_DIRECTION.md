# OG SPORTS — Art direction (v2, 2026-10-23)

Supersedes the v1 "every chapter is a frame" plates (same day) and Review 7/8.

## Why v2

Fabi on v1: clean, but not yet high-end. The authored line plates (routes,
dots, jersey flats) read as concept graphics next to a hero that is a real
image. References he named: the opening of SOM Studios, big sport brands, F1.
What those have in common is image weight and one loud type voice, not graphics.

## The principle: campaign, not concept

Every chapter carries a real image at full weight. Where we have no honest
photograph we use our own campaign studies, an AI visualisation or a render —
and say so in the caption, exactly where a photograph would name its author.

| | Chapter | Image | Label |
|---|---|---|---|
| 00 | Opening | approved AI image study (unchanged) | image notes (i) |
| 01–03 | Strip, edge to edge (SOM-like) | three Unsplash photographs, brand marks retouched | photographer / Unsplash |
| — | Statement | "For every version of you." | — |
| 04 | OG FASTR | full-bleed ramp sprint, own Higgsfield study | KI-Kampagnenstudie |
| 05 | FASTR30 | spiral car park from above, own Higgsfield study + seven-column rule grid | KI-Bildstudie · Challenge-Konzept |
| 06 | Apparel / Wienerwald | four jerseys on a rail, AI visualisation of the colour studies | KI-Visualisierung · keine Kollektion |
| 07 | Live | empty glass-dome car park, own Higgsfield study | KI-Raumstudie · noch kein Termin |
| 08 | FASTR STICK | Blender studio render of the CAD draft V0 + generated half section | Render aus CAD-Entwurf V0 · ungeprüft |
| 09 | Invitation + signature | original OG SPORTS mark | — |

## System

- **Type.** Chapter titles: Archivo, wide (font-stretch 112 %), weight 750,
  uppercase, tight — the sport-brand voice. Copy: Inter. Captions and labels:
  system monospace, 11 px, uppercase. The opening title stays the approved
  light outline "Own greatness." — light opening, heavy chapters.
- **Fonts are self-hosted** (`site/fonts/`, latin subsets, SIL OFL 1.1,
  licences next to the files). No requests to font services.
- **Grounds.** Paper `#f0efea` and night `#0f100e`; images run edge to edge.
- **Accents.** Lime `#E7FF1A` (from the OG FASTR wordmark) only in the FASTR
  world: FASTR30 title, rule numbers, the STICK. Lavender stays OG SPORTS.
- **Links** are uppercase text with a short rule that grows on hover.
- **Motion.** Large images settle once (slight scale) and the FASTR30 field
  fills once when seen. Nothing loops. Complete without JS and with reduced motion.

## No third-party brands

- 01: the On mark on the heel removed by inpainting (OpenCV, local).
- 03: bibs, ribbons, club shirt and banner text removed with an AI-assisted
  retouch (Higgsfield, GPT Image 2.5, reference edit); faces, poses and light
  compared side by side and unchanged.
- 02, campaign studies, apparel visual, render: checked, no legible marks.
- Tests fail if `run-detail.webp` / `run-community.webp` (originals with marks)
  or the rejected stock files return.

## Sources and reproduction

`scripts/prepare_images.py <sources>` writes every campaign image from its
source (crop, size, quality listed in the script). `scripts/render_stick.py`
renders the STICK from the CAD previews of the local prototype programme
(`fastr-stick-prototype/output/preview/*_assembled.stl`).
`scripts/authored_art.py` still generates the STICK half section.

## Truthfulness boundaries

- Hero and 04/05/07 are AI image studies. They show no event that took place
  and no OG team member.
- 06 is an AI visualisation of colour studies, not a product photograph.
- 08 shows CAD geometry with proposed dimensions; material and light are art
  direction; fit, sealing and fill volume are untested; 30 ml is a target.
- AI Act Art. 50: the AI labels are visible on the page, not only in notes.
- Contact: local, copyable draft only.

## Motion (video loops, 2026-10-23)

Four campaign stills move: OG FASTR ramp, FASTR30 spiral, Wienerwald jerseys, Live
garage. Each is a 6 s image-to-video generation (Higgsfield, Grok Video 1.5, 1080p,
started from our own still), graded and cross-faded into a seamless ~5 s loop by
`scripts/build_media.py` (`site/media/*-loop.mp4`, 1.1–3.9 MB, H.264, no audio).

- The still stays in the page as `<img>` and as the video poster; the loop fades in
  only once it plays. No JS, reduced motion or no IntersectionObserver: no video is
  loaded at all.
- Loops play only while visible and each has a pause button (WCAG 2.2.2).
- The captions already say KI-Kampagnenstudie / KI-Bildstudie / KI-Visualisierung /
  KI-Raumstudie — the motion is AI-generated as well.

Not used: Vali's real Prater footage (2026-09-20). The shirts carry another club's
brand ("BREIT & SCHNELL Hybrid Run Club") and the socks/shoes third-party marks;
that cannot be retouched cleanly in motion.

Brand film (not on the page): `build_media.py` also cuts a ~26 s silent film in 16:9
and 9:16 from the same clips plus the STICK render, with Archivo title cards and a
permanent "KI-GENERIERT" mark, into `OG Sport/Content/OG SPORTS Film/` (outside the repo).
