# The Secret of the Lost Codebook

A LucasArts-style point-and-click adventure that teaches research methods, built as a single self-contained HTML5 file — no build step, no server, no dependencies.

**Play it:** **https://lostcodebook.org** (free, in any browser; Cloudflare Pages, redeployed on every push to `main`; the old GitHub Pages address still works), or locally (below). Two scenes are shared on their own: *The Founders' Rap Battle* (https://claude.ai/artifact/JuphmaQKxKgwC5s4AURpD5) and *Systems Theory Bingo* (https://claude.ai/artifact/1q6rocWvPkLQLeBUvoUjha), built by `tools/rap/standalone.py` and `tools/bingo/standalone.py`.

> A grad student, panicking over an empty research folder and a deadline that isn't moving, sets out to get one real question out of the one professor with a reputation for producing them — and ends up spending the rest of the semester turning that question into an entire research project, one increasingly absurd department "chapter" at a time, before discovering that the mythical Codebook everyone's been whispering about was never anything more than... Methods.

## Running it locally

Just open `web/the-secret-of-the-codebook.html` in a browser, or serve the `web/` folder with any static file server:

```
cd web
python3 -m http.server 8080
```

Then visit `http://localhost:8080/the-secret-of-the-codebook.html`.

## Bonus points for your course

The game is free to play and free to use in teaching. Instructors can also let students claim bonus points:

1. Sign in at **https://lostcodebook.org/teach** with your email (you get a 6-digit code, no password).
2. Register the course: name, university, country, term, and whether students claim **after each act** or **once at the end**, with a deadline for each.
3. Give students the course link it shows you (`lostcodebook.org/?course=CODE`). After each finished act, the game shows **Claim your bonus point**; students enter their student number and name.
4. The day after each deadline you get the list by email (a table plus a CSV file). You can also see the claims on your page at any time.

Each point can be claimed once per student number and once per game device. How it works and how to run it yourself: `bonus/README.md`.

(An older, server-free variant still works for self-hosted copies: a course JSON file in `web/courses/`, a completion certificate with an HMAC code, checked on `verify.html`; see `web/courses/example.json`.)

## Support

The game is free and stays free. It is a one-person project, made in the evenings alongside an academic job. If it was useful to you or your course, you can support it on **Patreon** (https://www.patreon.com/lostcodebook, monthly) or **Ko-fi** (https://ko-fi.com/lostcodebook, once). Questions, ideas or using it in a course: **contact@lostcodebook.org**.

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
