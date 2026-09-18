# Survey Lab — Art Prompts

*The Secret of the Lost Codebook · Act II · Art Pipeline*

Reframed from a plain classroom into an emergency department for injured survey questions. See `STORY.md` → Act II → "Survey Lab" for the full puzzle design.

**Important — this background must ship EMPTY.** No specific patients, no readable chart text, no taped-together questions, no people. All of that (the double-barrelled question on a gurney, the leading question lying sideways, the "OFTEN" specialists' chart, the Nurse, the Technician, the skeleton) gets added afterward as separate overlay sprites — the same pattern as the Office's desk-clutter items and the Professor's own sprite. Generating the room pre-populated would mean re-editing a packed scene every time a prop needs to move; an empty room lets each prop be positioned and swapped independently.

## How to use this

1. Attach `office-bg.png` (style/palette anchor — same painted comic-linework look).
2. Paste the prompt below as-is.
3. Crop/resize to 16:9 (1672×941, matching every other room background) and drop into `web/` as `surveylab-bg.png`.

---

## Background

Attach: `office-bg.png` (style/palette anchor).

```
Generate a wide background illustration for a narrative adventure game, in the exact same painted, comic-linework illustration style as the attached reference image (the professor's office from the same game) — same brush texture, warm lighting, and color palette, but shifted toward a clinical, institutional feel. Landscape orientation, 16:9.

Scene: a small, old-fashioned academic emergency ward, empty of any patients or staff. A row of three empty wheeled hospital gurneys with rumpled white sheets, spaced along one wall. Curtain partitions on rails, one partially drawn. A triage desk in the mid-ground with an empty rolling chair, an old rotary phone, and a stack of blank clipboards. On the back wall, a large illuminated machine console labeled "FIT FOR HUMAN ADMINISTRATION" with a dark, unlit indicator panel and an empty printer tray beneath it — currently idle, not mid-operation. A wall-mounted sign reading "SURVEY LAB — EMERGENCY DEPARTMENT" near the entrance. A glass-fronted supply cabinet, visibly empty inside except a pair of scissors mounted with a small placard reading "FOR SINGLE-CONCEPT USE ONLY." Warm overhead clinical lighting, autumn light through one tall gothic window matching the campus's architecture.

No people, no patients, no readable chart text beyond the two signs specified. Nothing lying on the gurneys. No other readable text anywhere in the scene.
```

Save the result as `surveylab-bg.png`.

## Follow-up sprites and items

Room-fixed props (composite onto the finished `surveylab-bg.png`, not carried):

- **The double-barrelled question**, on a gurney: two strips of paper visibly stapled/taped together down the middle.
- **The leading question**, lying sideways on a gurney or propped against a wall, unable to stand upright.
- **The "OFTEN" chart** — a wall-mounted chart covered in question marks and circled dates.
- **The Nurse and Technician** character sprites.
- **The skeleton**, sign reading "DAY 4,016: STILL OPERATIONALISING 'OFTEN'."

### Inventory icon — Likert Die Response Card

The blank card the Likert die's six faces get traced onto — stays in this room, but needs its own icon since it changes from blank to labeled mid-puzzle.

```
Generate a small inventory-icon illustration in the same painted comic style as this reference: a small blank index card with five faint, unlabeled horizontal rule lines waiting to be filled in, resting at a slight angle, a pencil laid diagonally across one corner. Centered, isolated object, small dramatic highlight/shadow for depth. Transparent background. Square canvas, roughly 256x256px. No other objects, no visible text on the lines.
```

### Inventory icon — Reminder Postcards

Found stapled to the skeleton here; carried to the Fieldwork Arena to chase nonrespondents.

```
Generate a small inventory-icon illustration in the same painted comic style as this reference: a small stack of three increasingly frantic postcards fanned out slightly, the top one reading 'FINAL REMINDER' in bold red stamped lettering, with the corner of a second card peeking out beneath it reading 'FINAL FINAL REMINDER'. Centered, isolated object, small dramatic highlight/shadow for depth. Transparent background. Square canvas, roughly 256x256px. No other objects.
```
