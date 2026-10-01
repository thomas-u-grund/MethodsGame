#!/usr/bin/env python3
"""Tone down the painted orange/gold rim light just inside a figure's silhouette.
usage: derim.py IN.png OUT.png [band=10] [strength=0.85]
Inside a band along the alpha edge, warm (orange/yellow), bright, saturated pixels are pulled toward
the darker colour of the figure a little further in. Run after defringe.py."""
import sys
import numpy as np
from PIL import Image, ImageFilter
src, dst = sys.argv[1], sys.argv[2]
band = int(sys.argv[3]) if len(sys.argv) > 3 else 10
strength = float(sys.argv[4]) if len(sys.argv) > 4 else 0.85
img = Image.open(src).convert('RGBA'); im = np.array(img).astype(float)
alpha = img.getchannel('A').point(lambda v: 255 if v > 128 else 0)
# distance to the edge, approximately: how many erosions keep the pixel
dist = np.zeros(alpha.size[::-1]); m = alpha
for d in range(1, band + 8):
    m = m.filter(ImageFilter.MinFilter(3)); dist += (np.array(m) > 0)
rgb = im[:, :, :3]
inner_mask = (dist > band).astype(float)
def blur(x, rad):
    import cv2; return cv2.GaussianBlur(x.astype('float32'), (0, 0), rad)
w = blur(inner_mask, band * 1.2) + 1e-6
inner = np.nan_to_num(np.stack([blur(rgb[..., k] * inner_mask, band * 1.2) / w for k in range(3)], -1))
in_band = ((dist > 0) & (dist <= band)).astype(float) * np.clip(1 - dist / (band + 1), 0, 1) ** 0.5
# the rim is yellower and brighter than the figure just inside it; skin and gold props are not (they are
# just as warm inside), so they are left alone
def yel(x): return (x[..., 0] + x[..., 1]) / 2 - x[..., 2]
rim = np.clip((yel(rgb) - yel(inner) - 18) / 45, 0, 1) * np.clip((rgb.mean(-1) - inner.mean(-1) + 10) / 40, 0, 1)
k = np.clip(in_band * rim * strength * np.clip((w - 0.015) / 0.06, 0, 1), 0, 1)[..., None]   # only where there is interior nearby
# toward the inner colour, at the pixel's own (slightly lowered) brightness, so the shading survives
lum = rgb.mean(-1, keepdims=True); ilum = inner.mean(-1, keepdims=True) + 1e-6
target = np.clip(inner * (np.minimum(lum * 0.85, ilum * 1.15) / ilum), 0, 255)
im[:, :, :3] = rgb * (1 - k) + target * k
Image.fromarray(im.clip(0, 255).astype('uint8')).save(dst)
print(dst, 'pixels changed >10%:', int((k[..., 0] > .1).sum()))
