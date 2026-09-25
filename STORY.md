# The Secret of the Lost Codebook — Story

*Narrative reference — drafted 2026-09-17, rewritten 2026-09-17 around a single-quest structural fix. This is the story bible: premise, cast, and beat-by-beat plot. For what to build next and to what standard, see the master build plan in `ROADMAP.md`; for how the code and pipelines work, see `HANDOVER.md`; for the chronological build log, see `CHANGELOG.md`.*

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

The Professor's Precisely Worded Question goes inside it: **"Do first-years who attend more Methods lectures get better exam results? (this winter term)"** — attendance is what Act II's survey measures, exam results are what later acts link it to. From here on the player isn't completing lessons — they're trying to turn one miserable grad-student idea into something the Professor will actually accept, and every department unit insists its particular contribution is mandatory before the project can proceed. The folder is inspectable at any time and visibly grows/changes stamp across the game:

| After | Stamp reads |
|---|---|
| The Corridor (Act I) | `STATUS: QUESTION EXISTS` |
| Library + Hall of Founders + Workshop + Seminar Room (Act II) | `STATUS: THEORY EXISTS` *(the sealed Prediction Slip, carrying the hypothesis)* |
| Survey Lab + Ethics Tribunal + The Mensa + Fieldwork Arena (Act III) | `STATUS: QUESTION HAS DATA` *(the Professor: "Where did these numbers come from?")* |
| Statistics Basement + Delegation Engine + Bureau of Implications (Act IV) | `STATUS: EVIDENCE VERIFIED` |
| Gap Registry + Writing Room (Act V) | `STATUS: CLAIM DEFENSIBLE` |
| The Office, then the submission chute (end of Act V) | `STATUS: SUBMITTED` |
| The decision letter (outro) | stamped `REVISE AND RESUBMIT` — by the journal, not by anyone the player has met |

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

**Stage two (at the end of Act V, just before submission):** the player returns to the Seven-Second Office — same room, same Professor, same skeleton — and puts the finished paper on her desk.

> *The seven-second hourglass turns over. He reads. For once, he doesn't immediately object.*
> **PROFESSOR:** "Hm."
> **PLAYER:** "So... that's it?"
> **PROFESSOR:** "That's what?"
> **PLAYER:** "The Codebook."
> *(he looks genuinely confused)*
> **PROFESSOR:** "The what?"

The player explains — the Corridor, the Doorman, the chapters, the rumors that started it all.

> **PROFESSOR:** "Oh. That." *(pause)* "We used to call it Methods."

Then he reads the abstract, the hourglass runs all the way out without him interrupting, and he says the two words the player has been trying to earn for five acts:

> **PROFESSOR:** "It's accurate." *(beat)* "Send it."

**The player submits the paper**, and the act ends there. **Stage three — the verdict — is not delivered by anyone in the department.** It arrives four months later, from a journal, in an envelope, alongside eleven pages from Reviewer 2: **REVISE AND RESUBMIT**. See "The Outro" for the full scene. This is deliberate: the Professor being the one to stamp R&R made the game's last judgement an act of mercy from a character the player already trusts. Coming from outside, it is a verdict on the work rather than a favour, and it lets the Professor's own line — *"For a first submission? That's a triumph"* — be reassurance instead of self-congratulation.

This is the whole game's shape: a mythologized secret that turns out to be the mundane, everyday name for the thing the player just spent five acts learning to do. Every act needs to earn that ending by being funny and specific on its own terms — see below.

---

## The main arc

*Read this section before any single act. The acts below are the detail; this is the shape they have to add up to.*

### The spine

A student wants to finish a project quickly. They are refused five times, and each refusal turns out to be a thing they actually needed. That is the whole game.

| Act | What the player wants | What they are told | What they leave with |
|---|---|---|---|
| **I — The Question** | a topic, today | you do not have a question, you have a topic | a question precise enough to be answered, and the knowledge that one counterexample can kill a claim |
| **II — Apparently We Need a Theory** | to go and collect data | you cannot interpret data you had no expectation about | an idea about how the world works, plus one testable hypothesis derived from it, sealed while it could still be wrong |
| **III — Apparently We Need Data** | to ask some students | you may not approach human beings without permission, an instrument, and a defensible sample | real answers from real people, with a known response rate and a documented sampling frame |
| **IV — Apparently Numbers Don't Speak for Themselves** | a result | a number is not evidence until somebody checks it is the number you promised, and it means nothing until somebody says what it means | an analysis that matches the sealed slip, an audit it survived, and an honest interpretation |
| **V — Apparently Somebody Has to Write It** | to be done | a finding is not a contribution, and a contribution is not a paper | a claim proportional to what was shown, written down, and submitted |

Five acts, five refusals, and the same underlying joke each time: **the department is ridiculous and it is also right.** If either half fails, the game fails — a department that is merely absurd teaches cynicism, and a department that is merely correct is a textbook with jokes on it.

### What actually changes in the player

The verbs change, act by act, and this is the thing to protect when writing any individual room:

1. **Act I — the player is a supplicant.** They wait, they are interrupted, they are ejected after seven seconds. The department acts on them.
2. **Act II — the player starts acting on the department.** The Stockholm phone scam is the turning point of the entire game: it is the first time the player manipulates an institution instead of petitioning it. They are not being taught any more; they have started operating.
3. **Act III — the player runs an operation.** Four institutions, a sampling ceremony, a live response-rate board. They are competent, and they know it.
4. **Act IV — the player is tempted.** For the first time, the obstacle is not a bureaucrat. It is a room full of green lamps offering them exactly what they want, and an assistant who will give it to them faster. Nobody is stopping them. That is the point.
5. **Act V — the player refuses help.** The only act whose verb is *resist*. KIRA offers to write it and Feldstrom offers to make it enormous, and the correct move is to say no to two people who are being generous. Then they submit it, which is the first time in five acts they give the folder away.

Panic → competence → temptation → integrity. If an act's rooms do not sit somewhere on that line, they are in the wrong act.

### The mystery, and how it stays alive

The Codebook is never in any room. Each act quietly implies it is somewhere further in — the Doorman says the player has completed "Chapter One", and every institution afterwards behaves as though the project it is obstructing is a chapter of something. The player is collecting a folder and assumes the folder is the trail.

**Stage one** (end of Act I): the Codebook is redirected, not revealed — *"No. I said this was the door."*
**Stage two** (the ending): the Professor has never heard of it. *"Oh. That."* (pause) *"We used to call it Methods."*

See "The two-stage reveal" above for both scenes in full. The rule for every act in between: **nobody credible ever confirms the Codebook exists.** Rumour, signage and KIRA can imply it freely. The Professor, the Skeptic and the Visiting Fellow never mention it.

### The argument the game is actually having

Underneath the jokes, two people are disagreeing, and the player is the answer.

- **The Professor** was destroyed once for claiming too much, and now claims almost nothing. She is precise and she is diminished.
- **Feldstrom** has never been destroyed for anything, because nothing he says could be checked. He is ambitious and he is empty.

Each thinks the other learned the wrong lesson from the same era, and each is half right. The player's finished folder is the third position and the only defensible one: **an idea big enough to be interesting, stated narrowly enough to be tested, with the evidence attached.** The game never states this; it stages it, by having the same person walk out of Feldstrom's workshop with a smaller claim and into the Professor's office with a bolder one than she would have made.

That is also why Feldstrom appears twice. In Act II he inflates the player's *theory*; in Act V he inflates the player's *result*. The player refuses him both times, and the second refusal costs more, because by then they have something they are proud of.

### Character through-lines

Each of these must land in at least two acts or it is not a through-line, it is a gag.

- **KIRA** — Act II she is helpful and wrong. Act IV she has run and nearly submitted the whole study. Her arc is four words long: *"Certainly!"* becomes *"Certainly. …What exactly do you mean?"* Nothing else about her changes, and nothing else should.
- **Feldstrom** — Act II, where he owns the Hypotheses Accelerator and fights the player over the scope, and Act V, where he wants to retitle the paper and needs no machine to do it. Stockholm never calls in either; the telephone pays off in the Writing Room with the car-warranty call.
- **The Professor** — first and last conversation of the game. In between, her hidden *Death of Community* paper is findable in Act I and explains everything she does.
- **The Skeptic** — gates the Corridor in Act I, and returns in Act IV when the result comes back null, because a null result is the only thing in the game she finds genuinely delightful. *Things I Was Wrong About, Vol. XI* gets an entry.
- **The Doorman** — gates Act I, and gets the last line before the reveal. *"You knew." / "Eventually."*
- **The Research Folder** — in every act, defaced by every institution, and its final stamp is the punchline.

### Where the acts are unequal, and what to do about it

Written honestly, so nobody rediscovers this mid-build:

- **Act I is built and is the model.** Every later act is measured against it, not against its own design doc.
- **Act III is built** and structurally the strongest of the unbuilt-narrative acts, because its four rooms already interlock.
- **Act II is designed in the most depth** and is now the largest act on paper. It will need trimming during the build, not expansion.
- **Act IV is three rooms** doing three different jobs (temptation, emergency, interpretation). It is where Act II gets paid off and where the null result has to land, so it carries more weight than its room count suggests.
- **Act V is two rooms** and is the act most likely to be cut down during the build, because "write the paper" resists being a puzzle. The Gap Registry is the part to protect; the Writing Room's four-sentence assembly is the part that will need the most prototyping to not feel like homework.
- **The outro is a cutscene, not a room**, and should be built with the trailer pipeline rather than the room pipeline.

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
- **Prof. Dr. Magnus Feldstrom** — a traffic-flow physicist who crossed into the social sciences and never changed his toolkit; the Professor's structural opposite, hates claims that are too *small*. Still waiting for a phone call from Stockholm. **Appears twice**: in **Act II** his Hypotheses Accelerator is how a theory becomes a hypothesis — he has taped over the control that does it, and has to be tricked out of the room before the player can run the machine the other way — and in **Act V** he tries to inflate the title of the finished paper, with no machine at all. Genuinely helpful, genuinely unmoored; the contrast with the first Professor (one hates overreach, one hates timidity) is the joke, not a twist.
- **The Visiting Fellow** (Act II, Seminar Room) — believes, serenely, that the answer is always selection, because selection destroyed her own dissertation. Never hostile, always asking how you would tell a real effect apart from the students simply being different. The Skeptic's academic cousin, and right often enough to be irritating. **The only genuinely competent person in the department** — and the only one with no title, no room and no apparatus. Never the butt of a joke.
- **Tobi** — *Strategic Visibility & International Growth*, the only character with no room of his own. A young, immaculate, relentlessly friendly marketing hire who roams the campus and turns up wherever you did not want him. Permanently on his phone. Speaks a dialect assembled entirely from LinkedIn. Doubles as the International Office, because the university merged the two posts and nobody objected. He is the game's one piece of satire aimed at the modern business of universities rather than at research itself, and he should never be cruel — he is genuinely delighted by everything, which is what makes him unbearable. Full design below.
- **The Registrar of Gaps** (Act V, Gap Registry) — helpful, tired, and in possession of a filing cabinet full of pre-approved holes in the literature. Not a fool: he is the one who says that a gap is a hole and a contribution is a hole that mattered.
- **The Implications Clerk** (Act IV, Bureau of Implications) — sells meanings in three sizes and does not read the number you hand over, only the size you ask for.
- **Reviewer 2** (referenced from Act I onwards, seen only after the credits) — spoken about across the whole game as a kind of academic weather system: *"Reviewer 2 will ask."* / *"Who is Reviewer 2?"* / *"Nobody knows."* Delivers eleven pages and forty-seven contradictory comments, one of which is completely correct. **Is, it turns out, a monkey**, and the game never explains this or resolves whether the monkey or the submission software actually wrote the review.
- **The Founders** (Act II, Hall of Founders) — busts and portraits who nod approvingly at everything, including contradictions and blank cards. Non-speaking, but the room's main antagonist.
- **The skeletons** — one per room, each a different flavor of research despair. Confirmed/new instances below, per act.
- **The Research Folder** — not a character, but close to one by the end: the single physical object every act stamps, and the thing whose final state is the whole game's punchline.

---

## Character backstories

**The design rule:** every character has had exactly *one* formative academic experience, and has since turned the lesson from it into a universal rule. That is what makes them people rather than embodiments of textbook concepts — and it means their methodological position is psychologically motivated, not arbitrary. Feldstrom is the template: he isn't "the man who overgeneralises," he's a physicist who once successfully explained twelve thousand cars with three equations and has been trying to do it to humanity ever since.

**Be ruthless about how much of this reaches the screen.** These histories are brilliant primarily because *you* know them; the player should feel that there is more underneath without ever being given the biography. The rule for the build is **one prop and one line per character** — that is the budget, and it is enough:

| Character | The one prop | The one line |
|---|---|---|
| Feldstrom | the 742-page traffic thesis | "The cars kept containing people." |
| The Professor | *The Death of Community*, hidden | "Twenty-two. One moved." |
| KIRA | the conveyor belt of THE LITERATURE | "It was highly relevant." |
| The Visiting Fellow | her dissertation, stamped SELF-SELECTION | "I was convinced once." |
| The Nurse | the nine-wave item, still in the questionnaire | "What is the reference period?" |
| The Chair of Consent | the twelve-page form | "They had consented." / "To what?" / "Exactly." |
| The Keeper of Data | BEVERAGE VESSEL 0047 | "Need-to-know." |
| The Representative | — | "Anonymous?" |
| The Sampling Officer | the family portraits behind the drum | "Father insisted on equal inclusion probabilities." |
| The Fieldwork Director | the champagne photograph | "I know *which* three." |
| The Doorman | the class photograph | "Eventually." |
| The Skeptic | *Things I Was Wrong About, Vol. XI* | "They're the interesting ones." |

Everything else in this section is background for whoever writes the dialogue. If a scene needs a second beat of somebody's history to work, the scene is probably doing too much. None of it should ever be delivered as exposition; it comes out in one-line answers to `Talk To`, in objects lying around rooms, and in things other characters refuse to discuss.

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

**This is what her relationship with Feldstrom is made of.** They may well have been contemporaries. Feldstrom thinks the Professor became a coward. The Professor thinks Feldstrom learned nothing. Neither is entirely right, and the player ends the game standing between them. Feldstrom calls her *"my esteemed colleague in the Department of Boundary Conditions."* The Professor calls Feldstrom *"Traffic."*

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

**And she is the only person in this department who is actually good at the job.** The player should be allowed to notice that on their own. Everyone else has one working instinct wrapped around one disfigurement: the Professor is precise because she was publicly destroyed, Feldstrom is ambitious because he never stopped being a physicist, the Sampling Officer is rigorous because it is a family liturgy, the Nurse is careful because of nine waves of a broken item, the Keeper is safe because of one email. The Visiting Fellow's damage produced *competence* rather than a ritual. She asks the right question every time, she is right more often than anyone finds comfortable, and she has no apparatus, no ceremony and no machine — a chair at the back and one finger.

Two rules follow:

- **She is never the butt of a joke.** Everyone else can be laughed at. She gets the room's best line instead, and it deflates rather than escalates.
- **She has the lowest standing in the building.** She is *visiting*. No room is named after her, no stamp, no title on a door. The one person who could actually referee this project is the one the institution has given nothing to — and the game should never point at that, only let it sit there.

(The Skeptic at the pond is her counterpart outside the institution: equally sound, equally unranked, cheerful where the Fellow is tired. They never meet.)

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

At the very end, after the Professor says the Codebook was only ever Methods, the player passes her one last time.

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
3. **The Rumor** — two students whispering in a dusk courtyard. *"Word travels, in hushed tones, of a professor who can turn any bad idea into a real one. If you can survive seven seconds of her patience."*
4. **The Legend** — a locked, older door; two students walking away from it, defeated. *"They say he keeps a Codebook. No one's seen it. Everyone's heard of it. Most who go looking end up reassigned to committee work."*
5. **Arrival** — a hand knocking on the Professor's office door, plaque reading "PROF. — BY APPOINTMENT (GOOD LUCK)." *"This is where it starts. Again."*

**Why panel 1 changed:** the original version opened on an already-rejected paper stamped "REVISE AND RESUBMIT" — which set up a confusing echo, since the *ending* also stamps the finished folder "REVISE AND RESUBMIT," and reusing the same stamp risks reading as "you failed" rather than "you won." The fix: the game was never about a paper that already failed, it's about panicking over a paper that doesn't exist yet. Opening on the same empty folder the Doorman later fills is a cleaner visual bookend than reusing a stamp, and it means R&R only ever appears once — at the end, where it can land clean.

**The ending's stamp is the achievement, not a callback.** R&R (revise and resubmit) is genuinely good news in academic publishing — it means the work survived without being desk-rejected. The game should say so explicitly rather than assume players know the norm (e.g. the Player asks "Wait, that's... good?" and the Professor confirms it plainly), so the win reads as a win for every player, not just ones who already know academic publishing conventions.

**Sequel tag (credits gag, not a commitment):** after "WELCOME TO ACADEMIA," a small closing title card — *"THE SECRET OF THE LOST CODEBOOK, PART TWO: THE REVISIONS — coming whenever the reviewers get back to us."*

**Status:** panels 1, 2, 3, 4, 5 are generated and wired into the game's boot sequence, verified in order end-to-end — **but panel 1's art still shows the old rejected-letter concept and needs regenerating** to match the revised prompt in `art/trailer/ART_PROMPTS.md` before the narration text above is wired in (keep the old image + old narration paired until then, so nothing on screen mismatches). Panel 2b ("The Spiral") is a new addition, not yet generated.

---

## Act I — The Question and the Corridor

*Rooms: The Seven-Second Office · Introduction to Systems Theory (Lecture Theatre) · Causality Corridor*

**The act's story.** The player wants a topic and they want it today. What they find is a woman who will not give them one, and a building that has evidently been refusing students for a very long time. The obstacle is never access — the Professor is right there — it is that she will not accept anything imprecise, and she will not stay in the conversation long enough for the player to be imprecise twice. The player's job is to work out what she is actually withholding: not approval, not a topic, but a sentence that could be answered. Everything else in Act I is the department teaching the same thing in a lighter key — the bingo card (a lecture can be entirely content-free and nobody in the room objects), the Corridor (a claim you reasoned your way to can still be wrong), and the pond (a claim that cannot lose is worth nothing). That last one is the seed of Act II, planted an act early and by a character the player has to *convince* rather than obey.

**Who changes:** nobody. The player is a supplicant for the whole act, which is why the ending matters — the Doorman hands them a folder, and for the first time they are carrying something instead of asking for something.

**What goes in the folder:** the Question. `STATUS: QUESTION EXISTS`.

**Backstory props to seed here** (see *Character backstories*): the Professor's hidden *Death of Community: Evidence from Twenty-Three Residents of Leicester* somewhere in the Office — it explains her entire personality and the player will not understand why until much later; the Skeptic's *Things I Was Wrong About, Vol. XI* on the pond bench; and the ancient class photograph with a young man in the back row wearing the Doorman's moustache.

Mechanically it is unchanged from before, and it's the model every later act should match: a dialogue gauntlet with a hard patience limit, six absurd desk-clutter pickups (a chewed pen, a mug reading "WORLD'S OKAYEST SAMPLE SIZE," a Likert-scale die, an hourglass tagged "7 SEC," a USB drive labeled "FINAL_v23_REALFINAL_USETHIS," a rubber stamp reading "SIGNIFICANT (p<.05)"), a professor who's either at the Office or the Lecture Theatre and never both, an undocumented bingo-card trick the player has to discover, and a guarded door with real stakes (pass all four causal-reasoning cases or fall). The optional citation-counter sidequest lives here too (see `HANDOVER.md` §01b). Entry to the Corridor now requires **both** the Question *and* having convinced the Skeptic at Probability Pond (see below) — the Doorman checks for both.

**Ending, revised — live and tested.** Clearing all four Corridor cases still makes the doors align into an archway — but the payoff is the Doorman exchange above ("Not here." / "This was the door." / "You've completed Chapter One."), and instead of consuming the Question, the Doorman hands over the Research Folder with the Question already inside it, stamped `QUESTION EXISTS`.

### Probability Pond — required before the Corridor

A fourth Act I location, always open like the other three — already teased as a background sign on the campus map ("Probability Pond · Still 50/50"). Two white swans sit on a pond beside a plaque declaring, with total institutional confidence: **"ALL SWANS ARE WHITE — established fact (n=2)."** This is Popper's classic falsifiability example, played straight as a puzzle: the universal claim only survives until someone finds a counterexample.

**Not a side quest — a gate.** The Skeptic (see Cast) sits on the pond's bench, unimpressed by the plaque, and won't vouch for the player until they demonstrate the concept, not just state it. This vouching is what the Doorman actually wants: turning up at the Corridor with the Question but without having convinced the Skeptic gets turned away — *"You don't know what to do with a wrong answer yet — there's a man by the pond who does. Convince him first."* This ties the pond directly into the critical path instead of leaving it optional.

**The chain:** `Talk To` the Skeptic first — he issues the challenge ("show me one counterexample"). A bottle of black ink is picked up in the Lecture Theatre (near the blackboard — the one physical link between this room and the rest of Act I). Carried to the pond and used on the correct swan, it turns black; the plaque gets stamped "FALSIFIED." `Talk To` the Skeptic again to explicitly walk him through *why* one counterexample is enough — that's the "explain it" half, distinct from "demonstrate it." He's won over, sets the flag the Corridor gate checks for.

**Why it fits:** it's a lighter, faster echo of the exact lesson the Corridor teaches at length (don't universalize from a small, non-representative sample) — but taught by convincing a skeptical person instead of solving a quiz, which makes it a genuine prerequisite rather than trivia.

**Status: fully built, wired in, and verified end-to-end** — including the hard gate at the Corridor's bell (`handleRing()` now checks `philosopherConvinced` before letting the Question through at all). Full implementation notes in `HANDOVER.md` §01c.

## Act II — "Apparently We Need a Theory"

*Rooms: The Library · The Hall of Founders · Feldstrom's Workshop · The Seminar Room*

**What the act is actually for.** Same as every other act: **there is a folder, and something has to go in it.** The player leaves the Corridor holding a folder stamped `QUESTION EXISTS` and goes looking for data, because that is obviously what comes next. The department disagrees. Nothing else in this act — not the Accelerator, not the portraits, not the telephone scam — is the point. The point is getting one pale-green form filled in, sealed, and into the folder, so the folder reads `THEORY EXISTS` and the Registry will finally release Form H-27. What is actually on that form when it is sealed is **an idea about how the world works and one testable hypothesis derived from it** — the thing Act III goes out and tests, and the thing Act IV breaks the seal to check.

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

**And that is where the hypothesis comes from.** A hypothesis is not a fifth ingredient, and the act should never present it as one. It is a **testable implication derived from the idea** — you ask what would have to be true, in some particular place, about some particular people, *if* the idea were right, and that is usually a different and much more specific sentence than the idea itself. If the mechanism is practice on worked examples, then one thing that follows is that the effect should concentrate on worked-example questions. The theory did not shrink; something checkable fell out of it. Feldstrom's Accelerator does this physically, which is why the machine sits at the centre of the act rather than in a later one: **the player has to feel the trade the dial is making.** Turn it one way and you get grandeur that cannot be checked; turn it the other and you get a sentence a hundred and forty students can disprove by Thursday. (Feldstrom will tell the player these are the same statement at different sizes. He is a physicist, he is wrong, and nobody corrects him.)

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
- ☐ **HYPOTHESIS AND FALSIFIER** — The Seminar Room

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

**The framed abstract.** The paper that contradicts KIRA has its abstract mounted prominently on the wall under a brass plate reading **EVIDENCE**. The conclusion is on the reverse side. Unfortunately, it has been framed. The literal, physical, slightly stupid lesson: *read past the abstract*.

**One tool, both jobs.** The thing that gets it off the wall is the same thing that gets the player up to the top shelf: the Hall of Founders' **ceremonial stepladder**, a heavy brass-and-mahogany object with a hook-headed pole clipped to the side for reaching portraits down. One fetch from the Hall, two uses in the Library — rather than two separate errands for two separate implements, which is exactly the kind of padding this act does not need.

**The chain:** the card catalogue verifies references one at a time, but the drawer for the relevant years is on the top shelf and the ceremonial stepladder is in the Hall of Founders. The **magnifying glass** (Act I) reads the DOIs and the tiny print. The **enrolment register** lives in this room and matters two rooms away. Blank index cards come from the catalogue drawer and are what the MECHANISM gets written on.

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

**The chain (reworked 2026-09-24, ROADMAP 8zc).** The founders talk — Weber on his own portrait, Marx and Durkheim through the others, their painted mouths moving — but each answers with his own grand theory and none of them gives a mechanism (*"Class struggle. Everything is."*, *"Bring me the suicide rates by region."*, *"Mechanisms are for engineers."*). The mechanism comes from **Professor G**, and only after the rap battle: before it he is too nervous (*"Not now. I'm nervous. Three founders, one Hall, one take. Ask me after the battle."*). Afterwards he gives it happily — but not into thin air: you need a blank catalogue card from the Library to write on, and the **chewed pen** from Act I to write with.

> **PROFESSOR G:** "A mechanism? After that? Happily." "Students who go to lectures keep meeting worked examples, so they practise exactly the kind of reasoning the exam asks for." "That's a mechanism. It says because, and it could turn out to be wrong. Now go and test it."

*(Before the rework the player wrote it themselves, crouched behind Max Weber where the Founders could not see, choosing between that sentence and a grand one that cited Weber.)*

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

### The Founders' Rap Battle — the Hall's set piece (designed 2026-09-24, not built)

Taken from the author's Christmas lecture, where the founders battle and **Professor G** — the
author's alter ego — closes with a Slim Shady rap. In the game it becomes the way the Hall's
lesson lands: three grand, quotable, **untestable** verses make the Authority Meter ring every
time, and then somebody asks for the evidence.

**The set-up.** Tobi has turned the Hall into a livestream: ring light, a phone on a gimbal, a
neon sign that says **RAP BATTLE**, and a banner reading *THE FOUNDERS' RAP BATTLE — powered by
Strategic Visibility & the International Office*. He hosts. The three portraits — **Marx,
Durkheim, Weber**, painted like the famous photographs — come alive in their frames and take a
verse each. Professor G, the department's local professor, stands at the side in a white
hoodie, hood up, and says nothing until it is his turn.

**The puzzle (small).** Professor G will not go on without his beat, and his beat is on the
**USB stick** from the Professor's desk in Act I (`theory_FINAL_v23_…` is not the only file
on it). Give it to Tobi. Tobi: *"A physical USB. Iconic. Very retro. Very authentic."*

**The payoff.** Professor G's verse is his own interlude: the lights drop, the full Slim Shady
recording plays (4:45, the author's own), lyrics as karaoke captions, Esc to skip. *"Will the
real social scientist please stand up"* blows the Authority Meter: the chandelier goes out, the
trumpets deflate, and the portraits **stop nodding**. With the Founders no longer watching, the
MECHANISM can be written openly — the crouch behind Weber becomes the fallback, not the only
way.

**Why this fits the room.** Every founder raps his own theory accurately, and every verse ends
by refusing to be tested. The Hall applauds all three. Professor G's chorus — *"I like to see
the evidence for what we are going to say / Explain the social world instead of bullshitting
your way"* — is the room's lesson stated outright, and it is the only verse the Authority Meter
cannot cope with.

#### Tobi's intro

> **TOBI:** "Hi hi HI, welcome back to UniLife Live! It's the Founders' Rap Battle, three
> legends, one Hall, zero consent forms! In the gold frame on the left, the beard that launched
> a thousand reading groups — **KARL MARX!** In the middle, the man who made suicide a
> statistic — **ÉMILE DURKHEIM!** And on the right, locked in his own iron cage since 1920 —
> **MAX WEBER!** Like, subscribe, and please do not touch the portraits."

#### Marx

> Yo, it's Karl, with the beard and the manifesto,
> Two classes in the room and I'm seizing the whole studio.
> You own the means of production? Cute. That's your beat.
> I own the contradiction, and the proletariat's on its feet.
> Surplus value, baby — you rap, the label keeps the profit,
> Alienated from your rhymes, and you cannot even stop it.
> History's a battle, every verse a class war,
> Base and superstructure — and the base is on the floor.
> Workers of the world, unite, you've got nothing but your chains —
> And a mic, and a hook, and a theory that explains.
> Don't ask me for a sample, don't bring me a test.
> Material conditions. I already know the rest.

#### Durkheim

> Émile in the house, the founder of the discipline,
> Treat my bars as things, 'cause they're facts. They're social. Listen in.
> You think you rap alone? That's the individual's illusion,
> The collective's in your throat, and that is my conclusion.
> Anomie, anomie, when the norms all fall apart,
> Suicide by region — I have maps, I have a chart.
> Mechanical, organic, solidarity in rhyme,
> Division of labour: you do the verse, I keep the time.
> Society is God, and this crowd's in effervescence,
> Every hand in the air is a ritual of our presence.
> Ecological fallacy? I've never heard the phrase.
> I've got Protestant provinces. Their rates. That's all it says.

#### Weber

> Max Weber on the mic, sociology's melancholy king,
> I built an iron cage and now I'm living in the thing.
> Protestant ethic: work, save, never party,
> Predestined to be chosen, so I rap and I'm not sorry.
> *Verstehen*, *Verstehen* — I understand your soul,
> I don't need to ask you, I interpret on the whole.
> This verse is an ideal type, it doesn't need to exist,
> One-sided accentuation, and reality's dismissed.
> Charisma on the mic, routinised by noon,
> Bureaucracy takes over and the beat's in triplicate soon.
> Value-free, they told me. I value every line.
> Disenchantment of the world — but this enchantment here is mine.

**The comedy is in the delivery.** They are not rappers; they are nineteenth-century gentlemen
reading bars dead straight, in period accents, over a beat that is slightly too modern for
them. After each verse the Authority Meter rings, the portraits applaud themselves, and Tobi
says something like *"The engagement on that is INSANE."*

**Each verse ends on the same move** — refusing a test (*"Don't ask me for a sample"*, the
ecological-fallacy dodge, *"it doesn't need to exist"*) — so that Professor G's *"I like to see
the evidence"* is an answer to all three, not a fourth opinion.

#### Assets this needs
- Painted portraits of Marx, Durkheim and Weber in the game's style, with mouth layers.
- **Professor G**: an original character inspired by the *Revival* cover — white hoodie, hood
  up, face half in shadow — with the author's features, plus a stage-lit interlude panel.
- Tobi's livestream kit dressed into the Hall; a neon RAP BATTLE sign.
- Voices: Tobi (still uncast), three founders (period German ×2, French ×1), a simple original
  beat under the founders. Professor G uses the author's own recording.
- Captions for the Slim Shady interlude, timed to the track.

### Feldstrom's Workshop — theory as scale, and where the hypothesis comes from

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

**THE HYPOTHESES ACCELERATOR, Mk III.** A proper contraption cannibalised out of his old traffic apparatus, and the most important machine in the game — because it is the thing that converts between a theory and a hypothesis, and it runs **both ways**.

The manufacturer's plate above the drum reads:

```
HYPOTHESES ACCELERATOR Mk III
  ◄ SPECIFY            GENERALISE ►
GENERAL IDEA IN — RISKY PREDICTION OUT
Specify until reality can answer back.
```

Underneath the plate, on a strip of masking tape, in Feldstrom's marker:

```
i.e. the same statement at different magnifications
```

**That correction is his, and it is wrong, and the game never says so.** A hypothesis is not a theory shrunk — it is a *testable implication derived from* the theory, which is usually a different sentence about a narrower thing. Feldstrom believes in magnification because he is a physicist and in his old field it was very nearly true. Letting the tidy metaphor belong to a character rather than to the manufacturer keeps the game's own teaching honest and gives the player something to notice on a second playthrough.

There are three ratchets:

| Control | ◄ SPECIFY ——————————————— GENERALISE ► |
|---|---|
| **POPULATION** | first-year Methods students ← students ← young adults ← humans ← social beings ← civilisation |
| **TIME** | this winter term ← academic year ← modernity ← recorded history |
| **CONTEXT** | one Methods course ← universities ← institutions ← society ← reality |

And a large red lever, **THEORETICAL SIGNIFICANCE**, with exactly two labels: `INSUFFICIENT` and `TRANSFORMATIVE`. Feldstrom will not allow it to rest between them.

**The tape.** The SPECIFY direction is factory-fitted and works perfectly. Feldstrom has covered the entire left-hand control panel with masking tape and written on it, in marker:

```
DO NOT
```

Peeling that tape off is, physically, the lesson of the act. The player does it with their own hands, and the first time they turn a ratchet leftwards the machine makes a noise nobody in the workshop has heard for years.

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

**The BOUNDARY CONDITIONS dial** is a big brass thing salvaged from the traffic rig, physically jammed at `IGNORE`. Fixing the scope is not "put register in machine": the enrolment register has to be clamped into Feldstrom's old **traffic-counting gate**, which is the one component that still knows how to recognise a bounded system — N = enrolled first-year Methods students, location = this university, period = this winter term.

First attempt, with Feldstrom in the room:

```
ACCELERATOR: ERROR: INCONVENIENT BOUNDARY CONDITION
```

He tries to drop the register into a waste basket marked **CONTEXT**. He will keep doing this. **Which is why he has to leave the room** — see the Stockholm scam below.

With him gone, the machine grudgingly rewinds, one heavy clunk per stage:

> CIVILISATION → HUMANS → STUDENTS → FIRST-YEAR STUDENTS → **FIRST-YEAR METHODS STUDENTS, THIS WINTER TERM**

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

### Deriving the hypothesis — the other direction of the same machine

With the tape off and the enrolment register in the gate, the Accelerator can finally be run the way the manufacturer intended, and this is the beat the whole act has been building to. The player puts their *theory* in and turns the ratchets **leftwards**, and what comes out the other end is a **hypothesis**:

> **THEORY** — attending lectures helps because students practise worked examples and the exam rewards that practice.
> ◄ SPECIFY
> **HYPOTHESIS** — among first-year Methods students this winter term, the attendance–performance gap will be larger on exam questions resembling the worked examples than on questions that do not.

Feldstrom watches this happen with the expression of a man watching someone dismantle a cathedral.

> **FELDSTROM:** "That is the same sentence, merely smaller."
> **PLAYER:** "It isn't the same sentence. It's something that would have to be true if the first one were."
> **FELDSTROM:** "…"
> **PLAYER:** "And it's small enough to check."
> *(long pause)*
> **FELDSTROM:** "That is what the left-hand side is for, yes."

**This is the distinction the act exists to teach**, and it is stated exactly once, by the machine's brass plate rather than by a character: *general idea in — risky prediction out. Specify until reality can answer back.* Feldstrom's entire pathology is that he only ever turns the dial one way, and his taped-on "correction" is him getting it slightly wrong in a way that is completely in character. The player's Act V refusal is the same gesture as turning the dial leftwards, made again when it costs more.

**The hypothesis is what Act III goes and tests, and what Act IV opens the seal to check.** It is the act's real output; `THEORY EXISTS` is just what the stamp says.

**Box filled: ☑ SCOPE.** Feldstrom, defeated, writes a small pencil correction on the folder itself — *"but see also: everything"* — and cannot be persuaded to rub it out.

**Why this box is on the form at all:** a prediction with no population is not checkable against any data anyone could collect. The room's failure mode is treating "applies to everything" as "is more theoretical."

**Running gag — the telephone.** See the Stockholm scam below; the phone is prominent from the first second the player enters.

### The Stockholm scam — Act II's set-piece puzzle

Feldstrom will not leave the Accelerator unattended. So the player has to get him out of the room, and the way to do it is to exploit the one thing he wants more than generality.

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

**What the player needs — exactly three things.** The temptation here is to make the scam require five collectibles, which turns the act's best set-piece into a fetch quest. **Three are mandatory:**

1. **Extension 4173** and the knowledge that he is waiting for Stockholm — the Workshop.
2. **Nobel notification protocol** — ask KIRA. She prints `PROCEDURE FOR NOTIFYING NOBEL LAUREATES` with the useful phrases highlighted and roughly half the document fabricated, which is *exactly* enough authentic-sounding language to bluff a man who wants to be fooled.
3. **The seven-second hourglass** from Act I — because Feldstrom judges the legitimacy of an international call by how bad the delay is. Call him without it and he says *"You are not calling internationally,"* and hangs up. With it, the player physically flips the hourglass before each line, and the connection's awfulness is what convinces him.

**Two more are optional**, and exist to make the call easier and funnier rather than possible at all:

- **The Hall of Founders' newspaper clipping** gives the correct wording of the economics prize. Without it the player can still get through the call, but one dialogue branch becomes a guess.
- **The Quotation Dispenser's phrase** — *"a confidential matter concerning recognition at the highest international level"* — is a free pass through the first exchange. Without it the player has to improvise something less grand and Feldstrom is fractionally harder to hook.

This is the general rule for the act: **keep the loops, lose the errands.** Optional clues that reduce friction are good. Mandatory clues that only gate progress are a tax.

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

**The obvious wrong branch, kept in.** If the player instead tells him the Committee's concern is that the scope is *too narrow*, he bellows **"I KNEW IT,"** runs to the machine and cranks it up another stage. The Accelerator now outputs **CONSCIOUSNESS IS ATTENDANCE**, and the player has made their own life harder by flattering him. This is the branch that teaches the player what kind of man they are dealing with.

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

**Box filled: ☑ HYPOTHESIS AND FALSIFIER.** The Visiting Fellow signs it, and hands the folder back with chalk dust on it that never quite comes off.

**Why this box is on the form at all:** this is the one that makes the other three worth having — it is the box Act IV opens the seal to check. The room's failure mode is treating "could be true" as "could be wrong."

**Skeleton:** at the seminar table, sign reading **"STILL AWAITING A MECHANISM."**

### The rooms contaminate each other

The four rooms are not four errands. They are mechanically interdependent — and the interdependence is not decoration, it is the act's argument expressed as level design: **the traffic between rooms is the traffic between theory and evidence.** Half the transfers carry an idea towards something observable, and half carry a fact back to correct an idea. The route is therefore not A → B → C → D but something closer to:

> **Library → Hall → Library → Feldstrom → Library → Feldstrom → Seminar → Library → Seminar**

| From | Object | To | Why |
|---|---|---|---|
| Hall of Founders | ceremonial stepladder (with hook pole) | Library | the catalogue drawer is on the top shelf **and** the contradicting paper is framed — one object, two uses |
| Hall of Founders | newspaper clipping (knowledge) | Feldstrom (by phone) | *optional* — the correct name of the economics prize |
| Hall of Founders | Quotation Dispenser phrase | Feldstrom (by phone) | *optional* — grandiose enough to be believed first time |
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
APPROVED
```

**And Form H-27 drops out anyway.** This is the important part, and it took a revision to get right: *the Registry accepts it.* The player is not sent back to do it properly, there is no failure message, and nothing blocks them. An institution that will approve formally correct nonsense is both funnier and truer than one that catches it, and the entire game's premise is that these bodies are ridiculous and right in unpredictable proportions.

KIRA arrives at a trot, delighted.

> **KIRA:** "Good news! Nothing currently observable could contradict your theory."

And from somewhere in the Hall of Founders, muffled applause.

**The consequence is deferred to Act IV**, which is much more powerful than a wrong-answer bounce. The player walks off with an approved theory, collects real data from real people over an entire act, and then breaks the wax seal in the Statistics Basement to discover that the sentence they sealed cannot tell them anything about what they found. They are not punished. They are simply unable to learn from four acts of work, and they did it to themselves with a form that everybody stamped.

**Implementation note:** this is the durable flag `theory_empty` (see "Three flags, not a story tree"). The coherence indicator reading `EVERYTHING EXPLAINS EVERYTHING` at the moment of sealing is what sets it.

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

> *(on the Accelerator)* **PLAYER:** "Maybe this will falsify it."
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

**The act's story.** The player has an idea about how the world works and a sealed promise about what would prove it wrong. Now they need people. What they discover is that **data do not exist until somebody makes them** — and that every number they will later analyse has a manufacturing history: who was asked, who agreed to answer, what words the question used, and who never turned up at all. Four institutions each own one step of that history and none of them will speak to the others. The act is at its best when the player realises that a defensible 75% is worth more than a suspicious 100%, and that a perfectly random sample of the wrong people is still the wrong people.

**The chain that makes the middle of the game click.** This is the single most important structural idea in the document, and it must survive the build: **the exact hypothesis the player derived in Act II determines what they are forced to collect in Act III.** The moment to engineer is the player standing in the Survey Lab realising *"oh hell — because I said that in Act II, I now have to measure this."*

Their hypothesis was not "attendance correlates with grades." It was: *the gap will be larger on exam questions resembling the worked examples, and smaller among students already getting equivalent practice elsewhere.* That sentence has three consequences, and none of them is optional:

| Because the hypothesis says… | Act III must obtain | Which room |
|---|---|---|
| …*larger on worked-example questions* | **item-level** exam performance, not a single overall mark — and a classification of which exam items resemble the worked examples | Ethics (linkage permission) + the Professor's own worked-example sheets from the Act I Lecture Theatre |
| …*smaller among students already practising elsewhere* | a survey item about alternative practice — textbook, tutorials, past papers | Survey Lab |
| …*among first-year Methods students, winter term* | a frame containing exactly those people | The Mensa |

**This gives the pseudonymous ID system a second and much better payoff.** In the current design the numeric IDs exist so that non-respondents can be chased. Now they are also the only way the survey answers can be **linked to exam records at all** — and record linkage is a far more serious thing to ask an ethics committee for than a questionnaire. The Chair of Consent, who has been ringing a bell at the idea of *asking* students things, has to be walked through the idea of *joining two datasets about the same person*. The player's plain-language consent form now has to say so, in words a first-year can understand, or the linkage is refused.

> **CHAIR:** "You wish to ask them questions."
> **PLAYER:** "And to look at their exam results."
> *(the bell rings twice)*
> **CHAIR:** "And they know this?"
> **PLAYER:** "That's what the form is for."
> **KEEPER OF DATA:** *(quietly, with approval)* "Numbered, not named."

**The Act II payoff:** the scope the player fought Feldstrom to impose — first-year Methods students, winter term — turns out to have been the sampling frame all along. The enrolment register they clamped into the Accelerator's traffic gate is the list the Sampling Officer needs. A decision that felt like a humiliation in a lean-to becomes the thing that makes Act III possible.

**Who changes:** the Fieldwork Director, who reaches for the old fraudulent reflex and stops himself. And the player, who stops being a student doing an exercise and starts being someone running an operation.

**What goes in the folder:** the responses, and H-27 with all four boxes ticked. `STATUS: QUESTION HAS DATA`.

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

**The correct frame is the Act II enrolment register** — the same battered list the player jammed into Feldstrom's traffic gate to force his theory down to a population that exists. It contains exactly the right people: first-year Methods enrolments, this winter term. But it contains their *names*, so the Sampling Officer cannot touch it until the Ethics Tribunal has pseudonymised it. What comes back is the **PSEUDONYMISED SAMPLING FRAME**: the same gilded frame, now full of numbered cards.

This is the cleanest possible Act II → Act III handover. The scope decision the player made under duress in a lean-to, to shut a professor up, turns out to have been the sampling frame all along — and they get to work that out themselves.

**The seductive wrong alternative: the Official University List.** Four thousand names, beautifully bound, produced on request by the administration, and enormously more impressive than a dog-eared course register. The Officer is visibly moved by its heft.

**Act I item reused — Magnifying Glass.** Microscopic print at the bottom: *"Includes only students registered for the university newsletter."* The Officer is unmoved (*"But it's a very large list." / "Still not the same thing." / "It has four thousand names." / "Still not the same thing." / "Alphabetised."*) — undercoverage, made physical.

**And the lesson that follows is his best one in the game**, because it reverses the thing he cares about most:

> **PLAYER:** "So we use the small one."
> **SAMPLING OFFICER:** "The small one has a hundred and forty names."
> **PLAYER:** "It has the *right* hundred and forty names."
> *(a very long pause)*
> **SAMPLING OFFICER:** "…my father would not have liked you."

A hundred and forty of the right people beats four thousand of the wrong ones, and a man who has spent his life revering a brass drum has to say it out loud.

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

## Acts IV and V — redesign (DRAFT, 2026-09-25, for discussion): the gold rush and the Annual Meeting

*The author picked Act IV from the "Replication Crisis" option and Act V from the "Conference"
option. This outline joins them. Until it is approved, the Act IV and Act V sections below
describe the game as built; once approved they are rewritten to match this.*

### The shape in one paragraph

*Revised again: the Annual Meeting of the discipline comes to this campus. That gives the gold
rush a motive and the conference an audience from outside.*

The Society's Annual Meeting is coming to campus this year, and the department is desperate to
impress. In Act IV the department finds "the Codebook" — KIRA's engine that turns any dataset into a
finding — and a gold rush breaks out. Every department comes back with a spectacular result.
The player alone runs the one boring test their sealed slip names, and gets something small.
In Act V the Annual Meeting arrives and takes over the rooms the player knows: the gold-rush
findings get the keynote and the crowds; the player gets Poster 312, in the Mensa, next to the
bins. The whole discipline is watching — the journal's editor among them, and, rumour has it,
Reviewer 2, lanyard turned the wrong way round. The conference is
where the claims meet an audience, and — in the Replication Session — the test of time,
compressed to ninety minutes. Then home, the submission chute, and Reviewer 2.

The spine does not change: **temptation** (Act IV — nobody stops you, everyone else is winning)
then **integrity in public** (Act V — you say only what you found, in front of people who
said much more and are being applauded for it).

---

### Act IV — "Apparently Numbers Don't Speak for Themselves": the Gold Rush

**Opening interlude.** The reel of clean data arrives in the folder. Two campus-wide emails,
one after the other. The first: **THE ANNUAL MEETING IS COMING TO US** — six weeks, the whole
discipline, "a unique opportunity to showcase our research excellence". The second, an hour
later: **KIRA HAS FOUND THE CODEBOOK.** It is a procedure — "run every
model, keep the one that works, describe it with confidence" — and it has a queue outside
KIRA's room within the hour. The Professor, reading it: *"Now the dangerous part. Nobody will
stop you."*

This is the Codebook mystery's cruellest turn: the thing the player has chased since Act I is
announced as found, and it is a p-hacking machine. (Stage two of the reveal still lands in
Act V: the Professor has never heard of *the* Codebook. "We used to call it Methods.")

**The rooms, and what the gold rush does to each:**

1. **KIRA's terminal** (built as 8zp). Now framed as the Codebook itself. A queue of familiar
   faces is visible, each leaving with a printout: Feldstrom (*"Civilisation Is Traffic,
   p < 0.0001"*), the Fieldwork Director (*"100% response rate, again"*), the Mensa cook
   (*"Schnitzel causes wisdom"*). The player gets their own Codebook report, finds its seven
   wrong lines, and the Professor circles what they missed. She stops at "p < 0.001":
   *"I had one of those once."* First crack in her armour.
2. **The Significance Casino** (the Basement, rebuilt as the act's set piece). The gold rush's
   trading floor: green lamps, slot machines of analyses, and a **DISCOVERY BOARD** announcing
   other people's wins in real time. Every pull pays out eventually. The sealed slip is the
   only chip that cashes honestly. The Skeptic leans in the doorway, the only person not
   playing. Breaking the seal stays the act's best moment; if the result is null, she is
   delighted, and everyone else on the floor looks at you with pity.
3. **The Bureau of Implications.** The clerk has sold out of LARGE (the whole department bought
   one) and is taking orders for EXTRA LARGE. The player writes their own interpretation with
   the evidence on the counter, as now.

**End of act — the humiliation beat.** The Annual Meeting programme is pinned up. Feldstrom: keynote,
in the Hall of Founders. The Fieldwork Director: plenary. The cook: shortlisted for best poster.
The player: *Poster 312, the Mensa, next to the bins.* The folder is stamped EVIDENCE VERIFIED, and it has never felt less like a
prize.

---

### Act V — "Apparently Somebody Has to Present It": the Annual Meeting comes to campus

*Revised the same day: first to stay on campus, then — the author again — "maybe the annual
meeting comes to the campus". The discipline's Annual Meeting, hosted here this year: a banner
over the gate, lanyards, coach parties of visiting academics, a coffee urn that is always
empty, and Tobi's International Growth office in a state of rapture. It is held in rooms the
player already knows — nothing new to build as a location; the rooms are redressed, and the
world stays small while the stakes get bigger.*

1. **Preparation: the Gap Registry and the Writing Room** (as built). The poster has to be
   written before Methods Day: the contribution relative to the three papers (Registry), the
   title Feldstrom keeps enlarging and the three words KIRA pushed over the line (Writing Room).
   The printer only takes the poster once the claim is proportionate.
2. **The Poster Session — in the Mensa** (set piece; its own mini-game). The dining tables are
   poster boards between the lunch queues. The player stands by Poster 312, next to the bins,
   for one hour of conference time; visitors arrive one by one and the player answers with what
   is in the folder:
   - the Helpful Stranger (a genuine question — answer it properly);
   - the person with "more of a comment than a question";
   - the one who only wants the free pens;
   - the Visiting Fellow, one raised finger: *"Selection?"* (the Act II card, the Act IV
     limitation — point at the sentence);
   - a Codebook enthusiast who asks why the effect is so *small*.
   The neighbouring gold-rush posters (the cook's *Schnitzel Causes Wisdom*, the Director's 100%)
   have queues and balloons. The Sampling Officer judges the best-poster prize by raffle.
3. **The Keynote — in the Hall of Founders** (set piece). The rap-battle staging, reused: the
   stage, Tobi livestreaming, the DJ, the crowd. Feldstrom presents *Civilisation Is Traffic* —
   and slide 14 is the player's own result, inflated into a law of social flow, without asking.
   The founders watch from their frames. The player can stand up in the Q&A.
4. **The Replication Session — in the Seminar Room** *(proposed; this is what makes Act IV pay
   off)*. The Visiting Fellow chairs it. The consequence board becomes the replication board:
   the gold-rush findings are re-run on fresh data, live, and fall one by one — schnitzel, the
   100%, civilisation. The player's result is the one that holds, because it was sealed in
   advance and claimed only what it showed. **The Professor is in the room.** She has sat in
   this seat before — *The Death of Community* was taken apart in exactly this kind of session —
   and when Feldstrom's law falls, the two of them finally face each other. A few lines, no
   more; the player stands between them with the only claim in the room that survived.
5. **The Office and the chute.** *"Oh. That. We used to call it Methods."* *"It's accurate. Send
   it."* The folder goes down the chute. Then the outro and Reviewer 2 as designed.

### Loose monkeys — and one of them is Reviewer 2 *(author, 2026-09-25)*

> Could we have some loose monkeys already in Act V? They broke out of a lab. Later it turns out
> one of them is Reviewer 2.

**The lab.** The Infinite Monkey Project, in the Psychology basement: monkeys at typewriters
since 1974, waiting for *Hamlet*. Output to date: no *Hamlet*, a great deal of "asdfghjkl".
On the first morning of the Annual Meeting, Tobi props the lab door open for a livestream
shot, and the monkeys get out. They are loose for the whole act.

**Running gags, one per room:**
- **Poster Session (Mensa):** a monkey steals the free pens (the pen hunter is outraged) and
  another sits eating the cook's *Schnitzel Causes Wisdom* poster.
- **Keynote (Hall of Founders):** a monkey gets to Feldstrom's laptop and advances his slides at
  random. Nobody can tell the difference.
- **Replication Session (Seminar Room):** a monkey in the back row, taking notes.

**One monkey is different.** The clues accumulate across the act, never commented on:
- its lanyard is on backwards — the rumour about Reviewer 2 at the meeting;
- early in the act it steals the Professor's red pen, and is never without it again;
- it stamps **MAJOR CONCERNS** on the gold-rush posters (nobody knows where it got the stamp);
- at the keynote it raises its hand in the Q&A, and Feldstrom takes the question;
- at the Replication Session it sits in the chair beside the Visiting Fellow, nodding at each
  finding that falls.

**The payoff is the post-credits scene**, which becomes a reveal instead of an ambiguity: the
same monkey — backwards lanyard, red pen — at the submission system, REVIEWER 2 mug beside it,
types "asdfghjkl", and the field resolves to *"The theoretical contribution remains
insufficiently developed."* (This supersedes the design note in *Post-credits: Reviewer 2*
that the scene must not resolve who wrote the review.)

**Tone guard:** the monkeys are never hurt, caught or mocked by the story; the joke is on the
people around them, who treat a monkey with a red pen exactly as they would treat a senior
colleague.

### What this reuses and what is new

- **Reused as built:** KIRA's terminal and the Professor's check; the Bureau; the seal and the
  Skeptic; the Gap Registry, Writing Room and title puzzles (moved into the Print Shop); the
  reveal, the chute and the outro.
- **Rebuilt:** the Basement as the Significance Casino.
- **New:** monkey sprites (a few poses: running, sitting, typing, the lead monkey with lanyard
  and red pen); the Act IV opening and closing interludes; Annual Meeting redressings of three existing
  rooms (Mensa, Hall of Founders, Seminar Room: banners, poster boards, a replication board);
  the Poster Session mini-game; the Replication board. No new locations.
- **Characters with new jobs:** the Fieldwork Director and the cook as gold-rush winners (and
  replication casualties); the Visiting Fellow as a poster visitor; Tobi livestreaming the
  keynote; the Professor at the Replication Session.

### Open questions

1. Replication Session: in, or does the conference end with the keynote?
2. Does the player stand up in Feldstrom's Q&A (a confrontation), or does the Replication
   Session carry that alone?
3. Poster Session: how many visitors, and what is the cost of a bad answer (the crowd drifts
   to the neighbouring gold-rush poster)?
4. Reviewer 2: keep the outro as a cutscene, or make the decision letter a playable battle?
5. Act V title: "Apparently Somebody Has to Present It", or keep "…Write It"?
6. ~~Reviewer 2 at the meeting~~ — answered: a loose lab monkey with a backwards lanyard and the
   Professor's red pen (see *Loose monkeys*).
7. How visible should the lead monkey be: a sprite that turns up in every Act V room, or a few
   staged moments only?

---

## Act IV — "Apparently Numbers Don't Speak for Themselves"

*Rooms: The Statistics Basement · The Delegation Engine · The Bureau of Implications*

The analysis-and-interpretation act, and the reason the Prediction Slip was sealed. (The Library moved to Act II when theory became its own act; KIRA's "I already did it" emergency moved in here; and the discussion — *what do these results actually mean?* — is now a room of its own rather than a line at the end.)

**The act's story.** The player has numbers and wants a result. For the first time in the game **nobody is obstructing them** — and that is the design. Acts I to III were about institutions saying no; Act IV is about three things saying yes. The Statistics Basement will give them a result if they keep flipping switches until a lamp comes on. KIRA will give them an entire finished paper if they simply leave the room. And the Bureau of Implications will give them a meaning — any meaning, pre-printed, in whatever size they like. All three offer exactly what the player wants, faster than they could get it honestly.

The act is therefore about **accountability**: whose name is on this, who checked, and who decided what it means. It is the only act where the player can lose by doing nothing, because the SUBMIT MANUSCRIPT lever descends whether or not they act.

**Who changes:** KIRA, permanently and very slightly — this is where *"Certainly!"* finally acquires a hesitation. And the Skeptic, who turns up if the result is null and is the only person in the department who is pleased.

**What goes in the folder:** an analysis that matches the slip, an audit that survived, and — new — a written interpretation that says what the numbers do and do not support. `STATUS: EVIDENCE VERIFIED`.

### The Statistics Basement — the casino

**Every p<.05** sets off a brass bell, a green lamp and a little mechanical banner reading **DISCOVERY!** Twenty switches, wired to nothing in particular, invite the player to keep flipping until something rings. Nothing stops them. The room *wants* them to test everything and report whatever lit up.

What it is really testing is whether the player runs the analysis they promised. The sealed slip names one hypothesis: the honest path tests that one, reports the effect with its uncertainty, and accepts a dull answer. The tempting path finds p = .049 on the twentieth switch, and the room throws a small party.

**Breaking the seal is the game's best moment and should be staged as one.** The wax comes off, and the player reads a sentence they wrote themselves, weeks ago, before they knew anything — and then compares it to what actually happened. This is the act that makes Act II retrospectively worth having done, and it is the only place the game can show what "testable" was ever for:

- If the hypothesis **holds**, it means something, precisely because it was written when it could have failed. Nobody in the room is impressed, which is correct.
- If it **fails**, the player has learned something real — *provided the estimate is precise enough to have learned anything*. This needs care, because "a null is informative because it was predicted in advance" is not quite true on its own. An imprecise null means only that we do not know. So the honest analysis has to come back with an interval tight enough to rule out the effect the theory needed, and the Skeptic gets something genuinely worth celebrating. If the player's data are too thin for that, she says so instead:
  > **SKEPTIC:** "You have not found no effect. You have found a large interval."
  >
  > **PLAYER:** "Is that bad?"
  > **SKEPTIC:** "It's honest. It just isn't news."

  When the interval *is* tight, it is a finding, and Volume XI gets a new entry. This is the one place in the game where the difference between *absence of evidence* and *evidence of absence* has to be exactly right, because everything the game has said about null results depends on it.
- If the player never really had a theory (the `EVERYTHING EXPLAINS EVERYTHING` route), the seal comes off and the slip says *something will probably happen*. It is consistent with the result. It would have been consistent with any result. **The data cannot teach the player anything, and that is the punishment** — not a scolding, just a form that turns out to be worthless at the exact moment it was needed.

**Wrong path the game allows in full:** take the .049, print the banner and walk out with it — then have the audit point out that twenty tests were run and that the slip predicted something else entirely. The line to use is **"Twenty chances at five per cent is not five per cent"** — memorable, and it avoids the common mis-statement that one in twenty lights up by chance (with twenty independent tests the chance of at least one false positive is about two in three, and the game does not need the arithmetic, only the correct shape of the claim). A skeleton clutches a single lit bulb: **"p = .049. I KNEW I WAS RIGHT."**

### The Delegation Engine — "KIRA has already submitted it"

Reframed from an auditing exercise into a narrative emergency. The player arrives and KIRA cheerfully announces: **"Good news. I have prepared the manuscript and scheduled submission."** She has merged the data, cleaned it, analysed it, produced figures, drafted an abstract, and booked the social-media announcement. A gigantic lever is slowly, visibly lowering towards **AUTO-SUBMIT**. The bogus finding isn't just wrong any more — the player's name is already on it.

(She has *scheduled* it, not sent it. Act V is the act where the paper actually gets written and submitted, so this room has to stop the lever rather than recall a submission — otherwise Act V has nothing left to do.)

Every time the player says "just rerun it," KIRA chirps **"Certainly!"** and produces another wrong result, faster. The player has to actually read her merge log, spot-check a real record against something they personally observed at the Mensa, and tell her the precise fix — not "try again", an exact instruction — before the lever reaches AUTO-SUBMIT.

**Her arc lands here.** After the player has corrected her three times with specifics, the catchphrase finally breaks:

> **PLAYER:** "Redo the merge."
> **KIRA:** "Certainly. …What exactly do you mean?"

Nothing else about her changes. She does not become wise, or sad, or human. She asks one question, and that is the whole four-act arc.

### The Bureau of Implications — what does it actually mean?

**New room, and the one that makes Act IV an act rather than two puzzles.** A long counter, a queue rope, and behind it a clerk with a conveyor belt of **pre-printed implications** in three sizes. You hand over a number. They hand you back a meaning.

```
SMALL      "…suggests a possible association."
MEDIUM     "…indicates that attendance drives achievement."
LARGE      "…demonstrates that lectures are essential to learning."
```

The clerk does not read the number. The clerk reads the *size you asked for*. There is a laminated sign: **WE DO NOT STOCK "WE DON'T KNOW" — TRY THE BASEMENT.**

**What the room teaches**, and nowhere else in the game does:

1. **The result is not the meaning.** A coefficient is not a sentence about the world, and turning one into the other is a separate act of judgement the player has to perform themselves.
2. **Size matters and significance doesn't say much.** A tiny, beautifully significant effect gets a party in the Basement and is almost useless here. The Bureau has a **SO WHAT? gauge** which the significance lamp does not move at all.
3. **Limitations are not an apology.** One wall is covered in brass plaques, every single one reading **"FURTHER RESEARCH IS NEEDED"** — the department's ritual genuflection, said by everyone, meaning nothing. The player's job is to write the two or three limitations that are actually *specific to this study*: the sample was one course at one university, the design cannot separate attendance from motivation, and a quarter of the people never answered.
4. **The alternatives that survived.** The Visiting Fellow's card comes back one final time. If selection cannot be ruled out, the honest sentence has to say so — and saying so is not weakness, it is the reason anyone should believe the rest.

**The puzzle.** The player assembles the interpretation from their own materials rather than from the conveyor: the effect and its uncertainty from the Basement, the sealed hypothesis, the response rate from the Fieldwork Arena, the sampling frame from the Mensa, and the surviving alternative from the Seminar Room. Hand the clerk anything pre-printed and it is accepted instantly, stamped, and comes back to bite in Act V when the writing has to rest on it.

**Wrong path the game allows in full:** buy the LARGE implication. It is cheap, it is immediate, and the Bureau is delighted. It becomes the abstract in Act V, and it is the exact sentence Reviewer 2 takes apart in the outro.

> **PLAYER:** "Which one is true?"
> **CLERK:** "We don't stock true. We stock *sizes*."

**Skeleton:** in the queue, still holding a ticket, sign reading **"WAITING TO FIND OUT WHAT IT MEANT."**

---

## Act V — "Apparently Somebody Has to Write It"

*Rooms: The Gap Registry · The Writing Room*

**The act's story.** The player has a verified result and an honest interpretation. They want to go home. Instead they discover the last thing nobody warned them about: **a finding is not a contribution, and a contribution is not a paper.** Somebody has to decide what this adds to what was already known, and then somebody has to write the thing, and both of those are judgement calls that no committee, machine or assistant can make for them.

This is also the act where the player finally **refuses help** — the only act whose verb is *resist*. Everyone else in the game withheld; here, two characters offer. KIRA offers to write it. Feldstrom offers to make it matter. Both are being generous, and turning them down costs something, because by now the player has something they are proud of.

**Who changes:** the player, in the only way the game cares about — they say what they are entitled to say and no more, while somebody they like is begging them to say more.

**What goes in the folder:** nothing new. The last stamp is for what the player *didn't* add. `STATUS: CLAIM DEFENSIBLE` — and then the folder is submitted.

### The Gap Registry — what is the contribution?

A dim office of filing drawers, each containing a pre-approved **GAP IN THE LITERATURE**, available to anyone who asks. The registrar is helpful, tired, and has heard every possible claim to novelty.

```
DRAWER 1   NOBODY HAS STUDIED THIS IN GERMANY
DRAWER 2   NOBODY HAS STUDIED THIS SINCE 2019
DRAWER 3   NOBODY HAS STUDIED THIS ON A TUESDAY
DRAWER 4   NOBODY HAS COMBINED THESE TWO THINGS BEFORE
```

Any of them can be taken, free, and pasted into the paper. They all work. They are all worthless, and the room's lesson is exactly why:

> **PLAYER:** "So what's wrong with 'nobody has done it before'?"
> **REGISTRAR:** "Nothing at all. Nobody has counted the paving stones outside either."
> *(beat)*
> **REGISTRAR:** "A gap is a hole. A contribution is a hole that *mattered*."

**KIRA returns**, with the conveyor belt of 14,822 sources, now genuinely useful for the first time: the honest contribution can only be stated in relation to what was already known, and that means the reading list from Act II has to come back out and be *compared against* the finding. Three real papers, one result, and the question of what is different now.

**What counts.** Not "nobody did this", but something like: *the association is concentrated in exactly the place the practice mechanism predicts, which the existing cross-sectional work could not distinguish; and it is weaker than the cited estimates, which were not adjusted.* Small, specific, and connected to a named body of work.

**Feldstrom is here too**, and this is where he starts:

> **FELDSTROM:** "Your contribution is a general law of social flow."
> **PLAYER:** "My contribution is a boundary condition on three existing papers."
> **FELDSTROM:** "That is not a contribution. That is a *footnote*."
> **PLAYER:** "It's a true footnote."
> **FELDSTROM:** "…" *(he writes it down)*

**Skeleton:** wedged inside an open filing drawer, sign reading **"FOUND A GAP. IT WAS A GAP FOR A REASON."**

### The Writing Room — the abstract is where people lie

The last room in the game, and the one where every earlier temptation returns at once, because **the abstract is where overclaiming actually happens in real academia** — not in the analysis, not in the theory, but in the four sentences most people will be the only thing anyone reads.

A long table, a typewriter, and two collaborators who both want to help.

**KIRA offers to write it.** She is now genuinely good at this, which is the trap — her abstract is fluent, well-structured, correctly formatted, and says slightly more than the data support in a way that is very hard to point at.

> **KIRA:** "I strengthened the phrasing."
> **PLAYER:** "Change it back."
> **KIRA:** "Certainly. …What exactly do you mean?"
> **PLAYER:** "'Associated with'."
> **KIRA:** "That is weaker."
> **PLAYER:** "That is what happened."

**Feldstrom offers a title.** This is where his machine's logic returns without the machine — he no longer needs the brass, he just talks. Each suggestion is a full magnification step upward, and each one is *slightly* tempting:

> LECTURE ATTENDANCE AND EXAM PERFORMANCE IN A FIRST-YEAR METHODS COURSE
> → WHAT MAKES STUDENTS LEARN
> → EDUCATIONAL EXPOSURE AND HUMAN CAPITAL FORMATION
> → INSTITUTIONS AND THE PRODUCTION OF HUMAN CAPACITY
> → **CIVILISATION IS TRAFFIC**

An **IMPACT** gauge on the wall climbs alongside: *Modest Contribution* → *Paradigm Shift* → *Nobel Adjacent* → **PRESS OFFICE HAS BEEN ALERTED.**

At the top of the scale Feldstrom just whispers: *"Stockholm."*

**And the telephone rings.** Both of them freeze. He turns very slowly towards it.

> **FELDSTROM:** "Nobody move."

He answers. A long pause. His expression collapses.

> **FELDSTROM:** "Yes. I am aware that my vehicle's warranty is expiring."

Click. Then, without missing a beat:

> **FELDSTROM:** "They'll call back."

**The refusal.** When the player finally turns him down, he is not angry. He is disappointed in a way that is slightly sad, because he means every word of it:

> **FELDSTROM:** "You could have had all of it."
> **PLAYER:** "I'd rather have the part that's true."
> *(long pause)*
> **FELDSTROM:** "…that is the smallest thing anyone has ever said in this room."
> *(beat)*
> **FELDSTROM:** "Write it down."

**The puzzle — find the words that cross the line.** An earlier draft had the player assembling the abstract from four boxes, one per act. That was homework. By Act V the player is good at this, so the final puzzle should be **subtle rather than laborious**: KIRA writes an abstract that is almost perfect, and the player has to find the two or three individual words that have quietly crossed the evidential boundary.

| KIRA wrote | It should say | Why it matters |
|---|---|---|
| attendance **improved** performance | attendance **was associated with** performance | the design cannot support a causal verb |
| the results **demonstrate** | the results are **consistent with** | one study, one course |
| among **people** | among **first-year Methods students** | the scope Feldstrom was dragged down to |

Three words, in four otherwise excellent sentences, and none of them is flagged. The player has to read their own paper properly — which is the last methodological act of the game and the one most researchers skip.

Simultaneously, Feldstrom is working on the title. So the final challenge is not construction but **resisting two entirely plausible forms of overclaiming at once**, from two people who are trying to help.

If the player bought the LARGE implication in Act IV, one sentence is locked and cannot be corrected — the interpretation they accepted becomes the claim they publish. That is the consequence, and it lands in the outro.

**Wrong path the game allows in full:** let Feldstrom title it and KIRA write it. The press office is alerted. A small newspaper mock-up appears with the player's name under a headline about civilisation. The game does not stop you, and there is no fail screen — only a much worse outro.

**Skeleton:** at the far end of the table, one hand on a typewriter, sign reading **"STILL POLISHING THE ABSTRACT."**

### The Office, and submission

The player takes the finished paper to the Seven-Second Office. This is where the **two-stage reveal** pays off — the Codebook turns out to be a thing the Professor has not thought about in thirty years (see "The two-stage reveal" above for the full scene):

> **PROFESSOR:** "Oh. That." *(pause)* "We used to call it Methods."

He reads the abstract. The hourglass turns over and, for once, runs all the way out without him interrupting.

> **PROFESSOR:** "Hm."
> **PLAYER:** "Is that good?"
> **PROFESSOR:** "It's accurate."
> *(beat)*
> **PROFESSOR:** "Send it."

**The submission ritual.** Down the corridor, a brass chute labelled **MANUSCRIPT SUBMISSION — NO REFUNDS.** The folder goes in. It is, after five acts, the first time the player gives the folder *away*.

A distant thump. Then silence. Then a small printed card comes back up the chute:

```
SUBMISSION RECEIVED
Your manuscript is now under consideration.
Please do not contact the editorial office.
```

Folder update: `STATUS: SUBMITTED`. Cut to the outro.

---

## The Outro — Reviewer 2

**Order of the ending, fixed.** The old draft had the Professor speaking during the decision-letter sequence without the player having gone back to her, and it used the reverse-campus walk as a prologue to a letter that had not arrived yet. Correct order:

1. **The Office** — the Codebook reveal, *"It's accurate. Send it."* (end of Act V)
2. **The submission chute** — the folder goes in. `STATUS: SUBMITTED`.
3. **The quiet walk back across campus** — now it has a reason to exist: the player has nothing left to do and nowhere to be.
4. **The Doorman** — *"Eventually."* Fade.
5. **`FOUR MONTHS LATER`** · *(a beat)* · **`(THIS IS FAST.)`**
6. **The decision letter** arrives.
7. **The player takes it back to the Office** — the R&R explanation happens where the game began, with the person it began with.
8. **The skeleton's sign flips.** Credits.
9. **Post-credits: Reviewer 2.**

### The walk back

No puzzles. The route is the reverse of Act I, which the player will feel without being told.

- **Probability Pond.** The Skeptic is still on the bench. The swan is still black. She is writing in Volume XI and does not look up.
  > **PLAYER:** "I was wrong about one of them."
  > **SKEPTIC:** "Which one?"
  > **PLAYER:** "The interesting one."
  > *(she finally looks up)*
- **The Library.** KIRA is recompiling the literature again. The conveyor belt has not stopped since Act II.
- **Feldstrom's workshop door.** The chalk is still there. `PEOPLE ARE NOT PARTICLES` / `UNTESTED ASSUMPTION`. Somebody has added a third line in a third hand, very small: *"testable, though."*
- **The Corridor gate.** The Doorman, arms crossed, exactly as in Act I. This is his last line in the game and he gets nothing else.
  > **PLAYER:** "You knew."
  > **DOORMAN:** "Eventually."

Fade.

### Reviewer 2 has been coming for five acts

**Seed the dread from Act I onward.** Reviewer 2 should be spoken about the way a village speaks about a thing in the woods — never explained, never doubted, and by characters who are otherwise entirely rational:

> **PROFESSOR:** "Reviewer 2 will ask."
> **VISITING FELLOW:** "Reviewer 2 will notice that."
> **KIRA:** "I have anticipated Reviewer 2."
> **PLAYER:** "Who *is* Reviewer 2?"
> **PROFESSOR:** "Nobody knows."

One line per act is plenty. The player should arrive at the outro genuinely wanting to know.

### The decision letter

Three reviews of wildly unequal length, which is the joke every academic recognises instantly.

**Reviewer 1** — thoughtful, reasonable, six comments, all constructive. Signs off warmly. Is never mentioned again.

**Reviewer 3** — did not submit a review. The editor waited eleven weeks. There is an apologetic, slightly wounded note about this.

**Reviewer 2** — eleven pages, single-spaced, forty-seven numbered comments, several of which contradict each other:

> **17.** The authors have not adequately ruled out selection.
> **31.** Please cite Smith (1987).
> **42.** The manuscript would benefit from greater theoretical ambition.
> **43.** The manuscript currently makes claims beyond what the evidence supports.

There is no Smith (1987). The player can check. KIRA will confirm it does not exist, and then offer to cite it anyway.

> **PLAYER:** "How am I supposed to satisfy both forty-two and forty-three?"
> **PROFESSOR:** "Yes."

**Comment 17 is completely correct**, and that is the load-bearing joke of the whole outro: **even the monkey is ridiculous and also right.** It is the objection the Visiting Fellow raised a finger at in Act II, the limitation the Bureau of Implications made the player write in Act IV, and if they wrote the paper honestly, the answer is already in it. They can point at the sentence.

- **Honest paper:** the most devastating comment in eleven pages was anticipated three acts ago. That is the game's closing argument for having done any of this properly.
- **`claim_overstated`:** comment 17 lands on an undefended claim, along with 9 through 47, and the letter is considerably longer and colder.

*(Design note: an earlier draft hinted that Reviewer 2 was secretly the Visiting Fellow — matching handwriting, her phrasing, her one obsession. Three clues is not a hint, it is a confirmation, and it also made the world smaller. Dropped entirely. Comment 17 is the only echo, and it should read as *anyone* could have written it. The funnier position is that we genuinely do not know whether academia contains one such person or thousands.)*

### Back at the Office

The player takes the letter to the Seven-Second Office, because there is nowhere else to take it. Same room, same Professor, same skeleton, same hourglass.

At the bottom of the letter:

```
REVISE AND RESUBMIT
```

> **PLAYER:** "Wait. That's... good?"
> **PROFESSOR:** "For a first submission? That's a triumph. Most of these die in desk-reject."

The game says the quiet part out loud on purpose — R&R is a genuinely positive outcome, and the joke only works if every player gets the relief, not just the ones who know the convention.

**The folder** is the punchline: every stamp, staple, coffee ring and pencil annotation from five acts, including the Hall of Founders' meaningless `THEORETICALLY GROUNDED` on the cover, which the Professor notices and says nothing about. Its last stamp is `REVISE AND RESUBMIT`.

**The armchair skeleton** slowly turns its skull toward the player, and its `SUBMITTED 2016 · STILL WAITING` sign falls over to reveal: **"WELCOME TO ACADEMIA."**

**Credits.**

### Post-credits: Reviewer 2

*After the credits have finished. The serious ending has already landed; this costs the game nothing and pays off five acts of dread.*

A dark office. One monitor, glowing. A journal submission system is open on screen, a manuscript queue eleven items deep.

The camera pans down.

**A small monkey is sitting at the keyboard.**

Beside it: half a banana, a mug reading **REVIEWER 2**, a tower of manuscripts, and a rubber stamp reading **MAJOR CONCERNS**.

The monkey types, without any evident deliberation:

```
asdfghjkl
```

A pause. The submission system thinks. Then the text field resolves to:

> *"The theoretical contribution remains insufficiently developed."*

The monkey looks at this for a moment. Looks thoughtful. Hits Enter.

**Do not explain it, and do not resolve which of them wrote the review.** The ambiguity is the joke: is the monkey Reviewer 2, is the *software* Reviewer 2, is the monkey operating a review generator, or is this simply how peer review works in this universe? The game should not know. Cut to black.

**Optional final beat** (funny, possibly one turn too far — cut it if the monkey lands better alone): the desk phone rings. The monkey picks it up. Cut to Feldstrom in his workshop, receiver to his ear, hopeful.

> **FELDSTROM:** "Stockholm?"

*(the monkey screams)*

Feldstrom slowly hangs up.

> **FELDSTROM:** "…international."

**Why a monkey and not the ChatGPT gag.** A ten-year-old typing *"make this sound like an academic reviewer but very critical"* into a chatbot is genuinely funny, but it is a different joke — academia outsourcing itself — and the game already has a much richer AI character in KIRA. Ending on a chatbot gag would also date the game within a couple of years and pull the final note away from academia and towards a specific technology. The monkey is surreal, timeless, and does not compete with KIRA. It also lets the game end the way *Monkey Island* ends: with reality quietly declining to make sense.

### The sequel card

> **THE SECRET OF THE LOST CODEBOOK, PART TWO: THE REVISIONS**
> *Coming whenever the reviewers get back to us.*

And underneath, smaller, after a beat:

> *Featuring Reviewer 2.*

**The note the ending has to hit:** the player does not leave with the Codebook, a discovery, or a career. They leave with a modest, defensible, *true* thing, and a letter asking for revisions — and the game's position is that this is a good day. Every absurdity in five acts was an institution overdoing something that was, underneath, worth doing. Nothing the player learned was decoration.

---

## Tobi — Strategic Visibility & International Growth

*Added 2026-09-21 at the user's request: a marketing/international-recruitment character who
roams rather than owning a room.*

**The joke.** Every other character in this game is ridiculous about *research*. Tobi is
ridiculous about the *university as a business*. He is the only one who has never once asked
what the question is, and the only one who is completely certain the project is going well.

**Look.** Mid-twenties, expensive plain clothes, very good haircut, tote bag, reusable cup, a
lanyard carrying four badges for three jobs. Phone always in hand, usually filming. Never
sits down.

**Voice.** A dialect made of conference slides. He does not use these words ironically:

> "Can we get a reel out of this?" · "Love that for the department." · "So the vibe of the
> data is basically—" · "Is there a version of this that's more *shareable*?" · "Let's
> circle back on the student journey." · "Massive if true." · "I'm hearing a thought leader."

He renames everything into marketing: the Prediction Slip is *the roadmap*, Feldstrom is *a
thought leader*, the Doorman is *front of house*, the Ethics Tribunal is *a stakeholder
touchpoint*, the skeletons are *heritage*.

### Where he is

**He roams.** Each time the player enters a room, there is a chance Tobi is already in it,
filming something. He should appear in rooms he has no business in — the Ethics Tribunal,
the Statistics Basement, the Corridor — and he is never surprised to be thrown out. He also
appears on the **campus map** as a small figure with a phone, in a different spot each time
the map is drawn.

Implementation: one shared sprite plus a `tobiRoom` value rerolled on each map open; rooms
render him if they are the current pick. One line of ambient dialogue per room, keyed to
whatever that room is about, is enough — he does not need a dialogue tree.

### What he wants: content

Tobi wants a soundbite, and he will take literally anything. **Show him any number at all**
and he is delighted, and immediately reads it upward:

> **PLAYER:** *(shows the result and its interval)*
> **TOBI:** "Okay so this says lectures make you smarter."
> **PLAYER:** "It says the gap is larger on worked-example questions among students who—"
> **TOBI:** "Lectures make you smarter. Amazing. Can I get you by the window?"

This costs the player nothing mechanically, which is the point: he is not publishing your
paper. **The payoff is in the outro**, where his post appears in the review bundle —
*"STUDY SHOWS LECTURES MAKE YOU SMARTER"*, 4,000 likes, more engagement than the paper will
ever get, and nobody on the Tribunal minds at all.

### His puzzle use: he is a way of emptying a room

Everybody in this department flees him. That makes him the game's second "get a person out
of the way" mechanic, and it should be deliberately *different* in flavour from the Stockholm
call: that one works by flattering a man's vanity, this one works because nobody wants to be
interviewed.

**Recommended placement — the Gap Registry (Act V).** The Registrar will not leave his desk,
and one drawer behind him is locked: **CLOSED — NOT CURRENTLY IN CIRCULATION**. It holds the
precedent that shows your result is not novel in the way you first assumed. Tell Tobi there
is a story in the Registry — "the gap pipeline", "hidden knowledge, very visual" — and he
goes. The Registrar, who has seen him coming for twenty years, retreats into the stacks
without a word, and the drawer is reachable.

> **REGISTRAR:** *(already standing)* "I have filing."
> **TOBI:** "This is giving *archive core*."

**Alternatives considered, and why not:**

- *Luring Feldstrom out* — already done, better, by Stockholm. Feldstrom would in any case
  stay for a camera, which is the opposite of what is needed.
- *Getting the Bureau clerk off his stool* — works, but Act IV already has three gates and
  does not need a fourth.
- *Giving him a puzzle item outright* — weaker. He should cost the player a small
  humiliation, not a fetch.

### The Nurse loves him

*Added 2026-09-21 at the user's request, and it is the best thing about him.*

The Survey Lab Nurse — twelve years on one national survey, an emergency alarm for the phrase
"does it matter", the most rigorous person in the building — **thinks Tobi is lovely.**

She is not being ironic and she is not being fooled. She has simply decided, on no evidence
whatsoever, that he is a nice young man who is trying his best, and nothing he says changes
it. He is the only person she never corrects.

> **TOBI:** "Can the questions be, like, fun? Is that a thing we can do?"
> **NURSE:** *(warmly)* "No."
> **TOBI:** "Love that."
> **NURSE:** *(to you, after he has gone)* "He's very good with people."

The joke works in both directions. It is the one soft spot in a character built entirely out
of precision, and it is the only time anyone in this game is kind to Tobi rather than
enduring him. Play it completely straight — no winking, no explanation, and never let
another character remark on it.

**Consequences worth using:**

- Tobi turns up in the Survey Lab more often than his roaming would predict, and the Nurse
  does not throw him out.
- **She will do things for him she will not do for the player.** This is the obvious second
  puzzle use if one is ever wanted: something the Nurse refuses you flatly, Tobi gets by
  asking badly. The player has to stand there and watch it work.
- In the outro, when his post outperforms the paper, the Nurse has liked it.

### The International Office half

Same person, second lanyard. He hands out a **glossy prospectus**: four thousand smiling
students on a lawn none of them has ever sat on. It is a beautiful third wrong sampling
frame in the Mensa, and the Sampling Officer is briefly taken in by the production values:

> **SAMPLING OFFICER:** "This is a *magnificent* list."
> **PLAYER:** "They're stock photographs."
> **SAMPLING OFFICER:** *(long pause)* "They are extremely well lit."

And one line that should land quietly, because it is the true part of the joke: asked what
the international strategy is, Tobi answers, without any irony at all, **"Growth."**

---

## Two solutions, and the line between them

*Added 2026-09-21 (user): some puzzles should have a second, ridiculous solution — talking
Tobi into asking somebody on your behalf, for instance.*

This is a good instinct and it needs one rule, or it quietly dismantles the game's teaching.

> **You can social-engineer a person. You cannot social-engineer the evidence.**

Every obstacle in this game is one of two kinds, and only the first kind gets a second
solution:

| Kind | Example | Second solution? |
|---|---|---|
| **A gatekeeper** — someone is withholding an object or a permission | the Nurse won't release the scissors, the Registrar won't leave his desk, the Officer won't spin without a frame | **Yes.** Charm, trick or bureaucracy your way past them. |
| **The evidence itself** — the thing to be understood | the sealed prediction, the merge on surname, the three limitations, the words in the abstract | **Never.** There is exactly one honest route, and it is the lesson. |

So Tobi can get you the scissors. Tobi cannot make the interval narrower, cannot tell you
which questions resemble the worked examples, and cannot write your limitations. If a second
solution would let the player skip *understanding* something rather than skip *asking* for
something, it is the wrong puzzle for one.

### The price: you have to pose

Tobi never does anything for free, and his price is always the same and always humiliating:
**he wants content, and you have to be in it.**

> **TOBI:** "Okay — so just stand by the window and look like you're having an idea."
> **PLAYER:** "I'm not having an idea."
> **TOBI:** "Look like you might."

You pose. He takes eleven photographs. He picks the worst one. Then he will happily go and
ask anyone in the building for anything, because he has no idea that any of it is difficult.

This is the right shape for an adventure-game trade: the cost is not an object from your
inventory, it is a small indignity, and the player pays it on screen.

### The worked example: the Nurse and the scissors

The Survey Lab's Single-Concept Scissors are locked in the cabinet, and the Nurse will not
release them until you have diagnosed the double-barrelled question yourself. That is the
honest route and it stays exactly as it is.

The other route: pose for Tobi, then ask him. He wanders over and says something that would
get anyone else thrown out —

> **TOBI:** "Hey — can he borrow the scissors? He's doing a whole thing."
> **NURSE:** *(instantly, warmly)* "Of course he can."

You get the scissors. You did not learn what a double-barrelled question is. The room does
not punish you for that, and it does not need to: **the patient is still lying there taped
together**, and the machine will not clear an instrument with an undiagnosed patient on it.
You have skipped the asking, not the understanding — which is exactly the line.

And afterwards, if you ask the Nurse about it:

> **NURSE:** "That nice young man sorted it out."

---

## Three flags, not a story tree

The game now offers a lot of "you did the wrong thing and it comes back later" branches: fake sources, the civilisation-scale theory, the .049 banner, the LARGE implication, Feldstrom's title, KIRA's abstract. Tracking all of those combinatorially would explode the implementation and produce a story tree nobody can test.

**Don't.** Rooms may react locally to anything — a character can absolutely notice the mug, the stamp or the fake citation in the moment, and that costs nothing. But only **three durable flags** ever cross act boundaries, and only these three are consulted by the outro:

| Flag | Set when | Paid off in |
|---|---|---|
| `theory_empty` | the Prediction Slip is sealed at `EVERYTHING EXPLAINS EVERYTHING` | Act IV — the seal comes off and the theory cannot tell the player anything |
| `analysis_p_hacked` | the player walks out of the Statistics Basement with the .049 banner instead of the predicted test | Act IV audit, and the abstract in Act V |
| `claim_overstated` | the LARGE implication was bought, or Feldstrom's title / KIRA's verbs survived into the submitted paper | the outro — Reviewer 2's comment 17 lands on an undefended claim |

Three booleans give the player a genuine sense that their choices persisted, and they can be tested exhaustively (eight combinations) in an afternoon. Everything else is local colour, which is where most of the humour lives anyway.

**A related rule:** a wrong path should always be *completable*, never blocked, and its consequence should land at least one act later than the choice. Immediate punishment reads as a quiz marking you down. Delayed consequence reads as a game.

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
3. **Acts IV and V have been restructured on paper and have no code at all.** The old Act IV (two rooms) gained **the Bureau of Implications**, and the old Act V (the Hypotheses Accelerator) was dissolved entirely — the Accelerator moved into Feldstrom's Act II workshop, and Act V is now **the Gap Registry + the Writing Room**, ending in submission. Everything in both sections is new copy and new rooms.
   - **Four new rooms** with no existing equivalent: the Bureau of Implications, the Gap Registry, the Writing Room, plus the submission chute as a small scene.
   - **New systems:** a SO WHAT? gauge that significance does not move; a limitations wall; a four-sentence abstract assembly where one slot can be *locked* by a choice made an act earlier (the LARGE implication); and a title escalator with a walkable press-office ending.
   - **The old Act V art is not wasted** — the full-size Hypotheses Accelerator design moves to Act II as Feldstrom's Mk III, which now needs the two-directional SPECIFY/GENERALISE panel and the masking tape over the left-hand controls.
4. **The outro does not exist in code.** Completing Act V currently just says "decommissioned (for now)" and returns to the map. The outro is a **cutscene, not a room** — narrated panels using the trailer pipeline: FOUR MONTHS LATER, the walk back across campus, the three reviews, Reviewer 2's forty-seven comments, the R&R verdict, the skeleton sign flip, and the sequel card. It needs narrator VO and probably five to seven panels.
5. **Acts II–V are still flat procedural SVG rooms** with the older UI pattern, versus Act I's painted, verb-grid rooms (`HANDOVER.md` §03). Act II now has real plot beats and a lot of specific physical props (the gilded sampling frame, the transparent anonymous filing cabinet, the RESPONSE RATE board, the taped-together questions) that need the same painted-art/verb-grid treatment Act I got to actually land.
6. **Trailer panel 1 needs new art** — the shipped `trailer-panel1-rejection.png` still shows the old rejected-letter concept; regenerate from the revised prompt in `art/trailer/ART_PROMPTS.md` (an empty research folder + a circled deadline) before swapping in the new narration text.
7. **Trailer panel 2b ("The Spiral")** needs art — prompt is ready in `art/trailer/ART_PROMPTS.md`, not yet generated.

Given 1 alone is "build four room-narratives, two of them brand new, with four interlocking cross-room puzzle chains," this is a real scope decision on its own — worth agreeing on room build order (the doc above suggests Survey Lab first) before diving in. See `ROADMAP.md` for the logged, not-yet-built entry.

**Already shipped, done:** Act I's two-stage reveal (Doorman exchange + Research Folder item), the full 5-panel trailer, the boot splash/logo/title sequence. See `HANDOVER.md` §01b for exact details.
