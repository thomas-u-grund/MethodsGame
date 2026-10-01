#!/usr/bin/env python3
"""Remove the orange haze ChatGPT leaves around transparent-background figures.
usage: defringe.py IN.png OUT.png [cut=48]
- alpha below `cut` (the haze) goes to 0, the rest is remapped to 0..255 (a slightly tighter edge);
- semi-transparent edge pixels are pulled toward the dark-brown outline colour, so no warm rim shows."""
import sys
import numpy as np
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]; cut = float(sys.argv[3]) if len(sys.argv) > 3 else 48
im = np.array(Image.open(src).convert('RGBA')).astype(float)
a = im[:, :, 3]
na = np.clip((a - cut) / (255 - cut), 0, 1)
edge = 1 - na                        # 0 inside, 1 at the outer rim
k = (edge ** 0.7)[..., None] * (na > 0)[..., None]
outline = np.array([42, 28, 20], float)
im[:, :, :3] = im[:, :, :3] * (1 - k) + outline * k
im[:, :, 3] = na * 255
out = Image.fromarray(im.clip(0, 255).astype('uint8'))
bb = out.getchannel('A').point(lambda v: 255 if v > 0 else 0).getbbox()
out.crop(bb).save(dst)
