# The Secret of the Lost Codebook

A point-and-click adventure in the LucasArts tradition that teaches research methods. It has five acts,
19 rooms, full voice acting and painted art, and runs free in any browser on a computer or a phone.

**Play it: https://lostcodebook.org**

> A grad student, panicking over an empty research folder and a deadline that isn't moving, sets out to get one
> real question out of the one professor with a reputation for producing them. They end up spending the
> semester turning that question into an entire research project, one absurd department "chapter" at a time,
> and discover that the mythical Codebook everyone whispers about was never anything more than… Methods.

## What it teaches

The whole game is one small research project: *Do first-years who attend more Methods lectures get better exam
results?* Each act is one stage of it, and each ends on a "what you learned" card.

| Act | Rooms | What the player learns |
|---|---|---|
| **I — The Question** | the Seven-Second Office, the Lecture Theatre (Systems Theory Bingo), the Causality Corridor, Probability Pond | A topic is not a question; one black swan refutes "all swans are white"; correlation is not causation |
| **II — Theory** | the Library, the Hall of Founders (the Founders' Rap Battle), Feldstrom's Workshop, the Seminar Room | Check your sources (and the AI's); a mechanism in your own words; write down, before you look, what would prove you wrong |
| **III — Data** | the Survey Lab, the Ethics Tribunal, the Mensa (the sampling ceremony), the Fieldwork Arena | Consent and anonymity; questions that ask one thing and do not lean; random samples from the right list; non-response |
| **IV — Evidence** | the Significance Casino, KIRA's Delegation Engine, the Bureau of Implications | Check every line the machine writes; run the test you promised (no p-hacking); say what a result means at its true size |
| **V — The Annual Meeting** | the Infinite Monkey Project, the Writing Room, the Poster Session, the Keynote Showdown | A contribution in words the data can carry; answer the question you were asked; evidence beats volume |

The tempting wrong choices are all allowed: the p-hacked "discovery", the inflated claim, the empty theory. The
game stamps them, files them, and makes you live with them later. The paper ends with **Revise and
Resubmit**, the monkey after the credits, and *To be continued: Part Two, The Revisions*.

- **`LESSONS.md`:** every act's lessons, word for word, for instructors.
- **`WALKTHROUGH.md`:** the full solution, including the wrong branches worth walking on purpose.

## Playing

- **Controls.**
  - Simple controls by default: click or tap a thing to act.
  - Classic verb controls can be switched on in Settings.
  - Phones always use simple controls; landscape works best.
- **Sound and text.**
  - Every line is voiced.
  - The 💬 button switches the written dialogue on or off.
  - Settings has music volume and a switch for background sounds. Music is quieter by default on phones.
- **Saving.**
  - Progress is saved in the browser.
  - The 🗺️ button opens the campus map at any time; the bag holds the inventory.

## For teachers: bonus points

The game is free to play and free to use in teaching. Instructors can also let students claim bonus points:

1. Sign in at **https://lostcodebook.org/teach** with your email (you get a 6-digit code, no password).
2. Register the course: name, university, country, term, and whether students claim **after each act** or
   **once at the end**, with a deadline for each.
3. Give students the course link it shows you (`lostcodebook.org/?course=CODE`). After each finished act the
   game shows **Claim your bonus point**; students enter their student number and name.
4. The day after each deadline you get the list by email (a table plus a CSV file). You can also see the
   claims on your page at any time.

Each point can be claimed once per student number and once per game device. How it works: `bonus/README.md`
and `functions/api/README.md`.

## License and citation

© 2026 Thomas U. Grund, RWTH Aachen University. The game (code, text, art, music, voices and sound) is licensed under
**CC BY-NC-ND 4.0**: you may play, share and link it unchanged for non-commercial purposes such as teaching,
with credit, but not distribute changed versions. Screenshots and short clips for teaching, presentations and
reviews are welcome. Details: `LICENSE`.

To cite the game, use GitHub's **Cite this repository** button (from `CITATION.cff`). A DOI via Zenodo is in
preparation.

## Support

The game is free and stays free. It is a one-person project, made in the evenings alongside an academic job.
If it was useful to you or your course, you can support it on **Patreon**
(https://www.patreon.com/lostcodebook, monthly) or **Ko-fi** (https://ko-fi.com/lostcodebook, once).
Questions, ideas or using it in a course: **contact@lostcodebook.org**.

## How it was made

Designed and written by Thomas U. Grund (RWTH Aachen University,
[ORCID 0000-0001-6751-5429](https://orcid.org/0000-0001-6751-5429)), and built with AI tools:
- **Art:** paintings and character art generated with OpenAI's image model, then cut, rigged and animated
  for the game.
- **Voices:** synthesised locally with Chatterbox, using public-domain LibriVox recordings as voice references.
- **Music:** made with Suno (paid plan, so the tracks are the author's).
- **Code:** written with Claude Code.

The game is one HTML file (`web/the-secret-of-the-codebook.html`) with its images, voices and music beside
it. There is no build step and no framework. The bonus-point service runs on Cloudflare Pages Functions with a
D1 database.

## Running it locally

Serve the `web/` folder with any static file server:

```
cd web
python3 -m http.server 8080
```

Then open `http://localhost:8080/the-secret-of-the-codebook.html`. (Opening the file directly also works,
but the bonus points and some audio need a server.)


## Repository

This public repository holds the playable game and what is needed to run it. The development repository (source
art, the voice, art and trailer pipelines, tests and design documents) is private.

| Path | What |
|---|---|
| `web/` | the game: the HTML file, images (WebP), `voices/` (one small MP3 per line), music and sound |
| `functions/` | the bonus-point API (Cloudflare Pages Functions) |
| `bonus/` | the bonus-point system's documentation and database migrations |
| `wrangler.toml`, `.github/workflows/` | the deployment |
| `LESSONS.md` | the lessons per act, for instructors |
| `WALKTHROUGH.md` | the full solution |
| `LICENSE`, `CITATION.cff` | the license (CC BY-NC-ND 4.0) and how to cite the game |

Every push to `main` deploys `web/` and `functions/` to Cloudflare Pages (**lostcodebook.org**), and a mirror to
GitHub Pages (https://thomas-u-grund.github.io/MethodsGame/).
