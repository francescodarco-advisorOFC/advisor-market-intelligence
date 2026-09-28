// Controlla il report scritto dall'analisi, ricalcola i campi derivati e
// prepara i due documenti da scrivere nel database dell'artifact.
//
//   node monitor/finalize.mjs monitor/out/report-<runId>.json
//
// Scrive accanto al report:
//   db-run-<runId>.json    -> documento runs/<runId>        (report completo)
//   db-index-<runId>.json  -> documento runs_index/<runId>  (riga per lo storico)

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { OUTLETS } from './sources.mjs';

export const CATEGORIES = [
  'Reti e consulenti',
  'Private banking e wealth',
  'Mercati e asset allocation',
  'Prodotti: fondi, ETF, certificati',
  'Banche, M&A e governance',
  'Nomine',
  'Normativa, fisco e vigilanza',
  'Previdenza e protezione',
  'Truffe e tutela del risparmiatore',
  'Eventi e premi',
  'Altro',
];
const SIGNALS = ['alto', 'medio', 'basso', 'nessuno'];
const OUTLET_IDS = OUTLETS.map((o) => o.id);
const OWN = OUTLETS.find((o) => o.own).id;

const fail = (msg) => {
  console.error(`Report non valido: ${msg}`);
  process.exit(1);
};
const str = (v, field) => {
  if (typeof v !== 'string' || !v.trim()) fail(`${field} deve essere un testo non vuoto`);
  return v.trim();
};
const list = (v, field, min = 0) => {
  if (!Array.isArray(v) || v.length < min) fail(`${field} deve essere una lista con almeno ${min} elementi`);
  return v;
};

const path = process.argv[2] || fail('manca il percorso del report');
const report = JSON.parse(await readFile(path, 'utf8'));
const raw = JSON.parse(await readFile(join(dirname(path), `raw-${report.runId}.json`), 'utf8'));

str(report.runId, 'runId');
str(report.headline, 'headline');
for (const k of ['plus', 'minus', 'readers', 'actions']) list(report.summary?.[k], `summary.${k}`, 1).forEach((s, i) => str(s, `summary.${k}[${i}]`));

const topics = list(report.topics, 'topics', 5).map((t, i) => {
  const where = `topics[${i}]`;
  if (!CATEGORIES.includes(t.category)) fail(`${where}.category "${t.category}" non è tra ${CATEGORIES.join(' | ')}`);
  if (!SIGNALS.includes(t.readerSignal)) fail(`${where}.readerSignal deve essere uno di ${SIGNALS.join(', ')}`);
  const coverage = {};
  for (const [id, arts] of Object.entries(t.coverage || {})) {
    if (!OUTLET_IDS.includes(id)) fail(`${where}.coverage ha una testata sconosciuta "${id}"`);
    const clean = list(arts, `${where}.coverage.${id}`).map((a, j) => ({
      t: str(a.t, `${where}.coverage.${id}[${j}].t`),
      u: typeof a.u === 'string' ? a.u : '',
      k: a.k === 'home' ? 'home' : 'pub',
    }));
    if (clean.length) coverage[id] = clean.slice(0, 4);
  }
  if (!Object.keys(coverage).length) fail(`${where} non ha articoli in coverage`);
  const competitors = Object.keys(coverage).filter((id) => id !== OWN);
  return {
    id: `t${i + 1}`,
    label: str(t.label, `${where}.label`),
    category: t.category,
    coverage,
    advisor: !!coverage[OWN],
    competitors,
    readerSignal: t.readerSignal,
    readerEvidence: typeof t.readerEvidence === 'string' ? t.readerEvidence : '',
    note: typeof t.note === 'string' ? t.note : '',
  };
});

const audience = report.audience || {};
const themes = list(audience.themes, 'audience.themes', 1).map((th, i) => ({
  label: str(th.label, `audience.themes[${i}].label`),
  evidence: str(th.evidence, `audience.themes[${i}].evidence`),
  source: typeof th.source === 'string' ? th.source : '',
  strength: SIGNALS.includes(th.strength) ? th.strength : 'medio',
  advisorCovered: !!th.advisorCovered,
  competitorsCovering: Array.isArray(th.competitorsCovering) ? th.competitorsCovering.filter((id) => OUTLET_IDS.includes(id)) : [],
}));

const sources = raw.outlets.map((o) => ({
  id: o.id,
  name: o.name,
  own: o.own,
  published: o.published.length,
  home: o.home.length,
  channels: o.channels,
}));

const run = {
  runId: report.runId,
  runAt: raw.runAt,
  windowHours: raw.windowHours,
  status: 'done',
  headline: report.headline.trim(),
  summary: report.summary,
  topics,
  audience: {
    themes,
    trends: raw.audience.trends.slice(0, 20).map((t) => ({
      term: t.term,
      traffic: t.traffic,
      relevant: (audience.relevantTrends || []).includes(t.term),
      news: t.news.slice(0, 2),
    })),
    searches: raw.audience.searches.map((s) => ({ seed: s.seed, suggestions: s.suggestions.slice(0, 8) })),
    trendsStatus: raw.audience.trendsStatus,
  },
  sources,
  limits: list(report.limits || [], 'limits').map((s, i) => str(s, `limits[${i}]`)),
};

const index = {
  runId: run.runId,
  runAt: run.runAt,
  windowHours: run.windowHours,
  status: 'done',
  headline: run.headline,
  topics: topics.length,
  onlyUs: topics.filter((t) => t.advisor && !t.competitors.length).length,
  missing: topics.filter((t) => !t.advisor && t.competitors.length).length,
  shared: topics.filter((t) => t.advisor && t.competitors.length).length,
};

const size = Buffer.byteLength(JSON.stringify(run));
if (size > 240 * 1024) fail(`il report pesa ${Math.round(size / 1024)} KB: il limite del database è 256 KB, riduci gli argomenti o gli articoli per argomento`);

const dir = dirname(path);
await writeFile(join(dir, `db-run-${run.runId}.json`), JSON.stringify(run));
await writeFile(join(dir, `db-index-${run.runId}.json`), JSON.stringify(index));
console.log(`ok: ${topics.length} argomenti (solo noi ${index.onlyUs}, ci mancano ${index.missing}, in comune ${index.shared}), ${Math.round(size / 1024)} KB`);
