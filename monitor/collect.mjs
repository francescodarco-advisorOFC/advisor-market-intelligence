// Raccoglie in un colpo solo cosa pubblicano le testate e cosa cercano i lettori.
//
//   node monitor/collect.mjs [--hours 24] [--out monitor/out] [--run-id 202609280845]
//
// Scrive <out>/raw-<runId>.json e <out>/raw-latest.json. Le richieste HTTP
// passano da curl perché rispetta il proxy dell'ambiente; le homepage sono
// lette con Chromium headless (Playwright installato globalmente).

import { execFile } from 'node:child_process';
import { createRequire } from 'node:module';
import { X509Certificate, createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { OUTLETS, SEARCH_SEEDS, TRENDS_RSS } from './sources.mjs';

const run = promisify(execFile);
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith('--') ? [...acc, [a.slice(2), all[i + 1]]] : acc), []),
);
const HOURS = Number(args.hours || 24);
const OUT = args.out || 'monitor/out';
const now = new Date();
const since = new Date(now.getTime() - HOURS * 3600e3);
const runId = args['run-id'] || now.toISOString().slice(0, 16).replace(/[-:T]/g, '');

async function get(url) {
  const { stdout } = await run('curl', ['-sS', '-L', '-m', '25', '-A', UA, '--compressed', url], { maxBuffer: 20e6 });
  return stdout;
}

const decode = (s = '') =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

const tag = (xml, name) => {
  const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return m ? decode(m[1]) : '';
};
const tags = (xml, name) => [...xml.matchAll(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, 'g'))].map((m) => decode(m[1]));
const items = (xml) => [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);

async function fromRss(url) {
  const xml = await get(url);
  const all = items(xml).map((it) => ({
    title: tag(it, 'title'),
    url: tag(it, 'link'),
    time: new Date(tag(it, 'pubDate')).toISOString(),
    section: tags(it, 'category').slice(0, 3).join(', '),
    summary: tag(it, 'description').slice(0, 240),
    channel: 'rss',
  }));
  if (!all.length) throw new Error('feed vuoto o bloccato');
  return all.filter((i) => new Date(i.time) >= since);
}

async function fromGoogleNews(query, suffix) {
  const q = encodeURIComponent(`${query} when:${HOURS}h`);
  const xml = await get(`https://news.google.com/rss/search?q=${q}&hl=it&gl=IT&ceid=IT:it`);
  return items(xml)
    .map((it) => {
      const source = tag(it, 'source');
      return {
        title: tag(it, 'title').replace(/\s+-\s+[^-]+$/, ''),
        url: tag(it, 'link'),
        time: new Date(tag(it, 'pubDate')).toISOString(),
        source,
        channel: 'gnews',
      };
    })
    .filter((i) => !suffix || i.source.includes(suffix))
    .filter((i) => new Date(i.time) >= since);
}

// Pagina "Ultime news" di Advisor: link articolo = /sezione/sottosezione/slug,
// dentro il link ci sono etichetta di sezione, titolo e sommario.
async function fromAdvisorLatest(url) {
  let html = '';
  for (let attempt = 0; attempt < 3 && !html; attempt++) html = await get(url).catch(() => '');
  if (!html) throw new Error('pagina non raggiungibile');
  const seen = new Set();
  const out = [];
  for (const m of html.matchAll(/<a[^>]+href="(\/[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
    if (seen.has(m[1])) continue;
    seen.add(m[1]);
    const parts = m[2].split(/<[^>]+>/).map((p) => decode(p)).filter(Boolean);
    if (parts.length < 2) continue;
    out.push({
      title: parts[1],
      url: new URL(m[1], url).href,
      section: parts[0],
      summary: (parts[2] || '').slice(0, 240),
      rank: out.length + 1,
    });
  }
  if (!out.length) throw new Error('nessun articolo riconosciuto');
  return out;
}

// Titoli visibili in homepage, in ordine di pagina, più il box "più letti" se c'è.
async function fromHome(browser, url) {
  const ctx = await browser.newContext({ locale: 'it-IT', userAgent: UA, viewport: { width: 1366, height: 900 } });
  // Immagini, font e tracciatori non servono e rallentano il proxy.
  await ctx.route('**/*', (route) =>
    ['image', 'media', 'font'].includes(route.request().resourceType()) ? route.abort() : route.continue(),
  );
  const page = await ctx.newPage();
  try {
    let lastError;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        lastError = null;
        break;
      } catch (e) {
        lastError = e;
      }
    }
    if (lastError) throw lastError;
    await page.waitForTimeout(3500);
    return await page.evaluate(() => {
      const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
      const seen = new Set();
      const headlines = [];
      // Banner dei consensi e menu di navigazione non sono titoli.
      const noise = (a) =>
        a.closest('nav,header,footer,[id*=cookie],[class*=cookie],[id*=consent],[class*=consent],[id*=cmp],[class*=cmp],[class*=iubenda],[id*=onetrust],[class*=didomi],[id*=qc-],[class*=qc-]');
      for (const a of document.querySelectorAll('a[href]')) {
        const t = clean(a.innerText);
        if (t.length < 28 || t.length > 220 || seen.has(t) || noise(a)) continue;
        if (t.split(' ').length < 5 || t === t.toUpperCase()) continue;
        if (/cookie|privacy|iscriviti|accedi|newsletter|abbonati|partner|fornitor|consenso|IAB/i.test(t)) continue;
        seen.add(t);
        headlines.push({ title: t, url: a.href, rank: headlines.length + 1 });
        if (headlines.length >= 60) break;
      }
      const mostRead = [];
      // Solo un vero titolo di sezione: le schede cliccabili mostrerebbero le ultime notizie.
      for (const el of document.querySelectorAll('h1,h2,h3,h4,h5,h6')) {
        const t = clean(el.innerText);
        if (t.length > 30 || !/pi[uù]\s+lett/i.test(t)) continue;
        let box = el.parentElement;
        for (let i = 0; i < 5 && box && box.querySelectorAll('a[href]').length < 3; i++) box = box.parentElement;
        if (!box) continue;
        for (const a of box.querySelectorAll('a[href]')) {
          const at = clean(a.innerText);
          if (at.length >= 28 && !mostRead.some((m) => m.title === at)) mostRead.push({ title: at, url: a.href });
        }
        if (mostRead.length) break;
      }
      return { headlines, mostRead: mostRead.slice(0, 10) };
    });
  } finally {
    await ctx.close();
  }
}

async function trends() {
  const xml = await get(TRENDS_RSS);
  return items(xml).map((it) => ({
    term: tag(it, 'title'),
    traffic: tag(it, 'ht:approx_traffic'),
    started: tag(it, 'pubDate') ? new Date(tag(it, 'pubDate')).toISOString() : '',
    news: [...it.matchAll(/<ht:news_item>([\s\S]*?)<\/ht:news_item>/g)].slice(0, 3).map((m) => ({
      title: tag(m[1], 'ht:news_item_title'),
      source: tag(m[1], 'ht:news_item_source'),
    })),
  }));
}

async function suggestions(seed) {
  const body = await get(`https://suggestqueries.google.com/complete/search?client=firefox&hl=it&gl=it&q=${encodeURIComponent(seed)}`);
  const [, list] = JSON.parse(body);
  return { seed, suggestions: list.filter((s) => s !== seed) };
}

async function settle(label, fn) {
  try {
    return { ok: true, value: await fn() };
  } catch (e) {
    console.error(`  ! ${label}: ${e.message.split('\n')[0]}`);
    return { ok: false, error: e.message.split('\n')[0].slice(0, 200) };
  }
}

// Nell'ambiente cloud Chromium passa da un proxy con una propria CA, che
// Chromium non conosce: la fidiamo esplicitamente con il pin della sua chiave.
async function proxyTrustArgs() {
  const caPath = '/root/.ccr/agent-proxy-ca.crt';
  try {
    const cert = new X509Certificate(await readFile(caPath));
    const spki = cert.publicKey.export({ type: 'spki', format: 'der' });
    return [`--ignore-certificate-errors-spki-list=${createHash('sha256').update(spki).digest('base64')}`];
  } catch {
    return [];
  }
}

async function main() {
  const require = createRequire(import.meta.url);
  const npmRoot = (await run('npm', ['root', '-g'])).stdout.trim();
  const { chromium } = require(join(npmRoot, 'playwright'));
  const browser = await chromium.launch({
    proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined,
    args: await proxyTrustArgs(),
  });

  const outlets = [];
  for (const o of OUTLETS) {
    console.error(`- ${o.name}`);
    const home = o.home ? await settle(`${o.id} home`, () => fromHome(browser, o.home)) : null;
    const latest = o.latest ? await settle(`${o.id} ultime`, () => fromAdvisorLatest(o.latest)) : null;
    const [rss, gnews] = await Promise.all([
      o.rss ? settle(`${o.id} rss`, () => fromRss(o.rss)) : null,
      o.gnews ? settle(`${o.id} gnews`, () => fromGoogleNews(o.gnews, o.gnewsTitleSuffix)) : null,
    ]);
    // Un articolo può arrivare da più canali: lo teniamo una volta, preferendo il feed.
    const byTitle = new Map();
    for (const it of [...(rss?.value || []), ...(gnews?.value || [])]) {
      const key = it.title.toLowerCase().slice(0, 80);
      if (!byTitle.has(key)) byTitle.set(key, it);
    }
    outlets.push({
      id: o.id,
      name: o.name,
      own: !!o.own,
      channels: {
        latest: latest ? (latest.ok ? `ok (${latest.value.length} ultimi articoli)` : `errore: ${latest.error}`) : 'non previsto',
        home: home ? (home.ok ? `ok (${home.value.headlines.length} titoli)` : `errore: ${home.error}`) : 'non previsto',
        rss: rss ? (rss.ok ? `ok (${rss.value.length} nella finestra)` : `errore: ${rss.error}`) : 'non previsto',
        gnews: gnews ? (gnews.ok ? `ok (${gnews.value.length} nella finestra)` : `errore: ${gnews.error}`) : 'non previsto',
      },
      published: [...byTitle.values()].sort((a, b) => b.time.localeCompare(a.time)),
      // Per Advisor la "home" è la lista delle ultime news, già in ordine di pubblicazione.
      home: home?.ok ? home.value.headlines : latest?.ok ? latest.value : [],
      mostRead: home?.ok ? home.value.mostRead : [],
    });
  }
  await browser.close();

  console.error('- segnali lettori');
  const tr = await settle('trends', trends);
  const sg = [];
  for (const seed of SEARCH_SEEDS) {
    const r = await settle(`suggest ${seed}`, () => suggestions(seed));
    if (r.ok) sg.push(r.value);
  }

  const raw = {
    runId,
    runAt: now.toISOString(),
    windowHours: HOURS,
    since: since.toISOString(),
    outlets,
    audience: {
      trends: tr.ok ? tr.value : [],
      trendsStatus: tr.ok ? `ok (${tr.value.length})` : `errore: ${tr.error}`,
      searches: sg,
    },
  };
  await mkdir(OUT, { recursive: true });
  const body = JSON.stringify(raw, null, 1);
  await writeFile(join(OUT, `raw-${runId}.json`), body);
  await writeFile(join(OUT, 'raw-latest.json'), body);
  for (const o of outlets) console.error(`  ${o.name.padEnd(18)} pubblicati ${String(o.published.length).padStart(3)}  home ${String(o.home.length).padStart(2)}  più letti ${o.mostRead.length}`);
  console.log(join(OUT, `raw-${runId}.json`));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
