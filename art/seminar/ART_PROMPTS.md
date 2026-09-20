# The Seminar Room — Art Prompts

*The Secret of the Lost Codebook · Act II · Art Pipeline*

See `STORY.md` → Act II → "The Seminar Room" for the puzzle design, and `ROADMAP.md` §2.3 for the loop.

## How to use this

1. Attach the reference images listed under the prompt. **Always** include a palette/style anchor
   from an already-painted room (`office-bg.png`, `lecture-bg.png`, `ethics-bg.webp`).
2. Paste the prompt **as one line** — a newline submits the ChatGPT box early.
3. Download via the in-page `fetch(img.src)` → blob → `<a download>` trick, not the editor.
4. Crop to 16:9, `cwebp -q 92 -alpha_q 95 -m 6`, install as `web/seminar-bg.webp`, and change the
   room's `bg:` from `seminar-bg-placeholder.svg` to the new file. Nothing else needs touching.

**Ship this background EMPTY of characters.** the Visiting Fellow get added later as separate sprites, the
same way the Professor and the Act III cast were.

**Composition must match the placeholder**, because the hotspots are already positioned against
it — `web/seminar-bg-placeholder.svg` shows where every prop has to sit. The layout notes below
give the same information in words.

---

## Background

Attach: `lecture-bg.png` (teaching room, blackboard), `office-bg.png` (palette).

```
Generate a wide 16:9 background illustration for a narrative adventure game, in the exact same painted comic-linework style as the attached references — same brush texture, same palette, chalk dust in the light. Scene: a small, plain university seminar room, quieter and shabbier than a lecture theatre. Dominating the left two-thirds of the back wall, a large blackboard ruled into three columns with chalked headings reading IF MY EXPLANATION IS TRUE, IF AN ALTERNATIVE IS TRUE, and WHAT WOULD I ACTUALLY SEE; pinned to the board above the columns, a single index card, and beneath it three more cards in a row. An empty chalk tray. In front of the board, eleven mismatched wooden chairs in a loose horseshoe, all empty. On the right wall, a framed sign reading THEORY = WHAT COULD BE WRONG, with something small scratched into the wood beneath it. Below that, an empty seat at the seminar table. A high window, grey afternoon light, a radiator that has been painted over many times. No people.
```

## Layout the hotspots expect

| Hotspot | Where it must be |
|---|---|
| `board` | left two-thirds, ~8–62%, upper half |
| `chairs` | lower centre, ~10–54% |
| `fellow` | right, ~66–80%, mid-height — leave **empty**, she is a sprite |
| `sign` | upper right, ~84–97% |
| `skeleton` | lower right, ~84–97% — leave **empty**, the skeleton is a sprite |
