-- Trainer portal schema additions (prototype: the UI runs on mock data in lib/trainer/*).
-- Extends schema.sql. Existing tables are altered, not duplicated.

create type content_status as enum ('draft', 'published', 'changes_pending', 'archived');
create type invitation_status as enum ('not_sent', 'sent', 'accepted');

-- Trainers are profiles with role = 'trainer'. Organizations scope what a trainer can see.
create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null
);
create table trainer_profiles (
  id uuid primary key references profiles(id) on delete cascade,
  organization_id uuid not null references organizations(id)
);

create table training_programs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id),
  title text not null,
  description text not null,
  status text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

alter table courses add column program_id uuid references training_programs(id);
alter table courses add column status content_status not null default 'draft';
alter table lessons add column status content_status not null default 'draft';
alter table lessons add column explanation text;
alter table lessons add column pdf_url text;
alter table lessons add column published_at timestamptz;

create table glossary_terms (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id),
  term text not null,
  definition text not null
);
create table lesson_glossary_links (
  lesson_id uuid references lessons(id) on delete cascade,
  glossary_term_id uuid references glossary_terms(id) on delete cascade,
  primary key (lesson_id, glossary_term_id)
);

create table practice_quizzes (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references training_programs(id),
  lesson_id uuid references lessons(id),          -- the "linked lesson" used for remediation
  title text not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived'))
);
alter table practice_questions add column quiz_id uuid references practice_quizzes(id) on delete cascade;
alter table practice_questions add column correct_feedback text;
alter table practice_questions add column incorrect_feedback text;
alter table practice_questions add column position int;

create table final_exams (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references training_programs(id),
  title text not null,
  instructions text not null,
  passing_score int not null check (passing_score between 1 and 100),
  retry_limit int not null check (retry_limit between 1 and 10),
  status text not null default 'draft' check (status in ('draft', 'active', 'archived'))
);
create table exam_questions (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references final_exams(id) on delete cascade,
  question_text text not null,
  answers jsonb not null,                          -- exactly 3 answers
  correct_answer int not null,
  remediation_lesson_id uuid references lessons(id),
  position int not null
);

create table learning_paths (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references training_programs(id),
  title text not null,
  status text not null default 'draft' check (status in ('draft', 'saved', 'archived'))
);
create table learning_path_items (
  id uuid primary key default gen_random_uuid(),
  learning_path_id uuid not null references learning_paths(id) on delete cascade,
  item_type text not null check (item_type in ('course', 'exam')),
  item_id uuid not null,
  position int not null,
  locked boolean not null default true,            -- locked until the previous item is complete
  unique (learning_path_id, position)
);

alter table profiles add column invitation_status invitation_status;
alter table profiles add column organization_id uuid references organizations(id);

create table learner_assignments (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references profiles(id) on delete cascade,
  learning_path_id uuid not null references learning_paths(id),
  assigned_at timestamptz not null default now(),
  unique (learner_id, learning_path_id)
);

create table remediation_assignments (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references profiles(id) on delete cascade,
  exam_attempt_id uuid references exam_attempts(id),
  lesson_ids uuid[] not null,
  note text,
  assigned_by uuid references profiles(id),
  assigned_at timestamptz not null default now(),
  retry_unlocked boolean not null default false,
  retry_unlocked_at timestamptz
);
create table trainer_notes (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references profiles(id) on delete cascade,
  trainer_id uuid not null references profiles(id),
  body text not null,
  created_at timestamptz not null default now()
);
alter table recertification_reminders add column sent_at timestamptz;
create table export_jobs (
  id uuid primary key default gen_random_uuid(),
  requested_by uuid not null references profiles(id),
  export_type text not null,
  status text not null default 'ready',
  file_url text,
  created_at timestamptz not null default now()
);

-- PLACEHOLDER RLS: a trainer sees only rows belonging to their own organization.
alter table training_programs enable row level security;
alter table learning_paths enable row level security;
alter table remediation_assignments enable row level security;
alter table trainer_notes enable row level security;
alter table export_jobs enable row level security;

create policy "trainer reads own org programs" on training_programs for select using (
  organization_id in (select organization_id from trainer_profiles where id = auth.uid())
);
create policy "trainer writes own org programs" on training_programs for all using (
  organization_id in (select organization_id from trainer_profiles where id = auth.uid())
);
create policy "trainer reads own org learners" on profiles for select using (
  organization_id in (select organization_id from trainer_profiles where id = auth.uid())
);
create policy "trainer manages remediation for own org" on remediation_assignments for all using (
  learner_id in (select id from profiles where organization_id in
    (select organization_id from trainer_profiles where id = auth.uid()))
);
create policy "learner reads own remediation" on remediation_assignments for select using (auth.uid() = learner_id);
-- TODO: only published lessons/quizzes are visible to learners; trainers see drafts.
-- TODO: exam answer keys stay server-side; scoring runs in an RPC.
-- TODO: Master Trainer / System Admin roles (content CRUD vs. user and system management) are a later phase.
