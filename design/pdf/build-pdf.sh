#!/usr/bin/env bash
# Converte un file HTML del template ADVISOR in PDF A4 (font incorporati) con Chromium headless.
# Uso: design/pdf/build-pdf.sh <input.html> <output.pdf>
set -euo pipefail
in="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
out="$2"
chrome="${CHROME:-$(ls -d /opt/pw-browsers/chromium-*/chrome-linux*/chrome 2>/dev/null | head -1)}"
[ -n "$chrome" ] || chrome="$(command -v chromium || command -v google-chrome)"
"$chrome" --headless=new --no-sandbox --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=5000 --print-to-pdf="$out" "file://$in" 2>/dev/null
echo "scritto $out"
