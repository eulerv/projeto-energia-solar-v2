create extension if not exists pgcrypto;

create table public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  name text not null,
  residents integer not null,
  email text not null unique,
  city text not null,
  income text not null,

  pre_q1 text not null,
  pre_q2 text not null,
  pre_q3 text not null,
  pre_q4 text not null,
  pre_q5 text not null,
  pre_q6 text not null,

  monthly_consumption_kwh numeric(10, 2) not null,
  estimated_kwp numeric(10, 2) not null,
  estimated_system_cost_brl numeric(12, 2) not null,
  estimated_monthly_savings_brl numeric(12, 2) not null,
  estimated_annual_savings_brl numeric(12, 2) not null,
  estimated_payback_years numeric(10, 2) not null,
  estimated_avoided_co2_kg_lifetime numeric(12, 2) not null,
  estimated_trees_equivalent_lifetime numeric(12, 2) not null,

  post_q1 text not null,
  post_q2 text not null,
  post_q3 text not null,
  post_q4 text not null,
  post_q5 text not null,
  post_q6 text not null
);

alter table public.survey_responses enable row level security;

grant insert, update on public.survey_responses to anon;

create policy "Allow anonymous survey inserts"
on public.survey_responses
for insert
to anon
with check (true);

create policy "Allow anonymous survey updates"
on public.survey_responses
for update
to anon
using (true)
with check (true);
