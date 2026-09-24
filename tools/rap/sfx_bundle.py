#!/usr/bin/env python3
"""Build web/sfx-rap.mp3 -- the Founders' Rap Battle's own sound effects -- and merge their
offsets into CODEBOOK_SFX_SPRITE in the game file.

    python3 tools/rap/sfx_bundle.py

Sources are tools/sfx/raw/<name>.wav: nine Mixkit downloads (ids in tools/sfx/picks.json)
plus the synthesised air horn (tools/rap/airhorn.py). A separate bundle rather than a rebuild
of sfx-act1/act3, so none of the existing offsets move. Loudness matches tools/sfx/build.py.
"""
import json, os, re, subprocess, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
RAW = os.path.join(ROOT, 'tools', 'sfx', 'raw')
GAME = os.path.join(ROOT, 'web', 'the-secret-of-the-codebook.html')
BUNDLE = 'sfx-rap.mp3'
GAP = 0.35
# name -> max seconds (long crowd beds are trimmed and faded)
CLIPS = {'sfx-airhorn': None, 'sfx-scratch': None, 'sfx-needle': None, 'sfx-mic-hit': None,
         'sfx-mic-feedback': 2.5, 'sfx-drumroll': 4.5, 'sfx-crowd-laugh': 4.0,
         'sfx-applause-hall': 6.0, 'sfx-crowd-cheer': 6.0, 'sfx-crowd-huge': 8.0}

def dur(p):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p],
                                capture_output=True, text=True).stdout)

def main():
    with tempfile.TemporaryDirectory() as tmp:
        parts, man, t = [], {}, 0.0
        gap = os.path.join(tmp, 'gap.wav')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-t', str(GAP), '-i', 'anullsrc=r=44100:cl=mono', gap], check=True)
        for name, limit in CLIPS.items():
            out = os.path.join(tmp, name + '.wav')
            af = 'silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.03,loudnorm=I=-20:TP=-2'
            cmd = ['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(RAW, name + '.wav')]
            if limit:
                cmd += ['-t', str(limit)]
                af += ',afade=t=out:st=%.2f:d=0.8' % (limit - 0.8)
            subprocess.run(cmd + ['-af', af, '-ac', '1', '-ar', '44100', out], check=True)
            d = dur(out)
            man[name] = [BUNDLE, round(t, 3), round(d, 3)]
            parts += [out, gap]; t += d + GAP
        lst = os.path.join(tmp, 'list.txt')
        open(lst, 'w').write(''.join("file '%s'\n" % p for p in parts))
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst,
                        '-codec:a', 'libmp3lame', '-b:a', '96k', os.path.join(ROOT, 'web', BUNDLE)], check=True)
    s = open(GAME).read()
    m = re.search(r'window\.CODEBOOK_SFX_SPRITE = (\{.*?\});', s, re.S)
    sprite = json.loads(m.group(1))
    sprite = {k: v for k, v in sprite.items() if v[0] != BUNDLE}
    sprite.update(man)
    s = s[:m.start(1)] + json.dumps(sprite, separators=(',', ':')) + s[m.end(1):]
    open(GAME, 'w').write(s)
    print(BUNDLE, len(man), 'clips', round(t, 1), 's')

if __name__ == '__main__':
    main()
