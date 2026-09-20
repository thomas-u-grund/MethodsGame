# The Hall of Founders — Art Prompts

*The Secret of the Lost Codebook · Act II · Art Pipeline*

See `STORY.md` → Act II → "The Hall of Founders" for the puzzle design, and `ROADMAP.md` §2.3 for the loop.

## How to use this

1. Attach the reference images listed under the prompt. **Always** include a palette/style anchor
   from an already-painted room (`office-bg.png`, `lecture-bg.png`, `ethics-bg.webp`).
2. Paste the prompt **as one line** — a newline submits the ChatGPT box early.
3. Download via the in-page `fetch(img.src)` → blob → `<a download>` trick, not the editor.
4. Crop to 16:9, `cwebp -q 92 -alpha_q 95 -m 6`, install as `web/hall-bg.webp`, and change the
   room's `bg:` from `hall-bg-placeholder.svg` to the new file. Nothing else needs touching.

**Ship this background EMPTY of characters.** the clerk who appears from nowhere get added later as separate sprites, the
same way the Professor and the Act III cast were.

**Composition must match the placeholder**, because the hotspots are already positioned against
it — `web/hall-bg-placeholder.svg` shows where every prop has to sit. The layout notes below
give the same information in words.

---

## Background

Attach: `ethics-bg.webp` (grand civic interior), `office-bg.png` (palette), `lecture-bg.png` (crest).

```
Generate a wide 16:9 background illustration for a narrative adventure game, in the exact same painted comic-linework style as the attached references — same brush texture, same palette, same warm dramatic lighting. Scene: a long marble gallery of academic founders, self-important and slightly absurd. Along the back wall, four very large gilt-framed oil portraits of stern nineteenth-century bearded academics, evenly spaced, each with a brass nameplate beneath it, and a visible gap of wall behind each frame wide enough for a person to crouch in. Under each portrait, a large brass dial like a pressure gauge, labelled AUTHORITY, with a slot beneath it for feeding in cards. To the right of the portraits, a tall brass and mahogany vending machine with a coin slot, a paper feed, and a mode selector dial whose settings read FOUNDATIONAL, CRITICAL, POST-STRUCTURAL, GERMAN, EXTREMELY GERMAN, with a long curl of printed paper spilling out of it onto the floor. Far right, a ceremonial stepladder in brass and polished mahogany with a hook-headed pole clipped along its side. On the lower wall, a framed sign reading THEORY = WHAT HAS BEEN SAID IMPORTANTLY, and beside it a newer, smaller brass plaque reading QUOTATION IS NOT EXPLANATION. A small display case holds a yellowed newspaper clipping. Marble floor, red rope barriers, chandeliers. No people.
```

## Layout the hotspots expect

| Hotspot | Where it must be |
|---|---|
| `portraits` | left block 4–32% and right 49–62%, upper half |
| `weber` | the third portrait, ~34–47% across — the one with crouching room behind it |
| `dispenser` | ~66–82% across, upper half |
| `ladder` | far right, ~85–97% |
| `meter` | lower left, ~4–24%, below the portraits |
| `sign` | lower centre, ~34–56% |
| `clipping` | lower right, ~64–78%, in a display case |
