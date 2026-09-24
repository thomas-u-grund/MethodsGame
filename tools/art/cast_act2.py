#!/usr/bin/env python3
"""Act II's STARRING poster (web/il2-cast.webp): swap the Hall clerk for Professor G.

    .venv-tts/bin/python tools/art/cast_act2.py

The poster was composited from room sprites (WP-1.8), with the Hall represented by the
clerk. Since the rap battle the Hall's character is Professor G and the clerk no longer
appears there, so: fill the clerk's patch from the backdrop around it (the backdrop is a
smooth radial gradient, so a per-row blend between the two edge columns is invisible),
then stand Professor G in the same spot, on the same floor line, with a contact shadow.
Keeps the original as art/interludes/act2/il2-cast-orig.webp.
"""
import os, shutil
import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
POSTER = os.path.join(ROOT, 'web', 'il2-cast.webp')
ORIG = os.path.join(ROOT, 'art', 'interludes', 'act2', 'il2-cast-orig.webp')
X0, X1, Y0, Y1 = 276, 470, 380, 900          # the clerk and his shadow, in poster pixels
FOOT_X, FOOT_Y, HEIGHT = 371, 876, 500       # where Professor G stands

def main():
    if not os.path.exists(ORIG): shutil.copy(POSTER, ORIG)
    im = np.array(Image.open(ORIG).convert('RGB')).astype(np.float32)
    left, right = im[Y0:Y1, X0 - 3:X0].mean(1), im[Y0:Y1, X1:X1 + 3].mean(1)
    t = np.linspace(0, 1, X1 - X0)[None, :, None]
    im[Y0:Y1, X0:X1] = left[:, None, :] * (1 - t) + right[:, None, :] * t
    out = Image.fromarray(im.clip(0, 255).astype(np.uint8)).convert('RGBA')
    # contact shadow, then the sprite
    sh = Image.new('L', out.size, 0)
    from PIL import ImageDraw
    ImageDraw.Draw(sh).ellipse([FOOT_X - 70, FOOT_Y - 12, FOOT_X + 70, FOOT_Y + 12], fill=150)
    sh = sh.filter(ImageFilter.GaussianBlur(9))
    out.alpha_composite(Image.merge('RGBA', [Image.new('L', out.size, 0)] * 3 + [sh]))
    g = Image.open(os.path.join(ROOT, 'web', 'sprite-profg.png')).convert('RGBA')
    bb = g.getbbox(); g = g.crop(bb)
    g = g.resize((round(g.width * HEIGHT / g.height), HEIGHT), Image.LANCZOS)
    # the other four stand in the poster's warm, dim stage light; a white hoodie glows otherwise
    a = np.array(g).astype(np.float32)
    a[..., :3] *= np.array([0.80, 0.72, 0.60])
    g = Image.fromarray(a.clip(0, 255).astype(np.uint8), 'RGBA')
    out.alpha_composite(g, (FOOT_X - g.width // 2, FOOT_Y - HEIGHT + 4))
    out.convert('RGB').save(POSTER, quality=88)
    print('wrote', POSTER)

if __name__ == '__main__':
    main()
