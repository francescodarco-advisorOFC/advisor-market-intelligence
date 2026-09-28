// Genera la pagina del radar incorporando l'ultimo run come stato iniziale,
// così la pagina è completa anche prima di collegarsi al database.
//
//   node monitor/artifact/build.mjs [monitor/out/db-run-<runId>.json]

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const dir = 'monitor/out';
const runFile = process.argv[2] || join(dir, (await readdir(dir)).filter((f) => f.startsWith('db-run-')).sort().pop());
const run = await readFile(runFile, 'utf8');
const tpl = await readFile('monitor/artifact/radar.template.html', 'utf8');
// "<" in JSON dentro <script> potrebbe chiudere il tag: lo escapiamo.
await writeFile('monitor/artifact/radar.html', tpl.replace('/*__SEED__*/null', run.replace(/</g, '\\u003c')));
console.log(`monitor/artifact/radar.html <- ${runFile}`);
