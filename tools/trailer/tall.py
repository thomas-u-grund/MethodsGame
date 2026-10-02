#!/usr/bin/env python3
"""A 2:3 portrait poster from ChatGPT -> 1080x1920 without cutting anything: the whole picture across the width,
the small gaps above and below filled with a blurred, darkened stretch of the picture's own edges.
    tall.py SRC.png OUT.png"""
import sys
from PIL import Image, ImageFilter
src, out = sys.argv[1], sys.argv[2]
W, H = 1080, 1920
im = Image.open(src).convert('RGB'); fg = im.resize((W, int(im.height * W / im.width)), Image.LANCZOS)
bg = im.resize((W, H), Image.LANCZOS).filter(ImageFilter.GaussianBlur(40)).point(lambda v: v * .55)
y = (H - fg.height) // 2; bg.paste(fg, (0, y))
# soften the seams
for k in range(24):
    a = k / 24
    for yy in (y + k, y + fg.height - 1 - k):
        row = bg.crop((0, yy, W, yy + 1)); blur = row.filter(ImageFilter.GaussianBlur(2))
bg.save(out); print(out, fg.height, 'px picture,', y, 'px fill top and bottom')
