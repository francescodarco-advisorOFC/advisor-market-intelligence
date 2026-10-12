// Scarica le notizie delle ultime 24 ore e le salva in JSON.
// Uso: node scripts/news-snapshot.mjs [percorso-output]
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fetchNews } from '../lib/news/fetchNews.mjs';

const out = process.argv[2] || 'news.json';
const data = await fetchNews();
await mkdir(path.dirname(path.resolve(out)), { recursive: true });
await writeFile(out, JSON.stringify(data));
console.log(`${data.items.length} notizie salvate in ${out}`);
for (const s of data.sources) console.log(`${s.ok ? 'ok ' : 'ERR'} ${String(s.count).padStart(4)}  ${s.name}${s.errors.length ? '  ' + s.errors.join('; ') : ''}`);
