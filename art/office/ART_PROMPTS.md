# Office Art Prompts

*The Secret of the Codebook · Art Pipeline*

Prompts for generating the Seven-Second Office assets in ChatGPT, matched to the painted illustration already in the game. Round 1 covers two reusable ambient effects, one best-effort character match, and two inventory icons. Round 2 covers the six desk-clutter pickups.

## How to use each one

1. Continue in the same ChatGPT chat where the office background was made — it already has the style in context, so you shouldn't need to re-attach the reference image for most of these.
2. Paste the prompt text as-is.
3. For **#3 (the blink frame)** specifically, re-attaching `office-bg.png` alongside the prompt is worth doing anyway — that one lives or dies on exact pixel/color matching.
4. Crop/align and wire the result into the scene.

---

## 1. Steam wisp — Reusable

For the coffee mug on the desk. Low risk — translucent effects blend onto almost any background, and this same sprite can be reused in other rooms later.

```
Generate a small, isolated sprite of rising steam/wisp smoke, painted in the same style as this reference: loose, slightly stylized comic-linework wisps, warm off-white/cream color, soft and translucent, no hard outline. Show 2-3 curling tendrils rising and thinning toward the top. Transparent background. Square canvas, roughly 200x300px, steam centered and rising from the bottom edge (as if from a cup just below frame). No text, no other objects.
```

## 2. Warm lamp glow — Reusable

For the banker's lamp. Same low-risk logic as the steam — a soft glow has no hard edges to misalign.

```
Generate an isolated soft glow/light-pool sprite in the same painted style as this reference: a warm amber-gold radial glow, soft-edged, like light spilling from underneath a lampshade onto a desk. No visible lamp, no hard edges — just the glow itself, fading to full transparency at the edges. Transparent background. Roughly 400x250px, glow concentrated in the upper-center, fading outward.
```

## 3. Professor — eyes closed — Best effort

A blink frame for the professor. This is genuinely hard to get pixel-aligned from a fresh generation — matching one specific painted character's exact eyes/lighting/proportions is asking a lot of the model.

```
Here is an illustration of a professor at a desk. I need an isolated close-up of just this same character's closed eyes and immediate surrounding skin/glasses area — same lighting, same skin tone, same glasses, same angle — as if he just blinked. Crop tightly to only the eye region (eyebrows to just below the eyes), matching the exact painted style, color palette, and proportions of the reference. Transparent background, no other facial features, no text.
```

> If it doesn't overlay cleanly on the original, that's fine — skip the blink for this room rather than force a mismatched patch. Not worth fighting the model over one frame.
>
> **Outcome:** it didn't overlay cleanly. The blink animation was removed entirely later in the project rather than shipped mismatched — see `ROADMAP.md`.

## 4. Inventory icon — A Precisely Worded Question

The item picked up from the professor and consumed in Causality Corridor.

```
Generate a small inventory-icon illustration in the same painted comic style as this reference: a neatly rolled parchment scroll tied with a red ribbon, with a single bold red question mark visible on the visible edge of the paper. Centered, isolated object, dramatic small highlight/shadow for depth. Transparent background. Square canvas, roughly 256x256px. No other objects, no extra text.
```

## 5. Inventory icon — Lunch Raffle Drum

Picked up from the bookshelf, carried to the Mensa to draw a true random sample.

```
Generate a small inventory-icon illustration in the same painted comic style as this reference: a hand-crank raffle drum (round barrel on a stand with a crank handle), brass and warm wood tones, a few small ticket stubs visible through a slot. Centered, isolated object, small dramatic highlight/shadow for depth. Transparent background. Square canvas, roughly 256x256px. No other objects, no text.
```

---

# Round 2 · Desk Clutter Pickups

Six small pickup items to scatter across the desk/shelf/windowsill, plus a matching inventory icon for each. Do the scene edit first, then the six icons.

## How to use these

1. For **#6**, attach the current `office-bg.png` (the one already in the game) and paste the prompt — it's an edit of that exact image, not a fresh generation.
2. If the model redraws more of the scene than you want (changed lighting, shifted objects), ask it to try again "changing only the added objects, nothing else" — or add the six items one at a time in separate edit turns instead of all six at once.
3. For the icon prompts (#7–12), continue in the same chat so the painted style stays consistent — no need to re-attach the reference each time.
4. Crop, align, and wire each item into the scene as a hotspot + pickup.

## 6. Scene edit — add all six objects

Adds all six pickups directly into the existing painted background.

```
Using the attached image as the exact base scene, add these six small objects to the professor's office. Match the same brush texture, color palette, lighting, and painted comic-book style as the rest of the illustration. Do not change the character, the existing furniture, the windows, the corkboard, the skeleton, or the overall composition and camera angle.

Add:
1. On the desk, near the stack of papers: a mug or cup stuffed with pens and pencils, several visibly chewed flat at the cap tips.
2. On the desk, with a faint ring-shaped coffee stain on the wood around it: a ceramic mug reading 'WORLD'S OKAYEST SAMPLE SIZE' in small painted lettering, with a spoon standing upright inside it as if the coffee has solidified solid.
3. On the windowsill or a bookshelf, small enough to read as a background prop: a small five-sided die/block with tiny printed text on each face reading STRONGLY DISAGREE / DISAGREE / NEUTRAL / AGREE / STRONGLY AGREE.
4. On the desk near the green banker's lamp: a small hourglass with a visible hairline crack down one glass bulb, and a small handwritten paper tag tied around its neck reading '7 SEC'.
5. Half-buried in the paper stack, only the keyring loop and a corner of the label visible: a small USB flash drive with a strip of label tape wrapped around it reading 'FINAL_v23_REALFINAL_USETHIS' in tiny handwritten marker lettering.
6. On the desk near the 'Drittmittel-funded staff only' nameplate: a wooden-handled rubber stamp resting face-up in a small red ink pad, its printed face reading 'SIGNIFICANT (p<.05)' in bold letters.

Place each object in open desk/shelf/windowsill space so it doesn't overlap existing objects. Keep everything else in the scene identical.
```

> If any single object comes out warped or unreadable, it's fine to drop it and re-run the icon prompt alone later, or skip that one pickup entirely — same rule as the blink frame.

## 7. Inventory icon — A Chewed Pen

Picked up from the pen jar on the desk.

```
Generate a small inventory-icon illustration in the same painted comic style as this reference: a single pen, its cap end visibly chewed and flattened, resting at a diagonal. Centered, isolated object, small dramatic highlight/shadow for depth. Transparent background. Square canvas, roughly 256x256px. No other objects, no text.
```

## 8. Inventory icon — Mug of Fossilized Coffee

Picked up from the desk.

```
Generate a small inventory-icon illustration in the same painted comic style as this reference: a ceramic mug reading 'WORLD'S OKAYEST SAMPLE SIZE' in small painted lettering, coffee-stained rim, a spoon standing upright inside it. Centered, isolated object, small dramatic highlight/shadow for depth. Transparent background. Square canvas, roughly 256x256px. No other objects.
```

## 9. Inventory icon — Likert-Scale Die

Picked up from the windowsill/bookshelf.

```
Generate a small inventory-icon illustration in the same painted comic style as this reference: a small five-sided die/block, warm wood or foam material, with visible faces reading 'STRONGLY DISAGREE', 'DISAGREE', 'NEUTRAL', 'AGREE', 'STRONGLY AGREE' in tiny painted lettering. Centered, isolated object, small dramatic highlight/shadow for depth. Transparent background. Square canvas, roughly 256x256px. No other objects.
```

## 10. Inventory icon — Cracked Hourglass

Picked up from the desk, near the lamp.

```
Generate a small inventory-icon illustration in the same painted comic style as this reference: a small hourglass with a visible hairline crack down one glass bulb, sand mid-fall, a small paper tag tied to its neck reading '7 SEC' in handwriting. Centered, isolated object, small dramatic highlight/shadow for depth. Transparent background. Square canvas, roughly 256x256px. No other objects.
```

## 11. Inventory icon — "FINAL_v23_REALFINAL" USB Drive

Picked up from the paper stack on the desk.

```
Generate a small inventory-icon illustration in the same painted comic style as this reference: a small USB flash drive on a keyring loop, a strip of label tape wrapped around its body reading 'FINAL_v23_REALFINAL_USETHIS' in tiny handwritten marker lettering. Centered, isolated object, small dramatic highlight/shadow for depth. Transparent background. Square canvas, roughly 256x256px. No other objects.
```

## 12. Inventory icon — "SIGNIFICANT" Stamp

Picked up from the desk, near the Drittmittel plaque.

```
Generate a small inventory-icon illustration in the same painted comic style as this reference: a wooden-handled rubber stamp with its printed face turned toward the viewer reading 'SIGNIFICANT (p<.05)' in bold letters, resting at an angle beside a small red ink pad. Centered, isolated object, small dramatic highlight/shadow for depth. Transparent background. Square canvas, roughly 256x256px. No other objects.
```

---

*Source: [Office Art Prompts artifact](https://claude.ai/code/artifact/7e35f07f-8b11-4f9a-8da3-93b6a743da6a)*
