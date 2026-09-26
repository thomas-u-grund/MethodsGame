#!/usr/bin/env python3
"""Rebuild a per-act voice bundle and its offset table.

Every voiced line ships inside one mp3 per act (the artifact host allows 255 files
per version, and 145 loose clips would eat most of that). The game looks each clip
up in CODEBOOK_VOICE_SPRITE -> [bundle, startSeconds, durationSeconds].

    python3 tools/tts/bundle.py act3            # rebuild voices-act3.mp3 from the current map
    python3 tools/tts/bundle.py act3 --add foo.mp3 bar.mp3
    python3 tools/tts/bundle.py act3 --check    # report only, touch nothing

Clip sources live in audio/voices/. The bundle is written to web/voices-<act>.mp3 and
the CODEBOOK_VOICE_SPRITE literal in the game file is rewritten in place.

Always rerun this after changing any clip: a stale offset table is silent audio, and a
muted headless test cannot hear that.
"""
import json, re, subprocess, sys, os, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
GAME = os.path.join(ROOT, 'web', 'the-secret-of-the-codebook.html')
SRC = os.path.join(ROOT, 'audio', 'voices')
GAP = 0.45  # silence between clips, so a mistimed stop never bleeds into the next line

def load_map():
    s = open(GAME).read()
    m = re.search(r'window\.CODEBOOK_VOICE_SPRITE = (\{.*?\});', s, re.S)
    if not m:
        sys.exit('CODEBOOK_VOICE_SPRITE not found in ' + GAME)
    return s, m, json.loads(m.group(1))

def duration(path):
    out = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
                          '-of', 'default=nw=1:nk=1', path], capture_output=True, text=True)
    return float(out.stdout.strip())

def decoded_duration(path):
    """What the browser will actually get.

    ffprobe reports an mp3's duration from its header, which for a concatenated file can
    be over a second longer than the stream really decodes to. The game seeks by absolute
    offset, so a clip written past the real end plays silence -- which is exactly what
    happened to the last clip in voices-act1 and what test-audio caught. Decoding is slower
    and correct, so the overrun check uses this."""
    out = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'null', '-'],
                         stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    m = None
    for line in (out.stdout or '').splitlines():
        for tok in re.findall(r'time=(\d+):(\d+):(\d+\.\d+)', line):
            m = tok
    if not m:
        return duration(path)
    return int(m[0]) * 3600 + int(m[1]) * 60 + float(m[2])

def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    act = sys.argv[1]
    bundle_name = 'voices-%s.mp3' % act
    add = sys.argv[sys.argv.index('--add') + 1:] if '--add' in sys.argv else []
    check = '--check' in sys.argv

    s, m, sprite = load_map()
    clips = [k for k, v in sprite.items() if v[0] == bundle_name]
    for a in add:
        if a not in clips:
            clips.append(a)
    clips.sort()
    if not clips:
        sys.exit('no clips for ' + bundle_name)

    missing = [c for c in clips if not os.path.exists(os.path.join(SRC, c))]
    if missing:
        sys.exit('missing source clips in audio/voices/: ' + ', '.join(missing))

    print('%s: %d clips' % (bundle_name, len(clips)))
    if check:
        total = sum(duration(os.path.join(SRC, c)) for c in clips)
        print('  total audio %.1fs (+%.1fs of gaps)' % (total, GAP * (len(clips) - 1)))
        return

    # Normalise every clip the same way, then concatenate with fixed gaps so the offsets
    # we write are exactly the offsets ffmpeg produces.
    with tempfile.TemporaryDirectory() as tmp:
        silence = os.path.join(tmp, 'gap.wav')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i',
                        'anullsrc=r=24000:cl=mono', '-t', str(GAP), silence], check=True)
        parts, offsets, t = [], {}, 0.0
        for i, c in enumerate(clips):
            w = os.path.join(tmp, '%04d.wav' % i)
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(SRC, c),
                            '-ar', '24000', '-ac', '1', '-af', 'loudnorm=I=-18:TP=-2:LRA=11',
                            w], check=True)
            d = duration(w)
            offsets[c] = [bundle_name, round(t, 3), round(d, 3)]
            parts.append(w)
            t += d
            parts.append(silence)          # after every clip, including the last: the tail
            t += GAP                        # gives the final offset room to be slightly off
        lst = os.path.join(tmp, 'list.txt')
        open(lst, 'w').write(''.join("file '%s'\n" % p for p in parts))
        out = os.path.join(ROOT, 'web', bundle_name)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0',
                        # CBR, not VBR. The game seeks to absolute offsets inside this
                        # file, and a browser derives an mp3's duration from bitrate x size.
                        # With VBR that estimate was 1.6s short of the real stream, so a
                        # clip near the end resolved past what the browser thought was the
                        # end and played silence. At a constant bitrate the estimate is exact.
                        '-i', lst, '-codec:a', 'libmp3lame', '-b:a', '48k', out], check=True)

    real = decoded_duration(out)
    print('  wrote %s  %.1fs decoded  %.1f MB' % (bundle_name, real, os.path.getsize(out) / 1e6))
    overrun = [c for c, v in offsets.items() if v[1] + v[2] > real - 0.05]
    if overrun:
        sys.exit('offsets overrun the bundle: ' + ', '.join(overrun))

    sprite.update(offsets)
    merged = json.dumps(sprite, separators=(',', ':'), sort_keys=True)
    s = s[:m.start(1)] + merged + s[m.end(1):]
    open(GAME, 'w').write(s)
    print('  offset table updated (%d clips total)' % len(sprite))

if __name__ == '__main__':
    main()
