"""Build the website loops and the OG SPORTS brand film from the generated clips.

    python scripts/build_media.py <clips_dir> <film_out_dir> <archivo.ttf>

<clips_dir> holds the image-to-video generations (Higgsfield, Grok Video 1.5, 6 s,
1080p, started from our own campaign stills): ramp.mp4, spiral.mp4, garage.mp4,
apparel.mp4, plus the STICK render stick-final.png. Writes:

  site/media/*-loop.mp4        muted, seamless (cross-faded) loops for the page
  <film_out_dir>/OG-SPORTS-film-16x9.mp4 and -9x16.mp4   ~30 s silent brand film

Every frame of the film carries a small "KI-generiert" mark (AI Act Art. 50).
Requires ffmpeg on PATH (or FFMPEG) and Pillow.
"""

import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
MEDIA = ROOT / "site" / "media"
FF = os.environ.get("FFMPEG") or shutil.which("ffmpeg") or "ffmpeg"
FADE = 0.8  # seconds of cross-fade that make a loop seamless

LOOPS = {
    # name: (clip, output size, grade)
    "ramp-loop.mp4": (
        "ramp.mp4",
        (1920, 1080),
        "curves=all='0/0 0.5/0.47 1/0.88',eq=saturation=0.9",
    ),
    "spiral-loop.mp4": ("spiral.mp4", (1080, 1080), "eq=saturation=0.85"),
    "garage-loop.mp4": ("garage.mp4", (1920, 1080), "eq=saturation=0.9"),
    "apparel-loop.mp4": ("apparel.mp4", (1920, 1080), "null"),
}


def run(args):
    subprocess.run([FF, "-v", "error", "-y", *args], check=True)


def loop(src, dst, size, grade):
    """Cross-fade the tail into the head so the clip loops without a jump."""
    dur = float(
        subprocess.run(
            [
                "ffprobe",
                "-v",
                "error",
                "-show_entries",
                "format=duration",
                "-of",
                "csv=p=0",
                str(src),
            ],
            capture_output=True,
            text=True,
            check=True,
        ).stdout
    )
    w, h = size
    # output starts at FADE and ends on a dissolve into the first FADE seconds,
    # so the last frame flows into the first: seamless, length dur - FADE
    offset = dur - 2 * FADE
    fc = (
        f"[0:v]scale={w}:{h}:force_original_aspect_ratio=increase,crop={w}:{h},{grade},fps=24,format=yuv420p,split[m][h];"
        f"[m]trim={FADE:.3f}:{dur:.3f},setpts=PTS-STARTPTS[main];"
        f"[h]trim=0:{FADE:.3f},setpts=PTS-STARTPTS[head];"
        f"[main][head]xfade=transition=fade:duration={FADE:.3f}:offset={offset:.3f}[out]"
    )
    run(
        [
            "-i",
            str(src),
            "-filter_complex",
            fc,
            "-map",
            "[out]",
            "-an",
            "-c:v",
            "libx264",
            "-preset",
            "slow",
            "-crf",
            "27",
            "-profile:v",
            "high",
            "-pix_fmt",
            "yuv420p",
            "-movflags",
            "+faststart",
            str(dst),
        ]
    )


def card(path, size, lines, font_path, sub=None, align="left", mark=True):
    """Transparent overlay: big title, optional mono subline, the AI mark."""
    w, h = size
    im = Image.new("RGBA", size, (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    unit = min(w, h)
    title = ImageFont.truetype(str(font_path), int(unit * (0.105 if w > h else 0.12)))
    title.set_variation_by_axes([780, 118])
    small = ImageFont.truetype(str(font_path), int(unit * 0.022))
    small.set_variation_by_axes([500, 100])
    margin = int(unit * 0.07)
    if lines:
        # soft scrim under the title so it reads on bright frames
        top = int(h * 0.55)
        for yy in range(top, h):
            a = int(150 * ((yy - top) / (h - top)) ** 1.4)
            d.line([(0, yy), (w, yy)], fill=(0, 0, 0, a))
        size = title.size
        while (
            max(d.textlength(line, font=title) for line in lines) > w - 2 * margin
            and size > 20
        ):
            size = int(size * 0.94)
            title = ImageFont.truetype(str(font_path), size)
            title.set_variation_by_axes([780, 118])
        lh = int(title.size * 0.92)
        y = h - margin - lh * len(lines) - (int(unit * 0.06) if sub else 0)
        for line in lines:
            tw = d.textlength(line, font=title)
            x = margin if align == "left" else (w - tw) / 2
            d.text((x + 3, y + 4), line, font=title, fill=(0, 0, 0, 110))
            d.text((x, y), line, font=title, fill=(255, 255, 255, 255))
            y += lh
        if sub:
            d.text(
                (
                    margin
                    if align == "left"
                    else (w - d.textlength(sub, font=small)) / 2,
                    y + int(unit * 0.02),
                ),
                sub,
                font=small,
                fill=(231, 255, 26, 255),
            )
    if mark:
        txt = "KI-GENERIERT · OG SPORTS"
        d.text(
            (w - margin - d.textlength(txt, font=small), margin * 0.6),
            txt,
            font=small,
            fill=(255, 255, 255, 170),
        )
    im.save(path)


def film(clips, out_dir, font_path, vertical):
    w, h = (1080, 1920) if vertical else (1920, 1080)
    tag = "9x16" if vertical else "16x9"
    tmp = Path(tempfile.mkdtemp())
    shots = [
        # (source, seconds, title lines, subline)
        ("ramp.mp4", 4.6, ["OWN", "GREATNESS."], None),
        ("ramp.mp4@2", 3.2, ["GO WHERE", "YOU GROW."], "OG FASTR"),
        (
            "spiral.mp4",
            4.0,
            ["30 DAYS.", "7 STANDARDS."],
            "FASTR30 · CHALLENGE-KONZEPT",
        ),
        ("garage.mp4", 4.0, ["IN REAL", "LIFE."], "LIVE · FORMATE IN PLANUNG"),
        ("apparel.mp4", 4.0, ["WIENERWALD"], "FARBSTUDIEN · KEINE KOLLEKTION"),
        ("stick-final.png", 3.4, ["FASTR", "STICK"], "RENDER AUS CAD-ENTWURF V0"),
    ]
    parts = []
    for i, (src, sec, lines, sub) in enumerate(shots):
        name, _, start = src.partition("@")
        overlay = tmp / f"o{i}.png"
        card(overlay, (w, h), lines, font_path, sub)
        part = tmp / f"p{i}.mp4"
        base = f"scale={w}:{h}:force_original_aspect_ratio=increase,crop={w}:{h},fps=24,format=yuv420p"
        if name.endswith(".png"):
            src_args = ["-loop", "1", "-t", f"{sec}", "-i", str(clips / name)]
            vf = f"scale={w * 2}:-2,zoompan=z='min(zoom+0.0009,1.08)':d={int(sec * 24)}:s={w}x{h}:fps=24,format=yuv420p"
        else:
            src_args = ["-ss", start or "0", "-t", f"{sec}", "-i", str(clips / name)]
            vf = base
        run(
            [
                *src_args,
                "-loop",
                "1",
                "-t",
                f"{sec}",
                "-i",
                str(overlay),
                "-filter_complex",
                f"[0:v]{vf}[v];[1:v]format=rgba,fade=in:st=0.35:d=0.45:alpha=1,fade=out:st={sec - 0.55:.2f}:d=0.4:alpha=1[t];[v][t]overlay=0:0,fade=in:st=0:d=0.25,fade=out:st={sec - 0.25:.2f}:d=0.25[out]",
                "-map",
                "[out]",
                "-t",
                f"{sec}",
                "-an",
                "-c:v",
                "libx264",
                "-preset",
                "medium",
                "-crf",
                "18",
                "-pix_fmt",
                "yuv420p",
                str(part),
            ]
        )
        parts.append(part)
    # end card: OG FASTR / OG SPORTS on night ground
    end = tmp / "end.png"
    im = Image.new("RGB", (w, h), (15, 16, 14))
    d = ImageDraw.Draw(im)
    big = ImageFont.truetype(str(font_path), int(min(w, h) * 0.16))
    big.set_variation_by_axes([800, 125])
    small = ImageFont.truetype(str(font_path), int(min(w, h) * 0.026))
    small.set_variation_by_axes([500, 100])
    while d.textlength("OG SPORTS", font=big) > w * 0.84:
        big = ImageFont.truetype(str(font_path), int(big.size * 0.94))
        big.set_variation_by_axes([800, 125])
    for text, font, colour, dy in (
        ("OG SPORTS", big, (240, 239, 234), -0.06),
        ("ORIGINAL GRIND. OWN GREATNESS.", small, (231, 255, 26), 0.08),
    ):
        tw = d.textlength(text, font=font)
        d.text(
            ((w - tw) / 2, h / 2 + dy * h - font.size / 2), text, font=font, fill=colour
        )
    im.save(end)
    endmp4 = tmp / "end.mp4"
    run(
        [
            "-loop",
            "1",
            "-t",
            "3",
            "-i",
            str(end),
            "-vf",
            "fps=24,format=yuv420p,fade=in:st=0:d=0.4",
            "-an",
            "-c:v",
            "libx264",
            "-crf",
            "18",
            str(endmp4),
        ]
    )
    parts.append(endmp4)
    lst = tmp / "list.txt"
    lst.write_text("".join(f"file '{p.as_posix()}'\n" for p in parts), encoding="utf-8")
    out = out_dir / f"OG-SPORTS-film-{tag}.mp4"
    run(
        [
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            str(lst),
            "-c:v",
            "libx264",
            "-preset",
            "slow",
            "-crf",
            "20",
            "-pix_fmt",
            "yuv420p",
            "-movflags",
            "+faststart",
            "-an",
            str(out),
        ]
    )
    shutil.rmtree(tmp, ignore_errors=True)
    return out


def main():
    clips, out_dir, font_path = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])
    MEDIA.mkdir(exist_ok=True)
    out_dir.mkdir(parents=True, exist_ok=True)
    for name, (src, size, grade) in LOOPS.items():
        loop(clips / src, MEDIA / name, size, grade)
        # VP9 twin for browsers without H.264 (e.g. open-source Chromium builds)
        webm = MEDIA / name.replace(".mp4", ".webm")
        run(
            [
                "-i",
                str(MEDIA / name),
                "-an",
                "-c:v",
                "libvpx-vp9",
                "-b:v",
                "0",
                "-crf",
                "36",
                "-row-mt",
                "1",
                "-deadline",
                "good",
                "-cpu-used",
                "2",
                str(webm),
            ]
        )
        print(
            f"{name:20} {(MEDIA / name).stat().st_size // 1024} KB / webm {webm.stat().st_size // 1024} KB",
            flush=True,
        )
    if "--loops-only" in sys.argv:
        return
    for vertical in (False, True):
        out = film(clips, out_dir, font_path, vertical)
        print(out, out.stat().st_size // 1024, "KB")


if __name__ == "__main__":
    main()
