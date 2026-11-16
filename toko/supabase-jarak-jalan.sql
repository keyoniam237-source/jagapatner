-- Jarak lewat jalan untuk ongkir & tarif Jago (diterapkan sebagai migrasi jarak_lewat_jalan_untuk_tarif).
-- HP mengirim roadDist (dari Google Routes / OpenStreetMap). Server hanya menerimanya bila
-- >= jarak garis lurus dan <= 3x garis lurus + 1 km; di luar itu tetap garis lurus.
create or replace function public.jt_road(p_straight double precision, p_claim text)
returns double precision language plpgsql immutable set search_path to 'public' as $$
declare c double precision;
begin
  if p_claim is null or p_claim !~ '^\d{1,6}(\.\d+)?$' then return p_straight; end if;
  c := p_claim::double precision;
  if c < p_straight or c > p_straight * 3 + 1000 then return p_straight; end if;
  return c;
end $$;
-- jt_order_create: setelah v_dist := jt_dist(...) ditambah  v_dist := public.jt_road(v_dist, p_data->>'roadDist');
-- jt_ride_create : setelah cek jarak maksimal 50 km ditambah v_d := public.jt_road(v_d, p_data->>'roadDist');
