# The Ethics Tribunal — Art Prompts

*The Secret of the Lost Codebook · Act II · Art Pipeline*

A new room: a gigantic, self-important gothic courtroom standing in for a human-subjects ethics committee. See `STORY.md` → Act II → "The Ethics Tribunal" for the full puzzle design.

**Important — this background must ship EMPTY.** No judges seated yet, no consent-form pages, no stamps in use, no cards visible in the ballot box, no ledger open. Characters (the Chair of Consent, the Keeper of Data, the Representative of Potential Discomfort) get added later as separate sprites, same pattern as the Professor. The Irreversible Participation Device is structural furniture, not a pickup item, so it belongs in the base art — but shown in its "problem" state (missing its withdraw button) since that's the room's fixed joke, not something that changes. The glass ballot box, by contrast, is portable (it gets wrapped in a Mensa lunch bag and carried to the Fieldwork Arena later), so it's a small side-table prop in the background, not built into the room's architecture — see its own inventory-icon prompt below rather than baking it permanently into the scene.

## How to use this

1. Attach `corridor-gate-bg.png` (gothic architecture anchor), `office-bg.png` (palette anchor), and **`lecture-bg.png` (house-crest/banner reference — this is the one that matters most, see note below)**.
2. Paste the prompt below as-is.
3. Crop/resize to 16:9 (1672×941) and drop into `web/` as `ethics-bg.png`.

**Known failure mode, already hit once:** the first generation of this room used its own invented heraldry — navy-blue banners with a crown-and-shield crest — instead of the university's actual house crest, which is established everywhere else in the game (the campus map, the Lecture Theatre) as **maroon/burgundy banners trimmed in gold, alternating between a gold rampant lion and a gold open book wreathed in laurel — no crown, no shield, no blue.** `lecture-bg.png` shows both banner variants clearly. Be explicit about this in the prompt (already done below) and double-check the result against `lecture-bg.png` before accepting it.

---

## Background

Attach: `corridor-gate-bg.png` (gothic architecture/mood anchor), `office-bg.png` (palette anchor), `lecture-bg.png` (house-crest/banner reference).

```
Generate a wide background illustration for a narrative adventure game, in the exact same painted, comic-linework illustration style as the attached reference images (a gothic campus building exterior, the professor's office, and the lecture theatre, all from the same game) — same brush texture, warm-into-dramatic lighting, and color palette. Landscape orientation, 16:9.

Scene: the interior of an absurdly grand gothic courtroom, viewed from floor level as if standing before it. A massive, ornately carved wooden judges' bench looms twenty feet up at the back of the room, with three tall empty high-backed chairs behind it, currently unoccupied. Above and behind the bench, a large stained-glass window depicting a simple robed figure ticking a box labeled "I CONSENT," rendered in the same reverent style as a religious stained-glass scene. A brass plaque mounted on the front of the bench reads "THE INSTITUTIONAL TRIBUNAL FOR THE APPROACHING OF PERSONS."

Hanging on the walls, use the exact same heraldic banners as the attached lecture theatre reference image: tall maroon/burgundy banners trimmed in gold rope, each bearing either a gold rampant lion or a gold open book wreathed in laurel — match that reference's banner design precisely, do not invent a new crest, no crowns, no shields, no blue or navy banners anywhere.

To one side, on a small side table, an empty spot where a ballot box will later sit (leave this table bare). To the other side, an ornate wooden chair fitted with a heavy leather seatbelt, mounted on a small platform, with a small brass plaque reading "IRREVERSIBLE PARTICIPATION DEVICE" — the chair has no visible exit lever, button, or release mechanism anywhere on it. Dark wood pews for a small gallery in the foreground, empty. Tall gothic windows along the sides letting in autumn light, dust motes visible in the light shafts.

No people. No other readable text anywhere in the scene except the two signs specified.
```

Save the result as `ethics-bg.png`.

## Follow-up sprites

Room-fixed props (composite onto the finished `ethics-bg.png`, not carried):

- **The three judges** — the Chair of Consent, the Keeper of Data, the Representative of Potential Discomfort (visibly asleep), as robed character sprites seated at the bench.
- **The withdraw button** — a small red button sprite to be composited onto the Irreversible Participation Device once "installed."
- **The Redaction Stamp and ink pad**, and the locked Key Ledger book — both stay in this room permanently (the Ledger's name↔ID key is never allowed to leave), so these can be simple desk-prop sprites rather than inventory icons.
- **The skeleton**, buried under amendment letters, sign reading "MINOR AMENDMENT 14 OF 15."

## Inventory items

### Glass Ballot Box — "Strictly Anonymous Responses"

Starts empty on the side table here; later gets wrapped in a Mensa lunch bag and carried to the Fieldwork Arena. Generate both states.

```
Generate a small inventory-icon illustration in the same painted comic style as this reference: a small ornate glass ballot box with a coin-slot lid, completely transparent, a printed paper label wrapped around it reading 'STRICTLY ANONYMOUS RESPONSES' in official serif lettering — clearly visible through the glass are a few blank white cards inside. Centered, isolated object, small dramatic highlight/shadow for depth. Transparent background. Square canvas, roughly 256x256px. No other objects.
```

**Second state — wrapped:** once combined with the Mensa lunch bag (see `art/mensa/ART_PROMPTS.md`), generate a variant of the same box now snugly wrapped in an ordinary brown paper lunch bag, only the coin-slot lid and the corner of the "STRICTLY ANONYMOUS RESPONSES" label peeking out over the top of the bag. Same style/size/framing as the base icon.

### Twelve-Page Consent Form (and its replacement)

Two contrasting icons — the intimidating original and the fix.

```
Generate a small inventory-icon illustration in the same painted comic style as this reference: an intimidatingly thick stapled stack of legal paper, dozens of pages, dense tiny grey text implied by fine horizontal lines rather than readable words, a small red "SIGN HERE" tab sticking out the side. Centered, isolated object, small dramatic highlight/shadow for depth. Transparent background. Square canvas, roughly 256x256px. No other objects, no legible text.
```

```
Generate a small inventory-icon illustration in the same painted comic style as this reference: a single clean sheet of paper with a friendly, spacious layout — a few short implied lines of text and one clearly visible checkbox near the bottom. Centered, isolated object, small dramatic highlight/shadow for depth. Transparent background. Square canvas, roughly 256x256px. No other objects, no legible text.
```

### Torn Calendar Page — "The Last Four Weeks"

Torn from the Tribunal's wall calendar; carried to the Survey Lab to give "often" a reference period.

```
Generate a small inventory-icon illustration in the same painted comic style as this reference: a single torn calendar page, ragged edge along the top where it was ripped from a spiral binding, showing four rows of a small grid representing weeks, with the corner header partially reading 'LAST 4 WEEKS' in a handwritten circle. Centered, isolated object, small dramatic highlight/shadow for depth. Transparent background. Square canvas, roughly 256x256px. No other objects.
```

### Redacted & ID-Tagged Questionnaire Bundle

The correctly-anonymized version: names blacked out, a handwritten ID number added by the chewed pen. Carried to the Fieldwork Arena.

```
Generate a small inventory-icon illustration in the same painted comic style as this reference: a small bundle of paper questionnaires tied with string, the top sheet visible with a thick black redaction bar where a name would go, and a small handwritten number '07' in the corner in blue ink. Centered, isolated object, small dramatic highlight/shadow for depth. Transparent background. Square canvas, roughly 256x256px. No other objects.
```

### Alternative Paper Questionnaire

A spare paper copy for the one sampled participant who refuses the online form.

```
Generate a small inventory-icon illustration in the same painted comic style as this reference: a single clean paper questionnaire folded in thirds like a pamphlet, a small pencil clipped to the fold. Centered, isolated object, small dramatic highlight/shadow for depth. Transparent background. Square canvas, roughly 256x256px. No other objects, no legible text.
```
