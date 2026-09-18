# Corridor Art Prompts

*The Secret of the Codebook · Art Pipeline*

Causality Corridor is four separate rooms, one per case, each a genuinely different painting. The correct door in each room advances to the next; the statement itself is pinned to the wall as a blank card the game fills in with text, not baked into the art. Each room also gets its own lost-student skeleton — a running gag that someone's been wandering this maze since before you got here.

## How to use these

1. Start with Room 1's base prompt, attaching `office-bg.png` as the style reference.
2. Once a room's base comes back, attach *that* image to its pickup-edit prompt (where one exists) to add the small object.
3. Rooms 2–4 can reuse the same reference (`office-bg.png`, or the Room 1 result — either keeps the style consistent) — continue in the same chat if you can, it remembers the style.
4. The 3 icon prompts at the bottom are for the pickups only; the fixed wall decor (posters, chalkboard) never leaves the room, so it needs no icon.
5. Crop each room, recalibrate its 4 door hotspots per painting, and wire the pinned-note text + pickups in.

---

## Room 1 of 4 — Tuition and Payoff

The education→income case (correct door: X→Y). Decor is graduation/income themed — purely illustrating the anecdote, doesn't hint at the answer.

### 1a. Base room — Scene

```
Generate a wide background illustration for a narrative adventure game, in the exact same painted, comic-linework illustration style as the attached reference image (a professor's office from the same game) — same brush texture, linework, warm lighting, and color palette. Landscape orientation, same aspect ratio as the reference.

Scene: a single hallway room, viewed straight-on at eye level. Dark teal-blue walls matching the reference office's wall color, wainscoting along the lower third, and a worn wooden floor with a faded patterned runner rug down the center, in the same rug pattern as the office. Four identical closed wooden doors, evenly spaced across the full width of the room and filling most of the frame, each with a plain wooden face — no text or numbers on the doors themselves — a simple round brass doorknob, warm brass hinges, and a small blank rectangular brass plaque mounted on the wall directly above each door. Leave every plaque completely blank, no text or symbols on them — labels are added separately. Warm hanging pendant lamps hang evenly spaced above the doors, casting pools of warm light on the floor below, matching the desk lamp's glow from the office. Crop tight so the doors fill most of the width, with only slivers of wall visible at the far left and right edges.

On the back wall, above or between the two middle doors: a large blank torn sheet of paper or index card, pinned or taped up, big enough to hold a paragraph of handwritten text — leave this card completely blank, no text on it, that gets added separately.

Scattered around the room, fitting a room about education and income: a graduation mortarboard cap hanging on a wall hook, a rolled diploma tied with ribbon propped in a corner, a small framed chart on the wall showing a simple upward-trending line, and a neat stack of envelopes marked with dollar signs on a small side shelf.

No characters. No readable text anywhere in the scene except the blank card described above (leave it blank).
```

### 1b. Add the magnifying glass — Scene edit

*Attach the result of 1a.*

```
Using the attached image as the exact base scene, add one small object to the room without changing anything else — the doors, lighting, decor, composition, and camera angle should all stay identical. Match the same brush texture, palette, and painted style as the rest of the illustration.

Add: on a small shelf or ledge, within easy reach: a brass-and-glass magnifying glass with a dark wooden handle.

Keep every other detail of the scene identical.
```

### 1c. Add the lost student — Scene edit

*Attach the current room1 art (with or without the magnifying glass already in it — either is fine).*

```
Using the attached image as the exact base scene, add one small addition to the room without changing anything else — the doors, lighting, decor, composition, and camera angle should all stay identical. Match the same brush texture, palette, and painted style as the rest of the illustration.

Add: seated on the floor in a corner, not blocking any door: a cheerful cartoon skeleton wearing an old backpack, clutching a tattered course catalog in its bony hands. Propped against it, a small hand-lettered sign reading 'ENROLLED 1998. STILL LOOKING FOR THE RIGHT DOOR.'

Keep every other detail of the scene identical.
```

---

## Room 2 of 4 — The Television Diagnosis

The sick-kid→TV case (correct door: Y→X). Decor is sickroom/TV themed.

### 2a. Base room — Scene

```
Generate a wide background illustration for a narrative adventure game, in the exact same painted, comic-linework illustration style as the attached reference image (a professor's office from the same game) — same brush texture, linework, warm lighting, and color palette. Landscape orientation, same aspect ratio as the reference.

Scene: a single hallway room, viewed straight-on at eye level. Dark teal-blue walls matching the reference office's wall color, wainscoting along the lower third, and a worn wooden floor with a faded patterned runner rug down the center, in the same rug pattern as the office. Four identical closed wooden doors, evenly spaced across the full width of the room and filling most of the frame, each with a plain wooden face — no text or numbers on the doors themselves — a simple round brass doorknob, warm brass hinges, and a small blank rectangular brass plaque mounted on the wall directly above each door. Leave every plaque completely blank, no text or symbols on them — labels are added separately. Warm hanging pendant lamps hang evenly spaced above the doors, casting pools of warm light on the floor below, matching the desk lamp's glow from the office. Crop tight so the doors fill most of the width, with only slivers of wall visible at the far left and right edges.

On the back wall, above or between the two middle doors: a large blank torn sheet of paper or index card, pinned or taped up, big enough to hold a paragraph of handwritten text — leave this card completely blank, no text on it, that gets added separately.

Scattered around the room, fitting a room about a sick kid and a television: a small vintage television on a rolling cart, its screen glowing with static, a folded blanket draped over the arm of a chair, and a thermometer and a box of tissues sitting on a small side table. Also, sitting on the floor near the TV cart, a cheerful cartoon skeleton holding a television remote in one bony hand, slumped back as if mid-binge. A small hand-lettered sign propped beside it reads 'SAT DOWN TO THINK IT THROUGH. NEVER GOT BACK UP.'

No characters (the skeleton is a prop, not a character). No readable text anywhere in the scene except the blank card and the sign described above.
```

### 2b. Add the rubber duck — Scene edit

*Attach the result of 2a.*

```
Using the attached image as the exact base scene, add one small object to the room without changing anything else — the doors, lighting, decor, composition, and camera angle should all stay identical. Match the same brush texture, palette, and painted style as the rest of the illustration.

Add: in a floor corner near the TV cart, not blocking any door: a small yellow rubber duck, sitting upright, with a handwritten paper tag tied around its neck reading 'Z?'

Keep every other detail of the scene identical.
```

---

## Room 3 of 4 — Cones and Coroners

The ice-cream→drowning case (correct door: Z→X&Y). Decor is summer/beach themed, plus two fixed Look-At-only wall pieces — no pickup, no edit pass needed.

### 3a. Base room (complete, no edit pass) — Scene

```
Generate a wide background illustration for a narrative adventure game, in the exact same painted, comic-linework illustration style as the attached reference image (a professor's office from the same game) — same brush texture, linework, warm lighting, and color palette. Landscape orientation, same aspect ratio as the reference.

Scene: a single hallway room, viewed straight-on at eye level. Dark teal-blue walls matching the reference office's wall color, wainscoting along the lower third, and a worn wooden floor with a faded patterned runner rug down the center, in the same rug pattern as the office. Four identical closed wooden doors, evenly spaced across the full width of the room and filling most of the frame, each with a plain wooden face — no text or numbers on the doors themselves — a simple round brass doorknob, warm brass hinges, and a small blank rectangular brass plaque mounted on the wall directly above each door. Leave every plaque completely blank, no text or symbols on them — labels are added separately. Warm hanging pendant lamps hang evenly spaced above the doors, casting pools of warm light on the floor below, matching the desk lamp's glow from the office. Crop tight so the doors fill most of the width, with only slivers of wall visible at the far left and right edges.

On the back wall, above or between the two middle doors: a large blank torn sheet of paper or index card, pinned or taped up, big enough to hold a paragraph of handwritten text — leave this card completely blank, no text on it, that gets added separately.

Scattered around the room, fitting a room about ice cream and summer drownings: a vintage-style ice cream cart illustrated on a small poster, a coiled orange pool life-ring hanging on a wall hook, and faded bunting flags strung along the top of the back wall. Also on this wall: a small cork board patch with a handful of photos connected by red string in a chaotic, nonsensical pattern, like a conspiracy board; and a hand-lettered 'WANTED' poster, featuring a tangled two-line graph in place of a face, captioned 'SPURIOUS CORRELATION' in small type underneath. Also in the room, propped in a corner: a cheerful cartoon skeleton wearing a pool floatie ring around its ribcage and a pair of sunglasses knocked askew, holding a popsicle stick with a hand-lettered sign reading 'STILL WORKING ON MY TAN. AND MY ANSWER.'

No characters (the skeleton is a prop, not a character). No readable text anywhere in the scene except the blank card, the poster caption, and the sign described above.
```

---

## Room 4 of 4 — Cage Rating

The film-count→drowning case (correct door: Coincidence). Decor is cinema themed — deliberately no face or likeness anywhere, just props. The two "Z" objects landing in the one room where the answer is *not* a real confound is a small intentional joke.

### 4a. Base room — Scene

```
Generate a wide background illustration for a narrative adventure game, in the exact same painted, comic-linework illustration style as the attached reference image (a professor's office from the same game) — same brush texture, linework, warm lighting, and color palette. Landscape orientation, same aspect ratio as the reference.

Scene: a single hallway room, viewed straight-on at eye level. Dark teal-blue walls matching the reference office's wall color, wainscoting along the lower third, and a worn wooden floor with a faded patterned runner rug down the center, in the same rug pattern as the office. Four identical closed wooden doors, evenly spaced across the full width of the room and filling most of the frame, each with a plain wooden face — no text or numbers on the doors themselves — a simple round brass doorknob, warm brass hinges, and a small blank rectangular brass plaque mounted on the wall directly above each door. Leave every plaque completely blank, no text or symbols on them — labels are added separately. Warm hanging pendant lamps hang evenly spaced above the doors, casting pools of warm light on the floor below, matching the desk lamp's glow from the office. Crop tight so the doors fill most of the width, with only slivers of wall visible at the far left and right edges.

On the back wall, above or between the two middle doors: a large blank torn sheet of paper or index card, pinned or taped up, big enough to hold a paragraph of handwritten text — leave this card completely blank, no text on it, that gets added separately.

Scattered around the room, fitting a room about film and coincidence — props only, no people, no faces, no likenesses of any kind: red velvet rope stanchions flanking one side of the room, a stack of unlabeled film-reel canisters, and a blank theater marquee sign with no text on it. Also in this room: a cracked chalkboard fragment leaning against the wall, showing a half-erased diagram of circles connected by arrows (a directed graph), with one node smudged away entirely; and, tucked in a floor corner, a pool floatie ring. Also, sitting cross-legged facing the blank marquee: a cheerful cartoon skeleton holding an empty popcorn bucket, a small hand-lettered sign propped against it reading 'WAITED FOR THE TWIST. THERE WASN'T ONE.'

No characters, no faces, no portraits or likenesses anywhere — the skeleton is a prop, not a character or a likeness of any real person. No readable text anywhere in the scene except the blank card and the sign described above.
```

### 4b. Add the nameplate — Scene edit

*Attach the result of 4a.*

```
Using the attached image as the exact base scene, add one small object to the room without changing anything else — the doors, lighting, decor, composition, and camera angle should all stay identical. Match the same brush texture, palette, and painted style as the rest of the illustration.

Add: on the floor near the chalkboard fragment: a small brass nameplate, lying flat, dusty, engraved simply 'Z'.

Keep every other detail of the scene identical.
```

---

## Inventory icons — The three pickups

Only these three ever enter the player's inventory. Same format as the office icons: isolated object, transparent background, small shadow for depth.

### Icon — Magnifying Glass

```
Generate a small inventory-icon illustration in the same painted comic style as this reference: a brass-and-glass magnifying glass with a dark wooden handle, held at a slight diagonal. Centered, isolated object, small dramatic highlight/shadow for depth. Transparent background. Square canvas, roughly 256x256px. No other objects.
```

### Icon — Rubber Duck ("Z?")

```
Generate a small inventory-icon illustration in the same painted comic style as this reference: a small yellow rubber duck, sitting upright, with a handwritten paper tag tied around its neck reading 'Z?'. Centered, isolated object, small dramatic highlight/shadow for depth. Transparent background. Square canvas, roughly 256x256px. No other objects.
```

### Icon — Brass "Z" Nameplate

```
Generate a small inventory-icon illustration in the same painted comic style as this reference: a small rectangular brass nameplate, slightly tarnished and dusty, engraved simply 'Z' in serif capitals. Centered, isolated object, small dramatic highlight/shadow for depth. Transparent background. Square canvas, roughly 256x256px. No other objects.
```

> Door labels (X→Y, Y→X, Z→X&Y, Coincidence) stay code-rendered over each painting, same as now — not baked into the art, so they're never at risk of coming out garbled or misspelled.

---

## Wrong-door consequence — The Fall

Picking the wrong door ends the run — the player falls and gets sent back to the Campus Map.

### The Fall — Scene

*Attach one or two of the corridor room paintings as style reference.*

```
Generate a wide illustration in the exact same painted, comic-linework style as the attached reference images (corridor room paintings from the same game) — same brush texture, warm-into-dark lighting falloff, and color palette. Landscape orientation, same aspect ratio as the reference.

Scene: looking almost straight up from deep inside a dark, endless vertical shaft, as if the viewer is falling downward away from a corridor high above. Far up at the very top of the frame, a small rectangle of warm light shows the corridor doorway shrinking into the distance — doors and pendant lamps just barely visible as tiny silhouettes. The shaft walls curve away into blackness, with faint radial motion-streak lines suggesting a fast downward fall.

Tumbling and scattered through the frame, as if falling alongside the viewer: a diploma unrolling in midair, a rubber duck spinning, a tangled ball of red string and photographs, a stack of round film canisters, a paper popcorn bucket spilling popcorn, a cracked chalkboard fragment with a half-erased diagram, loose sheets of paper fluttering, and a single ice cream cone mid-tumble.

In the lower-middle of the frame, closer to the viewer and already at rest as if this is routine for it: a cheerful cartoon skeleton, arms crossed, sitting cross-legged in the dark, giving the viewer a deadpan look as they fall past. A small hand-lettered sign propped against it reads 'WATCH YOUR STEP.'

No real people, no faces, no readable text except the sign. Moody, mostly dark palette, with the falling objects and the distant doorway as the only bright spots.
```

> The joke: it's the same "resigned skeleton" gag from the four rooms, just already waiting down here — like it's watched this happen a hundred times before.

**Shipped** as `web/corridor-fall-bg.png`.

---

## Entrance · The Door

The very first thing the player sees on entering the corridor: one closed door with a bell to ring. No character is shown — whoever answers stays off-screen, described only in text ("The Doorman"), same as the rest of the room's dialogue.

### Entrance — Scene

*Attach one of the corridor room paintings, or office-bg.png, as style reference.*

```
Generate a wide illustration in the exact same painted, comic-linework style as the attached reference image — same brush texture, warm lighting, and color palette. Landscape orientation, same aspect ratio as the reference.

Scene: a small dim vestibule, viewed straight-on at eye level, facing a single closed wooden door — larger and more ornate than the plain doors elsewhere in the game, centered in the frame and filling much of its height. Dark teal-blue walls matching the reference, a worn wooden floor. A single warm pendant lamp hangs directly above the door, casting a pool of light down onto it. Mounted on the wall beside the door, at hand height: an old-fashioned brass pull-bell or a small round push-bell with a tarnished brass plate beneath it — the object the player is meant to ring. The door itself is plain, no text or numbers on it, with a simple round brass doorknob and a small closed peephole or slot near eye level.

No characters, no faces, nobody visible at or behind the door. No readable text anywhere in the scene.
```

> Keep the door blank/unlabeled and don't add a visible person — both the door's identity and whoever answers stay purely in the game's text, same as everywhere else in the room.

**Shipped** as `web/corridor-gate-bg.png` (came back with a distinct bell + "RING FOR BETTER QUESTIONS" plaque baked in, richer than the prompt asked for).

---

*Source: [Corridor Art Prompts artifact](https://claude.ai/code/artifact/6f4ba194-c931-4fe3-bcbe-7b180e29485c)*
