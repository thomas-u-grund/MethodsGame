#!/usr/bin/env python3
"""The game's trailer, second version (author, 2026-10-02): five chapters, five neon posters in the style of
the Founders' Rap Battle title card, between quick cuts of real game footage, on the author's Suno track.

    .venv-tts/bin/python tools/trailer/trailer2.py            -> build/trailer2/trailer-16x9.mp4  (~60 s)
    .venv-tts/bin/python tools/trailer/trailer2.py vertical   -> build/trailer2/trailer-9x16.mp4  (~30 s)

Music: build/trailer2/music.wav, cut from audio/music-src/trailer-v2-suno.mp3 (95.7 BPM) in whole bars;
every shot below is a whole number of half-bars on that grid. Posters: art/trailer/v2/tr-*.png. Footage:
build/teaser/clips/*.mp4 (tools/trailer/record-clip.js). Voices: the game's own clips in web/voices/.
"""
import os, subprocess, sys, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
WEB, V2, CLIPS, B = (os.path.join(ROOT, p) for p in ('web', 'art/trailer/v2', 'build/teaser/clips', 'build/trailer2'))
VERT = len(sys.argv) > 1 and sys.argv[1] == 'vertical'
W, H = (1080, 1920) if VERT else (1920, 1080)
FPS, SR = 30, 48000
BAR = 4 * 60 / 95.7
FONT = '/System/Library/Fonts/Supplemental/Arial Black.ttf'
SERIF = '/System/Library/Fonts/Supplemental/Georgia Bold.ttf'

def P(name):
    for base in (V2, B, os.path.join(ROOT, 'art'), WEB, os.path.join(WEB, 'duel'), CLIPS, os.path.join(ROOT, 'art/rap/trailer'), os.path.join(ROOT, 'build/trailer')):
        p = os.path.join(base, name)
        if os.path.exists(p): return p
    raise FileNotFoundError(name)

def voice(name): return P(os.path.join('voices', name)) if os.path.exists(os.path.join(WEB, 'voices', name)) else P(name)

# (kind, source, half-bars, options). kinds: logo, still (a slow push-in), clip (start s), text (a card)
# options: say=(voice clip, delay s), sfx=(file, delay, gain), cap=caption, flash=True (a white hit on the cut)
SHOTS = [
    # intro: 4 bars, the quiet start
    ('logo', 'logo-grundarts.webp', 2, {}),
    ('logo', 'logo-professorg.png', 2, {}),
    ('still', 'tr-cold.png', 4, {'cap': 'YOUR FIRST RESEARCH PROJECT.\nDUE FRIDAY.', 'say': ('vo-you-8cf99c16.mp3', 2.6)}),
    ('still', 'tr-main-poster.png', 2, {'say': ('vo-kira-58cbb38c.mp3', 0.0, 3.0)}),
    # the five chapters: 10 bars
    ('still', 'tr-ch1.png', 4, {'flash': True, 'say': ('vo-prof-82e5f245.mp3', 1.2)}),
    ('still', 'title-v1.png', 2, {'flash': True}),
    ('clip', 'founders-rap-battle-trailer.mp4', 2, {'start': 29.4, 'say': ('vo-durkheim-schnitzel-1.mp3', 0.0, 2.5)}),
    ('still', 'tr-ch3.png', 2, {'flash': True}),
    ('clip', 'sampling.mp4', 2, {'start': 1.4, 'say': ('vo-officer-35527482.mp3', -1.6)}),
    ('still', 'tr-ch4.png', 2, {'flash': True}),
    ('clip', 'casino.mp4', 2, {'start': 6.2, 'say': ('vo-fellow-e251c16a.mp3', -1.2)}),
    ('still', 'tr-ch5.png', 2, {'flash': True}),
    ('clip', 'keynote.mp4', 2, {'start': 40.0, 'say': ('vo-feldstrom-825f62a7.mp3', -0.6)}),
    # the gags: 1 bar, one per half-bar (no schnitzel, no Tobi, no Reviewer 2: author, 2026-10-02)
    ('still', 'lib-cut-print.webp', 1, {'say': ('vo-kira-2b9393f2.mp3', 0.0)}),
    ('still', 'lecture-bg-cheer.webp', 1, {}),
    # the laser hit: 2 bars, the break in the music
    ('still', 'duel-hand.webp', 2, {'sfx': ('sfx-whoosh.mp3', 0.9, 0.8)}),
    ('still', 'duel-ko.webp', 2, {'flash': True, 'sfx': ('sfx-gong.mp3', 0.0, 0.7)}),
    # the finale: 4 bars
    ('still', 'tr-main-poster.png', 6, {'flash': True, 'say': ('vo-prof-85012418.mp3', 0.6)}),
    ('text', None, 2, {'cap': 'FREE IN YOUR BROWSER\nlostcodebook.org', 'small': 'For teachers: lostcodebook.org/teach'}),
]

# The phone version (author, 2026-10-02: "a proper mobile version... portrait mode without cut-offs"): the same edit,
# the same voices. A picture with a portrait repaint (<name>-9x16.png in art/trailer/v2) fills the screen; anything
# else (game footage, in-game art) is shown whole on a blurred copy of itself, so nothing is ever cut off.

# The voice-over (author, 2026-10-02): one trailer narrator, characters answering him. (line, at): at is a time
# in seconds, or ('after', gap) = right after the previous line. Takes: build/trailer2/vo/<line>-s<seed>.wav.
VO = [('n01', 5.6), ('c01', ('after', .35)), ('n02', 10.1), ('c02', ('after', .15)), ('c03', ('after', .3)),
      ('n03', 17.6), ('n04', 22.6), ('c04', ('after', .2)), ('n05', 27.6), ('c05', ('after', .2)),
      ('c06', 32.7), ('n06', ('after', .25)), ('n07', 40.1), ('n08', 45.2), ('c07', ('after', .45)), ('n09', 52.6)]
VO_SEED = {'c02': 2, 'n09': 2}   # line -> the chosen take (default 1), checked with Whisper
VO_GAIN = {'c02': 1.2, 'c06': 1.1}

def F(path, size): return ImageFont.truetype(path, size)

def cover(im, fx=0.5, fy=0.5):
    sw, sh = im.size; s = max(W / sw, H / sh)
    im = im.resize((int(sw * s + .5), int(sh * s + .5)), Image.LANCZOS)
    x, y = int((im.width - W) * fx), int((im.height - H) * fy)
    return im.crop((x, y, x + W, y + H))

def fit(im):
    # a tall picture on a blurred copy of itself
    bg = cover(im).filter(ImageFilter.GaussianBlur(30)).point(lambda v: v * .5)
    s = min(W / im.width, H / im.height); fg = im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS)
    bg.paste(fg, ((W - fg.width) // 2, (H - fg.height) // 2)); return bg

def caption(fr, text, small=None, card=False):
    fr = fr.convert('RGBA'); ov = Image.new('RGBA', fr.size, (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
    lines = text.split('\n'); size = int(W * (0.045 if not VERT else 0.065)); f = F(FONT, size)
    while max(ImageDraw.Draw(fr).textlength(l, font=f) for l in lines) > W * 0.86: size -= 4; f = F(FONT, size)   # always inside the frame
    y = H * (0.40 if card else 0.70)
    for l in lines:
        tw = d.textlength(l, font=f); x = (W - tw) / 2
        for g, a in ((14, 70), (7, 120)):   # a neon glow
            gl = Image.new('RGBA', fr.size, (0, 0, 0, 0)); ImageDraw.Draw(gl).text((x, y), l, font=f, fill=(255, 60, 200, a))
            ov = Image.alpha_composite(ov, gl.filter(ImageFilter.GaussianBlur(g)))
        d = ImageDraw.Draw(ov); d.text((x + 4, y + 4), l, font=f, fill=(0, 0, 0, 200)); d.text((x, y), l, font=f, fill=(255, 245, 250))
        y += size * 1.15
    if small:
        fs = F(SERIF, int(size * 0.42)); tw = d.textlength(small, font=fs); d.text(((W - tw) / 2, y + size * 0.4), small, font=fs, fill=(243, 223, 166))
    return Image.alpha_composite(fr, ov).convert('RGB')

def clip_frames(path, start, n, size=None):
    w, h = size or (W, H)
    vf = 'fps=%d,scale=%d:%d:force_original_aspect_ratio=increase,crop=%d:%d' % (FPS, w, h, w, h)
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(start), '-i', path, '-frames:v', str(n), '-vf', vf, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                         capture_output=True, check=True).stdout
    k = len(raw) // (w * h * 3); fr = [Image.frombytes('RGB', (w, h), raw[i * w * h * 3:(i + 1) * w * h * 3]) for i in range(k)]
    while len(fr) < n: fr.append(fr[-1])
    return fr

def shot_frames(kind, src, n, o):
    if kind == 'logo':
        lg = Image.open(P(src)).convert('RGBA'); s0 = min(W * .7 / lg.width, H * .7 / lg.height)
        lg = lg.resize((int(lg.width * s0), int(lg.height * s0)), Image.LANCZOS)
        one = Image.new('RGB', (W, H)); one.paste(lg, ((W - lg.width) // 2, (H - lg.height) // 2), lg)
        return [Image.blend(Image.new('RGB', (W, H)), one, min(1, i / (.6 * FPS), (n - i) / (.4 * FPS))) for i in range(n)]
    if kind == 'text':
        bg = cover(Image.open(P('tr-main-poster.png')).convert('RGB')).filter(ImageFilter.GaussianBlur(18)).point(lambda v: v * .35)
        one = caption(bg, o['cap'], o.get('small'), card=True); return [one] * n
    if kind == 'clip':
        if VERT:   # landscape footage, whole, on a blurred copy of itself
            return [fit(f) for f in clip_frames(P(src), o.get('start', 0), n, (1920, 1080))]
        return clip_frames(P(src), o.get('start', 0), n)
    if VERT:
        tall = os.path.join(V2, os.path.splitext(os.path.basename(src))[0] + '-9x16.png')
        if os.path.exists(tall): src = tall
    im = Image.open(P(src)).convert('RGB')
    titled = VERT and im.width > im.height * 1.1          # still landscape: show it whole
    if titled:   # a poster with a title: the whole poster, big, on a blurred copy of itself
        bg = cover(im).filter(ImageFilter.GaussianBlur(28)).point(lambda v: v * .45)
        s0 = W / im.width * 1.0; fg = im.resize((W, int(im.height * s0)), Image.LANCZOS)
        out = []
        for i in range(n):
            z = 1.0 + 0.06 * i / max(1, n - 1); f2 = fg.resize((int(fg.width * z), int(fg.height * z)), Image.BILINEAR)
            fr = bg.copy(); fr.paste(f2, ((W - f2.width) // 2, (H - f2.height) // 2)); out.append(fr)
        return out
    base = fit(im) if o.get('fit') and not VERT else cover(im)
    z0, z1 = 1.0, 1.08
    if 'zoom' in o and im.width > im.height:   # a push-in towards a point (fx, fy) to scale z
        fx, fy, z = o['zoom']; z0, z1 = z * .85, z
    out = []
    for i in range(n):
        z = z0 + (z1 - z0) * i / max(1, n - 1)
        if 'zoom' in o and im.width > im.height:
            cw, ch = im.width / z, im.height / z; cx, cy = o['zoom'][0] * im.width, o['zoom'][1] * im.height
            x0 = min(max(0, cx - cw / 2), im.width - cw); y0 = min(max(0, cy - ch / 2), im.height - ch)
            fr = cover(im.crop((int(x0), int(y0), int(x0 + cw), int(y0 + ch))))
        else:
            cw, ch = W / z, H / z; fr = base.crop((int((W - cw) / 2), int((H - ch) / 2), int((W + cw) / 2), int((H + ch) / 2))).resize((W, H), Image.BILINEAR)
        out.append(fr)
    return out

def frames():
    for kind, src, hb, o in SHOTS:
        n = int(round(hb * BAR / 2 * FPS))
        seq = shot_frames(kind, src, n, o)
        for i, fr in enumerate(seq):
            if o.get('cap') and kind != 'text': fr = caption(fr, o['cap'])
            if o.get('flash') and i < 5: fr = Image.blend(fr, Image.new('RGB', (W, H), (255, 255, 255)), (5 - i) / 6)
            yield fr

def load(path, start=0.0, dur=None):
    cmd = ['ffmpeg', '-v', 'error', '-ss', str(start), '-i', path] + (['-t', str(dur)] if dur else [])
    raw = subprocess.run(cmd + ['-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()

def soundtrack():
    starts = np.cumsum([0] + [s[2] * BAR / 2 for s in SHOTS]); total = starts[-1]
    song = load(os.path.join(ROOT, 'audio/music-src/trailer-v2-suno.mp3')); mix = np.zeros((int(total * SR) + SR, 2), np.float32)
    # simply the start of the song, in one piece, faded out at the end (author, 2026-10-02: "just cut it after 60 s,
    # no noticeable breaks"); 0.09 s in, so the beat grid (first beat at 2.6 s) lands on the cuts
    music = song[int(0.09 * SR):int((0.09 + total) * SR)].copy()
    fo = int(2.5 * SR); music[-fo:] *= np.linspace(1, 0, fo)[:, None] ** 1.5
    music[:int(1.5 * SR)] *= np.linspace(0, 1, int(1.5 * SR))[:, None]   # a soft start
    n = min(len(music), len(mix)); mix[:n] += music[:n] * 0.75
    duck = np.ones(len(mix), np.float32); vo = np.zeros_like(mix)
    for k, (kind, src, hb, o) in enumerate(SHOTS):
        if 'say' in o and os.environ.get('TRAILER_VOICES'):
            name, delay = o['say'][0], o['say'][1]; dur = o['say'][2] if len(o['say']) > 2 else None
            c = load(voice(name), 0, dur); t = max(0, starts[k] + delay); i = int(t * SR); j = min(len(vo), i + len(c))
            if dur: c[-int(.15 * SR):] *= np.linspace(1, 0, int(.15 * SR))[:, None]
            vo[i:j] += c[:j - i] * 1.6; duck[max(0, i - int(.15 * SR)):j + int(.25 * SR)] = 0.45   # music dips under a voice
        if 'sfx' in o:
            f, delay, g = o['sfx']; c = load(P(f)); i = int((starts[k] + delay) * SR); j = min(len(mix), i + len(c)); mix[i:j] += c[:j - i] * g
    if True:
        t_prev = 0.0
        for line, at in VO:
            f = os.path.join(B, 'vo', 't-%s-s%d.wav' % (line, VO_SEED.get(line, 1)))   # t-: silence trimmed (KIRA pitched up)
            if not os.path.exists(f): continue
            c = load(f); t = t_prev + at[1] if isinstance(at, tuple) else at
            i = int(t * SR); j = min(len(vo), i + len(c)); vo[i:j] += c[:j - i] * 1.5 * VO_GAIN.get(line, 1.0)
            duck[max(0, i - int(.2 * SR)):j + int(.3 * SR)] = 0.5; t_prev = t + len(c) / SR
            print('  vo %s %.2f-%.2f' % (line, t, t_prev))
    sm = np.ones(int(SR * .12)) / int(SR * .12); duck = np.convolve(duck, sm, 'same').astype(np.float32)
    mix = mix * duck[:, None] + vo
    e = int(total * SR); mix = mix[:e]; mix[-int(1.0 * SR):] *= np.linspace(1, 0, int(1.0 * SR))[:, None]
    return mix * (0.92 / max(np.abs(mix).max(), 1e-6)), total

def main():
    os.makedirs(B, exist_ok=True)
    mix, total = soundtrack()
    tag = '9x16' if VERT else '16x9'; audio = os.path.join(B, 'audio.wav'); video = os.path.join(B, 'trailer-%s.mp4' % tag)
    with wave.open(audio, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes())
    ff = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', '%dx%d' % (W, H), '-r', str(FPS), '-i', '-',
                           '-i', audio, '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k',
                           '-movflags', '+faststart', '-shortest', video], stdin=subprocess.PIPE)
    for fr in frames(): ff.stdin.write(fr.tobytes())
    ff.stdin.close(); ff.wait(); print(video, round(total, 1), 's')

if __name__ == '__main__':
    main()
