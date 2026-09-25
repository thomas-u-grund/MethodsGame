"""Synthesise the Lecture Bingo suspense music (ROADMAP 8zo): a "who wants to be a
millionaire" style bed, all generated here, so there is nothing to license.

    .venv-tts/bin/python tools/music/bingo_music.py      -> web/bingo-tense.mp3, web/bingo-tight.mp3,
                                                            web/bingo-hit.mp3, web/bingo-miss.mp3

Both loops are exactly 8 bars at 92 BPM in A minor and loop seamlessly. "tense" is the
bed; "tight" (one square from a line) adds tremolo strings, a rising filter and a timpani
roll into the loop point."""
import numpy as np, subprocess, os, tempfile, wave
SR = 44100
BPM = 92; BEAT = 60 / BPM; BAR = 4 * BEAT; BARS = 8; N = int(round(BARS * BAR * SR))
t_all = np.arange(N) / SR
rng = np.random.default_rng(7)
def hz(m): return 440.0 * 2 ** ((m - 69) / 12)
def env(n, a, d, s, r, sus_len):
    a, d, r = int(a*SR), int(d*SR), int(r*SR); sus = max(0, int(sus_len*SR) - a - d)
    e = np.concatenate([np.linspace(0,1,a,False), np.linspace(1,s,d,False), np.full(sus, s), np.linspace(s,0,r)])
    return np.pad(e, (0, max(0, n-len(e))))[:n]
def lowpass(x, cutoff):
    # one-pole, cutoff may be an array
    c = np.broadcast_to(np.asarray(cutoff, float), x.shape)
    a = np.exp(-2*np.pi*c/SR); y = np.zeros_like(x); z = 0.0
    for i in range(len(x)): z = (1-a[i])*x[i] + a[i]*z; y[i] = z
    return y
def saw(f, t, detune=0.0): 
    ph = (f*(1+detune))*t; return 2*(ph - np.floor(ph+0.5))
def place(buf, snd, at):
    i = int(at*SR) % N; L = len(snd)
    if i+L <= N: buf[i:i+L] += snd
    else: k = N-i; buf[i:] += snd[:k]; buf[:L-k] += snd[k:]      # wrap: seamless loop

def pulse_bass():
    out = np.zeros(N)
    prog = [45,45,41,41,43,43,40,44]          # A A F F G G E G#  (bars)
    for b in range(BARS):
        for e in range(8):                     # eighth notes
            n = int(BEAT/2*SR); t = np.arange(n)/SR; f = hz(prog[b]-12)
            s = 0.6*np.sign(np.sin(2*np.pi*f*t)) + 0.5*saw(f, t, 0.004)
            s = lowpass(s, 380 + 900*np.exp(-t*22)) * env(n, .004, .08, .45, .05, BEAT/2*0.8)
            place(out, s*(1.0 if e % 2 == 0 else 0.7), b*BAR + e*BEAT/2)
    return out
def drone():
    chords = [[57,60,64],[57,60,64],[53,57,60],[53,57,60],[55,59,62],[55,59,62],[52,56,59],[56,59,64]]
    out = np.zeros(N)
    for b, ch in enumerate(chords):
        n = int(BAR*SR); t = np.arange(n)/SR
        s = sum(saw(hz(m-12), t, d) for m in ch for d in (-0.003, 0.003)) / 6
        s = lowpass(s, 700) * env(n, .6, .2, .8, .6, BAR)
        place(out, s, b*BAR)
    return out
def heartbeat():
    out = np.zeros(N); n = int(0.25*SR); t = np.arange(n)/SR
    thump = np.sin(2*np.pi*(55*np.exp(-t*9)+38)*t) * np.exp(-t*16)
    for b in range(BARS*4):
        if b % 2 == 0: place(out, thump, b*BEAT); place(out, thump*0.65, b*BEAT + 0.16)
    return out
def ticks():
    out = np.zeros(N); n = int(0.03*SR)
    for k in range(BARS*8):
        tick = rng.standard_normal(n) * np.exp(-np.arange(n)/SR*260)
        tick = tick - lowpass(tick, 5000)
        place(out, tick * (0.5 if k % 2 else 0.8), k*BEAT/2)
    return out
def tremolo_strings():
    out = np.zeros(N); n = N; t = t_all
    s = (saw(hz(76), t, 0.002) + saw(hz(77), t, -0.002)) / 2            # E5 against F5: the itch
    s *= 0.55 + 0.45*np.sin(2*np.pi*12*t)                                 # tremolo
    s = lowpass(s, 1800) * np.minimum(1, t / 3.0)
    return s
def riser():
    return lowpass(rng.standard_normal(N), 300 + 5000*(t_all/t_all[-1])**3) * (t_all/t_all[-1])**2
def timp_roll():
    out = np.zeros(N); n = int(0.18*SR); t = np.arange(n)/SR
    for k in range(24):
        at = (BARS-1)*BAR + k*BAR/24
        hit = np.sin(2*np.pi*hz(33)*t) * np.exp(-t*14) * (0.3 + 0.7*k/24)
        place(out, hit, at)
    return out

def norm(x, peak=0.89): return x / (np.max(np.abs(x)) + 1e-9) * peak
def write_mp3(x, path, loop=False):
    x = norm(x); x16 = (x*32767).astype(np.int16)
    fd, wav = tempfile.mkstemp(suffix='.wav'); os.close(fd)
    with wave.open(wav, 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(x16.tobytes())
    subprocess.run(['ffmpeg','-v','error','-y','-i',wav,'-codec:a','libmp3lame','-b:a','96k',path], check=True); os.remove(wav)

bass, dr, hb, tk = pulse_bass(), drone(), heartbeat(), ticks()
tense = 0.55*bass + 0.35*dr + 0.7*hb + 0.12*tk
tight = tense + 0.22*tremolo_strings() + 0.10*riser() + 0.5*timp_roll() + 0.12*tk
root = os.path.join(os.path.dirname(__file__), '..', '..', 'web')
write_mp3(tense, os.path.join(root, 'bingo-tense.mp3'))
write_mp3(tight, os.path.join(root, 'bingo-tight.mp3'))

# stings
def sting_hit():
    n = int(1.6*SR); t = np.arange(n)/SR; out = np.zeros(n)
    for i, m in enumerate([69, 73, 76, 81, 85]):                          # A major, climbing
        start = int(i*0.07*SR); tt = t[:n-start]
        tone = (np.sin(2*np.pi*hz(m)*tt) + 0.4*np.sin(2*np.pi*hz(m)*2*tt)) * np.exp(-tt*2.2)
        out[start:] += tone
    shimmer = rng.standard_normal(n) * np.exp(-t*3); shimmer -= lowpass(shimmer, 6000)
    return out + 0.25*shimmer
def sting_miss():
    n = int(1.2*SR); t = np.arange(n)/SR
    f = hz(40) * (1 - 0.12*t)
    s = saw(f, t, 0.01) + saw(f*1.06, t, -0.01)                           # a sour low minor second
    return lowpass(s, 600) * np.exp(-t*2.5)
write_mp3(sting_hit(), os.path.join(root, 'bingo-hit.mp3'))
write_mp3(sting_miss(), os.path.join(root, 'bingo-miss.mp3'))
print('wrote bingo-tense, bingo-tight, bingo-hit, bingo-miss;', round(N/SR, 2), 's loops')
