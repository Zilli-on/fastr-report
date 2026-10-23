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
| 08 | FASTR STICK | fastr30.com shop renders: lime product shot + exploded view in both colourways (unchanged) | Produktvisualisierung · Prototyp, kein Serienprodukt |
| 09 | Invitation + signature | original OG SPORTS mark | — |

## System

- **Type.** Chapter titles: Archivo, wide (font-stretch 112 %), weight 750,
  uppercase, tight — the sport-brand voice. Copy: Space Grotesk (2026-10-24, as on
  fastr30.com and in the FASTR Brand Guidelines). Captions and labels:
  system monospace, 11 px, uppercase. The opening title stays the approved
  light outline "Own greatness." — light opening, heavy chapters.
- **Fonts are self-hosted** (`site/fonts/`, latin subsets, SIL OFL 1.1,
  licences next to the files). No requests to font services.
- **Grounds.** Paper `#f0efea` and night `#0a0a0a` (FASTR black, as on fastr30.com); images run edge to edge.
- **Accents.** Lime `#E3FF23` (FASTR Brand Guidelines, fastr30.com, fastr-vienna) only in the FASTR
  world: FASTR30 title, rule numbers, the STICK. Lavender stays OG SPORTS.
- **Links** are uppercase text with a short rule that grows on hover.
- **Motion.** Large images settle once (slight scale) and the FASTR30 field
  fills once when seen. Nothing loops. Complete without JS and with reduced motion.

## No third-party brands

- 01: the On mark on the heel removed by inpainting (OpenCV, local).
- 03: bibs, ribbons, club shirt and banner text removed with an AI-assisted
  retouch (Higgsfield, GPT Image 2.5, reference edit); faces, poses and light
  compared side by side and unchanged.
- 02, campaign studies, apparel visual: checked, no legible marks. The STICK renders carry only the FASTR mark.
- Tests fail if `run-detail.webp` / `run-community.webp` (originals with marks)
  or the rejected stock files return.

## Sources and reproduction

`scripts/prepare_images.py <sources>` writes every campaign image from its
source (crop, size, quality listed in the script). The STICK images are
the fastr30.com shop renders (`fastr30-website/website/assets/img/stick-*.jpg`, 3D render delivery), copied byte for byte and hash-tested
(update 2026-10-23 late, replacing the Blender render of the CAD draft).

## Truthfulness boundaries

- Hero and 04/05/07 are AI image studies. They show no event that took place
  and no OG team member.
- 06 is an AI visualisation of colour studies, not a product photograph.
- 08 are 3D product renders, not photographs of a manufactured stick; the
  STICK is a prototype, not a production product; 30 ml is a target.
- AI Act Art. 50: the AI labels are visible on the page, not only in notes.
- Contact: local, copyable draft only.
