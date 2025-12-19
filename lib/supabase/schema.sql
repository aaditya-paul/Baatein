-- Create table for entries
create table entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text,
  content text not null,
  is_deleted boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table entries enable row level security;

-- Create policies
create policy "Users can create their own entries"
  on entries for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own entries"
  on entries for select
  using (auth.uid() = user_id and is_deleted = false);

create policy "Users can update their own entries"
  on entries for update
  using (auth.uid() = user_id);

create policy "Users can delete their own entries"
  on entries for delete
  using (auth.uid() = user_id);

-- Create profiles table for encryption and account management
create table profiles (
  id uuid references auth.users primary key,
  is_deleted boolean default false,
  encrypted_dek text, -- Encrypted Data Encryption Key
  dek_salt text,      -- Salt for PBKDF2 key derivation
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table profiles enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);
