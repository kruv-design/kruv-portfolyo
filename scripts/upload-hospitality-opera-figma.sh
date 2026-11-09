#!/usr/bin/env bash
# Figma 5837:2303 — Opera grid reading order (25)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$ROOT/.tmp-opera-hosp"
mkdir -p "$TMP"
PREFIX="https://www.figma.com/api/mcp/asset/b10a6ef2-0e29-432d-b26c-66b5cee00b39"
FILES=(07c16 72c32 6b5fc 2bc3a 8aa38 0332a 362e6 808b4 7dbb5 cb50b 03e6a e5ef2 ff378 9b579 c0805 d3cb5 c49f1 b7abe 6fbc0 799f7 fcf76 657b9 2cac0 a1e2a 14572)

for i in "${!FILES[@]}"; do
  n=$(printf '%02d' $((i + 1)))
  raw="$TMP/gallery-$n-raw.png"
  out="$TMP/gallery-$n.jpg"
  echo "download $n …"
  curl -sL --connect-timeout 5 --max-time 120 "$PREFIX/${FILES[$i]}.png" -o "$raw"
  sips -Z 2200 -s format jpeg -s formatOptions 88 "$raw" --out "$out" >/dev/null
  ls -lh "$out"
done
echo "ready: $TMP"
