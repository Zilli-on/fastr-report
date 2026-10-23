"""Prepare the campaign images in site/assets from their sources (one-off, reproducible).

    python scripts/prepare_images.py <sources_dir>

<sources_dir> must contain the source files named in SOURCES. Provenance, edits and
labels are documented in docs/PHOTO_CREDITS.md and docs/asset_manifest.json.
Requires Pillow (and OpenCV for the logo retouch of frame 01).
"""

import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "site" / "assets"

# output name: (source file, crop box or None, output size, quality)
SOURCES = {
    # 01 photograph David Moorhouse (Unsplash), maker mark on the heel removed by inpainting
    "frame-01-detail.webp": ("run-detail-clean.png", None, (1200, 1800), 84),
    # 03 photograph Leviosa Hou (Unsplash), bibs, ribbons, shirt marks and banner retouched (AI-assisted)
    "frame-03-people.webp": ("community-ai.png", None, (2400, 1357), 82),
    # 04 OG FASTR AI campaign study (own Higgsfield asset), crop removes poster text and frame
    "campaign-ramp.webp": (
        "motion_zoom_ramp.png",
        (60, 520, 2820, 2072),
        (2400, 1350),
        80,
    ),
    # 05 OG FASTR AI architecture study (own Higgsfield asset)
    "campaign-spiral.webp": ("03_top_down.png", (360, 0, 2840, 2480), (1600, 1600), 80),
    # 06 AI visualisation of the four Wienerwald colour studies (generated 2026-10-23, no logos)
    "apparel-studies.webp": ("apparel-ai.png", None, (2400, 1357), 82),
    # 07 OG FASTR AI venue study (own Higgsfield asset), empty space, no event
    "live-venue.webp": ("01_empty_garage.png", None, (2400, 1350), 80),
    # 08 Blender studio render of the CAD draft V0 (scripts/render_stick.py)
    "stick-studio.webp": ("stick-final.png", None, (1600, 2000), 84),
}


def main():
    src = Path(sys.argv[1])
    for name, (file, box, size, q) in SOURCES.items():
        im = Image.open(src / file).convert("RGB")
        if box:
            im = im.crop(box)
        im = im.resize(size, Image.LANCZOS)
        im.save(ASSETS / name, "WEBP", quality=q, method=6)
        print(
            f"{name:24} {size[0]}x{size[1]}  {(ASSETS / name).stat().st_size // 1024} KB"
        )


if __name__ == "__main__":
    main()
