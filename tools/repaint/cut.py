#!/usr/bin/env python3
"""Cut a generated sheet into N figures, left to right, and save them as DIR/new-<name>.png.
usage: cut.py SHEET.png DIR name1 name2 ...
Figures are found as connected shapes in the alpha mask, not by empty columns, so an arm or a prop
that reaches over another figure's column stays with its owner. Small loose bits (a sheet of paper,
a pointer's dot) join the nearest figure. If two figures touch, the largest shape is split at its
narrowest column."""
import sys
import numpy as np
import cv2
from PIL import Image

sheet, d, names = sys.argv[1], sys.argv[2], sys.argv[3:]
N = len(names)
im = Image.open(sheet).convert('RGBA'); rgba = np.array(im)
mask = (rgba[:, :, 3] > 100).astype('uint8')
k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
joined = cv2.dilate(mask, k)                      # bridge hairline gaps inside one figure
n, lab, stats, cent = cv2.connectedComponentsWithStats(joined, 8)
comps = [i for i in range(1, n) if stats[i, cv2.CC_STAT_AREA] > 30]
comps.sort(key=lambda i: -stats[i, cv2.CC_STAT_AREA])
big = comps[:N]
# split a merged pair while there are fewer large shapes than figures
while len(big) < N or (len(comps) >= N and stats[comps[N - 1], cv2.CC_STAT_AREA] < 0.15 * stats[comps[0], cv2.CC_STAT_AREA] and len(big) < N):
    break
labels = lab.copy()
def area(i): return int((labels == i).sum())
big = [i for i in big if area(i) > 0.12 * max(area(j) for j in big)]
next_id = labels.max() + 1
while len(big) < N:
    i = max(big, key=area); ys, xs = np.where(labels == i); x0, x1 = xs.min(), xs.max()
    cols = np.bincount(xs - x0, minlength=x1 - x0 + 1)
    q = (x1 - x0) // 4; m = x0 + q + int(np.argmin(cols[q: len(cols) - q]))
    sel = (labels == i) & (np.arange(labels.shape[1])[None, :] >= m)
    labels[sel] = next_id; big.append(next_id); next_id += 1
# small pieces join the nearest big figure
for i in comps:
    if i in big: continue
    cy, cx = cent[i][1], cent[i][0]
    best = min(big, key=lambda b: np.hypot(*(np.array(np.where(labels == b)).mean(1) - [cy, cx])))
    labels[labels == i] = best
big.sort(key=lambda b: np.where(labels == b)[1].mean())
for b, nm in zip(big, names):
    own = (labels == b) & (mask > 0)
    own = cv2.dilate(own.astype('uint8'), k) & (rgba[:, :, 3] > 0)   # keep the soft edge pixels
    out = rgba.copy(); out[:, :, 3] = np.where(own > 0, rgba[:, :, 3], 0)
    ys, xs = np.where(out[:, :, 3] > 100)
    c = Image.fromarray(out).crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
    c.save(f'{d}/new-{nm}.png'); print(nm, c.size)
