#!/usr/bin/env python3
"""The DJ behind the DJ table in the Hall of Founders: two full-frame transparent layers
(web/dj-a.webp, web/dj-b.webp) that the battle switches between on the beat.

    .venv-tts/bin/python tools/rap/dj_layers.py [preview.png]

Source: art/rap/dj/dj-poses-v1.png (ChatGPT; two poses side by side on transparent). Each
pose is lined up on his lanyard badge, scaled to the Hall's depth, placed behind the table,
and then everything that stands in front of him in the painting -- the laptop lid and base,
the amplifier and the table itself -- is cut out of him, so the painted laptop and amp stay
in front. Those shapes are simple (a quadrilateral, a box, a straight table edge), so the
mask is drawn from coordinates read off hall-bg.webp rather than painted by hand.
"""
import sys, os
import numpy as np
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC = os.path.join(ROOT, 'art', 'rap', 'dj', 'dj-poses-v1.png')
BG = os.path.join(ROOT, 'web', 'hall-bg.webp')
SCALE = 0.235                # pose pixels -> Hall pixels
BADGE = {'a': 492, 'b': 387}   # badge centre x in each half of the source, to line the poses up
CENTRE_X, BOTTOM_Y = 700, 732  # where his badge line sits in the Hall, and where his hips end (behind the table)

# what is in front of him, in hall-bg.webp pixels
LAPTOP_LID = [(579, 621), (660, 625), (676, 692), (592, 691)]
LAPTOP_BASE = [(561, 681), (724, 682), (724, 694), (561, 694)]
AMP = (730, 611, 871, 703)
AMP_HANDLE = (785, 605, 843, 617)
TABLE_TOP = [(0, 693), (1672, 697)]   # everything below this line

def front_mask(w, h, k=4):
    m = Image.new('L', (w * k, h * k), 0); d = ImageDraw.Draw(m)
    s = lambda pts: [(x * k, y * k) for x, y in pts]
    d.polygon(s(LAPTOP_LID), fill=255); d.polygon(s(LAPTOP_BASE), fill=255)
    d.rounded_rectangle([AMP[0] * k, AMP[1] * k, AMP[2] * k, AMP[3] * k], radius=5 * k, fill=255)
    d.rounded_rectangle([AMP_HANDLE[0] * k, AMP_HANDLE[1] * k, AMP_HANDLE[2] * k, AMP_HANDLE[3] * k], radius=4 * k, fill=255)
    (x0, y0), (x1, y1) = TABLE_TOP
    d.polygon(s([(x0, y0), (x1, y1), (x1, h), (x0, h)]), fill=255)
    return np.array(m.resize((w, h), Image.LANCZOS)).astype(np.float32) / 255

def main():
    src = Image.open(SRC).convert('RGBA'); half = src.width // 2
    bg = Image.open(BG).convert('RGBA'); W, H = bg.size
    fm = front_mask(W, H)
    out = {}
    for key, box in (('a', (0, 0, half, src.height)), ('b', (half, 0, src.width, src.height))):
        pose = src.crop(box)
        pw, ph = int(pose.width * SCALE), int(pose.height * SCALE)
        pose = pose.resize((pw, ph), Image.LANCZOS)
        layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        layer.alpha_composite(pose, (int(CENTRE_X - BADGE[key] * SCALE), BOTTOM_Y - ph))
        a = np.array(layer); a[:, :, 3] = (a[:, :, 3] * (1 - fm)).astype(np.uint8)
        out[key] = Image.fromarray(a)
        out[key].save(os.path.join(ROOT, 'art', 'rap', 'dj', 'dj-%s.png' % key))
    if len(sys.argv) > 1:
        prev = bg.copy(); prev.alpha_composite(out['a'])
        prev2 = bg.copy(); prev2.alpha_composite(out['b'])
        both = Image.new('RGB', (900, 300))
        both.paste(prev.crop((520, 480, 970, 780)).convert('RGB'), (0, 0))
        both.paste(prev2.crop((520, 480, 970, 780)).convert('RGB'), (450, 0))
        both.resize((1350, 450)).save(sys.argv[1])
    print('dj-a / dj-b written')

if __name__ == '__main__':
    main()
