# The Legend of the Average Student — Outline

*A companion game to The Secret of the Lost Codebook, for an introductory statistics class.
Draft outline, 2026-10-03 (second draft). Nothing here is built.*

**Decided (author, 2026-10-03):**
- The **same grad student** as game one, answering their own Revise and Resubmit.
- **A fixed, made-up dataset**, specified below. Every number in the game comes from that table.
- **Formulas are hidden but can always be looked up**, in the Formula Notebook.
- The **full five acts**.
- **Mini-games in new formats**, not copies of game one's, at least one per act. The one reuse is the arcade
  cabinet: PAC-SOC comes back as PAC-MEAN.

> **Working title:** *The Legend of the Average Student*. Game one now ends on the R&R letter and a card
> reading *To be continued… Part Two: The Revisions* (2026-10-03), so the full title could be *The Lost
> Codebook, Part Two: The Revisions* with *The Legend of the Average Student* as the subtitle.

---

## Logline

The paper came back with **REVISE AND RESUBMIT**, and Reviewer 2's first comment is one line long:
*"Who is the average student in your sample?"* Tobi overhears it, loves it, and orders a bronze statue of
the Average Student for Open Day. The player spends a term hunting for him across a campus full of averages,
until they find out that he is the one student who was never there.

## Why this mystery works for statistics

The Codebook was a myth that turned out to be Methods. The Average Student is a myth that turns out to be
**the mean**: a property of a group that describes no one in it. This is true at three levels, and the game
places one in each third:

1. **Act I.** Attendance in the data is bimodal: students went to almost every lecture or almost none. The
   average is 6.2 of 12 lectures. Only 3 of 240 students attended exactly 6. The Average Student is
   *missing*.
2. **Act V, the sculptor.** In 1950, the US Air Force measured 4,063 pilots on ten body dimensions to build a
   cockpit for the "average pilot". Not one pilot was in the middle range on all ten. The statue, built from
   ten averages, fits nobody in the queue.
3. **Act V, the reveal.** A least-squares line always passes through the point (mean x, mean y). On the giant
   scatterplot of real students standing on the Mensa square, the spotlight falls exactly on that point,
   (6.2 lectures, 61 points), and the tile is empty.

> **PLAYER:** "So where is he?"
> **STELLMACHER:** "Who?"
> **PLAYER:** "The Average Student."
> **STELLMACHER:** *(pause)* "Oh. Him." *(beat)* "We used to call him the mean."

As in game one, **nobody credible ever confirms he exists.** Tobi, KIRA, the brochure and the sculptor talk
about him freely. Stellmacher, the Skeptic and the Visiting Fellow never mention him.

---

## The spine

The player is the same grad student. Their study from game one is the paper under review, and its data is
the dataset all game. Each act answers one cluster of Reviewer 2's comments about it.

| Act | Title | Reviewer 2 asks | Statistics | The player leaves with |
|---|---|---|---|---|
| I | *Apparently Averages Lie* | "Describe your sample." | levels of measurement, mean / median / mode, spread, shape, honest charts | a description that does not mislead |
| II | *Apparently Luck Has Rules* | "Could this be chance?" | probability, expected value, base rates, regression to the mean, randomness | a sense of how chance behaves |
| III | *Apparently Every Number Wobbles* | "How precise is your estimate?" | sampling, sampling distributions, standard error, the square-root law, confidence intervals | an estimate with a ± on it |
| IV | *Apparently Surprise Can Be Measured* | "Is the difference real?" | null hypothesis, p-values, Type I/II errors, multiple testing, power, effect size | the test promised on the sealed slip, and its honest verdict |
| V | *Apparently Things Go Together* | "What is the relationship?" | scatterplots, correlation, Simpson's paradox, regression, residuals, extrapolation | a slope with an interval, which stops at the edge of the data |

**The same joke as in game one:** every institution is ridiculous, and it is also right. Each one overdoes a
statistical habit that, underneath, is worth having.

**Opening.** A 30-second recap for anyone who missed game one (the question, the folder, the submission),
narrated over the first game's paintings. Then the decision letter lands on Stellmacher's desk.

### What changes in the player

Game one ran from panic to competence to temptation to integrity. This game is about **trust in numbers**:

1. **Act I, credulity.** Every number is taken at face value, and every number turns out to be hiding a
   shape.
2. **Act II, suspicion.** Chance fools everyone, including the player. They learn to ask "how often would
   luck do this?"
3. **Act III, calibration.** Every number wobbles, and the wobble can be measured. This is the turning point:
   the player stops asking "is it true?" and starts asking "how sure?"
4. **Act IV, judgement.** A decision has to be made anyway, so they choose their risk before looking and live
   with it.
5. **Act V, restraint.** They draw the line through the data, and **stop drawing it where the data stops.**

### The quest object: the Response Letter

Game one had a folder. This game has the **Response to Reviewers**: a long letter with Reviewer 2's comments
down the left side and empty space on the right. Each solved room writes one answer, and each act ends with
Stellmacher stamping a cluster **ADDRESSED**. Every institution defaces it: the Casino stamps it VOID, the
Court stamps it NOT PROVEN, and Tobi adds stickers.

| After | Letter stamp |
|---|---|
| Act I | `SAMPLE DESCRIBED` |
| Act II | `CHANCE CONSIDERED` |
| Act III | `PRECISION REPORTED` |
| Act IV | `TESTED AS PROMISED` |
| Act V | `RESUBMITTED` |
| Outro | the decision: `ACCEPTED, minor revisions`. Comment 48: *"Please also report the median."* |

### The statue: a visible consequence in every act

The statue stands on its plinth on the campus map, and **every act changes it.** Mrs. Ploetz, a monumental
sculptor commissioned by Tobi and paid by the kilo, builds the Average Student from whatever the player
hands in.

| Act | The statue | Why |
|---|---|---|
| Opening | an empty plinth: *THE AVERAGE STUDENT — COMING SOON* | Tobi's announcement |
| I | a wire frame with 1.5 genders and a postcode in the lake; fixed during the act | the Registry averaged everything |
| II | features chosen by coin toss ("probability 0.5 of a beard") | she has discovered chance |
| III | a blurred cloud of plaster arms, legs and heads | the wobble: "which arm is the real one?" |
| IV | covered in a sheet marked *NOT PROVEN* | the Court has an injunction |
| V | finished in bronze, unveiled, and it fits nobody | the reveal |

---

## The dataset (fixed; the single source of truth for every number)

The study from game one, made concrete: one winter term, **n = 240 first-years**. When a number changes here,
it changes everywhere in the game. The numbers were chosen so that each room's lesson actually happens in the
data.

### Variables

| Variable | Level | Values / shape | Key numbers | Used in |
|---|---|---|---|---|
| Faculty | nominal | Law 52, Medicine 48, Sociology 44, Economics 40, Psychology 32, Physics 24 | mode: Law | I.1, V.2 |
| "How satisfied are you with the lectures?" | ordinal (1–5, the Likert die) | skewed left | mode 4, median 4 (no mean shown) | I.1 |
| Lectures attended | ratio (count, 0–12) | **bimodal**: 0–2: 96 students · 3–9: 36 · 10–12: 108 | mean 6.2, median 8, SD 4.6. **Exactly 6: 3 students** | I.4, IV, V |
| Exam score | interval (0–100) | roughly normal | mean 61, SD 14, median 62 | III, IV, V |
| Commute | ratio (minutes) | right-skewed | median 22, mean 31 | III.2 (the shape of the darts' shake) |
| Hours of sleep before the exam | ratio | normal, 3–11 | mean 7; inverted-U relationship with the exam score | V.1 |

### The study's results (Acts III–V)

| Quantity | Value | Where it appears |
|---|---|---|
| Mean exam score, 95% CI | 61 (59.2 to 62.8); SE = 14/√240 ≈ 0.9 | III.4 |
| Slope of exam on attendance | **+1.1 points per lecture**, 95% CI +0.7 to +1.5 | IV.2, V.3 |
| Test of the slope (the one on the sealed slip) | t ≈ 6, p < .001 | IV.2 |
| Correlation | r ≈ .36, r² ≈ .13 | V.1, V.3 |
| Line | exam = 54 + 1.1 × lectures; passes through (6.2, 61) | V.3, V.4 |
| Going from 0 to 12 lectures | about +13 points, roughly one grade | IV.4 |
| Feldstrom's extrapolation | 100 lectures → 164 points out of 100 | V.3 |

This agrees with game one's finding: *"a modest effect, and a real one."* It is observational, which the
Visiting Fellow says out loud (V.3).

### Side data (not from the study)

| Room | Data |
|---|---|
| I.2 Alumni Hall | 25 alumni: 24 earn €28k–€75k (median €41k); one dropout founder earns €29.5M a year. Mean ≈ €1.2M |
| I.3 Kitchen | soup ladles: half at 95°C, half at 5°C; mean 50°C, SD 45; after stirring 50°C, SD 3 |
| I.4 Chart Hall | applications 98 → 100 (+2%), shown on an axis starting at 98 as "UP 300%" |
| II.1 Casino | European wheel: 18 red, 18 black, 1 green. Expected value of €1 on red = −1/37 ≈ −2.7 cents |
| II.2 Infirmary | base rate 1%, sensitivity 99%, false-positive rate 5%. Per 1,000: 10 ill and positive, 50 healthy and positive → P(ill \| positive) ≈ 1 in 6 |
| II.4 Monkey Hall | three doors; staying wins 1/3, switching 2/3 |
| III.2 Darts | spread of single darts 40 cm; averages of 4: 20 cm; of 16: 10 cm |
| III.4 Quiz | 10 questions with 90% ranges; typical first round 4–6 of 10; KIRA 0 of 10 |
| IV.3 Maze | 5 forks, 32 endings, 7 at p < .05; the promised path: p < .001 |
| III.3 Fieldwork | the poll A 52 / B 48. Margin of error ±10 at n = 100, ±7 at 200, ±5 at 400 |
| IV.1 Tea | 8 cups, 4 + 4; all correct by guessing: 1 in 70 (p ≈ .014) |
| IV.3 Pens | 20 colours tested; P(at least one p < .05 by chance) ≈ 64%. Turquoise p = .03, then .61 on fresh data |
| V.2 Admissions | six faculties; women are admitted at an equal or higher rate in each, and lower overall (modelled on Berkeley, 1973) |

---

## The Formula Notebook (hidden, always available)

**The formulas never block play.** The calculator does every sum, and the puzzles are about judgement: which
summary, which net, which card.

Each solved room adds one page to **Stellmacher's old Formula Notebook**, a battered leather notebook that
appears in the bag at the start of the game, with most pages blank. Opening it shows, for each room:

- the **formula**, e.g. SE = s / √n;
- the formula **with this room's numbers in it**, e.g. 14 / √240 ≈ 0.9;
- **one plain sentence** of what it means;
- a **margin doodle** of the room's picture: the ladles, the darts, the springs.

There are three ways in:

1. **The notebook in the bag**, at any time.
2. **"Show the working"** on the calculator, whenever it is used.
3. **"The formula"**, a small link on each act's "what you learned" card.

Some notebook pages are **dog-eared by a previous owner** with a wrong formula, e.g. "SE = s × n". The
handwriting matches the Doorman's (see Characters). The pages are corrected as the player goes.

| Page | Formula | Room |
|---|---|---|
| 1 | levels of measurement → allowed summaries (mode / median / mean) | I.1 |
| 2 | mean x̄ = Σx / n; median = the middle value | I.2 |
| 3 | SD s = √( Σ(x − x̄)² / (n − 1) ) | I.3 |
| 4 | histogram, bin width; the relative change (new − old) / old | I.4 |
| 5 | expected value E = Σ p·x | II.1 |
| 6 | Bayes, in natural frequencies; P(A\|B) = P(B\|A)P(A) / P(B) | II.2, II.4 |
| 7 | regression to the mean: score = true level + luck | II.3 |
| 8 | the law of large numbers | II.1 (PAC-MEAN) |
| 9 | the sampling distribution; SE = s / √n | III.1, III.2 |
| 10 | the square-root law: margin ≈ 1.96 · SE; ×4 n → ½ error | III.3 |
| 11 | 95% CI = x̄ ± 1.96 · SE | III.4 |
| 12 | p-value; 1 / C(8,4) = 1/70 | IV.1 |
| 13 | α, β, power = 1 − β; the 2×2 table of decisions | IV.2, IV.4 |
| 14 | multiple testing: 1 − 0.95²⁰ ≈ 0.64; the Bonferroni α / k; forking paths 2⁵ = 32 | IV.3 |
| 15 | effect size: Cohen's d = difference / SD; t = estimate / SE | IV.4 |
| 16 | Pearson's r; r² | V.1 |
| 17 | conditional rates; Simpson's paradox | V.2 |
| 18 | least squares: b = r · s_y / s_x; a = ȳ − b·x̄; the CI for b | V.3 |
| 19 | the line passes through (x̄, ȳ) | V.4 |

**The notebook's last page**, unlocked by the reveal, is in Stellmacher's own handwriting: *"x̄ — nobody in
particular."*

---

## Mini-games

Eleven, all to be tried out in a prototype; the weak ones get cut after play-testing. None is a reskin of
game one's bingo, battles, duel or corrections. **The one exception is the arcade cabinet**: PAC-SOC returns
as PAC-MEAN, for the fun of it. Each mini-game:
- teaches its room's lesson by being played, not by being explained;
- takes about three minutes;
- works with one finger on a phone.

| Room | Mini-game | Genre | What it teaches | Needed? |
|---|---|---|---|---|
| I.2 | **The Seesaw** | physics toy | the mean is a balance point; outliers drag it; the median doesn't move | yes |
| I.4 | **Histris** | falling blocks | bins and shape: a histogram can hide or show the truth | yes |
| II.1 | **PAC-MEAN** | arcade (the one reuse) | the law of large numbers; the gambler's fallacies have names | optional; a high score earns bonus points |
| II.4 | **The Monkey Hall Problem** | game show | conditional probability: information moves the odds | yes |
| III.2 | **Averaged Darts** | darts | the sampling distribution; SE = s/√n | yes |
| III.4 | **The Skeptic's 90% Quiz** | pub quiz | what a confidence level means; we are all too sure | yes |
| IV.3 | **The Garden of Forking Paths** | hedge maze | p-hacking, and why the plan is written down first | yes |
| IV.4 | **Lighthouse Watch** | signal detection | Type I and Type II errors; α; power | yes |
| V.1 | **Data Dating** | swipe | reading scatterplots; r only sees straight lines | yes |
| V.4 | **Where's Average?** | hidden object | the average describes a group, not a person | yes, and it cannot be won |
| Outro | **Revision Pong** | pong | answering a reviewer: concede what is true, bring evidence for the rest | yes |

### How each one plays

**The Seesaw (I.2).** The 25 alumni sit along a long plank, each at their salary.
1. Slide the fulcrum until the plank balances. That point is the mean.
2. The billionaire climbs on at the far end, and the plank slams down. To balance again, the fulcrum has to
   slide out to €1.2M, past everybody. Meanwhile the person in the middle (the median, a schoolteacher on
   €41k) has not moved.
Three rounds, with three crowds: symmetric, skewed, and skewed plus the billionaire. The player predicts
where the fulcrum will end up before letting go.

**Histris (I.4).** Students fall from the top like blocks, each labelled with the number of lectures they
attended. Before each wave, the player drags the bin walls.
- Too few bins: one tall tower, and the shape is hidden.
- Too many: spiky rubble.
- The right bins: the stack fills the wave's silhouette and the row clears.
The last wave is the real attendance data: two towers (0–2 and 10–12) with a gap in between, right where the
mean is.

**PAC-MEAN (II.1).** Game one's cabinet, rewired.
- Every dot eaten is a coin toss, and a meter shows the running share of heads. It swings wildly at first,
  then settles near 50%.
- The four ghosts are **Due, Hot Hand, Jinx and Streak**.
- INDEPENDENCE pellets make them edible.
It takes a casino token.

**The Monkey Hall Problem (II.4).** The monkeys run a game show. Three doors; a banana behind one, skeletons
behind the others.
1. The player picks a door.
2. The monkey host, who knows, opens a skeleton door and offers a swap.
3. The tally board counts wins for staying and for switching. After a few rounds, switching wins about 2 in 3.
A fast-forward lever plays 1,000 rounds for the doubters. To win the room, take 10 bananas (quick if you
switch).

**Averaged Darts (III.2).** The dartboard in the Clocktower bar. The bull is the true average, and the
player's hand shakes. The shake is lopsided, low and left (skewed, like the commute times).
- Throw single darts: they scatter wide and lopsided.
- "Throw 4, mark their average": the marks cluster half as wide.
- "Throw 16": a quarter as wide, and evenly round the bull, even though the hand is lopsided.
To win, land 5 marks inside the bull ring, which only averages of 16 manage. The Sampling Officer turns his
raffle drum to decide each throw: "a draw, madam, not a choice."

**The Skeptic's 90% Quiz (III.4).** The pond pavilion, quiz night. There are no answers, only ranges:
- "How tall is the Clocktower?"
- "How many swans are on the pond?"
- "When was the Mensa built?"
For each, set two sliders to a range the player is 90% sure of.
- KIRA plays too, giving exact numbers ("Certainly! 47 metres."), and scores 0 of 10.
- Most players catch 4–6 of 10 on the first round, because their ranges are too narrow. The Skeptic is
  thrilled.
To win, score 8 or more in a round. Then set the interval for the player's own data the honest way: 61, from
59.2 to 62.8.

**The Garden of Forking Paths (IV.3).** A hedge maze behind KIRA's lab.
- Every fork is an analysis choice: drop the outliers? Law students only? Control for sleep? Log the scores?
- Five forks give 32 endings. Seven end at fountains labelled p < .05.
- KIRA runs every path at once and comes back with *"Certainly! Seven discoveries!"*
The player has the map from the sealed slip and must walk exactly the path it promised. The hedges whisper
shortcuts as they pass. At the end of the promised path is the real result (p < .001), and no fountain.

**Lighthouse Watch (IV.4).** It is foggy at night. Blips cross the screen, mostly waves. Ring the bell when
a blip is a ship.
- A slider sets how big a blip must be before the player rings. That is α.
- Too low: false alarms, and ships divert for nothing (Type I).
- Too high: wrecks (Type II).
The night is scored on a 2×2 board. Then Feldstrom's bigger lamp arrives (a larger n): ships stand out from
the waves, and both kinds of mistake drop. To win, get through a night with at most one mistake of each kind.

**Data Dating (V.1).** The Matchmaker's app. Each card is a pair of variables with its scatterplot.
- Swipe right: "goes together".
- Left: "strangers".
- Up: "it's complicated" (a curve, or a pair held together by one outlier).
Twenty cards, faster and faster. Sleep and exam score is the "it's complicated" card that everyone swipes
left on. To win, get 15 of 20.

**Where's Average? (V.4).** A drone view of all 240 students on the Mensa square. The task is to find the
Average Student.
- Tap anyone to see their ten measures, green where they are average and red where not.
- Tobi shouts candidates ("this one has the average height!"). Every one is red somewhere.
The timer runs out. The game cannot be won, and that is the reveal.

**Revision Pong (outro).** Reviewer 2 serves comments across a desk. The player's paddle has three zones:
CONCEDE, EVIDENCE and CLARIFY.
- The right zone returns the comment weaker.
- The wrong zone sends it back faster, split in two.
The flags make some comments start fast. The match is won at 47 points, one per comment.

---

## Characters

### Returning

| Who | Role here | Arc in this game |
|---|---|---|
| **Prof. Stellmacher** | Opens and closes the game, and owns the Formula Notebook. Her first line: *"It's accurate. How accurate?"* | In game one she learned to say "send it". Here she learns to say "plus or minus". |
| **Tobi** | Commissions the statue, runs the Open Day brochure, and live-streams Where's Average? from his drone. | Ends by replacing the statue on the brochure with a photo of the whole crowd: *"The vibe is… everybody?"* |
| **KIRA** | Computes everything instantly and certainly. Plays the 90% Quiz (III.4) and runs every path of the Garden of Forking Paths (IV.3). | Her arc is one word: **"Certainly!"** becomes **"Probably."** |
| **Feldstrom** | Extrapolates every line to the year 2100. Installs the giant lamp (IV.4) and owns the Tower (V.3). | Still waiting for Stockholm. He computes the probability that they call: *"Non-zero!"* |
| **The Skeptic** | Hosts the 90% Quiz at the pond (III.4), and sits in the Court's gallery (IV.2). | Delighted every time a range misses, especially her own. |
| **The Cook** | The Mensa: soup temperature (I.3) and tasting the soup (III.1). | Learns to stir. The schnitzel hotline is still open. |
| **The Nurse** | The Infirmary's screening test (II.2). | Learns that accurate and informative are not the same thing. |
| **The Sampling Officer** | The raffle drum, now deciding every dart in the Clocktower Bar (III.2). | Finally samples the right population. |
| **The Ethics Tribunal** | Re-robed as the Court of the Null Hypothesis (IV.2). | The sleeping member is the court's statistical power. |
| **The Visiting Fellow** | V.3: *"Were the students who came simply different?"* | Still right; still never the butt of a joke. |
| **The monkeys / Reviewer 2** | The Monkey Hall game show (II.4); Reviewer 2 serves in Revision Pong. | Reviewer 2 is still a monkey. |
| **The Doorman** | Guards the Statistics Wing, *closed since the Great Recount*. His wrong formulas are in the notebook's margins (he went looking for the Average Student forty years ago). | Gets the last line before the reveal: *"You knew." / "On average."* |

### New

- **Mrs. Ploetz, the Sculptor.** Literal-minded, and paid by the kilo. Builds whatever average she is given,
  without asking whether it describes a person. A good soul; the statue is her life's work.
- **The Registrar of Levels.** Files every variable as a number and then averages it. Has computed the mean
  student ID number, and is very proud of it.
- **The Croupier.** Runs the reopened Basement Casino. Polite and honest, and paid by the house edge. The
  2.7% is written on the wheel, and nobody reads it.
- **The Coach.** Shouts at players after bad games, praises them after good ones, and has noticed that
  shouting works.
- **Lady Darjeeling.** A retired dean who can taste whether the milk went in first. Based on the real 1920s
  story behind Fisher's exact test. She is right; the room is about proving it fairly.
- **The Matchmaker.** Runs the Dance Hall. Pairs everything with everything and reads the chemistry of each
  pair off a dial from −1 to +1.
- **Dr. Quetel** (a portrait only). The department's founding statistician, who went looking for *l'homme
  moyen*. A nod to Adolphe Quetelet, who did exactly that in the 1830s. The rumour starts with his portrait.

### Skeletons (one per room, as before)

| Room | The skeleton's sign |
|---|---|
| Registry | *AVERAGE POSTCODE: IN THE LAKE* |
| Alumni Hall | *EXPECTED SALARY €1.2M* |
| Kitchen | half frozen, half boiled: *ON AVERAGE, COMFORTABLE* |
| Chart Hall | *UP 300%* |
| Casino | *RED WAS DUE* |
| Infirmary | *TESTED POSITIVE (99% ACCURATE)* |
| Sports Hall | *COVER STAR, 1987* |
| Monkey Lab | still typing |
| Clocktower | waiting for the census |
| Fieldwork Arena | *DOUBLED N, STILL ±7* |
| Pond | a skeleton with a very narrow net |
| Tea Salon | waiting for the 71st cup |
| Court | *PROVEN INNOCENT* |
| Pen Lab | holding 20 pens |
| Lighthouse | *THERE ARE NO SHIPS* (and a candle) |
| Dance Hall | dancing with the outlier |
| Admissions | *BIASED (OVERALL)* |
| Feldstrom's Tower | on a ladder, at the year 2100 |

---

## Act I — *Apparently Averages Lie* (describing data)

**Opening in the Office.** The decision letter arrives. Stellmacher reads comment 1 aloud and hands over the
Formula Notebook: "Most of it is blank. Fill it in." Tobi, in the doorway: *"The Average Student? Love that.
Can we get a statue?"* By the time the player reaches the map, the plinth is up.

### I.1 The Registry of Levels

- **The joke.** The Registrar has averaged everything:
  - mean gender 1.5;
  - mean faculty 3.2 ("somewhere between Sociology and Economics");
  - the mean postcode, which is in the middle of the lake.
- **The goal.** Re-file four index cards (faculty, satisfaction, exam score, lectures attended) into four
  drawers: NOMINAL, ORDINAL, INTERVAL and RATIO. The ratio drawer has a true zero: it is the only drawer that
  is genuinely empty.
- **Items.**
  - The Likert die from game one goes on the ordinal card.
  - The reward is the Registrar's **Pocket Calculator**, used all game; it has a "Show the working" button.
- **The wrong branch.** Let him average the postcodes: the statue's wire frame gets a postcode sign and walks
  into the lake. Re-filing pulls it back out.
- **Notebook page 1.**
- **The lesson.** *What kind of number it is decides what you may do with it. Count categories, rank orders,
  and average only real amounts.*

### I.2 The Alumni Hall of Fame (with The Seesaw)

- **The joke.** Tobi's brochure says *"Our graduates earn €1.2 million a year on average."* One dropout
  founded a snack-delivery app and pays himself €29.5M a year.
- **The goal.**
  1. Play **The Seesaw**. The fulcrum ends up at €1.2M, out past everybody, while the schoolteacher in the
     middle (€41k, the median) never moves.
  2. Choose which number goes on the brochure.
- **The wrong branch.** Approve the mean anyway. The brochure prints €1.2M, and the flag `mean_misused` is
  set; Reviewer 2 brings it up in the outro.
- **The lesson.** *The mean is the balance point, so one extreme value drags it. The median stays where it
  was. With skewed money, report the median.*

### I.3 The Mensa Kitchen: the soup is fine on average

- **The joke.** Half the soup is boiling and half is frozen solid. The Cook's thermometer says 50°C on
  average: "perfect." The queue complains.
- **The goal.**
  1. Ladle soup from ten places and pin each ladle on the **Deviation Ruler** above the stove. The typical
     distance from 50 is 45 degrees.
  2. Stir. The ladles bunch up (SD 3), and the queue is happy.
- **A seed for Act III.** Stirring returns in III.1, where it is what makes one spoonful enough.
- **The lesson.** *An average without its spread is half a sentence. The standard deviation is the typical
  distance from the mean.*

### I.4 The Hall of Charts (with Histris)

- **The joke.** This is Tobi's infographics department, and his Open Day pitch is running on the projector.
- **The goal.**
  1. **The axis.** Drag "UP 300%" down to a zero baseline, and it becomes a 2% bump. Tobi: *"Less of a story,
     honestly."*
  2. **Histris.** The last wave is the attendance data: two towers (96 students at 0–2, 108 at 10–12), with
     a gap near the mean.
- **The Act I reveal (stage one).** A pin marked *AVERAGE STUDENT: 6.2 LECTURES* sits in the near-empty bin.
  - Tobi: *"So where is he?"*
  - The Registrar checks: "Three students attended six. None of them are average on anything else."
  - The player: "Then he's somewhere else."
  The mystery is redirected, not solved.
- **The lesson.** *Look at the shape before you trust a summary. An axis can tell a lie the numbers never
  told.*

**Act I card:** *A number describes a group, not a person. Say what kind of number it is, where the middle is
(the median is 8 lectures; the mean, 6.2, sits in a gap), how wide it spreads, and what shape it has.*

---

## Act II — *Apparently Luck Has Rules* (probability)

**The comment.** *"Could your result be chance?"* Stellmacher: "Then you'd better know what chance looks
like."

### II.1 The Basement Casino, under new management (with PAC-MEAN)

- **The joke.** Red has come up nine times in a row, and the whole crowd is betting on black: "it's due."
- **The goal.** Win the Croupier's gold chip, which is needed in IV.1, by **not betting**.
  - Use the calculator on the wheel. A €1 bet on red wins with probability 18/37 and pays even money, so the
    expected value is −2.7 cents per spin.
  - Show the Croupier the tally board for 10,000 spins: about 48.6% red.
  - He gives the chip to "the only person in forty years who read the wheel".
- **PAC-MEAN** stands in the corner. It is optional, takes a casino token and adds a notebook doodle.
- **The lesson.** *The wheel has no memory. Over many spins chance evens out; over a few it streaks. The house
  wins on the average, not on the night.*

### II.2 The Infirmary: the Methods Flu test

- **The joke.** Tobi tested positive for Methods Flu. The test is "99% accurate", and he is recording a
  farewell video.
- **The goal.** The Nurse's ward has 1,000 tiny beds: an icon array the player fills.
  - 10 people are ill, and all 10 test positive.
  - About 50 healthy people test positive too.
  - Of the 60 positives, 10 are ill: about 1 in 6.
  The player hands Tobi the **Ward Chart**.
- **Visible.** The flagged beds light up, and Tobi deletes the video.
- **The lesson.** *Ask how common the thing was to begin with. Count in people, not percentages.*

### II.3 The Sports Hall: the cover curse

- **The joke.** Every student Tobi puts on the brochure cover does worse the next term, and he believes in a
  curse. The Coach believes in shouting.
- **The goal.** Run the experiment with no curse and no shouting.
  - Take round one's ten best shooters, do nothing to them, and they come down in round two.
  - The ten worst come up without being shouted at.
  - The bleacher board shows both lines meeting in the middle.
- **Items.** The Coach's **stopwatch**, used in III.3.
- **The lesson.** *An extreme result is partly luck, and luck does not repeat. Without a comparison, a return
  towards the middle looks like an effect.*

### II.4 The Infinite Monkey Project (with The Monkey Hall Problem)

- **The joke.** The lab has given up on typewriters. The monkeys now run a game show, and the Psych Lab
  insists that sticking with your first door is "a matter of character".
- **The goal.** Win 10 bananas in **The Monkey Hall Problem**. Staying wins 1 in 3, and switching wins 2 in 3.
- **The reward.** The **Random Number Table**: the sheet the monkeys draw their doors from, so that nobody can
  predict them. It randomises the tea in IV.1.
- **The lesson.** *When someone who knows opens a door, the odds move. Two doors left does not mean 50:50.*

**Act II card:** *Chance has no memory and ignores your hopes, but it does listen to new information. Before
you explain a result, ask how often luck alone would give it.*

---

## Act III — *Apparently Every Number Wobbles* (sampling and estimation)

**The comment.** *"How precise is your estimate?"* Feldstrom, passing by: "Precise? It's a number. Numbers
are exact."

### III.1 The Mensa Kitchen: taste, don't drink

- **The joke.** To check the salt, the Cook is drinking the entire cauldron, which is a census, and he is
  visibly struggling.
- **The goal.**
  1. Stir (as learned in I.3), then taste one spoon.
  2. Then the Open Day festival cauldron, which is fifty times bigger. Tobi insists on a fifty-times-bigger
     spoon; the player uses the same spoon.
- **The lesson.** *A well-mixed (random) sample tells you about the whole. How precise it is depends on the
  size of the spoon, not of the pot.*

### III.2 The Clocktower Bar (with Averaged Darts)

- **The joke.** Tobi wants one perfect throw that lands on the Average Student. The Sampling Officer has
  brought his raffle drum to the dartboard, "to keep it honest".
- **The goal.** **Averaged Darts**: land 5 marks in the bull ring, which only averages of 16 manage.
- **KIRA:** *"Certainly! Every mark is the Average Student!"*
  **The Sampling Officer:** "No, madam. Every mark is an *average*."
- **The lesson.** *Averages of samples cluster around the truth, more tightly the bigger the sample, and
  evenly even when individuals are lopsided. How tightly is the standard error.*

### III.3 The Fieldwork Arena: the square-root law

- **The joke.** Tobi's student-election poll reads A 52%, B 48%, n = 100, and he is calling the election.
  The Director's board reads ±10.
- **The goal.**
  1. Doubling the sample drops the board only to ±7.
  2. The answer is four times the sample for half the error. Recruit 400 students, using the stopwatch and
     the megaphone, and the board reads ±5.
  3. The honest headline is "too close to call", and Tobi has to live with it.
- **The lesson.** *Precision grows with the square root of the sample. Some differences are too small for
  the sample you have.*

### III.4 Probability Pond (with The Skeptic's 90% Quiz)

- **The joke.** It is quiz night at the pond pavilion. The Skeptic asks questions with no answers, only
  ranges. KIRA is very confident.
- **The goal.** Score 8 of 10 in **The Skeptic's 90% Quiz**. Then write the player's own range: 61, from
  59.2 to 62.8.
- **The lesson.** *Say how sure you are with a range. A 95% interval comes from a method that misses 1 time
  in 20. Most people's ranges are far too narrow.*

**Act III card:** *Every estimate wobbles. Say how much: the standard error, and an interval. More data helps,
but only by the square root.*

---

## Act IV — *Apparently Surprise Can Be Measured* (hypothesis testing)

**The comment.** *"Is the difference real? How many tests did you run?"*, game one's comment 9 coming back.
The **sealed Prediction Slip** from game one is opened at the start of the act. The test to be run is the
one written on it: the slope of exam score on attendance.

### IV.1 The Tea Salon: the lady tasting tea

- **The joke.** Lady Darjeeling can tell whether the milk went in first. The salon has argued about it since
  1926.
- **The goal.** Design a fair test.
  1. Pour 8 cups: 4 milk-first, 4 tea-first.
  2. Put them in a random order with the Random Number Table. In the wrong branch, the cups go in order
     MMMMTTTT, and she spots the pattern.
  3. She gets all 8 right. Guessing would manage that 1 time in 70.
  4. Pay with the Croupier's gold chip, and keep the **p-value ticket**.
- **The lesson.** *A p-value is how surprising the result would be if nothing were going on. It is not the
  chance that nothing is going on.*

### IV.2 The Court of the Null Hypothesis

- **The joke.** The defendant is *"Lectures Make No Difference"*, presumed true until proven otherwise. The
  clerk has two stamps: GUILTY and PROVEN INNOCENT.
- **The goal.**
  1. Swap PROVEN INNOCENT for **NOT PROVEN**, from the evidence locker.
  2. Then try the player's own case: **GUILTY**. The slope is +1.1 points per lecture, t ≈ 6, p < .001.
  3. The Skeptic, in the gallery, is slightly disappointed.
- **The two cells of the jail.**
  - An innocent man locked up is a Type I error, at the rate α the court chose in advance.
  - A guilty man walking free is a Type II error.
  - The member who is asleep is the court's power.
- **The lesson.** *Not rejecting is not proving. Choose your risk of a false alarm before the trial, not
  after.*

### IV.3 KIRA's Pen Laboratory (with The Garden of Forking Paths)

- **The joke.** KIRA has tested which of 20 pen colours improves exam scores. Turquoise wins, p = .03.
  *"Certainly!"* Tobi has the press release ready: *TURQUOISE PENS BOOST GRADES*.
- **The goal.**
  1. Stop the press release. Roll the d20: with 20 tests, a "significant" colour turns up by chance about
     two times in three. Retesting turquoise on fresh data gives p = .61.
  2. Then **The Garden of Forking Paths**: walk the one path the sealed slip promised.
- **The wrong branch.** Let the press release go: the flag `p_fished` is set, and the campus fills with
  turquoise pens.
- **KIRA's first crack**, at the maze's exit: *"Certainly. …How many of the other thirty-one should I have
  mentioned?"*
- **The lesson.** *Run many tests and something always "works". Count the tests, or test once, on purpose,
  as planned.*

### IV.4 The Lighthouse: errors, power and effect size (with Lighthouse Watch)

- **The joke.** The old keeper watched through the fog with a candle (a small n), saw nothing, and painted
  *THERE ARE NO SHIPS* on the wall. Feldstrom has installed a giant lamp, which spots a seagull at
  p < .0001; he calls it a fleet.
- **The goal.**
  1. Get through one night of **Lighthouse Watch**.
  2. Ask the size question: the seagull is "significant" and trivial.
  3. Write the player's own effect size into the letter: about +13 points from 0 to 12 lectures, roughly one
     grade.
- **The lesson.** *Every rule for ringing the bell trades false alarms against misses. More light (more
  data) cuts both. The size of what you saw decides whether it matters.*

**Act IV card:** *Decide what would surprise you before you look. Report how surprising it was, and how big.
Count your tests.*

---

## Act V — *Apparently Things Go Together* (correlation and regression), and the finale

**The comment.** *"What, precisely, is the relationship between attendance and results?"*

### V.1 The Dance Hall (with Data Dating)

- **The joke.** The Matchmaker reads the "chemistry" of every pair off a dial from −1 to +1, and has now
  launched an app.
- **The goal.**
  1. Score 15 of 20 in **Data Dating**.
  2. **Hours of sleep and exam score** dance in a perfect arch. The dial reads 0, and the Matchmaker declares
     them strangers. The player shows him the scatter.
  3. **One outlier couple**, the billionaire dropout from I.2, swings a weak pair up to r = .8 on their own.
     Escort them off, and the dial drops back.
- **The lesson.** *Correlation measures straight lines only. Look at the scatterplot, and watch the single
  points that pull it.*

### V.2 The Admissions Office: Simpson's paradox

- **The joke.** Tobi's report says the university admits women less often than men, and the Dean is
  panicking. But in **every faculty**, women are admitted at the same rate or more often.
- **The goal.** Pour the giant admissions jar into six faculty jars. Women applied mostly to the faculties
  that reject almost everyone, and the trend arrows flip.
- **The lesson.** *A hidden third variable can reverse a trend when groups are lumped together. Split before
  you conclude.*

### V.3 Feldstrom's Tower: the line, and where it stops

- **The joke.** Feldstrom fits lines the way physicists do and then extends them to the end of the universe.
  At 100 lectures, his line predicts 164 points out of 100.
- **The goal.**
  1. **Fit the line.** Each student is a peg on the wall, tied to a sliding rod with a rubber band. Let go,
     and the rod settles where the bands pull least: least squares, shown with real springs. Feldstrom is
     moved: "*This* is physics."
  2. **Read the slope:** *"+1.1 points per lecture (95% CI +0.7 to +1.5), r = .36."* The rod passes through a
     brass ring at (6.2, 61).
  3. **Cut the line** with scissors at 0 and 12 lectures. The wrong branch, letting him keep the line to 2100,
     sets the flag `extrapolated`.
- **The Visiting Fellow, in the doorway:** "And the students who came, were they simply different?" The
  player writes the limitation into the letter before anyone else asks.
- **The lesson.** *A slope says how much y changes per unit of x, with an interval. It holds only where you
  have data. A line through observations is not a cause.*

### V.4 Open Day: the reveal (with Where's Average?)

The Mensa square on Open Day: the band, the bronze statue under its sheet, Tobi with a drone, and all 240
students.

1. **The statue.** Mrs. Ploetz unveils the Average Student, built from ten averages in the data. Tobi wants
   its living twin on the brochure cover.
2. **Where's Average?** Nobody matches on more than three measures (the 1950 cockpit story). The timer runs
   out.
3. **The scatterplot.** The player has the students stand on the square's tiled grid: attendance along one
   side, exam score along the other. The drone shot shows the whole dataset as people, with the fitted line
   painted across the tiles.
4. **The spotlight** swings to the one point the line must pass through, (6.2, 61), and finds an empty tile.
   - Tobi: *"Where is he?"*
   - The Doorman, at the edge: *"You knew."*
   - The player: *"On average."*
5. **Stellmacher**, arriving late: *"Oh. Him. We used to call him the mean."* The notebook's last page writes
   itself.
6. **Tobi** reshoots the brochure cover from above: all 240 students, the whole distribution. *"The vibe
   is… everybody?"*
7. Mrs. Ploetz relabels her statue **NOBODY IN PARTICULAR**, and is very pleased with it.

---

## The outro: Reviewer 2, round two (Revision Pong)

The decision letter arrives as a match of **Revision Pong**. Each comment is a ball, and it needs the right
zone of the paddle.

| Reviewer 2 serves | Hit it with | Starts fast if |
|---|---|---|
| "Describe the typical student." | EVIDENCE: the median (8) and the histogram | `mean_misused` |
| "This could be chance." | EVIDENCE: the sealed slip and p < .001 | — |
| "How precise?" | EVIDENCE: 59.2 to 62.8 | — |
| "You ran many tests." | CLARIFY: one test, the one on the slip | `p_fished` |
| "So 100 lectures would give 164%?" | CLARIFY: only within 0–12 | `extrapolated` |
| "The study is small." | CONCEDE | — |
| "Selection!" (the boss ball, which splits three times) | CONCEDE, then EVIDENCE: the limitation written in V.3 | — |
| "Please cite Smith (1987)." | CLARIFY: there is no Smith (1987) | — |

- **The verdict.** An honest letter wins **ACCEPTED, minor revisions**. Comment 48: *"Please also report the
  median."*
- **KIRA's final line**, when asked whether the paper will be cited: *"Probably."*
- **The sequel card.** *THE LEGEND OF THE AVERAGE STUDENT, PART TWO: THE REPLICATION*. *Coming in about 19
  out of 20 timelines.*

---

## What you learned (the act cards, collected)

This mirrors `LESSONS.md`, so that instructors can hand it out.

| Act | Lessons, one per room |
|---|---|
| I | What kind of number it is decides what you may do with it · Skewed: report the median · An average needs its spread · Look at the shape and the axis |
| II | Chance has no memory; the house wins on average · Count in people, not percentages · Extremes regress · New information moves the odds |
| III | A stirred spoon is enough, whatever the size of the pot · Averages cluster, and tighter with n · Four times the data for half the error · Say a range, and make it honest |
| IV | p = how surprising if nothing were going on · Not rejecting is not proving · Walk the path you promised · False alarms against misses; size matters |
| V | Look at the scatter · Split before you conclude · A slope with an interval, only inside the data · The average describes a crowd, not a person |

## Misconceptions each room targets (for instructors)

| Misconception | Room |
|---|---|
| "You can average any number." | I.1 |
| "The mean is the typical value." | I.2, I.4, V.4 |
| "If the average is fine, everything is fine." | I.3 |
| "Truncated axes are just zooming in." | I.4 |
| "The histogram shows the data; the bins don't matter." | I.4 (Histris) |
| "It's due." (the gambler's fallacy) | II.1 (PAC-MEAN) |
| "99% accurate means 99% sure." (base-rate neglect) | II.2 |
| "My intervention worked." (regression to the mean) | II.3 |
| "Two doors left means 50:50." | II.4 |
| "A bigger population needs a bigger sample." | III.1 |
| "Individuals and averages vary the same way." | III.2 (darts) |
| "Double the data, half the error." | III.3 |
| "My 90% guesses are 90% right." (overconfidence) | III.4 |
| "p is the probability that H0 is true." | IV.1 |
| "Not significant means no effect." | IV.2, IV.4 |
| "Trying a few analyses is harmless." | IV.3 (maze) |
| "A stricter test is always better." | IV.4 (lighthouse) |
| "One significant result among many is a finding." | IV.3 |
| "Significant means important." | IV.4 |
| "r = 0 means no relationship." | V.1 |
| "The overall trend holds in every group." | V.2 |
| "The line goes on forever." / "The slope is a cause." | V.3 |

---

## Fitting it to a course

The game supports a standard 12–14-week introduction (descriptives → probability → sampling → inference →
regression). Play **one act every two to three weeks, as homework before the lectures** on the topic: the
game sets up the intuition, and the lecture formalises it. The Formula Notebook is the bridge between the
two.

| Weeks | Topic | Act | Playing time |
|---|---|---|---|
| 1–3 | data, levels of measurement, descriptives, graphs | I | ~40 min |
| 3–5 | probability, Bayes, expected value | II | ~40 min |
| 5–8 | sampling distributions, CLT, SE, CIs | III | ~40 min |
| 8–11 | testing, errors, power, multiple testing, effect sizes | IV | ~45 min |
| 11–14 | correlation, regression, confounding | V and the outro | ~55 min |

- **Course bonus points** reuse game one's system: one code per finished act, plus optional codes for the
  PAC-MEAN high score and a perfect Lighthouse night.
- **The dataset as a file.** The 240 students can be downloaded from the Formula Notebook as
  `average-student.csv` (with a codebook, of course), so that the lectures can analyse the same data in R,
  jamovi or SPSS. Students then meet their own game numbers in the software.

---

## Design rules (carried over from game one)

- **One clear goal per room.** Cut unexplained steps rather than explain them.
- **Every action changes the scene visibly**: bars shrink, ladles slide, darts cluster, bells ring, jars
  split. Text alone is never the consequence.
- **Every institution is ridiculous, and right.** If a room only mocks, it teaches cynicism. If it only
  explains, it is a textbook.
- **Formulas never block progress.** They are always in the notebook, and never asked for.
- **The wrong branch is allowed, and costs later.** Three flags cross acts (`mean_misused`, `p_fished`,
  `extrapolated`). None is a game over; all make Reviewer 2 serve faster in Revision Pong.
- **Items cross rooms and acts:**
  - the Likert die (game one) goes to I.1;
  - the calculator from I.1 is used all game;
  - the stirring in I.3 pays off in III.1;
  - the stopwatch from II.3 is used in III.3;
  - the Random Number Table from II.4 and the chip from II.1 both go to IV.1;
  - the sealed slip (game one) is opened in IV;
  - the alumni outlier from I.2 is back in V.1.
- **A new pose per room**, several poses per character, voiced lines throughout, and lip-sync.
- **Mini-games are part of the lesson, never a detour.** Each must be winnable in about three minutes, with
  simple controls on a phone.

---

## Build notes

- **Engine.** Copy the single-file engine from `web/the-secret-of-the-codebook.html`: rooms, the inventory,
  simple controls, voices, lip-sync, blinks, rigs, the act cards, the map with its seasons.
- **Mini-games.** New code, except PAC-MEAN, which rewires the PAC-SOC cabinet. Histris, Averaged Darts,
  Lighthouse Watch and Revision Pong can share one small canvas-arcade helper; the Seesaw, the Monkey Hall,
  the quiz, the maze, Data Dating and Where's Average? are ordinary room UI.
- **Try them all first.** Build the eleven mini-games as standalone prototype pages (`companion/proto/`), one
  file each, with placeholder art. Play-test them before any room is painted, and keep the ones that are fun
  and teach.
  Pull the engine into a shared file only once the second game shows which parts it really needs.
- **Reused art.** The map, the Mensa, the Pond, the Basement, the Tribunal hall, the Psych Lab, and all
  returning characters.
- **New paintings.**
  - Rooms: the Registry, the Alumni Hall, the Chart Hall, the Infirmary ward, the Sports Hall, the
    Clocktower, the Tea Salon, the Lighthouse, the Dance Hall, Admissions, Feldstrom's Tower, the Open Day
    square.
  - New characters: Mrs. Ploetz, the Registrar, the Croupier, the Coach, Lady Darjeeling, the Matchmaker.
  - The statue's five stages and the mini-game screens.
- **Hosting.** Its own path on lostcodebook.org (e.g. `/average`), linked from game one's sequel card.
- **Data first.** Generate the 240-student CSV from the table above before any room is built, and check that
  every number in this outline comes out of it (mean 6.2, median 8, slope 1.1, the CI, r, the (6.2, 61)
  point, exactly 3 students at 6 lectures).

## Still open

1. **The title.** *The Legend of the Average Student*, or *The Codebook II: The Revisions*?
2. **Language.** English only, or a German version as well?
