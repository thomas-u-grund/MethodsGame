# The Statistics Basement — Art Prompts

*The Secret of the Lost Codebook · Act IV · Art Pipeline*

See `STORY.md` → Act IV → "The Statistics Basement" for the puzzle design, and `ROADMAP.md` §2.3 for the loop.

## How to use this

1. Attach the reference images listed under the prompt. **Always** include a palette/style anchor
   from an already-painted room (`office-bg.png`, `lecture-bg.png`, `ethics-bg.webp`).
2. Paste the prompt **as one line** — a newline submits the ChatGPT box early.
3. Download via the in-page `fetch(img.src)` → blob → `<a download>` trick, not the editor.
4. Crop to 16:9, `cwebp -q 92 -alpha_q 95 -m 6`, install as `web/basement-bg.webp`, and change the
   room's `bg:` from `basement-bg-placeholder.svg` to the new file. Nothing else needs touching.

**Ship this background EMPTY of characters.** nobody — this room is deliberately unstaffed get added later as separate sprites, the
same way the Professor and the Act III cast were.

**Composition must match the placeholder**, because the hotspots are already positioned against
it — `web/basement-bg-placeholder.svg` shows where every prop has to sit. The layout notes below
give the same information in words.

---

## Background

Attach: `corridor-gate-bg.png` (stone, gloom), `office-bg.png` (palette).

```
Generate a wide 16:9 background illustration for a narrative adventure game, in the exact same painted comic-linework style as the attached references — same brush texture, same palette, but darker and underground. Scene: a low brick basement room fitted out like a shabby seaside amusement arcade. Along the left wall, a long console of twenty large brass toggle switches in a row, each under a small unlit green bulb, with a hand-written paper label under each one. Above the console, a mechanical spring-loaded banner, currently retracted, with DISCOVERY! visible on its edge. Centre right, a heavy wooden lectern holding a folded document with a red wax seal, lit by a single hanging bulb. Far right, a seated skeleton in a chair holding one lit light bulb in its hand, with a small hand-lettered sign hung around its neck. Brick vaulting, exposed pipes, a floor drain, one flight of stone steps going up out of frame. No people.
```

## Layout the hotspots expect

| Hotspot | Where it must be |
|---|---|
| `switches` | left, ~6–46%, upper half |
| `banner` | centre, ~50–76%, top |
| `seal` | centre, ~50–76%, mid-height, on the lectern |
| `skeleton` | right, ~80–96% — paint this one in, it does not move |
