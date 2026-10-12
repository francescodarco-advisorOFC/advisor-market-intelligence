import { NextResponse } from 'next/server';
import { fetchNews } from '../../../lib/news/fetchNews.mjs';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const CACHE_MS = 5 * 60 * 1000;
let cache = null;

// GET /api/news — notizie delle ultime 24 ore da agenzie e testate specializzate.
// Le risposte restano in memoria 5 minuti; ?fresh=1 forza la rilettura dei feed.
export async function GET(request) {
  const fresh = new URL(request.url).searchParams.get('fresh') === '1';
  if (!fresh && cache && Date.now() - cache.at < CACHE_MS) {
    return NextResponse.json(cache.data);
  }
  try {
    const data = await fetchNews();
    cache = { at: Date.now(), data };
    return NextResponse.json(data);
  } catch (error) {
    console.error('News error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
