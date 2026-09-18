# Corridor Archway / Codebook Reveal — Art Prompt

*The Secret of the Lost Codebook · Art Pipeline*

Replaces the flat text-only ending of the Causality Corridor (`checkWin()` in `the-secret-of-the-codebook.html`) with a dedicated background, swapped in the moment the four doors align and recede — same pattern already used for the `corridor-fall-bg.png` failure-state swap.

## How to use it

1. Attach `corridor-gate-bg.png` and one of `corridor-room1-bg.png` through `corridor-room4-bg.png` for style matching.
2. Paste the prompt as-is.
3. Crop/resize to 16:9 (1672×941, matching every other room background) and save as `corridor-archway-bg.png` in `web/`.
4. Wiring it in is a small code change: swap `cc_bg.src` to this file in `checkWin()`, same way `startFall()` swaps to `corridor-fall-bg.png`.

```
Generate a wide background illustration for a narrative adventure game, in the exact same painted, comic-linework illustration style as the attached reference images (the Causality Corridor rooms from the same game) — same brush texture, warm-into-dark lighting falloff, and color palette. Landscape orientation, same aspect ratio as the reference (16:9).

Scene: looking straight down a narrow stone corridor toward a tall stone archway at the far end, where four wooden doors have folded back flush into the walls to either side, no longer blocking the view. Warm light spills through the archway from the space beyond. Through the archway, in soft depth of field: a glimpse of tall library bookshelves on one side, a warm amber glow suggesting a cafeteria just out of view, a narrow stairwell descending into a dim basement, and in the foreground just past the threshold, an ordinary wooden reading bench with a single closed book resting on it, unremarkable. Nothing glowing, no dramatic beam of light, no pedestal, no single spotlighted object — the point is that what's beyond looks like an ordinary, slightly cluttered university building, not a treasure room.

No characters, no faces. No readable text anywhere in the scene.
```

**Payoff line already shipped in-game (`checkWin()`):** "The doors align and recede into an archway. Beyond it: no book. Shelves, a mensa, a basement full of switches, a delegation of one very confident robot. The Codebook, it turns out, was never a single volume — it's the whole department, and you're about to be handed all of it, one room at a time."
