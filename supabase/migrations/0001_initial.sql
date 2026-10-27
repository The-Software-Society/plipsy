-- Mia v1: initial schema
-- Run via: supabase db push  (or paste into Supabase SQL editor)

create table if not exists children (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists print_vocabulary (
  child_id uuid not null references children(id) on delete cascade,
  word text not null,
  status text not null check (status in ('introduced', 'learning', 'mastered')),
  exposure_count int not null default 0,
  introduced_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  primary key (child_id, word)
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references children(id) on delete cascade,
  story_id text not null,
  started_at timestamptz not null,
  ended_at timestamptz,
  completed boolean not null default false
);

create table if not exists session_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  event_type text not null,
  payload jsonb not null,
  occurred_at timestamptz not null default now()
);

create index if not exists session_events_session_idx
  on session_events(session_id, occurred_at);

create index if not exists sessions_child_started_idx
  on sessions(child_id, started_at desc);

-- Seed the one MVP child profile
insert into children (id, name) values
  ('00000000-0000-0000-0000-000000000001', 'Mia')
  on conflict (id) do nothing;
