#!/usr/bin/env python3
"""Turn a recording from record.js into rec.mp4 (video, 60 fps) and rec.wav (the game's sound).

    .venv-tts/bin/python tools/rap/trailer/mixdown.py <recdir>

Time zero for both is the first recorded frame. The sound is rebuilt from audio.json: every
audio element the game started, which file (blob URLs are matched to web/ files by byte size),
where in the file it started, at what volume, and when it stopped -- so the mix is sample-exact
to what a player would have heard, voices, beats and effects together.
"""
import json, os, subprocess, sys
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
WEB = os.path.join(ROOT, 'web')
SR = 48000

def decode(path, cache={}):
    if path not in cache:
        raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'],
                             capture_output=True, check=True).stdout
        cache[path] = np.frombuffer(raw, dtype=np.float32).reshape(-1, 2)
    return cache[path]

def main():
    rec = sys.argv[1]
    frames = json.load(open(os.path.join(rec, 'frames.json')))
    audio = json.load(open(os.path.join(rec, 'audio.json')))
    t0, t_end = frames[0]['t'], frames[-1]['t'] + 1000 / 60
    by_size = {os.path.getsize(os.path.join(WEB, f)): f for f in os.listdir(WEB) if f.endswith('.mp3')}

    def local(src):
        if src.startswith('blob:'):
            return os.path.join(WEB, by_size[audio['blobs'][src]])
        return os.path.join(WEB, src.split('?')[0].rsplit('/', 1)[-1])

    # pair each start with the next stop of the same element; split at volume changes
    segs, open_ = [], {}
    for e in audio['log']:
        if e['ev'] == 'start':
            open_[e['id']] = dict(file=local(e['src']), pos=e['pos'], t=e['t'], vol=e['vol'])
        elif e['id'] in open_:
            s = open_[e['id']]
            segs.append(dict(s, t1=e['t']))
            if e['ev'] == 'vol':
                open_[e['id']] = dict(s, pos=s['pos'] + (e['t'] - s['t']) / 1000, t=e['t'], vol=e['vol'])
            else:
                del open_[e['id']]
    for s in open_.values(): segs.append(dict(s, t1=t_end))

    n = int((t_end - t0) / 1000 * SR) + SR
    mix = np.zeros((n, 2), dtype=np.float32)
    for s in segs:
        a, b = max(s['t'], t0), min(s['t1'], t_end)
        if b <= a or s['vol'] <= 0: continue
        src = decode(s['file'])
        i0 = int((s['pos'] + (a - s['t']) / 1000) * SR)
        k = min(int((b - a) / 1000 * SR), len(src) - i0)
        if k <= 0: continue
        o = int((a - t0) / 1000 * SR)
        mix[o:o + k] += src[i0:i0 + k] * s['vol']
    peak = np.abs(mix).max()
    if peak > 0.98: mix *= 0.98 / peak
    import soundfile as sf
    sf.write(os.path.join(rec, 'rec.wav'), mix, SR)

    # frames -> constant 60 fps, each frame held until the next one arrived
    lst = os.path.join(rec, 'frames.txt')
    with open(lst, 'w') as f:
        for i, fr in enumerate(frames):
            nxt = frames[i + 1]['t'] if i + 1 < len(frames) else fr['t'] + 1000 / 60
            f.write("file 'frames/%s'\nduration %.4f\n" % (fr['f'], (nxt - fr['t']) / 1000))
        f.write("file 'frames/%s'\n" % frames[-1]['f'])
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-fps_mode', 'cfr', '-r', '60',
                    '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p',
                    os.path.join(rec, 'rec.mp4')], check=True, cwd=rec)
    print('segments', len(segs), 'files', sorted({os.path.basename(s['file']) for s in segs}),
          'length %.1f s' % ((t_end - t0) / 1000))

if __name__ == '__main__':
    main()
