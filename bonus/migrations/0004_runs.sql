-- The completion code (author, 2026-10-07): a game being played is a random play id with a checkpoint per finished
-- act; at the end it gets a code, which a claim can use once. Nothing here says whose game it is.
CREATE TABLE IF NOT EXISTS runs (
  id       TEXT PRIMARY KEY,                -- sha256 of the play id kept on the device
  created  INTEGER NOT NULL,                -- unix seconds
  acts     TEXT NOT NULL DEFAULT '{}',      -- JSON: {"1": unix seconds, ...} when each act was reported finished
  code     TEXT UNIQUE,                     -- the completion code, once issued
  used_at  INTEGER                          -- when a claim used it (once only)
);
CREATE INDEX IF NOT EXISTS runs_created ON runs(created);
