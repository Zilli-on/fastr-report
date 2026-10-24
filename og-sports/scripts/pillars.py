"""Write the five temple pillars into site/index.html between <!--pillars--> markers.

One row per pillar keeps the markup consistent; change the rows, run the script.
`python scripts/pillars.py` writes, `--check` fails if the page is out of date.

The temple alternates image and colour: I image, II lime (FASTR), III image,
IV lavender (OG SPORTS), V image. A colour pillar carries a type figure instead
of a photograph, so no people are implied where we have no picture of them.
"""

import sys
from html import escape
from pathlib import Path

INDEX = Path(__file__).resolve().parent.parent / "site" / "index.html"
START, END = "<!--pillars-->", "<!--/pillars-->"

# numeral, word, run (FASTR italic), target, name,
# media: ("img", src, object-position, kind label (DE, EN), alt (DE, EN))
#     or ("type", figure text, size in container-inline units)
PILLARS = [
    (
        "I",
        "Run",
        True,
        "#fastr",
        "OG FASTR",
        (
            "img",
            "assets/run-u6.webp",
            "50% 40%",
            ("Eigene Aufnahme · U6, Wien", "Own footage · U6, Vienna"),
            (
                "Sprint am Bahnsteig der U6 in Wien",
                "Sprinting along a U6 platform in Vienna",
            ),
        ),
    ),
    ("II", "Practice", True, "#practice", "FASTR30", ("type", "30", 54)),
    (
        "III",
        "Wear",
        False,
        "#apparel",
        "Apparel",
        (
            "img",
            "assets/apparel-studies.webp",
            "35% 50%",
            ("KI-Visualisierung", "AI visualisation"),
            ("Radtrikot aus den Farbstudien", "Cycling jersey from the colour studies"),
        ),
    ),
    ("IV", "Meet", False, "#live", "Live", ("type", "IRL.", 40)),
    (
        "V",
        "Make",
        True,
        "#stick",
        "FASTR STICK",
        (
            "img",
            "assets/stick-lime.jpg",
            "50% 50%",
            ("Produktvisualisierung", "Product visualisation"),
            ("FASTR STICK in Lime", "FASTR STICK in lime"),
        ),
    ),
]


def bi(de, en, tag="span", cls=""):
    c = f' class="{cls}"' if cls else ""
    return (
        f'<{tag}{c} data-de="{escape(de)}" data-en="{escape(en)}">{escape(de)}</{tag}>'
    )


def pillar(i, row):
    num, word, run, href, name, media = row
    parts = [
        f'<li class="pillar pillar-{word.lower()}" style="--i:{i}"><a href="{href}">'
    ]
    if media[0] == "img":
        _, src, pos, kind, alt = media
        parts.append(
            f'<img alt="{escape(alt[0])}" data-alt-de="{escape(alt[0])}" data-alt-en="{escape(alt[1])}" '
            f'loading="lazy" src="{src}" style="object-position:{pos}"/>'
        )
    else:
        _, figure, size = media
        kind = None
        parts.append(
            f'<span aria-hidden="true" class="pillar-figure{" run" if run else ""}" style="--fig:{size}">{escape(figure)}</span>'
        )
    parts.append(f'<span class="pillar-num">{num}</span>')
    if kind:
        parts.append(bi(kind[0], kind[1], cls="pillar-kind"))
    parts.append(f'<span class="pillar-word{" run" if run else ""}">{word}</span>')
    parts.append(f'<span class="pillar-name">{escape(name)}</span>')
    parts.append("</a></li>")
    return "".join(parts)


def render():
    return "\n".join(pillar(i, row) for i, row in enumerate(PILLARS))


def main():
    html = INDEX.read_text(encoding="utf-8")
    if START not in html:
        sys.exit("pillar markers missing")
    head, rest = html.split(START, 1)
    _, tail = rest.split(END, 1) if END in rest else ("", rest)
    new = f"{head}{START}\n{render()}\n{END}{tail}"
    if "--check" in sys.argv:
        sys.exit(
            0 if new == html else "pillars out of date: run python scripts/pillars.py"
        )
    INDEX.write_bytes(new.encode("utf-8"))
    print("pillars written:", len(PILLARS))


if __name__ == "__main__":
    main()
