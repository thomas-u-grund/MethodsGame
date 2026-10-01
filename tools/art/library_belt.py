"""The Library's conveyor belt, THE LITERATURE, made to run (author, 2026-09-30: "the conveyor belt in
library does not move... but narrator says so").

From web/library-bg.webp this cuts three layers, drawn by a canvas in the room (lb_belt):
  lib-belt-strip.webp  the belt's stacks and tread, straightened along the belt's slope (RGBA);
                       the room scrolls it column by column, following the slope back into place
  lib-belt-clean.webp  the belt region with the stacks painted out (OpenCV inpainting), drawn under it
  lib-belt-press.webp  the press and the stamping arm's foot, drawn over it, so stacks pass underneath
    .venv-tts/bin/python tools/art/library_belt.py     # prints the geometry the room code needs
"""
import numpy as np, cv2, json
from PIL import Image
im = np.array(Image.open('web/library-bg.webp').convert('RGB')); H, W, _ = im.shape
PTS = [(24,30.4),(35,31.0),(45,31.7),(54,33.1),(60,33.6),(67,34.4),(72,35.0),(78,35.6)]   # tread, (x%, y%)
UP, DN = 100, 14                 # strip rows above / below the traced line
XA, XB = 24, 78                  # the running stretch, in % of width
yt = np.round(np.interp(np.arange(W) / W * 100, [p[0] for p in PTS], [p[1] for p in PTS]) / 100 * H).astype(int)
xa, xb = int(XA / 100 * W), int(XB / 100 * W)
# the stacks: (x from %, x to %, top strip row); they stand on the tread at row ~92
ITEMS = [(24.6,29,50),(29,31.3,40),(33.8,39.1,48),(42.3,48.1,50),(48.7,53.4,65),(53.2,59.2,70),(59.3,64.2,66),(67,72,66),(72.2,77.2,70)]
TREAD = (86, UP + DN)            # strip rows of the moving tread
# the press and the arm's foot: in front of the stacks down to these strip rows
PRESS = [(61.2,65.8,66),(54.6,57.6,70)]

n = UP + DN
strip = np.zeros((n, xb - xa, 4), np.uint8)
hole = np.zeros((H, W), np.uint8)
for x in range(xa, xb):
    y0 = yt[x] - UP
    strip[:, x - xa, :3] = im[y0:y0 + n, x]
    p = x / W * 100
    a = np.zeros(n, np.uint8); a[TREAD[0]:TREAD[1]] = 255
    for l, r, top in ITEMS:
        if l <= p < r:
            a[top:94] = 255; hole[y0 + top - 2:y0 + 95, x] = 255
    strip[:, x - xa, 3] = a
# a soft edge on the cut-outs, so they do not look pasted
alpha = cv2.GaussianBlur(strip[:, :, 3], (3, 3), 0); strip[:, :, 3] = np.maximum(alpha, strip[:, :, 3] * (alpha > 250))
hole = cv2.dilate(hole, np.ones((5, 5), np.uint8))
clean = cv2.inpaint(im[:, :, ::-1].copy(), hole, 7, cv2.INPAINT_TELEA)[:, :, ::-1]
cy0, cy1 = int(yt[xa:xb].min()) - UP, int(yt[xa:xb].max()) + DN
Image.fromarray(clean[cy0:cy1, xa:xb]).save('web/lib-belt-clean.webp', quality=88)
Image.fromarray(strip, 'RGBA').save('web/lib-belt-strip.webp', quality=88)
# the press: the original pixels above the rows given, with the same slope
px0, px1 = int(54.4 / 100 * W), int(66 / 100 * W)
press = np.zeros((cy1 - cy0, px1 - px0, 4), np.uint8)
for x in range(px0, px1):
    p = x / W * 100
    for l, r, bot in PRESS:
        if l <= p < r:
            yb = yt[x] - UP + bot
            press[:yb - cy0, x - px0, :3] = im[cy0:yb, x]; press[:yb - cy0, x - px0, 3] = 255
Image.fromarray(press, 'RGBA').save('web/lib-belt-press.webp', quality=88)
print(json.dumps({'W': W, 'H': H, 'pts': PTS, 'up': UP, 'xa': xa, 'xb': xb, 'clean': [xa, cy0], 'press': [px0, cy0]}))
