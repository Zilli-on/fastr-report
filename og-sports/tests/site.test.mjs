import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { Script } from 'node:vm';
import { startServer } from '../scripts/serve.mjs';

const root = new URL('../', import.meta.url);
const html = await readFile(new URL('site/index.html', root), 'utf8');
const js = await readFile(new URL('site/script.js', root), 'utf8');
const css = await readFile(new URL('site/styles.css', root), 'utf8');
const originals = JSON.parse(await readFile(new URL('tests/original-assets.json', root), 'utf8'));
const main = html.split('<main id="main">')[1].split('</main>')[0];
const section = id => main.split(`id="${id}"`)[1].split('</section>')[0];

test('preserves the chosen first photograph and original brand assets byte for byte', async () => {
  for (const [name, expected] of Object.entries(originals)) {
    const bytes = await readFile(new URL(`site/assets/${name}`, root));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), expected, name);
  }
  assert.match(html, /id="hero-photo"[^>]+src="assets\/after-the-run\.webp"/);
  assert.match(html.match(/<img[^>]+id="hero-photo"[^>]*>/)[0], /fetchpriority="high"/);
  assert.match(js, /assets\/after-the-run\.webp/, 'image notes show the unchanged original');
});

test('responsive assets come from recorded sources, never upscale, and all photos opt in', async () => {
  const manifest = JSON.parse(await readFile(new URL('docs/responsive-assets.json', root), 'utf8'));
  for (const [src, entry] of Object.entries(manifest)) {
    assert.ok(!src.includes('stick-'), 'STICK is not re-encoded');
    assert.ok(entry.source_sha256.length === 64);
    for (const group of ['variants', 'mobile']) {
      const candidates = entry[group];
      if (!candidates) continue;
      const crop = group === 'mobile' ? entry.mobile_crop : entry.crop;
      const [w, h] = crop ? [crop[2]-crop[0], crop[3]-crop[1]] : entry.source_pixels;
      for (const v of candidates) {
        assert.ok(v.width <= w && v.height <= h, v.file + ' must not upscale');
        const bytes = await readFile(new URL('site/' + v.file, root));
        assert.equal(bytes.length, v.bytes);
        assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
      }
    }
  }
  for (const src of ['after-the-run.webp', 'frame-01-detail.webp', 'run-shadow.webp', 'frame-03-people.webp']) {
    assert.equal(manifest['assets/'+src].crop, null, 'protected composition');
    assert.equal(manifest['assets/'+src].mobile_crop, null, 'no protected mobile crop');
  }
  for (const [tag] of main.matchAll(/<img\b[^>]*>/g)) {
    const src = tag.match(/\bsrc="([^"]+)"/)?.[1];
    if (!src || !/\.(webp|jpg)$/.test(src)) continue;
    assert.match(tag, /width="\d+"/);
    assert.match(tag, /height="\d+"/);
    if (!src.includes('stick-')) {
      assert.match(tag, /srcset="[^"]+ \d+w"/);
      assert.match(tag, /sizes="[^"]+"/);
    }
    assert.match(tag, src.includes('after-the-run') ? /loading="eager"/ : /loading="lazy"/);
  }
});

test('keeps the three approved photographs, retouched free of third-party brands', async () => {
  const strip = section('brand').split('<div class="strip">')[1].split('</div>')[0];
  const photos = Array.from(strip.matchAll(/<img\b[^>]+src="(assets\/[^"]+)"/g), m => m[1]);
  assert.deepEqual(photos, ['assets/frame-01-detail.webp', 'assets/run-shadow.webp', 'assets/frame-03-people.webp']);
  const assets = await readdir(new URL('site/assets/', root));
  for (const retired of ['running-photograph.webp', 'cycling-photograph.webp', 'movement-rooftop.webp', 'run-detail.webp', 'run-community.webp']) {
    assert.ok(!assets.includes(retired), `${retired} was rejected or carries third-party marks and must not ship`);
    assert.ok(!(html + js + css).includes(retired), `${retired} must not be referenced`);
  }
});

test('the manifest credits its photograph and claims no moment it does not show', () => {
  const manifest = section('brand').split('<div class="manifest"')[1] || '';
  assert.match(manifest, /src="assets\/photo-ritual\.webp"/);
  assert.match(manifest, /Ulf Meyer \/ Unsplash/);
  assert.match(manifest, /Symbolbild/);
  assert.doesNotMatch(manifest, /8:32|30\.09\.2026/, 'no date or time that belonged to another picture');
});

test('labels every image below the photographs as own footage, AI study or visualisation', () => {
  const below = main.split('id="fastr"')[1];
  const figures = below.split('<figure').slice(1).map(f => f.split('</figure>')[0]);
  const shown = [];
  for (const figure of figures) {
    const src = figure.match(/<img\b[^>]+src="assets\/([^"]+\.(?:webp|jpg))"/)?.[1];
    if (!src) continue;
    shown.push(src);
    const scope = main.slice(main.indexOf(figure), main.indexOf(figure) + figure.length + 1200);
    assert.match(scope, /Unsplash|Pexels|Eigene Aufnahme|KI-(Kampagnenstudie|Bildstudie|Visualisierung|Raumstudie)|Produktvisualisierung/, `${src} needs a visible label`);
  }
  assert.deepEqual(shown, ['run-night.webp', 'practice-start.webp', 'responsive/hoodie-black-800.webp', 'meet-night.webp', 'stick-lime.jpg', 'track-night.webp']);
});

test('keeps the seven FASTR30 standards in their fixed order', () => {
  const rules = Array.from(main.matchAll(/<li style="--row:\d"><span class="std-num">\d+<\/span><strong>([^<]+)<\/strong>/g), m => m[1]);
  assert.deepEqual(rules, ['RECOVER', 'OWN YOUR MORNING', 'MOVE', 'READ', 'GET FASTR', 'FUEL', 'REFLECT']);
});

test('presents four projects with their artefact and honest status captions', () => {
  const keys = Array.from(section('projects').matchAll(/<article [^>]*class="project [a-z]+" data-key="([a-z]+)"/g), m => m[1]);
  assert.deepEqual(keys, ['challenge', 'apparel', 'live', 'stick']);
  for (const key of keys) {
    assert.match(main, new RegExp(`data-artefact="${key}"`), `artefact for ${key}`);
    assert.match(main, new RegExp(`data-project="${key}"`), `story trigger for ${key}`);
  }
  for (const status of ['Challenge-Konzept', 'Pre-Order unverbindlich', 'noch kein Termin', 'Prototyp, kein Serienprodukt']) assert.ok(main.includes(status), status);
  for (const view of ['stick-lime']) assert.ok(main.includes(`assets/${view}.jpg`), view);
  assert.doesNotMatch(html + js, /CAD-Entwurf|CAD draft/, 'the STICK images are product renders, not the CAD draft');
});

test('browser JavaScript is syntactically valid', () => assert.doesNotThrow(() => new Script(js)));

test('all local artwork referenced by the source exists', async () => {
  const refs = new Set((html + css + js).match(/(?:assets|fonts)\/[A-Za-z0-9_.-]+\.(?:svg|webp|png|jpg|woff2)/g));
  assert.ok(refs.size >= 12);
  for (const file of refs) await access(new URL(`site/${file}`, root));
});

test('retains project identities, language support and credit information', () => {
  for (const name of ['challenge', 'apparel', 'live', 'stick']) assert.ok(js.includes(name));
  assert.match(html, /data-en=/); assert.match(html, /data-de=/);
  for (const credit of ['David Moorhouse', 'Mathias Reding', 'Leviosa Hou']) assert.ok(section('brand').includes(credit), credit);
  assert.doesNotMatch(js, /Coen van de Broek|Unsplash · Referenz/, 'no credits for photographs that are not shown');
});

test('ships one stylesheet with motion preference support', async () => {
  assert.deepEqual(Array.from(html.matchAll(/<link [^>]*rel="stylesheet"[^>]*>/g)).length, 1);
  const files = await readdir(new URL('site/', root));
  assert.deepEqual(files.filter(f => f.endsWith('.css')), ['styles.css']);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(js, /prefers-reduced-motion: reduce/);
});

test('retains preview indexing restrictions', async () => {
  assert.match(html, /noindex,nofollow,noarchive/);
  const robots = await readFile(new URL('site/robots.txt', root), 'utf8');
  assert.match(robots, /Disallow: \//);
});

test('keeps an accessible page outline and unique static IDs', () => {
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  const ids = Array.from(html.matchAll(/\bid="([^"]+)"/g), m => m[1]);
  assert.equal(ids.length, new Set(ids).size);
  assert.match(html, /class="skip"/);
  for (const [, label] of html.matchAll(/aria-labelledby="([^"]+)"/g)) assert.ok(ids.includes(label) || js.includes(`id="${label}"`), label);
});

test('self-hosts only OFL fonts and loads nothing from third parties', async () => {
  assert.doesNotMatch(html + css, /fonts\.(?:googleapis|gstatic)\.com|https?:\/\/[^"')]+\.(?:woff2?|ttf|otf)/);
  assert.doesNotMatch(html, /<script[^>]+src="https?:/);
  const fonts = await readdir(new URL('site/fonts/', root));
  const binaries = fonts.filter(f => /\.(?:woff2?|ttf|otf)$/.test(f));
  assert.deepEqual(binaries.sort(), ['archivo-italic-latin.woff2', 'archivo-var-latin.woff2', 'spacegrotesk-latin.woff2']);
  for (const family of ['Archivo', 'SpaceGrotesk']) {
    const licence = await readFile(new URL(`site/fonts/OFL-${family}.txt`, root), 'utf8');
    assert.match(licence, /SIL Open Font License, Version 1\.1/);
  }
  for (const file of binaries) assert.ok(css.includes(`fonts/${file}`), file);
});

test('serves the site with correct MIME types without exposing repo files', async () => {
  const server = await startServer({ port: 0 });
  try {
    const base = `http://127.0.0.1:${server.address().port}`;
    const home = await fetch(base); assert.equal(home.status, 200); assert.match(home.headers.get('content-type'), /text\/html/);
    assert.match(await home.text(), /Own greatness/);
    const script = await fetch(`${base}/script.js`); assert.equal(script.status, 200); assert.match(script.headers.get('content-type'), /javascript/);
    const asset = await fetch(`${base}/assets/after-the-run.webp`); assert.equal(asset.status, 200); assert.equal(asset.headers.get('content-type'), 'image/webp');
    const model = await fetch(`${base}/assets/stick.glb`); assert.equal(model.status, 200); assert.equal(model.headers.get('content-type'), 'model/gltf-binary');
    assert.equal((await fetch(`${base}/.git/config`)).status, 403);
    assert.equal((await fetch(`${base}/package.json`)).status, 404);
    assert.equal((await fetch(base, { method: 'POST' })).status, 405);
    assert.equal((await fetch(`${base}/%E0%A4%A`)).status, 400);
  } finally { await new Promise(resolve => server.close(resolve)); }
});

test('the temple shows five pillars that all lead somewhere and label their images', () => {
  const temple = main.split('id="pillars"')[1].split('</section>')[0];
  const pillars = temple.split('<li class="pillar ').slice(1);
  assert.equal(pillars.length, 5);
  for (const pillar of pillars) {
    const href = pillar.match(/href="#([a-z]+)"/)?.[1];
    assert.ok(href && html.includes(`id="${href}"`), `pillar target #${href} exists`);
    if (pillar.includes('<img')) assert.match(pillar, /class="pillar-kind"/, 'image pillar carries a visible label');
  }
  assert.match(temple, /Own Greatness/); assert.match(temple, /Original Grind/);
});
