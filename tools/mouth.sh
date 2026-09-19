#!/bin/sh
# Build a talking-mouth overlay for a sprite.
# usage: tools/mouth.sh <name> <cx> <cy> <rx> <ry> <target-resize>
#   original: art/sprites/originals/sprite-<name>.png   open mouth: art/sprites/mouths/<name>-open-raw.png
#   cx,cy,rx,ry: mouth ellipse in ORIGINAL pixels; target-resize e.g. x820 or 560x (same as the sprite)
# Output: web/mouth-<name>.webp, same size/crop as web/sprite-<name>.* so it overlays 1:1.
set -e
n=$1; cx=$2; cy=$3; rx=$4; ry=$5; rs=$6
o=art/sprites/originals/sprite-$n.png; m=art/sprites/mouths/$n-open-raw.png
g=$(magick $o -alpha extract -threshold 40% -format '%@' info:)
W=$(magick identify -format %w $o); H=$(magick identify -format %h $o)
magick -size ${W}x${H} xc:black -fill white -draw "ellipse $cx,$cy $rx,$ry 0,360" -blur 0x4 /tmp/mask-$n.png
magick $m \( /tmp/mask-$n.png \) -alpha off -compose CopyOpacity -composite /tmp/mouthfull-$n.png
magick /tmp/mouthfull-$n.png -crop $g +repage -resize $rs -strip /tmp/mouth-$n.png
cwebp -quiet -q 90 -alpha_q 100 /tmp/mouth-$n.png -o web/mouth-$n.webp
magick identify -format "mouth-$n %wx%h\n" /tmp/mouth-$n.png
