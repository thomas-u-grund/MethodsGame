#!/usr/bin/env python3
"""Build an act's "Starring" poster by compositing the game's own sprites.

Every act opens its interlude with a cast poster before the title card. Acts I and III
have painted ones; II, IV and V are built here instead, from the room sprites, because
that guarantees the people on the poster are exactly the people you meet -- same art, same
fidelity -- and because it needs no image generation.

    python3 tools/art/castposter.py web/il4-cast.webp kira:60:24 clerk:58:50 tobi:56:76

Each figure is `sprite:heightPercent:centreXPercent`, where `sprite` is the bit between
`sprite-` and the extension. Figures stand on a common baseline with a soft contact shadow;
the empty plaque in the middle is what the interlude panel draws STARRING over, so nothing
is written into the art itself.
"""
import os, subprocess, sys

W, H = 1672, 941
BASE = 880                 # the floor line every figure stands on
PLAQUE = (530, 450, 1100, 632)

def run(*a): subprocess.run(list(a), check=True)
def dims(p): return [int(x) for x in subprocess.check_output(
    ['magick', 'identify', '-format', '%w %h', p]).split()]

def find(name):
    for ext in ('.png', '.webp'):
        p = os.path.join('web', 'sprite-' + name + ext)
        if os.path.exists(p): return p
    sys.exit('no sprite for ' + name)

def build(out, figures):
    tmp = out + '.tmp.png'
    # a warm dark stage, then a floor, so nobody is hovering in a void
    run('magick', '-size', '%dx%d' % (W, H), 'radial-gradient:#6b4f36-#1b1109', '-blur', '0x40', tmp)
    run('magick', tmp, '-fill', '#241812', '-draw',
        'rectangle 0,%d %d,%d' % (BASE - 6, W, H), tmp)
    run('magick', tmp, '-blur', '0x9', tmp)
    run('magick', tmp,
        '-fill', '#31220f', '-stroke', '#d4ad54', '-strokewidth', '5',
        '-draw', 'roundrectangle %d,%d %d,%d 8,8' % PLAQUE,
        '-fill', 'none', '-stroke', '#9a7b3a', '-strokewidth', '2',
        '-draw', 'roundrectangle %d,%d %d,%d 5,5' % (PLAQUE[0]+16, PLAQUE[1]+16, PLAQUE[2]-16, PLAQUE[3]-16),
        tmp)
    for name, hp, cxp in figures:
        src = find(name)
        th = int(H * hp / 100.0)
        cx = int(W * cxp / 100.0)
        w, h = dims(src)
        tw = int(round(w * th / float(h)))
        run('magick', tmp,
            '(', '-size', '%dx26' % max(8, int(tw * .8)), 'xc:none', '-fill', 'rgba(0,0,0,0.45)',
                 '-draw', 'ellipse %d,13 %d,10 0,360' % (int(tw*.4), int(tw*.38)), '-blur', '0x7', ')',
            '-geometry', '+%d+%d' % (cx - int(tw*.4), BASE - 14), '-composite', tmp)
        run('magick', tmp, '(', src, '-resize', 'x%d' % th, ')',
            '-geometry', '+%d+%d' % (cx - tw//2, BASE - th), '-composite', tmp)
    run('magick', tmp,
        '(', '-size', '%dx%d' % (W, H), 'radial-gradient:rgba(0,0,0,0)-rgba(0,0,0,0.70)', ')',
        '-compose', 'over', '-composite', tmp)
    run('cwebp', '-q', '92', '-m', '6', '-quiet', tmp, '-o', out)
    os.remove(tmp)
    print('%s  %s' % (out, dims(out)))

if __name__ == '__main__':
    if len(sys.argv) < 3: sys.exit(__doc__)
    figs = []
    for spec in sys.argv[2:]:
        name, hp, cxp = spec.split(':')
        figs.append((name, float(hp), float(cxp)))
    build(sys.argv[1], figs)
