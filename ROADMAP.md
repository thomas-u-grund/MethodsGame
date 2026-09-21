
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
3. Every package ends with a **local headless test** (`tools/test/`, see its README) and a commit. Do not batch five packages into one commit.
4. **Publishing and pushing happen only when the user asks.** Build, test, commit locally, and say what is ready.
5. When a package is finished, tick it here and add a short entry to `CHANGELOG.md`.
6. If a package turns out to be wrong or the story has moved on, change this document rather than quietly deviating.

**Working rule established with the user:** they want long autonomous stretches ("auto-mode"). Ask only when a decision is genuinely theirs — a casting choice, an art direction fork, a story change. Do not ask about implementation detail.

---

## 1. Where the game stands today

*Board last verified against the file and the `web/` directory on 2026-09-21. Every ✅ below
was checked, not remembered.*

- **Live artifact:** v51 at https://claude.ai/artifact/1VJHdVezyJFxnsZXS3kRi6 — **stale**, and
  will stay stale until the user asks for a publish. **Repo:**
  https://github.com/thomas-u-grund/MethodsGame (`main`) — **61 commits unpushed.**
- **Everything is one file:** `web/the-secret-of-the-codebook.html` (**7,148 lines**). No build step.
- **All 17 rooms are built, painted and playable, end to end**, Act I through the outro. The
  data act was renumbered to Act III long ago (WP-0.2 is done).
- **The game is completable.** A player can go from the Office interview to the submission
  chute and the Reviewer 2 outro without touching a placeholder room.
- **The gap is audio and cutscene art, not rooms.** Acts II, IV and V have no recorded voices,
  and the interludes and outro still run on designed SVG cards.
- **Local asset state:** **195 files, 54 MB** in `web/`. Inside the artifact host's 255-file
  limit, but no longer comfortably — the margin is 60 files. Converting the 36 remaining icon
  PNGs to webp is the cheapest reclaim if it ever binds (§8d).
- **Tests:** 25 CDP tests, all green (`tools/test/run-all.sh`). Run them serially; two
  concurrent runs share one browser and overwrite each other's `localStorage`.

### Build status board

**Code / Story / Art** — what a player sees:

| Act | Rooms | Story | Room art | Sprites | Code | Puzzles |
|---|---|---|---|---|---|---|
| **I — The Question** | Office, Lecture Theatre, Corridor, Pond | ✅ | ✅ | ✅ | ✅ | ✅ |
| **II — Theory** | Library, Hall of Founders, Workshop, Seminar Room | ✅ | ✅ | ✅ | ✅ | ✅ |
| **III — Data** | Survey Lab, Ethics, Mensa, Fieldwork | ✅ | ✅ | ✅ | ✅ | ✅ |
| **IV — Evidence** | Stats Basement, Delegation Engine, Bureau of Implications | ✅ | ✅ | ✅ | ✅ | ✅ |
| **V — Writing** | Gap Registry, Writing Room | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Outro** | Reviewer 2 cutscene | ✅ | 🟡 1 of 6 | ✅ | ✅ | — |

**Audio / cutscene art** — what is actually outstanding:

| Act | Voices | SFX | Ambience | Interlude art | Notes |
|---|---|---|---|---|---|
| **I** | ✅ 38 clips | ✅ | ✅ | ✅ painted | complete |
| **II** | ⬜ none | ✅ | ✅ | ⬜ 3 SVG cards | §8g — Form P-1 panel |
| **III** | ✅ 107 clips | ✅ | ✅ | ✅ painted | complete |
| **IV** | ⬜ none | ✅ | ✅ | ⬜ 3 SVG cards | |
| **V** | ⬜ none | ✅ | ✅ | ⬜ 3 SVG cards | |
| **Outro** | ⬜ none | ✅ | — | 🟡 monkey painted, panels 1–5 SVG | |

SFX and ambience are ✅ everywhere because they are two shared bundles (`sfx-act1.mp3`,
`sfx-act3.mp3`) covering 36 named cues, and the later acts draw from the same library rather
than needing their own. Voices are the opposite: 145 clips exist, all of them Act I or Act III,
and the later acts cannot be recorded until the user makes the casting decisions in §7.

**So, in one line:** the game is built and finishable; what is left is **voices for three acts,
twelve interlude panels, five outro panels**, and the polish items in §8.

---

## 2. House rules — what "consistent with Act I" actually means

These are not suggestions. Every new room follows them, and a deviation needs a reason written down.

### 2.1 Design rules

1. **Every room is open from the start of its act.** Progress is gated by what the player has done, never by a map lock. Implemented as `CODEBOOK_ACT_GATE(n)`; see `HANDOVER.md` §03.
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
- Backgrounds ship as WebP at `cwebp -q 92 -alpha_q 95 -m 6` (raised from q88 once GitHub Pages removed the size ceiling — §3). Keep PNG where WebP hurts: line art with hard edges, and anything with crisp lettering. Keep the PNG original in `web-png-originals/` (git-ignored) and the source in `art/<room>/`.
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

## 3. Asset budget and hosting

**The limits that shaped this plan are the Claude artifact host's, not GitHub's.** GitHub is only where the source lives; it has never constrained the game. The artifact host allows **255 files and 64 MB per published version**, and that single constraint is why voices are bundled, why images are WebP'd at q88, and why `web/` had to be pruned.

The user raised on 2026-09-20 that we do not have to publish that way. **We don't**, and it removes the ceiling almost entirely:

| Option | File/size limits | Cost | Notes |
|---|---|---|---|
| **GitHub Pages** *(recommended)* | ~1 GB repo, 100 MB per file, no file count | free | The repo already exists; publishing is a push. Custom domain possible. |
| Cloudflare Pages / Netlify | 20–25 MB per file, thousands of files | free tier | Slightly better CDN, one more account. |
| itch.io | 1 GB per upload | free | Natural home for a game, gives it a store page, but uploads are zips. |
| Claude artifact *(today)* | **255 files, 64 MB** | free | Best for quick previews and sharing a link mid-build. |

**DECIDED 2026-09-20 (user): GitHub Pages is the real home; the Claude artifact stays as the preview channel.** They are not exclusive — the artifact is genuinely useful for "look at this now" during a session, and Pages carries the full-fat build.

**Prepared, not yet live** (needs a push, which is user-gated): a root `index.html` that redirects to `web/the-secret-of-the-codebook.html`, and `.nojekyll` so Pages serves the asset folders untouched. To switch it on, once pushed: repo **Settings → Pages → Source: deploy from branch `main`, folder `/ (root)`**, or `gh api -X POST repos/thomas-u-grund/MethodsGame/pages -f source[branch]=main -f source[path]=/`. The URL will be `https://thomas-u-grund.github.io/MethodsGame/`.

**What this means for every package from Phase 1 on:** stop rationing. Backgrounds can be generated and kept at full quality, each act can have its own music, voices can go above `-q:a 3`, and a room ships as many sprites and rig parts as it needs. The artifact preview may occasionally need a reduced file list; that is a publishing detail, not a design constraint.

### What stays, and what relaxes, if we move

**Stays, because it is good engineering rather than a workaround:**
- **Voice and SFX bundling.** One request per act instead of 145 beats 145 requests on any host, and the blob-URL segment player already works. Keep `tools/tts/bundle.py`.
- **Preloading with progress bars.** Unchanged.
- **WebP for photographic backgrounds.** Still smaller for the same quality.

**Relaxes:**
- **No file-count anxiety.** New rooms can ship as many sprites, rig parts and icons as they actually need.
- **Art quality is no longer rationed.** Backgrounds can go to a higher quality setting, and PNG can be kept where WebP hurts (line art with hard edges, anything with crisp lettering).
- **Audio can breathe.** Per-act music instead of reusing one theme, longer ambience loops, and voices at a higher bitrate than `-q:a 3`.
- **The single-file constraint becomes a choice, not a requirement.** The game is ~5,000 lines in one HTML file. On a normal static host it could be split into modules. **Recommend not doing this yet** — the single file has been genuinely convenient and splitting it is a large, risky refactor with no player-visible benefit. Revisit only if the file becomes hard to work in.

**Until the move actually happens, keep publishing to the artifact**, which means the 255/64 limits still bind the *published* build. Current state after WP-0.1: **140 files, 44 MB**. That is enough headroom for Act II; it would not have been enough for Acts II, IV and V together, so the hosting decision wants making before Phase 3.

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

**WP-0.1 ✅ DONE · Asset budget cleanup.** All 115 loose `web/vo-*.mp3` are already inside `voices-act1/2.mp3` and present in `CODEBOOK_VOICE_SPRITE`; they exist only as a fallback path. Move them to `web-audio-originals/` (git-ignored), confirm every referenced clip name resolves through the sprite map, and re-test audio. **Takes `web/` from 285 files to 170** and buys the room needed for three acts. *Acceptance:* every voiced line still plays; `ls web/*.mp3 | wc -l` drops by 115.

**WP-0.2 ✅ DONE · Renumber the data act II → III.** Room `act:` labels; `CODEBOOK_ACT2_INTERLUDE` → `ACT3`; `trailer2-*` art; `vo-narr-act2-*` (including the spoken title card, which says "Act Two. Apparently, we need data." and must be **re-rendered** to "Act Three"); `campus-map-act2.webp` (the map should now change at the *new* Act II); `CODEBOOK_ACT_ASSETS.act2` → `act3`; the `act2IntroSeen` flag (migrate existing saves or accept a reset); all doc references. *Decision to make and record:* rename the asset files or keep the names and relabel. Renaming is more churn but the names become actively misleading otherwise — **recommend renaming.**

**WP-0.3 ✅ DONE · The three durable flags.** Implement `theory_empty`, `analysis_p_hacked`, `claim_overstated` as ordinary `ctx` flags, documented in one place in the source, with a comment pointing at `STORY.md` § "Three flags, not a story tree". Nothing sets them yet.

**WP-0.4 ✅ DONE · Resolve the open/locked inconsistency** (`HANDOVER.md` §03). Act I rooms are `prereq: null`; the data act rooms still chain off each other's `doneFlag`. Apply the Act I rule everywhere and move real gating inside rooms. Record the decision in `HANDOVER.md`.

**WP-0.5 ✅ DONE · The three logged bugs.**
- Pond: a millisecond of blue screen before the pond repaints after the swan is painted.
- Causality Corridor: the same flash on scene change.
- Doorman: skipping his dialogue leaves the gate apparently shut — the open timer must key off **line end or skip**, not a fixed delay.

**WP-0.6 ✅ DONE · Wire the sound effects.** `web/sfx-act1.mp3` and `sfx-act2.mp3` are built and unused. Add an SFX channel alongside the voice channel (same blob-URL segment approach), wire ambience loops per room and the one-shot triggers listed in `CHANGELOG.md` § "Sound effects pass". **Explicitly requested:** applause when the player shouts BINGO; background snoring in the Lecture Theatre; the Ethics door bell.

**WP-0.7 ✅ DONE · Backstory props into built rooms.** Cheap, high-value, needs no new act. Per the one-prop-one-line table: the Professor's hidden *Death of Community* in the Office, the Skeptic's *Things I Was Wrong About, Vol. XI* on the pond bench, the class photograph with the young Doorman, the Keeper's `BEVERAGE VESSEL 0047`, the Director's champagne photograph, the Officer's family portraits. `Look At` targets with one line each.

**WP-0.8 · Trailer fixes.** *(BLOCKED: needs the user's ChatGPT via Claude in Chrome — the only art step in Phase 0.)* Regenerate panel 1 from the revised prompt (empty folder + circled deadline — the shipped art still shows the old rejected-letter concept) and swap in the new narration together. Generate panel 2b "The Spiral". Both prompts are in `art/trailer/ART_PROMPTS.md`.

**WP-0.9 ✅ DONE · Seed "Reviewer 2".** One line per act, from characters who are otherwise rational, so the outro pays off. *"Reviewer 2 will ask." / "Who is Reviewer 2?" / "Nobody knows."*

### Phase 1 — Act II ✅ COMPLETE (code; art and voices outstanding)

Read `STORY.md` § Act II in full first. It is the most detailed act in the bible and **it is over-specified on purpose — expect to trim during the build, not expand.** The user's own note: keep the loops, lose the errands.

**WP-1.0 ✅ DONE · Act II scaffolding.** Four room registrations, map placement (Library Annex, a second door for the Hall, the workshop lean-to, a side door of the Department of Causality), `CODEBOOK_ACT_ASSETS.act2`, the act's music.

**WP-1.1 ✅ DONE · The Prediction Slip.** A persistent four-box quest object, inspectable from the inventory, with the **brass coherence indicator** degrading `EXEMPLARY → ADEQUATE → CONCERNING → THEORETICALLY BUSY → EVERYTHING EXPLAINS EVERYTHING`. **New system — no existing room has an inventory object with visible internal state.** Build it first; all four rooms write to it.

**WP-1.2 ✅ DONE · The Library** (standard nine). KIRA, the conveyor belt of THE LITERATURE, the six references and their three failure modes, the framed abstract, the catalogue, the enrolment register, the telephone.

**WP-1.3 ✅ DONE · The Hall of Founders** (standard nine). Nodding portraits, the AUTHORITY METER, the Quotation Dispenser with its mode selector, the clerk, the ceremonial stepladder (one object, two Library uses), the newspaper clipping, writing behind Weber.

**WP-1.4 · Feldstrom's Workshop** (standard nine). The Hypotheses Accelerator Mk III with its two-directional `◄ SPECIFY / GENERALISE ►` panel, the masking tape reading DO NOT, the THINGS THIS FORBIDS gauge, the traffic-counting gate, and the derivation scene. **This is where the act's lesson lives** — budget the most time here.

**WP-1.5 ✅ DONE · The Stockholm scam.** **New system:** a cross-room telephone with a dial-an-extension interface and a **timed absence** (Feldstrom out of the Workshop for N seconds). Three mandatory inputs only — extension 4173, KIRA's Nobel protocol printout, the Act I hourglass for the international delay. The Hall clipping and the Dispenser phrase are optional easings. Keep the failure branches and the flattery branch.

**WP-1.6 ✅ DONE · The Seminar Room** (standard nine). **New system:** a card-assembly UI for the WHERE / FOR WHOM / DIRECTION grid, plus rival-explanation cards physically sliding under non-diagnostic predictions. The Visiting Fellow's raised finger is an animation, not a line.

**WP-1.7 ✅ DONE · The Registry and the seal.** The PREREGISTRATION-ADJACENT DEVICE, the retracting button, the wax seal, H-27 dropping out. **The Registry accepts the empty theory** and stamps it `APPROVED`; that path sets `theory_empty` and is not blocked.

**WP-1.8 · Act II interlude, Starring poster and ACT II card.** Same pipeline as Act III's; composite from the new room art and sprites.

**WP-1.9 · Act II voices and SFX.** Cast KIRA, Feldstrom, the Visiting Fellow, the clerk and the Registry with the user first. Bundle as `voices-act2.mp3` (the name frees up after WP-0.2).

### Phase 2 — Act III retrofit ✅ COMPLETE

**WP-2.1 ✅ DONE · Make the hypothesis drive the data.** `STORY.md` § Act III, "The chain that makes the middle of the game click". The player must be forced to obtain item-level exam performance, a classification of which exam items resemble the worked examples (from the Professor's Lecture Theatre sheets), and a survey item about alternative practice. **This is the highest-value single change in the whole plan** — it is what makes theory and evidence feel like one activity rather than two acts.

**WP-2.2 ✅ DONE · Record linkage at the Ethics Tribunal.** The pseudonymous IDs gain their second and better purpose: linkage permission, and a consent form that has to say so in plain language.

**WP-2.3 ✅ DONE · The enrolment register becomes the sampling frame.** Replace the "complete student list held by Ethics" with the Act II register, pseudonymised by Ethics. The 4,000-name newsletter list becomes the seductive wrong alternative, and the Sampling Officer gets the *"it has the right hundred and forty names"* exchange.

**WP-2.4 ✅ DONE · The Office hand-off scene** ("Where did these numbers come from?") that was never built as an in-room scene.

### Phase 3 — Act IV ✅ COMPLETE (code; art and voices outstanding)

**WP-3.1 ✅ DONE · The Statistics Basement** (standard nine). The casino, the twenty switches, and **the seal-breaking set-piece** with all three outcomes — including the tight-interval null and the `theory_empty` outcome. Use *"Twenty chances at five per cent is not five per cent."*

**WP-3.2 ✅ DONE · The Delegation Engine** (standard nine). KIRA's descending AUTO-SUBMIT lever, the merge log, the spot-check, and her arc landing on *"Certainly. …What exactly do you mean?"*

**WP-3.3 ✅ DONE · The Bureau of Implications** (standard nine). The three sizes, the SO WHAT? gauge, the wall of FURTHER RESEARCH IS NEEDED plaques, the limitations the player writes themselves. Buying LARGE sets `claim_overstated`.

**WP-3.4 · Act IV interlude, poster, card, voices, SFX.**

### Phase 4 — Act V ✅ COMPLETE (code; art and voices outstanding)

**WP-4.1 ✅ DONE · The Gap Registry** (standard nine). The drawers of pre-approved gaps, the registrar, KIRA's conveyor belt turning genuinely useful, Feldstrom's "that is a footnote" exchange.

**WP-4.2 ✅ DONE · The Writing Room** (standard nine). KIRA's almost-perfect abstract with two or three words over the line; Feldstrom's title escalator and the IMPACT gauge; the car-warranty phone call; the refusal. **Prototype the word-finding interaction early** — this is the package most at risk of feeling like homework, and the user flagged it.

**WP-4.3 ✅ DONE · The Office scene and the submission chute.** The Codebook reveal, *"It's accurate. Send it."*, and the folder going in. `STATUS: SUBMITTED`.

### Phase 5 — The outro ✅ COMPLETE (code; art and narration outstanding)

**WP-5.1 ✅ DONE · The cutscene.** Built with the **trailer pipeline, not the room pipeline**. Order is fixed in `STORY.md` § The Outro: walk back → Doorman → `FOUR MONTHS LATER` → decision letter → back to the Office → R&R → skeleton flip → credits. Narrator VO, 5–7 panels.

**WP-5.2 ✅ DONE · The three reviews.** Reviewer 1 (six warm comments), Reviewer 3 (never submitted), Reviewer 2 (eleven pages, forty-seven comments, contradictory, and **comment 17 is correct**). The letter branches on `claim_overstated`.

**WP-5.3 ✅ DONE · Post-credits: the monkey.** Dark office, the submission system, the monkey, `asdfghjkl` resolving into *"The theoretical contribution remains insufficiently developed."* Never explained. The Feldstrom phone beat is optional — build it, look at it, cut it if the monkey lands better alone.

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

---

## 8e. Image generation: what silently fails — logged 2026-09-21

Adding to the ChatGPT driving notes in §9, because this cost three failed attempts and looked
like a rate limit when it was not:

**Asking it to redraw an attached character — "draw the SAME man again, same face" — returns
nothing at all.** No image, no text, no error; the prompt just sits there answered by
silence. It is almost certainly a likeness guardrail on redrawing a depicted person.

**The workaround is to describe the character fully from scratch every time**, as if new,
and let the attached sprites carry the style rather than the identity. Tobi's second pose
came back first try once the prompt stopped referring to him as the same person and simply
re-described him — same haircut, same navy jacket, same globe tote, same lanyard, listed out.

Keep a written description per character for exactly this reason; it is now the only reliable
way to get a second pose.

**The real cause of most "silent" failures: the image service errors out.** Asking the model
to "generate that now" after a silent non-response eventually surfaced the actual message:

> Something went wrong while generating your image. Sorry about that.

It does not always print that on the first attempt — the request can simply end with no
image and no text — but nudging it once usually makes the error visible. So a silent
non-response is most often a server-side failure, not a guardrail and not a quota. Retry
once; if it errors twice in a row the service is degraded and there is nothing to be gained
by continuing.

**And generation is also sometimes just slow.**
Later in a session a request can take three or four minutes, during which the page looks
completely idle — `stop-button` is present but nothing is on screen and no text has streamed.
An earlier note here claimed a daily ceiling of about fifteen images; **that was wrong**, and
it cost an abandoned batch. The images arrived later. Treat "slow" and "errored" as separate
things and use the nudge to tell them apart.

How to tell the two apart properly:

- `!document.querySelector('button[data-testid="stop-button"]')` is **false** → still working,
  however long it has been. Wait.
- It is **true** and no new image has appeared → that request is genuinely dead. If it was a
  redraw ("the same man"), re-describe from scratch. If it was already from scratch, retry
  once in a fresh chat before concluding anything.

Budget three to four minutes per generation late in a session and do not give up on a
request while the stop button is still there.

---

## 8d. Inventory icons — DONE

Every key in `ITEM_LABELS` now has an entry in `ITEM_ICONS`, and `test-assets.js` asserts
that, so an item added later cannot quietly ship as a two-letter text tile.

One thing to watch when adding more: two icons in the same visual family read as the same
thing at panel size. The first `contribution` icon was a brass plate holding a cream card,
which was indistinguishable from `drawerlabel` in the side panel; it was redrawn as a brass
luggage tag on a chain, and the Registrar's hand-over line was rewritten to match the object
("Attached to something" — he holds up the chain). Different silhouette, not just different
lettering.

Batch six per sheet in a 3x2 grid and slice with `tools/art/icons.sh` — one prompt for six
icons, and the slicer handles the alpha-crop and sizing.

Two notes from sheet 3 (2026-09-21): the generator does not respect the 3x2 grid exactly, so
a wide object can bleed across a cell boundary and the rigid slicer then cuts it in half or
drags a neighbour's stray pixels into a cell's alpha bbox. Check the montage after slicing;
when a cell is wrong, run `-connected-components` on the alpha channel of a generous crop of
the *full sheet* to get the object's true bounding box and re-crop from those coordinates.
Sheet-3 icons are stored as `.webp` (`cwebp -q 92 -alpha_q 95 -m 6`) — a quarter the size of
the PNGs from sheets 1 and 2, which are worth converting at some point.

### Original note



Visible in any screenshot of the new acts: the side panel falls back to two-letter text tiles
(`EX`, `TH`, `RE`…) because `ITEM_ICONS` has no entry for the items added for Acts II, IV
and V. Roughly nineteen: `stepladder, blankcard, nobelproc, grandphrase, altpaper, chalk,
worksheets, examrecords, enrolreg, slip, readinglist, altcard, rateprint, cleandata,
resultprint, interpretation, contribution, ticket, drawerlabel`.

They are small square props, so they generate fast and in batches of four or five per prompt.
Follow the existing icons' look (`icon-pen.png`, `icon-folder.png`) — object centred on a
pale card, no background scene. Purely cosmetic, but it is the most visible unfinished thing
in the game right now.

---

## 8-PRIORITY. Characters are not standing in the rooms properly — logged 2026-09-21 (user)

**The defect.** Characters are placed by a raw CSS box (`l/t/w/h` as percentages of the
scene) chosen by eye. Nothing in the game knows where a room's *floor* is, how big a person
is *at that depth*, or what is in front of them. So: Tobi stands on a stack of books,
Feldstrom's foot is on a chair, and scale drifts from room to room. Every sprite in the game
is currently positioned this way — see the eight `src:'sprite-…'` entries in the room
registrations.

**The user's instinct is right; the implementation should not be literal 3D.** A painted 2D
adventure game does not need a 3D scene graph. What it needs is the thing LucasArts used,
which gives the same result for a fraction of the work: **a floor plane with a depth ramp,
and feet as the anchor.**

### The fix, in four parts

**1. Anchor characters by their feet, not by a box.** Today a sprite is a rectangle and the
soles land wherever the rectangle's bottom happens to be. Replace the placement API with a
floor point:

```js
{ id:'feldstrom', src:'sprite-feldstrom.png', foot:[74, 88] }   // x%, y% of the scene
```

The engine then draws the sprite with its soles on that point and its height taken from the
depth ramp. `CODEBOOK_RIG_WALK` already computes a `footY` this way for walking, so the
concept is in the codebase — it just is not used for standing placement.

**2. A depth ramp per room.** Two numbers: the height a person should be when standing at the
back of the room, and at the front.

```js
depth: { backY: 62, backH: 34, frontY: 96, frontH: 64 }   // y% -> character height %
```

Character height is then interpolated from the foot's y. This is what makes scale consistent
between rooms and correct within a room, and it is why a character who walks forward should
get bigger — which the rig walk currently does not do either.

**3. A floor polygon (walkbox) per room.** A short list of points describing where feet may
be. Placement snaps into it; walk routes clamp to it. This is what stops anyone standing on
a bookcase. For most of these rooms it is a trapezoid and takes two minutes to author off
the same decile grid already used for hotspots.

**4. Foreground occlusion where it matters.** A character standing behind the Bureau counter
or the Mensa servery should be *behind* it. One optional `-fg.webp` per room — a cut-out of
the things that are in front, painted over the sprite layer. Only a few rooms need one; the
rest can be handled by choosing a foot position that avoids the problem.

### Status (2026-09-21)

**Parts 1 and 2 are done.** Sprites are placed by `foot:[x%, y%]` and sized from a per-room
`depth` ramp, with a per-character `scale` on top (KIRA is 0.62 because she is a waist-high
robot; Feldstrom is 1.12 because he is not). All thirteen placements are converted, Tobi
included. The sprite test was rewritten to assert soles-on-the-floor and height-on-the-ramp
instead of the old "inside the scene somewhere" check that let this through.

**Parts 3 and 4 remain**: the floor polygon (needed once anyone walks in these rooms) and
foreground cut-outs for the few rooms where a character should stand behind something — the
Bureau counter is the clearest case, and the Clerk is currently parked to the right of it to
avoid the problem rather than solve it.

### Why this order

Parts 1 and 2 fix most of what the user is seeing and are cheap — they are an engine change
plus one `depth` block and one `foot` pair per room. Part 3 matters as soon as anyone walks.
Part 4 is per-room art and should be done last, only for the rooms that actually need it.

### Scope

Thirteen adventure rooms plus the four Act I rooms. Every existing sprite placement is
rewritten, which also means **the sprite geometry test has to change**: it currently asserts
only that a sprite is inside its scene at a plausible height, which is exactly the weak check
that let this through. It should assert that **the soles sit inside the room's floor
polygon** and that **height matches the depth ramp within a tolerance** — a test that would
have failed on Tobi standing on the books.

---

## 8a. Running jokes to work in — logged 2026-09-21 (user)

**1. Students who have not done the reading.** Make this a recurring presence rather than a
one-off. They should turn up across the whole game, always confident, never having read it:

- The Lecture Theatre already has the sleeping/phone students — one of them should be
  audibly confident about a text he has not opened.
- The Library: someone at a reading desk with an unopened book and a very long summary
  already written. KIRA should approve of their output.
- The Seminar Room: a chair that is always empty, with a name card on it.
- The Mensa queue: overheard, "I skimmed it, which is basically reading it."
- The Writing Room: the co-author who has not read the paper they are on.
- **Payoff:** in the outro, Reviewer 2's comment 1 is *"The literature review omits a
  substantial body of work"* with no further detail — the ultimate not-having-read-it.

**2. Dead old men with beards, mocked properly in the theory act.** The Hall of Founders
already nods at everything; push it further. The portraits should be visibly interchangeable
— same beard, same expression, different brass nameplate. Ideas worth building:

- One extra painted portrait that is obviously the *same man* as the one beside it, with a
  different name and dates. Nobody remarks on it.
- A nameplate that has been unscrewed and re-screwed several times, the old holes visible.
- `Look At` a portrait: "One of the founders of the discipline. Bearded. Dead. Certain."
- One founder whose dates make him fourteen years old at the time of his major work.
- A small brass sign by the door: **NO LIVING THEORISTS BEYOND THIS POINT.**
- **One funny extra picture** (user's ask): a group portrait, eleven identical bearded men,
  captioned "THE FOUNDERS — a complete record of who was allowed to speak."

Both are cheap: mostly `Look At` text plus one or two generated images.

---

## 8c. Stockholm call needs a Swedish accent — BUILT 2026-09-21

Built as specified below, with one deviation: the Quotation Dispenser phrase did not need
demoting, because it was never required by the call in the first place — it is given out and
never checked. So the accent is simply a third requirement alongside the procedure and the
hourglass, and the mandatory count goes from two to three.

The chain is Library phone → refused for the delivery ("You are from Dortmund.") → find Tobi,
wherever he is that run → laminated card → Library phone. The Tobi option only appears once
the phone has set `wsAccentNeeded`, so the card is never a solution looking for a problem.
The garnish beat (IKEA / lagom / fika) sits between the category answer and the Committee
lines and cannot fail, which is the rule the spec asks for. Covered by `test-accent.js`.

**Original spec below.**



Feldstrom should not believe the call unless the voice is right. Add a fourth requirement to
the Stockholm scam: **the accent**. He has been waiting for this call for seventeen years and
he has rehearsed it; a flat delivery gives it away instantly.

> **PLAYER:** "This is Stockholm."
> **FELDSTROM:** *(a pause)* "You are from Dortmund."
> *Click.*

**Where the accent comes from — the obvious and best answer is Tobi.** He is the
International Office. He has a phrasebook, he has "done a lot of work in the Nordics", and he
is desperate to be useful:

> **TOBI:** "Swedish? Yeah, no, massive. I did a whole recruitment push. Hold on."
> *(he hands over a laminated card of phonetic phrases, none of which are Swedish)*
> **TOBI:** "It's mostly vibes. Lean into the vowels."

This is good because it makes Tobi load-bearing rather than decorative, and because the card
being *wrong* and working anyway is the joke: Feldstrom has never met anyone from Stockholm
either. The Hall of Founders clipping already supplies the correct prize name; the accent
card supplies the delivery.

**And the accent is mostly just Swedish nouns.** The player does not speak Swedish, so the
performance is a handful of words dropped in at random, with total confidence, in the gaps
where meaning should be. Feldstrom is entirely convinced. Build the call so the player picks
the garnish and it always works:

> **PLAYER:** "Hej. This is Stockholm."
> **FELDSTROM:** *(a chair goes over)* "Yes."
> **PLAYER:** "We are calling about the &mdash; *ja* &mdash; the prize. The committee. **Lagom.**"
> **FELDSTROM:** "Of course."
> **PLAYER:** "There is a matter of &mdash; how you say &mdash; **IKEA.**"
> **FELDSTROM:** *(without a flicker)* "Naturally."

Word bank to draw the options from, all deployed as though they are procedural terms:
**hej · hej då · ja · lagom · fika · IKEA · Volvo · smörgåsbord · tack så mycket · Öresund ·
allemansrätten.** The funniest beat is him treating one of them as a technical stage of the
process &mdash; *"Ah. The fika stage."* &mdash; and the player having no idea whether that is
real.

Keep one rule: **it never fails for being wrong**, only for being flat. The joke is that he
wants it so badly he will accept furniture retailers as evidence.

**Implementation:** a fourth check in the Stockholm dialogue alongside extension 4173, KIRA's
Nobel protocol and the Act I hourglass. Keep to three *mandatory* inputs by demoting one of
the existing easings — the Quotation Dispenser phrase becomes optional, the accent card
becomes required. Failure line as above, and it should be its own distinct rejection, not a
repeat of "you are not calling internationally".

---

## 8h-PRIORITY. Rooms are missing the cast the dialogue says is in them — logged 2026-09-21 (user)

**Progress, 2026-09-21.** Done: the Mensa entirely (lunch queue with the matching tote bags,
the Cook, the QUALITATIVE PEOPLE, the *n* = 1 and the skeleton listening to him); the twelve
Fieldwork respondents, wired to the response rate so the stage empties and fills with the
board (`test-seats.js`); and the Skeptic, who now walks down the basement stairs instead of
speaking from nowhere. Remaining: the Fieldwork audience, the Sampling Officer's cameo, the
Hall clerk and the library student — all P1/P2, and the last three are reuses of sprites
that already exist.

> "I think sometimes we require people in the room (e.g. mensa), but they are not there. we
> need to make sure we have all the cast (even if it is just background cast) that we need
> for a scene"

Audited all 17 rooms against their `sprites:` arrays and their painted backgrounds. The user
picked the worst example first. Every finding below was checked against the actual `.webp`,
not inferred.

### P0 — a named character speaks or transacts on screen with no body

| Who | Room | What they do |
|---|---|---|
| **The Skeptic** | `statsbasement` | `api.say('The Skeptic', …)`. She comes down the basement stairs with Volume XI, opens it, writes, and delivers the null-result payoff — *"You have removed an explanation from circulation."* The room has **no `sprites:` key at all.** |
| **The Cook** | `mensa` | `api.say('Cook', …)` ×3. He is a **trade partner**: takes the tote-bag sample, pins it above the till, hands over the voucher. |
| **The twelve respondents** | `fieldwork` | The entire mechanic. They take podiums, answer into microphones, flee through doors, come back for reminders and paper and a free lunch. The board counts them. The stage never changes. |

### P1 — a crowd the writing insists on, and the background does not show

- **The Mensa lunch queue.** The joke *is* that everyone in it carries the same tote bag and
  that a queue is not a population — *"This queue is basically the university."* You swing the
  sampling frame round to face it and draw twelve people out of it. `mensa-bg.webp` has empty
  counters and not one human in the entire hall.
- **The Mensa diners** — the QUALITATIVE PEOPLE at the long tables "writing long notes about
  each other", and the **n = 1** at the table for one who tells you at great length that their
  experience generalises to everybody. All benches empty.
- **The Fieldwork audience.** "In front of an audience", with `sfx-applause-big` playing over
  empty red seats.

### P2 — brief actors, cheap, mostly reuse

- **The Hall clerk** — "emerges from a door that was not there a moment ago and stamps the
  card." Happens twice. `sprite-clerk.png` already exists and could be flashed in.
- **The Sampling Officer's cameo in Fieldwork** — he bursts through the TOO BUSY door in full
  ceremonial sash: **"THOSE PEOPLE WERE NOT DRAWN!"** `sprite-officer.webp` already exists.
- **The library student** at the reading desk — *"Yeah, no, I skimmed it."* This is also where
  the students-who-did-not-do-the-reading running joke (§8a) should live.
- **Skeletons**: the Library, Hall, Seminar and Gap Registry each have a bespoke
  `sprite-skeleton-*.png`. The Mensa's "ALSO VERY LONELY" skeleton and the Ethics back-pew
  skeleton are written but not drawn.

### Correctly absent — do not "fix" these

Tobi (injected by the scaffolding); Feldstrom during the Stockholm call (he is on the
telephone, and that is the whole gag); the Library's librarian (explicitly away at a workshop
on information literacy); the Fieldwork "host" (a podium — the Director hosts); the Gap
Registry's doorway voice; the Seminar's absent man whose name card is on a chair; the Survey
Lab's "patients", which are questions and are drawn as chart overlays; and every Act I
character, all of whom are painted into their backgrounds — including the pond philosopher,
who is on the bench with her copy of *The Black Swan*.

### How to fix it

Two mechanisms, and the choice per case is whether the character ever needs to change:

1. **Painted into the background** for static crowds — the queue, the diners, the audience.
   This is how Act I does every one of its characters and it costs one regenerated `-bg.webp`
   per room, with hotspot coordinates unaffected.
2. **A sprite in the `sprites:` array** for anyone who is spoken to, who moves, or who has to
   appear and disappear — the Skeptic, the Cook, the Officer's cameo, the Hall clerk. Use
   `api.sprite(id, show)` for the timed entrances.

**Decided 2026-09-21: crowds go in as sprites too, not repainted backgrounds.** Regenerating
a room background cannot preserve the furniture it is generated around, and every hotspot in
these rooms is measured against that furniture — the Mensa's gilded frame, drum and pedestal
are all at fixed percentages. A repaint that moved the counters by three per cent would
silently break the room. Transparent cut-out crowd sprites, foot-anchored at the hotspot
they belong to, leave the painting untouched and cost nothing but a `sprites:` entry.

Placement is measured off the existing background rather than guessed: crop the hotspot's
pixel region out of the `-bg.webp` first and look at it, then size the sprite to the
furniture in that crop. The Mensa's counters sit at x 1412–1672, y 410–550 of 1672x941, so
the queue in front of them is roughly a fifth of the frame tall; the left benches run much
closer to camera and take figures nearly twice that size.

The respondents are the interesting case: three or four generic podium-occupant sprites
toggled by `api.sprite()` as the rate climbs would make the response-rate mechanic *visible*,
which is currently something the player only reads on a board.

**Done when:** no room contains a speaking or acting character with no visual presence, and
no line of dialogue describes a crowd that the background does not show.

---

## 8g. Artwork for the Form P-1 trailer — logged 2026-09-21 (user)

The Act II interlude (`CODEBOOK_ACT2_INTERLUDE`, in the ACT INTERLUDES script block) runs
four panels and three of them are designed SVG cards: `il2-slip.svg` used **twice**, then
`il2-rooms.svg`, then the `il2-title.svg` ACT II card. It is the one interlude that carries
the quest object, and the quest object is currently a vector rectangle.

**Panel 1 and 2 — the slip itself.** Both narrated beats point at Form P-1, so paint it
properly and reuse it for both, the way the outro reuses panels: a single sheet of
municipal-looking paper on a desk, **FORM P-1 · APPLICATION FOR PERMISSION TO HAVE AN
EXPECTATION** across the head, four ruled boxes down the page — WHAT IS KNOWN, MECHANISM,
SCOPE, HYPOTHESIS AND FALSIFIER — all four empty, and along the bottom edge the brass
coherence needle sitting at EXEMPLARY because nothing has been written yet. The joke is in
the fine print: *An expectation does not constitute optimism.* Match the in-game slip (the
`CODEBOOK_SLIP.html` markup is the reference) so the object the player is handed in the
Office is recognisably the object from the trailer.

Panel 2's narration is the "what would count as surprising?" exchange and ends with
machinery waking up below, so if a second frame is worth painting rather than reusing the
first, it is the same slip lit from a different angle with the Accelerator's glow on it.

**Panel 3** is the three-room montage (Library / Hall / Workshop) and can be composited from
the painted room backgrounds that now exist, the way Act III's was. **Panel 4** is the ACT II
title card and follows the existing card design.

Same pipeline as every other panel: one-line prompt, alpha-crop, `cwebp -q 92`. Update the
`src` entries and the `CODEBOOK_ACT_ASSETS.act2` preload list, which currently names the
three SVGs.

---

## 8f. "Look at" an inventory item should say something — BUILT 2026-09-21

All forty-seven written and wired, in both kinds of room, answering in the room's own
dialogue box. `folder` and `slip` are functions of `GAME` rather than strings; the folder
lists its actual contents, which makes examining it the game's progress summary.
`test-itemlook.js` covers it and enforces both writing rules mechanically (no description
may name a room or tell you which verb to use).

One behaviour change fell out of it, and is worth knowing about: clicking an inventory item
used to force the verb to `use` no matter what was selected. Under **look at** it no longer
does. Three tests were relying on that shortcut and now arm the verb first.

**Original spec below.**



> "when one does 'look at' on items in inventory... there should be a little description
> (sometimes with a hint, but not too obvious) popping up"

Right now the side panel is a picture and a name. Clicking an item only arms it for `use`.
Every genuine point-and-click gives you a line of description when you examine what you are
carrying, and it is one of the main places the writing lives — it is also where a stuck
player looks first, so it is the cheapest hint channel in the game.

**Behaviour.** With the verb set to **look at**, clicking an inventory item says a line in
the room's own dialogue box (`api.say('You', …)`), exactly like examining a hotspot, rather
than opening any new kind of window. That keeps it inside the machinery that already exists:
the line area, the typing animation, the voice hook. With any other verb, clicking an item
keeps its current behaviour — arming it for `use`. The side panel already knows which verb
is active, so this is a branch in the click handler passed to `CODEBOOK_RENDER_SIDE_INV`,
not a new UI.

**Content.** One line per item, in the voice of the player character, same register as the
room descriptions. Two rules for the hint half:

- **The hint is about the object, not the puzzle.** "Seven seconds, and it has been
  measuring the wrong thing all morning" is a hint. "Use this on the telephone" is a
  walkthrough. Say what the object *is for* in the world, and let the player find where.
- **Only items that are currently load-bearing get a hint at all.** A line an item carries
  for the whole game cannot say "you will need this in the Hall of Founders" — the player
  may already have used it. Where an item's description needs to change after it has done
  its job, key the second line off the flag that its puzzle sets, the way the room
  descriptions already do.

**Scope.** Nineteen items. The four Act I items (`question`, `folder`, `pen`, `hourglass`)
carry across the whole game and are the most-examined, so write those first and most
carefully. `folder` is a special case: it is the quest object, its label already changes per
act (`ITEM_LABELS.folder` is rewritten when `actIIIDone` is set), and its description should
say what is in it so far — that makes it the game's progress summary, which is worth more
than any hint.

**Done when:** every item answers **look at** with its own line; no line names a room or a
verb; the four Act I items read well in Act V as well as Act I; and a test asserts that
`ITEM_LABELS` and the description table have the same keys, the way `test-assets.js` now
does for icons.

---

## 8b. Cross-room puzzle density — audited 2026-09-21

The user asked whether there are enough cross-room puzzles. Measured by counting, per act,
the inventory items a room *requires* (`item === 'x'` / `hasItem('x')`) and *produces*
(`api.give` / `addItem`):

| Act | Rooms | Items required | Items produced |
|---|---|---|---|
| I | 4 | 2 | 5 |
| II | 4 | 13 | 6 |
| III | 4 | 21 | 12 |
| **IV** | 3 | **0 → 2** | **0** |
| **V** | 2 | **0** | **0** |

**Acts II and III are densely interlocked and need nothing.** Acts IV and V had *no*
inventory puzzles whatsoever — they gated purely on in-room flags (read the log, then check
a record, then you may speak), which is a dialogue tree with prerequisites, not an adventure
game, and it breaks the house rule that no room contains its own solution.

**Fixed so far:** the worked-example sheets chain that `STORY.md` § Act III already
promised and the code never built. The Act IV seal cannot be broken without **the exam
records** (Ethics, Act III) *and* **the Professor's worked-example handouts** (the Lecture
Theatre, Act I) — because the prediction is about particular questions, and nothing in the
exam envelope says which questions resemble the worked examples. Three acts, one chain.

**Still to add, in priority order:**

1. **Bureau of Implications** should require the fieldwork response rate and the sampling
   frame to write its three limitations — the player currently asserts them from nothing.
2. **Gap Registry** should require the Act II reading list as an object. The contribution is
   defined *against* the literature, so the literature should be in your hands.
3. **Writing Room** should require the chewed pen to make the three word corrections, and
   the sealed slip to check the claim against what was promised.
4. **Act III → IV** has only the new exam-records link. One more would help: the Fieldwork
   Arena's response-rate printout as a carried object.

---

## 9. Art status (updated 2026-09-21)

**Every room in the game is painted.** No room ships a placeholder background any more.
Nine new backgrounds were generated through the Claude-in-Chrome pipeline and installed,
along with the post-credits monkey.

**Hotspots are re-read off the painting, never inherited from the placeholder.** For each
room: grid the PNG into deciles (`magick ... -draw line` — the helper is two dozen lines,
see the commit history), read the prop positions off it, and rewrite that room's `HOTSPOTS`
table. This mattered every single time — Weber turned out to be the fourth and largest
portrait, the Bureau's counter had to stop short of the stool so it would not swallow the
clerk's hotspot, the Library's EVIDENCE frame sat further right than planned.

### Driving ChatGPT: what actually works

Learned the hard way; follow these or you will lose twenty minutes each time.

1. **Never type while a generation is in flight.** The composer silently keeps your text and
   Return does nothing. Poll `!document.querySelector('button[data-testid="stop-button"]')`
   and only type when it is true.
2. **A "Add to Project" suggestion popup can swallow clicks on the send button.** If a send
   click does nothing, look for `button[aria-label="Dismiss project suggestion"]`, click it,
   then click send. This cost two failed attempts before it was spotted.
3. **Click send via the DOM**, not by coordinate: `button[data-testid="send-button"]`. The
   `find` tool has identified the "High" model selector as the send button more than once.
4. **A chat stalls after roughly four generated images.** Start a fresh one and re-attach
   references — style continuity is actually *better* when the anchors are the rooms you
   just painted.
5. **Download in-page**, never via the editor: `fetch(img.src)` → blob → `<a download>`.
   The image src is not readable from outside the page.
6. **Match generated images by `alt`**, which is `"Generated image: <title>"`. Each image
   appears in the DOM three times; take the last.

### Still outstanding

- **Six character sprites** — KIRA, Feldstrom, the Visiting Fellow, the Registrar of Gaps,
  the Implications Clerk, and Act II's skeletons. Attempted 2026-09-21: the prompt posts but
  no image comes back and no error is shown, which looks like an image-generation rate limit
  after ten images in a session. Retry on a fresh day/session. The cast chat should attach
  `sprite-nurse.png`, `sprite-doorman.png` and `sprite-director.png` as style anchors.
- **Outro panels 1–5** are still designed SVG cards (the monkey is painted). A painted
  decision-letter panel was prompted and did not return, same symptom.
- **WP-0.8**: trailer panel 1 regeneration and panel 2b.
- **Voices** for Acts II, IV and V — still blocked on casting decisions from the user.

---

## 10. What auto-mode built, and what it could not

*Added 2026-09-20 after running Phases 0–5 autonomously. **Superseded in part on 2026-09-21:**
point 1 below is now done — every room is painted, every character sprite exists, and the
only SVG art left is twelve interlude panels and five outro panels. Point 2 stands: voices
for Acts II, IV and V are still blocked on the casting decisions in §7.*

**Every act is now playable end to end, in code.** Seventeen rooms, the Prediction Slip, the
three durable flags, the act gates, the seal-breaking, the submission and the outro all work
and are covered by headless tests. A player can start at the trailer and reach the monkey.

**Two things were deliberately not attempted without the user, and they are the whole
remaining job:**

1. **Painted art.** Nine rooms and six outro panels ship as *designed SVG placeholders*
   (`tools/art/placeholders.py`) — correct palette, correct composition, every prop blocked in
   where the painting will go, so **hotspot coordinates are already final** and swapping in a
   painting is a one-line `bg:` change per room. The pipeline needs the user's ChatGPT via
   Claude in Chrome, which is interactive by nature. The same applies to WP-0.8's trailer
   panels and to every new character sprite (KIRA, Feldstrom, the Visiting Fellow, the
   Registrar, the Implications Clerk, the monkey).
2. **Voices.** Casting is a taste decision the user has made every time so far, as numbered
   A/B takes. Nothing is cast for the new characters, so Acts II, IV and V are silent. The
   lines are written and sit in the code ready to be voiced; `tools/tts/bundle.py` will
   rebuild the bundles once clips exist.

**Also outstanding, and cheap once the above is unblocked:** act interludes and Starring
posters for II, IV and V (Act III's are the model), rig-and-mouth animation for the new
sprites, and SFX one-shots in the new rooms beyond the ones already wired.

**One judgement call worth flagging:** the new rooms use the placeholder backgrounds rather
than waiting, because the alternative was to stop after Phase 0. The rooms are structurally
finished and visually provisional, which is the right way round — art can be swapped in
without touching logic, whereas logic written against art that does not exist yet cannot.
