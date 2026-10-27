# OG SPORTS 10/10 loop — HANDOFF

_Written 2026-10-27 ~12:40 (Europe/Vienna) by the Claude session that ran RC9/RC10 (worktree
`vigorous-jang-669543`, repo `C:/Users/Fabien/fastr-report`). This document is the authoritative source
for the next session. (`docs/HANDOFF.md` is an unrelated migration note from 21.10.)_

## Git state
- **Branch**: `feat/og-sports-web` (draft PR #1, Zilli-on/fastr-report — never merge/deploy without Fabi)
- **HEAD**: `9df8174` — fix: v4 RC10 - shoe logo removed, way in under the people, compact temple
  (pushed; `git ls-remote origin refs/heads/feat/og-sports-web` → `9df81742…`)
- **Last green commit**: `9df8174` — `npm run check` 21/21 pass + build 137 files, `prepare_responsive.py --check`
  (17 originals, 101 WebPs, no upscaling), `pillars.py --check` OK, run in this session before the commit
- **Working tree**: clean except this handoff (committed with it)

## Build
- **Build path / command**: `cd og-sports && npm run check`; image checks with venv `C:/Users/Fabien/AppData/Local/Temp/ogcv/Scripts/python.exe scripts/prepare_responsive.py --check` and `… scripts/pillars.py --check`
- **Result**: PASS — `ℹ pass 21 · ℹ fail 0 · Built 137 files into dist/`; `Responsive sources verified: 17 originals; 101 WebPs; no upscaling`

## Sprint
- **Current sprint goal (P0)**: OG SPORTS website to 10/10 by Fabi's measure — both outside reviewers ≥ 9 on every criterion of `docs/TEN_OF_TEN.md` (with repeat runs), no blocker, own look says 10/10.
- **Completed work**:
  - Measure `docs/TEN_OF_TEN.md` (8 criteria, Fabi's words; calibration R0: both families rank RC8 above rejected v1/v3; Codex repeat noise 0.5 → mean changes < 1.0 are noise).
  - Benchmark `docs/BENCHMARK_RC9.md` (Fabi 27.10.: leading brands + SOM/PROJECT50): SOM, PROJECT50, Creators Club, Nike Running, Tracksmith, Satisfy captured live; boards in `og-sports-sources/review/refs/`.
  - RC9 `208a682`: sprint crew in I Run, Make before Meet, doors as rows, temple second colours, gap removed, image-notes truth fix. R1 (with refs): Codex 6.25, Kimi 7.00 (RC8 5.88/6.88) — noise band.
  - RC10 `9df8174`: On logo + CLOUDTEC removed from strip 01 (Higgsfield GPT Image 2.5, logo area composited, rest original), way in directly under Meet's people, temple all 4:3, balanced headings, strip captions, phone swatches. Details and finding-by-finding table: `docs/RC9_RESULT.md`.
  - Leitstelle informed at RC9 (Leitstelle replied: 2 runs per family per round; 5 Fabi questions bundled to him; nothing linked/invented until answers).
- **Last real mouse/keyboard test**: none this sprint (only headless Chrome captures with scripted scroll; the 3D STICK was mounted and scrolled in headless Chrome with WebGL, `3D ready True`).

## Open problems
- **Open P0 issues**:
  - RC10 not yet reviewed (R2 pending). Highest remaining risks per R1: K1/K7 (Make chapter static reads as info block; overall "black + big uppercase" vocabulary), K3 (way in now type under the Meet photo — check whether reviewers accept the pairing).
  - Rubric change from R2: Fabi's protected picks (opening, strip 01–03) not scored on motif; prompt explains sheet ends and the interactive STICK sheets. R1/R2 scores for K3/K4 therefore not strictly comparable.
- **Reproducible failure steps**: n/a — no failing check; the open items are design judgements, not reproducible faults.

## Map
- **Relevant files & classes**: `og-sports/site/index.html` (chapters; temple between `<!--pillars-->` markers is generated), `site/styles.css` (one stylesheet; §6c temple, §7 OG FASTR, §8 projects incl. `.live-cta`, `.stick*`, §9 `.connect`/`.way`), `site/script.js:13` (project order challenge, apparel, stick, live), `scripts/pillars.py` (pillar rows), `scripts/prepare_responsive.py` (RC9 dict: run-crew; protected 01 now `masters/run-detail-clean-rc9.png`), `scripts/responsive_markup.py` (sizes), `tests/site.test.mjs`, `docs/TEN_OF_TEN.md`, `docs/RC9_RESULT.md`, `docs/BENCHMARK_RC9.md`.
  Outside the repo: `C:/Users/Fabien/og-sports-sources/review/` — `capture.py` (sheets with tokens + SHA, `--motion`, extra `sheet-stick-*` boards), `review.py` (Codex/Kimi blind review, token + ReadMediaFile checks, reference boards), `ref_capture.py`, `run_round.sh`, `rounds/R0…R1`; `rc9-candidates/` (manifest, run-crew retouch, shoe composite + AI variants).
- **Commands & tests to run**:
  - capture: `cd C:/Users/Fabien/og-sports-sources/review && C:/Users/Fabien/AppData/Local/Temp/ogpw/Scripts/python.exe capture.py --ref 9df8174 --round R2 --version A`
  - review (2 runs per family, Kimi runs not in parallel): `… review.py --round R2 --version A --agent codex`, `… --agent codex --tag=_r2`, `… --agent kimi`, `… --agent kimi --tag=_r2`; verdicts in `rounds/R2/reviews/*.verdict.json`
  - quota first: `python C:/Users/Fabien/Documents/Arbeit/CLAUDE.MD/scripts/baton/baton.py quota`
  - push: `git -c http.lowSpeedLimit=0 -c http.lowSpeedTime=999999 push origin feat/og-sports-web`, then `git ls-remote`
- **Tool / environment gotchas**:
  - Bash tool halves backslashes: Windows paths in Python only via Write tool (bit once today).
  - github.com flaps (connect timeouts): retry loop with 40 s pause; check `git ls-remote`, not the push exit of a pipe.
  - `codex` on PATH is a .cmd shim → review.py uses the native `codex.exe` under npm vendor.
  - Kimi answers sometimes close „…" with ASCII quotes → parser repairs it; check `problems` in the verdict.
  - Python `write_text` on Windows writes CRLF; git normalises to LF (warnings are harmless).
  - Full-page Playwright screenshots resize the viewport and break svh layouts → capture.py stitches viewport frames.
  - Higgsfield GPT Image 2.5 returns 688×1024 for 2:3 → never ship it directly, composite only the edited area.
  - RAM was tight (2.4 GB free at start): one browser/review job at a time.

## Boundaries
- **Forbidden scope**: no merge to master, no deploy, no posting, no mails/accounts, no new paid services (Higgsfield credits for OG images are approved — report use: 0.5 today); do not touch other repos; do not replace Fabi's protected picks (opening, strip 01–03) — retouching third-party marks is allowed; do not link Strava/Instagram/Telegram or the STICK pre-order until Fabi answers; nothing invented (no events, partners, numbers, prices); FASTR is a sprint club (no "every pace").
- **Next first step (exact)**: run `baton quota`, then capture R2 from `9df8174` (`capture.py --ref 9df8174 --round R2 --version A`), look at the sheets yourself (stick boards, temple, way in at 390/1440), then start the four R2 reviews and compare with R1 in `docs/RC9_RESULT.md`.


## Update 2026-10-27 ~15:30 (same session, continued on Fabi's word „weiter bis 10/10 … davor nicht aufhören")

- R2 on RC10 `9df8174`: Codex 6.88 / 6.38, Kimi 7.12 / 7.25. RC11 `b951fd3` pushed (people carry the way in,
  quiet light voice for temple + way in, nav „Säulen 05", gaps). R3 on RC11: Codex 6.88 / 6.88, Kimi 7.75 / 8.00.
  Scores and findings: `docs/RC9_RESULT.md`.
- RC12 in the working tree (not yet committed when this was written): hero note names OG SPORTS → FASTR sprint
  club; run copy „Kurz. Schnell. Gemeinsam. FASTR ist unser Sprint-Club."; manifest photo 1/7 + lines centred;
  FASTR30 one primary action; „Anfangen" as a lime band, other doors smaller; Make static = three stills of our
  own 3D model (`site/assets/stick-{form,build,function}.webp`, `rc9-candidates/stick3d/render_states.py`), temple
  Make tile = 3D section; tablet 768–899 full-bleed people chapters 4:3; phone strip captions below the photos;
  `stick-pink.jpg` removed again (unused).
- Next first step: `npm test`, both `--check`s, commit RC12, push (retry loop), then R3→R4:
  `capture.py --ref <sha> --round R4 --version A` and `bash run_pair.sh R4 A`.
- Fabi asked to be sent the link only when 10/10 is reached (reviewers ≥ 9 everywhere, repeat runs, own 10/10).


## Stand RC14 (2026-10-27 ~18:00) — authoritative for the next session

- Pushed: RC11 `b951fd3`, RC12 `be7f99e`, RC13 `ddf8eab`, RC14 = the commit that carries this section.
- Last scored round R5 (on RC13 `ddf8eab`, two runs per family), per criterion K1–K8:
  - Codex: 6 6 7 7 8 6 7 7 (both runs identical, mean 6.75)
  - Kimi: 7 8 8 8 9 7 7 8 (7.75) and 8 8 8 9 10 7 8 8 (8.25)
  - Progression of means: RC8 Codex 5.63 / Kimi 6.88 → RC13 Codex 6.75 / Kimi 8.00.
- R5 saw a CSS fault (duplicated static-Make rules → three narrow columns at 390); RC14 fixes it, so R5's K6/K8 for
  Make are not representative. RC14 also: run copy keeps „Sprint‑Club" together (U+2011), less black between Run,
  band and FASTR30, the seven standards as a two-column index from 1100 px, static Make still = 3D section,
  temple Make tile = 3D form still. RC14 is NOT yet scored (R6 is the next step).
- Still open after R5 (Codex, the bottleneck): K1/K7 the way in still reads as an info block next to the
  references (lime band + two rows); K2 page length (temple + five chapters, gaps); K3 Meet silhouettes feel
  distant (no better licensed people image found; searched Unsplash/Pexels widely, see rc9-candidates s1–s5);
  K6 phone length; K4 „Run reads as running, not sprint" (no faceless landscape sprint image of equal quality found).
- Reviewer tooling (outside the repo, `C:/Users/Fabien/og-sports-sources/review/`): `capture.py` (decode timeout added —
  lazy images inside display:none never decode), `run_pair.sh <round> A`, `elshot.py <width> <selector> <out> …`
  for quick element screenshots, `probe.py`.
- Next first step: `capture.py --ref <RC14 sha> --round R6 --version A`, then `bash run_pair.sh R6 A`.
- Higgsfield today: 0.5 credits. Codex weekly quota was 10 % at R2; check `baton quota` first.
