// Supabase Edge Function "deadline-report" (ROADMAP 8-BONUS). Runs once a day (see BONUS-SETUP.md).
// For every deadline that has passed and has not been reported yet, it emails the instructor a table
// of the claims (and the same as a CSV attachment) through Brevo, then marks the deadline reported.
// Secrets: BREVO_API_KEY, SENDER_EMAIL (a sender verified in Brevo), SENDER_NAME (optional), CRON_SECRET.
import { createClient } from 'npm:@supabase/supabase-js@2';

const ACT_NAMES: Record<string, string> = {
  '1': 'Act I: The Question', '2': 'Act II: Theory', '3': 'Act III: Data',
  '4': 'Act IV: Evidence', '5': 'Act V: The Annual Meeting', 'end': 'the whole game',
};
const esc = (s: string) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
const csvCell = (s: string) => '"' + String(s).replace(/"/g, '""') + '"';

Deno.serve(async (req) => {
  if (req.headers.get('x-cron-secret') !== Deno.env.get('CRON_SECRET')) return new Response('forbidden', { status: 403 });
  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const today = new Date().toISOString().slice(0, 10);
  const { data: courses, error } = await db.from('courses').select('*');
  if (error) return new Response(error.message, { status: 500 });
  const sent: string[] = [];
  for (const c of courses ?? []) {
    for (const [act, date] of Object.entries(c.deadlines as Record<string, string>)) {
      if (!date || date >= today || c.reported?.[act]) continue;          // not passed yet, or done
      const { data: claims } = await db.from('claims').select('student_number, student_name, created_at')
        .eq('course_id', c.id).eq('act', act).order('student_number');
      const rows = claims ?? [];
      const table = rows.map((r) => `<tr><td style="padding:6px 12px;border-bottom:1px solid #eee">${esc(r.student_number)}</td>` +
        `<td style="padding:6px 12px;border-bottom:1px solid #eee">${esc(r.student_name)}</td>` +
        `<td style="padding:6px 12px;border-bottom:1px solid #eee;color:#666">${r.created_at.slice(0, 16).replace('T', ' ')} UTC</td></tr>`).join('');
      const html = `<div style="font-family:Georgia,serif;color:#222;max-width:640px">
        <h2 style="margin:0 0 4px">The Secret of the Lost Codebook: bonus points</h2>
        <p style="margin:0 0 16px;color:#555">${esc(c.course_name)} &middot; ${esc(c.university)}${c.term ? ' &middot; ' + esc(c.term) : ''}</p>
        <p>The claim deadline for <b>${ACT_NAMES[act] ?? act}</b> passed on ${date}. <b>${rows.length}</b> student${rows.length === 1 ? '' : 's'} claimed a point.</p>
        ${rows.length ? `<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
          <tr style="background:#f3efe6"><th align="left" style="padding:6px 12px">Student number</th><th align="left" style="padding:6px 12px">Name</th><th align="left" style="padding:6px 12px">Claimed</th></tr>${table}</table>` : ''}
        <p style="color:#777;font-size:13px;margin-top:20px">The same list is attached as a CSV file. Each claim can be made only once per student number and once per game device.</p></div>`;
      const csv = 'student_number,student_name,claimed_utc\n' +
        rows.map((r) => [r.student_number, r.student_name, r.created_at].map(csvCell).join(',')).join('\n');
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'api-key': Deno.env.get('BREVO_API_KEY')!, 'content-type': 'application/json' },
        body: JSON.stringify({
          sender: { email: Deno.env.get('SENDER_EMAIL'), name: Deno.env.get('SENDER_NAME') ?? 'The Lost Codebook' },
          to: [{ email: c.instructor_email, name: c.instructor_name }],
          subject: `Bonus points: ${c.course_name}, ${ACT_NAMES[act] ?? act} (${rows.length})`,
          htmlContent: html,
          attachment: [{ name: `bonus-${c.code}-${act}.csv`, content: btoa(unescape(encodeURIComponent(csv))) }],
        }),
      });
      if (!res.ok) { console.error('brevo', c.code, act, await res.text()); continue; }
      await db.from('courses').update({ reported: { ...(c.reported ?? {}), [act]: new Date().toISOString() } }).eq('id', c.id);
      sent.push(`${c.code}/${act}`);
    }
  }
  return Response.json({ sent });
});
