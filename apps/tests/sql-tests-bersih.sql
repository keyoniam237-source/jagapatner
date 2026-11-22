-- JAGA: tes pembersihan riwayat gagal. Aman dijalankan kapan saja (semua dibatalkan / rollback).
-- Hasil muncul sebagai pesan error "RESULT ..." (normal). Semua baris harus berawalan PASS.
do $tests$
declare
  res text := ''; now_ms bigint := public.jt_now_ms(); r jsonb; n int; ko text := 'TEST_owner_key_0123456789abcdef'; kb text := 'TEST_buyer_key_0123456789abcd01';
  pt jsonb := '{"lat":0.7078,"lng":100.5445}';
begin
  create temp table if not exists _t(tn text, ok boolean, info text) on commit drop;
  insert into public.docs (id, col, data) values
    ('orders/zzold', 'orders', jsonb_build_object('status','dibatalkan','cancelBy','buyer','updatedAt',now_ms-40*60000,'code','OLD')),
    ('orders/zznew', 'orders', jsonb_build_object('status','dibatalkan','cancelBy','buyer','updatedAt',now_ms-5*60000,'code','NEW')),
    ('orders/zzact', 'orders', jsonb_build_object('status','mencari_driver','updatedAt',now_ms-90*60000,'code','ACT')),
    ('orders/zzdone', 'orders', jsonb_build_object('status','selesai','updatedAt',now_ms-90*60000,'code','DONE')),
    ('rides/zzrold', 'rides', jsonb_build_object('status','dibatalkan','updatedAt',now_ms-45*60000,'code','RO','pickup',pt,'dest',pt)),
    ('rides/zzrnew', 'rides', jsonb_build_object('status','dibatalkan','updatedAt',now_ms-2*60000,'code','RN','pickup',pt,'dest',pt));
  insert into public.doc_keys (id, buyer_hash) values ('orders/zzold', public.jt_h(kb)), ('orders/zznew', public.jt_h(kb)), ('rides/zzrold', public.jt_h(kb));
  insert into public.jt_chat (order_id, role, name, body) values ('zzold', 'pembeli', 'x', 'halo'), ('zzact', 'pembeli', 'x', 'halo');
  insert into public.jt_proofs (order_id, kind, photo) values ('zzold', 'pick', 'data:image/jpeg;base64,AA');
  r := public.jt_cleanup_failed(30);
  insert into _t values ('Q1 pesanan batal >30 menit dihapus', not exists (select 1 from public.docs where id = 'orders/zzold'), r::text);
  insert into _t values ('Q2 pesanan batal <30 menit masih ada', exists (select 1 from public.docs where id = 'orders/zznew'), '');
  insert into _t values ('Q3 pesanan aktif & selesai tidak tersentuh', exists (select 1 from public.docs where id = 'orders/zzact') and exists (select 1 from public.docs where id = 'orders/zzdone'), '');
  insert into _t values ('Q4 order Jago batal >30 menit dihapus, yang baru tetap', not exists (select 1 from public.docs where id = 'rides/zzrold') and exists (select 1 from public.docs where id = 'rides/zzrnew'), '');
  insert into _t values ('Q5 chat, foto, dan kunci akses ikut terhapus', not exists (select 1 from public.jt_chat where order_id = 'zzold') and not exists (select 1 from public.jt_proofs where order_id = 'zzold') and not exists (select 1 from public.doc_keys where id = 'orders/zzold'), '');
  insert into _t values ('Q6 chat pesanan aktif tidak terhapus', exists (select 1 from public.jt_chat where order_id = 'zzact'), '');
  select count(*) into n from public.jt_cancel_log where buyer_hash = public.jt_h(kb);
  insert into _t values ('Q7 jejak ringkas pembatalan tersimpan', n = 1, n::text);
  insert into _t values ('Q8 pembersihan tercatat di audit', exists (select 1 from public.jt_audit where action = 'cleanup.failed'), '');
  r := public.jt_cleanup_failed(30);
  insert into _t values ('Q9 dijalankan ulang aman', (r->>'orders')::int = 0 and (r->>'rides')::int = 0, r::text);
  begin set local role anon; perform public.jt_cleanup_failed(30); reset role; insert into _t values ('Q10 anon tidak boleh menjalankan pembersih', false, 'lolos!'); exception when others then reset role; insert into _t values ('Q10 anon tidak boleh menjalankan pembersih', true, sqlerrm); end;
  select string_agg(case when ok then 'PASS ' else 'FAIL ' end || tn || coalesce(' [' || left(info, 70) || ']', ''), E'\n' order by tn) into res from _t;
  raise exception 'RESULT %', E'\n' || res;
end $tests$;
