-- PLACEHOLDER row-level-security policies for the closed platform.
-- Review with your security team before production use.

alter table profiles                  enable row level security;
alter table access_codes              enable row level security;
alter table course_enrollments        enable row level security;
alter table lesson_progress           enable row level security;
alter table practice_attempts         enable row level security;
alter table exam_attempts             enable row level security;
alter table exam_answers              enable row level security;
alter table certifications            enable row level security;
alter table recertification_reminders enable row level security;
alter table courses                   enable row level security;
alter table lessons                   enable row level security;
alter table practice_questions        enable row level security;
alter table content_assets            enable row level security;
alter table translations              enable row level security;

-- Learners only ever see and change their own rows.
create policy "own profile"       on profiles for select using (auth.uid() = id);
create policy "update own profile" on profiles for update using (auth.uid() = id);
create policy "own enrollments"   on course_enrollments for all using (auth.uid() = user_id);
create policy "own lesson progress" on lesson_progress for all using (auth.uid() = user_id);
create policy "own practice"      on practice_attempts for all using (auth.uid() = user_id);
create policy "own exam attempts" on exam_attempts for all using (auth.uid() = user_id);
create policy "own exam answers"  on exam_answers for all using (
  exists (select 1 from exam_attempts a where a.id = exam_attempt_id and a.user_id = auth.uid())
);
create policy "own certifications" on certifications for select using (auth.uid() = user_id);
create policy "own reminders"     on recertification_reminders for select using (auth.uid() = user_id);

-- Content is readable by any signed-in user (closed platform: no anonymous access).
create policy "signed-in read courses"   on courses for select using (auth.role() = 'authenticated');
create policy "signed-in read lessons"   on lessons for select using (auth.role() = 'authenticated');
create policy "signed-in read questions" on practice_questions for select using (auth.role() = 'authenticated');
create policy "signed-in read assets"    on content_assets for select using (auth.role() = 'authenticated');
create policy "signed-in read i18n"      on translations for select using (auth.role() = 'authenticated');

-- TODO: trainer / center_director policies (read learners in their centre only).
-- TODO: access_codes are validated in a SECURITY DEFINER function during sign-up, never exposed to clients.
-- TODO: exam answer keys must live server-side; score in an RPC, never in the browser.
