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
