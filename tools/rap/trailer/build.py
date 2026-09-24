#!/usr/bin/env python3
"""Cut the Founders' Rap Battle trailer.

    .venv-tts/bin/python tools/rap/trailer/build.py <recdir>   -> build/trailer/founders-rap-battle-trailer.mp4

<recdir> is a recording from record.js after mixdown.py (rec.mp4 + rec.wav). The trailer:
GrundArts logo -> rap battle title card (art/rap/trailer/title-v1.png) -> scenes from the
recording (Tobi's welcome, two lines each from Marx, Durkheim and Weber, Tobi calling up
Professor G, the start of his cutscene) -> the game's title screen with COMING SOON.
Cards are rendered frame by frame (a slow push-in, so no zoompan jitter); every cut is a
short crossfade in picture and sound.
"""
import json, os, re, subprocess, sys, tempfile
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
WEB = os.path.join(ROOT, 'web')
OUT = os.path.join(ROOT, 'build', 'trailer')
W, H, FPS, SR = 1920, 1080, 60, 48000
XF = 0.45                      # crossfade between clips, seconds

# scenes from the recording: (start, end) in seconds of rec.mp4 (see the audio timeline)
SCENES = [(6.30, 16.40),       # Tobi: "Hi hi HI, welcome back to UniLife Live!"
          (42.30, 54.40),      # Marx, first two lines
          (97.20, 108.80),     # Durkheim, first two lines
          (148.50, 160.60),    # Weber, first two lines ("iron cage")
          (205.60, 213.20),    # Tobi calls up Professor G; drum roll, air horn
          (213.20, 238.60)]    # Professor G: "May I have your attention, please?" ...

def sprite(name):
    s = open(os.path.join(WEB, 'the-secret-of-the-codebook.html')).read()
    sp = json.loads(re.search(r'window\.CODEBOOK_SFX_SPRITE = (\{.*?\});', s, re.S).group(1))
    return sp[name]

def decode(path, start=0.0, dur=None):
    cmd = ['ffmpeg', '-v', 'error', '-ss', str(start), '-i', path]
    if dur: cmd += ['-t', str(dur)]
    raw = subprocess.run(cmd + ['-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()

def sfx(name):
    f, st, d = sprite(name)
    return decode(os.path.join(WEB, f), st, d)

def place(buf, sig, at, gain=1.0):
    i = int(at * SR); j = min(len(buf), i + len(sig))
    if i < len(buf): buf[i:j] += sig[:j - i] * gain

def fade(sig, fin=0.0, fout=0.0):
    n = len(sig); env = np.ones(n, dtype=np.float32)
    a, b = int(fin * SR), int(fout * SR)
    if a: env[:a] = np.linspace(0, 1, a)
    if b: env[n - b:] = np.linspace(1, 0, b)
    return sig * env[:, None]

def cover(img):
    r = max(W / img.width, H / img.height)
    img = img.resize((round(img.width * r), round(img.height * r)), Image.LANCZOS)
    return img.crop(((img.width - W) // 2, (img.height - H) // 2, (img.width - W) // 2 + W, (img.height - H) // 2 + H))

def render(path, dur, frame_fn):
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', '%dx%d' % (W, H),
                          '-r', str(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '16',
                          '-pix_fmt', 'yuv420p', path], stdin=subprocess.PIPE)
    for i in range(int(dur * FPS)):
        p.stdin.write(frame_fn(i / FPS).convert('RGB').tobytes())
    p.stdin.close(); p.wait()

def push_in(base, z0, z1, dur, cx=0.5, cy=0.5):
    """A slow zoom into a still: sub-pixel smooth, done with an affine transform per frame."""
    def f(t):
        z = z0 + (z1 - z0) * (t / dur) ** 0.9
        w, h = W / z, H / z
        x0, y0 = (W - w) * cx, (H - h) * cy
        return base.transform((W, H), Image.AFFINE, (w / W, 0, x0, 0, h / H, y0), resample=Image.BICUBIC)
    return f

def main():
    rec = sys.argv[1]
    os.makedirs(OUT, exist_ok=True)
    tmp = tempfile.mkdtemp()
    clips = []   # (video path, audio array)

    # 1. GrundArts logo on black, as on the game's splash screen
    logo = Image.open(os.path.join(WEB, 'logo-grundarts.webp')).convert('RGBA')
    r = min(W * 0.82 / logo.width, H * 0.82 / logo.height)
    logo = logo.resize((round(logo.width * r), round(logo.height * r)), Image.LANCZOS)
    card = Image.new('RGB', (W, H), 'black'); card.paste(logo, ((W - logo.width) // 2, (H - logo.height) // 2), logo)
    d = 4.2
    zoom = push_in(card, 1.0, 1.04, d)
    def logo_f(t):
        a = min(1, t / 0.8, max(0, (d - t) / 0.6))
        return Image.blend(Image.new('RGB', (W, H)), zoom(t), a)
    render(os.path.join(tmp, 'c0.mp4'), d, logo_f)
    a = np.zeros((int(d * SR), 2), np.float32)
    place(a, sfx('sfx-needle'), d - 0.9, 0.55)
    clips.append((os.path.join(tmp, 'c0.mp4'), a))

    # 2. the title card: scratch, air horn, a cheer, and the opening bars of Marx's beat
    title = cover(Image.open(os.path.join(ROOT, 'art', 'rap', 'trailer', 'title-v1.png')).convert('RGB'))
    d = 6.2
    zoom = push_in(title, 1.0, 1.07, d, 0.5, 0.35)
    flash_t = 0.0
    def title_f(t):
        im = zoom(t)
        fl = max(0, 1 - (t - flash_t) / 0.35)            # a white flash on the cut, like the game's strobe
        return Image.blend(im, Image.new('RGB', (W, H), 'white'), fl * 0.8) if fl > 0 else im
    render(os.path.join(tmp, 'c1.mp4'), d, title_f)
    a = np.zeros((int(d * SR), 2), np.float32)
    beat = fade(decode(os.path.join(WEB, 'rap-marx.mp3'), 0, 5.2), 0, 0.5)
    place(a, beat, 0.15, 0.9)
    place(a, sfx('sfx-scratch'), 0.0, 0.55)
    place(a, sfx('sfx-airhorn'), 0.25, 0.45)
    place(a, fade(sfx('sfx-crowd-cheer'), 0, 1.2), 0.4, 0.35)
    clips.append((os.path.join(tmp, 'c1.mp4'), a * 2.2))     # it has to hit as hard as the scenes

    # 3. the scenes
    full = decode(os.path.join(rec, 'rec.wav'))
    for k, (s, e) in enumerate(SCENES):
        v = os.path.join(tmp, 's%d.mp4' % k)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', '%.3f' % s, '-i', os.path.join(rec, 'rec.mp4'), '-t', '%.3f' % (e - s),
                        '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', '-r', str(FPS), v], check=True)
        seg = full[int(s * SR):int(e * SR)]
        rms = float(np.sqrt(np.mean(seg ** 2))) + 1e-9      # even the scenes out: verses sat 5 dB under Prof G
        seg = seg * min(2.5, max(0.4, 0.1 / rms))
        clips.append((v, fade(seg, 0.12, 0.3)))

    # 4. COMING SOON over the game's title screen, applause into the title theme
    soon = cover(Image.open(os.path.join(WEB, 'title-screen.webp')).convert('RGB'))
    font = ImageFont.truetype('/System/Library/Fonts/Supplemental/Georgia Bold.ttf', 104)
    small = ImageFont.truetype('/System/Library/Fonts/Supplemental/Georgia Italic.ttf', 40)
    def text_layer(txt, fnt, y, spacing):
        lay = Image.new('RGBA', (W, H), (0, 0, 0, 0)); dr = ImageDraw.Draw(lay)
        chars = list(txt); widths = [dr.textlength(c, font=fnt) for c in chars]
        x = (W - sum(widths) - spacing * (len(chars) - 1)) / 2
        shadow = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ds = ImageDraw.Draw(shadow)
        xx = x
        for c, w in zip(chars, widths):
            ds.text((xx, y), c, font=fnt, fill=(0, 0, 0, 230), stroke_width=6, stroke_fill=(0, 0, 0, 230)); xx += w + spacing
        shadow = shadow.filter(ImageFilter.GaussianBlur(9))
        xx = x
        for c, w in zip(chars, widths):
            dr.text((xx, y), c, font=fnt, fill=(246, 214, 138, 255), stroke_width=2, stroke_fill=(90, 58, 18, 255)); xx += w + spacing
        return Image.alpha_composite(shadow, lay)
    t1 = text_layer('COMING SOON', font, 585, 14)
    t2 = text_layer('a GrundArts game', small, 715, 2)
    d = 7.5
    zoom = push_in(soon, 1.0, 1.05, d, 0.5, 0.3)
    def soon_f(t):
        im = zoom(t).convert('RGBA')
        for lay, at in ((t1, 1.0), (t2, 1.9)):
            al = min(1, max(0, (t - at) / 0.8))
            if al > 0:
                l = lay.copy(); l.putalpha(l.getchannel('A').point(lambda v: int(v * al))); im = Image.alpha_composite(im, l)
        return im.convert('RGB') if t < d - 0.9 else Image.blend(im.convert('RGB'), Image.new('RGB', (W, H)), (t - (d - 0.9)) / 0.9)
    render(os.path.join(tmp, 'c9.mp4'), d, soon_f)
    a = np.zeros((int(d * SR), 2), np.float32)
    place(a, fade(sfx('sfx-crowd-huge'), 0, 2.5), 0.0, 0.45)
    place(a, fade(decode(os.path.join(WEB, 'title-theme.mp3'), 0, d), 1.5, 1.2), 0.3, 0.75)
    clips.append((os.path.join(tmp, 'c9.mp4'), a))

    # join: video crossfades (xfade) and the audio overlapped by the same amount
    durs = [len(a) / SR for _, a in clips]
    inputs, fc, last, off = [], [], '[0:v]', 0.0
    for i, (v, _) in enumerate(clips): inputs += ['-i', v]
    for i in range(1, len(clips)):
        off += durs[i - 1] - XF
        lab = '[v%d]' % i
        fc.append('%s[%d:v]xfade=transition=fade:duration=%.2f:offset=%.3f%s' % (last, i, XF, off, lab))
        last = lab
    total = off + durs[-1]
    mix = np.zeros((int((total + 1) * SR), 2), np.float32)
    t = 0.0
    for i, (_, a) in enumerate(clips):
        a = fade(a, XF if i else 0, XF if i < len(clips) - 1 else 0)
        place(mix, a, t); t += len(a) / SR - XF
    peak = np.abs(mix).max()
    if peak > 0.97: mix *= 0.97 / peak
    import soundfile as sf
    wav = os.path.join(tmp, 'mix.wav'); sf.write(wav, mix[:int(total * SR)], SR)
    out = os.path.join(OUT, 'founders-rap-battle-trailer.mp4')
    fc.append('[%d:a]loudnorm=I=-15:TP=-1.5:LRA=11[a]' % len(clips))     # online-video loudness
    subprocess.run(['ffmpeg', '-v', 'error', '-y'] + inputs + ['-i', wav, '-filter_complex', ';'.join(fc),
                    '-map', last, '-map', '[a]', '-ar', '48000', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18',
                    '-pix_fmt', 'yuv420p', '-r', str(FPS), '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart',
                    '-shortest', out], check=True)
    print(out, '%.1f s' % total, '%.1f MB' % (os.path.getsize(out) / 1e6))

if __name__ == '__main__':
    main()
