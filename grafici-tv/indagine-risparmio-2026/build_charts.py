"""Grafici TV (16:9) dall'Indagine sul Risparmio 2026 - stile ADVISOR.

Genera per ogni figura un PNG 1920x1080 e un PNG 3840x2160 (UHD).
Uso: python3 build_charts.py [cartella_font] [cartella_logo]
Produce due versioni: fondo scuro e fondo bianco (suffisso _bianco).
"""
import os
import sys

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import font_manager
from matplotlib.patches import FancyBboxPatch, Rectangle
import matplotlib.image as mpimg

HERE = os.path.dirname(os.path.abspath(__file__))
FONT_DIR = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "fonts")
LOGO_DIR = sys.argv[2] if len(sys.argv) > 2 else HERE
LOGO = os.path.join(LOGO_DIR, "advisor-logo-white.png")
OUT = os.path.join(HERE, "output")
os.makedirs(OUT, exist_ok=True)

for f in os.listdir(FONT_DIR):
    if f.endswith(".ttf"):
        font_manager.fontManager.addfont(os.path.join(FONT_DIR, f))
plt.rcParams["font.family"] = "Libre Baskerville"

# --- Palette ADVISOR adattata al fondo scuro -------------------------------
BG = "#101010"
INK = "#FFFFFF"
INK2 = "#C8C8C8"
MUTED = "#8A8B8C"
GRID = "#2A2A2A"
AXIS = "#5A5A5A"
RED = "#E53446"
RED_CORP = "#BA0100"
CYAN = "#04ACC8"
LIGHT = "#F2F2F2"
GREY = "#A2A3A3"
POS = "#C4D4F8"  # barre positive
GAP = "#1C1C1C"  # fascia anni mancanti
SUFFIX = ""

THEMES = {
    "scuro": dict(BG="#101010", INK="#FFFFFF", INK2="#C8C8C8", MUTED="#8A8B8C",
                  GRID="#2A2A2A", AXIS="#5A5A5A", CYAN="#04ACC8", LIGHT="#F2F2F2",
                  GREY="#A2A3A3", POS="#C4D4F8", GAP="#1C1C1C",
                  LOGO="advisor-logo-white.png", SUFFIX=""),
    "bianco": dict(BG="#FFFFFF", INK="#000000", INK2="#404040", MUTED="#707172",
                   GRID="#E6E6E6", AXIS="#8A8A8A", CYAN="#0391AA", LIGHT="#282C34",
                   GREY="#505864", POS="#80889C", GAP="#F0F0F0",
                   LOGO="advisor-logo.png", SUFFIX="_bianco"),
}


def use_theme(name):
    t = dict(THEMES[name])
    t["LOGO"] = os.path.join(LOGO_DIR, t["LOGO"])
    globals().update(t)

W, H = 1920, 1080
FONTE = "Fonte: Indagine sul Risparmio e sulle scelte finanziarie degli italiani 2026, Centro Einaudi"


def pt(px):
    """px a 1920x1080 -> punti tipografici (fig a 100 dpi)."""
    return px * 72 / 100


def fmt(v, dec=1, sign=False):
    s = f"{v:+.{dec}f}" if sign else f"{v:.{dec}f}"
    return s.replace(".", ",").replace("-", "−")


def frame(title, subtitle, source=FONTE, note=None):
    fig = plt.figure(figsize=(W / 100, H / 100), dpi=100, facecolor=BG)
    ov = fig.add_axes([0, 0, 1, 1], facecolor="none", zorder=-1)
    ov.set_xlim(0, W)
    ov.set_ylim(H, 0)
    ov.axis("off")
    # barra rossa a sinistra
    ov.add_patch(Rectangle((0, 0), 16, H, color=RED_CORP, lw=0))
    # etichetta
    ov.add_patch(FancyBboxPatch((96, 52), 470, 44, boxstyle="round,pad=0,rounding_size=0",
                                color=RED_CORP, lw=0))
    ov.text(112, 75, "INDAGINE SUL RISPARMIO 2026", color="#FFFFFF", fontsize=pt(21),
            fontweight="bold", va="center")
    # logo
    if os.path.exists(LOGO):
        img = mpimg.imread(LOGO)
        lw = 300
        lh = lw * img.shape[0] / img.shape[1]
        ov.imshow(img, extent=(W - 96 - lw, W - 96, 52 + lh, 52), zorder=5)
    ov.text(96, 160, title, color=INK, fontsize=pt(54), va="center")
    ov.text(96, 222, subtitle, color=INK2, fontsize=pt(28), style="italic", va="center")
    ov.text(96, H - 52, source, color=MUTED, fontsize=pt(20), style="italic", va="center")
    if note:
        ov.text(W - 96, H - 52, note, color=MUTED, fontsize=pt(20), style="italic",
                va="center", ha="right")
    return fig, ov


def axes_px(fig, x0, y0, x1, y1):
    """Crea un asse con coordinate in px (origine in alto a sinistra)."""
    ax = fig.add_axes([x0 / W, 1 - y1 / H, (x1 - x0) / W, (y1 - y0) / H], facecolor="none")
    return ax


def style_ax(ax, ytick_fmt="{:.0f}", grid=True):
    for s in ("top", "right", "left"):
        ax.spines[s].set_visible(False)
    ax.spines["bottom"].set_color(AXIS)
    ax.spines["bottom"].set_linewidth(1.5)
    ax.tick_params(colors=INK2, labelsize=pt(26), length=0, pad=12)
    if grid:
        ax.yaxis.grid(True, color=GRID, lw=1.2)
        ax.set_axisbelow(True)
    ax.yaxis.set_major_formatter(matplotlib.ticker.FuncFormatter(
        lambda v, _: ytick_fmt.format(v).replace(".", ",").replace("-", "−")))


def legend_row(ov, items, x, y, gap=60):
    """items: [(colore, etichetta, stile)] - quadratino/linea + testo bianco."""
    for color, label, kind in items:
        if kind == "line":
            ov.plot([x, x + 44], [y, y], color=color, lw=6, solid_capstyle="round")
            x += 60
        elif kind == "dash":
            ov.plot([x, x + 44], [y, y], color=color, lw=6, ls=(0, (2, 1.2)))
            x += 60
        else:
            ov.add_patch(Rectangle((x, y - 12), 24, 24, color=color, lw=0))
            x += 38
        t = ov.text(x, y, label, color=INK, fontsize=pt(26), va="center")
        fig = ov.figure
        fig.canvas.draw()
        bb = t.get_window_extent()
        x += bb.width + gap


def save(fig, name):
    fig.savefig(os.path.join(OUT, f"{name}{SUFFIX}.png"), dpi=100, facecolor=BG)
    fig.savefig(os.path.join(OUT, f"{name}{SUFFIX}_4K.png"), dpi=200, facecolor=BG)
    plt.close(fig)


def label(ax, x, y, text, dy, color=None, size=26, weight="bold", ha="center"):
    ax.annotate(text, (x, y), xytext=(0, dy), textcoords="offset pixels", ha=ha,
                va="bottom" if dy > 0 else "top", color=color or INK, fontsize=pt(size),
                fontweight=weight)


# =========================================================================
# Figura 2.7 - Rendimenti delle asset class
# =========================================================================
def fig_2_7():
    years = ["2022", "2023", "2024", "2025", "2026*"]
    data = [
        ("Titoli di Stato breve", [-0.6, 3.0, 3.6, 2.1, 0.5]),
        ("Titoli di Stato medio", [-4.6, 2.1, 2.5, 2.6, -0.1]),
        ("Titoli di Stato lungo", [-22.7, 12.1, 5.7, 4.3, -1.0]),
        ("Azioni Eurozona", [-11.9, 18.6, 8.4, 22.4, 5.8]),
        ("Bond societari EUR", [-8.9, 4.3, 2.0, 3.5, 0.5]),
        ("Bond emergenti EUR", [-19.8, 4.9, 3.3, 11.1, 0.7]),
        ("Oro (in euro)", [7.0, 7.2, 33.8, 45.7, 12.3]),
        ("Azioni mondiali EUR", [-11.2, 11.0, 9.4, 16.5, 6.3]),
        ("Portafoglio", [-11.6, 8.7, 7.0, 11.4, 2.1]),
    ]
    fig, ov = frame("Rendimenti delle asset class, 2022-2026",
                    "Rendimento annuo in %. Il 2025 premia oro e azioni",
                    source="Fonte: elaborazione Centro Einaudi su dati di fonte varia",
                    note="* 2026: dal 1° gennaio al 20 aprile")
    x0, x1, top, bottom = 96, W - 96, 285, H - 95
    cols, rows = 3, 3
    cgap, rgap = 56, 18
    cw = (x1 - x0 - cgap * (cols - 1)) / cols
    rh = (bottom - top - rgap * (rows - 1)) / rows
    for i, (name, vals) in enumerate(data):
        r, c = divmod(i, cols)
        px0 = x0 + c * (cw + cgap)
        py0 = top + r * (rh + rgap)
        hl = name == "Portafoglio"
        ov.text(px0, py0 + 16, name, color=INK, fontsize=pt(27), fontweight="bold", va="center")
        ax = axes_px(fig, px0, py0 + 40, px0 + cw, py0 + rh - 30)
        cols_ = [RED if v < 0 else POS for v in vals]
        bars = ax.bar(range(5), vals, width=0.62, color=cols_, lw=0)
        bars[4].set_hatch("///")
        bars[4].set_edgecolor(BG)
        ax.set_ylim(-48, 50)
        ax.set_xlim(-0.55, 4.55)
        ax.axhline(0, color=AXIS, lw=1.5)
        ax.axis("off")
        for j, v in enumerate(vals):
            ax.annotate(fmt(v), (j, v), xytext=(0, 6 if v >= 0 else -6),
                        textcoords="offset pixels", ha="center",
                        va="bottom" if v >= 0 else "top",
                        color=INK, fontsize=pt(23), fontweight="bold")
            ax.text(j, -48, years[j], ha="center", va="top", color=INK2, fontsize=pt(19),
                    transform=ax.transData)
        if hl:
            ov.add_patch(Rectangle((px0 - 14, py0 - 6), cw + 28, rh + 12, fill=False,
                                   ec=GREY, lw=1.5))
    save(fig, "fig_2-7_rendimenti_asset_class")


# =========================================================================
# Figura 2.8a - Obbligazioni
# =========================================================================
def fig_2_8a():
    yrs = list(range(2014, 2027))
    possessori = [20, 19, 14, 22, 19, 24, 22, 22, 23, 24, 25, 20, 24]
    quota = [26, 30, 28, 26, 25, 27, 24, 29, 23, 28, 34, 26, 27]
    fig, ov = frame("Obbligazioni: chi le possiede e quanto pesano",
                    "Valori in %, 2014-2026")
    legend_row(ov, [(RED, "Quota di obbligazioni nel portafoglio dei possessori", "line"),
                    (CYAN, "Intervistati che possiedono obbligazioni", "line")], 96, 300)
    ax = axes_px(fig, 150, 350, W - 110, H - 140)
    style_ax(ax)
    ax.plot(yrs, quota, color=RED, lw=5, marker="o", ms=11, mec=BG, mew=3, zorder=3)
    ax.plot(yrs, possessori, color=CYAN, lw=5, marker="o", ms=11, mec=BG, mew=3, zorder=3)
    for x, a, b in zip(yrs, quota, possessori):
        label(ax, x, a, f"{a}", 18, size=30)
        label(ax, x, b, f"{b}", -18, size=30)
    ax.set_ylim(0, 40)
    ax.set_yticks(range(0, 41, 10))
    ax.set_xlim(2013.5, 2026.5)
    ax.set_xticks(yrs)
    save(fig, "fig_2-8a_obbligazioni")


# =========================================================================
# Figura 2.9a - Chi ha operato in azioni
# =========================================================================
def fig_2_9a():
    yrs = list(range(2011, 2027))
    cinque = [12.5, 12.5, 11.4, 9.2, 7.5, 5.3, 6.9, 6.4, 6.8, 7.4, 7.0, 9.9, 10.7, 8.6, 7.9, 7.8]
    yrs12 = list(range(2012, 2026))
    dodici = [6.6, 5.6, 4.3, 5.1, 3.9, 3.3, 3.2, 3.6, 4.5, 3.9, 4.8, 6.0, 5.6, 4.6]
    fig, ov = frame("Azioni: pochi italiani le comprano",
                    "% di intervistati che hanno operato in azioni")
    legend_row(ov, [(LIGHT, "Negli ultimi 5 anni", "line"),
                    (RED, "Negli ultimi 12 mesi (serie dal 2012)", "line")], 96, 300)
    ax = axes_px(fig, 150, 350, W - 110, H - 140)
    style_ax(ax)
    ax.plot(yrs, cinque, color=LIGHT, lw=5, marker="o", ms=11, mec=BG, mew=3, zorder=3)
    ax.plot(yrs12, dodici, color=RED, lw=5, marker="o", ms=11, mec=BG, mew=3, zorder=3)
    for x, v in zip(yrs, cinque):
        label(ax, x, v, fmt(v), 18, size=27)
    for x, v in zip(yrs12, dodici):
        label(ax, x, v, fmt(v), -18, size=27)
    ax.set_ylim(0, 14)
    ax.set_yticks(range(0, 15, 2))
    ax.set_xlim(2010.5, 2026.5)
    ax.set_xticks(yrs)
    save(fig, "fig_2-9a_operativita_azioni")


# =========================================================================
# Figura 2.9b - Soddisfazione vs rendimento (due pannelli, nessun doppio asse)
# =========================================================================
def fig_2_9b():
    yrs = [1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007,
           2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020,
           2021, 2022, 2023, 2024, 2025, 2026]
    rend = [23, 16, 25, -6, -7, -17, 25, 3, 9, 19, 10, -9, 14, 20, 2, -4, 6, 10, -14, 29,
            -4, 23, -13, 28, 14, 38]
    ratio = [2.6, 2.0, 3.2, 1.9, 1.0, 0.5, 0.6, 0.8, 0.9, 1.3, 1.3, 2.0, 1.5, 1.8, 2.8, 2.0,
             2.6, 5.6, 2.6, 2.4, 5.1, 6.5, 3.3, 10.5, 7.8, 8.5]
    # posizioni con uno spazio per l'interruzione 2008-2010
    xs = [i if y <= 2007 else i + 1 for i, y in enumerate(yrs)]
    fig, ov = frame("La Borsa sale, la soddisfazione segue",
                    "Possessori di azioni: soddisfatti per ogni insoddisfatto, "
                    "e rendimento della Borsa italiana nell’anno precedente")
    xl = (-0.7, xs[-1] + 0.7)
    # pannello alto: rapporto soddisfatti / insoddisfatti
    ov.text(96, 300, "Soddisfatti per ogni insoddisfatto", color=INK, fontsize=pt(28),
            fontweight="bold", va="center")
    ax1 = axes_px(fig, 150, 340, W - 110, 610)
    style_ax(ax1)
    ax1.plot(xs[:10], ratio[:10], color=LIGHT, lw=5, marker="o", ms=10, mec=BG, mew=3)
    ax1.plot(xs[10:], ratio[10:], color=LIGHT, lw=5, marker="o", ms=10, mec=BG, mew=3)
    for i, (x, v) in enumerate(zip(xs, ratio)):
        prev = ratio[i - 1] if i else v
        nxt = ratio[i + 1] if i + 1 < len(ratio) else v
        dip = (v < prev and v < nxt and abs(prev - v) > 1) or prev - v > 2
        label(ax1, x, v, fmt(v), -14 if dip else 14, size=22, weight="bold")
    ax1.set_ylim(0, 12)
    ax1.set_yticks([0, 4, 8, 12])
    ax1.set_xlim(*xl)
    ax1.set_xticks([])
    ax1.spines["bottom"].set_visible(False)
    # pannello basso: rendimento
    ov.text(96, 660, "Rendimento delle azioni italiane nell’anno precedente (%)", color=INK,
            fontsize=pt(28), fontweight="bold", va="center")
    ax2 = axes_px(fig, 150, 700, W - 110, H - 140)
    style_ax(ax2)
    ax2.spines["bottom"].set_visible(False)
    ax2.bar(xs, rend, width=0.66, color=[RED if v < 0 else POS for v in rend], lw=0)
    ax2.axhline(0, color=AXIS, lw=1.5)
    for x, v in zip(xs, rend):
        txt = fmt(v, 0, sign=v > 0) if v else "0"
        label(ax2, x, v, txt, 6 if v >= 0 else -6, size=21)
    ax2.set_ylim(-26, 50)
    ax2.set_yticks([-20, 0, 20, 40])
    ax2.set_xlim(*xl)
    ax2.set_xticks(xs)
    ax2.set_xticklabels([f"’{str(y)[2:]}" for y in yrs], fontsize=pt(22))
    # interruzione della serie
    gx = 10
    for a in (ax1, ax2):
        a.axvspan(gx - 0.45, gx + 0.45, color=GAP, lw=0, zorder=0)
    ax2.text(gx, -26, "2008-\n2010\nn.d.", ha="center", va="top", color=MUTED,
             fontsize=pt(15), style="italic")
    save(fig, "fig_2-9b_soddisfazione_azioni")


# =========================================================================
# Figura 2.11a - Risparmio gestito
# =========================================================================
def fig_2_11a():
    yrs = list(range(2011, 2027))
    fondi = [8.5, 6.6, 5.1, 6.0, 7.2, 6.0, 10.5, 8.9, 12.0, 12.0, 12.4, 17.3, 15.5, 13.8, 17.2, 18.7]
    gest = [9.5, 7.7, 6.4, 6.7, 5.9, 4.1, 8.4, 5.7, 7.7, 9.2, 7.4, 9.3, 8.4, 6.4, 8.8, 9.9]
    etf = [3.0, 3.0, 2.8, 3.0, 2.3, 1.7, 3.1, 3.2, 2.5, 2.9, 3.3, 3.3, 4.1, 3.9, 3.9, 3.5]
    yul = list(range(2015, 2027))
    ul = [2.0, 1.9, 3.8, 1.7, 2.3, 3.7, 2.8, 4.0, 4.6, 3.8, 4.2, 5.3]
    fig, ov = frame("Risparmio gestito: corrono i fondi",
                    "% di intervistati che hanno posseduto lo strumento negli ultimi 5 anni")
    ax = axes_px(fig, 150, 290, W - 470, H - 140)
    style_ax(ax)
    series = [
        (fondi, yrs, LIGHT, "-", "Fondi comuni e SICAV", [2011, 2017, 2022, 2024]),
        (gest, yrs, RED, "-", "Gestioni patrimoniali", [2011, 2022, 2024]),
        (ul, yul, GREY, (0, (2, 1.2)), "Unit linked", []),
        (etf, yrs, CYAN, "-", "ETF", [2011]),
    ]
    for vals, xs, col, ls, name, marks in series:
        ax.plot(xs, vals, color=col, lw=5, ls=ls, zorder=3)
        ax.plot([xs[-1]], [vals[-1]], "o", color=col, ms=13, mec=BG, mew=3, zorder=4)
        for m in marks:
            v = vals[xs.index(m)]
            ax.plot([m], [v], "o", color=col, ms=11, mec=BG, mew=3, zorder=4)
            below = (name == "Gestioni patrimoniali" and m == 2024
                     or name == "Fondi comuni e SICAV" and m in (2011, 2024)
                     or name == "ETF")
            label(ax, m, v, fmt(v), -16 if below else 16, size=26)
    ax.set_ylim(0, 20)
    ax.set_yticks(range(0, 21, 5))
    ax.set_xlim(2010.6, 2026.3)
    ax.set_xticks(yrs)
    ax.set_xticklabels([f"’{str(y)[2:]}" if y not in (2011, 2026) else str(y) for y in yrs])
    # etichette dirette a fine linea: valore + nome
    ends = [(fondi[-1], 18.7, LIGHT, "Fondi e SICAV"),
            (gest[-1], 9.9, RED, "Gestioni\npatrimoniali"),
            (ul[-1], 5.6, GREY, "Unit linked"),
            (etf[-1], 3.0, CYAN, "ETF")]
    fig.canvas.draw()
    for v, ypos, col, name in ends:
        _, py = ax.transData.transform((2026, ypos))
        py = H - py
        xl = W - 470 + 40
        ov.text(xl, py, fmt(v), color=INK, fontsize=pt(34), fontweight="bold", va="center")
        ov.plot([xl + 100, xl + 140], [py, py], color=col, lw=6,
                ls="-" if name != "Unit linked" else (0, (1, 0.6)))
        ov.text(xl + 156, py, name, color=INK2, fontsize=pt(25), va="center")
    save(fig, "fig_2-11a_risparmio_gestito")


if __name__ == "__main__":
    for theme in THEMES:
        use_theme(theme)
        fig_2_7()
        fig_2_8a()
        fig_2_9a()
        fig_2_9b()
        fig_2_11a()
    print("ok ->", OUT)
