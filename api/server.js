/* JAGA Portal API — Node.js + PostgreSQL (Helipod)
   Env: DATABASE_URL (wajib), TOKEN_SECRET (wajib, acak ≥32 karakter),
        ALLOWED_ORIGINS (opsional, dipisah koma), PORT (diisi Helipod) */
'use strict';
const http = require('http');
const crypto = require('crypto');
const { Pool } = require('pg');
const SEED_ACCOUNTS = require('./accounts.json');

const PORT = +process.env.PORT || 8080;
const SECRET = process.env.TOKEN_SECRET || '';
const ORIGINS = (process.env.ALLOWED_ORIGINS || 'https://jagapatner.my.id,https://www.jagapatner.my.id')
  .split(',').map(s => s.trim()).filter(Boolean);
if (!process.env.DATABASE_URL) { console.error('DATABASE_URL belum diisi'); process.exit(1); }
if (SECRET.length < 32) { console.error('TOKEN_SECRET belum diisi (min. 32 karakter)'); process.exit(1); }

const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5, idleTimeoutMillis: 30000 });
const q = (text, params) => pool.query(text, params).then(r => r.rows);

const REGIONS = ['Bali', 'Lombok', 'Yogyakarta'];
const STATUSES = ['Baru', 'Dijadwalkan', 'Berjalan', 'Selesai', 'Batal'];
const SOP_DEFAULT = ['Lepas & ganti seluruh linen', 'Vacuum & pel seluruh lantai', 'Sanitasi kamar mandi & toilet', 'Lap debu furnitur & dekorasi', 'Bersihkan dapur & peralatan', 'Restock amenitas & air mineral', 'Cek AC, lampu, & remote', 'Foto sebelum–sesudah per ruangan', 'Kunci & serahkan laporan'].map(t => [t, 0]);

/* ---------- schema ---------- */
async function migrate() {
  const stmts = [
    `CREATE TABLE IF NOT EXISTS accounts(id text PRIMARY KEY, name text NOT NULL, role text NOT NULL, region text NOT NULL, salt text NOT NULL, hash text NOT NULL, active boolean NOT NULL DEFAULT true)`,
    `CREATE SEQUENCE IF NOT EXISTS booking_seq START 2401`,
    `CREATE TABLE IF NOT EXISTS bookings(id text PRIMARY KEY, klien text NOT NULL, telp text NOT NULL DEFAULT '', wilayah text NOT NULL, properti text NOT NULL DEFAULT '', layanan text NOT NULL DEFAULT '', tanggal text NOT NULL, jam text NOT NULL DEFAULT '09:00', status text NOT NULL DEFAULT 'Baru', petugas text NOT NULL DEFAULT '-', nilai bigint NOT NULL DEFAULT 0, catatan text NOT NULL DEFAULT '', sumber text NOT NULL DEFAULT 'portal', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now())`,
    `CREATE INDEX IF NOT EXISTS bookings_wilayah ON bookings(wilayah)`,
    `CREATE SEQUENCE IF NOT EXISTS staff_seq START 101`,
    `CREATE TABLE IF NOT EXISTS staff(id text PRIMARY KEY, nama text NOT NULL, peran text NOT NULL, wilayah text NOT NULL, shift text NOT NULL DEFAULT 'Pagi', aktif boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now())`,
    `CREATE TABLE IF NOT EXISTS sop(id int PRIMARY KEY, steps jsonb NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS audit(id bigserial PRIMARY KEY, at timestamptz NOT NULL DEFAULT now(), actor text NOT NULL, action text NOT NULL, ref text NOT NULL DEFAULT '')`,
  ];
  for (const s of stmts) await q(s);
  for (const a of SEED_ACCOUNTS)
    await q(`INSERT INTO accounts(id,name,role,region,salt,hash) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT (id) DO NOTHING`, [a.id, a.name, a.role, a.region, a.salt, a.hash]);
  await q(`INSERT INTO sop(id,steps) VALUES(1,$1::jsonb) ON CONFLICT (id) DO NOTHING`, [JSON.stringify(SOP_DEFAULT)]);
}

/* ---------- token (HMAC) ---------- */
const b64u = b => Buffer.from(b).toString('base64url');
function sign(p) { const body = b64u(JSON.stringify(p)); return body + '.' + crypto.createHmac('sha256', SECRET).update(body).digest('base64url'); }
function verify(tok) {
  if (!tok || !tok.includes('.')) return null;
  const [body, sig] = tok.split('.');
  const good = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
  if (sig.length !== good.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(good))) return null;
  try { const p = JSON.parse(Buffer.from(body, 'base64url').toString()); return p.exp > Date.now() ? p : null; } catch { return null; }
}
const pbkdf2 = (code, salt) => new Promise((res, rej) => crypto.pbkdf2(code, Buffer.from(salt, 'hex'), 150000, 32, 'sha256', (e, k) => e ? rej(e) : res(k.toString('hex'))));

/* ---------- rate limit ---------- */
const hits = new Map();
function limited(key, max, windowMs) {
  const now = Date.now(), h = (hits.get(key) || []).filter(t => now - t < windowMs);
  h.push(now); hits.set(key, h); return h.length > max;
}
setInterval(() => { const now = Date.now(); for (const [k, v] of hits) if (!v.some(t => now - t < 600000)) hits.delete(k); }, 60000).unref();

/* ---------- helpers ---------- */
class HttpErr extends Error { constructor(code, msg) { super(msg); this.code = code; } }
const str = (v, max = 200) => String(v ?? '').trim().slice(0, max);
const isDate = v => /^\d{4}-\d{2}-\d{2}$/.test(v);
function bookingInput(d, partial) {
  const o = {};
  const set = (k, v) => { if (!partial || d[k] !== undefined) o[k] = v; };
  set('klien', str(d.klien, 120)); set('telp', str(d.telp, 40)); set('wilayah', str(d.wilayah, 20));
  set('properti', str(d.properti, 60)); set('layanan', str(d.layanan, 80)); set('tanggal', str(d.tanggal, 10));
  set('jam', str(d.jam, 5) || '09:00'); set('status', str(d.status, 20) || 'Baru'); set('petugas', str(d.petugas, 80) || '-');
  set('nilai', Math.max(0, Math.min(1e12, Math.round(+d.nilai || 0)))); set('catatan', str(d.catatan, 1000));
  if ('klien' in o && !o.klien) throw new HttpErr(400, 'Nama klien wajib diisi');
  if ('wilayah' in o && !REGIONS.includes(o.wilayah)) throw new HttpErr(400, 'Wilayah tidak valid');
  if ('tanggal' in o && !isDate(o.tanggal)) throw new HttpErr(400, 'Tanggal tidak valid');
  if ('status' in o && !STATUSES.includes(o.status)) throw new HttpErr(400, 'Status tidak valid');
  if ('jam' in o && !/^\d{2}:\d{2}$/.test(o.jam)) throw new HttpErr(400, 'Jam tidak valid');
  return o;
}
const canRegion = (u, r) => u.role === 'admin' || u.region === r;
const audit = (u, action, ref) => q(`INSERT INTO audit(actor,action,ref) VALUES($1,$2,$3)`, [u.id, action, ref || '']).catch(() => {});
const BOOK_COLS = `id,klien,telp,wilayah,properti,layanan,tanggal,jam,status,petugas,nilai::float8 AS nilai,catatan,sumber`;
const STAFF_COLS = `id,nama,peran,wilayah,shift,aktif`;

/* ---------- routes ---------- */
async function route(req, u, method, path, body, ip) {
  if (method === 'GET' && path === '/health') { await q('SELECT 1'); return { ok: true }; }

  if (method === 'POST' && path === '/login') {
    if (limited('login:' + ip, 5, 60000)) throw new HttpErr(429, 'Terlalu banyak percobaan. Tunggu 60 detik.');
    const code = str(body.code, 20).toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (code.length !== 12) throw new HttpErr(400, 'Kode akses terdiri dari 12 karakter.');
    for (const a of await q(`SELECT * FROM accounts WHERE active`)) {
      const h = await pbkdf2(code, a.salt);
      if (crypto.timingSafeEqual(Buffer.from(h), Buffer.from(a.hash))) {
        hits.delete('login:' + ip);
        const user = { id: a.id, name: a.name, role: a.role, region: a.region };
        await audit(user, 'login');
        return { token: sign({ ...user, exp: Date.now() + 12 * 3600e3 }), user };
      }
    }
    throw new HttpErr(401, 'Kode akses tidak valid.');
  }

  /* formulir publik (website) → pesanan Baru */
  if (method === 'POST' && path === '/public/request') {
    if (limited('pub:' + ip, 5, 600000)) throw new HttpErr(429, 'Terlalu banyak permintaan. Coba lagi nanti.');
    if (str(body.website)) return { ok: true };            // honeypot
    const d = bookingInput({ klien: body.nama, telp: body.telp, wilayah: body.wilayah, properti: body.properti, layanan: body.layanan, tanggal: body.tanggal, catatan: body.catatan, status: 'Baru' }, false);
    if (d.telp.replace(/\D/g, '').length < 8) throw new HttpErr(400, 'Nomor telepon tidak valid');
    const [{ id }] = await q(`SELECT 'JG-' || nextval('booking_seq') AS id`);
    await q(`INSERT INTO bookings(id,klien,telp,wilayah,properti,layanan,tanggal,jam,status,petugas,nilai,catatan,sumber) VALUES($1,$2,$3,$4,$5,$6,$7,'09:00','Baru','-',0,$8,$9)`,
      [id, d.klien, d.telp, d.wilayah, d.properti, d.layanan, d.tanggal, d.catatan, str(body.sumber, 20) === 'properti' ? 'properti' : 'web']);
    return { ok: true, id };
  }

  /* ---- butuh login ---- */
  if (!u) throw new HttpErr(401, 'Sesi berakhir. Silakan masuk lagi.');
  const reg = u.role === 'admin' ? null : u.region;

  if (method === 'GET' && path === '/me') return { user: { id: u.id, name: u.name, role: u.role, region: u.region } };

  if (method === 'GET' && path === '/data') {
    const bookings = await q(`SELECT ${BOOK_COLS} FROM bookings ${reg ? 'WHERE wilayah=$1' : ''} ORDER BY tanggal DESC, id DESC`, reg ? [reg] : []);
    const staff = await q(`SELECT ${STAFF_COLS} FROM staff ${reg ? 'WHERE wilayah=$1' : ''} ORDER BY wilayah, nama`, reg ? [reg] : []);
    const [s] = await q(`SELECT steps FROM sop WHERE id=1`);
    return { bookings, staff, sop: s ? s.steps : SOP_DEFAULT };
  }

  if (method === 'POST' && path === '/bookings') {
    const d = bookingInput(body, false);
    if (!canRegion(u, d.wilayah)) throw new HttpErr(403, 'Tidak boleh menambah pesanan wilayah lain');
    const [{ id }] = await q(`SELECT 'JG-' || nextval('booking_seq') AS id`);
    const [row] = await q(`INSERT INTO bookings(id,klien,telp,wilayah,properti,layanan,tanggal,jam,status,petugas,nilai,catatan) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING ${BOOK_COLS}`,
      [id, d.klien, d.telp, d.wilayah, d.properti, d.layanan, d.tanggal, d.jam, d.status, d.petugas, d.nilai, d.catatan]);
    await audit(u, 'booking.create', id); return row;
  }

  let m;
  if ((m = path.match(/^\/bookings\/(JG-\d+)$/))) {
    const [cur] = await q(`SELECT wilayah FROM bookings WHERE id=$1`, [m[1]]);
    if (!cur) throw new HttpErr(404, 'Pesanan tidak ditemukan');
    if (!canRegion(u, cur.wilayah)) throw new HttpErr(403, 'Tidak boleh mengubah pesanan wilayah lain');
    if (method === 'DELETE') { await q(`DELETE FROM bookings WHERE id=$1`, [m[1]]); await audit(u, 'booking.delete', m[1]); return { ok: true }; }
    if (method === 'PUT') {
      const d = bookingInput(body, true);
      if (d.wilayah && !canRegion(u, d.wilayah)) throw new HttpErr(403, 'Tidak boleh memindah ke wilayah lain');
      const keys = Object.keys(d); if (!keys.length) throw new HttpErr(400, 'Tidak ada perubahan');
      const [row] = await q(`UPDATE bookings SET ${keys.map((k, i) => `${k}=$${i + 2}`).join(',')}, updated_at=now() WHERE id=$1 RETURNING ${BOOK_COLS}`, [m[1], ...keys.map(k => d[k])]);
      await audit(u, 'booking.update', m[1]); return row;
    }
  }

  if (method === 'POST' && path === '/staff') {
    const d = { nama: str(body.nama, 80), peran: str(body.peran, 40) || 'Housekeeper', wilayah: str(body.wilayah, 20), shift: str(body.shift, 20) || 'Pagi' };
    if (!d.nama) throw new HttpErr(400, 'Nama wajib diisi');
    if (!REGIONS.includes(d.wilayah)) throw new HttpErr(400, 'Wilayah tidak valid');
    if (!canRegion(u, d.wilayah)) throw new HttpErr(403, 'Tidak boleh menambah staf wilayah lain');
    const [{ id }] = await q(`SELECT 'S' || nextval('staff_seq') AS id`);
    const [row] = await q(`INSERT INTO staff(id,nama,peran,wilayah,shift) VALUES($1,$2,$3,$4,$5) RETURNING ${STAFF_COLS}`, [id, d.nama, d.peran, d.wilayah, d.shift]);
    await audit(u, 'staff.create', id); return row;
  }
  if ((m = path.match(/^\/staff\/(S\d+)$/))) {
    const [cur] = await q(`SELECT wilayah FROM staff WHERE id=$1`, [m[1]]);
    if (!cur) throw new HttpErr(404, 'Staf tidak ditemukan');
    if (!canRegion(u, cur.wilayah)) throw new HttpErr(403, 'Tidak boleh mengubah staf wilayah lain');
    if (method === 'DELETE') { await q(`DELETE FROM staff WHERE id=$1`, [m[1]]); await audit(u, 'staff.delete', m[1]); return { ok: true }; }
    if (method === 'PUT') {
      const [row] = await q(`UPDATE staff SET aktif=$2 WHERE id=$1 RETURNING ${STAFF_COLS}`, [m[1], !!body.aktif]);
      await audit(u, 'staff.update', m[1]); return row;
    }
  }

  if (method === 'PUT' && path === '/sop') {
    const steps = Array.isArray(body.steps) ? body.steps.slice(0, 40).map(x => [str(x[0], 120), x[1] ? 1 : 0]).filter(x => x[0]) : null;
    if (!steps || !steps.length) throw new HttpErr(400, 'Checklist tidak valid');
    await q(`UPDATE sop SET steps=$1::jsonb WHERE id=1`, [JSON.stringify(steps)]);
    return { ok: true };
  }

  if (method === 'POST' && path === '/admin/reset') {
    if (u.role !== 'admin') throw new HttpErr(403, 'Khusus Admin');
    if (body.confirm !== 'HAPUS SEMUA') throw new HttpErr(400, 'Konfirmasi tidak cocok');
    await q(`DELETE FROM bookings`); await q(`DELETE FROM staff`);
    await q(`UPDATE sop SET steps=$1::jsonb WHERE id=1`, [JSON.stringify(SOP_DEFAULT)]);
    await audit(u, 'admin.reset'); return { ok: true };
  }

  throw new HttpErr(404, 'Tidak ditemukan');
}

/* ---------- server ---------- */
const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin || '';
  const allowed = ORIGINS.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', Vary: 'Origin' };
  if (allowed) Object.assign(headers, { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Authorization,Content-Type', 'Access-Control-Max-Age': '600' });
  const send = (code, obj) => { res.writeHead(code, headers); res.end(JSON.stringify(obj)); };
  if (req.method === 'OPTIONS') { res.writeHead(204, headers); return res.end(); }
  const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
  try {
    let raw = '';
    for await (const c of req) { raw += c; if (raw.length > 64 * 1024) throw new HttpErr(413, 'Data terlalu besar'); }
    let body = {};
    if (raw) { try { body = JSON.parse(raw); } catch { throw new HttpErr(400, 'JSON tidak valid'); } }
    const tok = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    const u = verify(tok);
    const path = new URL(req.url, 'http://x').pathname.replace(/\/+$/, '') || '/';
    if (path === '/') return send(200, { name: 'JAGA Portal API', ok: true });
    send(200, await route(req, u, req.method, path, body, ip));
  } catch (e) {
    if (!(e instanceof HttpErr)) console.error(e);
    send(e.code || 500, { error: e instanceof HttpErr ? e.message : 'Terjadi kesalahan server' });
  }
});

migrate().then(() => server.listen(PORT, '0.0.0.0', () => console.log('JAGA API berjalan di port ' + PORT)))
  .catch(e => { console.error('Gagal menyiapkan database:', e.message); process.exit(1); });
