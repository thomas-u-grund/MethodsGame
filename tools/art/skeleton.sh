#!/bin/bash
# Re-letter the shared skeleton sprite's hand-held sign.
#   tools/art/skeleton.sh "CITED 400 TIMES.\nEXPLAINED NOTHING." hall
# The base sprite carries the Office sign baked in, so the old one is painted out and a new
# parchment card is composited into the same place at the same tilt.
set -e
text="$1"; name="$2"
root="$(cd "$(dirname "$0")/../.." && pwd)"
base="$root/art/sprites/sprite-skeleton.png"
tmp=$(mktemp -d)
# a fresh card, then tilted to match the original
# let the card size itself to the text, so nothing is ever clipped
printf '%b' "$text" > "$tmp/t.txt"
magick -background '#C2A06A' -fill '#33240F' -font 'Courier-Bold' -pointsize 13 \
  -interline-spacing 3 label:@"$tmp/t.txt" \
  -bordercolor '#C2A06A' -border 9 -bordercolor '#6B4E2A' -border 3 "$tmp/card.png"
magick "$tmp/card.png" -background none -rotate -4 "$tmp/card-r.png"
# erase the baked-in sign (Copy, not Over -- compositing transparent Over does nothing),
# then drop the new card into the same place
magick "$base" \
  \( -size 172x160 xc:none \) -geometry +0+96 -compose Copy -composite \
  \( "$tmp/card-r.png" \) -geometry +10+120 -compose Over -composite \
  "$root/web/sprite-skeleton-$name.png"
magick "$root/web/sprite-skeleton-$name.png" -format "%wx%h\n" info:
rm -rf "$tmp"
