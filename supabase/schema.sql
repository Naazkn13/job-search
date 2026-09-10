-- Job Search System — Supabase schema outline
-- Run order: companies -> applications -> resume_content -> prep content -> showcase

create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  priority int not null default 99,
  location text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete set null,
  role text not null,
  location text,
  job_link text,
  salary_expected text,
  resume_version text not null check (resume_version in ('A','B','C')),
  status text not null default 'planned' check (status in (
    'planned','prepared','applied','assessment','interview_1','interview_2','hr','offer','rejected','withdrawn'
  )),
  applied_at timestamptz,
  assessment_at timestamptz,
  interview_1_at timestamptz,
  interview_2_at timestamptz,
  hr_at timestamptz,
  result text,
  salary_offered text,
  jd_text text,
  jd_notes text,
  changes_made text,
  notes text,
  submit_prompted boolean default false,
  submitted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists resume_content (
  id uuid primary key default gen_random_uuid(),
  version text not null check (version in ('A','B','C')),
  headline text not null,
  summary text not null,
  skills_order jsonb not null,
  experience jsonb not null,
  projects jsonb not null,
  education text not null,
  certifications text,
  meta jsonb,
  updated_at timestamptz default now()
);

create table if not exists prep_content (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in (
    'python','fastapi_backend','sql','java','system_design','ai_genai','hr','project_story'
  )),
  role_scope text,
  questions jsonb not null,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists project_showcase (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  one_line_pitch text not null,
  description text,
  technologies text[] not null default '{}',
  live_link text,
  repo_link text,
  status text not null default 'in_progress' check (status in ('ready','in_progress','not_yet')),
  resume_versions jsonb not null default '["A","B","C"]',
  resume_bullets jsonb not null default '[]',
  interview_story jsonb,
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- basic indexes
create index if not exists idx_applications_company on applications(company_id);
create index if not exists idx_applications_status on applications(status);
create index if not exists idx_applications_resume_version on applications(resume_version);
create index if not exists idx_companies_priority on companies(priority);
