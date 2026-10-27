# RC9 and RC10 — measured against Fabi's words and leading brands (27.10.2026)

Measure: `docs/TEN_OF_TEN.md`. Benchmark: `docs/BENCHMARK_RC9.md`. Review sheets, prompts, raw answers
and verdicts (outside the repo): `C:/Users/Fabien/og-sports-sources/review/rounds/R0…`, scripts
`capture.py`, `review.py`, `ref_capture.py` next to them.

## R0 → R1 (blind, Codex medium / Kimi, one run each; R1 with reference boards)

| | K1 | K2 | K3 | K4 | K5 | K6 | K7 | K8 | mean |
|---|---|---|---|---|---|---|---|---|---|
| RC8 Codex | 5 | 5 | 6 | 5 | 7 | 6 | 6 | 7 | 5.88 (repeat 5.38) |
| RC8 Kimi | 5 | 6 | 6 | 6 | 9 | 8 | 7 | 8 | 6.88 |
| RC9 `208a682` Codex | 5 | 6 | 6 | 6 | 7 | 7 | 6 | 7 | 6.25 |
| RC9 `208a682` Kimi | 6 | 6 | 6 | 7 | 9 | 8 | 7 | 7 | 7.00 |

Within the noise band (< 1.0). Every run valid: all tokens quoted, version detail true of the sheets,
Kimi's stream read every sheet.

## RC9 (`208a682`)

I Run: B&W night sprint crew (Hansheng Zhao / Unsplash, singlet print softened) instead of the Melbourne
skyline; Make before Meet; the way in without the empty pitch, doors as rows; temple shows second colours;
the 36svh gap gone; Wear headline „Earned. Not given."; FASTR30 copy on the photo's baseline; image notes
corrected (the opening is the RC6 4K upscale, retouched — the old text said „unchanged 1,373 × 485").

## Findings from R1 that were real (checked on the page) and what RC10 does

| Finding | Who | Checked | RC10 |
|---|---|---|---|
| The large On logo (ring + bar) and „CLOUDTEC" are visible on the shoe in strip 01 — the old retouch had only removed the heel mark | Codex (blocker) | yes, at 1:1 | removed: Higgsfield GPT Image 2.5 edit (0.5 credits, 2 variants), only the logo area composited into the 1200 px master, rest original (`rc9-candidates/shoe/composite.py`); a local inpaint was tried first and left a visible patch |
| The way in is type only, no people | both | yes | it now sits directly under the people of Meet, left like their headline and one size quieter; the live-formats link moved into the Meet caption, the foot band is gone |
| Temple repeats products, long on phones | Codex | yes | all pillars 4:3: the products become details (hoodie print, STICK logo), the mosaic is about 40 % shorter |
| „YOU." alone on a line at 390 | Kimi | yes | balanced display headings, no forced break in the temple title |
| Strip captions wrap badly, arrow alone | Codex | yes | label above credit in every tile, credit never breaks |
| Swatch names wrap at 390 | Kimi | yes | names hidden visually on phones (still the button's accessible name); the chosen colour is named below |
| Make reads as an info block | Codex | partly: the reviewers only saw the reduced-motion still | the 3D stage is shown to reviewers from R2 as an extra sheet (three real scroll states, 1440 and 390); one step shortened to two lines |
| White area after the footer; seams through text | Kimi | no: sheet artefacts | sheets now cut at quiet rows; the prompt says what the white end of a sheet is |
| Strip 03 colour and skyline | Kimi | true, but Fabi's protected pick | not changed; from R2 the rubric says motif choice there is not scored (TEN_OF_TEN, not counted 7) |

Checks before each push: `npm test` 21/21, `prepare_responsive.py --check`, `pillars.py --check`,
secret grep of the diff. Higgsfield used today: 0.5 credits (balance 2604.83 before).

## R2 (RC10 `9df8174`, two runs per family, interactive STICK sheets added)

| | K1 | K2 | K3 | K4 | K5 | K6 | K7 | K8 | mean |
|---|---|---|---|---|---|---|---|---|---|
| Codex run 1 / 2 | 6 / 5 | 6 / 6 | 7 / 6 | 6 / 6 | 8 / 8 | 7 / 7 | 7 / 6 | 8 / 7 | 6.88 / 6.38 |
| Kimi run 1 / 2 | 6 / 7 | 7 / 7 | 6 / 6 | 8 / 8 | 8 / 9 | 8 / 7 | 7 / 7 | 7 / 7 | 7.12 / 7.25 |

Codex mean 6.63 against 5.63 for RC8: the first move beyond the noise band. All four runs name the same
weakest chapter: the way in, type without people. Further real findings: nav said „Projekte 04" next to five
pillars; the uppercase-sentence-with-full-stop is the only headline voice; Wear→Make paper gap; STICK caption
breaks early; tablet manifest crop cuts the hands on the shoe. Not real: two „white bands" at 768 (sheet seams).

## RC11

Meet and the way in become one moment: the three runners carry „Good things start with people.", the doors
follow directly („Hier fängt es an.", light voice); „In real life" is the chapter mark. The temple title and
the way in speak in the opening's quiet voice (light, mixed case). Nav „Säulen 05" → #pillars. Wear→Make gap
halved, STICK caption one line, tablet manifest crop keeps the hands, Make tile says „Prototyp". Review sheets:
seams hatched red and labelled, slices stacked without blank space.

## R3 (RC11 `b951fd3`) and R4 (RC12 `be7f99e`)

| | Codex run 1 / 2 | Kimi run 1 / 2 |
|---|---|---|
| R3 | 6.88 / 6.88 | 7.75 / 8.00 |
| R4 | 6.62 / 6.75 | 7.88 / 7.88 |

R4 real findings: „ANFANGEN" clipped in its lime band at 390 (Codex blocker); Meet headline at 390 ran to the edge
and lost contrast on the backlight (Kimi and Codex); temple still read as a category grid; the static Make
triptych as three equal cards; the reduced-motion band ended mid-word.

## RC13

Temple asymmetric on desktop (Run carries two rows, Practice and Wear beside it, Make and Meet below); Make
static = one large still of our 3D model (exploded) beside the steps, the temple Make tile is the 3D section on
the light stage; „ANFANGEN" and the Meet headline sized for 390, stronger veil under the Meet headline;
reduced-motion band shows three whole phrases, centred; less dead space after the doors.


## R5 (RC13 `ddf8eab`) and RC14

R5: Codex 6.75 / 6.75, Kimi 7.75 / 8.25. Real: static Make at 390 in three narrow columns (a CSS fault of RC13:
the old rules were duplicated, not replaced), „Sprint-/Club." break, black gaps Run→band→FASTR30, standards
read as a table. RC14 fixes all four; RC14 is not yet scored.
