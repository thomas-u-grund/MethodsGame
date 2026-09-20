# Feldstrom's Workshop — Art Prompts

*The Secret of the Lost Codebook · Act II · Art Pipeline*

See `STORY.md` → Act II → "Feldstrom's Workshop" for the puzzle design, and `ROADMAP.md` §2.3 for the loop.

## How to use this

1. Attach the reference images listed under the prompt. **Always** include a palette/style anchor
   from an already-painted room (`office-bg.png`, `lecture-bg.png`, `ethics-bg.webp`).
2. Paste the prompt **as one line** — a newline submits the ChatGPT box early.
3. Download via the in-page `fetch(img.src)` → blob → `<a download>` trick, not the editor.
4. Crop to 16:9, `cwebp -q 92 -alpha_q 95 -m 6`, install as `web/workshop-bg.webp`, and change the
   room's `bg:` from `workshop-bg-placeholder.svg` to the new file. Nothing else needs touching.

**Ship this background EMPTY of characters.** Prof. Feldstrom get added later as separate sprites, the
same way the Professor and the Act III cast were.

**Composition must match the placeholder**, because the hotspots are already positioned against
it — `web/workshop-bg-placeholder.svg` shows where every prop has to sit. The layout notes below
give the same information in words.

---

## Background

Attach: `office-bg.png` (palette, clutter density), `corridor-gate-bg.png` (exterior lean-to logic).

```
Generate a wide 16:9 background illustration for a narrative adventure game, in the exact same painted comic-linework style as the attached references — same brush texture, same palette, warm and cluttered. Scene: a cramped lean-to workshop bolted onto the side of a grand stone building, full of brass, steam and ambition, clearly built by a physicist who wandered into the wrong department. On the left wall, pinned motorway traffic-flow diagrams, shockwave graphs and half-erased equations, plus a framed photograph of a man standing proudly beside a traffic jam. Below them, a lectern holding an enormous doctoral thesis, hundreds of pages thick. Dominating the centre, a large brass and iron machine like a cross between a printing press and a railway signal box, with a manufacturer's plate above its drum, two big ratchet levers on its front, and a paper output slot; the entire left-hand control panel of this machine is covered over with masking tape with DO NOT written across it in marker. On the machine's right flank, a circular manufacturer's gauge labelled THINGS THIS FORBIDS. A salvaged traffic-counting gate, like a road vehicle counter, is bolted to the machine's side. Far right, a desk with a black telephone, a small framed card, and a second wall clock; a dinner jacket hangs on the back of the door; a packed suitcase sits underneath. Chalked on the door in a different hand: PEOPLE ARE NOT PARTICLES. No people.
```

## Layout the hotspots expect

| Hotspot | Where it must be |
|---|---|
| `diagrams` | upper left, ~6–30% |
| `thesis` | lower left, ~6–20%, on a lectern |
| `machine` | centre, ~32–66%, floor to upper third |
| `tape` | the machine's left-hand panel, ~34–46% across, lower third |
| `forbids` | the machine's right flank, ~68–80%, upper-middle |
| `desk` | far right, ~82–97%, with the telephone and the framed extension card |
| `feldstrom` | ~68–80%, mid-height — leave **empty**, he is a sprite |
