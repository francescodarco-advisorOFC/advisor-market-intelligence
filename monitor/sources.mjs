// Testate monitorate e fonti dei segnali sui lettori.
// Per ogni testata il raccoglitore combina tre canali:
//   home  — i titoli in homepage al momento del run (browser headless)
//   rss   — il feed nativo, filtrato sulla finestra temporale
//   gnews — Google News "site:" come ripiego quando il sito blocca i bot
//   latest — una pagina "ultime notizie" letta come HTML (solo Advisor)
//   archive — l'archivio completo con data e ora, dall'API del sito (solo Advisor)

export const OUTLETS = [
  {
    id: 'advisor',
    name: 'Advisor',
    own: true,
    site: 'https://advisoronline.it',
    // advisoronline.it/articles raccoglie tutti gli articoli pubblicati: la
    // pagina si alimenta da questa API, che dà data e ora di ogni contenuto.
    archiveApi: 'https://advisoronline.stellate.sh',
    // La stessa pagina letta come HTML: i titoli in vetrina al momento del run.
    // (La home risponde a fatica ai browser automatici.)
    latest: 'https://advisoronline.it/articles',
    gnews: 'site:advisoronline.it',
  },
  {
    id: 'fundspeople',
    name: 'FundsPeople',
    home: 'https://fundspeople.com/it/',
    rss: 'https://fundspeople.com/it/feed/',
    gnews: 'site:fundspeople.com/it',
  },
  {
    id: 'bluerating',
    name: 'Bluerating',
    home: 'https://www.bluerating.com/',
    rss: 'https://www.bluerating.com/feed',
  },
  {
    id: 'citywire',
    name: 'Citywire Italia',
    // Home e feed sono dietro Incapsula: solo Google News.
    gnews: 'site:citywire.com/it',
    gnewsTitleSuffix: 'Citywire',
  },
  {
    id: 'wewealth',
    name: 'We Wealth',
    home: 'https://www.we-wealth.com/',
    gnews: 'site:we-wealth.com',
  },
  {
    id: 'wsi',
    name: 'Wall Street Italia',
    home: 'https://www.wallstreetitalia.com/',
    rss: 'https://www.wallstreetitalia.com/feed/',
    gnews: 'site:wallstreetitalia.com',
  },
  {
    id: 'focusrisparmio',
    name: 'FocusRisparmio',
    // Il certificato del sito non viene accettato dal proxy: solo Google News.
    gnews: 'site:focusrisparmio.com',
  },
];

// Parole di partenza per i suggerimenti di ricerca di Google: mostrano
// cosa digitano oggi le persone intorno ai temi della consulenza.
export const SEARCH_SEEDS = [
  'consulente finanziario',
  'investire',
  'btp',
  'etf',
  'fondi comuni',
  'fondo pensione',
  'conto deposito',
  'tassi bce',
  'oro prezzo',
  'borsa milano',
  'inflazione',
  'successione eredità',
  'polizza vita',
  'private banking',
  'risparmio gestito',
  'bitcoin',
  'mutuo tassi',
  'pensione anticipata',
];

export const TRENDS_RSS = 'https://trends.google.com/trending/rss?geo=IT';
