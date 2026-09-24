#!/usr/bin/env python3
"""The Founders' Rap Battle beats: one original beat per founder, synthesised (no samples).

    .venv-tts/bin/python tools/rap/beat.py out.wav <style> [bars]

Styles, so the three verses do not sound like one loop three times:
  marx      "factory"  92 BPM, D minor: hard boom-bap, an anvil clang on the off-beats and a
                       gritty brass stab. Industrial capitalism, in drums.
  durkheim  "musette"  96 BPM, G minor: swung, lighter kit, a French accordion (detuned reed
                       pair with vibrato) playing the chords. He is French; it is a solidarity.
  weber     "chapel"   84 BPM, E minor: slow, heavy, a church organ and a bell on the one.
                       The Protestant ethic, and the iron cage it built.

style(name) returns the parameters; tools/rap/verse.py uses its bar length for the grid.
"""
import sys
import numpy as np
import soundfile as sf

SR = 44100
rng = np.random.default_rng(7)

def env(n, attack, decay):
    t = np.arange(n) / SR
    return np.clip(t / max(attack, 1e-4), 0, 1) * np.exp(-t / decay)

def mtof(m): return 440.0 * 2 ** ((m - 69) / 12)

def kick(punch=1.0):
    n = int(0.45 * SR); t = np.arange(n) / SR
    f = 45 + 75 * punch * np.exp(-t / 0.045)
    return 0.95 * np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.16)

def snare(tone=185, snap=0.09):
    n = int(0.25 * SR); t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    noise = np.convolve(noise, np.ones(3) / 3, 'same') - np.convolve(noise, np.ones(40) / 40, 'same')
    return 0.55 * noise * env(n, 0.001, snap) + 0.35 * np.sin(2 * np.pi * tone * t) * env(n, 0.001, 0.05)

def hat(open_=False):
    n = int((0.18 if open_ else 0.05) * SR)
    noise = rng.standard_normal(n)
    hp = noise - np.convolve(noise, np.ones(6) / 6, 'same')
    return 0.22 * hp * env(n, 0.0005, 0.06 if open_ else 0.012)

def anvil():
    """A struck metal bar: inharmonic partials, fast decay."""
    n = int(0.5 * SR); t = np.arange(n) / SR
    s = sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t / d)
            for f, a, d in [(1180, 0.5, 0.12), (1843, 0.35, 0.08), (2710, 0.25, 0.05), (3390, 0.15, 0.03)])
    return 0.45 * s

def bell(freq):
    n = int(2.5 * SR); t = np.arange(n) / SR
    s = sum(a * np.sin(2 * np.pi * freq * r * t) * np.exp(-t / d)
            for r, a, d in [(1, 0.6, 1.4), (2.0, 0.3, 0.9), (2.76, 0.25, 0.6), (5.4, 0.12, 0.3)])
    return 0.35 * s

def pluck(freq, dur, bright=0.5):
    """Karplus-Strong: close enough to a harpsichord at this volume."""
    n = int(dur * SR); p = int(SR / freq)
    buf = rng.uniform(-1, 1, p); out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = bright * buf[i % p] + (1 - bright) * 0.996 * buf[(i + 1) % p]
    return out * env(n, 0.001, 0.9)

def saw(freq, t):
    return ((freq * t) % 1.0) * 2 - 1

def brass(freq, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    s = saw(freq, t) + saw(freq * 1.005, t) + 0.5 * saw(freq * 2, t)
    s = np.convolve(s, np.ones(6) / 6, 'same')          # a little darker
    return 0.18 * np.tanh(s * 1.5) * env(n, 0.02, dur * 0.6)

def accordion(freqs, dur):
    """Musette: each note is two slightly detuned reeds, with a slow bellows swell."""
    n = int(dur * SR); t = np.arange(n) / SR
    vib = 1 + 0.004 * np.sin(2 * np.pi * 5.5 * t)
    s = sum(np.sign(np.sin(2 * np.pi * f * vib * t)) * 0.5 + np.sign(np.sin(2 * np.pi * f * 1.006 * vib * t)) * 0.5
            for f in freqs)
    s = np.convolve(s, np.ones(10) / 10, 'same')
    swell = np.clip(t / 0.06, 0, 1) * (0.8 + 0.2 * np.sin(np.pi * t / dur))
    return 0.05 * s * swell * np.clip((dur - t) / 0.05, 0, 1)

def organ(freqs, dur):
    """Drawbars 16' 8' 4' 2': sums of sines, slow attack, no decay -- it is a church."""
    n = int(dur * SR); t = np.arange(n) / SR
    s = sum(sum(a * np.sin(2 * np.pi * f * r * t) for r, a in [(0.5, 0.6), (1, 1.0), (2, 0.5), (4, 0.25)])
            for f in freqs)
    return 0.06 * s * np.clip(t / 0.08, 0, 1) * np.clip((dur - t) / 0.12, 0, 1)

def bass(freq, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    return 0.5 * (np.sin(2 * np.pi * freq * t) + 0.3 * np.sin(4 * np.pi * freq * t)) * env(n, 0.005, 0.5)

STYLES = {
    'marx':     dict(bpm=92, kicks=[0, 3, 7, 10], snares=[4, 12], swing=0.10, punch=1.2,
                     chords=[(38, [62, 65, 69]), (34, [58, 62, 65]), (36, [60, 64, 67]), (33, [57, 61, 64])]),
    'durkheim': dict(bpm=96, kicks=[0, 10], snares=[4, 12], swing=0.30, punch=0.8,
                     chords=[(43, [67, 70, 74]), (39, [63, 67, 70]), (38, [62, 66, 69]), (43, [67, 70, 74])]),
    'weber':    dict(bpm=84, kicks=[0, 8, 11], snares=[4, 12], swing=0.05, punch=1.0,
                     chords=[(40, [64, 67, 71]), (36, [60, 64, 67]), (38, [62, 66, 69]), (35, [59, 63, 66])]),
}

def style(name):
    st = dict(STYLES[name]); st['bar'] = 4 * 60.0 / st['bpm']; st['name'] = name
    return st

def place(buf, sig, at):
    i = int(at * SR); j = min(len(buf), i + len(sig))
    if 0 <= i < len(buf): buf[i:j] += sig[:j - i]

def build(bars, name='marx'):
    st = style(name); BAR = st['bar']; STEP = BAR / 16
    out = np.zeros(int((bars * BAR + 2.5) * SR))
    k, s = kick(st['punch']), snare(tone=150 if name == 'weber' else 185, snap=0.14 if name == 'weber' else 0.09)
    cache = {}
    for b in range(bars):
        t0 = b * BAR
        root, notes = st['chords'][b % 4]
        for x in st['kicks']: place(out, k, t0 + x * STEP)
        for x in st['snares']: place(out, s, t0 + x * STEP)
        for x in range(0, 16, 2):
            sw = STEP * st['swing'] if x % 4 == 2 else 0
            if name != 'weber' or x % 4 == 0:        # the chapel beat breathes
                place(out, hat(open_=(x == 14)), t0 + x * STEP + sw)
        place(out, bass(mtof(root), BAR * 0.45), t0)
        place(out, bass(mtof(root), BAR * 0.2), t0 + 10 * STEP)
        if b < 1: continue                            # one bar of drums first
        if name == 'marx':
            for x in (2, 6, 10, 14): place(out, anvil(), t0 + x * STEP)
            for x in (0, 7):
                key = ('br', root)
                if key not in cache: cache[key] = sum(brass(mtof(m), STEP * 3) for m in notes)
                place(out, cache[key], t0 + x * STEP)
        elif name == 'durkheim':
            # oom-pah-pah on the accordion, swung
            for x in (0, 4, 8, 12):
                sw = STEP * st['swing'] if x in (4, 12) else 0
                key = ('acc', tuple(notes), x in (0, 8))
                if key not in cache:
                    cache[key] = accordion([mtof(notes[0])] if x in (0, 8) else [mtof(m) for m in notes[1:]], STEP * 3.2)
                place(out, cache[key], t0 + x * STEP + sw)
        else:
            key = ('org', tuple(notes))
            if key not in cache: cache[key] = organ([mtof(m) for m in notes], BAR * 0.98)
            place(out, cache[key], t0)
            if b % 2 == 1: place(out, bell(mtof(notes[0] + 12)), t0)
    return np.tanh(out * 1.15) * 0.8

if __name__ == '__main__':
    path, name = sys.argv[1], sys.argv[2]
    bars = int(sys.argv[3]) if len(sys.argv) > 3 else 16
    sf.write(path, build(bars, name), SR)
    print('%s  %s  %d bars  %.2fs' % (path, name, bars, bars * style(name)['bar']))
