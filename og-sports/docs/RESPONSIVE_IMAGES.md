# RC3 responsive image pipeline

`scripts/prepare_responsive.py` reads original files, never the deployed v4 WebPs.
The sole WebP source is the protected **original** AI study `after-the-run.webp`
(1373×485), not its interpolated 4× derivative. No source is enlarged.
STICK files are excluded; the existing hash tests continue to protect them and
the six original hoodie JPEGs. Hoodie WebPs are separate delivery derivatives.

## Sources

- v4 pool: `C:/Users/Fabien/og-sports-sources/v4-candidates/web/`; photographer,
  source page and license are recorded in that pool's `manifest.json`.
- `C:/Users/Fabien/og-sports-sources/masters/run-detail-clean.png` and `community-ai.png`: the existing
  approved retouched masters, copied unchanged from
  `%LOCALAPPDATA%/Temp/claude/C--Users-Fabien-Documents-Arbeit-CLAUDE-MD--claude-worktrees-og-sports-finishing-brief-a21d1f/6e994134-b87e-41fb-81f8-3e5d8f59f51d/scratchpad/src/`.
  David Moorhouse and Leviosa Hou, Unsplash License. No new retouch of 00–03.
- `C:/Users/Fabien/og-sports-sources/masters/run-shadow.jpg`: Mathias Reding, Unsplash License, original
  7008×4672 JPEG downloaded 2026-10-26 from
  <https://images.unsplash.com/photo-1758506971683-c080e6f16ce9?fm=jpg&q=100>.
  Source page: <https://unsplash.com/photos/runners-legs-in-motion-with-a-long-shadow-G96xGokbTUM>.
- Source hashes and real pixel sizes: `responsive-assets.json`.

## Reproduce

From `og-sports/`, using the already installed environments and ffmpeg:

```powershell
& "$env:LOCALAPPDATA/Temp/ogcv/Scripts/python.exe" scripts/prepare_responsive.py
& "$env:LOCALAPPDATA/Temp/ogcv/Scripts/python.exe" scripts/responsive_markup.py
& "$env:LOCALAPPDATA/Temp/ogcv/Scripts/python.exe" scripts/pillars.py --check
& "$env:LOCALAPPDATA/Temp/ogcv/Scripts/python.exe" scripts/prepare_responsive.py --check
```

`--pool` selects another pool root; `--only run-night.webp meet-night.webp`
rebuilds selected sources. The default rebuild produces every derivative.
The pipeline preserves the v4 desktop source crops, p50 ffmpeg filter and
local inpainting masks for the Meet shirt. It scales before applying p50,
as the previous pipeline did. Protected images and product renders are not graded.
WebP quality is 82, method 6. Typical widths: 640/1080/1600/2400/2880;
mobile art direction also has 1280; low-resolution sources stop at their own width.
Mobile `<source>` candidates are capped at 1600. The original fallback files remain.

Only Run and Meet get mobile source crops; CSS also makes their image containers
4:5, so the browser does not immediately crop the new composition back to a tall
viewport. Project-dialog clones retain their picture sources. 00–03 keep the
same CSS filters and positions. Every raster image has width/height; hero is eager
and high priority, all subsequent page photographs and renders are lazy.

## Evidence and gates

`rc3_evidence.py before|after` captures all 11 chapters at 390/768/1440 and records
image response payloads in `%TEMP%/og-rc3-evidence/<stage>/`. Run `before` against
the unchanged page before editing. Do not rerun it on the finished page.
`rc3_audit.py` builds `ASSET_AUDIT.md` from those measurements and the source manifest.

For this restricted worktree the build and gate outputs are redirected:

```powershell
$env:OG_BUILD_DIR = 'scripts/.rc3-build'
$env:OG_QA_DIR = Join-Path $env:TEMP 'og-rc3-evidence/gates'
npm run check
& "$env:LOCALAPPDATA/Temp/ogpw/Scripts/python.exe" scripts/visual_review.py all
```

Without these variables the existing `dist/` and `qa/` defaults remain. CI entry
points `review7_visual.py` / `review8_visual.py` are unchanged. No screenshot is
written to `site/`. The evidence's network measurements use fresh contexts and
normal lazy loading; the regression suite separately forces loading to test all images.
