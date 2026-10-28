# OG SPORTS — what 10/10 means (fixed 2026-10-27, before RC9)

Fabi, 27.10.2026 ~02:45, after RC8: *„sehr gut mache weiter an der website bis sie dir 10/10
gefällt und auch für das steht was uns wichtig ist"*.

**Target measure: Fabi's verdict.** Everything below is a **surrogate** for it:
the two outside reviewers (Codex, Kimi), my own judgement and the mechanical checks. A surrogate
decides nothing until it has been paired with Fabi's verdict on several versions (failure 060).
The pairs we have on the *visual* level: v1 `fa0014d` („noch nicht high end", 23.10.), v3 `cfa8901`
(„gefällt mir leider noch nicht von der Umsetzung", 24.10.), RC8 `0f17e0e` („sehr gut", not yet 10).
v2 `9792de0` is no visual pair: Fabi's objection there was provenance (Higgsfield stills = „Ideen-Dump",
build from assets in use), which the reviewers are told not to score. (Corrected 27.10.: the first draft
of this file attributed „noch nicht high end" to v2; it was said about v1.) Round R0 scores these
versions blind. If the reviewers do not rank RC8 above v1 and v3, their scores do not steer this loop.

**R0 calibration (27.10., blind, one version per run, mean of K1–K8):**

| Version | Fabi | Codex | Kimi |
|---|---|---|---|
| v1 `fa0014d` | rejected | 5.12 | 6.25 |
| v3 `cfa8901` | rejected | 5.12 | 6.00 |
| v2 `9792de0` | (provenance, no visual pair) | 5.88 | 6.50 |
| RC8 `0f17e0e` | „sehr gut" | 5.88 · repeat 5.38 | 6.88 |

Both families rank RC8 above both rejected versions: the surrogate points the right way. But Codex's
repeat on identical sheets moved 0.5, as much as the gaps. **A change of the mean below 1.0 is noise
and decides nothing.** The loop is steered by findings, each confirmed by me on the page; the finish
line (every criterion ≥ 9 from both) lies far outside that noise and is checked with a repeat run.

**From R1 on (Fabi 27.10.: „vergleichbare pro websiten von großen leading marken … + unser vorbild
somstudio natürlich mit project50"):** every review also gets reference boards of SOM Studios,
PROJECT50, SOM Creators Club, Nike Running, Tracksmith and Satisfy (captured live, `docs/BENCHMARK_RC9.md`).
K1 and K7 are judged against them. R0 had no boards, so K1/K7 of R0 and R1 are not strictly comparable.

**Done** = both outside reviewers give every criterion ≥ 9 in the same round, no blocker is open,
and I say 10/10 after looking myself. What only Fabi can supply (list at the end) is **not** counted
against the score and **not** invented.

## Rules for every round (failures 058, 059)

- Each criterion is scored on its own; the text says what it is independent of. A fault found while
  scoring goes into the *next* round's rubric, not into this one.
- Each round uses new file names; every review sheet carries a printed token and its SHA-256 is in
  the prompt. A review counts only if it quotes every token **and** names one visible detail that is
  true of this version (checked by me against the sheet). Otherwise the round is void.
- Sheets are full-page captures at 390×844@3, 768×1024@2, 1440×900@2 (reduced motion, installed
  Chrome), cut into slices; the white gaps between slices are seams of the sheet, not of the page.

## The eight criteria

Each is scored 0–10. Anchors for all: **10** = nothing to change, would stand next to SOM / Satisfy /
Leica as its own culture · **9** = only details a visitor would not notice · **7** = good, one
visible weakness · **5** = an average template site · **≤ 3** = works against the brand.

### K1 — Every chapter at hero level
> „Alle Kapitel müssen dieselbe Qualität und visuelle Souveränität wie der Hero besitzen."
> „Wenn das Hero-Kapitel unvergesslich, der Rest aber bloß ordentlich ist, ist die Aufgabe nicht erfüllt."
> (brief 22.10., `og-sports/CLAUDE.md` §§ 0, 6)

Score = the **weakest** chapter (opening, strip, manifest, temple, I Run, II Practice, III Wear,
IV Make, V Meet, the way in, signature), name it. Compare each chapter with the reference boards: would it
hold its own next to the SOM, PROJECT50, Nike Running, Tracksmith or Satisfy screen beside it? A chapter fails if it reads as one of Fabi's
kill-words: „netter Infoblock", „generische KI-Webseite", „vier schöne Kästen", „Agenturportfolio",
„PPT-Folie", „wahrscheinlich Stock", „tolles Konzept, aber kein echtes Brand-Feeling".
Independent of K2 (amount), K3 (image quality) and K6 (phone): judge the 1440 sheets.

### K2 — Calm and scale, not quantity
> v3 verdict (24.10., `docs/NEXT-v4.md`): „too many sections, too much text, too little calm and scale";
> „Fewer, bigger moments … no paragraph longer than two lines on desktop"; „One loud headline per
> screen, not per section". Brief: „Zu viel erklärender Unternehmens-/Pitch-Deck-Text" rejected.

Counts: repeated content (the same image, line or product shown twice in a row), dead empty areas
that are not composition, paragraphs over two lines on desktop, more than one loud headline in one
900 px screen, sections that could be cut without loss. Independent of image quality (K3).

### K3 — Images that carry weight
> v4 (`docs/NEXT-v4.md`): „Photography of people carries every chapter … No chapter is carried by a
> type plate." Brief: „Fotografie nur, wenn sie auf dem Qualitätsniveau der ersten vier akzeptierten
> Bilder mitspielen kann." v3 rejected: fisheye, selfie look, shirtless, no community.

Counts: sharpness at the shown size, crop (no cut heads, hands, products), whether the image fits the
line it carries (an empty field under „Good things start with people" does not), a grade that holds
the page together, people and sport. Independent of provenance: licensed stock is allowed (Fabi
24.10.) and is judged by quality, not by being stock. Labels are K5.

### K4 — Brand core visible
> „Die Website muss der Tempel sein, der uns alle Säulen präsentiert und vereint." — *Create your
> own luck* (Fabi 24.10., `docs/ART_DIRECTION.md` v3). Brand language (brief § 3): ORIGINAL GRIND.
> OWN GREATNESS. · EARNED. NOT GIVEN. · GO WHERE YOU GROW. · FOR EVERY VERSION OF YOU.
> „OG SPORTS ist die Dachmarke … OG FASTR / FASTR ist eine Bewegung innerhalb dieses Ökosystems."
> Footer and opening: Vienna.

Counts: a first-time visitor understands within one scroll that OG SPORTS is the roof and FASTR the
movement; Original Grind as foundation and Own Greatness as roof are felt, not explained; FASTR reads
as **sprint** (Fabi 22.10.: „Nein, das ist ein Sprint-Club."); the place is Vienna — an image that
names or plainly shows another city as ours counts against it. One idea per chapter, no stacked claims.
Independent of K5 (truth of labels) and K1 (visual level).

### K5 — True, not invented
> „nur mit wahren Daten" (Fabi 10.07.); „keine anderen Marken" (23.10.); KI-Videos „nicht echt und
> professionell" (23.10.); „Logo verzerrt" (26.10.); AI Act Art. 50 (memory, since 02.08.2026).

Counts: every non-photograph visibly labelled where it is shown; no third-party brand or other club
name legible; logos are the real vectors, undistorted; no invented events, partners, numbers, dates,
prices or availability; no AI video; FASTR never promises „jedes Tempo"; image notes and status texts
match the files actually shipped. Independent of whether the labels look good (K7).

### K6 — Phone equal to desktop
> „Gestalterische und funktionale Qualität muss am Handy genauso hoch sein wie am Desktop." (brief § 4)
> „du entscheidest alles, auch bezüglich Handy" (Fabi 26.10.)

Score the 390 and 768 sheets on their own: composition, crops of people, type sizes, rhythm, nothing
cramped, nothing clipped, no awkward wraps, thumb-sized actions. Independent of the desktop score.

### K7 — Its own handwriting, not a template
> „eine unverwechselbare OG-SPORTS-Handschrift, keine Kopie von SOM"; rejected: „die kalte,
> austauschbare AI/Codex-Webdesign-Ästhetik", „Luxussimulation durch bloße Schwarz-Weiß-Flächen,
> große Worte", „Jede Sektion mit demselben offenen Rahmen oder demselben typografischen Trick"
> (brief §§ 0, 2). „Außergewöhnlich, aber clean."

Counts: would this page be recognisable with the logo covered; typography (OG upright, FASTR italic,
lime = FASTR, lavender = OG) used with intent; varied rhythm; no card grids, no generic CTA boxes;
the self-check of the brief: „Würde diese Marke neben einer hervorragend umgesetzten SOM-, Satisfy-,
Leica- … Website als überzeugender eigener kultureller Auftritt bestehen?" — answered against the
reference boards: does the page convey motivation and a way of life as strongly as SOM / PROJECT50 and the
leading sport brands, in its own handwriting and without copying their shop patterns?

### K8 — Craft without faults
> „Keine abgeschnittenen Headlines, deformierten Logos, zufälligen Zeilenumbrüche oder horizontalen
> Scrollbars." „Kein Projektbild, dessen schlechter Crop Menschen oder Produkte unglücklich
> abschneidet." (brief § 5 Phase D)

Counts: visible faults on any sheet — clipped or colliding text, a label over a face, orphan words,
a caption wrapping badly, misaligned edges, contrast too low to read. Mechanical part (mine, not the
reviewers'): `npm test`, `prepare_responsive.py --check`, `pillars.py --check`, no console errors,
no external requests, no horizontal overflow at 320–1920.

## Not counted — only Fabi can supply (questions, not tasks)

1. Real photographs of FASTR runs / a real group after a run (would replace the AI opening study and
   the illustrative photos; „Garage Sprints / Auswahl Post" is empty).
2. Real event photos for IV Meet (no event has been documented).
3. Master yellow for the logo files (`#E3FF23` vs `#DEFF00` / `#E7FF1A`).
4. Whether the STICK chapter links to the live fastr30.com pre-order.
5. Releases from members for any picture showing them.
6. Merge, live deploy, domain.
7. Fabi's protected picks (brief § 2, „unbedingt schützen“): the opening image and the strip 01–03 — their
   motif, crop and colour are his decision; reviewers judge craft, labels and third-party marks there, not the
   choice of motif (from R2; R1 Kimi marked strip 03's colour and skyline, which is his pick).
