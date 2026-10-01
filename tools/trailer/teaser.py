#!/usr/bin/env python3
"""A short teaser for the whole game (author, 2026-10-01: "a teaser that I can post and advertise on
youtube, x and so on"). About 45 seconds, built from the game's own paintings, voices and main theme.

    .venv-tts/bin/python tools/trailer/teaser.py            -> build/teaser/teaser-16x9.mp4 (1920x1080)
    .venv-tts/bin/python tools/trailer/teaser.py square     -> build/teaser/teaser-1x1.mp4  (1080x1080)

The narrator lines are build/teaser/t-n1..5.wav (Chatterbox, lv-marksmith). Every still gets a slow
push-in rendered frame by frame (no zoompan jitter); text is drawn with PIL; the sound is mixed here.
"""
import os, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
WEB, ART, OUT = os.path.join(ROOT, 'web'), os.path.join(ROOT, 'art'), os.path.join(ROOT, 'build', 'teaser')
SQUARE = len(sys.argv) > 1 and sys.argv[1] == 'square'
W, H = (1080, 1080) if SQUARE else (1920, 1080)
FPS, SR = 30, 48000
SERIF = '/System/Library/Fonts/Supplemental/Georgia Bold.ttf'
MONO = '/System/Library/Fonts/Menlo.ttc'

def img(name):
    for base in (WEB, ART, OUT):
        p = os.path.join(base, name)
        if os.path.exists(p): return Image.open(p).convert('RGB')
    raise FileNotFoundError(name)

def font(path, size):
    try: return ImageFont.truetype(path, size)
    except Exception: return ImageFont.load_default()

def caption(im, text, size=64, y=0.82, color=(243, 223, 166), stamp=False):
    d = ImageDraw.Draw(im); f = font(SERIF if not stamp else MONO, size)
    lines = text.split('\n')
    for k, line in enumerate(lines):
        tw = d.textlength(line, font=f); x = (im.width - tw) / 2; yy = im.height * y + k * size * 1.2 - (len(lines) - 1) * size * 0.6
        if stamp:
            pad = size * 0.35
            d.rectangle([x - pad, yy - pad * 0.6, x + tw + pad, yy + size + pad * 0.4], outline=(179, 38, 30), width=6)
            d.text((x, yy), line, font=f, fill=(179, 38, 30))
        else:
            for dx, dy in ((3, 3), (0, 3), (3, 0)): d.text((x + dx, yy + dy), line, font=f, fill=(0, 0, 0))
            d.text((x, yy), line, font=f, fill=color)
    return im

def band(im, y0, y1):
    # a dark band behind the closing words, so they read over a busy painting
    ov = Image.new('RGBA', im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
    d.rectangle([0, int(im.height * y0), im.width, int(im.height * y1)], fill=(10, 8, 14, 175))
    ov = ov.filter(ImageFilter.GaussianBlur(18))
    return Image.alpha_composite(im.convert('RGBA'), ov).convert('RGB')

# (image, seconds, caption, stamp?) -- the cut
SHOTS = [
    ('logo-professorg.webp', 2.4, None, False),
    ('trailer-panel1-deadline.webp', 3.4, None, False),
    ('trailer-panel3-rumor.webp', 4.6, None, False),
    ('lecture-bg-cheer.webp', 1.5, 'QUESTION', True),
    ('il2-handover.webp', 1.4, None, False),
    ('hall-founders-group.webp', 1.5, 'THEORY', True),
    ('trailer-cast-act1.webp', 1.4, None, False),
    ('mensa-bg.webp', 1.5, 'DATA', True),
    ('casino-bg.webp', 1.5, 'EVIDENCE', True),
    ('il5-rush.webp', 1.6, None, False),
    ('keynote/kn-slide-14.png', 4.8, None, False),
    ('il5-offers.webp', 3.0, None, False),
    ('poster-board.png', 3.6, None, False),
    ('title-screen.webp', 7.2, 'Five acts. One research project.\nFree in your browser  ·  lostcodebook.org', False),
]

def frames():
    """Yield (frame image) for the whole teaser; each still pushes in 6 % over its length."""
    for name, dur, cap, stamp in SHOTS:
        src = img(name)
        n = int(round(dur * FPS))
        # fit (cover) to the output aspect once, a little larger than the frame, then push in
        sw, sh = src.size; scale = max(W / sw, H / sh) * 1.08
        base = src.resize((int(sw * scale), int(sh * scale)), Image.LANCZOS)
        for i in range(n):
            t = i / max(1, n - 1); z = 1.0 + 0.06 * t
            ch = (H * 1.08) / z; cw = ch * W / H            # a window of the output's aspect, shrinking: the push-in
            x0, y0 = (base.width - cw) / 2, (base.height - ch) / 2
            fr = base.crop((int(x0), int(y0), int(x0 + cw), int(y0 + ch))).resize((W, H), Image.BILINEAR)
            # fade in from black on each cut (a quick dip), longer at the start and the end
            a = min(1, i / (0.18 * FPS)) if name != 'logo-professorg.webp' else min(1, i / (0.6 * FPS))
            if name == 'title-screen.webp': a = min(a, 1, (n - i) / (0.8 * FPS))
            if cap and not stamp: fr = band(fr, 0.70, 0.95)
            if cap and (not stamp or i > 0.15 * FPS):
                fr = caption(fr, cap, size=(96 if stamp else (46 if SQUARE else 56)), y=(0.42 if stamp else 0.80), stamp=stamp)
            if a < 1: fr = Image.blend(Image.new('RGB', (W, H)), fr, a)
            yield fr

def load(path, start=0.0, dur=None):
    cmd = ['ffmpeg', '-v', 'error', '-ss', str(start), '-i', path] + (['-t', str(dur)] if dur else [])
    raw = subprocess.run(cmd + ['-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()

def soundtrack(total):
    mix = np.zeros((int(total * SR) + SR, 2), np.float32)
    def put(clip, at, gain=1.0):
        i = int(at * SR); j = min(len(mix), i + len(clip)); mix[i:j] += clip[:j - i] * gain
    starts = np.cumsum([0] + [s[1] for s in SHOTS])
    at = dict(zip([s[0] for s in SHOTS], starts))
    # the main theme under everything, ducked under the voices
    theme = load(os.path.join(WEB, 'title-theme.mp3'), 0, total + 1)
    duck = np.ones(len(mix), np.float32) * 0.55
    voices = [('t-n1.wav', at['trailer-panel1-deadline.webp'] + 0.4), ('t-n2.wav', at['trailer-panel3-rumor.webp'] + 0.2),
              ('voices/vo-feldstrom-f09ba15c.mp3', at['keynote/kn-slide-14.png'] + 0.6), ('voices/vo-kira-2b9393f2.mp3', at['il5-offers.webp'] + 0.5),
              ('t-n3.wav', at['poster-board.png'] + 0.3), ('t-n4.wav', at['poster-board.png'] + 1.9), ('t-n5.wav', at['title-screen.webp'] + 0.9)]
    for f, t in voices:
        p = os.path.join(OUT, f) if f.startswith('t-') else os.path.join(WEB, f)
        c = load(p); put(c, t, 1.0)
        i, j = int(t * SR), int((t + len(c) / SR) * SR); duck[max(0, i - SR // 4):j + SR // 4] = 0.22
    k = np.ones(SR // 5) / (SR // 5); duck = np.convolve(duck, k, 'same').astype(np.float32)
    n = min(len(theme), len(mix)); mix[:n] += theme[:n] * duck[:n, None]
    # the act words are stamped, the keynote cheers, the title rings
    put(load(os.path.join(WEB, 'sfx-gong.mp3')), at['title-screen.webp'] + 0.1, 0.45)
    fade = np.ones(len(mix), np.float32); e = int(total * SR); fade[e - int(1.5 * SR):e] = np.linspace(1, 0, int(1.5 * SR)); fade[e:] = 0
    mix *= fade[:, None]
    peak = np.abs(mix).max(); mix *= 0.89 / max(peak, 1e-6)
    return mix[:e]

def main():
    os.makedirs(OUT, exist_ok=True)
    # board 312 with the painted poster, for the closing beat
    bg = Image.open(os.path.join(WEB, 'posters-bg.webp')).convert('RGBA')
    patch = Image.open(os.path.join(WEB, 'poster-312-pinned.webp')).convert('RGBA').resize((468, 565), Image.LANCZOS)
    bg.alpha_composite(patch, (1103, 244)); bg.convert('RGB').crop((700, 120, 1672, 900)).save(os.path.join(OUT, 'poster-board.png'))
    total = sum(s[1] for s in SHOTS)
    tag = '1x1' if SQUARE else '16x9'
    video = os.path.join(OUT, 'teaser-%s.mp4' % tag)
    audio = os.path.join(OUT, 'teaser-audio.wav')
    import wave
    mix = soundtrack(total)
    with wave.open(audio, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes())
    ff = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', '%dx%d' % (W, H), '-r', str(FPS), '-i', '-',
                           '-i', audio, '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k',
                           '-movflags', '+faststart', '-shortest', video], stdin=subprocess.PIPE)
    for fr in frames(): ff.stdin.write(fr.tobytes())
    ff.stdin.close(); ff.wait()
    print(video, round(total, 1), 's')

if __name__ == '__main__':
    main()
