> Historical. Superseded by `ART_DIRECTION.md` (2026-10-23).

# OG SPORTS — Review 7 / The brand after the photographs

This iteration is a decisive response to direct art-direction feedback: the first image feels right, and so do exactly the three subsequent editorial photos; the rest of the homepage falls below that standard.

## In
- One preserved (non-regenerated) opening AI-study composition. Conservative **4× display interpolation** without any new people/faces. This is NOT the same as recovering original detail.
- Three unchanged, credited, liked editorial run-culture photographs.
- A single commanding, predominantly charcoal OG FASTR chapter with existing original mark, “Go where you grow.” and a restrained acid-lime accent.
- FASTR30 expressed as a precise daily practice integrated into the movement rather than a separate lilac landing-page tile. The seven official standard names are carried directly.
- Four independently styled **typographic project studies** (FASTR30, Apparel, Live Experiences, FASTR STICK) in one full-width index, with genuine click-through project dialogs. Graphic swatches indicate exploratory color, not released clothing.
- A typographic people-first closing, with three clear participation routes and the original mark.

## Out
- The disliked Montréal runner / cycling road image / AI rooftop from lower homepage sections and project detail covers.
- Photography-as-filler, four equal-sized product cards, pseudo-premium badges, exaggerated motion, unsupported claims, false event bookings and shopping functions.
- The redundant Hero Move/Meet/Make switcher, which allowed a user-approved image to be replaced by an image they disliked.
- The photographic mega-menu stage. The overlay navigation is now deliberately typographic.

## Hero image limitation
Original: `after-the-run.webp` (1373×485, retained and hash-checked).
Display: `after-the-run-display-4x.webp` (5492×1940, Lanczos + mild sharpening).
This preserves the subject, framing and pixel-derived content, but cannot reconstruct genuine missing detail. A specialized AI upscale was attempted but did not produce a usable result; do not claim this is AI super-resolution.

## Source integrity and rights
All three editorial photos are Unsplash-sourced visual references with visible links; no implied relationship to OG SPORTS. Original OG SVG files retained byte for byte. The commercial model/property/trademark position has not been independently cleared. The photo-led upper part remains a **design study**, not documentary evidence.

## Delivery
Single GitHub feature branch `feat/og-sports-web`, existing draft PR, no merge, no Vercel production action.
A visual regression script checks the real built website at multiple viewport widths, including the redesigned document, modal interactions and imagery boundary. Screenshots must be inspected visually. This document is a rationale, not approval or proof of perfection.

## Review checkpoint (22 October 2026)
The initial Review 7 GitHub Actions run started before `scripts/review7_visual.py` was committed and could not find that file. The script is now present in the branch. A fresh run is required before presenting CI as passing. Separate local Chromium checks confirmed the hero derivative loads, the three approved editorial photographs remain, no photographic assets appear below the culture chapter, all four project entries render, Apparel opens, and neither 390px nor 1440px has horizontal overflow. These checks are narrower than the complete CI test suite.
