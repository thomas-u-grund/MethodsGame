#!/usr/bin/env python3
"""Point an existing rig's parts.json at a repainted sheet with the same layout.
usage: refit.py <name> NEWSHEET.png
Finds the six pieces (connected shapes, left to right), maps them to the parts in their old left-to-right
order, writes the new boxes into <name>/parts.json (crop fractions, target heights and joints are kept)
and copies the sheet to <name>/sheet.png. The old sheet and config are kept as *.old."""
import json, shutil, sys
import numpy as np
import cv2
from PIL import Image

name, new = sys.argv[1], sys.argv[2]
cfg = json.load(open(f'{name}/parts.json'))
order = sorted(cfg['parts'], key=lambda k: cfg['parts'][k][2])
a = (np.array(Image.open(new).convert('RGBA'))[:, :, 3] > 100).astype('uint8')
a = cv2.dilate(a, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)))
n, lab, st, _ = cv2.connectedComponentsWithStats(a, 8)
big = sorted([i for i in range(1, n)], key=lambda i: -st[i, cv2.CC_STAT_AREA])[:len(order)]
if len(big) < len(order): sys.exit(f'found {len(big)} pieces, need {len(order)}')
big.sort(key=lambda i: st[i, cv2.CC_STAT_LEFT])
shutil.copy(f'{name}/parts.json', f'{name}/parts.json.old'); shutil.copy(f'{name}/sheet.png', f'{name}/sheet.png.old')
for part, i in zip(order, big):
    x, y, w, h = (int(st[i, k]) for k in (cv2.CC_STAT_LEFT, cv2.CC_STAT_TOP, cv2.CC_STAT_WIDTH, cv2.CC_STAT_HEIGHT))
    old = cfg['parts'][part]; print(part, 'old', old[:4], 'new', [w, h, x, y])
    cfg['parts'][part] = [w, h, x, y] + old[4:]
json.dump(cfg, open(f'{name}/parts.json', 'w'))
shutil.copy(new, f'{name}/sheet.png')
