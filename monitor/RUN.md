# Radar Advisor: procedura di un run

Questa è la procedura che una sessione di Claude segue quando parte un'analisi
dal pulsante "Avvia nuova analisi" del radar, o quando qualcuno la chiede in chat.
Il risultato viene scritto nel database dell'artifact **Radar Advisor**:

    https://claude.ai/artifact/M8pvrGbUzgL6AaEwbyeMd2

Documenti usati dalla pagina:

| Percorso | Contenuto |
|---|---|
| `runs_index/<runId>` | una riga per run: `runId, runAt, windowHours, status, headline, topics, onlyUs, missing, shared` |
| `runs/<runId>` | il report completo prodotto da `finalize.mjs` |
| `config/app` | `{ triggerId }`: la routine che il pulsante avvia |

`status` vale `running`, `done` o `error`.

## Passi

1. **Repository.** Lavora nel checkout di
   `francescodarco-advisorOFC/advisor-market-intelligence`, branch
   `claude/gallant-meitner-73dqpr`. Se la cartella non c'è, clonala.

2. **Finestra.** Il messaggio che avvia il run può contenere
   "Finestra richiesta dal radar: N ore". Usa N; se manca, usa 24.

3. **Segna il run come in corso.** Calcola `RUN_ID=$(date -u +%Y%m%d%H%M)` e
   scrivi con `ArtifactData` (azione `set`) il documento `runs_index/<RUN_ID>`
   con `{runId, runAt (ISO, ora), windowHours, status: "running", headline: "Analisi in corso"}`.

4. **Raccolta.**

       node monitor/collect.mjs --hours N --run-id RUN_ID

   Scrive `monitor/out/raw-RUN_ID.json`. Dura 3-5 minuti. Se una testata
   risponde con errore il run continua: annotalo nei limiti.

5. **Analisi.** Leggi il file raw e scrivi `monitor/out/report-RUN_ID.json`
   seguendo lo schema sotto. È il passo che conta: fallo con cura.

6. **Controllo.**

       node monitor/finalize.mjs monitor/out/report-RUN_ID.json

   Se segnala errori, correggi il report e rilancia. Produce
   `db-run-RUN_ID.json` e `db-index-RUN_ID.json`.

7. **Pubblicazione.** Un solo `ArtifactData` `batch` con due `set`:
   `runs/RUN_ID` con il contenuto di `db-run-RUN_ID.json`, e
   `runs_index/RUN_ID` con il contenuto di `db-index-RUN_ID.json`.
   La pagina si aggiorna da sola.

8. **Se qualcosa va storto** dopo il passo 3, aggiorna `runs_index/RUN_ID` con
   `status: "error"` e `headline` = una frase che spiega cosa è fallito.

## Come fare l'analisi

Il file raw contiene, per ogni testata, `published` (articoli nella finestra,
da feed o Google News), `home` (titoli in homepage al momento del run, anche
più vecchi) e `channels` (esito di ogni fonte). In `audience` ci sono le
tendenze di Google Trends Italia e i suggerimenti di ricerca Google.

- **Raggruppa per argomento, non per titolo.** Due testate che raccontano lo
  stesso fatto o lo stesso filone (es. "Fideuram 294 ingressi") formano un
  solo argomento. Punta a 20-35 argomenti; tralascia la cronaca non pertinente
  al risparmio gestito (sport, spettacolo, cucina).
- **Coverage.** Per ogni testata che tratta l'argomento, fino a 4 articoli
  `{t: titolo, u: url, k: "pub" | "home"}`; `pub` se viene da `published`,
  `home` se solo dalla homepage. Copia titoli e url dal raw.
- **Advisor** è la testata `advisor`. `finalize.mjs` ricava da coverage se un
  argomento è "solo noi", "ci manca" o "in comune".
- **readerSignal** (`alto`, `medio`, `basso`, `nessuno`) misura solo l'evidenza
  sui lettori: tendenze di Google Trends e suggerimenti di ricerca. Non
  confonderlo con quante testate ne parlano. In `readerEvidence` cita le
  ricerche concrete.
- **Tono.** Italiano, frasi brevi, niente toni assertivi: pro e contro.
  Riconosci anche quando un tema mancante è fuori dal perimetro di Advisor.

### Schema del report

```json
{
  "runId": "RUN_ID",
  "headline": "Una o due frasi: dove siamo avanti, dove indietro, cosa cercano i lettori.",
  "summary": {
    "plus":    ["3-5 punti: cosa abbiamo in più"],
    "minus":   ["3-5 punti: cosa ci manca"],
    "readers": ["2-4 punti: cosa cercano i lettori"],
    "actions": ["3-4 proposte concrete per la redazione"]
  },
  "topics": [
    {
      "label": "Titolo breve dell'argomento",
      "category": "una delle categorie in finalize.mjs",
      "coverage": { "advisor": [{ "t": "...", "u": "...", "k": "pub" }], "bluerating": [] },
      "readerSignal": "alto | medio | basso | nessuno",
      "readerEvidence": "Quali ricerche lo mostrano",
      "note": "Facoltativa: un'osservazione utile alla redazione"
    }
  ],
  "audience": {
    "relevantTrends": ["termini di Google Trends pertinenti, copiati esatti dal raw"],
    "themes": [
      {
        "label": "Tema che attira i lettori",
        "evidence": "Le ricerche concrete",
        "source": "Google Trends | Suggerimenti Google",
        "strength": "alto | medio | basso",
        "advisorCovered": false,
        "competitorsCovering": ["id testate"]
      }
    ]
  },
  "limits": ["Cosa non ha funzionato o cosa va letto con cautela in questo run"]
}
```

Categorie ammesse: Reti e consulenti · Private banking e wealth · Mercati e
asset allocation · Prodotti: fondi, ETF, certificati · Banche, M&A e
governance · Nomine · Normativa, fisco e vigilanza · Previdenza e protezione ·
Truffe e tutela del risparmiatore · Eventi e premi · Altro.

## Limiti noti delle fonti

- Citywire (Incapsula) e FocusRisparmio (certificato non accettato dal proxy)
  si leggono solo via Google News.
- La homepage di Advisor risponde a fatica ai browser automatici: si usa la
  pagina "Ultime news".
- Social network (LinkedIn, X, Facebook, Reddit) non sono accessibili senza API.
- I dati di lettura di Advisor (Google Analytics, newsletter) non sono collegati.
