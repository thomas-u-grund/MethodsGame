# The Secret of the Lost Codebook

A LucasArts-style point-and-click adventure that teaches research methods, built as a single self-contained HTML5 file — no build step, no server, no dependencies.

**Play it:** https://thomas-u-grund.github.io/MethodsGame/ (GitHub Pages, redeployed on every push to `main`), or locally (below). Two scenes are shared on their own: *The Founders' Rap Battle* (https://claude.ai/artifact/JuphmaQKxKgwC5s4AURpD5) and *Systems Theory Bingo* (https://claude.ai/artifact/1q6rocWvPkLQLeBUvoUjha), built by `tools/rap/standalone.py` and `tools/bingo/standalone.py`.

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

All five acts and the outro are built, painted, voiced and playable end to end (19 rooms on the campus map):

- **Act I — The Question:** Office, Lecture Theatre (Systems Theory Bingo), Causality Corridor, Probability Pond.
- **Act II — Theory:** Library, Hall of Founders (the Founders' Rap Battle), Feldstrom's Workshop (and the Stockholm call), Seminar Room.
- **Act III — Data:** Survey Lab, Ethics Tribunal, Mensa, Fieldwork Arena.
- **Act IV — Evidence:** the Significance Casino, KIRA's Delegation Engine, the Bureau of Implications.
- **Act V — Apparently Somebody Has to Present It:** Psych Lab, Writing Room, Poster Session, the Keynote Showdown.
- **Outro:** the Reviewer 2 battle, REVISE AND RESUBMIT, and the monkey after the credits.

Tests: `bash tools/test/run-all.sh` (headless Chrome on port 9333, the game served on 8934; see `tools/test/README.md`). A step-by-step solution is in `WALKTHROUGH.md`.

Each act's assets are preloaded behind a progress bar, and the next act is fetched in the background. Large images ship as WebP; the full-size PNG originals are kept out of the repo. See `HANDOVER.md` for the current state and open items.
