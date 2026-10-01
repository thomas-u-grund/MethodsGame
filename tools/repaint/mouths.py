#!/usr/bin/env python3
"""Mouth (or blink) overlays from an edited sheet.

  sheet:   mouths.py sheet OUT.png path1 path2 ...      -> lays the figures out on one 1672x941 sheet
  extract: mouths.py extract EDITED.png KIND path1[:cx,cy] ...  -> for each figure, an overlay <dir>/<KIND>-<name>.png
           (an optional :cx,cy limits the search to the area around that point, for when a prop moved more than the mouth)

KIND is "mouth" or "blink". For extract, the edited sheet is cut into figures (left to right), each
figure is graded like the finals, scaled to its final sprite and aligned to it (ECC, affine). The
overlay is the edited pixels where they differ from the final, inside the head area, feathered: the
same size as the final sprite, so it lies on it 1:1."""
import os, sys, subprocess
import numpy as np, cv2
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PY = os.path.join(ROOT, '.venv-tts/bin/python')

def load(p): return np.array(Image.open(p).convert('RGBA'))

def sheet(out, paths):
    ims = [Image.open(p).convert('RGBA') for p in paths]
    W, H, pad = 1672, 941, 40
    hmax = H - 2 * pad
    sc = min(hmax / max(i.height for i in ims), (W - pad * (len(ims) + 1)) / sum(i.width for i in ims))
    ims = [i.resize((max(1, int(i.width * sc)), max(1, int(i.height * sc))), Image.LANCZOS) for i in ims]
    gap = (W - sum(i.width for i in ims)) / (len(ims) + 1)
    s = Image.new('RGBA', (W, H), (0, 0, 0, 0)); x = gap
    for i in ims: s.alpha_composite(i, (int(x), H - pad - i.height)); x += i.width + gap
    s.save(out); print(out, 'scale', round(sc, 3))

def extract(edited, kind, paths):
    tmp = '/tmp/cb-mouths'; os.makedirs(tmp, exist_ok=True)
    hints = [tuple(map(int, q.split(':')[1].split(','))) if ':' in q else None for q in paths]   # cx,cy or cx,cy,rx,ry (a fixed ellipse)
    paths = [q.split(':')[0] for q in paths]
    names = [f'f{k}' for k in range(len(paths))]
    subprocess.run([PY, os.path.join(ROOT, 'tools/repaint/cut.py'), edited, tmp] + names, check=True, stdout=subprocess.DEVNULL)
    for nm, p, hint in zip(names, paths, hints):
        subprocess.run([PY, os.path.join(ROOT, 'tools/repaint/grade.py'), f'{tmp}/new-{nm}.png', f'{tmp}/g-{nm}.png'], check=True)
        F = load(p); E = load(f'{tmp}/g-{nm}.png')
        h, w = F.shape[:2]
        E = cv2.resize(E, (w, h), interpolation=cv2.INTER_AREA)
        fg = cv2.cvtColor(F[:, :, :3], cv2.COLOR_RGB2GRAY).astype('float32') / 255
        eg = cv2.cvtColor(E[:, :, :3], cv2.COLOR_RGB2GRAY).astype('float32') / 255
        warp = np.eye(2, 3, dtype='float32')
        try:
            _, warp = cv2.findTransformECC(fg, eg, warp, cv2.MOTION_AFFINE,
                                           (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 200, 1e-6), (F[:, :, 3] > 128).astype('uint8'), 5)
        except cv2.error as e:
            print(os.path.basename(p), 'ECC failed, unaligned:', e)
        Ea = cv2.warpAffine(E, warp, (w, h), flags=cv2.INTER_LINEAR + cv2.WARP_INVERSE_MAP, borderMode=cv2.BORDER_CONSTANT)
        # where did the edit change the figure? search the head area only
        d = np.abs(Ea[:, :, :3].astype(float) - F[:, :, :3].astype(float)).sum(2) * (F[:, :, 3] > 128)
        d = cv2.GaussianBlur(d.astype('float32'), (0, 0), max(2, w / 120))
        band = np.zeros_like(d); top = int(h * (0.45 if h / w < 1.6 else 0.30)); band[:top] = 1
        mo = os.path.join(os.path.dirname(p), 'mouth-' + os.path.basename(p).replace('final-', ''))
        mw = None
        if kind == 'blink' and not hint and os.path.exists(mo):
            # the eyes sit just above this pose's own mouth overlay: search only that strip
            ma = load(mo)[:, :, 3].astype(float); ys, xs = np.nonzero(ma > 128)
            if len(ys):
                my, mx, mw = int(ys.mean()), int(xs.mean()), xs.max() - xs.min()   # mw: the mouth's width, the face's scale
                band[:] = 0; band[max(0, my - int(1.4 * mw)):max(0, my - int(0.3 * mw)), max(0, mx - int(1.3 * mw)):mx + int(1.3 * mw)] = 1
        if hint:                                   # a face position given by hand: search only near it
            r = int(w * (0.12 if kind == 'blink' else 0.06)); ry_ = int(w * 0.04) if kind == 'blink' else r
            band[:] = 0; band[max(0, hint[1] - ry_):hint[1] + ry_, max(0, hint[0] - r):hint[0] + r] = 1
            if len(hint) == 4: band[:] = 1   # fixed ellipse: only make sure something is found
        d *= band
        if d.max() < 5:
            print(os.path.basename(p), 'no change found'); continue
        thr = d > d.max() * (0.2 if kind == 'blink' else 0.35)
        n, lab, st, cen = cv2.connectedComponentsWithStats(thr.astype('uint8'), 8)
        k = 1 + int(np.argmax([d[lab == i].sum() for i in range(1, n)]))
        x, y, bw, bh = st[k, :4]
        # centre on the strongest change inside that blob; never larger than a mouth
        blob = np.where(lab == k, d, 0); cy, cx = np.unravel_index(int(np.argmax(blob)), blob.shape)
        rx = float(np.clip(bw * 0.75, w * 0.035, w * 0.075)); ry = float(np.clip(bh * 0.8, w * 0.025, w * 0.07))
        if kind == 'blink':
            # both eyes: the strongest change plus the next one beside it, at about the same height
            sums = sorted(((d[lab == i].sum(), i) for i in range(1, n)), reverse=True)
            x0, y0, x1, y1 = x, y, x + bw, y + bh
            for sm, i in sums[1:6]:
                xi, yi, wi, hi = st[i, :4]
                if sm > 0.08 * sums[0][0] and abs((yi + hi / 2) - (y + bh / 2)) < w * 0.06 and abs((xi + wi / 2) - (x + bw / 2)) < w * 0.3:
                    x0, y0, x1, y1 = min(x0, xi), min(y0, yi), max(x1, xi + wi), max(y1, yi + hi)
            cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
            rx, ry = max((x1 - x0) / 2 + w * 0.03, w * 0.06), max((y1 - y0) / 2 + w * 0.02, w * 0.03)
            # never more than a pair of eyes: capped by the mouth's width when known, else by the sprite's
            rx, ry = (min(rx, 1.0 * mw), min(ry, 0.4 * mw)) if mw else (min(rx, w * 0.09), min(ry, w * 0.045))
        if hint and len(hint) == 4: cx, cy, rx, ry = hint
        m = np.zeros((h, w), 'float32'); cv2.ellipse(m, (int(cx), int(cy)), (int(rx), int(ry)), 0, 0, 360, 1, -1)
        m = np.clip(cv2.GaussianBlur(m, (0, 0), max(2, rx / 5)) * 1.8, 0, 1) * (F[:, :, 3] / 255.0)   # solid inside, soft only at the rim
        # the edit laid over the final, so the edit's transparent fringe never shows its stray colours
        ea = np.clip(Ea[:, :, 3:4].astype(float) / 255 * 4, 0, 1)   # a half-transparent edit (a glass screen) still counts as the edit
        out = F.copy(); out[:, :, :3] = (Ea[:, :, :3] * ea + F[:, :, :3] * (1 - ea)).astype('uint8')
        out[:, :, 3] = (m * 255).clip(0, 255).astype('uint8')
        d0, base = os.path.split(p)
        name = base.replace('final-', '').replace('.png', '')
        dst = os.path.join(d0, f'{kind}-{name}.png'); Image.fromarray(out).save(dst)
        # a check image: the final with the overlay on it, the region outlined
        chk = Image.fromarray(F).copy(); chk.alpha_composite(Image.fromarray(out))
        chk = np.array(chk); cv2.ellipse(chk, (int(cx), int(cy)), (int(rx), int(ry)), 0, 0, 360, (255, 0, 255, 255), 1)
        Image.fromarray(chk).crop((max(0, int(cx - 3 * rx)), max(0, int(cy - 3 * ry)), min(w, int(cx + 3 * rx)), min(h, int(cy + 3 * ry)))).save(os.path.join(d0, f'check-{kind}-{name}.png'))
        print(name, 'region', int(cx), int(cy), int(rx), int(ry))

if __name__ == '__main__':
    if sys.argv[1] == 'sheet': sheet(sys.argv[2], sys.argv[3:])
    else: extract(sys.argv[2], sys.argv[3], sys.argv[4:])
