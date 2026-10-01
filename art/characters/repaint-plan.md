# Character repaint: plan and inventory (started 2026-10-01)

Decision (author, 2026-10-01): repaint every character image in one **hybrid style**, using the crisp,
high-contrast digital finish of the backgrounds and their warm palette. Evidence is in `style-audit/`
(`in-rooms-A-vs-B.jpg`, `sets-A-vs-B.png`). Downloads from the author's ChatGPT are approved for this job.

## Style rules (to be fixed by the pilot sheet)

- Finish: crisp digital painting at the detail level of the backgrounds: clean, confident dark-brown
  outlines, glossy highlights, sharp edges. Not grainy or gouache-soft.
- Palette: warm and room-matched: wood, brass, oxblood, olive, tweed. Cool colours muted and warmed (teal,
  navy, grey). No pure white or black; whites are cream, blacks are warm charcoal.
- Light: warm key light from the upper left and a soft warm rim, as most rooms have.
- Proportions: slightly caricatured, as in the Feldstrom family; full body, feet visible, standing on
  one ground line.
- Delivery: transparent background, several poses per sheet, poses well apart (for cutting), no text, no
  floor shadow (the engine adds it).

## Pipeline

1. One ChatGPT chat, "Codebook repaint". The approved pilot sheet is attached to every prompt as the
   style reference, plus the character's current sprites for identity and pose.
2. Download into `~/Downloads` (in-page `fetch` → blob → `<a download>`), archive in `art/characters/repaint/<who>/`.
3. Cut the sheet into poses (alpha>40% bounding boxes per figure), scale to the old sprite's height, and
   keep the **same file names** in `web/`.
4. Overlays per talking pose, all as ChatGPT edits of the new sprite with only the face changed:
   mouth `-m1` (slightly open), `-m2` (open; this is the old `mouth-*` file) and `-m3` (wide); and
   `-blink` (eyes closed). Cut with `tools/mouth.sh` (extended for eyes).
5. Engine work:
   - lip-sync from the voice's loudness (WebAudio analyser → m1/m2/m3);
   - random blinking;
   - a breathing idle;
   - talk gestures alternating between a pose and its `-talk` pose;
   - a floor shadow instead of the drop shadow.
6. Cut-out rigs (`tools/rig/`) rebuilt from the new art: prof, director, doorman, nurse, officer.
7. Re-place every sprite: feet anchor, size per room `DEPTH`. Then tests and screenshots of every room.

## Inventory (in use)

| Character | Images | Mouths now |
|---|---|---|
| Stellmacher (prof) | stand, arms, arms-talk, redpen, redpen-talk; rig ×6; call-stellmacher, -away, -mobile | stand, arms, arms-talk, calls |
| Feldstrom | default, talk, bored, keynote, pen, phone, queue | all but phone |
| Tobi | default, crouch, laser, piece, reach, walk; tobi-live | all |
| Vossberg (vossberg2) | chair, explain, idle, papers, point, read, think, walk; vossberg-draft, -draft-talk | chair, explain, point |
| KIRA | default, pages, present, talk; kira-head-crt | all |
| Achterberg (fellow) | default, clipboard, finger, present; listen-fellow | all |
| Fieldwork Director | default, printout, visitor; listen-director; rig ×6 | printout, visitor |
| Doorman | default, comment, queue; listen-doorman; rig ×6 | comment, queue |
| Sampling Officer | default, clipboard, pens, printout; listen-officer; rig ×6 | clipboard, pens, printout |
| Nurse | default, coins; rig ×6 | coins |
| Skeptic | default, study; listen-skeptic | both |
| Registrar | papers, ticket | both |
| Clerk, Bourdieu, Granovetter (ties), Prof G, cook | 1 each (+ call-cook) | clerk, Prof G |
| Judges | chair, keeper, rep | chair, keeper |
| Monkeys | audience, clicker, hand, lead, piano, typing, lt-monkey, office-gradmonkey | none |
| Extras | lt-student, resp1–6, audience | none |
| Duel | announcer, coach, coachsetup, crowd, down, eyes, fo-feld, fo-me, hand, ko, player, player-down, sweat, win | none |
| Cutscene panels | il2/il4/il5 cast and scenes, trailer and trailer3 panels, outro-1/2/3/5/6, stockholm ×3, profg-panel ×5, keynote-portrait ×4, title-screen, office-autograph-zoom | profg panels |

Unused, to delete: `vossberg-chair/lecturing/pointing/walking.webp`, `sprite-chip`, `sprite-diners`,
`sprite-laserpointer`, `sprite-letteropener`, `sprite-monkey-pens`, `sprite-monkey-stamp`, `sprite-queue`
(check that each is unreferenced first).

## Order

Pilot (Stellmacher and Feldstrom), then the author approves the style. After that:
1. The main cast: Stellmacher, Feldstrom, Tobi, Vossberg, KIRA, Achterberg.
2. The supporting cast.
3. Monkeys and extras.
4. The duel.
5. The cutscene panels.
6. Overlays and the engine animation work.
7. Rigs.
8. Placement.

## Log

- 2026-10-01: plan written. The ChatGPT chat for the whole job is "Generate Character Sheet"
  (https://chatgpt.com/c/6abe5f97-0834-83ed-8405-60815c7d8551). Pilot sheet `repaint/pilot/cb-repaint-pilot-1.png`
  (1672x941, real alpha): Stellmacher stand and arms, Feldstrom default and talk. Cut into `new-*.png`; compared
  with the current sprites in `pilot-in-rooms.jpg`. Waiting for the author's OK on the style.
  Note: sheets come back at 1672 px wide, so 4 figures are about 830 px tall, enough for 820 px sprites.
  More than 4–5 figures per sheet would fall below the target height.
- 2026-10-01, paused by the author:
  - **Stellmacher:** all 5 poses done in `repaint/prof/new-*.png`. The first try had the wrong hair;
    `cb-repaint-prof-2.png` is the corrected sheet.
  - **Feldstrom:** default and talk done (pilot). The sheet with bored, keynote, pen and phone was
    requested in ChatGPT and was still generating at the pause. On resume, check the chat for a 4th
    generated image and save it as `cb-repaint-feldstrom-1.png`. Watch out: the save helper takes the
    LAST generated image, so check its file size differs from the previous sheet.
  - **Not done yet:** Feldstrom queue + Granovetter (`feldstrom/ref-2.png` ready), Tobi, Vossberg,
    KIRA, Achterberg, then the rest. Nothing is installed in `web/` yet.
- 2026-10-01, the orange glow (author: "annoying"). It had two causes, and both are now fixed locally:
  - `tools/repaint/defringe.py` removes the faint orange haze ChatGPT leaves in nearly transparent
    pixels (alpha < 48) and darkens the edge toward the outline colour.
  - `tools/repaint/derim.py IN OUT 12 1.0` tones down the gold rim light painted just inside the
    silhouette. A pixel counts as rim when it is yellower and brighter than the figure just inside it,
    so skin and gold props stay.
  - **Pipeline step for every figure:** cut.py → defringe.py → derim.py → `clean-<name>.png`.
    Before and after: `repaint/cleanup-before-after.jpg`.
  - **For the next prompts:** say "no rim light, no glow at the edges, neutral edges" instead of asking
    for a soft warm rim light.
- 2026-10-01, later:
  - **Grading:** `tools/repaint/grade.py` warms neutral greys and navies and turns pure-white highlights
    cream. Without it, Tobi and Vossberg looked cooler than the pilot figures.
  - **One command per sheet:** `tools/repaint/process.sh SHEET DIR names...` cuts the sheet, then cleans
    and grades each figure → `final-<name>.png` (the file to install).
  - **Done:** Stellmacher 5, Feldstrom 7, Granovetter 1, Tobi 4 of 6, Vossberg 8 of 10. In progress: a
    mixed sheet with Vossberg draft/draft-talk and Tobi crouch/walk. Then KIRA, Achterberg and the
    listening poses.
  - **ChatGPT quirks:** a prompt sometimes doesn't send on Return, so check the composer is empty after
    sending. Images load lazily and the chat drops older messages from the page, so wait for the Stop
    button to disappear (`aria-label="Stop"`) and track image IDs instead of counting images.
- 2026-10-01, evening, stopped when the browser went offline:
  - **Main cast complete (37 figures in `final-*.png`):** Stellmacher 5, Feldstrom 7, Granovetter,
    Tobi 6, Vossberg 10, KIRA 4, Achterberg 4, and the listening poses (Achterberg, Director, Skeptic,
    Officer).
  - **Doorman sheet** (`support/ref-doorman.png`) was sent and generating when the connection dropped.
    On resume, check the chat for it and save it as `cb-repaint-doorman-1.png`, in order: doorman,
    doorman-comment, doorman-queue, listen-doorman.
  - **Reference rows ready for the remaining sheets:** `support/ref-officer`, `ref-director` (+ skeptic),
    `ref-mixed1` (nurse, nurse-coins, skeptic-study, registrar-papers), `ref-mixed2` (registrar-ticket,
    clerk, bourdieu, profg), `busts/ref-busts` (3 judges + cook), `monkeys/ref-1`, `monkeys/ref-2`
    (+ lt-student), `extras/ref-resp` (6 respondents, chest-up).
  - **Lesson:** list the poses in the reference image's left-to-right order. ChatGPT follows the image,
    not the list (Achterberg's sheet came back reordered).
  - **cut.py** now separates figures by connected shapes. All sheets were re-cut with it.
- 2026-10-01, night: supporting cast done: Doorman 4, Officer 4, Director 3 + Skeptic 2, Nurse 2,
  Registrar 2, Clerk, Bourdieu, Prof G (cream hoodie), 3 judges + cook (busts), monkeys 8,
  Lecture Theatre student. Respondents (6 busts) sent.
  - **Still to do, sprites:** crowds (`sprite-audience`, `crowd-heads` with `crowd-arm-1..8`,
    `duel/duel-crowd`), props with figures (`sprite-office-gradmonkey`, `sprite-ethics-consent`,
    `sprite-mensa-bananas`), the rigs (5), calls (7), duel images (14), cutscene panels.
  - **Browser:** the ChatGPT page freezes while it generates. Wait with computer `wait`, not long
    in-page JS. After a dropped connection, reload the chat to get the image. Send with the Send button
    (find "send prompt button"), not Return.
- 2026-10-01, mouths decided (author: "that sounds good"):
  - one ChatGPT "mouth open" edit per talking pose (about 45) and one "eyes closed" edit per main-cast pose
    (about 15);
  - the half-open and wide lip-sync levels are blended from the open mouth in code.
- 2026-10-01: the author approved removing the six unused version-1 Vossberg files from `web/`
  (`vossberg-chair/lecturing/pointing/walking`, `mouth-vossberg-lecturing/pointing`). They were removed
  with `git rm` and are not committed yet; restore with `git checkout HEAD -- web/<file>`.
  Kept: the art/ originals, `art/png-originals/vossberg2-*-before-recast.webp` (version 2) and
  `art/vossberg3/`.
