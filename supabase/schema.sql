-- MTU Training Platform: prototype schema
-- The prototype UI runs on local mock persistence (lib/persistence.ts).
-- This schema is what a Supabase-backed build would use. See rls.sql for policies.

create extension if not exists "pgcrypto";

create type user_role as enum ('learner', 'trainer', 'trainer_assistant', 'center_director');
create type enrollment_status as enum ('locked', 'upcoming', 'in_progress', 'completed');
create type lesson_kind as enum ('audio', 'video', 'text', 'pdf');
create type exam_status as enum ('in_progress', 'passed', 'failed');
create type cert_status as enum ('active', 'expired', 'revoked');
create type reminder_status as enum ('scheduled', 'sent', 'dismissed');

-- Linked 1:1 to auth.users (Supabase Auth)
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text not null,
  email text not null unique,
  role user_role not null default 'learner',
  preferred_language text not null default 'en',
  -- { textSize, contrast, theme, reduceMotion, audioGuidance, defaultSpeed }
  accessibility_settings jsonb not null default '{}'::jsonb,
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now()
);

-- Closed platform: registration requires an unused, unexpired code
create table access_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  status text not null default 'active' check (status in ('active', 'used', 'expired')),
  assigned_to uuid references profiles(id),
  expires_at timestamptz
);

create table courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  sequence_order int not null unique,
  is_required boolean not null default true
);

create table lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  title text not null,
  kind lesson_kind not null default 'audio',
  transcript text,
  audio_url text,              -- MP3 (or MP4 for video); see content_assets
  duration_seconds int not null default 0,
  order_index int not null,
  unique (course_id, order_index)
);

-- Files behind lessons: MP3, MP4, PDF, BRF (Braille-ready)
create table content_assets (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references lessons(id) on delete cascade,
  kind text not null check (kind in ('mp3', 'mp4', 'pdf', 'brf', 'txt')),
  storage_path text not null,
  locale text not null default 'en',
  alt_text text
);

create table course_enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  status enrollment_status not null default 'upcoming',
  progress_percent int not null default 0 check (progress_percent between 0 and 100),
  started_at timestamptz,
  completed_at timestamptz,
  unique (user_id, course_id)
);

-- Enables "resume on another device": one row per learner per lesson
create table lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,
  playback_position_seconds int not null default 0,
  completed boolean not null default false,
  last_device text,
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create table practice_questions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  question_text text not null,
  answer_options jsonb not null,          -- [{ "id": "a", "label": "..." }]
  correct_answer text not null,
  explanation text,
  related_segment jsonb                    -- { label, excerpt, start, end }
);

create table practice_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  question_id uuid not null references practice_questions(id) on delete cascade,
  selected_answer text not null,
  is_correct boolean not null,
  attempted_at timestamptz not null default now()
);

create table exam_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  attempt_number int not null,
  score int,
  status exam_status not null default 'in_progress',
  submitted_at timestamptz,
  unique (user_id, attempt_number)
);

create table exam_answers (
  id uuid primary key default gen_random_uuid(),
  exam_attempt_id uuid not null references exam_attempts(id) on delete cascade,
  question_id text not null,
  selected_answer text not null,
  saved_at timestamptz not null default now(),
  unique (exam_attempt_id, question_id)
);

create table certifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  issued_at timestamptz not null,
  expires_at timestamptz not null,
  status cert_status not null default 'active'
);

create table recertification_reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  due_date date not null,
  days_before_expiry int not null,
  status reminder_status not null default 'scheduled'
);

-- Mirrors lib/i18n.ts
create table translations (
  id uuid primary key default gen_random_uuid(),
  locale text not null,
  key text not null,
  value text not null,
  unique (locale, key)
);
