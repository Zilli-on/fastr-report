"""Write the five temple pillars into site/index.html between <!--pillars--> markers.

One row per pillar keeps the markup consistent; change the rows, run the script.
`python scripts/pillars.py` writes, `--check` fails if the page is out of date.

The temple alternates image and colour: I image, II lime (FASTR), III image,
IV lavender (OG SPORTS), V image. A colour pillar carries a type figure instead
of a photograph, so no people are implied where we have no picture of them.
"""

import sys
from responsive_markup import attributes, enhance
from html import escape
from pathlib import Path

INDEX = Path(__file__).resolve().parent.parent / "site" / "index.html"
START, END = "<!--pillars-->", "<!--/pillars-->"

# numeral, word, run (FASTR italic), target, name,
# media: ("img", src, object-position, kind label (DE, EN), alt (DE, EN))
#     or ("type", figure text, size in container-inline units)
PILLARS = [
    ("I", "Run", True, "#fastr", "OG FASTR",
     ("img", "assets/pillar-run.webp", "50% 45%", ("limoo / Pexels", "limoo / Pexels"),
      ("Läuferin als Silhouette vor beleuchteter Säulenhalle mit Spiegelung", "Runner silhouetted before an illuminated colonnade with reflection"))),
    ("II", "Practice", True, "#practice", "FASTR30",
     ("img", "assets/pillar-practice.webp", "50% 55%", ("Red John / Unsplash", "Red John / Unsplash"),
      ("Läufer auf einer Betontreppe im Abendlicht", "Runner on concrete stairs in evening light"))),
    # RC9/RC10: the pillars show a second colour as a landscape detail, the chapters the whole product (no image twice)
    ("III", "Wear", True, "#apparel", "Apparel",
     ("img", "assets/responsive/hoodie-lavender-800.webp", "50% 36%", ("KI-Visualisierung", "AI visualisation"),
      ("FASTR30 Graphic Hoodie in Lavender", "FASTR30 Graphic Hoodie in lavender"))),
    ("IV", "Make", True, "#stick", "FASTR STICK",
     ("img", "assets/stick-pink.jpg", "50% 50%", ("Produktvisualisierung", "Product visualisation"),
      ("FASTR STICK in Pink", "FASTR STICK in pink"))),
    # RC9: Meet is the last pillar and the last chapter, so the page ends with people, then the way in
    ("V", "Meet", False, "#live", "Live",
     ("img", "assets/pillar-meet.webp", "55% 82%", ("Victoria Prymak / Unsplash", "Victoria Prymak / Unsplash"),
      ("Gruppe als Silhouetten auf einem Dach in der Abenddämmerung", "Group silhouetted on a rooftop at dusk"))),
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
        kind = tuple('Symbolbild · ' + k if any(provider in k for provider in ('Unsplash', 'Pexels')) else k for k in kind)
        if any(provider in kind[1] for provider in ('Unsplash', 'Pexels')):
            kind = (kind[0], kind[1].replace('Symbolbild', 'Illustrative photo'))
        phone = '(max-width: 600px) calc(100vw - 40px), (max-width: 767px) calc(100vw - 44px), '
        tablet = '(max-width: 899px) 100vw, ' if i == 0 else '(max-width: 899px) 50vw, '
        sizes = phone + tablet + ('50vw' if i < 2 else '33.33vw')
        image_tag = (
            f'<img alt="{escape(alt[0])}" data-alt-de="{escape(alt[0])}" data-alt-en="{escape(alt[1])}" '
            f'loading="lazy" src="{src}" {attributes(src, sizes)} style="object-position:{pos}"/>'
        )
        parts.append(enhance(image_tag, sizes) if word == 'Meet' else image_tag)
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
