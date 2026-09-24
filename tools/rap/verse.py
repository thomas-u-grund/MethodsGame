#!/usr/bin/env python3
"""Mix one founder's verse: one spoken line per bar over tools/rap/beat.py.

    .venv-tts/bin/python tools/rap/verse.py marx tools/tts/out/rap-marx-*.wav

The founder's name picks his beat (tools/rap/beat.py STYLES).

Each line is trimmed of silence, tightened by at most 10%, and starts on the first BEAT after
the previous line ends (after two bars of intro). An earlier version forced one line per bar
and had to time-stretch some lines by 1.75x, which sounded hurried and warbly; landing on the
next beat keeps them on the grid without touching the voices. Writes web/vo-<name>-verse.mp3 (vo-<who>- so the portrait's mouth moves) and prints the line start
times, which the game uses to time the captions.
"""
import json, os, subprocess, sys, tempfile
import numpy as np
import soundfile as sf
import librosa

sys.path.insert(0, os.path.dirname(__file__))
import beat as B

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
INTRO_BARS, OUTRO_BARS = 2, 1
TIGHTEN = 1.10      # at most this much speed-up per line
GAP = 0.10          # breath between lines before snapping to the next beat

def load_line(path):
    y, sr = librosa.load(path, sr=B.SR, mono=True)
    y, _ = librosa.effects.trim(y, top_db=35)
    y = librosa.effects.time_stretch(y, rate=TIGHTEN)
    return y / (np.abs(y).max() + 1e-9) * 0.9

def main():
    name, paths = sys.argv[1], sorted(sys.argv[2:])
    st = B.style(name)
    beat_len = st['bar'] / 4
    lines = [load_line(p) for p in paths]
    starts, ends, t = [], [], INTRO_BARS * st['bar']
    for y in lines:
        starts.append(round(t + 0.03, 3))
        ends.append(round(t + 0.03 + len(y) / B.SR, 3))
        end = t + len(y) / B.SR + GAP
        t = np.ceil(end / beat_len) * beat_len
    bars = int(np.ceil(t / st['bar'])) + OUTRO_BARS
    beat = B.build(bars, name) * 0.42
    vox = np.zeros_like(beat)
    for y, at in zip(lines, starts):
        j = int(at * B.SR); k = min(len(vox), j + len(y))
        vox[j:k] += y[:k - j]
    mix = np.tanh((beat + vox) * 1.1) * 0.9
    with tempfile.TemporaryDirectory() as tmp:
        wav = os.path.join(tmp, 'mix.wav'); sf.write(wav, mix, B.SR)
        out = os.path.join(ROOT, 'web', 'rap-%s.mp3' % name)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', wav, '-codec:a', 'libmp3lame', '-b:a', '112k', out], check=True)
    print(json.dumps({'file': 'rap-%s.mp3' % name, 'dur': round(len(mix) / B.SR, 2), 'starts': starts, 'ends': ends}))

if __name__ == '__main__':
    main()
