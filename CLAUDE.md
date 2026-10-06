# Istruzioni per Claude

## Stile visivo di tutti i deliverable

Vale per **ogni** documento o artefatto prodotto per questo progetto: pagine HTML,
artifact, presentazioni (slide, .pptx), documenti (Docs, .docx), PDF, grafici,
report ed email formattate.

Lo stile replica **solo ed esclusivamente** l'identità grafica di ADVISOR, ricavata
da due riferimenti: la rivista *ADVISOR – Newsmagazine della consulenza finanziaria*
(luglio/agosto 2026) e la presentazione corporate ADVISOR. Non aggiungere elementi,
font o colori che non compaiono lì (niente gradienti, ombre, emoji, icone decorative,
palette inventate). I valori pronti per l'HTML sono in `design/house-style.css`;
la pagina `design/prova-stile-advisor.html` mostra tutto applicato.

### Quale registro usare

| Deliverable | Registro |
|---|---|
| Presentazioni, slide, one-pager commerciali | **Corporate** (fondo scuro, Montserrat, rosso pieno) |
| Report, documenti Word/Docs, PDF, articoli, pagine HTML, newsletter | **Rivista** (fondo bianco, Druk + Baskerville + Inter) |

### Logo / testata

`ADVISOR` in maiuscolo, lettere spaziate, grigio `#707172`; la **O** in rosso `#E53446`.
Sotto, nella rivista: `NEWSMAGAZINE DELLA CONSULENZA FINANZIARIA` in maiuscolo piccolo, nero.
Nella presentazione il logo è bianco, in alto a destra.

### Colori

| Token | Valore | Dove |
|---|---|---|
| `--advisor-red` | `#E53446` | rosso della rivista: O del logo, box titolo "Radici profonde" |
| `--corp-red` | `#BA0100` | rosso pieno della presentazione: barre, filetti sotto i titoli, punti elenco, mezzo anello |
| `--logo-grey` | `#707172` | logo, capolettera |
| `--black` | `#000000` | testi rivista, box approfondimento, filetti |
| `--white` | `#FFFFFF` | fondo rivista, testi su scuro |
| `--corp-bg` | `#101010` | fondo slide |

Grafici (dalla presentazione, nell'ordine): `#282C34`, `#505864`, `#80889C`, `#C8303F`,
`#A2A3A3`, `#D8D8D8`; accenti secondari `#04ACC8`, `#C4D4F8`. Etichette legenda in
Montserrat Regular bianco con la percentuale tra parentesi, quadratino colore a sinistra.
Ciambelle (donut) spesse, senza bordi.

### Font

| Font originale | Uso | Sostituto web (Google Fonts) |
|---|---|---|
| **Druk Text** (Medium, Bold, Super) | titoli rivista in MAIUSCOLO, cifre giganti, occhielli di copertina | **Anton** |
| **Baskerville** (Regular, Italic, SemiBold) | testo corrente rivista; *corsivo* per citazioni e pull-quote | **Libre Baskerville** |
| **Inter** (Light, Regular, SemiBold, Bold) | domande d'intervista, didascalie, firma, testatine, box approfondimento | **Inter** |
| **Montserrat** (Regular, SemiBold, Bold) | tutto nelle presentazioni | **Montserrat** |
| Aptos / Arial | testi minori nelle slide (Office) | Montserrat |

Druk e Baskerville sono font commerciali: usa i sostituti nel web; nei file Office/PDF usa
gli originali se installati, altrimenti i sostituti.

### Registro Rivista (documenti, report, pagine)

- Fondo bianco, testo nero. Colonne strette di testo, allineato a sinistra con sillabazione.
- **Titolo**: Anton/Druk maiuscolo, nero, interlinea molto stretta (~0.95); l'ultima parola
  chiave del titolo più grande e in contrasto (bianco su foto, oppure rosso su bianco).
  Sotto: filetto nero sottile e firma `di **Nome Cognome**` in Inter (Regular + SemiBold).
- **Testo**: Libre Baskerville ~10pt (16px a schermo), interlinea 1.5.
- **Domande / sottotitoli interni**: Inter SemiBold, nero, stessa misura del testo.
- **Capolettera**: Anton grigio `#707172`, alto 4–5 righe.
- **Citazione**: Libre Baskerville *corsivo*, grande, con virgolette “ ”, attribuzione in corsivo.
- **Cifra chiave**: numero gigante Anton nero, `%` piccolo accanto, didascalia in Inter SemiBold
  centrata sotto (es. `60%` – "Il peso delle prime dieci posizioni…").
- **Testatina verticale** sul margine: `In prima persona` (Inter SemiBold) in alto,
  `ADVISOR luglio/agosto 2026` (ADVISOR in Inter Bold, data in Inter Light) e numero pagina
  in Inter Bold, separati dal testo da un filetto verticale nero.
- **Box approfondimento**: fondo nero, titolo in Inter SemiBold bianco su etichetta
  rossa `#E53446`, testo Inter Light bianco.
- **Occhielli di copertina**: Anton maiuscolo grigio scuro sopra filetto nero, sottotitolo Inter Light.

### Registro Corporate (presentazioni)

- Formato 16:9, fondo `#101010`, foto di sfondo in bianco e nero scurite.
- Logo `ADVISOR` bianco in alto a destra; numero pagina piccolo in basso a destra.
- Bordo sinistro: barra verticale rossa `#BA0100` e mezzo anello rosso all'altezza del titolo.
- **Titolo**: Montserrat SemiBold bianco grande; sottotitolo Montserrat Regular sotto.
- **Testo**: Montserrat Regular bianco, parole chiave in Bold.
- **Intestazione di blocco**: Montserrat SemiBold bianco con filetto rosso spesso sotto.
- **Barre etichetta**: rettangoli rosso pieno, angoli destri arrotondati, testo Montserrat Bold
  bianco MAIUSCOLO; accanto cifra grande Montserrat Bold (es. `10ª Edizione`).
- **Elenchi**: pallino rosso.
- **Callout**: riquadro bianco con angolo arrotondato, testo Montserrat Bold rosso centrato,
  triangolo rosso sul vertice in alto a sinistra.
- Freccia/triangolo rosso come segnaposto; banner a freccia grigio chiaro `#D8D8D8` con testo nero.
- Foto con angoli arrotondati.
