# The Secret of the Lost Codebook — Master Build Plan

*Written 2026-09-20. This is the document to work through to finish the game. It assumes no memory of previous sessions: everything needed to build a room to the standard of Act I and Act III is either here or precisely referenced.*

**The three documents, and what each is for:**

| File | Question it answers |
|---|---|
| `STORY.md` | *What happens, who these people are, and why.* The narrative bible. Read the act's section before writing a line of its dialogue. |
| `ROADMAP.md` (this file) | *What to build next, to what standard, and how to know it's done.* |
| `HANDOVER.md` | *How the code and the pipelines actually work.* Engine API, art loop, testing, publishing. |
| `CHANGELOG.md` | *Why things are the way they are.* The build log, including dead ends worth not repeating. |

---

## 0. How to work through this document

1. Work in **work-package order** (§6). Packages are numbered by phase and are mostly sequential; dependencies are stated where they are not.
2. Before starting a package, read its **Definition of Done** (§5) and the relevant `STORY.md` section.
3. Every package ends with a **local headless test** (§4.8) and a commit. Do not batch five packages into one commit.
4. **Publishing and pushing happen only when the user asks.** Build, test, commit locally, and say what is ready.
5. When a package is finished, tick it here and add a short entry to `CHANGELOG.md`.
6. If a package turns out to be wrong or the story has moved on, change this document rather than quietly deviating.

**Working rule established with the user:** they want long autonomous stretches ("auto-mode"). Ask only when a decision is genuinely theirs — a casting choice, an art direction fork, a story change. Do not ask about implementation detail.

---

## 1. Where the game stands today

- **Live artifact:** v51 at https://claude.ai/artifact/1VJHdVezyJFxnsZXS3kRi6 · **Repo:** https://github.com/thomas-u-grund/MethodsGame (`main`)
- **Everything is one file:** `web/the-secret-of-the-codebook.html` (~5,000 lines). No build step.
- **Built and playable:** Act I (4 rooms, painted, voiced, rigged, animated) and the data act (4 rooms, painted, voiced, sprites) — **the data act is still labelled "Act II" in code and must be renumbered to Act III** (WP-0.2).
- **Not built at all:** the new Act II (theory), the new Act IV third room, all of Act V, the outro.
- **Local asset state:** 285 files in `web/`, 51 MB. The publish limits are **255 files and 64 MB per version**, so the game currently *cannot be published as-is* without an explicit file list — see WP-0.1, which fixes this properly.

### Build status board

| Act | Rooms | Story | Art | Sprites | Voices | Rig/anim | SFX | Code |
|---|---|---|---|---|---|---|---|---|
| **I — The Question** | Office, Lecture Theatre, Corridor, Pond | ✅ | ✅ | ✅ | ✅ | ✅ | ⬜ | ✅ |
| **II — Theory** | Library, Hall of Founders, Workshop, Seminar Room | ✅ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **III — Data** | Survey Lab, Ethics, Mensa, Fieldwork | ✅ | ✅ | ✅ | ✅ | ✅ | ⬜ | ✅ (mislabelled Act II) |
| **IV — Evidence** | Basement, Delegation Engine, Bureau of Implications | ✅ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **V — Writing** | Gap Registry, Writing Room | ✅ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **Outro** | cutscene | ✅ | ⬜ | — | ⬜ | — | ⬜ | ⬜ |

Roughly: **nine new rooms, one cutscene, and a retrofit of the data act.**

---

## 2. House rules — what "consistent with Act I" actually means

These are not suggestions. Every new room follows them, and a deviation needs a reason written down.

### 2.1 Design rules

1. **Every room is open from the start of its act.** Progress is gated by what the player has done, never by a map lock. (Act I follows this; the data act does not — WP-0.4.)
2. **No room contains its own solution.** Every room hands the player a problem whose fix is in a different room, for an absurd institutional reason.
3. **Every wrong path is walkable to the end.** The game never blocks a bad choice; it lets it complete and pays the consequence **at least one act later**. Immediate punishment reads as a quiz marking you down.
4. **Only three durable flags cross act boundaries** — `theory_empty`, `analysis_p_hacked`, `claim_overstated` (WP-0.3). Everything else is local colour.
5. **One skeleton per room**, with a hand-lettered sign specific to that room's failure mode.
6. **The Research Folder is defaced in every room.** Stamped, stapled, annotated, or coffee-ringed.
7. **The department is ridiculous and it is also right.** If a room is only absurd it teaches cynicism; if it is only correct it is a textbook with jokes on it.
8. **One prop and one line per character backstory.** The table in `STORY.md` § Character backstories is the budget. Do not put the biographies on screen.
9. **Characters speak only their own words.** Narration and stage directions stay text-only and unvoiced — see the mixed-line lesson in `CHANGELOG.md` §01e.

### 2.2 Code conventions

Register every room the same way (`HANDOVER.md` §02):

```js
CODEBOOK_REGISTER({
  id: 'library', act: 'Act II', title: 'The Library',
  doneFlag: 'libraryDone', prereq: null, lockedHint: '',
  html: CODEBOOK_ADV_HTML({ bg:'…', hotspots:[…], sprites:[…] }),
  init: function(ctx){ var api = CODEBOOK_ADV_ROOM(ctx, {…}); }
});
```

- **New rooms use `CODEBOOK_ADV_HTML` / `CODEBOOK_ADV_ROOM`** (the Act III scaffolding), not the hand-rolled Act I pattern. `api` gives you `say, choice, clearChoices, give, take, sync, sprite, spriteSrc, setBg, el, fallback`.
- State only through `ctx`: `hasItem/addItem/removeItem`, `hasFlag/setFlag/clearFlag`, `complete()`, `goMap()`. Everything persists to `localStorage` key `codebook_save_v1`.
- Verb grid is **Look At / Talk To / Pick Up / Use**, inventory in the side panel via `CODEBOOK_RENDER_SIDE_INV`.
- Dialogue captions: `.scene-caption` overlaid on the art with a hand-picked anchor per room and a `tail-up`/`tail-down` class. **Narration uses no speech bubble** — `CODEBOOK_IS_NARRATION(speaker, html)` toggles `.narration`.
- Space skips the current line. Any timer that reveals something must key off *line end or skip*, never a fixed delay (this is the Doorman bug, WP-0.5).
- Add every new asset to `CODEBOOK_ACT_ASSETS.actN` or the loading bar will lie.

### 2.3 Art

Full loop in `HANDOVER.md` §04. The short version:

- Generated in the user's ChatGPT through Claude in Chrome. **Prompts must be one line** (a newline submits early). **Keep one chat per cast** so style holds.
- Always attach a style reference: `prof-lecturing.png` for characters, an existing room or trailer image for scenes.
- Download via in-page `fetch(img.src)` → blob → `<a download>`; check **all** near-duplicate files in `~/Downloads` before picking.
- Crop sprites to the **alpha > 40 % bounding box**, never plain `-trim`. Full-body **820 px** tall, chest-up **560 px** wide.
- Composite locally with ImageMagick before touching the page when placement is uncertain.
- Anything over ~400 KB ships as WebP: `cwebp -q 88 -alpha_q 95 -m 6`. Keep the PNG in `web-png-originals/` (git-ignored) and the source in `art/<room>/`.
- Every room gets an `art/<room>/ART_PROMPTS.md` with the prompts actually used.

### 2.4 Sprites, rigs and animation

- **Rig-first, always.** Generating walk frames directly does not work (the character drifts); this was established the hard way — `CHANGELOG.md`, 2026-09-19.
- Pipeline: ChatGPT "PAPER-DOLL CUT-OUT PARTS … strict SIDE VIEW facing right … REAL fully transparent background (no glow) … rounded extended joint ends" with the full sprite attached → `tools/rig/<name>/sheet.png` + `parts.json` → `python3 tools/rig/cut.py <name>` → parts + `rig-def.js`. Pose-check at `tools/rig/test2.html?n=<name>` (serve `tools/rig/` on 8935).
- Parts ship as `web/rig-<name>-*.webp`; sources in `art/characters/<name>/rig/`.
- Motion comes from `CodebookRig.build/walk/idle`, `CODEBOOK_RIG_WALK(spriteEl, def, route, done, {from, stay})`, `CODEBOOK_IDLE_PACE`. Route entries may be `{wait: ms}`.
- Talking: CSS classes `cb-breathe`, `cb-talk`, `cb-talk-grand`, `cb-talk-frantic`, `cb-talk-small`, `cb-snore`, plus one open-mouth frame per character (`tools/mouth.sh <name> <cx> <cy> <rx> <ry> <resize>`) swapped via `cb-mouth`/`cb-mouth-inv`.
- **Speeds are already tuned** — the user found the first pass "too hectic and fast" and everything was halved. Match the existing values; do not re-tune upward.
- Characters **walk out of frame, not through furniture** (the professor exits right: `walkRoute([640], leaveForOffice, {exit:true})`).

### 2.5 Voices

- **Local Chatterbox**, English model, Apple Silicon MPS: `.venv-tts/bin/python tools/tts/gen.py jobs.json`.
- References are 12-second LibriVox clips in `tools/tts/refs/lv-<reader>.wav`. **Never macOS `say` voices** — the user's specific complaint was that they sound unnatural.
- **Established casting — do not recast without asking:**

| Character | Reference | exag / cfg |
|---|---|---|
| Narrator (trailers, interludes, outro) | Mark F. Smith | 1.0 / 0.25 |
| The Professor | Martin Geeson | 0.55 / 0.45 |
| The Doorman | Bob Neufeld | 0.6 / 0.4 |
| The Skeptic | Elizabeth Klett | 0.8 / 0.3 |
| Survey Nurse | Ruth Golding | 0.85 / 0.3 |
| Chair of Consent | Mil Nicholson | 0.9 / 0.3 |
| Keeper of Data | Peter Yearsley | 0.8 / 0.3 |
| Representative | John Greenman | 0.75 / 0.35 |
| Sampling Officer | Andy Minter | 1.0 / 0.25 |
| Fieldwork Director | Sibella Denton | 1.0 / 0.25 |
| Mensa cook | *(silent by design)* | — |

- **Still to cast** (new characters): KIRA, Feldstrom, the Visiting Fellow, the Hall clerk, the Registry voice, the Implications Clerk, the Registrar of Gaps. Generate 3–5 takes per candidate and put them to the user as a numbered A/B — that is the pattern that has worked every time.
  - **KIRA needs a non-human treatment**, not just a reference voice: she is the only machine with a personality. Consider a light pitch/formant shift or a short convolution on top of a chosen reference. Put options to the user.
  - **Feldstrom** should be big, warm and Germanic-adjacent; he is the game's most-quoted character after the Professor.
- **Voice a character's own words only.** Before voicing a mixed narration+quote block, ask: *would reading the full text in this voice sound like the narrator is also this character?* If yes, split it.

### 2.6 Voice bundling (mandatory — this is a hard constraint, not an optimisation)

The artifact host allows **255 files per version**. Individual clips blow that instantly.

- Every act ships **one bundle**: `voices-act<N>.mp3`, built by concatenating clips with **0.45 s gaps** (ffmpeg, `loudnorm` + `silenceremove`).
- `CODEBOOK_VOICE_SPRITE` maps `"clip-name.mp3" → [bundle, startSeconds, durationSeconds]`. Call sites still name a single clip; `CODEBOOK_VOICE(src)` returns a `SegmentSound`.
- **The only playback approach that works** is: fetch the bundle once as a **blob**, `URL.createObjectURL`, then a normal `<audio>` with `currentTime = start`. Two other approaches were shipped and were silent:
  - an `<audio>` seeking inside the bundle needs HTTP range requests, which the dev server does not serve;
  - Web Audio `decodeAudioData` + `BufferSource` plays nothing while the AudioContext is suspended, which it is until a user gesture — and voices auto-play on room entry.
- **Rebuild the bundle and the manifest whenever any clip changes.** A stale offset table is silent audio, and muted headless tests cannot hear it (see §4.8).

### 2.7 Sound effects

- Sources must be **free and login-free** (user requirement). `tools/sfx/search.py` finds candidates, `picks.json` records choices, `tools/sfx/build.py` bundles.
- Same bundling discipline as voices: `web/sfx-act<N>.mp3` + an offset manifest. `sfx-act1.mp3` (19 clips, 0.9 MB) and `sfx-act2.mp3` (17 clips, 1.16 MB) **already exist and are not wired in** — WP-0.6.
- Two kinds: **ambience loops** (one per room, very low, started in `init()`) and **one-shots by trigger**.
- Ducking: SFX under voice, music under both. Trailer music sits at 0.2 / 0.16 under narration — the user explicitly asked for this.

### 2.8 Music

`CODEBOOK_PLAY_ROOM_MUSIC / STOP / VOLUME`. One theme per act minimum; reuse across rooms within an act is fine and cheaper than new tracks.

### 2.9 Preloading

`CODEBOOK_PRELOAD(list, onProgress, onDone)` + `CODEBOOK_ACT_ASSETS = {act1, act2, …}` + `CODEBOOK_LOADBAR_HTML/SET`. The game preloads the **next** act with a progress bar. Every new asset goes in the right list.

### 2.10 Interludes and title cards

`CODEBOOK_PLAY_INTERLUDE(panels, onDone, {preload, label})`, panels `{src, text, html, voice}`, on a fixed 16:9 letterboxed stage. Click/Space/Enter advance, Esc skips, narration auto-advances on clip end. Every act gets: a short trailer, a **"Starring" cast poster**, and a big **ACT N** title card. Preview with `?play=actN`.

---

## 3. Asset budget

| Limit | Value | Now |
|---|---|---|
| Files per published version | **255** | 285 in `web/` |
| Bytes per published version | **64 MB** | 51 MB |

Nine new rooms will add roughly: 9 backgrounds, ~12 sprites (plus rig parts, 6–10 files each), ~20 item icons, 3 act bundles of voices, 3 SFX bundles, 3 interludes × 5–6 panels. **That does not fit** without discipline.

**Rules:**
1. Loose per-clip audio never ships. Bundles only.
2. Rig parts are WebP and live only for characters that actually move.
3. Interlude panels are composited locally (ImageMagick) from existing art wherever possible — the Act III "Starring" poster and montage were both built this way.
4. Re-check `ls web/ | wc -l` and `du -sh web/` at the end of every phase.

---

## 4. Per-package standard steps

Every room build follows the same nine steps. Referenced below as "the standard nine".

1. **Read** the room's section in `STORY.md`. Write the dialogue tree as text first, in `art/<room>/SCRIPT.md`.
2. **Background art** — one-line ChatGPT prompt with a style reference, archived in `art/<room>/ART_PROMPTS.md`, cropped, WebP'd, installed.
3. **Sprites** — same chat as the rest of that act's cast. Alpha-crop, size, install.
4. **Room code** — `CODEBOOK_ADV_HTML` + `CODEBOOK_ADV_ROOM`, hotspots placed off a pixel grid, verbs wired, skeleton in place.
5. **Puzzle logic** — including the walkable wrong path and any durable flag it sets.
6. **Voices** — script → jobs.json → Chatterbox → trim → add to the act bundle → update `CODEBOOK_VOICE_SPRITE`.
7. **Animation** — rig if the character moves, mouth frame + `cb-talk-*` if it speaks.
8. **SFX** — ambience loop + one-shots into the act's SFX bundle.
9. **Test** — headless playthrough asserting zero JS errors and the room's completion flag; screenshot; then commit.

### 4.8 Testing protocol

```bash
cd web/ && python3 -m http.server 8934
# headless, ALWAYS muted:
#   chrome --headless=new --mute-audio --remote-debugging-port=9333
```

- Drive over CDP from Node. Keep the per-act playthrough scripts in `scratchpad/`.
- Seed state by writing `codebook_save_v1` before navigating; **always** `localStorage.removeItem('codebook_save_v1')` before publishing.
- Automated clicks can miss small hitboxes — `document.querySelector(...).click()` is the reliable fallback.
- **Audio has a permanent blind spot:** muted headless runs cannot hear silence, which is exactly how v51 shipped mute. After any audio change, assert programmatically that the bundle fetched, that `CODEBOOK_VOICE_SPRITE` has an entry for every clip name referenced in the HTML, and that `audio.currentTime` advances. Then ask the user to listen once.

---

## 5. Definition of Done — a room

- [ ] Plays start to finish from the campus map with **zero JS errors** in a headless run.
- [ ] Its `doneFlag` is set by the intended path and by no other path.
- [ ] The **wrong path is completable** and its consequence is deferred, not blocked.
- [ ] Painted background + verb grid + side inventory; no procedural SVG placeholder left.
- [ ] Every speaking character: sprite, mouth frame, `cb-talk-*`, voiced lines in the act bundle.
- [ ] Narration is unvoiced and has no speech bubble.
- [ ] One skeleton with a room-specific sign.
- [ ] The Research Folder is defaced in some way.
- [ ] Ambience loop + at least two one-shot SFX.
- [ ] Every asset is in `CODEBOOK_ACT_ASSETS`.
- [ ] Prompts archived in `art/<room>/ART_PROMPTS.md`; script in `SCRIPT.md`.
- [ ] `CHANGELOG.md` entry; committed.

---

## 6. Work packages

### Phase 0 — Foundations *(do all of these before any new room)*

**WP-0.1 · Asset budget cleanup.** All 115 loose `web/vo-*.mp3` are already inside `voices-act1/2.mp3` and present in `CODEBOOK_VOICE_SPRITE`; they exist only as a fallback path. Move them to `web-audio-originals/` (git-ignored), confirm every referenced clip name resolves through the sprite map, and re-test audio. **Takes `web/` from 285 files to 170** and buys the room needed for three acts. *Acceptance:* every voiced line still plays; `ls web/*.mp3 | wc -l` drops by 115.

**WP-0.2 · Renumber the data act II → III.** Room `act:` labels; `CODEBOOK_ACT2_INTERLUDE` → `ACT3`; `trailer2-*` art; `vo-narr-act2-*` (including the spoken title card, which says "Act Two. Apparently, we need data." and must be **re-rendered** to "Act Three"); `campus-map-act2.webp` (the map should now change at the *new* Act II); `CODEBOOK_ACT_ASSETS.act2` → `act3`; the `act2IntroSeen` flag (migrate existing saves or accept a reset); all doc references. *Decision to make and record:* rename the asset files or keep the names and relabel. Renaming is more churn but the names become actively misleading otherwise — **recommend renaming.**

**WP-0.3 · The three durable flags.** Implement `theory_empty`, `analysis_p_hacked`, `claim_overstated` as ordinary `ctx` flags, documented in one place in the source, with a comment pointing at `STORY.md` § "Three flags, not a story tree". Nothing sets them yet.

**WP-0.4 · Resolve the open/locked inconsistency** (`HANDOVER.md` §03). Act I rooms are `prereq: null`; the data act rooms still chain off each other's `doneFlag`. Apply the Act I rule everywhere and move real gating inside rooms. Record the decision in `HANDOVER.md`.

**WP-0.5 · The three logged bugs.**
- Pond: a millisecond of blue screen before the pond repaints after the swan is painted.
- Causality Corridor: the same flash on scene change.
- Doorman: skipping his dialogue leaves the gate apparently shut — the open timer must key off **line end or skip**, not a fixed delay.

**WP-0.6 · Wire the sound effects.** `web/sfx-act1.mp3` and `sfx-act2.mp3` are built and unused. Add an SFX channel alongside the voice channel (same blob-URL segment approach), wire ambience loops per room and the one-shot triggers listed in `CHANGELOG.md` § "Sound effects pass". **Explicitly requested:** applause when the player shouts BINGO; background snoring in the Lecture Theatre; the Ethics door bell.

**WP-0.7 · Backstory props into built rooms.** Cheap, high-value, needs no new act. Per the one-prop-one-line table: the Professor's hidden *Death of Community* in the Office, the Skeptic's *Things I Was Wrong About, Vol. XI* on the pond bench, the class photograph with the young Doorman, the Keeper's `BEVERAGE VESSEL 0047`, the Director's champagne photograph, the Officer's family portraits. `Look At` targets with one line each.

**WP-0.8 · Trailer fixes.** Regenerate panel 1 from the revised prompt (empty folder + circled deadline — the shipped art still shows the old rejected-letter concept) and swap in the new narration together. Generate panel 2b "The Spiral". Both prompts are in `art/trailer/ART_PROMPTS.md`.

**WP-0.9 · Seed "Reviewer 2".** One line per act, from characters who are otherwise rational, so the outro pays off. *"Reviewer 2 will ask." / "Who is Reviewer 2?" / "Nobody knows."*

### Phase 1 — Act II, "Apparently We Need a Theory" *(the largest package in the project)*

Read `STORY.md` § Act II in full first. It is the most detailed act in the bible and **it is over-specified on purpose — expect to trim during the build, not expand.** The user's own note: keep the loops, lose the errands.

**WP-1.0 · Act II scaffolding.** Four room registrations, map placement (Library Annex, a second door for the Hall, the workshop lean-to, a side door of the Department of Causality), `CODEBOOK_ACT_ASSETS.act2`, the act's music.

**WP-1.1 · The Prediction Slip.** A persistent four-box quest object, inspectable from the inventory, with the **brass coherence indicator** degrading `EXEMPLARY → ADEQUATE → CONCERNING → THEORETICALLY BUSY → EVERYTHING EXPLAINS EVERYTHING`. **New system — no existing room has an inventory object with visible internal state.** Build it first; all four rooms write to it.

**WP-1.2 · The Library** (standard nine). KIRA, the conveyor belt of THE LITERATURE, the six references and their three failure modes, the framed abstract, the catalogue, the enrolment register, the telephone.

**WP-1.3 · The Hall of Founders** (standard nine). Nodding portraits, the AUTHORITY METER, the Quotation Dispenser with its mode selector, the clerk, the ceremonial stepladder (one object, two Library uses), the newspaper clipping, writing behind Weber.

**WP-1.4 · Feldstrom's Workshop** (standard nine). The Hypotheses Accelerator Mk III with its two-directional `◄ SPECIFY / GENERALISE ►` panel, the masking tape reading DO NOT, the THINGS THIS FORBIDS gauge, the traffic-counting gate, and the derivation scene. **This is where the act's lesson lives** — budget the most time here.

**WP-1.5 · The Stockholm scam.** **New system:** a cross-room telephone with a dial-an-extension interface and a **timed absence** (Feldstrom out of the Workshop for N seconds). Three mandatory inputs only — extension 4173, KIRA's Nobel protocol printout, the Act I hourglass for the international delay. The Hall clipping and the Dispenser phrase are optional easings. Keep the failure branches and the flattery branch.

**WP-1.6 · The Seminar Room** (standard nine). **New system:** a card-assembly UI for the WHERE / FOR WHOM / DIRECTION grid, plus rival-explanation cards physically sliding under non-diagnostic predictions. The Visiting Fellow's raised finger is an animation, not a line.

**WP-1.7 · The Registry and the seal.** The PREREGISTRATION-ADJACENT DEVICE, the retracting button, the wax seal, H-27 dropping out. **The Registry accepts the empty theory** and stamps it `APPROVED`; that path sets `theory_empty` and is not blocked.

**WP-1.8 · Act II interlude, Starring poster and ACT II card.** Same pipeline as Act III's; composite from the new room art and sprites.

**WP-1.9 · Act II voices and SFX.** Cast KIRA, Feldstrom, the Visiting Fellow, the clerk and the Registry with the user first. Bundle as `voices-act2.mp3` (the name frees up after WP-0.2).

### Phase 2 — Act III retrofit

**WP-2.1 · Make the hypothesis drive the data.** `STORY.md` § Act III, "The chain that makes the middle of the game click". The player must be forced to obtain item-level exam performance, a classification of which exam items resemble the worked examples (from the Professor's Lecture Theatre sheets), and a survey item about alternative practice. **This is the highest-value single change in the whole plan** — it is what makes theory and evidence feel like one activity rather than two acts.

**WP-2.2 · Record linkage at the Ethics Tribunal.** The pseudonymous IDs gain their second and better purpose: linkage permission, and a consent form that has to say so in plain language.

**WP-2.3 · The enrolment register becomes the sampling frame.** Replace the "complete student list held by Ethics" with the Act II register, pseudonymised by Ethics. The 4,000-name newsletter list becomes the seductive wrong alternative, and the Sampling Officer gets the *"it has the right hundred and forty names"* exchange.

**WP-2.4 · The Office hand-off scene** ("Where did these numbers come from?") that was never built as an in-room scene.

### Phase 3 — Act IV, "Apparently Numbers Don't Speak for Themselves"

**WP-3.1 · The Statistics Basement** (standard nine). The casino, the twenty switches, and **the seal-breaking set-piece** with all three outcomes — including the tight-interval null and the `theory_empty` outcome. Use *"Twenty chances at five per cent is not five per cent."*

**WP-3.2 · The Delegation Engine** (standard nine). KIRA's descending AUTO-SUBMIT lever, the merge log, the spot-check, and her arc landing on *"Certainly. …What exactly do you mean?"*

**WP-3.3 · The Bureau of Implications** (standard nine). The three sizes, the SO WHAT? gauge, the wall of FURTHER RESEARCH IS NEEDED plaques, the limitations the player writes themselves. Buying LARGE sets `claim_overstated`.

**WP-3.4 · Act IV interlude, poster, card, voices, SFX.**

### Phase 4 — Act V, "Apparently Somebody Has to Write It"

**WP-4.1 · The Gap Registry** (standard nine). The drawers of pre-approved gaps, the registrar, KIRA's conveyor belt turning genuinely useful, Feldstrom's "that is a footnote" exchange.

**WP-4.2 · The Writing Room** (standard nine). KIRA's almost-perfect abstract with two or three words over the line; Feldstrom's title escalator and the IMPACT gauge; the car-warranty phone call; the refusal. **Prototype the word-finding interaction early** — this is the package most at risk of feeling like homework, and the user flagged it.

**WP-4.3 · The Office scene and the submission chute.** The Codebook reveal, *"It's accurate. Send it."*, and the folder going in. `STATUS: SUBMITTED`.

### Phase 5 — The outro

**WP-5.1 · The cutscene.** Built with the **trailer pipeline, not the room pipeline**. Order is fixed in `STORY.md` § The Outro: walk back → Doorman → `FOUR MONTHS LATER` → decision letter → back to the Office → R&R → skeleton flip → credits. Narrator VO, 5–7 panels.

**WP-5.2 · The three reviews.** Reviewer 1 (six warm comments), Reviewer 3 (never submitted), Reviewer 2 (eleven pages, forty-seven comments, contradictory, and **comment 17 is correct**). The letter branches on `claim_overstated`.

**WP-5.3 · Post-credits: the monkey.** Dark office, the submission system, the monkey, `asdfghjkl` resolving into *"The theoretical contribution remains insufficiently developed."* Never explained. The Feldstrom phone beat is optional — build it, look at it, cut it if the monkey lands better alone.

### Phase 6 — Ship

**WP-6.1 · Full five-act playthrough**, headless, zero errors, every folder stamp in order, all eight flag combinations reachable.
**WP-6.2 · Asset budget final check** (<255 files, <64 MB) and a real listen-through with the user.
**WP-6.3 · Publish and push** — only on the user's word.

---

## 7. Open decisions for the user

Ask these at the natural moment, not all at once:

1. **Voice casting** for KIRA, Feldstrom, the Visiting Fellow, the Registrar, the Implications Clerk (Phase 1 and 3). Always as numbered A/B takes.
2. **KIRA's robot treatment** — plain reference voice, or pitch/formant-shifted.
3. **WP-0.2 file renaming** — rename `trailer2-*` / `vo-narr-act2-*` / `campus-map-act2.webp`, or keep the names and relabel.
4. **Act II trimming** — the act is over-specified; once the four rooms are playable, which set-pieces survive is a taste call.
5. **The optional Feldstrom/monkey phone beat** at the very end.

---

## 8. Recommended order, in one line

`WP-0.1 → 0.2 → 0.3 → 0.4 → 0.5 → 0.6 → 0.7 → 0.8 → 0.9` (foundations, all cheap) → `Phase 2` (the Act III retrofit, because it is small and it defines what Act II's hypothesis has to produce) → `Phase 1` (Act II, the big one) → `Phase 3` → `Phase 4` → `Phase 5` → `Phase 6`.

**Note the deliberate inversion:** Phase 2 runs before Phase 1. The Act III retrofit is what tells us exactly which hypothesis Act II has to produce, and it is far cheaper to discover that in four already-built rooms than in four that do not exist yet.
