#!/usr/bin/env python3
"""One small file per voice clip, loaded when needed (2026-09-27; replaces the act bundles).

GitHub Pages has no file-count limit, so every clip ships as web/voices/<name>.mp3 (48 kbps
mono) and the offset table CODEBOOK_VOICE_SPRITE keeps its shape with a start of 0:
    "vo-kira-1234abcd.mp3": ["voices/vo-kira-1234abcd.mp3", 0, 1.84]
The game plays a clip straight from its own file; a room's clips are fetched in the
background when you walk in (CODEBOOK_ROOM_CLIPS, written from split_plan.py), and an act's
loading bar waits only for its cutscene narration.

    python3 tools/tts/clips.py            # encode anything new or changed, rewrite the table
    python3 tools/tts/clips.py --add a.mp3 b.mp3   # also add these (from audio/voices/)
"""
import json, os, re, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
GAME = os.path.join(ROOT, 'web', 'the-secret-of-the-codebook.html')
SRC = os.path.join(ROOT, 'audio', 'voices'); OUT = os.path.join(ROOT, 'web', 'voices')
os.makedirs(OUT, exist_ok=True)
s = open(GAME).read()
m = re.search(r'window\.CODEBOOK_VOICE_SPRITE = (\{.*?\});', s, re.S)
sprite = json.loads(m.group(1))
add = sys.argv[sys.argv.index('--add') + 1:] if '--add' in sys.argv else []
for a in add: sprite.setdefault(a, ['voices/' + a, 0, 0])
def dur(p):
    o = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', p], capture_output=True, text=True)
    return float(o.stdout.strip())
done = 0; missing = []
for name in sorted(sprite):
    src = os.path.join(SRC, name); dst = os.path.join(OUT, name)
    if not os.path.exists(src): missing.append(name); continue
    if not os.path.exists(dst) or os.path.getmtime(dst) < os.path.getmtime(src):
        subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', src, '-ar', '24000', '-ac', '1',
                        '-af', 'loudnorm=I=-18:TP=-2:LRA=11', '-codec:a', 'libmp3lame', '-b:a', '48k', dst], check=True)
        done += 1
    sprite[name] = ['voices/' + name, 0, round(dur(dst), 3)]
if missing: sys.exit('missing sources in audio/voices: ' + ', '.join(missing[:20]))
s = s[:m.start(1)] + json.dumps(sprite, separators=(',', ':'), sort_keys=True) + s[m.end(1):]
open(GAME, 'w').write(s)
size = sum(os.path.getsize(os.path.join(OUT, f)) for f in os.listdir(OUT))
print('%d clips (%d encoded now), %.1f MB in web/voices/' % (len(sprite), done, size / 1e6))
