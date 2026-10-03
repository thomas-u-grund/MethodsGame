# Publishing the game: DOI and papers

*Plan to pick up later. Drafted 2026-10-03. Nothing here has been done yet.*

The goal is to make *The Secret of the Lost Codebook* citable, and later to publish about it. There are three
steps, each building on the one before:

| Step | What | Effort | Output |
|---|---|---|---|
| 1 | License + Zenodo archive of a `v1.0` release | an afternoon | a DOI for the game |
| 2 | Short software paper in JOSE | a few days of writing, then open review | a peer-reviewed, citable article |
| 3 | Teaching article with evidence of learning | a term of data plus writing | a full journal article |

---

## Step 1: a DOI through Zenodo

### Needed from the author

- [ ] **ORCID** (for `CITATION.cff`, Zenodo and JOSE).
- [ ] **Affiliation**, as it should appear.
- [ ] **A yes on the licenses** (proposed below).
- [ ] **A decision on the asset questions** in "Rights check" (below). They must be settled *before* the
  first archive, because a Zenodo record is permanent and public.

### Licenses (proposed)

The repo is public but has **no license**, which legally means "all rights reserved". Zenodo and JOSE both
need one. The proposal is two licenses:

| Part | License | Why |
|---|---|---|
| Code (the HTML/JS engine, `tools/`, `functions/`) | **MIT** | the simplest permissive license; JOSE needs an OSI license on the software |
| Text, art, audio, voices (story, dialogue, images, music, narration) | **CC BY 4.0** | anyone may reuse it in teaching, with credit |

Files to add:
- `LICENSE` (MIT);
- `LICENSE-ASSETS.md` (CC BY 4.0, plus a list of what it covers and of the third-party exceptions);
- a "License" section in `README.md`.

### Steps

1. Add the license files. Update `CITATION.cff`: ORCID, affiliation, `version: 1.0.0`, `license`, and later the
   `doi`.
2. At zenodo.org: log in with GitHub, then switch on `thomas-u-grund/MethodsGame` under *GitHub*.
3. On GitHub: create release `v1.0.0` ("The Secret of the Lost Codebook, first full release"). Zenodo archives
   that exact version and issues a DOI.
4. Zenodo issues two DOIs: one for this version, and a **concept DOI** that always points to the latest
   version. Put the concept DOI into `CITATION.cff`, the README badge and the game's credits /
   lostcodebook.org/teach.
5. Every later release (e.g. `v1.1`) gets its own version DOI automatically.

**Size check.** Zenodo allows up to 50 GB per record, and the repo is far below that. Large build files
(`build/`, `node_modules/`, `godot-prototype/`) are not in git and so are not archived. Check that nothing
private is in git history before the first release (see below).

---

## Rights check (before anything is archived)

| Asset | Status | To do |
|---|---|---|
| **Images** (ChatGPT / GPT image generation) | OpenAI's terms assign the output to the user | state in the paper and in `LICENSE-ASSETS.md` that the art is AI-generated |
| **Music made with Suno** (title theme, battle music, the reveal song, credits, trailer track) | owned by the author **only if made on a paid plan**; on the free plan Suno keeps ownership and allows non-commercial use only | check which plan each track was made on; if any was free-tier, either regenerate it on a paid plan or exclude it from CC BY and say so |
| **Sound effects (Mixkit)** | the Mixkit license allows use inside a project, but not passing the raw files on as a collection | probably fine inside the game; read the license for "redistribution in an open archive". If in doubt, list them as an exception to CC BY |
| **Voices** (Chatterbox TTS, cloned from LibriVox reference recordings) | the LibriVox recordings are public domain | name it plainly in the paper and the credits: *"voices synthesised with Chatterbox from public-domain LibriVox recordings"*. Cloning a real reader's voice is an ethical point a reviewer may raise; one honest sentence covers it |
| **Author's own voice and recordings** | the author's | — |
| **Real people as characters** | sociologist cameos: Durkheim, Weber, Bourdieu, Becker, Latour, Merton, Coleman, Goffman and Granovetter. **Granovetter is alive** | affectionate parody of public academic figures; probably fine. A disclaimer line in the credits does no harm |
| **The Brevo screenshot** (`Screenshot 2026-09-29 at 17.00.00.png`, untracked) | shows most of an API key | **never commit it.** Before release, run `git log --all -- '*Screenshot*'` to confirm it was never committed, and check the whole history for secrets (`git log -p \| grep -i -E "api[_-]?key\|secret\|token"`) |
| **Fonts** | Google Fonts (Fraunces, JetBrains Mono and others): SIL Open Font License | fine; list them |
| **Third-party JS** | none bundled, as far as is known | confirm |

---

## Step 2: a software paper in JOSE

**JOSE** (*Journal of Open Source Education*, jose.theoj.org): open peer review on GitHub, free, open access,
and each paper gets a DOI. It publishes **open-source learning modules and educational software**, which fits
this game well.

### What JOSE needs

- The software is open (OSI license), in a public repo, with a release archived (step 1).
- A `paper.md` of roughly **1,000 words** plus `paper.bib`, with sections:
  - **Summary**;
  - **Statement of need**: who it is for and what gap it fills;
  - **Learning objectives**, **instructional design** and **experience of use**;
  - **References**.
- Documentation good enough for an instructor to adopt it: `README.md` and the teach page.

### Draft outline of `paper.md`

**Title:** *The Secret of the Lost Codebook: a point-and-click adventure for teaching research methods*

1. **Summary.**
   - A free browser game in the LucasArts tradition, in five acts.
   - Each act is one stage of a research project: the question, theory, data, evidence, and presenting.
   - The player turns one research question into a submitted paper.
   - It runs on phones and computers, is fully voiced, and offers course bonus codes per act.
2. **Statement of need.**
   - Methods courses are where students disengage most; textbook exercises teach procedures, not judgement.
   - Existing games for methods teaching are mostly quizzes or simulations.
   - This game teaches by consequence: the tempting wrong choice is allowed, stamped and paid for later
     (p-hacking, overclaiming, an empty theory).
3. **Learning objectives.** Taken from `LESSONS.md`, one line per act: falsifiability and precise questions;
   theory as a mechanism and a sealed prediction; consent, measurement and sampling; checking an analysis
   and not p-hacking; claims proportional to evidence.
4. **Instructional design.**
   - "Every institution is ridiculous and also right."
   - One quest object (the folder).
   - Wrong branches as teaching moments.
   - A "what you learned" card per act.
   - Mini-games, among them lecture bingo, the Founders' rap battle and KIRA's corrections.
5. **Experience of use.**
   - Used in [course, term, n students]; bonus points per act.
   - Informal feedback, or the evaluation from step 3 if it is ready.
   - How an instructor adopts it: link, teach page, codes.
6. **Implementation.**
   - A single HTML file, no build step.
   - Hosted on Cloudflare Pages and GitHub Pages.
   - AI tools were used for the art (GPT image), the voices (Chatterbox, from public-domain recordings), the
     music (Suno) and the code (Claude Code). State this plainly, since JOSE and reviewers will ask.
7. **Acknowledgements and references:** Popper (falsification), Fisher, Simmons, Nelson and Simonsohn (false
   positive psychology), Gelman and Loken (forking paths), the game-based-learning literature (e.g. Gee;
   Plass, Homer and Kinzer), and earlier methods-teaching games.

### Steps

1. Write `paper/paper.md` and `paper/paper.bib` in the repo. Check them with the Open Journals draft action
   (`openjournals/openjournals-draft-action`), which builds the PDF on GitHub.
2. Submit at jose.theoj.org with the repo URL and the Zenodo DOI.
3. Open review on GitHub (usually 1–3 months). Reviewers file issues; fix them and make a new release.

---

## Step 3: a teaching article with evidence

This is the bigger paper: **does the game help students learn methods?** It needs data from a real course,
so **plan it before the term's teaching starts.**

### Candidate journals

| Journal | Fit |
|---|---|
| ***Teaching Sociology*** (SAGE / ASA) | the natural home: sociology methods teaching, with evidence of learning |
| ***Simulation & Gaming*** (SAGE) | game-based learning; the design itself is of interest |
| ***Journal of Statistics and Data Science Education*** | better for the companion statistics game |
| ***Methodological Innovations*** / ***International Journal of Social Research Methodology*** | methods teaching innovations |
| ***Social Science Computer Review*** | digital tools in the social sciences |

### Study design (draft)

- **Question.** Do students who play the game understand key methods concepts better, and do they enjoy the
  course more?
- **Design options**, from easiest to strongest:
  1. **Before/after** in one course: a short concept quiz at the start of term and after the game, plus a
     survey on engagement and perceived learning. Easy, but there is no comparison group.
  2. **Comparison with a previous cohort** that had the same exam questions without the game. Watch for
     selection, since cohorts differ (the Visiting Fellow would ask).
  3. **Randomised order**: half the seminar groups play an act before the lecture on its topic and half after,
     then swap. Each group serves as the other's comparison.
- **Measures.**
  - A concept quiz built from the lesson cards (10–15 items, e.g. "one black swan", "correlation is not
    causation", "the p-hacked lever");
  - the relevant exam questions;
  - an engagement survey;
  - **act completion from the bonus-point system** (`functions/`, the D1 database). These records hold
    personal data and need consent.
- **Ethics.** Get approval **before** collecting anything. This means informed consent, voluntary
  participation, no effect on grades from taking part (the bonus points must not depend on joining the study),
  and pseudonymous IDs. (Yes, this is Act III.)
- **Pre-registration.** On OSF, before the data come in. The game itself argues for sealing your prediction.

### Timeline (to fill in)

| When | What |
|---|---|
| | ethics application |
| | quiz and survey built; pre-registration on OSF |
| | data collection during the course |
| | analysis, writing, submission |

---

## The companion game (later)

Once the statistics companion (`companion/outline.md`) exists, it can follow the same path: its own Zenodo
DOI, its own JOSE paper, and a *Journal of Statistics and Data Science Education* article with an evaluation.
The two games could also be one paper on "teaching methods through consequence".

---

## Checklist

- [ ] ORCID, affiliation, license decision
- [ ] Rights check: Suno plan per track, the Mixkit license text, git history free of secrets
- [ ] `LICENSE`, `LICENSE-ASSETS.md`, README license section, credits line on AI tools and voices
- [ ] `CITATION.cff` updated
- [ ] Zenodo connected; release `v1.0.0`; DOI into `CITATION.cff`, README and teach page
- [ ] `paper/paper.md` + `paper.bib` drafted; draft PDF builds
- [ ] JOSE submission
- [ ] Ethics application for the evaluation study; OSF pre-registration
