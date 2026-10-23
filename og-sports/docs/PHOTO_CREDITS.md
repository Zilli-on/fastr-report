# OG SPORTS — Bildnachweise

## Aktueller Stand (2026-10-23)

Auf der Seite stehen genau vier Bilder, alle im Kultur-Einstieg:

| Frame | Datei | Art | Quelle |
|---|---|---|---|
| 00 | `after-the-run-display-4x.webp` (Anzeige), `after-the-run.webp` (Original, im Bildhinweis) | bestehende KI-Bildstudie | OG SPORTS, Designstudie |
| 01 | `run-detail.webp` | Fotografie, David Moorhouse | https://unsplash.com/photos/close-up-of-a-runners-leg-and-athletic-shoe-GToHUINXOb4 |
| 02 | `run-shadow.webp` | Fotografie, Mathias Reding | https://unsplash.com/photos/runners-legs-in-motion-with-a-long-shadow-G96xGokbTUM |
| 03 | `run-community.webp` | Fotografie, Leviosa Hou | https://unsplash.com/photos/runners-gathered-together-on-a-city-street-9ZXnEV7k2lI |

Ab Frame 04 gibt es keine Fotografie, nur selbst gestaltete Bildtafeln (SVG, im Code erzeugt durch `scripts/authored_art.py`): Routen, FASTR30-Praxisfeld, Trikot-Flats, Formatskizze, STICK-Zeichnung nach CAD-Entwurf V0. Keine fremden Bilder, Logos oder Schriftdateien darin.

Die früher abgelehnten Dateien `running-photograph.webp` (Mathias Reding), `cycling-photograph.webp` (Coen van de Broek) und `movement-rooftop.webp` (KI-Studie) wurden am 23.10.2026 aus `site/assets` entfernt; sie liegen nur noch in der Git-Historie. Ein Test verhindert ihre Rückkehr.

Rechte: Die Unsplash License ist eine Urheberrechtslizenz, keine Model-, Property- oder Markenfreigabe. Sichtbar sind fremde Marken (On-Schuh in 01, Startnummern und Sponsorlogos in 03). Für eine Werbekampagne vor Launch gesondert prüfen oder ersetzen.

---

## Historie


Quellseiten geprüft am 21. Oktober 2026. Keine behauptete Zugehörigkeit der abgebildeten Personen, Bekleidung oder Fahrräder zu OG SPORTS.

## 01 — Running

Fotograf: **Mathias Reding**
Motiv: „Man running across a blurred city street“
Ort laut Fotoseite: Montréal, Québec, Kanada
Veröffentlicht laut Fotoseite: 22. September 2025
Quelle: https://unsplash.com/photos/man-running-across-a-blurred-city-street-MiRyAuFhepg
Bildserver: https://images.unsplash.com/photo-1758506971986-b0d0edebd8d5?auto=format&fit=max&w=1800&q=85

Verwendung: OG-FASTR-Abschnitt, Move-Modus, Navigationsvorschau und Bildnachweis. Keine Darstellung eines OG-Events oder Teammitglieds.

## 02 — Cycling

Fotograf: **Coen van de Broek**
Motivbeschreibung des Fotografen: „Girls on Fons racebikes“
Ort laut Fotoseite: Brouwersdam, Ouddorp, Niederlande
Veröffentlicht laut Fotoseite: 7. November 2018
Quelle: https://unsplash.com/photos/man-and-woman-riding-road-bikes-at-the-road-near-shore-OFyh9TpMyM8
Bildserver: https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=max&w=1800&q=85

Verwendung: Apparel als Sportkultur-/Bildreferenz, Make-Modus, Navigation, Index und Bildnachweis. Die Kleidung und Fahrräder sind keine OG-Produkte. Keine Partnerschaft oder Unterstützung durch die abgebildeten Personen/Marken wird behauptet.

## Lizenz und Bearbeitung

Beide Fotoseiten nennen die **Unsplash License**: https://unsplash.com/license
Informationen zu Drittrechten: https://help.unsplash.com/en/articles/14224409-what-if-there-is-a-brand-logo-in-an-image-on-unsplash

Die Urheberrechtslizenz erlaubt die Nutzung von Fotos; sie ist keine pauschale Bestätigung von Persönlichkeits-, Marken-, Design- oder sonstigen Drittrechten für jede Werbenutzung. Model-/Property-/Markenfreigaben wurden nicht separat bestätigt. Die Version ist eine private Designvorschau, keine freigegebene Werbekampagne.

Bearbeitung ausschließlich durch Verkleinerung, Layoutausschnitte und CSS-Sättigung/Kontrast. Keine KI-Ergänzungen und keine ersetzten Produktlogos. Originalfarbe und vollständiger Ausschnitt lassen sich im Bildnachweis ansehen.

Die Standardlieferung lädt diese beiden Fotos online. Mit `fetch_photos.py` lassen sie sich lokal speichern und in die HTML-Datei einbetten.

## Unveränderte bestehende Assets

- `assets/after-the-run.webp`: KI-Bildstudie aus den vorigen Versionen; erstes/default Meet-Motiv unverändert.
- `assets/movement-rooftop.webp`: bestehende KI-Kampagnenstudie, keine dokumentarische Eventaufnahme.
- OG SPORTS / OG FASTR: unveränderte bisherige Vektordateien.

Diese Trennung ist auch über die Bildhinweise in der Website ersichtlich.


## Web review 1
Both reference photographs are now served locally from site/assets. Source attribution and the existing rights caveats are retained. The default hero and original brand SVGs are unchanged. This review branch is public; noindex does not restrict access.

## Review 4 additions — editorial run culture

Three additional real photographs are used to move the public design review toward a more documentary, fashion/editorial rhythm. They remain reference photography, not OG SPORTS documentation or endorsement.

- **David Moorhouse** — “Close-up of a runner's leg and athletic shoe” — https://unsplash.com/photos/close-up-of-a-runners-leg-and-athletic-shoe-GToHUINXOb4
- **Mathias Reding** — “Runner's legs in motion with a long shadow” — https://unsplash.com/photos/runners-legs-in-motion-with-a-long-shadow-G96xGokbTUM
- **Leviosa Hou** — “Runners gathered together on a city street” — https://unsplash.com/photos/runners-gathered-together-on-a-city-street-9ZXnEV7k2lI

All three source pages identify the images as free to use under the Unsplash License. Personality, property, product-design and trademark clearances for an advertising launch have not been independently verified. The website therefore continues to identify real reference photography separately from existing AI campaign studies.

## Review 7 — rigorously curated image boundary (2026-10-22)

In the public homepage, **only** the user's approved original composition and the next **three** editorial photographs appear. Everything below the three-photo culture sequence is typography, color studies and actual brand marks; no runner, cycling or rooftop stock/Event imagery is used below this boundary or inside the four project detail art covers.

**Opening:** `after-the-run.webp` (1373×485 px, AI campaign study) remains unchanged. `after-the-run-display-4x.webp` (5492×1940 px) is a strictly source-based four-times Lanczos-resized and gently sharpened **display derivative**. This increases pixel dimensions but **does not recover details absent from the source**, nor prove documentary authenticity. The hero's composition, people and image content remain unchanged. A dedicated AI upscaling job did not yield a usable output; no fictional enhancement claim is made.

**Only real photos on the visible homepage:** David Moorhouse, Mathias Reding (runner's legs/shadow), and Leviosa Hou — their Unsplash source URLs are listed in the Review 4 section above and visibly linked beneath each photo. They are **reference photography, not OG SPORTS people, events, clothing or partnerships**.

Older runner, cycling and rooftop reference files remain in source history solely for rollback/legacy notes, and are not used in the Review 7 homepage or current project covers. After approval they can be separately removed in a cleanup commit.

The website's `noindex` setting is not access control. The reference license does not establish model, location, logo or other third-party releases for a commercial brand launch. All production uses require review.
