-- Execute este arquivo no Supabase: SQL Editor > New query > Run.
-- ATENCAO: estas politicas permitem leitura e edicao publica a qualquer pessoa
-- que tenha acesso ao site. E adequado somente para um painel interno sem
-- dados sensiveis. Para controle individual, adicione Supabase Auth depois.

create table if not exists public.app_state (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.app_state enable row level security;

revoke all on table public.app_state from anon, authenticated;
grant select, insert, update on table public.app_state to anon, authenticated;

create policy "Leitura publica do painel"
on public.app_state
for select
to anon, authenticated
using (id = 'ceres-confina');

create policy "Criacao publica do painel"
on public.app_state
for insert
to anon, authenticated
with check (id = 'ceres-confina');

create policy "Atualizacao publica do painel"
on public.app_state
for update
to anon, authenticated
using (id = 'ceres-confina')
with check (id = 'ceres-confina');

-- O primeiro salvamento pelo site criara este registro automaticamente.
