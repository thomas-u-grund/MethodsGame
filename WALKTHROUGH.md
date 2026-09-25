# THE SECRET OF THE LOST CODEBOOK — Walkthrough

Every task and puzzle, act by act. Written from the code, not from memory.
Last checked against the code **2026-09-26**.

This is a **complete** walkthrough: it gives the solutions. It also flags the wrong branches
worth walking on purpose, because several of them are where the teaching actually happens —
the game lets you do the bad thing, stamps it, and makes you live with it later.

**How to read the room entries.** *Needs* = what you must be carrying or have already done.
*Gives* = what you leave with. *Do* = the solution in order. When the last puzzle of an act is
solved, the game goes straight to that act's ending (a cutscene, the Office, or the map).

> **Controls.** The game starts in **simple controls** (switch with *Controls: Simple/Classic*
> in the room bar; phones are always simple). Hovering names what a click will do; a thing with
> one action does it on one click; a thing with several shows small icons (Look / Talk / Use /
> Take). This document still writes steps as verb + object:
> - **Look at / Talk to / Use / Pick up X** — click X (pick the icon if it offers several).
> - **Use item on X** — click the item in the inventory (it follows the cursor as *Use … on*),
>   then click X and press the **Use with** icon. A second click on a readied item describes
>   it instead; Esc or a click on empty floor puts it down.

---

## The spine

You are trying to fill a cardboard folder. That is the whole game.

| Act | Question it answers | What goes in the folder |
|---|---|---|
| I | What are you even asking? | A precisely worded question |
| II | What do you expect to find, and why? | A theory, and a sealed prediction |
| III | Who are you asking, and are you allowed? | Data |
| IV | What does the number actually say? | A result, and its limits |
| V | What does it add? | A contribution, a poster, and a keynote you did not give |

Few things you pick up are decoration. The USB stick on the Professor's desk starts a rap
battle in Act II; the chewed pen writes your mechanism, straightens a leading question and
writes a way out of the Ethics chair; the sealed slip is what gets you registered in Act V.

---

## The three flags that follow you

Only three failure states cross act boundaries. Each is set by a choice the game presents
attractively, and each is read out at the end.

| Flag | Where you earn it | What it costs you |
|---|---|---|
| `theory_empty` | Sealing the Prediction Slip with an unsound box (in practice: lodging all six references and sealing in the Office anyway) | The Casino result comes back **vacuous**; the Professor and Reviewer 2 (comment 14) both ask what you expected |
| `analysis_p_hacked` | Significance Casino: taking the DISCOVERY! banner | You never break the seal; Reviewer 2's comment 9 asks how many tests you ran |
| `claim_overstated` | Bureau **EXTRA LARGE**, the Writing Room title ladder, or "It reads fine. Leave it." | Meant to add comments 12 and 38 to the Reviewer 2 battle — but see the note below |

> **Note (current build):** finishing the Writing Room clears `claim_overstated`, and the
> Writing Room can only be finished the honest way, so the flag never reaches the outro.

None of them is a game over. All of them are stamped, filed and approved by somebody.

---

## ACT I — THE QUESTION

Four rooms, no locks.

> **Two different people.** *Prof. Stellmacher* — "the Professor" — is a woman, and the Office
> is hers. *Dr. Vossberg* is the man in the Lecture Theatre, covering her nine o'clock.

> **Loot the Office.** On a fresh save she is out: she will not be in the building while a
> class runs under her name that she did not design. Her desk is blocked only *during* the
> interview; once she has given you the question you can take things in front of her. If you
> need her gone, tell her **"Dr. Vossberg asked for you. The projector in the Lecture Theatre is
> broken again."** — she walks out.

### I.1 The Seven-Second Office (part one — the robbery)

**Do:** Pick up `pen` (pen jar) · `hourglass` · `usb` (taped to her book: *PROF G — BEATS — ON
LOAN*) · `stamp` · `magnifyingglass` (desk) · `bingocard`. The mug and the Likert die are
Look-only now; the Mensa and the Survey Lab have their own.

**Optional:** magnifying glass on the right-hand shelf → her offprint, *The Death of
Community: Evidence from Twenty-Three Residents of Leicester*. That is the Professor's
backstory in one spine, and it comes back at the keynote. Look at the autograph on the
corkboard: she is Professor G's biggest fan.

**Easter egg:** pen on the corkboard → a **Fabricated Citation**. Use it on her later.

### I.2 Introduction to Systems Theory

**Needs:** nothing (the bingo game needs `bingocard`). **Gives:** `blackink` (a decoy — see the
Pond), and the Professor back in her office.

**Do:**
1. **Talk To Dr. Vossberg → "Where is Professor Stellmacher?"** He stops dead and explains she
   will not be in the building while this runs under her name. *She is now in her office*, and
   the room is done.
2. The bingo game is **optional** and worth playing: Use `bingocard` on him (or ask *"Could you
   say a bit more about Luhmann?"*). Dab each square the moment he *says* the term (decoys are
   near-misses; a missed term comes round again), and press **BINGO!** on the card when a row,
   column or diagonal fills. He loses the thread and walks out forty minutes early — which also
   sends her back to her office.
3. Use the blackboard to summon him back (he cannot resist a wrong arrow).

### I.3 The Seven-Second Office (part two — the interview)

**Gives:** `question`. Five patience drops; a wrong answer spends one, a right answer never loses.

1. *Highest crime rate per capita in the world* → **"The Vatican — but I don't buy it.
   Something's off in how that number's built."**
2. → **"The crimes are pickpocketing against tourists — millions a year — but they divide by
   the 800 residents, not the visitors."**
3. → **"Do students who attend more lectures get better exam results?"**
4. → **WHO** first-years in the Methods lecture · **WHAT** lectures attended & final exam grade ·
   **WHEN** this winter term · **DIRECTION** left open.

Leaving the direction open is the right answer. You are not allowed to expect the result yet.

### I.4 Probability Pond

**Needs:** nothing.

**Look at the open water** (towards the bridge) and wait. A real black swan glides out from
under the bridge; the Skeptic on the bench is convinced on the spot (`philosopherConvinced`).

**Wrong branch:** `blackink` on the right-hand swan. *"You made that. A counterexample you
manufactured is not evidence. It is a craft project."* The swan ducks and comes up white.

### I.5 Causality Corridor

**Needs:** `question`, `philosopherConvinced`. **Gives:** `folder` (consumes `question`).

1. Ring the bell (or just use the door). He checks both things.
2. Four case rooms. Look at the pinned note to read each case, then pick the door:

| Case | Answer |
|---|---|
| 1 · Tuition and Payoff | **X → Y** |
| 2 · The Television Diagnosis | **Y → X** |
| 3 · Cones and Coroners | **Z → X & Y** |
| 4 · Cage Rating | **Coincidence** |

3. "Step through the archway." The Doorman takes the question and gives you the folder.

**Wrong door:** the floor gives way, you are walked back up to **the same case**, and the
explanation stays on screen. No penalty.

**Pick up on the way:** the rubber duck marked **Z?** (Case 2). Pure flavour.

**→ Act II unlocks.**

---

## ACT II — THEORY

*"Apparently, we need a theory."* Four rooms, all open at once, but they interlock. This act
fills the **Prediction Slip**: four boxes (WHAT IS KNOWN · MECHANISM · SCOPE · HYPOTHESIS AND
FALSIFIER). Some rooms will happily file junk into a box; only a sound entry completes a room.

**Suggested order: Hall (rap battle, hook pole) → Library (everything, including the phone
call) → Hall (Professor G) → Workshop → Seminar.** The seal happens by itself.

### II.1 The Hall of Founders — MECHANISM

**Needs:** `usb`, then `pen` + `blankcard` (from the Library desk). **Gives:** `stepladder`
(the *Ceremonial Hook Pole*), the MECHANISM box.

1. **Pick up the stepladder** → the hook pole comes off it. The Library's catalogue drawer needs it.
2. **Use `usb` on the DJ** (or the DJ table). Tobi is livestreaming the **Founders' Rap
   Battle**: Marx, Durkheim, Weber, then Professor G. Let it play to the end; the Authority
   Meter falls to zero and the portraits stop nodding (`rapDone`).
3. With the blank card and the pen, **Talk to Professor G** (before the battle he is too
   nervous). Three sentences:
   - *"As Weber reminds us, education mediates the institutional reproduction of structured
     sociality."* → the portraits nod. Junk; he asks again.
   - *"Attendance works through exposure to the lecture environment."* → "a mood, not a
     mechanism". Again.
   - ✅ **"Students who go to lectures keep meeting worked examples, so they practise exactly
     the kind of reasoning the exam asks for."** → **MECHANISM: PRESENT**, and the card becomes
     `mechanismcard`.

**Flavour:** the AUTHORITY METER (feed it "Following Durkheim and Weber…" and get stamped
THEORETICALLY GROUNDED), the Quotation Dispenser on **EXTREMELY GERMAN** (gives *An Extremely
Grand Phrase*, a decoy — Weber nods at it, which is the problem), the yellowed clipping, and
Look at the portraits six times. Tobi offers an encore afterwards.

### II.2 The Library — WHAT IS KNOWN

**Needs:** `magnifyingglass`, `stepladder`. **Gives:** `readinglist`, plus `enrolreg`,
`blankcard`, `swedebook`.

**Side pickups:**
- **Pick up the register** → `enrolreg`. Used by the Workshop, the Mensa **and** the Bureau.
- **Pick up the desk** → `blankcard`. Professor G writes on it.
- **Pick up the stacks** → `swedebook`, *Swedish for Nobel Laureates*. The phone call needs it.

**Catch all three bad references** (a red REJECTED tag appears on the trolley for each):

| Problem | How |
|---|---|
| *It does not exist* | Magnifying glass on the **trolley** — reference 4's DOI resolves to a recipe for soup |
| *It does not say that* | **Use the conveyor** → you snatch the full Müller & Singh (2023) off the belt; page nine says the association vanished after adjustment. The framed abstract is only a pointer |
| *It cannot establish that* | **Use the card catalogue** with the hook pole — a cross-sectional study filed as LECTURES CAUSE SUCCESS |

Then **Use the trolley** (or ask KIRA):
- *"Lodge all six — they are beautifully formatted"* → junk. The box is filled but the room
  does not complete. You can come back and lodge properly.
- ✅ **"Lodge only the ones that survive checking"** (needs all three catches) → `readinglist`.
  **Act V needs it.**

### The Stockholm call — getting Feldstrom out of his workshop

**Needs:** `swedebook`. Talk to **KIRA → "Ask her to place a call"** (or use the desk phone) →
**"Professor Feldstrom, please."** The screen splits: you on the left, his workshop on the right.

1. **"Hej. This is Stockholm."** → *"…Say something in Swedish."*
2. ✅ **Read from the book: "Hej. Kommittén är lagom nöjd. Men först: fika."** (Without the
   book you only have *Abba* and *Ikea*. *"Grattis! You have won!"* hangs up: Stockholm never
   says congratulations first.)
3. *"…Which category?"* → ✅ **"That remains under discussion."** (*Physics* hangs up.)
4. ✅ **"The Committee requires you downstairs, for a confidential consultation."**

*"Will there be photographers?" — "…ja." — "I'll bring the derivation."* He runs out.

*"Congratulations, you've won the Nobel Prize"* as an opener gets *"Which one?"* and a click.
*"The Committee is concerned the scope is too narrow"* cranks the Accelerator up to
CONSCIOUSNESS IS ATTENDANCE. Wrong, not fatal. Every hang-up can be redialled.

### II.3 Feldstrom's Workshop — SCOPE

**Needs:** `enrolreg`, Feldstrom **out of the room** (the call).

1. **Use the Accelerator.** The work order on the panel says it all: turn every drum
   (Population, Mechanism, Scale) all the way **left**.
2. **"Feed in the enrolment register"** → **SCOPE: first-year Methods students, this
   university, this winter term.** THINGS THIS FORBIDS swings up. Feldstrom comes back too late:
   *"You've made it terribly small." — "Yes." — "…brave."*

While he is in the room he winds the drums back up, bins the register, and refuses a small
version. **Wrong branch:** crank right and **"Lodge this version"** → SCOPE: *Human
civilisation*, gauge at zero. Recoverable — scoping properly overwrites it.

Optional: post `mechanismcard` into the hopper, or Show him the mechanism (*"Flow."*).

### II.4 The Seminar Room — HYPOTHESIS AND FALSIFIER

**Needs:** a sound SCOPE — on arrival the room tells you to come back once Feldstrom's machine
has made your claim smaller. **Gives:** `altcard` — **Act IV needs it.**

Use the consequence board. Two choices:

- **LARGER on:** ✅ worked-example questions
- **SMALLER for:** ✅ students already practising elsewhere

→ **"Write it on the board."**

Anything else and a rival card slides underneath yours (**SELECTION**, **MOTIVATION**, or
YOUR OWN MECHANISM) and the Visiting Fellow raises one finger. No penalty. She signs, and hands
you her SELECTION card: *"Somebody will ask you about it later."*

### The seal

When the fourth room completes, the seal plays as a cutscene: wax, a date, *"What if I'm
wrong?" — "Then you will have learned something."* You get the sealed `slip`.

If a box is junk (the six-reference list), the act cannot complete that way. Take it to the
**Office** instead: the Professor lowers the sealing device, with a button marked **I WOULD LIKE
TO SEE THE DATA FIRST** (a klaxon; request noted). Sealing then sets `theory_empty` and the
slip comes back on fire: THEORY EXISTS · INFORMATION CONTENT: 0 · APPROVED.

**→ Act III unlocks.**

---

## ACT III — DATA

Four rooms, filling four boxes. The Fieldwork Arena needs the other three first.
**Suggested order: Ethics → Survey Lab → Mensa → Fieldwork.** The calendar page from Ethics
is needed in the Survey Lab.

### III.1 The Ethics Tribunal — four seals

**Needs:** `pen`. **Gives:** `consentplain`, `calendarpage`, `redacted`, and on approval
`pseudolist` + `altquestionnaire` + `examrecords` + `ballotboxwrapped`.

1. **Consent** — pick up the plain-language form from the right-hand pew, use it on the Tribunal.
2. **Withdrawal** — `pen` on the **Irreversible Participation Device**. You write WITHDRAW on
   the buckle.
3. **Names + linkage** — Talk to the Tribunal → *"Ask about names, and linking answers to exam
   results"*:
   - *"Stamp REDACTED over every name **and** every number"* → **`overRedacted`**: nothing left
     to join. Ask again. (Until you do, the reminder postcards in Fieldwork are useless.)
   - *"Keep the names"* → refused.
   - ✅ **"Number each form with a pen, redact only the names, keep the key in the Ledger"** —
     fills both seals.

When all four seals are red: **ETHICAL APPROVAL**, *subject to fourteen minor amendments*, and
the Keeper hands down the list, the paper questionnaires, the question-level exam records and
the bagged ballot box.

**Also here:** pick up the **calendar page** (the Survey Lab needs it).

### III.2 The Survey Lab (Emergency Department) — INSTRUMENT EXISTS

**Needs:** `calendarpage`, `pen`. **Gives:** the `questionnaire`.

Four sick questions. Three are on the gurneys; the fourth is on a clipboard on the triage desk.

| Patient | Where | Diagnosis | Cure |
|---|---|---|---|
| 1 | First gurney | Double-barrelled | **Look at** it to diagnose, pick up the **scissors** from the cabinet, use them on it |
| 2 | Second gurney | Leading | Use the **pen** — strike out "Don't you agree that" and "excellent" |
| 3 | Third gurney | Vague — "often" | Use the **calendar page** |
| 4 | Triage desk | Two response categories | Pick up the **Likert die** from the desk and use it (she traces it; do not roll it) |

Each healed chart is pinned on the DISCHARGED board; four on the board and the nurse staples
them into your questionnaire.

**The Tobi route:** if Tobi owes you a favour and is in the room, you can get the scissors
without diagnosing anything — *"Hey, can he borrow the scissors? He's doing a whole thing."*
You are then holding scissors with no idea what is wrong. **You skip the asking, not the cutting.**

### III.3 The Mensa — SAMPLE DRAWN

**Needs:** `enrolreg` (or `pseudolist`). **Gives:** the drawn sample; optionally `voucher`.

1. **Talk to the lunch queue** (the Cook): borrow a **mug** and the **SR-2 raffle drum**.
2. Use **`enrolreg`** on the gilded frame. It fills and stops well short of the top. *"It has
   the* right *hundred and forty names." … "…my father would not have liked you."* You keep the
   register — the Bureau needs it.
   - If you use `pseudolist` instead, the frame fills gloriously — *"A POPULATION."* — and you
     need the **magnifying glass** on it: *"Includes only students registered for the university
     newsletter."* The Officer then swaps in the register.
3. Use the **mug** on the Sampling Officer (*"Adequate."*) and the **raffle drum** (the Great
   Drum is ceremonial; the SR-2 does the work).
4. Talk to him → trumpets, confetti, box ticked.

**The wrong branch worth walking:** before loading the frame, **use it with no item** → twelve
people from the lunch queue, all with the same tote bag. Give the **tote-bag sample** to the
Cook: she pins it above the till and gives you a **Free Lunch Voucher**. *"An early mistake,
converted into a resource."*

### III.4 The Fieldwork Arena — RESPONSES ACQUIRED

**Needs:** the other three boxes, `ballotboxwrapped`, then `reminders`, `altquestionnaire`,
`voucher`. **Gives:** `rateprint`.

1. Talk to the Director. The bagged ballot box goes on stage: private answers, and the board
   decays 100 → 92 → 83 → 67 → **58%**. A big red button lights up.
2. Three fixes, each used on the **podiums**: `reminders` (pick up the postcards by the
   Arena's telephone) → 64%, `altquestionnaire` → 70% (podium 9 will not answer on a screen),
   `voucher` → **75%**. No voucher? Ask the Director *"Could we offer them something for their
   time?"*

**The big red button** (use the host's podium while live): *REPLACE MISSING RESPONDENTS WITH
NEAREST AVAILABLE PERSON*. The board snaps to 100% and the Sampling Officer bursts in —
**"THOSE PEOPLE WERE NOT DRAWN!"**

### Hand-off: provenance

The game takes you to the **Office** → *where exactly did those numbers come from?* → ✅ **"The
frame was the first-year Methods register, a hundred and forty names. Twelve drawn at random.
Nine answered — seventy-five per cent — and I know which three didn't."**

Not "a big dataset", and not "the survey system exported them".

**→ Act IV unlocks.**

---

## ACT IV — EVIDENCE

*"Everything here says yes."* **Order: Delegation Engine → Significance Casino → Bureau.**

### IV.1 The Delegation Engine

**Needs:** nothing. **Gives:** `cleandata`.

KIRA thinks she has found the Codebook. A lever descends towards AUTO-SUBMIT; the Professor
watches with an hourglass and a red pen.

1. Talk to KIRA (or use her terminal) and pick any question. She streams a ten-line report.
2. **Click each wrong line and say why.** Seven are wrong:

| Line | Stamp | Right reason |
|---|---|---|
| N = 140 | WRONG N | 140 is the register. Only 9 people answered |
| Linked by surname | WRONG KEY | Link on the pseudonymous IDs; surnames collide |
| 3 missing imputed as full attendance | MADE UP | Filling in the answer you hoped for manufactures the result |
| p < 0.001 | FORKING PATHS | Nine people, twenty models, kept the best |
| *causes* 23% higher marks | NOT CAUSAL | It is a survey: associated with, not causes |
| consistent with Müller & Singh | ABSTRACT ONLY | Its conclusion says the effect vanished; she read the abstract |
| Figure 1 | Y-AXIS AT 70 | The axis starts at 70 |

   Response rate (75%), design and your hypothesis are **true** — answer *"…actually, nothing."*
3. **Show it to Prof. Stellmacher.** Anything you missed she circles; say what is wrong with
   each, then show her again.
4. ✅ **"Give me the data, linked on the IDs. I will run the test my slip names myself."** The
   lever locks out. *"Certainly. …What exactly do you mean?"*

*"KIRA, fix it"* → a different wrong answer, faster: *"'Fix it' is not an instruction. It is a
mood."* *"Submit it anyway"* → she rejects it herself.

### IV.2 The Significance Casino (the old Statistics Basement)

**Needs:** `cleandata`, `examrecords`. **Gives:** `resultprint`.

Use the **sealed Prediction Slip** on the lectern. (Vossberg's worked-example sheets are pinned
above the desk.) ✅ **"The one the slip names: is the gap larger on the worked-example
questions, and smaller for students already practising elsewhere?"** Overall marks, or all forty
questions one by one, are both turned down.

- If you sealed an empty theory: **the result is vacuous.** *"Something will probably happen."*
- Otherwise the result either **holds**, modestly, or is **null** — flat, and informatively so
  (it is a coin toss). The Skeptic: *"You have removed an explanation from circulation."*
  Both are wins.

> ### ⚠️ The p-hacking trap
> Pull the slot machines three times: bell, coins, **DISCOVERY! Vegetarians report more
> stress. p = .049.**
>
> **"Take it. Print the banner."** completes the room with a result of sorts and sets
> `analysis_p_hacked`. ✅ **"Leave it. You promised to test something else."**

### IV.3 The Bureau of Implications

**Needs:** `resultprint`, plus `enrolreg`/`pseudolist`, `altcard`, `rateprint`.
**Gives:** `interpretation`.

The Clerk: *"Number, please. And what size would you like it to mean?"*

- **"LARGE."** → SOLD OUT (the whole department had one this week) → **"EXTRA LARGE, then."**
  → `claim_overstated`, room complete. *"We don't stock true. We stock sizes."*
- ✅ **"I'd like to write my own."**

Then use the evidence for each limitation **on the clerk**:

| Limitation | Evidence |
|---|---|
| One course, one university, one term | the frame (`enrolreg` or `pseudolist`) |
| The design cannot rule out selection | the **ALTERNATIVE EXPLANATION card** from the Seminar |
| A quarter of them never answered | the **75 tile** (`rateprint`) |

**"Further research is needed"** gets a plaque from the wall and never counts. With all three
ticked → **Lodge it**.

**→ Act V unlocks** (the programme goes up: you are Poster 312, next to the bins).

---

## ACT V — THE ANNUAL MEETING

**Order: Psych Lab (any time) · Writing Room → Poster Session → Keynote.** Do the Psych Lab
before the keynote: the ending waits until all four rooms are done.

### V.1 The Infinite Monkey Project (Psych Lab)

Talk to **Dr. Achterberg** (the Visiting Fellow) → ✅ **"Show her the sealed Prediction
Slip"**. **REGISTERED.** Your result, data or interpretation are all turned away: *"Anyone can
predict yesterday."*

### V.2 The Writing Room

**Needs:** `interpretation`, `readinglist`. **Gives:** `contribution`, the poster.

1. Talk to the **Registrar**. He lines up the three papers against your result, then asks for
   the contribution:
   - *"It confirms the three papers"* → *"That is not confirming them. That is correcting them."*
   - *"It shows that lectures cause better exam results"* → observational.
   - *"Nobody has studied this at this university before."* → *"Correct, and irrelevant."*
   - ✅ **"A boundary condition on three existing papers: the association is concentrated
     where the practice mechanism predicts, and it is smaller than their unadjusted estimates."**
2. Use the **table** (or the abstract). Three words in KIRA's abstract are over the line:

| Her word | Your word |
|---|---|
| improved | **was associated with** |
| demonstrate | **are consistent with** |
| people | **first-year Methods students** |

3. **"This is what happened. Finish it."** → **CLAIM DEFENSIBLE**. The phone rings (a vehicle
   warranty). **"Take the poster to the Mensa."**

> ### ⚠️ Feldstrom's title ladder
> Talk to him → **Let him make it bigger**: *Lecture Attendance and Exam Performance in a
> First-Year Methods Course* → *What Makes Students Learn* → *Educational Exposure and Human
> Capital Formation* → *Institutions and the Production of Human Capacity* → **CIVILISATION IS
> TRAFFIC**. IMPACT: Modest Contribution → Paradigm Shift → Nobel Adjacent → **PRESS OFFICE HAS
> BEEN ALERTED**. Enlarging past the top sets `claim_overstated`.
>
> **Wind the title back down** one step at a time, or **Refuse him** (small title back at
> once). You cannot finish with a big title on the front page. *"It reads fine. Leave it."* in
> the abstract menu also sets the flag, and finishes nothing.

### V.3 The Poster Session (the Mensa)

**Needs:** the Writing Room done. Use **Poster 312**. Five visitors; each answer is shuffled.
A good answer keeps them at your board; a bad one sends them away. No fail state.

| Visitor | Asks | ✅ Answer |
|---|---|---|
| Fieldwork Director | Why so *small*? | "Because I ran the one test I promised, and small is what it is." |
| The Doorman | More of a comment | "Thank you. Would you like the one-sentence version?" |
| Dr. Achterberg | "Selection?" | Point at the limitations box: selection predicts a gap on *every* question |
| Sampling Officer | Are the pens free? | "They are. And the finding, in one sentence…" |
| The Skeptic | How sure are you? | The interval line (rules out no effect and a large one / rules out what the mechanism needed) |

Then a monkey stamps the BEST POSTER **MAJOR CONCERNS**, and Achterberg warns you: *"Feldstrom
has a slide about you. Slide fourteen."* **"Go to the keynote."**

### V.4 The Keynote Showdown (Hall of Founders)

Opens after the Poster Session and starts on its own. Slide 14 is your chart, with the small
bar grown to the top and your name gone. When the floor opens: **"Stand up"**.

Four slides; answer each with the right evidence (a wrong pick gets a laugh, and you try again):

| Slide | Claim | ✅ Evidence |
|---|---|---|
| 15 | ATTENDANCE CAUSES LEARNING | **Point at the design** |
| 16 | TRUE FOR EVERY STUDENT, EVERYWHERE | **Point at the scope** |
| 17 | AN ENORMOUS EFFECT | **Point at the interval** |
| 18 | NEVER BEFORE DISCOVERED | **Point at the three papers** |

Then slide 23, **STOCKHOLM**. The hall is his — until the Professor stands up: *"You did,
Traffic."* Twenty-three residents of Leicester. → ✅ **"I'd rather have the part that's
true."** → *"…Write it down."* The founders applaud; Achterberg runs the live replications and
only Poster 312 holds. **Continue** → the Stockholm cutaway (KIRA gets the prize) → the Office.

### The ending

At the **Office**: **"So… is that the Codebook?"** → *"The what?" … "Oh. That. We used to call
it Methods."* → **"Take it to the submission chute"** → **"Leave the building."**

---

## The outro

The walk back, the envelope, Reviewer 2's letter — and then the **Reviewer 2 battle**: each
comment is an attack, each card from the folder an answer. A wrong card costs composure (an
overclaim costs most); at zero you walk round the pond and come back. No fail state.

| Comment | ✅ Card |
|---|---|
| 1 · The literature review omits a substantial body of work | **The three papers on your reading list** |
| 31 · Please cite Smith (1987) | **"There is no Smith (1987)."** |
| 9 · How many tests did the authors run? *(p-hacked only)* | **Concede it, honestly** |
| 14 · What did the authors expect to find? *(empty theory only)* | **Concede it, honestly** |
| 42 / 43 · More ambition / claims beyond the evidence | **Concede it, honestly** (42, and keep 43) |
| 12 · The title claims more than the design allows *(overstated only)* | **Concede it, honestly** |
| 38 · The abstract says "causes" *(overstated only)* | **Concede it, honestly** |
| 17 · Selection not ruled out *(the boss, always last)* | **The limitation you wrote down (p. 4)** |

Never play *"Our findings are robust and generalisable."* → **REVISE AND RESUBMIT**, the armchair
skeleton (*WELCOME TO ACADEMIA*), and the monkey. If you **showed Tobi a number**, a screenshot
with four thousand likes is in the envelope too.

---

## Tobi

Tobi has no room. Until the rap battle he is pinned in the **Hall of Founders**, hosting it.
After that he is rerolled every time the campus map is drawn: about a third of the time he is
"in a meeting" and nowhere at all; otherwise he is in one of sixteen rooms at random.

| Ask | Requires | Gets you |
|---|---|---|
| *(he asks you)* **the photograph** | refuse three times; the give-in appears on the fourth ask | he owes you a favour (the scissors, in the Survey Lab), and does not know it is one |
| **"Show him a number"** | `resultprint` | *"Okay so this says lectures make you smarter."* → an extra outro panel |
| **Encore** (Hall, after the battle) | `rapDone` | the rap battle again |

He takes eleven photographs and posts the one you are barely in: *big ideas happening in the
Methods dept today 🔬✨*. There is exactly one post.

**The line the two solutions never cross:** you can social-engineer a **person**. You cannot
social-engineer the **evidence**. Tobi can get you the scissors without a diagnosis; he cannot
cut the question for you.

---

## Wrong branches worth walking on purpose

Everything here is recoverable, and most of it is where the jokes live.

| Do this | Get this |
|---|---|
| Fabricate a citation (pen on the Office corkboard) and show it to the Professor | the counter ticks to 10,000, and back |
| Pour black ink on the swan | *"It is a craft project."* |
| Take the wrong door in the Corridor | the floor gives way |
| Lodge all six references | the Registry files a list without reading it |
| Give Professor G the Weber sentence | every portrait nods at once |
| Crank the Accelerator right and lodge it | THINGS THIS FORBIDS reads zero |
| Draw the sample from the lunch queue | twelve matching tote bags, and a free lunch |
| Press **I WOULD LIKE TO SEE THE DATA FIRST** (Office seal only) | a klaxon, and your request is noted |
| Press the big red button in the Fieldwork Arena | *"THOSE PEOPLE WERE NOT DRAWN!"* |
| "KIRA, fix it." | *"It is a mood."* |
| Pull the slot machines three times | **DISCOVERY! Vegetarians report more stress. p = .049** |
| Ask the Bureau for **LARGE** | SOLD OUT — *"I can do you an EXTRA LARGE."* |
| Say "further research is needed" | a wall of hundreds of identical plaques |
| Let Feldstrom name the paper | **CIVILISATION IS TRAFFIC** |

---

## Appendix — what each item is for

| Item | From | Needed by |
|---|---|---|
| A Precisely Worded Question | Office interview | Corridor gate *(consumed)* |
| Research Folder | Corridor | carried to the end; goes down the chute |
| A Chewed Pen | Office | Hall (Professor G), Survey Lab patient 2, Ethics ×2 |
| A USB Drive | Office | **Hall DJ** — the rap battle |
| A Magnifying Glass | Office | Library trolley; Mensa frame (if you fed it the big list) |
| A Bingo Card | Office | Lecture bingo *(optional)* |
| A Cracked Hourglass · A Rubber Stamp | Office | flavour only |
| A Bottle of Black Ink | Lecture | nothing — the Pond's wrong branch |
| Ceremonial Hook Pole | Hall stepladder | Library catalogue drawer |
| Blank Catalogue Card | Library desk | Professor G *(becomes A Written Mechanism)* |
| Enrolment Register | Library | Workshop, Mensa, Bureau |
| Swedish for Nobel Laureates | Library stacks | the Stockholm call |
| An Extremely Grand Phrase | Hall dispenser | nothing — a decoy |
| Reading List | Library | **Writing Room** (the Registrar) |
| ALTERNATIVE EXPLANATION card | Seminar | **Bureau** |
| Prediction Slip (Form P-1) | the seal | Casino lectern, **Psych Lab** |
| Torn Calendar Page | Ethics | Survey Lab patient 3 |
| Plain-Language Consent Form | Ethics pew | Ethics Tribunal |
| Single-Concept Scissors | Survey Lab cabinet | Survey Lab patient 1 |
| A Likert-Scale Die | Survey Lab triage desk | Survey Lab patient 4 |
| The Questionnaire | Survey Lab | the instrument you leave with |
| Official University List | Ethics approval | Mensa (the wrong frame), Bureau |
| Paper Questionnaire | Ethics approval | Fieldwork |
| Exam Records (by question) | Ethics approval | **Casino** |
| Ballot Box, Discreetly Bagged | Ethics approval | Fieldwork |
| A Mug · Lunch Raffle Drum (SR-2) | Mensa cook | Sampling Officer |
| The Tote-Bag Sample | Mensa, wrong branch | the Cook |
| Free Lunch Voucher | the Cook, or the Fieldwork Director | Fieldwork |
| Reminder Postcards | Fieldwork telephone | Fieldwork |
| A Scoreboard Tile Reading 75 | Fieldwork | Bureau |
| A Tape Reel Marked DATA | Delegation Engine | Casino |
| The Interval, On A Brass Slide | Casino | Bureau, Tobi |
| A Brass Plaque, Engraved By You | Bureau | Writing Room (the Registrar) |
| A Brass Tag ("A Boundary Condition") | Writing Room (the Registrar) | the abstract |

**Tip:** Look at anything in your inventory (in simple controls: click it twice). Every item has
a description, and several contain a nudge. The folder lists what is actually in it. Stuck?
Ask the Professor **"What should I do next?"**, then **"And how exactly?"**
