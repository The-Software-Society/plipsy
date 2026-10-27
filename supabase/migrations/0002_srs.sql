-- SRS / spaced-repetition columns + learner pathway state.
-- Additive and back-compatible: existing rows default to box 0 / active.

alter table print_vocabulary
  add column if not exists box int not null default 0,
  add column if not exists state text not null default 'active'
    check (state in ('active', 'longTerm', 'problem')),
  add column if not exists clean_count int not null default 0,
  add column if not exists lapse_count int not null default 0,
  add column if not exists next_review_at timestamptz;

create index if not exists print_vocabulary_due_idx
  on print_vocabulary(child_id, next_review_at);

create table if not exists learner_state (
  child_id uuid primary key references children(id) on delete cascade,
  pathway_id text not null default 'module-1',
  unit_index int not null default 0,
  active_cap int not null default 4,
  updated_at timestamptz not null default now()
);
