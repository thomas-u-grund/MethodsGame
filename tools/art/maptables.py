#!/usr/bin/env python3
"""Regenerate MAP_LAYOUT and MAP_LABELS from one table of building positions.

The campus map's thirty-four coordinates are the expensive part of changing the map art,
so they are derived rather than hand-edited. Workflow when the painting changes:

    tools/art/mapgrid.sh web/campus-map.webp /tmp/grid.png 20 16   # read positions off this
    # edit BUILDINGS below to match the new painting
    python3 tools/art/maptables.py --write                          # rewrite both tables

Positions are PERCENT of the 1672x941 painting: (x, y, w, h).
Two pairs deliberately share a building because their acts never overlap.
"""
import re, sys, os

BUILDINGS = {
 # Every distinct structure in the painting is used exactly once. Seventeen rooms fit into
 # fifteen buildings because two pairs share, and those pairs are in acts that never
 # overlap -- the Mensa becomes the Writing Room, the Delegation Engine becomes the Gap
 # Registry. Nothing else shares, which is what went wrong on the last map.
 #
 # Act I -- the old quarter.
 'corridor':      ( 20.0, 12.0, 18.0, 29.0),   # the long gothic nave: a corridor by shape
 'whirlpool':     ( 38.5,  5.0, 11.5, 30.0),   # the west front and its tower
 'lecture':       ( 26.5, 43.0, 14.5, 18.0),   # the round drum: a lecture theatre in plan
 'pond':          (  2.0, 62.0, 25.0, 25.0),   # the water, the swans and the bridge
 # Act II.
 'workshop':      (  1.0, 21.0, 16.0, 17.5),   # the only chimney on the left that is lit
 'library':       ( 52.0, 52.0, 18.0, 25.0),   # the long range of tall arched windows
 'hall':          ( 61.0, 19.0, 17.0, 24.0),   # the portico, the steps and the statues
 'seminar':       ( 70.5, 53.0, 12.0, 11.0),   # the glazed annex
 # Act III.
 'mensa':         (  0.0, 39.0, 15.0, 15.0),   # the arched carriage range, far left
 'ethics':        ( 82.5, 32.0, 11.0, 19.0),   # the windowless vault, which is the joke
 'statsbasement': ( 31.0, 78.0, 15.0, 11.0),   # the gatehouse you go down through
 'fieldwork':     ( 76.5, 64.0,  9.0, 18.0),   # the walled yard: an arena, literally
 'surveylab':     ( 86.0, 53.0, 13.5, 24.0),   # the works shed, bottom right
 # Act IV. The observatory is a room now, which is what fixes the complaint that opened
 # this: the workshop and the survey lab used to look like its outbuildings.
 'bureau':        ( 47.5, 37.0,  7.0, 14.0),   # the small spired block
 'delegation':    ( 85.5,  1.0, 13.0, 16.0),   # the dome on the crag
 # Act V -- the two shared boxes.
 'gapregistry':   ( 85.5,  1.0, 13.0, 16.0),
 'writingroom':   (  0.0, 39.0, 15.0, 15.0),
}
# How wide a board has to be is a property of its text, not a number to guess: the pond's
# board was a tenth of a percent too narrow and "Probability Pond" wrapped to two lines and
# overflowed the scroll at both ends. So the text is measured once in the real font at the
# real size (tools/art/signfit.js prints this table) and the board is sized from that.
#
#   needW / needH = the text's own size, percent of the painting, measured with no wrapping
#
# The pond is measured in its PAINTED state, which is three lines and the widest it ever
# gets -- a board cannot resize itself halfway through Act I.
MEASURED = {
 'workshop':      (14.51, 2.31),  'pond':          (13.57, 7.52),
 'statsbasement': (12.71, 4.63),  'delegation':    (11.92, 2.31),
 'whirlpool':     (11.66, 2.31),  'fieldwork':     (10.96, 2.31),
 'hall':          (10.94, 2.31),  'lecture':       (10.58, 2.31),
 'seminar':       ( 9.90, 2.31),  'library':       ( 9.59, 2.31),
 'writingroom':   ( 9.45, 2.31),  'gapregistry':   ( 8.73, 2.31),
 'bureau':        ( 8.57, 4.63),  'corridor':      ( 8.28, 4.63),
 'surveylab':     ( 7.64, 4.63),  'ethics':        ( 6.21, 4.63),
 'mensa':         ( 4.88, 2.31),
}
PAD_X, PAD_Y = 1.8, 2.6   # the scroll's curled ends and its top and bottom margins

# Boards are anchored by their CENTRE, so widening one keeps it over its building instead
# of sliding it sideways. (cx, top, first line, second line).
SIGNS_RAW = {
 'corridor':      (27.50, 41.50, 'Department', 'of Causality'),
 'whirlpool':     (45.30, 35.50, 'Professor&rsquo;s Office', ''),
 'lecture':       (47.00, 48.00, 'Lecture Theatre', ''),
 'pond':          ( 8.50, 67.00, 'Probability Pond', '(Still 50/50)'),
 'workshop':      ( 8.50, 14.50, 'Feldstrom&rsquo;s Workshop', ''),
 'library':       (58.50, 77.50, 'Library Annex', ''),
 'hall':          (67.50, 43.50, 'Hall of Founders', ''),
 'seminar':       (76.00, 66.50, 'Seminar Room', ''),
 'mensa':         ( 6.50, 33.50, 'Mensa', ''),
 'ethics':        (88.00, 25.50, 'Ethics', 'Tribunal'),
 'statsbasement': (37.30, 72.00, 'Statistics Basement', '(The Labyrinth)'),
 'fieldwork':     (77.50, 81.50, 'Fieldwork Arena', ''),
 'surveylab':     (92.00, 77.50, 'Survey Lab', '(A&amp;E)'),
 'bureau':        (49.50, 51.50, 'Bureau of', 'Implications'),
 'delegation':    (91.30, 17.50, 'Delegation Engine', ''),
 'gapregistry':   (91.50, 17.50, 'Gap Registry', ''),
 'writingroom':   ( 6.50, 33.50, 'Writing Room', ''),
}

# Every board is nowrap, because every board is now wide enough to be.
SIGNS = {}
for _k, (_cx, _t, _a, _b) in SIGNS_RAW.items():
    _w = MEASURED[_k][0] + PAD_X
    _h = MEASURED[_k][1] + PAD_Y
    SIGNS[_k] = (round(_cx - _w / 2, 2), _t, round(_w, 2), round(_h, 2), _a, _b, True)
ORDER = ['whirlpool','lecture','corridor','pond','library','hall','workshop','seminar',
         'mensa','surveylab','ethics','fieldwork','statsbasement','delegation','bureau',
         'gapregistry','writingroom']

def layout():
    out = ['  var MAP_LAYOUT = {']
    for k in ORDER:
        x, y, w, h = BUILDINGS[k]
        out.append('    %-14s { l:%4d, t:%4d, w:%3d, h:%3d },'
                   % (k + ':', round(x*12), round(y*6.75), round(w*12), round(h*6.75)))
    out.append('  };')
    return '\n'.join(out)

def labels():
    out = ['  var MAP_LABELS = {']
    for k in ORDER:
        l, t, w, h, a, b, one = SIGNS[k]
        out.append("    %-14s { l:%5.2f, t:%5.2f, w:%5.2f, h:%4.2f, a:'%s', b:'%s'%s },"
                   % (k + ':', l, t, w, h, a, b, ', one:1' if one else ''))
    out.append('  };')
    return '\n'.join(out)

ACTS = {
 1: ['corridor','whirlpool','lecture','pond'],
 2: ['workshop','library','hall','seminar'],
 3: ['statsbasement','ethics','mensa','fieldwork','surveylab'],
 4: ['bureau','delegation'],
 5: ['gapregistry','writingroom'],
}

def _hit(a, b, pad=0.0):
    ax, ay, aw, ah = a; bx, by, bw, bh = b
    return (ax < bx + bw + pad and bx < ax + aw + pad and
            ay < by + bh + pad and by < ay + ah + pad)

def check():
    """The invariants. Signs and boxes are filtered to the current act, so only rooms that
    can be on screen together may collide -- but within an act a collision makes one room
    unclickable or one sign unreadable, which is how the last map went wrong."""
    bad = []
    # The map is never cropped -- the wrapper keeps the painting's exact 1672x941 aspect,
    # so all of it is drawn. What bites instead is the FOLD: at 1600x900 about 10% of the
    # map sits below the window and has to be scrolled to. Nothing a player must read or
    # click may live down there, so both boards and hotspots stop at 89%.
    FOLD = 89.0
    for k, (l, t, w, h, *_ ) in SIGNS.items():
        if t + h > FOLD: bad.append('%s sign falls below the fold' % k)
        if l + w > 99.8: bad.append('%s sign runs off the right edge' % k)
    for k, (x, y, w, h) in BUILDINGS.items():
        if x < 0 or y < 0 or x + w > 100:
            bad.append('%s box leaves the painting' % k)
        if y + h > FOLD:
            bad.append('%s box falls below the fold: you would have to scroll to click it' % k)
    missing = set(BUILDINGS) - set(SIGNS)
    if missing: bad.append('no sign for: ' + ', '.join(sorted(missing)))
    # A sign is drawn for the current act's rooms, for anything still unfinished, and
    # ALWAYS for the Professor's Office -- every act hands off through it. So the Office's
    # board is on screen next to all sixteen others at some point, and the Pond can be left
    # unpainted and keep its board into a later act. Both have to be checked against every
    # act, not just their own, which is how the Bureau's board ended up under the Office's.
    PERSISTENT = ['whirlpool', 'pond']
    # Boxes are global. A hotspot is drawn for every unlocked room whatever act it belongs
    # to, so by Act V all seventeen buttons are on the map at once and ANY two that overlap
    # make one of them partly unclickable. Only the two deliberately shared pairs may
    # coincide, and they coincide exactly.
    names = sorted(BUILDINGS)
    for i, a in enumerate(names):
        for b in names[i+1:]:
            if BUILDINGS[a] != BUILDINGS[b] and _hit(BUILDINGS[a], BUILDINGS[b]):
                bad.append('%s and %s boxes overlap' % (a, b))
    for act, rooms in ACTS.items():
        rooms = rooms + [r for r in PERSISTENT if r not in rooms]
        for i, a in enumerate(rooms):
            for b in rooms[i+1:]:
                if _hit(SIGNS[a][:4], SIGNS[b][:4]):
                    bad.append('Act %d: %s and %s signs overlap' % (act, a, b))
    listed = {r for rs in ACTS.values() for r in rs}
    if listed != set(BUILDINGS):
        bad.append('ACTS and BUILDINGS disagree: ' + str(listed ^ set(BUILDINGS)))
    return bad

if __name__ == '__main__':
    print(layout()); print(); print(labels())
    for problem in check(): print('  WARNING:', problem, file=sys.stderr)
    if '--write' in sys.argv:
        p = os.path.join(os.path.dirname(__file__), '..', '..', 'web', 'the-secret-of-the-codebook.html')
        s = open(p).read()
        s2, n1 = re.subn(r'  var MAP_LAYOUT = \{.*?\n  \};', layout().replace('\\', '\\\\'), s, count=1, flags=re.S)
        s2, n2 = re.subn(r'  var MAP_LABELS = \{.*?\n  \};', labels().replace('\\', '\\\\'), s2, count=1, flags=re.S)
        assert n1 == 1 and n2 == 1, 'could not find one or both tables in the game file'
        if s2 == s:
            print('\nboth tables already match this file; nothing to do', file=sys.stderr)
        else:
            open(p, 'w').write(s2)
            print('\nwrote both tables into the game file', file=sys.stderr)
