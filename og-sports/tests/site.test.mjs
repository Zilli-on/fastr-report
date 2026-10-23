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
  assert.match(html, /id="hero-photo"[^>]+src="assets\/after-the-run-display-4x\.webp"/);
  const original = await readFile(new URL('site/assets/after-the-run.webp', root));
  const display = await readFile(new URL('site/assets/after-the-run-display-4x.webp', root));
  assert.ok(display.length > original.length, 'display asset should be a larger derivative');
  assert.match(js, /assets\/after-the-run\.webp/, 'image notes show the unchanged original');
});

test('uses the three approved photographs and no photography below them', async () => {
  const photos = Array.from(section('brand').matchAll(/<img\b[^>]+src="(assets\/[^"]+)"/g), m => m[1]);
  assert.deepEqual(photos, ['assets/run-detail.webp', 'assets/run-shadow.webp', 'assets/run-community.webp']);
  const below = main.split('id="fastr"')[1];
  assert.doesNotMatch(below, /<img\b[^>]+\.(?:webp|jpe?g|png)/i);
  const assets = await readdir(new URL('site/assets/', root));
  for (const retired of ['running-photograph.webp', 'cycling-photograph.webp', 'movement-rooftop.webp']) {
    assert.ok(!assets.includes(retired), `${retired} was rejected and must not ship`);
    assert.ok(!(html + js + css).includes(retired), `${retired} must not be referenced`);
  }
});

test('keeps the seven FASTR30 standards in their fixed order', () => {
  const rules = Array.from(main.matchAll(/<li style="--row:\d"><span class="std-num">\d+<\/span><span class="std-text"><strong>([^<]+)<\/strong>/g), m => m[1]);
  assert.deepEqual(rules, ['RECOVER', 'OWN YOUR MORNING', 'MOVE', 'READ', 'GET FASTR', 'FUEL', 'REFLECT']);
});

test('presents four projects as authored plates with honest status captions', () => {
  const keys = Array.from(section('projects').matchAll(/<article [^>]*class="project [a-z]+" data-key="([a-z]+)"/g), m => m[1]);
  assert.deepEqual(keys, ['challenge', 'apparel', 'live', 'stick']);
  for (const key of keys) {
    assert.match(main, new RegExp(`data-artefact="${key}"`), `plate for ${key}`);
    assert.match(main, new RegExp(`data-project="${key}"`), `story trigger for ${key}`);
  }
  for (const status of ['Challenge-Konzept', 'Konzept-Flats', 'Formatskizze · noch kein Termin', 'CAD-Entwurf V0']) assert.ok(main.includes(status), status);
  assert.match(html, /<symbol id="jersey-flat"/);
  for (const name of ['jersey', 'routes', 'gather', 'stick']) {
    const block = html.split(`<!-- art:${name} -->`)[1]?.split(`<!-- /art:${name} -->`)[0] || '';
    assert.match(block, /<(svg|symbol)\b/, `generated art block ${name}`);
  }
});

test('browser JavaScript is syntactically valid', () => assert.doesNotThrow(() => new Script(js)));

test('all local artwork referenced by the source exists', async () => {
  const refs = new Set((html + css + js).match(/assets\/[A-Za-z0-9_.-]+\.(?:svg|webp|png|jpg)/g));
  assert.ok(refs.size >= 8);
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

test('has no bundled font binaries, remote fonts or third-party scripts', () => {
  assert.doesNotMatch(html + css, /fonts\.(?:googleapis|gstatic)\.com|\.(?:woff2?|ttf|otf)(?:["')?]|$)/);
  assert.doesNotMatch(html, /<script[^>]+src="https?:/);
});

test('serves the site with correct MIME types without exposing repo files', async () => {
  const server = await startServer({ port: 0 });
  try {
    const base = `http://127.0.0.1:${server.address().port}`;
    const home = await fetch(base); assert.equal(home.status, 200); assert.match(home.headers.get('content-type'), /text\/html/);
    assert.match(await home.text(), /Own greatness/);
    const script = await fetch(`${base}/script.js`); assert.equal(script.status, 200); assert.match(script.headers.get('content-type'), /javascript/);
    const asset = await fetch(`${base}/assets/after-the-run.webp`); assert.equal(asset.status, 200); assert.equal(asset.headers.get('content-type'), 'image/webp');
    assert.equal((await fetch(`${base}/.git/config`)).status, 403);
    assert.equal((await fetch(`${base}/package.json`)).status, 404);
    assert.equal((await fetch(base, { method: 'POST' })).status, 405);
    assert.equal((await fetch(`${base}/%E0%A4%A`)).status, 400);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
