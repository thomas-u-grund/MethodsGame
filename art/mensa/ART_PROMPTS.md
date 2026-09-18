# The Mensa — Art Prompts

*The Secret of the Lost Codebook · Act II · Art Pipeline*

Reframed from a generic cafeteria into the site of the university's official, absurdly ceremonial random-sampling apparatus. See `STORY.md` → Act II → "The Mensa — The Grand Sampling Ceremony" for the full puzzle design. This replaces the earlier, now-superseded Mensa art-prompt pass logged in `ROADMAP.md`.

**Important — this background must ship EMPTY.** No diners, no Sampling Officer, no food visible at the counters, no cards/numbers in the frame or drum. The empty gilded picture frame is deliberately empty in the *fiction* too ("the frame" is the joke), so it stays empty in every state — that one's fine to bake in as-is. Food-counter signage, queue lines, and any other people or state-specific props are added later as separate sprites.

## How to use this

1. Attach `office-bg.png` (palette anchor) and `campus-map-bg.png` (grand-institutional-space anchor).
2. Paste the prompt below as-is.
3. Crop/resize to 16:9 (1672×941) and drop into `web/` as `mensa-bg.png`.

---

## Background

Attach: `office-bg.png` (palette anchor), `campus-map-bg.png` (scale/architecture anchor).

```
Generate a wide background illustration for a narrative adventure game, in the exact same painted, comic-linework illustration style as the attached reference images (the professor's office and the campus map, from the same game) — same brush texture, warm lighting, and color palette. Landscape orientation, 16:9.

Scene: a grand old dining hall, gothic arched windows along one side letting in autumn light, long empty wooden tables and benches filling the middle distance, a row of unlit self-service food counters along the back wall (no food, no signage text on them, just clean stainless-steel and glass fixtures). In the center foreground, roped off with a velvet rope on brass stanchions and lit by a single dramatic spotlight from above, stands a colossal ornate brass raffle drum on an engraved wooden pedestal, clearly ceremonial rather than functional-looking, with elaborate scrollwork. Beside it, on its own small pedestal, an ornate empty gilded picture frame, large enough to stand in, facing outward toward the dining hall as if waiting for something to be placed inside it. A small brass sign on the pedestal reads "UNIVERSITY SAMPLING OFFICER — CEREMONIES BY APPOINTMENT."

No people, no food, no readable text anywhere except the one sign specified. The picture frame is empty — do not place anything inside it.
```

Save the result as `mensa-bg.png`.

## Follow-up sprites

Room-fixed props (composite onto the finished `mensa-bg.png`, not carried):

- **The University Sampling Officer**, in ceremonial sash, as a character sprite.
- **Queue of students in "I ♥ STANDARD ERRORS" tote bags**, for the wrong-sampling-frame gag.
- **The "QUALITATIVE PEOPLE" table** and the **"n = 1 / BUT VERY INTERESTING"** table-for-one signage, plus its skeleton (sign: "ALSO VERY LONELY").
- **Numbered raffle balls**, for the drum's payoff moment (confetti, flag reading "A SAMPLE HAS OCCURRED").
- **The frame, full of numbered cards** — a state-swap of the same empty gilded frame prop already in the background, once the pseudonymised list has been fed in.

## Inventory items

### The Wrong Sample List

What the empty frame produces if aimed at the lunch queue instead of the real student body — a plausible-looking but wrong sampling frame, kept around to trade in later.

```
Generate a small inventory-icon illustration in the same painted comic style as this reference: a clipboard holding a short handwritten list of a dozen names, a small doodle of a tote bag drawn in the margin, a coffee ring stain across one corner. Centered, isolated object, small dramatic highlight/shadow for depth. Transparent background. Square canvas, roughly 256x256px. No other objects, no legible names.
```

### Pseudonymised Student List

The real sampling frame, released by the Ethics Tribunal once identifying data is stripped — fed into the frame/drum here, not the frame itself.

```
Generate a small inventory-icon illustration in the same painted comic style as this reference: a long, official-looking accordion-folded printout, densely packed with small numbered rows instead of names, an embossed university seal stamped in one corner. Centered, isolated object, small dramatic highlight/shadow for depth. Transparent background. Square canvas, roughly 256x256px. No other objects, no legible text beyond implied numbers.
```

### Mensa Lunch Bag

A plain brown paper bag — the absurdly mundane fix for the Ethics Tribunal's completely transparent "anonymous" ballot box.

```
Generate a small inventory-icon illustration in the same painted comic style as this reference: a single ordinary brown paper lunch bag, slightly crumpled, folded over once at the top, a small grease spot near the bottom corner. Centered, isolated object, small dramatic highlight/shadow for depth. Transparent background. Square canvas, roughly 256x256px. No other objects, no text.
```

### Mensa Incentive Voucher

Handed over once the player surrenders the Wrong Sample List; carried to the Fieldwork Arena to help chase down a reluctant respondent.

```
Generate a small inventory-icon illustration in the same painted comic style as this reference: a small perforated paper voucher, dotted tear-line along one edge, reading 'GOOD FOR ONE (1) FREE LUNCH' in friendly rounded lettering with a small illustration of a curry bowl in the corner. Centered, isolated object, small dramatic highlight/shadow for depth. Transparent background. Square canvas, roughly 256x256px. No other objects.
```
