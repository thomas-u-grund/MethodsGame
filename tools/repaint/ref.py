#!/usr/bin/env python3
"""Reference row of current sprites for a repaint prompt.
usage: ref.py OUT.png name1 name2 ...   (names as in web/, without .webp; same scale, true relative heights)"""
import sys
from PIL import Image
out, names = sys.argv[1], sys.argv[2:]
ims = []
for n in names:
    im = Image.open(f'web/{n}.webp').convert('RGBA'); ims.append(im.crop(im.getchannel('A').point(lambda v: 255 if v > 100 else 0).getbbox()))
H = 700; mh = max(i.height for i in ims); pad = 60
ims = [i.resize((max(1, int(i.width * H / mh)), max(1, int(i.height * H / mh))), Image.LANCZOS) for i in ims]
W = sum(i.width for i in ims) + pad * (len(ims) + 1)
row = Image.new('RGB', (W, H + 2 * pad), (245, 240, 230)); x = pad
for i in ims: row.paste(i, (x, pad + H - i.height), i); x += i.width + pad
row.save(out); print(out, row.size)
