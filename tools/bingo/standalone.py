#!/usr/bin/env python3
"""Build the standalone Lecture Bingo page from the game, for sharing on its own.

    python3 tools/bingo/standalone.py            -> build/bingo/ (index.html + the assets it uses)

Same approach as tools/rap/standalone.py (whose helpers it reuses): the engine and the Lecture
Theatre only, every other room, the trailer and the interludes dropped, a fresh save on every
visit, and only the lecture's voices packed into voices-bingo.mp3. A start button in front of
the room is the click the browser needs before the suspense music may play; after BINGO the
"Continue to Campus Map" button becomes "Play again".
"""
import importlib.util, json, os, re, shutil, sys

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('rapsa', os.path.join(HERE, '..', 'rap', 'standalone.py'))
R = importlib.util.module_from_spec(spec); spec.loader.exec_module(R)
ROOT, WEB, GAME = R.ROOT, R.WEB, R.GAME
OUT = os.path.join(ROOT, 'build', 'bingo')
KEEP_ROOMS = {'lecture'}

SEED = {'inventory': ['bingocard'], 'flags': {'actRenumberMigrated': True, 'bingocardTaken': True}}

HEAD = """<script>
/* Lecture Bingo, standalone: a fresh save on every visit, straight into the lecture. The engine
   reads these globals first -- an artifact's sandbox may refuse localStorage/sessionStorage. */
window.CODEBOOK_SEED = JSON.parse(%s);
window.CODEBOOK_BOOT_ROOM = 'lecture';
try {
  localStorage.setItem('codebook_save_v1', %s);
  sessionStorage.setItem('cb_goroom', 'lecture');
} catch(e){}
</script>
<style>
  #gameHud, #root > div:has(> #backToMap){ display:none !important; }
  #bgStart{ position:fixed; inset:0; z-index:9999; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:18px;
    background:radial-gradient(ellipse at 50%% 40%%, rgba(122,31,18,.92), rgba(10,6,18,.97)); color:#fff3c4; font-family:Fraunces, Georgia, serif; text-align:center; padding:16px; }
  #bgStart h1{ margin:0; font-size:clamp(34px,7vw,88px); letter-spacing:.12em; text-shadow:0 4px 0 #3a0d06, 0 0 30px rgba(255,200,80,.8); }
  #bgStart p{ margin:0; max-width:560px; font:500 clamp(13px,1.6vw,18px)/1.5 'Source Sans 3', sans-serif; color:#f3e6c4; }
  #bgStart button{ font:900 clamp(16px,2vw,24px) Fraunces, Georgia, serif; letter-spacing:.1em; padding:14px 34px; border:0; border-radius:999px; cursor:pointer;
    color:#fff; background:#b3261e; box-shadow:0 0 0 4px #f5c542, 0 12px 30px rgba(0,0,0,.5); }
</style>
""" % (json.dumps(json.dumps(SEED)), json.dumps(json.dumps(SEED)))

BOOT = """<script>
window.CODEBOOK_START();
(function(){
  var o = document.createElement('div'); o.id = 'bgStart';
  o.innerHTML = '<h1>LECTURE BINGO!</h1><p>Dr. Vossberg is lecturing on systems theory, and the whole back half of the hall has a bingo card. Ask him about Luhmann to set him off, then dab each buzzword the moment he says it. Watch out for decoys. He will not notice. He never does.</p><button id="bgGo">&#9654; PLAY</button><p style="font-size:13px;opacity:.7">Sound on. From <i>The Secret of the Lost Codebook</i>.</p>';
  document.body.appendChild(o);
  document.getElementById('bgGo').addEventListener('click', function(){
    o.remove();
    var go = function(){ if (window.CODEBOOK_LT_ASK) window.CODEBOOK_LT_ASK(); else setTimeout(go, 200); };
    go();
  });
})();
</script>"""

def main():
    s = open(GAME).read()
    lecture = re.search(r"<script>\s*/\* =+ ROOM: LECTURE THEATRE.*?</script>", s, re.S).group(0)
    blocks = list(re.finditer(r'<script>.*?</script>', s, re.S))
    out, last = [], 0
    for m in blocks:
        body = m.group(0)
        rooms = set(re.findall(r"CODEBOOK_REGISTER\(\{\s*id:\s*'([a-z0-9]+)'", body))
        drop = (rooms and not rooms & KEEP_ROOMS) or any(k in body[:300] for k in R.DROP_MARKERS)
        boot = 'Preloaded quietly behind the logo/title screens' in body[:400]
        out.append(s[last:m.start()])
        if boot: out.append(BOOT)
        elif not drop: out.append(body)
        last = m.end()
    out.append(s[last:])
    h = ''.join(out)
    h = re.sub(r'<div id="bootSplash">.*?</div>\s*(?=<div class="stage">)', '', h, flags=re.S)
    h = re.sub(r'<title>.*?</title>', '<title>Lecture Bingo</title>', h, count=1)
    first = h.index('<script>'); h = h[:first] + HEAD + h[first:]
    # after BINGO: play again, not the campus map
    n0 = h.count("btn.textContent = 'Continue to Campus Map →';")
    h = re.sub(r"btn\.textContent = 'Continue to Campus Map →';(\s*)btn\.addEventListener\('click', ctx\.goMap\);",
               lambda m: "btn.textContent = 'Play again ↻';" + m.group(1) + "btn.addEventListener('click', function(){ location.reload(); });", h)
    assert "Play again" in h, 'play-again swap did not match (%d candidates)' % n0
    # prune like the rap build, with the bingo card as the only item
    h = R.cut_object(h, 'var ITEM_LABELS = {', '\n  };', "var ITEM_LABELS = { bingocard: 'A Bingo Card' };")
    h = R.cut_object(h, 'var ITEM_ICONS = {', '\n  };', "var ITEM_ICONS = { bingocard: 'icon-bingocard.png' };")
    h = R.cut_object(h, 'var ITEM_LOOK = {', '\n  };', "var ITEM_LOOK = { bingocard: 'METHODOLOGICALLY SPEAKING &middot; AS WE SHALL SEE &middot; THE LITERATURE IS DIVIDED.' };")
    h = R.cut_object(h, 'var TOBI_LINES = {', '\n  };', "var TOBI_LINES = {};")
    h = R.cut_object(h, 'var TOBI_BEG = [', '\n  ];', 'var TOBI_BEG = [];')
    h = re.sub(r'(?m)^[ \t]*//[^\n]*\n', '', h)
    h = re.sub(r'(?ms)^[ \t]*/\*.*?\*/[ \t]*\n', '', h)

    # voices: every clip the lecture names, plus the VO-table entries for its speakers
    sprite_all = json.loads(re.search(r'window\.CODEBOOK_VOICE_SPRITE = (\{.*?\});', s, re.S).group(1))
    named = set(re.findall(r"['\"]((?:vo|lecture)-[a-z0-9-]+\.mp3)['\"]", lecture)) & set(sprite_all)
    m = re.search(r'window\.CODEBOOK_VO = \{(.*?)\n\s*\};', h, re.S)
    entries = re.findall(r'^\s*("(?:[^"\\]|\\.)*"):\s*("vo-(?:lecturer|tobi)-[0-9a-f]+\.mp3"),?\s*$', m.group(1), re.M)
    entries = [e for e in entries if json.loads(e[1]) in named or json.loads(e[1]).startswith('vo-lecturer-')]
    h = h[:m.start()] + 'window.CODEBOOK_VO = {\n' + ',\n'.join('  %s: %s' % e for e in entries) + '\n};' + h[m.end():]
    clips = (named | {json.loads(v) for _, v in entries}) & set(sprite_all)

    os.makedirs(OUT, exist_ok=True)
    for f in os.listdir(OUT): os.remove(os.path.join(OUT, f))
    # R.build_voices reads audio/voices; the lecture-line clips live in the bundle only, so
    # cut every clip out of its current bundle instead
    import subprocess, tempfile
    sprite, t = {}, 0.0
    with tempfile.TemporaryDirectory() as tmp:
        gap = os.path.join(tmp, 'gap.wav')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', 'anullsrc=r=24000:cl=mono', '-t', '0.45', gap], check=True)
        parts = []
        for i, c in enumerate(sorted(clips)):
            b, st, d = sprite_all[c]; w = os.path.join(tmp, '%03d.wav' % i)
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(st), '-t', str(d), '-i', os.path.join(WEB, b), '-ar', '24000', '-ac', '1', w], check=True)
            dd = R.dur(w); sprite[c] = ['voices-bingo.mp3', round(t, 3), round(dd, 3)]; parts += [w, gap]; t += dd + 0.45
        lst = os.path.join(tmp, 'l.txt'); open(lst, 'w').write(''.join("file '%s'\n" % p for p in parts))
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-codec:a', 'libmp3lame', '-b:a', '96k', os.path.join(OUT, 'voices-bingo.mp3')], check=True)
    m = re.search(r'window\.CODEBOOK_VOICE_SPRITE = (\{.*?\});', h, re.S)
    h = h[:m.start(1)] + json.dumps(sprite, separators=(',', ':')) + h[m.end(1):]

    # assets: whatever the lecture names, plus the engine's sound bundles and the crowd arms
    names = set(re.findall(r"([A-Za-z0-9_-]+\.(?:webp|png|mp3))", lecture)) - set(sprite_all)
    names |= {'sfx-act1.mp3', 'sfx-act3.mp3', 'sfx-rap.mp3', 'icon-bingocard.png', 'rig-prof-head.webp', 'rig-prof-torso.webp',
              'rig-prof-upperarm.webp', 'rig-prof-forearm.webp', 'rig-prof-thigh.webp', 'rig-prof-shin.webp'}
    names |= {'crowd-arm-%d.webp' % i for i in range(1, 9)}
    names |= {'bingo-tense.mp3', 'bingo-tight.mp3', 'bingo-hit.mp3', 'bingo-miss.mp3'}   # named at runtime
    copied = []
    for n in sorted(names):
        src = os.path.join(WEB, n)
        if os.path.isfile(src): shutil.copy(src, os.path.join(OUT, n)); copied.append(n)
    open(os.path.join(OUT, 'index.html'), 'w').write(h)
    total = sum(os.path.getsize(os.path.join(OUT, f)) for f in os.listdir(OUT))
    print('index.html %d KB, %d assets + voices-bingo.mp3, %.1f MB total, %d voice clips' % (len(h) // 1024, len(copied), total / 1048576, len(clips)))
    print(' '.join(copied))

if __name__ == '__main__':
    main()
