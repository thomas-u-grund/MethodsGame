-- Claiming from the game's last screen (author, 2026-10-06): students pick their course from a list and type the
-- course password. Each instructor sets their own (author: "each instructor sets own course password"); a course
-- without one is not listed there until its instructor sets it on /teach.
ALTER TABLE courses ADD COLUMN password TEXT;

-- wrong passwords per course, to stop guessing (200 an hour, see PASSWORD_FAILS_PER_HOUR)
CREATE TABLE IF NOT EXISTS password_fails (
  course_id INTEGER NOT NULL,
  at        INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS password_fails_course ON password_fails(course_id, at);
