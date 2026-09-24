#!/usr/bin/env python3
"""Build the standalone Founders' Rap Battle page from the game, for sharing on its own.

    python3 tools/rap/standalone.py            -> build/rapbattle/ (index.html + the assets it uses)

The author wanted colleagues to see the rap battle without the rest of the game, so this is
not the game with a different start screen: it keeps only the engine, the Hall of Founders
and the cut-out rigs, drops every other room, the trailer and the act interludes, keeps only
Tobi's battle lines in the voice table, and packs just those clips into voices-rap.mp3 (the
game's voices-act1 bundle holds every voice in Acts I and II). A small script ahead of the
engine seeds a fresh save each visit and sends the page straight into the Hall with the
start button -- an artifact receives no query string, so ?play=rap could not do it.
"""
import json, os, re, shutil, subprocess, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
WEB = os.path.join(ROOT, 'web')
GAME = os.path.join(WEB, 'the-secret-of-the-codebook.html')
OUT = os.path.join(ROOT, 'build', 'rapbattle')
KEEP_ROOMS = {'hall'}
DROP_MARKERS = ['ACT INTERLUDES', 'THE OUTRO', 'ACT III INTERLUDE']

ASSETS = ['hall-bg.webp', 'hall-founders-group.webp', 'sprite-profg.png', 'sprite-clerk.png',
          'sprite-tobi.png', 'sprite-tobi-reach.webp', 'sprite-tobi-crouch.webp', 'sprite-tobi-piece.webp',
          'mouth-marx.webp', 'mouth-durkheim.webp', 'mouth-weber.webp',
          'rap-marx.mp3', 'rap-durkheim.mp3', 'rap-weber.mp3', 'profg-live.mp3',
          'profg-panel-stage.webp', 'profg-panel-close.webp', 'profg-panel-micdrop.webp',
          'profg-panel-stage-mouth.webp', 'profg-panel-close-mouth.webp',
          'sfx-act1.mp3', 'sfx-act3.mp3', 'sfx-rap.mp3', 'icon-usb.png']

SEED = {'inventory': ['usb'],
        'flags': {'corridorDone': True, 'act2IntroSeen': True, 'h27issued': True, 'actRenumberMigrated': True,
                  'whirlpoolDone': True, 'lectureDone': True, 'pondDone': True, 'philosopherConvinced': True,
                  'profAtOffice': True, 'lecturerGone': True}}

HEAD = """<script>
/* The Founders' Rap Battle, standalone: a fresh save on every visit, straight into the Hall. */
try {
  localStorage.setItem('codebook_save_v1', %s);
  sessionStorage.setItem('cb_goroom', 'hall');
  sessionStorage.setItem('cb_rapoffer', '1');
} catch(e){}
</script>
<style>
  /* only the Hall exists here: no map button, no game title bar, no H-27 form */
  #gameHud, #root > div:has(> #backToMap), #hf_h27{ display:none !important; }
</style>
""" % json.dumps(json.dumps(SEED))

BOOT = """<script>
/* Standalone boot: no splash, no trailer. CODEBOOK_START reads cb_goroom and enters the Hall. */
window.CODEBOOK_START();
</script>"""

def dur(p):
    out = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-f', 'null', '-'], stdout=subprocess.PIPE,
                         stderr=subprocess.STDOUT, text=True).stdout or ''
    t = re.findall(r'time=(\d+):(\d+):(\d+\.\d+)', out)
    if t: h, m, s = t[-1]; return int(h) * 3600 + int(m) * 60 + float(s)
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p],
                                capture_output=True, text=True).stdout)

def build_voices(clips, dest):
    """Concatenate the clips (normalised, 0.45 s gaps, CBR) and return {clip: [bundle, start, dur]}."""
    sprite, t = {}, 0.0
    with tempfile.TemporaryDirectory() as tmp:
        gap = os.path.join(tmp, 'gap.wav')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', 'anullsrc=r=24000:cl=mono', '-t', '0.45', gap], check=True)
        parts = []
        for i, c in enumerate(sorted(clips)):
            w = os.path.join(tmp, '%03d.wav' % i)
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(ROOT, 'audio', 'voices', c), '-ar', '24000', '-ac', '1',
                            '-af', 'loudnorm=I=-18:TP=-2:LRA=11', w], check=True)
            d = dur(w); sprite[c] = ['voices-rap.mp3', round(t, 3), round(d, 3)]
            parts += [w, gap]; t += d + 0.45
        lst = os.path.join(tmp, 'l.txt'); open(lst, 'w').write(''.join("file '%s'\n" % p for p in parts))
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-codec:a', 'libmp3lame', '-b:a', '96k', dest], check=True)
    return sprite

def cut_object(h, start_marker, end_marker, replacement):
    """Replace the literal from start_marker up to and including end_marker."""
    a = h.index(start_marker); b = h.index(end_marker, a) + len(end_marker)
    return h[:a] + replacement + h[b:]

def prune(h):
    """Strip what the rest of the game leaves in the shared engine: item descriptions,
    labels and icons for every act, Tobi's lines for every room and his general menus
    (Gap Registry, Swedish, the photograph), and every full-line comment -- the comments
    explain the whole game's structure."""
    h = cut_object(h, 'var ITEM_LABELS = {', '\n  };', "var ITEM_LABELS = { usb: 'A USB Drive' };")
    h = cut_object(h, 'var ITEM_ICONS = {', '\n  };', "var ITEM_ICONS = { usb: 'icon-usb.png' };")
    h = cut_object(h, 'var ITEM_LOOK = {', '\n  };',
                   "var ITEM_LOOK = { usb: 'Unlabelled. There is a folder on it called BEATS (DO NOT GRADE).' };")
    h = cut_object(h, 'var TOBI_LINES = {', '\n  };',
                   "var TOBI_LINES = { hall: '&ldquo;Big heritage moment. Do any of them have socials?&rdquo;' };")
    h = cut_object(h, 'var TOBI_BEG = [', '\n  ];', 'var TOBI_BEG = [];')
    # his general Talk To menu, down to the one line
    a = h.index("        if (verb === 'talkto'){\n          api.clearChoices();\n          api.say('Tobi', window.CODEBOOK_TOBI_LINE(rid));")
    b = h.index("          return true;\n        }\n        return false;\n      },", a)
    h = h[:a] + "        if (verb === 'talkto'){\n          api.clearChoices();\n          api.say('Tobi', window.CODEBOOK_TOBI_LINE(rid));\n" + h[b:]
    # full-line comments: // lines in scripts, /* ... */ blocks that start a line (CSS and JS)
    h = re.sub(r'(?m)^[ \t]*//[^\n]*\n', '', h)
    h = re.sub(r'(?ms)^[ \t]*/\*.*?\*/[ \t]*\n', '', h)
    return h

def main():
    s = open(GAME).read()
    blocks = list(re.finditer(r'<script>.*?</script>', s, re.S))
    out, last = [], 0
    for m in blocks:
        body = m.group(0)
        rooms = set(re.findall(r"CODEBOOK_REGISTER\(\{\s*id:\s*'([a-z0-9]+)'", body))
        drop = (rooms and not rooms & KEEP_ROOMS) or any(k in body[:300] for k in DROP_MARKERS)
        boot = 'Preloaded quietly behind the logo/title screens' in body[:400]
        out.append(s[last:m.start()])
        if boot: out.append(BOOT)
        elif not drop: out.append(body)
        last = m.end()
    out.append(s[last:])
    h = ''.join(out)

    # the boot splash (logo, title card, trailer) goes with the boot
    h = re.sub(r'<div id="bootSplash">.*?</div>\s*(?=<div class="stage">)', '', h, flags=re.S)
    # title, and the seed ahead of the engine
    h = re.sub(r'<title>.*?</title>', "<title>The Founders' Rap Battle</title>", h, count=1)
    first = h.index('<script>')
    h = h[:first] + HEAD + h[first:]

    h = prune(h)

    # voice table: only Tobi's battle lines
    m = re.search(r'window\.CODEBOOK_VO = \{(.*?)\n\s*\};', h, re.S)
    entries = re.findall(r'^\s*("(?:[^"\\]|\\.)*"):\s*("vo-tobi-[0-9a-f]+\.mp3"),?\s*$', m.group(1), re.M)
    h = h[:m.start()] + 'window.CODEBOOK_VO = {\n' + ',\n'.join('  %s: %s' % e for e in entries) + '\n};' + h[m.end():]
    clips = {json.loads(v) for _, v in entries}

    os.makedirs(OUT, exist_ok=True)
    for f in os.listdir(OUT): os.remove(os.path.join(OUT, f))
    sprite = build_voices(clips, os.path.join(OUT, 'voices-rap.mp3'))
    m = re.search(r'window\.CODEBOOK_VOICE_SPRITE = (\{.*?\});', h, re.S)
    h = h[:m.start(1)] + json.dumps(sprite, separators=(',', ':')) + h[m.end(1):]

    # assets: an explicit list of what the Hall and the battle use -- not everything the engine
    # names (that would ship every item icon, other characters' rigs and other rooms' art)
    names = set(ASSETS)
    copied = []
    for n in sorted(names):
        src = os.path.join(WEB, n)
        if os.path.isfile(src): shutil.copy(src, os.path.join(OUT, n)); copied.append(n)
    open(os.path.join(OUT, 'index.html'), 'w').write(h)
    total = sum(os.path.getsize(os.path.join(OUT, f)) for f in os.listdir(OUT))
    print('index.html %d KB, %d assets + voices-rap.mp3, %.1f MB total, %d Tobi clips'
          % (len(h) // 1024, len(copied), total / 1048576, len(clips)))
    print(' '.join(copied))

if __name__ == '__main__':
    main()
