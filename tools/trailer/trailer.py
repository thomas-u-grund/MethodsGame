#!/usr/bin/env python3
"""The game's trailer (author, 2026-10-01: "start with GrundArts... more dynamic story... actual in-game
footage... sell it as an educational game about research methods, but super fun").

    .venv-tts/bin/python tools/trailer/trailer.py            -> build/teaser/trailer-16x9.mp4
    .venv-tts/bin/python tools/trailer/trailer.py square     -> build/teaser/trailer-1x1.mp4

Footage: build/teaser/clips/*.mp4 (tools/trailer/record-clip.js) and the Founders' Rap Battle trailer
(build/trailer/founders-rap-battle-trailer.mp4, its own sound for that shot). Music: Marx's beat from the
rap battle (tools/rap/beat.py marx 24 -> build/teaser/beat-marx.wav, 92 BPM): every cut is on a bar.
"""
import os, subprocess, sys, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
WEB, ART, B = os.path.join(ROOT, 'web'), os.path.join(ROOT, 'art'), os.path.join(ROOT, 'build', 'teaser')
SQUARE = len(sys.argv) > 1 and sys.argv[1] == 'square'
W, H = (1080, 1080) if SQUARE else (1920, 1080)
FPS, SR = 30, 48000
BAR = 4 * 60 / 92.0
SERIF = '/System/Library/Fonts/Supplemental/Georgia Bold.ttf'
SANS = '/System/Library/Fonts/Supplemental/Arial Black.ttf'
RAP = os.path.join(ROOT, 'build', 'trailer', 'founders-rap-battle-trailer.mp4')

def F(path, size):
    try: return ImageFont.truetype(path, size)
    except Exception: return ImageFont.truetype(SERIF, size)

# kind, source, start-in-source, bars, caption, options
SHOTS = [
    ('still', 'logo-grundarts.webp', 0, 1.0, None, {'black': True}),
    ('clip', 'keynote.mp4', 10.0, 2.0, None, {}),
    ('card', None, 0, 1.0, 'LEARN RESEARCH METHODS', {}),
    ('still', 'lecture-bg-cheer.webp', 0, 1.0, 'BY PLAYING.', {'big': True}),
    ('still', 'lib-cut-eat.webp', 0, 1.0, 'Check your sources', {}),
    ('clip', RAP, 29.4, 1.5, 'Build a theory', {'own_sound': True}),
    ('still', 'ethics-bg.webp', 0, 0.5, 'Get ethics approval', {}),
    ('clip', 'sampling.mp4', 1.4, 1.0, 'Sample at random', {}),
    ('clip', 'casino.mp4', 6.2, 1.0, 'Don’t p-hack', {}),
    ('clip', 'poster.mp4', 19.0, 1.0, 'Present your poster', {}),
    ('clip', 'keynote.mp4', 40.0, 1.0, 'Survive the keynote', {}),
    ('clip', 'reviewer2.mp4', 3.0, 1.0, 'Survive Reviewer 2', {}),
    ('still', 'poster-board.png', 0, 2.0, None, {'quiet': True}),
    ('still', 'title-screen.webp', 0, 3.0, 'A point-and-click adventure about research methods\nSuper fun. Seriously educational.\nFree in your browser  ·  lostcodebook.org', {'end': True}),
]

def find(name):
    for base in (WEB, ART, B, os.path.join(B, 'clips')):
        p = os.path.join(base, name)
        if os.path.exists(p): return p
    if os.path.exists(name): return name
    raise FileNotFoundError(name)

def cover(im):
    sw, sh = im.size; s = max(W / sw, H / sh)
    im = im.resize((int(sw * s + .5), int(sh * s + .5)), Image.LANCZOS)
    x, y = (im.width - W) // 2, (im.height - H) // 2
    return im.crop((x, y, x + W, y + H))

def caption(fr, text, big=False, end=False):
    fr = fr.convert('RGBA'); ov = Image.new('RGBA', fr.size, (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
    lines = text.split('\n')
    if end:
        f = F(SERIF, 44 if SQUARE else 52); y0 = H * 0.70
        d.rectangle([0, int(y0 - 30), W, H], fill=(8, 6, 12, 190))
        for k, l in enumerate(lines):
            ff = F(SERIF, int((44 if SQUARE else 52) * (1 if k else 1.0)))
            tw = d.textlength(l, font=ff); d.text(((W - tw) / 2, y0 + k * 66), l, font=ff, fill=(243, 223, 166) if k != 1 else (255, 255, 255))
    else:
        size = (120 if big else 78) if not SQUARE else (96 if big else 62)
        f = F(SANS, size); tw = d.textlength(lines[0], font=f)
        x, y = (W - tw) / 2, H * (0.42 if big else 0.07)
        d.rectangle([x - 34, y - 18, x + tw + 34, y + size + 26], fill=(179, 38, 30, 225) if not big else (0, 0, 0, 0))
        for dx, dy in ((5, 5),): d.text((x + dx, y + dy), lines[0], font=f, fill=(0, 0, 0, 160))
        d.text((x, y), lines[0], font=f, fill=(255, 248, 230))
    ov = ov.filter(ImageFilter.GaussianBlur(0.6)) if end else ov
    return Image.alpha_composite(fr, ov).convert('RGB')

def card(text):
    im = Image.new('RGB', (W, H), (12, 10, 16)); d = ImageDraw.Draw(im)
    f = F(SANS, 104 if not SQUARE else 70); tw = d.textlength(text, font=f)
    d.text(((W - tw) / 2, H * 0.43), text, font=f, fill=(243, 223, 166))
    return im

def clip_frames(path, start, n):
    cmd = ['ffmpeg', '-v', 'error', '-ss', str(start), '-i', path, '-frames:v', str(n), '-vf',
           'fps=%d,scale=%d:%d:force_original_aspect_ratio=increase,crop=%d:%d' % (FPS, W, H, W, H), '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-']
    raw = subprocess.run(cmd, capture_output=True, check=True).stdout
    k = len(raw) // (W * H * 3)
    fr = [Image.frombytes('RGB', (W, H), raw[i * W * H * 3:(i + 1) * W * H * 3]) for i in range(k)]
    while len(fr) < n: fr.append(fr[-1])
    return fr

def frames():
    for kind, src, st, bars, cap, o in SHOTS:
        n = int(round(bars * BAR * FPS))
        if kind == 'clip':
            seq = clip_frames(find(src), st, n)
        elif kind == 'card':
            seq = [card(cap)] * n; cap = None
        elif o.get('black'):
            # a logo: whole, centred on black
            lg = Image.open(find(src)).convert('RGBA'); s0 = min(W * 0.8 / lg.width, H * 0.8 / lg.height)
            lg = lg.resize((int(lg.width * s0), int(lg.height * s0)), Image.LANCZOS)
            one = Image.new('RGB', (W, H), (0, 0, 0)); one.paste(lg, ((W - lg.width) // 2, (H - lg.height) // 2), lg)
            seq = [one] * n
        else:
            base = cover(Image.open(find(src)).convert('RGB').resize((int(Image.open(find(src)).width * 1.0), int(Image.open(find(src)).height * 1.0))))
            big = cover(base.resize((int(W * 1.1), int(H * 1.1)), Image.LANCZOS))
            seq = []
            for i in range(n):
                z = 1.0 + 0.08 * i / max(1, n - 1); cw, ch = W / z * 1.0, H / z * 1.0
                bw, bh = base.size; x0, y0 = (bw - cw) / 2, (bh - ch) / 2
                seq.append(base.crop((int(x0), int(y0), int(x0 + cw), int(y0 + ch))).resize((W, H), Image.BILINEAR))
        for i, fr in enumerate(seq):
            if cap: fr = caption(fr, cap, big=o.get('big'), end=o.get('end'))
            a = 1.0
            if o.get('black'): a = min(1, i / (0.5 * FPS), (n - i) / (0.35 * FPS))
            if o.get('end'): a = min(1, i / (0.4 * FPS), (n - i) / (0.9 * FPS))
            if o.get('quiet'): a = min(1, i / (0.5 * FPS))
            if a < 1: fr = Image.blend(Image.new('RGB', (W, H)), fr, max(0, a))
            yield fr

def load(path, start=0.0, dur=None):
    cmd = ['ffmpeg', '-v', 'error', '-ss', str(start), '-i', path] + (['-t', str(dur)] if dur else [])
    raw = subprocess.run(cmd + ['-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()

def soundtrack():
    starts = np.cumsum([0] + [s[3] * BAR for s in SHOTS]); total = starts[-1]
    mix = np.zeros((int(total * SR) + SR, 2), np.float32)
    def put(c, t, g=1.0):
        i = int(t * SR); j = min(len(mix), i + len(c)); mix[i:j] += c[:j - i] * g
    T = {k: (starts[k], starts[k + 1]) for k in range(len(SHOTS))}
    beat = load(os.path.join(B, 'beat-marx.wav'))
    gain = np.zeros(len(mix), np.float32)
    b0, b1 = T[2][0], T[11][1]                     # the beat runs from the title slam to Reviewer 2
    gain[int(b0 * SR):int(b1 * SR)] = 0.8
    for k, s in enumerate(SHOTS):                  # the rap shot plays its own sound
        if s[5].get('own_sound'):
            a, z = T[k]; gain[int(a * SR):int(z * SR)] = 0.0
            put(load(RAP, s[2], z - a), a, 1.0)
    sm = np.ones(int(SR * 0.04)) / int(SR * 0.04); gain = np.convolve(gain, sm, 'same').astype(np.float32)
    n = min(len(beat), len(mix) - int(b0 * SR)); seg = np.zeros_like(mix); seg[int(b0 * SR):int(b0 * SR) + n] = beat[:n]
    mix += seg * gain[:, None]
    # the logo and the cold open: the main theme, then Feldstrom's entrance
    theme = load(os.path.join(WEB, 'title-theme.mp3'), 0, T[1][1])
    put(theme * np.linspace(0, 1, len(theme))[:, None] ** 0.5, 0.0, 0.35)
    put(load(os.path.join(WEB, 'sfx-applause-big.mp3')) if os.path.exists(os.path.join(WEB, 'sfx-applause-big.mp3')) else np.zeros((1, 2), np.float32), T[1][0], 0.5)
    put(load(os.path.join(WEB, 'voices', 'vo-feldstrom-dc50b22c.mp3')), T[1][0] + 1.6, 1.0)   # "Thank you. Hold your applause. No. Don't." 
    # the ending: the narrator, the gong, the title
    put(load(os.path.join(B, 't-n3.wav')), T[12][0] + 0.4, 1.0)
    put(load(os.path.join(B, 't-n4.wav')), T[12][0] + 2.4, 1.0)
    put(load(os.path.join(WEB, 'sfx-gong.mp3')), T[13][0], 0.6)
    put(load(os.path.join(B, 't-n5.wav')), T[13][0] + 1.2, 1.0)
    e = int(total * SR); fade = np.ones(len(mix), np.float32); fade[e - int(1.2 * SR):e] = np.linspace(1, 0, int(1.2 * SR)); fade[e:] = 0
    mix *= fade[:, None]; mix *= 0.9 / max(np.abs(mix).max(), 1e-6)
    return mix[:e], total

def main():
    mix, total = soundtrack()
    tag = '1x1' if SQUARE else '16x9'; audio = os.path.join(B, 'trailer-audio.wav'); video = os.path.join(B, 'trailer-%s.mp4' % tag)
    with wave.open(audio, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes())
    ff = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', '%dx%d' % (W, H), '-r', str(FPS), '-i', '-',
                           '-i', audio, '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k',
                           '-movflags', '+faststart', '-shortest', video], stdin=subprocess.PIPE)
    for fr in frames(): ff.stdin.write(fr.tobytes())
    ff.stdin.close(); ff.wait(); print(video, round(total, 1), 's')

if __name__ == '__main__':
    main()
