#!/usr/bin/env python3
"""Generate placeholder room backgrounds for rooms whose painted art does not exist yet.

These are deliberately *designed* rather than grey boxes: right palette, right composition,
every major prop blocked in where the final painting will put it, so hotspot coordinates
written against a placeholder stay correct when the painting arrives. Swapping in the real
art is then a one-line `bg:` change in the room's registration.

    python3 tools/art/placeholders.py          # writes web/<room>-bg-placeholder.svg

Palette is lifted from the game's own :root block so the placeholders sit in the same world.
"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, 'web')
W, H = 1200, 675

P = dict(shell='#241A12', wall='#2E4358', wainscot='#16222C', wainscot_light='#22323F',
         floor_top='#8B5A34', floor_bot='#5C3A20', wood='#6B4226', wood_dark='#3B2110',
         wood_light='#9A6A45', mustard='#E0A83E', mustard_deep='#C68A2E',
         cream='#EDF0F2', cream_dim='#C3CBD1', water='#557E70')


def box(x, y, w, h, fill, label='', stroke=None, rx=3, op=1.0, fs=15):
    s = '<rect x="%g" y="%g" width="%g" height="%g" rx="%g" fill="%s" opacity="%g"%s/>' % (
        x, y, w, h, rx, fill, op, ' stroke="%s" stroke-width="2"' % stroke if stroke else '')
    if label:
        s += ('<text x="%g" y="%g" fill="%s" font-family="JetBrains Mono,monospace" '
              'font-size="%g" letter-spacing="1.5" text-anchor="middle" opacity=".82">%s</text>'
              % (x + w / 2, y + h / 2 + fs * 0.35, P['cream_dim'], fs, label))
    return s


def room(name, title, wall, floor, props):
    """props: list of (x%, y%, w%, h%, fill, label)"""
    p = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" width="%d" height="%d">' % (W, H, W, H)]
    p.append('<defs><linearGradient id="fl" x1="0" y1="0" x2="0" y2="1">'
             '<stop offset="0" stop-color="%s"/><stop offset="1" stop-color="%s"/></linearGradient>'
             '<radialGradient id="vig" cx="50%%" cy="45%%" r="75%%">'
             '<stop offset="55%%" stop-color="#000" stop-opacity="0"/>'
             '<stop offset="100%%" stop-color="#000" stop-opacity=".55"/></radialGradient></defs>'
             % (P['floor_top'], P['floor_bot']))
    p.append(box(0, 0, W, H, wall))                       # wall
    p.append(box(0, H * 0.70, W, H * 0.30, 'url(#fl)'))    # floor
    p.append(box(0, H * 0.56, W, H * 0.15, P['wainscot'])) # wainscot band
    p.append(box(0, H * 0.555, W, 5, P['wood_light'], op=.5))
    for (x, y, w, h, fill, label) in props:
        p.append(box(W * x / 100, H * y / 100, W * w / 100, H * h / 100, fill, label, stroke=P['wood_dark']))
    p.append('<rect width="%d" height="%d" fill="url(#vig)"/>' % (W, H))
    p.append('<text x="%d" y="%d" fill="%s" font-family="Georgia,serif" font-size="26" '
             'text-anchor="middle" opacity=".5">%s</text>' % (W / 2, H - 26, P['cream_dim'], title))
    p.append('<text x="%d" y="%d" fill="%s" font-family="JetBrains Mono,monospace" font-size="13" '
             'text-anchor="middle" opacity=".38">PLACEHOLDER — painted art pending</text>'
             % (W / 2, H - 8, P['mustard']))
    p.append('</svg>')
    path = os.path.join(OUT, name)
    open(path, 'w').write(''.join(p))
    print('wrote', name)


ROOMS = {
 'library-bg-placeholder.svg': ('THE LIBRARY', '#2A2E3A', None, [
    (2, 6, 20, 50, '#3A2E22', 'STACKS'), (24, 30, 14, 26, '#4A3A28', 'CATALOGUE'),
    (40, 12, 26, 20, '#20303C', 'THE LITERATURE — conveyor'),
    (41, 36, 10, 20, '#5C4630', 'TROLLEY'), (54, 34, 13, 22, '#7A6242', 'KIRA'),
    (70, 10, 13, 18, '#4A3A28', 'EVIDENCE'), (86, 30, 12, 26, '#3A2E22', 'DESK / PHONE'),
    (70, 34, 14, 22, '#33261A', 'REGISTER'), (24, 8, 14, 18, '#20303C', 'THEORY = WHAT HAS BEEN CITED')]),
 'hall-bg-placeholder.svg': ('THE HALL OF FOUNDERS', '#2B2622', None, [
    (4, 10, 13, 34, '#4A3A28', 'PORTRAIT'), (19, 10, 13, 34, '#4A3A28', 'PORTRAIT'),
    (34, 10, 13, 34, '#4A3A28', 'WEBER'), (49, 10, 13, 34, '#4A3A28', 'PORTRAIT'),
    (66, 14, 16, 30, '#5C4630', 'QUOTATION DISPENSER'),
    (85, 22, 12, 34, '#6B4226', 'STEPLADDER'), (4, 48, 20, 9, '#8A6A2A', 'AUTHORITY METER'),
    (34, 48, 22, 9, '#20303C', 'THEORY = WHAT HAS BEEN SAID IMPORTANTLY')]),
 'workshop-bg-placeholder.svg': ("FELDSTROM'S WORKSHOP", '#332A22', None, [
    (6, 8, 24, 22, '#20303C', 'TRAFFIC DIAGRAMS'), (6, 32, 14, 24, '#4A3A28', 'THESIS, 742pp'),
    (32, 10, 34, 46, '#5A4632', 'HYPOTHESES ACCELERATOR Mk III'),
    (34, 44, 12, 8, '#8A6A2A', 'SPECIFY (taped)'), (52, 44, 12, 8, '#8A6A2A', 'GENERALISE'),
    (68, 16, 12, 14, '#7A2A20', 'THINGS THIS FORBIDS'),
    (82, 30, 15, 26, '#3A2E22', 'DESK / PHONE 4173'), (68, 34, 12, 22, '#2A2A2A', 'TUXEDO')]),
 'seminar-bg-placeholder.svg': ('THE SEMINAR ROOM', '#2E3A34', None, [
    (8, 8, 54, 34, '#1C2620', 'THE BOARD — three columns'),
    (10, 46, 44, 10, '#4A3A28', 'ELEVEN CHAIRS'),
    (66, 26, 14, 30, '#6A5440', 'VISITING FELLOW'),
    (84, 12, 13, 20, '#20303C', 'THEORY = WHAT COULD BE WRONG'),
    (84, 36, 13, 20, '#33261A', 'SKELETON')]),
 'basement-bg-placeholder.svg': ('THE STATISTICS BASEMENT', '#1E2430', None, [
    (6, 10, 40, 30, '#24303E', 'TWENTY SWITCHES'),
    (50, 8, 26, 22, '#3A2A16', 'DISCOVERY! banner'),
    (50, 34, 26, 22, '#5C4630', 'THE SEAL / SLIP'),
    (80, 14, 16, 42, '#33261A', 'SKELETON, one lit bulb')]),
 'bureau-bg-placeholder.svg': ('THE BUREAU OF IMPLICATIONS', '#2C3340', None, [
    (4, 20, 46, 20, '#4A3A28', 'COUNTER'),
    (6, 8, 42, 10, '#20303C', 'SMALL / MEDIUM / LARGE'),
    (54, 10, 20, 30, '#5C4630', 'CLERK'),
    (78, 8, 19, 34, '#3A2E22', 'FURTHER RESEARCH IS NEEDED'),
    (54, 44, 20, 12, '#8A6A2A', 'SO WHAT? gauge')]),
 'delegation-bg-placeholder.svg': ('THE DELEGATION ENGINE', '#232A2E', None, [
    (6, 10, 40, 30, '#24303E', 'MERGE LOG (40 pages)'),
    (6, 44, 40, 12, '#4A3A28', 'ONE PRINTED RECORD'),
    (54, 10, 20, 30, '#7A6242', 'KIRA'),
    (78, 8, 19, 34, '#7A2A20', 'LEVER \u2192 AUTO-SUBMIT')]),
 'gapregistry-bg-placeholder.svg': ('THE GAP REGISTRY', '#2A2C28', None, [
    (4, 8, 40, 48, '#3A2E22', 'DRAWERS OF APPROVED GAPS'),
    (48, 20, 18, 34, '#6A5440', 'REGISTRAR'),
    (70, 10, 27, 26, '#4A3A28', 'KIRA + CONVEYOR'),
    (70, 40, 27, 16, '#33261A', 'SKELETON IN A DRAWER')]),
 'writingroom-bg-placeholder.svg': ('THE WRITING ROOM', '#31302C', None, [
    (6, 26, 52, 24, '#5C4630', 'LONG TABLE / TYPEWRITER'),
    (10, 8, 30, 14, '#20303C', 'THE ABSTRACT'),
    (44, 6, 22, 18, '#8A6A2A', 'IMPACT gauge'),
    (62, 20, 16, 34, '#6A5440', 'FELDSTROM'),
    (80, 22, 16, 30, '#7A6242', 'KIRA'),
    (80, 6, 16, 12, '#3A2E22', 'TELEPHONE')]),
}

if __name__ == '__main__':
    for fn, (title, wall, floor, props) in ROOMS.items():
        room(fn, title, wall, floor, props)


# --- outro cutscene panels ---------------------------------------------------------
def card(name, big, small, bg='#1B1712', accent=None):
    a = accent or P['mustard']
    p = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" width="%d" height="%d">' % (W, H, W, H)]
    p.append(box(0, 0, W, H, bg))
    p.append('<text x="%d" y="%d" fill="%s" font-family="Georgia,serif" font-size="54" '
             'text-anchor="middle" letter-spacing="2">%s</text>' % (W/2, H/2 - 10, a, big))
    if small:
        p.append('<text x="%d" y="%d" fill="%s" font-family="JetBrains Mono,monospace" '
                 'font-size="20" text-anchor="middle" opacity=".7">%s</text>' % (W/2, H/2 + 44, P['cream_dim'], small))
    p.append('<text x="%d" y="%d" fill="%s" font-family="JetBrains Mono,monospace" font-size="12" '
             'text-anchor="middle" opacity=".35">PLACEHOLDER — painted art pending</text>' % (W/2, H - 14, a))
    p.append('</svg>')
    open(os.path.join(OUT, name), 'w').write(''.join(p))
    print('wrote', name)


OUTRO = [
 ('outro-1-walk.svg',    'The walk back', 'the campus, in reverse'),
 ('outro-2-months.svg',  'FOUR MONTHS LATER', '(this is fast.)'),
 ('outro-3-letter.svg',  'The decision letter', 'three reviews of unequal length'),
 ('outro-4-r2.svg',      'Reviewer 2', 'eleven pages · forty-seven comments'),
 ('outro-5-verdict.svg', 'REVISE AND RESUBMIT', 'welcome to academia'),
 ('outro-6-monkey.svg',  'A dark office', 'a monitor, a banana, a mug reading REVIEWER 2'),
]

if __name__ == '__main__':
    for fn, big, small in OUTRO:
        card(fn, big, small)
