"""Esporta ogni grafico dell'infografica in un file singolo ad alta risoluzione.

Ritaglia infografica.pdf (generato da build_infografica.py) e salva un PNG a 600 dpi
per ogni grafico nella cartella grafici-hd/.
Uso: python3 export_grafici.py [dpi]
"""
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
PDF = os.path.join(HERE, "infografica.pdf")
OUT = os.path.join(HERE, "grafici-hd")
DPI = int(sys.argv[1]) if len(sys.argv) > 1 else 600

# (pagina, nome file, riquadro in mm: x0, y0, x1, y1)
GRAFICI = [
    (1, "01_rendimenti_asset_class_2025", (20, 124, 133, 269)),
    (1, "02_obbligazioni_peso_portafoglio", (140, 72, 212, 137)),
    (1, "03_possessori_risparmio_gestito", (139, 135, 214, 269)),
    (2, "04_azioni_7-8_per_cento", (16, 8, 106, 128)),
    (2, "05_borsa_e_soddisfazione", (108, 0, 208, 150)),
    (2, "06_corsa_risparmio_gestito", (15, 154, 110, 269)),
    (2, "07_chi_ha_operato_in_azioni", (115, 154, 209, 269)),
]


def px(mm):
    return round(mm / 25.4 * DPI)


def main():
    os.makedirs(OUT, exist_ok=True)
    for page, name, (x0, y0, x1, y1) in GRAFICI:
        subprocess.run(["pdftoppm", "-png", "-r", str(DPI), "-f", str(page), "-l", str(page),
                        "-singlefile", "-x", str(px(x0)), "-y", str(px(y0)),
                        "-W", str(px(x1 - x0)), "-H", str(px(y1 - y0)),
                        PDF, os.path.join(OUT, name)], check=True)
        print(f"{name}.png  {px(x1 - x0)}x{px(y1 - y0)} px")


if __name__ == "__main__":
    main()
