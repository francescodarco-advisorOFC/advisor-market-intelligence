# Istruzioni per Claude

## Stile visivo di tutti i deliverable

Vale per **ogni** documento o artefatto prodotto per questo progetto: pagine HTML,
artifact, presentazioni (slide, .pptx), documenti (Docs, .docx), PDF, grafici,
report ed email formattate. L'obiettivo è un'identità editoriale riconoscibile,
**lontana dallo stile "di default"** (niente Inter/Roboto/Arial, niente card
arrotondate con ombre, niente gradienti viola-blu, niente emoji come icone).

La fonte unica dei valori è `design/house-style.css`: per le pagine HTML
copiala o includila; per gli altri formati riporta gli stessi valori.

### Carattere: "rivista finanziaria"

- Editoriale e asciutto, come un report di ricerca stampato, non come un'app SaaS.
- Gerarchia data dalla tipografia e dallo spazio bianco, non da box e colori.
- Filetti sottili (hairline 1px) al posto di bordi pesanti e ombre.
- Angoli vivi (border-radius 0–2px). Nessun drop shadow, nessun glassmorphism.
- Layout asimmetrico: colonna stretta a sinistra per etichette/note a margine,
  colonna larga per il testo. Allineamento a sinistra, mai testo giustificato centrato.

### Font

| Ruolo | Font | Fallback (se non incorporabile) |
|---|---|---|
| Titoli / display | **Fraunces** (serif variabile, opsz alto, peso 300–600, corsivo per enfasi) | Georgia |
| Testo corrente | **Schibsted Grotesk** (400/500) | Segoe UI, Helvetica Neue |
| Numeri, dati, etichette tecniche | **JetBrains Mono** (400/500) con cifre tabulari | Consolas, Menlo |

- Titoli grandi e leggeri (Fraunces 300–400), interlinea stretta (1.05), tracking leggermente negativo.
- Occhielli/etichette sopra i titoli: maiuscoletto in JetBrains Mono, 11–12px,
  letter-spacing 0.12em, colore accento. Es. `01 — MERCATO`.
- KPI e cifre chiave: numeri molto grandi in Fraunces, unità e didascalia in mono piccolo.
- Numerazione delle sezioni in stile editoriale (`01`, `02`, …).

### Colori

| Token | Valore | Uso |
|---|---|---|
| `--paper` | `#F3EFE6` | sfondo (carta calda, mai bianco puro) |
| `--ink` | `#16161A` | testo principale |
| `--ink-muted` | `#5E5A52` | testo secondario, didascalie |
| `--rule` | `#D8D1C2` | filetti e separatori |
| `--accent` | `#C2410C` | vermiglio: un solo accento, usato con parsimonia |
| `--deep` | `#0F3D3E` | verde petrolio: secondo colore, blocchi di contrasto |
| `--ochre` | `#B8892B` | ocra: terzo colore per grafici/evidenziazioni |

Modalità scura: sfondo `#14140F` (nero caldo, mai `#000`), testo `#ECE6D8`,
accento `#F07A3E`, petrolio `#5FA8A0`, filetti `#2E2C26`.

Grafici: palette nell'ordine petrolio, vermiglio, ocra, `#7A7466`, `#9DB8B0`;
assi e griglie in `--rule`, etichette in JetBrains Mono, nessun bordo attorno al grafico.

### Regole per formato

- **HTML / artifact**: Google Fonts (Fraunces, Schibsted Grotesk, JetBrains Mono);
  token CSS da `design/house-style.css`; max-width testo ~68ch.
- **Presentazioni**: sfondo carta, una idea per slide, titolo Fraunces grande
  allineato in alto a sinistra, numero slide in mono in basso a destra, una slide
  "di rottura" a tutto campo petrolio per ogni capitolo. Mai template stock.
- **Word / Docs**: titoli Fraunces, corpo Schibsted Grotesk 10.5pt interlinea 1.4,
  margini ampi, tabelle senza griglia verticale (solo filetti orizzontali).
  Se i font non possono essere incorporati usa i fallback indicati.
- **PDF**: incorpora sempre i font; stesso impianto dei documenti.
- Icone: lineari, tratto sottile (es. Lucide/Phosphor "thin"), mai emoji.
