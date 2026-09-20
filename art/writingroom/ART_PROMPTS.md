# The Writing Room — Art Prompts

*The Secret of the Lost Codebook · Act V · Art Pipeline*

See `STORY.md` → Act V → "The Writing Room" for the puzzle design, and `ROADMAP.md` §2.3 for the loop.

## How to use this

1. Attach the reference images listed under the prompt. **Always** include a palette/style anchor
   from an already-painted room (`office-bg.png`, `lecture-bg.png`, `ethics-bg.webp`).
2. Paste the prompt **as one line** — a newline submits the ChatGPT box early.
3. Download via the in-page `fetch(img.src)` → blob → `<a download>` trick, not the editor.
4. Crop to 16:9, `cwebp -q 92 -alpha_q 95 -m 6`, install as `web/writingroom-bg.webp`, and change the
   room's `bg:` from `writingroom-bg-placeholder.svg` to the new file. Nothing else needs touching.

**Ship this background EMPTY of characters.** Feldstrom and KIRA get added later as separate sprites, the
same way the Professor and the Act III cast were.

**Composition must match the placeholder**, because the hotspots are already positioned against
it — `web/writingroom-bg-placeholder.svg` shows where every prop has to sit. The layout notes below
give the same information in words.

---

## Background

Attach: `office-bg.png` (palette, desk clutter), `lecture-bg.png` (crest).

```
Generate a wide 16:9 background illustration for a narrative adventure game, in the exact same painted comic-linework style as the attached references — same brush texture, same palette, warm evening lamplight. Scene: a departmental writing room at the end of a long project. Dominating the left and centre, a long wooden table with a manual typewriter, drifts of paper, cold coffee, and a single sheet of typed abstract laid out squarely under a lamp. On the wall above the table's left end, a pinned sheet headed ABSTRACT with four typed lines. Centre top, a large theatrical dial gauge labelled IMPACT, its scale marked Modest Contribution, Paradigm Shift, Nobel Adjacent, and PRESS OFFICE HAS BEEN ALERTED. Right of centre, an empty chair pushed back from the table. Far right, a side table with a black telephone, and a dinner jacket on a hanger hooked over a door. Bookshelves behind, a window showing dark evening, one green banker's lamp. No people.
```

## Layout the hotspots expect

| Hotspot | Where it must be |
|---|---|
| `abstract` | upper left, ~10–40% |
| `table` | left and centre, ~6–58%, mid-height |
| `impact` | centre top, ~44–66% |
| `feldstrom` | ~62–78% — leave **empty**, he is a sprite |
| `kira` | ~80–96% — leave **empty**, she is a sprite |
| `phone` | far right, ~80–96%, top |
