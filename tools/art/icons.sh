#!/bin/bash
# Slice a 3x2 generated icon sheet into individual transparent icons.
#   tools/art/icons.sh ~/Downloads/cb-icons-1.png stepladder blankcard nobelproc grandphrase altpaper chalk
# Each cell is cropped, trimmed to its own alpha>40% bounding box (plain -trim leaves
# padding, the generator's transparent pixels carry varying RGB), and sized to 420px.
set -e
src="$1"; shift
root="$(cd "$(dirname "$0")/../.." && pwd)"
W=$(magick identify -format '%w' "$src"); H=$(magick identify -format '%h' "$src")
cw=$((W/3)); ch=$((H/2)); i=0
for name in "$@"; do
  col=$((i%3)); row=$((i/3)); x=$((col*cw)); y=$((row*ch))
  magick "$src" -crop ${cw}x${ch}+${x}+${y} +repage "/tmp/cell.png"
  g=$(magick "/tmp/cell.png" -alpha extract -threshold 40% -format '%@' info:)
  magick "/tmp/cell.png" -crop "$g" +repage -resize 420x420\> "$root/web/icon-$name.png"
  printf '%-16s %s\n' "$name" "$(magick identify -format '%wx%h' "$root/web/icon-$name.png")"
  i=$((i+1))
done
