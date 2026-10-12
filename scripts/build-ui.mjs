// Impagina ui/notizie.html come documento completo.
//   node scripts/build-ui.mjs                  -> public/notizie.html, collegata a /api/news (app Next.js)
//   node scripts/build-ui.mjs --static <dir>   -> <dir>/index.html, legge news.json accanto (sito statico)
// Senza documento attorno, ui/notizie.html è anche l'artifact che legge news.json.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const page = await readFile(path.join(root, 'ui/notizie.html'), 'utf8');

const i = process.argv.indexOf('--static');
const staticDir = i > -1 ? process.argv[i + 1] : null;

const endpoint = staticDir ? '' : `<script>window.NEWS_ENDPOINT = '/api/news';</script>\n`;
const html = `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
${endpoint}</head>
<body>
${page}
</body>
</html>
`;

const outDir = staticDir ? path.resolve(staticDir) : path.join(root, 'public');
const outFile = path.join(outDir, staticDir ? 'index.html' : 'notizie.html');
await mkdir(outDir, { recursive: true });
await writeFile(outFile, html);
console.log(`${path.relative(process.cwd(), outFile)} generato`);
