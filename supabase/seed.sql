-- Minimal seed matching lib/mock-data.ts (course titles, access codes, sample translations).
insert into courses (title, description, sequence_order) values
  ('Introduction to Theoretical MTU Training', 'Role, tactile landmarks, communication and consent.', 1),
  ('Applied Tactile Examination Principles', 'Systematic pattern, pressure and pace, documentation.', 2),
  ('Certification Preparation and Quality Standards', 'Quality standards, hygiene, escalation, exam preparation.', 3);

insert into access_codes (code, status, expires_at) values
  ('MTU-2026-DEMO', 'active', now() + interval '1 year'),
  ('DPS-INVITE-001', 'active', now() + interval '1 year'),
  ('MTU-OLD-2024', 'expired', now() - interval '1 year');

insert into translations (locale, key, value) values
  ('en', 'nav.dashboard', 'Dashboard'),
  ('de', 'nav.dashboard', 'Übersicht'),
  ('fr', 'nav.dashboard', 'Tableau de bord (placeholder)');
-- Lessons, practice questions and exam questions: see lib/mock-data.ts.
