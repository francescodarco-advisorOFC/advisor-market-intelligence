// Genera public/notizie.html dalla pagina in ui/notizie.html, collegata a /api/news.
// La stessa pagina, senza questo collegamento, è l'artifact che legge news.json.
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const page = await readFile(new URL('../ui/notizie.html', import.meta.url), 'utf8');
const html = `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<script>window.NEWS_ENDPOINT = '/api/news';</script>
</head>
<body>
${page}
</body>
</html>
`;
await mkdir(new URL('../public/', import.meta.url), { recursive: true });
await writeFile(new URL('../public/notizie.html', import.meta.url), html);
console.log('public/notizie.html generato');
