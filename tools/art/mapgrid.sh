#!/bin/bash
# Overlay a labelled percentage grid on a campus map, so MAP_LAYOUT and MAP_LABELS
# coordinates can be read off the painting instead of guessed.
#   tools/art/mapgrid.sh web/campus-map-act1.webp /tmp/grid.png [cols] [rows]
set -e
src="$1"; out="${2:-/tmp/mapgrid.png}"; cols="${3:-10}"; rows="${4:-10}"
W=1400
H=$(python3 -c "print(int($W*941/1672))")
draw=""
for i in $(seq 1 $((cols-1))); do x=$((W*i/cols)); draw="$draw line $x,0 $x,$H"; done
for j in $(seq 1 $((rows-1))); do y=$((H*j/rows)); draw="$draw line 0,$y $W,$y"; done
lbl=""
for i in $(seq 0 $((cols-1))); do for j in $(seq 0 $((rows-1))); do
  x=$((W*i/cols+3)); y=$((H*j/rows+13))
  lbl="$lbl text $x,$y '$((100*i/cols)),$((100*j/rows))'"
done; done
magick "$src" -resize ${W}x \
  -fill none -stroke 'rgba(0,255,255,0.45)' -strokewidth 1 -draw "$draw" \
  -stroke none -fill 'rgba(0,255,255,0.85)' -pointsize 11 -draw "$lbl" "$out"
echo "$out  ($(magick identify -format '%wx%h' "$out"))  grid = percent of the 1672x941 map"
