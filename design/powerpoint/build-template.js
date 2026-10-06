// Genera il modello PowerPoint ADVISOR (stile in CLAUDE.md).
// Richiede pptxgenjs (npm install pptxgenjs) e lo script apply_theme.js della skill pptx.
// Uso: node design/powerpoint/build-template.js design/word/advisor-logo-white.png /tmp/raw.pptx <skill-pptx>/scripts/apply_theme.js
//      python3 design/powerpoint/finalize.py /tmp/raw.pptx "design/powerpoint/Template ADVISOR.pptx" "design/powerpoint/Template ADVISOR.potx"
const fs = require("fs");
const pptxgen = require("pptxgenjs");

const [logoWhitePath, outPath, applyThemePath] = process.argv.slice(2);
const { applyTheme } = require(applyThemePath);

const FONT = "Libre Baskerville";
const THEME = {
  name: "ADVISOR",
  headFontFace: FONT,
  bodyFontFace: FONT,
  colors: {
    dk1: "101010", lt1: "FFFFFF", dk2: "282C34", lt2: "D8D8D8",
    accent1: "BA0100", accent2: "E53446", accent3: "505864",
    accent4: "80889C", accent5: "C8303F", accent6: "A2A3A3",
    hlink: "E53446", folHlink: "707172",
  },
};
const HEX = { bg: "101010", red: "BA0100", advisorRed: "E53446", white: "FFFFFF", grey: "9A9A9A", logoGrey: "707172", banner: "D8D8D8" };
const CHART = ["282C34", "505864", "80889C", "C8303F", "A2A3A3", "D8D8D8"];

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13,33 × 7,5 in, come la presentazione corporate
pres.theme = { headFontFace: FONT, bodyFontFace: FONT };
pres.title = "Template ADVISOR";
pres.author = "ADVISOR";
pres.company = "ADVISOR";
const C = pres.SchemeColor;
const S = pres.ShapeType;

const logoWhite = "image/png;base64," + fs.readFileSync(logoWhitePath).toString("base64");
const LOGO_RATIO = 193 / 1132;
const W = 13.333, H = 7.5;

// Elementi fissi di ogni layout: barra rossa a sinistra, mezzo anello all'altezza del titolo, logo, numero pagina.
const frame = (ringY = 0.42) => [
  { rect: { x: 0, y: 0, w: 0.12, h: H, fill: { color: C.accent1 }, line: { type: "none" } } },
  { image: { x: W - 0.4 - 1.55, y: 0.38, w: 1.55, h: 1.55 * LOGO_RATIO, data: logoWhite, altText: "ADVISOR" } },
];
// Il mezzo anello è un "donut" centrato sul bordo sinistro: metà resta fuori dalla slide.
const ring = (y) => ({ x: -0.45, y, w: 0.9, h: 0.9 });

const titleOpts = (y, size = 36) => ({
  options: { name: "title", type: "title", x: 0.85, y, w: 9.6, h: 0.8, fontFace: FONT, fontSize: size, color: C.background1, align: "left", valign: "bottom", margin: 0 },
  text: "Titolo della slide",
});
const subOpts = (y) => ({
  options: { name: "sottotitolo", type: "body", x: 0.85, y, w: 9.6, h: 0.5, fontFace: FONT, fontSize: 20, color: C.background1, align: "left", valign: "top", margin: 0 },
  text: "Sottotitolo",
});
const slideNum = { x: W - 0.4 - 0.6, y: H - 0.5, w: 0.6, h: 0.3, fontFace: FONT, fontSize: 10, color: HEX.grey, align: "right" };

const master = (title, objects, extra = {}) => pres.defineSlideMaster({
  title, background: { color: C.text1 }, objects, slideNumber: slideNum, ...extra,
});

master("ADVISOR Copertina", [
  { rect: { x: 0, y: 0, w: 0.12, h: H, fill: { color: C.accent1 }, line: { type: "none" } } },
  { image: { x: 0.85, y: 0.9, w: 3.2, h: 3.2 * LOGO_RATIO, data: logoWhite, altText: "ADVISOR" } },
  { placeholder: { options: { name: "title", type: "title", x: 0.85, y: 2.7, w: 10.5, h: 1.8, fontFace: FONT, fontSize: 44, color: C.background1, align: "left", valign: "bottom", margin: 0 }, text: "Titolo della presentazione" } },
  { placeholder: { options: { name: "sottotitolo", type: "body", x: 0.85, y: 4.65, w: 10.5, h: 0.6, fontFace: FONT, fontSize: 22, color: C.background1, align: "left", valign: "top", margin: 0 }, text: "Sottotitolo della presentazione" } },
  { placeholder: { options: { name: "data", type: "body", x: 0.85, y: 6.3, w: 6, h: 0.4, fontFace: FONT, fontSize: 14, italic: true, color: HEX.grey, margin: 0 }, text: "Mese anno" } },
], { slideNumber: undefined });

master("ADVISOR Sezione", [
  { rect: { x: 0, y: 0, w: 0.12, h: H, fill: { color: C.accent1 }, line: { type: "none" } } },
  { image: { x: W - 0.4 - 1.55, y: 0.38, w: 1.55, h: 1.55 * LOGO_RATIO, data: logoWhite, altText: "ADVISOR" } },
  { placeholder: { options: { name: "numero", type: "body", x: 0.85, y: 2.1, w: 4, h: 1.2, fontFace: FONT, fontSize: 72, bold: true, color: C.accent1, valign: "bottom", margin: 0 }, text: "01" } },
  { placeholder: { options: { name: "title", type: "title", x: 0.85, y: 3.4, w: 10.5, h: 1.2, fontFace: FONT, fontSize: 40, color: C.background1, align: "left", valign: "top", margin: 0 }, text: "Titolo del capitolo" } },
  { placeholder: { options: { name: "sottotitolo", type: "body", x: 0.85, y: 4.6, w: 10.5, h: 0.6, fontFace: FONT, fontSize: 20, color: C.background1, align: "left", valign: "top", margin: 0 }, text: "Descrizione breve del capitolo" } },
]);

const withRing = (objs) => [...frame(), ...objs];

master("ADVISOR Titolo e testo", withRing([
  { placeholder: titleOpts(0.3) },
  { placeholder: subOpts(1.12) },
  { placeholder: { options: { name: "body", type: "body", x: 0.85, y: 2.0, w: 11.6, h: 4.7, fontFace: FONT, fontSize: 16, color: C.background1, align: "left", valign: "top", margin: 0, paraSpaceAfter: 8 }, text: "Testo" } },
]));

master("ADVISOR Testo e immagine", withRing([
  { placeholder: titleOpts(0.3) },
  { placeholder: subOpts(1.12) },
  { placeholder: { options: { name: "body", type: "body", x: 0.85, y: 2.0, w: 5.9, h: 4.7, fontFace: FONT, fontSize: 16, color: C.background1, align: "left", valign: "top", margin: 0, paraSpaceAfter: 8 }, text: "Testo" } },
  { placeholder: { options: { name: "immagine", type: "pic", x: 7.2, y: 1.2, w: 5.35, h: 5.5, color: C.background1, fontFace: FONT, fontSize: 14, rectRadius: 0.2 }, text: "Inserisci una foto in bianco e nero" } },
]));

master("ADVISOR Solo titolo", withRing([
  { placeholder: titleOpts(0.3) },
  { placeholder: subOpts(1.12) },
]));

master("ADVISOR Chiusura", [
  { rect: { x: 0, y: 0, w: 0.12, h: H, fill: { color: C.accent1 }, line: { type: "none" } } },
  { image: { x: (W - 4) / 2, y: 2.6, w: 4, h: 4 * LOGO_RATIO, data: logoWhite, altText: "ADVISOR" } },
  { placeholder: { options: { name: "body", type: "body", x: 2.2, y: 3.75, w: W - 4.4, h: 1.2, fontFace: FONT, fontSize: 16, color: C.background1, align: "center", valign: "top", margin: 0 }, text: "Contatti" } },
], { slideNumber: undefined });

// ---------- elementi riutilizzabili sulle slide ----------
const addRing = (slide, y = 0.32) => slide.addShape(S.donut, { ...ring(y), fill: { color: C.accent1 }, line: { type: "none" }, objectName: "Mezzo anello" });

// Intestazione di blocco: testo grassetto con filetto rosso spesso sotto.
const blockHead = (slide, text, x, y, w) => {
  slide.addText(text, { x: x + 0.15, y, w: w - 0.15, h: 0.42, fontSize: 18, bold: true, color: C.background1, margin: 0, valign: "bottom", isTextBox: true, objectName: `Blocco ${text}` });
  slide.addShape(S.rect, { x, y: y + 0.48, w, h: 0.05, fill: { color: C.accent1 }, line: { type: "none" }, objectName: "Filetto blocco" });
};

// Barra etichetta rossa con angoli destri arrotondati (rettangolo arrotondato + rettangolo che copre il lato sinistro).
const tagBar = (slide, text, x, y, w, h = 0.5) => {
  slide.addShape(S.roundRect, { x, y, w, h, rectRadius: 0.08, fill: { color: C.accent1 }, line: { type: "none" }, objectName: "Barra etichetta" });
  slide.addShape(S.rect, { x, y, w: w - 0.2, h, fill: { color: C.accent1 }, line: { type: "none" }, objectName: "Barra etichetta" });
  slide.addText(text.toUpperCase(), { x: x + 0.18, y, w: w - 0.3, h, fontSize: 15, bold: true, color: C.background1, margin: 0, valign: "middle", isTextBox: true });
};

// Callout: riquadro bianco con angolo in basso a destra arrotondato e triangolo rosso in alto a sinistra.
const callout = (slide, text, x, y, w, h) => {
  slide.addShape(S.roundRect, { x, y, w, h, rectRadius: 0.12, fill: { color: C.background1 }, line: { type: "none" }, objectName: "Callout" });
  slide.addShape(S.rect, { x, y, w: w - 0.2, h, fill: { color: C.background1 }, line: { type: "none" }, objectName: "Callout" });
  slide.addShape(S.rect, { x, y, w, h: h - 0.2, fill: { color: C.background1 }, line: { type: "none" }, objectName: "Callout" });
  slide.addShape(S.triangle, { x: x - 0.14, y: y - 0.16, w: 0.36, h: 0.3, rotate: 90, fill: { color: C.accent1 }, line: { type: "none" }, objectName: "Triangolo callout" });
  slide.addText(text, { x: x + 0.2, y, w: w - 0.4, h, fontSize: 15, bold: true, color: C.accent1, align: "center", valign: "middle", margin: 0, isTextBox: true });
};

const bullets = (items, size = 16) => items.map((t, i) => ({ text: t, options: { bullet: { indent: 22 }, breakLine: i < items.length - 1 } }));

// ---------- slide di esempio ----------
pres.addSection({ title: "Apertura" });
let s = pres.addSlide({ masterName: "ADVISOR Copertina", sectionTitle: "Apertura" });
addRing(s, 2.95);
s.addText([{ text: "Titolo della presentazione con la " }, { text: "parola chiave", options: { color: HEX.advisorRed } }], { placeholder: "title" });
s.addText("Sottotitolo: per chi è e a cosa serve", { placeholder: "sottotitolo" });
s.addText("Ottobre 2026", { placeholder: "data" });
s.addNotes("Copertina: titolo, sottotitolo e data. La parola chiave del titolo può andare in rosso ADVISOR.");

s = pres.addSlide({ masterName: "ADVISOR Testo e immagine", sectionTitle: "Apertura" });
addRing(s);
s.addText("Market Intelligence", { placeholder: "title" });
s.addText("Dati e analisi per la consulenza", { placeholder: "sottotitolo" });
s.addText([
  { text: "Produciamo " }, { text: "report, osservatori e classifiche", options: { bold: true } },
  { text: " rivolti a top manager, private banker e professionisti del mondo finanziario." },
], { x: 0.85, y: 1.85, w: 5.9, h: 0.9, fontSize: 16, color: C.background1, margin: 0, valign: "top", isTextBox: true });
blockHead(s, "I nostri osservatori", 0.85, 2.75, 5.9);
tagBar(s, "Osservatorio fee-only", 0.85, 3.43, 4.3);
s.addText([{ text: "4", options: { fontSize: 36, bold: true } }, { text: "ª", options: { fontSize: 20, bold: true, superscript: false } }, { text: " Edizione", options: { fontSize: 12 } }],
  { x: 5.25, y: 3.33, w: 1.6, h: 0.7, color: C.background1, margin: 0, valign: "middle", isTextBox: true });
tagBar(s, "Classifica reti", 0.85, 4.05, 4.3);
s.addText([{ text: "2", options: { fontSize: 36, bold: true } }, { text: "ª", options: { fontSize: 20, bold: true } }, { text: " Edizione", options: { fontSize: 12 } }],
  { x: 5.25, y: 3.95, w: 1.6, h: 0.7, color: C.background1, margin: 0, valign: "middle", isTextBox: true });
blockHead(s, "Key points", 0.85, 4.75, 5.9);
s.addText(bullets(["Dati trimestrali", "~1.900 consulenti censiti", "Ca. 40 reti monitorate"]),
  { x: 1.05, y: 5.4, w: 5.5, h: 0.95, fontSize: 15, color: C.background1, margin: 0, valign: "top", paraSpaceAfter: 2, isTextBox: true });
callout(s, "Le analisi di riferimento per chi guida la consulenza", 1.05, 6.42, 5.6, 0.62);
s.addNotes("Testo a sinistra con blocchi, barre etichetta, elenco e callout; a destra il segnaposto per una foto in bianco e nero.");

pres.addSection({ title: "Capitolo 1" });
s = pres.addSlide({ masterName: "ADVISOR Sezione", sectionTitle: "Capitolo 1" });
addRing(s, 3.55);
s.addText("01", { placeholder: "numero" });
s.addText("Il mercato della consulenza", { placeholder: "title" });
s.addText("Masse, clienti e operatori nel 2026", { placeholder: "sottotitolo" });

s = pres.addSlide({ masterName: "ADVISOR Titolo e testo", sectionTitle: "Capitolo 1" });
addRing(s);
s.addText("Un mercato in crescita", { placeholder: "title" });
s.addText("I fattori principali (dati di esempio)", { placeholder: "sottotitolo" });
s.addText(bullets([
  "Le masse seguite dai consulenti indipendenti crescono a doppia cifra",
  "I clienti lasciano le reti bancarie dopo il passaggio generazionale",
  "I professionisti escono dalle reti per aprire uno studio proprio",
  "La parcella media scende di pochi punti base",
]), { placeholder: "body" });

s = pres.addSlide({ masterName: "ADVISOR Solo titolo", sectionTitle: "Capitolo 1" });
addRing(s);
s.addText("Tre numeri chiave", { placeholder: "title" });
s.addText("Consulenza fee-only in Italia, 2026 (dati di esempio)", { placeholder: "sottotitolo" });
[["48,6", " mld €", "Masse in consulenza fee-only"], ["1.912", "", "Consulenti iscritti all’albo OCF, sezione autonomi"], ["0,62", "%", "Parcella media sul patrimonio"]].forEach(([n, u, cap], i) => {
  const x = 0.85 + i * 3.95;
  s.addShape(S.rect, { x, y: 2.4, w: 3.6, h: 0.05, fill: { color: C.accent1 }, line: { type: "none" }, objectName: "Filetto cifra" });
  s.addText([{ text: n, options: { fontSize: 60, bold: true } }, { text: u, options: { fontSize: 24 } }], { x, y: 2.6, w: 3.6, h: 1.3, color: C.background1, margin: 0, valign: "middle", isTextBox: true, objectName: `Cifra ${i + 1}` });
  s.addText(cap, { x, y: 4.0, w: 3.4, h: 0.9, fontSize: 16, color: C.background1, margin: 0, valign: "top", isTextBox: true });
});

s = pres.addSlide({ masterName: "ADVISOR Solo titolo", sectionTitle: "Capitolo 1" });
addRing(s);
s.addText("Clienti per fascia di patrimonio", { placeholder: "title" });
s.addText("Clienti seguiti dai consulenti fee-only (dati di esempio)", { placeholder: "sottotitolo" });
const labels = ["Oltre 1 mln €", "500k – 1 mln €", "250 – 500k €", "100 – 250k €", "Sotto 100k €"];
const vals = [45, 28, 15, 8, 4];
s.addChart(pres.ChartType.doughnut, [{ name: "Clienti", labels, values: vals }], {
  x: 0.85, y: 2.0, w: 5.2, h: 5.0, holeSize: 45, chartColors: CHART.slice(0, 5),
  showLegend: false, showValue: false, showPercent: false, showTitle: false, dataBorder: { pt: 0, color: HEX.bg },
  objectName: "Grafico ciambella",
});
// Banner a freccia grigio chiaro
s.addShape(S.homePlate, { x: 6.7, y: 2.3, w: 5.6, h: 0.9, fill: { color: C.background2 }, line: { type: "none" }, objectName: "Banner freccia" });
s.addText("Clientela concentrata sui patrimoni elevati", { x: 6.95, y: 2.3, w: 4.6, h: 0.9, fontSize: 17, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
labels.forEach((l, i) => {
  const y = 3.6 + i * 0.6;
  s.addShape(S.rect, { x: 6.95, y: y + 0.08, w: 0.28, h: 0.28, fill: { color: CHART[i] }, line: { type: "none" }, objectName: `Legenda ${i + 1}` });
  s.addText(`${l} (${vals[i]}%)`, { x: 7.45, y, w: 4.6, h: 0.44, fontSize: 16, color: C.background1, margin: 0, valign: "middle", isTextBox: true });
});

s = pres.addSlide({ masterName: "ADVISOR Solo titolo", sectionTitle: "Capitolo 1" });
addRing(s);
s.addText("Primi cinque operatori per masse", { placeholder: "title" });
s.addText("Operatori e valori di esempio", { placeholder: "sottotitolo" });
const hdr = (t, right) => ({ text: t, options: { bold: true, align: right ? "right" : "left", border: [{ type: "none" }, { type: "none" }, { pt: 1.5, color: HEX.white }, { type: "none" }] } });
const cellOpt = (right, color) => ({ align: right ? "right" : "left", color, border: [{ type: "none" }, { type: "none" }, { pt: 0.75, color: "505864" }, { type: "none" }] });
const rows = [
  ["Operatore A", "Milano", "3.420", "+14,2%", "7,0%"],
  ["Operatore B", "Roma", "2.180", "+9,8%", "4,5%"],
  ["Operatore C", "Padova", "1.640", "+18,1%", "3,4%"],
  ["Operatore D", "Bologna", "1.210", "−2,3%", "2,5%"],
  ["Operatore E", "Torino", "980", "+6,5%", "2,0%"],
];
s.addTable([
  ["Operatore", "Sede", "Masse (€ mln)", "Var. a/a", "Quota"].map((t, i) => hdr(t, i >= 2)),
  ...rows.map((r) => r.map((t, i) => ({ text: t, options: cellOpt(i >= 2, t.startsWith("−") ? HEX.advisorRed : HEX.white) }))),
], { x: 0.85, y: 2.1, w: 11.6, colW: [3.8, 2.2, 2.2, 1.7, 1.7], fontSize: 16, color: C.background1, fill: { color: HEX.bg }, rowH: 0.55, margin: [0.05, 0.1, 0.05, 0], valign: "middle", objectName: "Tabella" });
s.addText("Fonte: indicare la fonte e il periodo di rilevazione.", { x: 0.85, y: 5.6, w: 8, h: 0.35, fontSize: 11, italic: true, color: HEX.grey, margin: 0, isTextBox: true });

pres.addSection({ title: "Chiusura" });
s = pres.addSlide({ masterName: "ADVISOR Chiusura", sectionTitle: "Chiusura" });
s.addText([{ text: "Grazie", options: { fontSize: 28, breakLine: true } }, { text: "nome.cognome@advisor.it · www.advisoronline.it", options: { fontSize: 16, color: HEX.grey } }], { placeholder: "body" });

pres.writeFile({ fileName: outPath }).then(async () => {
  await applyTheme(outPath, THEME);
  console.log("scritto", outPath);
});
