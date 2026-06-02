-- Add missing columns to standings table (table already exists from minimal schema)
alter table public.standings add column if not exists played integer default 0;
alter table public.standings add column if not exists wins integer default 0;
alter table public.standings add column if not exists draws integer default 0;
alter table public.standings add column if not exists losses integer default 0;
alter table public.standings add column if not exists "goalsFor" integer default 0;
alter table public.standings add column if not exists "goalsAgainst" integer default 0;
alter table public.standings add column if not exists "goalDifference" integer default 0;
alter table public.standings add column if not exists points integer default 0;
alter table public.standings add column if not exists highlight boolean default false;

-- Enable RLS
alter table public.standings enable row level security;

-- Add read policy (if not exists)
do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'standings' and policyname = 'Public read standings'
  ) then
    create policy "Public read standings" on public.standings for select using (true);
  end if;
end
$$;
