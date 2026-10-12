// Decide se il workflow deve pubblicare: sì se, dall'ultima fascia iniziata,
// il sito non è ancora stato aggiornato. Così un'esecuzione saltata o in ritardo
// di GitHub viene recuperata dalla successiva.
// Uso: node scripts/news-due.mjs <url di news.json pubblicato>   -> stampa due=true|false
import { appendFile } from 'node:fs/promises';
import { lastSlot } from '../lib/news/schedule.mjs';

const LEAD_MIN = 10; // si può pubblicare fino a 10 minuti prima della fascia
const url = process.argv[2];
const slot = lastSlot(new Date(), LEAD_MIN);

let published = null;
try {
  const res = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(15000) });
  if (res.ok) published = new Date((await res.json()).generatedAt);
} catch (e) {
  console.log(`news.json pubblicato non leggibile (${e.message}): si pubblica`);
}

const lead = slot && new Date(slot.getTime() - LEAD_MIN * 60000);
const due = !slot || !published || isNaN(published) || published < lead;
console.log(`ultima fascia: ${slot?.toISOString()} | pubblicato: ${published?.toISOString?.() ?? 'n/d'} | due=${due}`);
if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, `due=${due}\n`);
