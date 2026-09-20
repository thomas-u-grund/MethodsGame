# The Gap Registry — Art Prompts

*The Secret of the Lost Codebook · Act V · Art Pipeline*

See `STORY.md` → Act V → "The Gap Registry" for the puzzle design, and `ROADMAP.md` §2.3 for the loop.

## How to use this

1. Attach the reference images listed under the prompt. **Always** include a palette/style anchor
   from an already-painted room (`office-bg.png`, `lecture-bg.png`, `ethics-bg.webp`).
2. Paste the prompt **as one line** — a newline submits the ChatGPT box early.
3. Download via the in-page `fetch(img.src)` → blob → `<a download>` trick, not the editor.
4. Crop to 16:9, `cwebp -q 92 -alpha_q 95 -m 6`, install as `web/gapregistry-bg.webp`, and change the
   room's `bg:` from `gapregistry-bg-placeholder.svg` to the new file. Nothing else needs touching.

**Ship this background EMPTY of characters.** the Registrar of Gaps and KIRA get added later as separate sprites, the
same way the Professor and the Act III cast were.

**Composition must match the placeholder**, because the hotspots are already positioned against
it — `web/gapregistry-bg-placeholder.svg` shows where every prop has to sit. The layout notes below
give the same information in words.

---

## Background

Attach: `ethics-bg.webp` (bureaucratic gloom), `office-bg.png` (palette).

```
Generate a wide 16:9 background illustration for a narrative adventure game, in the exact same painted comic-linework style as the attached references — same brush texture, same palette, dim and dusty. Scene: a records office whose entire stock is holes in the literature. The left half of the room is a floor-to-ceiling bank of narrow filing drawers, hundreds of them, each with a typed card in a brass holder; four drawers near the middle stand open, each holding a single index card. Centre, a clerk's desk with a green-shaded lamp, a date stamp and an empty chair. Right, an industrial conveyor belt loaded with books and papers running out of frame, exactly like the one in the library. Lower right, one filing drawer pulled fully out at waist height, wide enough that something could be wedged inside it. Dust, a stepladder on rails, one high window. No people, no robots.
```

## Layout the hotspots expect

| Hotspot | Where it must be |
|---|---|
| `drawers` | left, ~4–44%, full height |
| `registrar` | centre, ~48–66% — leave **empty**, he is a sprite |
| `kira` | upper right, ~70–97% with the conveyor — leave the robot **out** |
| `skeleton` | lower right, ~70–97%, the pulled-out drawer |
