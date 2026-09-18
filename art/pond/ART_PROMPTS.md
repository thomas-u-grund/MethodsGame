# Probability Pond — Art Prompts

*The Secret of the Lost Codebook · Art Pipeline*

A new, always-open Act I side room. Two white swans, a plaque declaring "ALL SWANS ARE WHITE" as established fact, and a black-ink pickup (in the Lecture Theatre) that falsifies it. See `STORY.md` for the full puzzle design.

## How to use these

1. Generate the background first (#1) — everything else depends on matching it.
2. Attach `campus-map-bg.png` (the pond is already visible there in miniature) and one close-up room background (`office-bg.png` or `lecture-bg.png`) for style anchoring on #1.
3. For #3 (the blackened swan), attach the finished pond background itself once it exists, so the new swan matches the white ones' exact pose/scale/lighting.
4. Crop/align and wire in: background as the room's `<img>`, ink as a desk-clutter-style pickup in the Lecture Theatre, swan sprite as an overlay `<img>` toggled visible after `Use` ink `on` swan (same pattern as the office's `showPatch`/`hideSprite`).

---

## 1. Pond background

```
Generate a wide background illustration for a narrative adventure game, in the exact same painted, comic-linework illustration style as the attached reference images (the campus map and other room paintings from the same game) — same brush texture, warm autumn lighting, and color palette. Landscape orientation, same aspect ratio as the reference (16:9).

Scene: a close, walk-in view of a small campus pond, seen from a stone path at the water's edge. A weeping willow trails into the water on one side; autumn leaves scatter across the surface; a low stone balustrade or a wooden bench sits near the path. Two white swans float on the pond, clearly separated from each other with open water around each one (so either can later be replaced individually without disturbing the other). A small weathered wooden plaque on a post near the water's edge reads 'ALL SWANS ARE WHITE — ESTABLISHED FACT (N=2)' in stenciled lettering. Gothic campus buildings are visible across the water in the background, matching the established campus architecture.

No characters, no faces. No readable text anywhere in the scene except the plaque.
```

## 2. Inventory icon — Bottle of Black Ink

Attach: `office-bg.png` or `lecture-bg.png` (style anchor).

```
Generate a small inventory-icon illustration in the same painted comic style as this reference: a small glass ink bottle with a cork stopper, filled with black ink, a plain paper label reading 'INK' with a smudged black fingerprint on it. Centered, isolated object, small dramatic highlight/shadow for depth. Transparent background. Square canvas, roughly 256x256px. No other objects.
```

## 3. Blackened swan overlay sprite *(generate after #1 exists)*

Attach: the finished pond background from #1, for exact pose/scale/lighting matching.

```
Using the attached pond scene as reference, generate an isolated sprite of a single swan in the exact same pose, size, and lighting as one of the white swans in that image — but with entirely black feathers instead of white, same orange beak, same reflection on the water beneath it. Isolated on a transparent background so it can be composited directly on top of one of the existing white swans. Match the linework and painted style of the reference exactly. No other objects, no text.
```
