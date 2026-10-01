# To do: Act V end sequence, look, feel and controls (proposed 2026-10-01)

Scope: Poster Session end → Keynote room → duel → replications → Stockholm → Office submission →
outro (Reviewer 2 battle) → credits. Root cause: the duel (`web/duel/index.html`) is a separate page
built as a prototype with its own fonts, dialogue box and controls; the outro battle and the
credits have their own variations too.

Status: **done 2026-10-01** (details in HANDOVER, "End of Act V: one look, one way to continue").
Decisions taken: Rye stays on the single "Keynote Showdown" title card only; the whispers stay, restyled as
small plain captions. Feldstrom's slides keep Arial, like the Keynote room's own slides.

## A. Fonts: one set, the game's own

1. Use the game's fonts everywhere: speaker names in JetBrains Mono (uppercase, spaced), spoken
   lines in Fraunces. Replace Source Sans and Arial in the duel.
2. Replace the western font (Rye) on the ~14 duel elements (round cards, captions, name tapes,
   "VS", K.O. and winner captions, countdown) with Fraunces bold.
   **DECIDE:** keep Rye on the single "Keynote Showdown" title card, or remove it everywhere?
3. Outro and Reviewer 2 battle: headings stay JetBrains Mono; running text becomes Fraunces.

## B. Dialogue and speech bubbles

4. Replace the duel's dark speech box with the game's own dialogue panel (translucent light
   panel, mustard top border, speaker label, line font, bottom position).
5. Remove Stellmacher's round portrait with a bubble. Her lines go into the normal panel,
   labelled "PROF. STELLMACHER".
6. Audience whispers ("n = ?", "Correlation, surely"): restyle as small plain captions, not bubbles.
   **DECIDE:** restyle, or remove entirely?
7. Joker lines go into the normal panel, under the joker's name.
8. "THAT'S my student!" appears once, in the panel.

## C. Continue and controls

9. Continue works one way everywhere: click, tap, Space or Enter. The hint is the game's
   standard one, the small uppercase "CLICK OR PRESS SPACE TO CONTINUE" at bottom centre. This
   covers the duel, the Keynote room, the replications, the Reviewer 2 battle (drop its italic
   "Click to continue."), The Journal and the credits.
10. Nothing advances on a timer. Exceptions: round cards, the gong and the K.O. flash (short
    animations under 3 s that block nothing).
11. The duel's "Continue" scorecard button uses the standard room choice-button style.

## D. Jokers (they work, but you can't see that they do)

12. Pressing a joker shows that person big for a moment, plus their line in the panel, plus one
    clearly visible effect:
    - Achterberg: a glowing outline around the flaw on the slide.
    - Skeptic: the beam visibly slows, with a "SLOWER" tag.
    - Sampling Officer: the "Your hand" meter jumps to steady.
    - Fieldwork Director: the applause meter swings your way, with a cheer.
    - Vossberg: the same, with his own line.
13. Jokers can only be pressed while aiming. Otherwise they are greyed, with a "during your turn"
    tooltip. Each can be used once; used ones stay grey.
14. A small "JOKERS" label above the icons.

## E. Remove

15. Drop the "Call your corner" button and its code.

## F. Credits

16. Make the teacher line a clickable link, "For teachers: lostcodebook.org/teach", in the gold
    accent with an underline, opening in a new tab.

## G. Check

17. Play the whole sequence, from `?room=postersession` to the end of the credits, in the test
    browser. Send screenshots of each screen type (duel, panel lines, joker in action, Reviewer 2,
    credits) before handing over for testing.
