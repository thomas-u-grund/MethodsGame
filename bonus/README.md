# Course bonus points

Instructors register a course at **lostcodebook.org/teach** and get a course link to the game
(`lostcodebook.org/?course=CODE`). Students who play through that link see **Claim your bonus point** on
the campus map after each act (or once, at the end) and claim with their student number and name.
The day after each deadline, the instructor gets the list by email (a table plus a CSV file).
Off while `enabled: false` in `web/bonus/config.js`: nothing appears anywhere.

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
