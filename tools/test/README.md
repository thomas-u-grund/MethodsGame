# Headless test suite

Forty-three CDP scripts that drive the real game in headless Chrome. They are the
acceptance tests for the work packages in `ROADMAP.md`, and every package is
expected to leave them all green.

```bash
cd web && python3 -m http.server 8934 &
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --mute-audio --autoplay-policy=no-user-gesture-required \
  --window-size=1440,900 --remote-debugging-port=9333 --user-data-dir=/tmp/cdp-profile-cb about:blank &
cd tools/test && npm install ws --no-save
for t in test-*.js; do printf "%-18s " $t; node $t >/dev/null 2>&1 && echo PASS || echo FAIL; done
```

**Always `--window-size=1440,900`.** Without it the headless window is 800x600, the game
lays itself out for a small screen, and the playthrough tests fail on buttons that are not
where they expect (2026-09-26). **Set `CDP_PORT`** to drive a second Chrome (e.g. 9334) for
screenshots while the suite runs on 9333.

**Always `--mute-audio`.** An unmuted run once played the game's music out loud on
the user's machine.

| Script | What it protects |
|---|---|
| `test-rooms` | every room on the map opens with no JS errors |
| `test-assets` | every asset referenced in the HTML resolves (catches renames) |
| `test-audio` | every voice clip resolves through the bundle and play to their declared length |
| `test-gates` | `CODEBOOK_ACT_GATE` and the three durable failure flags |
| `test-bugs` | the Doorman's gate opens on skip AND on line end |
| `test-surveylab` | the instrument is incomplete until it measures the hypothesis |
| `test-ethics` | linkage: over-redaction blocks it, overall-marks is refused, proper wins |
| `test-mensa` | the enrolment register is the right frame; the official list is not |
| `test-handoff` | the Office "where did those numbers come from" scene |
| `test-sfx` | the effects channel: offsets, one-shots, unknown names are harmless |
| `test-migrate` | an old save survives the Act II→III renumbering |
| `test-preload` | preloading primes the bundle so the first line is not a cold fetch |
| `test-bootstages` | staged boot: Begin needs only the trailer; the act loads during it |
| `test-you` | the student speaks her lines and clicked answers; Space skips only her |
| `test-act2` | Act II played through: Library catches (conveyor, 8zy), the phrasebook call, the Accelerator, the seal |
| `test-stockholm` | the call is a split screen; without the phrasebook "Abba" is hung up on; with it he leaves |
| `test-endgame` | Acts IV and V played through, including the Keynote Showdown, then the reveal and the chute |
| `test-r2battle` | the Reviewer 2 battle: wrong cards cost composure, 17 is last, overstated adds two comments |
| `test-simplecontrols` | one action is one click, icons only for a real choice, Use-with only with an item |
| `test-interludes` | each act's opening plays exactly once, in order |
| `test-rapbattle` | the Founders' Rap Battle runs, mouths sync, Professor G dictates afterwards |
| *(the rest)* | one per room or mechanic; the file header of each says what it protects |

**The audio blind spot:** a muted run cannot hear silence, which is exactly how v51
shipped mute. `test-audio` asserts structurally (offsets resolve, clips fire `ended`
on schedule), but after any audio change a human still has to listen once.
