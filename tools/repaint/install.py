#!/usr/bin/env python3
"""Install the repainted character art into web/ under the old file names.

  install.py [--dry]

- every art/characters/repaint/*/final-<name>.png  -> web/sprite-<name>.webp, web/<name>.webp or web/duel/<name>.webp
  (whichever exists already: the room code keeps its names)
- mouth-<name>.png next to a final -> web/mouth-<target>.webp   (same box as the sprite, open mouth)
- blink-<name>.png next to a final -> web/blink-<target>.webp   (same box, eyes closed)
- the four refitted rigs (tools/rig/<name>/): parts -> web/rig-<name>-<part>.webp, and the
  window.<NAME>_RIG line in the game is replaced by the one from rig-def.js
- the five cast posters from art/characters/repaint/panels/
The old files are in git; nothing else is kept."""
import glob, json, os, re, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
WEB, REP = os.path.join(ROOT, 'web'), os.path.join(ROOT, 'art/characters/repaint')
GAME = os.path.join(WEB, 'the-secret-of-the-codebook.html')
DRY = '--dry' in sys.argv
POSTERS = {'trailer-cast-act1.webp': 'cb-repaint-cast-act1.png', 'il2-cast.webp': 'cb-repaint-cast-act2.png',
           'trailer3-e-cast.webp': 'cb-repaint-cast-act3.png', 'il4-cast.webp': 'cb-repaint-cast-act4.png',
           'il5-cast.webp': 'cb-repaint-cast-act5-c.png'}
RIGS = ['director', 'doorman', 'nurse', 'officer']
# kept in their earlier version on purpose (author, 2026-10-01: the bingo hands "the older version was much better")
SKIP = {f'crowd-arm-{k}' for k in range(1, 9)} | {'crowd-heads'}   # the arms were placed to fit these heads
# rooms that load a mouth by its own name (the 2026-10-01 nurse bug): also written under that name
ALIAS = {n: f'mouth-{n}.webp' for n in ('director', 'doorman', 'judge-chair', 'judge-keeper', 'nurse', 'officer')}

def webp(src, dst, size=None, q=90):
    im = Image.open(src)
    im = im.convert('RGBA') if im.mode in ('RGBA', 'LA', 'P') else im.convert('RGB')
    if size and im.size != size: im = im.resize(size, Image.LANCZOS)
    print(('would write ' if DRY else '') + os.path.relpath(dst, ROOT), im.size)
    if not DRY: im.save(dst, 'WEBP', quality=q, method=6)

def target(name):
    for t in (f'sprite-{name}.webp', f'{name}.webp', f'duel/{name}.webp'):
        if os.path.exists(os.path.join(WEB, t)): return t

n = 0
for p in sorted(glob.glob(f'{REP}/*/final-*.png')):
    name = os.path.basename(p)[6:-4]; t = target(name)
    if name in SKIP: continue
    if not t: print('!! no web file for', name); continue
    webp(p, os.path.join(WEB, t)); n += 1
    d = os.path.dirname(p); base = os.path.basename(t)[:-5]; sub = os.path.dirname(t)
    for kind in ('mouth', 'blink'):
        o = os.path.join(d, f'{kind}-{name}.png')
        if os.path.exists(o): webp(o, os.path.join(WEB, sub, f'{kind}-{base}.webp'), q=88)
        if kind == 'mouth' and name in ALIAS and os.path.exists(o): webp(o, os.path.join(WEB, ALIAS[name]), q=88)
print(n, 'sprites')

for dst, src in POSTERS.items():
    s = os.path.join(REP, 'panels', src)
    if os.path.exists(s): webp(s, os.path.join(WEB, dst), size=Image.open(os.path.join(WEB, dst)).size, q=86)
    else: print('!! missing poster', src)

game = open(GAME).read()
for r in RIGS:
    js = open(os.path.join(ROOT, 'tools/rig', r, 'rig-def.js')).read()
    m = re.search(r'window\.(\w+_RIG) = (\{.*\});', js)
    var, cfg = m.group(1), json.loads(m.group(2))
    def walk(node):
        part = os.path.basename(node['src'])[:-4]
        webp(os.path.join(ROOT, 'tools/rig', node['src']), os.path.join(WEB, f'rig-{r}-{part}.webp'))
        node['src'] = f'rig-{r}-{part}.webp'
        for c in node.get('children', []): walk(c)
    walk(cfg['root'])
    mo = os.path.join(ROOT, 'tools/rig', r, 'mouth-head.png')   # the talking head (see the rig builder in the game)
    if os.path.exists(mo): webp(mo, os.path.join(WEB, f'rig-{r}-head-mouth.webp'), q=88)
    line = f'window.{var} = ' + json.dumps(cfg) + ';'
    game, k = re.subn(r'window\.' + var + r' = \{.*\};', lambda _: line, game)
    print(var, 'replaced' if k == 1 else f'!! found {k} times')
if not DRY: open(GAME, 'w').write(game)
