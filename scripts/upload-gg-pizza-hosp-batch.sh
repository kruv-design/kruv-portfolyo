#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$ROOT/.tmp-gg-pizza-hosp"
mkdir -p "$TMP"
PREFIX="https://www.figma.com/api/mcp/asset/96d38138-3d3a-42dc-b28e-6bee007108bf"
FILES=(77b41 855e4 49249 0efda 9ea5e 42d93 66933 1e61d 6bb93 7267e 63cad aa55e 58e09 4a683 32135 67ea5)

for i in "${!FILES[@]}"; do
  n=$(printf '%02d' $((i + 1)))
  raw="$TMP/gg-pizza-$n-raw.png"
  out="$TMP/gg-pizza-$n.jpg"
  echo "download $n …"
  curl -sL --connect-timeout 5 --max-time 120 "$PREFIX/${FILES[$i]}.png" -o "$raw"
  sips -Z 2200 -s format jpeg -s formatOptions 88 "$raw" --out "$out" >/dev/null
  ls -lh "$out"
done

echo "downloads ready in $TMP"
