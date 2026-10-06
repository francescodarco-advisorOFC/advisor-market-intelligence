// Genera il template Word ADVISOR (stile in SKILL.md).
// Uso: node scripts/word-build-template.js assets/fonts assets/logo/advisor-logo.png - /tmp/raw.docx
//      python3 scripts/word-embed-fonts.py /tmp/raw.docx assets/fonts out.docx out.dotx
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Header, Footer, AlignmentType,
  BorderStyle, Table, TableRow, TableCell, WidthType, ShadingType, LevelFormat,
  PageNumber, PageBreak, TabStopType, VerticalAlign, HeadingLevel, TableLayoutType, LineRuleType,
} = require("docx");

const [fontDir, logoPath, , outPath] = process.argv.slice(2);

const FONT = "Libre Baskerville";
const RED = "E53446";
const GREY = "707172";
const BLACK = "000000";
const WHITE = "FFFFFF";
const RULE_SOFT = "D8D8D8";

// A4, margini 2,5 cm
const PAGE_W = 11906, PAGE_H = 16838, MARGIN = 1418;
const TEXT_W = PAGE_W - 2 * MARGIN; // 9070

const logo = fs.readFileSync(logoPath);
const LOGO_RATIO = 193 / 1132;
const logoRun = (widthPx) => new ImageRun({
  type: "png", data: logo,
  transformation: { width: widthPx, height: Math.round(widthPx * LOGO_RATIO) },
  altText: { title: "ADVISOR", description: "Logo ADVISOR", name: "logo" },
});

const none = { style: BorderStyle.NONE, size: 0, color: "auto" };
const noBorders = { top: none, bottom: none, left: none, right: none };
const rule = (color, size = 4) => ({ style: BorderStyle.SINGLE, size, color, space: 4 });

const p = (text, style, opts = {}) => new Paragraph({ style, ...opts, children: [new TextRun(text)] });

// ---------- Copertina ----------
const cover = [
  new Paragraph({ spacing: { before: 0, after: 2400 }, children: [logoRun(230)] }),
  p("Nota di mercato", "TipoDocumento"),
  new Paragraph({
    style: "Title",
    children: [
      new TextRun("Titolo del documento con la "),
      new TextRun({ text: "parola chiave in rosso", style: "ParolaChiave" }),
    ],
  }),
  new Paragraph({ style: "Firma", children: [new TextRun("di "), new TextRun({ text: "Nome Cognome", bold: true, italics: false })] }),
  p("Ottobre 2026", "DataDocumento"),
  new Paragraph({ children: [new PageBreak()] }),
];

// ---------- Corpo di esempio ----------
const cell = (children, width, opts = {}) => new TableCell({
  width: { size: width, type: WidthType.DXA }, children, ...opts,
});

const quoteAndFigure = new Table({
  width: { size: TEXT_W, type: WidthType.DXA },
  columnWidths: [5670, 3400],
  layout: TableLayoutType.FIXED,
  borders: { ...noBorders, insideHorizontal: none, insideVertical: none },
  rows: [new TableRow({ children: [
    cell([
      p("“Le citazioni vanno in corsivo, con le virgolette alte e l’attribuzione sotto”.", "Citazione"),
      p("Nome Cognome, ruolo", "CitazioneFonte"),
    ], 5670, { borders: noBorders, verticalAlign: VerticalAlign.CENTER, margins: { right: 400 } }),
    cell([
      new Paragraph({ style: "CifraChiave", children: [new TextRun("12"), new TextRun({ text: "%", size: 40 })] }),
      p("Didascalia della cifra chiave, in grassetto", "CifraDidascalia"),
    ], 3400, { borders: noBorders, verticalAlign: VerticalAlign.CENTER }),
  ] })],
});

const box = new Table({
  width: { size: TEXT_W, type: WidthType.DXA },
  columnWidths: [TEXT_W],
  layout: TableLayoutType.FIXED,
  rows: [new TableRow({ cantSplit: true, children: [cell([
    new Paragraph({ style: "BoxTitolo", children: [new TextRun({ text: " Approfondimento ", shading: { type: ShadingType.CLEAR, fill: RED, color: "auto" } })] }),
    p("Il box approfondimento ha fondo nero e testo bianco. Si usa per note di metodo, schede biografiche o focus su un tema. Il titolo sta su un’etichetta rossa.", "BoxTesto"),
  ], TEXT_W, {
    borders: noBorders,
    shading: { type: ShadingType.CLEAR, fill: BLACK, color: "auto" },
    margins: { top: 220, bottom: 220, left: 260, right: 260 },
  })] })],
});

const COLS = [2870, 1500, 1900, 1400, 1400];
const head = ["Operatore", "Sede", "Masse (€ mln)", "Var. a/a", "Quota"];
const rows = [
  ["Operatore A", "Milano", "3.420", "+14,2%", "7,0%"],
  ["Operatore B", "Roma", "2.180", "+9,8%", "4,5%"],
  ["Operatore C", "Padova", "1.640", "+18,1%", "3,4%"],
  ["Operatore D", "Bologna", "1.210", "−2,3%", "2,5%"],
];
const tcell = (text, i, header, last) => cell([
  new Paragraph({
    style: header ? "TabellaIntestazione" : "TabellaTesto",
    alignment: i >= 2 ? AlignmentType.RIGHT : AlignmentType.LEFT,
    children: [new TextRun({ text, color: !header && text.startsWith("−") ? RED : undefined })],
  }),
], COLS[i], {
  borders: { top: none, left: none, right: none, bottom: header ? { style: BorderStyle.SINGLE, size: 8, color: BLACK } : { style: BorderStyle.SINGLE, size: 4, color: last ? BLACK : RULE_SOFT } },
  margins: { top: 90, bottom: 90, left: i === 0 ? 0 : 120, right: i === COLS.length - 1 ? 0 : 120 },
});
const dataTable = new Table({
  width: { size: TEXT_W, type: WidthType.DXA },
  columnWidths: COLS,
  layout: TableLayoutType.FIXED,
  rows: [
    new TableRow({ tableHeader: true, children: head.map((t, i) => tcell(t, i, true)) }),
    ...rows.map((r, ri) => new TableRow({ children: r.map((t, i) => tcell(t, i, false, ri === rows.length - 1)) })),
  ],
});

const bullet = (text) => new Paragraph({ style: "Normal", numbering: { reference: "elenco", level: 0 }, children: [new TextRun(text)] });

const body = [
  new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Titolo di sezione")] }),
  p("Questo è il testo corrente: Libre Baskerville 11 pt, interlinea 1,4, allineato a sinistra. È l’unico font del documento: titoli, tabelle e didascalie cambiano solo dimensione, grassetto o corsivo. I testi iniziano con un paragrafo normale, senza capolettera.", "Normal"),
  p("Per scrivere, sostituisci questi paragrafi e usa gli stili dalla galleria Stili di Word: Titolo, Titolo 1, Titolo 2, Citazione, Didascalia e gli stili ADVISOR elencati in fondo.", "Normal"),
  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Domanda o sottotitolo interno, in grassetto")] }),
  p("I sottotitoli interni hanno la stessa dimensione del testo e servono anche per le domande delle interviste.", "Normal"),
  bullet("Elenco puntato con pallino rosso"),
  bullet("Un concetto per punto, frasi brevi"),
  bullet("Massimo cinque o sei punti"),
  quoteAndFigure,
  new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Dati")] }),
  p("Tabelle con intestazione in grassetto e filetto nero, righe separate da filetti grigi, nessuna griglia verticale, numeri allineati a destra. I valori negativi sono in rosso.", "Normal"),
  dataTable,
  p("Fonte: indicare la fonte e il periodo di rilevazione. Dati di esempio.", "Caption"),
  new Paragraph({ style: "Normal", spacing: { after: 120 } }),
  box,
  new Paragraph({ style: "Normal" }),
  new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Stili ADVISOR disponibili")] }),
  p("Titolo · Titolo 1 · Titolo 2 · Normale · Citazione · Citazione fonte · Cifra chiave · Cifra didascalia · Box titolo · Box testo · Didascalia · Tipo documento · Firma · Data documento · Parola chiave (carattere, rosso).", "Normal"),
];

// ---------- Intestazione e piè di pagina ----------
const header = new Header({ children: [
  new Paragraph({
    style: "Intestazione",
    tabStops: [{ type: TabStopType.RIGHT, position: TEXT_W }],
    border: { bottom: rule(BLACK, 4) },
    children: [logoRun(96), new TextRun({ text: "\tTitolo breve del documento · ottobre 2026", italics: true, color: GREY })],
  }),
] });
const footer = new Footer({ children: [
  new Paragraph({
    style: "PiePagina",
    tabStops: [{ type: TabStopType.RIGHT, position: TEXT_W }],
    border: { top: rule(BLACK, 4) },
    children: [
      new TextRun({ text: "ADVISOR", bold: true }),
      new TextRun(" Market Intelligence\tPagina "),
      new TextRun({ children: [PageNumber.CURRENT] }),
      new TextRun(" di "),
      new TextRun({ children: [PageNumber.TOTAL_PAGES] }),
    ],
  }),
] });

const pStyle = (id, name, run, para, extra = {}) => ({
  id, name, basedOn: "Normal", next: "Normal", quickFormat: true, run, paragraph: para, ...extra,
});

const doc = new Document({
  creator: "ADVISOR",
  title: "Template ADVISOR",
  description: "Template Word nello stile ADVISOR",
  fonts: [{ name: FONT, data: fs.readFileSync(`${fontDir}/LibreBaskerville-Regular.ttf`) }],
  styles: {
    default: {
      document: { run: { font: FONT, size: 22, color: BLACK }, paragraph: { spacing: { line: 336, lineRule: LineRuleType.AUTO, after: 140 } } },
    },
    paragraphStyles: [
      pStyle("Title", "Title", { font: FONT, size: 56, color: BLACK }, { spacing: { line: 264, lineRule: LineRuleType.AUTO, after: 360 } }),
      pStyle("Heading1", "Heading 1", { font: FONT, size: 32, bold: true, color: BLACK }, { spacing: { before: 360, after: 140, line: 288, lineRule: LineRuleType.AUTO }, keepNext: true, outlineLevel: 0 }),
      pStyle("Heading2", "Heading 2", { font: FONT, size: 22, bold: true, color: BLACK }, { spacing: { before: 220, after: 60, line: 300, lineRule: LineRuleType.AUTO }, keepNext: true, outlineLevel: 1 }),
      pStyle("Citazione", "Citazione", { italics: true, size: 30 }, { spacing: { line: 360, lineRule: LineRuleType.AUTO, after: 120 } }),
      pStyle("CitazioneFonte", "Citazione fonte", { italics: true, size: 18, color: GREY }, { spacing: { after: 0 } }),
      pStyle("CifraChiave", "Cifra chiave", { size: 120 }, { alignment: AlignmentType.CENTER, spacing: { line: 240, lineRule: LineRuleType.AUTO, after: 80 } }),
      pStyle("CifraDidascalia", "Cifra didascalia", { bold: true, size: 20 }, { alignment: AlignmentType.CENTER, spacing: { line: 288, lineRule: LineRuleType.AUTO, after: 0 } }),
      pStyle("BoxTitolo", "Box titolo", { bold: true, size: 24, color: WHITE }, { spacing: { after: 140 } }),
      pStyle("BoxTesto", "Box testo", { size: 20, color: WHITE }, { spacing: { after: 0 } }),
      pStyle("Caption", "Caption", { italics: true, size: 18, color: GREY }, { spacing: { before: 80, after: 140 } }),
      pStyle("TipoDocumento", "Tipo documento", { italics: true, size: 24, color: GREY }, { spacing: { after: 200 } }),
      pStyle("Firma", "Firma", { italics: true, size: 22 }, { alignment: AlignmentType.RIGHT, border: { top: rule(BLACK, 4) }, spacing: { before: 120, after: 80 } }),
      pStyle("DataDocumento", "Data documento", { italics: true, size: 20, color: GREY }, { alignment: AlignmentType.RIGHT }),
      pStyle("TabellaIntestazione", "Tabella intestazione", { bold: true, size: 19 }, { spacing: { after: 0, line: 276, lineRule: LineRuleType.AUTO }, keepNext: true }),
      pStyle("TabellaTesto", "Tabella testo", { size: 19 }, { spacing: { after: 0, line: 276, lineRule: LineRuleType.AUTO }, keepNext: true }),
      pStyle("Intestazione", "Intestazione ADVISOR", { size: 17 }, { spacing: { after: 0 } }),
      pStyle("PiePagina", "Piè di pagina ADVISOR", { size: 17 }, { spacing: { before: 0, after: 0 } }),
    ],
    characterStyles: [
      { id: "ParolaChiave", name: "Parola chiave", basedOn: "DefaultParagraphFont", quickFormat: true, run: { color: RED } },
    ],
  },
  numbering: { config: [{
    reference: "elenco",
    levels: [{
      level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 400, hanging: 300 } }, run: { color: RED, size: 22 } },
    }],
  }] },
  sections: [{
    properties: {
      titlePage: true,
      page: { size: { width: PAGE_W, height: PAGE_H }, margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN, header: 700, footer: 700 } },
    },
    headers: { default: header, first: new Header({ children: [new Paragraph("")] }) },
    footers: { default: footer, first: new Footer({ children: [new Paragraph("")] }) },
    children: [...cover, ...body],
  }],
});

Packer.toBuffer(doc).then((buf) => { fs.writeFileSync(outPath, buf); console.log("scritto", outPath); });
