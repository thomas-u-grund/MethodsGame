#!/usr/bin/env python3
"""Build the Survey Lab's discharged-patient chart icons.

The four questions are carried out of the Survey Lab as inventory items, so they need
icons. They are deliberately NOT painted props like the rest of the inventory: in the ward
they are hanging chart cards -- cream board, dark rule, a steel clip, a green discharge
stamp -- and the icon is the same object, so it reads as "the thing I just unclipped from
the bed" rather than as a new object that happens to be about the same question.

    python3 tools/art/chartcard.py

Writes web/icon-qcard-<name>.png for each CARD below.
"""
import os, subprocess

W, H = 460, 560
CREAM, INK, RULE, GREEN = '#f3ead3', '#2a1d10', '#b9a67f', '#2f7d3a'

# id, header, the question as it reads once discharged, the discharge stamp
CARDS = [
    ('satisfaction', 'PATIENT 1', 'How satisfied\nare you with\nyour studies?', 'SEPARATED'),
    ('policy',       'PATIENT 2', 'How, if at all,\nhas the policy\naffected your\nstudent life?', 'NEUTRAL'),
    ('lectures',     'PATIENT 3', 'In the last four\nweeks, how many\nlectures did you\nnot attend?', 'TIME WINDOW'),
    ('support',      'PATIENT 4', 'I support the new\nattendance policy.\n☐ ☐ ☐ ☐ ☐', '5-POINT SCALE'),
]

SERIF = 'Georgia'
MONO  = 'Courier-Bold'

def run(*a): subprocess.run(list(a), check=True)

def build(name, head, body, stamp):
    out = os.path.join('web', 'icon-qcard-%s.png' % name)
    tmp = out + '.tmp.png'
    # the card, very slightly warped so it does not read as a UI rectangle
    run('magick', '-size', '%dx%d' % (W - 40, H - 60), 'xc:none',
        '-fill', CREAM, '-stroke', INK, '-strokewidth', '5',
        '-draw', 'roundrectangle 4,4 %d,%d 12,12' % (W - 49, H - 69), tmp)
    # header rule + number + the red cross the ward stencils on everything
    run('magick', tmp,
        '-font', MONO, '-pointsize', '30', '-fill', INK,
        '-annotate', '+34+62', head,
        # a drawn red cross. Typed as a glyph it was simply absent from the font, and a
        # missing glyph fails silently -- nothing on the card, no error, no clue why.
        '-fill', '#b3261e', '-stroke', 'none',
        '-draw', 'rectangle %d,44 %d,58' % (W - 106, W - 72),
        '-draw', 'rectangle %d,34 %d,68' % (W - 96, W - 82),
        '-stroke', RULE, '-strokewidth', '3',
        '-draw', 'line 30,84 %d,84' % (W - 70), tmp)
    # the question itself
    run('magick', tmp, '-font', SERIF, '-pointsize', '32', '-fill', INK, '-stroke', 'none',
        '-annotate', '+34+134', body, tmp)
    # the five ordered boxes, drawn rather than typed for the same reason as the cross
    if name == 'support':
        for i in range(5):
            x = 36 + i * 62
            run('magick', tmp, '-fill', 'none', '-stroke', INK, '-strokewidth', '4',
                '-draw', 'rectangle %d,232 %d,278' % (x, x + 44), tmp)
    # discharge stamp, bottom left, green because it is cleared
    run('magick', tmp, '-fill', GREEN, '-stroke', 'none',
        '-draw', 'roundrectangle 30,%d %d,%d 4,4' % (H - 122, min(W - 70, 40 + 20 * len(stamp)), H - 84),
        '-font', MONO, '-pointsize', '22', '-fill', 'white',
        '-annotate', '+40+%d' % (H - 95), stamp, tmp)
    # the steel clip at the top, which is what makes it a chart and not a postcard
    run('magick', tmp,
        '-fill', '#8d8a82', '-stroke', '#3d3d3d', '-strokewidth', '3',
        '-draw', 'roundrectangle %d,-6 %d,34 5,5' % (W / 2 - 78, W / 2 - 78 + 120), tmp)
    # a little rotation and a drop shadow, so it sits in the tray like the painted icons
    run('magick', tmp, '-background', 'none', '-rotate', '-4',
        '(', '+clone', '-background', 'black', '-shadow', '60x9+0+8', ')',
        '+swap', '-background', 'none', '-layers', 'merge', '+repage',
        '-resize', '%dx%d' % (W, H), out)
    os.remove(tmp)
    print(out)

if __name__ == '__main__':
    for c in CARDS:
        build(*c)
