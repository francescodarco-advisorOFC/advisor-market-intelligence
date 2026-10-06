#!/usr/bin/env bash
# Converte un HTML impaginato con lo stile ADVISOR in PDF A4 (font incorporati) con Chromium headless.
# Uso: scripts/build-pdf.sh <input.html> <output.pdf>
# I riferimenti url("../fonts/...") vengono puntati ai font della skill, quindi l'HTML può stare ovunque.
set -euo pipefail
skill_dir="$(cd "$(dirname "$0")/.." && pwd)"
in="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
out="$(cd "$(dirname "$2")" && pwd)/$(basename "$2")"
tmp="$(dirname "$in")/.advisor-print-$$.html"
sed "s#url(\"../fonts/#url(\"file://$skill_dir/assets/fonts/#g" "$in" > "$tmp"
trap 'rm -f "$tmp"' EXIT
chrome="${CHROME:-}"
[ -n "$chrome" ] || chrome="$(ls -d /opt/pw-browsers/chromium-*/chrome-linux*/chrome 2>/dev/null | head -1 || true)"
[ -n "$chrome" ] || chrome="$(command -v chromium || command -v chromium-browser || command -v google-chrome || true)"
[ -n "$chrome" ] || { echo "Chromium non trovato: imposta CHROME=/percorso/chrome" >&2; exit 1; }
"$chrome" --headless=new --no-sandbox --disable-gpu --no-pdf-header-footer --allow-file-access-from-files \
  --virtual-time-budget=5000 --print-to-pdf="$out" "file://$tmp" 2>/dev/null
echo "scritto $out"
