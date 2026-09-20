# The Secret of the Lost Codebook

A LucasArts-style point-and-click adventure that teaches research methods, built as a single self-contained HTML5 file — no build step, no server, no dependencies.

**Play it:** https://claude.ai/artifact/1VJHdVezyJFxnsZXS3kRi6

> A grad student, panicking over an empty research folder and a deadline that isn't moving, sets out to get one real question out of the one professor with a reputation for producing them — and ends up spending the rest of the semester turning that question into an entire research project, one increasingly absurd department "chapter" at a time, before discovering that the mythical Codebook everyone's been whispering about was never anything more than... Methods.

## Running it locally

Just open `web/the-secret-of-the-codebook.html` in a browser, or serve the `web/` folder with any static file server:

```
cd web
python3 -m http.server 8080
```

Then visit `http://localhost:8080/the-secret-of-the-codebook.html`.

## Structure

- **`web/`** — the game itself: `the-secret-of-the-codebook.html` plus every image and audio asset it loads.
- **`art/`** — source art and per-room `ART_PROMPTS.md` files documenting how each background/sprite was generated, for regenerating or extending the art later.
- **`STORY.md`** — the narrative bible: premise, cast, and beat-by-beat plot.
- **`HANDOVER.md`** — the living technical/session log: architecture, what's built, what's still open.
- **`ROADMAP.md`** — the master build plan: house rules, work packages, definition of done.
- **`CHANGELOG.md`** — chronological build log.

## Status

- **Act I** (Office, Lecture Theatre, Causality Corridor, Probability Pond) is fully built, art-passed and voice-acted, with a "Starring" cast poster and an ACT I title card at the end of the opening trailer.
- **Act II** (Survey Lab, Ethics Tribunal, Mensa, Fieldwork Arena) is fully built as painted verb-grid rooms with character sprites and the H-27 cross-room puzzle chain, introduced by its own trailer-style interlude (and "Starring" poster).
- **Acts III–V** exist as functional puzzle rooms but don't yet have the art or narrative pass.

Each act's assets are preloaded behind a progress bar, and the next act is fetched in the background. Large images ship as WebP; the full-size PNG originals are kept out of the repo. See `HANDOVER.md` for the current state and open items.
