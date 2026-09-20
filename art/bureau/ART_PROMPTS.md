# The Bureau of Implications — Art Prompts

*The Secret of the Lost Codebook · Act IV · Art Pipeline*

See `STORY.md` → Act IV → "The Bureau of Implications" for the puzzle design, and `ROADMAP.md` §2.3 for the loop.

## How to use this

1. Attach the reference images listed under the prompt. **Always** include a palette/style anchor
   from an already-painted room (`office-bg.png`, `lecture-bg.png`, `ethics-bg.webp`).
2. Paste the prompt **as one line** — a newline submits the ChatGPT box early.
3. Download via the in-page `fetch(img.src)` → blob → `<a download>` trick, not the editor.
4. Crop to 16:9, `cwebp -q 92 -alpha_q 95 -m 6`, install as `web/bureau-bg.webp`, and change the
   room's `bg:` from `bureau-bg-placeholder.svg` to the new file. Nothing else needs touching.

**Ship this background EMPTY of characters.** the Implications Clerk get added later as separate sprites, the
same way the Professor and the Act III cast were.

**Composition must match the placeholder**, because the hotspots are already positioned against
it — `web/bureau-bg-placeholder.svg` shows where every prop has to sit. The layout notes below
give the same information in words.

---

## Background

Attach: `ethics-bg.webp` (institutional counter), `office-bg.png` (palette).

```
Generate a wide 16:9 background illustration for a narrative adventure game, in the exact same painted comic-linework style as the attached references — same brush texture, same palette, municipal and tired. Scene: a public-counter office of the kind that issues licences, but what it issues is meanings. Running across the left half, a long worn wooden counter with a brass grille and a queue rope in front of it. Above the counter, a conveyor belt carrying pre-printed cards past, with three overhead signs reading SMALL, MEDIUM and LARGE, each above its own stack of cards. Centre right, behind the counter, a clerk's empty stool and a rubber-stamp carousel. Far right, a wall entirely covered in identical small brass plaques, hundreds of them, each engraved FURTHER RESEARCH IS NEEDED. Below the stool position, a large dial gauge labelled SO WHAT? with a needle at zero, and beside it a small separate lamp labelled SIGNIFICANT, lit, obviously not wired to the dial. A laminated sign on the counter. Strip lighting, linoleum, a ticket dispenser. No people.
```

## Layout the hotspots expect

| Hotspot | Where it must be |
|---|---|
| `conveyor` | upper left, ~6–48% |
| `counter` | left, ~4–50%, mid-height |
| `clerk` | centre right, ~54–74% — leave **empty**, he is a sprite |
| `plaques` | far right, ~78–97% |
| `gauge` | centre right, ~54–74%, lower third |
