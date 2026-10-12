import { NextResponse } from 'next/server';
import { fetchNews } from '../../../lib/news/fetchNews.mjs';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const CACHE_MS = 5 * 60 * 1000;
const FRESH_MIN_MS = 60 * 1000;
let cache = null;
let inflight = null;

// GET /api/news — notizie delle ultime 24 ore da agenzie e testate specializzate.
// Le risposte restano in memoria 5 minuti; ?fresh=1 rilegge i feed, ma riusa
// i dati letti da meno di un minuto per non tempestare le fonti di richieste.
export async function GET(request) {
  const fresh = new URL(request.url).searchParams.get('fresh') === '1';
  const maxAge = fresh ? FRESH_MIN_MS : CACHE_MS;
  if (cache && Date.now() - cache.at < maxAge) {
    return NextResponse.json(cache.data);
  }
  try {
    // Richieste simultanee condividono la stessa lettura dei feed.
    inflight ??= fetchNews()
      .then((data) => { cache = { at: Date.now(), data }; return data; })
      .finally(() => { inflight = null; });
    return NextResponse.json(await inflight);
  } catch (error) {
    console.error('News error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
