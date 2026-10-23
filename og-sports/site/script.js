'use strict';
(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const menuButton = document.querySelector('.menu-button');
  const menuDialog = document.getElementById('menu-dialog');
  const projectDialog = document.getElementById('project-dialog');
  const projectContent = document.getElementById('project-dialog-content');
  const contactDialog = document.getElementById('contact-dialog');
  const photoDialog = document.getElementById('photo-dialog');
  const languageButton = document.querySelector('.site-header .language');
  const order = ['challenge', 'apparel', 'live', 'stick'];
  const openers = new WeakMap();
  let lang = 'de';
  let activeProject = null;
  let lastMainTrigger = null;
  let currentDraft = '';

  // Authored copy only. Form input is never inserted as HTML.
  const copy = {
    de: {
      ui: {project: 'Projekt', next: 'Weiter', conversation: 'Aus einer Idee wird ein Gespräch.', approach: 'Der Ansatz',
        draftCopied: 'Entwurf kopiert', draftFallback: 'Text unten markieren und kopieren', copyDraft: 'Entwurf kopieren',
        required: 'Bitte fülle dieses Feld aus.', subject: 'Betreff: ', bodyStart: 'Hallo,', bodyEnd: 'Liebe Grüße',
        types: {community: 'Dabei sein', create: 'Zusammenarbeiten', partner: 'Partnerschaft'}, topic: t => 'Ich möchte gerne mehr über ' + t + ' erfahren.'},
      challenge: {category: 'Tägliche Praxis', status: 'Challenge-Konzept', title: 'FASTR30', intro: 'Nicht alles auf einmal.\nAber jeden Tag ein Stück.',
        cover: '30 Tage × 7 Standards · Challenge-Konzept',
        section: 'Kleine Dinge.\nJeden Tag.', body: 'Ein Rahmen für den eigenen Fortschritt. Sieben wiederkehrende Standards verbinden Erholung, Fokus, Bewegung und die Fähigkeit, in der du besser werden möchtest.',
        side: 'Der nächste Schritt muss nicht groß sein. Nur deiner.', note: '30 Tage. Sieben Standards. Ein eigener Rhythmus.', cta: 'Über FASTR30 sprechen', contact: 'community',
        extra: 'Dies sind die bestehenden Markenregeln des Challenge-Konzepts, keine individuell abgestimmten Gesundheitsempfehlungen.'},
      apparel: {category: 'Bekleidung', status: 'Designentwicklung', title: 'Wienerwald.', intro: 'Für die Strecke.\nUnd das Leben dazwischen.',
        cover: 'Eine Form, vier Farbstudien · KI-Visualisierung, keine Kollektion',
        section: 'Nicht nur,\nwas du trägst.', body: 'Wir entwickeln eine eigene Bekleidungssprache für OG SPORTS. Die aktuellen Cycling-Entwürfe arbeiten mit wenigen, großen geometrischen Flächen statt mit Dekor. Form, Farbe und Funktion werden gemeinsam gedacht.',
        side: 'Weitere Farbkonzepte aus der Entwicklung: Hagebutte Winterbuche, Holunder Eiche, Elderberry Mist, Lime Blueberry, Willow Plum, Coral Blood Orange, Grau, Weiß und Schwarz.',
        pillars: [['01', 'Form.', 'Klare Flächen, präzise Proportionen und eine eigene grafische Sprache.'], ['02', 'Funktion.', 'Bewegung und Nutzung bestimmen den Entwurf — nicht nur seine Wirkung im Bild.'], ['03', 'Haltung.', 'Sportbekleidung mit Charakter. Für Menschen, die ihren eigenen Weg gehen.']],
        note: 'Cycling als Ausgangspunkt. Ein eigener Blick als Maßstab.', cta: 'Über eine Zusammenarbeit sprechen', contact: 'create',
        extra: 'Das Bild ist eine KI-Visualisierung unserer Farbstudien, kein Foto eines Produkts. Farbwerte sind keine Produktionsvorgaben. Entwürfe, Materialien und Produktion befinden sich in Entwicklung.'},
      live: {category: 'Live', status: 'Formate in Planung', title: 'In real life.', intro: 'Sport bringt uns zusammen.\nKultur lässt uns bleiben.',
        cover: 'KI-Raumstudie · noch kein Termin, keine Eventdokumentation',
        section: 'Mehr als\nder Moment.', body: 'Wir entwickeln Formate, in denen Bewegung, Musik und Begegnungen zusammenkommen. Der Sport ist der Anfang. Was zwischen den Menschen entsteht, gehört genauso dazu.',
        side: 'Die besten Verbindungen entstehen nicht im Feed.',
        pillars: [['01', 'Move.', 'Ein gemeinsamer Anlass. Raum, um selbst in Bewegung zu kommen.'], ['02', 'Meet.', 'Menschen, Musik und neue Perspektiven. Sport trifft auf Kultur.'], ['03', 'Come back.', 'Ein Format, zu dem man wegen der Menschen zurückkommen möchte.']],
        note: 'Nicht nur zuschauen. Teil des Moments werden.', cta: 'Ein Format gemeinsam gestalten', contact: 'create',
        extra: 'Termine, Orte und Anmeldung folgen nach Bestätigung. Diese Vorschau kündigt kein buchbares Event an.'},
      stick: {category: 'Objekt', status: 'Prototyp in Entwicklung', title: 'FASTR STICK', intro: 'Eine kleine Idee.\nFür lange Strecken.',
        cover: 'Studio-Render aus CAD-Entwurf V0 · ungeprüft, kein Produkt',
        section: 'Weniger\ndazwischen.', body: 'Ein Anti-Chafing-Stick für Ausdauersport. Gedreht wird am Fuß: Die Gewindespindel hebt den Teller, der Balm kommt nach oben. Schlank, unkompliziert und mit einer Hand bedienbar — das ist das Entwicklungsziel.',
        side: 'Nicht mehr Funktionen. Eine Aufgabe, sorgfältig gelöst.',
        pillars: [['01', '30 ml.', 'Das geplante Volumen. In einer schlanken, zylindrischen Form.'], ['02', 'Eine Hand.', 'Einhandbedienung als Ziel. Die Mechanik wird schrittweise prototypisiert.'], ['03', 'Weiterdenken.', 'Aktuell im Fokus: Gehäuse, Führung und Schraubvorschub. Noch kein Serienprodukt.']],
        note: 'Form folgt Nutzung. Nicht umgekehrt.', cta: 'Über die Entwicklung sprechen', contact: 'create',
        extra: 'Render und Zeichnung zeigen die Geometrie unseres CAD-Entwurfs V0 mit vorgeschlagenen Maßen. Material und Licht sind Gestaltung. Passung, Dichtheit und Füllmenge sind noch nicht geprüft. Keine Vorbestellung.'}
    },
    en: {
      ui: {project: 'Project', next: 'Next', conversation: 'Every idea starts a conversation.', approach: 'The approach',
        draftCopied: 'Draft copied', draftFallback: 'Select and copy the text below', copyDraft: 'Copy draft',
        required: 'Please fill in this field.', subject: 'Subject: ', bodyStart: 'Hello,', bodyEnd: 'Best,',
        types: {community: 'Get involved', create: 'Collaboration', partner: 'Partnership'}, topic: t => 'I would like to learn more about ' + t + '.'},
      challenge: {category: 'Daily practice', status: 'Challenge concept', title: 'FASTR30', intro: 'Not everything at once.\nA little further, every day.',
        cover: '30 days × 7 standards · challenge concept',
        section: 'Small things.\nEvery day.', body: 'A framework for your own progress. Seven recurring standards bring together recovery, focus, movement and the skill you want to get better at.',
        side: 'The next step does not have to be big. Just yours.', note: '30 days. Seven standards. Your own rhythm.', cta: 'Talk about FASTR30', contact: 'community',
        extra: 'These are the existing brand rules of the challenge concept, not individually tailored health recommendations.'},
      apparel: {category: 'Apparel', status: 'Design development', title: 'Wienerwald.', intro: 'For the ride.\nAnd everything in between.',
        cover: 'One form, four colour studies · AI visualisation, not a collection',
        section: 'More than\nwhat you wear.', body: 'We are developing an independent apparel language for OG SPORTS. The current cycling concepts work with a few large geometric planes instead of decoration. Form, colour and function are designed together.',
        side: 'Further colour concepts in development: Hagebutte Winterbuche, Holunder Eiche, Elderberry Mist, Lime Blueberry, Willow Plum, Coral Blood Orange, grey, white and black.',
        pillars: [['01', 'Shape.', 'Clear surfaces, precise proportions and an independent graphic language.'], ['02', 'Function.', 'Movement and use shape the design — not just how it looks in a picture.'], ['03', 'Character.', 'Sportswear with its own perspective. For people who find their own way.']],
        note: 'Cycling as a starting point. Our own perspective as a standard.', cta: 'Explore a collaboration', contact: 'create',
        extra: 'The image is an AI visualisation of our colour studies, not a photograph of a product. Colour values are not production specifications. Designs, materials and production are in development.'},
      live: {category: 'Live', status: 'Formats in development', title: 'In real life.', intro: 'Sport brings us together.\nCulture makes us stay.',
        cover: 'AI space study · no date yet, not an event record',
        section: 'Beyond\nthe moment.', body: 'We are developing formats where movement, music and new connections come together. Sport is the beginning. What happens between people matters just as much.',
        side: 'The best connections do not happen in a feed.',
        pillars: [['01', 'Move.', 'A reason to come together. Space to get moving yourself.'], ['02', 'Meet.', 'People, music and new perspectives. Sport meets culture.'], ['03', 'Come back.', 'A format you want to return to because of the people.']],
        note: 'More than watching. Being part of the moment.', cta: 'Create an experience together', contact: 'create',
        extra: 'Dates, venues and registration will follow once confirmed. This preview does not announce a bookable event.'},
      stick: {category: 'Object', status: 'Prototype in development', title: 'FASTR STICK', intro: 'A small idea.\nFor the long run.',
        cover: 'Studio render from CAD draft V0 · untested, not a product',
        section: 'Less in\nthe way.', body: 'An anti-chafing stick for endurance sport. Turn the base: the threaded spindle lifts the cup and the balm comes up. Slim, uncomplicated and usable with one hand — that is the development goal.',
        side: 'Not more functions. One purpose, carefully considered.',
        pillars: [['01', '30 ml.', 'The planned capacity. In a slim, cylindrical form.'], ['02', 'One hand.', 'One-handed use as a goal. The mechanism is being prototyped step by step.'], ['03', 'Keep refining.', 'Current focus: housing, guide and screw-feed mechanism. Not a production product.']],
        note: 'Form follows use. Not the other way around.', cta: 'Talk about development', contact: 'create',
        extra: 'Render and drawing show the geometry of our CAD draft V0 with proposed dimensions. Material and light are art direction. Fit, sealing and fill volume have not been tested yet. No preorders.'}
    }
  };

  const escapeHTML = text => String(text).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

  // The dialog cover is the same authored plate as on the page, never a second drawing.
  function cover(key) {
    const source = document.querySelector('main [data-artefact="' + key + '"]');
    const wrap = document.createElement('div');
    wrap.className = 'story-cover story-cover-' + key;
    if (!source) return wrap;
    const clone = source.cloneNode(true);
    clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
    clone.querySelectorAll('img').forEach(img => { img.loading = 'eager'; });
    clone.removeAttribute('data-artefact');
    clone.removeAttribute('data-motion');
    clone.classList.add('is-in');
    if (key === 'challenge') wrap.classList.add('story-cover-ink');
    wrap.append(clone);
    return wrap;
  }

  function renderProject(key) {
    const c = copy[lang][key], ui = copy[lang].ui;
    if (!c) return;
    const index = order.indexOf(key), next = order[(index + 1) % order.length];
    const count = String(index + 1).padStart(2, '0');
    const lines = text => escapeHTML(text);
    projectDialog.dataset.story = key;
    document.querySelector('.project-counter').textContent = count + ' / 04';
    document.getElementById('next-project-label').textContent = copy[lang][next].title;
    document.getElementById('project-announcement').textContent = ui.project + ' ' + count + ' / 04 — ' + c.title;
    const pillars = c.pillars ? `<div class="story-pillars">${c.pillars.map(p => `<article><span class="label">${p[0]}</span><h4>${lines(p[1])}</h4><p>${lines(p[2])}</p></article>`).join('')}</div>` : '';
    projectContent.innerHTML = `<article class="story story-${key}">
      <header class="story-head"><p class="story-meta label"><span>${count} / ${lines(c.category)}</span><span>${lines(c.status)}</span></p>
        <h2 id="project-dialog-title" tabindex="-1">${lines(c.title)}</h2><p class="story-intro">${lines(c.intro)}</p></header>
      <figure class="story-figure"><div data-cover=""></div><figcaption class="frame-caption"><span>${lines(c.cover)}</span></figcaption></figure>
      <section aria-labelledby="story-section-title" class="story-body">
        <h3 id="story-section-title">${lines(c.section)}</h3>
        <div class="story-body-text"><p>${lines(c.body)}</p><p class="story-side">${lines(c.side)}</p></div>
        ${pillars}
        <div class="story-contact"><div><span class="label">${lines(ui.conversation)}</span><p>${lines(c.note)}</p></div>
          <button class="text-action" data-contact="${c.contact}" data-topic="${escapeHTML(c.title)}" type="button"><span>${lines(c.cta)}</span></button></div>
        <p class="story-disclaimer">${lines(c.extra)}</p>
      </section>
      <button class="story-next" data-project-step="1" type="button"><span class="label">${lines(ui.next)} / 0${order.indexOf(next) + 1}</span><span class="story-next-name">${lines(copy[lang][next].title)}</span></button>
    </article>`;
    projectContent.querySelector('[data-cover]').replaceWith(cover(key));
    if (!reduced.matches && projectDialog.open && projectContent.animate) {
      projectContent.getAnimations().forEach(a => a.cancel());
      projectContent.animate([{opacity: .3, transform: 'translateY(8px)'}, {opacity: 1, transform: 'none'}], {duration: 300, easing: 'cubic-bezier(.2,.7,.2,1)'});
    }
  }

  function translate(next) {
    lang = next === 'en' ? 'en' : 'de';
    root.lang = lang;
    document.querySelectorAll('[data-' + lang + ']').forEach(el => { el.textContent = el.getAttribute('data-' + lang); });
    document.querySelectorAll('[data-html-' + lang + ']').forEach(el => { el.innerHTML = el.getAttribute('data-html-' + lang); });
    document.querySelectorAll('[data-alt-' + lang + ']').forEach(el => { el.alt = el.getAttribute('data-alt-' + lang); });
    document.querySelectorAll('[data-label-' + lang + ']').forEach(el => { el.setAttribute('aria-label', el.getAttribute('data-label-' + lang)); });
    document.querySelectorAll('.lang-de').forEach(el => el.classList.toggle('active', lang === 'de'));
    document.querySelectorAll('.lang-en').forEach(el => el.classList.toggle('active', lang === 'en'));
    [languageButton, ...document.querySelectorAll('[data-switch-language]')].forEach(el => el.setAttribute('aria-label', lang === 'de' ? 'Switch to English' : 'Auf Deutsch wechseln'));
    if (activeProject && projectDialog.open) {
      const y = projectDialog.scrollTop;
      renderProject(activeProject);
      projectDialog.scrollTop = y;
    }
    if (photoDialog.open) renderPhoto();
    document.dispatchEvent(new Event('og:language'));
  }
  languageButton.addEventListener('click', () => translate(lang === 'de' ? 'en' : 'de'));

  function syncModalState() {
    document.body.classList.toggle('modal-open', !!document.querySelector('dialog[open]'));
    [menuButton, ...document.querySelectorAll('[data-nav-menu]')].forEach(b => b.setAttribute('aria-expanded', String(menuDialog.open)));
  }
  function openDialog(dialog, trigger) {
    if (!dialog || typeof dialog.showModal !== 'function') return;
    document.querySelectorAll('dialog[open]').forEach(other => { if (other !== dialog) other.close(); });
    if (trigger && !trigger.closest('dialog')) lastMainTrigger = trigger;
    openers.set(dialog, trigger && !trigger.closest('dialog') ? trigger : lastMainTrigger);
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
    syncModalState();
    (dialog === projectDialog ? dialog.querySelector('#project-dialog-title') : dialog.querySelector('[data-close]'))?.focus({preventScroll: true});
  }

  // Image notes: the opening image is shown as its unchanged original file.
  let photoReturn = null, photoReturnScroll = 0, photoOpener = null;
  const hero = {
    src: 'assets/after-the-run.webp', name: 'The moments\nin between.',
    kind: {de: 'Bestehende KI-Bildstudie', en: 'Existing AI image study'},
    description: {de: 'Unser Einstiegsmotiv. Hier das unveränderte Original mit 1.373 × 485 px.', en: 'Our opening image. Shown here as the unchanged 1,373 × 485 px original.'},
    context: {de: 'KI-Bildstudie, keine dokumentarische Aufnahme. Auf der Startseite zeigen wir eine vierfach hochgerechnete Kopie (Lanczos, leichte Schärfung). Sie vergrößert das Format, stellt aber keine fehlenden Details wieder her.', en: 'An AI image study, not a documentary photograph. The homepage shows a 4× resampled copy (Lanczos, gentle sharpening). It enlarges the format but does not recover missing detail.'},
    alt: {de: 'Bestehende KI-Bildstudie einer Gruppe nach dem Sport, Originaldatei', en: 'Existing AI image study of a group after sport, original file'},
    license: 'OG SPORTS / Design study'
  };
  function renderPhoto() {
    const image = document.getElementById('inspector-image');
    image.src = hero.src; image.alt = hero.alt[lang];
    document.getElementById('photo-title').textContent = hero.name;
    document.getElementById('photo-kind').textContent = hero.kind[lang];
    document.getElementById('photo-description').textContent = hero.description[lang];
    document.getElementById('photo-context').textContent = hero.context[lang];
    document.getElementById('photo-license').textContent = hero.license;
  }
  function openPhoto(trigger) {
    photoReturn = document.querySelector('dialog[open]');
    if (photoReturn === photoDialog) photoReturn = null;
    photoReturnScroll = photoReturn?.scrollTop || 0;
    photoOpener = trigger;
    renderPhoto();
    openDialog(photoDialog, trigger);
    document.getElementById('photo-title').focus({preventScroll: true});
  }
  photoDialog.addEventListener('close', () => {
    if (photoReturn && !document.querySelector('dialog[open]')) {
      const d = photoReturn; photoReturn = null;
      d.showModal(); d.scrollTop = photoReturnScroll; syncModalState();
      requestAnimationFrame(() => requestAnimationFrame(() => photoOpener?.isConnected && photoOpener.focus({preventScroll: true})));
    }
  });

  menuButton.addEventListener('click', () => openDialog(menuDialog, menuButton));
  document.addEventListener('click', event => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    if (target.closest('[data-switch-language]')) { translate(lang === 'de' ? 'en' : 'de'); return; }
    if (target.closest('[data-nav-menu]')) { openDialog(menuDialog, target.closest('[data-nav-menu]')); return; }
    const photo = target.closest('[data-photo]');
    if (photo) { event.preventDefault(); openPhoto(photo); return; }
    if (target.closest('[data-photo-return]')) { photoDialog.close(); return; }
    const close = target.closest('[data-close]');
    if (close) { close.closest('dialog')?.close(); syncModalState(); return; }
    const step = target.closest('[data-project-step]');
    if (step && projectDialog.open) {
      const i = order.indexOf(activeProject);
      activeProject = order[(i + Number(step.dataset.projectStep) + order.length) % order.length];
      renderProject(activeProject); projectDialog.scrollTop = 0;
      if (!step.closest('.project-browser')) document.getElementById('project-dialog-title')?.focus({preventScroll: true});
      return;
    }
    const project = target.closest('[data-project]');
    if (project) { event.preventDefault(); activeProject = project.dataset.project; renderProject(activeProject); openDialog(projectDialog, project); return; }
    const contact = target.closest('[data-contact]');
    if (contact) {
      event.preventDefault();
      const type = ['community', 'create', 'partner'].includes(contact.dataset.contact) ? contact.dataset.contact : 'community';
      document.querySelector('#contact-form input[value="' + type + '"]').checked = true;
      const message = document.getElementById('contact-message');
      if (contact.dataset.topic && !message.value.trim()) message.value = copy[lang].ui.topic(contact.dataset.topic);
      openDialog(contactDialog, contact);
      contactDialog.dispatchEvent(new Event('og:contact-type'));
      return;
    }
    const opener = target.closest('[data-dialog]');
    if (opener) { openDialog(document.getElementById(opener.dataset.dialog), opener); return; }
    const menuLink = target.closest('#menu-dialog a[href^="#"]');
    if (menuLink) {
      const destination = document.querySelector(menuLink.getAttribute('href'));
      openers.delete(menuDialog);
      menuDialog.close(); syncModalState();
      if (destination) {
        destination.setAttribute('tabindex', '-1');
        requestAnimationFrame(() => {
          destination.scrollIntoView({behavior: reduced.matches ? 'auto' : 'smooth', block: 'start'});
          destination.focus({preventScroll: true});
        });
      }
    }
  });

  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const focusable = [...dialog.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length && !el.hidden);
      if (!focusable.length) { event.preventDefault(); return; }
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    dialog.addEventListener('close', () => {
      syncModalState();
      if (document.querySelector('dialog[open]')) return;
      const opener = openers.get(dialog);
      const restore = () => {
        if (!document.querySelector('dialog[open]') && opener instanceof HTMLElement && opener.isConnected && opener.getClientRects().length) opener.focus({preventScroll: true});
      };
      restore();
      if (opener && document.activeElement !== opener) requestAnimationFrame(() => requestAnimationFrame(restore));
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog || dialog === menuDialog || dialog === projectDialog) return;
      const r = dialog.getBoundingClientRect();
      if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
    });
  });

  // Project hashes allow direct entry; one history entry per opening.
  let fromHash = false;
  let pageHash = location.hash.startsWith('#project-') ? '' : location.hash;
  function syncProjectHash() {
    const key = location.hash.replace(/^#project-/, '');
    if (location.hash.startsWith('#project-') && order.includes(key)) {
      fromHash = true; activeProject = key; renderProject(key);
      openDialog(projectDialog, document.querySelector('main [data-project="' + key + '"]'));
      fromHash = false;
    } else {
      pageHash = location.hash;
      if (projectDialog.open) { fromHash = true; projectDialog.close(); fromHash = false; }
    }
  }
  const renderWithoutHistory = renderProject;
  renderProject = function (key) {
    const wasOpen = projectDialog.open;
    renderWithoutHistory(key);
    if (fromHash) return;
    try {
      if (!wasOpen) { pageHash = location.hash.startsWith('#project-') ? '' : location.hash; history.pushState({ogProject: true}, '', '#project-' + key); }
      else history.replaceState({ogProject: true}, '', '#project-' + key);
    } catch {}
  };
  function clearProjectHash() {
    if (fromHash || !location.hash.startsWith('#project-')) return;
    try { history.replaceState(null, '', location.href.split('#')[0] + pageHash); } catch {}
  }
  projectDialog.addEventListener('cancel', clearProjectHash);
  projectDialog.addEventListener('close', () => { if (!projectDialog.open) clearProjectHash(); });
  addEventListener('popstate', syncProjectHash);
  addEventListener('hashchange', syncProjectHash);
  document.addEventListener('keydown', event => {
    if (!projectDialog.open || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    if (event.target.closest('input,textarea,[contenteditable="true"]')) return;
    event.preventDefault();
    const focusReplaced = projectContent.contains(document.activeElement);
    activeProject = order[(order.indexOf(activeProject) + (event.key === 'ArrowRight' ? 1 : -1) + order.length) % order.length];
    renderProject(activeProject); projectDialog.scrollTop = 0;
    if (focusReplaced) document.getElementById('project-dialog-title')?.focus({preventScroll: true});
  });
  queueMicrotask(syncProjectHash);

  // Contact: a local, copyable draft only. Nothing is sent or stored.
  const form = document.getElementById('contact-form');
  const result = form.querySelector('.contact-result');
  const contactContent = {
    de: {
      community: {title: 'Lass uns<br>losgehen.', intro: 'Du möchtest bei künftigen Aktivitäten dabei sein? Erzähl uns kurz, was dich interessiert.', placeholder: 'Welche Sportarten, Aktivitäten oder Ideen interessieren dich?'},
      create: {title: 'Etwas Eigenes.<br>Gemeinsam.', intro: 'Fotografie, Design, Musik oder ein neues Format: Was möchtest du mit uns gestalten?', placeholder: 'Deine Idee, dein Hintergrund und woran du mitarbeiten möchtest.'},
      partner: {title: 'Gute Ideen.<br>Gute Partner.', intro: 'Ein Ort, eine Marke oder eine Idee, die zu uns passt? Lass uns über eine Zusammenarbeit sprechen.', placeholder: 'Wer bist du und was können wir gemeinsam aufbauen?'}
    },
    en: {
      community: {title: 'Let’s get<br>moving.', intro: 'Want to join future activities? Tell us a little about what you are interested in.', placeholder: 'Which sports, activities or ideas interest you?'},
      create: {title: 'Something new.<br>Together.', intro: 'Photography, design, music or a new format: what would you like to create with us?', placeholder: 'Your idea, your background and what you would like to work on.'},
      partner: {title: 'Good ideas.<br>Good partners.', intro: 'A space, a brand or an idea that feels like us? Let’s talk about working together.', placeholder: 'Who are you, and what could we build together?'}
    }
  };
  function updateContact() {
    const type = form.querySelector('[name="type"]:checked')?.value || 'community';
    const c = contactContent[lang][type];
    document.getElementById('contact-title').innerHTML = c.title;
    document.getElementById('contact-context').textContent = c.intro;
    document.getElementById('contact-message').placeholder = c.placeholder;
  }
  form.addEventListener('change', event => { if (event.target.name === 'type') { updateContact(); result.hidden = true; } });
  contactDialog.addEventListener('og:contact-type', updateContact);
  document.addEventListener('og:language', updateContact);
  form.addEventListener('input', event => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      event.target.setCustomValidity(''); event.target.removeAttribute('aria-invalid');
    }
    result.hidden = true;
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const ui = copy[lang].ui;
    for (const field of [form.elements.name, form.elements.message]) {
      field.setCustomValidity(field.value.trim() ? '' : ui.required);
      field.setAttribute('aria-invalid', String(!field.value.trim()));
    }
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const type = String(data.get('type') || 'community');
    const subject = 'OG SPORTS — ' + (ui.types[type] || ui.types.community);
    currentDraft = ui.subject + subject + '\n\n' + ui.bodyStart + '\n\n' + String(data.get('message') || '').trim() + '\n\n' + ui.bodyEnd + '\n' + String(data.get('name') || '').trim();
    result.hidden = false;
    const draft = document.getElementById('draft-fallback');
    draft.value = currentDraft; draft.hidden = false;
    result.scrollIntoView({block: 'nearest', behavior: 'auto'});
    document.querySelector('#copy-draft span').textContent = ui.copyDraft;
  });
  document.getElementById('copy-draft').addEventListener('click', async event => {
    const label = event.currentTarget.querySelector('span');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(currentDraft);
      label.textContent = copy[lang].ui.draftCopied;
    } catch {
      const fallback = document.getElementById('draft-fallback');
      fallback.hidden = false; fallback.focus(); fallback.select();
      label.textContent = copy[lang].ui.draftFallback;
    }
  });

  // Motion: large images settle and the FASTR30 field fills once, when seen.
  // Without JavaScript, or with reduced motion, everything is shown complete.
  if ('IntersectionObserver' in window && !reduced.matches) {
    root.classList.add('motion-ok');
    const seen = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-in'); seen.unobserve(entry.target); }
    }), {threshold: .25});
    document.querySelectorAll('main [data-motion], main .bleed').forEach(el => seen.observe(el));
  }
  reduced.addEventListener?.('change', () => {
    if (reduced.matches) { root.classList.remove('motion-ok'); document.querySelectorAll('[data-motion], .bleed').forEach(el => el.classList.add('is-in')); }
  });

  // og:loops — muted video loops over the campaign stills. Not loaded with reduced
  // motion or without IntersectionObserver; play only while visible; each has a pause button.
  const loops = [...document.querySelectorAll('main video.loop[data-src]')];
  if (loops.length && 'IntersectionObserver' in window && !reduced.matches) {
    const held = new WeakSet();
    const toggleFor = video => video.parentElement.querySelector('.loop-toggle');
    const setLabel = (button, paused) => {
      button.setAttribute('aria-pressed', String(paused));
      const de = paused ? 'Bewegtbild abspielen' : 'Bewegtbild anhalten', en = paused ? 'Play motion' : 'Pause motion';
      button.dataset.labelDe = de; button.dataset.labelEn = en;
      button.setAttribute('aria-label', lang === 'de' ? de : en);
    };
    const play = video => {
      if (held.has(video)) return;
      if (!video.src) video.src = video.dataset.srcWebm && video.canPlayType('video/webm; codecs="vp9"') ? video.dataset.srcWebm : video.dataset.src;
      video.play().then(() => video.classList.add('is-playing')).catch(() => {});
    };
    const watch = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) play(entry.target); else entry.target.pause();
    }), {threshold: .2});
    loops.forEach(video => {
      watch.observe(video);
      const button = toggleFor(video);
      if (!button) return;
      button.hidden = false;
      button.addEventListener('click', () => {
        if (held.has(video)) { held.delete(video); setLabel(button, false); play(video); }
        else { held.add(video); video.pause(); setLabel(button, true); }
      });
    });
    reduced.addEventListener?.('change', () => { if (reduced.matches) loops.forEach(v => { v.pause(); v.classList.remove('is-playing'); }); });
  }

  translate('de');
  updateContact();
})();
