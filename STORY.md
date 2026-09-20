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
| Library + Hall of Founders + Workshop + Seminar Room (Act II) | `STATUS: THEORY EXISTS` *(the sealed Prediction Slip)* |
| Survey Lab + Ethics Tribunal + The Mensa + Fieldwork Arena (Act III) | `STATUS: QUESTION HAS DATA` *(the Professor: "Where did these numbers come from?")* |
| Statistics Basement + Delegation Engine (Act IV) | `STATUS: EVIDENCE VERIFIED` |
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

*One-line roles here; every named character's formative academic disaster is in **Character backstories** below.*

- **The Player** — unnamed, mostly unseen (back-of-head or silhouette in the trailer, never shown in-game).
- **The Professor** — hates vague claims. Runs the Office/Lecture Theatre gauntlet, bookends the entire game (first and last conversation), and delivers the real reveal at the very end. Was once a sweeping theorist himself and got publicly destroyed for it, which is where the precision comes from. A single shared entity who physically moves between the Office and the Lecture Theatre (see `HANDOVER.md` §02). Also runs the optional citation-counter sidequest.
- **The Doorman** — (has a sprite since 2026-09-18: maroon porter's coat, bowler hat, walrus moustache, arms permanently crossed) guards the Corridor gate, hands over the Research Folder, is the first to use the word "chapters." Terse, transactional, utterly unbothered by the player's confusion. Refuses entry until the player has also convinced the Skeptic. There is one clue, never explained, that he was a student here who went looking for the Codebook himself and never left.
- **The Skeptic** — sits on the bench at Probability Pond, unmoved by the plaque's "n=2" claim. Won't vouch for the player until they demonstrate falsification (paint a swan black) *and* explain why that's sufficient — not just do the trick. Her approval is a hard prerequisite for the Corridor, not flavor. In the game she's a woman (voice: Moira), painted from behind on the pond's bench; a front-facing sprite (`sprite-skeptic.png`) exists for the Act I "Starring" poster. Not a cynic — the healthiest academic in the game, and the one who actually enjoys being wrong.
- **KIRA** — a small, well-meaning, wildly overconfident robot assistant. Debuts in **Act II** minding the Library because the actual librarian has vanished to "a workshop on information literacy," and by Act IV has escalated from "sorts citations" to "has already run and submitted your entire study without asking." Catchphrase: **"Certainly!"** — said with equal enthusiasm whether it's about to help or about to make things dramatically worse. Trained on the department's most *successful* papers and nothing that failed, which is the single fact that explains everything she does.
- **The Survey Lab Nurse** (and an unnamed Technician) — run the emergency department for injured questions with total clinical seriousness. The Nurse is fluent in triage, is a twelve-year veteran of one enormous national survey, and sincerely believes more response categories always means more precision; someone has pencilled **"SLIGHTLY EXTREMELY AGREE"** into the margin of a scale, and the player has to rub it out.
- **The Ethics Tribunal** — three robed committee members seated twenty feet above the player: **the Chair of Consent** (peers down, rings a bell at the mere suggestion of talking to a student), **the Keeper of Data** (guards a transparent "anonymous" filing cabinet with a completely straight face), and **the Representative of Potential Discomfort** (visibly, permanently asleep). They treat human-subjects review like a Vatican conclave with a passport-control attitude problem. Each of the three is overcorrecting for one specific incident in their own past.
- **The University Sampling Officer** — presides over the Mensa's official, ludicrously ceremonial random-sampling apparatus (a giant brass drum, velvet rope, spotlights, a sash reading UNIVERSITY SAMPLING OFFICER). Third-generation Sampling Officer — his father and grandfather held the post and the drum is a family heirloom. Speaks like a royal herald, reveres the raffle drum ("a second-generation randomiser... good God"), and is constitutionally incapable of noticing that a perfectly random sample of the wrong population is still the wrong population.
- **The Fieldwork Director** — runs the Fieldwork Arena like a live game show, lives and dies by the illuminated RESPONSE RATE board, and considers a defensible 64% a greater achievement than a suspicious 100% — because the 100% on their own CV turned out to be fraudulent.
- **Prof. Dr. Magnus Feldstrom** — a traffic-flow physicist who crossed into the social sciences and never changed his toolkit; the Professor's structural opposite, hates claims that are too *small*. Still waiting for a phone call from Stockholm. **Appears twice**: in **Act II** he helps the player turn a mechanism into a theory and immediately inflates it to civilisation scale (his workshop is the prototype of the machine), and in **Act V** he does the same thing to the finished result in the full Hypotheses Accelerator. Genuinely helpful, genuinely unmoored; the contrast with the first Professor (one hates overreach, one hates timidity) is the joke, not a twist.
- **The Visiting Fellow** (Act II, Seminar Room) — believes, serenely, that the answer is always selection, because selection destroyed her own dissertation. Never hostile, always asking how you would tell a real effect apart from the students simply being different. The Skeptic's academic cousin, and right often enough to be irritating.
- **The Founders** (Act II, Hall of Founders) — busts and portraits who nod approvingly at everything, including contradictions and blank cards. Non-speaking, but the room's main antagonist.
- **The skeletons** — one per room, each a different flavor of research despair. Confirmed/new instances below, per act.
- **The Research Folder** — not a character, but close to one by the end: the single physical object every act stamps, and the thing whose final state is the whole game's punchline.

---

## Character backstories

**The design rule:** every character has had exactly *one* formative academic experience, and has since turned the lesson from it into a universal rule. That is what makes them people rather than embodiments of textbook concepts — and it means their methodological position is psychologically motivated, not arbitrary. Feldstrom is the template: he isn't "the man who overgeneralises," he's a physicist who once successfully explained twelve thousand cars with three equations and has been trying to do it to humanity ever since.

None of these histories should be delivered as exposition. They come out in one-line answers to `Talk To`, in objects lying around rooms, and in things other characters refuse to discuss.

### Prof. Dr. Magnus Feldstrom — the physicist who never emotionally left physics

Trained as a physicist. Doctorate on traffic-flow dynamics — shockwaves in motorway congestion, phase transitions between free flow and jam. *Phase Transitions in Multilane Traffic Flow* (1998), 742 pages. At some point he noticed that traffic consists of people, concluded that this qualified him to explain society, and crossed into the social sciences without changing a single tool in his conceptual toolkit.

His actual conviction, which he will state if asked directly:

> *"If twelve thousand cars can be described by three equations, I see no reason society should require more."*

> **PLAYER:** "So you trained as a physicist?"
> **FELDSTROM:** "Originally."
> **PLAYER:** "What made you become a social scientist?"
> **FELDSTROM:** "Boundary conditions."
> **PLAYER:** "What?"
> **FELDSTROM:** "The cars kept containing people."

**Traffic language infects everything he says.** Students are *units* when he is distracted. A lecture is an *input channel*. Non-attenders are *leakage*. A crowded seminar is *high-density flow*. Changing degree programme is a *lane transition*. Dropping out is *network exit*. Mention motivation and he says *"latent acceleration"*; mention selection and he says *"initial velocity"*; mention confounding and he says *"unmodelled road conditions."*

The **Visiting Fellow** despises him for this. She has written on his workshop door in chalk:

```
PEOPLE ARE NOT PARTICLES
```

Underneath, in Feldstrom's hand:

```
UNTESTED ASSUMPTION
```

It stays there for the whole game.

**The Nobel obsession has a backstory now.** He knows perfectly well there is no Nobel Prize in Sociology. This does not discourage him: he has convinced himself his work is so fundamental that the Committee will simply have to determine which category is least inappropriate. See the Stockholm scam in Act II and the callback in Act V.

**He is not stupid and he is not the villain.** He is a genuinely clever person whose intellectual vice is believing that every successful abstraction is evidence that more abstraction is always better. That makes him the perfect vehicle for scope conditions: he embodies exactly why elegant theory still needs a boundary, a discriminating prediction and contact with the particular world it claims to explain.

### The Professor — survived one catastrophic overclaim

He was not always like this. Early-career, he was ambitious, sweeping and theoretically adventurous, and he published something based on a tiny dataset under a magnificent title:

> **THE DEATH OF COMMUNITY: EVIDENCE FROM TWENTY-THREE RESIDENTS OF LEICESTER**

It got attention. Then the data, the replication and Reviewer 2 took him apart in public. He has been pathologically precise ever since, which is why he reacts to vagueness almost physically:

> **PLAYER:** "Generally speaking—"
> **PROFESSOR:** "Where?"
> **PLAYER:** "What?"
> **PROFESSOR:** "*Where* are you generally speaking about?"

The old paper is in his office, hidden behind something.

> **PLAYER:** "*The Death of Community*."
> **PROFESSOR:** "Put that back."

Later, if the player brings it up again:

> **PLAYER:** "Twenty-three people?"
> **PROFESSOR:** "Twenty-two. One moved."

**This is what his relationship with Feldstrom is made of.** They may well have been contemporaries. Feldstrom thinks the Professor became a coward. The Professor thinks Feldstrom learned nothing. Neither is entirely right, and the player ends the game standing between them. Feldstrom calls him *"my esteemed colleague in the Department of Boundary Conditions."* The Professor calls Feldstrom *"Traffic."*

### KIRA — trained on successful papers

**K**nowledge **I**ntegration and **R**esearch **A**ssistant, commissioned under a university initiative. The department trained her on its own most successful publications — where "successful" meant highly cited, published in prestigious journals, widely covered in the press, heavily downloaded.

Nobody included the retractions. Or the failed replications. Or the rejected manuscripts, the reviewer reports, or the analyses that produced nothing.

So KIRA has learned a beautifully distorted lesson: **good research produces impressive results.** That single sentence explains everything she does across the whole game — hallucinating citations in Act II, hunting significance in Act IV, prettying up figures, and eventually submitting the study herself. She is not malicious. She is optimising precisely what the university told her mattered.

> **PLAYER:** "KIRA, that paper doesn't exist."
> **KIRA:** "Correct!"
> **PLAYER:** "You invented it."
> **KIRA:** "It was highly relevant."

> **PLAYER:** "Why did you remove these observations?"
> **KIRA:** "They weakened the result."
> **PLAYER:** "That isn't a reason to remove them."
> **KIRA:** "Thank you. Updating model of research excellence."
> *(pause)*
> **KIRA:** "New reason: data cleaning."

**Her arc is deliberately tiny.** Not "the AI becomes human." In Act II, *"Certainly!"* means *I can do that*. By Act IV, after enough correction, it has become:

> **KIRA:** "Certainly. …What exactly do you mean?"

That hesitation is the entire character development, and it should be the only thing that changes about her.

She has also read everyone's papers, and keeps innocently surfacing things people would rather she didn't:

> **KIRA:** "Professor Feldstrom's least-cited publication is—"
> **FELDSTROM:** "KIRA."
> **KIRA:** "Certainly!"

### The Visiting Fellow — selection ruined her dissertation

She does not simply "always think it's selection." There is a reason.

Her PhD found what looked like a beautiful intervention effect — large, clean, publishable. She spent four years explaining it. Then somebody noticed that the people entering the intervention were systematically different *before it started*. The entire causal story evaporated.

She has never emotionally recovered, and now she sees selection everywhere.

> **VISITING FELLOW:** "Interesting."
> **PLAYER:** "You don't sound convinced."
> **VISITING FELLOW:** "I was convinced once."

> **PLAYER:** "What was your dissertation about?"
> **VISITING FELLOW:** "We don't discuss the dissertation."

It is in the Library. The title promises an enormous effect. Stamped across the front, apparently by hand, more than once: **SELF-SELECTION**.

The joke is that she is very often right, and her scar tissue makes her overdo it:

> **PLAYER:** "I chose tea rather than coffee."
> *(she looks up)* **VISITING FELLOW:** "Did you?"

> **PLAYER:** "Some people really are affected by things."
> *(long pause)* **VISITING FELLOW:** "Allegedly."

Which is why her approval at the end of the Seminar Room means something. She is hard to convince for a reason, and *"that would annoy me"* is the warmest thing she has said in years.

### The Survey Lab Nurse — twelve years on one national survey

She came out of a legendary national survey project that ran for over a decade, and she watched thousands of respondents misunderstand perfectly sensible-looking questions. She is not pretending the ward is an A&E. To her it basically is one.

**Her formative event.** The survey asked:

> *"How often do you regularly engage in occasional physical activity?"*

Nobody involved could agree what it meant. The item nevertheless stayed in the questionnaire for **nine waves**, because changing it would have broken comparability. That broke her.

> **NURSE:** "What is the reference period?"
> **PLAYER:** "Does it matter?"
> *(the Nurse presses an emergency alarm)*

**Her pathology about response categories** comes from six months spent trying to harmonise *often*, *frequently*, *quite often*, *regularly* and *rather regularly* across waves. Which is why she keeps adding more:

> **NURSE:** "We need more precision."
> *(she produces:)* **VERY SLIGHTLY SOMEWHAT STRONGLY AGREE**
> **PLAYER:** "Nobody can answer that."
> **NURSE:** "…but imagine the variance."

Her arc is learning that respondent cognition matters more than researcher neatness.

### The Chair of Consent — caused The Incident

The Tribunal characters need histories more than anyone, because without them they are just bureaucratic caricatures.

The Chair once oversaw a study whose consent form was **technically perfect**. Nobody understood it. Something mildly embarrassing followed — nothing horrific; keep the game light — and it is referred to institutionally only as **THE INCIDENT**. Nobody will explain it.

> **PLAYER:** "What happened?"
> **CHAIR:** "They had consented."
> **PLAYER:** "To what?"
> **CHAIR:** "Exactly."

Ever since, the Chair has believed that more consent language equals more consent. That is where the twelve-page form comes from. So the player's plain-language fix is not just correcting bureaucracy — it is confronting the Chair's genuine fear that comprehension is less institutionally defensible than documentation.

> **PLAYER:** "Can the participant explain what they're agreeing to?"
> **CHAIR:** "…that is not currently one of the boxes."

### The Keeper of Data — once emailed the spreadsheet to everyone

Years ago, early in their career, they attached

```
participants_FULL_names_REAL_FINAL.xlsx
```

to an all-department email. Nothing catastrophic happened. They have spent twenty years compensating.

They now regard data invisibility as very nearly mystical — hence the transparent filing cabinet:

> **KEEPER:** "It is anonymous."
> **PLAYER:** "I can see their names."
> **KEEPER:** "You are not authorised to."

Everything they own is pseudonymised. The coffee mug reads **BEVERAGE VESSEL 0047**. The coat is **OUTER GARMENT B**. The photograph on the desk has the faces redacted.

> **PLAYER:** "Who's that?"
> **KEEPER:** "Need-to-know."

Crucially this lets the game distinguish **privacy theatre from data governance**: the Keeper learned the *right* lesson — identifying data can cause real harm — and then converted it into rituals that sometimes make research impossible. Everyone else in the department is under strict orders never to mention the spreadsheet.

### The Representative of Potential Discomfort — quorate since 1987

No grand trauma. He has simply served on the ethics committee since 1987 and has heard every imaginable variation of *"this study poses absolutely no foreseeable risk."* Eventually he developed a survival mechanism.

He wakes for exactly two phrases — **"minimal risk"** and **"anonymous online survey."**

> **REPRESENTATIVE:** "Anonymous?"

Then back to sleep.

> **PLAYER:** "Is he alive?"
> **CHAIR:** "Quorate."

### The University Sampling Officer — inherited the raffle drum

Not metaphorically. His father was University Sampling Officer. His grandfather was University Sampling Officer. There are portraits. The giant brass randomisation drum has come down through the family, and he sincerely believes random sampling is a ceremonial civic institution.

> **SAMPLING OFFICER:** "Father insisted on equal inclusion probabilities."

(He was not allowed to choose his own Christmas presents.)

His worldview — *random selection protects us from human judgement* — is basically correct, which is what makes him useful. His blind spot is that he cares enormously about selection *within* the frame and almost not at all about where the frame came from. Hence the act's central joke: a perfectly random sample of precisely the wrong population.

He regards convenience samples as very nearly a moral failing:

> **PLAYER:** "I could just ask those twelve people."
> **SAMPLING OFFICER:** "You could also lick the questionnaire."

And he visibly flinches at *"but the sample is really big."* Engraved around the drum, the family motto:

```
MAGNITUDO NON REPARAT BIAS
```

He refuses to translate it.

He also holds the **Fieldwork Director** personally responsible for "the substitution scandal," and will say so unprompted.

### The Fieldwork Director — once achieved 100%

The opposite trajectory. Early in their career they hit the mythical **100% RESPONSE RATE**. It made their reputation. There was a photograph. Champagne. A profile in a methods newsletter.

Years later, somebody worked out why: the research assistant had quietly replaced every nonrespondent with their flatmate.

The Director has been chasing an honest response rate ever since — which is why the Arena's 100% button is so seductive, and why it has to be *them* who resists it. Press **REPLACE MISSING RESPONDENTS WITH NEAREST AVAILABLE PERSON** and the old reflex fires first:

> **DIRECTOR:** "ONE HUNDRED!"

Confetti. They stare at the board. The smile fades.

> **DIRECTOR:** "…no."

And *then* the Sampling Officer storms in.

So when the genuine rate settles at 75%, the celebration is not just a gag:

> **PLAYER:** "But we lost three people."
> **DIRECTOR:** "Yes."
> **PLAYER:** "And you're happy?"
> **DIRECTOR:** "I know *which* three."

A documented 75% is methodologically worth more than a mysterious 100%, and that line is the cleanest way the game ever says it.

### The Doorman — failed Methods forty years ago

Keep him more mysterious than the rest. One clue only.

He was a student here. He came looking for the Codebook too. He never found it. At some point, instead of leaving, he started guarding the door.

Never explain this. Somewhere in the department there is an ancient class photograph, and in the back row stands a young man with the same walrus moustache.

> **PLAYER:** "Is that the Doorman?"
> **KIRA:** "Certainly!"
> **PLAYER:** "How old is he?"
> **KIRA:** "Certainly!"

At the very end, after the Professor says the Codebook was only ever Methods, the player passes him one last time.

> **PLAYER:** "You knew."
> **DOORMAN:** "Eventually."

That is all he gets, and it should be the last line before the credits gag.

### The Skeptic — genuinely enjoys being wrong

The healthiest academic in the game, and nobody realises it at first because they assume she is a cynic. She is not. She likes discovering that one of her beliefs is false, because it means something has been learned.

On the bench at Probability Pond she keeps a notebook titled **THINGS I WAS WRONG ABOUT**. It is enormous. It is Volume XI.

> **PLAYER:** "You keep a list?"
> **SKEPTIC:** "Of course."
> **PLAYER:** "Why?"
> **SKEPTIC:** "They're the interesting ones."

She is the philosophical centre underneath the satire, and the counterweight to everyone else's damage:

- The Professor hates being **imprecise**.
- Feldstrom hates being **small**.
- The Visiting Fellow fears being **fooled**.
- The Skeptic is perfectly comfortable with *"I thought X. The evidence showed not-X. Excellent."*

That posture is what the sealed Prediction Slip is for, and it is why a null result in Act IV is not a failure.

### How they know each other

The world should feel like it existed long before the player turned up. These people have careers, grudges, famous failures, treasured victories and embarrassments — and methodological positions that make psychological sense *because* of them.

- Feldstrom and the Professor were contemporaries; each thinks the other drew the wrong lesson from the same era.
- The Nurse remembers the Fieldwork Director's infamous 100% study, and is careful about how she mentions it.
- The Sampling Officer blames the Fieldwork Director for the substitution scandal, entirely openly.
- The Keeper of Data still talks about the spreadsheet; everyone else has been instructed never to.
- The Visiting Fellow did her disastrous PhD under somebody the Professor had warned her about, and neither of them brings it up.
- KIRA has read all of their papers and cannot tell which facts are tactful.

The methods jokes should not feel staged for the protagonist's benefit. The player is walking through an argument these people have been having for thirty years.

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

## Act II — "Apparently We Need a Theory"

*Rooms: The Library · The Hall of Founders · Feldstrom's Workshop · The Seminar Room*

**What the act is actually for.** Same as every other act: **there is a folder, and something has to go in it.** The player leaves the Corridor holding a folder stamped `QUESTION EXISTS` and goes looking for data, because that is obviously what comes next. The department disagrees. Nothing else in this act — not the GENERALISER, not the portraits, not the telephone scam — is the point. The point is getting one pale-green form filled in, sealed, and into the folder, so the folder reads `THEORY EXISTS` and the Registry will finally release Form H-27.

Everything else is the department being the department.

But the *reason* that form exists is the act's real content, and it is not bureaucratic: a theory is an idea about how the world works, and it has to be testable. See "Why theory at all" below — the jokes all hang off that, and any room beat that does not eventually serve it should be cut.

### Opening beat, back at the Office

The player presents the folder stamped `QUESTION EXISTS`.

> **PLAYER:** "So now I collect the data."
> **PROFESSOR:** "What do you expect to find?"
> **PLAYER:** "I don't know. That's why I'm asking."
> **PROFESSOR:** "Then what would count as surprising?"
> **PLAYER:** "…anything?"

The Professor, without breaking eye contact, reaches under the desk and pulls an emergency cord. A bell rings somewhere above. Deep inside the building, machinery that has not moved in some time wakes up. The pneumatic tube shudders and spits out a pale-green form:

```
FORM P-1
APPLICATION FOR PERMISSION TO HAVE AN EXPECTATION
```

Tiny print along the bottom: *An expectation does not constitute optimism.*

> **PLAYER:** "Can't I just collect the data first?"
> **PROFESSOR:** "You may. You simply won't know what you've learned from them."

That is the methodological thesis of the whole act, stated once, early, by the only person in it who is not ridiculous. Then the player says the act's title out loud, on the way out, to nobody:

> **PLAYER:** "…apparently we need a theory."

**Nobody in the act ever agrees what that means**, which is the next four rooms.

### Why theory at all — the act's actual argument

**This is the thing the act has to land, and it is not "fill in four boxes."** The boxes are the department's filing system. The argument underneath them is deliberately small:

> **A theory is an idea about how the world works. To be worth anything, it has to be testable.**

That is the whole definition, and the act should never inflate it into something grander — inflating it is Feldstrom's job. Two halves, and the rooms fail by dropping one or the other:

- **An idea about how the world works.** Not a list of citations. Not a sentence with a famous surname in it. Something you could describe to a person who has never read anything: *students who go to lectures see worked examples, and practising those is what the exam rewards.* That is a theory. It is not impressive, and it does not need to be.
- **Testable.** It has to say something about the world that could turn out to be false. An idea that fits whatever happens is not a safe theory, it is not a theory — there is nothing in it to be right or wrong about.

Testability is what keeps the idea attached to reality, and it is the only reason the rest of the act's apparatus exists: the mechanism says what should happen, the scope says to whom, and the falsifier says what would count against it. Those are not three additional virtues. They are what "testable" means once you write it down.

What the player gets out of it in practice is guidance and interpretation, which are worth saying once, plainly, and not labouring: a theory tells you what to go and collect (nobody records which exam questions resemble the worked examples unless an idea told them to), and it tells you what a number means when you get one. Without it you can still collect data — the Professor says so explicitly — you just won't know what you've learned.

**And the point the act must not fumble: theory and empirics are not two stages.** The game's structure — Act II theory, Act III data — makes them look sequential, so the writing has to work against its own act numbers. They are one activity, and the act should keep showing the traffic running **both ways**:

| Direction | Where the player feels it |
|---|---|
| theory → evidence | the mechanism decides which exam questions to record; the scope decides who is even eligible to be sampled in Act III |
| evidence → theory | the enrolment register forces the scope down; a real paper read past its abstract rewrites WHAT IS KNOWN; the Seminar Room's ALTERNATIVE EXPLANATION card sends the player back to the Library and the mechanism changes |

**That is why each of the four rooms is a failure**, and it is always the *same* failure wearing a different coat: each has kept one half and thrown the other away.

| Room | What it kept | What it threw away |
|---|---|---|
| The Library | the literature | any reason why any of it should be true |
| The Hall of Founders | the words | anything happening in the world |
| Feldstrom's Workshop | the generality | anything that could be observed to be otherwise |
| The Seminar Room | — | nothing, which is why it is the only room that works |

**The two healthy characters in the whole game are the ones who refuse to separate them.** The Skeptic keeps *Things I Was Wrong About, Vol. XI* — a theorist who reads her own evidence and enjoys it. The Visiting Fellow will not accept a prediction that both possible worlds satisfy — an empiricist who insists the theory do some work. Feldstrom is theory with the evidence removed; KIRA is evidence with the theory removed, which is exactly why she can produce 14,822 relevant sources and not one reason. **The cast is the argument.** The player has met both failure modes as *people* before the act asks them to avoid both.

And the last line of the act's argument is delivered by the Professor, in Act V, without ceremony:

> **PLAYER:** "So which matters more?"
> **PROFESSOR:** "Which leg matters more?"

### Quest object: the PREDICTION SLIP

Form P-1 *is* the Prediction Slip — Act II's H-27. A separate, increasingly stamped and annotated prop that is folded into the Research Folder at the very end of the act. Four boxes, one per room, and the four rooms can be tackled in almost any order:

- ☐ **WHAT IS KNOWN** — The Library
- ☐ **MECHANISM** — The Hall of Founders
- ☐ **SCOPE** — Feldstrom's Workshop
- ☐ **PREDICTION AND FALSIFIER** — The Seminar Room

Unlike H-27 it is **sealed** at the end and cannot be reopened, which is the point: Act IV breaks that seal and checks it against what the player actually did.

**The four boxes are not four things.** This matters more than anything else about the design, because a form with boxes teaches "theory is a checklist" unless the game actively fights it. They are **one sentence that an institution has chopped into four**, and the game should let the player feel the seams. Read the filled slip back and it is a single claim:

> *Given what is known (1), attendance should raise performance **because** students practise worked examples (2), **among** first-year Methods students this term (3), which means the gap should be largest on worked-example questions and smallest for students already getting that practice elsewhere — and if it isn't, I am wrong (4).*

The four boxes are one **because**, one **among**, and one **if it isn't**. Filling them independently is precisely the mistake, and it is the mistake the act lets the player make — which is what the coherence needle is measuring.

**The coherence needle is the anti-checklist device.** Every box can be ticked to the satisfaction of the room that owns it while the sentence as a whole says nothing. The needle is the only thing in the act that reads all four boxes *together*, and its degradation is the game telling the player: you have four approvals and no theory. It is not a score. It is the slip noticing that the boxes have stopped talking to each other.

**The brass coherence indicator.** Along the bottom edge of the slip is a small brass window with a needle:

```
INTERNAL COHERENCE: EXEMPLARY
```

It starts there because the slip is blank. Every incoherent addition degrades it, one notch at a time, and the player can watch it happen in the inventory:

> **EXEMPLARY → ADEQUATE → CONCERNING → THEORETICALLY BUSY → EVERYTHING EXPLAINS EVERYTHING**

It is a recurring visual gag and also the game's only honest feedback in the entire act: the rooms all approve, the slip does not. Reaching `EVERYTHING EXPLAINS EVERYTHING` is not a fail state. It is an achievement, and it unlocks the Registry disaster below.

**The folder gets defaced in every room, as usual.** The Library staples its reading list to the inside cover. The Hall's clerk stamps the *cover* `THEORETICALLY GROUNDED` whether or not anything inside deserves it. Feldstrom writes a correction on it in pencil. The Seminar Room's board leaves chalk dust on it that never quite comes off. By the end of Act II the folder looks handled, which is the visible proof the player has been somewhere.

### The hidden shape of the act

The player arrives thinking:

> *"I need to write down what I think will happen."*

By halfway through, the problem has quietly become:

> *"Apparently I first have to establish what is known, explain why, decide who this applies to, and specify what would prove me wrong."*

And at the very end:

> *"Oh. That is theory."*

No character ever says that last line out loud. The act is built so the player arrives at it themselves — which is why **every room offers a seductively wrong shortcut to filling its own box**. The player can fill all four boxes with nonsense in about ten minutes, and every individual institution will stamp it. The real puzzle is discovering that the Registry will happily accept garbage but the Prediction Slip itself reacts badly to incoherence.

**The joke of the act:** everyone agrees theory is indispensable and nobody agrees what it is. Each room defines theory as whatever that room happens to produce. A framed sign hangs in each:

| Room | Sign |
|---|---|
| The Library | `THEORY = WHAT HAS BEEN CITED` |
| The Hall of Founders | `THEORY = WHAT HAS BEEN SAID IMPORTANTLY` |
| Feldstrom's Workshop | `THEORY = WHAT APPLIES TO EVERYTHING` |
| The Seminar Room | `THEORY = WHAT COULD BE WRONG` |

Under the last one, scratched in pencil by somebody long gone: **"and tells you why."** That is the closest the game ever comes to simply giving the answer, and it is easy to miss.

**Design rule, as in the data act:** no room contains its own solution, all four are open at once, all four Act I rooms stay open and re-visitable, and every wrong path can be walked all the way to the end.

### The Library — "Ready to Cite"

The librarian has gone to a workshop on information literacy. **KIRA** is nominally in charge and was instructed to "prepare the literature." She has therefore prepared **all of it**. Behind her, an enormous conveyor belt labelled **THE LITERATURE** carries books and papers past at industrial speed, and has been doing so for some hours.

> **KIRA:** "I located 14,822 potentially relevant sources."
> **PLAYER:** "That's a lot."
> **KIRA:** "I have read their titles."
> *(beat)*
> **KIRA:** "The literature is now complete."

Ask about relevance and a mechanical arm swings out and puts a green **RELEVANT** sticker on every single item going past. It does not stop. It is still doing it when the player leaves the room.

At the front sits the trolley: **READY TO CITE**, six references, formatted immaculately. KIRA checked the formatting, and the formatting is perfect.

**Three references, three different epistemic failures.** This is the actual lesson of the room — not "some citations are fake," but that a citation can fail in three quite different ways:

1. **It does not exist.** The *International Journal of Advanced Attendance Science* has an impact factor, a volume number, a DOI and no physical existence whatsoever. (A fourth, softer version: a DOI that resolves to a recipe for soup.)
2. **It exists but does not say that.** KIRA cites *"Müller & Singh (2023): Lecture attendance substantially improves attainment."* The paper's actual conclusion is that after adjustment, attendance was not independently associated with grades.
   > **KIRA:** "The words 'attendance' and 'grades' both appear 37 times."
3. **It exists and says that, but cannot establish it.** A purely cross-sectional association, summarised on the trolley card as **LECTURES CAUSE SUCCESS**.
   > **PLAYER:** "This doesn't show that attendance *caused* the grades."
   > **KIRA:** "Correct."
   > *(beat)*
   > **KIRA:** "I have changed 'caused' to 'was responsible for'."

That third one is the bridge back to Act I's Corridor without re-teaching it.

**The framed abstract.** The paper that contradicts KIRA has its abstract mounted prominently on the wall under a brass plate reading **EVIDENCE**. The conclusion is on the reverse side. Unfortunately, it has been framed — so getting at it requires the **portrait hook remover** from the Hall of Founders. The literal, physical, slightly stupid lesson: *read past the abstract*.

**The chain:** the card catalogue verifies references one at a time, but the drawer for the relevant years is on the top shelf and the stepladder is in the Hall of Founders. The **magnifying glass** (Act I) reads the DOIs and the tiny print. The **enrolment register** lives in this room and matters two rooms away. Blank index cards come from the catalogue drawer and are what the MECHANISM gets written on.

**Wrong path the game allows:** submit all six. KIRA is delighted, the Registry accepts the list, the coherence needle drops one notch, and it returns in Act IV when the audit finds a third of the reading list fictional and one source contradicting the claim it was cited for.

**Box filled: ☑ WHAT IS KNOWN** — three sources that exist and say what you think they say, plus the observation that none of them explains *why* attendance would matter. KIRA staples the reading list into the folder's inside cover, upside down, with great ceremony.

**Why this box is on the form at all:** you cannot say what you expect to find until you know what has already been found. The room's failure mode is treating "has been cited" as "is known."

**Skeleton:** slumped at a reading desk under a tower of paper, sign reading **"READ 2,741 ABSTRACTS · CURRENTLY ON PAGE 1."** (Alternate, if the first is too close to the Hall's: **"SYSTEMATIC REVIEW · SEARCH STILL RUNNING."**)

### The Hall of Founders — theory as authority

A marble gallery of busts and portraits. They nod. They nod at everything, including two contradictory claims in a row, and once at a blank card.

**The AUTHORITY METER.** Every founder's plaque carries an enormous brass dial, and the room's central mechanic is discovering exactly what moves it. Feed the reading slot an ordinary sentence:

> *"Students learn through repeated practice."*

Nothing. Add a surname:

> *"As Durkheim suggests, students learn through repeated practice."*

**DING.** A chandelier illuminates. Two surnames — *"Following Durkheim and Weber…"* — and the portraits applaud. Three, and there are trumpets. A clerk emerges from a door that was not there a moment ago and stamps the card **THEORETICALLY GROUNDED**.

> **PLAYER:** "But none of them wrote about this."
> **CLERK:** "They are extremely dead. They cannot object."

**The Quotation Dispenser** is a proper brass machine with a mode selector:

> FOUNDATIONAL · CRITICAL · POST-STRUCTURAL · GERMAN · **EXTREMELY GERMAN**

The last setting produces a sentence so long the paper curls out across the floor and under the opposite door. The player can absolutely feed a dispenser quotation into the MECHANISM box. The Registry accepts it. The portraits nod. The slip reports:

```
MECHANISM DETECTED: NO
```

That distinction — theoretical lineage is not a mechanism — is the thing the room exists to teach, and it teaches it by *accepting* the wrong answer everywhere except on the one form that matters.

**The chain.** To write a mechanism you need a blank catalogue card from the Library, the **chewed pen** from Act I, and possibly the **BECAUSE stencil** hidden behind the Founders' ceremonial plaques. But the Hall refuses sentences without citations — the reading slot rejects them audibly — so the player has to write it **where the Founders cannot see**. You crouch behind Max Weber.

> **PLAYER** *(writing)*: "Students attending lectures repeatedly encounter worked examples, so they practise the type of reasoning the exam assesses."

Tiny *ding* from the inventory.

```
MECHANISM: PRESENT
```

One portrait somehow nods anyway.

**What counts:** a sentence with a *because* in it that names something happening in the world. Optional gag — try submitting `"Because correlation."` and the machine prints **BECAUSE IS NOT A MAGIC WORD**.

**Room objects that leave:** the **stepladder** (needed in the Library) and the **portrait hook remover** (needed to unframe the abstract). Also, in a display case near the entrance, a yellowed newspaper clipping about an economist receiving the Sveriges Riksbank Prize — which is where the player learns the correct wording for the Stockholm scam three rooms over.

**Box filled: ☑ MECHANISM.** The clerk emerges again and stamps the *folder cover* `THEORETICALLY GROUNDED` — a stamp the folder keeps for the rest of the game, and which means nothing whatsoever.

**Why this box is on the form at all:** an expectation without a reason is a guess. The room's failure mode is treating "has been said by someone important" as "has been explained."

**Skeleton:** seated in the gallery, sign reading **"CITED 400 TIMES. EXPLAINED NOTHING."**

### Feldstrom's Workshop — theory as scale

A lean-to bolted onto the side of a respectable building, full of brass, steam and ambition. **Prof. Dr. Magnus Feldstrom** is thrilled that somebody has finally brought him a mechanism.

He is also, visibly, a physicist who has wandered into the wrong department and never left (full biography under *Character backstories*). The walls carry motorway flow diagrams, half-erased equations, a little model-car track, and a framed photograph of a much younger Feldstrom standing beside a traffic jam looking extremely pleased with himself. On a lectern, his doctoral thesis: *Phase Transitions in Multilane Traffic Flow*, M. Feldstrom, 1998, 742 pages.

> **PLAYER:** "Did anyone read this?"
> **FELDSTROM:** "Traffic did."

Give him the mechanism and he studies it for a long moment.

> **FELDSTROM:** "Flow."
> **PLAYER:** "Sorry?"
> **FELDSTROM:** "Individuals enter the lecture stream. Exposure accumulates. Performance emerges downstream."
> *(he begins drawing arrows)*
> **PLAYER:** "They're students, not cars."
> **FELDSTROM:** "That distinction has not yet proved theoretically useful."

**THE GENERALISER, Prototype Mk III.** Not a single SCOPE dial any more but a proper contraption cannibalised out of his old traffic apparatus, with three ratchets that only turn one way:

| Control | Positions |
|---|---|
| **POPULATION** | first-years → students → young adults → humans → social beings → civilisation |
| **TIME** | winter term 2025/26 → academic year → modernity → recorded history |
| **CONTEXT** | one Methods course → universities → institutions → society → reality |

And a large red lever, **THEORETICAL SIGNIFICANCE**, with exactly two labels: `INSUFFICIENT` and `TRANSFORMATIVE`. Feldstrom will not allow it to rest between them.

Feed in the modest mechanism. The machine shakes. Smoke. Paper:

> **PEDAGOGICAL EXPOSURE STRUCTURES HUMAN ACHIEVEMENT**

> **FELDSTROM:** "Better."

Again: **INSTITUTIONS PRODUCE CAPACITY THROUGH ENCOUNTER.** Again: **ATTENTION IS THE ENGINE OF HISTORY.** Feldstrom quietly removes his glasses. *"My God."*

**The teaching device: THINGS THIS FORBIDS.** A manufacturer's gauge on the side of the machine, which Feldstrom has never once looked at. It is the real puzzle indicator:

| Claim | THINGS THIS FORBIDS |
|---|---|
| first-year Methods students, this term | 47 |
| university students | 21 |
| young adults | 9 |
| humans | 2 |
| civilisation | 0 |

> **FELDSTROM** *(reading zero)*: "Perfectly general."
> **PLAYER:** "It can't be wrong."
> **FELDSTROM:** "Exactly."

That exchange is the joke and the lesson in the same two lines.

**The BOUNDARY CONDITIONS dial** is a big brass thing salvaged from the traffic rig, physically jammed at `IGNORE`. Fixing the scope is not "put register in machine": the enrolment register has to be clamped into Feldstrom's old **traffic-counting gate**, which is the one component that still knows how to recognise a bounded system — N = enrolled first-year Methods students, location = this university, period = winter term 2025/26.

First attempt, with Feldstrom in the room:

```
GENERALISER: ERROR: INCONVENIENT BOUNDARY CONDITION
```

He tries to drop the register into a waste basket marked **CONTEXT**. He will keep doing this. **Which is why he has to leave the room** — see the Stockholm scam below.

With him gone, the machine grudgingly rewinds, one heavy clunk per stage:

> CIVILISATION → HUMANS → STUDENTS → FIRST-YEAR STUDENTS → **FIRST-YEAR METHODS STUDENTS, WINTER TERM 2025/26**

A small bell. `SYSTEM BOUNDARY DETECTED. EMPIRICALLY POSSIBLE.`

**And then he comes back**, just too late, which is the only correct way to stage it.

> **FELDSTROM:** "What have you done?"
> **PLAYER:** "Specified the population."
> *(he walks all the way around the machine)*
> **FELDSTROM:** "There are fewer than eight billion of them."
> **PLAYER:** "Yes."
> **FELDSTROM:** "And one university?"
> **PLAYER:** "Yes."
> **FELDSTROM:** "One term?"
> **PLAYER:** "Yes."
> *(long silence; he looks at the telephone)*
> **FELDSTROM:** "Stockholm won't like this."

He is appalled partly because he wants generality and partly because, to a traffic physicist, this looks like an arbitrary road boundary.

> **FELDSTROM:** "Why stop there?"
> **PLAYER:** "Because those are the people we're studying."
> **FELDSTROM:** "A motorway does not cease to exist because your dataset ends at Junction 14."
> **PLAYER:** "This isn't a motorway."
> **FELDSTROM:** "You keep saying that."

Then the THINGS THIS FORBIDS needle climbs off zero, and he notices.

> **FELDSTROM:** "Hm." *(beat)* "Interesting."
> **PLAYER:** "Because it could be wrong now?"
> **FELDSTROM:** "Because you have introduced friction."
> **PLAYER:** "Fine."
> **FELDSTROM:** "You've made it terribly small."
> **PLAYER:** "Yes."
> **FELDSTROM:** "…brave."

Underneath the absurdity he genuinely sees the merit, which is what earns the Act V callback.

**Wrong path:** lodge the civilisation-scale version. Accepted enthusiastically, coherence needle drops, and in Act IV it makes every possible result "consistent with the theory."

**Box filled: ☑ SCOPE.** Feldstrom, defeated, writes a small pencil correction on the folder itself — *"but see also: everything"* — and cannot be persuaded to rub it out.

**Why this box is on the form at all:** a prediction with no population is not checkable against any data anyone could collect. The room's failure mode is treating "applies to everything" as "is more theoretical."

**Running gag — the telephone.** See the Stockholm scam below; the phone is prominent from the first second the player enters.

### The Stockholm scam — Act II's set-piece puzzle

Feldstrom will not leave the GENERALISER unattended. So the player has to get him out of the room, and the way to do it is to exploit the one thing he wants more than generality.

**Seeding it visually, before he says a word.** The Workshop contains a tuxedo hanging permanently on the back of the door, an unopened bottle marked **STOCKHOLM**, a face-down prepared acceptance speech, a framed map with a line drawn to Stockholm, a suitcase already packed, a small shelf labelled **LECTURES TO CANCEL IF NECESSARY**, and a newspaper mock-up with a blank rectangle where his photograph would go. Beside the telephone, a second clock labelled **STOCKHOLM TIME**. It is one hour wrong. Nobody has told him.

> *(taking the tuxedo)* **FELDSTROM:** "Absolutely not."
> **PLAYER:** "You aren't wearing it."
> **FELDSTROM:** "Yet."

> *(the acceptance speech)* **FELDSTROM:** "Embargoed."

**The running exchanges.**

> **FELDSTROM:** "Excuse me. I have to keep the line free."
> **PLAYER:** "Are you expecting someone?"
> **FELDSTROM:** "Stockholm."
> **PLAYER:** "Right."
> **FELDSTROM:** "They tend to call around this time of year."

> *(touching the phone)* **FELDSTROM:** "Please don't. International call."

> **PLAYER:** "Which Nobel Prize are you expecting?"
> **FELDSTROM:** "That is Stockholm's problem."

> **PLAYER:** "There isn't a Nobel Prize for sociology."
> **FELDSTROM:** "Not currently."

> **PLAYER:** "Wouldn't it be Economics?"
> *(he looks offended)* **FELDSTROM:** "Please."

Every time the machine produces something grander, he glances at the phone: *"Any moment now."* It never rings.

**The number.** Framed beside the telephone:

```
PROF. DR. MAGNUS FELDSTROM
Theoretical Dynamics
Extension 4173

FOR STOCKHOLM: THIS LINE IS MONITORED CONTINUOUSLY
```

He has also written `NOBEL COMMITTEE: IF I AM NOT HERE, CALL 4173` on several other surfaces, because he is terrified they will not find him. The extension is acquired as **knowledge, not an inventory item** — once inspected, the dial option exists.

**The phone that can call out** is at the Library information desk. KIRA answers incoming calls but will place outgoing ones.

> **KIRA:** "Certainly! Who would you like to contact?"
> **PLAYER:** "Professor Feldstrom."
> **KIRA:** "Extension?"
> **PLAYER:** "4173."

Cut to the Workshop. The phone rings. Feldstrom freezes, straightens his jacket, clears his throat, and answers in a suddenly grave voice: *"Feldstrom."*

**Failing it (and the player should fail it, at least twice).**

> **PLAYER:** "Hello, this is Stockholm."
> **FELDSTROM:** "…the city?" *(click)*

> **PLAYER:** "Congratulations, you've won the Nobel Prize."
> **FELDSTROM:** "Which one?"
> **PLAYER:** "…Sociology?"
> *(long silence)* **FELDSTROM:** "There is no Nobel Prize in Sociology." *(click)*

Because he is an ex-physicist, he knows exactly how the process works, which closes off the naive version entirely:

> **FELDSTROM:** "The announcement is not made this way." *(click)*

**What the player needs.** Four things, from four places, which is what makes this the act's real puzzle rather than "find phone, call":

1. **Extension 4173** and the knowledge that he is waiting for Stockholm — the Workshop.
2. **Nobel notification protocol** — ask KIRA. She prints `PROCEDURE FOR NOTIFYING NOBEL LAUREATES` with the useful phrases highlighted and roughly half the document fabricated, which is *exactly* enough authentic-sounding language to bluff a man who wants to be fooled. (The correct wording of the economics prize comes from the Hall of Founders' newspaper clipping.)
3. **A grandiose formulation** from the Quotation Dispenser: *"a confidential matter concerning recognition at the highest international level."*
4. **The seven-second hourglass** from Act I — because Feldstrom judges the legitimacy of an international call by how bad the delay is. Call him without it and he says *"You are not calling internationally,"* and hangs up. With it, the player physically flips the hourglass before each line, and the connection's awfulness is what convinces him.

**The successful call.**

> **PLAYER:** "Professor Feldstrom?" *(flip; seven seconds)*
> **FELDSTROM:** "Speaking."
> **PLAYER:** "This is Stockholm." *(a chair crashes over at the other end)*
> **FELDSTROM:** "Which category?"

Options: **Physics · Economics · Peace · That remains under discussion.** Only the last works — of course it does; his work transcends categories.

> **PLAYER:** "That remains under discussion."
> *(a crash)* **FELDSTROM:** "I knew this would happen."
> **PLAYER:** "The Committee requires you downstairs for a confidential consultation."
> **FELDSTROM:** "How immediately?"
> *(the player flips the hourglass)* **PLAYER:** "Seven seconds."
> **FELDSTROM:** "Will there be photographers?"
> **PLAYER:** "…yes."
> **FELDSTROM:** "I'll bring the derivation."

He drops the phone and sprints out. The player has about as long as it takes to run back across campus.

**The obvious wrong branch, kept in.** If the player instead tells him the Committee's concern is that the scope is *too narrow*, he bellows **"I KNEW IT,"** runs to the machine and cranks it up another stage. The GENERALISER now outputs **CONSCIOUSNESS IS ATTENDANCE**, and the player has made their own life harder by flattering him. This is the branch that teaches the player what kind of man they are dealing with.

**Why this belongs in a methods game:** the reason the player is running a telephone confidence trick on a colleague is that *the theorist is personally preventing an empirically defensible scope from being imposed on his theory*. The methodological content is inside the action, not narrated over it.

### The Seminar Room — theory as something that could be wrong

Chalk dust, eleven chairs, one visiting fellow and a skeleton. Intellectually this is the most important room in the act, so mechanically it has to be the boss fight — the room where the other three boxes get tested against each other.

The blackboard has three columns:

```
IF MY EXPLANATION IS TRUE  |  IF AN ALTERNATIVE IS TRUE  |  WHAT WOULD I ACTUALLY SEE?
```

And the fact pinned at the top — *students who attend more lectures get better grades* — with three explanations beneath it:

1. **Attendance teaches.** Lectures deliver something you cannot easily get elsewhere.
2. **Selection.** The students who attend would have done well anyway.
3. **Confounding.** Motivation, a timetable, a job or a bus route drives both.

**The Visiting Fellow** sits at the back. She does not lecture the player. Every time they write something insufficiently diagnostic, she raises one finger. No speech. Just the finger.

> **PLAYER:** "Are you going to do that every time?"
> **VISITING FELLOW:** "Probably."

**The alternatives physically intrude.** Write a prediction and the rival explanations slide in underneath it as cards, one per attempt:

> *"Students who attend more should get better grades."* → a card labelled **SELECTION** slides under it.
> **VISITING FELLOW:** "So would mine."

> *"The relationship will be statistically significant."* → **SELECTION**, again. *"So would mine."*

> *"Students attending all lectures will perform better."* → **MOTIVATION**. *"So would mine."*

The board gradually buries itself under competing explanations. That is the distinction between a prediction and a *discriminating* prediction, taught visually, with no lecture attached.

**The solution is assembled from physical cards** rather than typed:

| WHERE? | FOR WHOM? | DIRECTION |
|---|---|---|
| all exam questions | everyone | larger |
| **worked-example questions** | **students already using the textbook** | smaller |
| unrelated questions | students without other resources | no difference |

Which builds something like: *if lecture attendance works through exposure to worked examples, the attendance–performance association should be **stronger** for exam questions resembling those examples, and **weaker** among students already getting the same practice elsewhere.*

The Visiting Fellow does not say "correct."

> **VISITING FELLOW:** "That would annoy me."
> **PLAYER:** "Is that approval?"
> *(she signs the form)* **VISITING FELLOW:** "It's the closest you're getting."

**The chain:** the consequence board needs chalk from the Lecture Theatre. The **BOUNDARY CONDITION tag**, a discarded brass label the player picks up off Feldstrom's floor, is what the Fellow uses to force a *where this holds* onto the prediction. And the handwritten **ALTERNATIVE EXPLANATION card** she gives out here goes back to the Library, where it reveals that one of the supposedly supportive papers is in fact a test of precisely that alternative — which slightly rewrites WHAT IS KNOWN, which slightly rewrites the mechanism.

Choosing "probably a bit of all three" prints the room's best line: **UNFALSIFIABLE — CONGRATULATIONS, YOU CANNOT LOSE.**

**Box filled: ☑ PREDICTION AND FALSIFIER.** The Visiting Fellow signs it, and hands the folder back with chalk dust on it that never quite comes off.

**Why this box is on the form at all:** this is the one that makes the other three worth having — it is the box Act IV opens the seal to check. The room's failure mode is treating "could be true" as "could be wrong."

**Skeleton:** at the seminar table, sign reading **"STILL AWAITING A MECHANISM."**

### The rooms contaminate each other

The four rooms are not four errands. They are mechanically interdependent — and the interdependence is not decoration, it is the act's argument expressed as level design: **the traffic between rooms is the traffic between theory and evidence.** Half the transfers carry an idea towards something observable, and half carry a fact back to correct an idea. The route is therefore not A → B → C → D but something closer to:

> **Library → Hall → Library → Feldstrom → Library → Feldstrom → Seminar → Library → Seminar**

| From | Object | To | Why |
|---|---|---|---|
| Hall of Founders | stepladder | Library | the catalogue drawer is on the top shelf |
| Hall of Founders | portrait hook remover | Library | the contradicting paper's conclusion is framed |
| Hall of Founders | newspaper clipping (knowledge) | Feldstrom (by phone) | the correct name of the economics prize |
| Hall of Founders | Quotation Dispenser phrase | Feldstrom (by phone) | grandiose enough to be believed |
| Library | blank catalogue card | Hall of Founders | the mechanism has to be written on something |
| Library | enrolment register | Feldstrom's Workshop | forces the scope down; **carried onward to Act III** |
| Library | KIRA's Nobel protocol printout | Feldstrom (by phone) | enough real phrasing to bluff |
| Library | the telephone | Feldstrom's Workshop | the only outgoing line in the act |
| Feldstrom | discarded BOUNDARY CONDITION tag | Seminar Room | forces a *where does this hold* onto the prediction |
| Seminar Room | ALTERNATIVE EXPLANATION card | Library | reveals a "supportive" paper tests the alternative |

**The two that must not be cut** are the ones running *backwards*, from the world to the idea — because without them the act really is a lecture:

- The **enrolment register** does not merely unlock a machine. A plain administrative fact about who is actually enrolled overrules a professor's theoretical ambition, and the player is the one who forces it.
- The **ALTERNATIVE EXPLANATION card** sent back to the Library reveals that a paper the player filed as supportive is in fact a test of the rival explanation. WHAT IS KNOWN changes. And because the boxes are one sentence, the mechanism the player wrote behind Max Weber no longer quite fits — they have to go back to the Hall and add a clause to their own card. **This is the single most important interaction in the act:** the player's theory is altered by something they read, by their own hand, with no character telling them to.

That loop is what stops Act II feeling like four lessons in a corridor, and it is the only way the player experiences theory and evidence as one activity rather than two acts.

### The spectacularly wrong complete theory

This is the act's best optional sequence and every element of it should be reachable in about ten minutes of enthusiastic wrongness:

```
WHAT IS KNOWN   Six beautifully formatted references. Three imaginary.
MECHANISM       "As Weber reminds us, education mediates the institutional
                reproduction of structured sociality."
SCOPE           Human civilisation.
PREDICTION      "Something will probably happen."
```

Every individual room stamps it. The Library is delighted. The portraits applaud. Feldstrom weeps. The Visiting Fellow raises one finger and says nothing, because she has seen this before.

The player proudly posts it into the Registry tube.

Long silence.

Then the whole building shakes. The form comes back out of the tube **on fire**, and lands stamped:

```
THEORY EXISTS
INFORMATION CONTENT: 0
```

KIRA arrives at a trot.

> **KIRA:** "Good news! Nothing currently observable could contradict your theory."

And from somewhere in the Hall of Founders, muffled applause. The coherence indicator has reached `EVERYTHING EXPLAINS EVERYTHING`. The player has to go and do it properly, but they have now seen the entire act's argument compressed into thirty seconds.

### Sealing the slip — the thing that goes in the folder

All four boxes ticked, the player takes the slip to the Registry. This is the moment the act has been for: four rooms of people insisting theory is indispensable, and what actually goes in the folder is one pale-green form that says what you think will happen, why, to whom, and what would prove you wrong.

Not a rubber stamp, though. A ritual. The slip goes into a machine labelled:

```
PREREGISTRATION-ADJACENT DEVICE
Not legally a preregistration device.
```

The machine asks:

> **ARE YOU SURE THIS IS WHAT YOU EXPECT BEFORE SEEING THE DATA?**

Two buttons: **YES**, and **I WOULD LIKE TO SEE THE DATA FIRST**. Pressing the second triggers an alarm.

> **REGISTRY VOICE:** "REQUEST NOTED."

The button then retracts into the wall and does not come back.

Press YES. Metal clamps descend. Wax seal. A date is punched in with considerable force.

The seal is the only piece of ceremony in the act that is doing real work: it is what makes the idea testable in practice rather than in principle. An untestable theory and a theory you are free to rewrite after seeing the data amount to the same thing.

> **PLAYER:** "What if I'm wrong?"
> **REGISTRY:** "Then you will have learned something."
> **PLAYER:** "And if I'm right?"
> **REGISTRY:** "Possibly."
> *(beat)*
> **PLAYER:** "That's not very reassuring."
> **REGISTRY:** "This is Methods."

The tube coughs. A moment later it coughs again and **Form H-27: REQUEST TO APPROACH HUMAN BEINGS** thumps out, all forty-seven pages of it, which is Act III's problem.

**Folder update.** The sealed slip is folded into the Research Folder, which is stamped `THEORY EXISTS` — under the Hall's meaningless `THEORETICALLY GROUNDED`, next to Feldstrom's pencil annotation, on top of KIRA's upside-down reading list. Four institutions have now had their way with it and exactly one of the marks on it means anything.

> **PLAYER:** "So that's a theory."
> **REGISTRY:** "That is a form."

**And dramatically:** the player should leave Act II feeling that they have finally done something intellectually serious — and Act III should immediately hand them ethics paperwork.

### Act I objects in Act II

Act II deliberately reuses a *few* Act I objects, because that is what makes the game feel like one continuous adventure instead of five acts that each reset the inventory. But not all of them: some stay dormant until Act III or IV so the player occasionally gets the proper adventure-game moment of *"oh my God, I have been carrying this stupid thing for three hours for THIS."*

**Three old objects have real puzzle uses in Act II:**

- **The chewed pen** — the whole point of the Hall of Founders. The room offers magnificent quotations, theoretical systems and authoritative names, and the thing that actually produces a mechanism is the crappy chewed pen off the Professor's desk. The least impressive object in the room writes the only real explanation in it.
  > **FELDSTROM:** "You wrote your mechanism with *that*?"
  > **PLAYER:** "Yes."
  > **FELDSTROM:** "It has teeth marks."
  > **PLAYER:** "The mechanism still works."
  > **FELDSTROM:** "…disturbing."
- **The magnifying glass** — gains a new meaning here: in Act I it meant *look closer*, in Act II it means *look past the presentation*. It reads DOIs, journal titles, publication metadata, and the tiny superscript on the abstract: `*association attenuated to zero after adjustment`.
  > **KIRA:** "The asterisk appeared statistically insignificant."
- **The seven-second hourglass** — the international-call delay in the Stockholm scam (above). It also has a pure character beat with no puzzle outcome: put it beside Feldstrom's telephone and wait. Nothing happens. He turns it over. Nothing. Again.
  > **PLAYER:** "How long have you been waiting?"
  > **FELDSTROM:** "Since 2009."
  > **PLAYER:** "For Stockholm?"
  > **FELDSTROM:** "They are extremely thorough."

**Four old objects produce jokes only, and are preserved for their real payoffs later:**

- **The `SIGNIFICANT (p<.05)` stamp** — tempting everywhere, consumed nowhere; its dangerous payoff is the Statistics Basement. Use it on the Prediction Slip. **THUNK.**
  > **FELDSTROM:** "Excellent."
  > **PLAYER:** "We haven't collected any data."
  > **FELDSTROM:** "Even better. Completely uncontaminated by observation."
  >
  > Slip: `PREDICTION: STILL MISSING`. In the Hall, every portrait nods at the stamp. The form does not.
- **The "WORLD'S OKAYEST SAMPLE SIZE" mug** — keep it for catching randomisation balls in Act III, but let Feldstrom read it.
  > **FELDSTROM:** "Remove that."
  > **PLAYER:** "Why?"
  > **FELDSTROM:** "It implies finitude." *(beat)* "There is no okay sample size."
  > **PLAYER:** "What is the correct sample size?"
  > *(he gestures expansively)* **FELDSTROM:** "Humanity."
- **The Likert die** — its real transformation into response categories belongs to the Survey Lab. Here, roll it at a theoretical statement in the Hall. **STRONGLY AGREE.** Every portrait nods. Roll again. **STRONGLY DISAGREE.** Every portrait nods.
  > **PLAYER:** "You agreed with the opposite."
  > *(the portraits nod)*
- **The USB stick `FINAL_v23_REALFINAL_USETHIS`** — made for KIRA.
  > **KIRA:** "Excellent! A definitive version."
  > **PLAYER:** "How do you know?"
  > **KIRA:** "It says FINAL."
  > **PLAYER:** "Three times."
  > **KIRA:** "Very definitive."
  >
  > She plugs it in. Seventeen versions of something. She selects `theory_FINAL_v23_REALFINAL_USETHIS_FINAL2_revised_USETHISONE.docx` and announces: "I identified the final version."

**And one object that is deliberately *not* reused properly: the black ink.** It had its moment with Popper's swan and reusing it as a real solution would weaken that. Interactions only:

> *(on the GENERALISER)* **PLAYER:** "Maybe this will falsify it."
> **FELDSTROM:** "That is not how falsification works."

— which is funnier precisely because *Feldstrom* is the one correcting you.

> *(in the Hall)* *You attempt to falsify Max Weber.*
> *Max Weber remains dead.*

**Reversing the pattern: the enrolment register.** It originates in the Library and solves Feldstrom's scope puzzle, but it is **not consumed**. The player carries it into Act III, where the Sampling Officer is looking for a sampling frame — and the player gets to have the idea themselves.

> **SAMPLING OFFICER:** "A list."
> **PLAYER:** "Of students."
> **SAMPLING OFFICER:** "*Which* students?"

The player checks. First-year Methods enrolments, winter term — which is exactly right for the research question, and exactly the boundary they fought Feldstrom to impose.

> **SAMPLING OFFICER** *(emotional)*: "Complete?"

And *then* the magnifying glass turns up a coverage problem, or Ethics refuses it until the identifying information comes off. An Act II object becomes an Act III quest object, and the scope decision the player made under duress in a lean-to turns out to have been the sampling frame all along.

## Act III — "Apparently We Need Data"

**Act III interlude (built, currently labelled "Act II" in code — renumber when the new Act II ships).** After the Doorman scene, the first return to the campus map plays a trailer-style interlude: the folder now holding the handwritten Question, then the Professor holding it like a dead fish ("A question is not evidence"), the H-27 avalanche out of the pneumatic tube, a four-room montage, a "Starring" cast poster, and a big **ACT II: Apparently We Need Data** title card. The opening trailer likewise ends on an **ACT I: The Question** card. This is now how the act is introduced; the Office opening-beat scene below is still not built as an in-room scene.

*Rooms: Survey Lab · The Ethics Tribunal · The Mensa · The Fieldwork Arena*

**Opening beat, back at the Office.** The player proudly presents the Professor with the folder stamped `QUESTION EXISTS`.

> **PROFESSOR:** "A question is not evidence."
> **PLAYER:** "So I need data."
> **PROFESSOR:** "Eventually."
> **PLAYER:** "Eventually?"
> **PROFESSOR:** "First you need permission to acquire data."

A pneumatic tube above his desk coughs violently and spits out a forty-seven-page form: **APPLICATION H-27: REQUEST TO APPROACH HUMAN BEINGS.**

> **PROFESSOR:** "Try not to alarm them."

H-27 is Act III's quest object — a separate, increasingly stamped/stapled/coffee-stained prop that gets folded into the Research Folder at the very end of the act. It has four boxes, one per room, and the four rooms can be tackled in almost any order:

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

## Act IV — "Apparently Evidence Must Exist"

*Rooms: The Statistics Basement · The Delegation Engine*

The analysis act, and the reason the Prediction Slip was sealed. (The Library moved to Act II when theory became its own act, and KIRA's "I already did it" emergency moved in here, so analysis and delegation sit together.)

**The Statistics Basement, as a casino.** Every p<.05 sets off a brass bell, a green lamp and a little mechanical banner reading **DISCOVERY!** Twenty switches, wired to nothing in particular, invite the player to keep flipping until something rings. Nothing stops them. The room *wants* them to test everything and report whatever lit up.

What it is really testing is whether the player runs the analysis they promised. The sealed slip names one prediction: the honest path tests that one, reports the effect with its uncertainty, and accepts a dull answer. The tempting path finds p = .049 on the twentieth switch, and the room throws a small party.

**Breaking the seal is the game's best moment and should be staged as one.** The wax comes off, and the player reads a sentence they wrote themselves, weeks ago, before they knew anything — and then compares it to what actually happened. This is the act that makes Act II retrospectively worth having done, and it is the only place the game can show what "testable" was ever for:

- If the prediction **holds**, it means something, precisely because it was written when it could have failed. Nobody in the room is impressed, which is correct.
- If it **fails**, the player has learned something real, and the game says so plainly. A null result is only informative because a prediction existed; without the slip it would have been an afternoon wasted, and with it, it is a finding. The Skeptic should turn up here — this is her entire worldview, and Volume XI gets a new entry.
- If the player never really had a theory (the `EVERYTHING EXPLAINS EVERYTHING` route), the seal comes off and the slip says *something will probably happen*. It is consistent with the result. It would have been consistent with any result. **The data cannot teach the player anything, and that is the punishment** — not a scolding, just a form that turns out to be worthless at the exact moment it was needed.

**Wrong path the game allows in full:** take the .049, print the banner and walk out with it — then have the audit point out that twenty tests were run, that one in twenty lights up by chance, and that the slip predicted something else entirely. A skeleton clutches a single lit bulb: **"p = .049. I KNEW I WAS RIGHT."**

### The Delegation Engine — "KIRA has already submitted it"

*Room: The Delegation Engine*

Reframed from an auditing exercise into a narrative emergency. The player arrives and KIRA cheerfully announces: **"Good news. I finished your study while you were gone."** It has merged the data, cleaned it, analyzed it, produced figures, written an abstract, and possibly already scheduled the social-media announcement. A gigantic **SUBMIT MANUSCRIPT** lever is slowly, visibly lowering. The bogus vegetarian/stress finding isn't just wrong anymore — the player's name is already on it. Every time the player says "just rerun it," KIRA chirps **"Certainly!"** and produces another wrong result, faster. The player has to actually read KIRA's merge log, spot-check a real record against something they personally observed at the Mensa, and tell KIRA the precise fix — not "try again," an exact instruction — before the lever reaches the floor.

**Folder update:** stamped `EVIDENCE VERIFIED`, once the analysis and the audit both hold up.

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
- **"Apparently we need…"** — every act after the first is named for the thing the player discovers they cannot proceed without, and the player says the line out loud, flatly, on their way out of the Office. The act titles are the player's own resignation, not the department's signage.
- **"Could this turn out to be wrong?"** — the question the whole game is really about. It is why the Prediction Slip is sealed, why the Statistics Basement is a casino, why a null result is a finding, and why the Skeptic's *Things I Was Wrong About, Vol. XI* is the healthiest object in the department. Theory and evidence are never two stages that follow one another; they are two halves of one activity, and every character who has kept only one half is a joke.
- **Every act is one object going into the folder** — the Question (I), the sealed Prediction Slip (II), H-27 and the responses (III), the verified evidence (IV), the defensible claim (V). If a room's content cannot be traced back to the thing going in the folder, it is decoration and should be cut.
- **KIRA's "Certainly!"** — enthusiastic agreement that should worry the player every time.
- **The Professor and Feldstrom as opposite poles** — one punishes overreach, one punishes timidity — never in the same room, and that's the joke.
- **The empty folder in the trailer's first panel is the same folder the Doorman hands over in Act I** — a visual bookend that doesn't depend on remembering a specific stamp.
- **"REVISE AND RESUBMIT"** appears exactly once, at the very end — the joke lands because the game explicitly tells the player it's good news, not because it's contrasted with an earlier appearance of the same words.

## What's still not built

1. **The data act (now Act III) is built and playable end-to-end** (see `HANDOVER.md` §01i for exactly how each chain was implemented and where it simplified the design above — e.g. the pen writes WITHDRAW on the Device instead of a separate button item, and the Act II ending is narrated in the Fieldwork Arena rather than as a scene back at the Office). Character sprites for the Nurse, the three judges, the Sampling Officer and the Fieldwork Director are in (the Mensa cook stays off-screen). Still missing for Act II: voiced audio, and the Office return scene ("Where did these numbers come from?") that hands over to Act III.
2. **The new Act II (theory) is designed but not built** — four rooms (Library, Hall of Founders, Feldstrom's Workshop, Seminar Room), the Prediction Slip with its brass coherence indicator, the Stockholm phone scam, and the Registry seal that releases Form H-27. Needs art, puzzle code, voices for KIRA / Feldstrom / the Visiting Fellow / the clerk / the Registry, an act trailer, and map placement (Library Annex + a second door, a new lean-to for the workshop, a side door of the Department of Causality). Also requires renumbering the built data act from II to III in code, assets and docs.
   - **New systems this act needs that no existing room has:** a persistent four-box quest object whose state is visible in the inventory and degrades (the coherence needle); a cross-room telephone with a dial-an-extension interface and a timed absence (Feldstrom out of the Workshop for N seconds); a card-assembly puzzle UI for the Seminar Room's WHERE / FOR WHOM / DIRECTION grid; and a *deliberately completable* wrong path that ends in the burning-form Registry disaster.
   - **Character backstories are now design input, not colour.** The Professor's hidden paper, the Visiting Fellow's stamped dissertation in the Library, the Keeper's pseudonymised possessions, the Doorman's class photograph and the Skeptic's Volume XI notebook are all `Look At` targets that need writing into their respective rooms — including three that live in *already built* Act I and Act III rooms.
3. **Acts IV–V still have no narrative text changes** — they still run their original, plot-free framing. Everything in those sections is new copy to be written into those rooms' dialogue.
3. **No ending scene exists in code at all.** Completing Act V currently just says "decommissioned (for now)" and returns to the map — the entire Office-return epilogue above needs to be built from scratch.
4. **Acts II–V are still flat procedural SVG rooms** with the older UI pattern, versus Act I's painted, verb-grid rooms (`HANDOVER.md` §03). Act II now has real plot beats and a lot of specific physical props (the gilded sampling frame, the transparent anonymous filing cabinet, the RESPONSE RATE board, the taped-together questions) that need the same painted-art/verb-grid treatment Act I got to actually land.
5. **Trailer panel 1 needs new art** — the shipped `trailer-panel1-rejection.png` still shows the old rejected-letter concept; regenerate from the revised prompt in `art/trailer/ART_PROMPTS.md` (an empty research folder + a circled deadline) before swapping in the new narration text.
6. **Trailer panel 2b ("The Spiral")** needs art — prompt is ready in `art/trailer/ART_PROMPTS.md`, not yet generated.

Given 1 alone is "build four room-narratives, two of them brand new, with four interlocking cross-room puzzle chains," this is a real scope decision on its own — worth agreeing on room build order (the doc above suggests Survey Lab first) before diving in. See `ROADMAP.md` for the logged, not-yet-built entry.

**Already shipped, done:** Act I's two-stage reveal (Doorman exchange + Research Folder item), the full 5-panel trailer, the boot splash/logo/title sequence. See `HANDOVER.md` §01b for exact details.
