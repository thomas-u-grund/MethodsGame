# To do (2026-10-02)

State: everything under "Done" is pushed (commit 3b384a3, 2026-10-02) and live on GitHub Pages and
lostcodebook.org; all 44 tests passed before the push.
Art sources are in `art/interludes/chapters/` and `art/characters/repaint/` (not in git).

## Open

1. **Duel freeze, Act V (author, Chrome on a Mac, voice-only).** Screenshot: standing, empty slide, no line,
   no hint. Fixed blind (not reproduced): in voice-only mode a duel line whose voice the browser refuses to
   play now shows its words instead of an empty screen, a voice that runs long shows the words and the
   hint, the hint is easier to see, and the duel is letterboxed to the window instead of cut off at the
   sides. **Re-test on the Mac**; if it still hangs, a screenshot plus Chrome's console (View > Developer >
   JavaScript Console) would show the cause.
2. **Monkey in the duel crowd** (`web/duel/index.html`, `.crowd-monkey`): it should replace one
   audience member, not sit between them. Plan: a ChatGPT edit of `web/duel/duel-crowd.webp` with
   the person in the red beanie (middle row, left of centre) repainted as the monkey seen from
   behind (references: `art/interludes/chapters/ref-duelcrowd.png`, `ref-monkey-back.png`), then
   paste back only that patch and remove the separate `.crowd-monkey` image. The request was sent
   but ChatGPT ran out of images; resend when the limit resets.
3. Small: the Chapter Three painting (`il-ch3-complete.webp`) has a nonsense door sign on the far
   right ("HALL NEED TO TAP IN"); repaint that corner if it bothers.
4. **Outro office slides** (`outro-2-letter.webp`, `outro-3-accepted.webp`, Stellmacher's office): the
   corkboard lacks the monkey and Prof G's photo that the in-game office has. Repaint those corners in
   ChatGPT with the game's office background as reference, when the image limit resets.

## Done (pushed 2026-10-02, later)

- **Duel sound:** the duel's own sound (music, bell, effects) starts when it opens; it waited for a click
  inside the duel, which voice-only play may never give. Checked in a Chrome that blocks sound until a
  click: nothing else in Act V is refused.
- **Tobi's clip:** after you win the duel he posts it (the outro's "Tobi's clip" now exists).
- **Outro:** the two Stockholm prize slides are one, shorter (new narration with KIRA's lines); Feldstrom's
  two slides are one, no click between; no empty-office slide, the Office opens with her there on that
  narration; Stellmacher's mouth in the office moves (its slow fade swallowed the lip-sync); the Gazette
  shouts "Extra, extra!" as in Act IV.
- **Keynote chat** moved under the applause meter on the left (it covered Vossberg); on landscape phones meter
  and chat start below the room's buttons.
- **Map button:** a big Map icon right above the bag (simple controls, PC and phones), same width as the bag;
  on a PC both sit higher, just under the room bar.
- **Schnitzel hotline:** a delivered schnitzel shows in the bag at once (it appeared only after a room change).
- **Bingo arms** rise from behind students' heads (drawn under the front-row picture), not over the rows.

## Done (pushed 2026-10-02)

- **Keynote and duel:** in voice-only mode a spoken line moves on by itself when the voice ends (game:
  `CODEBOOK_AFTER_CLICK`; duel: `say()`); Feldstrom's build-up slides run by themselves; the hall stays
  as dark from his talk into the stand-up and the duel; the duel fits the window (letterboxed); a
  voice the browser refuses shows its words instead of an empty screen (see 1).
- **Tobi's live windows** sit below the room bar and left of the verb panel (Poster Session, Writing
  Room, Keynote chat); Tobi leaves the Poster Session before announcing the keynote from the Hall.
- **Tobi's warning** when you try to hang the poster unregistered is voiced.
- **Poster Session:** the poster cannot go up before the slip is registered (Tobi says so); only Tobi
  announces the keynote; coming back after the session goes straight on to the keynote.
- **Achterberg's stamp** leaves a red REGISTERED impression on screen.
- **Schnitzel hotline** in Act V delivers a real schnitzel.
- **Research folder:** one icon per solved room in every act; Act V lists its steps.
- **Chapter-complete slides** for Acts II, III, IV: new paintings in the style of Chapter One
  (`il-ch2/3/4-complete.webp`).
- **Mensa ceremony:** the "A SAMPLE HAS OCCURRED" banner unrolls from the ceiling and stays up
  (`mn-sample-flag.webp`).
- **Stellmacher's office, end of Act II:** the device on the tube is a painted brass machine
  (`wp-device.webp`).
- **Act III:** GO LIVE button in the Fieldwork Arena; the students leave after the "Zero" round with a
  hint to the ballot box; one questionnaire (the redacted ones are the paper forms); ballot-box hints
  in the Tribunal; the approval speech no longer says the box comes bagged; one judge asleep, not two.
- **Casino:** the two wax dots on the lectern are gone.
- **Music:** each act's map theme starts again after the act's intro, at its normal volume.
- **Mouths and faces:** nurse, doorman, officer, director and judges use their new mouths; the walking
  rigs move their mouths; overlays colour-matched (the Skeptic); her blink dropped.
- **Rap crowd:** original heads and bingo arms back.
- **Voice:** re-recorded the "best poster" lines, the Tribunal recess line, the approval speech, the
  casino lectern line, podium 9's line.
