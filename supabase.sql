-- ==============================================================================
-- Portfolio Database Schema & Storage Policies (Idempotent: an toàn chạy lại)
-- Chạy script này trong Supabase: SQL Editor
-- ==============================================================================

-- 1. Bảng projects (Dự án)
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  summary text not null default '',
  tech text[] not null default '{}',
  role text not null default '',
  features text[] not null default '{}',
  repo text,
  demo text,
  image text,
  images text[] not null default '{}',
  links jsonb not null default '[]'::jsonb,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

-- Bổ sung cột cho projects nếu bảng đã tồn tại từ trước
alter table projects add column if not exists images text[] not null default '{}';
alter table projects add column if not exists links jsonb not null default '[]'::jsonb;
alter table projects enable row level security;

-- Policies cho projects (Bảo vệ phía ứng dụng qua /api/admin/ và cho phép server thao tác)
drop policy if exists "Allow select for projects" on projects;
create policy "Allow select for projects" on projects for select using (true);

drop policy if exists "Allow insert for projects" on projects;
create policy "Allow insert for projects" on projects for insert with check (true);

drop policy if exists "Allow update for projects" on projects;
create policy "Allow update for projects" on projects for update using (true);

drop policy if exists "Allow delete for projects" on projects;
create policy "Allow delete for projects" on projects for delete using (true);


-- 2. Bảng experiences (Kinh nghiệm và học vấn)
create table if not exists experiences (
  id uuid primary key default gen_random_uuid(),
  period text not null default '',
  place text not null default '',
  role text not null default '',
  points text[] not null default '{}',
  images text[] not null default '{}',
  links jsonb not null default '[]'::jsonb,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

-- Bổ sung cột cho experiences nếu bảng đã tồn tại từ trước
alter table experiences add column if not exists images text[] not null default '{}';
alter table experiences add column if not exists links jsonb not null default '[]'::jsonb;
alter table experiences enable row level security;

-- Policies cho experiences
drop policy if exists "Allow select for experiences" on experiences;
create policy "Allow select for experiences" on experiences for select using (true);

drop policy if exists "Allow insert for experiences" on experiences;
create policy "Allow insert for experiences" on experiences for insert with check (true);

drop policy if exists "Allow update for experiences" on experiences;
create policy "Allow update for experiences" on experiences for update using (true);

drop policy if exists "Allow delete for experiences" on experiences;
create policy "Allow delete for experiences" on experiences for delete using (true);


-- 3. Bảng certificates (Chứng nhận)
create table if not exists certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  issuer text not null default '',
  date text not null default '',
  description text not null default '',
  image text not null default '',
  link text,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

-- Bổ sung cột cho certificates nếu cần
alter table certificates add column if not exists description text not null default '';
alter table certificates add column if not exists link text;
alter table certificates enable row level security;

-- Policies cho certificates
drop policy if exists "Allow select for certificates" on certificates;
create policy "Allow select for certificates" on certificates for select using (true);

drop policy if exists "Allow insert for certificates" on certificates;
create policy "Allow insert for certificates" on certificates for insert with check (true);

drop policy if exists "Allow update for certificates" on certificates;
create policy "Allow update for certificates" on certificates for update using (true);

drop policy if exists "Allow delete for certificates" on certificates;
create policy "Allow delete for certificates" on certificates for delete using (true);


-- 4. Supabase Storage: Bucket "portfolio" & Storage Policies
-- Tự động tạo bucket 'portfolio' nếu chưa có và bật public
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do update set public = true;

-- Cho phép đọc công khai ảnh từ bucket portfolio
drop policy if exists "Public Access for portfolio bucket" on storage.objects;
create policy "Public Access for portfolio bucket"
on storage.objects for select
using (bucket_id = 'portfolio');

-- Cho phép tải ảnh lên bucket portfolio
drop policy if exists "Allow Upload to portfolio bucket" on storage.objects;
create policy "Allow Upload to portfolio bucket"
on storage.objects for insert
with check (bucket_id = 'portfolio');

-- Cho phép cập nhật ảnh trong bucket portfolio
drop policy if exists "Allow Update to portfolio bucket" on storage.objects;
create policy "Allow Update to portfolio bucket"
on storage.objects for update
using (bucket_id = 'portfolio');

-- Cho phép xóa ảnh trong bucket portfolio
drop policy if exists "Allow Delete from portfolio bucket" on storage.objects;
create policy "Allow Delete from portfolio bucket"
on storage.objects for delete
using (bucket_id = 'portfolio');
