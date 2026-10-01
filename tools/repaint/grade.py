#!/usr/bin/env python3
"""Harmonise a figure with the cast: warm the neutral greys and navies, tame the highlights.
usage: grade.py IN.png OUT.png [amount=1.0]
Low-chroma pixels (grey cloth, charcoal, white) get a warm push in Lab; saturated colours are left
almost alone, so faces, ties and props keep their colour. Highlights above L 215 are compressed and
turned cream. The same treatment for every figure keeps the cast consistent."""
import sys
import numpy as np
import cv2
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]; amount = float(sys.argv[3]) if len(sys.argv) > 3 else 1.0
im = np.array(Image.open(src).convert('RGBA'))
lab = cv2.cvtColor(im[:, :, :3], cv2.COLOR_RGB2LAB).astype(float)
L, A, B = lab[..., 0], lab[..., 1] - 128, lab[..., 2] - 128
chroma = np.hypot(A, B)
neutral = np.clip(1 - chroma / 28, 0, 1) * amount         # 1 for greys, 0 for colours
cool = np.clip(-B / 20, 0, 1) * amount                     # navies and blue-greys
A += 3.0 * neutral + 2.0 * cool
B += 9.0 * neutral + 8.0 * cool
hi = L > 215
L = np.where(hi, 215 + (L - 215) * 0.55, L)
B = np.where(hi, np.maximum(B, 12 * amount), B)
lab = np.dstack([L, A + 128, B + 128])
rgb = cv2.cvtColor(np.clip(lab, 0, 255).astype('uint8'), cv2.COLOR_LAB2RGB)
Image.fromarray(np.dstack([rgb, im[:, :, 3]])).save(dst)
