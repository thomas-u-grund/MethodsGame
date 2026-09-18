# The Fieldwork Arena — Art Prompts

*The Secret of the Lost Codebook · Act II · Art Pipeline*

A new room: a live game-show set for administering the survey, where the response rate collapses in real time. See `STORY.md` → Act II → "The Fieldwork Arena" for the full puzzle design.

**Important — this background must ship EMPTY.** No participants seated, no Fieldwork Director, nothing on the scoreboard. The big illuminated tote board is a fixed structural prop (like Office's desk), so it belongs in the base art — but its digit display must be left **blank/dark**, not showing any number, since the actual percentage is a code-rendered overlay (the same pattern already used for the corridor's door-case labels and the citation counter), not baked into the art.

## How to use this

1. Attach `office-bg.png` (palette anchor).
2. Paste the prompt below as-is.
3. Crop/resize to 16:9 (1672×941) and drop into `web/` as `fieldwork-bg.png`.

---

## Background

Attach: `office-bg.png` (palette anchor).

```
Generate a wide background illustration for a narrative adventure game, in the exact same painted, comic-linework illustration style as the attached reference image (the professor's office from the same game) — same brush texture, warm lighting, and color palette, but staged like a retro TV game-show set. Landscape orientation, 16:9.

Scene: a small studio stage with warm stage lighting and a dark curtained backdrop. Along the back wall, a large old-fashioned illuminated scoreboard/tote board mounted like a scientific instrument, with a hand-lettered header reading "RESPONSE RATE" above a blank, unlit digital-style display panel (no numbers or percentage shown — the panel is dark/empty). In front of the board, a row of twelve small empty numbered stage podiums/stools arranged in an arc, each with a small illuminated number plate (1 through 12) at its base, currently all unlit. To one side, a modest wooden host's podium with a telephone and a stack of blank index cards. Around the edges of the room, four small doors set into the curtained walls, each with a hand-painted sign above it: "TOO BUSY," "FORGOT," "EMAIL WENT TO SPAM," and "I DON'T DO SURVEYS." Warm spotlights crossing the stage.

No people. The scoreboard's display panel must be completely blank — no digits, no percentage sign. No other readable text anywhere except the four door signs and the "RESPONSE RATE" header specified.
```

Save the result as `fieldwork-bg.png`.

## Follow-up sprites (generate later, once the background is locked)

Attach the finished `fieldwork-bg.png` for each:

- **The Fieldwork Director**, headset, character sprite.
- **Participants**, as small sprites that can appear/vanish at the twelve podiums.
- **The "REPLACE MISSING RESPONDENTS WITH NEAREST AVAILABLE PERSON" button**, as a prop on the host's podium.
- **The skeleton**, beside a desk phone, sign reading "FOLLOW-UP EMAIL #11 · STILL HOPEFUL."
- **The RECORD HIGH banner and confetti**, for the act's final payoff.
- **The dot-matrix printer and DATA-labeled USB drive**, for the ending beat.

## A note on the RESPONSE RATE display

Keep this the same architecture as the Causality Corridor's door-case labels and the citation counter: the number itself (`100%`, `83%`, `64%`, etc.) should be a `<div>` positioned in code over the blank panel in the art, not part of any image — that's what lets it update live as the player works through the nonresponse puzzle chain.
