-- Foto & titik lokasi di chat (diterapkan sebagai migrasi chat_foto_lokasi). 6 tes lulus dalam blok rollback.
alter table public.jt_chat add column if not exists photo text;
-- jt_chat_photo(p_order, p_role, p_name, p_photo, p_body, p_key): hanya peserta order, hanya data:image/jpeg;base64,
-- maks 450.000 karakter, maks 8 foto / 10 menit per order. jt_chat_list kini ikut mengembalikan kolom photo.
