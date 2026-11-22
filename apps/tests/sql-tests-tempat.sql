-- JAGA: tes buku tempat. Aman dijalankan kapan saja (semua dibatalkan / rollback).
-- Hasil muncul sebagai pesan error "RESULT ..." (normal). Semua baris harus berawalan PASS.
do $tests$
declare
  res text := '';
  ko text := 'TEST_owner_key_0123456789abcdef'; kx text := 'TEST_pengguna_key_0123456789abcd'; kn text := 'TEST_bukan_owner_0123456789abcdef';
  r jsonb; n int; pid uuid; i int;
begin
  create temp table if not exists _t(tn text, ok boolean, info text) on commit drop;
  insert into public.jt_owner_auth (login, pass_hash) values ('zz_test_owner', 'x') on conflict (login) do nothing;
  insert into public.jt_owner_devices (login, key_hash) values ('zz_test_owner', public.jt_h(ko));
  insert into public.docs (id, col, data) values ('stores/zzp', 'stores', '{"name":"Warung Uji Rasa","active":true,"address":"Jl Uji","lat":0.8,"lng":100.6}');
  perform public.jt_place_save('Pasar Ujungbatu', 'Ujungbatu', 0.8, 100.6, kx);
  r := public.jt_place_search('pasar ujung', 0.8, 100.6);
  insert into _t values ('P1 tempat tersimpan bisa dicari', jsonb_array_length(r) = 1 and r->0->>'src' = 'jaga', left(r::text, 60));
  r := public.jt_place_search('uji rasa', null, null);
  insert into _t values ('P2 toko aktif muncul sebagai hasil', r->0->>'src' = 'toko', left(r::text, 60));
  perform public.jt_place_save('pasar ujungbatu', 'x', 0.8001, 100.6001, kx);
  select uses into n from public.jt_places where lower(name) = 'pasar ujungbatu';
  insert into _t values ('P3 duplikat <150 m hanya menambah hitungan', (select count(*) from public.jt_places where lower(name) = 'pasar ujungbatu') = 1 and n = 2, n::text);
  begin perform public.jt_place_save('Rumah Budi 081234567890', 'x', 0.8, 100.6, kx); insert into _t values ('P4 nomor telepon ditolak', false, 'lolos!'); exception when others then insert into _t values ('P4 nomor telepon ditolak', true, sqlerrm); end;
  begin perform public.jt_place_save('Lihat http://evil.com', 'x', 0.8, 100.6, kx); insert into _t values ('P5 tautan ditolak', false, 'lolos!'); exception when others then insert into _t values ('P5 tautan ditolak', true, sqlerrm); end;
  begin perform public.jt_place_save('Di Luar Wilayah', 'x', -6.2, 106.8, kx); insert into _t values ('P6 di luar wilayah ditolak', false, 'lolos!'); exception when others then insert into _t values ('P6 di luar wilayah ditolak', true, sqlerrm); end;
  begin perform public.jt_place_save('ab', 'x', 0.8, 100.6, kx); insert into _t values ('P7 nama terlalu pendek ditolak', false, 'lolos!'); exception when others then insert into _t values ('P7 nama terlalu pendek ditolak', true, sqlerrm); end;
  for i in 1..10 loop begin perform public.jt_place_save('Tempat Uji ' || i, 'x', 0.8 + i*0.001, 100.6, kx); exception when others then null; end; end loop;
  begin perform public.jt_place_save('Tempat Ke Sebelas', 'x', 0.82, 100.6, kx); insert into _t values ('P8 batas 10 per hari', false, 'lolos!'); exception when others then insert into _t values ('P8 batas 10 per hari', true, sqlerrm); end;
  begin perform public.jt_place_save('Tempat Tanpa Kunci', 'x', 0.8, 100.6, 'pendek'); insert into _t values ('P9 tanpa kunci valid ditolak', false, 'lolos!'); exception when others then insert into _t values ('P9 tanpa kunci valid ditolak', true, sqlerrm); end;
  begin perform public.jt_owner_places(kn); insert into _t values ('P10 non-owner tidak bisa lihat daftar', false, 'lolos!'); exception when others then insert into _t values ('P10 non-owner tidak bisa lihat daftar', true, sqlerrm); end;
  select id into pid from public.jt_places where lower(name) = 'pasar ujungbatu';
  begin perform public.jt_owner_place_del(pid, kn); insert into _t values ('P11 non-owner tidak bisa hapus', false, 'lolos!'); exception when others then insert into _t values ('P11 non-owner tidak bisa hapus', true, sqlerrm); end;
  perform public.jt_owner_place_del(pid, ko);
  insert into _t values ('P12 owner bisa hapus', not exists (select 1 from public.jt_places where id = pid), '');
  select count(*) into n from public.jt_audit where action = 'place.delete' and actor = 'zz_test_owner';
  insert into _t values ('P13 hapus tercatat di audit', n = 1, n::text);
  insert into _t select 'P14 tabel tertutup untuk anon/authenticated', not (has_table_privilege('anon', 'public.jt_places', 'select') or has_table_privilege('authenticated', 'public.jt_places', 'select')), '';
  insert into _t values ('P15 kata kunci abaikan spasi/titik/urutan', jsonb_array_length(public.jt_place_search('sd 010', null, null)) = 1 and jsonb_array_length(public.jt_place_search('ujung batu pasar', null, null)) >= 1 and jsonb_array_length(public.jt_place_search('x', null, null)) = 0, '');
  select string_agg(case when ok then 'PASS ' else 'FAIL ' end || tn || coalesce(' [' || left(info, 80) || ']', ''), E'\n' order by tn) into res from _t;
  raise exception 'RESULT %', E'\n' || res;
end $tests$;
