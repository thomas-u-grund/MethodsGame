#!/usr/bin/env python3
"""Time every lyric line of Professor G's rap to the live recording.

    python3 tools/rap/align.py lyrics.json words.json out.json

lyrics.json: {slide: [[line, ...], ...]} (stanzas, from the Christmas-lecture slides 17-23)
words.json:  tools/rap/transcribe.py output (Whisper word timestamps over profg-live.mp3)

The transcript is good but not the lyrics ("lumen" for Luhmann, "cheese" for gist), so this
aligns the two word sequences (difflib) and gives each lyric line the time of its first word
that the recording matched; a line with no matched word is interpolated between neighbours.
Out: chunks (stanzas split to <=4 lines, shown one at a time), per-line start times (the
caption highlights the line being rapped), and talk intervals -- runs of recognised words --
for the mouth.
"""
import difflib, json, re, sys

def norm(w):
    return re.sub(r"[^a-z0-9]", "", w.lower().replace('’', "'"))

def main():
    lyrics = json.load(open(sys.argv[1]))
    words = json.load(open(sys.argv[2]))['words']
    chunks, lines = [], []           # lines: (chunk index, text)
    for slide in sorted(lyrics, key=int):
        for st in lyrics[slide]:
            for i in range(0, len(st), 4):
                chunks.append(st[i:i + 4])
                for l in st[i:i + 4]:
                    lines.append((len(chunks) - 1, l))
    lw, owner = [], []               # lyric words and the line each belongs to
    for li, (_, l) in enumerate(lines):
        for w in l.split():
            n = norm(w)
            if n: lw.append(n); owner.append(li)
    tw = [norm(w['w']) for w in words]
    sm = difflib.SequenceMatcher(None, lw, tw, autojunk=False)
    first = {}
    for a, b, size in sm.get_matching_blocks():
        for k in range(size):
            li = owner[a + k]
            if li not in first: first[li] = words[b + k]['s']
    # interpolate lines the recording did not match, keeping order
    times = [first.get(i) for i in range(len(lines))]
    known = [i for i, t in enumerate(times) if t is not None]
    for i in range(len(times)):
        if times[i] is not None: continue
        prev = max([k for k in known if k < i], default=None)
        nxt = min([k for k in known if k > i], default=None)
        if prev is not None and nxt is not None:
            times[i] = times[prev] + (times[nxt] - times[prev]) * (i - prev) / (nxt - prev)
        else:
            times[i] = times[prev] + 2.5 * (i - prev) if prev is not None else times[nxt] - 2.5 * (nxt - i)
    for i in range(1, len(times)):          # never go backwards
        times[i] = max(times[i], times[i - 1] + 0.3)
    talk, cur = [], None
    for w in words:
        if cur and w['s'] - cur[1] < 0.35: cur[1] = w['e']
        else:
            if cur: talk.append(cur)
            cur = [w['s'], w['e']]
    if cur: talk.append(cur)
    out = {'chunks': chunks,
           'lines': [[round(t, 2), c, lines[i][1]] for i, (t, (c, _)) in enumerate(zip(times, lines))],
           'talk': [[round(a, 2), round(b, 2)] for a, b in talk],
           'matched': len(first), 'total': len(lines)}
    json.dump(out, open(sys.argv[3], 'w'), ensure_ascii=False)
    print('matched %d of %d lines; %d talk runs' % (len(first), len(lines), len(talk)))

if __name__ == '__main__':
    main()
