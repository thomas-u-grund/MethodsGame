# Course bonus points

Instructors register a course at **lostcodebook.org/teach** and get a course link to the game
(`lostcodebook.org/?course=CODE`). Students who play through that link see **Claim your bonus point** on
the campus map after each act (or once, at the end) and claim with their student number and name.
The day after each deadline, the instructor gets the list by email (a table plus a CSV file).
Off while `enabled: false` in `web/bonus/config.js`: nothing appears anywhere.

**Claiming from the end of the game (2026-10-06).** The game's last card has **Claim your bonus points**, for
students who did not come through a course link. It opens `bonus/claim.html?from=end&key=…`, which lists the
courses with an open deadline (`GET /api/open-courses`); the student picks theirs, types the **course password**
and their student number (Matrikelnummer) and name (`POST /api/claim-end`). An end-of-game course records `end`;
a per-act course records every act whose deadline is still open and that this student number has not claimed.
Each instructor sets their own course password: required when registering, and set or changed on the
course's card at /teach (`POST /api/courses/CODE/password`; `bonus/migrations/0003_course_password.sql`). A course
without one (registered before 2026-10-06) is not listed until its instructor sets one; its course link works as
before. Capitals, spaces and dashes do not count. Wrong passwords are limited to 200 an hour per course.

**The completion code (2026-10-07).** A claim from the last screen also needs the game's **completion code**, and each
code works once, so a copied claim page or a classmate's code is refused. `web/bonus/run.js` gets a random play id
from the server (`POST /api/run`) and reports each finished act (`/api/run/checkpoint`, read off the save every few
seconds). At the end, `/api/run/code` issues a code (like `K7QM-3XPA`) only if the play id reached Act V *and* an
earlier act was reported at least `RUN_MIN_MINUTES` (default 10) before it. The claim marks the code used; if the
student number had already claimed, the code is given back. Table `runs` (`bonus/migrations/0004_runs.sql`); the
daily job deletes unfinished games after 90 days and all after a year. Honest limit: someone who scripts the API
calls and waits can still mint a code; a copied link or code cannot.

Everything runs on the Cloudflare Pages project that serves the game:

| Part | Where |
|---|---|
| Database (Cloudflare D1, `lostcodebook`) | `bonus/migrations/`, bound as `DB` in `wrangler.toml` |
| API: instructor sign-in by emailed 6-digit code, courses, claims, reports | `functions/api/[[path]].js` → `lostcodebook.org/api/…` |
| Instructor and claim pages | `web/bonus/teach.html`, `web/bonus/claim.html` (`/teach`, `/claim`) |
| Game side (course link, claim button) | `web/bonus/game.js`, switched on in `web/bonus/config.js` |
| Deploy (database migrations, then the site) | `.github/workflows/cloudflare.yml` |
| Daily results email, 06:00 UTC | `.github/workflows/bonus-report.yml` → `POST /api/report` |
| Emails (sign-in codes, results) | Brevo API |

## Switching it on

1. **Database.** Cloudflare → *Storage & Databases → D1 SQL Database → Create* → name `lostcodebook`
   (location: Western Europe). Copy the **Database ID** into `wrangler.toml` (`database_id`).
2. **Token permission.** Cloudflare → *My Profile → API Tokens* → edit the deploy token → add
   **Account → D1 → Edit** (next to Cloudflare Pages → Edit). The token value stays the same.
3. **Brevo.** Create an account; verify the sender address (*Senders, Domains & Dedicated IPs*);
   create an API key (*SMTP & API → API Keys*).
4. **Secrets in Cloudflare** (*Workers & Pages → lostcodebook → Settings → Variables and Secrets*,
   type *Secret*, Production): `BREVO_API_KEY`, `SENDER_EMAIL` (the verified sender), `SENDER_NAME`
   (optional), `REPORT_SECRET` (any long random string).
5. **The same report secret in GitHub**: repo *Settings → Secrets and variables → Actions* →
   `BONUS_REPORT_SECRET`.
6. Set `enabled: true` in `web/bonus/config.js` and push. The deploy creates the tables.

## Local development

```sh
npx wrangler@3 d1 migrations apply lostcodebook --local
npx wrangler@3 pages dev --port 8788 --binding DEV=1 --binding REPORT_SECRET=dev
```

With `DEV=1` and no Brevo key, emails are printed to the log and the sign-in page shows the code.
(Set `enabled: true` in `config.js` while testing, or override `window.CB_BONUS` in the browser.)

## How "once" is enforced

- The database accepts one claim per **student number per act per course**, and one per **claim key**.
- The game makes the key on the device when the act is finished (random, 128 bits), so claim links
  cannot be guessed and one link cannot be used twice.
- Honest limit: this is bonus points, not an exam. A student could claim without playing if a classmate
  shares a claim link, but only once per student number, and the instructor sees every name.

## Instructor sign-in

A 6-digit code by email (valid one hour, five tries, one per minute), then a session cookie
(HttpOnly, Secure, 7 days). Instructors see and delete only their own courses.

## Data kept

Course details (instructor name, email, university, course, country, term, deadlines) and, per claim,
student number, name, act and time. Instructors can delete a course and all its claims on their page.
