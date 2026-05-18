create extension if not exists pgcrypto;

create table if not exists public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  name text not null,
  residents integer not null,
  email text not null,
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

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'survey_responses_email_key'
      and conrelid = 'public.survey_responses'::regclass
  ) then
    alter table public.survey_responses
    add constraint survey_responses_email_key unique (email);
  end if;
end;
$$;

alter table public.survey_responses enable row level security;

grant insert, update on public.survey_responses to anon;

drop policy if exists "Allow anonymous survey inserts" on public.survey_responses;

create policy "Allow anonymous survey inserts"
on public.survey_responses
for insert
to anon
with check (true);

drop policy if exists "Allow anonymous survey updates" on public.survey_responses;

create policy "Allow anonymous survey updates"
on public.survey_responses
for update
to anon
using (true)
with check (true);

create or replace function public.save_survey_response(response_payload jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.survey_responses (
    name,
    residents,
    email,
    city,
    income,
    pre_q1,
    pre_q2,
    pre_q3,
    pre_q4,
    pre_q5,
    pre_q6,
    monthly_consumption_kwh,
    estimated_kwp,
    estimated_system_cost_brl,
    estimated_monthly_savings_brl,
    estimated_annual_savings_brl,
    estimated_payback_years,
    estimated_avoided_co2_kg_lifetime,
    estimated_trees_equivalent_lifetime,
    post_q1,
    post_q2,
    post_q3,
    post_q4,
    post_q5,
    post_q6
  )
  values (
    nullif(trim(response_payload->>'name'), ''),
    (response_payload->>'residents')::integer,
    lower(nullif(trim(response_payload->>'email'), '')),
    nullif(trim(response_payload->>'city'), ''),
    nullif(response_payload->>'income', ''),
    nullif(response_payload->>'pre_q1', ''),
    nullif(response_payload->>'pre_q2', ''),
    nullif(response_payload->>'pre_q3', ''),
    nullif(response_payload->>'pre_q4', ''),
    nullif(response_payload->>'pre_q5', ''),
    nullif(response_payload->>'pre_q6', ''),
    (response_payload->>'monthly_consumption_kwh')::numeric,
    (response_payload->>'estimated_kwp')::numeric,
    (response_payload->>'estimated_system_cost_brl')::numeric,
    (response_payload->>'estimated_monthly_savings_brl')::numeric,
    (response_payload->>'estimated_annual_savings_brl')::numeric,
    (response_payload->>'estimated_payback_years')::numeric,
    (response_payload->>'estimated_avoided_co2_kg_lifetime')::numeric,
    (response_payload->>'estimated_trees_equivalent_lifetime')::numeric,
    nullif(response_payload->>'post_q1', ''),
    nullif(response_payload->>'post_q2', ''),
    nullif(response_payload->>'post_q3', ''),
    nullif(response_payload->>'post_q4', ''),
    nullif(response_payload->>'post_q5', ''),
    nullif(response_payload->>'post_q6', '')
  )
  on conflict (email) do update set
    name = excluded.name,
    residents = excluded.residents,
    city = excluded.city,
    income = excluded.income,
    pre_q1 = excluded.pre_q1,
    pre_q2 = excluded.pre_q2,
    pre_q3 = excluded.pre_q3,
    pre_q4 = excluded.pre_q4,
    pre_q5 = excluded.pre_q5,
    pre_q6 = excluded.pre_q6,
    monthly_consumption_kwh = excluded.monthly_consumption_kwh,
    estimated_kwp = excluded.estimated_kwp,
    estimated_system_cost_brl = excluded.estimated_system_cost_brl,
    estimated_monthly_savings_brl = excluded.estimated_monthly_savings_brl,
    estimated_annual_savings_brl = excluded.estimated_annual_savings_brl,
    estimated_payback_years = excluded.estimated_payback_years,
    estimated_avoided_co2_kg_lifetime = excluded.estimated_avoided_co2_kg_lifetime,
    estimated_trees_equivalent_lifetime = excluded.estimated_trees_equivalent_lifetime,
    post_q1 = excluded.post_q1,
    post_q2 = excluded.post_q2,
    post_q3 = excluded.post_q3,
    post_q4 = excluded.post_q4,
    post_q5 = excluded.post_q5,
    post_q6 = excluded.post_q6;
end;
$$;

grant execute on function public.save_survey_response(jsonb) to anon;
