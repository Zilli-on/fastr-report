import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const root = new URL('../', import.meta.url);
const read = name => readFile(new URL(name, root), 'utf8');
const html = await read('site/index.html');
const boot = await read('site/script.js');
const viewer = await read('site/stick-viewer.js');

test('STICK is a bounded GLB with the five source-derived assembly meshes', async () => {
  const bytes = await readFile(new URL('site/assets/stick.glb', root));
  assert.ok(bytes.length <= 600_000);
  assert.equal(bytes.toString('ascii', 0, 4), 'glTF');
  assert.equal(bytes.readUInt32LE(4), 2);
  assert.equal(bytes.readUInt32LE(8), bytes.length);
  const jsonLength = bytes.readUInt32LE(12);
  const gltf = JSON.parse(bytes.toString('utf8', 20, 20 + jsonLength));
  const report = JSON.parse(await read('docs/stick-model.json'));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), report.sha256);
  assert.equal(report.bytes, bytes.length);
  const names = ['Gehaeuse', 'Schraubkappe', 'Drehfuss', 'Spindel', 'Hubteller'];
  assert.deepEqual(gltf.nodes.map(n => n.name), names);
  assert.equal(gltf.meshes.length, 5);
  assert.deepEqual(gltf.extensionsRequired, ['KHR_mesh_quantization']);
  gltf.meshes.forEach((mesh, i) => {
    const p = mesh.primitives[0];
    const pos = gltf.accessors[p.attributes.POSITION];
    assert.ok(pos.count > 500, mesh.name + ' silhouette detail');
    assert.equal(pos.componentType, 5122);
    assert.equal(pos.normalized, true);
    assert.equal(gltf.accessors[p.indices].count / 3, report.parts[i].triangles);
    assert.ok(report.parts[i].triangles < report.parts[i].source_triangles);
    // Quantized Y-up model retains the original assembly's Z bounds.
    const low = pos.min[1] / 32767 * 256;
    const high = pos.max[1] / 32767 * 256;
    assert.ok(Math.abs(low-report.parts[i].bounds_mm[2][0]) < .15);
    assert.ok(Math.abs(high-report.parts[i].bounds_mm[2][1]) < .15);
  });
  assert.ok(gltf.buffers.every(b => !b.uri), 'all geometry embedded');
});

test('STICK keeps fallback, translated DOM phases, controls and shop outside canvas', () => {
  const stick = html.split('id="stick"')[1].split('</article>')[0];
  assert.match(stick, /assets\/stick-lime.jpg/);
  assert.equal((stick.match(/class="stick-step"/g) || []).length, 3);
  assert.equal((stick.match(/data-stick-phase=/g) || []).length, 3);
  assert.equal((stick.match(/data-part=/g) || []).length, 5);
  assert.match(stick, /3D-Produktvisualisierung/);
  assert.match(stick, /href="https:\/\/fastr30.com\/shop"/);
  assert.match(stick, /<canvas[^>]*><\/canvas>/);
  assert.doesNotMatch(html + boot, /CAD-Entwurf|\b\d+(?:[.,]\d+)?\s*mm\b/i);
  assert.match(boot, /rootMargin: '500px 0px'/);
  assert.match(boot, /started \|\| reduced.matches/);
  assert.match(viewer, /Math.min\(devicePixelRatio, 2\)/);
  assert.match(viewer, /webglcontextlost/);
});

test('three.js is pinned, MIT licensed, self-hosted with an intact module graph', async () => {
  const report = JSON.parse(await read('docs/three-vendor.json'));
  assert.equal(report.version, '0.170.0');
  assert.match(await read('site/vendor/three-r170/LICENSE.txt'), /MIT License/);
  for (const entry of report.files) {
    const bytes = await readFile(new URL('site/vendor/three-r170/' + entry.file, root));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), entry.sha256);
    if (!entry.file.endsWith('.js')) continue;
    for (const [, spec] of bytes.toString().matchAll(/import\s*\{[^}]*\}\s*from\s*['"]([^'"]+)['"]/g)) {
      assert.ok(spec.startsWith('./'), spec);
      await readFile(new URL('site/vendor/three-r170/' + spec.slice(2), root));
    }
  }
});

test('retired cycling chapter and all its asset variants stay removed', async () => {
  assert.doesNotMatch(html + boot + await read('site/styles.css'), /wienerwald|apparel-next|colourways/i);
  for (const dir of ['site/assets/', 'site/assets/responsive/']) {
    assert.ok((await readdir(new URL(dir, root))).every(n => !/wienerwald/i.test(n)));
  }
  for (const name of ['responsive-assets.json', 'asset_manifest.json', 'photo_sources.json', 'PHOTO_CREDITS.md']) {
    assert.doesNotMatch(await read('docs/' + name), /wienerwald|lf3g1p-7FP8/i);
  }
});
