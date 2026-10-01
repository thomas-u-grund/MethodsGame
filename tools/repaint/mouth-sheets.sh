#!/bin/bash
# Extract mouth overlays from a returned edited sheet: mouth-sheets.sh NN   (expects ~/Downloads/cb-mouth-NN.png)
# or blink overlays: mouth-sheets.sh bNN   (expects ~/Downloads/cb-blink-NN.png, sheet mouths/blink-NN.png)
# The figure lists match the order mouths.py sheet laid them out in art/characters/repaint/mouths/sheet-NN.png.
cd "$(dirname "$0")/../.."
R=art/characters/repaint
case $1 in
01) F="prof/final-prof-stand prof/final-prof-arms prof/final-prof-arms-talk prof/final-prof-redpen-talk";;
02) F="feldstrom/final-feldstrom feldstrom/final-feldstrom-talk feldstrom/final-feldstrom-bored feldstrom/final-feldstrom-keynote";;
03) F="feldstrom/final-feldstrom-pen feldstrom/final-feldstrom-queue support/final-profg support/final-clerk";;
04) F="tobi/final-tobi tobi/final-tobi-laser tobi/final-tobi-piece tobi/final-tobi-reach";;
05) F="tobi/final-tobi-crouch tobi/final-tobi-walk support/final-skeptic:113,100 support/final-skeptic-study:188,93";;
06) F="fellow/final-fellow fellow/final-fellow-clipboard:210,122 fellow/final-fellow-finger fellow/final-fellow-present";;
07) F="kira/final-kira kira/final-kira-pages kira/final-kira-present kira/final-kira-talk";;   # kira-talk: screen mouth already open, its overlay is dropped below
08) F="vossberg/final-vossberg2-chair vossberg/final-vossberg2-explain vossberg/final-vossberg2-point support/final-registrar-papers";;
09) F="support/final-registrar-ticket support/final-director-printout support/final-director-visitor:252,130 support/final-nurse-coins";;
10) F="support/final-officer-clipboard support/final-officer-pens support/final-officer-printout support/final-doorman-comment";;
11) F="support/final-doorman-queue busts/final-judge-chair busts/final-judge-keeper";;
12) F="../../../tools/rig/director/head:285,252 ../../../tools/rig/doorman/head:262,228 ../../../tools/rig/nurse/head:248,237 ../../../tools/rig/officer/head:298,222";;   # rig heads, profile
13) F="prof/final-prof-redpen vossberg/final-vossberg-draft vossberg/final-vossberg-draft-talk:207,108 feldstrom/final-granovetter-ties";;
14) F="support/final-bourdieu busts/final-cook support/final-director:215,125";;   # director: overwritten by 15
16) F="support/final-doorman support/final-nurse:130,122 support/final-officer";;
15) F="kira/final-kira-talk:205,150 support/final-director:215,125 support/final-director-printout:240,165,32,26 support/final-director-visitor:252,130";;   # CLOSED mouths: these sprites talk already (inverted in MOUTHS)
17) F="monkeys/final-lt-student:208,120";;   # the Lecture Theatre student after the bingo (author: "should move his mouth")
b01) F="prof/final-prof-stand prof/final-prof-arms prof/final-prof-redpen:150,75 feldstrom/final-feldstrom";;
b02) F="feldstrom/final-feldstrom-keynote feldstrom/final-feldstrom-pen tobi/final-tobi tobi/final-tobi-laser";;
b03) F="vossberg/final-vossberg2-idle vossberg/final-vossberg2-chair vossberg/final-vossberg2-explain fellow/final-fellow";;
b04) F="fellow/final-fellow-present kira/final-kira:182,90,75,34 kira/final-kira-present:361,89,78,33 support/final-skeptic-study";;
*) echo "unknown sheet $1"; exit 1;;
esac
K=mouth; N=$1; [ "${1:0:1}" = b ] && K=blink && N=${1#b}
[ -f ~/Downloads/cb-$K-$N.png ] && cp ~/Downloads/cb-$K-$N.png $R/mouths/
P=(); for f in $F; do n=${f%%:*}; h=${f#"$n"}; P+=("$R/$n.png$h"); done
.venv-tts/bin/python tools/repaint/mouths.py extract $R/mouths/cb-$K-$N.png $K "${P[@]}"
# 07, 09 and 14 also write overlays that sheet 15 replaces with closed mouths: redo 15 after them
[ "$1" = 07 ] && rm -f $R/kira/mouth-kira-talk.png $R/kira/check-mouth-kira-talk.png
case $1 in 07|09|14) [ -f $R/mouths/cb-mouth-15.png ] && "$0" 15 >/dev/null;; esac
# one strip of the check crops, 3x
K=$K .venv-tts/bin/python - "${P[@]}" <<'PY'
import sys, os
from PIL import Image
ims=[]
for p in (q.split(":")[0] for q in sys.argv[1:]):
    d,b=os.path.split(p); c=os.path.join(d,'check-'+os.environ['K']+'-'+b.replace('final-',''))
    if os.path.exists(c): i=Image.open(c).convert('RGBA'); ims.append(i.resize((i.width*3,i.height*3)))
W=sum(i.width for i in ims)+10*len(ims); H=max(i.height for i in ims)
s=Image.new('RGBA',(W,H),(255,255,255,255)); x=0
for i in ims: s.alpha_composite(i,(x,0)); x+=i.width+10
s.save('/tmp/cb-mouths/strip.png'); print('strip /tmp/cb-mouths/strip.png')
PY
