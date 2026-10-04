-- Course bonus points (ROADMAP 8-BONUS), Cloudflare D1. Applied by the deploy workflow
-- (`wrangler d1 migrations apply lostcodebook --remote`); every rule is enforced in functions/api.

CREATE TABLE IF NOT EXISTS courses (
  id               INTEGER PRIMARY KEY,
  code             TEXT UNIQUE NOT NULL,              -- the course link: lostcodebook.org/?course=CODE
  owner_email      TEXT NOT NULL,                     -- the signed-in instructor
  instructor_name  TEXT NOT NULL,
  instructor_email TEXT NOT NULL,                     -- where the results go
  university       TEXT NOT NULL,
  course_name      TEXT NOT NULL,
  country          TEXT NOT NULL,
  term             TEXT,
  mode             TEXT NOT NULL CHECK (mode IN ('acts', 'end')),
  deadlines        TEXT NOT NULL,                     -- JSON: {"1":"2026-11-01",...} or {"end":"2027-01-31"}
  reported         TEXT NOT NULL DEFAULT '{}',        -- JSON: deadlines already emailed
  created_at       TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS courses_owner ON courses(owner_email);

CREATE TABLE IF NOT EXISTS claims (
  id             INTEGER PRIMARY KEY,
  course_id      INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  act            TEXT NOT NULL,                       -- '1'..'5' or 'end'
  student_number TEXT NOT NULL,
  student_name   TEXT NOT NULL,
  claim_key      TEXT NOT NULL,                       -- one-time key made by the game on that device
  created_at     TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (course_id, act, student_number),            -- one claim per student per act
  UNIQUE (course_id, act, claim_key)                  -- one claim per key
);

-- instructor sign-in: a 6-digit code by email, then a session cookie
CREATE TABLE IF NOT EXISTS login_codes (
  email     TEXT PRIMARY KEY,
  code_hash TEXT NOT NULL,
  expires   INTEGER NOT NULL,                         -- unix seconds
  attempts  INTEGER NOT NULL DEFAULT 0,
  sent_at   INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  email      TEXT NOT NULL,
  expires    INTEGER NOT NULL
);
