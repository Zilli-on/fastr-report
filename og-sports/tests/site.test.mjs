import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { Script } from 'node:vm';
import { startServer } from '../scripts/serve.mjs';

const root = new URL('../', import.meta.url);
const html = await readFile(new URL('site/index.html', root), 'utf8');
const js = await readFile(new URL('site/script.js', root), 'utf8');
const css = await readFile(new URL('site/styles.css', root), 'utf8');
const originals = JSON.parse(await readFile(new URL('tests/original-assets.json', root), 'utf8'));

test('preserves the chosen first photograph and original brand assets byte for byte', async () => {
  for (const [name, expected] of Object.entries(originals)) {
    const bytes = await readFile(new URL(`site/assets/${name}`, root));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), expected, name);
  }
  assert.match(html, /data-mode="meet"/);
  assert.match(html, /id="hero-photo"[^>]+src="assets\/after-the-run-display-4x\.webp"/);
  const original = await readFile(new URL('site/assets/after-the-run.webp', root));
  const display = await readFile(new URL('site/assets/after-the-run-display-4x.webp', root));
  assert.ok(display.length > original.length, 'display asset should be a larger derivative');
});
test('uses the three approved editorial photographs and no stock images below them', () => {
  assert.equal((html.match(/class="culture-shot /g) || []).length, 3);
  const main = html.split('</main>')[0];
  const after = main.split('<section class="r7-movement"')[1];
  assert.ok(after, 'movement chapter must exist');
  assert.doesNotMatch(after, /<img\b[^>]+\.webp/i);
  assert.match(main, /class="project-gallery r7-work-index"/);
  assert.match(main, /r7-practice-rules/);
});
test('browser JavaScript is syntactically valid', () => assert.doesNotThrow(() => new Script(js)));
test('all local artwork referenced by the source exists', async () => {
  const refs = new Set((html + css + js).match(/assets\/[A-Za-z0-9_.-]+\.(?:svg|webp|png|jpg)/g));
  assert.ok(refs.size >= 7);
  for (const file of refs) await access(new URL(`site/${file}`, root));
});
test('retains project identities, language support and credit information', () => {
  for (const name of ['challenge', 'apparel', 'live', 'stick']) assert.ok(js.includes(name));
  assert.match(html, /data-en=/); assert.match(html, /data-de=/);
  assert.ok(js.includes('Mathias Reding')); assert.ok(js.includes('Coen van de Broek'));
});
test('retains preview indexing restrictions and motion preference support', async () => {
  assert.match(html, /noindex,nofollow,noarchive/);
  assert.match(css, /prefers-reduced-motion/);
  const robots = await readFile(new URL('site/robots.txt', root), 'utf8');
  assert.match(robots, /Disallow: \//);
});
test('keeps an accessible page outline and unique static IDs', () => {
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  const ids = Array.from(html.matchAll(/\bid="([^"]+)"/g), m => m[1]);
  assert.equal(ids.length, new Set(ids).size);
  assert.match(html, /class="skip"/);
});
test('has no bundled font binaries or remote font stylesheet', () => {
  assert.doesNotMatch(html + css, /fonts\.(?:googleapis|gstatic)\.com|\.(?:woff2?|ttf|otf)(?:["')?]|$)/);
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
