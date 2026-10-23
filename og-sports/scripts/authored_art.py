"""Authored image plates for the OG SPORTS homepage.

One generated plate remains next to the studio render of chapter 08:

  stick   08 / FASTR STICK  elevation + half section, proportions from CAD draft V0

Usage (from og-sports/):
  python scripts/authored_art.py           # print sizes, change nothing
  python scripts/authored_art.py --write   # refresh the <!-- art:name --> blocks in site/index.html
  python scripts/authored_art.py --check   # exit 1 if site/index.html differs from this generator
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "site" / "index.html"

# FASTR STICK CAD draft V0 (local prototype programme, 2026-10-11).
# Proposed dimensions in mm, NOT confirmed by the user and NOT physically tested.
# Only proportions reach the website; no dimension is printed on the drawing.
STICK_V0 = {
    "outer_diameter": 28.0,
    "closed_height": 140.0,
    "body_bottom_z": 11.6,
    "body_floor_thickness": 3.0,
    "body_shoulder_z": 118.0,
    "neck_top_z": 128.0,
    "bore_radius": 10.6,
    "neck_root_radius": 11.8,
    "neck_thread_radius": 12.4,
    "neck_thread_pitch": 2.4,
    "cap_bottom_z": 118.4,
    "cap_roof_thickness": 1.8,
    "cap_radial_clearance": 0.25,
    "knob_height": 11.2,
    "rotor_flange_bottom_z": 14.9,
    "rotor_flange_radius": 6.5,
    "rotor_flange_height": 6.7,
    "drive_seat_z": 10.0,
    "lead_root_radius": 2.75,
    "lead_thread_radius": 4.0,
    "lead_pitch": 4.0,
    "lead_thread_start_z": 22.0,
    "lead_thread_end_z": 124.0,
    "lead_tip_z": 125.0,
    "cup_bottom_z": 25.0,
    "cup_height": 10.0,
    "cup_radial_clearance": 0.3,
    "cup_stroke": 88.0,
}


def f(v):
    return f"{v:.1f}".rstrip("0").rstrip(".")


# ------------------------------------------------------------------ stick
def stick():
    p = STICK_V0
    s = 4.0  # 1 mm = 4 units
    R = p["outer_diameter"] / 2
    H = p["closed_height"]
    top = 40

    def Y(z):
        return top + (H - z) * s

    def X(cx, r):
        return cx + r * s

    knob_h, cap_b = p["knob_height"], p["cap_bottom_z"]
    out = []
    # view A — exterior
    cx = 170
    out.append('<g class="s-view">')
    out.append(
        f'<rect class="s-body" x="{f(X(cx, -R))}" y="{f(Y(cap_b))}" width="{f(2 * R * s)}" height="{f(Y(knob_h) - Y(cap_b))}"/>'
    )
    out.append(
        f'<rect class="s-dark" x="{f(X(cx, -R))}" y="{f(Y(H))}" width="{f(2 * R * s)}" height="{f(Y(cap_b) - Y(H))}" rx="5"/>'
    )
    out.append(
        f'<rect class="s-dark" x="{f(X(cx, -R))}" y="{f(Y(knob_h))}" width="{f(2 * R * s)}" height="{f(Y(0) - Y(knob_h))}" rx="5"/>'
    )
    ticks = ""
    for z0, z1 in ((0.9, knob_h - 0.9), (cap_b + 1.4, cap_b + 6.6)):
        for k in range(1, 12):
            x = X(cx, -R) + k * (2 * R * s) / 12
            ticks += f"M{f(x)} {f(Y(z1))}V{f(Y(z0))}"
    out.append(f'<path class="s-knurl" d="{ticks}"/>')
    out.append("</g>")

    # view A–A — half section (right half cut)
    cx = 470
    bore = p["bore_radius"]
    floor_z = p["body_bottom_z"] + p["body_floor_thickness"]
    shoulder, neck_top = p["body_shoulder_z"], p["neck_top_z"]
    wall = R - bore
    out.append('<g class="s-view">')
    out.append(
        f'<rect class="s-body" x="{f(X(cx, -R))}" y="{f(Y(cap_b))}" width="{f(R * s)}" height="{f(Y(knob_h) - Y(cap_b))}"/>'
    )
    out.append(
        f'<rect class="s-dark" x="{f(X(cx, -R))}" y="{f(Y(H))}" width="{f(R * s)}" height="{f(Y(cap_b) - Y(H))}"/>'
    )
    out.append(
        f'<rect class="s-dark" x="{f(X(cx, -R))}" y="{f(Y(knob_h))}" width="{f(R * s)}" height="{f(Y(0) - Y(knob_h))}"/>'
    )
    # interior, visible only in the cut (right) half
    out.append(
        f'<clipPath id="stick-half"><rect x="{f(cx)}" y="0" width="{f(R * s)}" height="{f(Y(0) + 20)}"/></clipPath>'
    )
    out.append('<g clip-path="url(#stick-half)">')
    roof_z = H - p["cap_roof_thickness"]
    out.append(
        f'<rect class="s-cavity" x="{f(X(cx, 0))}" y="{f(Y(roof_z))}" width="{f((R - 1) * s)}" height="{f(Y(floor_z) - Y(roof_z))}"/>'
    )
    cup_z = p["cup_bottom_z"] + 38  # drawn mid-stroke for legibility
    cup_r = bore - p["cup_radial_clearance"]
    out.append(
        f'<rect class="s-balm" x="{f(X(cx, -cup_r))}" y="{f(Y(shoulder - 2))}" width="{f(2 * cup_r * s)}" height="{f(Y(cup_z + p["cup_height"]) - Y(shoulder - 2))}"/>'
    )
    lr, lt = p["lead_root_radius"], p["lead_thread_radius"]
    out.append(
        f'<rect class="s-spindle" x="{f(X(cx, -lr))}" y="{f(Y(p["lead_tip_z"]))}" width="{f(2 * lr * s)}" height="{f(Y(p["drive_seat_z"]) - Y(p["lead_tip_z"]))}"/>'
    )
    zig, z, side = (
        f"M{f(X(cx, lt))} {f(Y(p['lead_thread_start_z']))}",
        p["lead_thread_start_z"],
        -1,
    )
    while z < p["lead_thread_end_z"]:
        z += p["lead_pitch"] / 2
        zig += f"L{f(X(cx, side * lt))} {f(Y(z))}"
        side *= -1
    out.append(f'<path class="s-helix" d="{zig}"/>')
    fr, fz = p["rotor_flange_radius"], p["rotor_flange_bottom_z"]
    out.append(
        f'<rect class="s-spindle" x="{f(X(cx, -fr))}" y="{f(Y(fz + p["rotor_flange_height"]))}" width="{f(2 * fr * s)}" height="{f(p["rotor_flange_height"] * s)}"/>'
    )
    out.append(
        f'<rect class="s-cup" x="{f(X(cx, -cup_r))}" y="{f(Y(cup_z + p["cup_height"]))}" width="{f(2 * cup_r * s)}" height="{f(p["cup_height"] * s)}"/>'
    )
    out.append("</g>")
    # cut walls of sleeve, floor and neck
    out.append(
        f'<rect class="s-cut" x="{f(X(cx, bore))}" y="{f(Y(shoulder))}" width="{f(wall * s)}" height="{f(Y(p["body_bottom_z"]) - Y(shoulder))}"/>'
    )
    out.append(
        f'<rect class="s-cut" x="{f(X(cx, 0))}" y="{f(Y(floor_z))}" width="{f(bore * s)}" height="{f(Y(p["body_bottom_z"]) - Y(floor_z))}"/>'
    )
    nr = p["neck_root_radius"]
    out.append(
        f'<rect class="s-cut" x="{f(X(cx, bore))}" y="{f(Y(neck_top))}" width="{f((nr - bore) * s)}" height="{f(Y(shoulder) - Y(neck_top))}"/>'
    )
    teeth, z = "", shoulder + 1.2
    while z + p["neck_thread_pitch"] / 2 < neck_top - 0.6:
        teeth += (
            f"M{f(X(cx, nr))} {f(Y(z))}L{f(X(cx, p['neck_thread_radius']))} "
            f"{f(Y(z + p['neck_thread_pitch'] / 4))}L{f(X(cx, nr))} {f(Y(z + p['neck_thread_pitch'] / 2))}"
        )
        z += p["neck_thread_pitch"]
    out.append(f'<path class="s-thread" d="{teeth}"/>')
    cap_wall = R - p["neck_thread_radius"] - p["cap_radial_clearance"]
    out.append(
        f'<rect class="s-cut s-cut-dark" x="{f(X(cx, R - cap_wall))}" y="{f(Y(H))}" width="{f(cap_wall * s)}" height="{f(Y(cap_b) - Y(H))}"/>'
    )
    out.append(
        f'<rect class="s-cut s-cut-dark" x="{f(X(cx, 0))}" y="{f(Y(H))}" width="{f(R * s)}" height="{f(p["cap_roof_thickness"] * s)}"/>'
    )
    out.append(
        f'<rect class="s-cut s-cut-dark" x="{f(X(cx, 0))}" y="{f(Y(knob_h))}" width="{f(R * s)}" height="{f(Y(0) - Y(knob_h))}"/>'
    )
    out.append(f'<path class="s-axis" d="M{f(cx)} {f(Y(H) - 18)}V{f(Y(0) + 18)}"/>')
    # lift direction of the cup, left of the section, no value
    ax = X(cx, -R) - 30
    y0, y1 = Y(p["cup_bottom_z"]), Y(p["cup_bottom_z"] + p["cup_stroke"])
    out.append(
        f'<path class="s-dim" d="M{f(ax)} {f(y0)}V{f(y1)}M{f(ax - 5)} {f(y1 + 10)}L{f(ax)} {f(y1)}L{f(ax + 5)} {f(y1 + 10)}"/>'
    )
    out.append("</g>")
    # callouts — numbers only, the legend is bilingual HTML
    calls = [
        ("01", 470 + R * s * 0.55, Y(H - 10)),
        ("02", 470 + (bore + wall / 2) * s, Y(86)),
        ("03", 470 + cup_r * s * 0.55, Y(cup_z + p["cup_height"] / 2)),
        ("04", 470 + lt * s * 0.5, Y(44)),
        ("05", 470 + R * s * 0.55, Y(knob_h / 2)),
    ]
    for num, x, y in calls:
        out.append(
            f'<g class="s-call"><circle cx="{f(x)}" cy="{f(y)}" r="4.5"/><path d="M{f(x)} {f(y)}H610"/><text x="622" y="{f(y + 7.5)}">{num}</text></g>'
        )
    out.append(
        f'<text class="s-label" x="170" y="{f(Y(0) + 48)}" text-anchor="middle">A</text>'
    )
    out.append(
        f'<text class="s-label" x="470" y="{f(Y(0) + 48)}" text-anchor="middle">A–A</text>'
    )
    total_h = Y(0) + 72
    return (
        f'<svg class="stick-drawing" viewBox="84 0 600 {f(total_h)}" aria-hidden="true" focusable="false">\n'
        '<defs><pattern id="stick-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">'
        '<path d="M0 0V7" stroke="currentColor" stroke-width="1.1"/></pattern></defs>\n'
        + "\n".join(out)
        + "\n</svg>"
    )


ART = {"stick": stick}


def render(html):
    for name, fn in ART.items():
        pattern = re.compile(rf"(<!-- art:{name} -->\n).*?(<!-- /art:{name} -->)", re.S)
        if not pattern.search(html):
            raise SystemExit(f"marker art:{name} missing in {INDEX}")
        html = pattern.sub(lambda m, fn=fn: m.group(1) + fn() + "\n" + m.group(2), html)
    return html


def main():
    html = INDEX.read_text(encoding="utf-8")
    updated = render(html)
    if "--write" in sys.argv:
        INDEX.write_text(updated, encoding="utf-8", newline="\n")
        print("site/index.html art blocks refreshed")
    elif "--check" in sys.argv:
        if updated != html:
            raise SystemExit(
                "site/index.html art blocks are out of date: run scripts/authored_art.py --write"
            )
        print("art blocks up to date")
    else:
        for name, fn in ART.items():
            print(f"{name}: {len(fn())} bytes")


if __name__ == "__main__":
    main()
