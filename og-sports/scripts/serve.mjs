import http from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8',
  '.js':'text/javascript; charset=utf-8', '.svg':'image/svg+xml', '.webp':'image/webp',
  '.jpg':'image/jpeg', '.png':'image/png', '.json':'application/json; charset=utf-8',
  '.txt':'text/plain; charset=utf-8', '.woff2':'font/woff2' };

/** A local development/preview server. Never exposes repository metadata or dotfiles. */
export async function startServer({ directory = path.join(projectRoot, 'site'), port = 4173, host = '127.0.0.1' } = {}) {
  const root = await realpath(directory);
  const server = http.createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
    res.setHeader('Cache-Control', 'no-store');
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405, { Allow: 'GET, HEAD' }).end('Method not allowed'); return;
    }
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      if (pathname.split('/').some(s => s.startsWith('.')) || pathname.includes('\\') || pathname.includes('\0')) {
        res.writeHead(403).end('Forbidden'); return;
      }
      let file = path.resolve(root, '.' + pathname);
      if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403).end('Forbidden'); return; }
      if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
      file = await realpath(file);
      if (!file.startsWith(root + path.sep)) { res.writeHead(403).end('Forbidden'); return; }
      const bytes = await readFile(file);
      res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Content-Length': bytes.length });
      res.end(req.method === 'HEAD' ? undefined : bytes);
    } catch (error) {
      res.writeHead(error instanceof URIError ? 400 : 404, { 'Content-Type':'text/plain; charset=utf-8' }).end('Not found');
    }
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, host, resolve); });
  return server;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const directory = path.join(projectRoot, process.argv.includes('--dist') ? 'dist' : 'site');
  const port = Number(process.env.PORT || 4173);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be 1–65535');
  try {
    const server = await startServer({ directory, port });
    console.log(`OG SPORTS: http://127.0.0.1:${port}`);
    for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => server.close(() => process.exit(0)));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
