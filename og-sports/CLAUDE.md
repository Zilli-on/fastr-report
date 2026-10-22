# OG SPORTS — CLAUDE.md
## Creative Direction, Implementation & Final Quality Brief

**Auftrag:** Bringe die bestehende OG-SPORTS-Website in diesem Repository gestalterisch und technisch auf ein überzeugendes internationales Premium-Marken-Niveau. Arbeite als **Creative Director + Art Director + Senior Frontend Engineer + gnadenloser Visual-QA-Reviewer**. Du sollst das Projekt **implementieren, verfeinern, testen und als prüfbare Web-Vorschau abliefern** – nicht nur eine Strategie oder einen neuen Design-Prompt schreiben.

**Leitmotiv: AUSSERGEWÖHNLICH, ABER CLEAN.**

Die Website soll die selbstverständliche Präsenz einer international führenden Marke ausstrahlen. **F1 ist nur eine Analogie für Standing, Exzellenz und Markenautorität – ausdrücklich KEINE Rennsport-/Motorsport-Optik.** Unsere eigentliche Welt ist Sport, Menschen, Bewegung, Design, Kultur und ambitionierte Ideen. **SOM Studios / PROJECT50** ist eine wichtige Referenz für das Gefühl einer zusammenhängenden Brand-/Community-Kultur. Gestalte jedoch eine **unverwechselbare OG-SPORTS-Handschrift**, keine Kopie von SOM.

**Zentrale Nutzerforderung:** Der erste Website-Eindruck war stark, aber weiter unten fiel das Design wieder auf das Niveau einer guten Landingpage, eines Agenturportfolios oder einer Präsentation zurück. **Das darf nach diesem Auftrag nicht mehr passieren.** Alle Kapitel müssen dieselbe Qualität und visuelle Souveränität wie der Hero besitzen.

---

## 1. Projektzugang — zuerst den echten aktuellen Zustand prüfen

- **Repository:** https://github.com/Zilli-on/fastr-report
- **Arbeitsverzeichnis:** og-sports/
- **Aktueller Arbeitsbranch:** feat/og-sports-web
- **Bestehender Draft-PR:** https://github.com/Zilli-on/fastr-report/pull/1
- **Vorschau des Arbeitsbranches:** https://raw.githack.com/Zilli-on/fastr-report/refs/heads/feat/og-sports-web/og-sports/site/index.html
- **Zuletzt bei Erstellung dieses Briefings bekannter Commit:** 3e5250e4e9d17ef937a79cbad6dc1af0a6530f20
- **Zuletzt bestätigte erfolgreiche CI für diesen Stand:** https://github.com/Zilli-on/fastr-report/actions/runs/39854736290
- **Datum dieses Briefings:** 22. Oktober 2026

**Wichtig:** Diese Angaben sind ein Handoff-Snapshot, keine Garantie, dass der Branch unverändert bleibt. Prüfe unmittelbar zu Beginn git status, git log, PR, aktuelle Dateien und CI. Arbeite vom tatsächlich neuesten sicheren Commit aus. Überschreibe keine parallelen Änderungen. Falls eine weitere Person denselben Branch bearbeitet, erstelle einen separaten Feature-Branch ab dem aktuellen Stand und öffne einen PR gegen den bestehenden Arbeitsbranch.

Das Repo enthält bereits eine funktionierende statische Website mit HTML, CSS, JavaScript, echten Browserchecks und GitHub Actions. **Nicht bei null anfangen, aber vorhandenes Design auch nicht ungeprüft für gut halten.** Visuelle Qualität schlägt die Anzahl der Iterationsnummern.

### Technische Orientierung

- **site/index.html** — Inhalt und Struktur
- **site/script.js** — Sprache, Navigation, Projektansichten, lokale Kontaktentwürfe, Interaktionen
- **site/styles.css**, **site/refinement.css**, **site/review4.css** bis **site/review9.css** — historisch angewachsene Gestaltungsschichten
- **site/assets/** — originale Brand-SVGs, geschütztes Hero-Asset, drei akzeptierte Editorial-Fotos, R8-SVG-Konzeptstudien
- **docs/REVIEW7_ART_DIRECTION.md**, **docs/REVIEW8_ART_DIRECTION.md**, **docs/PHOTO_CREDITS.md**, **docs/photo_sources.json**
- **AGENTS.md** — bisherige verbindliche Projektentscheidungen
- **scripts/** — Build und visuelle Browsertests
- **tests/** — Source-/Asset-/HTTP-Tests
- **.github/workflows/og-sports-review.yml** — tatsächliche GitHub-CI am Repository-Root

Node.js 22+; ohne komplexes Framework und ohne notwendige Laufzeit-Backenddienste. Vorhandene Installation/Build prüfen, zum Beispiel:

    cd og-sports
    npm ci --ignore-scripts
    npm run check
    npm run dev
    npm run preview

Die vorhandenen Playwright/Chromium-Tests sind ebenso zu prüfen. **Bei Architektur- oder HTML-Änderungen alte Tests ehrlich aktualisieren, nicht bloß löschen oder umgehen.** Kein Produktions-Release ohne Freigabe.

---

## 2. Was der Auftraggeber explizit mochte und nicht mochte

### Unbedingt schützen – sofern nicht ausdrücklich sinnvoller und mit derselben emotionalen Wirkung gelöst

1. **Das erste Hero-Foto.** Datei: site/assets/after-the-run.webp. Der Auftraggeber findet die dargestellte Gruppe nach dem Sport besonders gut. Personen, Grundkomposition, Stimmung und Wiedererkennbarkeit erhalten. Es ist eine vorhandene **KI-Bildstudie**, nicht dokumentierte OG-SPORTS-Fotografie.
2. **Die drei unmittelbar folgenden Editorial-Fotos.** Dateien: site/assets/run-detail.webp, site/assets/run-shadow.webp und site/assets/run-community.webp. Diese Bildstrecke wurde positiv bewertet. Die Bilder und Quellen in docs/photo_sources.json prüfen, die Abfolge und ihren ruhigen, dokumentarischen Charakter respektieren.
3. **OG SPORTS Originalzeichen und OG FASTR Original-Wortmarke.** Die originalen SVG-Konturen nicht neu zeichnen, verändern oder durch KI-Logos ersetzen.
4. Die Atmosphäre des stärksten Einstiegs: **mutige, aber leichte Typografie**, ungewöhnliche Komposition, kontrollierte Überlagerungen, selbstbewusste Bildregie, viel sinnvoller Raum, nicht ein generisches Sporttemplate.
5. Ein Gefühl von **Culture / Community / High-End Fashion / Performance** statt einer gewöhnlichen Corporate-Sport-Website.

### Deutlich abgelehnt

- Der Abschnitt nach den drei guten Fotografien wirkte oft deutlich schlechter als der Hero.
- Spätere generische Läufer-, Rad-, Rooftop- und Community-Stockaufnahmen.
- Vier gleichwertige Produktkacheln, wiederholte Poster-Layouts und stereotype Zwei-Spalten-Sektionen.
- Zu viel erklärender Unternehmens-/Pitch-Deck-Text.
- Die kalte, austauschbare „AI/Codex-Webdesign“-Ästhetik.
- Luxussimulation durch bloße Schwarz-Weiß-Flächen, große Worte, unzählige Pfeile, zufällige Animationen oder übertriebenes Minimalismus-Theater.
- Jede Sektion mit demselben offenen Rahmen oder demselben typografischen Trick.
- Unnötige One-Pager-Menüs, Floating-Navigation, redundante Tabs und dekorative Features ohne Nutzwert.
- Zu filigrane, verspielte Gestaltung bei technischen oder Apparel-Konzepten.

**Wichtigste Erkenntnis:** Der Nutzer hat viel zugestanden („du kannst natürlich alles verändern“), aber die emotional bestätigten ersten vier Bilder sind der Anker. Du darfst sehr mutig umbauen, **nicht aber aus Bequemlichkeit starke Elemente verwerfen oder die abgelehnten Stockbilder wieder einführen**.

---

## 3. Markenstrategie: OG SPORTS ≠ OG FASTR

**OG SPORTS** ist die Dachmarke. Markenidee: **Original Grind. Own Greatness.** Der Auftritt soll deutlich mehr sein als ein Running Club oder ein einzelner Produktshop. Er kann Kultur, kreative Produkte, Bewegung, Menschen und Formate verbinden.

**OG FASTR / FASTR** ist eine Bewegung innerhalb dieses Ökosystems. Die Schreibweise ist **FASTR**, nie „Faster“. Die Website muss den Zusammenhang zeigen, ohne beide Identitäten zu vermischen.

### Relevante Brand-Sprache

- OWN GREATNESS.
- FOR EVERY VERSION OF YOU.
- GO WHERE YOU GROW.
- EARNED. NOT GIVEN.
- ORIGINAL GRIND. OWN GREATNESS.

Nicht jeden Claim gleichzeitig stapeln. Einen starken Hauptgedanken pro Kapitel einsetzen. Die Aussagen sollen wie selbstverständliche Markensprache wirken, nicht wie motivierende Wandposter.

### Laufende Projekte — alle wirklich als Work in Progress behandeln

**FASTR30:** Eine 30-Tage-Praxis mit sieben fixen Begriffen, in exakt dieser Reihenfolge:

1. RECOVER — mindestens 6 Stunden Schlaf, vor 08:30 aufstehen
2. OWN YOUR MORNING — mindestens 15 Minuten ohne Ablenkung; drei Dinge, für die man dankbar ist
3. MOVE — mindestens 30 Minuten Bewegung
4. READ — mindestens sechs Seiten lesen
5. GET FASTR — mindestens 30 Minuten an einem Skill arbeiten
6. FUEL — 2–3 Liter trinken
7. REFLECT — mindestens zehn Minuten Journal

**Apparel / Wienerwald Cycling Collection:** Technische, gestalterisch hochwertige Radbekleidung mit geometrischer Farb-/Formensprache. Der Nutzer bevorzugt klarere, große geometrische Flächen statt dekorativer Früchte auf der Brust. Bisherige benannte Farbkonzepte umfassen Hagebutte Winterbuche, Holunder Eiche, Apple Sky, Pear Moss, Rosehip Stone, Elderberry Mist, Lime Blueberry, Willow Plum, Coral Blood Orange sowie graue, weiße und schwarze Richtungen. Im aktuellen Site-Bestand liegen vier **konzeptionelle** R8-Farbstudien; diese sind keine freigegebenen Produktfotos oder Produktionsfarben.

**Live Experiences:** Bewegung, Begegnungen, Kultur, Musik und Formate, aber keine erfundenen stattgefundenen Events, Partnerlogos, ausverkauften Termine, Performer oder Ticketlinks.

**FASTR STICK:** 30-ml-Anti-Chafing-Stick als Prototyp-Konzept. Schlanker zylindrischer Körper, Einhandbedienung, technische Weiterentwicklung. Die aktuelle Website-Illustration ist **keine validierte CAD-Datei** und darf nicht als serienreifes Produkt oder getesteter Mechanismus dargestellt werden.

Zeige diese Projekte **nicht** als vier gleichartige Features. Entscheide, wie jedes Projekt emotional und visuell Teil derselben Marke wird.

---

## 4. Creative North Star: die Art Direction wirklich zu Ende denken

Denke in einer **Brand World**, nicht in einer Website mit Sektionen. Besucher sollen sich fühlen, als würden sie einen eigenständigen kulturellen Kosmos betreten. Die richtige Wirkung ist etwas zwischen Editorial Fashion, zeitgenössischer Running Culture, ambitioniertem Produktdesign und Community – mit dem Standing einer international bekannten Marke.

### Richtige Vergleichsarbeit

Untersuche **aktuelle echte Seiten**, wenn Web-/Browserzugang verfügbar ist, insbesondere:

- SOM Studios: https://somstudios.com/
- PROJECT50: https://somstudios.com/collections/project-50
- SOM Creators Club: https://somstudios.com/pages/creators-club
- SATISFY Running: https://satisfyrunning.com/
- District Vision: https://districtvision.com/
- Entire Studios: https://www.entirestudios.com/
- ADERERROR: https://adererror.com/en
- Teenage Engineering: https://teenage.engineering/
- Leica: https://leica-camera.com/
- Aman: https://www.aman.com/

Keine fremde Seite pixelgenau klonen. Auch kein fremdes Produktbild, Eventmaterial, Copyright-Video, Logo, Code oder nicht geklärtes Kampagnenmotiv einfach übernehmen.

Analysiere bei den besten Auftritten **konkret**:

- Woran ist die Marke ohne viel Erklärung sofort erkennbar?
- Wie viel Raum bekommen Bild, Bewegung, Wortmarke, Produkt und Mensch?
- Wie wechseln große emotionale Momente mit stillen Detailmomenten?
- Wie funktioniert Rhythmus über die *gesamte* Scroll-Strecke?
- Wie schaffen die Seiten das Gefühl einer Community oder kulturellen Haltung?
- Wo stehen Inhalt, Navigation, Interaktion, Footer und Kontakt wirklich im Dienst der Marke?
- Welche Elemente sind zwar spektakulär, aber unpraktisch, kopierbar oder performant problematisch?

**Adaptieren, nicht imitieren.** Der Nutzer will bewusst SOM-nahes Niveau, aber eine **eigene OG-Signatur**, nicht die SOM-Navigation oder deren E-Commerce-Muster unter einem anderen Logo.

### Gewünschter visueller Charakter

- Außergewöhnlich, aber clean.
- Präzise, außergewöhnliche Typografie mit bewusster Buchstaben- und Zeilensetzung.
- Starkes Editorial-Layout mit wechselnden Rhythmen: monumentale Momente, ruhige Details, bewusste Leerräume.
- Fotografie nur, wenn sie auf dem Qualitätsniveau der ersten vier akzeptierten Bilder mitspielen kann.
- Kontrollierte Farbwelt; gedämpfte Töne, sparsame charakteristische Akzente, keine zufälligen Gradient-Showeffekte.
- Überlagerung, Rahmendetails und Geometrie gezielt statt überall.
- Unverwechselbare Signatur über Bilder, typografische Entscheidungen, Storytelling und Materialstudien zusammen – **nicht über eine Ansammlung einzelner Effekte**.
- Animation nur subtil, hochwertig und für die Story relevant. Immer Rücksicht auf reduced motion.
- Gestalterische und funktionale Qualität muss am Handy genauso hoch sein wie am Desktop.

### Was du radikal hinterfragen darfst

- Die gesamte **untere Hälfte** nach den drei guten Fotografien.
- Die heutigen OG-FASTR-Typografie-/Pfadillustrationen.
- FASTR30 und die Art, wie die sieben Standards vermittelt werden.
- Die aktuellen „Field Atlas“-SVGs für Apparel, Live und STICK.
- Projektansichten und ihre Dramaturgie.
- Die Contact-/Community-Inszenierung.
- Die aufeinanderliegenden R4–R9-CSS-Schichten.

**R8/R9 sind eine Arbeitsgrundlage, keine finale Art-Direction-Freigabe.** Wenn die aktuellen SVGs wie generische Konzeptschaubilder wirken, ersetze oder entwickle sie entschlossen weiter. Jedes neue Element muss auf Augenhöhe mit dem Hero bestehen.

---

## 5. Konkrete Aufgaben – Umsetzung statt nur Kritik

### Phase A — kritisches Audit

1. Öffne die **aktuelle** Website im Browser und erstelle echte Screenshots der ganzen Seite, von Hero, Kulturstrecke, FASTR, vier Projekten, Projekt-Dialogs, Kontakt und Mobile.
2. Prüfe Bildausschnitte, typografische Kollisionen, Spacing, Farbsprünge, visuelle Hierarchie, Hover/Focus, Dichte, Langeweile und „Template-Gefühl“ – insbesondere nach dem dritten akzeptierten Bild.
3. Vergleiche jeden Abschnitt mit erstklassigen Editorial-/Culture-/Produkt-Websites. Schreibe für dich eine priorisierte, selbstkritische Liste der fünf größten Qualitätsbremsen.
4. Prüfe die tatsächlich eingesetzten Bilddateien, Quellen und Berechtigungen.
5. Prüfe CSS-Kaskade und technische Architektur: aktuell wurden historische Iterationen als **mehrere Stylesheets** gestapelt. Finde widersprüchliche Regeln, toten Code und unnötige UI-Logik.

**Nicht hier aufhören. Phase B–E gehören zum selben Auftrag.**

### Phase B — komplette Creative-Entscheidung

Definiere eine konsistente visuelle Erzählung. Beispielhafte Dramaturgie (als Inspiration, nicht als festes Raster):

**ICONIC OPENING → CULTURE / PEOPLE → MOVEMENT → DAILY PRACTICE → THINGS WE CREATE → INVITATION → BRAND SIGNATURE.**

Die tatsächliche Dramaturgie darf anders ausfallen, wenn sie besser ist. Wichtig ist, dass die **Wirkung von oben bis unten zusammenhält**. Es muss sich wie eine Editorial-Kampagne anfühlen, nicht wie sieben Module eines Baukastens.

Gib jedem großen Abschnitt eine eigene Berechtigung, aber dieselbe gemeinsame Handschrift. Lieber weniger wirklich starke Momente als sehr viele gute Standardsektionen.

### Phase C — direkt implementieren

- Setze die Creative Direction im vorhandenen Webprojekt um.
- Überarbeite HTML/CSS/JS, Inhalte, Assets, Projektansichten und Interaktion genau dort, wo ein Qualitätsgewinn entsteht.
- Optimiere Hero-Darstellung, Crop, Responsive-Fokus und Ladeverhalten. Das aktuelle 4×-Bild ist **Lanczos-Interpolation plus leichtes Sharpening**, keine echte Rekonstruktion feiner Details. Versprich keine AI-Superresolution ohne einen tatsächlich besseren, verifizierten Bildstand. Das originale Motiv und die Menschen müssen wiedererkennbar bleiben.
- Schaffe für den unteren Teil eine sehr eigene OG-SPORTS-Formsprache. Wenn du Bild-, Video- oder Motion-Assets benötigst, benutze nur passende und rechtlich prüfbare Quellen; markiere Konzept-/KI-Material ehrlich.
- Falls vorhandene tatsächliche OG-Apparel-Designs oder Produktfotos im Projekt verfügbar sind, bevorzuge sie gegenüber spekulativen Illustrationen. Ohne solche Quellen: klare, hochkarätige konzeptionelle Studien statt erfundener fertiger Kampagnenprodukte.
- Halte die **Hero-/Kultur-Fotobasis** als stärksten Orientierungspunkt. Füge die früher abgelehnten Stockfotos nicht wieder ein.
- Schaffe gezielte, saubere Interaktionen; keine unnötige Effektshow oder „sieht aus wie ein Template“-UX.
- **Räume den Code auf.** Eine Kaskade immer neuer review10.css/review11.css ist ausdrücklich **nicht** das gewünschte Endergebnis. Konsolidiere nach erfolgreicher Gestaltung die Styles auf eine nachvollziehbare, wartbare Struktur. Entferne toten Code vorsichtig und halte alle relevanten Funktionen funktionsfähig.
- Schreibe DE/EN-Copy sauber, kurz, korrekt und im Brand-Ton. Unnötige Fremdwort-/Claim-Häufung vermeiden.

### Phase D — visuelle Abnahme und Qualität

Teste nicht nur, ob ein Element technisch existiert, sondern **wie es tatsächlich aussieht**. Verwende reale Screenshots und prüfe mindestens:

- **Viewportbreiten:** 320, 360, 390, 768, 1024, 1440 und 1920 px.
- **Desktop und Mobile:** vollständiger Hero, Kulturstrecke, FASTR, FASTR30, alle Projekte, Projekt-Detailansichten, Navigation, Kontakt und Footer.
- **Keine** abgeschnittenen Headlines, deformierten Logos, zufälligen Zeilenumbrüche oder horizontalen Scrollbars.
- **Kein** Projektbild, dessen schlechter Crop Menschen oder Produkte unglücklich abschneidet.
- Hover-, Tastatur-, Fokus-, Touch- und Escape-Verhalten; keine kaputten Modals, Navigation oder unsichtbaren Bedienelemente.
- Deutsch/Englisch vollständig – auch Buttons, Dialogtitel, Alttexte, Bildhinweise und Interaktionsstatus.
- Reduced motion, respektvolle Bewegung und keine unnötige Scroll-Sperre.
- Saubere Bildauflösung, passende Formate, responsive Ladegrößen, sinnvolle Lazy-Loading-Strategie. Hero bekommt Priorität; Layout-Shifts vermeiden.
- Semantische Überschriften, sinnvolle Alttexte, ausreichende Kontraste, sichtbare Fokusindikatoren, verständliche Link-/Button-Texte; WCAG 2.2 AA als Ziel.
- Keine Browser-Konsolefehler, fehlende Bilder, toten Links oder unbeabsichtigten Drittanbieterrequests.
- Keine erfundenen Erfolge, Partner, Teammitglieder, Produktverfügbarkeit oder Eventbuchungen.

Führe npm run check, die relevanten Browser-Regressionen und den GitHub-CI-Workflow aus. Bei Refactoring: **Passe die Tests an die beabsichtigte neue Struktur an**, aber bewahre ihre fachlichen Garantien. Eine grüne CI allein beweist keine hervorragende Gestaltung. Die Screenshots müssen ebenfalls bewusst angeschaut und gegebenenfalls erneut verbessert werden.

Falls Safari, Firefox, echte Mobilgeräte oder eine vollständige Accessibility-/Performance-Prüfung in deinem Setup nicht verfügbar sind, **sage genau, was nicht geprüft werden konnte**, statt Ergebnisse zu erfinden.

### Phase E — fertige Übergabe

Liefer ein **wirklich implementiertes** Ergebnis mit:

1. Git-Commit(s) und überprüfbarem PR, ohne main zu überschreiben.
2. Exakter Link auf die aktuelle öffentlich erreichbare **Review-Website** sowie PR-Link (und bei Möglichkeit exakter Commit-Link).
3. Desktop- und Mobile-Screenshots der **tatsächlich gerenderten** Seite, besonders der bislang schwachen unteren Hälfte.
4. Kurzbericht über die wichtigsten gestalterischen Entscheidungen und warum sie OG SPORTS eigenständiger machen.
5. Ergebnisse von Build, CI, Browserchecks und Bild-/Performance-Prüfung inklusive noch offener Probleme.
6. Transparente Bildrechte-/Assetliste und gegebenenfalls klar benannte Launch-Blocker.
7. Wartbaren Code statt zehn übereinandergelegten Experiment-Stylesheets.

**Kein Merge, keine Änderung von main und keine produktive Vercel-Veröffentlichung ohne explizite Freigabe.** Die derzeitige öffentlich erreichbare raw.githack-Vorschau ist **keine** offizielle Markenwebsite; noindex ist kein Zugriffsschutz. Eine zukünftige eigene Domain, echtes Kontakt-Backend, Analytics, Commerce, Buchungen oder bezahlte Integrationen benötigen separate Entscheidung.

---

## 6. Harte Qualitätsbarriere — woran du erkennst, dass du noch nicht fertig bist

Wenn du die Seite durchscrollst und bei einem Kapitel denkst „netter Infoblock“, „generische KI-Webseite“, „vier schöne Kästen“, „Agenturportfolio“, „PPT-Folie“, „wahrscheinlich Stock“, „tolles Konzept, aber kein echtes Brand-Feeling“, **ist genau dieses Kapitel nicht fertig**.

Wenn das Hero-Kapitel unvergesslich, der Rest aber bloß ordentlich ist, **ist die Aufgabe nicht erfüllt**.

Deine selbstkritische Abschlussfrage lautet:

> Würde diese Marke neben einer hervorragend umgesetzten SOM-, Satisfy-, Leica- oder internationalen Lifestyle-Website als überzeugender eigener kultureller Auftritt bestehen – ohne dort Design zu kopieren?

Vermeide leere Superlative. Sage nicht einfach „perfekt“, weil der User dieses Wort früher als Qualitätsmaßstab verwendet hat. Er will eine Seite, auf der du **substanziell und nach sichtbarer Prüfung** keine wesentlichen gestalterischen Schwachstellen mehr erkennst.

**Qualität ist das Ziel, nicht die nächste Versionsnummer.** Beende nicht mit einer weiteren reinen Strategie-Antwort: **Baue die Website fertig und belege deine Entscheidungen am tatsächlichen Ergebnis.**

---

## 7. Leitplanken, Wahrhaftigkeit und Zusammenarbeit

- Nutze im deutschen Projektstatus **wir/unser** statt distanziert „ihr/euer“.
- Arbeite selbstständig; frage nur nach wirklich blockierenden Informationen oder zwingenden Freigaben. Verwende für offene Art-Direction-Details gut begründete eigene Entscheidungen.
- Keine fingierten Reviews, Partner, Testimonials, Rekordzahlen, Launchtermine oder Eventergebnisse.
- Kein unautorisierter Versand, kein echtes Kontaktformular-Backend ohne Freigabe: momentan erzeugt Kontakt lediglich einen lokalen Textentwurf.
- Keine fremden Font-Dateien im Handoff mitliefern und keine nicht lizenzierten Fonts stillschweigend einbetten.
- Nicht als „AI upscaled“ ausgeben, was nur größer gerechnet wurde.
- Echte Fotografie, KI-Studien und gezeichnete Konzepte klar unterscheiden. Unsplash-Lizenz bedeutet nicht automatisch eine Freigabe sämtlicher abgebildeter Menschen/Marken für Werbekampagnen.
- Unternehmensmarke und Movement richtig abgrenzen. Produkte und Prototypen als reale Entwicklungsstände behandeln.
- Änderungen müssen aus dem aktuellen Repo abgeleitet werden; historische Screenshots, Reviewnummern und alte README-Texte sind nicht die einzige Wahrheit.

**Claude, das ist ein Implementierungsauftrag mit hohem gestalterischem Anspruch. Beginne mit dem Repo, überprüfe den Istzustand, treffe eine überzeugende Creative-Entscheidung, setze sie technisch um, iteriere anhand echter Screenshots und liefere den fertigen prüfbaren Stand.**
