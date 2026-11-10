-- Jaga Toko — skema database tahap 1
-- Jalankan sekali di Supabase: SQL Editor → New query → tempel → Run.

create table if not exists public.docs (
  id         text primary key,            -- contoh: stores/s123, stores/s123/products/p9, orders/o77
  col        text not null,               -- koleksi induk: stores, stores/s123/products, orders
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create index if not exists docs_col_idx on public.docs (col);

-- Keamanan tahap 1 (uji coba): semua orang boleh membaca & menulis.
-- Sebelum diluncurkan resmi, ganti dengan login penjual/kurir + aturan per pemilik toko.
alter table public.docs enable row level security;
drop policy if exists "docs_select" on public.docs;
drop policy if exists "docs_insert" on public.docs;
drop policy if exists "docs_update" on public.docs;
drop policy if exists "docs_delete" on public.docs;
create policy "docs_select" on public.docs for select using (true);
create policy "docs_insert" on public.docs for insert with check (true);
create policy "docs_update" on public.docs for update using (true);
create policy "docs_delete" on public.docs for delete using (true);

-- Pembaruan langsung (realtime) agar pesanan & harga baru langsung muncul
alter table public.docs replica identity full;
do $$ begin
  alter publication supabase_realtime add table public.docs;
exception when duplicate_object then null; end $$;
