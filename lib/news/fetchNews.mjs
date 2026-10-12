import { SOURCES, TOPICS } from './sources.mjs';

const UA = 'Mozilla/5.0 (compatible; ADVISOR-MarketIntelligence/1.0)';
const HOUR_MS = 60 * 60 * 1000;

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

function decode(str = '') {
  return str
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m);
}

function stripHtml(str = '') {
  return decode(decode(str)).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function tag(block, name) {
  const m = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i'));
  return m ? m[1] : '';
}

// Parser minimale per RSS 2.0 e Atom: titolo, link, data, sommario.
export function parseFeed(xml) {
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) || [];
  return blocks.map((b) => {
    let link = stripHtml(tag(b, 'link'));
    if (!link) {
      const href = b.match(/<link[^>]*href="([^"]+)"/i);
      link = href ? decode(href[1]) : '';
    }
    const date = tag(b, 'pubDate') || tag(b, 'dc:date') || tag(b, 'published') || tag(b, 'updated');
    const sourceName = stripHtml(tag(b, 'source'));
    return {
      title: stripHtml(tag(b, 'title')),
      link: link.trim(),
      date: date ? new Date(stripHtml(date)) : null,
      summary: stripHtml(tag(b, 'description') || tag(b, 'summary')).slice(0, 280),
      sourceName,
    };
  });
}

const TOPIC_RE = TOPICS.map((t) => ({
  id: t.id,
  re: new RegExp(`(^|[^\\p{L}])(${t.words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'iu'),
}));

function topicsFor(text) {
  return TOPIC_RE.filter((t) => t.re.test(text)).map((t) => t.id);
}

async function fetchText(url, timeoutMs) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'application/rss+xml, application/xml, text/xml, */*' },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

async function fetchSource(source, { since, timeoutMs }) {
  const results = await Promise.allSettled(source.urls.map((u) => fetchText(u, timeoutMs)));
  const items = [];
  const errors = [];
  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      errors.push(`${source.urls[i]}: ${r.reason?.message || r.reason}`);
      return;
    }
    for (const it of parseFeed(r.value)) {
      if (!it.title || !it.link || !it.date || isNaN(it.date)) continue;
      if (it.date < since) continue;
      let title = it.title;
      // Google News aggiunge " - Nome testata" in coda al titolo.
      const viaGoogle = source.urls[i].includes('news.google.com');
      if (viaGoogle && it.sourceName && title.endsWith(` - ${it.sourceName}`)) {
        title = title.slice(0, -(it.sourceName.length + 3));
      }
      // Il sommario Google News ripete il titolo: non serve.
      const summary = viaGoogle ? '' : it.summary;
      items.push({
        source: source.id,
        title,
        link: it.link,
        date: it.date.toISOString(),
        summary,
        topics: topicsFor(`${title} ${summary}`),
      });
    }
  });
  return { items, errors };
}

const normTitle = (t) => t.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

export async function fetchNews({ hours = 24, timeoutMs = 12000, now = new Date() } = {}) {
  const since = new Date(now.getTime() - hours * HOUR_MS);
  const settled = await Promise.all(SOURCES.map((s) => fetchSource(s, { since, timeoutMs })));

  const seen = new Set();
  const items = [];
  const status = {};
  settled.forEach(({ items: list, errors }, i) => {
    const src = SOURCES[i];
    let count = 0;
    for (const it of list) {
      const key = `${it.source}|${normTitle(it.title)}`;
      if (seen.has(key) || seen.has(it.link)) continue;
      seen.add(key);
      seen.add(it.link);
      items.push(it);
      count++;
    }
    status[src.id] = { count, ok: errors.length < src.urls.length, errors };
  });

  items.sort((a, b) => b.date.localeCompare(a.date));

  return {
    generatedAt: now.toISOString(),
    hours,
    sources: SOURCES.map(({ id, name, group, type, lang }) => ({ id, name, group, via: type, lang: lang || 'it', ...status[id] })),
    topics: TOPICS.map(({ id, label }) => ({ id, label })),
    items,
  };
}
