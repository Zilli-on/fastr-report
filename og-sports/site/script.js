'use strict';
(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const menuButton = document.querySelector('.menu-button');
  const menuDialog = document.getElementById('menu-dialog');
  const projectDialog = document.getElementById('project-dialog');
  const projectContent = document.getElementById('project-dialog-content');
  const contactDialog = document.getElementById('contact-dialog');
  const languageButton = document.querySelector('.language');
  const openers = new WeakMap();
  let lang = 'de';
  let activeProject = null;
  let lastMainTrigger = null;
  let currentDraft = '';

  // Only authored local copy is inserted into these templates. Form input is never HTML.
  const copy = {
    de: {
      challenge: {status:'CHALLENGE-KONZEPT',title:'FASTR30',lead:'30 Tage. 7 Standards. Dein Fortschritt.',body:'Ein tägliches System für Bewegung, Fokus und die Fähigkeit, in der du besser werden möchtest.',cta:'Über FASTR30 sprechen',note:'Dies sind die bestehenden Markenregeln des Challenge-Konzepts, keine individuell abgestimmten Gesundheitsempfehlungen.'},
      live: {status:'FORMATE IN PLANUNG',title:'Live Experiences',lead:'Sport bringt uns zusammen. Kultur lässt uns bleiben.',body:'Wir entwickeln Formate, in denen Running, Musik und Begegnungen zusammenkommen. Nicht nur zuschauen: selbst Teil des Moments werden.',extra:'Termine, Orte und Anmeldung folgen nach Bestätigung. Diese Vorschau kündigt kein buchbares Event an.',cta:'Ein Format gemeinsam gestalten'},
      apparel: {status:'DESIGNENTWICKLUNG',title:'OG SPORTS Apparel',lead:'Für die Strecke. Und das Leben dazwischen.',body:'Eine eigene Bekleidungssprache für OG SPORTS. Aktuell stehen Cycling-Entwürfe im Mittelpunkt: Form, Farbe und Funktion werden gemeinsam gedacht.',extra:'Das Foto von Coen van de Broek dient als Referenz für unsere Sportkultur. Es zeigt keine OG-Produkte oder Teammitglieder. Kollektion und Produktion sind nicht freigegeben.',cta:'Über eine Zusammenarbeit sprechen'},
      stick: {status:'PROTOTYP IN ENTWICKLUNG',title:'FASTR STICK',lead:'Ein kleines Produkt. Eine konkrete Aufgabe.',body:'Ein Anti-Chafing-Stick für Ausdauersport. 30 ml, eine schlanke zylindrische Form und Einhandbedienung als Entwicklungsziel.',extra:'Aktueller Schwerpunkt: Gehäuse und Schraubvorschub. Die Typografie zeigt eine Projektnotiz, keinen Produkt- oder CAD-Render. Keine Vorbestellung.',cta:'Über die Entwicklung sprechen'},
      rules:[['RECOVER','6+ Stunden Schlaf. Vor 8:30 Uhr aufstehen.'],['OWN YOUR MORNING','15+ Minuten ohne Ablenkung. Drei Dinge, für die du dankbar bist.'],['MOVE','30+ Minuten Bewegung.'],['READ','6+ Seiten lesen.'],['GET FASTR','30+ Minuten an einer Fähigkeit arbeiten.'],['FUEL','2–3 Liter trinken.'],['REFLECT','10+ Minuten Journal schreiben.']],
      types:{community:'Dabei sein',create:'Zusammenarbeiten',partner:'Partnerschaft'},
      bodyStart:'Hallo,',bodyEnd:'Liebe Grüße',draftCopied:'Entwurf kopiert',draftFallback:'Text unten markieren und kopieren',back:'Schließen',
    },
    en: {
      challenge: {status:'CHALLENGE CONCEPT',title:'FASTR30',lead:'30 days. 7 standards. Your progress.',body:'A daily system for movement, focus and the skill you want to get better at.',cta:'Talk about FASTR30',note:'These are the existing brand rules of the challenge concept, not individually tailored health recommendations.'},
      live: {status:'FORMATS IN DEVELOPMENT',title:'Live Experiences',lead:'Sport brings us together. Culture makes us stay.',body:'We are developing formats where running, music and new connections come together. More than watching: being part of the moment.',extra:'Dates, venues and registration will follow once confirmed. This preview does not announce a bookable event.',cta:'Create an experience together'},
      apparel: {status:'DESIGN DEVELOPMENT',title:'OG SPORTS Apparel',lead:'For the ride. And everything in between.',body:'An independent apparel language for OG SPORTS. Current work focuses on cycling concepts: shape, colour and function developed together.',extra:'The photograph by Coen van de Broek is a visual reference for our sports culture. It does not show OG products or team members. The collection and production are not approved.',cta:'Explore a collaboration'},
      stick: {status:'PROTOTYPE IN DEVELOPMENT',title:'FASTR STICK',lead:'A small product. A specific purpose.',body:'An anti-chafing stick for endurance sport. 30 ml, a slim cylindrical shape and one-handed use as a development goal.',extra:'Current focus: housing and screw-feed mechanism. The typographic visual is a project note, not a product or CAD rendering. No preorders.',cta:'Talk about development'},
      rules:[['RECOVER','6+ hours of sleep. Get up before 8:30.'],['OWN YOUR MORNING','15+ minutes without distractions. Three things you are grateful for.'],['MOVE','30+ minutes of exercise.'],['READ','Read 6+ pages.'],['GET FASTR','30+ minutes practising a skill.'],['FUEL','Drink 2–3 litres.'],['REFLECT','10+ minutes of journaling.']],
      types:{community:'Get involved',create:'Collaboration',partner:'Partnership'},
      bodyStart:'Hello,',bodyEnd:'Best,',draftCopied:'Draft copied',draftFallback:'Select and copy the text below',back:'Close',
    }
  };

  // V19 / Project stories. Authored copy only; never insert contact input as HTML.
  const storyText = {
    de: {
      index: 'Zur Übersicht', project: 'Projekt', approach: 'Der Ansatz', next: 'Weiter entdecken',
      details: 'Die Idee im Detail', conversation: 'Aus einer Idee wird ein Gespräch.',
      challenge: {
        category: 'Daily practice', title: 'FASTR30', intro: 'Nicht alles auf einmal.\nAber jeden Tag ein Stück.',
        body: 'Ein Rahmen für deinen eigenen Fortschritt. Sieben wiederkehrende Standards verbinden Bewegung, Fokus und die Dinge, in denen du besser werden möchtest.',
        note: '30 Tage. Sieben Standards. Ein eigener Rhythmus.',
        section: 'Kleine Dinge.\nJeden Tag.', overline: 'DIE SIEBEN STANDARDS',
        side: 'Der nächste Schritt muss nicht groß sein. Nur deiner.',
        coverNote: 'Typografische Projektstudie',
      },
      apparel: {
        category: 'Things we wear', title: 'Apparel.', intro: 'Für die Strecke.\nUnd das Leben dazwischen.',
        body: 'Wir entwickeln eine eigene Bekleidungssprache für OG SPORTS. Die aktuellen Cycling-Entwürfe verbinden klare Geometrie mit bewusst gesetzter Farbe. Funktion und Ausdruck werden zusammen gedacht.',
        note: 'Cycling als Ausgangspunkt. Ein eigener Blick als Maßstab.',
        section: 'Nicht nur,\nwas du trägst.', overline: 'DESIGN IN BEWEGUNG',
        side: 'Sichtbar eigenständig. Im Detail durchdacht.',
        coverNote: 'Coen van de Broek / Unsplash · Referenz, kein OG-Produkt',
        pillars: [['01','Form.','Klare Flächen, präzise Proportionen und eine eigene grafische Sprache.'],['02','Funktion.','Bewegung und Nutzung bestimmen den Entwurf — nicht nur seine Wirkung im Bild.'],['03','Haltung.','Sportbekleidung mit Charakter. Für Menschen, die ihren eigenen Weg gehen.']],
      },
      live: {
        category: 'Shared moments', title: 'Live<br>Experiences.', intro: 'Sport bringt uns zusammen.\nKultur lässt uns bleiben.',
        body: 'Wir entwickeln Formate, in denen Bewegung, Musik und Begegnungen zusammenkommen. Der Sport ist der Anfang. Was zwischen den Menschen entsteht, gehört genauso dazu.',
        note: 'Nicht nur zuschauen. Teil des Moments werden.',
        section: 'Mehr als\nder Moment.', overline: 'OFFLINE. TOGETHER.',
        side: 'Die besten Verbindungen entstehen nicht im Feed.',
        coverNote: 'KI-Kampagnenstudie · keine Eventdokumentation',
        pillars: [['01','Move.','Ein gemeinsamer Anlass. Raum, um selbst in Bewegung zu kommen.'],['02','Meet.','Menschen, Musik und neue Perspektiven. Sport trifft auf Kultur.'],['03','Come back.','Ein Format, zu dem man wegen der Menschen zurückkommen möchte.']],
      },
      stick: {
        category: 'Useful things', title: 'FASTR STICK', intro: 'Eine kleine Idee.\nFür lange Strecken.',
        body: 'Ein Anti-Chafing-Stick für Ausdauersport. Der aktuelle Prototyp konzentriert sich auf das Gehäuse und den Schraubvorschub. Schlank, unkompliziert und mit einer Hand bedienbar: Das ist das Entwicklungsziel.',
        note: 'Form folgt Nutzung. Nicht umgekehrt.',
        section: 'Weniger\ndazwischen.', overline: 'FORM. FUNCTION. ITERATION.',
        side: 'Nicht mehr Funktionen. Eine Aufgabe, sorgfältig gelöst.',
        coverNote: 'Typografische Projektstudie · kein CAD-Render',
        pillars: [['01','30 ml.','Das geplante Volumen. In einer schlanken, zylindrischen Form.'],['02','Eine Hand.','Einhandbedienung als Ziel. Die Mechanik wird schrittweise prototypisiert.'],['03','Weiterdenken.','Aktuell im Fokus: Gehäuse, Führung und Schraubvorschub. Noch kein Serienprodukt.']],
      }
    },
    en: {
      index: 'Back to overview', project: 'Project', approach: 'The approach', next: 'Keep exploring',
      details: 'Inside the idea', conversation: 'Every idea starts a conversation.',
      challenge: {
        category: 'Daily practice', title: 'FASTR30', intro: 'Not everything at once.\nA little further, every day.',
        body: 'A framework for your own progress. Seven recurring standards bring together movement, focus and the things you want to get better at.',
        note: '30 days. Seven standards. Your own rhythm.',
        section: 'Small things.\nEvery day.', overline: 'THE SEVEN STANDARDS',
        side: 'The next step does not have to be big. Just yours.',
        coverNote: 'Typographic project study',
      },
      apparel: {
        category: 'Things we wear', title: 'Apparel.', intro: 'For the ride.\nAnd everything in between.',
        body: 'We are developing an independent apparel language for OG SPORTS. Our current cycling concepts combine clear geometry with considered colour. Function and expression are designed together.',
        note: 'Cycling as a starting point. Our own perspective as a standard.',
        section: 'More than\nwhat you wear.', overline: 'DESIGN IN MOTION',
        side: 'Distinctive on the outside. Considered in every detail.',
        coverNote: 'Coen van de Broek / Unsplash · reference, not an OG product',
        pillars: [['01','Shape.','Clear surfaces, precise proportions and an independent graphic language.'],['02','Function.','Movement and use shape the design — not just how it looks in a picture.'],['03','Character.','Sportswear with its own perspective. For people who find their own way.']],
      },
      live: {
        category: 'Shared moments', title: 'Live<br>Experiences.', intro: 'Sport brings us together.\nCulture makes us stay.',
        body: 'We are developing formats where movement, music and new connections come together. Sport is the beginning. What happens between people matters just as much.',
        note: 'More than watching. Being part of the moment.',
        section: 'Beyond\nthe moment.', overline: 'OFFLINE. TOGETHER.',
        side: 'The best connections do not happen in a feed.',
        coverNote: 'AI campaign study · not an event record',
        pillars: [['01','Move.','A reason to come together. Space to get moving yourself.'],['02','Meet.','People, music and new perspectives. Sport meets culture.'],['03','Come back.','A format you want to return to because of the people.']],
      },
      stick: {
        category: 'Useful things', title: 'FASTR STICK', intro: 'A small idea.\nFor the long run.',
        body: 'An anti-chafing stick for endurance sport. The current prototype focuses on the housing and screw-feed mechanism. Slim, uncomplicated and usable with one hand: that is the development goal.',
        note: 'Form follows use. Not the other way around.',
        section: 'Less in\nthe way.', overline: 'FORM. FUNCTION. ITERATION.',
        side: 'Not more functions. One purpose, carefully considered.',
        coverNote: 'Typographic project study · not a CAD rendering',
        pillars: [['01','30 ml.','The planned capacity. In a slim, cylindrical form.'],['02','One hand.','One-handed use as a goal. The mechanism is being prototyped step by step.'],['03','Keep refining.','Current focus: housing, guide and screw-feed mechanism. Not a production product.']],
      }
    }
  };

  function renderProject(key) {
    const c = copy[lang][key];
    if (!c) return;
    const common=storyText[lang], s=common[key];
    const order=['challenge','apparel','live','stick'], index=order.indexOf(key), next=order[(index+1)%4];
    const count=String(index+1).padStart(2,'0');
    projectDialog.dataset.story=key;
    document.querySelector('.project-counter').textContent=count+' / 04';
    document.getElementById('next-project-label').textContent=copy[lang][next].title;
    const announcement=document.getElementById('project-announcement');
    if(announcement) announcement.textContent=common.project+' '+count+' / 04 — '+c.title;
    const linebreak=t=>t.replace(/\n/g,'<br>');
    const calendar=Array.from({length:30},(_,i)=>'<span>'+String(i+1).padStart(2,'0')+'</span>').join('');
    let art='';
    if(key==='challenge'){
      art=`<div class="story-cover practice-cover"><div class="story-poster"><div class="poster-top micro"><span>The daily practice.</span><span>FASTR30</span></div><span class="poster-thirty" aria-hidden="true">30<span>.</span></span><span class="poster-calendar" aria-hidden="true">${calendar}</span><div class="poster-bottom"><p>One day.<br>Then another.</p><span class="micro">30 days.<br>7 standards.</span></div></div><span class="cover-edge-note micro" aria-hidden="true">Progress, on your terms.</span></div>`;
    }else if(key==='apparel'){
      art=`<div class="story-cover apparel-cover"><div class="story-photo-frame"><img src="assets/cycling-photograph.webp" width="1800" height="1200" referrerpolicy="no-referrer" alt="${lang==='de'?'Fotografie von Coen van de Broek: zwei Radfahrerinnen am Meer; keine OG-SPORTS-Produkte':'Photograph by Coen van de Broek: two cyclists by the sea; not OG SPORTS products'}"><span class="frame-corner corner-tl"></span><span class="frame-corner corner-br"></span></div><p class="story-campaign" data-campaign="Beyond&#10;the ride." aria-hidden="true">Beyond<br>the ride.</p><span class="cover-edge-note micro" aria-hidden="true">Culture in motion.</span></div>`;
    }else if(key==='live'){
      art=`<div class="story-cover live-cover"><div class="story-photo-frame"><img src="assets/movement-rooftop.webp" width="1536" height="1024" alt="${lang==='de'?'KI-Kampagnenstudie einer urbanen Laufgruppe, keine tatsächliche Veranstaltung':'AI campaign study of an urban running group, not an actual event'}"><span class="frame-corner corner-tl"></span><span class="frame-corner corner-br"></span></div><p class="story-campaign" aria-hidden="true">Out of the feed.<br>Into life.</p><span class="cover-edge-note micro" aria-hidden="true">Sport. Sound. People.</span></div>`;
    }else{
      art=`<div class="story-cover product-cover"><div class="product-poster"><div class="poster-top micro"><span>FASTR STICK</span><span>Work in progress.</span></div><p class="product-campaign">Less<br>friction.</p><span class="product-volume" aria-hidden="true">30<small>ml</small></span><div class="poster-bottom"><span class="micro">Form. Function.<br>Iteration.</span><span class="product-lines" aria-hidden="true"></span></div></div><span class="cover-edge-note micro" aria-hidden="true">One purpose. Carefully considered.</span></div>`;
    }
    const ruleTitles=['Rest. Reset.','Make space.','Keep moving.','Stay curious.','Get better.','Refuel.','Look back.'];
    const rules=key==='challenge'?`<div class="practice-layout"><aside class="practice-aside"><span class="micro">${common.challenge.overline}</span><span class="practice-number" aria-hidden="true">01</span><p class="practice-phrase" aria-hidden="true">${ruleTitles[0]}</p><span class="practice-side-caption micro">A little, every day.</span></aside><ol class="rules-list">${copy[lang].rules.map((r,i)=>`<li><details class="standard-rule" ${i===0?'open':''} data-standard="${i}"><summary><span class="standard-index">${String(i+1).padStart(2,'0')}</span><span class="standard-name">${r[0]}</span><span class="standard-plus" aria-hidden="true"></span></summary><p>${r[1]}</p></details></li>`).join('')}</ol></div><p class="story-disclaimer">${c.note}</p>`:`<div class="story-principles">${s.pillars.map(p=>`<article><span class="micro">${p[0]}</span><h4>${p[1]}</h4><p>${p[2]}</p></article>`).join('')}</div>`;
    const nextName=storyText[lang][next].title.replace('<br>',' ');
    const nextThumb=next==='apparel'?'assets/cycling-photograph.webp':next==='live'?'assets/movement-rooftop.webp':null;
    const thumb=nextThumb?`<img src="${nextThumb}" alt="" loading="lazy">`:`<span>${next==='challenge'?'30.':'30<small>ml</small>'}</span>`;
    projectContent.innerHTML=`<article class="project-story story-${key}">
      <header class="story-heading"><div class="story-meta micro"><span>${count} / ${s.category}</span><span>${c.status}</span></div><div class="story-title-row"><h2 id="project-dialog-title" tabindex="-1">${s.title}</h2><p class="story-intro">${linebreak(s.intro)}</p></div></header>
      ${art}<div class="story-cover-caption"><span class="micro">${s.coverNote}</span><button type="button" class="story-jump" data-story-jump><span>${common.details}</span><span aria-hidden="true">↓</span></button></div>
      <section class="story-body" aria-labelledby="story-section-title"><div class="story-section-meta micro"><span>( ${common.approach} )</span><span>${s.overline}</span></div><div class="story-body-intro"><h3 id="story-section-title">${linebreak(s.section)}</h3><div><p>${s.body}</p><span class="story-side-note">${s.side}</span></div></div>${rules}
      <div class="story-contact"><div><span class="micro">${common.conversation}</span><p>${s.note}</p></div><button class="quiet-link" type="button" data-contact="${key==='challenge'?'community':'create'}" data-topic="${c.title}"><span>${c.cta}</span><span aria-hidden="true">↗</span></button></div>
      ${c.extra?`<p class="story-disclaimer">${c.extra}</p>`:''}</section>
      <button type="button" class="story-next-cover" data-project-step="1" aria-label="${common.next}: ${nextName}"><span class="micro next-overline">${common.next} / ${String(order.indexOf(next)+1).padStart(2,'0')}</span><span class="next-project-name">${nextName}</span><span class="next-art next-art-${next}" aria-hidden="true">${thumb}</span><span class="next-big-arrow" aria-hidden="true">↗</span></button>
    </article>`;
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches && projectDialog.open){
      projectContent.getAnimations?.().forEach(animation=>animation.cancel());
      projectContent.animate([{opacity:.25,transform:'translateY(9px)'},{opacity:1,transform:'translateY(0)'}],{duration:310,easing:'cubic-bezier(.2,.7,.2,1)'});
    }
    projectContent.querySelectorAll('.standard-rule').forEach(detail=>{
      detail.addEventListener('toggle',()=>{
        if(!detail.open)return;
        projectContent.querySelectorAll('.standard-rule').forEach(other=>{if(other!==detail)other.open=false;});
        const i=Number(detail.dataset.standard);
        projectContent.querySelector('.practice-number').textContent=String(i+1).padStart(2,'0');
        projectContent.querySelector('.practice-phrase').textContent=ruleTitles[i];
      });
    });
    projectContent.querySelector('[data-story-jump]')?.addEventListener('click',()=>{
      const body=projectContent.querySelector('.story-body'), bar=projectDialog.querySelector('.dialog-bar');
      const top=body.getBoundingClientRect().top-projectDialog.getBoundingClientRect().top+projectDialog.scrollTop-bar.getBoundingClientRect().height-20;
      projectDialog.scrollTo({top,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
    });
  }

  function translate(next) {
    lang = next === 'en' ? 'en' : 'de';
    root.lang = lang;
    document.querySelectorAll('[data-'+lang+']').forEach(el=>{el.textContent=el.getAttribute('data-'+lang);});
    document.querySelectorAll('[data-html-'+lang+']').forEach(el=>{el.innerHTML=el.getAttribute('data-html-'+lang);});
    document.querySelectorAll('[data-alt-'+lang+']').forEach(el=>{el.alt=el.getAttribute('data-alt-'+lang);});
    document.querySelectorAll('[data-label-'+lang+']').forEach(el=>{el.setAttribute('aria-label',el.getAttribute('data-label-'+lang));});
    document.querySelectorAll('.lang-de').forEach(el=>el.classList.toggle('active',lang==='de'));
    document.querySelectorAll('.lang-en').forEach(el=>el.classList.toggle('active',lang==='en'));
    [languageButton,...document.querySelectorAll('[data-switch-language]')].forEach(el=>el.setAttribute('aria-label',lang==='de'?'Switch to English':'Auf Deutsch wechseln'));
    if (activeProject && projectDialog.open) {
      const y=projectDialog.scrollTop;
      const selected=projectContent.querySelector('.standard-rule[open]')?.dataset.standard;
      renderProject(activeProject);
      if(selected){
        projectContent.querySelectorAll('.standard-rule').forEach(el=>el.open=el.dataset.standard===selected);
      }
      projectDialog.scrollTop=y;
    }
    if(document.getElementById('photo-dialog').open)renderPhoto();
  }
  languageButton.addEventListener('click',()=>translate(lang==='de'?'en':'de'));

  function syncModalState() {
    const anyOpen = !!document.querySelector('dialog[open]');
    document.body.classList.toggle('modal-open',anyOpen);
    [menuButton,...document.querySelectorAll('[data-nav-menu]')].forEach(b=>b.setAttribute('aria-expanded',String(menuDialog.open)));
    document.dispatchEvent(new Event('og:modal-state'));
  }
  function openDialog(dialog, trigger) {
    if (!dialog || typeof dialog.showModal !== 'function') return;
    document.querySelectorAll('dialog[open]').forEach(other=>{if(other!==dialog)other.close();});
    if (trigger && !trigger.closest('dialog')) lastMainTrigger = trigger;
    openers.set(dialog,trigger && !trigger.closest('dialog') ? trigger : lastMainTrigger);
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
    syncModalState();
    (dialog===projectDialog?dialog.querySelector('#project-dialog-title'):dialog.querySelector('[data-close]'))?.focus({preventScroll:true});
  }

  // V21 — source-aware photo inspector; original photographs are never rebranded.
  const photoDialog=document.getElementById('photo-dialog');
  let selectedPhoto='hero',photoReturn=null,photoReturnScroll=0,photoOpener=null;
  const photographs={
    running:{src:"assets/running-photograph.webp",name:'Mathias Reding',kind:{de:'Fotografie / Montréal',en:'Photography / Montréal'},description:{de:'Ein Läufer. Eine Straße. Der Moment dazwischen.',en:'A runner. A street. The moment in between.'},context:{de:'Echte Fotografie aus Montréal. Visuelle Referenz für Bewegung, kein OG-Event oder Teammitglied.',en:'Real photography from Montréal. A visual reference for movement, not an OG event or team member.'},source:'https://unsplash.com/photos/man-running-across-a-blurred-city-street-MiRyAuFhepg',alt:{de:'Läufer auf einer Straße in Montréal, fotografiert von Mathias Reding',en:'Runner on a street in Montréal, photographed by Mathias Reding'},license:'Unsplash License · 2025'},
    cycling:{src:"assets/cycling-photograph.webp",name:'Coen van de Broek',kind:{de:'Fotografie / Brouwersdam',en:'Photography / Brouwersdam'},description:{de:'Eine gemeinsame Ausfahrt. Nicht nur Kilometer.',en:'A shared ride. More than miles.'},context:{de:'Echte Fotografie an der niederländischen Küste. Die abgebildete Kleidung und Fahrräder sind keine OG-Produkte. Keine behauptete Partnerschaft.',en:'Real photography on the Dutch coast. The clothing and bicycles shown are not OG products. No partnership is implied.'},source:'https://unsplash.com/photos/man-and-woman-riding-road-bikes-at-the-road-near-shore-OFyh9TpMyM8',alt:{de:'Zwei Radfahrerinnen am Meer, fotografiert von Coen van de Broek',en:'Two cyclists by the sea, photographed by Coen van de Broek'},license:'Unsplash License · 2018'},
    hero:{src:'assets/after-the-run.webp',name:'The moments\nin between.',kind:{de:'Bestehende KI-Bildstudie',en:'Existing AI image study'},description:{de:'Unser bestehendes Einstiegsmotiv. Unverändert beibehalten.',en:'Our existing opening image. Kept unchanged.'},context:{de:'Dieses Motiv ist eine KI-Bildstudie aus unserer bisherigen Gestaltung. Es ist keine dokumentarische Aufnahme von echten OG-Teammitgliedern.',en:'This image is an AI study from our previous design work. It is not a documentary photograph of actual OG team members.'},source:null,alt:{de:'Bestehende KI-Bildstudie einer Gruppe nach dem Sport',en:'Existing AI image study of a group after sport'},license:'OG SPORTS / Design study'},
  };
  function setPhotoTreatment(tone){
    const original=tone==='original';photoDialog.classList.toggle('show-original',original);
    photoDialog.querySelectorAll('[data-photo-treatment]').forEach(b=>b.setAttribute('aria-pressed',String((b.dataset.photoTreatment==='original')===original)));
  }
  function renderPhoto(){
    const p=photographs[selectedPhoto];
    const image=document.getElementById('inspector-image');image.src=p.src;image.alt=p.alt[lang];
    document.getElementById('photo-title').textContent=p.name;
    document.getElementById('photo-kind').textContent=p.kind[lang];
    document.getElementById('photo-description').textContent=p.description[lang];
    document.getElementById('photo-context').textContent=p.context[lang];
    document.getElementById('photo-license').textContent=p.license;
    const source=document.getElementById('photo-source');source.hidden=!p.source;
    if(p.source)source.href=p.source;else source.removeAttribute('href');
    photoDialog.querySelector('.photo-view-controls').hidden=selectedPhoto==='hero';
    photoDialog.dataset.photoKind=selectedPhoto;
  }
  function openPhoto(key,trigger){
    if(key==='hero'&&trigger?.closest('.hero-caption')){
      const mode=document.querySelector('.hero-photo')?.dataset.mode;
      key=mode==='move'?'running':mode==='make'?'cycling':'hero';
    }
    if(!photographs[key])return;
    photoReturn=document.querySelector('dialog[open]');
    if(photoReturn===photoDialog)photoReturn=null;
    photoReturnScroll=photoReturn?.scrollTop||0;photoOpener=trigger;
    selectedPhoto=key;renderPhoto();setPhotoTreatment('tonal');openDialog(photoDialog,trigger);
    document.getElementById('photo-title').focus({preventScroll:true});
  }
  function closePhoto(){photoDialog.close();}
  photoDialog.addEventListener('close',()=>{
    if(photoReturn&&!document.querySelector('dialog[open]')){
      const d=photoReturn;photoReturn=null;d.showModal();d.scrollTop=photoReturnScroll;syncModalState();
      requestAnimationFrame(()=>requestAnimationFrame(()=>photoOpener?.isConnected&&photoOpener.focus({preventScroll:true})));
    }
  });

  menuButton.addEventListener('click',()=>openDialog(menuDialog,menuButton));
  document.addEventListener('click',event=>{
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    if(target.closest('[data-switch-language]')){translate(lang==='de'?'en':'de');return;}
    if(target.closest('[data-nav-menu]')){openDialog(menuDialog,target.closest('[data-nav-menu]'));return;}
    const photoTrigger=target.closest('[data-photo]');
    if(photoTrigger){event.preventDefault();openPhoto(photoTrigger.dataset.photo,photoTrigger);return;}
    const photoTone=target.closest('[data-photo-treatment]');
    if(photoTone){setPhotoTreatment(photoTone.dataset.photoTreatment);return;}
    if(target.closest('[data-photo-return]')){closePhoto();return;}
    const close = target.closest('[data-close]');
    if (close) { close.closest('dialog')?.close(); syncModalState(); return; }
    const step=target.closest('[data-project-step]');
    if(step && projectDialog.open){
      const order=['challenge','apparel','live','stick'];
      const i=order.indexOf(activeProject);
      const next=(i+Number(step.dataset.projectStep)+order.length)%order.length;
      const stable=!!step.closest('.project-browser');
      activeProject=order[next]; renderProject(activeProject); projectDialog.scrollTop=0;
      if(!stable)document.getElementById('project-dialog-title')?.focus({preventScroll:true});
      return;
    }
    const project = target.closest('[data-project]');
    if (project) { event.preventDefault(); activeProject=project.dataset.project;renderProject(activeProject);openDialog(projectDialog,project);return; }
    const contact = target.closest('[data-contact]');
    if (contact) {
      event.preventDefault();
      const type = ['community','create','partner'].includes(contact.dataset.contact)?contact.dataset.contact:'community';
      document.querySelector('#contact-form input[value="'+type+'"]').checked=true;
      if (contact.dataset.topic && !document.getElementById('contact-message').value.trim()) {
        document.getElementById('contact-message').value = lang==='de' ? 'Ich möchte gerne mehr über '+contact.dataset.topic+' erfahren.' : 'I would like to learn more about '+contact.dataset.topic+'.';
      }
      openDialog(contactDialog,contact);return;
    }
    const trigger = target.closest('[data-dialog]');
    if (trigger) { openDialog(document.getElementById(trigger.dataset.dialog),trigger);return; }
    const menuLink = target.closest('#menu-dialog a[href^="#"]');
    if (menuLink) {
      const destination=document.querySelector(menuLink.getAttribute('href'));
      openers.delete(menuDialog);
      menuDialog.close(); syncModalState();
      if(destination){
        destination.setAttribute('tabindex','-1');
        requestAnimationFrame(()=>{
          destination.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
          destination.focus({preventScroll:true});
        });
      }
    }
  });
  document.querySelectorAll('dialog').forEach(dialog=>{
    dialog.addEventListener('keydown',event=>{
      if(event.key!=='Tab')return;
      const focusable=[...dialog.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(el=>el.getClientRects().length && !el.hidden);
      if(!focusable.length){event.preventDefault();return;}
      const first=focusable[0],last=focusable[focusable.length-1];
      if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
    });
    dialog.addEventListener('close',()=>{
      syncModalState();
      if (!document.querySelector('dialog[open]')) {
        const opener=openers.get(dialog);
        const restore=()=>{
          if(!document.querySelector('dialog[open]') && opener instanceof HTMLElement && opener.isConnected && opener.getClientRects().length)opener.focus({preventScroll:true});
        };
        restore();
        // Explicit inert restoration can settle after painting the native
        // modal closes. Retry only when focus has not reached its opener.
        if(opener && document.activeElement!==opener)requestAnimationFrame(()=>requestAnimationFrame(restore));
      }
    });
    dialog.addEventListener('click',event=>{
      if(event.target!==dialog || dialog===menuDialog)return;
      const rect=dialog.getBoundingClientRect();
      if(event.clientX<rect.left || event.clientX>rect.right || event.clientY<rect.top || event.clientY>rect.bottom)dialog.close();
    });
  });

  // Project hashes support direct entry without changing the page's scrolling model.
  const projectKeys=['challenge','apparel','live','stick'];
  let fromHash=false;
  let pageHash=location.hash.startsWith('#project-')?'':location.hash;
  function syncProjectHash(){
    const key=location.hash.replace(/^#project-/,'');
    if(location.hash.startsWith('#project-') && projectKeys.includes(key)){
      fromHash=true;activeProject=key;renderProject(key);
      const trigger=document.querySelector('main [data-project="'+key+'"]');
      openDialog(projectDialog,trigger);fromHash=false;
    }else{
      pageHash=location.hash;
      if(projectDialog.open){fromHash=true;projectDialog.close();fromHash=false;}
    }
  }
  // Use replaceState after a dialog is already open, one history entry per opening.
  const originalRenderProject=renderProject;
  renderProject=function(key){
    const wasOpen=projectDialog.open;
    originalRenderProject(key);
    if(fromHash)return;
    if(!wasOpen){
      pageHash=location.hash.startsWith('#project-')?'':location.hash;
      try{history.pushState({ogProject:true},'', '#project-'+key);}catch{}
    }else{
      try{history.replaceState({ogProject:true},'', '#project-'+key);}catch{}
    }
  };
  function clearProjectHash(){
    if(fromHash || !location.hash.startsWith('#project-'))return;
    try{history.replaceState(null,'',location.href.split('#')[0]+pageHash);}catch{}
  }
  // Cancel is synchronous; close is queued by the browser. A stale close event
  // must not erase the URL of a project that has just been opened again.
  projectDialog.addEventListener('cancel',clearProjectHash);
  projectDialog.addEventListener('close',()=>{
    if(!projectDialog.open)clearProjectHash();
  });
  addEventListener('popstate',syncProjectHash);
  addEventListener('hashchange',syncProjectHash);
  document.addEventListener('keydown',event=>{
    if(!projectDialog.open || !['ArrowLeft','ArrowRight'].includes(event.key))return;
    if(event.target.closest('input,textarea,select,[contenteditable="true"]'))return;
    event.preventDefault();
    const order=projectKeys, i=order.indexOf(activeProject);
    const focusReplaced=projectContent.contains(document.activeElement);
    activeProject=order[(i+(event.key==='ArrowRight'?1:-1)+order.length)%order.length];
    renderProject(activeProject);projectDialog.scrollTop=0;
    if(focusReplaced)document.getElementById('project-dialog-title')?.focus({preventScroll:true});
  });
  queueMicrotask(syncProjectHash);

  const form=document.getElementById('contact-form');
  form.addEventListener('input',event=>{
    if(event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement){
      event.target.setCustomValidity('');event.target.removeAttribute('aria-invalid');
    }
    // Avoid keeping a visibly successful old draft after edits.
    document.querySelector('.contact-result').hidden=true;
  });
  form.addEventListener('submit',event=>{
    event.preventDefault();
    for(const field of [form.elements.name,form.elements.message]){
      field.setCustomValidity(field.value.trim()?'':(lang==='de'?'Bitte fülle dieses Feld aus.':'Please fill in this field.'));
      field.setAttribute('aria-invalid',String(!field.value.trim()));
    }
    if(!form.reportValidity())return;
    const data=new FormData(form);
    const type=String(data.get('type')||'community');
    const name=String(data.get('name')||'').trim();
    const message=String(data.get('message')||'').trim();
    const subject='OG SPORTS — '+(copy[lang].types[type]||copy[lang].types.community);
    const body=copy[lang].bodyStart+'\n\n'+message+'\n\n'+copy[lang].bodyEnd+'\n'+name;
    // Deliberately local-only until a publishing contact and privacy copy are approved.
    currentDraft=(lang==='de'?'Betreff: ':'Subject: ')+subject+'\n\n'+body;
    const result=document.querySelector('.contact-result');
    result.hidden=false;
    const draft=document.getElementById('draft-fallback');
    draft.value=currentDraft;draft.hidden=false;
    result.scrollIntoView({block:'nearest',behavior:'auto'});
    document.getElementById('copy-draft').querySelector('span:first-child').textContent=lang==='de'?'Entwurf kopieren':'Copy draft';
  });
  document.getElementById('copy-draft').addEventListener('click',async event=>{
    const button=event.currentTarget;
    try {
      if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(currentDraft);
      button.querySelector('span:first-child').textContent=copy[lang].draftCopied;
    } catch {
      const fallback=document.getElementById('draft-fallback');fallback.hidden=false;fallback.focus();fallback.select();
      button.querySelector('span:first-child').textContent=copy[lang].draftFallback;
    }
  });

  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window) {
    root.classList.add('has-reveals');
    const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}
    }),{threshold:.08});
    document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));
    const sections=[...document.querySelectorAll('#brand,#fastr,#projects')];
    const navObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      document.querySelectorAll('.desktop-nav a').forEach(a=>{
        if(a.getAttribute('href')==='#'+entry.target.id)a.setAttribute('aria-current','location');
        else a.removeAttribute('aria-current');
      });
    }),{rootMargin:'-15% 0px -55% 0px'});
    sections.forEach(s=>navObserver.observe(s));
  } else document.querySelectorAll('.reveal').forEach(el=>el.classList.add('is-visible'));
  let ticking=false;
  function updateProgress(){
    const total=root.scrollHeight-window.innerHeight;
    document.querySelector('.scroll-progress').style.transform='scaleX('+(total>0?Math.min(1,window.scrollY/total):0)+')';
    ticking=false;
  }
  window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateProgress);ticking=true;}},{passive:true});
  window.addEventListener('resize',updateProgress,{passive:true});
  reduced.addEventListener?.('change',()=>{
    if(reduced.matches)document.querySelectorAll('.reveal').forEach(el=>el.classList.add('is-visible'));
  });
  translate('de');
  updateProgress();
})();

// The visual index is deliberately manual. A decoded image crossfades with the
// existing photograph, so rapid clicks never create an empty frame.
(() => {
  const image=document.getElementById('hero-photo');
  const photo=image?.closest('.hero-photo');
  const caption=document.getElementById('hero-caption');
  const tabs=document.querySelector('.hero-tabs');
  const indicator=tabs?.querySelector('.scene-indicator');
  const number=document.getElementById('scene-number');
  const note=document.getElementById('hero-note');
  if(!image||!photo||!caption||!tabs)return;
  const scenes={
    move:{src:'assets/running-photograph.webp',caption:'The shared miles',de:'Fotografie von Mathias Reding: Läufer in Bewegung',en:'Photograph by Mathias Reding: a runner in motion',index:'01'},
    meet:{src:'assets/after-the-run.webp',caption:'The moments in between',de:'KI-Kampagnenstudie: Freunde nach dem Sport',en:'AI campaign study: friends after sport',index:'02'},
    make:{src:'assets/cycling-photograph.webp',caption:'Beyond the ride',de:'Fotografie von Coen van de Broek: gemeinsame Ausfahrt; keine OG-Produkte',en:'Photograph by Coen van de Broek: a shared ride; not OG products',index:'03'}
  };
  let active='meet',requestId=0;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const buttons=[...tabs.querySelectorAll('[data-scene]')];
  const sceneNotes={
    meet:{de:'Eigener Antrieb. Gemeinsamer Fortschritt.\nUnd alles, was dazwischen entsteht.',en:'Individual drive. Collective progress.\nAnd everything that happens in between.'},
    move:{de:'Aus Bewegung wird Begegnung.\nAus einem Lauf ein gemeinsamer Weg.',en:'Movement becomes connection.\nOne run becomes a shared journey.'},
    make:{de:'Ideen bleiben nicht auf Papier.\nWir geben ihnen Form, Farbe und Funktion.',en:'Ideas do not stay on paper.\nWe give them shape, colour and purpose.'}
  };
  const applyAlt=()=>{
    const language=document.documentElement.lang==='en'?'en':'de';
    image.alt=scenes[active][language];
    if(note){
      note.textContent=sceneNotes[active][language];
      note.setAttribute('data-de',sceneNotes[active].de);note.setAttribute('data-en',sceneNotes[active].en);
    }
  };
  function positionIndicator(){
    const button=tabs.querySelector('.active');
    if(!button||!indicator)return;
    indicator.style.width=button.offsetWidth+'px';
    indicator.style.transform='translateX('+button.offsetLeft+'px)';
  }
  function markActive(key){
    buttons.forEach(button=>{const selected=button.dataset.scene===key;button.classList.toggle('active',selected);button.setAttribute('aria-pressed',String(selected));});
    positionIndicator();
  }
  async function selectScene(key){
    if(!scenes[key])return;
    const id=++requestId;
    if(key===active){markActive(key);return;}
    const preload=new Image(); preload.src=scenes[key].src;
    try{await preload.decode();}catch{return;}
    if(id!==requestId)return;
    photo.querySelectorAll('.hero-ghost').forEach(el=>el.remove());
    const old=image.cloneNode(false);
    old.removeAttribute('id');old.removeAttribute('fetchpriority');old.alt='';old.setAttribute('aria-hidden','true');
    old.className='hero-ghost';
    const style=getComputedStyle(image);
    old.style.objectPosition=style.objectPosition;old.style.filter=style.filter;
    photo.append(old);
    active=key;image.src=scenes[key].src;photo.dataset.mode=key;caption.textContent=scenes[key].caption;number.textContent=scenes[key].index;applyAlt();markActive(key);
    if(reduced.matches||!old.animate){old.remove();return;}
    const fade=old.animate([{opacity:1},{opacity:0}],{duration:440,easing:'cubic-bezier(.2,.7,.2,1)',fill:'forwards'});
    fade.finished.then(()=>old.remove()).catch(()=>old.remove());
  }
  buttons.forEach((button,index)=>{
    button.addEventListener('click',()=>selectScene(button.dataset.scene));
    button.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
      event.preventDefault();
      const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(index+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;
      buttons[next].focus();selectScene(buttons[next].dataset.scene);
    });
  });
  new MutationObserver(applyAlt).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  if('ResizeObserver' in window)new ResizeObserver(positionIndicator).observe(tabs);
  window.addEventListener('resize',positionIndicator,{passive:true});positionIndicator();
  // A small response to the pointer, never a replacement cursor or scroll hijack.
  const frame=document.querySelector('.open-frame');
  const fine=matchMedia('(hover: hover) and (pointer: fine)');
  let pending=false,px=0,py=0;
  const reset=()=>{frame.style.removeProperty('--pointer-x');frame.style.removeProperty('--pointer-y');};
  frame.addEventListener('pointermove',event=>{
    if(reduced.matches||!fine.matches)return;
    const rect=frame.getBoundingClientRect();px=((event.clientX-rect.left)/rect.width-.5)*7;py=((event.clientY-rect.top)/rect.height-.5)*7;
    if(pending)return;pending=true;requestAnimationFrame(()=>{frame.style.setProperty('--pointer-x',px.toFixed(2)+'px');frame.style.setProperty('--pointer-y',py.toFixed(2)+'px');pending=false;});
  },{passive:true});
  frame.addEventListener('pointerleave',reset);reduced.addEventListener?.('change',reset);
})();


// The index is an alternative layout of the original articles, not a second list.
(() => {
  const gallery=document.getElementById('project-gallery');
  const buttons=[...document.querySelectorAll('[data-view]')].filter(el=>el.tagName==='BUTTON');
  if(!gallery)return;
  function selectView(value){
    if(!['gallery','index'].includes(value))return;
    gallery.dataset.view=value;
    gallery.querySelectorAll('.reveal').forEach(el=>el.classList.add('is-visible'));
    buttons.forEach(button=>{
      const selected=button.dataset.view===value;
      button.classList.toggle('active',selected);button.setAttribute('aria-pressed',String(selected));
    });
    dispatchEvent(new Event('resize'));
  }
  buttons.forEach(button=>button.addEventListener('click',()=>selectView(button.dataset.view)));
})();

// Contact paths change the invitation, not the user's entered text.
(() => {
  const dialog=document.getElementById('contact-dialog');
  const form=document.getElementById('contact-form');
  const title=document.getElementById('contact-title');
  const context=document.getElementById('contact-context');
  const message=document.getElementById('contact-message');
  const content={
    de:{
      community:{title:'Lass uns<br>losgehen.',intro:'Du möchtest bei künftigen Aktivitäten dabei sein? Erzähl uns kurz, was dich interessiert.',placeholder:'Welche Sportarten, Aktivitäten oder Ideen interessieren dich?'},
      create:{title:'Etwas Eigenes.<br>Gemeinsam.',intro:'Fotografie, Design, Musik oder ein neues Format: Was möchtest du mit uns gestalten?',placeholder:'Deine Idee, dein Hintergrund und woran du mitarbeiten möchtest.'},
      partner:{title:'Gute Ideen.<br>Gute Partner.',intro:'Ein Ort, eine Marke oder eine Idee, die zu uns passt? Lass uns über eine Zusammenarbeit sprechen.',placeholder:'Wer bist du und was können wir gemeinsam aufbauen?'}
    },
    en:{
      community:{title:'Let’s get<br>moving.',intro:'Want to join future activities? Tell us a little about what you are interested in.',placeholder:'Which sports, activities or ideas interest you?'},
      create:{title:'Something new.<br>Together.',intro:'Photography, design, music or a new format: what would you like to create with us?',placeholder:'Your idea, your background and what you would like to work on.'},
      partner:{title:'Good ideas.<br>Good partners.',intro:'A space, a brand or an idea that feels like us? Let’s talk about working together.',placeholder:'Who are you, and what could we build together?'}
    }
  };
  function update(){
    const lang=document.documentElement.lang==='en'?'en':'de';
    const type=form.querySelector('[name="type"]:checked')?.value||'community';
    const c=content[lang][type];
    title.innerHTML=c.title;context.textContent=c.intro;message.placeholder=c.placeholder;
  }
  form.addEventListener('change',event=>{
    if(event.target.name==='type'){
      update();document.querySelector('.contact-result').hidden=true;
    }
  });
  new MutationObserver(update).observe(dialog,{attributes:true,attributeFilter:['open']});
  new MutationObserver(update).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  update();
})();

// Compact chapter navigation follows the reading position, never controls scrolling.
(() => {
  const nav=document.querySelector('.chapter-nav');
  const opening=document.querySelector('.opening');
  const sections=[...document.querySelectorAll('#brand,#fastr,#projects,#connect')];
  const footer=document.querySelector('.footer');
  if(!nav||!opening)return;
  const names={de:['Unsere Welt','OG FASTR','Projekte','Mitmachen'],en:['Our world','OG FASTR','Projects','Get involved']};
  let pending=false;
  function update(){
    const shown=opening.getBoundingClientRect().bottom<80 && footer.getBoundingClientRect().top>innerHeight-60 && !document.querySelector('dialog[open]');
    nav.classList.toggle('is-shown',shown);nav.inert=!shown;
    const readingY=Math.min(innerHeight*.36,290);
    let selected=0;
    sections.forEach((section,i)=>{if(section.getBoundingClientRect().top<readingY)selected=i;});
    nav.querySelectorAll('[data-chapter]').forEach((a,i)=>{if(i===selected)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
    const lang=document.documentElement.lang==='en'?'en':'de';
    nav.querySelector('.chapter-mobile-title').textContent=names[lang][selected];
    pending=false;
  }
  function schedule(){if(!pending){pending=true;requestAnimationFrame(update);}}
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});
  new MutationObserver(schedule).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  document.querySelectorAll('dialog').forEach(dialog=>new MutationObserver(schedule).observe(dialog,{attributes:true,attributeFilter:['open']}));
  // Restore chapter accessibility synchronously before modal focus returns.
  document.addEventListener('og:modal-state',update);
  update();
})();

// V20 / Three perspectives. Manual tabs, a single panel, full keyboard support.
(() => {
  const tabs=[...document.querySelectorAll('[data-world]')];
  const panel=document.getElementById('world-panel');
  if(!tabs.length||!panel)return;
  let active='move';
  const content={
    de:{
      move:{quote:'Der eigene Antrieb.\nEin gemeinsamer Weg.',body:'Es beginnt mit dem Losgehen. Wir schaffen Raum für Bewegung — und für die Menschen, die wir dabei treffen. Jeder mit seinem eigenen Tempo.',cta:'Unsere Bewegung kennenlernen',href:'#fastr'},
      meet:{quote:'Wir kommen für den Sport.\nWir bleiben für die Menschen.',body:'Der Lauf, das Gespräch danach, die Musik. Was zwischen diesen Momenten entsteht, gehört für uns genauso zum Sport wie die Bewegung selbst.',cta:'Unsere Live-Formate entdecken',project:'live'},
      make:{quote:'Eine eigene Perspektive.\nEine eigene Handschrift.',body:'Aus dem, was uns bewegt, entstehen Marken, Produkte und Erlebnisse. Wir denken Gestaltung und Funktion gemeinsam. Und entwickeln lieber etwas Eigenes.',cta:'Unsere Projekte entdecken',href:'#projects'}
    },
    en:{
      move:{quote:'Individual drive.\nA shared way forward.',body:'It starts with getting out there. We make room for movement — and for the people we meet along the way. Everyone at their own pace.',cta:'Meet our movement',href:'#fastr'},
      meet:{quote:'We come for the sport.\nWe stay for the people.',body:'The run, the conversation afterwards, the music. What happens between those moments is as much a part of sport as the movement itself.',cta:'Explore our live experiences',project:'live'},
      make:{quote:'Our own perspective.\nOur own way of making.',body:'The things that move us become brands, products and experiences. We think about design and function together. And we would rather create something of our own.',cta:'Explore our projects',href:'#projects'}
    }
  };
  function select(key,animate=false){
    active=key;
    const lang=document.documentElement.lang==='en'?'en':'de', c=content[lang][active];
    if(!c)return;
    tabs.forEach(t=>{const selected=t.dataset.world===key;t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1;});
    panel.setAttribute('aria-labelledby','world-tab-'+key);
    const quote=panel.querySelector('.world-quote');quote.replaceChildren();
    c.quote.split('\n').forEach((line,i)=>{if(i)quote.append(document.createElement('br'));quote.append(document.createTextNode(line));});
    panel.querySelector('.world-description').textContent=c.body;
    const link=panel.querySelector('.world-cta');link.querySelector('span').textContent=c.cta;
    link.href=c.href||'#project-'+c.project;
    if(c.project){link.dataset.project=c.project;link.setAttribute('aria-haspopup','dialog');}
    else{delete link.dataset.project;link.removeAttribute('aria-haspopup');}
    document.querySelector('.world-counter').textContent=String(tabs.findIndex(t=>t.dataset.world===key)+1).padStart(2,'0')+' / 03';
    if(animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&panel.animate){
      panel.getAnimations().forEach(a=>a.cancel());
      panel.animate([{opacity:.2,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:280,easing:'cubic-bezier(.2,.7,.2,1)'});
    }
  }
  tabs.forEach((tab,i)=>{
    tab.addEventListener('click',()=>select(tab.dataset.world,true));
    tab.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
      event.preventDefault();
      const n=event.key==='Home'?0:event.key==='End'?tabs.length-1:(i+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
      tabs[n].focus();select(tabs[n].dataset.world,true);
    });
  });
  new MutationObserver(()=>select(active)).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  select(active);
})();

// V20 / A real navigation with a decorative, focus-aware image companion.
(() => {
  const dialog=document.getElementById('menu-dialog');
  const links=[...dialog.querySelectorAll('[data-menu-scene]')];
  const image=document.getElementById('menu-photo'),stage=dialog.querySelector('.menu-stage');
  if(!image||!links.length)return;
  const scenes={
    world:{src:'assets/after-the-run.webp',title:'In good\ncompany.',caption:'The moments in between.',number:'01'},
    movement:{src:'assets/running-photograph.webp',title:'Go where\nyou grow.',caption:'Different paces. Same direction.',number:'02'},
    projects:{src:'assets/cycling-photograph.webp',title:'Make it\nyour own.',caption:'Ideas, in motion.',number:'03'},
    connect:{src:'assets/movement-rooftop.webp',title:'Come as\nyou are.',caption:'Good things start with people.',number:'04'}
  };
  let token=0,active='world';
  async function select(key){
    if(!scenes[key]||key===active)return;
    const request=++token,c=scenes[key],loaded=new Image();loaded.src=c.src;
    try{await loaded.decode();}catch{return;}
    if(request!==token)return;
    active=key;image.src=c.src;stage.dataset.scene=key;
    links.forEach(a=>a.classList.toggle('is-preview',a.dataset.menuScene===key));
    const title=document.getElementById('menu-campaign');title.replaceChildren();
    c.title.split('\n').forEach((line,i)=>{if(i)title.append(document.createElement('br'));title.append(document.createTextNode(line));});
    document.getElementById('menu-scene-number').textContent=c.number+' / 04';
    document.getElementById('menu-scene-caption').textContent=c.caption;
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&image.animate){
      image.getAnimations().forEach(a=>a.cancel());
      image.animate([{opacity:.45},{opacity:1}],{duration:350,easing:'ease-out'});
    }
  }
  links.forEach(link=>{
    link.addEventListener('pointerenter',()=>{if(matchMedia('(hover:hover)').matches)select(link.dataset.menuScene);});
    link.addEventListener('focus',()=>select(link.dataset.menuScene));
  });
})();

// V20 / The project index is a reading view, not a second carousel.
(() => {
  const gallery=document.getElementById('project-gallery');
  const stage=gallery?.querySelector('.index-stage');
  if(!stage)return;
  const cards=[...gallery.querySelectorAll(':scope > .project-card')];
  let active=cards[0],lastKey='';
  function render(card,animate=false){
    active=card;
    if(lastKey===card.dataset.key && stage.querySelector('.ix-poster'))return;
    lastKey=card.dataset.key;
    const art=document.createElement('div');
    art.className='ix-poster ix-'+card.dataset.key;
    // Static artwork from the same card, isolated from gallery-layout rules.
    // This entire companion is aria-hidden; no extra links, controls or IDs.
    const key=card.dataset.key;
    if(key==='challenge'){
      art.innerHTML='<span class="ix-eyebrow">FASTR30 / The daily practice.</span><span class="ix-number">30<span>.</span></span><span class="ix-copy">One day.<br>Then another.</span><span class="ix-foot">30 DAYS / 7 STANDARDS</span>';
    }else if(key==='stick'){
      art.innerHTML='<span class="ix-eyebrow">FASTR STICK / Work in progress.</span><span class="ix-head">Less<br>friction.</span><span class="ix-volume">30<small>ml</small></span><span class="ix-foot">FORM. FUNCTION. THE LONG RUN.</span>';
    }else{
      const image=document.createElement('img');
      image.src=card.querySelector('.project-art img').getAttribute('src');image.alt='';image.loading='eager';
      art.append(image);
      const label=document.createElement('span');label.className='ix-head';
      label.innerHTML=key==='apparel'?'Beyond<br>the ride.':'In good<br>company.';
      art.append(label);
      const foot=document.createElement('span');foot.className='ix-foot';foot.textContent=key==='apparel'?'OG SPORTS / APPAREL STUDIES':'SPORT. SOUND. PEOPLE.';art.append(foot);
    }
    stage.querySelector('.index-stage-art').replaceChildren(art);
    stage.querySelector('.index-stage-number').textContent=card.dataset.index+' / 04';
    stage.querySelector('.index-stage-category').textContent=card.querySelector('.project-category').textContent.split('/').slice(1).join('/').trim();
    cards.forEach(el=>el.dataset.active=String(el===card));
    if(animate&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
      art.animate([{opacity:.35,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:300,easing:'cubic-bezier(.2,.7,.2,1)'});
    }
  }
  cards.forEach(card=>{
    card.addEventListener('pointermove',()=>{if(gallery.dataset.view==='index')render(card,true);});
    card.addEventListener('focusin',()=>{if(gallery.dataset.view==='index')render(card,true);});
  });
  new MutationObserver(()=>{if(gallery.dataset.view==='index')render(active);}).observe(gallery,{attributes:true,attributeFilter:['data-view']});
  render(active);
})();
// Exact two-colour campaign overlap: black on paper, white on the photograph.
// The duplicated layer is decorative; the accessible navigation remains text.
(() => {
  const menu=document.getElementById('menu-dialog');
  const source=document.getElementById('menu-campaign');
  const frame=menu?.querySelector('.menu-photo-frame');
  if(!source||!frame)return;
  const split=source.cloneNode(true);split.removeAttribute('id');split.classList.add('menu-campaign-split');split.setAttribute('aria-hidden','true');source.after(split);
  let pending=false;
  function update(){
    pending=false;
    split.innerHTML=source.innerHTML;
    if(!menu.open||!source.getClientRects().length)return;
    const p=source.getBoundingClientRect(),f=frame.getBoundingClientRect();
    const top=Math.max(0,f.top-p.top),left=Math.max(0,f.left-p.left);
    const bottom=Math.max(0,p.bottom-f.bottom),right=Math.max(0,p.right-f.right);
    split.style.clipPath=`inset(${top}px ${right}px ${bottom}px ${left}px)`;
  }
  function schedule(){if(!pending){pending=true;requestAnimationFrame(update);}}
  new MutationObserver(schedule).observe(source,{childList:true,subtree:true,characterData:true});
  new MutationObserver(schedule).observe(menu,{attributes:true,attributeFilter:['open']});
  if('ResizeObserver' in window)new ResizeObserver(schedule).observe(menu);
  addEventListener('resize',schedule,{passive:true});
  document.fonts?.ready.then(schedule);schedule();
})();

// V21: progressive photographs retain their frame on slow or offline connections.
(() => {
  const mark=(img,failed)=>{
    const frame=img.closest('[data-photo-frame]');if(!frame)return;
    frame.classList.toggle('photo-unavailable',failed);
    const note=frame.querySelector('.offline-photo-note');if(note)note.hidden=!failed;
  };
  document.addEventListener('error',e=>{if(e.target instanceof HTMLImageElement)mark(e.target,true);},true);
  document.addEventListener('load',e=>{if(e.target instanceof HTMLImageElement)mark(e.target,false);},true);
  document.querySelectorAll('[data-online-photo]').forEach(img=>{if(img.complete)mark(img,img.naturalWidth===0);});
})();
