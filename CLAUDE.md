# Istruzioni per Claude

## Stile visivo di tutti i deliverable

Vale per **ogni** documento o artefatto prodotto per questo progetto: documenti Word
(.docx) e Docs, PDF, presentazioni (slide, .pptx), pagine HTML, artifact, grafici,
report ed email formattate.

Lo stile replica **solo ed esclusivamente** l'identità grafica di ADVISOR, ricavata
dalla rivista *ADVISOR – Newsmagazine della consulenza finanziaria* (luglio/agosto 2026)
e dalla presentazione corporate ADVISOR, semplificata per l'uso business.
Non aggiungere elementi, font o colori che non compaiono qui (niente gradienti, ombre,
emoji, icone decorative, palette inventate). I valori pronti per l'HTML sono in
`design/house-style.css`; la pagina `design/prova-stile-advisor.html` mostra tutto applicato.
Per i documenti Word parti sempre da `design/word/Template ADVISOR.dotx` (stili già
pronti, logo, intestazione e piè di pagina, font incluso nel file); i file dei font sono
in `design/fonts/`, gli script per rigenerare il template in `design/word/`.
Per le presentazioni parti sempre da `design/powerpoint/Template ADVISOR.potx`
(layout Copertina, Sezione, Titolo e testo, Testo e immagine, Solo titolo, Chiusura;
esempi di barre etichetta, callout, cifre chiave, grafico a ciambella e tabella).
Titoli delle slide su una sola riga.

### Un solo font: Baskerville

Tutto, titoli compresi, è composto in **Baskerville** (il font del testo corrente
della rivista). Nessun altro font.

| Contesto | Font da usare |
|---|---|
| Word, PDF, PowerPoint | **Libre Baskerville** (gratuito, licenza OFL, incorporabile nei file). Se non disponibile: Baskerville (macOS), poi Baskerville Old Face (Windows), poi Georgia |
| HTML / artifact | Libre Baskerville da Google Fonts, fallback `Baskerville, "Baskerville Old Face", Georgia, serif` |

Pesi e stili: Regular per il testo, **Bold** per titoli di sezione, domande ed etichette,
*Italic* per citazioni, firme e didascalie. Nei PDF i font vanno sempre incorporati.
Nessun capolettera: i testi iniziano con un paragrafo normale.

### Colori

| Token | Valore | Dove |
|---|---|---|
| `--advisor-red` | `#E53446` | parola chiave nel titolo, etichetta del box, O del logo |
| `--corp-red` | `#BA0100` | presentazioni: barra sinistra, mezzo anello, barre etichetta, filetti sotto i titoli, pallini |
| `--logo-grey` | `#707172` | logo, testo secondario, didascalie |
| `--black` | `#000000` | testo, filetti, box approfondimento |
| `--white` | `#FFFFFF` | fondo documenti, testo su scuro |
| `--corp-bg` | `#101010` | fondo slide |

Grafici, nell'ordine: `#282C34`, `#505864`, `#80889C`, `#C8303F`, `#A2A3A3`, `#D8D8D8`;
accenti secondari `#04ACC8`, `#C4D4F8`. Legenda con quadratino colore a sinistra e
percentuale tra parentesi. Ciambelle (donut) spesse, senza bordi.

### Logo

`ADVISOR` grigio `#707172` con la **O** rossa `#E53446`; bianco sulle slide, in alto a destra.
Il logo è un marchio grafico, non testo: usare sempre il file del logo, non ricomporlo.

### Documenti (Word, PDF, report, pagine)

- Fondo bianco, testo nero, allineato a sinistra (non giustificato), margini ampi (2,5 cm).
- **Scala in Word/PDF**: titolo documento 28 pt Regular; titolo di sezione 16 pt Bold;
  sottosezione/domanda 11 pt Bold; testo 11 pt Regular, interlinea 1,4; didascalie e
  note 9 pt Italic grigio `#707172`.
- **Titolo**: Regular grande, nero; la parola chiave finale in rosso `#E53446`.
  Sotto: filetto nero sottile e firma a destra `di **Nome Cognome**`.
- **Domande / sottotitoli interni**: Bold, stessa misura del testo.
- **Citazione**: Italic grande con virgolette “ ”, attribuzione in Italic sotto.
- **Cifra chiave**: numero molto grande nero (Regular), `%` piccolo accanto,
  didascalia Bold centrata sotto.
- **Box approfondimento**: fondo nero, titolo Bold bianco su etichetta rossa `#E53446`,
  testo bianco.
- **Tabelle**: intestazione Bold con filetto nero sotto, righe separate da filetti
  sottili grigi, nessuna griglia verticale, numeri allineati a destra.
- **Intestazione/piè di pagina**: `ADVISOR` (Bold) + titolo o data (Regular) e numero
  pagina, separati dal testo da un filetto nero sottile. Sulle pagine HTML larghe la
  testatina può stare in verticale sul margine sinistro, come nella rivista.

### Presentazioni (16:9)

- Fondo `#101010`, foto di sfondo in bianco e nero scurite; logo bianco in alto a destra,
  numero pagina piccolo grigio in basso a destra.
- Bordo sinistro: barra verticale rossa `#BA0100` e mezzo anello rosso all'altezza del titolo.
- **Scala in PowerPoint**: titolo 36 pt Regular bianco; sottotitolo 20 pt Regular;
  testo 16 pt; intestazione di blocco 18 pt Bold con filetto rosso spesso sotto.
- **Barre etichetta**: rettangoli rosso pieno, angoli destri arrotondati, testo Bold
  bianco MAIUSCOLO; accanto cifra grande Bold (es. `10ª Edizione`).
- **Elenchi**: pallino rosso. **Callout**: riquadro bianco con angolo in basso a destra
  arrotondato, testo Bold rosso centrato, triangolo rosso sul vertice in alto a sinistra.
- Banner a freccia grigio chiaro `#D8D8D8` con testo nero; foto con angoli arrotondati.
