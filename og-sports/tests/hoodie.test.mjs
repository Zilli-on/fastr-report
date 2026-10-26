import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const read = p => readFile(new URL(p, root), 'utf8');

test('six hoodie colours have source-sized WebPs and no retired shop renders', async () => {
  const html = await read('site/index.html');
  const manifest = JSON.parse(await read('docs/responsive-assets.json'));
  const buttons = [...html.matchAll(/<button[^>]*data-hoodie="([^"]+)"[^>]*>/g)];
  assert.equal(buttons.length, 6);
  assert.equal(buttons.filter(([tag]) => tag.includes('aria-pressed="true"')).length, 1);
  assert.equal(new Set(buttons.map(([, color]) => color)).size, 6);
  for (const [, color] of buttons) {
    const entry = manifest[`assets/responsive/hoodie-${color}-800.webp`];
    assert.deepEqual(entry.source_pixels, [1792, 2240]);
    assert.ok(entry.source.includes('higgsfield-hoodies'));
    assert.deepEqual(entry.variants.map(v => v.width), [480, 800, 1200, 1600, 1792]);
  }
  for (const dir of ['site/assets/', 'site/assets/responsive/']) {
    assert.ok((await readdir(new URL(dir, root))).every(n => !n.startsWith('merch-')));
  }
  for (const file of ['site/index.html', 'docs/responsive-assets.json', 'docs/asset_manifest.json', 'tests/original-assets.json']) {
    assert.doesNotMatch(await read(file), /merch-0[1-6]-/);
  }
  assert.match(html, /data-de="KI-Visualisierung" data-en="AI visualisation"/);
  assert.match(html, /Earned\. Not given\./);
  assert.match(html, /href="https:\/\/fastr30.com\/merch"/);
});
