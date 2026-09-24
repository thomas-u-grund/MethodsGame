#!/usr/bin/env python3
"""Beat times of Professor G's live recording, for the crowd's hands (CODEBOOK_CROWD).

    .venv-tts/bin/python tools/rap/beats.py            -> writes var PROFG_BEATS into the game

The recording is live and drifts by up to 0.3 s against a fixed 103 BPM grid, so the crowd
follows librosa's beat track itself rather than a tempo. The founders' verses are built on a
fixed grid (tools/rap/beat.py) and need only their BPM.
"""
import json, os, re
import librosa

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
GAME = os.path.join(ROOT, 'web', 'the-secret-of-the-codebook.html')

def main():
    y, sr = librosa.load(os.path.join(ROOT, 'web', 'profg-live.mp3'), sr=22050, mono=True)
    _, beats = librosa.beat.beat_track(y=y, sr=sr, units='time')
    line = 'var PROFG_BEATS = %s;' % json.dumps([round(float(b), 2) for b in beats], separators=(',', ':'))
    s = open(GAME).read()
    if 'var PROFG_BEATS = ' in s:
        s = re.sub(r'var PROFG_BEATS = \[.*?\];', lambda m: line, s, count=1)
    else:
        s = s.replace('var PROFG_TIMING = ', line + '\n' + 'var PROFG_TIMING = ', 1)
    open(GAME, 'w').write(s)
    print(len(beats), 'beats', beats[0], '...', beats[-1])

if __name__ == '__main__':
    main()
