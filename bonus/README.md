# Course bonus points: setup

Instructors register a course at `…/MethodsGame/bonus/teach.html` and get a course link to the game.
Students who play through that link see **Claim your bonus point** on the campus map after each act (or
once at the end) and claim at `…/bonus/claim.html` with their student number and name. When a deadline
passes, the instructor gets the list by email (table + CSV). Off by default: while `web/bonus/config.js`
is empty, nothing appears anywhere.

| Part | Where |
|---|---|
| Database, rules, the claim function | `supabase/migrations/20260929120000_bonus.sql` |
| Daily results email | `supabase/functions/deadline-report/index.ts` |
| Instructor login by emailed 6-digit code, via Brevo | `supabase/config.toml`, `supabase/templates/code.html` |
| Instructor and claim pages | `web/bonus/teach.html`, `web/bonus/claim.html` |
| Game side (course link, claim button) | `web/bonus/game.js`, switched on by `web/bonus/config.js` |

## What you do (accounts and terms are yours to accept)

1. **Supabase**: create an account at supabase.com and a new project. **Region: Central EU (Frankfurt).**
   Note the database password you choose. From *Project Settings → API* copy the **Project URL** and the
   **anon public** key; from the URL, the **project ref** (the `abcdefghijkl` in `https://abcdefghijkl.supabase.co`).
2. **Brevo**: create an account at brevo.com. Under *Senders, Domains & Dedicated IPs* add and verify the
   sender address the emails should come from. Under *SMTP & API*: create an **API key**, and note the
   **SMTP login** and create an **SMTP key**.
3. In this terminal, log the CLI in (it opens your browser): `! supabase login`

Then give Claude the project ref, URL, anon key, database password and the Brevo values (or put them
in `bonus/.env`, see `.env.example`), and it runs the rest.

## What gets run (by Claude, or by you)

```sh
cd bonus
supabase link --project-ref <ref>                  # asks for the database password
supabase db push                                   # tables, rules, claim function
set -a; source .env; set +a; supabase config push  # login-code email, Brevo SMTP, site URL
supabase functions deploy deadline-report
supabase secrets set --env-file .env               # BREVO_API_KEY, SENDER_EMAIL, SENDER_NAME, CRON_SECRET
```

Then the daily schedule, in *SQL Editor* (replace `<ref>` and `<CRON_SECRET>`):

```sql
create extension if not exists pg_cron; create extension if not exists pg_net;
select cron.schedule('bonus-deadline-report', '0 6 * * *', $$
  select net.http_post(url := 'https://<ref>.supabase.co/functions/v1/deadline-report',
                       headers := '{"x-cron-secret": "<CRON_SECRET>"}'::jsonb) $$);
```

Finally fill in `web/bonus/config.js` (URL and anon key; both are public by design) and push.

## How "once" is enforced

- The database accepts one claim per **student number per act per course**, and one per **claim key**.
- The game makes the key on the device when the act is finished (random, 128 bits), so a claim link
  cannot be guessed, and the same link cannot be used twice.
- Honest limit: this is bonus points, not an exam. A student could claim without playing if a classmate
  shares their link, but only once per student number, and the instructor sees every name.

## Data kept

Course details (instructor name, email, university, course, country, term, deadlines) and, per claim,
student number, name, act and time. Instructors can delete a course and all its claims on their page.
