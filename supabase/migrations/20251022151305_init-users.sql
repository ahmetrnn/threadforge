-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table stores waitlist + authenticated makers
create table if not exists public.users (
  id uuid primary key default uuid_generate_v4(),
  auth_user_id uuid unique,
  email text not null unique,
  threads_used integer not null default 0,
  subscription_status text not null default 'free',
  created_at timestamptz not null default timezone('utc'::text, now())
);

-- Add x_tokens column if it doesn't exist
alter table public.users 
add column if not exists x_tokens jsonb;

-- Enable RLS
alter table public.users enable row level security;

-- Policies
create policy "Allow waitlist inserts"
  on public.users
  for insert
  with check (true);

create policy "Allow users to view self"
  on public.users
  for select
  using (auth.uid() = auth_user_id or auth.role() = 'service_role');

create policy "Allow users to update self"
  on public.users
  for update
  using (auth.uid() = auth_user_id or auth.role() = 'service_role')
  with check (auth.uid() = auth_user_id or auth.role() = 'service_role');

-- Templates table
create table if not exists public.templates (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  name text not null,
  description text,
  outline text
);

alter table public.templates enable row level security;

create policy "Allow template reads" on public.templates for select using (true);

-- Seed templates
insert into public.templates (slug, name, description, outline)
values
  ('daily-progress', 'Daily Progress', 'Share what you shipped today with momentum framing.', 'Hook -> Today''s stack -> Wins -> What''s next -> CTA'),
  ('product-teaser', 'Product Teaser', 'Build hype for an upcoming drop without giving everything away.', 'Hook -> Problem -> Tease solution -> Behind the scenes -> CTA'),
  ('bts', 'BTS', 'Behind-the-scenes transparency for build-in-public fans.', 'Hook -> Context -> Challenge -> How you tackled it -> Lesson'),
  ('ama', 'AMA', 'Invite your audience to ask questions and join the conversation.', 'Hook -> Topic -> Prompt questions -> Drop value -> CTA to reply'),
  ('growth-hack', 'Growth Hack', 'Break down a repeatable growth move step-by-step.', 'Hook -> Why it matters -> Step-by-step -> Metrics -> CTA')
  on conflict (slug) do update set
    name = excluded.name,
    description = excluded.description,
    outline = excluded.outline;
