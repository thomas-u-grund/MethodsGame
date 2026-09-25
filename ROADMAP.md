
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
  https://github.com/thomas-u-grund/MethodsGame (`main`) — **79 commits unpushed.**
- **Everything is one file:** `web/the-secret-of-the-codebook.html` (**7,148 lines**). No build step.
- **All 17 rooms are built, painted and playable, end to end**, Act I through the outro. The
  data act was renumbered to Act III long ago (WP-0.2 is done).
- **The game is completable.** A player can go from the Office interview to the submission
  chute and the Reviewer 2 outro without touching a placeholder room.
- **The gap is audio and cutscene art, not rooms.** Acts II, IV and V have no recorded voices,
  and the interludes and outro still run on designed SVG cards.
- **Local asset state:** **204 files, 57 MB** in `web/`. Inside the artifact host's 255-file
  limit, with about 50 files of margin; converting the remaining icon PNGs to webp is the
  cheapest reclaim if it ever binds (§8d).
- **No placeholder art remains.** Every background, sprite, icon, interlude panel and outro
  panel is painted; `web/` contains no `.svg` at all.
- **Tests:** 26 CDP tests, all green (`tools/test/run-all.sh`). Run them **alone** — every
  test shares one headless page, so anything else driving that tab produces phantom failures
  (a lost `localStorage` save, or an audio test whose clip was killed mid-play). Both were
  mistaken for regressions today and neither was one.

### Build status board

**Code / Story / Art** — what a player sees:

| Act | Rooms | Story | Room art | Sprites | Code | Puzzles |
|---|---|---|---|---|---|---|
| **I — The Question** | Office, Lecture Theatre, Corridor, Pond | ✅ | ✅ | ✅ | ✅ | ✅ |
| **II — Theory** | Library, Hall of Founders, Workshop, Seminar Room | ✅ | ✅ | ✅ | ✅ | ✅ |
| **III — Data** | Survey Lab, Ethics, Mensa, Fieldwork | ✅ | ✅ | ✅ | ✅ | ✅ |
| **IV — Evidence** | Stats Basement, Delegation Engine, Bureau of Implications | ✅ | ✅ | ✅ | ✅ | ✅ |
| **V — Writing** | Gap Registry, Writing Room | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Outro** | Reviewer 2 cutscene | ✅ | ✅ | ✅ | ✅ | — |

**Audio / cutscene art** — what is actually outstanding:

| Act | Voices | SFX | Ambience | Interlude art | Notes |
|---|---|---|---|---|---|
| **I** | ✅ 38 clips | ✅ | ✅ | ✅ painted | complete |
| **II** | ⬜ none | ✅ | ✅ | ✅ painted | |
| **III** | ✅ 107 clips | ✅ | ✅ | ✅ painted | complete |
| **IV** | ⬜ none | ✅ | ✅ | ✅ painted | |
| **V** | ⬜ none | ✅ | ✅ | ✅ painted | |
| **Outro** | ⬜ none | ✅ | — | ✅ painted | |

SFX and ambience are ✅ everywhere because they are two shared bundles (`sfx-act1.mp3`,
`sfx-act3.mp3`) covering 36 named cues, and the later acts draw from the same library rather
than needing their own. Voices are the opposite: 145 clips exist, all of them Act I or Act III,
and the later acts cannot be recorded until the user makes the casting decisions in §7.

**So, in one line:** the game is built, finishable and fully painted; what is left is
**voices for three acts** (blocked on casting, §7) and the §8 items — of which the live ones
are **8k** the Accelerator mini-game and the last two cast reuses.

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
- **24 references on file now** (was 15). `/tmp/getref.sh`-style recipe, documented in
  HANDOVER: archive.org advancedsearch for `collection:librivoxaudio AND description:"<reader>"`,
  take the second `_64kb.mp3` from the item's metadata, **`curl -sL` with a range request**
  (without `-L` you get an empty file — archive.org redirects to a node server), then
  `ffmpeg -ss 75 -t 12 -ar 24000 -ac 1 -af loudnorm`. New: rolander (Swedish), bernd,
  karlsson, gesine, availle (Germanic), hurlock, merrill, kilmer, lange, stinson,
  eastman, lauravictoria, burgoyne.
- **Established casting — do not recast without asking:**

| Character | Reference | exag / cfg |
|---|---|---|
| Narrator (trailers, interludes, outro) | Mark F. Smith | 1.0 / 0.25 |
| The Professor (her, Office) | **Laura Victoria** (recast 2026-09-23; Claude's pick, user delegated) | 0.55 / 0.45 |
| Dr. Vossberg (lecturer) | Martin Geeson | 0.55 / 0.45 |
| The Doorman | Bob Neufeld | 0.6 / 0.4 |
| The Skeptic | Elizabeth Klett | 0.8 / 0.3 |
| Survey Nurse | Ruth Golding | 0.85 / 0.3 |
| Chair of Consent | Mil Nicholson | 0.9 / 0.3 |
| Keeper of Data | Peter Yearsley | 0.8 / 0.3 |
| Representative | John Greenman | 0.75 / 0.35 |
| Sampling Officer | Andy Minter | 1.0 / 0.25 |
| Fieldwork Director | Sibella Denton | 1.0 / 0.25 |
| Mensa cook | *(silent by design)* | — |
| **Feldstrom** | **Bernd** (German, from a LibriVox *Tausend und eine Nacht*) | **0.95 / 0.28** |
| The protagonist (the student) | **Eastman** (since 2026-09-24; was Rob Fogarty, one word only) | 0.6 / 0.4 (BINGO! 1.0 / 0.25) |
| **Professor G** (spoken lines; his rap is the author's own recording) | **Karlsson** (Germanic LibriVox reader, ~120 Hz; recast from Availle, who is a female reader — user: "professor g needs to have a male voice") | 0.7 / 0.35 |

**Feldstrom's casting, for the record.** The user pointed at a real professor's voice on
YouTube (Dirk Helbing, ETH Zurich — the traffic-flow modeller turned sociologist Feldstrom
is affectionately modelled on) and later supplied a trimmed copy of that recording. Cloning
a named living academic's voice was declined: it would be recognisable, and Feldstrom is a
parody of exactly that research tradition, which makes it the user's reputational problem
rather than an abstract one. What was done instead was to *measure* the delivery and match
its characteristics — median F0 **133 Hz**, a very wide **23-semitone** pitch range, and
**92% voiced** (he barely pauses; two pauses over 0.35s in 71 seconds). That profile says
low, continuously running and highly expressive, which is why the exaggeration is high.
Bernd measured 141 Hz, the closest German-language reader to the target, and the user chose
him from six candidates.

**Superseded 2026-09-24 (8v): the student now speaks.** The user reversed the call below
("I think we should also give the main character (student) a voice"), including the choices
you click. Kept for the record:

**The protagonist is voiced exactly once**, shouting "BINGO!" in the lecture theatre.
Everything else attributed to "You" is their own inner voice, and voicing it would collapse
the blank the player inhabits. One spoken word in a silent protagonist is the joke.

**Voicing a character whose lines are written as exchanges:** Feldstrom's blocks contain 78
quoted lines and roughly a third are the *player's* half of the conversation ("They're
students, not cars", "This isn't a motorway"). They were attributed by hand and dropped.
Never feed a whole `feld(...)` string to the renderer.

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
- [ ] ~~One skeleton with a room-specific sign.~~ **Dropped 2026-09-23 (user: "fewer skeletons in general").**
      Seven rooms had one; it had stopped being a running joke and become wallpaper. Four
      remain, and each earns its place: the **Office** (SUBMITTED 2016 · STILL WAITING --
      the original, and the outro calls back to it by name), the **Causality Corridor**
      (one per door, so only ever one on screen), the **Act IV** one clutching a lit bulb
      and `p = .049. I KNEW I WAS RIGHT.`, and the **Gap Registry** (the Act V bookend,
      and the one named on the cast poster). The Library, Hall of Founders and Seminar Room
      ones were decoration with no hotspot and no line, and are in `_attic/cut-sprites/`.
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

**WP-0.8 ✅ DONE · Trailer fixes.** Panel 1 regenerated from the revised prompt (`trailer-panel1-deadline.webp`) and panel 2b built (`trailer-panel2b-spiral.webp`); both are in the opening trailer. *(Marked done 2026-09-22 — the work had shipped, the package was never ticked.)* Regenerate panel 1 from the revised prompt (empty folder + circled deadline — the shipped art still shows the old rejected-letter concept) and swap in the new narration together. Generate panel 2b "The Spiral". Both prompts are in `art/trailer/ART_PROMPTS.md`.

**WP-0.9 ✅ DONE · Seed "Reviewer 2".** One line per act, from characters who are otherwise rational, so the outro pays off. *"Reviewer 2 will ask." / "Who is Reviewer 2?" / "Nobody knows."*

### Phase 1 — Act II ✅ COMPLETE (code; art and voices outstanding)

Read `STORY.md` § Act II in full first. It is the most detailed act in the bible and **it is over-specified on purpose — expect to trim during the build, not expand.** The user's own note: keep the loops, lose the errands.

**WP-1.0 ✅ DONE · Act II scaffolding.** Four room registrations, map placement (Library Annex, a second door for the Hall, the workshop lean-to, a side door of the Department of Causality), `CODEBOOK_ACT_ASSETS.act2`, the act's music.

**WP-1.1 ✅ DONE · The Prediction Slip.** A persistent four-box quest object, inspectable from the inventory, with the **brass coherence indicator** degrading `EXEMPLARY → ADEQUATE → CONCERNING → THEORETICALLY BUSY → EVERYTHING EXPLAINS EVERYTHING`. **New system — no existing room has an inventory object with visible internal state.** Build it first; all four rooms write to it.

**WP-1.2 ✅ DONE · The Library** (standard nine). KIRA, the conveyor belt of THE LITERATURE, the six references and their three failure modes, the framed abstract, the catalogue, the enrolment register, the telephone.

**WP-1.3 ✅ DONE · The Hall of Founders** (standard nine). Nodding portraits, the AUTHORITY METER, the Quotation Dispenser with its mode selector, the clerk, the ceremonial stepladder (one object, two Library uses), the newspaper clipping, writing behind Weber.

**WP-1.4 ✅ DONE · Feldstrom's Workshop** (standard nine). The Hypotheses Accelerator Mk III with its two-directional `◄ SPECIFY / GENERALISE ►` panel, the masking tape reading DO NOT, the THINGS THIS FORBIDS gauge, the traffic-counting gate, and the derivation scene. **This is where the act's lesson lives** — budget the most time here.

**WP-1.5 ✅ DONE · The Stockholm scam.** **New system:** a cross-room telephone with a dial-an-extension interface and a **timed absence** (Feldstrom out of the Workshop for N seconds). Three mandatory inputs only — extension 4173, KIRA's Nobel protocol printout, the Act I hourglass for the international delay. The Hall clipping and the Dispenser phrase are optional easings. Keep the failure branches and the flattery branch.

**WP-1.6 ✅ DONE · The Seminar Room** (standard nine). **New system:** a card-assembly UI for the WHERE / FOR WHOM / DIRECTION grid, plus rival-explanation cards physically sliding under non-diagnostic predictions. The Visiting Fellow's raised finger is an animation, not a line.

**WP-1.7 ✅ DONE · The Registry and the seal.** The PREREGISTRATION-ADJACENT DEVICE, the retracting button, the wax seal, H-27 dropping out. **The Registry accepts the empty theory** and stamps it `APPROVED`; that path sets `theory_empty` and is not blocked.

**WP-1.8 ✅ DONE · Act II interlude, Starring poster and ACT II card.** The interlude and title card already shipped; the Starring poster (`il2-cast.webp`) landed 2026-09-22, composited from the room sprites rather than painted, so the people on the poster are exactly the people you meet. Original note: Same pipeline as Act III's; composite from the new room art and sprites.

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

**WP-3.4 · Act IV interlude, poster, card, voices, SFX.** Poster done 2026-09-22 (`il4-cast.webp`), and Act V's with it (`il5-cast.webp`) — both composited from the room sprites by `tools/art/castposter.py`, so the people on the poster are exactly the people you meet. Voices and SFX remain, blocked on casting.

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
**WP-6.2 · Asset budget final check** — **artifact preview only**. §3 already decided (2026-09-20) that GitHub Pages is the real home and the 255-file / 64 MB ceiling is the Claude artifact's, not the game's; the user reconfirmed 2026-09-22. So this package is "does the preview build still fit", not "does the game fit". Plus a real listen-through with the user.
**WP-6.3 · Publish and push** — only on the user's word.

---

## 8t. The Starring posters still have one professor in them — logged 2026-09-23 (user) — DONE 2026-09-23 in 8u

ROADMAP 8o split the Professor and the lecturer into two people **in the rooms**. The Act I
interlude never got the same treatment, and it cannot be fixed by editing text, because all
three offending lines are voiced and Act I's 38 clips are recorded. Changing the captions
alone would make the narration contradict what is on screen.

### What is actually wrong

**Two** of the five Starring posters carry the pre-split male professor, not one. Both use the
same likeness — grey hair, glasses, tweed, right index finger raised — which is
`vossberg-pointing.webp`, i.e. Dr. Vossberg.

| Asset | Problem |
| --- | --- |
| `trailer-cast-act1.webp` | The tweed figure pointing upwards is **Dr. Vossberg**. The caption calls him "a professor with seven seconds of patience", which is **her**. She is not on her own cast poster at all, in the act she is the centre of. |
| `vo-narr-opening-07.mp3` | The caption above. Re-record once the poster is right. |
| `vo-narr-opening-05.mp3` | "They say **he** keeps a Codebook." The line before it establishes the Professor as *her*, so the pronoun points at a woman. |
| `vo-narr-opening-04.mp3` | Says "**his** patience" where the caption reads "her". Already logged; same re-record session. |
| `trailer3-e-cast.webp` | **The same figure again, on the right.** Worse than Act I's: Dr. Vossberg does not appear anywhere in Act III, so the poster stars somebody who is not in the act. The person the caption means — "a professor, already preparing his next objection" — is **her**, and she is the one you hand the act back to. |
| `vo-narr-act3-05.mp3` | The caption above, including the "his". |

Act III's interlude is otherwise **correct about her**: `trailer3-b-prof.webp`, three panels
earlier, is the Professor at her own desk with the WORLD'S OKAYEST SAMPLE SIZE mug, and reads
"says the Professor". So within one trailer, panel *b* has her right and panel *e* has a man
who is not in the act. That crossed pair is the clearest statement of the bug.

Acts II, IV and V are clear: none of their posters has a professor on it, and Act II's was
rebuilt on 2026-09-23 when the library student was cut.

### Why there is no cheap fix

Compositing her into the existing poster was tried and rejected. The only painted art of her
is `trailer3-b-prof.webp` (Act III's interlude, and it is *correct* — she is at her desk with
the WORLD'S OKAYEST SAMPLE SIZE mug) and `prof-office.webp` at 333×311. Both are **seated
busts behind a desk**: dropped into a lineup of standing figures at 65% of the frame height
she comes out at about 21%, reading as a miniature, and cutting her out of the Act III panel
means matting her off a corkboard covered in sticky notes. The Act I poster is the best
painted asset in the game and is not worth degrading for this.

### The job

1. **Regenerate `trailer-cast-act1.webp`** with five figures, not four: the skeleton
   (SUBMITTED 2016 · STILL WAITING), the skeptic, **the Professor** — grey bun, glasses,
   tweed, the expression from `trailer3-b-prof.webp`, standing — **Dr. Vossberg** (the
   existing tweed figure, mid-point, unchanged), and the doorman. Empty plaque in the middle
   for the STARRING caption, same stage and vignette as now.
2. **Regenerate `trailer3-e-cast.webp`** with the rightmost figure replaced by **the
   Professor**, same design as above. Everyone else on it — nurse, herald, the three judges,
   the Fieldwork Director — is correct and should not move. Dr. Vossberg comes off it
   entirely; he is not in Act III.
3. **Re-record `vo-narr-opening-04/05/07` and `vo-narr-act3-05`** in the same session as the
   outstanding Act II, IV and V voices (§7.1), to captions that name both people and get her
   pronouns right.

Blocked on the same casting decision as everything else in §7.

---

## 7. Open decisions for the user

Ask these at the natural moment, not all at once:

1. **Voice casting** for KIRA, Feldstrom, the Visiting Fellow, the Registrar, the Implications Clerk (Phase 1 and 3). Always as numbered A/B takes.
2. **KIRA's robot treatment** — plain reference voice, or pitch/formant-shifted.
3. **WP-0.2 file renaming** — rename `trailer2-*` / `vo-narr-act2-*` / `campus-map-act2.webp`, or keep the names and relabel.
4. **Act II trimming** — the act is over-specified; once the four rooms are playable, which set-pieces survive is a taste call.
5. **The optional Feldstrom/monkey phone beat** at the very end.

---

## 8-INDEX. What is live and what is finished

§8 has grown by accretion and its sections are not in order. This is the index; work from
it, not from the headings below.

**Live — worth doing next, in this order:**

| § | What | Size |
|---|---|---|
| ~~8o~~ | ~~The Professor is two different people in Act I~~ | **DONE 2026-09-22** (Option C, revised reveal) |
| ~~8p~~ | ~~Character movement is mechanical~~ | **DONE 2026-09-22** |
| ~~8q~~ | ~~The two professors: she is a woman, he is Dr. Vossberg~~ | **DONE 2026-09-22**; voice, name and look done in 8u |
| ~~8r~~ | ~~Silhouette staging removed; Vossberg is the old professor art~~ | **DONE 2026-09-22** |
| ~~8i~~ | ~~The campus map has run out of campus~~ | **DONE 2026-09-22** |
| ~~8a~~ | ~~Running jokes: the not-having-read-it thread, the founders~~ | **DONE 2026-09-22** |
| ~~8h~~ | ~~The library student who skimmed it~~ | **DONE 2026-09-22** |
| ~~8s~~ | ~~KIRA stands still in all four of her rooms~~ | **DONE 2026-09-22** |

**Blocked on the user:** voices for KIRA, the Visiting Fellow, the Registrar, the
Implications Clerk and Tobi (§7 casting).

**Done:** 8-PRIORITY spatial (all four parts) · 8b cross-room density (audit) ·
8c Swedish accent · 8d inventory icons · 8e image-generation failure modes (reference) ·
8f inventory descriptions · 8g Form P-1 trailer art · 8h Mensa, Fieldwork, the Skeptic,
the Hall clerk · 8j the pinned extension · 8k the Accelerator mini-game ·
8l dialogue discoverability · 8m corridor shuffle and brass plaques ·
8n outro camera moves · Feldstrom voiced · BINGO voiced.

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

**Parts 3 and 4 are done too (2026-09-21).**

*Part 4, foreground occlusion.* `CODEBOOK_ADV_HTML` takes an optional `fg:` — a cut-out of
whatever is in front of the characters, drawn over the sprite layer and pointer-transparent
so the hotspots underneath still work. The Bureau was the case that mattered: its Clerk had
been parked to the *right* of his own counter because there was no way to draw anything in
front of a sprite. `bureau-fg.webp` is the counter lifted out of the painting and laid back
over him, and he now stands behind it and serves from it. Other rooms are handled by
placement (the Mensa's Cook is cut at the waist by his own sprite, the Fieldwork respondents
tuck behind the podium line) and need no cut-out.

*Part 3, the walkbox.* `walk:[[xMin,xMax] at the back, [xMin,xMax] at the front]` alongside
the existing `floor:[backY,frontY]`, interpolated with depth by `CODEBOOK_WALK_X`. Authored
for all nine sprite rooms by reading the painted floor off each background rather than
guessing. `test-sprites.js` now asserts every sprite's foot point is **inside** its room's
walkbox, in x as well as y — a character could previously sit at a perfectly legal height
and still be standing on a bookcase, which is the bug this whole section started from. All
thirteen placements pass, which validates the boxes and the placements against each other.
Rooms publish their geometry through `CODEBOOK_ROOM_OPTS` so the test checks what the room
declares instead of numbers copied into the test.

**Originally outstanding**: the floor polygon (needed once anyone walks in these rooms) and
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

## 8l. You cannot tell when a line has alternatives — BUILT 2026-09-21

**The diagnosis in the spec below was half wrong, and the real cause is worth recording.**
The layout was already viewport-capped: `.stage` is `height:100%`, and `.panel` had
`max-height:20%; overflow-y:auto`. So the page did not scroll — the *panel* did, internally,
and the only cue was a scrollbar nobody looks for. Worse, `.scene-wrap` was
`width:100%; aspect-ratio:16/9; flex:0 0 auto`, so the scene claimed the full width first
and the panel took whatever was left: on a 1600x900 window that is about **80px**, against
the ~390px four replies actually need.

**Fixed by cutting the panel into the bottom of the scene.** The first attempt gave the
panel the space and let the scene shrink into it; the user asked for the better version:

> "maybe we can keep the size of the main scene the same? just cut into it from the bottom?
> and have background a bit transparent under the dialog options?"

So `.scene-wrap` is back to `width:100%; aspect-ratio:16/9; flex:0 0 auto` — **the original
geometry, which is what keeps every hotspot percentage valid** — and `.panel` is
`position:absolute; bottom:0` over it, `rgba(237,240,242,0.76)` with a `blur(9px)` backdrop
so the art reads through, capped at `max-height:64%`. No letterboxing, no shrinking, full
art at every size.

**The trap in an overlay panel, and how it is handled.** Floating the panel over the art
covers the hotspots underneath it — the Mensa's table for one, the Bureau's counter, every
low hotspot in the game. The panel is therefore `pointer-events:none` and only
`button.choice` takes `pointer-events:auto`, so clicks in its padding and in the gaps
between buttons pass straight through to the scene. The list itself becomes interactive
only when it is genuinely scrollable, because only then does it need the wheel; the first
pass had `.choices` always interactive and it silently swallowed clicks in the gaps.

Verified by hit-testing rather than by eye: with a four-reply menu open, a point on a button
resolves to the button, a point in the left padding resolves to the background image, and a
point in the gap between two buttons resolves to the clerk's hotspot.

Plus `CODEBOOK_CHOICE_COUNT(el)`, called from every `choice()`/`addChoice()`/`clearChoices()`
in both the shared scaffolding and the four hand-built Act I rooms. It writes a mono
"4 replies" label above the list, marks the list `is-scrollable` (a bottom fade) only when
it genuinely overflows, and `scrollIntoView({block:'nearest'})`s it on arrival. The label is
a *sibling* of `#<p>_choices`, so every test that queries `#<p>_choices button` is untouched.

Verified at 1600x900, 1440x900 and 1280x600: the Bureau's four-way menu shows all four
options with no scrolling at any of them.

**Cost, accepted:** with several replies open the panel covers roughly the lower 45% of the
art. It shrinks back to a thin strip as soon as the choices are gone, and the art behind it
is visible through the blur throughout.

**Original spec below.**

---

## 8l-spec. You cannot tell when a line has alternatives — logged 2026-09-21 (user)

> "i am not overly happy about how we solve alternative dialogs being available. sometimes
> ones does not know that alternatives are available. one has to scroll down. I know that,
> but other users might not"

This is the most serious usability problem in the game, because the choices *are* the game.
Every real decision — the three limitations at the Bureau, the contribution at the Registry,
the redaction at the Tribunal, every wrong branch worth walking — is a button in that list.
A player who never sees the list plays a different, much worse game and never knows.

**Where it comes from.** The choices render into `<div class="choices">` inside `.panel`,
which sits *below* the scene image in normal document flow. The scene is a 16:9 image sized
to the window width, so on any window that is not tall, the image alone fills the viewport
and pushes the buttons off the bottom. Nothing on screen indicates they are there. The
dialogue caption floats over the art at `top:3%`, so the player's eye is at the top of the
screen while the interaction is at the bottom, past the fold.

It is worse in exactly the rooms that need it most: menus like the Bureau's `ownMenu()` and
the Accelerator's four-way put four or five buttons up at once.

**What to do — in order of value, and the first two are probably enough:**

1. **Never let the panel go below the fold.** Make the room a viewport-height layout: the
   scene takes the space that is left after the panel is reserved, rather than the panel
   taking what is left after the scene. `.scene-wrap` gets `min-height:0` in a column flex
   with the panel, and the image scales down to fit. The whole room then always fits the
   window and there is nothing to scroll.
2. **Say how many there are.** A small count above the list — "3 replies" — in the same
   mono label style as the verb grid. Cheap, unmissable, and it also tells the player that
   a *single* reply is the only reply, which is information too.
3. **Fade and scroll inside the list** if it still overflows on a very short window:
   `overflow-y:auto` on `.choices` with a bottom gradient mask that only appears when
   `scrollHeight > clientHeight`.
4. **Nudge on arrival.** When choices appear, `scrollIntoView({block:'nearest'})` on the
   list, so even a mis-sized window lands the player on them.

**Do not** solve it by moving the buttons on top of the art. They are long sentences, several
at a time, and they would cover the scene the caption is already floating over.

**Done when:** at 1280x720, 1440x900 and 1280x600, entering a room with a four-way menu shows
every option without scrolling; the count is visible; and the existing tests still drive the
buttons by text (they query `#<p>_choices button`, so keep that id and structure).

---

## 8m. Causality Corridor: randomise the case order, and rewrite the door labels — logged 2026-09-21 (user)

> "the order of rooms in causality corridor should be different every time. also, the door
> labels are not good enough yet."

**Random order.** `ROOMS` is a fixed array of four cases and `current` walks it 0-1-2-3, so
the corridor plays identically every time and is trivially transmissible between players —
"it's X→Y, Y→X, Z, coincidence". Shuffle on entry instead, and keep the shuffle in the save
so a mid-corridor reload does not reorder the room you are standing in.

Two things the shuffle must not break: the fall resets to the *first* case of the current
run (`current = 0`), which stays correct as long as the shuffled order is what persists; and
the answers are per-case, so nothing else is positional. Worth checking the four cases read
in any order — case 1 currently doubles as the tutorial, so whichever comes first may need
to carry the "read the note with the magnifying glass" teaching.

**Door order too — logged 2026-09-21 (user):** *"maybe the doors should also have slightly
different order each time"*. This is the stronger half of the fix. Shuffling only the cases
still leaves "the answer to the Cones one is the third door"; shuffling which relation sits
behind which physical door removes the positional solution entirely. It needs the door
*positions* decoupled from the door *meanings*, which the data model currently merges —
`room.doors.xy` is both "the X → Y door" and "the leftmost door".

**The labels: keep the text, fix the look — corrected by the user 2026-09-21:** *"i actually
liked the labels... just the visual and aesthetics of it did not match"*. So X → Y, Y → X,
Z → X & Y and COINCIDENCE stay exactly as they are. The problem was that `.cc-label span`
rendered them as a cream rounded chip in monospace with a drop shadow — modern UI floating
on top of a painted Victorian corridor. They should be made of the same stuff as everything
else in this game: engraved brass, screwed to the door, like the Bureau's wall of plaques,
the Sampling Officer's pedestal and the contribution tag.

**Done when:** the four cases appear in a different order on each playthrough; the relation
behind each door also varies; both survive a reload and a fall; the plaques look like part
of the painting; and the Act I walkthrough still completes the corridor.

---

## 8n. The outro repeats its slides, and nothing moves — BUILT 2026-09-21

Every interlude panel now drifts: a 26s scale-to-1.11 with a per-shot direction, four
directions cycled so the sequence does not pan the same way every time, and `pan:'still'`
on a panel to opt out. **The move does not restart when consecutive panels share an image** —
verified by measurement: across the outro's three campus-walk beats the transform keeps
climbing (1.012, 1.020, 1.028) instead of resetting, so they read as one held shot rather
than the same slide three times. A new image resets and starts a fresh move. Honours
`prefers-reduced-motion`.

That was enough on its own; no extra outro art was needed.

**Original note below.**

---

## 8n-spec. The outro repeats its slides, and nothing moves — logged 2026-09-21 (user)

> "several slides show up multiple times. the animations or camera moves are not looped in"

**Counted, not guessed.** The outro has **11 panels built from 6 images**:

| Image | Consecutive beats it carries |
|---|---|
| `outro-1-walk` | **3** (the Skeptic, the workshop door, the Doorman) |
| `outro-4-r2` | 2 (the comments, then the verdict on them) |
| `outro-5-verdict` | 2 (REVISE AND RESUBMIT, then the armchair skeleton) |
| `outro-6-monkey` | 2 (the office, then the typing) |
| `outro-3-letter` | 1 — **but up to 4**, because all three conditional panels (`tobiSawResult`, `theory_empty`, `analysis_p_hacked`) splice in reusing it |

So a player who earned all three flags sees the envelope four times and the campus walk three
times in a row.

**And there is no camera movement anywhere in the interlude system.** `#interlude .il-img`
transitions `opacity` and nothing else — no pan, no zoom, no drift, in any interlude or the
outro. That is what turns the reuse into a visible fault: each repeat is a hard cut back to
a pixel-identical frame, which reads as the slideshow glitching rather than as a held shot.

**These are one fix, not two.** Give each panel a slow continuous drift (a Ken Burns move of
a few per cent), and — the important part — **do not restart the move when consecutive
panels share an image**. Let it keep running across the beats. The three walk beats then
become one slow push across the campus while the narration changes over it, which is what
the writing already assumes. Where the image does change, cross-fade rather than cut
(`CODEBOOK_CROSSFADE_IMG` now exists for exactly this).

Per-panel control worth having: an optional `pan:` on a panel (`'in' | 'out' | 'left' | 'right'`)
so the fall of a beat can be chosen — the months card wants a slow push in, the monkey wants
to be still.

**Only if that is not enough:** paint two more images so the three walk beats differ
(the Library conveyor and Feldstrom's chalked door are both described in the narration and
neither is drawn). Try the motion first; it is cheaper and it fixes the other four reuses
too, which no amount of new art will.

**Done when:** no two consecutive beats show an identical static frame; every panel drifts;
transitions between different images cross-fade; and `?play=outro` can be watched end to end
without it looking like the same picture keeps coming back.

---

## 8s. KIRA moves, the library student exists, the reading thread lands — DONE 2026-09-22

> "One other thing, Kira should move around."
> "General note, in this interlude art with question there should be no WS25/26"

**KIRA now uses her castors.** `CODEBOOK_KIRA_ROLL` had existed for a long time, was
correct, and was **never once called** — so she stood perfectly still in all four of her
rooms. Wiring it up needed three fixes beyond calling it:

- it animated `transform`, which would have thrown away the `translateX(-50%)` that centres
  a `.cb-foot` sprite on its foot mark and snapped her half a body sideways on the first
  roll. It animates `left` now.
- `translate:10% 0` would have resolved against her own width (`.cb-foot` is
  `width:max-content`), so the distance would have depended on how wide her sprite is.
  `left` is a percentage of the scene, which is the same unit the walkboxes are in.
- **her hotspot moves with her**, or you are left clicking the floor she used to be on.

It is declared per sprite (`roll: <scene-%>`) rather than called per room, so a character
cannot be given movement in one room and forgotten in the next — which is exactly how this
was lost the first time. `test-kira.js` checks all four rooms' rolls land inside that
room's walkbox at her depth, and that the hotspot follows.

**The library student (8h) has a body.** He had been written into that room for a long time
— *"Yeah, no, I skimmed it"* — with no sprite, hooked onto the `stacks` hotspot and
described as being somewhere in the dark. He is now drawn, seated at the reading desk row
with a firmly shut hardback and a four-page summary of it, with his own hotspot and two
follow-up replies. Placed by `l/t/w/h` rather than `foot`, because the depth ramp gives
*standing* heights and he is sitting down.

**The did-not-do-the-reading thread (8a.1)** now runs: the Library student → the Mensa queue
(*"I read the abstract and the conclusion. The middle is just… evidence."*) → the Writing
Room's second author, who approved a thirty-one-page draft four minutes after receiving it
→ Reviewer 2's comment 1 in the outro, which was already written and is now the punchline
of a set-up rather than a one-off.

**8a.2 needed almost nothing in text** — the Hall of Founders jokes were already all
implemented: the two portraits that are obviously the same man, the nameplate with the older
screw holes around it, the founder whose dates make him fourteen, and NO LIVING THEORISTS
BEYOND THIS POINT.

**The group portrait is in.** Eleven men in three rows who are unmistakably one man,
captioned THE FOUNDERS — A COMPLETE RECORD OF WHO WAS ALLOWED TO SPEAK. It came back with
two gags nobody asked for and both are keepers: the banner behind them reads *E PLURIBUS
SILENTIO*, and the book in the front row's hands is *TRADITIO AUT NIHIL*.

It is **not hung on the wall.** That wall is already four portraits deep with no gap, and at
the 12%-wide size a fifth frame would have to be, the only joke in the painting — that they
are all the same man — disappears entirely. It is a full-size reveal instead, on the same
overlay pattern as the Workshop's Accelerator zoom, found by the *sixth* Look At the
portraits: the five rotating wall jokes run out, and the sixth sends you to the dark end of
the hall where the rope does not go.

**The hard date is gone.** The interlude's question card is a DOM overlay, not paint, so
"(Winter term 2025/26)" was one line — but the same string was in three other in-game places
(the Office answer label, the Accelerator's scope, and its boundary readout) and six in
STORY.md. All now read "this winter term", which keeps WHEN bounded — the methodological
point — without dating the game.

**Outstanding:** her voice, and nothing else in §8.

---

## 8zo. Lecture Bingo gets suspense music — 2026-09-25 (user)

> For the bingo we should have some tense ("Who Wants to Be a Millionaire" style) background music.

- Synthesised, not licensed: `tools/music/bingo_music.py` renders `bingo-tense.mp3` (pulsing
  square-wave bass in eighths, A minor drone, heartbeat, clock ticks; 8 bars at 92 BPM, 20.87 s)
  and `bingo-tight.mp3` (the same plus E/F tremolo strings, a rising noise filter and a timpani
  roll into the loop point), and two stings: `bingo-hit.mp3` (climbing A-major chime) and
  `bingo-miss.mp3` (a sour low minor second).
- Played through Web Audio (gapless loop, `loopEnd` set to the exact bar length), because
  `<audio loop>` leaves an mp3 gap. The lecture's own music stops when the show starts. The
  tight version takes over on the beat when you are one square away, stings on dabs and false
  dabs, a big sting on BINGO, and the lecture music returns after he has left. A watcher stops
  it if you leave the room. Mixkit had nothing in this style.
- `test-lecturer` asserts the tense loop is running during play and the tight one before the shout.

## 8zn. Visual patches: nothing text-only — 2026-09-25 (user)

> Do the visual patches. — In the lecture theatre, some student should throw a paper plane.

A read-only audit of every take, use and hand-over found 4 clear and about 12 likely
text-only moments (receiving an item was already covered by the fly-in). All fixed:

- **Painted objects that now leave the painting** (ChatGPT region edits, feathered patches,
  originals in `art/patches`):
  - Corridor, room 2: the rubber duck (`cc-patch-duck.webp`), through a new generic
    `patch:` field on corridor pickups.
  - Hall: the hook pole comes off the ladder and the empty clips stay (`hall-patch-pole.webp`,
    flag `hallPoleTaken`).
  - Workshop: the masking tape comes off the control panel, uncovering three brass dials
    (`ws-patch-tape.webp`).
- **Uses and hand-overs that now change the scene:**
  - Office: the fabricated citation lands on the desk and the counter reads 10,000; then the
    slip goes in the bin and the counter clicks back to 9,999.
  - Office, seal: the preregistration device comes down on its brass arm holding your slip,
    and the wax goes on (on fire if the theory is empty) before the slip flies to you.
  - Office, submission: the folder slides off towards the chute, and a SUBMISSION RECEIVED
    card comes back up.
  - Seminar: your two lines are chalked into the first column as you pick them, the rivals'
    lines go in the second, and the third column fills once nothing slides underneath. A
    wrong line gets a red rival card pinned beneath it.
  - Workshop: Feldstrom's sprite actually leaves when the phone call sends him out, and comes
    back with him.
  - Mensa: the tote-bag list is pinned on the wall above the till.
  - Fieldwork: the bagged ballot box stands on the stage from the moment the round runs.
  - Basement: the envelope on the lectern becomes an open slip and two halves of red wax.
  - Delegation: a PAUSED tag hangs on the lever and the 12:00 auto-submit row is struck
    through; the checked record is stamped MISMATCH; finishing turns the tag to LOCKED OUT
    and the row to CANCELLED.
  - Gap Registry: a brass CLOSED plate on one drawer, which slides out with its 1994 card
    once opened; the three papers (2009, 2014, 2021) lie on the desk beside your result.
- **Paper planes** in the Lecture Theatre: while he lectures, someone in the rows throws one
  every 9 to 21 seconds (an arc over the heads, stalling towards the stage). Half the dabs in
  the bingo add one, and BINGO launches a volley of five. He does not notice.

## 8zm. Lecture Bingo, the game show — 2026-09-25 (user)

> What if the card is bigger and the player needs to press the right field to mark it? — We
> make it a bigger mini-game: weird trailer, visuals that give it a game-show feeling;
> Vossberg does not notice any of it, but the students have a blast. — I like the students,
> but the ink needs to be somewhere else now. — It should be more ridiculous: spotlights,
> live commentary, light effects, confetti when bingo.

- **The hall is full while he lectures** (`lecture-bg-bingo.webp`, ChatGPT edit of the room:
  rows of students seen from behind, cards, daubers, party hats, a B-I-N-G-O sign; original in
  `art/patches`). The front heads are cut out as `lecture-bingo-front.webp` and laid over him,
  and he stands 4.6% further back (`.behind-crowd`), so he is on the stage behind the rows.
  When he walks out, the audience goes with him (`applyPresence`).
- **The ink** moved off the floor (now under students) to the cabinet by the bust, in both
  paintings; hotspot and descriptions updated.
- **The game.** Using the card starts a 7-second opening: white flash, airhorn, marquee with
  chasing bulbs, LIVE badge, swinging spotlight beams, a disco ball lowering from the ceiling,
  sparkles, and Tobi hosting from the back row in a whisper. Then his lines play on their own
  (no more "Keep listening"), each with a timer bar on a big card, and **you dab the square he
  has just said**. Three near-miss **decoy** lines (first-order observation, trust *increases*
  complexity, open systems) punish careless dabbing. A missed term comes back: he always
  repeats himself. Space skips his line.
- **Commentary and effects**: a broadcast ticker (idle jokes plus live events: dabs, misses,
  false dabs, decoys), a stats board with **VOSSBERG AWARENESS 0%**, instant-replay
  lower-thirds, colour washes and confetti bursts on every dab, arms up from the rows, a
  Mexican wave when one away. **BINGO**: strobe, 160 confetti, fireworks, flying letters,
  airhorn, trumpets, and awareness spikes to 3% before he loses the thread and walks out.
- Voices: 3 decoy lines (Vossberg, Geeson) and 9 host lines (Tobi, Fogarty), Whisper-checked.
  `test-lecturer` plays the game (a wrong square must not mark).
- Also in this entry: the 55 new or changed lines from 8zl are voiced and bundled.

## 8zl. Puzzle audit, implemented — 2026-09-25 (user)

> There is the general point that some puzzles seem overly complex or not clear. — ok, make
> those changes. (Audit: one reader per act, every finding quoted from the code; eight
> game-stoppers and twenty proposals.)

- **Game-stoppers fixed** (block 1): p-hacking and the LARGE implication no longer strand the
  player (both still hand over the item they cost); the Seminar cannot be skipped or failed
  for good; Mensa's voucher and register; the Pond's flag; the Lecture completes on asking
  Vossberg.
- **Act I** (O1, L1, C1, P1): the Office states its goal and the citation backfires; lecture
  worksheets and chalk are gone; the Corridor shows the case on arrival and after a fall; the
  Pond's black swan glides in and the falsified ink washes back.
- **Act II** (LB1, H1, W1, S1, SE1): the reading list is lodged as WHAT IS KNOWN from a KIRA
  choice, with REF/REJECTED tags on the trolley; Professor G offers three sentences and
  accepts only the one about worked examples; the Workshop's empty-room route takes one Use;
  the Seminar alone writes the hypothesis, a two-line prediction with rival explanations; the
  seal has a "Not yet."
- **Act III** (SV1, E1, M1, F1, PR1): the Survey Lab's die is on the desk; Ethics shows four
  wax seals and asks one question about names and linkage; Mensa lists every missing thing and
  shows mug and SR-2 placed; Fieldwork only finishes its room, and the Professor's "where did
  those numbers come from?" (140 / 12 / 9) ends the act.
- **Act IV** (SB1, D1, BU1): the Basement asks which test to run (the one the slip names);
  reading the Delegation log pauses KIRA's lever, no queue ticket; at the Bureau each
  limitation is shown by putting its evidence on the counter (register, alternative card,
  response-rate tile), and the icons stay there. The response-rate tile is no longer filed.
- **Act V** (G1, WR1, R1): the Registrar needs no typed drawer label, lays the three papers
  beside your result himself, and offers plausible wrong contributions; in the Writing Room
  each red word offers three replacements, finishing needs the title back at its honest size,
  and a repaired abstract clears `claim_overstated`; the reveal is two clicks, her verdict
  follows the fail flags, and the folder goes down the chute.
- **Form H-27 is gone.** Act III fills the folder's own DATA divider (nameplate
  `DATA ☐☐☐☐`, state lines `☑ DATA: …`); the seal hands the slip back and opens the divider;
  the Act III interlude loses the H-27 panel. Old saves drop the form. `h27issued` stays as
  Act III's gate flag.
- **The folder leads the inventory**, and hovering, focusing or clicking it opens it over the
  scene: five dividers, what is filed in each, and the current act's four boxes.
- Tests: `test-endgame` rewritten for D1/BU1/G1/WR1/R1; new `test-folderpanel`.
- Still to do: visual patches where a step is still text-only. (Voices: done in 8zm.)

## 8zk. Survey Lab, radically simpler: the DISCHARGED board — 2026-09-25 (user)

> What if the Survey Lab has a "healed patients" board, and once we correct the questions the
> nurse moves them there — and that is the whole puzzle; then we get what we need. Get rid of
> the machine. (And generally: some puzzles seem overly complex or not clear.)

- The FIT FOR HUMAN ADMINISTRATION machine is gone: repainted into a **DISCHARGED** board with
  four chart clips (ChatGPT region edit merged into `surveylab-bg.webp`, both posters kept from
  the original; original in `art/patches`). Hotspot `board`.
- **Each healed patient** is walked over by the nurse and pinned on the board (`discharge()`),
  visibly; nothing is carried. **Four on the board is the room**: she staples copies into one
  item, **The Questionnaire** (filed under DATA), and stamps H-27. The fifth (practice) question
  and the machine step are gone; nothing later depended on them.
- Old saves: the four Q-cards become the questionnaire; a save with all four healed but not
  cleared finishes on entry. `test-surveylab` rewritten around the board; `test-itemlook`
  counts 53 item types.

## 8zj. Survey Lab, simplified: the pen does the work, the nurse asks for the fifth question — 2026-09-25 (user)

> "Use" is weird to solve the second question — what if we use the pen to delete parts of it?
> After solving the questions it is not clear why one would edit the clipboard, and giving it
> to the machine is weird; one does not get the "fit for human administration" machine.

- **Patient 2** (leading): the chewed pen crosses out "Don't you agree that" and "excellent" —
  visibly struck through on the chart — then it is discharged. Bare-hands Use now says the
  words are printed on and you need something to cross them out with.
- **The fifth question** no longer hides behind the machine. The moment the fourth patient is
  out, the nurse names the hypothesis and asks for it ("Four healthy questions, and not one of
  them asks whether they practise anywhere else. Write me the fifth."); the three candidates
  are offered right there, and the right one finishes the room (Talk To her, the clipboard or
  the machine all bring the same question back if you wander off).
- **The machine** is no longer a step: it glows green (`sv_green` overlay) when the instrument
  is done, and says which patients are still unwell before that.
- The scissors go back on their mount after the cut (the empty-mount patch hides again).
- 11 nurse lines voiced (new and previously silent ones). `test-surveylab` updated
  (strike-through visible, green machine, no machine step).

## 8zi. Receiving an item — 2026-09-25 (user: "I love the items showing in the middle before
they fly to the inventory")

`CODEBOOK_RECEIVE`, called from `addItem()`: the item appears large over the scene with its
name (and "Filed in the folder · DIVIDER" for documents), then flies to its slot — or into the
folder — and the slot flashes. Queued, so several at once play in turn; waits for interludes;
reduced-motion gets a fade. `test-profaway` checks it fires on pickups.

## 8zh. The USB stick has a story: the Professor is a Professor G fan — 2026-09-25 (user)

> We need to connect the USB stick better to the rap battle: what is its back story, why is it
> in the Professor's office? — Have the Professor be a fan of Prof G; maybe an autograph card
> in her office. A bit of Prof G loving.

- She asked Professor G for his beat after his Christmas lecture and never gave it back; she
  has been saving her drafts on the same stick (hence FINAL_v23). The stick is labelled
  **PROF G — BEATS — ON LOAN** in masking tape, her filename underneath.
- **Autograph card** painted into her corkboard (ChatGPT region edit, baked into
  `office-bg-empty.webp`; original kept in `art/patches`): Professor G mid-rap, signed
  "Prof G ♡", a pink sticky note "Christmas lecture — front row!!". Own hotspot: Look / Talk /
  Pick up ("Some things on this desk you borrow. This one you would never be forgiven for.").
- **She admits it** (Talk To after the question): "It is a *document*." — "I asked him for the
  beat as well. For research." — "If you see him, tell him the stick is perfectly safe."
- **The Hall points at her office**: Tobi — "his beat is on a USB stick in Professor
  Stellmacher's office … She is, like, his biggest fan"; Professor G without the stick — "And
  Stellmacher still has my beat. She said one more listen. That was December." Plugged in,
  the laptop shows her drafts next to BEATS (DO NOT GRADE).
- 7 new clips (Tobi, Professor G, her, the student), all checked with Whisper.

## 8zg. Playtest round: the Professor on demand, things that vanish when taken, voices — 2026-09-25 (user)

> I am stuck: I need the female professor to leave her office again (after she has given me
> the question I cannot lose her patience any more). The register and the catalogue card in
> the Library should disappear when taken; the scissors in the Survey Lab too. The Survey Lab
> welcome has no voice. The student and skeleton at the Mensa table are weirdly placed —
> get rid of them. Putting the enrolment register into the frame needs a visual.

- **Sending the Professor out.** Talk To her (before the interview or any time after it) offers
  *"Dr. Vossberg asked for you. The projector in the Lecture Theatre is broken again."* — she
  goes, the office is empty and the desk can be cleared; next visit she is back (nothing is
  saved, like walking out on the interview). Voiced (the student; her reply). `test-profaway`.
- **Taken means gone.** Library: region patches from ChatGPT edits of the painting — the shelf
  without the register (`lib-patch-register.webp`), the box without its cards
  (`lib-patch-cards.webp`); flags `libRegTaken` / `libCardTaken`, back-filled for old saves from
  what the player has done. Survey Lab: the cabinet's empty mount (`sv-patch-scissors.webp`)
  once the scissors are out, by either route.
- **The sampling frame fills.** Putting a list into the Mensa's gilded frame draws numbered
  cards stacking up inside it: packed to the top with the big newsletter list, stopping at
  half height with the register's 140 — the point of the puzzle, drawn.
- **Survey Lab welcome voiced** (three nurse clips, Golding).
- **Mensa**: the n = 1 student and skeleton (and their table-for-one hotspot) removed.

## 8zf. The folder takes the paperwork; acts leave their spent objects behind — 2026-09-25 (user)

> It still feels like the game has too many papers as inventory items. (Then: "make sure we
> do not break anything.")

52 item types, about half of them paper, and almost nothing ever left: a player carried ~30
things by Act V, most of them spent forms.

- **Filed, not carried.** `FILED` in the engine lists the research documents (P-1 slip,
  reading list, written mechanism, Müller & Singh, H-27, the four questionnaire items, exam
  records, the 75 tile, the data reel, the interval slide, the plaque, the contribution tag),
  each with its divider. Once the player has the folder, `addItem()` files them into
  `GAME.filed` instead of the inventory; `hasItem()` looks in both and `removeItem()` takes
  from both, so **no room logic changed** (none of these is ever selected and used on
  anything). Giving one lights up the folder's slot. Look At on the folder lists what is
  filed, by divider. Old saves are migrated on load. Act I's question is still carried in
  hand (there is no folder yet).
- **Spent objects go.** `SPENT_AT`: when an act ends (corridorDone / slipSealed / actIIIDone /
  actIVDone), the items whose last use is in that act or earlier leave the inventory — derived
  from where each item is checked, room by room. Also: the Nobel procedure and the Swedish
  card go once the Stockholm call works (not on the "too narrow" answer, which may need a
  second call); the grand phrase goes when the slip is sealed.
- **Kept**: the bingo card (Act I's minigame), the fabricated citation (already transient),
  the pen (Act V still uses it), the Z nameplate (brass, not paper).
- Carried at the start of each act, before → after: Act II 13 → 12, Act III 23 → 12,
  Act IV 27 → 7, Act V 30 → 2 (the folder and the pen, plus what Act V hands out).
- Tests: new `test-folder` (migration, filing, no filing before the folder, removal, the
  folder's Look At, act-end tidy); `test-act2` checks the call cards are spent and now fails
  on any NO/MISSING step; `test-endgame`, `test-relodge`, `test-surveylab`,
  `test-hallmechanism` read inventory + folder.

## 8ze. The Hypotheses Accelerator says what the job is — 2026-09-24 (user)

> The hypothesis accelerator is not explained enough — it is not clear what one needs to do.

The zoom opened on the honest setting (first-year Methods students / worked examples / one
term, 47 things forbidden) with no way to lodge it and no word on why: the answer on screen,
untakeable. The real route — register from the Library, Feldstrom out via the Stockholm call,
tape off, clamp the register in an empty workshop — was only discoverable piecemeal.

- **Work order card** in the zoom (bottom left, over the painted levers): the goal in one
  sentence (small enough to be wrong; every drum left; clamp in who it is about) and a live
  checklist — the enrolment register (ticks when carried), Feldstrom out of the room (he is
  waiting for Stockholm; ext. 4173 once seen, "the Library has a telephone"), the tape off
  the ◄ SPECIFY panel.
- **Lodge is always offered.** At the honest setting Feldstrom covers the slot: "Not that one.
  That one could be *wrong*." — and points at the work order.
- **Talk To Feldstrom** gains the obvious question, "Can the machine go the other way?": it can,
  not while he is in the room, and he only leaves if Stockholm calls.
- `test-accelerator` checks the card, the register tick and the refusal.

## 8zd. The Act I → II interlude: celebrate, explain the folder and the form — 2026-09-24 (user)

> The interlude from act 1 to 2 is a bit underwhelming; two slides are the same. The end of
> act 1 should be celebrated more. The folder is sudden / not explained, and then there is
> the form. (Later: other artwork shows the folder — it needs to be consistent.)

- **Seven panels, each with one job, all narrated** (Mark F. Smith, `vo-narr-act2-01…07` in
  `voices-act1.mp3`): (1) **Chapter One: Complete** — the Doorman presents the folder
  (`il2-handover.webp`), trumpets, applause and a stamp; (2) **what the Corridor taught you** —
  the four cases ticked off (a real cause, reverse causation, a confounder, coincidence);
  (3) **the folder, open** — five dividers QUESTION / THEORY / DATA / RESULT / PAPER, the
  first one full (`il2-folder.webp`, the question handwritten onto its card); (4) **Form P-1**
  — the Doorman's "what would count as surprising?", the tube, four boxes one per room;
  then the rooms, the cast poster and the ACT II card as before. Interlude panels can now
  carry `sfx:[[name, vol, delayMs]]` and `capTop` (caption at the top for a low subject).
- **One folder everywhere.** The new paintings are drawn from the established one (the
  RESEARCH PROJECT tab, the QUESTION EXISTS stamp, the desk from the opening trailer and
  Act III). Act III's first panel is now `il3-folder.webp`: the same shot with only the THEORY
  section painted in (sealed slip, THEORY EXISTS) — region-merged, so the card and its
  handwriting line up — and its narration no longer says "Chapter One: complete". The
  inventory icon now says RESEARCH PROJECT (was RESEARCH FOLDER / CONFIDENTIAL).
- **The forms, untangled.** Form P-1 (the Prediction Slip) is Act II's; H-27 (Request to
  Approach Human Beings) is Act III's. Act II rooms used to drop H-27 on first entry — the
  next act's form, mid-act — and set `h27issued`, which on its own opened Act III's gate.
  H-27 now arrives only once the slip is sealed, and the Act II rooms' nameplate shows the
  four P-1 boxes (ticking live as they fill) instead of H-27's.
- **The Act II poster** (`tools/art/cast_act2.py`): the Hall clerk, who no longer appears,
  swapped for Professor G; the narration names him.

## 8zc. The Hall puzzle reworked: the mechanism comes from Professor G — 2026-09-24 (user)

> Change the puzzle in the hall: one gets the mechanism from Professor G, but only after the
> rap battle. Before, he is nervous; after, he happily gives it, but one needs something to
> write on. One should also be able to talk to the three sociologists, but they would not
> give a mechanism.

- **Professor G** (`profGTalk`): before the battle, "Not now. I'm nervous…" (plus a pointer to
  the USB stick in the Professor's office if the player has none, so the battle can't
  dead-end the act). After it: without a blank card or the chewed pen he says what is missing;
  with both he dictates the sound mechanism (`mechanismSound: true`), the card becomes the
  written mechanism and the Hall completes. Talk To, or use the card or pen on him.
- **The founders talk** (`founder()`): Weber on his hotspot, Marx and Durkheim via the portraits.
  Each answers in his own grand theory — never a mechanism — and after the battle they sulk
  and point at the man in the hoodie. Voiced with their verse voices, so the painted mouths move.
- **Weber** no longer hides a writing spot: Look At names Professor G, the pen or card on him
  sends you to Professor G, and the Grand Phrase still gets its "that says *concerning*" answer.
  The player no longer chooses between a grand and a sound sentence (the user's call);
  old saves holding the grand sentence still read correctly.
- **Voices:** 12 new clips (Chatterbox; Professor G = Karlsson, 0.7 / 0.35 — see the casting
  table), all checked with Whisper; in `voices-act1.mp3`. The standalone rap battle page keeps
  the Hall's speakers now, not just Tobi.
- Tests: `test-weber.js` became `test-hallmechanism.js` (nine cases: founders refuse, G nervous
  before, missing card / pen, G dictates, card used on him, pen on Weber). `test-act2` seeds
  `rapDone` and talks to Professor G; `test-rapbattle` checks he dictates after the battle.

## 8zb. Rap battle, round four — 2026-09-24 (user playtest)

> The founders' beats too loud for their voices; students in the audience putting their hands
> up with the beat (and then: painted, not drawn); Professor G's mouth stops in the zoomed-out
> shot in the second half; let the player start the battle again from Tobi; a DJ.

- **Mix.** `tools/rap/verse.py`: beat gain 0.42 → 0.26, plus a smoothed duck to 0.7 under each
  rapped line (≈ −7 dB under the voice). Line timings unchanged.
- **The crowd.** `CODEBOOK_CROWD(host, wide)`: `crowd-heads.webp` (15 students from behind) and
  eight raised arms (`crowd-arm-N.webp`: fists, phones filming, horns, a peace sign) behind the
  heads, cut from two ChatGPT sheets (`art/rap/crowd`). Arms come up when a track plays and
  pump or sway on its beat, read from the track's own `currentTime`: the founders' fixed BPM,
  and for Professor G his live recording's beat times (`PROFG_BEATS`, `tools/rap/beats.py` —
  the live track drifts up to 0.3 s against a 103 BPM grid). The Hall shows a smaller crowd
  twice across (second copy mirrored); the cutscene a close one.
- **Professor G's mouth.** Whisper had heard nothing from 78 to 108 s (the first "empirical
  sociologist" / "stand up" choruses), so the mouth stayed shut exactly when the wide shot is
  on and those lyric times were interpolated. That stretch re-transcribed on its own and
  merged: all 130 lines now matched.
- **Encore.** After the battle, Talk To Tobi (in the Hall) offers "Run the rap battle again".
- **DJ P-Value.** A PhD student behind the DJ table (t-shirt: *p < .05*). Two poses from
  ChatGPT, placed and masked by `tools/rap/dj_layers.py` so the painted laptop and amplifier
  stay in front of him (`dj-a/dj-b.webp`, full-frame layers like the founders' mouths); the
  crowd's beat clock swaps them. Look / Talk / USB on him; he plugs the stick in. Non-verbal
  (headphones), so no new voice.
- **Prof G's panels crossfade.** Fading each panel out before the next showed the light rig on
  an empty stage (a blue-and-pink screen between shots); the outgoing panel now stays frozen
  underneath while the next fades in.
- `?play=rap` reloads its own address (a session flag marks the seeded load), so the link
  stays in the address bar and a reload restarts the battle. The start button hands the stick
  to the DJ.
- Tried and dropped: a spotlight on the rapping founder's portrait. An outline never sat on the
  frames (painted in perspective), and a round pool of light washed the paintings out.
- The standalone page (`tools/rap/standalone.py`) carries all of it.

## 8za. Rap battle, round three — 2026-09-24 (user playtest)

> Lyrics not always in sync with what he raps; more light effects; give Professor G a mouth.

- **Line-accurate lyrics.** `tools/rap/transcribe.py` runs Whisper (small.en, local, word
  timestamps) over `profg-live.mp3` — which also settled that the voice is in it —
  and `tools/rap/align.py` aligns the transcript to the slide lyrics (difflib; Whisper hears
  "lumen" for Luhmann): 118 of 130 lines get the time of their first rapped word, the rest are
  interpolated. The cutscene shows a stanza (≤4 lines) and highlights the line being rapped.
  Sources: `art/rap/profg-{lyrics,words,timing}.json`.
- **His mouth.** ChatGPT "only the mouth" edits of the close-up and stage panels changed only a
  141×147 and a 37×40 patch, so the mouth layers are cut straight from them. They flicker only
  during Whisper's word runs — while he is actually rapping, not in the breaks.
- **Lights.** `CODEBOOK_LIGHTS(host, fixed)`: four screen-blended sweeping beams (kept light: beams .26, dimmer ≤ .48, per the author), covering the whole window in the Hall (`fixed`) and the whole cutscene overlay including its letterbox, not just the 16:9 picture;, a beat pulse and a
  strobe flash, plus a house-lights dimmer underneath (without it the beams vanish into the
  bright painting). Colour and tempo per act — Marx red/orange 92, Durkheim blue/white 96,
  Weber amber 84, Professor G pink/cyan 104 — flashing on every scratch/air horn and panel cut.
  The caption panel is lifted above the rig in stage mode.
- The rap track now plays from a blob (like the voice bundles), so it seeks on the dev server;
  `window.CODEBOOK_RAP_AUDIO` is exposed for scrubbing.

## 8z. Rap battle, round two — 2026-09-24 (user playtest)

> Applause after Tobi's intro and after each act; the three founders all had the same beat;
> Professor G's track had no voice; more sound effects; full screen during the battle; the
> founders' mouths moved before they rapped.

- **Professor G's voice.** `media9.m4a` from the deck is the *backing track* he rapped over
  live. The game now uses the audio of `slimrap.mp4` — the author's live performance, voice and
  beat — loudness-normalised (`profg-live.mp3`, 5.6 MB, unprocessed; renamed from profg-slimrap.mp3 so no browser can serve the cached backing track). The lyrics were timed off that same
  video, so the +3.19 s track offset is gone; panels re-timed to it.
- **Three beats.** `tools/rap/beat.py` has styles: Marx *factory* (92 BPM D minor, anvil on the
  off-beats, brass stabs), Durkheim *musette* (96 BPM G minor, swung, accordion oom-pah-pah),
  Weber *chapel* (84 BPM E minor, church organ, a bell every other bar). Verses re-mixed.
- **Mouths.** Verses are now `rap-<founder>.mp3` (not `vo-…`, which made the engine animate the
  mouth for the whole file including the intro bars). `verse.py` exports each line's start AND
  end; the Hall toggles `.talking` on that portrait only between them.
- **Sound.** `sfx-rap.mp3`, a separate bundle so no existing offset moves
  (`tools/rap/sfx_bundle.py`): nine Mixkit sounds (needle drop, mic feedback, vinyl scratch,
  auditorium applause, cheering with whistles, a big laugh, drum roll, huge crowd, mic hit) plus
  a synthesised air horn (`tools/rap/airhorn.py`). Needle + feedback when the stream goes live,
  laugh + applause after the intro, scratch + air horn into every verse, applause after every
  verse, drum roll into Professor G, air horn + cheer as he steps up, mic hit + huge crowd after.
- **Stage mode.** `body.cb-stage` hides the verbs, inventory, map button and header for the
  battle, and the room requests real browser fullscreen (the USB click is the user gesture);
  both end with the battle.
- `test-rapbattle` checks mouths are still during the intro bars and that stage mode turns on
  and off.

## 8y. The Corridor door did nothing — 2026-09-24 (user)

> "The causality department door does not open despite having question and black swan." /
> "There was no doorman."

The gate itself was fine (question + Skeptic convinced opens it; `test-bugs` passed). The
problem was the door: the Doorman only came for the small **bell** beside it, and using the
door — or using the Question *on* the door, the obvious move with the Question in hand —
answered "The door is locked." Now Use / Talk To on the door (with or without an item) knocks,
and knocking fetches him exactly like the bell. `test-bugs` has a third run that opens the gate
by using the Question on the door.

## 8x. The Founders' Rap Battle — built 2026-09-24 (user)

Design and verses: STORY.md, "The Founders' Rap Battle". What was built:

- **Hall art.** `hall-bg.webp` now has recognisable **Marx, Durkheim, Weber** in portraits 1, 2
  and 4 (3 unchanged) and Tobi's livestream kit on the floor: ring light, a DJ table with
  laptop and guitar amp (the USB port), and a neon RAP BATTLE sign. Both were ChatGPT edits
  merged back region-only (portraits; floor), so everything else is byte-identical.
  `mouth-{marx,durkheim,weber}.webp` are full-frame transparent mouth layers (~11 KB each).
- **Professor G** (`sprite-profg.png`): the author's alter ego, white hoodie hood up, from two
  video frames of the author plus Tobi's sprite as the style reference. Stands at 64% of the
  floor, silent until his turn. Four cutscene panels were planned; stage, close-up and mic
  drop are in, the "founders stand up in their frames" panel is still to collect (the
  choruses cut to the wide shot until then).
- **Voices.** Founders: new LibriVox references — Marx = the German reader of the *Communist
  Manifesto*, Weber = the reader of Freud's *Über Psychoanalyse*, Durkheim = the French reader
  of *Candide* (`tools/tts/refs/lv-{manifest,freud,candide}.wav`), exag 0.45 / cfg 0.5 on
  purpose: stiff gentlemen. **Tobi** = Rob Fogarty (freed when the student was recast), 14
  battle lines in `CODEBOOK_VO`; his roaming lines elsewhere are still silent.
- **Beat.** `tools/rap/beat.py`: original 90 BPM boom-bap + Karplus-Strong harpsichord,
  synthesised, no samples. `tools/rap/verse.py` puts each line on the next beat after the last
  (tightened ≤10%; a one-line-per-bar version needed 1.75× stretch and sounded warbly) and
  writes `vo-<founder>-verse.mp3` — named `vo-<who>-` so that portrait's mouth moves.
- **Professor G's verse** is the author's own recording (`profg-slimrap.mp3`, from the deck's
  `media9.m4a`; `.m4a` is not a served type). `CODEBOOK_PLAY_RAP` is a timed cutscene: the
  track is the clock, panels switch at set times, lyrics (from slides 17–23) follow a caption
  table timed off the lyric-page changes in `slimrap.mp4` (+3.19 s track offset, found by
  envelope cross-correlation), Esc/Space skips.
- **Scene.** Tobi is pinned to the Hall until `rapDone` (host lines replace his rotation);
  USB on the DJ table / Tobi / Professor G starts it: Tobi's intro → three verses (captions
  per line, meter DING / applause / trumpets) → Professor G → the meter dies, the portraits stop
  nodding, and the mechanism can be written openly instead of behind Weber.
- Tests: `test-rapbattle.js`; `test-audio` treats the four music files as music.

---

## 8w. Staged boot loading — 2026-09-24 (user)

> "Can we do the preload in stages? First load the trailer and while that is playing we can
> preload act 1 in background?"

- **Stage 1** gates "Click to begin": only the trailer's panels plus **`voices-intro.mp3`**
  (the eight `vo-narr-opening-*` clips, 0.8 MB, split out of `voices-act1` for exactly this),
  about 3 MB. The title music is left out: `#bootMusic` streams it, and it is 3 MB alone.
- **Stage 2** — the act the save is in — starts the moment stage 1 is in and loads while the
  trailer plays. `closeSplash()` goes straight into the game if it is done; otherwise (fast
  clicking, Escape) it holds on the last trailer frame with a "Loading Act I · n%" bar and
  enters by itself when the act lands. `CODEBOOK_PRELOAD` shares in-flight fetches, so the
  wait re-uses the background download instead of starting a second one.
- **Stage 3** — the other act — quietly, as before.
- Test: `test-bootstages.js` (throttles the network to 1.5 MB/s; Begin shows at ~5.6 s with
  `voices-act1.mp3` still downloading; Escape holds on the bar; the game starts once it lands).

---

## 8v. The student speaks — 2026-09-24 (user)

> "I think we should also give the main character (student) a voice." Young woman; spoken
> quotes AND the quoted choices you click.

- **Voice:** LibriVox **Eastman** (247 Hz, the youngest-sounding unused female reference; the
  Professor is Laura Victoria, the Skeptic Klett), exag 0.6 / cfg 0.4. "BINGO!" re-rendered
  in her voice so the one line she had is not a different person.
- **What is voiced:** only what she says in quotation marks — her half of conversations and
  every choice whose label is quoted. Narration and inner "You" lines stay silent (same rule
  as `CODEBOOK_IS_NARRATION`); unquoted choices ("Continue…", "Leave") are actions.
- **Attribution:** 600 unvoiced quotes were classified by hand-reading (a subagent, then the
  unsure ones checked): 159 hers, 338 other characters, 103 signs/labels. Three texts that
  another character also says ("Yes.", "Which one?", "It says FINAL.") are left silent,
  because the lookup is by text and would put her voice in their mouth.
- **Engine:** her clips are ordinary `CODEBOOK_VO` entries (`vo-you-<md5[:8]>.mp3`).
  `CODEBOOK_PLAY_LINE(src, html)` lets the Act I rooms' `setLine()` fall back to the VO table
  when no explicit clip is given (the Corridor only when a clip matches, so System lines still
  never cut the Doorman off). A capture-phase click listener on `button.choice` speaks a
  quoted choice; while her clip plays, new lines queue behind it and a room echoing her words
  as a 'You' line does not say them twice.
- **Space** (user asked): while she is saying a clicked answer, Space skips only HER line —
  the queued reply starts at once and its caption stays up (`CODEBOOK_SKIP_CHOICE_LINE`). It
  does not count as a line skip, so anything waiting on the reply via `CODEBOOK_AFTER_LINE`
  still waits for the reply. Space at any other time stops everything, as before.
- `CODEBOOK_VO_CLIPS` accepts “ ” as well as &ldquo; &rdquo;: a button's innerHTML comes back
  with the entities already decoded, which is why the first run of the click hook was silent.
- **If you reword one of her lines,** its clip no longer matches, exactly as for the NPCs.
- Test: `test-you.js`.

---

## 8u. Prof. Stellmacher: a name, a voice and a look of her own — 2026-09-23 (user)

> "I don't like the name Halvorsen." / "She looks too close to Vossberg." / "Pick any voice
> that you think works."

- **Name:** Prof. Halvorsen → **Prof. Stellmacher** (user's pick). Only the timetable Look At
  and `test-lecturer` carried it.
- **Voice:** LibriVox **Laura Victoria** (the lowest and flattest of the four unused female
  references: 168 Hz, vs Availle 217, Gesine 201, Eastman 247), exag 0.55 / cfg 0.45 like
  Vossberg's. All ten `office-*` clips re-rendered; `voices-act1.mp3` rebuilt. W-LOSE now
  leaves on `CODEBOOK_AFTER_LINE` rather than a fixed 2.6 s.
- **Look:** "colour and edge" — cropped white pixie cut, **no glasses**, tailored teal jacket
  over a black high-neck top, one geometric brass earring, capped fountain pen. The opposite
  of Vossberg's grey hair, glasses and brown tweed. Teal was kept although the office wall is
  teal: seated, she is framed by the yellow corkboard, not the wall.
- **How the Office sprite was made (and why not the old way):** the old `prof-office.webp`
  was a difference cut of a ChatGPT edit of the whole room, and it had holes. The new one is
  a clean transparent seated bust generated on its own (same ChatGPT chat as the full-body
  design, nurse + director attached as style references), cropped, scaled into the chair box
  and **with the desk nameplate cut out of its alpha**, so the nameplate sits in front of her
  hands. Shipped at 2× (562×520). Sources: `art/characters/stellmacher/`.
- **Full-body design** `art/characters/stellmacher/stellmacher-full-v1.png` is the reference
  for the 8t posters (she replaces the old tweed "professor" there).
- **`trailer3-b-prof.webp`** (Act III interlude, her at her desk) redone as a ChatGPT edit of
  the old panel, then only the figure region (feathered) pasted back onto the original so
  nothing else drifts. Same pose; new look.
- **Mouth (user: "make sure the new prof talks with mouth movement").** `#wp_profMouth` is a
  second image in the same box as `#wp_prof`, class `cb-mouth-solo`, `data-voice="prof"`, so
  the line engine flickers it with her clips (the Vossberg pattern). Source: a ChatGPT
  "only the mouth changes" edit of the seated sprite; it came back 2-4 px off, so it was
  aligned by `-subimage-search` (shift -3,-3) before cutting a feathered ellipse, then
  cropped/resized exactly like the sprite. `test-office` now asserts the mouth exists.
- **Posters (closes 8t).** `trailer3-e-cast.webp`: she replaces Vossberg on the right.
  `trailer-cast-act1.webp`: she takes the lectern with her counter; Vossberg moves to the
  back, smaller, reading off a printout. Both are ChatGPT edits with only the changed region
  merged back onto the original. Narration re-recorded to match: `opening-05` "she keeps a
  Codebook", `opening-07` adds "A lecturer who reads her course out for her.", `act3-05`
  "her next objection". Both voice bundles rebuilt.
- **Merge recipe, because the first attempt was wrong:** `magick orig edit mask -compose over
  -composite` silently ignored the mask and shipped the whole ChatGPT repaint (caught by an
  RMSE check outside the figure). What works: `magick edit -alpha off mask -alpha off -compose
  CopyOpacity -composite fg.png; magick orig -alpha off fg.png -compose over -composite out`.
  Verify with `compare -metric RMSE` on a crop outside the mask: it must be 0.

---

## 8r. The silhouette staging is gone — DONE 2026-09-22 (user)

> "I think vossberg can be just the old prof we had there previously. Remove all the beam
> and not seeing him story. We don't need that."

Reverted, and it was the right call twice over. The silhouette only ever existed to support
the monkey-identity reveal, and that reveal was replaced in 8o by the better one (he reads
text he did not write). Once the identity gag went, the beam was a costume with nothing
underneath it — and "you never see his face" is a strange amount of mystique to spend on a
man whose whole point is that he is a stand-in.

**It also dissolves the one outstanding problem 8o created.** The eleven `lecture-*` clips
were flagged as needing recasting, because the words had moved to a new character while the
voice stayed the Professor's. But Dr. Vossberg **is** that character now — same art, same
build, same voice. The clips were never wrong; the diagnosis was. Nothing to re-render.

Restored, under his own name: `vossberg-lecturing/-pointing/-walking.webp` and
`mouth-vossberg-lecturing/-pointing.webp` (recovered from history), the mouth-sync rig, the
cross-fade between poses, and the `PROF_RIG` cut-out walk with the pacing idle. `PROF_RIG`
and `CODEBOOK_RIG_WALK` are live code again rather than the dead weight noted in 8q — the
rig was drawn for this character back when he and the Professor were the same person, and
he is the one who kept it.

Removed: the `lt_beam` overlay, the hard pose cut, and every line that traded on not seeing
him — "a black shape with a voice", "he has not stepped out of the beam", "nobody in the
building can tell you his name". The outro's last panel is now simply him at the lectern in
a lit theatre, reading the printout.

**What survives, because none of it needed the silhouette:** the two characters, the name,
the two-flag split, the timetable prop, the printout-with-a-reference-number plant in Act I,
and the post-credits reveal.

**Resolved 2026-09-23:** the ten `office-*` clips were re-rendered in Laura Victoria and
`vo-narr-opening-04.mp3` now says "her patience"; `voices-act1.mp3` rebuilt. Her walk-out
after W-LOSE now waits for the line (`CODEBOOK_AFTER_LINE`) instead of a fixed 2.6 s.

---

## 8q. The two professors, resolved — DONE 2026-09-22 (user)

> "The professor is two persons. In office it's a female professor. She leaves when her
> patience runs out. Next time one comes back she is there again. The guy in lecture
> theatre needs a name."

The final shape of 8o, and the right one. 8o split the *lecturer* off; this splits the
characters properly, and it turns out the mechanic the user asked for was already sitting
in the room unused.

**She is a woman, and she is a sprite.** She used to be painted into `office-bg.webp`, with
`office-bg-empty.webp` as the other half of a pair — two full paintings that had to stay
identical apart from one figure, and in which she could not move at all. Now there is one
background and she is a cut-out on top of it:

- generated by editing the original painting (so lighting, desk, scale and style are
  inherited rather than matched), then **cut out by differencing against the empty
  background** and composited back onto the untouched empty one. The room is therefore
  pixel-identical whether she is in it or not.
- she **breathes and leans** like every other character (8p), which the painted-in version
  could never do. Her talk dials are opened up because she is framed as a seated bust
  behind a desk, so the same lean covers far fewer pixels than on a standing figure.
- **no mouth layer.** Twelve of the fourteen speaking characters have none; hers and the
  Doorman's were the only two, and the lecturer's went in 8o. `mouth-prof-office.webp` and
  `office-bg.webp` are both deleted.

**She leaves when her patience runs out.** The Seven-Second Office already had five patience
bubbles and a lose node — but the lose node ejected *the player*, which is a weaker beat and
needed a "Retry from the start" button. Now she caps her pen, takes her coat and goes, and:

- the room becomes the empty office, and **the desk is unguarded** — so failing the
  interview is now the way you get a clear run at her things. That fell out of the change
  rather than being designed in, and it is better than what it replaced.
- **nothing is saved.** Re-entering the room re-runs `init()`, which reads `profAtOffice`
  and resets `state` to five bubbles. "Next time she is there again" is implemented by not
  implementing anything.
- the way out is re-added inside `showEmptyOfficeChoices()`, because pressing "Wait" re-
  renders the choices and would otherwise eat it.

**The lecturer is Dr. Vossberg**, and the timetable in her office now ties the whole thing
together in one prop: the nine o'clock slot reads INTRODUCTION TO SYSTEMS THEORY ·
**PROF. STELLMACHER**, ringed twice in red with **NOT MINE** beside it, and underneath, in
another hand, *cover — Dr. Vossberg*. So: the course is hers on paper, she refuses to
deliver it, the department puts someone else in the beam to read it out, and that is why he
is reading off a printout with a reference number in the header — which is the Act I plant
for the post-credits reveal. It also explains why her office is empty when the game starts.

Naming him does not weaken the staging. You know exactly who is standing in the projector
beam and you still never get a face, which is a better joke than anonymity was.

**Still outstanding, and both are the user's call because both are casting:**

- the ten `office-*` clips are a male TTS voice. She needs a female one. This is the
  blocking item — it is audible in the first five minutes of the game.
- `vo-narr-opening-04.mp3` says *"seven seconds of **his** patience"*; the on-screen text
  now says "her". The narrator is already cast, so this one is just a re-render — but it
  shares `voices-act1.mp3` with the office clips, so one bundle rebuild covers both and it
  is not worth doing twice.

**Noted while in there, not done:** `web/the-secret-of-the-codebook.html` still carries ~226
lines of `display:none` SVG — the entire pre-painting vector office, including a *male* SVG
professor with a stand-up-and-walk cycle, plus the `playWalk()` timers that drive it and the
CSS that styles it. It has been invisible since the painted backgrounds landed. It should
go, but several procedural generators still write into groups inside it, so it is a
deliberate separate job rather than a drive-by deletion.

---

## 8p. Character movement is mechanical — DONE 2026-09-22

> "I also think our movements of characters are not fine tuned and natural enough."

**Why it reads as mechanical.** Every character's idle and talk is a single two-keyframe
CSS animation on `alternate`, applied to the whole sprite:

```
[data-voice]          animation: cb-breathe 3.8s  ease-in-out infinite
[data-voice].talking  animation: cb-talk    .75s  ease-in-out infinite alternate
```

Five specific faults follow from that shape, and they are worth fixing in this order:

1. **It is a metronome.** `infinite alternate` at a fixed duration is a perfect sine. Speech
   is not periodic, and the eye reads exact periodicity as machinery. *Fix:* multi-keyframe
   talk curves with uneven beats, and a small per-instance duration jitter.
2. **Everyone is in lockstep.** Every sprite starts its 3.8s breath at the same moment, so
   the Registrar, KIRA and the skeleton in the Gap Registry all inhale together. *Fix:* a
   random negative `animation-delay` per sprite — one line, and it removes the single most
   obviously artificial thing in the game.
3. **It snaps on and off.** Adding `.talking` jumps straight to full amplitude and removing
   it cuts mid-pose. *Fix:* ramp the amplitude with a CSS variable over ~200ms at each end,
   and finish on the neutral keyframe rather than wherever the cycle happens to be.
4. **The whole body moves as one rigid block.** `transform-origin:50% 100%` rocks the entire
   figure from the feet. When a person talks, the head and shoulders move and the feet do
   not. *Fix:* talk should pivot from roughly shoulder height, not the soles — and where a
   character has a separate mouth layer, most of the motion should come from the head.
5. **No secondary motion and no variety.** Nothing settles after a gesture, and nobody ever
   shifts their weight. *Fix:* a rare idle "shift" every 8-20 seconds, phase-randomised, so
   a standing character is not a loop.

Cheap and high-value: (2) then (3) then (1). (4) needs per-character origins. (5) is polish.

**Constraint from earlier in the project:** the user's original note was that the talking
motion was *"too hectic and fast"* and every duration was halved in response. Do not undo
that — the problem now is regularity and rigidity, not speed. Keep the amplitudes and the
current tempos and change the *shape* of the motion.

---


---

**Done 2026-09-22.** All five, and the system got smaller rather than bigger: five separate
talk keyframe blocks collapsed into **one curve with four dials per character**
(`--tk-rot` how far they lean, `--tk-sc` how much they swell, `--tk-ri` how much they rise,
`--tk-dur` how fast), so a character's manner is now a line rather than a block and is
tunable in one place.

1. **Lockstep is gone.** `stampLife()` gives every sprite a random negative delay and a
   +/-10% tempo jitter, applied by a batched `MutationObserver` so rooms, interludes and
   the outro all get it without being touched. Exposed as `CODEBOOK_STAMP_LIFE`.
2. **The talk curve is seven uneven beats**, swinging both ways by different amounts,
   starting and ending neutral so the loop has no seam. Two keyframes on `alternate` *is* a
   sine wave; that was the whole problem.
3. **It ramps.** `@property --cb-a` is the amplitude and it transitions over .18s.
   `setTalking()` holds a `.talk-out` class for one ramp after the clip ends, so a
   character settles instead of freezing mid-gesture.
4. **Talking pivots from the shoulders** (`transform-origin:50% 72%`), not the soles.
   Breathing still pivots at the feet, which is correct.
5. **A weight shift** every ~17s, phase-randomised, flat for most of its cycle so it reads
   as an event and not a sway. It composes with the breath because the two animations touch
   **disjoint properties** — the breath only `scale`, the shift only `translate`/`rotate`.

Amplitudes and tempos were left where they were: the earlier complaint was "too hectic and
fast" and this one was about regularity, so changing the speeds would have re-opened the
first. `tools/test/test-life.js` pins all four properties, including that the curve
reverses direction more often than a sine can.

---

## 8o. The Professor is two different people in Act I — DONE 2026-09-22

> "In act 1 the professor is the one with the clear question and who asks for data, but
> then he is also the one giving the system theory lecture. That does not fit. But I love
> the bingo part."

Correct, and it is the one character contradiction in the game. In the Office he is the
game's conscience: he refuses vague questions, makes you specify WHO/WHAT/WHEN, and says
*"a question is not evidence."* In the Lecture Theatre he delivers exactly the grand
unfalsifiable systems-theory fog the whole game is a joke about — autopoiesis, contingency,
second-order observation — and the bingo card is mocking *him* for it. Those are opposite
characters wearing one sprite.

**Option A — split the role.** The lecturer becomes **Feldstrom**, who already is the
grand-theory man; meeting him droning in Act I and then finding his workshop in Act II is a
better introduction than the one he currently gets. The bingo vocabulary is his register
exactly.

*Cost, measured:* 3 body sprites and 3 mouth layers to regenerate (`prof-lecturing`,
`prof-walking`, `prof-pointing` and their mouths), **11 `lecture-*` voice clips** to
re-render in Bernd, and — the real problem — **it breaks the Act I loop**. Winning bingo is
what sends the Professor to his office so the interview can happen; the office is empty
before that, which is what lets you loot it. If Feldstrom lectures, the Professor has to be
somewhere else, and the "loot the empty office, then win bingo, then interview him"
sequence has to be redesigned.

**Option B — one character, fix the writing.** He is *covering someone else's course*. The
slides are not his, the notes are not his, and he is visibly bored reading them out. Then
the bingo card mocks the **material**, not the man, and the joke gets better: the one
rigorous person in the building is obliged to stand there reciting the nonsense, and the
student with the bingo card is doing him a favour by derailing it. A handful of lines in the
Lecture Theatre change; **no art, no re-voicing, no structural change**, and his Office
character stops contradicting itself.

**Option C — the lecturer is somebody else, and you never see who. CHOSEN 2026-09-21 (user).**

> "Maybe we. We'd new character for lecture or professor"
> "The professor could be in office hidden... or in shadow... and Latinate lt. it is
> revealed it is the monkey. Lol" / "Just an idea"

The lecturer becomes a separate character who is never lit: a backlit silhouette at the
lectern with the projector beam behind him, speaking fluent Latinate fog. The Professor is
then only ever the Office character, and the contradiction disappears without touching his
writing at all. The payoff is that the silhouette is **the monkey** — the same monkey that
is Reviewer 2 in the post-credits stinger (`outro-6-monkey.webp`, already painted).

This is the best version of the fix, and not only because it is funny. It closes a loop the
game already has open: the grand-theory voice that opens the game and the anonymous verdict
that closes it are the same creature, and the joke lands *retroactively* on a player who has
just spent five acts being told their contribution is insufficiently developed. It also
explains, without a word of exposition, why the lecture is unfalsifiable fog — nobody is
home behind it.

*Cost, measured — and it is cheaper than Option A, possibly cheaper than B:*

- **Art: 3 sprites replaced by 1, and 2 deleted.** `prof-lecturing`, `prof-walking`,
  `prof-pointing` become one silhouette with a pointing arm (or two poses). The two mouth
  layers `mouth-prof-lecturing` / `mouth-prof-pointing` are **deleted outright** — a
  silhouette has no visible mouth, so the whole mouth-sync rig for this room goes away.
  Silhouettes are also the single most forgiving thing to generate.
- **Voice: 11 clips** (`lecture-opening`, `lecture-summon`, `lecture-ambient-quote`, and the
  eight `lecture-line-*`) re-rendered in a different voice, run through a hall reverb so it
  reads as a PA in a big room. One `gen.py` run; no casting decision needed, since "distant
  and over-amplified" hides the voice's identity by design.
- **Structure: nothing changes.** The Professor is in his Office the whole time, which is
  where Option A broke. Bingo still summons him — or better, bingo ends the lecture and
  *then* you go to the Office, which is what already happens.
- **The reveal costs nothing**, because the outro art exists. The silhouette just needs
  proportions that are slightly wrong — a little too short, arms a little too long — so the
  reveal is fair rather than arbitrary. A player who goes back and looks should see it.

*One thing to get right:* the silhouette must not read as "asset we could not afford to
draw". It needs a reason to be backlit that is visible in the frame — the projector blazing
straight at camera, the figure in front of it. Then it reads as staging, not absence.

**Decision: C.** Option B stays written down as the fallback if the silhouette art does not
come out, since it is pure text and can be done in an afternoon.

Either way the bingo mechanic itself does not change, and the bingo card now mocks a
character who deserves it with no collateral damage to the Professor.

---


---

**Done 2026-09-22.** Option C, with the reveal rewritten after the user caught the flaw in
it:

> "I was more thinking the person in the office is the monkey, but maybe that is not good
> either. How should we solve it? It does not make sense that monkey gives lecture."

Correct, and it is the one thing the original version could not survive: the player has
just heard that figure speak fluently for ten minutes. **But the monkey never speaks in the
stinger either** — it types `asdfghjkl` and the *system* resolves the noise into prose. So
the reveal is not "the monkey lectured". It is that the lecture was the same noise, resolved
by the same system, read aloud by a man who did not write a word of it.

**The split.** The lecturer is a separate character who is never lit and never named.

- Three new silhouette poses (`lecturer-lecturing/-pointing/-walking.webp`), a tall gowned
  figure with a sheaf of printed pages under one arm — deliberately a different build from
  the Professor's compact jacketed one. Generated black-on-white and cut by inverted
  luminance, so the edges stay soft where they should.
- **Both of the mouth layers are gone.** A silhouette has no visible mouth, so the whole
  mouth-sync rig for this room was deleted, along with the five now-unreferenced files.
- He **no longer walks on the Professor's cut-out rig** — that would put the Professor's
  shoulders back in the one room the change exists to get them out of. He walks on his own
  painted pose, and he no longer paces at all: he never steps out of the beam, which the
  writing now says out loud and which is *why* the player never sees a face.
- Poses **cut, they do not cross-fade**. Two coloured sprites dissolving reads as motion
  blur; two silhouettes dissolving reads as a double exposure, and for half a second there
  were visibly two of him. This was caught on screen, not in review.
- The beam is a **CSS overlay, not new background art**, so all seventeen of the room's
  hotspots keep their coordinates. It also gives the silhouette a reason to exist in frame,
  which is the difference between staging and "art we could not afford".

**Two flags, not one.** `lecturerGone` is this room's; `profAtOffice` is the Office's. They
used to be the same flag, so calling the lecturer back to the blackboard also emptied the
Office. What brings the Professor back is the building letting out forty minutes early, and
summoning the lecturer does not un-empty it. A one-shot migration copies the old meaning
across, so a lecture you already derailed does not start over.

**Planted and paid off.** Look at him in Act I and he is reading off a printout with a
reference number in the header. After the credits the monkey pulls a form headed
THEORETICAL FRAMEWORK, types `asdfghjkl`, and the field resolves to the `closure` line —
*verbatim* from the Lecture Theatre's `LINES`, the one the player marked a bingo square for.

`tools/test/test-lecturer.js` pins all of it: his sprites and voice tag, the beam, the
absence of the rig and of any `prof-*` sprite in the room, the full bingo-to-exit run, both
flags, the Office filling up behind him, and the migration in both directions.

**Still outstanding — needs a casting decision, so it is the user's call.** The eleven
`lecture-*` clips are still rendered in the Professor's TTS voice. The words are now
attributed to a different character but they still *sound* like him, which is audible. One
`gen.py` run fixes it once a voice is chosen; "distant and over-amplified in a big room"
hides the identity by design, so almost anything works.

---

## 8i. The campus map has run out of campus — DONE 2026-09-22

> "Feldstroms workshop and the survey lab are oddly connected to the observatory. maybe we
> just extend the campus map, zoom out and have more budlings? or we repaint other areas?"

Confirmed by the coordinates. `MAP_LAYOUT` puts `surveylab` at `{l:0, t:0}` and `workshop`
at `{l:120, t:40}` on a 1200x675 grid, and the painted observatory dome and its hillside
occupy exactly that corner. Both rooms therefore look like annexes of the observatory, which
belongs to neither of them. The top-left quadrant carries three rooms (surveylab, workshop,
library) inside 510px; the whole left edge below them is pond and nothing else.

Seventeen rooms were placed onto art drawn before there were seventeen rooms. Nudging two
boxes would only move the collision, so **the fix is new map art, zoomed out**, and it
should be done together with the other outstanding map problem rather than twice:

**Act II has no map of its own.** `dataActMap = hasFlag('corridorDone') || hasFlag('pondDone')`
switches straight from `campus-map-act1.webp` to `campus-map-act3.webp` the moment Act I
ends, so the whole theory act is played over the *data* act's map — tent, black swan and all.
There is a standing TODO in the code saying exactly this. There should be three states:

| Map | Shown during | Gains over the previous one |
|---|---|---|
| `campus-map-act1.webp` | Act I | — |
| `campus-map-act2.webp` | Act II | the Library Annex, the Hall of Founders, the workshop lean-to, the Seminar Room |
| `campus-map-act3.webp` | Acts III–V | the Fieldwork tent, the black swan on the pond, and the Act IV/V buildings |

**What the new art needs.** Same painted bird's-eye style, but pulled back far enough that
every one of the seventeen rooms can have its own visibly distinct building with space
around it — and specifically with **Feldstrom's workshop as a separate lean-to well away
from the observatory**, and the Survey Lab as its own small emergency-department block
rather than something growing out of the hillside.

**The expensive part is not the art, it is the coordinates.** Every entry in `MAP_LAYOUT`
(hotspot boxes) and `MAP_LABELS` (signboard positions, already tuned to two decimal places)
is measured against the current painting. New art invalidates all thirty-four. Budget the
re-measuring, do it once, and check it with a screenshot per act rather than by eye — the
signs are now act-filtered (§1), so only a handful show at a time and mistakes hide easily.

---


---

**Done 2026-09-22.** New painting (dense gothic, autumn, warm-lit windows — the second
attempt; the first was bright neoclassical parkland and the user was right that it had
"moved too far away from the other art work"). Fifteen distinct buildings, and all
seventeen rooms now sit on one each: the two pairs that share are the Mensa/Writing Room
and the Delegation Engine/Gap Registry, whose acts never overlap. **The observatory is a
room now** — the Delegation Engine — which is what actually fixes the complaint that
opened this item: the workshop and the survey lab used to look like its outbuildings
because it was scenery with no purpose of its own.

The three-map plan stayed dead. One painting, act-filtered signage, two overlays.

**The coordinates are generated, not hand-tuned.** `tools/art/maptables.py` holds one
table of buildings and one of signs and writes `MAP_LAYOUT` and `MAP_LABELS` into the game
with `--write`. It refuses to produce a table that violates any of:

- no two hotspots overlap *anywhere* — every unlocked room's button is on the map at once
  by Act V, so this is a global check, not a per-act one. It caught workshop/mensa and
  seminar/fieldwork, both 1-2% slivers that would have made a room partly unclickable.
- no two signs that can be on screen together overlap, where "together" includes the
  Professor's Office, which is signposted in **every** act, and the Pond, which keeps its
  board if left unpainted. It caught the Office's board sitting on the Bureau's.
- nothing a player must read or click falls below **89%**. The map is never cropped — the
  wrapper keeps the painting's exact aspect — but at 1600x900 the last ~10% of it is below
  the fold and has to be scrolled to, which is what the old "y=90" rule was really about.

**Board sizes are measured, not guessed.** `tools/art/signfit.js` measures each board's
text in the real font at the real size and prints the `MEASURED` table; the board is that
plus padding, and every board is `nowrap`. This was a real bug and not a hypothetical one:
"Probability Pond" needed 11.13% and had 10.91%, so it wrapped to two lines and spilled
over both curled ends of the scroll. The Pond is measured in its *painted* state — three
lines, and the widest it ever gets, because a board cannot resize itself mid-act.

`web/campus-black-swan.webp` was re-cut from the new painting's own second swan, so the
black swan matches the white one beside it exactly. The three unreferenced map files
(`campus-map-act1.webp`, `campus-map-act3.webp`, `campus-map-bg.webp`, ~1.9MB) were
deleted; nothing had referenced them since the three-map plan was dropped.

---

## 8j. Feldstrom's extension number should be on the wall — BUILT 2026-09-21

An index card pinned to the door panel directly above the telephone, reading FELDSTROM /
4173, with its own `extcard` hotspot that sets `wsExtension` on Look At. The desk route
still works, so there are two ways in and no new state.

Built as an HTML overlay rather than a repaint or a sprite: the number stays crisp at any
resolution, the painted workshop is untouched, and its hotspot percentages are unaffected.
Placed at `l:83.5, t:41.5` — clear of Feldstrom, who stands at 76%, and of the desk hotspot
below at `t:58`. The STOCKHOLM TIME clock that is an hour wrong is still in the line.

**Original note below.**

---

## 8j-spec. Feldstrom's extension number should be on the wall — logged 2026-09-21 (user)

> "in feldstrom's workshop, the phone number should be very visible pinned at the wall
> somewhere. It is too difficult to find out."

Right now extension 4173 is only revealed by **Look At** on the `desk` hotspot, and the
Library phone is dead until that flag is set. So the entire Stockholm chain — the best
sequence in Act II — is gated behind examining one piece of furniture that looks like
scenery. A player who picks up the receiver first is told "you do not know anybody's
extension" and has no idea where to go.

**Fix:** put it on the wall where it cannot be missed. A pinned index card or enamel plate
near the telephone reading **EXT. 4173**, with its own hotspot, setting `wsExtension` on
Look At exactly as the desk does. Keep the desk path working — two ways in, no new state.

Do it as a sprite plus an SVG text overlay rather than a repaint, the way the Form P-1 and
H-27 panels do their lettering: the number stays crisp at any resolution, and the painted
workshop (which is good, and whose hotspots are measured against it) is left alone.

Worth keeping the joke: the card is pinned next to the STOCKHOLM TIME clock that is an hour
wrong, and nobody has ever told him.

---

## 8k. The Hypotheses Accelerator should be a mini-game — logged 2026-09-21 (user)

> "There should also be some sort of mini-game where one use the hypothesis accelerator and
> ridiculous things come out. This should be a zoom into the accelerator when one uses it."

The Accelerator is the best machine in the game and the player currently interacts with it
through a menu. Using it should **zoom into the control panel** — a full-frame view of the
machine, the way `CODEBOOK_PLAY_INTERLUDE` takes over the stage — and the play should be
assembling hypotheses out of parts and watching what comes out.

**The hard constraint: it has to be the existing puzzle, not a replacement.** The Workshop
already teaches something specific and it works — peel the tape so the machine runs *both*
ways, feed in the enrolment register to bound the claim, then SPECIFY. The flags
(`wsTapeOff`, `wsScoped`, `wsInflated`) and the slip's SCOPE and HYPOTHESIS boxes all hang
off it. The mini-game should be the *interface* to that, with the absurd outputs as the
texture around the one sound setting.

**Feldstrom is the second gauge — logged 2026-09-21 (user):** *"while one cranks up the
accelerator Feldstrom should get more and more excited"*.

This is what makes the mini-game teach rather than merely amuse, so build it as the spine
rather than as decoration. **Two needles move in opposite directions and he only ever
watches one of them.** As the claim grows, THINGS THIS FORBIDS falls towards zero and
Feldstrom climbs:

| Setting | FORBIDS | Feldstrom |
|---|---|---|
| first-year Methods students, one term | **47** | wary, arms folded — *"That is very small."* |
| everyone at this university | 12 | mildly interested, unfolds his arms |
| everyone, a decade | 3 | leaning in |
| all human beings, the post-war period | 1 | on his feet |
| all social systems, all of recorded history | **0** | radiant, hand on your shoulder |
| **traffic** | **0** | takes his glasses off. *"…you have understood the machine."* |

The player's own instinct is the test: you crank it because his reaction is funny, and the
gauge you are not watching is quietly telling you the claim now forbids nothing at all. When
the honest setting goes in, the FORBIDS needle climbs off zero for the first time in years,
the machine makes an unhappy noise, and he is genuinely deflated — which is exactly the beat
the existing scene already ends on (*"You've made it terribly small." — "Yes." — "…brave."*),
so the mini-game hands off into dialogue that is already written.

Feldstrom must be **present** for this, which the current puzzle forbids: you can only use
the machine properly once the Stockholm call has got him out of the room. So the cranking is
the *before* state — play with the drums while he is here and being delighted, and the real
scoping happens later in the empty workshop. That also gives the room something to do on the
first visit, which it currently lacks.

Reuse the existing talk animation for his escalation (`cb-talk-grand` is already his), and
`sprite-feldstrom.png` with a scale/translate per stage rather than new art if possible.

**Shape.** Three drums you crank, in the machine's own vocabulary:

- **POPULATION** — first-year Methods students · everyone at this university · everyone ·
  all human beings · all social systems · *traffic*
- **MECHANISM** — worked examples · exposure · osmosis · resonance · the dialectic
- **SCALE** — one term · a decade · the post-war period · all of recorded history

Crank and it prints a strip. **The THINGS THIS FORBIDS gauge is the score**, and it is the
lesson: every grand combination reads **0** and the machine purrs approvingly; the one small,
bounded, dull combination makes the needle climb off zero for the first time in years and
the machine sounds *unhappy about it*. Feldstrom, if present, is delighted by the zeros.

Ridiculous outputs are the reward for playing, and they should be printed on the strip and
be genuinely funny — "CIVILISATION IS TRAFFIC" already exists as the top of the title ladder
in Act V and belongs in here as the maximum setting, so the two jokes rhyme.

**Existing pieces to reuse:** the `il-*` overlay CSS and `CODEBOOK_PLAY_INTERLUDE`'s
full-stage takeover for the zoom; `CODEBOOK_SFX` has `sfx-printer`, `sfx-drum-spin`,
`sfx-click` and `sfx-refuse` already; the painted Accelerator in `workshop-bg.webp` is the
reference for the zoomed panel art.

**Done when:** using the machine zooms in; the drums can be cranked freely and the absurd
combinations are worth cranking for; the gauge reads 0 for every grand one; the sound
setting still sets `wsScoped` and fills the slip's SCOPE box exactly as it does today; and
`test-act2.js` still walks the honest route through the act unchanged.

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

## 8g. Artwork for the Form P-1 trailer — BUILT 2026-09-21

Painted as `il2-slip.webp` with the four box headings overlaid in SVG, and the Act II room
montage composited from the four painted backgrounds. Panels 3 and 4 of that interlude went
in at the same time. Nothing outstanding.

**Original note below.**

---

## 8g-spec. Artwork for the Form P-1 trailer — logged 2026-09-21 (user)

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
