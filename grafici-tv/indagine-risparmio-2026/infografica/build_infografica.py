"""Infografica ADVISOR (2 pagine, 225x285 mm) dall'Indagine sul Risparmio 2026.

Genera infografica.html e, con Chromium, infografica.pdf + anteprime PNG.
Uso: python3 build_infografica.py [percorso_chrome]
"""
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
CHROME = sys.argv[1] if len(sys.argv) > 1 else "/opt/pw-browsers/chromium"

NAVY = "#041C37"
RED = "#E53446"
TAUPE = "#AFA599"
TRACK = "#C6C7C8"
ROW = "#D9DADB"

# Testi editabili --------------------------------------------------------
MESE = "ottobre 2026"
PAG_SX, PAG_DX = "30", "31"
FIRMA = "Nome Cognome"  # segnaposto: sostituire con l'autore
FONTE = "Fonte: Centro Einaudi, Indagine sul Risparmio e sulle scelte finanziarie degli italiani 2026"


def num(v, dec=1):
    return f"{v:.{dec}f}".replace(".", ",")


# --- icone (stile pittogramma pieno, come nel riferimento) --------------
def icon_star(size=22):
    return f'''<svg width="{size}mm" height="{size}mm" viewBox="0 0 100 100">
      <path d="M50 0 C53 38 62 47 100 50 C62 53 53 62 50 100 C47 62 38 53 0 50 C38 47 47 38 50 0Z" fill="{TAUPE}"/></svg>'''


def icon_person(size=20):
    return f'''<svg width="{size}mm" height="{size}mm" viewBox="0 0 100 100">
      <circle cx="40" cy="26" r="20" fill="{TAUPE}"/>
      <path d="M2 92 C2 64 18 52 40 52 C55 52 66 57 72 66 L60 92Z" fill="{TAUPE}"/>
      <path d="M78 52 l7 14 15 2 -11 10 3 15 -14 -7 -14 7 3 -15 -11 -10 15 -2z" fill="{TAUPE}"/></svg>'''


def icon_trend(size=20):
    return f'''<svg width="{size}mm" height="{size}mm" viewBox="0 0 100 100">
      <polyline points="6,86 34,52 52,68 88,22" fill="none" stroke="{TAUPE}" stroke-width="10"
        stroke-linecap="round" stroke-linejoin="round"/>
      <polyline points="60,18 92,16 90,48" fill="none" stroke="{TAUPE}" stroke-width="10"
        stroke-linecap="round" stroke-linejoin="round"/></svg>'''


def icon_bars(size=20):
    return f'''<svg width="{size}mm" height="{size}mm" viewBox="0 0 100 100">
      <rect x="8" y="56" width="18" height="36" fill="{TAUPE}"/>
      <rect x="34" y="36" width="18" height="56" fill="{TAUPE}"/>
      <rect x="60" y="14" width="18" height="78" fill="{TAUPE}"/>
      <rect x="4" y="92" width="92" height="6" fill="{TAUPE}"/></svg>'''


def pict(kind, color=NAVY):
    """Pittogrammi pieni per l'elenco 'chi ha operato in azioni'."""
    if kind == "people":
        return f'''<svg viewBox="0 0 100 70" width="15mm" height="10.5mm">
          <circle cx="30" cy="16" r="14" fill="{color}"/><circle cx="70" cy="16" r="14" fill="{color}"/>
          <path d="M2 66 C2 44 14 34 30 34 C46 34 58 44 58 66Z" fill="{color}"/>
          <path d="M50 66 C52 46 60 34 70 34 C86 34 98 44 98 66Z" fill="{color}"/></svg>'''
    if kind == "up":
        return f'''<svg viewBox="0 0 100 100" width="12mm" height="12mm">
          <rect x="6" y="62" width="16" height="32" fill="{color}"/><rect x="30" y="48" width="16" height="46" fill="{color}"/>
          <rect x="54" y="56" width="16" height="38" fill="{color}"/>
          <polyline points="6,48 32,24 54,38 88,8" fill="none" stroke="{color}" stroke-width="9"/>
          <polygon points="70,4 96,0 92,26" fill="{color}"/></svg>'''
    if kind == "down":
        return f'''<svg viewBox="0 0 100 100" width="12mm" height="12mm">
          <polyline points="6,10 36,46 56,32 86,76" fill="none" stroke="{color}" stroke-width="10"/>
          <polygon points="94,92 66,88 92,62" fill="{color}"/>
          <rect x="4" y="92" width="92" height="6" fill="{color}"/></svg>'''
    if kind == "peak":
        return f'''<svg viewBox="0 0 100 100" width="12mm" height="12mm">
          <polygon points="4,92 36,30 52,56 70,14 96,92" fill="{color}"/>
          <circle cx="70" cy="14" r="9" fill="#FFFFFF" stroke="{color}" stroke-width="6"/></svg>'''
    # target
    return f'''<svg viewBox="0 0 100 100" width="12mm" height="12mm">
      <circle cx="50" cy="50" r="44" fill="none" stroke="{color}" stroke-width="10"/>
      <circle cx="50" cy="50" r="24" fill="none" stroke="{color}" stroke-width="10"/>
      <circle cx="50" cy="50" r="8" fill="{color}"/></svg>'''


# --- grafico 1: rendimenti 2025 per asset class (barre orizzontali) -----
def chart_rendimenti():
    data = [("Oro (in euro)", 45.7, 12.3), ("Azioni Eurozona", 22.4, 5.8),
            ("Azioni mondiali in euro", 16.5, 6.3), ("Portafoglio diversificato", 11.4, 2.1),
            ("Bond emergenti in euro", 11.1, 0.7), ("Titoli di Stato lunghi", 4.3, -1.0),
            ("Bond societari in euro", 3.5, 0.5), ("Titoli di Stato medi", 2.6, -0.1),
            ("Titoli di Stato brevi", 2.1, 0.5)]
    w, rowh = 104, 7.6
    lab_w, bar_x0, bar_max = 39, 40, 37
    h = 8 + rowh * len(data)
    out = [f'<svg width="{w}mm" height="{h}mm" viewBox="0 0 {w} {h}">']
    out.append(f'<text x="{bar_x0}" y="4" class="cap">2025</text>')
    out.append(f'<text x="{w}" y="4" class="cap" text-anchor="end">2026*</text>')
    for i, (name, v, ytd) in enumerate(data):
        y = 8 + i * rowh
        col = RED if i == 0 else NAVY
        bw = v / 45.7 * bar_max
        out.append(f'<text x="0" y="{y + 3.9}" class="lab">{name}</text>')
        out.append(f'<rect x="{bar_x0}" y="{y + 0.6}" width="{bw:.2f}" height="4.8" fill="{col}"/>')
        out.append(f'<text x="{bar_x0 + bw + 1.4:.2f}" y="{y + 4.9}" class="val" fill="{col}">'
                   f'+{num(v)}%</text>')
        ytd_s = ("+" if ytd > 0 else "−") + num(abs(ytd))
        out.append(f'<text x="{w}" y="{y + 4.4}" class="ytd" text-anchor="end">{ytd_s}</text>')
        if i < len(data) - 1:
            out.append(f'<line x1="0" x2="{w}" y1="{y + rowh - 0.4}" y2="{y + rowh - 0.4}" '
                       f'stroke="{TRACK}" stroke-width="0.25" stroke-dasharray="0.6 0.6"/>')
    out.append("</svg>")
    return "\n".join(out)


# --- grafico 2: ciambella peso delle obbligazioni ------------------------
def donut(pct=27, r=17, sw=8):
    import math
    c = 2 * math.pi * r
    size = 2 * (r + sw / 2) + 1
    cx = size / 2
    return f'''<svg width="{size}mm" height="{size}mm" viewBox="0 0 {size} {size}">
      <circle cx="{cx}" cy="{cx}" r="{r}" fill="none" stroke="{NAVY}" stroke-width="{sw}"/>
      <circle cx="{cx}" cy="{cx}" r="{r}" fill="none" stroke="{RED}" stroke-width="{sw}"
        stroke-dasharray="{c * pct / 100:.3f} {c:.3f}" transform="rotate(-90 {cx} {cx})"/>
      <text x="{cx}" y="{cx + 1.6}" text-anchor="middle" class="donut-c">2026</text></svg>'''


# --- grafico 3: soddisfazione e Borsa 2011-2026 (pannello blu) ----------
def chart_borsa():
    yrs = list(range(2011, 2027))
    ratio = [1.3, 2.0, 1.5, 1.8, 2.8, 2.0, 2.6, 5.6, 2.6, 2.4, 5.1, 6.5, 3.3, 10.5, 7.8, 8.5]
    rend = [10, -9, 14, 20, 2, -4, 6, 10, -14, 29, -4, 23, -13, 28, 14, 38]
    w, x0, x1 = 96, 2, 94
    step = (x1 - x0) / (len(yrs) - 1)
    xs = [x0 + i * step for i in range(len(yrs))]
    # pannello alto: rapporto (0-12) tra y=10 e y=52
    ty0, ty1 = 52, 12

    def yr(v):
        return ty0 - (ty0 - ty1) * v / 12

    # pannello basso: rendimento (-20..40) tra y=66 e y=110
    zero = 66 + 44 * 40 / 60
    k = 44 / 60

    out = [f'<svg width="{w}mm" height="120mm" viewBox="0 0 {w} 120">']
    out.append('<text x="0" y="5" class="pan-h">SODDISFATTI PER OGNI INSODDISFATTO</text>')
    pts = " ".join(f"{x:.2f},{yr(v):.2f}" for x, v in zip(xs, ratio))
    out.append(f'<line x1="0" x2="{w}" y1="{ty0}" y2="{ty0}" stroke="#2B3F5C" stroke-width="0.3"/>')
    out.append(f'<polyline points="{pts}" fill="none" stroke="#FFFFFF" stroke-width="0.9" '
               f'stroke-linejoin="round"/>')
    show = {2011: -1, 2016: -1, 2018: 1, 2022: 1, 2023: -1, 2024: 1, 2026: 1}
    for x, v, y in zip(xs, ratio, yrs):
        out.append(f'<circle cx="{x:.2f}" cy="{yr(v):.2f}" r="0.9" fill="#FFFFFF" '
                   f'stroke="{NAVY}" stroke-width="0.4"/>')
        if y in show:
            dy = -2.6 if show[y] > 0 else 5.2
            col = RED if y == 2024 else "#FFFFFF"
            anc = "end" if y == 2026 else "middle"
            out.append(f'<text x="{x + (1.2 if y == 2026 else 0):.2f}" y="{yr(v) + dy:.2f}" text-anchor="{anc}" '
                       f'class="pan-v" fill="{col}">{num(v)}</text>')
    out.append('<text x="0" y="62" class="pan-h">BORSA ITALIANA: RENDIMENTO % DELL’ANNO PRECEDENTE</text>')
    for x, v in zip(xs, rend):
        hgt = abs(v) * k
        y = zero - hgt if v >= 0 else zero
        col = TAUPE if v >= 0 else RED
        out.append(f'<rect x="{x - 2.1:.2f}" y="{y:.2f}" width="4.2" height="{hgt:.2f}" fill="{col}"/>')
        ty = y - 1.2 if v >= 0 else y + hgt + 3.2
        s = ("+" if v > 0 else "−") + str(abs(v))
        out.append(f'<text x="{x:.2f}" y="{ty:.2f}" text-anchor="middle" class="pan-b">{s}</text>')
    out.append(f'<line x1="0" x2="{w}" y1="{zero:.2f}" y2="{zero:.2f}" stroke="#FFFFFF" '
               f'stroke-width="0.3"/>')
    for x, y in zip(xs, yrs):
        out.append(f'<text x="{x:.2f}" y="118" text-anchor="middle" class="pan-y">'
                   f'’{str(y)[2:]}</text>')
    out.append("</svg>")
    return "\n".join(out)


# --- elenco con cerchi (come "percezione dell'AI") ----------------------
def gestito_list():
    items = [(18.7, "Fondi comuni e SICAV"), (9.9, "Gestioni patrimoniali"),
             (7.8, "Azioni (hanno operato direttamente)"), (5.3, "Unit linked"), (3.5, "ETF")]
    rows = []
    for v, lab in items:
        pct = min(v / 20 * 100, 100)
        rows.append(f'''<div class="li">
          <div class="circ">{num(v)}%</div>
          <div class="li-body"><div class="li-lab">{lab}</div>
            <div class="track"><div class="fill" style="width:{pct:.1f}%"></div></div></div>
        </div>''')
    return "\n".join(rows)


def azioni_list():
    rows = [("people", "4,6%", "Ha operato in azioni negli ultimi 12 mesi (2025)", True),
            ("peak", "12,5%", "Negli ultimi 5 anni: il massimo, nel 2011", False),
            ("down", "5,3%", "Il minimo, nel 2016", False),
            ("up", "10,7%", "Il picco recente, nel 2023", False),
            ("target", "7,8%", "Il dato 2026 (ultimi 5 anni)", False)]
    out = []
    for kind, v, lab, hl in rows:
        col = RED if hl else NAVY
        out.append(f'''<div class="az{' hl' if hl else ''}">
          <div class="az-ic">{pict(kind, col)}</div>
          <div class="az-v" style="color:{col}">{v}</div>
          <div class="az-l">{lab}</div></div>''')
    return "\n".join(out)


CSS = f"""
@font-face {{ font-family: 'Druk'; src: url('fonts/anton-latin-400-normal.woff2') format('woff2'); }}
@font-face {{ font-family: 'Druk'; src: url('fonts/anton-latin-ext-400-normal.woff2') format('woff2');
  unicode-range: U+0100-024F; }}
@font-face {{ font-family: 'Inter'; font-weight: 300; src: url('fonts/inter-latin-300-normal.woff2'); }}
@font-face {{ font-family: 'Inter'; font-weight: 400; src: url('fonts/inter-latin-400-normal.woff2'); }}
@font-face {{ font-family: 'Inter'; font-weight: 500; src: url('fonts/inter-latin-500-normal.woff2'); }}
@font-face {{ font-family: 'Inter'; font-weight: 600; src: url('fonts/inter-latin-600-normal.woff2'); }}
@font-face {{ font-family: 'Inter'; font-weight: 700; src: url('fonts/inter-latin-700-normal.woff2'); }}
@font-face {{ font-family: 'Bask'; font-style: italic; src: url('fonts/LibreBaskerville-Italic.ttf'); }}
@page {{ size: 225mm 285mm; margin: 0; }}
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
html, body {{ background: #FFFFFF; color: #000; font-family: 'Inter', sans-serif; }}
.page {{ width: 225mm; height: 285mm; position: relative; overflow: hidden; background: #FFF;
  page-break-after: always; }}
.abs {{ position: absolute; }}
/* testatina verticale */
.rule {{ position: absolute; top: 15mm; bottom: 15.5mm; width: 0; border-left: 0.3mm solid #000; }}
.vert {{ position: absolute; white-space: nowrap; transform-origin: left top; font-size: 11.5pt; }}
.rubrica {{ font-weight: 600; font-size: 13pt; }}
.pnum {{ position: absolute; font-weight: 700; font-size: 12pt; }}
/* titoli */
.title {{ font-family: 'Druk'; text-transform: uppercase; font-size: 17.5mm; line-height: 1.06;
  letter-spacing: -0.1mm; color: #000; }}
.title .hl {{ background: {RED}; color: #FFF; padding: 0.6mm 1.6mm 0; display: inline-block; line-height: 0.94; }}
.deck {{ font-family: 'Bask'; font-style: italic; font-size: 15.5pt; line-height: 1.38; }}
.byline {{ font-size: 11pt; }} .byline b {{ font-weight: 600; }}
.h2 {{ font-family: 'Druk'; text-transform: uppercase; color: {NAVY}; font-size: 8.2mm;
  line-height: 1.06; }}
.h3 {{ font-family: 'Druk'; text-transform: uppercase; color: {NAVY}; font-size: 7mm;
  line-height: 1.08; }}
.sub {{ font-size: 8.5pt; color: #222; }}
.src {{ font-size: 8.5pt; font-weight: 500; }}
.note {{ font-size: 7pt; color: #444; }}
svg text {{ font-family: 'Inter'; }}
.cap {{ font-size: 2.6px; font-weight: 600; fill: #555; }}
.lab {{ font-size: 3.15px; fill: #000; }}
.val {{ font-family: 'Druk' !important; font-size: 4.3px; }}
.ytd {{ font-size: 3.1px; font-weight: 600; fill: #6E6E6E; }}
.donut-c {{ font-family: 'Druk' !important; font-size: 5.4px; fill: {NAVY}; }}
.big {{ font-family: 'Druk'; line-height: 0.9; }}
.vline {{ position: absolute; border-left: 0.25mm solid {TRACK}; }}
/* elenco con cerchi */
.li {{ display: flex; align-items: center; gap: 3.5mm; margin-bottom: 3.2mm; }}
.circ {{ width: 14mm; height: 14mm; border-radius: 50%; background: {NAVY}; color: #FFF;
  font-family: 'Druk'; font-size: 4.9mm; display: flex; align-items: center; justify-content: center;
  flex: none; letter-spacing: -0.1mm; }}
.li-body {{ flex: 1; }}
.li-lab {{ font-size: 9.5pt; margin-bottom: 1.4mm; }}
.track {{ height: 5mm; background: {TRACK}; }}
.fill {{ height: 100%; background: {NAVY}; }}
/* pagina 2 */
.hero {{ font-family: 'Druk'; color: {RED}; font-size: 38mm; line-height: 0.9; letter-spacing: -0.6mm; }}
.hlines span {{ background: {RED}; color: #FFF; font-weight: 500; font-size: 20pt; line-height: 1.52;
  padding: 0.3mm 1.6mm 0.6mm 0.4mm; box-decoration-break: clone; -webkit-box-decoration-break: clone; }}
.panel {{ position: absolute; background: {NAVY}; color: #FFF; }}
.pan-h {{ font-size: 3.1px; font-weight: 600; fill: #FFFFFF; letter-spacing: 0.08px; }}
.pan-v {{ font-size: 3.6px; font-weight: 700; }}
.pan-b {{ font-size: 2.55px; font-weight: 600; fill: #FFFFFF; }}
.pan-y {{ font-size: 2.6px; fill: #B9C2CF; }}
.dot {{ display: inline-block; width: 3mm; height: 3mm; border-radius: 50%; background: {RED};
  margin-right: 2mm; vertical-align: -0.4mm; }}
.cmp-lab {{ font-size: 9.5pt; }} .cmp-lab b {{ font-weight: 700; }}
.cmp {{ display: flex; align-items: flex-end; justify-content: space-between; margin-top: 4mm; }}
.cmp .n {{ font-family: 'Druk'; font-size: 12.5mm; line-height: 0.9; }}
.cmp .y {{ font-size: 9pt; font-weight: 700; margin-top: 2mm; }}
.dots {{ border-top: 0.5mm dotted #BBB; }}
.az {{ display: flex; align-items: center; height: 15.6mm; border-bottom: 0.5mm dotted #BBB;
  padding: 0 2mm; }}
.az:last-child {{ border-bottom: none; }}
.az.hl {{ background: {ROW}; border-bottom: none; margin-bottom: 1.4mm; }}
.az-ic {{ width: 16mm; flex: none; display: flex; justify-content: center; }}
.az-v {{ font-family: 'Druk'; font-size: 9.6mm; width: 30mm; flex: none; padding-left: 3mm;
  letter-spacing: -0.2mm; }}
.az-l {{ font-size: 9pt; font-weight: 600; line-height: 1.25; }}
.az.hl .az-l {{ font-weight: 400; font-size: 8.5pt; }}
.kn {{ display: flex; align-items: center; gap: 3mm; margin-bottom: 3.2mm; }}
.kn .n {{ font-family: 'Druk'; font-size: 11mm; width: 30mm; flex: none; line-height: 1; }}
.kn .bar {{ height: 6mm; }}
.kn .t {{ font-size: 9pt; line-height: 1.3; }}
"""


def page_left():
    return f'''
<section class="page">
  <div class="rule" style="left:14.4mm"></div>
  <div class="vert rubrica" style="left:5.4mm; top:44mm; transform: rotate(-90deg);">L’infografica</div>
  <div class="vert" style="left:5.4mm; top:166mm; transform: rotate(-90deg);"><b>ADVISOR</b> {MESE}</div>
  <div class="pnum" style="left:5mm; top:262mm; transform: rotate(-90deg); transform-origin:left top;">{PAG_SX}</div>

  <div class="abs title" style="left:25mm; top:15mm; width:190mm;">
    Risparmio 2026:<br>dalla <span class="hl">cautela</span><br>all’azione</div>

  <div class="abs deck" style="left:25mm; top:76mm; width:110mm;">
    Nel 2025 i mercati hanno premiato chi ha osato: l’oro ha reso il 45,7 per cento,
    le azioni dell’Eurozona il 22,4. Ma gli italiani restano prudenti e il risparmio
    gestito è la via d’ingresso al rischio</div>
  <div class="abs byline" style="left:25mm; top:117mm;">di <b>{FIRMA}</b></div>

  <!-- obbligazioni: ciambella -->
  <div class="abs h3" style="left:143mm; top:75mm; width:66mm; font-size:6mm;">Obbligazioni:<br>quanto pesano</div>
  <div class="abs" style="left:143mm; top:90mm;">{donut(27, 11.5, 6)}</div>
  <div class="abs" style="left:178mm; top:106mm; width:32mm;">
    <div class="big" style="font-size:8.5mm; color:{NAVY};">73%</div>
    <div style="font-size:7.5pt; font-weight:600; line-height:1.2;">altre attività</div></div>
  <div class="abs" style="left:178mm; top:91mm; width:32mm;">
    <div class="big" style="font-size:8.5mm; color:{RED};">27%</div>
    <div style="font-size:7.5pt; font-weight:600; line-height:1.2;">obbligazioni</div></div>
  <div class="abs" style="left:143mm; top:122mm; width:66mm; font-size:8pt; line-height:1.35;">
    Peso delle obbligazioni nel portafoglio di chi le possiede. I possessori sono
    il <b>24%</b> degli intervistati (14% nel 2016)</div>

  <!-- sezione rendimenti -->
  <div class="abs" style="left:23mm; top:126mm;">{icon_star(15)}</div>
  <div class="abs h2" style="left:38mm; top:133mm; width:80mm;">I rendimenti<br>delle asset class<br>nel 2025</div>
  <div class="abs" style="left:25mm; top:164mm;">{chart_rendimenti()}</div>
  <div class="abs note" style="left:25mm; top:245mm; width:104mm;">* Dal 1° gennaio al 20 aprile 2026.
    Portafoglio diversificato: elaborazione Centro Einaudi su dati di fonte varia</div>

  <div class="vline" style="left:136mm; top:137mm; height:124mm;"></div>

  <!-- risparmio gestito -->
  <div class="abs" style="left:141mm; top:138mm;">{icon_person(14)}</div>
  <div class="abs h3" style="left:157mm; top:139mm; width:58mm;">Chi possiede<br>risparmio gestito<br>e azioni</div>
  <div class="abs sub" style="left:141mm; top:163mm; width:70mm;">% di intervistati, ultimi 5 anni (2026).<br>Barre in scala 0-20%</div>
  <div class="abs" style="left:141mm; top:172mm; width:70mm;">{gestito_list()}</div>

  <div class="abs src" style="left:25mm; top:264mm;">Fonte: Centro Einaudi, dati di fonte varia</div>
  <div class="abs src" style="left:141mm; top:264mm;">Fonte: Indagine sul Risparmio 2026</div>
</section>'''


def page_right():
    return f'''
<section class="page">
  <div class="rule" style="left:210.7mm"></div>
  <div class="vert rubrica" style="left:213.4mm; top:44mm; transform: rotate(-90deg);">L’infografica</div>
  <div class="vert" style="left:213.4mm; top:166mm; transform: rotate(-90deg);"><b>ADVISOR</b> {MESE}</div>
  <div class="pnum" style="left:213.4mm; top:262mm; transform: rotate(-90deg); transform-origin:left top;">{PAG_DX}</div>

  <div class="abs hero" style="left:20mm; top:12mm;">7,8%</div>
  <div class="abs hlines" style="left:20.6mm; top:52mm; width:84mm;">
    <span>degli italiani</span><br><span>ha operato in azioni</span><br><span>negli ultimi cinque anni</span></div>

  <!-- conoscenza vs esperienza -->
  <div class="abs" style="left:20mm; top:99mm; width:82mm;">
    <div class="kn"><div class="n" style="color:{NAVY}">45,1%</div>
      <div class="t">conosce le <b>azioni</b>, più di quanti conoscono le obbligazioni</div></div>
    <div class="kn"><div class="n" style="color:{RED}">7,8%</div>
      <div class="t">le ha <b>detenute</b> negli ultimi 5 anni</div></div>
  </div>

  <!-- pannello blu al posto della foto -->
  <div class="panel" style="left:108mm; top:0; width:100mm; height:150mm;">
    <div style="position:absolute; left:6mm; top:12mm; width:90mm;" class="h2">
      <span style="color:#FFF">La Borsa sale,<br>la soddisfazione segue</span></div>
    <div style="position:absolute; left:2mm; top:30mm;">{chart_borsa()}</div>
  </div>

  <!-- crescita gestito -->
  <div class="abs" style="left:18mm; top:158mm;">{icon_trend(16)}</div>
  <div class="abs h3" style="left:36mm; top:161mm; width:70mm;">La corsa del risparmio<br>gestito (2016-2026)</div>
  <div class="abs" style="left:24mm; top:185mm; width:84mm;">
    <div class="cmp-lab"><span class="dot"></span>Possessori di <b>fondi comuni e SICAV</b></div>
    <div class="cmp">
      <div><div class="n" style="color:{NAVY}">6,0%</div><div class="y">2016</div></div>
      <svg width="20mm" height="8mm" viewBox="0 0 24 8" style="margin:0 3mm 6.5mm"><line x1="0" y1="4" x2="22.5" y2="4" stroke="{NAVY}" stroke-width="0.6"/><polyline points="18.5,0.6 22.8,4 18.5,7.4" fill="none" stroke="{NAVY}" stroke-width="0.6"/></svg>
      <div style="text-align:right"><div class="n" style="color:{RED}">18,7%</div><div class="y" style="color:{RED}">2026</div></div>
    </div>
    <div class="dots" style="margin:6mm 0 6mm;"></div>
    <div class="cmp-lab"><span class="dot"></span>Possessori di <b>unit linked</b></div>
    <div class="cmp">
      <div><div class="n" style="color:{NAVY}">1,9%</div><div class="y">2016</div></div>
      <svg width="20mm" height="8mm" viewBox="0 0 24 8" style="margin:0 3mm 6.5mm"><line x1="0" y1="4" x2="22.5" y2="4" stroke="{NAVY}" stroke-width="0.6"/><polyline points="18.5,0.6 22.8,4 18.5,7.4" fill="none" stroke="{NAVY}" stroke-width="0.6"/></svg>
      <div style="text-align:right"><div class="n" style="color:{RED}">5,3%</div><div class="y" style="color:{RED}">2026</div></div>
    </div>
  </div>

  <div class="vline" style="left:113mm; top:158mm; height:100mm;"></div>

  <!-- chi opera in azioni -->
  <div class="abs" style="left:117mm; top:157mm;">{icon_bars(14)}</div>
  <div class="abs h3" style="left:133mm; top:160mm; width:76mm;">Chi ha operato<br>in azioni</div>
  <div class="abs sub" style="left:133mm; top:177mm;">% degli intervistati</div>
  <div class="abs" style="left:117mm; top:184mm; width:89mm;">{azioni_list()}</div>

  <div class="abs src" style="left:18mm; top:264mm;">Fonte: Indagine sul Risparmio 2026</div>
  <div class="abs src" style="left:117mm; top:264mm;">Fonte: Indagine sul Risparmio 2026</div>
</section>'''


def build():
    html = f'''<!doctype html><html lang="it"><head><meta charset="utf-8">
<title>Infografica Risparmio 2026</title><style>{CSS}</style></head>
<body>{page_left()}{page_right()}</body></html>'''
    path = os.path.join(HERE, "infografica.html")
    with open(path, "w") as f:
        f.write(html)
    pdf = os.path.join(HERE, "infografica.pdf")
    subprocess.run([CHROME, "--headless=new", "--no-sandbox", "--disable-gpu",
                    "--no-pdf-header-footer", f"--print-to-pdf={pdf}", "file://" + path],
                   check=True, capture_output=True)
    for i, name in ((1, "pagina-1"), (2, "pagina-2")):
        subprocess.run(["pdftoppm", "-r", "150", "-png", "-f", str(i), "-l", str(i), "-singlefile",
                        pdf, os.path.join(HERE, name)], check=True)
    print("ok ->", pdf)


if __name__ == "__main__":
    build()
