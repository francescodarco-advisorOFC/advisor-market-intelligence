---
name: stile-advisor
description: Identità grafica ADVISOR (newsmagazine della consulenza finanziaria) da applicare a OGNI documento o artefatto prodotto per ADVISOR o Market Intelligence — documenti Word/.docx e Docs, PDF, presentazioni e slide/.pptx, pagine HTML e artifact, report, note di mercato, one-pager, grafici, tabelle, email formattate. Contiene regole (un solo font Baskerville, colori ADVISOR, logo), il logo vettoriale, i font e i modelli pronti (Template ADVISOR.dotx, .potx, template PDF). Usala sempre quando l'utente chiede di creare, impaginare, formattare o "rendere più bello" un documento, un report, una presentazione, un PDF o una pagina, anche se non nomina ADVISOR né lo stile, e quando dice "stile ADVISOR", "nostro stile", "template aziendale", "brand".
---

# Stile ADVISOR

Ogni deliverable deve sembrare prodotto da ADVISOR: replica **solo** gli elementi grafici
della rivista ADVISOR e della presentazione corporate, semplificati per l'uso business.
L'identità funziona perché è sobria e coerente, quindi non aggiungere nulla che non sia
qui: niente altri font, niente gradienti, ombre, emoji, icone decorative o palette inventate.
Usa contenuti reali; se mancano dati, segnala chiaramente quelli di esempio.

## Da dove partire, per formato

| Richiesta | Parti da | Come |
|---|---|---|
| Documento Word, report da modificare | `assets/templates/Template ADVISOR.dotx` | Usa la skill docx. Copia il .dotx in .docx (vedi sotto) e riempilo usando i suoi stili, oppure genera con docx-js seguendo `scripts/word-build-template.js` |
| Presentazione, slide | `assets/templates/Template ADVISOR.potx` | Usa la skill pptx con il .potx come modello (copialo con estensione .pptx per lavorarci), oppure genera con pptxgenjs seguendo `scripts/pptx-build-template.js` |
| PDF (report, nota, one-pager) | `assets/pdf/template-report.html` | Copia l'HTML, sostituisci i contenuti, poi `bash scripts/build-pdf.sh report.html report.pdf` |
| Pagina HTML, artifact, dashboard | `assets/house-style.css` | Copia i token e le regole nel `<style>` della pagina; font da Google Fonts |
| Doc "vivo" in Claude Docs | regole sotto | Applica gerarchia, toni e colori dove lo strumento lo permette |

Per trasformare il modello Word in documento: è un file zip; cambia in
`[Content_Types].xml` `wordprocessingml.template.main+xml` in
`wordprocessingml.document.main+xml` e salvalo come .docx. Per il .potx fai lo stesso
con `presentationml.template.main+xml` → `presentationml.presentation.main+xml`.
I modelli contengono pagine/slide di esempio: sostituiscile o eliminale, non lasciarle.

Se Chromium non c'è (per esempio in alcuni ambienti chat), produci il PDF passando dal
modello Word e convertendolo con LibreOffice, oppure con reportlab registrando i TTF di
`assets/fonts/`. In ogni caso i font vanno incorporati nel PDF.

## Font: uno solo, Baskerville

Tutto, titoli compresi, in **Libre Baskerville** (`assets/fonts/`, licenza OFL, si può
incorporare e distribuire). Fallback: Baskerville (macOS), Baskerville Old Face (Windows),
Georgia. In HTML: Google Fonts `Libre+Baskerville:ital,wght@0,400;0,700;1,400`.

- Regular per il testo e i titoli grandi.
- **Bold** per titoli di sezione, domande, etichette, intestazioni di tabella.
- *Italic* per citazioni, firme, didascalie, date.
- Nessun capolettera: i testi iniziano con un paragrafo normale.
- Cifre allineate (lining) nelle tabelle.

## Colori

| Nome | Valore | Uso |
|---|---|---|
| Rosso ADVISOR | `#E53446` | parola chiave nel titolo, etichetta del box, pallini nei documenti, valori negativi, O del logo |
| Rosso corporate | `#BA0100` | solo presentazioni: barra sinistra, mezzo anello, barre etichetta, filetti sotto i blocchi, pallini |
| Grigio logo | `#707172` | logo, didascalie, note, date |
| Nero | `#000000` | testo e filetti nei documenti, box approfondimento |
| Bianco | `#FFFFFF` | fondo documenti, testo sulle slide |
| Fondo slide | `#101010` | sfondo di tutte le slide |

Grafici, in quest'ordine: `#282C34`, `#505864`, `#80889C`, `#C8303F`, `#A2A3A3`, `#D8D8D8`;
accenti secondari `#04ACC8`, `#C4D4F8`. Ciambelle spesse senza bordi; legenda con
quadratino colore a sinistra e percentuale tra parentesi, es. `Oltre 1 mln € (45%)`.
Nei grafici a barre il rosso evidenzia il solo dato da guardare.

## Logo

`ADVISOR` grigio con la O rossa (`assets/logo/advisor-logo.svg` o `.png`); su fondo
scuro la versione bianca (`advisor-logo-white.png`). Il logo è un marchio: usa sempre
questi file, non ricomporlo con un font, non deformarlo, non ricolorarlo.

## Documenti (Word, PDF, report, pagine)

- A4, fondo bianco, testo nero allineato a sinistra (mai giustificato), margini 2,5 cm.
- Scala: titolo documento 28 pt Regular; titolo di sezione 16 pt Bold; sottosezione o
  domanda 11 pt Bold; testo 11 pt, interlinea 1,4; didascalie e note 9 pt Italic grigio.
- **Copertina**: logo in alto, tipo documento in corsivo grigio, titolo con la parola
  chiave finale in rosso ADVISOR, filetto nero sottile, firma a destra `di **Nome Cognome**`,
  data in corsivo grigio. Niente testatina sulla copertina.
- **Testatina** (dalla seconda pagina): ADVISOR a sinistra, titolo breve e data in corsivo
  grigio a destra, filetto nero sotto. **Piè di pagina**: `ADVISOR Market Intelligence` e
  `Pagina X di Y`, filetto nero sopra.
- **Elenchi**: pallino rosso, frasi brevi, massimo cinque o sei punti.
- **Citazione**: corsivo grande con virgolette “ ”, attribuzione in corsivo grigio sotto.
- **Cifra chiave**: numero molto grande Regular, `%` o unità piccoli accanto, didascalia
  Bold centrata sotto. Si affianca bene a una citazione.
- **Tabelle**: intestazione Bold con filetto nero sotto, righe separate da filetti grigio
  chiaro, filetto nero in chiusura, nessuna griglia verticale, numeri a destra, negativi in
  rosso (solo la cifra negativa), fonte in didascalia sotto.
- **Box approfondimento**: fondo nero, titolo Bold bianco su etichetta rossa ADVISOR,
  testo bianco. Per note di metodo, schede, focus.
- Nelle pagine HTML larghe la testatina può stare in verticale sul margine sinistro,
  come nella rivista (rubrica in alto, `ADVISOR mese anno`, numero pagina in basso).

## Presentazioni (16:9, 13,33 × 7,5 in)

- Fondo `#101010`; foto in bianco e nero, scurite, con angoli arrotondati.
- Su ogni slide: barra verticale rossa corporate sul bordo sinistro, logo bianco in alto a
  destra, numero di pagina piccolo grigio in basso a destra. Mezzo anello rosso (ciambella
  centrata sul bordo sinistro) all'altezza del titolo: nel modello è un elemento sulle
  slide, quindi copialo da una slide di esempio.
- Layout del modello: Copertina, Sezione, Titolo e testo, Testo e immagine, Solo titolo,
  Chiusura. Usa i segnaposto dei layout invece di caselle di testo libere.
- Scala: titolo 36 pt Regular bianco su **una sola riga**; sottotitolo 20 pt; testo 16 pt;
  intestazione di blocco 18 pt Bold con filetto rosso spesso sotto; didascalie 11 pt
  corsivo grigio.
- **Barre etichetta**: rettangolo rosso pieno con angoli destri arrotondati, testo Bold
  bianco MAIUSCOLO; accanto una cifra grande Bold (es. `10ª Edizione`).
- **Callout** per il messaggio chiave: riquadro bianco con angolo in basso a destra
  arrotondato, testo Bold rosso centrato, triangolo rosso sul vertice in alto a sinistra.
- **Banner a freccia** grigio chiaro `#D8D8D8` con testo nero, per introdurre un grafico.
- Cifre chiave: numeri grandi Bold bianchi sopra un filetto rosso, didascalia sotto.
- Grafici nativi di PowerPoint (modificabili), non immagini.

## Pagine HTML e artifact

Parti da `assets/house-style.css`. È un'identità a tema unico: documenti su bianco, slide
su `#101010`; imposta sempre colori espliciti (incluso lo sfondo del `body`) così la pagina
resta corretta anche se il visualizzatore è in modalità scura. Il logo va incluso come SVG
inline copiando i `<path>` di `assets/logo/advisor-logo.svg` (classi `.l` grigio, `.o` rosso;
su fondo scuro entrambe bianche).

## Prima di consegnare

Converti il risultato in immagini (PDF → `pdftoppm`) e guardalo: titoli che vanno a capo
male, testatina attaccata al testo, tabelle o box spezzati tra due pagine, didascalie
orfane, testo che esce dalle slide. Controlla con `pdffonts` che nel PDF ci sia solo
Libre Baskerville, incorporato.
