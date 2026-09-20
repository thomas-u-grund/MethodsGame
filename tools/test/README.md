# Headless test suite

Twelve CDP scripts that drive the real game in headless Chrome. They are the
acceptance tests for the work packages in `ROADMAP.md`, and every package is
expected to leave them all green.

```bash
cd web && python3 -m http.server 8934 &
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --mute-audio --autoplay-policy=no-user-gesture-required \
  --remote-debugging-port=9333 --user-data-dir=/tmp/cdp-profile-cb about:blank &
cd tools/test && npm install ws --no-save
for t in test-*.js; do printf "%-18s " $t; node $t >/dev/null 2>&1 && echo PASS || echo FAIL; done
```

**Always `--mute-audio`.** An unmuted run once played the game's music out loud on
the user's machine.

| Script | What it protects |
|---|---|
| `test-rooms` | every room on the map opens with no JS errors |
| `test-assets` | every asset referenced in the HTML resolves (catches renames) |
| `test-audio` | all 145 clips resolve through the bundle and play to their declared length |
| `test-gates` | `CODEBOOK_ACT_GATE` and the three durable failure flags |
| `test-bugs` | the Doorman's gate opens on skip AND on line end |
| `test-surveylab` | the instrument is incomplete until it measures the hypothesis |
| `test-ethics` | linkage: over-redaction blocks it, overall-marks is refused, proper wins |
| `test-mensa` | the enrolment register is the right frame; the official list is not |
| `test-handoff` | the Office "where did those numbers come from" scene |
| `test-sfx` | the effects channel: offsets, one-shots, unknown names are harmless |
| `test-migrate` | an old save survives the Act II→III renumbering |
| `test-preload` | preloading primes the bundle so the first line is not a cold fetch |

**The audio blind spot:** a muted run cannot hear silence, which is exactly how v51
shipped mute. `test-audio` asserts structurally (offsets resolve, clips fire `ended`
on schedule), but after any audio change a human still has to listen once.
