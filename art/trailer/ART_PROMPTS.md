# Opening Trailer — Art Prompts

*The Secret of the Lost Codebook · Art Pipeline*

Monkey-Island-style narration panels for the intro sequence, played every time the game loads before the campus map (Escape skips ahead), same `.scene-caption`-over-full-bleed-art pattern already used in Act I. Narration text is a code-rendered overlay, not baked into the art — these are just the backgrounds.

**Status:** panels 1, 2, 3, 4, 5 are generated and live. Panel 2b ("The Spiral") below is a new escalation beat, not yet generated — once it exists, insert it into the `PANELS` array in `web/the-secret-of-the-codebook.html` between panels 2 and 3 (and add its filename to the `PRELOAD` array just above it).

## How to use each one

1. Start a fresh ChatGPT chat (or continue from wherever you generated the office/campus art) and attach the reference image(s) noted under each prompt for style matching.
2. Paste the prompt text as-is.
3. Crop/resize to 16:9 (1672×941, matching every other room background) and drop into `web/`.

---

## Panel 1 — The Deadline *(revised — replaces the old "Rejection" concept)*

**Why it changed:** the original version opened on an already-rejected paper stamped "REVISE AND RESUBMIT," which clashed with the ending (which *also* stamps the finished folder "REVISE AND RESUBMIT" — reusing the same stamp at both ends risked reading as "you failed" instead of "you won"). The new version opens on the same empty research folder the Doorman later fills during Act I, which foreshadows the actual game item instead. See `STORY.md` for the full reasoning.

**The currently-shipped `trailer-panel1-rejection.png` is the old rejection-letter art and needs replacing with this.**

Attach: `office-bg.png` (style/palette anchor).

```
Generate a wide background illustration for a narrative adventure game, in the exact same painted, comic-linework illustration style as the attached reference image (the professor's office from the same game) — same brush texture, linework, warm lighting, and color palette. Landscape orientation, same aspect ratio as the reference (16:9).

Scene: an extreme close-up, slightly tilted, on a cluttered desk at night, lit by a single desk lamp just out of frame. In sharp focus, front and center: a plain, empty manila folder labeled "RESEARCH PROJECT" in stenciled letters, lying open to show it's completely blank inside. Beside it, a corner of a wall calendar is visible, a date circled in red marker with "DUE" scrawled next to it. A laptop screen glows faintly nearby, showing a blank document with a blinking cursor. Around it, out of focus: a coffee mug, a scattering of pens, crumpled paper. No people, no hands visible.

No characters, no faces. No readable text anywhere in the scene except the folder label and the calendar's "DUE" note.
```

Save the result as `trailer-panel1-deadline.png` and I'll swap it into the `PANELS` array (the narration text is already updated to match, waiting on this art).

**Narration (already live):** "Every research project starts the same way: a deadline, an empty folder, and nothing else."

## Panel 2 — The Protagonist

Attach: `office-bg.png` (style/palette anchor).

```
Generate a wide background illustration for a narrative adventure game, in the exact same painted, comic-linework illustration style as the attached reference image (the professor's office from the same game) — same brush texture, linework, warm lighting, and color palette. Landscape orientation, same aspect ratio as the reference (16:9).

Scene: a small, cluttered shared student desk/dorm corner at night, viewed from slightly behind and to the side of a seated figure so their face is not visible — just the back of their head and shoulders, silhouetted against a glowing laptop screen. The desk is covered in crossed-out sheets of paper with topic titles scribbled and struck through, empty energy-drink cans, and a small corkboard on the wall above the desk covered in index cards connected by a chaotic tangle of red string, the connections making increasingly less sense toward the edges. A single desk lamp casts warm light across the mess.

No visible faces. No readable text anywhere in the scene except the crossed-out titles on the desk (keep them illegible/scribbled, not meant to be read).
```

**Narration:** "This is you, on your fourth topic change this semester. Your advisor's patience is now measured in single digits."

## Panel 2b — The Spiral *(not yet generated)*

An escalation beat inserted between "The Protagonist" and "The Rumor" — the panic actually peaking before the rumor offers a way out. Save as `trailer-panel2b-spiral.png`.

Attach: `office-bg.png` (style/palette anchor).

```
Generate a wide background illustration for a narrative adventure game, in the exact same painted, comic-linework illustration style as the attached reference image (the professor's office from the same game) — same brush texture, linework, warm lighting, and color palette. Landscape orientation, same aspect ratio as the reference (16:9).

Scene: the same cluttered dorm desk as before, but now visibly mid-chaos — the student is standing, one hand gripping their own hair, the other frozen mid-gesture at a laptop showing an absurd number of open browser tabs. A second energy-drink can has just tipped over, fizzing across a spread of printed papers. The corkboard behind them has visibly multiplied — twice as much red string as before, connecting index cards to increasingly unrelated images (a UFO, a cat, a pyramid). A wall clock in frame shows an impossible hour. A pizza box tower leans in one corner. Face not visible — obscured by hair/angle or turned away.

No visible faces. No readable text anywhere in the scene.
```

**Narration:** "By week nine the topic has changed eleven times, the corkboard needs its own corkboard, and sleep has become a rumor of its own."

## Panel 3 — The Rumor

Attach: `lecture-bg.png` and/or `campus-map-bg.png` (gothic campus exterior style anchor).

```
Generate a wide background illustration for a narrative adventure game, in the exact same painted, comic-linework illustration style as the attached reference images (the campus exteriors from the same game) — same brush texture, warm dusk lighting, and color palette. Landscape orientation, same aspect ratio as the reference (16:9).

Scene: a gothic university courtyard at dusk, matching the campus's established architecture — stone buildings, arched windows, autumn trees, warm lamplight beginning to glow against a darkening blue sky. In the mid-ground, near a low stone fountain or a lamppost, two students stand close together in hushed conversation, backs mostly to the viewer or partially silhouetted, body language conspiratorial. The rest of the courtyard is quiet and empty.

No visible faces. No readable text anywhere in the scene.
```

**Narration:** "Word travels, in hushed tones, of a professor who can turn any bad idea into a real one. If you can survive seven seconds of his patience."

## Panel 4 — The Legend

Attach: `corridor-gate-bg.png` (locked-door mood anchor), optionally `office-bg.png` for palette.

```
Generate a wide background illustration for a narrative adventure game, in the exact same painted, comic-linework illustration style as the attached reference image (a locked door vestibule from the same game) — same brush texture, warm-into-dark lighting falloff, and color palette. Landscape orientation, same aspect ratio as the reference (16:9).

Scene: a dim, narrow library hallway at the end of which sits a heavy, old, closed door, lit by a single pool of light from a pendant lamp above it — visually distinct from the corridor's own gate door, older and more weathered, with a small tarnished plaque beside it too worn to read. In the foreground, two students walk away from the door toward the viewer, shoulders slumped, one carrying a thick folder of papers, both clearly just turned away in defeat. Tall dark bookshelves line the hallway walls on either side, fading into shadow.

No visible faces. No readable text anywhere in the scene.
```

**Narration:** "They say he keeps a Codebook. No one's seen it. Everyone's heard of it. Most who go looking end up reassigned to committee work."

## Panel 5 — Arrival

Attach: `office-bg.png`, or the "Professor's Office" building crop from `campus-map-bg.png`.

```
Generate a wide background illustration for a narrative adventure game, in the exact same painted, comic-linework illustration style as the attached reference image (the professor's office building from the same game's campus map) — same brush texture, warm lighting, and color palette. Landscape orientation, same aspect ratio as the reference (16:9).

Scene: a close view of a heavy wooden office door set into a stone gothic building facade, morning light. A small brass plaque beside the door reads 'PROF. — BY APPOINTMENT (GOOD LUCK).' In the foreground, filling the lower portion of the frame, the back of a single raised hand, knuckles just about to knock, belonging to a figure whose body is otherwise out of frame or in soft silhouette at the very edge.

No visible faces. No readable text anywhere in the scene except the plaque.
```

**Narration:** "This is where it starts. Again."

---

*Wiring in a new panel is a two-line change: add its filename to `PRELOAD` and a `{ src, text }` entry to `PANELS`, both near the bottom of `web/the-secret-of-the-codebook.html`, just above the closing `</html>`.*

---

## Act II interlude (generated 2026-09-18, live)

Generated in one ChatGPT chat with `trailer-panel1-deadline.png`, `office-bg.png` and `prof-lecturing.png` attached. Files: `web/trailer2-a-folder.png`, `trailer2-b-prof.png`, `trailer2-c-h27.png`. Panels D (montage) and E (cast poster) are ImageMagick composites of existing art, not generated.

- **A, The Question:** the same desk and folder as panel 1, now at golden dawn; one BLANK index card in the folder lit like a relic; red rubber stamp QUESTION EXISTS on the flap; mug tipped over. (The Question text is overlaid in code.)
- **B, Not Evidence:** the professor at his desk holding the RESEARCH PROJECT folder at arm's length like a dead fish, one eyebrow impossibly high; a rattling brass pneumatic tube above the desk, steaming.
- **C, H-27:** the pneumatic tube coughing out an absurdly long FORM H-27 / REQUEST TO APPROACH HUMAN BEINGS with four empty checkboxes (labels overlaid in code), pages avalanching over the desk, hourglass knocked over.
