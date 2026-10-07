// Course bonus points (ROADMAP 8-BONUS): the whole backend, as one Cloudflare Pages Function on
// lostcodebook.org/api/*. D1 database bound as DB. Secrets (Pages > Settings > Variables and secrets):
//   BREVO_API_KEY, SENDER_EMAIL, SENDER_NAME (optional), REPORT_SECRET, SUPPORT_URL (optional: a line in the results email).
// Without BREVO_API_KEY (local development) emails are printed to the log instead of sent.
//
//   POST /api/auth/request   {email}              email a 6-digit sign-in code
//   POST /api/auth/verify    {email, code}        -> session cookie
//   POST /api/auth/logout
//   GET  /api/me                                  who is signed in
//   GET  /api/courses                             my courses, with their claims
//   POST /api/courses        {...}                register a course
//   DELETE /api/courses/CODE                      delete a course and its claims
//   GET  /api/course/CODE                         public course info (game + claim page)
//   POST /api/claim          {code, act, key, number, name}
//   GET  /api/open-courses                        courses with an open deadline (the claim page's list)
//   POST /api/claim-end      {code, password, key, number, name}   claim from the game's last screen
//   POST /api/courses/CODE/password {password}    set or change a course's student password
//   POST /api/report         (x-report-secret)    email the results of passed deadlines (daily)
//   POST /api/stats          {s, v, e:[...]}       anonymous play statistics (STATS.md)
//   GET  /api/stats/export   (x-report-secret)    the events as CSV (?since=UNIX_SECONDS)
//   GET  /api/stats/summary  (x-report-secret)    counts for the admin page web/stats-admin.html (?since=UNIX_SECONDS)
//   GET  /api/health                              which settings are present (yes/no only)

const PASSWORD_FAILS_PER_HOUR = 200;   // enough to stop guessing; too many for a prank to lock a class out
const PW_MIN = 6;                       // each instructor sets their own (author, 2026-10-06)
const normPw = (s) => String(s ?? '').trim().toUpperCase().replace(/\s+/g, '');
const SESSION_DAYS = 7, CODE_MINUTES = 60, MAX_ATTEMPTS = 5, RESEND_SECONDS = 60;
const ACTS = ['1', '2', '3', '4', '5'];
const ACT_NAMES = { '1': 'Act I: The Question', '2': 'Act II: Theory', '3': 'Act III: Data',
  '4': 'Act IV: Evidence', '5': 'Act V: The Annual Meeting', end: 'the whole game' };

const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers } });
const fail = (error, status = 400) => json({ ok: false, error }, status);
const now = () => Math.floor(Date.now() / 1000);
const today = () => new Date().toISOString().slice(0, 10);
const clean = (s, n = 200) => String(s ?? '').trim().slice(0, n);
const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function hex(bytes) { return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join(''); }
function randomHex(n) { return hex(crypto.getRandomValues(new Uint8Array(n))); }
async function sha256(s) { return hex(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)))); }
function sixDigits() { const v = crypto.getRandomValues(new Uint32Array(1))[0] % 1000000; return String(v).padStart(6, '0'); }
function cookieOf(req, name) {
  const m = (req.headers.get('cookie') || '').match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)'));
  return m ? m[1] : null;
}
async function body(req) { try { return await req.json(); } catch { return {}; } }

async function sendMail(env, { to, name, subject, html, attachment }) {
  if (!env.BREVO_API_KEY || !env.SENDER_EMAIL) {
    // local development prints the email; the live site must not pretend it sent one
    if (env.DEV === '1') { console.log('[mail, not sent]', to, subject, html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')); return true; }
    console.error('mail not configured: BREVO_API_KEY / SENDER_EMAIL missing'); return false;
  }
  const r = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': env.BREVO_API_KEY, 'content-type': 'application/json' },
    body: JSON.stringify({
      sender: { email: env.SENDER_EMAIL, name: env.SENDER_NAME || 'The Lost Codebook' },
      to: [{ email: to, name: name || to }], subject, htmlContent: html,
      ...(attachment ? { attachment: [attachment] } : {}),
    }),
  });
  if (!r.ok) console.error('brevo', r.status, await r.text());
  return r.ok;
}

async function signedIn(req, env) {
  const tok = cookieOf(req, 'cb_session'); if (!tok) return null;
  const row = await env.DB.prepare('SELECT email FROM sessions WHERE token_hash = ? AND expires > ?').bind(await sha256(tok), now()).first();
  return row ? row.email : null;
}

// ---- instructor sign-in ------------------------------------------------------------------------
async function requestCode(req, env) {
  const email = clean((await body(req)).email, 200).toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return fail('Please enter a valid email address.');
  const prev = await env.DB.prepare('SELECT sent_at FROM login_codes WHERE email = ?').bind(email).first();
  if (prev && now() - prev.sent_at < RESEND_SECONDS) return fail('A code was just sent. Please wait a minute before asking again.', 429);
  const code = sixDigits();
  await env.DB.prepare('INSERT OR REPLACE INTO login_codes (email, code_hash, expires, attempts, sent_at) VALUES (?, ?, ?, 0, ?)')
    .bind(email, await sha256(email + ':' + code), now() + CODE_MINUTES * 60, now()).run();
  const ok = await sendMail(env, { to: email, subject: 'Your sign-in code: The Lost Codebook',
    html: `<div style="font-family:Georgia,serif;color:#222;max-width:520px"><h2 style="margin:0 0 12px">Your sign-in code</h2>
      <p>Type this code on the instructor page of <i>The Secret of the Lost Codebook</i>:</p>
      <p style="font:700 32px/1 'Courier New',monospace;letter-spacing:.3em;margin:18px 0">${code}</p>
      <p style="color:#777;font-size:13px">It works once and expires in one hour. If you did not ask for it, you can ignore this email.</p></div>` });
  if (!ok) return fail('The email could not be sent. Please try again later.', 502);
  return json({ ok: true, ...(env.DEV === '1' ? { devCode: code } : {}) });
}

async function verifyCode(req, env) {
  const b = await body(req), email = clean(b.email, 200).toLowerCase(), code = clean(b.code, 10);
  const row = await env.DB.prepare('SELECT * FROM login_codes WHERE email = ?').bind(email).first();
  if (!row || row.expires < now()) return fail('That code has expired. Ask for a new one.');
  if (row.attempts >= MAX_ATTEMPTS) return fail('Too many attempts. Ask for a new code.');
  if (row.code_hash !== await sha256(email + ':' + code)) {
    await env.DB.prepare('UPDATE login_codes SET attempts = attempts + 1 WHERE email = ?').bind(email).run();
    return fail('That code did not work.');
  }
  const token = randomHex(32);
  await env.DB.batch([
    env.DB.prepare('DELETE FROM login_codes WHERE email = ?').bind(email),
    env.DB.prepare('DELETE FROM sessions WHERE expires < ?').bind(now()),
    env.DB.prepare('INSERT INTO sessions (token_hash, email, expires) VALUES (?, ?, ?)').bind(await sha256(token), email, now() + SESSION_DAYS * 86400),
  ]);
  return json({ ok: true, email }, 200, {
    'set-cookie': `cb_session=${token}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_DAYS * 86400}` });
}

async function logout(req, env) {
  const tok = cookieOf(req, 'cb_session');
  if (tok) await env.DB.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await sha256(tok)).run();
  return json({ ok: true }, 200, { 'set-cookie': 'cb_session=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0' });
}

// ---- courses -----------------------------------------------------------------------------------
async function myCourses(email, env) {
  const cs = (await env.DB.prepare('SELECT * FROM courses WHERE owner_email = ? ORDER BY created_at DESC').bind(email).all()).results;
  const cl = cs.length ? (await env.DB.prepare(
    `SELECT course_id, act, student_number, student_name, created_at FROM claims WHERE course_id IN (${cs.map(() => '?').join(',')}) ORDER BY created_at`)
    .bind(...cs.map((c) => c.id)).all()).results : [];
  return json({ ok: true, courses: cs.map((c) => ({ ...c, deadlines: JSON.parse(c.deadlines), reported: JSON.parse(c.reported),
    claims: cl.filter((x) => x.course_id === c.id).map(({ course_id, ...x }) => x) })) });
}

async function createCourse(req, email, env) {
  const b = await body(req);
  const c = { instructor_name: clean(b.instructor_name), instructor_email: clean(b.instructor_email).toLowerCase(), university: clean(b.university),
    course_name: clean(b.course_name), country: clean(b.country, 80), term: clean(b.term, 80) || null, mode: b.mode === 'end' ? 'end' : 'acts',
    password: normPw(clean(b.password, 40)) };
  if (c.password.length < PW_MIN) return fail('Please set a student password of at least ' + PW_MIN + ' characters.');
  if (!c.instructor_name || !c.university || !c.course_name || !c.country) return fail('Please fill in your name, university, country and course.');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.instructor_email)) return fail('Please enter a valid email for the results.');
  const d = {}, keys = c.mode === 'acts' ? ACTS : ['end'];
  for (const k of keys) if (b.deadlines && isDate(b.deadlines[k])) d[k] = b.deadlines[k];
  if (!Object.keys(d).length) return fail(c.mode === 'acts' ? 'Set at least one act deadline.' : 'Set the deadline.');
  const code = randomHex(4).toUpperCase();
  await env.DB.prepare(`INSERT INTO courses (code, owner_email, instructor_name, instructor_email, university, course_name, country, term, mode, deadlines, password)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(code, email, c.instructor_name, c.instructor_email, c.university, c.course_name, c.country, c.term, c.mode, JSON.stringify(d), c.password).run();
  return json({ ok: true, code });
}

async function setPassword(req, code, email, env) {
  const pw = normPw(clean((await body(req)).password, 40));
  if (pw.length < PW_MIN) return fail('Please use at least ' + PW_MIN + ' characters.');
  const r = await env.DB.prepare('UPDATE courses SET password = ? WHERE code = ? AND owner_email = ?').bind(pw, code, email).run();
  if (!r.meta || !r.meta.changes) return fail('Not found.', 404);
  return json({ ok: true, password: pw });
}

async function deleteCourse(code, email, env) {
  const c = await env.DB.prepare('SELECT id FROM courses WHERE code = ? AND owner_email = ?').bind(code, email).first();
  if (!c) return fail('Not found.', 404);
  await env.DB.batch([env.DB.prepare('DELETE FROM claims WHERE course_id = ?').bind(c.id), env.DB.prepare('DELETE FROM courses WHERE id = ?').bind(c.id)]);
  return json({ ok: true });
}

async function publicCourse(code, env) {
  const c = await env.DB.prepare('SELECT code, course_name, university, instructor_name, term, mode, deadlines FROM courses WHERE code = ?').bind(code).first();
  if (!c) return fail('Unknown course link.', 404);
  return json({ ok: true, course: { ...c, deadlines: JSON.parse(c.deadlines) } });
}

// ---- the only way in for students ---------------------------------------------------------------
async function claim(req, env) {
  const b = await body(req), code = clean(b.code, 16).toUpperCase(), act = clean(b.act, 3), key = clean(b.key, 64),
    number = clean(b.number, 40), name = clean(b.name, 120);
  const c = await env.DB.prepare('SELECT * FROM courses WHERE code = ?').bind(code).first();
  if (!c) return fail('Unknown course link.');
  if (c.mode === 'end' && act !== 'end') return fail('This course awards the point at the end of the game only.');
  if (c.mode === 'acts' && !ACTS.includes(act)) return fail('Unknown act.');
  const dl = JSON.parse(c.deadlines)[act];
  if (!dl) return fail('No bonus point is set for this act.');
  if (today() > dl) return fail('The deadline for this claim has passed.');
  if (!/^[0-9a-f]{32}$/.test(key)) return fail('This claim link is incomplete. Open it again from the game.');
  if (number.length < 2 || name.length < 2) return fail('Please enter your student number and your name.');
  try {
    await env.DB.prepare('INSERT INTO claims (course_id, act, student_number, student_name, claim_key) VALUES (?, ?, ?, ?, ?)')
      .bind(c.id, act, number, name, key).run();
  } catch (e) {
    if (/UNIQUE/i.test(String(e))) return fail('This point has already been claimed (by this student number, or with this claim link).');
    throw e;
  }
  return json({ ok: true });
}

// ---- claiming from the game's last screen: pick a course, type its password -------------------------
async function openCourses(env) {
  const all = (await env.DB.prepare("SELECT code, course_name, university, term, mode, deadlines FROM courses WHERE password IS NOT NULL AND password != '' ORDER BY university, course_name").all()).results;
  const t = today();
  return json({ ok: true, courses: all.filter((c) => Object.values(JSON.parse(c.deadlines)).some((d) => d >= t))
    .map(({ deadlines, ...c }) => c) });
}

async function claimEnd(req, env) {
  const b = await body(req), code = clean(b.code, 16).toUpperCase(), key = clean(b.key, 64),
    number = clean(b.number, 40), name = clean(b.name, 120), pw = normPw(clean(b.password, 40));
  const c = await env.DB.prepare('SELECT * FROM courses WHERE code = ?').bind(code).first();
  if (!c) return fail('Please choose your course from the list.');
  const hour = now() - 3600;
  const tries = await env.DB.prepare('SELECT COUNT(*) n FROM password_fails WHERE course_id = ? AND at > ?').bind(c.id, hour).first();
  if (tries && tries.n >= PASSWORD_FAILS_PER_HOUR) return fail('Too many wrong passwords for this course. Please try again in an hour.', 429);
  if (!c.password || pw !== c.password) {
    await env.DB.batch([env.DB.prepare('INSERT INTO password_fails (course_id, at) VALUES (?, ?)').bind(c.id, now()),
      env.DB.prepare('DELETE FROM password_fails WHERE at < ?').bind(hour)]);
    return fail('That is not the password for this course. Ask your instructor for it.');
  }
  if (!/^[0-9a-f]{32}$/.test(key)) return fail('This claim link is incomplete. Open it again from the end of the game.');
  if (number.length < 2 || name.length < 2) return fail('Please enter your student number and your name.');
  // finishing the game earns the end point, or, per act, every act whose deadline is still open
  const t = today(), dl = JSON.parse(c.deadlines);
  const acts = (c.mode === 'end' ? ['end'] : ACTS).filter((a) => dl[a] && dl[a] >= t);
  if (!acts.length) return fail('The deadline for this course has passed.');
  const got = [], had = [];
  for (const a of acts) {
    try {
      await env.DB.prepare('INSERT INTO claims (course_id, act, student_number, student_name, claim_key) VALUES (?, ?, ?, ?, ?)').bind(c.id, a, number, name, key).run();
      got.push(a);
    } catch (e) { if (/UNIQUE/i.test(String(e))) had.push(a); else throw e; }
  }
  if (!got.length) return fail('These points have already been claimed (by this student number, or from this device).');
  return json({ ok: true, acts: got.map((a) => ACT_NAMES[a] || a), already: had.map((a) => ACT_NAMES[a] || a), course: c.course_name });
}

// ---- daily: email the results of every deadline that has passed ---------------------------------
async function report(req, env) {
  if (!env.REPORT_SECRET || req.headers.get('x-report-secret') !== env.REPORT_SECRET) return fail('Forbidden.', 403);
  try { await env.DB.prepare('DELETE FROM play_events WHERE at < ?').bind(now() - 365 * 86400).run(); } catch (e) { /* the table may not exist yet */ }
  const courses = (await env.DB.prepare('SELECT * FROM courses').all()).results, sent = [];
  for (const c of courses) {
    const deadlines = JSON.parse(c.deadlines), reported = JSON.parse(c.reported);
    for (const [act, date] of Object.entries(deadlines)) {
      if (!date || date >= today() || reported[act]) continue;
      const rows = (await env.DB.prepare('SELECT student_number, student_name, created_at FROM claims WHERE course_id = ? AND act = ? ORDER BY student_number')
        .bind(c.id, act).all()).results;
      const cell = 'padding:6px 12px;border-bottom:1px solid #eee';
      const html = `<div style="font-family:Georgia,serif;color:#222;max-width:640px">
        <h2 style="margin:0 0 4px">The Secret of the Lost Codebook: bonus points</h2>
        <p style="margin:0 0 16px;color:#555">${esc(c.course_name)} &middot; ${esc(c.university)}${c.term ? ' &middot; ' + esc(c.term) : ''}</p>
        <p>The claim deadline for <b>${ACT_NAMES[act] || act}</b> passed on ${date}. <b>${rows.length}</b> student${rows.length === 1 ? '' : 's'} claimed a point.</p>
        ${rows.length ? `<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
          <tr style="background:#f3efe6"><th align="left" style="padding:6px 12px">Student number</th><th align="left" style="padding:6px 12px">Name</th><th align="left" style="padding:6px 12px">Claimed (UTC)</th></tr>
          ${rows.map((r) => `<tr><td style="${cell}">${esc(r.student_number)}</td><td style="${cell}">${esc(r.student_name)}</td><td style="${cell};color:#666">${esc(r.created_at.slice(0, 16))}</td></tr>`).join('')}</table>` : ''}
        <p style="color:#777;font-size:13px;margin-top:20px">The same list is attached as a CSV file. Each point can be claimed once per student number and once per game device.</p>
        ${env.SUPPORT_URL ? `<p style="color:#999;font-size:12px;margin-top:18px">The game is free and made in spare time. If it is useful for your course, you can support it: <a href="${esc(env.SUPPORT_URL)}">${esc(env.SUPPORT_URL.replace(/^https?:\/\/(www\.)?/, ''))}</a></p>` : ''}</div>`;
      const q = (s) => '"' + String(s).replace(/"/g, '""') + '"';
      const csv = 'student_number,student_name,claimed_utc\n' + rows.map((r) => [r.student_number, r.student_name, r.created_at].map(q).join(',')).join('\n');
      const ok = await sendMail(env, { to: c.instructor_email, name: c.instructor_name,
        subject: `Bonus points: ${c.course_name}, ${ACT_NAMES[act] || act} (${rows.length})`, html,
        attachment: { name: `bonus-${c.code}-${act}.csv`, content: btoa(unescape(encodeURIComponent(csv))) } });
      if (!ok) continue;
      reported[act] = new Date().toISOString();
      await env.DB.prepare('UPDATE courses SET reported = ? WHERE id = ?').bind(JSON.stringify(reported), c.id).run();
      sent.push(`${c.code}/${act}`);
    }
  }
  return json({ ok: true, sent });
}

// Anonymous play statistics (STATS.md): no cookies, no IP, no link to claims or courses.
const STAT_KINDS = new Set(['start', 'enter', 'map', 'flag', 'hs', 'choice', 'hint', 'recap', 'end', 'hide', 'show']);
async function stats(req, env) {
  const raw = await req.text();
  if (raw.length > 32000) return fail('Too large.', 413);
  let d; try { d = JSON.parse(raw); } catch { return fail('Bad request.'); }
  if (!d || !/^[0-9a-f]{16}$/.test(d.s || '') || !Array.isArray(d.e)) return fail('Bad request.');
  const at = now(), rows = [];
  for (const e of d.e.slice(0, 60)) {
    if (!e || !STAT_KINDS.has(e.k)) continue;
    const t = Number.isFinite(e.t) ? Math.max(0, Math.min(Math.trunc(e.t), 864e5)) : 0;
    rows.push(env.DB.prepare('INSERT INTO play_events (session, at, t, kind, a, b, c) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .bind(d.s, at, t, e.k, clean(e.a, 60), clean(e.b, 120), clean(e.c, 300)));
  }
  if (rows.length) await env.DB.batch(rows);
  return new Response(null, { status: 204 });
}
async function statsExport(req, env) {
  if (!env.REPORT_SECRET || req.headers.get('x-report-secret') !== env.REPORT_SECRET) return fail('Not allowed.', 403);
  const since = parseInt(new URL(req.url).searchParams.get('since') || '0', 10) || 0;
  const { results } = await env.DB.prepare('SELECT session, at, t, kind, a, b, c FROM play_events WHERE at >= ? ORDER BY session, t LIMIT 200000').bind(since).all();
  const q = (v) => '"' + String(v ?? '').replace(/"/g, '""') + '"';
  const csv = 'session,at,t_ms,kind,a,b,c\n' + results.map((r) => [r.session, r.at, r.t, r.kind, r.a, r.b, r.c].map(q).join(',')).join('\n');
  return new Response(csv, { headers: { 'content-type': 'text/csv; charset=utf-8', 'cache-control': 'no-store' } });
}

async function statsSummary(req, env) {
  if (!env.REPORT_SECRET || req.headers.get('x-report-secret') !== env.REPORT_SECRET) return fail('Not allowed.', 403);
  const since = parseInt(new URL(req.url).searchParams.get('since') || '0', 10) || 0;
  const all = async (sql) => (await env.DB.prepare(sql).bind(since).all()).results;
  const [sessions, byDay, rooms, hints, flags, ends, hs] = await Promise.all([
    all("SELECT COUNT(DISTINCT session) n, COUNT(*) events FROM play_events WHERE at >= ?"),
    all("SELECT date(at,'unixepoch') day, COUNT(DISTINCT session) n FROM play_events WHERE kind='start' AND at >= ? GROUP BY day ORDER BY day DESC LIMIT 60"),
    all("SELECT a room, COUNT(DISTINCT session) players, ROUND(AVG(CAST(b AS REAL))) avg_seconds FROM play_events WHERE kind='map' AND at >= ? GROUP BY a ORDER BY players DESC LIMIT 60"),
    all("SELECT b room, COUNT(*) n, COUNT(DISTINCT session) players FROM play_events WHERE kind='hint' AND at >= ? GROUP BY b ORDER BY n DESC LIMIT 30"),
    all("SELECT a flag, COUNT(DISTINCT session) players FROM play_events WHERE kind='flag' AND at >= ? GROUP BY a ORDER BY players DESC LIMIT 200"),
    all("SELECT kind, COUNT(DISTINCT session) players FROM play_events WHERE kind IN ('recap','end') AND at >= ? GROUP BY kind"),
    all("SELECT a room, b thing, COUNT(*) n FROM play_events WHERE kind='hs' AND at >= ? GROUP BY a, b ORDER BY n DESC LIMIT 40"),
  ]);
  return json({ ok: true, sessions: sessions[0], byDay, rooms, hints, flags, ends, hs });
}

export async function onRequest({ request: req, env, params }) {
  const path = (params.path || []).join('/'), m = req.method;
  try {
    if (m === 'POST' && path === 'auth/request') return await requestCode(req, env);
    if (m === 'POST' && path === 'auth/verify') return await verifyCode(req, env);
    if (m === 'POST' && path === 'auth/logout') return await logout(req, env);
    if (m === 'GET' && path.startsWith('course/')) return await publicCourse(clean(path.slice(7), 16).toUpperCase(), env);
    if (m === 'POST' && path === 'claim') return await claim(req, env);
    if (m === 'GET' && path === 'open-courses') return await openCourses(env);
    if (m === 'POST' && path === 'claim-end') return await claimEnd(req, env);
    if (m === 'POST' && path === 'report') return await report(req, env);
    if (m === 'POST' && path === 'stats') return await stats(req, env);
    if (m === 'GET' && path === 'stats/summary') return await statsSummary(req, env);
    if (m === 'GET' && path === 'stats/export') return await statsExport(req, env);
    // which settings are present (never their values), for checking a deployment
    if (m === 'GET' && path === 'health') return json({ ok: true, db: !!(await env.DB.prepare('SELECT 1 AS x').first()),
      mail: !!(env.BREVO_API_KEY && env.SENDER_EMAIL), sender: env.SENDER_EMAIL ? env.SENDER_EMAIL.replace(/^[^@]+/, '…') : null, report: !!env.REPORT_SECRET });
    const email = await signedIn(req, env);
    if (m === 'GET' && path === 'me') return json({ ok: true, email });
    if (!email) return fail('Please sign in.', 401);
    if (m === 'GET' && path === 'courses') return await myCourses(email, env);
    if (m === 'POST' && path === 'courses') return await createCourse(req, email, env);
    if (m === 'POST' && /^courses\/[A-Za-z0-9]+\/password$/.test(path)) return await setPassword(req, clean(path.split('/')[1], 16).toUpperCase(), email, env);
    if (m === 'DELETE' && path.startsWith('courses/')) return await deleteCourse(clean(path.slice(8), 16).toUpperCase(), email, env);
    return fail('Not found.', 404);
  } catch (e) {
    console.error(e);
    return fail('Something went wrong on our side. Please try again in a minute.', 500);
  }
}
