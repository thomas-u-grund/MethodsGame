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

The Professor's Precisely Worded Question goes inside it: **"Do first-years who attend more Methods lectures get better exam results? (winter term 2025/26)"** — attendance is what Act II's survey measures, exam results are what later acts link it to. From here on the player isn't completing lessons — they're trying to turn one miserable grad-student idea into something the Professor will actually accept, and every department unit insists its particular contribution is mandatory before the project can proceed. The folder is inspectable at any time and visibly grows/changes stamp across the game:

| After | Stamp reads |
|---|---|
| The Corridor (Act I) | `STATUS: QUESTION EXISTS` |
| Survey Lab + Ethics Tribunal + The Mensa + Fieldwork Arena (Act II) | `STATUS: QUESTION HAS DATA` *(the Professor: "Where did these numbers come from?")* |
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
- **The Doorman** — (has a sprite since 2026-09-18: maroon porter's coat, bowler hat, walrus moustache, arms permanently crossed) guards the Corridor gate, hands over the Research Folder, is the first to use the word "chapters." Terse, transactional, utterly unbothered by the player's confusion. Refuses entry until the player has also convinced the Skeptic.
- **The Skeptic** — sits on the bench at Probability Pond, unmoved by the plaque's "n=2" claim. Won't vouch for the player until they demonstrate falsification (paint a swan black) *and* explain why that's sufficient — not just do the trick. Her approval is a hard prerequisite for the Corridor, not flavor. In the game she's a woman (voice: Moira), painted from behind on the pond's bench; a front-facing sprite (`sprite-skeptic.png`) exists for the Act I "Starring" poster.
- **KIRA** — a small, well-meaning, wildly overconfident robot assistant. Minding the Library because the actual librarian has vanished to "a workshop on information literacy," and by Act IV has escalated from "sorts citations" to "has already run and submitted your entire study without asking." Catchphrase: **"Certainly!"** — said with equal enthusiasm whether it's about to help or about to make things dramatically worse.
- **The Survey Lab Nurse** (and an unnamed Technician) — run the emergency department for injured questions with total clinical seriousness. The Nurse is fluent in triage but sincerely believes more response categories always means more precision; someone has to talk her Technician out of adding **"SLIGHTLY EXTREMELY AGREE"** to a scale.
- **The Ethics Tribunal** — three robed committee members seated twenty feet above the player: **the Chair of Consent** (peers down, rings a bell at the mere suggestion of talking to a student), **the Keeper of Data** (guards a transparent "anonymous" filing cabinet with a completely straight face), and **the Representative of Potential Discomfort** (visibly, permanently asleep). They treat human-subjects review like a Vatican conclave with a passport-control attitude problem.
- **The University Sampling Officer** — presides over the Mensa's official, ludicrously ceremonial random-sampling apparatus (a giant brass drum, velvet rope, spotlights, a sash reading UNIVERSITY SAMPLING OFFICER). Speaks like a royal herald, reveres the raffle drum ("a second-generation randomiser... good God"), and is constitutionally incapable of noticing that a perfectly random sample of the wrong population is still the wrong population.
- **The Fieldwork Director** — runs the Fieldwork Arena like a live game show, lives and dies by the illuminated RESPONSE RATE board, and considers a defensible 64% a greater achievement than a suspicious 100%.
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

**Act II interlude (built).** After the Doorman scene, the first return to the campus map plays a trailer-style interlude: the folder now holding the handwritten Question, then the Professor holding it like a dead fish ("A question is not evidence"), the H-27 avalanche out of the pneumatic tube, a four-room montage, a "Starring" cast poster, and a big **ACT II: Apparently We Need Data** title card. The opening trailer likewise ends on an **ACT I: The Question** card. This is now how the act is introduced; the Office opening-beat scene below is still not built as an in-room scene.

*Rooms: Survey Lab · The Ethics Tribunal · The Mensa · The Fieldwork Arena*

**Opening beat, back at the Office.** The player proudly presents the Professor with the folder stamped `QUESTION EXISTS`.

> **PROFESSOR:** "A question is not evidence."
> **PLAYER:** "So I need data."
> **PROFESSOR:** "Eventually."
> **PLAYER:** "Eventually?"
> **PROFESSOR:** "First you need permission to acquire data."

A pneumatic tube above his desk coughs violently and spits out a forty-seven-page form: **APPLICATION H-27: REQUEST TO APPROACH HUMAN BEINGS.**

> **PROFESSOR:** "Try not to alarm them."

H-27 is Act II's quest object — a separate, increasingly stamped/stapled/coffee-stained prop that gets folded into the Research Folder at the very end of the act. It has four boxes, one per room, and the four rooms can be tackled in almost any order:

- ☐ **INSTRUMENT EXISTS** (Survey Lab)
- ☐ **HUMANS MAY BE APPROACHED** (Ethics Tribunal)
- ☐ **SAMPLE DRAWN** (The Mensa)
- ☐ **RESPONSES ACQUIRED** (Fieldwork Arena)

**Design rule for the whole act:** no room contains its own solution. Every room hands the player a problem whose fix is sitting in a different room, usually for an absurd institutional reason. And every major puzzle has a plausible-but-methodologically-wrong solution the game actually lets the player attempt in full — that failure, not a warning label, is where the teaching happens. All four Act I rooms stay open and re-visitable the whole time; nothing the player needs later is ever permanently used up.

### Survey Lab — Emergency Department for Injured Questions

Not a classroom — an A&E ward. Questions arrive on wheeled hospital beds. A double-barrelled question has been physically taped together down the middle (*"How satisfied are you with your studies AND your accommodation?"*) while two nurses argue about which half is causing the problem. A leading question lies dramatically sideways because it physically cannot stand upright (*"Don't you agree that the university's excellent new policy has improved student life?"*). A vague question labeled **OFTEN** is surrounded by specialists staring at charts. In the corner, the skeleton: **"DAY 4,016: STILL OPERATIONALISING 'OFTEN'."**

The player repairs three questions physically — cuts the double-barrelled one apart, straightens the leading one, and (this is the one that reaches into another room) gives "often" an actual reference period. There's no calendar anywhere in the Lab, because *"temporal information compromises conceptual purity"* — the only calendar in the building is on the Ethics Tribunal's wall. Bring back one torn-off page (**THE LAST FOUR WEEKS**) and staple it to the question: *"During the last four weeks, how many scheduled lectures did you not attend?"* Once all three are stable, a machine labeled **FIT FOR HUMAN ADMINISTRATION** flashes and prints **SURVEY INSTRUMENT — MEDICALLY CLEARED**. The Nurse stamps the box, then adds: *"Obviously you can't give it to anyone."* / **"Why?"** / *"Ethics."*

**The wrong-but-playable solution:** the player can absolutely leave "often" undefined and carry the instrument straight to Fieldwork anyway — where every respondent answers the vague version differently and the room can't do anything useful with the results, sending the player back here to actually fix it.

**Act I item reused — the Likert Die.** A wounded attitude question (*"Do you agree with the new attendance policy?" YES/NO*) has, per the Nurse, "lost several degrees of opinion." The obvious move — rolling the die at the question — produces a single random answer (`STRONGLY AGREE`, then `DISAGREE` on a second roll) and the Nurse recoils: *"Please stop answering on behalf of the respondent."* The real fix is using the die as a **template**: tracing its six labeled faces onto a blank response card to build a proper ordered scale. A Technician then wants to "improve precision" by adding `SLIGHTLY EXTREMELY AGREE` — the player has to talk him down.

**Act I item reused — the Hourglass, later.** Once a question *sounds* fine but is actually an unreadable pile of jargon (see Fieldwork below), it comes back here on a stretcher and the Nurse asks for "evidence of cognitive distress" — cueing the hourglass pretest described under Fieldwork.

### The Ethics Tribunal

Total tonal whiplash on purpose: a gigantic gothic courtroom, three robed committee members seated twenty feet above the player behind an enormous bench, a stained-glass window depicting a stick figure ticking **I CONSENT**. A plaque reads **THE INSTITUTIONAL TRIBUNAL FOR THE APPROACHING OF PERSONS.**

> **CHAIR OF CONSENT:** "You intend to ask students... questions?"
> **PLAYER:** "Yes."
> *(all three recoil; a bell rings)*
> **KEEPER OF DATA:** "About themselves?"
> *(another bell)*

Three environmental fixes, not quiz answers:

1. **The consent form** is twelve pages of incomprehensible legal text — swap it for a plain-language one-pager sitting nearby (dismissed by the Tribunal at first as "insufficiently intimidating," approved once the player points out the participant can now actually explain it back).
2. **The withdrawal mechanism.** A device called the **IRREVERSIBLE PARTICIPATION DEVICE** has a seat belt and no exit. The player installs the missing **WITHDRAW** button.
3. **Contact vs. identifying data** (replaces an earlier draft of this puzzle that used the Act I ink bottle — see design note below). The Tribunal's showpiece is a magnificent *transparent* glass filing cabinet labeled **STRICTLY ANONYMOUS DATA**, every card inside plainly showing name, matriculation number, email, and favorite color. *"Nobody is permitted to look inside."* / **"It's glass."** / *"Correct."*

   The Tribunal keeps its own **Redaction Stamp** (a rubber stamp reading `REDACTED`, sitting on the bench, never leaves the room) and a locked **Key Ledger**. The naive move — stamping every name *and* every participant number on the returned questionnaires — gets full marks from the Tribunal (*"Excellent information governance"*) and is a real trap: back at Fieldwork, nobody can tell which empty seat belongs to which non-respondent anymore, so no reminder can ever be sent. The actual fix: use the **chewed pen** (Act I) to write a numeric ID on each questionnaire *before* it leaves, redact only the name with the stamp, and leave the name↔ID key in the Ledger at Ethics, never carried out into the field.

Each fix gets a ceremonial thumb lowered. Final stamp: **ETHICAL APPROVAL**, tiny print underneath: *subject to fourteen minor amendments.* The skeleton here is buried under amendment letters, sign reading **"MINOR AMENDMENT 14 OF 15."**

**Act I items tried and correctly rejected here**, as one-line gags rather than real puzzles: the `SIGNIFICANT (p<.05)` stamp (*"Wrong department"* — saved for the Statistics Basement in Act III) and the `FINAL_v23_REALFINAL_USETHIS` USB drive as "secure storage" (*"Is it encrypted?" / "It says FINAL." / "That was not my question."* — saved for later).

### The Mensa — The Grand Sampling Ceremony

Everyone here has developed extremely strong methodological opinions over lunch. One queue is entirely people carrying matching **I ♥ STANDARD ERRORS** tote bags (*"This queue is basically the university"*); a table labeled **QUALITATIVE PEOPLE** for no stated reason; a table for one, sign reading **n = 1 / BUT VERY INTERESTING** — with, per house style, a skeleton sitting across from them, sign: **"ALSO VERY LONELY."**

The centerpiece: a colossal brass raffle drum behind a velvet rope under spotlights, tended by the Sampling Officer in his ceremonial sash. Before he'll spin anything, he needs **the sampling frame** — and points, with total sincerity, at an enormous empty gilded picture frame on a pedestal.

> **SAMPLING OFFICER:** "The frame."

**The wrong-but-playable solution:** aim the empty frame at the lunch queue. Everyone in it dutifully poses inside it; the Officer is delighted (*"A population!"*) and spins the drum for a perfectly random sample of twelve tote-bag-carrying, curry-eating people. Take that "sample" to the Survey Lab and the statistician deflates it in one line: *"Remarkably representative of people currently standing in that queue."* Random selection from the wrong frame is still the wrong frame.

The real sampling frame — the actual, complete student list — is held at the Ethics Tribunal and won't be released until the Tribunal's own box is checked (identifying data has to be stripped first). What comes back is the **PSEUDONYMISED SAMPLING FRAME**: the same gilded frame, now full of numbered cards instead of names.

**Act I item reused — Magnifying Glass.** Even the "official" list looks suspicious under it: microscopic print at the bottom reads *"Includes only students registered for the university newsletter."* The Officer is unmoved (*"But it's a very large list." / "Still not the same thing." / "It has four thousand names." / "Still not the same thing." / "Alphabetised."*) — undercoverage, made physical.

**Act I item reused — the Raffle Drum.** The Act I desk prop turns out to be the **MODEL SR-2 PORTABLE RANDOMISATION APPARATUS**, recognized instantly and reverently by the Officer ("Good God — a second-generation randomiser"). It's the correct tool throughout; only the *population fed into it* is ever wrong.

**Act I item reused — the Mug.** The drum has no official receptacle for the drawn numbers (someone lost it). `Use` the `WORLD'S OKAYEST SAMPLE SIZE` mug on the sampling machine; numbered balls land in it; the Officer reads the label, long pause: *"Adequate."*

Once the pseudonymised frame goes into the drum: trumpets, confetti, a small flag reading **A SAMPLE HAS OCCURRED**. Box stamped. Player: *"So I have data?"* Officer: *"Good heavens, no."*

### The Fieldwork Arena

A game-show set. A huge illuminated **RESPONSE RATE** board starts at 100% and craters in real time as summoned participants bail through doors labeled **TOO BUSY**, **FORGOT**, **EMAIL WENT TO SPAM**, and **I DON'T DO SURVEYS**, while a headset-wearing Fieldwork Director screams things like *"WE'RE LOSING THE COMMUTERS!"* The skeleton sits next to a phone: **"FOLLOW-UP EMAIL #11 · STILL HOPEFUL."**

**First exposure — wording.** Administer the *unrepaired* instrument here and a numbered seat just sits there, silently reading, for far too long. The **hourglass** (Act I) turns over, empties, turns over again — twenty-one seconds and counting — before the Director blows a whistle and the question gets stretchered back to the Survey Lab. This is a cognitive-pretest failure, discovered by watching a respondent struggle rather than being told the question is bad.

**Second exposure — social desirability.** With "often" fixed but the question still asked openly, every single respondent claims zero missed lectures — even the one who's visibly been asleep in the Mensa since Tuesday. `LECTURE ATTENDANCE: 100%`. Nothing changes until the response method itself changes: bring the **redacted, ID-tagged questionnaires and the Tribunal's now-covered response box** here — wrapped, at the Keeper of Data's genuine approval, in an ordinary brown Mensa lunch bag, since the box itself is transparent and "nobody is permitted to look inside" was apparently a purely legal statement. Anonymous, private answers change the distribution immediately. Director: *"Oh."* Player: *"What?"* *"Apparently people miss lectures."*

**Third exposure — nonresponse, the real final boss of the act.** Twelve numbered seats light up for the drawn sample. Several stay empty; one has an out-of-office autoresponder (**"I AM CURRENTLY OUT OF OFFICE UNTIL FURTHER NOTICE"**). The response-rate board falls: 100 → 83 → 67. A large button reads **REPLACE MISSING RESPONDENTS WITH NEAREST AVAILABLE PERSON.**

**The wrong-but-playable solution:** press it. Mensa diners flood the empty seats; the board snaps back to 100% with confetti — and the Sampling Officer bursts in, apoplectic: *"THOSE PEOPLE WERE NOT DRAWN."* Convenience substitution isn't a repaired sample, it's a different, undocumented one.

The real fix needs three things fetched from elsewhere, each tied to something the player already did wrong once: a **reminder** (found stapled to the Survey Lab's skeleton — "FINAL REMINDER" / "FINAL FINAL REMINDER" / "ACTUAL FINAL REMINDER"), an **alternative response mode** (paper questionnaires from the Ethics Tribunal, for the one drawn participant who refuses the online form), and a **small incentive voucher** from the Mensa — which the Mensa won't hand over until the player surrenders the earlier, useless tote-bag sample from the sampling-frame puzzle. An Act-II mistake becomes an Act-II resource. Response rate climbs 58 → 67 → 75 and then genuinely stops.

> **PLAYER:** "Only seventy-five per cent?"
> **FIELDWORK DIRECTOR:** "Only? We haven't seen numbers like this since 2003."

A **RECORD HIGH** banner drops, a dot-matrix printer buries the floor in paper, and a tiny USB drive pops out labeled **DATA**. Box stamped: **RESPONSES ACQUIRED.**

**Act I item reused — the Rubber Duck**, played strictly as a one-line gag, no puzzle attached: try it as a mock respondent and get *"No answer."* / *(you wait)* / *"Still no answer."* / **"Nonresponse."** / *"Technically."*

**Design note — items deliberately not reused here.** An earlier draft of this act reused the Act I **bingo card** as a physical nonresponse tracker (draw a line of five respondents, celebrate a "BINGO," then realize the completed line is entirely on-campus sociology students and nobody's actually representative) and the **black ink bottle** for the over-redaction gag now handled by the Tribunal's own Redaction Stamp. Both were cut on request to keep Act II's own object set distinct from Act I's swan puzzle — the numbered-seat board already carries the "which specific people didn't answer, and what do they have in common" beat without needing a second physical tracker, and the Redaction Stamp/Key Ledger pairing teaches the same pseudonymization lesson as the ink did, natively at the Tribunal instead of imported from the Pond.

**H-27, complete.** All four boxes checked, the form is nearly invisible under stamps, staples, a Mensa coffee ring, and an ethics amendment stapled on sideways. Back at the Office, the player hands over the dataset.

**Folder update:** stamped `QUESTION HAS DATA` — which the Professor immediately undercuts:

> **PROFESSOR:** "Where did these numbers come from?"
> **PLAYER:** "You cannot possibly be serious."
> **PROFESSOR:** "Page seventeen, observation forty-three. Vegetarian. Stress score: nine." *(looks up)* "Why?"

(setting up Act III).

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

1. **Act II is built and playable end-to-end** (see `HANDOVER.md` §01i for exactly how each chain was implemented and where it simplified the design above — e.g. the pen writes WITHDRAW on the Device instead of a separate button item, and the Act II ending is narrated in the Fieldwork Arena rather than as a scene back at the Office). Character sprites for the Nurse, the three judges, the Sampling Officer and the Fieldwork Director are in (the Mensa cook stays off-screen). Still missing for Act II: voiced audio, and the Office return scene ("Where did these numbers come from?") that hands over to Act III.
2. **Acts III–V still have no narrative text changes** — they still run their original, plot-free framing. Everything in those sections is new copy to be written into those rooms' dialogue.
3. **No ending scene exists in code at all.** Completing Act V currently just says "decommissioned (for now)" and returns to the map — the entire Office-return epilogue above needs to be built from scratch.
4. **Acts II–V are still flat procedural SVG rooms** with the older UI pattern, versus Act I's painted, verb-grid rooms (`HANDOVER.md` §03). Act II now has real plot beats and a lot of specific physical props (the gilded sampling frame, the transparent anonymous filing cabinet, the RESPONSE RATE board, the taped-together questions) that need the same painted-art/verb-grid treatment Act I got to actually land.
5. **Trailer panel 1 needs new art** — the shipped `trailer-panel1-rejection.png` still shows the old rejected-letter concept; regenerate from the revised prompt in `art/trailer/ART_PROMPTS.md` (an empty research folder + a circled deadline) before swapping in the new narration text.
6. **Trailer panel 2b ("The Spiral")** needs art — prompt is ready in `art/trailer/ART_PROMPTS.md`, not yet generated.

Given 1 alone is "build four room-narratives, two of them brand new, with four interlocking cross-room puzzle chains," this is a real scope decision on its own — worth agreeing on room build order (the doc above suggests Survey Lab first) before diving in. See `ROADMAP.md` for the logged, not-yet-built entry.

**Already shipped, done:** Act I's two-stage reveal (Doorman exchange + Research Folder item), the full 5-panel trailer, the boot splash/logo/title sequence. See `HANDOVER.md` §01b for exact details.
