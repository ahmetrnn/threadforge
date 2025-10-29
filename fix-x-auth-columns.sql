-- Add missing X OAuth columns to users table
-- Run this in your Supabase SQL Editor

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS x_account_id text,
ADD COLUMN IF NOT EXISTS x_username text,
ADD COLUMN IF NOT EXISTS x_connected_at timestamptz,
ADD COLUMN IF NOT EXISTS x_tokens jsonb;

-- Verify the columns were added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'users'
AND column_name LIKE 'x_%'
ORDER BY column_name;
