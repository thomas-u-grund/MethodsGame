#!/usr/bin/env python3
"""A DJ air horn (three blasts), synthesised: detuned saw stack with a pitch dip on attack,
through a soft clip. Mixkit has no air horn, and this one has no rights question.
    .venv-tts/bin/python tools/rap/airhorn.py out.wav"""
import sys, numpy as np, soundfile as sf
SR = 44100
def blast(dur):
    n = int(dur * SR); t = np.arange(n) / SR
    f = 440 * (1 - 0.06 * np.exp(-t / 0.03))
    out = np.zeros(n)
    for mult, det in [(1, 0), (1, 3.1), (1.5, -2.2), (2, 1.4), (1.25, -1.1)]:
        ph = 2 * np.pi * np.cumsum(f * mult + det) / SR
        out += ((ph / (2 * np.pi)) % 1.0) * 2 - 1
    env = np.clip(t / 0.01, 0, 1) * np.clip((dur - t) / 0.04, 0, 1)
    return np.tanh(out * 0.5) * env
parts = []
for d, gap in [(0.16, 0.06), (0.16, 0.06), (0.62, 0.0)]:
    parts += [blast(d), np.zeros(int(gap * SR))]
y = np.concatenate(parts) * 0.8
sf.write(sys.argv[1], y, SR)
print(sys.argv[1], round(len(y) / SR, 2), 's')
