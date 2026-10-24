import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = path.join(root, 'site');
const out = path.join(root, 'dist');
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(site, out, { recursive: true });
const files = {};
async function inspect(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await inspect(file);
    else if (entry.isFile()) {
      const bytes = await readFile(file);
      files[path.relative(out, file).split(path.sep).join('/')] = {
        bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex')
      };
    }
  }
}
await inspect(out);
await writeFile(path.join(out, 'build-manifest.json'), JSON.stringify({
  project: 'og-sports-web', sourceBaseline: 'V21', files
}, null, 2) + '\n');
console.log(`Built ${Object.keys(files).length} files into dist/`);
