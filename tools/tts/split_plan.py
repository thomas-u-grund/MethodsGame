#!/usr/bin/env python3
"""Work out which voice bundle every clip belongs in (lazy loading, 2026-09-27).

Bundles:
  voices-common      phone calls, hints, voicemails -- preloaded in every act (unchanged)
  voices-intro       the opening trailer (unchanged)
  voices-actN-core   the act's cutscenes, endings and anything used by more than one room;
                     the only voices the act's loading bar waits for
  voices-room-ID     one per room: its dialogue and narration, fetched in the background
                     once the act has started, and first when you walk into that room

A clip belongs to the room whose <script> block contains its text (or its file name). Clips
found in several rooms, in the engine, or in an interlude go to their act's core.

    python3 tools/tts/split_plan.py            # print the plan (and how it differs from the game's table)
    python3 tools/tts/split_plan.py --json F   # write {clip: bundle} to F
    python3 tools/tts/split_plan.py --write    # rewrite CODEBOOK_ROOM_CLIPS in the game file

Since 2026-09-27 every clip is its own file (voices/<name>.mp3), so a clip's act comes from the
rooms its text is found in, or else from where the game's table has it now (2026-09-30: the
old code read the act from the bundle's file name and put nearly everything in act1-core).
"""
import re, json, html, sys, os, collections
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
s = open(os.path.join(ROOT, 'web', 'the-secret-of-the-codebook.html')).read()
sprite = json.loads(re.search(r'window\.CODEBOOK_VOICE_SPRITE = (\{.*?\});', s, re.S).group(1))
i0 = s.index('window.CODEBOOK_VO = {'); i1 = s.index('window.CODEBOOK_NARR = '); i2 = s.index('\n', i1)
vo = {json.loads(k): v for k, v in re.findall(r'^\s*("(?:[^"\\]|\\.)*"):\s*"([^"]+)"', s[i0:i1], re.M)}
nr = json.loads(re.search(r'window\.CODEBOOK_NARR = (\{.*?\});\n', s).group(1).replace('<\\/', '</'))
# the code without the lookup tables, so a text is only found where it is actually used
code = s[:s.index('window.CODEBOOK_VOICE_SPRITE')] + ' ' * 0
body = s[:i0] + s[i2:]
body = re.sub(r'window\.CODEBOOK_VOICE_SPRITE = \{.*?\};', '', body, flags=re.S)
# the room table and the outro's table name every clip too, outside any room (2026-09-30)
body = re.sub(r'window\.CODEBOOK_ROOM_CLIPS = \{.*?\};', '', body, flags=re.S)
body = re.sub(r'window\.CODEBOOK_OUTRO_VO = \{.*?\};', '', body, flags=re.S)
# room spans: the <script> block that registers the room
# a room's module runs from its <script> block or its /* ==== ROOM ==== */ header to the next one
# (several rooms share one <script> block now)
scripts = sorted(set([m.start() for m in re.finditer(r'<script>|/\* ={5,}', body)] + [len(body)]))
spans = []
for m in re.finditer(r"CODEBOOK_REGISTER\(\{\s*id:\s*'([a-z]+)',\s*act:\s*'(Act [IVX]+)'", body):
    a = max(x for x in scripts if x < m.start()); b = min(x for x in scripts if x > m.start())
    spans.append((a, b, m.group(1), m.group(2)))
ACTB = {'Act I': 'act1', 'Act II': 'act2', 'Act III': 'act3', 'Act IV': 'act45', 'Act V': 'act45'}
def rooms_at(positions):
    out = set()
    for p in positions:
        r = [sp for sp in spans if sp[0] <= p < sp[1]]
        out.add(r[0][2] if r else None)
    return out
def find_text(t):
    words = re.findall(r"[A-Za-z]{3,}", t)
    for n in (6, 5, 4, 3):
        if len(words) < 2: break
        ws = words[:n]
        pos = [m.start() for m in re.finditer(r'[^\n]{0,500}?'.join(re.escape(w) for w in ws), body)]
        if pos: return pos
    return []
key_of = collections.defaultdict(list)
for k, v in vo.items(): key_of[v].append(k)
for k, v in nr.items(): key_of[v].append(k)
m_rc = re.search(r'window\.CODEBOOK_ROOM_CLIPS = (\{.*?\});', s)
table = json.loads(m_rc.group(1))
cur_of = {c: k for k, v in table.items() for c in v}
ROOM_ACT = {sp[2]: ACTB[sp[3]] for sp in spans}
def act_of_bundle(b):
    if not b: return None
    if b.endswith('-core'): return b[:-5]
    return ROOM_ACT.get(b)
plan = {}; why = collections.Counter()
for clip in sprite:
    cur = cur_of.get(clip)
    if cur in ('common', 'intro'): plan[clip] = cur; why['keep'] += 1; continue
    mact = re.match(r'vo-narr-act(\d)', clip)
    if re.match(r'vo-narr-(act\d|seal|il|intro|trailer|outro|end-)', clip):
        act = ('act45' if mact and mact.group(1) in '45' else 'act' + mact.group(1)) if mact else ('act45' if re.match(r'vo-narr-(outro|end-)', clip) else act_of_bundle(cur) or 'act1')
        plan[clip] = act + '-core'; why['interlude'] += 1; continue
    pos = [m.start() for m in re.finditer(re.escape(clip), body)]
    for k in key_of.get(clip, []): pos += find_text(k)
    rs = rooms_at(pos)
    if len(rs) == 1 and None not in rs:
        plan[clip] = 'room-' + rs.pop(); why['room'] += 1; continue
    acts = {ROOM_ACT[r] for r in rs if r}
    if len(acts) == 1 and None not in rs:
        plan[clip] = acts.pop() + '-core'; why['core:shared'] += 1; continue
    # nothing definite (text not found, or used by the engine): keep it where it is; never guess it into
    # act1-core, which the Act I loading bar waits for
    why['kept:' + ('none' if not pos else 'engine')] += 1
    if cur: plan[clip] = cur
new_table = collections.defaultdict(list)
for c in sorted(plan): new_table[plan[c].replace('room-', '')].append(c)
for k in table:
    new_table.setdefault(k, [])
moved = [(c, cur_of.get(c), plan[c].replace('room-', '')) for c in plan if cur_of.get(c) != plan[c].replace('room-', '')]
print('%d clips would move' % len(moved)); [print('  %-34s %-14s -> %s' % m) for m in moved[:40]]
if '--write' in sys.argv:
    g = open(os.path.join(ROOT, 'web', 'the-secret-of-the-codebook.html')).read()
    m2 = re.search(r'window\.CODEBOOK_ROOM_CLIPS = (\{.*?\});', g)
    g = g[:m2.start(1)] + json.dumps(dict(new_table), separators=(',', ':')) + g[m2.end(1):]
    open(os.path.join(ROOT, 'web', 'the-secret-of-the-codebook.html'), 'w').write(g); print('wrote CODEBOOK_ROOM_CLIPS')
if '--json' in sys.argv: json.dump(plan, open(sys.argv[sys.argv.index('--json') + 1], 'w'), indent=0, sort_keys=True)
tot = collections.defaultdict(float)
for c, b in plan.items(): tot[b] += sprite[c][2] + 0.45
for b in sorted(tot, key=lambda b: -tot[b]): print('%-26s %6.0f s  ~%4.1f MB' % ('voices-' + b, tot[b], tot[b] * 6000 / 1e6))
print(dict(why))
