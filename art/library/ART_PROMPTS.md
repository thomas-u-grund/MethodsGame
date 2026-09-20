# The Library — Art Prompts

*The Secret of the Lost Codebook · Act II · Art Pipeline*

See `STORY.md` → Act II → "The Library" for the puzzle design, and `ROADMAP.md` §2.3 for the loop.

## How to use this

1. Attach the reference images listed under the prompt. **Always** include a palette/style anchor
   from an already-painted room (`office-bg.png`, `lecture-bg.png`, `ethics-bg.webp`).
2. Paste the prompt **as one line** — a newline submits the ChatGPT box early.
3. Download via the in-page `fetch(img.src)` → blob → `<a download>` trick, not the editor.
4. Crop to 16:9, `cwebp -q 92 -alpha_q 95 -m 6`, install as `web/library-bg.webp`, and change the
   room's `bg:` from `library-bg-placeholder.svg` to the new file. Nothing else needs touching.

**Ship this background EMPTY of characters.** KIRA and the librarian (who is absent) get added later as separate sprites, the
same way the Professor and the Act III cast were.

**Composition must match the placeholder**, because the hotspots are already positioned against
it — `web/library-bg-placeholder.svg` shows where every prop has to sit. The layout notes below
give the same information in words.

---

## Background

Attach: `office-bg.png` (palette), `lecture-bg.png` (house crest), `ethics-bg.webp` (grand interior).

```
Generate a wide 16:9 background illustration for a narrative adventure game, in the exact same painted comic-linework style as the attached references — same brush texture, warm lamplit interior, same palette. Scene: a university library reading room that has been industrialised. Along the left wall, tall dark-wood stacks receding into badly lit depth. Left of centre, a card catalogue cabinet with many small brass-handled drawers, and the topmost drawer clearly out of comfortable reach. Across the upper middle of the room, an actual factory conveyor belt runs left to right at head height, loaded with books and papers moving past, with a hand-lettered sign hanging from it reading THE LITERATURE; a small mechanical arm on the belt is applying green stickers. Below the belt, a library trolley stacked with neat paper, a card on it reading READY TO CITE. On the right wall, a framed document hung high under a brass plate reading EVIDENCE, hanging from a picture hook well above head height. Right of that, a battered ledger book on a side table. Far right, a librarian's information desk with a black rotary telephone and a stack of blank index cards, and no librarian. On the left wall a small framed sign reads THEORY = WHAT HAS BEEN CITED. Warm reading lamps, dust in the air, autumn light through a high window. No people, no robots, no characters of any kind.
```

## Layout the hotspots expect

| Hotspot | Where it must be |
|---|---|
| `stacks` | far left, 2–22% across, upper two-thirds |
| `sign` | upper left-of-centre, ~24–38% across |
| `catalogue` | left of centre, ~24–38% across, mid-height; top drawer out of reach |
| `conveyor` | centre, ~40–66% across, upper third |
| `trolley` | centre, ~41–51% across, mid-height |
| `kira` | centre-right, ~54–67% — leave this space **empty**, she is a sprite |
| `framed` | upper right, ~70–83% across, high on the wall |
| `register` | right, ~70–84% across, mid-height |
| `desk` | far right, ~86–98% across, with the telephone |
