-- Thread History Feature
-- Stores generated threads for user reference and history

create table if not exists public.thread_history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  thread_data jsonb not null, -- Full thread with tweets
  topic text,
  thread_type text,
  tone text,
  mode text check (mode in ('thread', 'single')),
  language text default 'en',
  quality_score integer, -- 0-100 from quality validator
  estimated_impressions text,
  publish_tips text,
  is_posted boolean default false,
  posted_at timestamptz,
  created_at timestamptz not null default timezone('utc'::text, now())
);

-- Add index for faster queries
create index if not exists thread_history_user_id_created_at_idx
  on public.thread_history(user_id, created_at desc);

-- Enable RLS
alter table public.thread_history enable row level security;

-- Policies
create policy "Users can view their own thread history"
  on public.thread_history
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own thread history"
  on public.thread_history
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own thread history"
  on public.thread_history
  for update
  using (auth.uid() = user_id);

create policy "Users can delete their own thread history"
  on public.thread_history
  for delete
  using (auth.uid() = user_id);
