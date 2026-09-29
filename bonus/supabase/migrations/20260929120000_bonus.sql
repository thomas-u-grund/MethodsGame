-- Course bonus points (ROADMAP 8-BONUS). Deployed with `supabase db push` (or paste into the SQL Editor once).
-- Instructors (logged in by an emailed code) own courses; students never log in: they claim through
-- submit_claim(), which enforces every rule. Nobody without a login can read the claim list.

create extension if not exists pgcrypto;

create table if not exists public.courses (
  id              uuid primary key default gen_random_uuid(),
  code            text unique not null default upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 8)),
  owner           uuid not null default auth.uid() references auth.users(id) on delete cascade,
  instructor_name text not null,
  instructor_email text not null,
  university      text not null,
  course_name     text not null,
  country         text not null,
  term            text,
  mode            text not null check (mode in ('acts', 'end')),
  -- acts mode: {"1":"2026-11-01", ..., "5":"2027-01-31"}; end mode: {"end":"2027-01-31"} (dates, end of day, UTC)
  deadlines       jsonb not null,
  reported        jsonb not null default '{}'::jsonb,   -- which deadlines have been emailed
  created_at      timestamptz not null default now()
);

create table if not exists public.claims (
  id             bigint generated always as identity primary key,
  course_id      uuid not null references public.courses(id) on delete cascade,
  act            text not null,                    -- '1'..'5' or 'end'
  student_number text not null,
  student_name   text not null,
  claim_key      text not null,                    -- one-time key made by the game on that device
  created_at     timestamptz not null default now(),
  unique (course_id, act, student_number),         -- one claim per student per act
  unique (course_id, act, claim_key)               -- one claim per key
);

alter table public.courses enable row level security;
alter table public.claims  enable row level security;

-- instructors see and manage only their own courses and claims
drop policy if exists own_courses on public.courses;
create policy own_courses on public.courses for all to authenticated
  using (owner = auth.uid()) with check (owner = auth.uid());
drop policy if exists own_claims on public.claims;
create policy own_claims on public.claims for select to authenticated
  using (exists (select 1 from public.courses c where c.id = course_id and c.owner = auth.uid()));
drop policy if exists own_claims_delete on public.claims;
create policy own_claims_delete on public.claims for delete to authenticated
  using (exists (select 1 from public.courses c where c.id = course_id and c.owner = auth.uid()));

-- what the game and the claim page may know about a course: no emails, no claims
create or replace function public.course_public(p_code text)
returns json language sql security definer set search_path = public stable as $$
  select json_build_object('code', code, 'course_name', course_name, 'university', university,
                           'instructor_name', instructor_name, 'term', term, 'mode', mode, 'deadlines', deadlines)
  from courses where code = upper(trim(p_code));
$$;

-- the only way in for students
create or replace function public.submit_claim(p_code text, p_act text, p_key text, p_number text, p_name text)
returns json language plpgsql security definer set search_path = public as $$
declare c courses; dl date;
begin
  select * into c from courses where code = upper(trim(p_code));
  if not found then return json_build_object('ok', false, 'error', 'Unknown course link.'); end if;
  if c.mode = 'end' and p_act <> 'end' then return json_build_object('ok', false, 'error', 'This course awards the point at the end of the game only.'); end if;
  if c.mode = 'acts' and p_act not in ('1','2','3','4','5') then return json_build_object('ok', false, 'error', 'Unknown act.'); end if;
  dl := (c.deadlines ->> p_act)::date;
  if dl is null then return json_build_object('ok', false, 'error', 'No bonus point is set for this act.'); end if;
  if now() > (dl + 1)::timestamptz then return json_build_object('ok', false, 'error', 'The deadline for this claim has passed.'); end if;
  if coalesce(length(trim(p_key)), 0) < 16 then return json_build_object('ok', false, 'error', 'This claim link is incomplete. Open it again from the game.'); end if;
  if coalesce(length(trim(p_number)), 0) < 2 or coalesce(length(trim(p_name)), 0) < 2 then
    return json_build_object('ok', false, 'error', 'Please enter your student number and your name.'); end if;
  begin
    insert into claims (course_id, act, student_number, student_name, claim_key)
    values (c.id, p_act, trim(p_number), trim(p_name), trim(p_key));
  exception when unique_violation then
    return json_build_object('ok', false, 'error', 'This point has already been claimed (by this student number, or with this claim link).');
  end;
  return json_build_object('ok', true);
end $$;

revoke all on function public.submit_claim(text, text, text, text, text) from public;
grant execute on function public.submit_claim(text, text, text, text, text) to anon, authenticated;
grant execute on function public.course_public(text) to anon, authenticated;
