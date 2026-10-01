"""Room ambience loops (2026-09-30): a quiet bed plus a few sparse details, mixed into a seamless
40 s mono loop per room, from Mixkit sounds in raw2/ (downloaded by id; free licence, no account).

    python3 build_amb.py            # writes ../../web/amb-<name>.mp3 and prints the sprite entries

A loop is seamless because 43 s are built and the last 3 s are cross-faded into the first 3 s.
Details sit between 4 s and 36 s, clear of the seam.
"""
import subprocess, json, os
L, SEAM = 40.0, 3.0
ROOMS = {
    # name:        (bed id, bed gain dB, [(detail id, at s, gain dB), ...])
    'lecture':    ('2981', -3, [('2369', 6, -8), ('2386', 12, -10), ('2369', 19, -8), ('2386', 27, -10), ('2369', 31, -8)]),
    'roomtone':   ('3080', 0, []),
    'hum':        ('2132', 0, []),
    'library':    ('3080', 0, [('2504', 4, -16), ('2386', 5, -6), ('2386', 17, -6), ('2386', 29, -6), ('2386', 35, -8)]),
    'hall':       ('3080', 0, [('543', 8, -10), ('543', 26, -12)]),
    'workshop':   ('2137', -2, [('2594', 7, -8), ('2594', 21, -8), ('2594', 33, -10)]),
    'ethics':     ('3080', 0, [('1911', 10, -12)]),
    'casino':     ('2981', -18, [('1932', 4, -10), ('1993', 12, -12), ('1939', 18, -12), ('1932', 24, -11), ('1993', 30, -12), ('1939', 35, -13)]),
    'machine':    ('2504', -4, [('1377', 6, -10), ('1377', 22, -11)]),
    'bureau':     ('2981', -6, [('2995', 5, -6), ('1365', 9, -6), ('2995', 17, -6), ('1365', 24, -6), ('1365', 25, -7), ('2995', 33, -6)]),
    'typing':     ('1372', -2, []),
    'audience':   ('2981', 0, []),
    'writing':    ('3080', 0, [('2369', 4, -8), ('2369', 13, -8), ('2532', 15, -12), ('2369', 26, -8), ('2369', 34, -8)]),
}
def build(name, bed, bedgain, details):
    out = '../../web/amb-%s.mp3' % name
    inputs = ['-stream_loop', '-1', '-i', 'raw2/%s.wav' % bed]
    for d, _, _ in details: inputs += ['-i', 'raw2/%s.wav' % d]
    fc = '[0:a]aresample=44100,pan=mono|c0=c0,atrim=0:%s,asetpts=PTS-STARTPTS,volume=%sdB[bed];' % (L + SEAM, bedgain)
    mix = ['[bed]']
    for k, (d, at, g) in enumerate(details, 1):
        fc += '[%d:a]aresample=44100,pan=mono|c0=c0,volume=%sdB,adelay=%d|%d[d%d];' % (k, g, at * 1000, at * 1000, k)
        mix.append('[d%d]' % k)
    fc += ''.join(mix) + 'amix=inputs=%d:normalize=0:duration=first,asplit=3[x][y][z];' % len(mix)
    fc += '[x]atrim=0:%s,asetpts=PTS-STARTPTS,afade=t=in:d=%s[head];' % (SEAM, SEAM)
    fc += '[y]atrim=%s:%s,asetpts=PTS-STARTPTS,afade=t=out:d=%s[tail];' % (L, L + SEAM, SEAM)
    fc += '[head][tail]amix=inputs=2:normalize=0[seam];'
    fc += '[z]atrim=%s:%s,asetpts=PTS-STARTPTS[body];' % (SEAM, L)
    fc += '[seam][body]concat=n=2:v=0:a=1,highpass=f=60,loudnorm=I=-20:TP=-2[out]'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', fc, '-map', '[out]',
                    '-ar', '44100', '-ac', '1', '-codec:a', 'libmp3lame', '-q:a', '5', out], check=True)
    d = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', out],
                             capture_output=True, text=True).stdout)
    return out, round(d, 3)
if __name__ == '__main__':
    sprite = {}
    for name, (bed, g, det) in ROOMS.items():
        out, d = build(name, bed, g, det)
        sprite['amb-' + name] = [os.path.basename(out), 0, d]
        print(name, d, round(os.path.getsize(out) / 1024), 'KB')
    json.dump(sprite, open('amb-sprite.json', 'w'), indent=1)
