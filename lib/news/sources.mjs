// Fonti del flusso notizie ADVISOR.
// type "rss": feed ufficiale della testata.
// type "gnews": ricerca Google News (per le fonti senza RSS pubblico o con RSS bloccato).

const gnews = (q, lang = 'it') =>
  lang === 'en'
    ? `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`
    : `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=it&gl=IT&ceid=IT:it`;

export const SOURCES = [
  // Agenzie specializzate in economia e finanza
  { id: 'radiocor', name: 'Radiocor – Il Sole 24 Ore', group: 'agenzia', type: 'gnews', urls: [gnews('site:ilsole24ore.com radiocor when:2d')] },
  { id: 'mf', name: 'MF Newswires – Milano Finanza', group: 'agenzia', type: 'gnews', urls: [gnews('site:milanofinanza.it when:2d')] },
  { id: 'teleborsa', name: 'Teleborsa', group: 'agenzia', type: 'rss', urls: ['https://www.teleborsa.it/feed/rss', gnews('site:teleborsa.it when:2d')] },
  { id: 'bloomberg', name: 'Bloomberg', group: 'agenzia', type: 'rss', lang: 'en', urls: ['https://feeds.bloomberg.com/markets/news.rss', 'https://feeds.bloomberg.com/economics/news.rss'] },
  // Agenzie generaliste con servizio economico dedicato
  { id: 'reuters', name: 'Reuters', group: 'agenzia', type: 'gnews', lang: 'en', urls: [gnews('site:reuters.com/markets when:1d', 'en'), gnews('site:reuters.com/business/finance when:1d', 'en')] },
  { id: 'ansa', name: 'ANSA Economia', group: 'agenzia', type: 'rss', urls: ['https://www.ansa.it/sito/notizie/economia/economia_rss.xml'] },
  { id: 'agi', name: 'AGI Economia', group: 'agenzia', type: 'rss', urls: ['https://www.agi.it/economia/rss'] },
  { id: 'sole', name: 'Il Sole 24 Ore', group: 'agenzia', type: 'rss', urls: ['https://www.ilsole24ore.com/rss/finanza.xml', 'https://www.ilsole24ore.com/rss/economia.xml'] },

  // Testate specializzate su risparmio gestito e consulenza
  { id: 'bluerating', name: 'Bluerating', group: 'testata', type: 'rss', urls: ['https://www.bluerating.com/feed'] },
  { id: 'citywire', name: 'Citywire Italia', group: 'testata', type: 'gnews', urls: [gnews('site:citywire.com italia when:2d')] },
  { id: 'wewealth', name: 'We Wealth', group: 'testata', type: 'gnews', urls: [gnews('site:we-wealth.com when:2d')] },
  { id: 'focusrisparmio', name: 'FocusRisparmio', group: 'testata', type: 'gnews', urls: [gnews('site:focusrisparmio.com when:2d')] },
  { id: 'financialounge', name: 'FinanciaLounge', group: 'testata', type: 'rss', urls: ['https://www.financialounge.com/feed/', gnews('site:financialounge.com when:2d')] },
  { id: 'wsi', name: 'Wall Street Italia', group: 'testata', type: 'rss', urls: ['https://www.wallstreetitalia.com/feed/'] },
  { id: 'fundspeople', name: 'FundsPeople Italia', group: 'testata', type: 'rss', urls: ['https://fundspeople.com/it/feed/'] },
  { id: 'faj', name: 'FAJ – Fee Advisor Journal', group: 'testata', type: 'rss', urls: ['https://fajonline.it/feed/', gnews('site:fajonline.it when:2d')] },
];

// Temi assegnati per parole chiave sul titolo e sul sommario.
export const TOPICS = [
  { id: 'gestito', label: 'Risparmio gestito', words: ['fond', 'etf', 'sgr', 'asset manag', 'gestore', 'gestori', 'risparmio gestito', 'pir', 'eltif', 'private market', 'raccolta', 'assogestioni', 'fund', 'portafogl'] },
  { id: 'consulenza', label: 'Consulenza e reti', words: ['consulen', 'advisor', 'private bank', 'promotor', 'rete', 'reti ', 'wealth', 'ocf', 'assoreti', 'anasf', 'family office'] },
  { id: 'mercati', label: 'Mercati', words: ['borsa', 'piazza affari', 'ftse', 'spread', 'btp', 'bund', 'titol', 'azion', 'obbligaz', 'bond', 'wall street', 'nasdaq', 'dow jones', 'cambio', 'euro/dollaro', 'oro', 'petrolio', 'stock', 'market', 'shares', 'yield', 'treasur', 'rally', 'listino', 'quotaz', 'cripto', 'bitcoin'] },
  { id: 'banche', label: 'Banche e assicurazioni', words: ['banc', 'bank', 'assicura', 'insur', 'credito', 'intesa', 'unicredit', 'mps', 'mediobanca', 'generali', 'bper', 'banco bpm', 'opa', 'ops', 'opas'] },
  { id: 'macro', label: 'Economia e politiche', words: ['bce', 'ecb', 'fed', 'tassi', 'inflaz', 'pil', 'gdp', 'istat', 'manovra', 'governo', 'dazi', 'tariff', 'lavoro', 'occupaz', 'debito', 'bilancio', 'economia', 'econom', 'rate'] },
];
