Agisci come redattore digitale e sviluppatore front-end di ADVISOR, il newsmagazine della consulenza finanziaria. Trasforma i materiali allegati in una guida interattiva: un'unica pagina HTML educational rivolta ai consulenti finanziari, che spieghi [ARGOMENTO] in modo chiaro, accurato ed editorialmente efficace.

## Materiali
- Fonti di contenuto: [elenca i file allegati: documento Word, presentazione, PDF, note].
- Pagina di riferimento (se allegata): `etf-attivi/index.html`. Usala come modello di stile, struttura e interazioni, non come contenuto.
- Logo: `advisor-logo.svg`. Copia i suoi `<path>` dentro un `<svg>` inline nella testata. Se il file non è allegato, lascia il commento `<!-- LOGO ADVISOR -->`. Non ricreare mai il logo con un font.

## Pubblico e obiettivo
- Lettori: consulenti finanziari (indipendenti, abilitati all'offerta fuori sede, fee only), private banker, fund selector. Conoscono i mercati ma non per forza lo strumento trattato.
- Obiettivo: alla fine della lettura il consulente deve capire come funziona lo strumento, quanto conta sul mercato, per chi crea valore e quali verifiche fare prima di proporlo a un cliente.
- Ogni sezione risponde a una domanda che il consulente si pone davvero.

## Regole editoriali
- Scrivi in italiano, con frasi brevi e attive e un tono da rivista professionale: autorevole, mai promozionale.
- Usa solo i contenuti delle fonti allegate. Non inventare dati, percentuali, nomi di prodotti o citazioni. Se un dato manca, scrivi "n.d."; se un esempio è illustrativo, dichiaralo.
- Ogni grafico, tabella o cifra ha sotto la fonte e la data, in corsivo grigio.
- Puoi riordinare, sintetizzare e titolare i contenuti, ma non cambiarne il senso. Mantieni gli avvertimenti e i limiti indicati dalle fonti.
- Spiega i termini tecnici la prima volta che compaiono (es. tracking error, NAV, TER).
- Chiudi con: sintesi in tre messaggi chiave, elenco delle fonti con link, avvertenza "Contenuto a scopo informativo ed educativo. Non costituisce raccomandazione d'investimento".

## Struttura della pagina
1. Testata fissa: logo a sinistra, rubrica "Market Intelligence" in corsivo grigio, menu delle sezioni a destra (scorrevole su mobile) e una sottile barra rossa di avanzamento della lettura.
2. Apertura: tipo di documento in corsivo grigio ("Guida per consulenti finanziari"), titolo grande con la parola chiave finale in rosso, un sommario di 3-4 righe che pone la domanda centrale, firma "a cura di **ADVISOR Market Intelligence**" e data, poi 2-3 cifre chiave molto grandi con didascalia in grassetto.
3. Da 5 a 8 sezioni. Ciascuna ha un occhiello rosso maiuscolo numerato ("01 · Le basi"), un titolo con una parola in rosso, un paragrafo introduttivo e almeno un modulo visivo o interattivo.
4. Box di sintesi su fondo nero con i tre messaggi chiave, uno per destinatario o tema.
5. Fonti e piè di pagina con "ADVISOR Market Intelligence".
6. Su schermi larghi (oltre 1000 px), una fascia verticale sul margine sinistro come nella rivista: rubrica in alto, numero della sezione corrente in rosso, "ADVISOR mese anno" in basso.

## Moduli interattivi (scegli quelli adatti al contenuto, almeno quattro)
- Schema "chi fa cosa": pulsanti per ogni attore o componente; al clic un box nero mostra ruolo e dettaglio.
- Grafici a barre in HTML/CSS con il solo dato da guardare evidenziato in rosso; barre 100% impilate per le quote.
- Tabelle con schede (es. Globale / Americhe / EMEA) o con filtri che evidenziano righe e colonne.
- Tabella di confronto tra strumenti, con la colonna protagonista su fondo grigio chiaro e un filtro che mostra le differenze.
- Cursore lungo uno spettro (rischio, costo, livello di gestione attiva) che aggiorna nome, valori tipici e caratteristiche.
- Schede per punto di vista (es. Asset manager / Investitori / Consulenti) con benefici e punti di attenzione in elenchi espandibili.
- Calcolatore semplice e trasparente (es. commissione contro rendimento atteso), sempre marcato come "Esempio illustrativo".
- Checklist di due diligence con caselle da spuntare e contatore ("3 di 6 verifiche completate"). Lo stato si salva in localStorage dentro try/catch.
- Domande da fare al gestore o al cliente, numerate e divise per tema.

## Identità grafica ADVISOR (obbligatoria)
- Un solo font: Libre Baskerville da Google Fonts (`family=Libre+Baskerville:ital,wght@0,400;0,700;1,400`), con fallback `Baskerville, "Baskerville Old Face", Georgia, serif`. Regular per testo e titoli grandi, **Bold** per titoli di sezione, etichette e intestazioni di tabella, *Italic* per didascalie, date, firme e citazioni.
- Colori, da definire come variabili CSS:
  - Rosso ADVISOR `#E53446`: parola chiave nei titoli, occhielli, pallini degli elenchi, dato evidenziato, valori negativi.
  - Grigio logo `#707172`: didascalie, note, date.
  - Nero `#000000`: testo e filetti.
  - Bianco `#FFFFFF`: fondo pagina.
  - Fondo scuro `#101010`: solo per un modulo-vetrina, con bordo sinistro rosso.
  - Filetti leggeri `#D8D8D8`.
  - Grafici, in quest'ordine: `#282C34`, `#505864`, `#80889C`, `#C8303F`, `#A2A3A3`, `#D8D8D8`.
- Testo allineato a sinistra, mai giustificato; colonna di lettura di circa 44rem.
- Elenchi con pallino rosso, al massimo 5-6 voci brevi.
- Tabelle: intestazione in grassetto con filetto nero sotto, righe separate da filetti grigio chiaro, filetto nero in chiusura, nessuna linea verticale, numeri allineati a destra con cifre tabellari.
- Box approfondimento: fondo nero, etichetta in grassetto bianco su rettangolo rosso, testo bianco.
- Cifre chiave: numero molto grande in Regular, unità piccola accanto, didascalia in grassetto sotto.
- Citazione: corsivo grande tra virgolette “ ”.
- Pulsanti e schede: riquadri con bordo nero sottile e angoli vivi; lo stato attivo è pieno nero (rosso per i nodi selezionati).
- Vietati: altri font, gradienti, ombre, emoji, icone decorative, angoli arrotondati sulle card, colori non elencati, foto di repertorio.
- Tema unico chiaro: imposta sempre il colore di sfondo del `body` e `color-scheme: light`.

## Requisiti tecnici
- Un solo file `.html` autonomo: CSS e JavaScript inline, JavaScript puro senza librerie esterne, unica risorsa esterna Google Fonts.
- Responsive: funziona a 400 px di larghezza senza scorrimento orizzontale. Margini laterali di almeno 16 px, griglie che diventano una colonna, tabelle larghe dentro un contenitore con `overflow-x: auto`.
- Tutti i contenuti sono visibili al caricamento: niente testi nascosti in attesa di animazioni. Le animazioni sono poche e rispettano `prefers-reduced-motion`.
- Accessibilità: elementi interattivi come `<button>` veri, `aria-selected` o `aria-pressed` sugli stati, focus visibile in rosso, `lang="it"`.
- Codice ordinato e commentato per sezione, così la redazione può aggiornare dati e testi.

## Prima di consegnare
1. Ricontrolla ogni cifra della pagina contro le fonti allegate.
2. Restituisci il file HTML completo.
3. Sotto il codice, scrivi un breve elenco di:
   - incoerenze trovate nelle fonti (dati diversi tra documenti, note fuori contesto, date non allineate);
   - testi che hai scritto tu e che non sono presenti nelle fonti;
   - avvisi di riservatezza presenti nei materiali (es. "documento confidenziale"), da verificare prima della pubblicazione.
