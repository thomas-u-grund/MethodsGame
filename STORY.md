# The Secret of the Lost Codebook — Story

*Narrative reference — drafted 2026-09-17, rewritten 2026-09-17 around a single-quest structural fix. This is the story bible: premise, cast, and beat-by-beat plot. For implementation details (files, code, art pipeline), see `HANDOVER.md`; for the chronological build log, see `ROADMAP.md`.*

> **⚠ Design status: Act I is built, Acts II–V and the ending are not.** The Corridor's two-stage reveal, the Doorman exchange, and the Research Folder item are all live and tested (see `HANDOVER.md` §01b). Acts II–V still run their original plot-free framing, and no ending scene exists in code yet — see "What's still not built" at the end of this doc.

---

## Logline

A grad student, panicking over an empty research folder and a deadline that isn't moving, sets out to get one real question out of the one professor with a reputation for producing them — and ends up spending the rest of the semester turning that question into an entire research project, one increasingly absurd department "chapter" at a time, before discovering that the mythical Codebook everyone's been whispering about was never anything more than... Methods.

## The structural problem this fixes

Act I is a real adventure game: a rumor, a difficult professor, a seven-second patience mechanic, absurd desk objects, a professor who physically moves between rooms, a trick the player has to discover for themselves, a guarded forbidden door, death-by-wrong-answer, skeletons, a big visual reveal. Acts II–V, as originally scoped, were just educational minigames wearing the same UI: "learn sampling here," "sort citations here," "find the merge bug here," "avoid overclaiming here" — no plot, no stakes, no reason the player should care what happens after Act I.

Worse, the title mystery was being fully resolved at the end of Act I (the archway reveal used to spell out "the Codebook was never a single volume, it's the whole department" right there) — which means the player finishes "The Secret of the Lost Codebook" one act into a five-act game, then plays four more acts with no mystery left.

The fix is one quest object that runs the whole game, and a two-stage reveal instead of one.

## The Research Folder

The moment the player clears the Corridor, the Doorman hands over a battered manila folder stamped:

```
PROVISIONAL RESEARCH PROJECT
STATUS: QUESTION EXISTS
```

The Professor's Precisely Worded Question goes inside it. From here on the player isn't completing lessons — they're trying to turn one miserable grad-student idea into something the Professor will actually accept, and every department unit insists its particular contribution is mandatory before the project can proceed. The folder is inspectable at any time and visibly grows/changes stamp across the game:

| After | Stamp reads |
|---|---|
| The Corridor (Act I) | `STATUS: QUESTION EXISTS` |
| The Mensa + Survey Lab (Act II) | `STATUS: QUESTION HAS DATA` *(the Professor: "Where did these numbers come from?")* |
| The Library + Statistics Basement (Act III) | `STATUS: EVIDENCE VERIFIED` |
| The Delegation Engine (Act IV) | `STATUS: RESULT AUDITED` |
| The Hypotheses Accelerator (Act V) | `STATUS: CLAIM DEFENSIBLE` |
| The Office, final return | stamped `REVISE AND RESUBMIT` by the Professor himself |

This also gives every act a shared visual gag opportunity: whatever absurd institution the player is dealing with always wants to stamp, staple, annotate, or otherwise physically deface the folder before letting them move on.

## The two-stage reveal

**Stage one (end of Act I):** the archway does *not* explain the joke. The player looks around the ordinary university interior beyond the doors and asks the obvious question.

> **PLAYER:** "Where's the Codebook?"
> **DOORMAN:** "Not here."
> **PLAYER:** "You said it was behind the door."
> **DOORMAN:** "No. I said this was the door."
> *(beat)*
> **DOORMAN:** "You've completed Chapter One."

The player still believes there is something called the Codebook — it just apparently has chapters, scattered through the department, and the folder is how they're collected. The mystery survives Act I intact; it's *redirected*, not solved.

**Stage two (the real ending, after Act V):** the player returns to the Seven-Second Office — same room, same Professor, same skeleton — and puts the finished folder on his desk.

> *The seven-second hourglass turns over. He reads. For once, he doesn't immediately object.*
> **PROFESSOR:** "Hm."
> **PLAYER:** "So... that's it?"
> **PROFESSOR:** "That's what?"
> **PLAYER:** "The Codebook."
> *(he looks genuinely confused)*
> **PROFESSOR:** "The what?"

The player explains — the Corridor, the Doorman, the chapters, the rumors that started it all.

> **PROFESSOR:** "Oh. That." *(pause)* "We used to call it Methods."

He stamps the folder. **REVISE AND RESUBMIT.**

> **PLAYER:** "Wait. That's... good?"
> **PROFESSOR:** "For a first submission? That's a triumph. Most of these die in desk-reject."

The game says the quiet part out loud here on purpose — R&R is a real, genuinely positive outcome in academic publishing (survived review without being rejected outright), and the joke only works if every player gets to feel that relief, not just the ones who already know the convention. The armchair skeleton slowly turns its skull toward the player; its "SUBMITTED 2016 · STILL WAITING" sign falls over, revealing another sign behind it: **"WELCOME TO ACADEMIA."**

A last title card before credits, played as a straight-faced gag, not a real commitment: *"THE SECRET OF THE LOST CODEBOOK, PART TWO: THE REVISIONS — coming whenever the reviewers get back to us."*

This is the whole game's shape: a mythologized secret that turns out to be the mundane, everyday name for the thing the player just spent five acts learning to do. Every act needs to earn that ending by being funny and specific on its own terms — see below.

---

## Setting & tone

A gothic, autumnal university campus (unnamed) — statues of seated philosophers, ivy on stone, a sociology department that's clearly run the same seven-second office hours for decades. Visual tone: warm, painted, comic-linework illustration (see `HANDOVER.md` §02 for the art style guide). Narrative tone: **every act should be its own absurd institution with rules the player has to figure out and exploit, the way Act I already does** — not a quiz with jokes pasted on top. Skeletons with hand-lettered signs are the house visual gag for research despair; keep adding one per room, each specific to that room's failure mode.

## Cast

- **The Player** — unnamed, mostly unseen (back-of-head or silhouette in the trailer, never shown in-game).
- **The Professor** — hates vague claims. Runs the Office/Lecture Theatre gauntlet, bookends the entire game (first and last conversation), and delivers the real reveal at the very end. A single shared entity who physically moves between the Office and the Lecture Theatre (see `HANDOVER.md` §02). Also runs the optional citation-counter sidequest.
- **The Doorman** — guards the Corridor gate, hands over the Research Folder, is the first to use the word "chapters." Terse, transactional, utterly unbothered by the player's confusion. Refuses entry until the player has also convinced the Skeptic.
- **The Skeptic** — sits on the bench at Probability Pond, unmoved by the plaque's "n=2" claim. Won't vouch for the player until they demonstrate falsification (paint a swan black) *and* explain why that's sufficient — not just do the trick. His approval is a hard prerequisite for the Corridor, not flavor. No dedicated art yet; he's voice-only, implied to be the figure on the pond's existing bench.
- **KIRA** — a small, well-meaning, wildly overconfident robot assistant. Minding the Library because the actual librarian has vanished to "a workshop on information literacy," and by Act IV has escalated from "sorts citations" to "has already run and submitted your entire study without asking." Catchphrase: **"Certainly!"** — said with equal enthusiasm whether it's about to help or about to make things dramatically worse.
- **Prof. Feldstrom** — the Professor's structural opposite: hates claims that are too *small*. Runs the Hypotheses Accelerator in Act V. Not narratively connected to the first Professor — the contrast (one hates overreach, one hates timidity) is the joke, not a twist waiting to be revealed.
- **The skeletons** — one per room, each a different flavor of research despair. Confirmed/new instances below, per act.
- **The Research Folder** — not a character, but close to one by the end: the single physical object every act stamps, and the thing whose final state is the whole game's punchline.

---

## The opening trailer

Monkey-Island-style narrated panels, played in full every time the game loads (Escape skips ahead). See `art/trailer/ART_PROMPTS.md` for generation prompts.

1. **The Deadline** *(revised — see below)* — the same empty manila research folder the player will spend the whole game filling, sitting blank on a cluttered desk beside a wall calendar with a due date circled in red. *"Every research project starts the same way: a deadline, an empty folder, and nothing else."*
2. **The Protagonist** — the player from behind, dorm desk, a corkboard of increasingly unhinged red-string connections. *"This is you, on your fourth topic change this semester. Your advisor's patience is now measured in single digits."*
2b. **The Spiral** — the panic actually peaking: standing, hands in hair, corkboard doubled, a second energy drink tipped over. *"By week nine the topic has changed eleven times, the corkboard needs its own corkboard, and sleep has become a rumor of its own."*
3. **The Rumor** — two students whispering in a dusk courtyard. *"Word travels, in hushed tones, of a professor who can turn any bad idea into a real one. If you can survive seven seconds of his patience."*
4. **The Legend** — a locked, older door; two students walking away from it, defeated. *"They say he keeps a Codebook. No one's seen it. Everyone's heard of it. Most who go looking end up reassigned to committee work."*
5. **Arrival** — a hand knocking on the Professor's office door, plaque reading "PROF. — BY APPOINTMENT (GOOD LUCK)." *"This is where it starts. Again."*

**Why panel 1 changed:** the original version opened on an already-rejected paper stamped "REVISE AND RESUBMIT" — which set up a confusing echo, since the *ending* also stamps the finished folder "REVISE AND RESUBMIT," and reusing the same stamp risks reading as "you failed" rather than "you won." The fix: the game was never about a paper that already failed, it's about panicking over a paper that doesn't exist yet. Opening on the same empty folder the Doorman later fills is a cleaner visual bookend than reusing a stamp, and it means R&R only ever appears once — at the end, where it can land clean.

**The ending's stamp is the achievement, not a callback.** R&R (revise and resubmit) is genuinely good news in academic publishing — it means the work survived without being desk-rejected. The game should say so explicitly rather than assume players know the norm (e.g. the Player asks "Wait, that's... good?" and the Professor confirms it plainly), so the win reads as a win for every player, not just ones who already know academic publishing conventions.

**Sequel tag (credits gag, not a commitment):** after "WELCOME TO ACADEMIA," a small closing title card — *"THE SECRET OF THE LOST CODEBOOK, PART TWO: THE REVISIONS — coming whenever the reviewers get back to us."*

**Status:** panels 1, 2, 3, 4, 5 are generated and wired into the game's boot sequence, verified in order end-to-end — **but panel 1's art still shows the old rejected-letter concept and needs regenerating** to match the revised prompt in `art/trailer/ART_PROMPTS.md` before the narration text above is wired in (keep the old image + old narration paired until then, so nothing on screen mismatches). Panel 2b ("The Spiral") is a new addition, not yet generated.

---

## Act I — The Question and the Corridor

*Rooms: The Seven-Second Office · Introduction to Systems Theory (Lecture Theatre) · Causality Corridor*

Unchanged from before, and it's the model every later act should match: a dialogue gauntlet with a hard patience limit, six absurd desk-clutter pickups (a chewed pen, a mug reading "WORLD'S OKAYEST SAMPLE SIZE," a Likert-scale die, an hourglass tagged "7 SEC," a USB drive labeled "FINAL_v23_REALFINAL_USETHIS," a rubber stamp reading "SIGNIFICANT (p<.05)"), a professor who's either at the Office or the Lecture Theatre and never both, an undocumented bingo-card trick the player has to discover, and a guarded door with real stakes (pass all four causal-reasoning cases or fall). The optional citation-counter sidequest lives here too (see `HANDOVER.md` §01b). Entry to the Corridor now requires **both** the Question *and* having convinced the Skeptic at Probability Pond (see below) — the Doorman checks for both.

**Ending, revised — live and tested.** Clearing all four Corridor cases still makes the doors align into an archway — but the payoff is the Doorman exchange above ("Not here." / "This was the door." / "You've completed Chapter One."), and instead of consuming the Question, the Doorman hands over the Research Folder with the Question already inside it, stamped `QUESTION EXISTS`.

### Probability Pond — required before the Corridor

A fourth Act I location, always open like the other three — already teased as a background sign on the campus map ("Probability Pond · Still 50/50"). Two white swans sit on a pond beside a plaque declaring, with total institutional confidence: **"ALL SWANS ARE WHITE — established fact (n=2)."** This is Popper's classic falsifiability example, played straight as a puzzle: the universal claim only survives until someone finds a counterexample.

**Not a side quest — a gate.** The Skeptic (see Cast) sits on the pond's bench, unimpressed by the plaque, and won't vouch for the player until they demonstrate the concept, not just state it. This vouching is what the Doorman actually wants: turning up at the Corridor with the Question but without having convinced the Skeptic gets turned away — *"You don't know what to do with a wrong answer yet — there's a man by the pond who does. Convince him first."* This ties the pond directly into the critical path instead of leaving it optional.

**The chain:** `Talk To` the Skeptic first — he issues the challenge ("show me one counterexample"). A bottle of black ink is picked up in the Lecture Theatre (near the blackboard — the one physical link between this room and the rest of Act I). Carried to the pond and used on the correct swan, it turns black; the plaque gets stamped "FALSIFIED." `Talk To` the Skeptic again to explicitly walk him through *why* one counterexample is enough — that's the "explain it" half, distinct from "demonstrate it." He's won over, sets the flag the Corridor gate checks for.

**Why it fits:** it's a lighter, faster echo of the exact lesson the Corridor teaches at length (don't universalize from a small, non-representative sample) — but taught by convincing a skeptical person instead of solving a quiz, which makes it a genuine prerequisite rather than trivia.

**Status: fully built, wired in, and verified end-to-end** — including the hard gate at the Corridor's bell (`handleRing()` now checks `philosopherConvinced` before letting the Question through at all). Full implementation notes in `HANDOVER.md` §01c.

## Act II — "Apparently We Need Data"

*Rooms: The Mensa · Survey Lab*

The Professor's handoff line for this act: **"A question is not evidence."**

**The Mensa:** everyone has an opinion and everyone insists their lunch queue is representative of the entire university — one queue could be populated entirely by people wearing matching **"I ♥ STANDARD ERRORS"** tote bags and they'd still swear blind they're a random sample. The raffle drum isn't just a prop, it's the department's actual, ludicrous, official sampling apparatus — treated with total bureaucratic seriousness by everyone except the player, who's the only one who seems to notice how strange that is.

**Survey Lab**, reframed as **a hospital for injured questions**: double-barrelled questions arrive physically taped together at the middle; leading questions lean visibly to one side like they've been shoved; one skeleton has spent eleven years trying to operationalize the word "often" and has a chart on the wall to prove it. The player is triage, not a grader.

**Folder update:** stamped `QUESTION HAS DATA` — which the Professor immediately undercuts: *"Where did these numbers come from?"* (setting up Act III).

## Act III — "Apparently Evidence Must Exist"

*Rooms: The Library · Statistics Basement*

This is where KIRA properly enters the plot, not just the puzzle. The actual librarian has vanished to "a workshop on information literacy," leaving KIRA nominally in charge. KIRA has proudly filled an entire trolley labeled **READY TO CITE** — some references are real, some are almost real, some describe journals that don't exist, and one paper's DOI leads to a recipe for soup. KIRA sees no problem with any of this, because all six references are formatted perfectly, and formatting is the only thing KIRA checked.

**Statistics Basement**, reframed as **a casino**: every p<.05 result sets off a brass bell, a flashing green lamp, and a little mechanical banner reading **DISCOVERY!** Twenty switches, all wired to nothing, turned into a slot machine the room itself is actively trying to get the player to play badly. A skeleton down here clutches one lit bulb, sign reading **"p = .049. I KNEW I WAS RIGHT."**

**Folder update:** stamped `EVIDENCE VERIFIED`.

## Act IV — "KIRA Has Already Submitted It"

*Room: The Delegation Engine*

Reframed from an auditing exercise into a narrative emergency. The player arrives and KIRA cheerfully announces: **"Good news. I finished your study while you were gone."** It has merged the data, cleaned it, analyzed it, produced figures, written an abstract, and possibly already scheduled the social-media announcement. A gigantic **SUBMIT MANUSCRIPT** lever is slowly, visibly lowering. The bogus vegetarian/stress finding isn't just wrong anymore — the player's name is already on it. Every time the player says "just rerun it," KIRA chirps **"Certainly!"** and produces another wrong result, faster. The player has to actually read KIRA's merge log, spot-check a real record against something they personally observed at the Mensa, and tell KIRA the precise fix — not "try again," an exact instruction — before the lever reaches the floor.

**Folder update:** stamped `RESULT AUDITED`.

## Act V — "The Hypotheses Accelerator"

*Room: The Hypotheses Accelerator*

Prof. Feldstrom, magnificently insane, greets the player's careful, correctly-audited null result with something like: **"Null? That's just significance that hasn't believed in itself yet."** His machine literally turns cautious claims into bigger ones: a result about students becomes "young adults," then "humans," then "civilization," then possibly **THE FUNDAMENTAL LAW OF HISTORY**. A large **IMPACT** gauge climbs from *Modest Contribution* through *Paradigm Shift* to *Nobel Adjacent* and finally **PRESS OFFICE HAS BEEN ALERTED**. The puzzle is resisting the machine, not optimizing it — the opposite verb from every other act.

**Folder update:** stamped `CLAIM DEFENSIBLE` — the last stamp before the Office.

## The Ending

The player returns to the Seven-Second Office with the finished folder. See "The two-stage reveal" above for the full scene. Ends on the skeleton's sign flip (`SUBMITTED 2016 · STILL WAITING` → `WELCOME TO ACADEMIA`), the "Part Two: The Revisions" title-card gag, and credits.

---

## Recurring motifs

- **The Research Folder** — the one object every act touches, stamps, or defaces; the visible measure of progress and the final punchline.
- **Skeletons with deadpan signs**, one per room, each specific to that room's failure mode (the 11-years-operationalizing-"often" skeleton, the "p = .049" skeleton, the original armchair skeleton whose sign finally flips at the very end).
- **KIRA's "Certainly!"** — enthusiastic agreement that should worry the player every time.
- **The Professor and Feldstrom as opposite poles** — one punishes overreach, one punishes timidity — never in the same room, and that's the joke.
- **The empty folder in the trailer's first panel is the same folder the Doorman hands over in Act I** — a visual bookend that doesn't depend on remembering a specific stamp.
- **"REVISE AND RESUBMIT"** appears exactly once, at the very end — the joke lands because the game explicitly tells the player it's good news, not because it's contrasted with an earlier appearance of the same words.

## What's still not built

1. **Acts II–V have no narrative text changes yet** — they still run their original, plot-free framing (see `ROADMAP.md` for their current, purely-mechanical descriptions). Everything in the Act II–V sections above is new copy to be written into those rooms' dialogue, plus the Research Folder needs to become an actual inspectable, evolving item/UI element (not just narration) that those acts update — new engineering, not just new copy.
2. **No ending scene exists in code at all.** Completing Act V currently just says "decommissioned (for now)" and returns to the map — the entire Office-return epilogue above needs to be built from scratch.
3. **Acts II–V are still flat procedural SVG rooms** with the older UI pattern, versus Act I's painted, verb-grid rooms (`HANDOVER.md` §03). Now that they have real plot beats, this visual gap matters more than it did — they need the same painted-art/verb-grid treatment to sell the new dialogue and props (tote bags, the taped-together questions, the casino bell, the SUBMIT MANUSCRIPT lever, Feldstrom's IMPACT gauge).
4. **Trailer panel 1 needs new art** — the shipped `trailer-panel1-rejection.png` still shows the old rejected-letter concept; regenerate from the revised prompt in `art/trailer/ART_PROMPTS.md` (an empty research folder + a circled deadline) before swapping in the new narration text.
5. **Trailer panel 2b ("The Spiral")** needs art — prompt is ready in `art/trailer/ART_PROMPTS.md`, not yet generated.

Given 1 and 2 alone are essentially "write and build four more room-narratives plus an ending," this is a real scope decision, not a small follow-up — worth agreeing on sequencing (one act at a time, ending last or first) before diving in.

**Already shipped, done:** Act I's two-stage reveal (Doorman exchange + Research Folder item), the full 5-panel trailer, the boot splash/logo/title sequence. See `HANDOVER.md` §01b for exact details.
