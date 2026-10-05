-- Anonymous play statistics (STATS.md). No names, no emails, no IP addresses, no link to claims.
-- `session` is a random id made in the browser's memory for one page load; it is never stored on the device.
CREATE TABLE IF NOT EXISTS play_events (
  id      INTEGER PRIMARY KEY,
  session TEXT NOT NULL,                  -- 16 hex characters, one per page load
  at      INTEGER NOT NULL,               -- server time, unix seconds
  t       INTEGER NOT NULL,               -- milliseconds since the page loaded (client clock, for ordering)
  kind    TEXT NOT NULL,                  -- start | enter | map | flag | hs | choice | hint | recap | end | hide | show
  a       TEXT,
  b       TEXT,
  c       TEXT
);
CREATE INDEX IF NOT EXISTS play_events_session ON play_events(session, t);
CREATE INDEX IF NOT EXISTS play_events_kind ON play_events(kind, a);
