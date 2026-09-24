#!/usr/bin/env python3
"""The Founders' Rap Battle beat: an original 90 BPM boom-bap with a harpsichord on top.

Synthesised from scratch (no samples), so it carries no rights question: kick, snare and
hats are shaped noise and sine sweeps, the bass follows the chords, and a Karplus-Strong
"harpsichord" plays a baroque arpeggio over it -- nineteenth-century gentlemen, beat
slightly too modern for them.

    .venv-tts/bin/python tools/rap/beat.py out.wav [bars]

Tempo and bar length are exported for tools/rap/verse.py, which puts one line per bar.
"""
import sys
import numpy as np
import soundfile as sf

SR = 44100
BPM = 90
BAR = 4 * 60.0 / BPM          # 2.667 s
STEP = BAR / 16
rng = np.random.default_rng(7)

def env(n, attack, decay):
    t = np.arange(n) / SR
    a = np.clip(t / max(attack, 1e-4), 0, 1)
    return a * np.exp(-t / decay)

def kick():
    n = int(0.45 * SR); t = np.arange(n) / SR
    f = 45 + 75 * np.exp(-t / 0.045)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return 0.95 * np.sin(ph) * env(n, 0.002, 0.16)

def snare():
    n = int(0.25 * SR); t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    noise = np.convolve(noise, np.ones(3) / 3, 'same') - np.convolve(noise, np.ones(40) / 40, 'same')
    tone = np.sin(2 * np.pi * 185 * t)
    return (0.55 * noise * env(n, 0.001, 0.09) + 0.35 * tone * env(n, 0.001, 0.05))

def hat(open_=False):
    n = int((0.18 if open_ else 0.05) * SR)
    noise = rng.standard_normal(n)
    hp = noise - np.convolve(noise, np.ones(6) / 6, 'same')
    return 0.22 * hp * env(n, 0.0005, 0.06 if open_ else 0.012)

def pluck(freq, dur, bright=0.5):
    """Karplus-Strong, a little buzzy: close enough to a harpsichord at this volume."""
    n = int(dur * SR); p = int(SR / freq)
    buf = rng.uniform(-1, 1, p)
    out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = bright * buf[i % p] + (1 - bright) * 0.996 * buf[(i + 1) % p]
    return out * env(n, 0.001, 0.9)

def bass(freq, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * freq * t) + 0.3 * np.sin(4 * np.pi * freq * t)
    return 0.5 * s * env(n, 0.005, 0.5)

def mtof(m): return 440.0 * 2 ** ((m - 69) / 12)

# A minor: Am - F - C - G, one chord per bar. (root midi note, arpeggio notes)
CHORDS = [(45, [57, 60, 64, 69]), (41, [57, 60, 65, 69]), (48, [55, 60, 64, 67]), (43, [55, 59, 62, 67])]
KICKS = [0, 7, 10]
SNARES = [4, 12]

def place(buf, sig, at):
    i = int(at * SR); j = min(len(buf), i + len(sig))
    if i < len(buf): buf[i:j] += sig[:j - i]

def build(bars):
    out = np.zeros(int((bars * BAR + 1.0) * SR))
    k, s = kick(), snare()
    plucks = {}
    for b in range(bars):
        t0 = b * BAR
        root, arp = CHORDS[b % 4]
        for st in KICKS: place(out, k, t0 + st * STEP)
        for st in SNARES: place(out, s, t0 + st * STEP)
        for st in range(0, 16, 2):
            swing = STEP * 0.18 if st % 4 == 2 else 0
            place(out, hat(open_=(st == 14)), t0 + st * STEP + swing)
        place(out, bass(mtof(root), BAR * 0.45), t0)
        place(out, bass(mtof(root), BAR * 0.2), t0 + 10 * STEP)
        if b >= 1:     # harpsichord comes in after one bar of drums
            for i, st in enumerate(range(0, 16, 2)):
                m = arp[[0, 1, 2, 3, 2, 1, 2, 3][i]]
                if m not in plucks: plucks[m] = pluck(mtof(m), 0.8)
                place(out, 0.28 * plucks[m], t0 + st * STEP)
    out = np.tanh(out * 1.2) * 0.8
    return out

if __name__ == '__main__':
    path = sys.argv[1]
    bars = int(sys.argv[2]) if len(sys.argv) > 2 else 16
    sf.write(path, build(bars), SR)
    print('%s  %d bars  %.2fs' % (path, bars, bars * BAR))
