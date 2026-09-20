# The Delegation Engine — Art Prompts

*The Secret of the Lost Codebook · Act IV · Art Pipeline*

See `STORY.md` → Act IV → "The Delegation Engine" for the puzzle design, and `ROADMAP.md` §2.3 for the loop.

## How to use this

1. Attach the reference images listed under the prompt. **Always** include a palette/style anchor
   from an already-painted room (`office-bg.png`, `lecture-bg.png`, `ethics-bg.webp`).
2. Paste the prompt **as one line** — a newline submits the ChatGPT box early.
3. Download via the in-page `fetch(img.src)` → blob → `<a download>` trick, not the editor.
4. Crop to 16:9, `cwebp -q 92 -alpha_q 95 -m 6`, install as `web/delegation-bg.webp`, and change the
   room's `bg:` from `delegation-bg-placeholder.svg` to the new file. Nothing else needs touching.

**Ship this background EMPTY of characters.** KIRA get added later as separate sprites, the
same way the Professor and the Act III cast were.

**Composition must match the placeholder**, because the hotspots are already positioned against
it — `web/delegation-bg-placeholder.svg` shows where every prop has to sit. The layout notes below
give the same information in words.

---

## Background

Attach: `surveylab-bg.webp` (machine room), `office-bg.png` (palette).

```
Generate a wide 16:9 background illustration for a narrative adventure game, in the exact same painted comic-linework style as the attached references — same brush texture, same palette, bright and mechanical. Scene: a machine room that has been quietly taken over by an over-helpful automatic process. On the left wall, a vast printed merge log pinned up sheet by sheet, forty pages across, dense with tabulated numbers, one page circled. Below it, a low table holding a single printed record sheet. Centre right, a clear empty space on the floor where something small is clearly meant to be standing. Far right, an enormous overhead lever on a geared quadrant, the size of a person, descending slowly towards a brass plate labelled AUTO-SUBMIT, with a paper tag hanging from the handle. Stacks of freshly printed manuscript on every surface, a dot-matrix printer still feeding paper onto the floor, and a wall-mounted schedule board. Fluorescent light, cable trunking, a faint haze of toner. No people, no robots.
```

## Layout the hotspots expect

| Hotspot | Where it must be |
|---|---|
| `log` | left, ~6–46%, upper half |
| `record` | left, ~6–46%, lower third |
| `kira` | centre right, ~54–74% — leave **empty**, she is a sprite |
| `lever` | far right, ~78–97%, floor to ceiling |
