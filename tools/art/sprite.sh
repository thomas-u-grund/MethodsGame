#!/bin/bash
# Crop a generated character sprite to its real figure and install it.
#   tools/art/sprite.sh ~/Downloads/cb-sprite-kira.png kira 820
# Crops to the alpha>40% bounding box (plain -trim leaves padding, because the
# generator's transparent pixels carry varying RGB), scales to a target height,
# and writes web/sprite-<name>.png plus a PNG original.
set -e
src="$1"; name="$2"; h="${3:-820}"
root="$(cd "$(dirname "$0")/../.." && pwd)"
g=$(magick "$src" -alpha extract -threshold 40% -format '%@' info:)
magick "$src" -crop "$g" +repage -resize "x$h" "$root/web-png-originals/sprite-$name.png"
cp "$root/web-png-originals/sprite-$name.png" "$root/web/sprite-$name.png"
magick "$root/web/sprite-$name.png" -format "%wx%h" info:
