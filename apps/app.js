/* ============ Konfigurasi ============ */
const CATS = ["Makanan","Minuman","Sembako"]; // tahap awal: kategori lain (Sayur & Buah, Rumah Tangga, Fashion, Handphone, Laptop, Game) disembunyikan dulu
const CAT_ALIAS = {"Elektronik":"Handphone"};
const visibleStore = s => s.active !== false && CATS.includes(s.category) && regionOk(s);
const ICONS = {"utensils": "<path d=\"M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2\"/><path d=\"M7 2v20\"/><path d=\"M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7\"/>", "cup": "<path d=\"m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8\"/><path d=\"M5 8h14\"/><path d=\"M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0\"/><path d=\"m12 8 1-6h2\"/>", "basket": "<path d=\"m15 11-1 9\"/><path d=\"m19 11-4-7\"/><path d=\"M2 11h20\"/><path d=\"m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4\"/><path d=\"M4.5 15.5h15\"/><path d=\"m5 11 4-7\"/><path d=\"m9 11 1 9\"/>", "leaf": "<path d=\"M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z\"/><path d=\"M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12\"/>", "shirt": "<path d=\"M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z\"/>", "phone": "<rect width=\"14\" height=\"20\" x=\"5\" y=\"2\" rx=\"2\"/><path d=\"M12 18h.01\"/>", "health": "<path d=\"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z\"/><path d=\"M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27\"/>", "sofa": "<path d=\"M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3\"/><path d=\"M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z\"/><path d=\"M4 18v2M20 18v2M12 4v9\"/>", "hammer": "<path d=\"m15 12-8.373 8.373a1 1 0 1 1-3-3L12 9\"/><path d=\"m18 15 4-4\"/><path d=\"m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172V7l-2.26-2.26a6 6 0 0 0-4.202-1.756L9 2.96l.92.82A6.18 6.18 0 0 1 12 8.4V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5\"/>", "wrench": "<path d=\"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z\"/>", "package": "<path d=\"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z\"/><path d=\"M12 22V12\"/><path d=\"m3.3 7 8.7 5 8.7-5\"/><path d=\"m7.5 4.27 9 5.15\"/>", "grid": "<rect width=\"7\" height=\"7\" x=\"3\" y=\"3\" rx=\"1.5\"/><rect width=\"7\" height=\"7\" x=\"14\" y=\"3\" rx=\"1.5\"/><rect width=\"7\" height=\"7\" x=\"14\" y=\"14\" rx=\"1.5\"/><rect width=\"7\" height=\"7\" x=\"3\" y=\"14\" rx=\"1.5\"/>", "home": "<path d=\"M3 10.5 12 3l9 7.5\"/><path d=\"M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5\"/>", "cart": "<path d=\"M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L20 8H6.2\"/><circle cx=\"9.5\" cy=\"20\" r=\"1.4\"/><circle cx=\"17\" cy=\"20\" r=\"1.4\"/>", "receipt": "<path d=\"M6 3h12v18l-3-2-3 2-3-2-3 2z\"/><path d=\"M9 8h6M9 12h6\"/>", "store": "<path d=\"M3 9.5 4.6 4h14.8L21 9.5\"/><path d=\"M3 9.5a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0\"/><path d=\"M5 12.5V20h14v-7.5\"/><path d=\"M10 20v-4h4v4\"/>", "bag": "<path d=\"M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z\"/><path d=\"M3 6h18\"/><path d=\"M16 10a4 4 0 0 1-8 0\"/>", "dashboard": "<rect width=\"7\" height=\"9\" x=\"3\" y=\"3\" rx=\"1.5\"/><rect width=\"7\" height=\"5\" x=\"14\" y=\"3\" rx=\"1.5\"/><rect width=\"7\" height=\"9\" x=\"14\" y=\"12\" rx=\"1.5\"/><rect width=\"7\" height=\"5\" x=\"3\" y=\"16\" rx=\"1.5\"/>", "chart": "<path d=\"m22 7-8.5 8.5-5-5L2 17\"/><path d=\"M16 7h6v6\"/>", "settings": "<path d=\"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/>", "truck": "<path d=\"M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2\"/><path d=\"M15 18H9\"/><path d=\"M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14\"/><circle cx=\"17\" cy=\"18\" r=\"2\"/><circle cx=\"7\" cy=\"18\" r=\"2\"/>", "pin": "<path d=\"M20 10c0 4.99-5.54 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.19 4 14.99 4 10a8 8 0 0 1 16 0\"/><circle cx=\"12\" cy=\"10\" r=\"3\"/>", "card": "<rect width=\"20\" height=\"14\" x=\"2\" y=\"5\" rx=\"2\"/><path d=\"M2 10h20\"/><path d=\"M6 15h4\"/>", "search": "<circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"m20 20-3.5-3.5\"/>", "loader": "<path d=\"M21 12a9 9 0 1 1-6.22-8.56\"/>", "chat": "<path d=\"M7.9 20A9 9 0 1 0 4 16.1L2 22Z\"/>", "eye": "<path d=\"M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/>", "clock": "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 6v6l4 2\"/>", "cash": "<rect width=\"20\" height=\"12\" x=\"2\" y=\"6\" rx=\"2\"/><circle cx=\"12\" cy=\"12\" r=\"2\"/><path d=\"M6 12h.01M18 12h.01\"/>", "checkc": "<path d=\"M21.8 10A10 10 0 1 1 17 3.34\"/><path d=\"m9 11 3 3L22 4\"/>", "badge": "<path d=\"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z\"/><path d=\"m9 12 2 2 4-4\"/>", "percent": "<path d=\"M19 5 5 19\"/><circle cx=\"6.5\" cy=\"6.5\" r=\"2.5\"/><circle cx=\"17.5\" cy=\"17.5\" r=\"2.5\"/>", "plus": "<path d=\"M5 12h14M12 5v14\"/>", "megaphone": "<path d=\"m3 11 18-5v12L3 14v-3z\"/><path d=\"M11.6 16.8a3 3 0 1 1-5.8-1.6\"/>", "coffee": "<path d=\"M10 2v2M14 2v2M6 2v2\"/><path d=\"M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1\"/>", "inbox": "<path d=\"M22 12h-6l-2 3h-4l-2-3H2\"/><path d=\"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z\"/>", "note": "<path d=\"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z\"/><path d=\"M14 2v4a2 2 0 0 0 2 2h4\"/><path d=\"M10 13H8M16 17H8\"/>", "sparkles": "<path d=\"M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z\"/>", "camera": "<path d=\"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z\"/><circle cx=\"12\" cy=\"13\" r=\"3\"/>", "image": "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\"/><circle cx=\"9\" cy=\"9\" r=\"2\"/><path d=\"m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21\"/>", "qr": "<rect width=\"5\" height=\"5\" x=\"3\" y=\"3\" rx=\"1\"/><rect width=\"5\" height=\"5\" x=\"16\" y=\"3\" rx=\"1\"/><rect width=\"5\" height=\"5\" x=\"3\" y=\"16\" rx=\"1\"/><path d=\"M21 16h-3a2 2 0 0 0-2 2v3M21 21v.01M12 7v3a2 2 0 0 1-2 2H7M3 12h.01M12 3h.01M12 16v.01M16 12h1M21 12v.01M12 21v-1\"/>"};
ICONS.laptop = '<path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/>';
ICONS.gamepad = '<path d="M6 11h4M8 9v4M15 12h.01M18 10h.01"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258A4 4 0 0 0 17.32 5z"/>';
function I(n, cls){ return '<svg class="ic ic-'+n+(cls?' '+cls:'')+'" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(ICONS[n]||ICONS.package)+'</svg>'; }
const CAT_ICON = {"Makanan":I("utensils"),"Minuman":I("cup"),"Sembako":I("basket"),"Sayur & Buah":I("leaf"),"Rumah Tangga":I("sofa"),"Fashion":I("shirt"),"Handphone":I("phone"),"Laptop":I("laptop"),"Game":I("gamepad")};
const COLORS = ["#2f6bff","#1aa3d9","#4f46e5","#0ea5a4","#3b82f6","#6366f1","#0284c7","#2563eb"];
const EWALLETS = ["DANA","OVO","GoPay","ShopeePay","LinkAja"];
const STATUS = {
  menunggu_pembayaran:{l:"Menunggu pembayaran",c:"warn"},
  menunggu_konfirmasi:{l:"Menunggu konfirmasi toko",c:"blue"},
  diproses:{l:"Sedang diproses",c:"blue"},
  mencari_driver:{l:"Mencari driver",c:"blue"},
  driver_ke_toko:{l:"Driver menuju toko",c:"blue"},
  diantar:{l:"Sedang diantar",c:""},
  driver_jemput:{l:"Driver menjemput",c:"blue"},
  dalam_perjalanan:{l:"Dalam perjalanan",c:""},
  selesai:{l:"Selesai",c:""},
  dibatalkan:{l:"Dibatalkan",c:"red"}
};
/* komisi JAGA bisa diatur owner (default 3%). Server yang menghitung; angka di sini hanya tampilan. */
let BAGI_HASIL = 0.03, COMM = {storePct:3, drvPct:3, minTx:0, round:1};
const commCalc = (base, kind) => { base = Number(base) || 0; if(base <= 0 || base < COMM.minTx) return 0; const pct = (kind === "store" ? COMM.storePct : COMM.drvPct) / 100, st = COMM.round || 1; return Math.round(Math.round(base * pct / st) * st); };
const fmtPct = v => String(Math.round(v * 100) / 100).replace(".", ",");
function applyComm(c){ if(!c) return; COMM = {storePct:+c.storePct >= 0 ? +c.storePct : 3, drvPct:+c.drvPct >= 0 ? +c.drvPct : 3, minTx:+c.minTx || 0, round:+c.round || 1}; BAGI_HASIL = COMM.storePct / 100; JAGO_FEE = COMM.drvPct / 100; }
const shareOf = o => commCalc(o.total, "store");
const FLOW = ["menunggu_pembayaran","menunggu_konfirmasi","mencari_driver","driver_ke_toko","diantar","selesai"];
const FLOW_COD = ["menunggu_konfirmasi","mencari_driver","driver_ke_toko","diantar","selesai"];
const STEP_L = {menunggu_pembayaran:"Bayar", menunggu_konfirmasi:"Konfirmasi toko", mencari_driver:"Cari driver", driver_ke_toko:"Ke toko", diantar:"Diantar", selesai:"Selesai"};
const ONGKIR_PER = 2000, ONGKIR_STEP = 500; // ongkir driver: Rp2.000 per 500 m dari toko ke pembeli (bisa nego)
const ONGKIR_LBL = "Rp2.000/500 m";
const ongkirByDist = m => Math.max(1, Math.ceil((Number(m)||0) / ONGKIR_STEP)) * ONGKIR_PER;
const locOk = x => !!x && typeof x.lat === "number" && typeof x.lng === "number";
const ongkirEstOf = o => typeof o.ongkirEst === "number" ? o.ongkirEst : (locOk(o.storeLoc) && locOk(o.buyer) ? ongkirByDist(distM(o.storeLoc, o.buyer)) : null);
const ongkirDistOf = o => typeof o.ongkirDist === "number" ? o.ongkirDist : (locOk(o.storeLoc) && locOk(o.buyer) ? Math.round(distM(o.storeLoc, o.buyer)) : null);
const kmTxt = m => m == null ? "" : m < 1000 ? Math.round(m) + " m" : (m/1000).toFixed(1).replace(".", ",") + " km";

/* ============ State ============ */
const S = {
  view:"home", storeId:null, orderId:null, cat:"Semua", q:"",
  stores:[], orders:[], products:{}, ready:{stores:false,orders:false},
  cart:{storeId:null, items:{}}, payChoice:null,
  sellerStoreId:null, sellerTab:"pesanan", orderFilter:"aktif", buyerTab:"aktif",
  mode:"loading", slow:false
};
let ME = "pengguna-lokal";
S.slide = 0; S.prodId = null;
const APP_URL = /claude|anthropic|usercontent|sandbox/i.test(location.hostname) ? "https://claude.ai/artifact/VyNRPTbnBxQvw5BAKSvwq8" : (location.href || "").split("#")[0];
const MITRA_URL = APP_URL + "#mitra";
const CONTACT = {wa:"0882005837975", email:"", office:""};
function modeFromHash(){ let hsh = ""; try{ hsh = location.hash; }catch(e){} return hsh === "#mitra" ? "seller" : hsh === "#driver" ? "driver" : hsh === "#owner" ? "owner" : "buyer"; }
S.role = modeFromHash();
function saveMode(){ try{ if(!/^#toko-/.test(location.hash)) localStorage.setItem("jt_last_mode", S.role); }catch(_){} }
saveMode();
S.view = S.role === "seller" ? "seller" : S.role === "driver" ? "driver" : S.role === "owner" ? "owner" : "home";
if(S.role === "buyer"){ try{ if(!localStorage.getItem("jt_onb")) S.view = "login"; }catch(e){} }
S.sellerTab = (function(){ try{ return localStorage.getItem("jt_seller_tab") || "ringkasan"; }catch(_){ return "ringkasan"; } })();
let DB = null;
let prodUnsub = null, prodUnsubFor = null;

try{ const c = JSON.parse(localStorage.getItem("st_cart")||"null"); if(c && c.items) S.cart = c; }catch(e){}
function saveCart(){ try{ localStorage.setItem("st_cart", JSON.stringify(S.cart)); }catch(e){} }

/* ============ Penyimpanan (database bersama, atau mode demo lokal) ============ */
const CFG = window.JAGA_TOKO_CONFIG || {};
let SB = null;
try{ if(CFG.supabaseUrl && CFG.supabaseAnonKey && window.supabase) SB = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey); }catch(e){ SB = null; }
const LKEY = "jt_demo_data";
const local = {data:{}, subs:[]};
try{ local.data = JSON.parse(localStorage.getItem(LKEY) || "{}") || {}; }catch(e){ local.data = {}; }
function localSave(){ try{ localStorage.setItem(LKEY, JSON.stringify(local.data)); }catch(e){} }
const parentOf = p => p.split("/").slice(0,-1).join("/");
function deepMerge(a, b){
  const out = Object.assign({}, a);
  for(const k in b){ const v = b[k]; out[k] = (v && typeof v === "object" && !Array.isArray(v) && a && typeof a[k] === "object" && a[k] && !Array.isArray(a[k])) ? deepMerge(a[k], v) : v; }
  return out;
}
function sbErr(error){
  const msg = (error && error.message) || "gagal";
  const e = new Error(msg);
  e.code = /size|too large|payload/i.test(msg) ? "invalid_argument" : (error && (error.code === "P0001" || /^[A-Z][a-z]/.test(msg)) && !/fetch|network/i.test(msg)) ? "server" : "unavailable";
  return e;
}
/* ============ Login tetap tersimpan: cadangan data login di IndexedDB + minta penyimpanan permanen ============ */
const VAULT_KEYS = ["jt_key", "st_buyer", "jt_onb", "jt_home_role", "jt_last_mode"];
const VAULT = (() => {
  let dbp = null;
  const db = () => dbp || (dbp = new Promise((res, rej) => { try{ const r = indexedDB.open("jaga-vault", 1); r.onupgradeneeded = () => r.result.createObjectStore("kv"); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }catch(e){ rej(e); } }));
  const tx = (mode, fn) => db().then(d => new Promise((res, rej) => { const t = d.transaction("kv", mode), st = t.objectStore("kv"), out = fn(st); t.oncomplete = () => res(out && out.result); t.onerror = () => rej(t.error); }));
  return {
    put(k, v){ return tx("readwrite", st => v == null ? st.delete(k) : st.put(String(v), k)).catch(() => {}); },
    all(){ return db().then(d => new Promise(res => { const out = {}, t = d.transaction("kv", "readonly"), c = t.objectStore("kv").openCursor(); c.onsuccess = () => { const cur = c.result; if(cur){ out[cur.key] = cur.value; cur.continue(); } else res(out); }; c.onerror = () => res(out); })).catch(() => ({})); }
  };
})();
let VAULT_READY = false;
try{
  const _set = Storage.prototype.setItem, _rm = Storage.prototype.removeItem;
  Storage.prototype.setItem = function(k, v){ _set.call(this, k, v); if(VAULT_READY && this === window.localStorage && VAULT_KEYS.includes(k)) VAULT.put(k, v); };
  Storage.prototype.removeItem = function(k){ _rm.call(this, k); if(VAULT_READY && this === window.localStorage && VAULT_KEYS.includes(k)) VAULT.put(k, null); };
}catch(_){}
let VAULT_FRESH = false; try{ VAULT_FRESH = !localStorage.getItem("jt_key"); }catch(_){ VAULT_FRESH = true; }
VAULT.all().then(saved => {
  let restored = false;
  VAULT_KEYS.forEach(k => { let cur = null; try{ cur = localStorage.getItem(k); }catch(_){}
    if(saved[k] != null && (cur == null || (k === "jt_key" && VAULT_FRESH && cur !== saved[k]))){ try{ Storage.prototype.setItem.call(localStorage, k, saved[k]); restored = true; }catch(_){} }
    else if(cur != null && saved[k] !== cur) VAULT.put(k, cur); });
  VAULT_READY = true;
  if(restored && VAULT_FRESH && saved.jt_key){ try{ if(sessionStorage.getItem("jt_vault_reload") !== "1"){ sessionStorage.setItem("jt_vault_reload", "1"); location.reload(); } }catch(_){} }
});
try{ if(navigator.storage && navigator.storage.persist) navigator.storage.persisted().then(p => { if(!p) navigator.storage.persist(); }).catch(() => {}); }catch(_){}
/* Kunci akses perangkat: membuktikan kepemilikan toko & pesanan ke server (tidak pernah ditampilkan ke orang lain) */
let KEY = "";
try{ KEY = localStorage.getItem("jt_key") || ""; }catch(e){}
if(!KEY || KEY.length < 20){
  const a = new Uint8Array(24); (window.crypto || {getRandomValues: x => x.map(() => Math.random()*256|0)}).getRandomValues(a);
  KEY = "jt" + Array.from(a, b => b.toString(16).padStart(2,"0")).join("");
  try{ localStorage.setItem("jt_key", KEY); }catch(e){}
}
S.myStoreIds = null;
let ORD_REFRESH = null;
async function refreshMyStores(){
  if(!SB) return;
  const { data, error } = await SB.rpc("jt_my_stores", {p_key: KEY});
  if(!error){ S.myStoreIds = new Set((data||[]).map(x => typeof x === "string" ? x : (x.jt_my_stores || Object.values(x)[0]))); scheduleRender(); }
}
const sbStore = {
  listen(col, cb){
    let alive = true, t = null;
    if(col === "orders"){
      const load = async () => {
        const { data, error } = await SB.rpc("jt_orders", {p_key: KEY});
        if(!alive) return;
        if(error){ cb(null, false); return; }
        cb((data||[]).map(r => Object.assign({id: r.id.split("/").pop()}, r.data || {})), false);
      };
      ORD_REFRESH = load; load();
      const iv = setInterval(() => { if(!document.hidden) load(); }, 8000);
      const vis = () => { if(!document.hidden) load(); }; document.addEventListener("visibilitychange", vis);
      return () => { alive = false; clearInterval(iv); document.removeEventListener("visibilitychange", vis); };
    }
    /* hemat kuota: tiap 30 dtk hanya cek tanda waktu; data lengkap diunduh bila ada yang berubah */
    let lastSig = null;
    const sigOf = rows => rows.map(r => r.id + "@" + r.updated_at).sort().join("|");
    const load = async force => {
      if(!force && lastSig !== null){
        const { data:hd, error:he } = await SB.from("docs").select("id,updated_at").eq("col", col);
        if(!alive) return;
        if(!he && sigOf(hd) === lastSig) return;
      }
      const { data, error } = await SB.from("docs").select("id,data,updated_at").eq("col", col);
      if(!alive) return;
      if(error){ cb(null, false); return; }
      lastSig = sigOf(data);
      cb(data.map(r => Object.assign({id: r.id.split("/").pop()}, r.data || {})), false);
    };
    const soon = () => { clearTimeout(t); t = setTimeout(() => load(true), 150); };
    load(true);
    const ch = SB.channel("c:" + col + ":" + Math.random().toString(36).slice(2))
      .on("postgres_changes", {event:"*", schema:"public", table:"docs", filter:"col=eq." + col}, soon)
      .subscribe();
    const iv = setInterval(() => { if(!document.hidden) load(); }, 30000);
    return () => { alive = false; clearInterval(iv); clearTimeout(t); try{ SB.removeChannel(ch); }catch(e){} };
  },
  async rpc(fn, args){ const { data, error } = await SB.rpc(fn, Object.assign({p_key: KEY}, args)); if(error) throw sbErr(error); return data; },
  async set(path, data){
    await mediaize(data);
    if(path.startsWith("orders/")){ await this.rpc("jt_order_create", {p_id: path.slice(7), p_data: data}); if(ORD_REFRESH) await ORD_REFRESH(); return; }
    await this.rpc("jt_write", {p_op:"set", p_path:path, p_data:data});
    if(/^stores\/[^/]+$/.test(path)){ if(S.myStoreIds) S.myStoreIds.add(path.slice(7)); refreshMyStores(); }
  },
  async update(path, data){
    await mediaize(data);
    if(path.startsWith("orders/")){ await this.rpc("jt_order_update", {p_id: path.slice(7), p_data: data}); if(ORD_REFRESH) await ORD_REFRESH(); return; }
    await this.rpc("jt_write", {p_op:"update", p_path:path, p_data:data});
  },
  async del(path){ await this.rpc("jt_write", {p_op:"delete", p_path:path, p_data:null}); }
};
/* foto disimpan di Storage (sekali unduh, di-cache HP), database hanya menyimpan alamatnya */
const MEDIA_CACHE = {};
async function mediaUp(v){
  if(typeof v !== "string" || !v.startsWith("data:image/") || !SB) return v;
  if(MEDIA_CACHE[v]) return MEDIA_CACHE[v];
  try{
    const r = await fetch(String(CFG.supabaseUrl).replace(/\/$/, "") + "/functions/v1/media", {method:"POST",
      headers:{"content-type":"application/json", apikey:CFG.supabaseAnonKey, authorization:"Bearer " + CFG.supabaseAnonKey}, body:JSON.stringify({key:KEY, data:v})});
    const j = await r.json(); if(j && j.url){ MEDIA_CACHE[v] = j.url; return j.url; }
  }catch(_){}
  return v;
}
async function mediaize(d){
  if(!d || typeof d !== "object") return d;
  for(const k of ["img","logo","menuPhoto"]) if(typeof d[k] === "string" && d[k].startsWith("data:image/")) d[k] = await mediaUp(d[k]);
  if(d.pay && typeof d.pay.qris === "string" && d.pay.qris.startsWith("data:image/")) d.pay.qris = await mediaUp(d.pay.qris);
  return d;
}
function localFire(){ local.subs.forEach(s=>s.fire()); }
const store = {
  listen(col, cb){
    if(SB) return sbStore.listen(col, cb);
    if(DB){
      return DB.collection(col).onSnapshot(
        s => cb(s.docs.map(d => Object.assign({id:d.id}, d.data())), s.metadata.fromCache),
        e => { toast("Data tidak dapat dimuat ("+e.code+")"); cb(null, false); }
      );
    }
    const pre = col + "/";
    const sub = { fire(){
      const rows = Object.entries(local.data)
        .filter(([p]) => p.startsWith(pre) && !p.slice(pre.length).includes("/"))
        .map(([p,v]) => Object.assign({id:p.slice(pre.length)}, v));
      cb(rows, false);
    }};
    local.subs.push(sub); setTimeout(()=>sub.fire(), 0);
    return () => { local.subs = local.subs.filter(x => x !== sub); };
  },
  async set(path, data){
    if(SB) return sbStore.set(path, data);
    if(DB) return DB.doc(path).set(data);
    local.data[path] = JSON.parse(JSON.stringify(data)); localSave(); localFire();
  },
  async update(path, data){
    if(SB) return sbStore.update(path, data);
    if(DB) return DB.doc(path).update(data);
    local.data[path] = deepMerge(local.data[path] || {}, JSON.parse(JSON.stringify(data))); localSave(); localFire();
  },
  async del(path){
    if(SB) return sbStore.del(path);
    if(DB) return DB.doc(path).delete();
    delete local.data[path]; localSave(); localFire();
  }
};
async function safe(fn, okMsg){
  try{ await fn(); if(okMsg) toast(okMsg); return true; }
  catch(e){
    const code = e && e.code;
    if(code === "server") toast(e.message.replace(/^.*?:\s*/, "").slice(0,140));
    else if(code === "invalid_argument") toast("Tidak bisa menyimpan: akun Anda tidak punya izin menulis, atau data terlalu besar.");
    else if(code === "quota_exceeded") toast("Kapasitas penyimpanan penuh. Hapus beberapa data lama.");
    else if(code === "resource_exhausted") toast("Terlalu banyak permintaan, coba lagi sebentar.");
    else toast("Gagal menyimpan, coba lagi.");
    return false;
  }
}
function uid(prefix){ return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2,7); }

/* ============ Utilitas ============ */
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const rp = n => "Rp" + Math.round(Number(n)||0).toLocaleString("id-ID");
const fmtDate = t => { try{ return new Date(t).toLocaleString("id-ID",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}); }catch(e){ return ""; } };
const initials = n => (String(n||"?").trim().split(/\s+/).map(w=>w[0]).join("").slice(0,2) || "?").toUpperCase();
const waLink = (num, text) => { let n = String(num||"").replace(/\D/g,""); if(n.startsWith("0")) n = "62"+n.slice(1); return "https://wa.me/"+n+(text?"?text="+encodeURIComponent(text):""); };
function toast(msg){
  const el = document.getElementById("toast");
  el.innerHTML = '<div class="toast">'+esc(msg)+'</div>';
  clearTimeout(toast._t); toast._t = setTimeout(()=>{ el.innerHTML=""; }, 3200);
}
function storeById(id){ return S.stores.find(s => s.id === id); }
function myStores(){ return S.stores.filter(s => SB ? (S.myStoreIds ? S.myStoreIds.has(s.id) : false) : s.ownerId === ME).sort((a,b)=>(a.createdAt||0)-(b.createdAt||0)); }
function avatarHtml(s){ return '<div class="avatar" style="color:'+esc(s.color||"#0f7a5a")+'">'+(s.logo?'<img alt="" src="'+esc(s.logo)+'">':esc(initials(s.name)))+'</div>'; }
function payMethodsOf(s){
  if(s.managed) return [{k:"cod", l:"Bayar ke driver saat pesanan sampai"}];
  const p = s.pay || {}; const out = [];
  if(p.bank && p.bank.no) out.push({k:"bank", l:"Transfer "+(p.bank.name||"Bank")});
  (p.ewallet||[]).forEach((w,i) => { if(w.no) out.push({k:"ew"+i, l:w.type}); });
  if(p.qris) out.push({k:"qris", l:"QRIS"});
  if(p.cod) out.push({k:"cod", l:"Bayar di tempat (COD)"});
  return out;
}
function payDetail(s, k){
  const p = s.pay || {};
  if(k === "bank") return {k, type:"Transfer "+(p.bank.name||"Bank"), no:p.bank.no, holder:p.bank.holder};
  if(k === "qris") return {k, type:"QRIS", qris:p.qris};
  if(k === "cod") return {k, type:"Bayar di tempat (COD)"};
  if(k.startsWith("ew")){ const w = (p.ewallet||[])[+k.slice(2)] || {}; return {k, type:w.type, no:w.no, holder:w.holder}; }
  return {k, type:k};
}
function compressImage(file, max){
  return new Promise((res, rej) => {
    if(!file || !file.type.startsWith("image/")) return rej(new Error("bukan gambar"));
    const r = new FileReader();
    r.onload = () => {
      const img = new Image();
      img.onload = () => {
        const sc = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width*sc); c.height = Math.round(img.height*sc);
        const g = c.getContext("2d"); g.fillStyle="#fff"; g.fillRect(0,0,c.width,c.height);
        g.drawImage(img, 0, 0, c.width, c.height);
        res(c.toDataURL("image/jpeg", 0.72));
      };
      img.onerror = rej; img.src = r.result;
    };
    r.onerror = rej; r.readAsDataURL(file);
  });
}
async function copyText(t){
  try{ await navigator.clipboard.writeText(t); toast(t.length>40?"Teks disalin":"Disalin: "+t); }
  catch(e){ toast("Tidak bisa menyalin otomatis — salin manual: "+t); }
}

/* ============ Navigasi ============ */
const NAV_BUYER = [
  {v:"home", l:"Beranda", ic:I("home")},
  {v:"cart", l:"Keranjang", ic:I("cart")},
  {v:"orders", l:"Transaksi", ic:I("receipt")}
];
const IC_CART = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L20 8H6.2"/><circle cx="9.5" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/></svg>';
const IC_ORDER = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/></svg>';
const NAV_SELLER = [
  {v:"seller", t:"ringkasan", l:"Ringkasan", ic:I("dashboard")},
  {v:"seller", t:"pesanan", l:"Pesanan", ic:I("receipt")},
  {v:"seller", t:"produk", l:"Produk", ic:I("package")},
  {v:"seller", t:"laporan", l:"Laporan", ic:I("chart")},
  {v:"seller", t:"saldo", l:"Saldo", ic:I("cash")},
  {v:"seller", t:"pengaturan", l:"Pengaturan", ic:I("settings")}
];
function cartCount(){ return Object.values(S.cart.items).reduce((a,b)=>a+b.qty,0); }
function myActiveOrders(){ return S.orders.filter(o => o.buyerId===ME && !["selesai","dibatalkan"].includes(o.status)).length; }
function sellerPending(){ const ids = myStores().map(s=>s.id); return S.orders.filter(o => ids.includes(o.storeId) && ["menunggu_konfirmasi","diproses"].includes(o.status)).length; }
function renderNav(){
  const seller = S.role === "seller";
  document.body.classList.toggle("is-seller", seller);
  if(!seller){ renderAppNav(); return; }
  const curStore = seller ? (storeById(S.sellerStoreId) || myStores()[0]) : null;
  const navs = S.view === "welcome" ? [] : seller ? (isGrocer(curStore) ? NAV_SELLER.slice(0,3).concat([{v:"seller", t:"stok", l:"Stok", ic:I("basket")}], NAV_SELLER.slice(3)) : NAV_SELLER) : NAV_BUYER;
  const activeB = {home:"home", store:"home", product:"home", cart:"cart", checkout:"cart", orders:"orders", order:"orders"}[S.view];
  const isOn = n => seller ? (S.view === "seller" && S.sellerTab === n.t) || (S.view === "register" && n.t === "ringkasan") : activeB === n.v;
  const badge = n => { const c = n.v==="cart" ? cartCount() : n.v==="orders" ? myActiveOrders() : n.t==="pesanan" ? sellerPending() : 0; return c ? '<span class="badge">'+c+'</span>' : ""; };
  const attrs = n => 'data-act="nav" data-v="'+n.v+'"'+(n.t?' data-t="'+n.t+'"':'');
  document.getElementById("nav").innerHTML = navs.map(n => '<button class="'+(isOn(n)?"on":"")+'" '+attrs(n)+'>'+n.l+badge(n)+'</button>').join("");
  document.getElementById("bnav").innerHTML = navs.map(n => '<button class="'+(isOn(n)?"on":"")+'" '+attrs(n)+'><span class="ic">'+n.ic+'</span>'+n.l+badge(n)+'</button>').join("");
  document.getElementById("bnav").style.display = navs.length ? "" : "none";
  document.getElementById("roles").style.display = S.view === "welcome" ? "none" : "";
  document.getElementById("roles").innerHTML = seller
    ? '<a class="sellbtn" href="'+APP_URL+'" target="_blank" rel="noopener" aria-label="Buka JAGA">'+I("bag")+'<span class="lbl"> Buka JAGA ↗</span></a>'
    : '<button class="sellbtn hide-m" data-act="mitra-info">'+I("store")+' Jadi Mitra Toko</button>';
  const cc = cartCount(), oc = myActiveOrders();
  document.getElementById("hicons").innerHTML = (seller || S.view === "welcome") ? "" :
    '<button class="hicon '+(activeB==="cart"?"on":"")+'" title="Keranjang" data-act="nav" data-v="cart">'+IC_CART+(cc?'<span class="badge">'+cc+'</span>':'')+'</button>'+
    '<button class="hicon hide-m '+(activeB==="orders"?"on":"")+'" title="Transaksi" data-act="nav" data-v="orders">'+IC_ORDER+(oc?'<span class="badge">'+oc+'</span>':'')+'</button><span class="hdiv"></span>';
  const hs = document.getElementById("hsearch"); if(hs) hs.style.display = (seller || S.view === "welcome") ? "none" : "";
}
function go(v, extra, opts){
  opts = opts || {};
  if(S.role !== "seller"){
    const roots = ["home","fav","cart","orders","profile","login","driver","owner"];
    if(!opts.back){
      if(roots.includes(v)) S.hist = [];
      else if(S.view !== "login" && !(S.view === v && v !== "product")) S.hist.push({view:S.view, storeId:S.storeId, prodId:S.prodId, orderId:S.orderId});
      if(S.hist.length > 30) S.hist.shift();
    }
    if(v === "product" && !opts.back) S.pq = 1;
  }
  S.preview = false; S.justOrdered = false; Object.assign(S, extra||{}); S.view = v;
  if(v === "store" || v === "cart" || v === "checkout") watchProducts(v==="store" ? S.storeId : S.cart.storeId);
  if(v === "seller"){ const ms = myStores(); if(!S.sellerStoreId || !ms.find(s=>s.id===S.sellerStoreId)) S.sellerStoreId = ms[0] ? ms[0].id : null; if(S.sellerStoreId){ watchProducts(S.sellerStoreId); if(typeof loadWallet === "function") loadWallet(S.sellerStoreId); } }
  closeModal(); render(); window.scrollTo(0,0);
}
const allSubs = {};
function syncProductSubs(){
  const ids = S.stores.filter(visibleStore).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)).slice(0,50).map(s => s.id);
  Object.keys(allSubs).forEach(id => { if(!ids.includes(id)){ allSubs[id](); delete allSubs[id]; } });
  ids.forEach(id => {
    if(allSubs[id]) return;
    if(prodUnsubFor === id && prodUnsub){ prodUnsub(); prodUnsub = null; prodUnsubFor = null; }
    allSubs[id] = store.listen("stores/"+id+"/products", rows => {
      if(rows) S.products[id] = rows.sort((a,b)=>(a.createdAt||0)-(b.createdAt||0));
      else S.products[id] = S.products[id] || [];
      scheduleRender();
    });
  });
}
let _rT = null;
function scheduleRender(){ if(_rT) return; _rT = setTimeout(() => { _rT = null; render(); }, 30); }
function watchProducts(storeId){
  if(!storeId || prodUnsubFor === storeId || allSubs[storeId]) return;
  if(prodUnsub) prodUnsub();
  prodUnsubFor = storeId;
  prodUnsub = store.listen("stores/"+storeId+"/products", rows => {
    if(rows) S.products[storeId] = rows.sort((a,b)=>(a.createdAt||0)-(b.createdAt||0));
    else S.products[storeId] = S.products[storeId] || [];
    render();
  });
}

const PREVIEW_BANNER = () => S.mode === "db" ? '<div class="notice" style="background:#fff1f0;border-color:#ffc9c4;color:#a1281c;font-weight:600">⚠️ Ini halaman <b>PRATINJAU desain</b>. Toko & pesanan di sini <b>tidak tampil</b> di aplikasi asli. Daftar & belanja di <a href="https://jagapatner.my.id/apps/" target="_blank" rel="noopener" style="color:#a1281c">jagapatner.my.id/apps</a></div>' : '';
/* ============ Render ============ */
/* simpan isian formulir agar tidak hilang saat data diperbarui otomatis */
function viewSig(){ return [S.role, S.view, S.storeId, S.prodId, S.orderId, S.sellerTab, S.sellerStoreId, S.drv && S.drv.editing].join("|"); }
function snapForms(){
  const app = document.getElementById("app"); if(!app) return null;
  const forms = [...app.querySelectorAll("form[id]")]; if(!forms.length) return null;
  const ae = document.activeElement;
  const snap = {sig: app.dataset.sig, forms: {}, focus: null};
  forms.forEach(f => {
    const vals = {};
    [...f.elements].forEach((el, i) => {
      if(!el.name || el.type === "file" || el.type === "submit" || el.tagName === "BUTTON") return;
      const k = el.name + (el.type === "radio" ? "=" + el.value : "");
      vals[k] = (el.type === "checkbox" || el.type === "radio") ? el.checked : el.value;
      if(el === ae){ snap.focus = {form:f.id, name:k}; try{ snap.focus.s = el.selectionStart; snap.focus.e = el.selectionEnd; }catch(_){} }
    });
    snap.forms[f.id] = vals;
  });
  return snap;
}
function restoreForms(snap){
  const app = document.getElementById("app"); if(!app) return;
  const sig = viewSig();
  if(snap && snap.sig === sig){
    Object.entries(snap.forms).forEach(([id, vals]) => {
      const f = document.getElementById(id); if(!f || f.tagName !== "FORM") return;
      [...f.elements].forEach(el => {
        if(!el.name || el.type === "file" || el.tagName === "BUTTON") return;
        const k = el.name + (el.type === "radio" ? "=" + el.value : "");
        if(!(k in vals)) return;
        if(el.type === "checkbox" || el.type === "radio") el.checked = vals[k]; else if(el.value !== vals[k]) el.value = vals[k];
        if(snap.focus && snap.focus.form === id && snap.focus.name === k){ try{ el.focus({preventScroll:true}); if(snap.focus.s != null) el.setSelectionRange(snap.focus.s, snap.focus.e); }catch(_){} }
      });
    });
  }
  app.dataset.sig = sig;
}
function render(){ const snap = snapForms(); renderInner(); restoreForms(snap); try{ mountMaps(); }catch(e){} try{ mountJagoMap(); }catch(e){} try{ mountOwnerMap(); }catch(e){} try{ mountOneMap(); }catch(e){} lazyImgs(); try{ fillStoreWa(); }catch(e){}  try{ if(S.role === "owner" && S.own && S.own.tab) localStorage.setItem("jt_own_tab", S.own.tab); if(S.role === "seller" && S.view === "seller" && S.sellerTab) localStorage.setItem("jt_seller_tab", S.sellerTab); }catch(_){} }
/* WA toko tidak lagi publik: pemilik mengambilnya lewat RPC privat */
const MYWA = {};
function fillStoreWa(){ const f = document.getElementById("storeForm"); if(!f || !SB) return; const id = f.dataset.id, inp = f.elements.wa; if(!id || !inp) return;
  if(MYWA[id] !== undefined){ if(!inp.value) inp.value = MYWA[id]; return; }
  MYWA[id] = ""; sbStore.rpc("jt_store_wa_get", {p_store:id}).then(w => { MYWA[id] = w || ""; const g = document.getElementById("storeForm"); if(g && g.dataset.id === id && g.elements.wa && !g.elements.wa.value) g.elements.wa.value = MYWA[id]; }).catch(() => { delete MYWA[id]; }); }
function renderInner(){
  document.body.classList.toggle("is-driver", S.role === "driver" || S.role === "owner");
  document.body.classList.toggle("is-owner", S.role === "owner");
  renderNav();
  const app = document.getElementById("app");
  const v = S.view;
  let html = "";
  const buyer = S.role !== "seller";
  document.body.classList.toggle("app", buyer);
  document.body.className = document.body.className.replace(/\bv-[a-z]+\b/g, "").trim() + " v-" + v;
  if(buyer){
    const key = [v, S.cat, S.storeId, S.prodId, S.orderId].join("|"); RISE = key !== _lastKey; _lastKey = key;
    if(S.role !== "driver" && S.role !== "owner") html += PREVIEW_BANNER();
    if(S.mode === "local" && v !== "login" && S.role !== "driver" && S.role !== "owner") html += '<div class="notice">Mode demo: data hanya tersimpan di perangkat ini sampai database dihubungkan.</div>';
    if(S.role === "driver") html += appDriver();
    else if(S.role === "owner") html += appOwner();
    else if(v === "login") html += appLogin();
    else if(v === "masuk") html += appMasuk();
    else if(v === "store") html += appStore();
    else if(v === "product") html += appProduct();
    else if(v === "cart" || v === "checkout") html += appCart();
    else if(v === "orders") html += appOrders();
    else if(v === "order") html += appOrder();
    else if(v === "fav") html += appFav();
    else if(v === "poin") html += appPoin();
    else if(v === "pesan") html += appPesan();
    else if(v === "jago") html += appJago();
    else if(v === "profile") html += appProfile();
    else html += appHome();
    app.innerHTML = html;
    renderCartBar();
    return;
  }
  html += PREVIEW_BANNER();
  if(S.mode === "local") html += '<div class="notice">Mode demo: database belum dihubungkan, jadi data hanya tersimpan di browser ini. Isi <code>toko/config.js</code> (lihat README) agar toko & pesanan tampil untuk semua orang.</div>';
  if(S.slow && !(S.ready.stores)) html += '<div class="notice">Data belum bisa dimuat. Periksa koneksi Anda — halaman akan memperbarui sendiri.</div>';
  if(v==="welcome") html += viewWelcome();
  else if(v==="home") html += viewHome();
  else if(v==="store") html += viewStore();
  else if(v==="product") html += viewProduct();
  else if(v==="cart" || v==="checkout") html += viewCart();
  else if(v==="orders") html += viewOrders();
  else if(v==="order") html += viewOrder();
  else if(v==="seller") html += viewSeller();
  else if(v==="register") html += viewRegister();
  app.innerHTML = html;
  renderCartBar();
}

function findProd(pid){
  for(const sid in S.products){ const p = (S.products[sid]||[]).find(x => x.id === pid); if(p) return {p, sid}; }
  return null;
}
function allProducts(){
  const out = [];
  S.stores.forEach(s => { if(!visibleStore(s)) return; (S.products[s.id]||[]).forEach(p => { if(p.active !== false) out.push({p, s}); }); });
  return out;
}
function soldCount(pid){ const f = findProd(pid); if(f && typeof f.p.sold === "number") return f.p.sold; let n = 0; S.orders.forEach(o => { if(o.status === "selesai") o.items.forEach(i => { if(i.pid === pid) n += i.qty; }); }); return n; }
function prodCard(x){
  const p = x.p, s = x.s;
  const out = typeof p.stock === "number" && p.stock <= 0;
  const sold = soldCount(p.id);
  return '<div class="pc" data-act="open-prod" data-id="'+esc(p.id)+'"><div class="im">'+(p.img?'<img alt="" loading="lazy" src="'+esc(p.img)+'">':(CAT_ICON[s.category]||I("package")))+
    (out?'<div class="soldout">Stok habis</div>':s.open===false?'<div class="soldout">Toko tutup</div>':'')+'</div>'+
    '<div class="bd"><div class="nm">'+esc(p.name)+'</div><div class="pr">'+rp(p.price)+'</div><span class="fo">'+I("truck")+' Antar cepat</span>'+
    '<div class="st">'+I("pin")+' <b>'+esc(s.area||"-")+'</b><span>· '+esc(s.name)+'</span></div>'+(sold?'<div class="sold">'+sold+' terjual</div>':'')+'</div></div>';
}
const SLIDES = [
  {c:"s1", pill:"Driver terdekat", t:"Diantar driver terdekat, langsung dari toko.", d:"Ongkir cuma Rp2.000 per 500 m — bisa nego langsung dengan driver.", art:I("truck")},
  {c:"s2", pill:"Tanpa biaya tambahan", t:"0% biaya admin. Bayar langsung ke toko.", d:"Transfer, e-wallet, QRIS, atau bayar di tempat.", art:I("card")},
  {c:"s3", pill:"Untuk pemilik toko", t:"Punya toko? Gabung jadi Mitra JAGA.", d:"Daftar gratis, bagi hasil hanya 3% per penjualan. Hubungi tim kami untuk info.", art:I("store"), act:"mitra-info", v:""}
];
function viewHome(){
  const q = S.q.trim().toLowerCase();
  const filtering = q || S.cat !== "Semua";
  let prods = allProducts();
  let stores = S.stores.filter(visibleStore);
  if(S.cat !== "Semua"){ prods = prods.filter(x => x.s.category === S.cat); stores = stores.filter(s => s.category === S.cat); }
  if(q){
    prods = prods.filter(x => [x.p.name, x.p.desc, x.s.name, x.s.category, x.s.area].join(" ").toLowerCase().includes(q));
    stores = stores.filter(s => [s.name, s.category, s.area, s.desc].join(" ").toLowerCase().includes(q));
  }
  prods.sort((a,b) => (b.s.open!==false)-(a.s.open!==false) || soldCount(b.p.id)-soldCount(a.p.id) || (b.p.createdAt||0)-(a.p.createdAt||0));
  stores.sort((a,b) => (b.open!==false)-(a.open!==false) || (b.createdAt||0)-(a.createdAt||0));
  let h = '<div class="hm">';
  if(!filtering){
    h += '<div class="carousel"><div class="slides" id="slides" style="transform:translateX(-'+(S.slide*100)+'%)">'+SLIDES.map(x =>
      '<div class="slide '+x.c+'"'+(x.act?' data-act="'+x.act+'" data-v="'+x.v+'"':'')+'><div style="position:relative;z-index:1"><span class="pill">'+x.pill+'</span><h2>'+x.t+'</h2><p>'+x.d+'</p></div><div class="art">'+x.art+'</div></div>').join("")+'</div>'+
      '<button class="carr l" data-act="slide" data-v="-1" aria-label="Sebelumnya">‹</button><button class="carr r" data-act="slide" data-v="1" aria-label="Berikutnya">›</button>'+
      '<div class="dots" id="dots">'+SLIDES.map((x,i)=>'<button class="'+(i===S.slide?"on":"")+'" data-act="slide-to" data-v="'+i+'" aria-label="Slide '+(i+1)+'"></button>').join("")+'</div></div>';
  }
  h += '<div class="panel"><h3>Kategori pilihan'+(S.cat!=="Semua"?'<button class="link" data-act="cat" data-v="Semua">Lihat semua</button>':'')+'</h3><div class="cats">'+
    CATS.map(c => '<button class="catb '+(S.cat===c?"on":"")+'" data-act="cat" data-v="'+esc(c)+'"><span class="ci">'+(CAT_ICON[c]||I("grid"))+'</span>'+esc(c)+'</button>').join("")+'</div></div>';
  if(!S.ready.stores) return h + '<div class="empty">'+I("loader")+' Memuat…</div></div>';
  if(filtering) h += '<div class="resbar"><div><b style="font-size:18px;letter-spacing:-.02em">'+(q?'Hasil untuk “'+esc(S.q.trim())+'”':esc(S.cat))+'</b> <span class="small muted">· '+prods.length+' produk, '+stores.length+' toko</span></div><button class="btn ghost sm" data-act="clear-filter">Hapus filter ✕</button></div>';
  if(stores.length) h += '<div class="panel"><h3>'+(filtering?'Toko':'Toko di JAGA')+'<span class="small muted" style="font-weight:600">'+stores.length+' toko</span></h3><div class="srow">'+stores.slice(0,20).map(s =>
    '<div class="smini" data-act="open-store" data-id="'+esc(s.id)+'">'+avatarHtml(s)+'<div><b>'+esc(s.name)+'</b><span class="small muted">'+(s.open===false?'<span style="color:var(--danger);font-weight:700">Tutup</span>':'<span style="color:#16a34a;font-weight:700">● Buka</span>')+' · '+esc(s.area||"")+'</span></div></div>').join("")+'</div></div>';
  h += '<div class="sec-head" style="margin:4px 0 0"><h2 style="font-size:20px">'+(filtering?'Produk':'Pilihan untukmu')+'</h2></div>';
  if(!prods.length){
    h += '<div class="empty panel"><div class="big">'+(S.stores.length?I("search"):I("store"))+'</div><b>'+(S.stores.length?(filtering?'Produk tidak ditemukan.':'Belum ada produk.'):'Belum ada toko terdaftar.')+'</b><p>'+(S.stores.length?(filtering?'Coba kata kunci atau kategori lain.':'Produk dari toko akan tampil di sini.'):'Jadilah toko pertama di JAGA.')+'</p>'+(S.stores.length?'':'<button class="btn" data-act="mitra-info">Info jadi mitra toko</button>')+'</div>';
  } else h += '<div class="pgrid">'+prods.map(prodCard).join("")+'</div>';
  if(!filtering) h += mitraBand();
  return h + '</div>' + siteFooter();
}
function waMitra(){ return waLink(CONTACT.wa, "Halo JAGA, saya ingin informasi untuk mendaftarkan toko saya sebagai mitra."); }
function mitraBand(){
  return '<section class="mband"><div class="mtext"><span class="pill">'+I("store")+' JAGA Mitra</span><h2>Punya toko? Jualan di JAGA.</h2>'+
    '<p>Daftar gratis, tanpa biaya bulanan. Pembayaran pembeli langsung masuk ke rekening, e-wallet, atau QRIS toko Anda — JAGA hanya mengambil bagi hasil 3% dari penjualan yang selesai.</p>'+
    '<div class="mbtns"><a class="btn wa" target="_blank" rel="noopener" href="'+esc(waMitra())+'">'+I("chat")+' Tanya via WhatsApp</a>'+
    '<a class="btn ghost" target="_blank" rel="noopener" href="'+MITRA_URL+'">Daftarkan toko ↗</a></div>'+
    '<div class="mcontact">WhatsApp '+esc(CONTACT.wa)+(CONTACT.email?' · '+esc(CONTACT.email):'')+'</div></div>'+
    '<div class="mperks"><div>'+I("percent")+'<b>Bagi hasil 3%</b><span>Hanya dari penjualan yang selesai</span></div><div>'+I("truck")+'<b>Driver terdekat</b><span>Pesanan dijemput driver sekitar toko</span></div><div>'+I("chart")+'<b>Dashboard toko</b><span>Pesanan & laporan</span></div></div></section>';
}
function siteFooter(){
  return '<footer class="sfoot"><div class="fcol"><div class="logo" style="cursor:default">'+document.querySelector(".jmark").outerHTML+'<span class="lsep"></span><span class="wm">JAGA</span></div><p class="small muted" style="max-width:320px;line-height:1.6">JAminan Driver dan toko Aman<br>GAransi pesanan pasti sampai<br>Kami JAGA Kepercayaan anda</p></div>'+
    '<div class="fcol"><b>Hubungi kami</b><a target="_blank" rel="noopener" href="'+esc(waLink(CONTACT.wa,"Halo JAGA"))+'">'+I("chat")+' WhatsApp '+esc(CONTACT.wa)+'</a>'+(CONTACT.email?'<span>'+I("note")+' '+esc(CONTACT.email)+'</span>':'')+(CONTACT.office?'<span>'+I("pin")+' '+esc(CONTACT.office)+'</span>':'')+'</div>'+
    '<div class="fcol"><b>Mitra toko</b><a data-act="mitra-info">Info menjadi mitra</a><a target="_blank" rel="noopener" href="'+MITRA_URL+'">Pendaftaran toko ↗</a><a target="_blank" rel="noopener" href="'+MITRA_URL+'">Dashboard mitra ↗</a></div>'+
    '<div class="fcopy">© '+new Date().getFullYear()+' JAGA</div></footer>';
}
function openAksesModal(){
  document.getElementById("modal").innerHTML = '<div class="modal-bg" data-act="modal-bg"><form class="modal" id="aksesForm"><h2 class="sec">Masuk dengan kode akses</h2>'+
    '<p class="muted" style="margin-top:0">Salin kode dari menu <b>Pengaturan → Kode akses toko</b> di perangkat yang dipakai saat mendaftar, lalu tempel di sini.</p>'+
    '<input class="in" name="key" required placeholder="jt…" autocomplete="off">'+
    '<div class="actions" style="margin-top:16px"><button class="btn" style="flex:1">Masuk</button><button type="button" class="btn ghost" data-act="close-modal">Batal</button></div></form></div>';
}
const waNorm = w => { let d = String(w||"").replace(/\D/g, ""); if(d[0] === "0") d = "62" + d.slice(1); else if(d[0] === "8") d = "62" + d; return d; };
const waOk = w => /^628\d{7,11}$/.test(waNorm(w));
const WA_BAD = "Nomor WhatsApp tidak valid. Contoh: 081234567890";
const RULES = [
  {t:"Umum", e:"check", r:["1 nomor WhatsApp hanya untuk 1 akun di setiap peran (1 pembeli, 1 toko, 1 driver).","Nomor WhatsApp wajib aktif dan benar (08… atau +62…). Data akun harus data asli.","Tidak boleh bertransaksi dengan diri sendiri: membeli dari toko sendiri atau mengantar pesanan sendiri.","Semua pertanyaan, chat, dan transaksi antara pembeli, toko, dan driver dilakukan lewat pesan di aplikasi JAGA, bukan WhatsApp. WhatsApp hanya untuk menghubungi layanan JAGA bila ada keluhan atau butuh bantuan.","Bonus saldo akun baru hanya diberikan 1 kali untuk setiap nomor WhatsApp.","Akun yang curang, memakai data palsu, atau membuat pesanan palsu dapat dinonaktifkan tim JAGA."]},
  {t:"Pembeli", e:"cart", r:["Maksimal 3 pesanan belanja yang sedang berjalan sekaligus.","Di toko yang sama hanya boleh 1 pesanan yang belum dikonfirmasi. Tunggu atau batalkan dulu sebelum memesan lagi.","Maksimal 1 perjalanan Jago yang sedang berjalan.","Alamat pengantaran harus berada di wilayah layanan JAGA."]},
  {t:"Penjual (toko)", e:"store", r:["1 nomor WhatsApp hanya untuk 1 toko.","1 akun / HP hanya bisa mendaftarkan 1 toko.","Nama toko tidak boleh sama dengan toko lain di daerah yang sama.","Bagi hasil 3% dari setiap penjualan yang selesai, dipotong otomatis dari saldo toko.","Toko wajib mengonfirmasi pesanan dan menjaga stok tetap sesuai."]},
  {t:"Driver", e:"scooter", r:["1 nomor WhatsApp dan 1 plat nomor hanya untuk 1 akun driver.","Akun driver harus disetujui tim JAGA sebelum bisa ONLINE.","1 driver hanya bisa membawa 1 pesanan atau 1 perjalanan sekaligus.","Ganti nomor WhatsApp atau plat nomor = verifikasi ulang oleh tim JAGA.","Tidak bisa mengambil pesanan sendiri atau pesanan dari toko milik sendiri.","Potongan 3% dari ongkir antar dan tarif Jago setiap order selesai, dipotong dari saldo driver.","Saldo di bawah minimum (Rp10.000) = order tidak masuk sampai saldo diisi."]},
  {t:"Saldo & poin", e:"gift", r:["Toko dan driver baru mendapat saldo gratis Rp15.000 (1 kali per nomor WhatsApp).","Isi saldo lewat bank, virtual account, e-wallet, atau QRIS yang disediakan JAGA, wajib kirim foto bukti transfer. Saldo bertambah setelah dicek tim JAGA.","Setiap 10 transaksi selesai dalam sehari dapat 5 poin, berlaku untuk toko, driver, dan pembeli.","5 poin bisa ditukar jadi Rp2.000. Untuk toko & driver masuk ke saldo; untuk pembeli jadi saldo JAGA yang memotong ongkir atau tarif Jago.","Poin dari pesanan palsu atau curang akan dibatalkan dan akun dapat dinonaktifkan."]}
];
function openRules(){
  document.getElementById("modal").innerHTML = '<div class="modal-bg" data-act="modal-bg"><div class="modal rmodal"><h2 class="sec" style="margin-bottom:4px">Aturan JAGA</h2>'+
    '<p class="muted" style="margin-top:0">Supaya setiap akun asli, tidak ganda, dan transaksi tetap aman untuk semua.</p>'+
    RULES.map(g => '<div class="rgrp"><div class="rh">'+E(g.e)+'<b>'+g.t+'</b></div><ol>'+g.r.map(x => '<li>'+esc(x)+'</li>').join("")+'</ol></div>').join("")+
    '<button class="btn block" style="margin-top:12px" data-act="close-modal">Saya mengerti</button>'+
    '<button class="btn ghost sm" style="position:absolute;top:14px;right:14px" data-act="close-modal" aria-label="Tutup">✕</button></div></div>';
}
function openMitraModal(){
  document.getElementById("modal").innerHTML = '<div class="modal-bg" data-act="modal-bg"><div class="modal mmodal"><div class="mhead">'+I("store")+'</div><h2 class="sec" style="margin-bottom:6px">Jadi Mitra JAGA</h2>'+
    '<p class="muted" style="margin-top:0">Untuk usaha makanan, minuman, dan sembako. Daftar gratis — JAGA hanya mengambil bagi hasil 3% dari setiap penjualan yang selesai.</p>'+
    '<div class="mlist"><div>'+I("checkc")+' Daftar dan kelola toko di halaman mitra</div><div>'+I("checkc")+' Pembayaran langsung ke akun toko Anda</div><div>'+I("checkc")+' Tim kami bantu proses pendaftaran</div></div>'+
    '<a class="btn wa block" target="_blank" rel="noopener" href="'+esc(waMitra())+'">'+I("chat")+' Hubungi via WhatsApp</a>'+
    '<a class="btn ghost block" style="margin-top:8px" target="_blank" rel="noopener" href="'+MITRA_URL+'">Buka halaman pendaftaran toko ↗</a>'+
    '<div class="small muted" style="margin-top:14px;text-align:center">WhatsApp '+esc(CONTACT.wa)+(CONTACT.email?' · Email '+esc(CONTACT.email):'')+'</div>'+
    '<button class="btn ghost sm" style="position:absolute;top:14px;right:14px" data-act="close-modal" aria-label="Tutup">✕</button></div></div>';
}
function viewProduct(){
  const f = findProd(S.prodId);
  if(!f) return '<div class="empty">'+(Object.keys(S.products).length?'Produk tidak ditemukan.':''+I("loader")+' Memuat…')+'</div>';
  const p = f.p, s = storeById(f.sid);
  if(!s) return '<div class="empty">Toko tidak ditemukan.</div>';
  const out = typeof p.stock === "number" && p.stock <= 0;
  const isOpen = s.open !== false;
  const inCart = S.cart.storeId===s.id && S.cart.items[p.id] ? S.cart.items[p.id].qty : 0;
  const sold = soldCount(p.id);
  const others = (S.products[s.id]||[]).filter(x => x.active !== false && x.id !== p.id).slice(0,6).map(x => ({p:x, s}));
  let h = '<div class="crumbs"><a data-act="go" data-v="home">Beranda</a>›<a data-act="cat" data-v="'+esc(s.category)+'">'+esc(s.category)+'</a>›<a data-act="open-store" data-id="'+esc(s.id)+'">'+esc(s.name)+'</a>›<span>'+esc(p.name)+'</span></div>';
  h += '<div class="pdp"><div class="gal">'+(p.img?'<img alt="" src="'+esc(p.img)+'">':(CAT_ICON[s.category]||I("package")))+'</div><div>'+
    '<h1>'+esc(p.name)+'</h1><div class="small muted">'+(sold?sold+' terjual · ':'')+(typeof p.stock==="number"?'Stok '+p.stock:'Stok tersedia')+'</div>'+
    '<div class="bigprice">'+rp(p.price)+'</div>'+
    '<div class="meta"><span class="tag">'+I("truck")+' Ongkir Rp2rb/500 m</span><span class="tag">0% biaya admin</span>'+payMethodsOf(s).map(m=>'<span class="tag gray">'+esc(m.l)+'</span>').join("")+'</div>'+
    (p.desc?'<h3 class="sub" style="margin-top:4px">Deskripsi</h3><p style="margin:0 0 16px;white-space:pre-line">'+esc(p.desc)+'</p>':'')+
    '<div class="buybox">'+(out?'<b style="color:var(--danger)">Stok habis</b>':!isOpen?'<b style="color:var(--danger)">Toko sedang tutup</b>':
      '<div class="small muted" style="font-weight:700">Atur jumlah</div><div class="qty">'+(inCart?'<button data-act="qty" data-id="'+esc(p.id)+'" data-d="-1">−</button><b>'+inCart+'</b><button data-act="qty" data-id="'+esc(p.id)+'" data-d="1">+</button><span class="small muted">di keranjang · subtotal <b style="color:var(--ink)">'+rp(inCart*p.price)+'</b></span>':'<span class="small muted">Belum di keranjang</span>')+'</div>'+
      '<div style="display:flex;gap:8px"><button class="btn ghost" style="flex:1" data-act="qty" data-id="'+esc(p.id)+'" data-d="1">+ Keranjang</button><button class="btn" style="flex:1" data-act="buy-now" data-id="'+esc(p.id)+'">Beli langsung</button></div>')+'</div>'+
    '<div class="storebox">'+avatarHtml(s)+'<div class="grow"><b>'+esc(s.name)+'</b><div class="small muted">'+(isOpen?'<span style="color:#16a34a;font-weight:700">● Buka</span>':'<span style="color:var(--danger);font-weight:700">Tutup</span>')+' · '+I("pin")+' '+esc(s.area||"")+'</div></div>'+
    '<button class="btn ghost sm" data-act="open-store" data-id="'+esc(s.id)+'">Kunjungi toko</button>'+
    '<button class="btn ghost sm" data-act="chat-seller" data-id="'+esc(s.id)+'" data-p="'+esc(p.id)+'">'+I("chat")+' Chat</button></div></div></div>';
  if(others.length) h += '<div class="sec-head" style="margin-top:26px"><h2 style="font-size:19px">Lainnya dari '+esc(s.name)+'</h2></div><div class="pgrid">'+others.map(prodCard).join("")+'</div>';
  return h;
}

function viewStore(){
  const s = storeById(S.storeId);
  if(!s) return '<button class="back" data-act="go" data-v="home">← Kembali</button><div class="empty">Toko tidak ditemukan.</div>';
  const prods = (S.products[s.id]||[]).filter(p => p.active !== false);
  const isOpen = s.open !== false;
  let h = S.preview ? '<div class="preview-bar"><span>'+I("eye")+' Pratinjau: begini toko Anda terlihat oleh pembeli</span><button class="btn sm" data-act="nav" data-v="seller" data-t="ringkasan">← Kembali ke dashboard</button></div>' : '<div class="crumbs"><a data-act="go" data-v="home">Beranda</a>›<span>'+esc(s.name)+'</span></div>';
  h += '<div class="sbanner'+(s.cover ? ' has-cover' : '')+'"'+(s.cover ? ' style="background-image:linear-gradient(180deg,rgba(11,26,61,.05) 0%,rgba(11,26,61,.55) 45%,rgba(11,26,61,.96) 100%),url(&quot;'+esc(s.cover)+'&quot;)"' : '')+'>'+avatarHtml(s)+'<div class="grow"><h2>'+esc(s.name)+'</h2>'+
    '<div class="small muted">'+(isOpen?'<span style="color:#86efac;font-weight:700">● Buka</span>':'<span style="color:#fca5a5;font-weight:700">Tutup</span>')+' · '+(CAT_ICON[s.category]||"")+' '+esc(s.category)+' · '+I("pin")+' '+esc(s.address||"")+(s.area?', '+esc(s.area):'')+(s.hours?' · '+I("clock")+' '+esc(s.hours):'')+'</div>'+
    (s.desc?'<p style="margin:8px 0 0;color:#dce6fb">'+esc(s.desc)+'</p>':'')+
    '<div class="paylist"><span class="tag">'+I("truck")+' Ongkir Rp2rb/500 m</span><span class="tag">0% admin</span>'+payMethodsOf(s).map(p=>'<span class="tag gray">'+esc(p.l)+'</span>').join("")+'</div></div>'+
    (s.managed ? '' : '<button class="btn ghost sm" data-act="chat-seller" data-id="'+esc(s.id)+'">'+I("chat")+' Chat penjual</button>')+'</div>';
  if(!S.products[s.id]) return h + '<div class="empty">'+I("loader")+' Memuat produk…</div>';
  if(!prods.length) return h + '<div class="empty card"><div class="big">'+I("package")+'</div>Toko ini belum menambahkan produk.</div>';
  h += '<div class="sec-head" style="margin:4px 0 12px"><h2 style="font-size:19px">Semua produk</h2><span class="small muted">'+prods.length+' produk</span></div>';
  h += '<div class="pgrid">'+prods.map(p => prodCard({p, s})).join("")+'</div>';
  return h;
}

function cartTotals(){
  const items = Object.values(S.cart.items);
  const subtotal = items.reduce((a,i)=>a+i.price*i.qty,0);
  const cs = storeById(S.cart.storeId), pf = getProf();
  const dist = cs && locOk(cs) && locOk(pf) ? (roadDist(cs, pf) || distM(cs, pf)) : null;
  if(cs && locOk(cs) && locOk(pf)) ensureRoad(cs, pf);
  const pd = (S.promo && S.promo.sid === S.cart.storeId && S.promo.sub === subtotal) ? S.promo.disc : 0;
  return {items, subtotal, ongkir:0, ongkirEst: dist == null ? null : ongkirByDist(dist), ongkirDist: dist, admin:0, promoDisc:pd, promoCode:pd ? S.promo.code : "", total:subtotal - pd};
}
function renderCartBar(){
  if(S.role !== "seller") return renderMiniCart();
  const el = document.getElementById("cartbar");
  const n = cartCount();
  if(!n || !["store","home","product"].includes(S.view)){ el.innerHTML=""; return; }
  const s = storeById(S.cart.storeId); const t = cartTotals();
  el.innerHTML = '<div class="cartbar"><div class="inner"><div><div style="font-weight:800">'+n+' barang · '+rp(t.total)+'</div><div class="small" style="opacity:.75">dari '+esc(s?s.name:"toko")+' · ongkir '+(t.ongkirEst==null?ONGKIR_LBL:'±'+rp(t.ongkirEst))+'</div></div><button class="btn lime" data-act="go" data-v="cart">Checkout →</button></div></div>';
}

function viewCart(){
  const s = storeById(S.cart.storeId);
  const t = cartTotals();
  if(!t.items.length || !s) return '<h2 class="sec">Keranjang</h2><div class="empty card"><div class="big">'+I("cart")+'</div>Keranjang Anda masih kosong.<p><button class="btn" data-act="go" data-v="home">Mulai belanja</button></p></div>';
  const methods = payMethodsOf(s);
  if(!S.payChoice || !methods.find(m=>m.k===S.payChoice)) S.payChoice = methods[0] ? methods[0].k : null;
  let prof = {}; try{ prof = JSON.parse(localStorage.getItem("st_buyer")||"{}"); }catch(e){}
  let h = '<button class="back" data-act="open-store" data-id="'+esc(s.id)+'">← Kembali ke '+esc(s.name)+'</button><h2 class="sec">Keranjang & Checkout</h2>';
  h += '<div class="two"><form class="card pad" id="checkout">'+
    '<h3 class="sub">Alamat pengantaran</h3>'+
    '<label class="f">Nama penerima</label><input class="in" name="name" required value="'+esc(prof.name||"")+'">'+
    '<label class="f">No. WhatsApp</label><input class="in" name="wa" required inputmode="tel" placeholder="08xxxxxxxxxx" value="'+esc(prof.wa||"")+'">'+
    '<label class="f">Alamat lengkap</label><textarea class="in" name="address" required placeholder="Jalan, nomor rumah, RT/RW, kelurahan, patokan">'+esc(prof.address||"")+'</textarea>'+
    '<label class="f">Lokasi pengantaran (untuk driver)</label><input type="hidden" name="blat" value="'+esc(prof.lat??"")+'"><input type="hidden" name="blng" value="'+esc(prof.lng??"")+'">'+
    '<button type="button" class="btn ghost locbtn" data-act="buyer-loc">'+I("pin")+' <span id="bLocTxt">'+(typeof prof.lat==="number"?"Lokasi tersimpan ✓ — ketuk untuk perbarui":"Pakai lokasi saya sekarang")+'</span></button>'+
    '<label class="f">Atau link Google Maps (opsional)</label><input class="in" name="maps" placeholder="https://maps.app.goo.gl/…" value="'+esc(prof.maps||"")+'">'+
    '<label class="f">Catatan untuk toko (opsional)</label><input class="in" name="note" placeholder="Contoh: tidak pedas, titip di pos satpam">'+
    '<h3 class="sub" style="margin-top:20px">Metode pembayaran</h3><div class="small muted" style="margin-bottom:10px">Pembayaran langsung masuk ke akun milik '+esc(s.name)+'.</div>'+
    (methods.length ? methods.map(m => '<label class="opt '+(S.payChoice===m.k?"on":"")+'"><input type="radio" name="pay" value="'+m.k+'" '+(S.payChoice===m.k?"checked":"")+' data-act="pay"><div><b>'+esc(m.l)+'</b><div class="small muted">'+(m.k==="cod"?"Bayar tunai saat pesanan diterima":"Instruksi pembayaran muncul setelah pesanan dibuat")+'</div></div></label>').join("")
      : '<div class="notice">Toko ini belum mengatur metode pembayaran.</div>')+
    (SB ? '<h3 class="sub" style="margin-top:20px">Kode promo</h3><div class="promorow"><input class="in" id="promoCode" placeholder="Masukkan kode (opsional)" maxlength="20" autocapitalize="characters" value="'+esc(t.promoCode || (S.promo && S.promo.sid === s.id ? S.promo.code : ""))+'"><button type="button" class="btn ghost" data-act="promo-apply">Pakai</button></div><div class="hint" id="promoMsg">'+(t.promoDisc ? 'Hemat '+rp(t.promoDisc)+' dengan kode '+esc(t.promoCode) : 'Promo dibiayai toko. Potongan dihitung ulang oleh server.')+'</div>' : '')+
    useSaldoBox(t.ongkirEst || 0, "ongkir")+
    '<button class="btn block" style="margin-top:12px" '+(methods.length && s.open!==false?"":"disabled")+'>Buat pesanan · '+rp(t.total)+'</button>'+
    (s.open===false?'<div class="hint">Toko sedang tutup.</div>':'')+
    '</form>';
  h += '<div class="card pad"><h3 class="sub">'+esc(s.name)+'</h3>'+t.items.map(i =>
    '<div class="line-item"><div class="thumb">'+(i.img?'<img alt="" src="'+esc(i.img)+'">':I("package"))+'</div><div class="grow"><div style="font-weight:700">'+esc(i.name)+'</div><div class="small muted">'+rp(i.price)+'</div></div>'+
    '<div class="qty" style="padding:0"><button data-act="qty" data-id="'+esc(i.pid)+'" data-d="-1">−</button><b>'+i.qty+'</b><button data-act="qty" data-id="'+esc(i.pid)+'" data-d="1">+</button></div></div>').join("")+
    '<div style="margin-top:10px"><div class="row"><span>Subtotal</span><span>'+rp(t.subtotal)+'</span></div>'+
    '<div class="row"><span>Biaya admin</span><span class="free">Rp0</span></div>'+
    (t.promoDisc ? '<div class="row"><span>Promo '+esc(t.promoCode)+'</span><span class="free">−'+rp(t.promoDisc)+'</span></div>' : '')+
    '<div class="row total"><span>Total belanja</span><span>'+rp(t.total)+'</span></div>'+
    '<div class="ongkirbox">'+E("scooter")+'<div>'+(t.ongkirEst==null ? '<b>Ongkir '+ONGKIR_LBL+'</b><small>Dihitung dari jarak toko ke alamatmu'+(locOk(s)?' — ketuk “Pakai lokasi saya sekarang” di bawah untuk melihat perkiraan.':'.')+' Dibayar langsung ke driver, bisa nego.</small>'
      : '<b>Ongkir ±'+rp(t.ongkirEst)+'</b><small>Jarak ±'+kmTxt(t.ongkirDist)+' dari toko · '+ONGKIR_LBL+'. Dibayar langsung ke driver, bisa nego saat pesanan diantar.</small>')+'</div></div></div>'+
    '<button class="btn ghost sm" style="margin-top:8px" data-act="clear-cart">Kosongkan keranjang</button></div></div>';
  return h;
}

function statusTag(st){ const x = STATUS[st]||{l:st,c:"gray"}; return '<span class="tag '+x.c+'">'+esc(x.l)+'</span>'; }
function stepper(o){
  if(o.status === "dibatalkan") return "";
  let flow = o.pay && o.pay.k === "cod" ? FLOW_COD : FLOW;
  if(o.selfDelivery) flow = flow.filter(f => f !== "mencari_driver" && f !== "driver_ke_toko");
  const idx = flow.indexOf(o.status === "diproses" ? (o.selfDelivery ? "diantar" : "mencari_driver") : o.status);
  return '<div class="steps">'+flow.map((f,i)=>'<div class="step '+(i<=idx?"done":"")+'"><div class="bar"></div>'+esc(STEP_L[f]||STATUS[f].l)+'</div>').join("")+'</div>';
}

function viewOrders(){
  const mine = S.orders.filter(o => o.buyerId === ME).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
  const act = mine.filter(o => !["selesai","dibatalkan"].includes(o.status));
  const done = mine.filter(o => ["selesai","dibatalkan"].includes(o.status));
  const list = S.buyerTab === "aktif" ? act : done;
  let h = '<h2 class="sec">Pesanan Saya</h2><div class="tabs"><button class="tab '+(S.buyerTab==="aktif"?"on":"")+'" data-act="btab" data-v="aktif">Aktif ('+act.length+')</button><button class="tab '+(S.buyerTab==="riwayat"?"on":"")+'" data-act="btab" data-v="riwayat">Riwayat ('+done.length+')</button></div>';
  if(!S.ready.orders) return h + '<div class="empty">'+I("loader")+' Memuat…</div>';
  if(!list.length) return h + '<div class="empty card"><div class="big">'+I("package")+'</div>Belum ada pesanan di sini.</div>';
  const PG = pg("buyer_" + S.buyerTab, list, 20);
  return h + PG.items.map(o => '<div class="card order" style="cursor:pointer" data-act="open-order" data-id="'+esc(o.id)+'"><div class="order-top"><div><b>'+esc(o.storeName)+'</b><div class="small muted">'+esc(o.code)+' · '+fmtDate(o.createdAt)+'</div></div>'+statusTag(o.status)+'</div>'+
    '<div class="small" style="margin-top:6px">'+o.items.map(i=>esc(i.name)+' ×'+i.qty).join(", ")+'</div><div style="margin-top:4px;font-weight:800">'+rp(o.total)+' <span class="small muted" style="font-weight:600">· '+esc(o.pay?o.pay.type:"")+'</span></div></div>').join("") + PG.btn;
}

function payInstructions(o){
  const p = o.pay || {};
  if(p.k === "cod") return '<div class="paybox">'+I("cash")+' Siapkan uang tunai <b>'+rp(o.total)+'</b> saat pesanan tiba.</div>';
  let h = '<div class="paybox"><div class="small muted">Bayar ke akun '+esc(o.storeName)+' via <b>'+esc(p.type)+'</b></div>';
  if(p.qris) h += '<img class="qris" alt="QRIS toko" src="'+esc(p.qris)+'"><div class="small muted">Scan dengan aplikasi bank atau e-wallet apa pun.</div>';
  if(p.no) h += '<div class="acct" style="margin-top:6px">'+esc(p.no)+'</div><div class="small">a.n. <b>'+esc(p.holder||"-")+'</b></div><button class="btn ghost sm" style="margin-top:8px" data-act="copy" data-v="'+esc(p.no)+'">Salin nomor</button>';
  h += '<div style="margin-top:10px">Jumlah transfer: <b>'+rp(o.total)+'</b> <button class="btn ghost sm" data-act="copy" data-v="'+Math.round(o.total)+'">Salin</button></div></div>';
  return h;
}

function viewOrder(){
  const o = S.orders.find(x => x.id === S.orderId);
  if(!o) return '<button class="back" data-act="go" data-v="orders">← Pesanan saya</button><div class="empty">'+(S.ready.orders?"Pesanan tidak ditemukan.":I("loader")+" Memuat…")+'</div>';
  const s = storeById(o.storeId);
  let h = '<button class="back" data-act="go" data-v="orders">← Pesanan saya</button>';
  h += '<div class="two"><div class="card pad"><div class="order-top"><div><h2 class="sec" style="margin:0">'+esc(o.storeName)+'</h2><div class="small muted">'+esc(o.code)+' · '+fmtDate(o.createdAt)+'</div></div>'+statusTag(o.status)+'</div>'+stepper(o);
  if(o.isMine !== false && !["selesai","dibatalkan"].includes(o.status)) h += buyerNotifLine();
  if(o.status === "menunggu_pembayaran"){
    h += '<h3 class="sub" style="margin-top:16px">Langkah pembayaran</h3>'+payInstructions(o)+
      '<label class="f">Unggah bukti pembayaran</label><input type="file" accept="image/*" class="in" id="proofFile"><div class="hint">Foto/screenshot bukti transfer. Toko akan mengecek lalu memproses pesanan.</div>'+
      '<button class="btn block" style="margin-top:10px" data-act="send-proof" data-id="'+esc(o.id)+'">Kirim bukti pembayaran</button>';
  } else if(o.status === "menunggu_konfirmasi"){
    h += o.pay && o.pay.k === "cod" ? '<div class="paybox">'+I("clock")+' Menunggu toko mengonfirmasi pesanan Anda. Setelah dikonfirmasi, sistem langsung mencari driver terdekat.</div>'
      : '<div class="paybox">'+I("checkc")+' Bukti pembayaran terkirim. Menunggu toko mengecek pembayaran Anda.</div>';
  } else if(o.status === "mencari_driver"){
    h += searchBox(o, "Toko sudah mengonfirmasi. Mencari driver terdekat dari toko…");
  } else if(o.status === "driver_ke_toko"){
    h += o.handedAt ? driverBox(o, "Pesanan sudah diambil driver di toko. Sebentar lagi diantar.") + liveMap(o, "pembeli")
      : driverBox(o, "Driver sedang menuju toko untuk mengambil pesanan Anda.") + liveMap(o, "pembeli");
  } else if(o.status === "diantar" && o.driverId){
    h += o.arrivedAt ? driverBox(o, "Pesanan sudah sampai. Silakan terima dari driver.") + proofBtn(o) + buyerDue(o) + ongkirNego(o)
      : driverBox(o, o.codeReq ? "Paket dalam perjalanan ke alamat Anda." : "Pesanan sedang diantar ke alamat Anda.") + liveMap(o, "pembeli") + ongkirNego(o);
  } else if(o.status === "diantar"){
    h += '<div class="paybox">'+I("truck")+' Pesanan sedang diantar oleh toko ke alamat Anda.'+(o.pay&&o.pay.k==="cod"?' Siapkan <b>'+rp(o.total)+'</b> tunai.':'')+'</div><button class="btn block" data-act="buyer-done" data-id="'+esc(o.id)+'">Pesanan sudah saya terima</button>';
  } else if(o.status === "diproses"){
    h += '<div class="paybox">'+I("package")+' Toko sedang menyiapkan pesanan Anda.</div>'+(o.pay&&o.pay.k==="cod"?payInstructions(o):'');
  } else if(o.status === "dibatalkan"){
    h += '<div class="paybox">Pesanan dibatalkan'+(o.cancelBy?' oleh '+esc(o.cancelBy):'')+'.</div>';
  } else if(o.status === "selesai"){
    h += (o.payRecv ? payRecvLine(o, true) : '') + '<div class="paybox">'+I("badge")+' Pesanan selesai. Terima kasih sudah belanja!'+(o.payRecv ? '' : typeof o.ongkirFinal==="number"?'<div class="small" style="margin-top:6px">Ongkir dibayar ke driver'+(o.driver?' '+esc(o.driver.name):'')+': <b>'+rp(o.ongkirFinal)+'</b></div>':'')+'</div>';
  }
  h += proofBtn(o);
  if(o.proof && o.status !== "menunggu_pembayaran") h += '<div class="small muted" style="margin-top:10px">Bukti pembayaran Anda:</div><img class="proof" alt="Bukti pembayaran" src="'+esc(o.proof)+'">';
  h += '<div class="actions">'+chatBtn(o, "pembeli", "Chat toko & driver", "ghost sm")+
    (["menunggu_pembayaran","menunggu_konfirmasi"].includes(o.status) || (o.status==="diproses" && o.pay && o.pay.k==="cod" && false) ?'<button class="btn danger sm" data-act="buyer-cancel" data-id="'+esc(o.id)+'">Batalkan pesanan</button>':'')+'</div>';
  h += trustBox(o, "order") + (["selesai","dibatalkan"].includes(o.status) ? "" : pushCard("buyer", "Kabari saya saat pesanan dikonfirmasi, diambil driver, dan sampai."));
  h += '</div>';
  h += '<div class="card pad"><h3 class="sub">Rincian</h3>'+o.items.map(i=>'<div class="row"><span>'+esc(i.name)+' ×'+i.qty+'</span><span>'+rp(i.price*i.qty)+'</span></div>').join("")+
    (o.promo && o.promo.disc ? '<div class="row"><span>Promo '+esc(o.promo.code)+'</span><span class="free">−'+rp(o.promo.disc)+'</span></div>' : '')+'<div class="row"><span>Biaya admin</span><span class="free">Rp0</span></div><div class="row total"><span>Total belanja</span><span>'+rp(o.total)+'</span></div>'+
    (o.voucher > 0 && !o.selfDelivery ? '<div class="row"><span>Potongan saldo JAGA</span><span class="free">−'+rp(o.voucher)+'</span></div>' : '')+
    (o.selfDelivery ? '' : '<div class="row"><span>Ongkir (ke driver)</span><span>'+(typeof o.ongkirFinal==="number" ? rp(o.ongkirFinal) : ongkirEstOf(o)==null ? ONGKIR_LBL : '±'+rp(ongkirEstOf(o))+' <small class="muted">nego</small>')+'</span></div>')+
    '<h3 class="sub" style="margin-top:16px">Dikirim ke</h3><div><b>'+esc(o.buyer.name)+'</b>'+(o.buyer.wa ? ' · '+esc(o.buyer.wa) : '')+'</div><div class="small">'+esc(o.buyer.address)+'</div>'+
    (o.buyer.maps?'<div class="small"><a target="_blank" rel="noopener" href="'+esc(o.buyer.maps)+'">Lihat di peta</a></div>':'')+
    (o.buyer.note?'<div class="small muted" style="margin-top:6px">Catatan: '+esc(o.buyer.note)+'</div>':'')+'</div></div>';
  return h;
}

/* ---------- Penjual ---------- */
function viewSeller(){
  const ms = myStores();
  if(!S.ready.stores || (SB && !S.myStoreIds)) return '<div class="empty">'+I("loader")+' Memuat…</div>';
  if(!ms.length) return storeLoginCard() + '<div class="welcome" style="margin-top:10px"><span class="tag">JAGA Mitra</span><h1>Buka toko online Anda<br><em>dalam 2 menit.</em></h1><p class="lead">Daftar gratis, tanpa biaya bulanan. Bagi hasil hanya 3% dari penjualan yang selesai — uang pembeli langsung masuk ke rekening, e-wallet, atau QRIS Anda.</p>'+
    '<div class="quick" style="text-align:left;max-width:760px;margin:0 auto 24px">'+
    '<div class="card qa"><div class="ico">'+I("store")+'</div><div><b>Makanan, minuman & sembako</b><span class="small muted">Warung, rumah makan, kedai, toko kelontong</span></div></div>'+
    '<div class="card qa"><div class="ico">'+I("percent")+'</div><div><b>Bagi hasil 3%</b><span class="small muted">Uang langsung ke Anda</span></div></div>'+
    '<div class="card qa"><div class="ico">'+I("chart")+'</div><div><b>Laporan otomatis</b><span class="small muted">Omzet & produk terlaris</span></div></div></div>'+
    '<button class="btn" style="padding:15px 26px;font-size:16px" data-act="go" data-v="register">Daftarkan toko sekarang →</button>'+
    (SB?'<p class="small muted" style="margin-top:16px">Sudah punya toko di HP/laptop lain? <a style="cursor:pointer;font-weight:700" data-act="akses">Masuk dengan kode akses</a></p>':'')+'</div>';
  const s = storeById(S.sellerStoreId) || ms[0];
  S.sellerStoreId = s.id;
  if(prodUnsubFor !== s.id) setTimeout(() => watchProducts(s.id), 0);
  const orders = S.orders.filter(o => o.storeId === s.id);
  const titles = {ringkasan:"Ringkasan", pesanan:"Pesanan masuk", produk:"Produk", laporan:"Laporan penjualan", stok:"Stok & pencatatan barang", saldo:"Saldo & bagi hasil", pengaturan:"Pengaturan & pembayaran"};
  let h = '<div class="dash-hero">'+avatarHtml(s)+'<div class="grow"><div class="small muted">'+esc(titles[S.sellerTab]||"")+'</div><h2>'+esc(s.name)+'</h2><div class="small muted">'+esc(s.category)+' · '+esc(s.area||"")+'</div></div>'+
    '<div class="actions" style="margin:0;align-items:center">'+(ms.length>1?'<select class="in" style="width:auto" data-act="pick-store">'+ms.map(m=>'<option value="'+esc(m.id)+'" '+(m.id===s.id?"selected":"")+'>'+esc(m.name)+'</option>').join("")+'</select>':'')+
    '<span class="switch '+(s.open===false?"":"on")+'" data-act="toggle-open"><i></i>'+(s.open===false?"Toko tutup":"Toko buka")+'</span>'+
    '<button class="btn ghost sm" data-act="preview-store" data-id="'+esc(s.id)+'">'+I("eye")+' Lihat toko</button>'+
    '<button class="btn ghost sm" data-act="store-link" data-id="'+esc(s.id)+'">'+I("megaphone")+' Salin link toko</button>'+
    '<button class="btn ghost sm sup-btn" data-act="sup-open" data-v="store:'+esc(s.id)+'">'+I("chat")+' Tanya JAGA'+supBadge("store:"+s.id)+'</button>'+
    '<button class="btn ghost sm" data-act="go" data-v="register" data-new="1">+ Toko baru</button>'+
    '<button class="btn ghost sm out-btn" data-act="store-logout" data-id="'+esc(s.id)+'">'+I("logout")+' Keluar</button></div></div>';
  if(s.active === false) h += '<div class="notice warnbox">'+I("bell")+' <b>Toko Anda sedang dinonaktifkan tim JAGA</b> dan tidak tampil di aplikasi pembeli. <button class="linkbtn" data-act="sup-open" data-v="store:'+esc(s.id)+'">Tanya tim JAGA</button></div>';
  if(["ringkasan","pesanan"].includes(S.sellerTab || "ringkasan")) h += askInbox(s);
  if((S.sup.unread||{})["store:"+s.id]) h += '<button class="supnote" data-act="sup-open" data-v="store:'+esc(s.id)+'">'+I("chat")+'<div class="grow"><b>Ada pesan baru dari tim JAGA</b><small>Ketuk untuk membaca dan membalas</small></div><em>'+S.sup.unread["store:"+s.id]+'</em></button>';
  if(S.sellerTab === "ringkasan") h += portalInstallCard("seller");
  if(S.sellerTab === "pengaturan") h += '<div class="plist sndcard">'+soundRow()+'</div>';
  h += pushCard("store", "Bunyikan notifikasi saat ada pesanan baru, walau aplikasi ditutup.");
  if(S.sellerTab === "ringkasan") h += sellerDashboard(s, orders);
  else if(S.sellerTab === "pesanan") h += sellerOrders(s, orders);
  else if(S.sellerTab === "produk") h += sellerProducts(s);
  else if(S.sellerTab === "laporan") h += sellerReport(s, orders);
  else if(S.sellerTab === "stok") h += isGrocer(s) ? sellerStock(s, orders) : sellerProducts(s);
  else if(S.sellerTab === "saldo") h += sellerWallet(s);
  else h += storeForm(s) + promoCard(s) + '<div class="card pad" style="margin-top:16px"><h3 class="sub">'+I("phone")+' Aplikasi JAGA Mitra</h3><p class="small muted" style="margin:0">Pasang di HP agar portal toko terbuka langsung dari layar utama, tanpa mengetik alamat.</p>'+portalInstallRow("seller")+'</div>' + storeLoginSettings(s) + (SB ? '<div class="card pad" style="margin-top:16px"><h3 class="sub">'+I("settings")+' Kode akses toko</h3><p class="small muted" style="margin:0 0 12px">Kode ini membuktikan bahwa Anda pemilik toko. Gunakan untuk membuka dashboard di HP/laptop lain. <b>Jangan bagikan ke siapa pun.</b></p><div class="actions"><button class="btn ghost sm" data-act="akses-copy">Salin kode akses</button><button class="btn ghost sm" data-act="akses">Masuk dengan kode lain</button></div></div>' : '');
  return h;
}
function sellerDashboard(s, orders){
  const today = new Date(); today.setHours(0,0,0,0);
  const isToday = t => t && new Date(t) >= today;
  const todayOrders = orders.filter(o => isToday(o.createdAt) && o.status !== "dibatalkan");
  const todayRev = orders.filter(o => o.status === "selesai" && isToday(o.doneAt||o.createdAt)).reduce((a,o)=>a+o.total,0);
  const need = orders.filter(o => ["menunggu_konfirmasi","diproses","mencari_driver","driver_ke_toko","diantar"].includes(o.status)).sort((a,b)=>(a.createdAt||0)-(b.createdAt||0));
  const prods = S.products[s.id] || [];
  const low = prods.filter(p => p.active !== false && typeof p.stock === "number" && p.stock <= 3);
  let h = walletChip(s) + '<div class="stats">'+
    '<div class="card stat"><div class="l">Omzet hari ini</div><div class="v">'+rp(todayRev)+'</div></div>'+
    '<div class="card stat"><div class="l">Pesanan hari ini</div><div class="v">'+todayOrders.length+'</div></div>'+
    '<div class="card stat"><div class="l">Perlu tindakan</div><div class="v" style="color:'+(need.length?"#3b74ff":"inherit")+'">'+need.length+'</div></div>'+
    '<div class="card stat" data-act="nav" data-v="seller" data-t="laporan" style="cursor:pointer"><div class="l">Bagi hasil 3% bulan ini</div><div class="v">'+rp(monthShare(orders, new Date()))+'</div><div class="small muted">'+prods.filter(p=>p.active!==false).length+' produk aktif'+(low.length?' · <span style="color:var(--warn);font-weight:700">'+low.length+' stok menipis</span>':'')+'</div></div></div>';
  const p = s.pay || {};
  const steps = [
    ["Lengkapi profil toko", !!(s.name && s.address && (s.wa || s.hasWa))],
    ["Atur akun pembayaran", payMethodsOf(s).length>0],
    ["Tambahkan logo toko", !!s.logo],
    ["Tambahkan produk pertama", prods.length>0],
    ["Pasang QRIS agar pembeli mudah bayar", !!p.qris],
    ["Atur titik lokasi toko agar driver terdekat ditemukan", typeof s.lat === "number"]
  ];
  if(steps.some(x=>!x[1])) h += '<div class="card checklist"><h3 class="sub">Siapkan toko Anda · '+steps.filter(x=>x[1]).length+'/'+steps.length+'</h3>'+steps.map(x=>'<div class="it '+(x[1]?"ok":"")+'"><span class="dot">'+(x[1]?"✓":"")+'</span><span>'+x[0]+'</span></div>').join("")+'</div>';
  h += '<div class="quick">'+
    '<div class="card qa" data-act="quick-add"><div class="ico">'+I("plus")+'</div><div><b>Tambah produk</b><span class="small muted">Foto, harga, stok</span></div></div>'+
    '<div class="card qa" data-act="nav" data-v="seller" data-t="pesanan"><div class="ico">'+I("receipt")+'</div><div><b>Kelola pesanan</b><span class="small muted">'+need.length+' menunggu</span></div></div>'+
    '<div class="card qa" data-act="share-store" data-id="'+esc(s.id)+'"><div class="ico">'+I("megaphone")+'</div><div><b>Promosikan toko</b><span class="small muted">Salin teks promosi</span></div></div>'+
    '<div class="card qa" data-act="nav" data-v="seller" data-t="laporan"><div class="ico">'+I("chart")+'</div><div><b>Laporan</b><span class="small muted">Omzet & terlaris</span></div></div></div>';
  h += '<div class="sec-head"><h2 style="font-size:20px">Perlu tindakan</h2>'+(need.length?'<button class="btn ghost sm" data-act="nav" data-v="seller" data-t="pesanan">Semua pesanan →</button>':'')+'</div>';
  h += need.length ? need.slice(0,5).map(o => orderCard(s,o)).join("") : '<div class="empty card"><div class="big">'+I("coffee")+'</div><b>Semua beres.</b><p>Pesanan baru akan muncul di sini.</p></div>';
  if(low.length) h += '<div class="card pad" style="margin-top:16px"><h3 class="sub">Stok menipis</h3>'+low.map(p=>'<div class="line-item"><div class="thumb">'+(p.img?'<img alt="" src="'+esc(p.img)+'">':I("package"))+'</div><div class="grow"><b>'+esc(p.name)+'</b><div class="small muted">Sisa '+p.stock+'</div></div><button class="btn ghost sm" data-act="'+(isGrocer(s)?"stk-in":"edit-prod")+'" data-id="'+esc(p.id)+'">Tambah stok</button></div>').join("")+'</div>';
  return h;
}
function sellerOrders(s, orders){
  const groups = {
    aktif: orders.filter(o => !["selesai","dibatalkan"].includes(o.status)),
    selesai: orders.filter(o => o.status === "selesai"),
    batal: orders.filter(o => o.status === "dibatalkan")
  };
  const list = (groups[S.orderFilter]||[]).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
  let h = (walletLow(s.id, 0) ? walletChip(s) : '') + '<div class="tabs">'+[["aktif","Aktif"],["selesai","Selesai"],["batal","Dibatalkan"]].map(t=>'<button class="chip '+(S.orderFilter===t[0]?"on":"")+'" data-act="ofilter" data-v="'+t[0]+'">'+t[1]+' ('+groups[t[0]].length+')</button>').join("")+'</div>';
  if(!list.length) return h + '<div class="empty card"><div class="big">'+I("inbox")+'</div>Belum ada pesanan di sini.</div>';
  const PG = pg("sord_" + S.orderFilter, list, 20);
  return h + PG.items.map(o => orderCard(s,o)).join("") + PG.btn;
}
function orderCard(s, o){
  {
    let acts = "";
    if(o.status==="menunggu_pembayaran") acts = '<span class="small muted">Menunggu pembeli membayar.</span>';
    const cod = o.pay && o.pay.k === "cod";
    const selfBtn = '<button class="btn ghost sm" data-act="self-deliver" data-id="'+esc(o.id)+'">Antar sendiri</button>';
    let info = "";
    if(o.status==="menunggu_konfirmasi") acts = cod ? '<button class="btn sm" data-act="set-status" data-id="'+esc(o.id)+'" data-v="mencari_driver">✓ Terima pesanan & cari driver</button>'
      : '<button class="btn sm" data-act="set-status" data-id="'+esc(o.id)+'" data-v="mencari_driver">✓ Pembayaran diterima, cari driver</button><button class="btn danger sm" data-act="set-status" data-id="'+esc(o.id)+'" data-v="menunggu_pembayaran">Bukti tidak valid</button>';
    if(o.status==="diproses") acts = '<button class="btn sm" data-act="set-status" data-id="'+esc(o.id)+'" data-v="mencari_driver">'+I("truck")+' Cari driver</button>'+selfBtn;
    if(["menunggu_konfirmasi","menunggu_pembayaran"].includes(o.status) && walletLow(o.storeId, typeof o.share==="number"?o.share:shareOf(o))){
      info += '<div class="wlowbox">'+E("money")+'<div><b>Saldo toko kurang</b><small>Butuh minimal '+rp(walletNeed(o.storeId, o.share))+' untuk menerima pesanan ini. Saldo sekarang '+rp((S.wallet[o.storeId]||{}).balance||0)+'.</small></div><button class="btn sm" data-act="nav" data-v="seller" data-t="saldo">Isi saldo</button></div>';
      if(o.status==="menunggu_konfirmasi") acts = "";
    }
    if(o.status==="mencari_driver"){ info = searchBox(o, "Mencari driver terdekat dari toko Anda…", true) + callDrvLine(o); acts = '<button class="btn sm" data-act="call-drv" data-id="'+esc(o.id)+'">'+I("chat")+' Minta driver langsung</button>' + (searchElapsed(o) >= 210 ? '<button class="btn sm" data-act="set-status" data-id="'+esc(o.id)+'" data-v="mencari_driver">Cari ulang</button>' : '')+selfBtn; }
    if(o.status==="driver_ke_toko"){
      if(o.handedAt) info = driverBox(o, "Pesanan sudah diserahkan ke driver ✓", true);
      else {
        info = driverBox(o, "Driver menuju toko Anda. Siapkan pesanan."+(cod?" (COD — atur pembayaran barang dengan driver)":""), true) + liveMap(o, "toko");
        if(o.codeReq) info += '<div class="codein"><label class="f">Kode dari driver</label><div class="codein-row"><input class="in" inputmode="numeric" maxlength="4" placeholder="• • • •" id="pcode-'+esc(o.id)+'" autocomplete="off"><button class="btn sm press" data-act="pick-verify" data-id="'+esc(o.id)+'">Cocokkan</button></div><div class="hint">Minta driver menunjukkan 4 angka kode ambil. Serahkan pesanan hanya bila kodenya cocok.</div></div>';
      }
    }
    if(o.status==="selesai") info += proofBtn(o);
    if(o.status==="diantar"){ if(o.driverId) info = driverBox(o, "Pesanan sedang diantar driver ke pembeli.", true); else acts = '<button class="btn sm" data-act="set-status" data-id="'+esc(o.id)+'" data-v="selesai">Tandai selesai</button>'; }
    if(!["selesai","dibatalkan","diantar"].includes(o.status)) acts += '<button class="btn danger sm" data-act="seller-cancel" data-id="'+esc(o.id)+'">Tolak / batalkan</button>';
    if(o.status==="menunggu_konfirmasi" && s && typeof s.lat !== "number") info += '<div class="small" style="margin-top:8px;color:var(--warn);font-weight:600">'+I("pin")+' Lokasi toko belum diatur — driver dicari dari semua yang online. Atur di Pengaturan agar dapat driver terdekat.</div>';
    return '<div class="card order"><div class="order-top"><div><b>'+esc(o.code)+'</b> <span class="small muted">· '+fmtDate(o.createdAt)+'</span><div class="small">'+esc(o.buyer.name)+'</div></div>'+statusTag(o.status)+'</div>'+
      '<div class="small" style="margin-top:8px">'+o.items.map(i=>'<b>'+i.qty+'×</b> '+esc(i.name)).join(" · ")+'</div>'+
      '<div class="small muted" style="margin-top:4px">'+I("pin")+' '+esc(o.buyer.address)+(o.buyer.maps?' · <a target="_blank" rel="noopener" href="'+esc(o.buyer.maps)+'">peta</a>':'')+'</div>'+
      (o.buyer.note?'<div class="small muted">'+I("note")+' '+esc(o.buyer.note)+'</div>':'')+
      '<div style="margin-top:6px"><b>'+rp(o.total)+'</b> <span class="small muted">· '+esc(o.pay?o.pay.type:"")+' · bagi hasil 3%: '+rp(typeof o.share==="number"?o.share:shareOf(o))+'</span></div>'+
      (o.proof?'<details style="margin-top:6px"><summary class="small" style="cursor:pointer;font-weight:700">Lihat bukti pembayaran</summary><img class="proof" alt="Bukti pembayaran" src="'+esc(o.proof)+'"></details>':'')+
      info+'<div class="actions">'+acts+chatBtn(o, "toko", "Chat", "ghost sm")+'<button class="btn ghost sm" data-act="report" data-k="order" data-id="'+esc(o.id)+'">Lapor</button></div></div>';
  }
}
function sellerProducts(s){
  const prods = S.products[s.id];
  let h = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><div class="muted small">'+(prods?prods.length:0)+' produk</div><button class="btn sm" data-act="edit-prod">+ Tambah produk</button></div>';
  if(!prods) return h + '<div class="empty">'+I("loader")+' Memuat…</div>';
  if(!prods.length) return h + '<div class="empty card"><div class="big">'+I("package")+'</div>Belum ada produk. Tambahkan produk pertama Anda.</div>';
  return h + '<div class="card pad">'+prods.map(p =>
    '<div class="line-item"><div class="thumb">'+(p.img?'<img alt="" src="'+esc(p.img)+'">':I("package"))+'</div><div class="grow"><div style="font-weight:700">'+esc(p.name)+' '+(p.active===false?'<span class="tag gray">Disembunyikan</span>':'')+'</div><div class="small muted">'+rp(p.price)+(typeof p.stock==="number"?' · stok '+p.stock:' · stok tidak dibatasi')+'</div></div>'+
    '<button class="btn ghost sm" data-act="edit-prod" data-id="'+esc(p.id)+'">Ubah</button></div>').join("")+'</div>';
}

/* ============ Stok & pencatatan barang (khusus toko sembako) ============ */
const isGrocer = st => !!st && /sembako/i.test(st.category || "");
S.stk = {p:7, f:"semua", log:{}};
const STK = {
  async add(sid, pid, type, qty, note){
    if(SB) return await sbStore.rpc("jt_stock_add", {p_store:sid, p_pid:pid, p_type:type, p_qty:qty, p_note:note});
    const p = (S.products[sid] || []).find(x => x.id === pid); if(!p) throw srvErr("Barang tidak ditemukan");
    const old = typeof p.stock === "number" ? p.stock : null; let nw;
    if(type === "masuk") nw = (old || 0) + qty;
    else if(type === "keluar"){ if((old || 0) < qty) throw srvErr("Stok tidak cukup (sisa " + (old || 0) + ")"); nw = (old || 0) - qty; }
    else nw = qty;
    await store.update("stores/" + sid + "/products/" + pid, {stock:nw});
    const e = {t:Date.now(), pid, name:p.name, type, qty, before:old, after:nw, note:(note || "").slice(0, 120)};
    const k = "jt_stocklog_" + sid; let a = []; try{ a = JSON.parse(localStorage.getItem(k) || "[]"); }catch(_){}
    a.unshift(e); try{ localStorage.setItem(k, JSON.stringify(a.slice(0, 300))); }catch(_){}
    return e;
  },
  async list(sid){
    if(SB) return (await sbStore.rpc("jt_stock_log", {p_store:sid})) || [];
    try{ return JSON.parse(localStorage.getItem("jt_stocklog_" + sid) || "[]"); }catch(_){ return []; }
  }
};
async function loadStockLog(sid){
  try{ S.stk.log[sid] = await STK.list(sid); }catch(e){ S.stk.log[sid] = S.stk.log[sid] || []; }
  if(S.role === "seller" && S.sellerTab === "stok" && !typing()) scheduleRender();
}
const stkMin = p => typeof p.minStock === "number" ? p.minStock : 5;
function stkFrom(days){ const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate() - (days - 1)); return d.getTime(); }
function stkSold(orders, days){
  const from = stkFrom(days), m = {};
  orders.filter(o => o.status === "selesai" && (o.doneAt || o.createdAt || 0) >= from).forEach(o => (o.items || []).forEach(i => { const x = m[i.pid] = m[i.pid] || {q:0, rp:0}; x.q += i.qty; x.rp += i.qty * (i.price || 0); }));
  return m;
}
function stkStat(l, v, sub, color){ return '<div class="card stat"><div class="l">'+l+'</div><div class="v"'+(color?' style="color:'+color+'"':'')+'>'+v+'</div><div class="small muted">'+sub+'</div></div>'; }
function sellerStock(s, orders){
  const prods = S.products[s.id];
  if(!prods) return '<div class="empty">'+I("loader")+' Memuat…</div>';
  if(S.stk.log[s.id] === undefined){ S.stk.log[s.id] = null; loadStockLog(s.id); }
  if(!prods.length) return '<div class="empty card"><div class="big">'+I("basket")+'</div><b>Belum ada barang.</b><p>Tambahkan barang di menu Produk, lalu catat stoknya di sini.</p><button class="btn sm" data-act="edit-prod">+ Tambah barang</button></div>';
  const P = S.stk.p, sold = stkSold(orders, P), act = {};
  orders.filter(o => !["selesai","dibatalkan"].includes(o.status)).forEach(o => (o.items || []).forEach(i => { act[i.pid] = (act[i.pid] || 0) + i.qty; }));
  const tracked = prods.filter(p => typeof p.stock === "number");
  const isOut = p => typeof p.stock === "number" && p.stock <= 0, isLow = p => typeof p.stock === "number" && p.stock > 0 && p.stock <= stkMin(p);
  const low = prods.filter(isLow), out = prods.filter(isOut), untracked = prods.length - tracked.length;
  const units = tracked.reduce((a, p) => a + p.stock, 0), value = tracked.reduce((a, p) => a + p.stock * (p.price || 0), 0);
  const soldQ = Object.values(sold).reduce((a, x) => a + x.q, 0), soldRp = Object.values(sold).reduce((a, x) => a + x.rp, 0);
  const PL = {1:"hari ini", 7:"7 hari", 30:"30 hari"}[P];
  let h = '<div class="stats">'+
    stkStat("Stok tersisa", units.toLocaleString("id-ID")+" pcs", tracked.length+" dari "+prods.length+" barang dicatat")+
    stkStat("Terjual "+PL, soldQ.toLocaleString("id-ID")+" pcs", rp(soldRp))+
    stkStat("Nilai stok", rp(value), "harga jual × stok tersisa")+
    stkStat("Perlu belanja", (low.length + out.length)+" barang", out.length+" habis · "+low.length+" menipis", (low.length + out.length) ? "var(--warn)" : "")+'</div>';
  h += '<div class="stk-bar"><div class="tabs" style="margin:0">'+[[1,"Hari ini"],[7,"7 hari"],[30,"30 hari"]].map(t => '<button class="chip '+(P===t[0]?"on":"")+'" data-act="stk-p" data-v="'+t[0]+'">'+t[1]+'</button>').join("")+'</div>'+
    '<button class="btn sm" data-act="stk-new">'+I("plus")+' Catat stok</button><button class="btn ghost sm" data-act="stk-csv">Unduh CSV</button></div>';
  h += '<div class="card pad"><div class="stk-head"><h3 class="sub" style="margin:0">Daftar barang</h3><input class="in" id="stkq" placeholder="Cari barang…" autocomplete="off"></div>'+
    '<div class="tabs" style="margin:10px 0 2px">'+[["semua","Semua",prods.length],["menipis","Menipis",low.length],["habis","Habis",out.length],["belum","Belum dicatat",untracked]].map(t => '<button class="chip '+(S.stk.f===t[0]?"on":"")+'" data-act="stk-f" data-v="'+t[0]+'">'+t[1]+' ('+t[2]+')</button>').join("")+'</div>';
  let list = prods.slice();
  if(S.stk.f === "menipis") list = low; else if(S.stk.f === "habis") list = out; else if(S.stk.f === "belum") list = prods.filter(p => typeof p.stock !== "number");
  const rank = p => isOut(p) ? 0 : isLow(p) ? 1 : typeof p.stock === "number" ? 2 : 3;
  list = list.slice().sort((a, b) => rank(a) - rank(b) || String(a.name).localeCompare(String(b.name), "id"));
  h += list.length ? list.map(p => {
    const tr = typeof p.stock === "number", cls = !tr ? "na" : isOut(p) ? "out" : isLow(p) ? "low" : "";
    const sq = (sold[p.id] || {}).q || 0, aq = act[p.id] || 0;
    return '<div class="stk-row" data-n="'+esc(String(p.name).toLowerCase())+'"><div class="thumb">'+(p.img?'<img alt="" src="'+esc(p.img)+'">':I("package"))+'</div>'+
      '<div class="grow"><b>'+esc(p.name)+'</b><div class="small muted">'+rp(p.price)+' · terjual '+PL+': <b style="color:var(--ink)">'+sq+'</b>'+(aq?' · '+aq+' sedang dipesan':'')+'</div></div>'+
      '<div class="stk-num '+cls+'"><b>'+(tr ? p.stock.toLocaleString("id-ID") : "–")+'</b><small>'+(!tr ? "belum dicatat" : isOut(p) ? "habis" : isLow(p) ? "menipis" : "sisa")+'</small></div>'+
      '<div class="stk-acts">'+(tr
        ? '<button class="btn ghost sm" data-act="stk-in" data-id="'+esc(p.id)+'">+ Masuk</button><button class="btn ghost sm" data-act="stk-out" data-id="'+esc(p.id)+'">− Keluar</button>'
        : '<button class="btn ghost sm" data-act="stk-op" data-id="'+esc(p.id)+'">Mulai catat</button>')+'</div></div>';
  }).join("") : '<div class="empty" style="padding:22px 0">Tidak ada barang di daftar ini.</div>';
  h += '</div>';
  // riwayat
  const logs = S.stk.log[s.id];
  const ev = (logs || []).map(e => ({t:e.t, name:e.name, type:e.type, qty:e.qty, after:e.after, note:e.note}));
  orders.filter(o => o.status === "selesai" && (o.doneAt || o.createdAt || 0) >= stkFrom(30)).forEach(o => (o.items || []).forEach(i => ev.push({t:o.doneAt || o.createdAt, name:i.name, type:"terjual", qty:i.qty, note:"Pesanan "+(o.code || "")})));
  ev.sort((a, b) => (b.t || 0) - (a.t || 0));
  const TY = {masuk:["Masuk","plus","+"], keluar:["Keluar","minus","−"], opname:["Stok opname","eq","="], terjual:["Terjual","minus","−"]};
  h += '<div class="card pad stk-log" style="margin-top:16px"><h3 class="sub">Riwayat stok</h3>'+
    (logs === null ? '<div class="empty" style="padding:16px 0">'+I("loader")+' Memuat…</div>' : ev.length ? ev.slice(0, 40).map(e => { const ty = TY[e.type] || TY.masuk;
      return '<div class="li"><span class="stk-ic '+ty[1]+'">'+(e.type==="terjual"?I("cart"):e.type==="masuk"?I("plus"):e.type==="opname"?I("note"):I("package"))+'</span><div class="grow"><b>'+esc(e.name || "")+'</b><div class="small muted">'+ty[0]+' · '+fmtDate(e.t)+(e.note?' · '+esc(e.note):'')+'</div></div><div class="stk-q '+ty[1]+'">'+ty[2]+e.qty+(typeof e.after==="number"?'<small>sisa '+e.after+'</small>':'')+'</div></div>'; }).join("")
      : '<div class="empty" style="padding:16px 0">Belum ada catatan. Tekan <b>Catat stok</b> setiap ada barang masuk atau keluar.</div>')+'</div>';
  return h;
}
function openStock(pid, type){
  const s = storeById(S.sellerStoreId); if(!s) return;
  const prods = (S.products[s.id] || []).slice().sort((a, b) => String(a.name).localeCompare(String(b.name), "id"));
  if(!prods.length) return toast("Tambahkan barang dulu di menu Produk.");
  const sel = prods.find(p => p.id === pid) || prods[0];
  const TYP = [["masuk","Barang masuk","Kulakan / restok"],["keluar","Barang keluar","Rusak, hilang, dipakai"],["opname","Stok opname","Hitung ulang stok"]];
  document.getElementById("modal").innerHTML = '<div class="modal-bg" data-act="modal-bg"><form class="modal" id="stkForm"><h2 class="sec" style="margin-top:0">Catat stok barang</h2>'+
    '<label class="f">Barang</label><select class="in" name="pid">'+prods.map(p => '<option value="'+esc(p.id)+'" '+(p.id===sel.id?"selected":"")+'>'+esc(p.name)+' · '+(typeof p.stock==="number"?"sisa "+p.stock:"belum dicatat")+'</option>').join("")+'</select>'+
    '<label class="f">Jenis catatan</label><div class="stk-seg">'+TYP.map(t => '<label><input type="radio" name="type" value="'+t[0]+'" '+(t[0]===type?"checked":"")+'><span><b>'+t[1]+'</b><small>'+t[2]+'</small></span></label>').join("")+'</div>'+
    '<label class="f" id="stkQl">'+stkQLabel(type)+'</label><input class="in" name="qty" type="number" min="0" step="1" inputmode="numeric" required placeholder="0">'+
    '<label class="f">Catatan (opsional)</label><input class="in" name="note" maxlength="120" placeholder="Contoh: kulakan dari agen, 2 karung">'+
    '<div class="actions" style="margin-top:16px"><button class="btn" style="flex:1">Simpan catatan</button><button type="button" class="btn ghost" data-act="close-modal">Batal</button></div></form></div>';
  setTimeout(() => { const q = document.querySelector("#stkForm [name=qty]"); if(q) q.focus(); }, 50);
}
const stkQLabel = t => t === "keluar" ? "Jumlah keluar" : t === "opname" ? "Stok sebenarnya sekarang" : "Jumlah masuk";
async function saveStock(f){
  const s = storeById(S.sellerStoreId); if(!s) return;
  const fd = new FormData(f), pid = fd.get("pid"), type = fd.get("type") || "masuk", qty = Math.round(Number(fd.get("qty")));
  if(!(qty >= 0) || (type !== "opname" && qty < 1)) return toast("Isi jumlah barang.");
  const btn = f.querySelector("button.btn"); if(btn) btn.disabled = true;
  let e = null;
  const ok = await safe(async () => { e = await STK.add(s.id, pid, type, qty, (fd.get("note") || "").trim()); });
  if(btn) btn.disabled = false;
  if(!ok || !e) return;
  const p = (S.products[s.id] || []).find(x => x.id === pid); if(p && typeof e.after === "number") p.stock = e.after;
  if(S.stk.log[s.id]) S.stk.log[s.id].unshift(e);
  closeModal(); toast("Stok "+(e.name || "barang")+" sekarang "+e.after); render(); loadStockLog(s.id);
}
function stockCsv(){
  const s = storeById(S.sellerStoreId); if(!s) return;
  const prods = S.products[s.id] || [], orders = S.orders.filter(o => o.storeId === s.id), P = S.stk.p, sold = stkSold(orders, P);
  const q = v => '"' + String(v == null ? "" : v).replace(/"/g, '""') + '"';
  const rows = [["Barang","Harga","Stok tersisa","Batas menipis","Terjual ("+P+" hari)","Omzet ("+P+" hari)","Nilai stok"]].concat(prods.map(p => [p.name, p.price || 0, typeof p.stock==="number"?p.stock:"", stkMin(p), (sold[p.id]||{}).q||0, (sold[p.id]||{}).rp||0, typeof p.stock==="number"?p.stock*(p.price||0):""]));
  const blob = new Blob(["﻿" + rows.map(r => r.map(q).join(",")).join("\n")], {type:"text/csv;charset=utf-8"});
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "stok-" + (s.name||"toko").toLowerCase().replace(/[^a-z0-9]+/g,"-") + "-" + new Date().toISOString().slice(0,10) + ".csv";
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
document.addEventListener("input", e => {
  if(e.target && e.target.id === "ownFind"){ const v = e.target.value.trim().toLowerCase(); document.querySelectorAll(".ost[data-n],.odrv[data-n]").forEach(r => { r.style.display = !v || r.dataset.n.includes(v) ? "" : "none"; }); }
  if(e.target && e.target.id === "ownIq"){ S.own.iq = e.target.value; const v = e.target.value.trim().toLowerCase(); document.querySelectorAll(".ith").forEach(r => { r.style.display = !v || r.textContent.toLowerCase().includes(v) ? "" : "none"; }); }
  if(e.target && e.target.id === "stkq"){ const v = e.target.value.trim().toLowerCase(); document.querySelectorAll(".stk-row").forEach(r => { r.style.display = !v || r.dataset.n.includes(v) ? "" : "none"; }); }
});
document.addEventListener("change", e => {
  if(e.target && e.target.name === "type" && e.target.closest("#stkForm")){ const l = document.getElementById("stkQl"); if(l) l.textContent = stkQLabel(e.target.value); }
});
function monthKey(t){ const d = new Date(t); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0"); }
function monthShare(orders, date){ const k = monthKey(date); return orders.filter(o => o.status==="selesai" && monthKey(o.doneAt||o.createdAt)===k).reduce((a,o)=>a+(typeof o.share==="number"?o.share:shareOf(o)),0); }
function shareTable(s, orders){
  const done = orders.filter(o => o.status === "selesai");
  const m = {};
  done.forEach(o => { const k = monthKey(o.doneAt||o.createdAt); m[k] = m[k] || {n:0, sales:0, share:0}; m[k].n++; m[k].sales += o.total; m[k].share += (typeof o.share==="number"?o.share:shareOf(o)); });
  const keys = Object.keys(m).sort().reverse();
  const nowK = monthKey(Date.now());
  const label = k => { const [y,mo] = k.split("-"); return new Date(+y, +mo-1, 1).toLocaleDateString("id-ID",{month:"long", year:"numeric"}); };
  const msg = k => "Halo JAGA, saya dari "+s.name+". Konfirmasi pembayaran bagi hasil 3% bulan "+label(k)+": "+rp(m[k].share)+" ("+m[k].n+" pesanan, penjualan "+rp(m[k].sales)+").";
  let h = '<div class="card pad" style="margin-top:16px"><h3 class="sub" style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><span>'+I("percent")+' Bagi hasil JAGA (3%)</span><span class="small muted" style="font-weight:600">dihitung dari pesanan selesai</span></h3>';
  if(!keys.length) return h + '<div class="muted small">Belum ada penjualan selesai. Bagi hasil hanya dihitung dari pesanan yang selesai.</div></div>';
  h += '<table class="t"><tr><th>Bulan</th><th class="num">Pesanan</th><th class="num">Penjualan</th><th class="num">Bagi hasil 3%</th><th></th></tr>'+
    keys.map(k => '<tr><td>'+esc(label(k))+(k===nowK?' <span class="tag gray">berjalan</span>':'')+'</td><td class="num">'+m[k].n+'</td><td class="num">'+rp(m[k].sales)+'</td><td class="num"><b>'+rp(m[k].share)+'</b></td><td class="num">'+
      '<span class="small muted">dipotong dari saldo</span>'+'</td></tr>').join("")+'</table>';
  h += '<div class="hint" style="margin-top:10px">Bagi hasil dipotong otomatis dari saldo toko setiap pesanan selesai. Lihat rinciannya di <a style="cursor:pointer;font-weight:700" data-act="nav" data-v="seller" data-t="saldo">menu Saldo</a>.</div></div>';
  return h;
}
function sellerReport(s, orders){
  const PD = S.repDays || 7, pFrom = Date.now() - PD * 86400000;
  const allOrders = orders; orders = orders.filter(o => (o.createdAt || 0) >= pFrom);
  const done = orders.filter(o => o.status === "selesai");
  const omzet = done.reduce((a,o)=>a+o.total,0);
  const active = orders.filter(o => !["selesai","dibatalkan"].includes(o.status));
  const pending = active.reduce((a,o)=>a+o.total,0);
  const days = [];
  for(let i=6;i>=0;i--){ const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate()-i); days.push({d, v:0}); }
  done.forEach(o => { const t = new Date(o.doneAt||o.createdAt); t.setHours(0,0,0,0); const x = days.find(y=>y.d.getTime()===t.getTime()); if(x) x.v += o.total; });
  const max = Math.max(1, ...days.map(x=>x.v));
  const top = {};
  done.forEach(o => o.items.forEach(i => { top[i.name] = top[i.name] || {q:0,v:0}; top[i.name].q += i.qty; top[i.name].v += i.qty*i.price; }));
  const topList = Object.entries(top).sort((a,b)=>b[1].v-a[1].v).slice(0,8);
  const byPay = {};
  done.forEach(o => { const k = o.pay?o.pay.type:"-"; byPay[k] = (byPay[k]||0)+o.total; });
  let h = '<div class="card pad" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><b class="small">Periode</b>'+[7,30,90].map(n => '<button class="btn '+(PD===n?'':'ghost ')+'sm" data-act="rep-days" data-v="'+n+'">'+n+' hari</button>').join("")+
    '<button class="btn ghost sm" data-act="rep-csv" style="margin-left:auto">'+I("receipt")+' Unduh laporan (CSV)</button></div>'+
    '<div class="stats">'+
    '<div class="card stat"><div class="l">Omzet '+PD+' hari (pesanan selesai)</div><div class="v">'+rp(omzet)+'</div></div>'+
    '<div class="card stat"><div class="l">Pendapatan bersih setelah komisi</div><div class="v">'+rp(omzet - done.reduce((a,o)=>a+shareVal(o),0))+'</div><div class="small muted">komisi JAGA '+rp(done.reduce((a,o)=>a+shareVal(o),0))+'</div></div>'+
    '<div class="card stat"><div class="l">Pesanan selesai</div><div class="v">'+done.length+'</div></div>'+
    '<div class="card stat"><div class="l">Rata-rata per pesanan</div><div class="v">'+rp(done.length?omzet/done.length:0)+'</div></div>'+
    '<div class="card stat"><div class="l">Pesanan aktif</div><div class="v">'+active.length+'</div><div class="small muted">'+rp(pending)+' belum selesai</div></div></div>';
  h += '<div class="two"><div class="card pad"><h3 class="sub">Omzet 7 hari terakhir</h3><div class="bars">'+days.map(x=>'<div class="b" title="'+rp(x.v)+'"><span>'+(x.v?(x.v>=1e6?(x.v/1e6).toFixed(1)+"jt":Math.round(x.v/1e3)+"rb"):"")+'</span><i style="height:'+(x.v/max*100)+'%"></i>'+x.d.toLocaleDateString("id-ID",{weekday:"short"})+'</div>').join("")+'</div></div>';
  h += '<div class="card pad"><h3 class="sub">Per metode pembayaran</h3>'+(Object.keys(byPay).length?'<table class="t">'+Object.entries(byPay).map(([k,v])=>'<tr><td>'+esc(k)+'</td><td class="num">'+rp(v)+'</td></tr>').join("")+'</table>':'<div class="muted small">Belum ada data.</div>')+'</div></div>';
  h += shareTable(s, orders);
  h += '<div class="card pad" style="margin-top:16px"><h3 class="sub">Produk terlaris</h3>'+(topList.length?'<table class="t"><tr><th>Produk</th><th class="num">Terjual</th><th class="num">Pendapatan</th></tr>'+topList.map(([n,x])=>'<tr><td>'+esc(n)+'</td><td class="num">'+x.q+'</td><td class="num">'+rp(x.v)+'</td></tr>').join("")+'</table>':'<div class="muted small">Belum ada penjualan selesai.</div>')+'</div>';
  return h;
}
function viewWelcome(){
  const n = S.stores.filter(s=>s.active!==false).length;
  return '<div class="welcome"><span class="tag">'+I("sparkles")+' Selamat datang di JAGA</span><h1>Mau <em>belanja</em> atau<br><em>jualan</em> hari ini?</h1><p class="lead">Pilih peran Anda. Anda bisa berganti kapan saja lewat tombol di bagian atas.</p>'+
    '<div class="roles">'+
    '<div class="rolecard buyer" data-act="role" data-v="buyer"><div><div class="big-ic">'+I("bag")+'</div><h3>Saya pengunjung</h3><div class="muted">Cari kebutuhan dari'+(n?' '+n:'')+' toko di sekitar Anda.</div><ul><li>Diantar driver terdekat</li><li>Tanpa biaya admin</li><li>Bayar langsung ke toko</li></ul></div><div class="go">Mulai belanja →</div></div>'+
    '<div class="rolecard seller" data-act="role" data-v="seller"><div><div class="big-ic">'+I("store")+'</div><h3>Saya pemilik toko</h3><div class="muted">Daftarkan toko dan terima pesanan online.</div><ul><li>Daftar gratis, bagi hasil 3%</li><li>Pembayaran masuk ke akun Anda</li><li>Dashboard & laporan penjualan</li></ul></div><div class="go">Buka dashboard toko →</div></div>'+
    '</div></div>';
}
function viewRegister(){
  return '<button class="back" data-act="nav" data-v="seller" data-t="ringkasan">← Kembali</button><h2 class="sec">Daftarkan toko</h2><p class="muted" style="margin-top:-6px">Gratis, tanpa biaya admin. Pembeli membayar langsung ke rekening/e-wallet/QRIS milik Anda.</p>'+storeForm(null);
}
function storeForm(s){
  s = s || {}; const p = s.pay || {}; const bank = p.bank || {}; const ew = p.ewallet || [];
  const ewRow = i => { const w = ew[i]||{}; return '<div class="cols2"><div><label class="f">E-wallet '+(i+1)+'</label><select class="in" name="ew'+i+'type"><option value="">— tidak ada —</option>'+EWALLETS.map(e=>'<option '+(w.type===e?"selected":"")+'>'+e+'</option>').join("")+'</select></div><div><label class="f">Nomor</label><input class="in" name="ew'+i+'no" inputmode="tel" value="'+esc(w.no||"")+'"></div></div><label class="f">Atas nama</label><input class="in" name="ew'+i+'holder" value="'+esc(w.holder||"")+'">'; };
  return '<form class="card pad" id="storeForm" data-id="'+esc(s.id||"")+'">'+
    '<fieldset class="fieldset"><legend>Info toko</legend>'+
    '<label class="f">Logo / foto toko</label><div class="imgpick"><div class="prev" id="logoPrev">'+(s.logo?'<img alt="" src="'+esc(s.logo)+'">':I("store"))+'</div><input type="file" accept="image/*" id="logoFile"></div>'+
    '<label class="f">Nama toko *</label><input class="in" name="name" required value="'+esc(s.name||"")+'">'+
    '<div class="cols2"><div><label class="f">Jenis toko *</label><select class="in" name="category">'+CATS.map(c=>'<option '+(s.category===c?"selected":"")+'>'+c+'</option>').join("")+'</select></div>'+
    '<div><label class="f">Kota / daerah *</label><input class="in" name="area" required placeholder="Contoh: Denpasar" value="'+esc(s.area||"")+'"></div></div>'+
    '<label class="f">Wilayah layanan *</label><select class="in" name="region" required>'+(storeRegion(s) ? '' : '<option value="">Pilih wilayah…</option>')+AREAS.map(a => '<option value="'+esc(a.id)+'"'+(storeRegion(s) === a.id ? ' selected' : '')+'>'+esc(a.name)+(a.prov ? ', '+esc(a.prov) : '')+'</option>').join("")+'</select>'+
    '<div class="hint">Toko hanya tampil untuk pembeli di wilayah ini. Bila lokasi toko diatur di peta, wilayah mengikuti lokasi.</div>'+
    '<label class="f">Deskripsi singkat</label><textarea class="in" name="desc" placeholder="Apa yang Anda jual?">'+esc(s.desc||"")+'</textarea>'+
    '<label class="f">Alamat toko *</label><input class="in" name="address" required value="'+esc(s.address||"")+'">'+
    '<div class="cols2"><div><label class="f">No. WhatsApp toko *</label><input class="in" name="wa" required inputmode="tel" placeholder="08xxxxxxxxxx" value="'+esc(s.wa||"")+'"></div>'+
    '<div><label class="f">Jam buka</label><input class="in" name="hours" placeholder="08.00–21.00" value="'+esc(s.hours||"")+'"></div></div>'+
    '<label class="f">Titik lokasi toko (untuk mencari driver terdekat)</label><input type="hidden" name="slat" value="'+esc(s.lat??"")+'"><input type="hidden" name="slng" value="'+esc(s.lng??"")+'">'+
    '<button type="button" class="btn ghost locbtn" data-act="store-loc">'+I("pin")+' <span id="sLocTxt">'+(typeof s.lat==="number"?"Lokasi tersimpan ✓ ("+s.lat.toFixed(5)+", "+s.lng.toFixed(5)+") — ketuk untuk perbarui":"Ambil lokasi toko sekarang")+'</span></button>'+
    '<div class="hint">Tekan saat Anda berada di toko. Driver dalam radius 1 km dari titik ini dicari lebih dulu.</div></fieldset>'+
    '<fieldset class="fieldset"><legend>Akun pembayaran toko</legend><div class="hint">Isi minimal satu. Uang dari pembeli langsung masuk ke akun ini. Bagi hasil 3% untuk JAGA dipotong otomatis dari saldo toko (menu Saldo).</div>'+
    '<div class="cols2"><div><label class="f">Bank</label><input class="in" name="bankName" placeholder="BCA / BRI / Mandiri / BNI…" value="'+esc(bank.name||"")+'"></div><div><label class="f">No. rekening</label><input class="in" name="bankNo" inputmode="numeric" value="'+esc(bank.no||"")+'"></div></div>'+
    '<label class="f">Atas nama rekening</label><input class="in" name="bankHolder" value="'+esc(bank.holder||"")+'">'+
    ewRow(0)+ewRow(1)+
    '<label class="f">QRIS toko</label><div class="imgpick"><div class="prev" id="qrisPrev">'+(p.qris?'<img alt="" src="'+esc(p.qris)+'">':I("qr"))+'</div><input type="file" accept="image/*" id="qrisFile">'+(p.qris?'<label class="small"><input type="checkbox" name="qrisRemove"> hapus</label>':'')+'</div>'+
    '<label class="check"><input type="checkbox" name="cod" '+(p.cod?"checked":"")+'> Terima bayar di tempat (COD)</label></fieldset>'+
    (s.id ? '<div class="sharenote">'+I("percent")+' Bagi hasil JAGA: <b>3%</b> dari setiap penjualan selesai'+(s.shareAgreedAt?' · disetujui '+esc(new Date(s.shareAgreedAt).toLocaleDateString("id-ID")):'')+'</div>'
      : '<div class="sharebox"><b>'+I("percent")+' Bagi hasil 3%</b><p>Pembeli tidak dikenai biaya admin. Sebagai gantinya, toko membayar bagi hasil <b>3% dari setiap penjualan yang selesai</b> kepada JAGA, dipotong otomatis dari saldo toko setiap pesanan selesai. Pesanan yang dibatalkan tidak dipotong. Toko baru mendapat saldo gratis Rp15.000 untuk mulai, dan setiap 10 pesanan selesai sehari dapat 5 poin (bisa ditukar jadi saldo).</p><label class="check" style="margin-top:8px"><input type="checkbox" name="agreeShare" required> Saya setuju dengan bagi hasil 3% per penjualan</label><label class="check" style="margin-top:6px"><input type="checkbox" name="agreeRules"> Saya setuju dengan <a data-act="rules" style="color:#2f6bff;font-weight:700">Aturan JAGA</a> (1 nomor WA = 1 toko)</label></div>')+
    '<button class="btn block" style="margin-top:16px">'+(s.id?"Simpan perubahan":"Daftarkan toko")+'</button>'+
    (s.id?'<button type="button" class="btn danger block" style="margin-top:8px" data-act="del-store">Hapus toko</button>':'')+
    '</form>';
}

/* ============ Modal produk ============ */
function closeModal(){ document.getElementById("modal").innerHTML = ""; }
function openProdModal(pid){
  const s = storeById(S.sellerStoreId); if(!s) return;
  const p = pid ? (S.products[s.id]||[]).find(x=>x.id===pid) || {} : {};
  document.getElementById("modal").innerHTML = '<div class="modal-bg" data-act="modal-bg"><form class="modal" id="prodForm" data-id="'+esc(p.id||"")+'">'+
    '<h2 class="sec">'+(p.id?"Ubah produk":"Tambah produk")+'</h2>'+
    '<label class="f">Foto produk</label><div class="imgpick"><div class="prev" id="pimgPrev">'+(p.img?'<img alt="" src="'+esc(p.img)+'">':I("camera"))+'</div><input type="file" accept="image/*" id="pimgFile"></div>'+
    '<label class="f">Nama produk *</label><input class="in" name="name" required value="'+esc(p.name||"")+'">'+
    '<div class="cols2"><div><label class="f">Harga (Rp) *</label><input class="in" name="price" required type="number" min="0" step="100" value="'+esc(p.price??"")+'"></div>'+
    '<div><label class="f">Stok</label><input class="in" name="stock" type="number" min="0" placeholder="kosong = tidak dibatasi" value="'+(typeof p.stock==="number"?p.stock:"")+'"></div></div>'+
    (isGrocer(storeById(S.sellerStoreId)) ? '<label class="f">Batas stok menipis</label><input class="in" name="minStock" type="number" min="0" placeholder="5" value="'+(typeof p.minStock==="number"?p.minStock:"")+'"><div class="hint">Barang ditandai “menipis” saat stok sama atau di bawah angka ini.</div>' : '')+
    '<label class="f">Deskripsi</label><textarea class="in" name="desc">'+esc(p.desc||"")+'</textarea>'+
    '<label class="check"><input type="checkbox" name="active" '+(p.active===false?"":"checked")+'> Tampilkan di toko</label>'+
    '<div class="actions" style="margin-top:16px"><button class="btn">Simpan</button><button type="button" class="btn ghost" data-act="close-modal">Batal</button>'+(p.id?'<button type="button" class="btn danger" data-act="del-prod" data-id="'+esc(p.id)+'" style="margin-left:auto">Hapus</button>':'')+'</div></form></div>';
}
function confirmModal(text, okLabel, fn){
  document.getElementById("modal").innerHTML = '<div class="modal-bg" data-act="modal-bg"><div class="modal"><p style="margin-top:0;font-weight:600">'+esc(text)+'</p><div class="actions"><button class="btn danger" id="cOk">'+esc(okLabel)+'</button><button class="btn ghost" data-act="close-modal">Batal</button></div></div></div>';
  document.getElementById("cOk").onclick = async () => { closeModal(); await fn(); };
}


/* Foto bukti jemput/antar: opsional (atau wajib bila owner mengaktifkan). Foto dikompres lalu dikirim ke server. */
async function proofReq(){
  if(!SB) return false;
  if(S.proofReq === undefined){ try{ const { data } = await SB.rpc("jt_fraud_cfg"); S.proofReq = !!(data && data.proofReq); }catch(_){ S.proofReq = false; } }
  return S.proofReq;
}
async function proofConfirm(text, okLabel, fn, must){
  const req = must || await proofReq();
  document.getElementById("modal").innerHTML = '<div class="modal-bg" data-act="modal-bg"><div class="modal"><p style="margin-top:0;font-weight:600">'+esc(text)+'</p>'+
    '<label class="f">Foto bukti '+(req ? '(wajib)' : '(disarankan)')+'</label><input type="file" accept="image/*" capture="environment" class="in" id="proofPhoto"><div class="hint">Foto paket/serah terima melindungi Anda bila ada sengketa.</div>'+
    '<div class="actions"><button class="btn danger" id="cOk">'+esc(okLabel)+'</button><button class="btn ghost" data-act="close-modal">Batal</button></div></div></div>';
  document.getElementById("cOk").onclick = async () => {
    const f = document.getElementById("proofPhoto").files[0];
    if(req && !f) return toast("Foto bukti wajib diunggah.");
    let photo = ""; if(f){ try{ photo = await compressImage(f, 800); }catch(_){ return toast("Foto tidak bisa dibaca, coba foto lain."); } }
    closeModal(); await fn(photo);
  };
}
function proofBtn(o){
  if(!SB || !(o.hasPickPhoto || o.hasDonePhoto)) return "";
  return '<button class="btn ghost sm" style="margin-top:8px" data-act="proof-view" data-id="'+esc(o.id)+'">'+I("receipt")+' Lihat foto bukti</button>';
}
async function proofView(id){
  document.getElementById("modal").innerHTML = '<div class="modal-bg" data-act="modal-bg"><div class="modal"><h2 class="sec">Foto bukti</h2><div id="proofBox" class="muted small">Memuat…</div><div class="actions"><button type="button" class="btn ghost" onclick="closeModal()">Tutup</button></div></div></div>';
  try{
    const r = await sbStore.rpc("jt_proof_get", {p_order:id}); const box = document.getElementById("proofBox"); if(!box) return;
    const L = {pick:"Saat diambil dari toko", done:"Saat sampai & diserahkan ke pembeli"};
    const k = Object.keys(r || {});
    box.innerHTML = k.length ? k.map(x => '<div class="small muted" style="margin-top:8px">'+esc(L[x] || x)+' · '+esc(new Date(r[x].at).toLocaleString("id-ID"))+'</div><img class="proof" style="max-width:100%" alt="Foto bukti" src="'+esc(r[x].photo)+'">').join("") : "Belum ada foto.";
  }catch(err){ const box = document.getElementById("proofBox"); if(box) box.textContent = "Gagal memuat: " + String(err.message || err); }
}
const FR_RULE = {fast_done:"Selesai terlalu cepat", ongkir_high:"Ongkir jauh di atas estimasi", pair_repeat:"Driver & pembeli sama berulang", cancel_many:"Sering dibatalkan pembeli", no_photo:"Tanpa foto bukti"};
function fraudCard(){
  return '<div class="card pad"><h3 class="sub">Deteksi kecurangan</h3><div class="hint">Menandai pola mencurigakan 14 hari terakhir untuk Anda tinjau. Tidak ada akun yang dihukum otomatis.</div><button class="btn ghost sm" data-act="own-fraud">'+I("shield")+' Periksa sekarang</button></div>';
}
async function fraudOpen(){
  document.getElementById("modal").innerHTML = '<div class="modal-bg" data-act="modal-bg"><div class="modal"><h2 class="sec">Deteksi kecurangan</h2><div id="frBox" class="muted small">Memeriksa…</div><div class="actions"><button type="button" class="btn ghost" onclick="closeModal()">Tutup</button></div></div></div>';
  try{
    if(!SB) throw new Error("Aktif pada mode online.");
    const r = await sbStore.rpc("jt_owner_fraud_scan", {}); const box = document.getElementById("frBox"); if(!box) return;
    const c = r.cfg || {}, fl = r.flags || [], sev = {high:"Tinggi", med:"Sedang", low:"Rendah"};
    box.innerHTML = '<form id="frCfg" class="card pad" style="margin:0 0 12px"><label class="f" style="display:flex;gap:8px;align-items:center"><input type="checkbox" name="proofReq" '+(c.proofReq?'checked':'')+'> Wajibkan driver mengunggah foto bukti</label>'+
      '<div class="row2"><div><label class="f">Selesai tercepat (detik)</label><input class="in" name="fastSec" type="number" min="10" value="'+esc(c.fastSec)+'"></div><div><label class="f">Batas ongkir (× estimasi)</label><input class="in" name="ongkirX" type="number" step="0.1" min="1.2" value="'+esc(c.ongkirX)+'"></div></div>'+
      '<div class="row2"><div><label class="f">Ulang driver-pembeli (≥)</label><input class="in" name="pairN" type="number" min="2" value="'+esc(c.pairN)+'"></div><div><label class="f">Batal pembeli 24 jam (≥)</label><input class="in" name="cancelN" type="number" min="2" value="'+esc(c.cancelN)+'"></div></div>'+
      '<button class="btn sm" type="submit">Simpan aturan</button></form>'+
      (fl.length ? fl.map(x => '<div class="orow"><div class="grow"><b>'+esc(FR_RULE[x.rule] || x.rule)+'</b><small>'+esc(x.ref)+' · '+esc(x.who)+'</small><small>'+esc(x.detail)+'</small></div><div class="r"><small>'+esc(sev[x.sev] || x.sev)+'</small><small>'+esc(new Date(x.at).toLocaleDateString("id-ID"))+'</small></div></div>').join("") : '<div class="muted">Tidak ada tanda mencurigakan. 👍</div>');
  }catch(err){ const box = document.getElementById("frBox"); if(box) box.textContent = "Gagal memuat: " + String(err.message || err); }
}


/* Kode promo toko (dibiayai toko; server memvalidasi & menghitung ulang) */
function promoCard(s){
  if(!SB) return "";
  return '<div class="card pad" style="margin-top:16px"><h3 class="sub">'+I("percent")+' Kode promo</h3><p class="small muted" style="margin:0 0 12px">Buat kode diskon untuk pembeli (persen atau potongan tetap). Diskon ditanggung toko; bagi hasil JAGA dihitung dari total setelah diskon.</p><button class="btn ghost sm" data-act="promo-open" data-id="'+esc(s.id)+'">Kelola kode promo</button></div>';
}
async function promoOpen(sid){
  document.getElementById("modal").innerHTML = '<div class="modal-bg" data-act="modal-bg"><div class="modal"><h2 class="sec">Kode promo</h2><div id="promoBox" class="muted small">Memuat…</div><div class="actions"><button type="button" class="btn ghost" onclick="closeModal()">Tutup</button></div></div></div>';
  try{
    const rows = await sbStore.rpc("jt_promo_list", {p_sid:sid}); const box = document.getElementById("promoBox"); if(!box) return;
    const dsc = r => (r.kind === "pct" ? r.value + "%" : rp(r.value)) + (r.max_disc ? " (maks " + rp(r.max_disc) + ")" : "") + (r.min_sub ? " · min " + rp(r.min_sub) : "");
    box.innerHTML = '<form id="promoForm" data-id="'+esc(sid)+'" class="card pad" style="margin:0 0 12px"><label class="f">Kode (huruf/angka)</label><input class="in" name="code" required maxlength="20" autocapitalize="characters" placeholder="HEMAT10">'+
      '<div class="row2"><div><label class="f">Jenis</label><select class="in" name="kind"><option value="pct">Persen (%)</option><option value="flat">Potongan tetap (Rp)</option></select></div><div><label class="f">Nilai</label><input class="in" name="value" type="number" min="1" required></div></div>'+
      '<div class="row2"><div><label class="f">Belanja minimal (Rp)</label><input class="in" name="min_sub" type="number" min="0" value="0"></div><div><label class="f">Maks. potongan (Rp)</label><input class="in" name="max_disc" type="number" min="0" placeholder="kosong = tanpa batas"></div></div>'+
      '<div class="row2"><div><label class="f">Kuota pemakaian</label><input class="in" name="quota" type="number" min="0" placeholder="kosong = tanpa batas"></div><div><label class="f">Berlaku (hari)</label><input class="in" name="days" type="number" min="0" placeholder="kosong = tanpa batas"></div></div>'+
      '<button class="btn sm" type="submit">Simpan kode</button></form>'+
      (rows && rows.length ? rows.map(r => '<div class="orow"><div class="grow"><b>'+esc(r.code)+'</b><small>'+esc(dsc(r))+'</small><small>terpakai '+r.used+(r.quota ? '/'+r.quota : '')+(r.expires ? ' · s/d '+esc(new Date(r.expires).toLocaleDateString("id-ID")) : '')+'</small></div><div class="r"><button class="btn ghost sm" data-act="promo-toggle" data-id="'+esc(sid)+'" data-code="'+esc(r.code)+'" data-v="'+(r.active ? "0" : "1")+'">'+(r.active ? "Matikan" : "Aktifkan")+'</button></div></div>').join("") : '<div class="muted">Belum ada kode promo.</div>');
  }catch(err){ const box = document.getElementById("promoBox"); if(box) box.textContent = "Gagal memuat: " + String(err.message || err); }
}
/* Bebas komisi (owner) */
function exTag(k, id){
  const u = S.ownEx && S.ownEx[k + ":" + id];
  return u && u > Date.now() ? '<span class="tag green">Bebas komisi s/d '+esc(new Date(u).toLocaleDateString("id-ID"))+'</span>' : "";
}

/* Daftar panjang dimuat bertahap (20 per halaman) agar HP tetap ringan */
function pg(key, arr, n){
  const lim = (S.pgN && S.pgN[key]) || n || 20, left = arr.length - lim;
  return {items:arr.slice(0, lim), btn:left > 0 ? '<button class="btn ghost block" style="margin-top:10px" data-act="pg-more" data-k="'+esc(key)+'">Muat lebih banyak ('+left+' lagi)</button>' : ""};
}
/* Gambar di luar layar dimuat belakangan */
function lazyImgs(){ document.querySelectorAll("img:not([loading])").forEach(i => { i.loading = "lazy"; i.decoding = "async"; }); }

/* ============ Aksi ============ */
const pending = {logo:undefined, qris:undefined, pimg:undefined};

function changeQty(pid, d){
  const f = findProd(pid);
  const sid = f ? f.sid : S.cart.storeId;
  const p = f ? f.p : null;
  const cur = S.cart.storeId === sid ? S.cart.items[pid] : null;
  if(d > 0 && S.cart.storeId && S.cart.storeId !== sid && cartCount()){
    const other = storeById(S.cart.storeId);
    confirmModal("Keranjang Anda berisi barang dari "+(other?other.name:"toko lain")+". Setiap pesanan dibayar langsung ke satu toko. Kosongkan keranjang dan mulai dari toko ini?", "Ganti toko", async () => { S.cart = {storeId:null, items:{}}; changeQty(pid, d); });
    return;
  }
  if(!p && !cur) return;
  const qty = (cur ? cur.qty : 0) + d;
  if(p && typeof p.stock === "number" && qty > p.stock){ toast("Stok tersisa "+p.stock); return; }
  S.cart.storeId = sid;
  if(qty <= 0) delete S.cart.items[pid];
  else S.cart.items[pid] = {pid, name:(p||cur).name, price:(p||cur).price, img:(p||cur).img||"", qty};
  if(!Object.keys(S.cart.items).length) S.cart.storeId = null;
  saveCart(); render();
}

/* ===== Akun pembeli: tamu boleh melihat; memesan wajib daftar dan disetujui owner ===== */
const BUYER = {gate:false, me:null, loaded:false};
async function loadBuyer(){
  if(!SB) return;
  try{ const r = await sbStore.rpc("jt_buyer_me", {}); BUYER.gate = !!(r && r.gate); BUYER.me = (r && r.me) || null; }
  catch(e){ BUYER.gate = false; BUYER.me = null; }   // database lama: tanpa gerbang
  BUYER.loaded = true;
}
const buyerOk = () => !SB || !BUYER.gate || !!(BUYER.me && BUYER.me.status === "approved");
async function ensureBuyer(){
  if(!SB) return true;
  if(!BUYER.loaded || (BUYER.gate && !buyerOk())) await loadBuyer();
  if(buyerOk()) return true;
  buyerModal(); return false;
}
function buyerModal(){
  const m = BUYER.me, p = getProf();
  let body;
  if(m && m.status === "pending"){
    body = '<h2 class="sec">Menunggu persetujuan</h2><p class="muted" style="margin-top:0">Pendaftaran <b>'+esc(m.name)+'</b> sudah terkirim. Owner JAGA akan memeriksa data Anda. Setelah disetujui, Anda bisa langsung memesan.</p>'+
      '<div class="actions"><button type="button" class="btn" data-act="buyer-check">Cek status</button><button type="button" class="btn ghost" onclick="closeModal()">Tutup</button></div>';
  } else {
    body = '<form id="buyerForm"><h2 class="sec">Daftar akun pembeli</h2><p class="muted" style="margin-top:0">Anda bebas melihat-lihat. Untuk memesan, daftar dulu. Data diperiksa dan disetujui owner JAGA. Nomor WhatsApp Anda hanya diketahui sistem JAGA, tidak dibagikan ke toko atau driver.</p>'+
      (m && m.status === "rejected" ? '<div class="notice">Pendaftaran sebelumnya ditolak'+(m.note ? ': '+esc(m.note) : '')+'. Perbaiki data lalu kirim ulang.</div>' : '')+
      '<label class="f">Nama lengkap</label><input class="in" name="name" required maxlength="60" value="'+esc((m && m.name) || p.name || "")+'">'+
      '<label class="f">No. WhatsApp</label><input class="in" name="wa" required inputmode="tel" placeholder="08xxxxxxxxxx" value="'+esc((m && m.wa) || p.wa || "")+'">'+
      '<label class="f">Alamat</label><input class="in" name="address" required maxlength="200" placeholder="Jalan, RT/RW, Desa" value="'+esc((m && m.address) || p.address || "")+'">'+
      '<div class="actions"><button class="btn" type="submit">Kirim pendaftaran</button><button type="button" class="btn ghost" onclick="closeModal()">Batal</button></div></form>';
  }
  document.getElementById("modal").innerHTML = '<div class="modal-bg" data-act="modal-bg"><div class="modal">'+body+'</div></div>';
}
async function placeOrder(form){
  const s = storeById(S.cart.storeId); if(!s) return;
  if(!(await ensureBuyer())) return;
  const fd = new FormData(form);
  const buyer = {name:fd.get("name").trim(), wa:fd.get("wa").trim(), address:fd.get("address").trim(), maps:(fd.get("maps")||"").trim(), note:(fd.get("note")||"").trim()};
  const blat = parseFloat(fd.get("blat")), blng = parseFloat(fd.get("blng"));
  if(isFinite(blat) && isFinite(blng)){ buyer.lat = blat; buyer.lng = blng; }
  if(locOk(buyer) && !inArea(buyer)) return toast("Alamat pengantaran di luar wilayah layanan. " + AREA_MSG);
  if(!buyer.name || !buyer.wa || !buyer.address) return toast("Lengkapi nama, WhatsApp, dan alamat.");
  if(!waOk(buyer.wa)) return toast(WA_BAD);
  if(buyer.maps && !/^https?:\/\//i.test(buyer.maps)) buyer.maps = "";
  const k = fd.get("pay") || S.payChoice; if(!k) return toast("Pilih metode pembayaran.");
  try{ localStorage.setItem("st_buyer", JSON.stringify(Object.assign(getProf(), {name:buyer.name, wa:buyer.wa, address:buyer.address, maps:buyer.maps}, isFinite(blat) ? {lat:blat, lng:blng} : {}))); }catch(e){}
  const prods = S.products[s.id] || [];
  const t = cartTotals();
  for(const i of t.items){
    const p = prods.find(x=>x.id===i.pid);
    if(!p || p.active===false) return toast(i.name+" sudah tidak tersedia.");
    if(typeof p.stock === "number" && p.stock < i.qty) return toast("Stok "+i.name+" tersisa "+p.stock+".");
    i.price = p.price;
  }
  const t2 = cartTotals();
  const pay = payDetail(s, k);
  const now = Date.now();
  const id = uid("o");
  const code = "JT-" + new Date().toISOString().slice(2,10).replace(/-/g,"") + "-" + Math.random().toString(36).slice(2,6).toUpperCase();
  const order = {code, storeId:s.id, storeName:s.name, buyerId:ME, buyer,
    items:t2.items.map(i=>({pid:i.pid, name:i.name, price:i.price, qty:i.qty})),
    subtotal:t2.subtotal, ongkir:0, ongkirPer500:ONGKIR_PER, admin:0, total:t2.total, shareRate:BAGI_HASIL, share:commCalc(t2.total,"store"), pay,
    storeAddress:s.address||"",
    status: k === "cod" ? "menunggu_konfirmasi" : "menunggu_pembayaran", createdAt:now, updatedAt:now};
  if(typeof s.lat === "number" && typeof s.lng === "number") order.storeLoc = {lat:s.lat, lng:s.lng};
  if(locOk(order.storeLoc) && locOk(buyer)){ const rd = roadDist(order.storeLoc, buyer); if(rd) order.roadDist = Math.round(rd); order.ongkirDist = Math.round(rd || distM(order.storeLoc, buyer)); order.ongkirEst = ongkirByDist(order.ongkirDist); }
  if(SB && t2.promoCode) order.promo = t2.promoCode;
  if(fd.get("useSaldo")){ order.useSaldo = true; if(!SB && order.ongkirEst > 0 && buyerAvail() > 0) order.voucher = Math.min(buyerAvail(), order.ongkirEst); }
  const btn = form.querySelector("button"); if(btn) btn.disabled = true;
  const ok = await safe(() => store.set("orders/"+id, order));
  if(btn) btn.disabled = false;
  if(!ok) return;
  S.promo = null;
  if(order.useSaldo) loadPts("buyer", true);
  for(const i of t2.items){
    const p = prods.find(x=>x.id===i.pid);
    if(!SB && p && typeof p.stock === "number") await safe(() => store.update("stores/"+s.id+"/products/"+p.id, {stock:Math.max(0,p.stock-i.qty)}));
  }
  S.cart = {storeId:null, items:{}}; saveCart();
  go("order", {orderId:id, justOrdered:true});
  S.hist = [{view:"orders"}];
  if(S.role !== "seller"){ celebrate(); buyerNotifAsk("order"); } else toast("Pesanan dibuat!");
}

async function saveStore(form){
  if(S.mode === "db" && !form.dataset.id){ toast("Pendaftaran toko hanya di jagapatner.my.id/apps/#mitra — ini halaman pratinjau."); return; }
  const fd = new FormData(form);
  const id = form.dataset.id;
  const old = id ? storeById(id) : null;
  const ewallet = [0,1].map(i => ({type:fd.get("ew"+i+"type"), no:(fd.get("ew"+i+"no")||"").trim(), holder:(fd.get("ew"+i+"holder")||"").trim()})).filter(w => w.type && w.no);
  let qris = old && old.pay ? old.pay.qris || "" : "";
  if(fd.get("qrisRemove")) qris = "";
  if(pending.qris) qris = pending.qris;
  const pay = {bank:{name:(fd.get("bankName")||"").trim(), no:(fd.get("bankNo")||"").trim(), holder:(fd.get("bankHolder")||"").trim()}, ewallet, qris, cod:!!fd.get("cod")};
  const data = {
    name:fd.get("name").trim(), category:fd.get("category"), area:fd.get("area").trim(), desc:(fd.get("desc")||"").trim(),
    address:fd.get("address").trim(), wa:fd.get("wa").trim(), hours:(fd.get("hours")||"").trim(),
    logo: pending.logo !== undefined ? pending.logo : (old ? old.logo || "" : ""), pay
  };
  const slat = parseFloat(fd.get("slat")), slng = parseFloat(fd.get("slng"));
  if(isFinite(slat) && isFinite(slng)){ data.lat = slat; data.lng = slng; }
  data.region = areaOf(data) || String(fd.get("region") || "") || null;
  if(!data.region && AREAS.length > 1) return toast("Pilih wilayah layanan toko");
  if(!payMethodsOf(data).length) return toast("Isi minimal satu metode pembayaran (rekening, e-wallet, QRIS, atau COD).");
  if(!waOk(data.wa)) return toast(WA_BAD);
  if(data.name.length < 3) return toast("Nama toko minimal 3 huruf.");
  if(!old && !fd.get("agreeShare")) return toast("Centang persetujuan bagi hasil 3% untuk mendaftar.");
  if(!old && !fd.get("agreeRules")) return toast("Centang persetujuan Aturan JAGA untuk mendaftar.");
  if(old){
    const ok = await safe(() => store.update("stores/"+id, Object.assign(data, {updatedAt:Date.now()})), "Perubahan disimpan");
    if(ok){ pending.logo = pending.qris = undefined; }
  } else {
    const nid = uid("s");
    const ok = await safe(() => store.set("stores/"+nid, Object.assign(data, {ownerId:ME, open:true, active:true, shareRate:BAGI_HASIL, shareAgreedAt:Date.now(), color:COLORS[Math.floor(Math.random()*COLORS.length)], createdAt:Date.now()})), "Toko berhasil didaftarkan!");
    if(ok){ pending.logo = pending.qris = undefined; S.sellerStoreId = nid; await localBonus(nid); loadWallet(nid); go("seller", {sellerTab:"ringkasan"}); }
  }
}

async function saveProduct(form){
  const s = storeById(S.sellerStoreId); if(!s) return;
  const fd = new FormData(form);
  const id = form.dataset.id;
  const old = id ? (S.products[s.id]||[]).find(x=>x.id===id) : null;
  const stockRaw = (fd.get("stock")||"").trim();
  const data = {name:fd.get("name").trim(), price:Math.max(0, Number(fd.get("price"))||0), desc:(fd.get("desc")||"").trim(),
    stock: stockRaw === "" ? null : Math.max(0, parseInt(stockRaw,10)||0), active:!!fd.get("active"),
    img: pending.pimg !== undefined ? pending.pimg : (old ? old.img || "" : "")};
  if(fd.has("minStock")){ const m = (fd.get("minStock")||"").trim(); data.minStock = m === "" ? null : Math.max(0, parseInt(m,10)||0); }
  if(!data.name) return toast("Nama produk wajib diisi.");
  const pid = id || uid("p");
  const ok = await safe(() => old ? store.update("stores/"+s.id+"/products/"+pid, data) : store.set("stores/"+s.id+"/products/"+pid, Object.assign(data,{createdAt:Date.now()})), "Produk disimpan");
  if(ok){ pending.pimg = undefined; closeModal(); }
}

async function setStatus(oid, status, extra){
  const o = S.orders.find(x=>x.id===oid); if(!o) return;
  if(!SB && S.role === "seller" && ["diproses","mencari_driver","diantar","selesai"].includes(status) && ["menunggu_pembayaran","menunggu_konfirmasi"].includes(o.status)){
    const need = Math.max(wCfgLocal().minBalance || 0, typeof o.share === "number" ? o.share : shareOf(o));
    if(balLocal(o.storeId) < need){ toast("Saldo toko kurang (minimal "+rp(need)+"). Isi saldo dulu di menu Saldo."); return false; }
  }
  const data = Object.assign({status, updatedAt:Date.now()}, extra||{});
  if(status === "selesai") data.doneAt = Date.now();
  if(status === "menunggu_pembayaran") data.proof = "";
  if(status === "mencari_driver"){ data.searchAt = Date.now(); data.declined = []; }
  const ok = await safe(() => store.update("orders/"+oid, data), "Status: "+STATUS[status].l);
  if(ok && status === "selesai") await localChargeFee(o);
  if(S.role === "seller") loadWallet(o.storeId);
  return ok;
}
async function restock(o){
  if(SB) return; // server mengembalikan stok otomatis
  const prods = S.products[o.storeId];
  if(!prods) return;
  for(const i of o.items){ const p = prods.find(x=>x.id===i.pid); if(p && typeof p.stock==="number") await safe(()=>store.update("stores/"+o.storeId+"/products/"+p.id,{stock:p.stock+i.qty})); }
}

/* ============ Event ============ */
document.addEventListener("click", async e => {
  const el = e.target.closest("[data-act]"); if(!el) return;
  const a = el.dataset.act, id = el.dataset.id, v = el.dataset.v;
  if(a === "modal-bg"){ if(e.target === el) closeModal(); return; }
  if(a === "modal-close"){ closeModal(); return; }
  if(a === "call-drv"){ openCallDrv(id); return; }
  if(a === "drv-want-x"){ S.drv.want = ""; render(); return; }
  if(a === "pay" || a === "pick-store") return;
  if(el.tagName === "A" && el.getAttribute("href")) return;
  if(a === "go"){ go(v); return; }
  if(a === "logo"){ if(S.role === "seller") go("seller", {sellerTab:"ringkasan"}); else if(S.role === "owner") go("owner"); else if(S.role === "driver") go("driver"); else go("home"); return; }
  if(a === "mitra-info"){ openMitraModal(); return; }
  if(a === "rules"){ openRules(); return; }
  if(a === "akses-copy"){ copyText(KEY); return; }
  if(a === "akses"){ openAksesModal(); return; }
  if(a === "nav"){ if(v === "seller") go("seller", {sellerTab: el.dataset.t || "ringkasan"}); else go(v); return; }
  if(a === "preview-store"){ go("store", {storeId:id, preview:true}); return; }
  if(a === "quick-add"){ pending.pimg = undefined; openProdModal(); return; }
  if(a === "share-store"){ const s = storeById(id); if(s) copyText(s.name+" sekarang ada di JAGA! Pesan langsung, diantar driver terdekat & tanpa biaya admin. Cari \""+s.name+"\" di JAGA."+""); return; }
  if(a === "cat"){ S.cat = (S.cat === v && v !== "Semua") ? "Semua" : v; if(S.view !== "home") go("home"); else render(); return; }
  if(a === "clear-filter"){ S.cat = "Semua"; S.q = ""; document.getElementById("q").value = ""; render(); return; }
  if(a === "open-prod"){ go("product", {prodId:id}); return; }
  if(a === "buy-now"){ const inC = S.cart.items[id] && S.cart.storeId === (findProd(id)||{}).sid; if(!inC) changeQty(id, 1); if(S.cart.items[id]) go("cart"); return; }
  if(a === "slide"){ setSlide(S.slide + Number(v)); return; }
  if(a === "slide-to"){ setSlide(Number(v)); return; }
  if(a === "open-store"){ go("store", {storeId:id}); return; }
  if(a === "open-order"){ go("order", {orderId:id}); return; }
  if(a === "qty"){ changeQty(id, +el.dataset.d); return; }
  if(a === "clear-cart"){ S.cart = {storeId:null, items:{}}; saveCart(); render(); return; }
  if(a === "btab"){ S.buyerTab = v; render(); return; }
  if(a === "stab"){ S.sellerTab = v; render(); return; }
  if(a === "stk-p"){ S.stk.p = +v; render(); return; }
  if(a === "stk-f"){ S.stk.f = v; render(); return; }
  if(a === "stk-new"){ openStock("", "masuk"); return; }
  if(a === "stk-in" || a === "stk-out" || a === "stk-op"){ openStock(id, a === "stk-in" ? "masuk" : a === "stk-out" ? "keluar" : "opname"); return; }
  if(a === "stk-csv"){ stockCsv(); return; }
  if(a === "ofilter"){ S.orderFilter = v; render(); return; }
  if(a === "copy"){ copyText(v); return; }
  if(a === "close-modal"){ closeModal(); return; }
  if(a === "edit-prod"){ pending.pimg = undefined; openProdModal(id); return; }
  if(a === "del-prod"){ const sid = S.sellerStoreId; confirmModal("Hapus produk ini?", "Hapus", () => safe(() => store.del("stores/"+sid+"/products/"+id), "Produk dihapus")); return; }
  if(a === "toggle-open"){ const s = storeById(S.sellerStoreId); if(s) safe(() => store.update("stores/"+s.id, {open: s.open === false}), s.open===false?"Toko dibuka":"Toko ditutup sementara"); return; }
  if(a === "del-store"){ const s = storeById(S.sellerStoreId); if(!s) return; confirmModal("Hapus toko "+s.name+"? Toko tidak akan tampil lagi di JAGA.", "Hapus toko", async () => { const ok = await safe(() => store.del("stores/"+s.id), "Toko dihapus"); if(ok){ S.sellerStoreId = null; go("seller"); } }); return; }
  if(a === "set-status"){ setStatus(id, v); return; }
  if(a === "seller-cancel"){ const o = S.orders.find(x=>x.id===id); confirmModal("Tolak/batalkan pesanan "+(o?o.code:"")+"? Jika pembeli sudah membayar, kembalikan dananya.", "Batalkan pesanan", async () => { await setStatus(id, "dibatalkan", {cancelBy:"toko"}); if(o) await restock(o); }); return; }
  if(a === "buyer-cancel"){ const o = S.orders.find(x=>x.id===id); confirmModal("Batalkan pesanan ini?", "Batalkan", async () => { await setStatus(id, "dibatalkan", {cancelBy:"pembeli"}); if(o){ watchProducts(o.storeId); await restock(o); } }); return; }
  if(a === "buyer-done"){ setStatus(id, "selesai"); return; }
  if(a === "send-proof"){
    const f = document.getElementById("proofFile").files[0];
    if(!f) return toast("Pilih foto bukti pembayaran dulu.");
    el.disabled = true;
    try{ const img = await compressImage(f, 900); await setStatus(id, "menunggu_konfirmasi", {proof:img, paidAt:Date.now()}); }
    catch(err){ toast("Gambar tidak bisa dibaca."); }
    el.disabled = false; return;
  }
});
document.addEventListener("change", async e => {
  const t = e.target;
  if(t.name === "pay"){ S.payChoice = t.value; document.querySelectorAll(".opt").forEach(o => o.classList.toggle("on", o.querySelector("input").checked)); return; }
  if(t.dataset.act === "pick-store"){ S.sellerStoreId = t.value; watchProducts(t.value); render(); return; }
  const map = {logoFile:["logo","logoPrev",300], qrisFile:["qris","qrisPrev",700], pimgFile:["pimg","pimgPrev",600]};
  if(map[t.id] && t.files[0]){
    const [key, prev, max] = map[t.id];
    try{ pending[key] = await compressImage(t.files[0], max); document.getElementById(prev).innerHTML = '<img alt="" src="'+pending[key]+'">'; }
    catch(err){ toast("Gambar tidak bisa dibaca."); }
  }
});
document.addEventListener("input", e => {
  if(e.target.id === "q"){
    S.q = e.target.value;
    if(S.view !== "home"){ S.view = "home"; window.scrollTo(0,0); }
    render();
  }
});
document.addEventListener("submit", e => {
  e.preventDefault();
  const f = e.target;
  if(f.id === "hsearch"){ document.getElementById("q").blur(); if(S.view !== "home") go("home"); return; }
  if(f.id === "aksesForm"){
    const k = (new FormData(f).get("key")||"").trim();
    if(!/^jt[0-9a-f]{40,}$/.test(k)) return toast("Kode akses tidak valid.");
    KEY = k; try{ localStorage.setItem("jt_key", k); }catch(_){}
    closeModal(); S.myStoreIds = null; refreshMyStores().then(() => { if(ORD_REFRESH) ORD_REFRESH(); go("seller", {sellerTab:"ringkasan"}); toast(myStores().length ? "Berhasil masuk ke toko Anda" : "Tidak ada toko untuk kode ini"); });
    return;
  }
  if(f.id === "checkout") placeOrder(f);
  else if(f.id === "storeForm") saveStore(f);
  else if(f.id === "prodForm") saveProduct(f);
  else if(f.id === "stkForm") saveStock(f);
  else if(f.id === "supForm") supSend(f, S.sup.open, "party", () => supRefreshOpen(true));
  else if(f.id === "ownSupForm") supSend(f, S.own.thread, "owner", async () => { await loadOwnMsgs(S.own.thread, true); loadOwnThreads(); });
  else if(f.id === "ownNewMsg"){ const fd = new FormData(f), th = fd.get("th"); supSend(f, th, "owner", async () => { closeModal(); S.own.tab = "pesan"; S.own.thread = th; await loadOwnThreads(); render(); loadOwnMsgs(th, true); toast("Pesan terkirim"); }); }
  else if(f.id === "ownSuspend"){ const id = f.dataset.id, note = (new FormData(f).get("note") || "").trim(); if(!note) return toast("Tulis alasannya.");
    closeModal(); ownAct("off", async () => {
      if(SB) await ownRpc("jt_owner_driver_active", {p_driver:id, p_active:false, p_note:note});
      else { if(S.orders.concat(S.ridesAll||[]).some(o => o.driverId === id && DRV_BUSY.includes(o.status))) throw srvErr("Driver sedang membawa pesanan. Tunggu selesai dulu"); await store.update("drivers/"+id, {suspended:true, suspendNote:note, online:false}); }
      try{ await SUP.send("drv:"+id, "Akun driver Anda dinonaktifkan sementara oleh tim JAGA. Alasan: "+note+"\nBalas pesan ini kalau ada pertanyaan.", "owner"); }catch(_){}
    }, "Driver dinonaktifkan")(); }
});
document.addEventListener("click", e => {
  const el = e.target.closest("[data-act='go'][data-new]"); if(el){ pending.logo = pending.qris = undefined; }
}, true);

function setSlide(i){
  S.slide = (i + SLIDES.length) % SLIDES.length;
  const sl = document.getElementById("slides"); if(sl) sl.style.transform = "translateX(-"+(S.slide*100)+"%)";
  document.querySelectorAll("#dots button").forEach((b,k) => b.classList.toggle("on", k === S.slide));
}
setInterval(() => { if(S.view === "home" && !document.hidden && document.getElementById("slides")) setSlide(S.slide + 1); }, 5000);

window.addEventListener("hashchange", () => { try{ const m = document.getElementById("mf"); if(m) m.href = location.hash === "#mitra" ? "manifest-mitra.webmanifest" : location.hash === "#driver" ? "manifest-driver.webmanifest" : "manifest.webmanifest"; }catch(_){} if(openStoreFromHash()) return; const r = modeFromHash(); if(r !== S.role){ S.role = r; saveMode(); S.role = r; if(r === "driver") startDriver(); if(r === "owner") startOwner(); go(r === "seller" ? "seller" : r === "driver" ? "driver" : r === "owner" ? "owner" : "home", r === "seller" ? {sellerTab:"ringkasan"} : {}); } });


/* ================= JAGA — MODE APLIKASI (pembeli) ================= */
const EMOJI_BASE = "emoji/";
const CAT_E = {"Makanan":"makanan","Minuman":"minuman","Sembako":"sembako","Sayur & Buah":"sayur","Rumah Tangga":"rumah","Fashion":"fashion","Handphone":"handphone","Laptop":"laptop","Game":"game"};
function E(n, cls){ return '<img class="e3d'+(cls?' '+cls:'')+'" src="'+EMOJI_BASE+n+'.png" alt="" draggable="false">'; }
const catE = c => CAT_E[c] || "package";
Object.assign(ICONS, {
  heart:'<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>',
  back:'<path d="m15 18-6-6 6-6"/>', chev:'<path d="m9 18 6-6-6-6"/>', down:'<path d="m6 9 6 6 6-6"/>',
  repeat:'<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
  minus:'<path d="M5 12h14"/>'
});
const JAGA_MARK = (x, y, sc, c, gold, id) => '<g transform="translate('+x+' '+y+') scale('+sc+') translate(-30 -24)"><mask id="'+id+'" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="220"><rect width="200" height="220" fill="#fff"/><path d="M36 172 L156 106 V126 L36 192 Z" fill="#000"/></mask><g mask="url(#'+id+')"><path d="M128 44 L152 30 V142 A56 56 0 0 1 40 142 V122 L64 110 V142 A32 32 0 0 0 128 142 Z" fill="'+c+'"/><path d="M74 132 V84 L96 72 V132 Z" fill="'+c+'"/><path d="M104 132 V64 L120 55 V132 Z" fill="'+gold+'"/></g><path d="M40 176 L152 114.4 V126.4 L40 188 Z" fill="'+gold+'"/></g>';
const CR_WHEEL = (cx) => '<g class="cr-wheel"><circle cx="'+cx+'" cy="186" r="30" fill="#141c2f"/><circle cx="'+cx+'" cy="186" r="25" fill="#222c42"/><circle cx="'+cx+'" cy="186" r="17" fill="#c9d3e6"/>'+
  [0,72,144,216,288].map(d => '<path d="M'+cx+' 186 L'+cx+' 171" stroke="#6b7690" stroke-width="3.5" stroke-linecap="round" transform="rotate('+d+' '+cx+' 186)"/>').join("")+'<circle cx="'+cx+'" cy="186" r="5.5" fill="#3a4560"/></g>';
const COURIER_SVG = '<svg class="courier" viewBox="0 0 320 240" aria-hidden="true"><defs>'+
  '<linearGradient id="cr2b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3b7bff"/><stop offset="1" stop-color="#1f4fd1"/></linearGradient>'+
  '<linearGradient id="cr2j" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a5fe6"/><stop offset="1" stop-color="#173f9e"/></linearGradient>'+
  '<linearGradient id="cr2k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16306e"/><stop offset="1" stop-color="#0b1a3d"/></linearGradient>'+
  '<linearGradient id="cr2v" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2b3f74"/><stop offset="1" stop-color="#0b1430"/></linearGradient></defs>'+
  '<ellipse cx="168" cy="219" rx="128" ry="8" fill="#0a1633" opacity=".12"/>'+
  '<g class="cr-lines" stroke="#a9c8ff" stroke-width="5" stroke-linecap="round"><path d="M4 92h40"/><path d="M0 122h52"/><path d="M8 152h36"/><path d="M2 182h30"/></g>'+
  '<g class="cr-ride">'+
  '<g class="cr-dust" fill="#c9d3e6"><circle cx="52" cy="210" r="9"/><circle cx="38" cy="206" r="6"/><circle cx="26" cy="211" r="4"/></g>'+
  CR_WHEEL(90) + CR_WHEEL(250)+
  '<g class="cr-bob">'+
  /* knalpot & rak box */
  '<rect x="54" y="184" width="44" height="8" rx="4" fill="#8a94aa"/><rect x="94" y="185" width="8" height="6" rx="2" fill="#5d667c"/>'+
  /* bodi skuter */
  '<path d="M60 176c2-20 54-22 62-2" fill="none" stroke="#173f9e" stroke-width="7" stroke-linecap="round"/>'+
  '<path d="M48 178c-5-26 12-46 44-49l66-2c11 0 17 6 19 14l6 31c-34 9-78 11-135 6z" fill="url(#cr2b)"/>'+
  '<path d="M60 160c8-14 30-20 58-20" stroke="#fff" stroke-opacity=".35" stroke-width="4" stroke-linecap="round" fill="none"/>'+
  '<path d="M148 176h68l-7 11h-66z" fill="#16306e"/>'+
  '<path d="M200 180c3-36 12-62 31-80l12 4c-10 22-15 48-16 76z" fill="url(#cr2b)"/>'+
  '<path d="M207 182l20-86h12l-17 86z" fill="#173f9e"/>'+
  '<path d="M218 176c6-26 58-26 64 0h-12c-6-15-34-15-40 0z" fill="url(#cr2b)"/>'+
  '<ellipse cx="246" cy="112" rx="6" ry="8.5" fill="#ffe08a"/><ellipse cx="247" cy="111" rx="2.5" ry="4" fill="#fffbe6"/>'+
  '<path d="M246 108l26-6v14z" fill="#ffe9a8" opacity=".35"/>'+
  '<path d="M238 92l-3-18" stroke="#2a3550" stroke-width="3" stroke-linecap="round"/><ellipse cx="234" cy="71" rx="6" ry="4" fill="#2a3550"/>'+
  '<path d="M222 98l28-7" stroke="#0f1b2d" stroke-width="6" stroke-linecap="round"/>'+
  '<path d="M62 132c4-9 88-13 104-5l-2 7H64z" fill="#0f1b2d"/>'+
  /* penumpang */
  '<path d="M90 126l40 7 7 31" fill="none" stroke="#3a4152" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/>'+
  '<path d="M131 162h21c3 0 4 6-1 8h-20z" fill="#1f2937"/>'+
  '<path d="M68 132c-7-27 2-51 24-57l19 5c9 19 6 39-6 52z" fill="#2bb37a"/>'+
  '<path d="M72 112l38 4" stroke="#ffffff" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>'+
  '<rect x="86" y="62" width="11" height="11" rx="4" fill="#c98b62"/>'+
  '<circle cx="93" cy="52" r="14" fill="#e2a982"/><circle cx="101" cy="54" r="1.6" fill="#0f1b2d"/>'+
  '<path d="M76 54c-1-16 9-25 20-25 10 0 17 7 17 18h-15c-3 0-5 3-5 7z" fill="#f4f6fa"/>'+
  '<path d="M78 46c3-10 11-15 20-15" fill="none" stroke="#9aa6bd" stroke-width="4" stroke-linecap="round"/>'+
  '<path d="M96 47h17c0 3-1 5-3 6h-14z" fill="#2b3f74" opacity=".85"/>'+
  /* pengendara */
  '<path d="M124 122l50 7 9 38" fill="none" stroke="#1b2a4f" stroke-width="17" stroke-linecap="round" stroke-linejoin="round"/>'+
  '<path d="M174 129l9 38" fill="none" stroke="#24365f" stroke-width="10" stroke-linecap="round" opacity=".5"/>'+
  '<path d="M176 166h25c3 0 4 6-1 8h-24z" fill="#111827"/>'+
  '<path d="M106 130c-8-30 4-56 31-61l24 6c11 21 6 44-8 56z" fill="url(#cr2j)"/>'+
  '<path d="M109 116l51 6" stroke="#e8eef9" stroke-width="4.5" stroke-linecap="round" opacity=".9"/>'+
  '<path d="M136 70l25 6c2 4 3 8 3 12" fill="none" stroke="#0f2257" stroke-width="5" stroke-linecap="round"/>'+
  '<path d="M100 92l16 18 18 2" fill="none" stroke="#25a06d" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><circle cx="136" cy="112" r="5.5" fill="#e2a982"/>'+
  '<path d="M150 84l28 20 46-8" fill="none" stroke="#2a5fe6" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>'+
  '<path d="M150 84l28 20" fill="none" stroke="#173f9e" stroke-width="5" stroke-linecap="round" opacity=".45"/>'+
  '<circle cx="225" cy="95" r="7.5" fill="#111827"/>'+
  '<rect x="140" y="62" width="13" height="11" rx="4" fill="#d9a07a"/>'+
  /* helm full-face putih dengan logo */
  '<path d="M126 52c0-17 12-28 27-28 15 0 25 10 25 24v10c0 6-4 10-10 10h-34c-5 0-8-4-8-9z" fill="#ffffff"/>'+
  '<path d="M128 50c3-14 14-22 27-22" fill="none" stroke="#2f6bff" stroke-width="6" stroke-linecap="round"/>'+
  '<path d="M150 38c14-1 25 4 28 14v6h-28z" fill="url(#cr2v)"/>'+
  '<path d="M156 42c9 0 15 3 18 9" stroke="#fff" stroke-opacity=".55" stroke-width="2" stroke-linecap="round" fill="none"/>'+
  '<path d="M150 58h28c0 7-5 10-12 10h-16z" fill="#e3e9f4"/>'+
  '<path d="M126 60c0 5 3 8 8 8h16" fill="none" stroke="#d6deeb" stroke-width="2"/>'+
  JAGA_MARK(133, 42, .11, "#1f4fd1", "#d9b264", "crm4")+
  '</g></g></svg>';
const JMARK = () => (document.querySelector(".jmark") || {outerHTML:""}).outerHTML;

/* profil & favorit (tersimpan di perangkat) */
function getProf(){ try{ return JSON.parse(localStorage.getItem("st_buyer") || "{}") || {}; }catch(e){ return {}; } }
function setProf(p){ try{ localStorage.setItem("st_buyer", JSON.stringify(p)); }catch(e){} try{ const r = areaOf(p); if(r) localStorage.setItem("jt_region", r); }catch(e){} }
let FAV = new Set(); try{ FAV = new Set(JSON.parse(localStorage.getItem("jt_fav") || "[]")); }catch(e){}
function saveFav(){ try{ localStorage.setItem("jt_fav", JSON.stringify([...FAV])); }catch(e){} }
S.hist = []; S.pq = 1;

/* animasi masuk hanya saat pindah halaman (tidak diulang saat data berubah) */
let RISE = true, _lastKey = "";
function ra(d){ return RISE ? ' rise" style="--d:'+Math.min(d,10) : ''; }
function greet(){ const h = new Date().getHours(); return h < 11 ? "Selamat pagi" : h < 15 ? "Selamat siang" : h < 18 ? "Selamat sore" : "Selamat malam"; }
function timeAgo(t){ const d = Math.floor((Date.now() - t) / 864e5); return d <= 0 ? "Hari ini" : d === 1 ? "Kemarin" : d + " hari lalu"; }
function appBar(title, right){ return '<div class="abar"><button class="ibtn press" data-act="back" aria-label="Kembali">'+I("back")+'</button><h1>'+title+'</h1>'+(right||'')+'</div>'; }
function aEmpty(e, title, text, btn){ return '<div class="aempty">'+E(e)+'<b>'+title+'</b><div>'+text+'</div>'+(btn?'<p style="margin-top:16px">'+btn+'</p>':'')+'</div>'; }

/* ---------- navigasi bawah ---------- */
const NAV_APP = [
  {v:"home", l:"Beranda", ic:"home"}, {v:"fav", l:"Favorit", ic:"heart"}, {v:"cart", l:"Keranjang", ic:"cart"},
  {v:"orders", l:"Pesanan", ic:"receipt"}, {v:"profile", l:"Profil", ic:"user"}
];
function renderAppNav(){
  if(S.role === "driver" || S.role === "owner"){ document.getElementById("bnav").style.display = "none"; document.getElementById("bnav").innerHTML = ""; return; }
  const on = {home:"home", store:"home", product:"home", fav:"fav", poin:"profile", pesan:"profile", cart:"cart", checkout:"cart", orders:"orders", order:"orders", profile:"profile", jago:"home"}[S.view];
  const badge = v => { const c = v==="cart" ? cartCount() : v==="orders" ? myActiveOrders() : 0; return c ? '<span class="badge">'+c+'</span>' : ''; };
  const bn = document.getElementById("bnav");
  bn.style.display = "";
  bn.innerHTML = NAV_APP.map(n => '<button class="'+(on===n.v?"on":"")+'" data-act="nav" data-v="'+n.v+'"><span class="ic">'+I(n.ic)+'</span>'+n.l+badge(n.v)+'</button>').join("");
}
function renderMiniCart(){
  const el = document.getElementById("cartbar");
  const n = cartCount();
  const show = n && ["home","store","fav"].includes(S.view);
  document.body.classList.toggle("has-mcart", !!show);
  if(!show){ el.innerHTML = ""; return; }
  const s = storeById(S.cart.storeId); const t = cartTotals();
  el.innerHTML = '<div class="mcart">'+E("cart")+'<div class="grow"><b>'+n+' barang · '+rp(t.total)+'</b><small>'+esc(s?s.name:"")+' · ongkir '+(t.ongkirEst==null?ONGKIR_LBL:'±'+rp(t.ongkirEst))+'</small></div><button class="btn lime press" data-act="nav" data-v="cart">Lihat</button></div>';
}

/* ---------- kartu produk ---------- */
function appProdCard(x, i){
  const p = x.p, s = x.s;
  const out = typeof p.stock === "number" && p.stock <= 0, closed = s.open === false;
  return '<div class="ap press'+ra(i||0)+'" data-act="open-prod" data-id="'+esc(p.id)+'">'+
    '<button class="fav'+(FAV.has(p.id)?" on":"")+'" data-act="fav" data-id="'+esc(p.id)+'" aria-label="Favorit">'+I("heart")+'</button>'+
    '<div class="im">'+(p.img?'<img alt="" loading="lazy" src="'+esc(p.img)+'">':E(catE(s.category)))+(out?'<div class="so">Stok habis</div>':closed?'<div class="so">Toko tutup</div>':'')+'</div>'+
    '<div class="bd"><div class="nm">'+esc(p.name)+'</div><div class="pr">'+rp(p.price)+'</div><div class="st">'+esc(s.area||"-")+' · '+esc(s.name)+'</div><span class="fo">Antar cepat</span></div>'+
    (!out && !closed ? '<button class="addb" data-act="add" data-id="'+esc(p.id)+'" aria-label="Tambah ke keranjang">'+I("plus")+'</button>' : '')+'</div>';
}
function skeletonGrid(n){ let h = '<div class="agrid">'; for(let i=0;i<n;i++) h += '<div class="sk" style="aspect-ratio:3/4.3"></div>'; return h + '</div>'; }

/* ---------- beranda ---------- */
const ASLIDES = [
  {c:"b1", pill:"Driver terdekat", t:"Diantar langsung dari toko", d:"Ongkir Rp2.000 per 500 m & bisa nego.", art:"scooter", cta:"Belanja sekarang", act:"scroll-prod"},
  {c:"b2", pill:"Tanpa biaya tambahan", t:"Rp0 biaya admin", d:"Bayar langsung ke toko: QRIS, transfer, e-wallet, atau COD.", art:"money"},
  {c:"b3", pill:"Untuk pemilik toko", t:"Punya toko? Jadi Mitra", d:"Daftar gratis, bagi hasil hanya 3% per penjualan.", art:"store", cta:"Info mitra", act:"mitra-info"},
  {c:"b4", pill:"Untuk pemilik motor", t:"Punya motor? Jadi Driver", d:"Daftar cukup nama, WA, plat & alamat. Bonus saldo Rp15.000.", art:"scooter", cta:"Daftar driver", act:"open-driver"}
];
function appHome(){
  const prof = getProf(); const first = (prof.name||"").trim().split(/\s+/)[0];
  const oc = myActiveOrders();
  const filtering = S.q.trim() || S.cat !== "Semua";
  return '<section class="ahero'+(filtering?" flat":"")+'">'+
    '<div class="atop'+ra(0)+'"><div class="aav">'+(prof.name?esc(initials(prof.name)):E("all"))+'</div>'+
    '<button class="aloc" data-act="edit-addr"><small>'+E("pin")+' Antar ke</small><b><span>'+esc(prof.address||"Atur alamat pengantaran")+'</span>'+I("down")+'</b></button>'+
    '<button class="abell press" data-act="nav" data-v="orders" aria-label="Pesanan aktif">'+E("bell")+(oc?'<span class="bdg">'+oc+'</span>':'')+'</button></div>'+
    '<div class="ahello'+ra(1)+'">'+greet()+(first?', '+esc(first):'')+'!<span>Mau belanja apa hari ini?</span></div>'+
    '<div class="asearch'+ra(2)+'"><label class="aql">'+E("search")+'<input id="aq" type="search" enterkeyhint="search" placeholder="Cari makanan, minuman…" value="'+esc(S.q)+'" autocomplete="off"></label><button class="amic press" data-act="voice" aria-label="Pesan pakai suara">'+I("mic")+'</button></div></section>'+
    '<div class="abody'+(filtering?" flat":"")+'" id="hbody">'+appHomeBody()+'</div>';
}
function renderHomeBody(){
  const b = document.getElementById("hbody"); if(!b) return;
  const filtering = !!(S.q.trim() || S.cat !== "Semua");
  b.innerHTML = appHomeBody(); b.classList.toggle("flat", filtering);
  const hero = document.querySelector(".ahero"); if(hero) hero.classList.toggle("flat", filtering);
  renderMiniCart();
}
/* menu kategori di kartu utama beranda: Semua, kategori toko, dan Jago */
function catHub(ar){
  const tint = ["t1","t3","t4","t1"];
  return '<div class="hub chub'+ra(2)+'"><div class="hgrid">'+
    [["Semua","all"]].concat(CATS.map(c => [c, catE(c)])).map((c, i) =>
      '<button class="ht press'+(S.cat === c[0] ? ' on' : '')+'" data-act="cat" data-v="'+esc(c[0])+'"><span class="ib '+tint[i % 4]+'">'+E(c[1])+'</span><b>'+esc(c[0])+'</b></button>').join("")+
    '<button class="ht jg press" data-act="nav" data-v="jago"><span class="ib t2">'+E("scooter")+'</span><b>Jago</b>'+(ar?'<span class="bd2 ok">Jalan</span>':'<span class="bd2">Ojek</span>')+'</button>'+
    '</div></div>';
}
function appHomeBody(){
  const q = S.q.trim().toLowerCase();
  const filtering = !!(q || S.cat !== "Semua");
  let prods = allProducts(), stores = S.stores.filter(visibleStore);
  if(S.cat !== "Semua"){ prods = prods.filter(x => x.s.category === S.cat); stores = stores.filter(s => s.category === S.cat); }
  if(q){
    prods = prods.filter(x => [x.p.name, x.p.desc, x.s.name, x.s.category, x.s.area].join(" ").toLowerCase().includes(q));
    stores = stores.filter(s => [s.name, s.category, s.area, s.desc].join(" ").toLowerCase().includes(q));
  }
  prods.sort((a,b) => (b.s.open!==false)-(a.s.open!==false) || soldCount(b.p.id)-soldCount(a.p.id) || (b.p.createdAt||0)-(a.p.createdAt||0));
  stores.sort((a,b) => (b.open!==false)-(a.open!==false) || (b.createdAt||0)-(a.createdAt||0));
  let h = '';
  if(!filtering){
    const ar = S.rides.find(r => RIDE_ACTIVE.includes(r.status));
    if(locOk(getProf()) && !inArea(getProf())) h += '<div style="margin:0 16px 12px">'+areaBanner()+'</div>';
    h += regionPicker();
    const oc = myActiveOrders();
    h += catHub(ar);
    h += '<div class="tstrip'+ra(3)+'"><div class="th">'+I("badge")+' Kami <b class="jg2"><em>JA</em><em>GA</em></b> Kepercayaan anda</div>'+
      '<div class="tc"><span class="ti">'+I("checkc")+'</span><span><b class="ab"><em>JA</em>minan</b><small>Driver & toko aman</small></span></div>'+
      '<div class="tc"><span class="ti">'+I("checkc")+'</span><span><b class="ab"><em>GA</em>ransi</b><small>Pesanan pasti sampai</small></span></div></div>';
    h += '<div class="abanner'+ra(3)+'"><div class="slides" id="slides" style="transform:translateX(-'+(S.slide%ASLIDES.length*100)+'%)">'+ASLIDES.map(x =>
      '<div class="aslide '+x.c+'"'+(x.act?' data-act="'+x.act+'"':'')+'><div class="tx"><span class="pill">'+x.pill+'</span><h3>'+x.t+'</h3><p>'+x.d+'</p>'+(x.cta?'<span class="cta">'+x.cta+' →</span>':'')+'</div><div class="art">'+E(x.art)+'</div></div>').join("")+'</div>'+
      '<div class="adots" id="dots">'+ASLIDES.map((x,i)=>'<button class="'+(i===S.slide%ASLIDES.length?"on":"")+'" data-act="slide-to" data-v="'+i+'" aria-label="Banner '+(i+1)+'"></button>').join("")+'</div></div>';
  }
  if(!filtering) h += installCard();
  if(filtering) h += catHub(S.rides.find(r => RIDE_ACTIVE.includes(r.status)));
  if(!S.ready.stores) return h + '<div class="ash"><h2>Pilihan untukmu</h2></div>' + skeletonGrid(4);
  if(filtering){
    h += '<div class="ash"><h2>'+(q?'Hasil “'+esc(S.q.trim())+'”':esc(S.cat))+'</h2><button data-act="clear-filter">Hapus filter</button></div>';
  } else {
    const again = S.orders.filter(o => o.buyerId === ME && o.status === "selesai").sort((a,b)=>(b.doneAt||b.createdAt||0)-(a.doneAt||a.createdAt||0));
    const seen = new Set(); const uniq = again.filter(o => { const k = o.storeId+"|"+(o.items[0]||{}).pid; if(seen.has(k)) return false; seen.add(k); return true; }).slice(0,6);
    if(uniq.length){
      h += '<div class="ash"><h2>Pesan lagi</h2><button data-act="nav" data-v="orders">Lihat semua</button></div><div class="hscroll">'+uniq.map((o,i) => {
        const it = o.items[0] || {}; const f = findProd(it.pid); const st = storeById(o.storeId);
        const th = f && f.p.img ? '<img alt="" src="'+esc(f.p.img)+'">' : E(catE(st ? st.category : ""));
        return '<div class="again'+ra(i)+'"><div class="th">'+th+'</div><div class="grow" style="min-width:0"><b>'+esc(it.name||o.storeName)+(o.items.length>1?' +'+(o.items.length-1):'')+'</b><small>'+timeAgo(o.doneAt||o.createdAt)+' · '+rp(o.total)+'</small></div><button class="rb press" data-act="reorder" data-id="'+esc(o.id)+'" aria-label="Pesan lagi">'+I("repeat")+'</button></div>';
      }).join("")+'</div>';
    }
  }
  if(stores.length){
    h += '<div class="ash" id="storeTop"><h2>'+(filtering?'Toko':'Toko di sekitarmu')+'</h2><span class="small muted">'+stores.length+' toko</span></div><div class="hscroll">'+stores.slice(0,20).map((s,i) => {
      const c = s.color || "#2f6bff";
      return '<div class="astore press'+ra(i)+'" data-act="open-store" data-id="'+esc(s.id)+'"><div class="cv'+(s.cover ? ' photo' : '')+'" style="'+(s.cover ? 'background:url(&quot;'+esc(s.cover)+'&quot;) center/cover' : 'background:linear-gradient(140deg,'+esc(c)+'26,'+esc(c)+'66)')+'">'+avatarHtml(s)+(s.cover ? '' : E(catE(s.category)))+'</div>'+
        '<div class="bd"><b>'+esc(s.name)+'</b><small>'+(s.open===false?'<span class="closedt">Tutup</span>':'<span class="open">● Buka</span>')+' · '+esc(s.category)+' · '+esc(s.area||"")+'</small>'+storeStars(s.id)+'</div></div>';
    }).join("")+'</div>';
  }
  h += '<div class="ash" id="prodTop"><h2>'+(filtering?'Produk':'Pilihan untukmu')+'</h2>'+(prods.length?'<span class="small muted">'+prods.length+' produk</span>':'')+'</div>';
  if(!prods.length){
    h += S.stores.length
      ? aEmpty("search", filtering?"Belum ketemu":"Belum ada produk", filtering?"Coba kata kunci atau kategori lain.":"Produk dari toko akan tampil di sini.")
      : aEmpty("store", "Belum ada toko", "Toko-toko di sekitarmu akan segera hadir.", '<button class="btn press" data-act="mitra-info">Punya toko? Jadi mitra</button>');
  } else h += '<div class="agrid">'+prods.map((x,i)=>appProdCard(x,i)).join("")+'</div>';
  if(!filtering) h += '<div style="height:8px"></div>';
  return h;
}

/* ---------- toko ---------- */
function appStore(){
  const s = storeById(S.storeId);
  if(!s) return appBar("Toko") + aEmpty("store", "Toko tidak ditemukan", "Mungkin toko sudah tidak aktif.");
  const prods = (S.products[s.id]||[]).filter(p => p.active !== false);
  const c = s.color || "#2f6bff";
  let h = '<section class="scover'+(s.cover ? ' photo' : '')+'" style="background:'+(s.cover ? 'linear-gradient(180deg,rgba(8,20,48,.15) 0%,rgba(8,20,48,.35) 40%,rgba(8,20,48,.92) 100%),url(&quot;'+esc(s.cover)+'&quot;) center top/cover' : 'linear-gradient(140deg,'+esc(c)+' 0%,#12306f 100%)')+'"><button class="ibtn press" data-act="back" aria-label="Kembali">'+I("back")+'</button>'+
    (s.cover ? '' : '<span class="art">'+E(catE(s.category))+'</span>')+
    '<div class="who'+ra(0)+'">'+avatarHtml(s)+'<div><h2>'+esc(s.name)+'</h2><small>'+(s.open===false?'Tutup sementara':'● Buka')+' · '+esc(s.category)+(s.hours?' · '+esc(s.hours):'')+' '+storeStars(s.id)+'</small></div></div>'+
    '<div class="tags'+ra(1)+'"><span>Ongkir Rp2rb/500 m</span><span>Rp0 admin</span>'+payMethodsOf(s).map(m=>'<span>'+esc(m.l)+'</span>').join("")+'</div></section>';
  h += '<div class="sec-pad" style="margin-top:14px">'+(s.desc?'<div class="pcard'+ra(2)+'"><div class="small" style="color:#45526b">'+esc(s.desc)+'</div><div class="small muted" style="margin-top:6px">'+esc(s.address||"")+(s.area?', '+esc(s.area):'')+'</div></div>':'')+
    '<div class="actions" style="margin:0 0 4px">'+(s.managed ? '' : '<button class="btn ghost press grow" data-act="chat-seller" data-id="'+esc(s.id)+'">'+I("chat")+' Chat penjual'+askBadgeStore(s.id)+'</button>')+'<button class="btn ghost press" data-act="store-link" data-id="'+esc(s.id)+'">'+I("megaphone")+' Bagikan toko</button></div></div>';
  if(!S.products[s.id]) return h + skeletonGrid(4);
  if(!prods.length) return h + aEmpty("package", "Belum ada produk", "Toko ini belum menambahkan produk.");
  return h + '<div class="ash"><h2>Semua produk</h2><span class="small muted">'+prods.length+' produk</span></div><div class="agrid">'+prods.map((p,i)=>appProdCard({p, s}, i)).join("")+'</div>';
}

/* ---------- detail produk ---------- */
function appProduct(){
  const f = findProd(S.prodId);
  if(!f) return appBar("Produk") + (Object.keys(S.products).length ? aEmpty("search","Produk tidak ditemukan","Mungkin sudah tidak dijual.") : skeletonGrid(2));
  const p = f.p, s = storeById(f.sid);
  if(!s) return appBar("Produk") + aEmpty("store","Toko tidak ditemukan","");
  const out = typeof p.stock === "number" && p.stock <= 0, closed = s.open === false;
  const sold = soldCount(p.id);
  const others = (S.products[s.id]||[]).filter(x => x.active !== false && x.id !== p.id).slice(0,6).map(x => ({p:x, s}));
  const inCart = S.cart.storeId===s.id && S.cart.items[p.id] ? S.cart.items[p.id].qty : 0;
  let h = '<div class="pgal">'+(p.img?'<img alt="" src="'+esc(p.img)+'">':E(catE(s.category)))+
    '<button class="ibtn l press" data-act="back" aria-label="Kembali">'+I("back")+'</button>'+
    '<button class="ibtn r fav'+(FAV.has(p.id)?" on":"")+'" data-act="fav" data-id="'+esc(p.id)+'" aria-label="Favorit" style="position:absolute;top:calc(12px + env(safe-area-inset-top));right:12px;width:40px;height:40px;border-radius:13px">'+I("heart")+'</button></div>';
  h += '<div class="psheet"><h1 class="'+ra(0)+'">'+esc(p.name)+'</h1><div class="small muted">'+(sold?sold+' terjual · ':'')+(typeof p.stock==="number"?'Stok '+p.stock:'Stok tersedia')+(inCart?' · <b style="color:#1f4fd1">'+inCart+' di keranjang</b>':'')+'</div>'+
    '<div class="bp">'+rp(p.price)+'</div>'+
    '<div class="pinfo'+ra(1)+'"><span class="pchip">'+E("truck")+' Ongkir Rp2rb/500 m</span><span class="pchip">'+E("money")+' Rp0 admin</span><span class="pchip">'+E("card")+' Bayar ke toko</span></div>'+
    (p.desc?'<div class="pcard'+ra(2)+'"><h3>Deskripsi</h3><div class="small" style="white-space:pre-line;color:#45526b">'+esc(p.desc)+'</div></div>':'')+
    '<div class="pcard'+ra(3)+'" style="display:flex;gap:12px;align-items:center">'+avatarHtml(s)+'<div class="grow" style="min-width:0"><b>'+esc(s.name)+'</b><div class="small muted">'+(closed?'<span class="closedt">Tutup</span>':'<span class="open">● Buka</span>')+' · '+esc(s.area||"")+'</div></div>'+
    '<button class="btn ghost sm press" data-act="open-store" data-id="'+esc(s.id)+'">Kunjungi</button></div>'+
    '<button class="btn ghost block press" style="margin-bottom:12px" data-act="chat-seller" data-id="'+esc(s.id)+'" data-p="'+esc(p.id)+'">'+I("chat")+' Tanya penjual soal produk ini</button>'+'</div>';
  if(others.length) h += '<div class="ash"><h2>Lainnya dari toko ini</h2></div><div class="agrid">'+others.map((x,i)=>appProdCard(x,i)).join("")+'</div>';
  h += '<div style="height:90px"></div><div class="pbuy"><button class="ibtn press" data-act="nav" data-v="cart" aria-label="Keranjang" style="position:relative;background:#f1f4fa;box-shadow:none">'+I("cart")+(cartCount()?'<span class="badge" style="position:absolute;top:-4px;right:-4px;background:#ff4d6d;color:#fff;font-size:10px;font-weight:800;border-radius:99px;padding:0 5px;line-height:16px">'+cartCount()+'</span>':'')+'</button>';
  if(out || closed) h += '<button class="btn" disabled>'+(out?'Stok habis':'Toko sedang tutup')+'</button></div>';
  else h += '<div class="stp"><button data-act="pq" data-d="-1" aria-label="Kurangi">−</button><b id="pqv">'+S.pq+'</b><button data-act="pq" data-d="1" aria-label="Tambah">+</button></div><button class="btn press" data-act="add-q" data-id="'+esc(p.id)+'" id="addq">Tambah · '+rp(p.price*S.pq)+'</button></div>';
  return h;
}

/* ---------- keranjang, pesanan, favorit, profil ---------- */
function appCart(){
  if(!cartCount() || !storeById(S.cart.storeId)) return appBar("Keranjang") + aEmpty("cart", "Keranjang masih kosong", "Yuk cari kebutuhanmu dari toko-toko di sekitar.", '<button class="btn press" data-act="nav" data-v="home">Mulai belanja</button>');
  return appBar("Keranjang") + '<div class="v-wrap'+ra(0)+'">'+viewCart()+'</div><div style="height:20px"></div>';
}
function appOrders(){
  const mine = S.orders.filter(o => o.buyerId === ME);
  if(S.ready.orders && !mine.length && S.rides.length) return appBar("Pesanan saya") + '<div class="v-wrap">'+jagoOrdersCard()+'</div>';
  if(S.ready.orders && !mine.length) return appBar("Pesanan saya") + aEmpty("receipt", "Belum ada pesanan", "Pesanan yang kamu buat akan muncul di sini.", '<button class="btn press" data-act="nav" data-v="home">Mulai belanja</button>');
  return appBar("Pesanan saya") + '<div class="v-wrap'+ra(0)+'">'+jagoOrdersCard()+(S.rides.length?'<div class="ash" style="margin:18px 0 8px"><h2>Belanja</h2></div>':'')+viewOrders()+'</div>';
}
function appOrder(){
  let h = appBar("Detail pesanan");
  if(S.justOrdered) h += '<div class="okhero">'+E("party")+'<h2>Pesanan berhasil dibuat!</h2><p>Ikuti langkah di bawah. Toko akan segera memproses pesananmu.</p></div>';
  return h + '<div class="v-wrap">'+viewOrder()+'</div>';
}
function appFav(){
  const list = allProducts().filter(x => FAV.has(x.p.id));
  if(!list.length) return appBar("Favorit") + aEmpty("heart", "Belum ada favorit", "Ketuk ikon hati di produk untuk menyimpannya di sini.", '<button class="btn press" data-act="nav" data-v="home">Cari produk</button>');
  return appBar("Favorit", '<span class="small muted">'+list.length+' produk</span>') + '<div class="agrid" style="margin-top:6px">'+list.map((x,i)=>appProdCard(x,i)).join("")+'</div>';
}
function appProfile(){
  const p = getProf(); const n = S.orders.filter(o => o.buyerId === ME).length;
  return '<section class="phead"><div class="aav'+ra(0)+'">'+(p.name?esc(initials(p.name)):E("all"))+'</div><h2>'+esc(p.name||"Tamu")+'</h2><small>'+esc(p.wa||"Belum masuk")+'</small></section>'+
    '<div class="plist'+ra(1)+'">'+
      '<button data-act="edit-addr">'+E("pin")+'<div class="grow">Alamat pengantaran<small>'+esc(p.address||"Belum diatur")+'</small></div><span class="chev">'+I("chev")+'</span></button>'+
      '<button data-act="nav" data-v="orders">'+E("receipt")+'<div class="grow">Pesanan saya<small>'+n+' pesanan</small></div><span class="chev">'+I("chev")+'</span></button>'+
      '<button data-act="nav" data-v="pesan">'+E("bell")+'<div class="grow">Pesan ke toko<small>'+((S.ask.mine||[]).filter(t => askUnread(t, "pembeli")).length ? '<b style="color:#e5484d">'+(S.ask.mine||[]).filter(t => askUnread(t, "pembeli")).length+' pesan baru</b>' : 'Tanya stok & harga langsung ke penjual')+'</small></div><span class="chev">'+I("chev")+'</span></button>'+
      '<button data-act="nav" data-v="poin">'+E("gift")+'<div class="grow">Poin & saldo JAGA<small>'+(S.pts.buyer && S.pts.buyer.points != null ? S.pts.buyer.points+' poin · saldo '+rp(S.pts.buyer.balance||0) : '10 transaksi sehari = 5 poin')+'</small></div><span class="chev">'+I("chev")+'</span></button>'+
      soundRow()+
      (PUSH_OK ? '<button data-act="push-on" data-v="buyer">'+E("bell")+'<div class="grow">Notifikasi pesanan<small>'+(pushOn("buyer") ? "Aktif ✓" : "Ketuk untuk mengaktifkan")+'</small></div><span class="chev">'+I("chev")+'</span></button>' : '')+
      '<button data-act="nav" data-v="jago">'+E("scooter")+'<div class="grow">Jago · ojek online<small>'+S.rides.length+' perjalanan</small></div><span class="chev">'+I("chev")+'</span></button>'+
      '<button data-act="nav" data-v="fav">'+E("heart")+'<div class="grow">Favorit<small>'+FAV.size+' produk disimpan</small></div><span class="chev">'+I("chev")+'</span></button>'+
    '</div><div class="plist p2'+ra(2)+'">'+
      '<button data-act="mitra-info">'+E("store")+'<div class="grow">Jadi mitra toko<small>Daftar gratis · bagi hasil 3%</small></div><span class="chev">'+I("chev")+'</span></button>'+
      '<button data-act="open-seller">'+E("store")+'<div class="grow">Masuk sebagai toko<small>Konfirmasi pesanan & kelola toko</small></div><span class="chev">'+I("chev")+'</span></button>'+
      '<button data-act="open-driver">'+E("scooter")+'<div class="grow">Jadi driver JAGA<small>Antar barang & ojek Jago · jagapatner.my.id/apps/#driver</small></div><span class="chev">'+I("chev")+'</span></button>'+
      (!isStandalone() ? '<button data-act="install"><img class="e3d" src="icons/icon-192.png" alt="" style="border-radius:8px"><div class="grow">Pasang aplikasi di HP<small>Buka JAGA langsung dari layar utama</small></div><span class="chev">'+I("chev")+'</span></button>' : '')+
      '<button data-act="rules">'+E("check")+'<div class="grow">Aturan JAGA<small>Ketentuan akun pembeli, toko & driver</small></div><span class="chev">'+I("chev")+'</span></button>'+
      '<a target="_blank" rel="noopener" href="'+esc(waLink(CONTACT.wa,"Halo JAGA, saya butuh bantuan."))+'">'+E("bell")+'<div class="grow">Bantuan<small>WhatsApp '+esc(CONTACT.wa)+'</small></div><span class="chev">'+I("chev")+'</span></a>'+
      (p.name?'<button data-act="logout">'+I("logout")+'<div class="grow">Keluar</div></button><button data-act="acc-del" data-role="buyer" class="dangerrow">'+I("logout")+'<div class="grow">Hapus akun<small>Hapus data akun pembeli secara permanen</small></div></button>':'<button data-act="nav" data-v="login">'+E("check")+'<div class="grow">Masuk<small>Simpan nama & alamat untuk checkout cepat</small></div><span class="chev">'+I("chev")+'</span></button>')+
    '</div><div class="small muted" style="text-align:center;margin:8px 0 20px;user-select:none" data-act="ver-tap">JAGA · versi 1.1<br><span style="font-size:11.5px;opacity:.8">Kami JAGA Kepercayaan anda</span></div>';
}
function appLogin(){
  const p = getProf();
  return '<div class="login"><section class="lhero"><div class="wmk'+ra(0)+'">'+JMARK()+'<b>JAGA</b></div><p class="jslog'+ra(1)+'"><span class="jl"><i></i><span><em>JA</em>minan Driver dan toko Aman</span></span><span class="jl"><i></i><span><em>GA</em>ransi pesanan pasti sampai</span></span><span class="jl"><i></i><span>Kami <em>JAGA</em> Kepercayaan anda</span></span></p>'+COURIER_SVG+'</section>'+
    '<form class="lform" id="loginForm" autocomplete="on"><h2 class="'+ra(2)+'">Selamat datang '+E("party")+'</h2><p class="'+ra(2)+'">Isi sekali saja — dipakai otomatis saat checkout.</p>'+
    '<label class="lin'+ra(3)+'">'+I("user")+'<input name="name" required placeholder="Nama lengkap" value="'+esc(p.name||"")+'" autocomplete="name"></label>'+
    '<label class="lin'+ra(4)+'">'+I("phone")+'<input name="wa" required inputmode="tel" placeholder="Nomor WhatsApp (08…)" value="'+esc(p.wa||"")+'" autocomplete="tel"></label>'+
    '<label class="lin'+ra(5)+'">'+I("pin")+'<input name="address" placeholder="Alamat / patokan (opsional)" value="'+esc(p.address||"")+'" autocomplete="street-address"></label>'+
    '<button class="lbtn press'+ra(6)+'">Masuk</button><div class="lor">atau</div>'+
    '<button type="button" class="lguest press" data-act="guest">Lihat-lihat dulu sebagai tamu</button>'+
    '<div class="lfoot"><a class="lmasuk" data-act="nav" data-v="masuk">Sudah punya akun toko / driver? <b>Masuk di sini</b></a></div></form></div>';
}
function openAddrModal(){
  const p = getProf();
  document.getElementById("modal").innerHTML = '<div class="modal-bg" data-act="modal-bg"><form class="modal" id="addrForm"><h2 class="sec" style="display:flex;gap:8px;align-items:center">'+E("pin")+' Alamat pengantaran</h2>'+
    '<label class="f">Nama penerima</label><input class="in" name="name" required value="'+esc(p.name||"")+'">'+
    '<label class="f">No. WhatsApp</label><input class="in" name="wa" required inputmode="tel" placeholder="08xxxxxxxxxx" value="'+esc(p.wa||"")+'">'+
    '<label class="f">Alamat lengkap & patokan</label><textarea class="in" name="address" required placeholder="Jalan, nomor rumah, desa/kelurahan, patokan">'+esc(p.address||"")+'</textarea>'+
    '<label class="f">Link Google Maps (opsional)</label><input class="in" name="maps" placeholder="https://maps.app.goo.gl/…" value="'+esc(p.maps||"")+'">'+
    '<div class="actions" style="margin-top:16px"><button class="btn" style="flex:1">Simpan alamat</button><button type="button" class="btn ghost" data-act="close-modal">Batal</button></div></form></div>';
}

/* ---------- animasi ---------- */
function flyToCart(src){
  try{
    const target = document.querySelector('#bnav [data-v="cart"]'); if(!src || !target) return;
    const r = src.getBoundingClientRect(), t = target.getBoundingClientRect();
    const g = document.createElement("div"); g.className = "flyghost";
    g.innerHTML = src.innerHTML.replace(/<div class="so".*?<\/div>/, "");
    const sz = Math.min(r.width, 110);
    Object.assign(g.style, {left:(r.left + r.width/2 - sz/2)+"px", top:(r.top + r.height/2 - sz/2)+"px", width:sz+"px", height:sz+"px"});
    document.body.appendChild(g);
    const dx = t.left + t.width/2 - (r.left + r.width/2), dy = t.top + t.height/2 - (r.top + r.height/2);
    const an = g.animate([{transform:"translate(0,0) scale(1)", opacity:1},{transform:"translate("+dx*.45+"px,"+(dy*.45-90)+"px) scale(.7)", opacity:1, offset:.5},{transform:"translate("+dx+"px,"+dy+"px) scale(.12)", opacity:.4}], {duration:720, easing:"cubic-bezier(.45,0,.55,1)"});
    an.onfinish = () => { g.remove(); const b = document.querySelector('#bnav [data-v="cart"]'); if(b){ b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); } };
  }catch(e){}
}
function celebrate(){
  const box = document.createElement("div"); box.className = "confetti";
  const cols = ["#2f6bff","#7cc2ff","#b08d4f","#ffd66b","#ff4d6d","#22c55e"];
  for(let i=0;i<70;i++){ const c = document.createElement("i"); c.style.left = Math.random()*100+"%"; c.style.background = cols[i%cols.length]; c.style.animationDuration = (1.6+Math.random()*1.6)+"s"; c.style.animationDelay = (Math.random()*.4)+"s"; c.style.transform = "rotate("+Math.random()*360+"deg)"; box.appendChild(c); }
  document.body.appendChild(box); setTimeout(() => box.remove(), 3600);
}
function showSplash(){
  let seen = false; try{ seen = sessionStorage.getItem("jt_splash"); }catch(e){}
  if(seen || S.role === "seller") return;
  const sp = document.createElement("div"); sp.id = "splash";
  sp.innerHTML = '<div class="blob"></div>'+COURIER_SVG;
  document.body.appendChild(sp);
  try{ sessionStorage.setItem("jt_splash", "1"); }catch(e){}
  setTimeout(() => { sp.classList.add("out"); setTimeout(() => sp.remove(), 600); }, 2400);
}

/* ---------- aksi ---------- */
function reorder(oid){
  const o = S.orders.find(x => x.id === oid); if(!o) return;
  const st = storeById(o.storeId); if(!st || !visibleStore(st)) return toast("Toko ini sudah tidak aktif.");
  if(st.open === false) return toast("Toko sedang tutup.");
  const prods = S.products[o.storeId] || [];
  const items = {}; let skipped = 0;
  o.items.forEach(i => { const p = prods.find(x => x.id === i.pid); if(!p || p.active === false || (typeof p.stock === "number" && p.stock < i.qty)){ skipped++; return; } items[p.id] = {pid:p.id, name:p.name, price:p.price, img:p.img||"", qty:i.qty}; });
  if(!Object.keys(items).length) return toast("Produk dari pesanan ini sudah tidak tersedia.");
  const apply = () => { S.cart = {storeId:o.storeId, items}; saveCart(); go("cart"); toast(skipped ? "Ditambahkan, "+skipped+" produk tidak tersedia" : "Ditambahkan ke keranjang"); };
  if(cartCount() && S.cart.storeId !== o.storeId) confirmModal("Ganti isi keranjang dengan pesanan ini?", "Ganti", async () => apply()); else apply();
}
document.addEventListener("click", e => {
  const el = e.target.closest("[data-act]"); if(!el || S.role === "seller") return;
  const a = el.dataset.act, id = el.dataset.id;
  if(a === "back"){ e.stopPropagation(); const h = S.hist.pop(); if(h) go(h.view, {storeId:h.storeId, prodId:h.prodId, orderId:h.orderId}, {back:true}); else go("home"); return; }
  if(a === "fav"){
    e.stopPropagation();
    if(FAV.has(id)) FAV.delete(id); else FAV.add(id);
    saveFav();
    if(S.view === "fav"){ render(); return; }
    document.querySelectorAll('.fav[data-id="'+CSS.escape(id)+'"]').forEach(b => { b.classList.toggle("on", FAV.has(id)); b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop"); });
    if(FAV.has(id)) toast("Disimpan ke favorit");
    return;
  }
  if(a === "add"){
    e.stopPropagation();
    const card = el.closest(".ap"); const im = card && card.querySelector(".im");
    const before = cartCount(); changeQty(id, 1);
    if(cartCount() > before) flyToCart(im);
    return;
  }
  if(a === "pq"){ const f = findProd(S.prodId); const max = f && typeof f.p.stock === "number" ? f.p.stock : 99; S.pq = Math.max(1, Math.min(max, S.pq + Number(el.dataset.d))); const v = document.getElementById("pqv"); if(v) v.textContent = S.pq; const b = document.getElementById("addq"); if(b && f) b.textContent = "Tambah · "+rp(f.p.price*S.pq); return; }
  if(a === "add-q"){ const before = cartCount(); changeQty(id, S.pq); if(cartCount() > before){ toast(S.pq+" ditambahkan ke keranjang"); S.pq = 1; render(); } return; }
  if(a === "reorder"){ e.stopPropagation(); reorder(id); return; }
  if(a === "edit-addr"){ openAddrModal(); return; }
  if(a === "guest"){ try{ localStorage.setItem("jt_onb", "1"); }catch(_){} go("home"); return; }
  if(a === "logout"){ confirmModal("Keluar dari akun di perangkat ini? Nama & alamat yang tersimpan akan dihapus.", "Keluar", async () => { try{ localStorage.removeItem("st_buyer"); localStorage.removeItem("jt_onb"); }catch(_){} go("login"); }); return; }
  if(a === "scroll-store"){ const t = document.getElementById("storeTop")||document.getElementById("prodTop"); if(t) t.scrollIntoView({behavior:"smooth"}); return; }
  if(a === "scroll-prod"){ const t = document.getElementById("prodTop"); if(t) t.scrollIntoView({behavior:"smooth"}); return; }
});
document.addEventListener("submit", e => {
  const f = e.target; if(S.role === "seller") return;
  if(f.id === "loginForm"){
    const fd = new FormData(f); const p = getProf();
    const name = (fd.get("name")||"").trim(), wa = (fd.get("wa")||"").replace(/[^\d+]/g,"");
    if(!name) return toast("Isi nama lengkap.");
    if(!waOk(wa)) return toast(WA_BAD);
    setProf(Object.assign(p, {name, wa, address:(fd.get("address")||"").trim() || p.address || ""}));
    try{ localStorage.setItem("jt_onb", "1"); }catch(_){}
    go("home"); toast("Selamat datang, "+name.split(/\s+/)[0]+"!");
  }
  if(f.id === "addrForm"){
    const fd = new FormData(f); const p = getProf();
    let maps = (fd.get("maps")||"").trim(); if(maps && !/^https?:\/\//i.test(maps)) maps = "";
    setProf(Object.assign(p, {name:fd.get("name").trim(), wa:fd.get("wa").trim(), address:fd.get("address").trim(), maps}));
    try{ localStorage.setItem("jt_onb", "1"); }catch(_){}
    closeModal(); render(); toast("Alamat disimpan");
  }
});
document.addEventListener("input", e => {
  if(e.target.id === "aq"){ S.q = e.target.value; renderHomeBody(); }
});


/* ===== Pasang di layar utama (PWA) ===== */
let INSTALL_EVT = null;
const isStandalone = () => { try{ return matchMedia("(display-mode: standalone)").matches || navigator.standalone === true; }catch(e){ return false; } };
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent || "");
window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); INSTALL_EVT = e; if(!typing()) scheduleRender(); });
window.addEventListener("appinstalled", () => { INSTALL_EVT = null; toast("JAGA terpasang di HP Anda"); scheduleRender(); });
function canInstall(){ if(isStandalone()) return false; let hid = false; try{ hid = localStorage.getItem("jt_inst_hide") === "1"; }catch(e){} return !hid && (INSTALL_EVT || isIOS()); }
function installCard(){ return canInstall() ? '<div class="installcard'+ra(4)+'"><img class="ico" src="icons/icon-192.png" alt=""><div class="grow"><b>Pasang JAGA di HP</b><small>Buka lebih cepat, seperti aplikasi</small></div><button class="btn sm press" data-act="install">Pasang</button><button class="x" data-act="install-hide" aria-label="Tutup">×</button></div>' : ''; }
const PORTAL_APP = {seller:["JAGA Mitra","Terima pesanan & kelola toko langsung dari layar utama HP"], driver:["JAGA Driver","Buka aplikasi driver lebih cepat & terima order tanpa buka browser"]};
function canInstallPortal(role){ if(isStandalone()) return false; let hid = false; try{ hid = localStorage.getItem("jt_inst_hide_" + role) === "1"; }catch(e){} return !hid; }
function portalInstallCard(role){
  if(!canInstallPortal(role)) return "";
  const a = PORTAL_APP[role];
  return '<div class="installcard pinst"><img class="ico" src="icons/icon-192.png" alt=""><div class="grow"><b>Pasang '+a[0]+' di HP</b><small>'+a[1]+'</small></div><button class="btn sm press" data-act="install" data-v="'+role+'">Pasang</button><button class="x" data-act="install-hide" data-v="'+role+'" aria-label="Tutup">×</button></div>';
}
function portalInstallRow(role){
  if(isStandalone()) return '<div class="hint" style="margin-top:6px">'+I("checkc")+' '+PORTAL_APP[role][0]+' sudah terpasang di HP ini.</div>';
  return '<button class="btn ghost sm" data-act="install" data-v="'+role+'" style="margin-top:8px"><img src="icons/icon-192.png" alt="" style="width:20px;height:20px;border-radius:6px"> Pasang '+PORTAL_APP[role][0]+' di HP</button>';
}
async function doInstall(role){
  if(role === "seller" || role === "driver"){ try{ localStorage.setItem("jt_home_role", role); }catch(_){} }
  else { try{ localStorage.removeItem("jt_home_role"); }catch(_){} }
  if(INSTALL_EVT){ INSTALL_EVT.prompt(); try{ await INSTALL_EVT.userChoice; }catch(e){} INSTALL_EVT = null; render(); return; }
  const nm = role === "seller" ? "JAGA Mitra" : role === "driver" ? "JAGA Driver" : "JAGA";
  if(!isIOS()){
    document.getElementById("modal").innerHTML = '<div class="modal-bg" data-act="modal-bg"><div class="modal"><h2 class="sec" style="display:flex;gap:10px;align-items:center"><img src="icons/icon-192.png" alt="" style="width:40px;height:40px;border-radius:11px"> Pasang '+nm+'</h2>'+
      '<ol style="padding-left:20px;line-height:1.9;margin:0 0 16px"><li>Buka halaman ini di <b>Chrome</b></li><li>Ketuk menu <b>⋮</b> di pojok kanan atas</li><li>Pilih <b>Instal aplikasi</b> atau <b>Tambahkan ke layar utama</b></li><li>Ketuk <b>Instal</b>, lalu buka '+nm+' dari layar utama</li></ol>'+
      '<button class="btn block" data-act="close-modal">Mengerti</button></div></div>';
    return;
  }
  document.getElementById("modal").innerHTML = '<div class="modal-bg" data-act="modal-bg"><div class="modal"><h2 class="sec" style="display:flex;gap:10px;align-items:center"><img src="icons/icon-192.png" alt="" style="width:40px;height:40px;border-radius:11px"> Pasang di iPhone</h2>'+
    '<ol style="padding-left:20px;line-height:1.9;margin:0 0 16px"><li>Ketuk tombol <b>Bagikan</b> (kotak dengan panah ke atas) di Safari</li><li>Pilih <b>Tambah ke Layar Utama</b></li><li>Ketuk <b>Tambah</b></li></ol>'+
    '<button class="btn block" data-act="close-modal">Mengerti</button></div></div>';
}
document.addEventListener("click", e => {
  const el = e.target.closest("[data-act]"); if(!el) return;
  if(el.dataset.act === "install"){ doInstall(el.dataset.v || ""); }
  if(el.dataset.act === "install-hide"){ try{ localStorage.setItem(el.dataset.v ? "jt_inst_hide_" + el.dataset.v : "jt_inst_hide", "1"); }catch(_){} render(); }
});
if("serviceWorker" in navigator && /(^|\.)jagapatner\.my\.id$|github\.io$|^localhost$|^127\./.test(location.hostname)){
  const hadSW = !!navigator.serviceWorker.controller;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").then(reg => {
      const chk = () => { if(!document.hidden) reg.update().catch(() => {}); };
      setInterval(chk, 3 * 60 * 1000); document.addEventListener("visibilitychange", chk);
    }).catch(() => {});
  });
  /* versi baru terpasang: muat ulang otomatis bila aman, kalau sedang mengisi formulir tampilkan tombol */
  let swReloading = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if(!hadSW || swReloading) return;
    const busy = typeof typing === "function" && (typing() || [...document.querySelectorAll("#app form input:not([type=hidden]), #app form textarea")].some(el => el.value && el.value !== el.defaultValue));
    if(!busy){ swReloading = true; location.reload(); return; }
    const bar = document.createElement("button");
    bar.className = "updbar"; bar.textContent = "Versi baru JAGA tersedia — ketuk untuk memperbarui";
    bar.onclick = () => { swReloading = true; location.reload(); };
    document.body.appendChild(bar);
  });
}


/* ===== Chat penjual: pertanyaan siap kirim ===== */
function chatQuestions(s, p){
  const prof = getProf();
  const first = (prof.name||"").trim();
  const addr = prof.address ? " ke " + prof.address : " ke alamat saya";
  const inCart = S.cart.storeId === s.id ? Object.values(S.cart.items) : [];
  const cartTxt = inCart.length ? inCart.map(i => "- " + i.name + " x" + i.qty + " (" + rp(i.price * i.qty) + ")").join("\n") : "";
  const head = "Halo " + s.name + ", " + (first ? "saya " + first + ". Saya" : "saya") + " lihat toko Anda di JAGA.\n\n";
  const q = [];
  if(p){
    const pn = '"' + p.name + '" (' + rp(p.price) + ")";
    q.push({e:"check", t:"Apakah masih tersedia?", m:"Apakah " + pn + " masih tersedia hari ini?"});
    q.push({e:"package", t:"Stok ada berapa?", m:"Untuk " + pn + ", stoknya masih ada berapa? Saya mau pesan beberapa."});
    q.push({e:"search", t:"Tanya detail produk", m:"Boleh minta info lebih detail tentang " + pn + "? (ukuran/porsi, varian, kondisi barang)"});
    q.push({e:"money", t:"Ada harga khusus?", m:"Kalau saya beli " + pn + " dalam jumlah banyak, apakah ada harga khusus?"});
  } else {
    q.push({e:"check", t:"Apa saja yang tersedia hari ini?", m:"Produk apa saja yang tersedia hari ini?"});
    q.push({e:"search", t:"Cari barang tertentu", m:"Apakah ada barang yang saya cari: ...? Kalau ada, berapa harganya?"});
  }
  q.push({e:"truck", t:"Bisa diantar hari ini?", m:"Apakah pesanan bisa diantar hari ini" + addr + "? Kira-kira jam berapa sampai?"});
  q.push({e:"card", t:"Cara bayar apa saja?", m:"Pembayarannya bisa lewat apa saja? Apakah bisa bayar di tempat (COD)?"});
  q.push({e:"clock", t:"Jam buka toko", m:"Toko buka jam berapa sampai jam berapa? Hari ini buka?"});
  if(cartTxt) q.unshift({e:"cart", t:"Konfirmasi isi keranjang saya", m:"Saya mau pesan:\n" + cartTxt + "\nTotal " + rp(cartTotals().total) + ". Apakah semuanya tersedia dan bisa diantar" + addr + "?"});
  return q;
}
/* ===== Tanya toko: pesan pembeli <-> toko di dalam JAGA (tanpa WhatsApp) ===== */
S.ask = {store:{}, mine:null};
let ASK_SEEN = {}; try{ ASK_SEEN = JSON.parse(localStorage.getItem("jt_ask_seen") || "{}"); }catch(_){}
const askSeenSave = () => { try{ localStorage.setItem("jt_ask_seen", JSON.stringify(ASK_SEEN)); }catch(_){} };
const askLocal = () => { try{ return JSON.parse(localStorage.getItem("jt_ask_local") || "[]"); }catch(_){ return []; } };
const askLocalSave = a => { try{ localStorage.setItem("jt_ask_local", JSON.stringify(a.slice(-3000))); }catch(_){} };
const askThLocal = sid => "a_" + sid + "_" + ME;
function askGroup(rows, nameOf){
  const by = {};
  rows.forEach(m => { const t = by[m.th] || (by[m.th] = {th:m.th, storeId:m.storeId, n:0, last:0}); t.n++; if(m.buyerName) t.name = m.buyerName; if(m.id > t.last){ t.last = m.id; t.role = m.role; t.body = m.body; t.at = m.at; } });
  return Object.values(by).map(t => nameOf ? Object.assign(t, {name:nameOf(t)}) : t).sort((a, b) => b.last - a.last);
}
const ASK = {
  async send(sid, th, body, as){
    if(SB) return await sbStore.rpc("jt_ask_send", {p_store:sid, p_th:th || null, p_body:body, p_name:getProf().name || null});
    body = String(body || "").trim().slice(0, 800); if(!body) throw srvErr("Pesan kosong");
    const a = askLocal(), id = Date.now() + a.length, mt = th || askThLocal(sid);
    a.push({id, th:mt, storeId:sid, role:as === "toko" ? "toko" : "pembeli", buyerName:as === "toko" ? null : (getProf().name || "Pembeli"), body, at:Date.now()});
    askLocalSave(a); return {ok:true, id, th:mt};
  },
  async get(sid, th, after){
    if(SB) return await sbStore.rpc("jt_ask_get", {p_store:sid, p_th:th || null, p_after:after || 0});
    const mt = th || askThLocal(sid);
    return {th:mt, msgs:askLocal().filter(m => m.th === mt && m.id > (after || 0)).map(m => Object.assign({}, m, {name:m.buyerName || ""}))};
  },
  async threads(sid){
    if(SB) return (await sbStore.rpc("jt_ask_threads", {p_store:sid || null})) || [];
    const a = askLocal();
    if(sid) return askGroup(a.filter(m => m.storeId === sid), t => t.name || "Pembeli");
    return askGroup(a.filter(m => m.th === askThLocal(m.storeId)), t => (storeById(t.storeId) || {}).name || "Toko");
  }
};
const askUnread = (t, myRole) => !!t && t.last > (ASK_SEEN[t.th] || 0) && t.role !== myRole;
function askBadgeStore(sid){ const t = (S.ask.mine || []).find(x => x.storeId === sid); return askUnread(t, "pembeli") ? '<span class="cdot"></span>' : ''; }
const askOpen = {sid:null, th:null, as:null, msgs:[], last:0, timer:null, first:true};
function askQuick(s, p, as){
  if(as === "toko") return [{t:"Masih ada", m:"Masih ada kak, silakan langsung dipesan lewat aplikasi JAGA ya."}, {t:"Stok habis", m:"Maaf kak, stoknya sedang habis."}, {t:"Bisa diantar", m:"Bisa diantar hari ini kak, pesan lewat aplikasi ya."}, {t:"Jam buka", m:"Toko buka setiap hari. Silakan pesan lewat aplikasi JAGA."}];
  return chatQuestions(s, p);
}
function openAsk(sid, th, as, pid, name){
  as = as || "pembeli";
  const s = storeById(sid) || {id:sid, name:"Toko"}; const f = pid ? findProd(pid) : null; const p = f ? f.p : null;
  Object.assign(askOpen, {sid, th:th || null, as, msgs:[], last:0, first:true});
  const title = as === "toko" ? "Pembeli " + (name || "") : "Tanya " + s.name;
  const sub = as === "toko" ? "Pertanyaan untuk " + s.name : (p ? "Soal " + p.name : "Pesan langsung ke penjual di JAGA");
  document.getElementById("modal").innerHTML = '<div class="modal-bg chatbg" data-act="modal-bg"><div class="modal chatwin" role="dialog" aria-label="Pesan toko">'+
    '<div class="chead"><button class="ibtn" data-act="close-ask" aria-label="Tutup">'+I("back")+'</button>'+(as === "toko" ? '' : avatarHtml(s))+'<div class="grow"><b>'+esc(title)+'</b><small>'+esc(sub)+'</small></div></div>'+
    '<div class="clist" id="askList"><div class="empty">'+I("loader")+'</div></div>'+
    '<div class="cquick">'+askQuick(s, p, as).map((q, i) => '<button type="button" data-act="ask-quick" data-i="'+i+'">'+esc(q.t)+'</button>').join("")+'</div>'+
    '<form class="cform" id="askForm"><input class="in" name="body" maxlength="800" autocomplete="off" placeholder="Tulis pesan…"><button class="btn press" aria-label="Kirim">'+I("send")+'</button></form></div></div>';
  askOpen.quick = askQuick(s, p, as);
  askLoad();
  clearInterval(askOpen.timer); askOpen.timer = setInterval(() => { if(!document.getElementById("askList")){ clearInterval(askOpen.timer); askOpen.sid = null; return; } if(!document.hidden) askLoad(); }, 4000);
}
function renderAskMsgs(){
  const box = document.getElementById("askList"); if(!box) return;
  const near = box.scrollHeight - box.scrollTop - box.clientHeight < 80;
  box.innerHTML = askOpen.msgs.length ? askOpen.msgs.map(m => {
    const mine = m.role === askOpen.as;
    return '<div class="cm '+(mine ? "me" : "them")+' r-'+(m.role === "toko" ? "toko" : "pembeli")+'">'+(mine ? '' : '<small>'+(m.role === "toko" ? "Toko" : "Pembeli"+(m.name ? " · "+esc(m.name) : ""))+'</small>')+'<div class="bub">'+esc(m.body)+'</div><time>'+new Date(m.at).toLocaleTimeString("id-ID", {hour:"2-digit", minute:"2-digit"})+'</time></div>';
  }).join("") : '<div class="cempty">'+E("bell")+'<b>Belum ada pesan</b><small>'+(askOpen.as === "toko" ? "" : "Tanyakan stok, harga, atau pengantaran. Pilih pertanyaan cepat di bawah atau tulis sendiri.")+' Semua pesan dan transaksi dilakukan di aplikasi JAGA.</small></div>';
  if(near || askOpen.first){ box.scrollTop = box.scrollHeight; askOpen.first = false; }
}
async function askLoad(){
  if(!askOpen.sid) return;
  try{
    const r = await ASK.get(askOpen.sid, askOpen.th, askOpen.last) || {};
    if(r.th) askOpen.th = askOpen.th || (askOpen.as === "toko" ? askOpen.th : null), askOpen.thv = r.th;
    const add = r.msgs || [];
    if(add.length){
      const ids = new Set(askOpen.msgs.map(m => m.id));
      add.forEach(m => { if(!ids.has(m.id)) askOpen.msgs.push(m); });
      askOpen.last = Math.max(askOpen.last, ...add.map(m => m.id));
      renderAskMsgs();
    } else if(askOpen.first) renderAskMsgs();
    if(askOpen.thv){ ASK_SEEN[askOpen.thv] = Math.max(ASK_SEEN[askOpen.thv] || 0, askOpen.last); askSeenSave(); }
  }catch(e){ const box = document.getElementById("askList"); if(box && !askOpen.msgs.length) box.innerHTML = '<div class="cempty"><small>'+esc(String(e.message || "Pesan belum bisa dimuat").replace(/^.*?:\s*/, ""))+'</small></div>'; }
}
async function askSend(body){
  body = String(body || "").trim(); if(!body || !askOpen.sid) return;
  if(askOpen.as === "pembeli" && !SB && myStores().some(x => x.id === askOpen.sid)) return toast("Tidak bisa mengirim pesan ke toko sendiri.");
  try{ await ASK.send(askOpen.sid, askOpen.as === "toko" ? askOpen.th : null, body, askOpen.as); await askLoad(); askPoll(); }
  catch(e){ toast(String(e.message || "Gagal mengirim").replace(/^.*?:\s*/, "")); }
}
function openChatSheet(sid, pid){ if(!storeById(sid)) return; openAsk(sid, null, "pembeli", pid); }
document.addEventListener("click", e => {
  const el = e.target.closest("[data-act]"); if(!el) return;
  const a = el.dataset.act;
  if(a === "chat-seller"){ e.stopPropagation(); openChatSheet(el.dataset.id, el.dataset.p); return; }
  if(a === "ask-open"){ e.stopPropagation(); openAsk(el.dataset.id, el.dataset.th || null, el.dataset.as || "pembeli", null, el.dataset.v || ""); return; }
  if(a === "close-ask"){ clearInterval(askOpen.timer); askOpen.sid = null; closeModal(); askPoll(); return; }
  if(a === "ask-quick"){ const q = (askOpen.quick || [])[+el.dataset.i]; if(q) askSend(q.m); return; }
}, true);
document.addEventListener("submit", e => {
  if(e.target.id !== "askForm") return;
  e.preventDefault();
  const inp = e.target.querySelector("input"); const v = inp.value; inp.value = ""; inp.focus();
  askSend(v);
});
/* kotak masuk & notifikasi pesan toko */
let askFirst = true;
async function askPoll(){
  if(document.hidden || S.role === "owner" || S.role === "driver") return;
  try{
    const before = JSON.stringify(S.ask);
    const notify = (list, myRole, label) => { (list || []).forEach(t => { if(!askFirst && askUnread(t, myRole) && askOpen.thv !== t.th && !(S.ask._t || {})[t.th + ":" + t.last]){ (S.ask._t = S.ask._t || {})[t.th + ":" + t.last] = 1; notify("Pesan baru · " + label(t), t.body || "pesan baru", {kind:"chat", act:() => openAsk(t.storeId, myRole === "toko" ? t.th : null, myRole, null, t.name || "")}); } }); };
    if(S.role === "seller"){
      for(const st of myStores()){ const l = await ASK.threads(st.id); S.ask.store[st.id] = l; notify(l, "toko", t => "Pembeli " + (t.name || "")); }
    } else {
      const l = await ASK.threads(null); S.ask.mine = l; notify(l, "pembeli", t => t.name || "Toko");
    }
    askFirst = false;
    if(JSON.stringify(S.ask) !== before && !typing() && !document.getElementById("askList")) scheduleRender();
  }catch(_){}
}
setInterval(askPoll, 12000); setTimeout(askPoll, 1500);
function askInbox(s){
  const l = S.ask.store[s.id]; if(!l || !l.length) return "";
  const un = l.filter(t => askUnread(t, "toko")).length;
  return '<div class="card pad askbox"><h3 class="sub">'+I("chat")+' Pertanyaan pembeli'+(un ? ' <em class="askn">'+un+' baru</em>' : '')+'</h3>'+
    l.slice(0, 8).map(t => '<button class="askrow'+(askUnread(t, "toko") ? ' un' : '')+'" data-act="ask-open" data-id="'+esc(s.id)+'" data-th="'+esc(t.th)+'" data-as="toko" data-v="'+esc(t.name || "")+'"><span class="aav">'+esc(initials(t.name || "P"))+'</span><div class="grow"><b>'+esc(t.name || "Pembeli")+'</b><small>'+(t.role === "toko" ? "Anda: " : "")+esc(t.body || "")+'</small></div><time>'+fmtDate(t.at)+'</time></button>').join("")+
    '<div class="hint">Balas pertanyaan di sini. Semua pesan dan transaksi dilakukan di aplikasi JAGA, bukan WhatsApp.</div></div>';
}
function appPesan(){
  const l = S.ask.mine;
  let h = appBar("Pesan ke toko");
  if(!l){ askPoll(); return h + '<div class="empty">'+I("loader")+' Memuat…</div>'; }
  if(!l.length) return h + aEmpty("bell", "Belum ada pesan", "Tekan “Chat penjual” di halaman toko atau produk untuk bertanya langsung ke penjual.");
  return h + '<div class="v-wrap"><div class="card pad askbox">'+l.map(t => '<button class="askrow'+(askUnread(t, "pembeli") ? ' un' : '')+'" data-act="ask-open" data-id="'+esc(t.storeId)+'" data-as="pembeli"><span class="aav">'+esc(initials(t.name || "T"))+'</span><div class="grow"><b>'+esc(t.name || "Toko")+'</b><small>'+(t.role === "pembeli" ? "Anda: " : "")+esc(t.body || "")+'</small></div><time>'+fmtDate(t.at)+'</time></button>').join("")+'</div></div>';
}

/* ============ Driver: pencarian driver terdekat & portal driver ============ */
const DRIVER_ID_LOCAL = "d" + KEY.slice(2, 22);
const LOC_FRESH = 20 * 60 * 1000;
S.drivers = [];
S.drv = {me:undefined, offers:[], mine:[], loaded:false, loc:null, locErr:"", seen:new Set(), draft:{}, editing:false, sig:""};
function radiusM(el){ return el < 90 ? 1000 : el < 150 ? 2000 : el < 210 ? 3000 : 5000; }
function distM(a, b){ const R = 6371000, r = x => x * Math.PI / 180; const dl = r(b.lat - a.lat), dg = r(b.lng - a.lng); const q = Math.sin(dl/2)**2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(dg/2)**2; return 2 * R * Math.asin(Math.sqrt(q)); }
const fmtDist = m => m == null ? "" : m < 1000 ? Math.round(m) + " m" : (m/1000).toFixed(1).replace(".", ",") + " km";
const hasLoc = x => x && typeof x.lat === "number" && typeof x.lng === "number";
const navLink = (loc, addr) => "https://www.google.com/maps/dir/?api=1&travelmode=two-wheeler&dir_action=navigate&destination=" + (hasLoc(loc) ? loc.lat + "," + loc.lng : encodeURIComponent(String(addr || "").trim()));
const dirLink = (loc, addr) => hasLoc(loc) ? "https://www.google.com/maps/dir/?api=1&destination=" + loc.lat + "," + loc.lng : "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(addr || "");
function searchElapsed(o){ return Math.max(0, (Date.now() - (o.searchAt || o.updatedAt || Date.now())) / 1000); }

/* aturan yang sama dengan server (dipakai di mode pratinjau/demo) */
function drvFree(id, d){ return !!(d && d.online) && (!d.verify || d.verify === "verified") && !S.orders.concat(S.ridesAll).some(o => o.driverId === id && DRV_BUSY.includes(o.status)); }
function offerDist(o, id, d, now){
  if((o.declined || []).includes(id)) return null;
  if(!drvCanRide(id, o)) return null;
  const sl = o.storeLoc || o.pickup;
  if(!hasLoc(sl)) return -1;
  if(!hasLoc(d) || !(d.locAt > now - LOC_FRESH)) return null;
  const el = (now - (o.searchAt || now)) / 1000;
  const dist = distM(sl, d);
  if(dist > radiusM(el)) return null;
  if(el < 30){
    const c = S.drivers.filter(x => x.online && hasLoc(x) && x.locAt > now - LOC_FRESH && !(o.declined || []).includes(x.id) && drvFree(x.id, x) && drvCanRide(x.id, o)).sort((a, b) => distM(sl, a) - distM(sl, b));
    if(!c[0] || c[0].id !== id) return null;
  }
  return dist;
}
const srvErr = m => Object.assign(new Error(m), {code:"server"});
const localDrv = {
  me(){ const d = S.drivers.find(x => x.id === DRIVER_ID_LOCAL); return d ? Object.assign({}, d) : null; },
  async save(data){
    const old = this.me(), now = Date.now(), patch = {};
    ["name","wa","vehicle","plate","address","area","online","lat","lng"].forEach(k => { if(k in data) patch[k] = data[k]; });
    if("lat" in patch) patch.locAt = now;
    if(!old){
      if(!patch.name || !patch.wa) throw srvErr("Isi nama dan nomor WhatsApp");
      await store.set("drivers/" + DRIVER_ID_LOCAL, Object.assign({createdAt:now}, patch, {online:false, verify:"pending"}));
      if(!S.drivers.some(x => x.id === DRIVER_ID_LOCAL)) S.drivers.push(Object.assign({id:DRIVER_ID_LOCAL, createdAt:now}, patch, {online:false, verify:"pending"}));
    } else {
      if(old.verify && old.verify !== "verified" && patch.online) throw srvErr("Akun driver belum diverifikasi tim JAGA");
      if(old.verify === "rejected" && ("name" in patch || "plate" in patch || "address" in patch)) Object.assign(patch, {verify:"pending", verifyNote:""});
      await store.update("drivers/" + DRIVER_ID_LOCAL, Object.assign(patch, {updatedAt:now}));
    }
    const merged = Object.assign(old || {}, patch, old ? {} : {online:false, verify:"pending"}, {id:DRIVER_ID_LOCAL});
    const i = S.drivers.findIndex(x => x.id === DRIVER_ID_LOCAL); if(i >= 0) S.drivers[i] = merged; else S.drivers.push(merged);
    if("lat" in patch){
      for(const o of S.orders.filter(o => o.driverId === DRIVER_ID_LOCAL && DRV_BUSY.includes(o.status))) await store.update("orders/" + o.id, {driverLoc:{lat:patch.lat, lng:patch.lng, at:now}});
      for(const o of S.ridesAll.filter(o => o.driverId === DRIVER_ID_LOCAL && DRV_BUSY.includes(o.status))) await store.update("rides/" + o.id, {driverLoc:{lat:patch.lat, lng:patch.lng, at:now}});
    }
    return merged;
  },
  async jobs(){
    const me = this.me(), now = Date.now();
    if(!me) return {me:null, offers:[], mine:[]};
    const all = S.orders.concat(S.ridesAll);
    const mine = all.filter(o => o.driverId === me.id).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    const offers = !drvFree(me.id, me) ? [] : all.filter(o => o.status === "mencari_driver").map(o => {
      const d = offerDist(o, me.id, me, now);
      return d === null ? null : Object.assign({}, o, {dist: d < 0 ? null : Math.round(d), buyer:Object.assign({}, o.buyer, {wa:""}), rider:o.rider ? Object.assign({}, o.rider, {wa:""}) : undefined, proof:""});
    }).filter(Boolean);
    await localDrvBonus(me.id);
    return {me, offers, mine, now, wallet:{balance:balLocal("drv:" + me.id), minBalance:wCfgLocal().minBalance || 0}};
  },
  async act(id, act, data){
    let o = S.orders.find(x => x.id === id);
    const me = this.me(), now = Date.now();
    if(!me) throw srvErr("Daftar sebagai driver dulu");
    if(!o){ o = S.ridesAll.find(x => x.id === id); if(o) return this.rideAct(me, o, act, data, now); }
    if(!o) throw srvErr("Pesanan tidak ditemukan");
    let patch;
    if(act === "accept"){
      if(o.status !== "mencari_driver") throw srvErr("Pesanan sudah diambil driver lain");
      if(!drvFree(me.id, me)) throw srvErr("Selesaikan pesanan aktif Anda atau aktifkan status online");
      if(!drvCanRide(me.id, o)) throw srvErr("Saldo driver di bawah minimum. Isi saldo atau hubungi JAGA agar bisa menerima order lagi");
      if(offerDist(o, me.id, me, now) === null) throw srvErr("Pesanan ini di luar jangkauan Anda");
      patch = {status:"driver_ke_toko", driverId:me.id, acceptedAt:now, updatedAt:now, driver:{name:me.name, wa:me.wa, vehicle:me.vehicle || "", plate:me.plate || ""}};
      if(hasLoc(me)) patch.driverLoc = {lat:me.lat, lng:me.lng, at:now};
    } else if(act === "decline"){
      patch = {declined:(o.declined || []).concat(me.id)};
    } else {
      if(o.driverId !== me.id) throw srvErr("Bukan pesanan Anda");
      if(act === "pickup"){ if(o.status !== "driver_ke_toko") throw srvErr("Status pesanan tidak sesuai"); patch = {status:"diantar", pickedAt:now, updatedAt:now}; }
      else if(act === "release"){ if(o.status !== "driver_ke_toko") throw srvErr("Pesanan sudah diambil dari toko"); patch = {status:"mencari_driver", searchAt:now, updatedAt:now, driver:null, driverId:null, driverLoc:null, declined:(o.declined || []).concat(me.id)}; }
      else if(act === "done"){
        if(o.status !== "diantar") throw srvErr("Status pesanan tidak sesuai");
        const v = Math.round(Number(data && data.ongkir));
        patch = {status:"selesai", ongkirFinal: isFinite(v) && v >= 0 ? v : (ongkirEstOf(o) || 0), doneAt:now, updatedAt:now};
        patch.drvFee = rideFee(patch.ongkirFinal);
        { const pd = payDue(o, patch.ongkirFinal), m = data && PAYM_LBL[data.method] ? data.method : "tunai"; patch.payRecv = {items:pd.items, ongkir:pd.ongkir, voucher:pd.vch, total:pd.total, method:m, at:now}; }
      } else throw srvErr("Aksi tidak valid");
    }
    await store.update("orders/" + id, patch);
    if(act === "done"){ await localChargeFee(o); if(patch.drvFee > 0) await localTx("fee_dlv_" + id, {storeId:"drv:" + me.id, kind:"fee", amount:-patch.drvFee, orderId:"dlv:" + id, note:"Potongan 3% ongkir antar " + (o.code || "") + " (" + rp(patch.ongkirFinal) + ")"}); }
    return Object.assign({}, o, patch);
  },
  async rideAct(me, o, act, data, now){
    let patch;
    if(act === "accept"){
      if(o.status !== "mencari_driver") throw srvErr("Order Jago sudah diambil driver lain");
      if(!drvFree(me.id, me)) throw srvErr("Selesaikan pesanan aktif Anda atau aktifkan status online");
      if(!drvCanRide(me.id, o)) throw srvErr("Saldo driver di bawah minimum. Isi saldo atau hubungi JAGA agar bisa menerima order lagi");
      if(offerDist(o, me.id, me, now) === null) throw srvErr("Pesanan ini di luar jangkauan Anda");
      patch = {status:"driver_jemput", driverId:me.id, acceptedAt:now, updatedAt:now, driver:{name:me.name, wa:me.wa, vehicle:me.vehicle || "", plate:me.plate || ""}};
      if(hasLoc(me)) patch.driverLoc = {lat:me.lat, lng:me.lng, at:now};
    } else if(act === "decline"){
      patch = {declined:(o.declined || []).concat(me.id)};
    } else {
      if(o.driverId !== me.id) throw srvErr("Bukan pesanan Anda");
      if(act === "pickup"){ if(o.status !== "driver_jemput") throw srvErr("Status pesanan tidak sesuai"); patch = {status:"dalam_perjalanan", pickedAt:now, updatedAt:now}; }
      else if(act === "release"){ if(o.status !== "driver_jemput") throw srvErr("Penumpang sudah naik"); patch = {status:"mencari_driver", searchAt:now, updatedAt:now, driver:null, driverId:null, driverLoc:null, declined:(o.declined || []).concat(me.id)}; }
      else if(act === "done"){
        if(o.status !== "dalam_perjalanan") throw srvErr("Status pesanan tidak sesuai");
        const v = Math.round(Number(data && data.ongkir)); const fare = isFinite(v) && v >= 0 ? v : (o.fareEst || 0);
        patch = {status:"selesai", fareFinal:fare, fee:rideFee(fare), doneAt:now, updatedAt:now};
      } else throw srvErr("Aksi tidak valid");
    }
    await store.update("rides/" + o.id, patch);
    if(act === "done" && patch.fee > 0) await localTx("fee_ride_" + o.id, {storeId:"drv:" + me.id, kind:"fee", amount:-patch.fee, orderId:"ride:" + o.id, note:"Komisi 3% Jago " + (o.code || "") + " (" + rp(patch.fareFinal) + ")"});
    return Object.assign({}, o, patch);
  }
};
const DRV = {
  save: d => SB ? sbStore.rpc("jt_driver_save", {p_data:d}) : localDrv.save(d),
  jobs: () => SB ? sbStore.rpc("jt_driver_jobs", {}) : localDrv.jobs(),
  act: (id, act, data) => SB ? sbStore.rpc("jt_driver_act", {p_id:id, p_act:act, p_data:data || null}) : localDrv.act(id, act, data)
};
const typing = () => { const a = document.activeElement; return !!(a && a.closest && a.closest("#app") && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)); };

const _drvHanded = new Set(), _drvAssigned = new Set();
let drvTimer = null, drvBusy = false, geoWatch = null, lastSent = {t:0, lat:0, lng:0}, audioCtx = null;
async function drvRefresh(){
  if(drvBusy) return; drvBusy = true;
  try{
    const r = await DRV.jobs() || {};
    const offers = r.offers || [];
    const fresh = offers.filter(o => !S.drv.seen.has(o.id) && o.dist == null);
    offers.forEach(o => S.drv.seen.add(o.id));
    (r.mine || []).forEach(o => { const ride = isRide(o); if(o.autoAssigned && o.status === (ride ? "driver_jemput" : "driver_ke_toko") && !o.handedAt && !_drvAssigned.has(o.id)){ _drvAssigned.add(o.id); if(!S.drv.loaded) return;
      notifyPush(ride ? "ride" : "order", o.id);
      notify(ride ? "Order Jago untukmu!" : "Pesanan antar untukmu!", "Kamu driver terdekat (" + fmtDist(o.assignDist) + "). " + (ride ? "Jemput penumpang di " + shortAddr(o.pickup && o.pickup.address) : "Ambil pesanan di " + (o.storeName || "toko")) + " sekarang.", {kind:"order", tag:"drv-assign", alarm:true, act:() => window.scrollTo({top:0, behavior:"smooth"})}); } });
    (r.mine || []).forEach(o => { if(o.handedAt && o.status === "driver_ke_toko" && !_drvHanded.has(o.id)){ _drvHanded.add(o.id); if(S.drv.loaded) notify("Kode cocok ✓", (o.storeName || "Toko") + " sudah menyerahkan pesanan " + (o.code || "") + ". Tekan “Antar pesanan”.", {kind:"order"}); } });
    S.drv.me = r.me || null; S.drv.offers = offers; S.drv.mine = r.mine || []; S.drv.wallet = r.wallet || null; S.drv.blocked = r.blocked || []; S.drv.locFresh = r.locFresh !== false; S.drv.loaded = true; S.drv.err = "";
    if(fresh.length && S.drv.me && S.drv.me.online) notify(fresh.length > 1 ? fresh.length + " order baru!" : (isRide(fresh[0]) ? "Order Jago baru!" : "Order antar baru!"), fresh.map(o => isRide(o) ? "Jago · " + shortAddr(o.pickup && o.pickup.address) : (o.storeName || "Toko") + (o.dist != null ? " · " + fmtDist(o.dist) : "")).join(" | ").slice(0, 120) + " — ambil sekarang", {kind:"order", tag:"drv-offer", alarm:true, act:() => window.scrollTo({top:0, behavior:"smooth"})});
    if(S.drv.me && S.drv.me.online) startGeo();
  }catch(e){ S.drv.loaded = true; S.drv.err = (e && e.message) || "Gagal memuat"; }
  drvBusy = false;
  const sig = JSON.stringify([S.drv.me, S.drv.offers.map(o => o.id + o.dist), S.drv.mine.map(o => o.id + o.status + (o.handedAt ? "h" : "") + (o.arrivedAt ? "a" : "") + (o.ongkirFinal || o.fareFinal || "")), S.drv.err, S.drv.wallet, (S.drv.blocked || []).map(b => b.id + b.why), S.drv.locFresh]);
  if(S.role === "driver" && sig !== S.drv.sig && !typing()){ S.drv.sig = sig; scheduleRender(); }
}
function startDriver(){
  if(drvTimer) return;
  drvRefresh();
  drvTimer = setInterval(() => {
    if(document.hidden || S.role !== "driver") return;
    drvRefresh();
    const me = S.drv.me;
    if(me && me.online && S.drv.loc && Date.now() - lastSent.t > 120000) sendLoc(S.drv.loc);
  }, 5000);
}
function sendLoc(c){ lastSent = Object.assign({t:Date.now()}, c); DRV.save({lat:c.lat, lng:c.lng}).then(drvRefresh).catch(() => {}); }
function startGeo(){
  if(geoWatch !== null) return;
  if(!navigator.geolocation){ S.drv.locErr = "HP ini tidak mendukung lokasi."; return; }
  geoWatch = navigator.geolocation.watchPosition(p => {
    const c = {lat:+p.coords.latitude.toFixed(6), lng:+p.coords.longitude.toFixed(6)};
    const first = !S.drv.loc; S.drv.loc = c; S.drv.locErr = "";
    const moved = lastSent.t ? distM(lastSent, c) : 1e9;
    const busy = (S.drv.mine || []).some(o => DRV_BUSY.includes(o.status));
    if(Date.now() - lastSent.t > (busy ? 6000 : 60000) || moved > (busy ? 10 : 40)) sendLoc(c);
    if(first && S.role === "driver" && !typing()) scheduleRender();
  }, err => {
    S.drv.locErr = err.code === 1 ? "Izin lokasi ditolak. Aktifkan lokasi untuk JAGA di pengaturan browser agar bisa menerima order terdekat." : "Lokasi belum ditemukan. Pastikan GPS menyala.";
    if(err.code === 1){ navigator.geolocation.clearWatch(geoWatch); geoWatch = null; }
    if(S.role === "driver" && !typing()) scheduleRender();
  }, {enableHighAccuracy:true, maximumAge:15000, timeout:30000});
}
function stopGeo(){ if(geoWatch !== null && navigator.geolocation){ navigator.geolocation.clearWatch(geoWatch); } geoWatch = null; }
/* ============ Notifikasi melayang 10 detik + nada keras (semua perangkat) ============ */
const NOTIF_MS = 10000, ALARM_MS = 45000;
let NOTIF_SOUND = (() => { try{ return localStorage.getItem("jt_sound") !== "0"; }catch(_){ return true; } })();
function audioUnlock(){
  try{ if(!audioCtx){ const AC = window.AudioContext || window.webkitAudioContext; if(AC) audioCtx = new AC(); } if(audioCtx && audioCtx.state === "suspended") audioCtx.resume(); }catch(_){}
}
["pointerdown", "keydown", "touchstart"].forEach(ev => document.addEventListener(ev, audioUnlock, {passive:true}));
function loudTone(kind){
  if(!NOTIF_SOUND) return;
  try{
    audioUnlock(); if(!audioCtx) return;
    const t0 = audioCtx.currentTime + .03;
    const comp = audioCtx.createDynamicsCompressor(); comp.threshold.value = -12; comp.ratio.value = 6; comp.connect(audioCtx.destination);
    const master = audioCtx.createGain(); master.gain.value = 1; master.connect(comp);
    const notes = kind === "order" ? [988, 1319, 1568, 1319, 1568, 2093] : kind === "chat" ? [1047, 1568, 1047, 1568] : [880, 1175, 1568, 880, 1175, 1568];
    const step = kind === "chat" ? .16 : .18;
    const reps = kind === "order" ? 2 : 1;
    for(let r = 0; r < reps; r++) notes.forEach((f, i) => {
      const t = t0 + r * (notes.length * step + .35) + i * step;
      [["triangle", 1], ["square", .35]].forEach(([type, lv]) => {
        const o = audioCtx.createOscillator(), g = audioCtx.createGain();
        o.type = type; o.frequency.value = f; o.connect(g); g.connect(master);
        g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.9 * lv, t + .015); g.gain.exponentialRampToValueAtTime(.0001, t + step * .95);
        o.start(t); o.stop(t + step);
      });
    });
  }catch(_){}
  try{ navigator.vibrate && navigator.vibrate(kind === "order" ? [400, 150, 400, 150, 600] : [300, 120, 300]); }catch(_){}
}
function ding(){ loudTone("order"); }
const NOTIF_IC = {order:"bell", chat:"bell", money:"money", ride:"scooter", info:"bell", done:"check"};
let notifSeq = 0; const notifActs = {};
function notify(title, body, o){
  o = o || {};
  const kind = o.kind || "info", id = "n" + (++notifSeq);
  loudTone(kind === "money" || kind === "done" ? "info" : kind);
  if(o.act) notifActs[id] = o.act;
  // aplikasi terbuka tapi di belakang: tampilkan juga notifikasi sistem (jika diizinkan)
  if(document.hidden && "Notification" in window && Notification.permission === "granted" && navigator.serviceWorker){
    navigator.serviceWorker.ready.then(reg => reg.showNotification(title, {body:body || "", icon:"icons/icon-192.png", badge:"icons/icon-192.png", tag:o.tag || id, renotify:true, vibrate:[400, 150, 400, 150, 600], data:{url:location.href}})).catch(() => {});
  }
  const box = document.getElementById("notifs"); if(!box) return;
  while(box.children.length >= 3) box.firstElementChild.remove();
  box.insertAdjacentHTML("beforeend", '<div class="nfy k-'+esc(kind)+'" id="'+id+'" role="alert" data-act="nfy-open" data-id="'+id+'">'+E(NOTIF_IC[kind] || "bell")+
    '<div class="grow"><b>'+esc(title)+'</b>'+(body ? '<small>'+esc(body)+'</small>' : '')+'</div><button class="nfx" data-act="nfy-close" data-id="'+id+'" aria-label="Tutup">×</button><i class="nbar" style="animation-duration:'+(o.alarm ? ALARM_MS : NOTIF_MS)+'ms"></i></div>');
  if(o.alarm){ // order masuk: nada diulang sampai disentuh (maks. 45 detik)
    document.getElementById(id).classList.add("alarm");
    try{ navigator.vibrate && navigator.vibrate([500, 200, 500, 200, 800]); }catch(_){}
    const iv = setInterval(() => { if(!document.getElementById(id)){ clearInterval(iv); return; } loudTone(kind); try{ navigator.vibrate && navigator.vibrate([400, 150, 400]); }catch(_){} }, 3500);
    setTimeout(() => clearInterval(iv), ALARM_MS);
  }
  setTimeout(() => notifClose(id), o.alarm ? ALARM_MS : NOTIF_MS);
}
function notifClose(id){ const el = document.getElementById(id); if(!el) return; el.classList.add("out"); setTimeout(() => { el.remove(); delete notifActs[id]; }, 260); }
document.addEventListener("click", e => {
  const x = e.target.closest('[data-act="nfy-close"]'); if(x){ e.stopPropagation(); notifClose(x.dataset.id); return; }
  const el = e.target.closest('[data-act="nfy-open"]'); if(!el) return;
  e.stopPropagation(); const f = notifActs[el.dataset.id]; notifClose(el.dataset.id); if(f) try{ f(); }catch(_){}
}, true);
// pesan dari service worker (push saat aplikasi sedang dibuka)
if(navigator.serviceWorker) navigator.serviceWorker.addEventListener("message", e => {
  const d = e.data || {}; if(d.type !== "jt-push") return;
  notify(d.title || "JAGA", d.body || "", {kind:/order|pesanan/i.test(d.title || "") ? "order" : "info", act:d.url ? () => { const am = String(d.url).match(/ambil=([\w-]+)/); if(am){ (S.drv = S.drv || {}).want = am[1]; render(); } const h = String(d.url).split("#")[1]; if(h && location.hash !== "#" + h) location.hash = h; } : null});
});
// status pesanan pembeli berubah
let _bOrdSeen = null;
const B_ST_MSG = {menunggu_konfirmasi:"Pembayaran diterima, menunggu konfirmasi toko", diproses:"Pesanan dikonfirmasi & sedang disiapkan toko", mencari_driver:"Toko sedang mencari driver", driver_ke_toko:"Driver menuju toko mengambil pesananmu", "driver_ke_toko+a":"Pesanan sudah diambil driver di toko", diantar:"Pesanan sedang diantar ke alamatmu", "diantar+a":"Paket dalam perjalanan ke alamatmu", "diantar+a+s":"Pesanan sudah sampai. Lihat foto bukti di detail pesanan", "diantar+s":"Pesanan sudah sampai", selesai:"Pesanan selesai. Terima kasih!", dibatalkan:"Pesanan dibatalkan"};
function buyerOrderNotify(){
  if(S.role === "seller" || S.role === "driver" || S.role === "owner") return;
  const mine = S.orders.filter(o => SB ? o.isMine === true : o.buyerId === ME);
  const key = o => o.status + (o.handedAt ? "+a" : "") + (o.arrivedAt ? "+s" : "");
  const cur = {}; mine.forEach(o => cur[o.id] = key(o));
  if(_bOrdSeen === null){ _bOrdSeen = cur; return; }
  mine.forEach(o => { const old = _bOrdSeen[o.id], k = key(o), msg = B_ST_MSG[k] || B_ST_MSG[o.status]; if(old && old !== k && msg) notify("Pesanan " + (o.code || "") + " · " + (o.storeName || ""), msg, {kind:o.status === "selesai" ? "done" : "order", act:() => go("order", {orderId:o.id})}); });
  _bOrdSeen = cur;
}
function soundToggle(){ NOTIF_SOUND = !NOTIF_SOUND; try{ localStorage.setItem("jt_sound", NOTIF_SOUND ? "1" : "0"); }catch(_){} if(NOTIF_SOUND) notify("Nada notifikasi aktif", "Contoh notifikasi JAGA. Tampil 10 detik dengan nada keras.", {kind:"order"}); render(); }
document.addEventListener("click", e => {
  const el = e.target.closest("[data-act]"); if(!el) return;
  if(el.dataset.act === "sound-toggle"){ soundToggle(); }
  if(el.dataset.act === "sound-test"){ audioUnlock(); notify("Tes notifikasi JAGA", "Begini notifikasi akan muncul: melayang 10 detik dengan nada keras.", {kind:"order"}); }
});
function soundRow(){
  return '<button data-act="sound-test">'+E("bell")+'<div class="grow">Nada & notifikasi<small>'+(NOTIF_SOUND ? 'Nada keras aktif · ketuk untuk tes' : 'Nada dimatikan')+'</small></div><span class="tgl'+(NOTIF_SOUND ? ' on' : '')+'" data-act="sound-toggle" role="switch" aria-checked="'+NOTIF_SOUND+'"><i></i></span></button>';
}

function getPos(){
  return new Promise((res, rej) => {
    if(!navigator.geolocation) return rej(new Error("HP ini tidak mendukung lokasi."));
    navigator.geolocation.getCurrentPosition(p => res({lat:+p.coords.latitude.toFixed(6), lng:+p.coords.longitude.toFixed(6)}),
      e => rej(new Error(e.code === 1 ? "Izin lokasi ditolak. Izinkan akses lokasi di browser." : "Lokasi tidak ditemukan. Nyalakan GPS lalu coba lagi.")),
      {enableHighAccuracy:true, timeout:20000, maximumAge:30000});
  });
}

/* ---------- tampilan bersama (pembeli & toko) ---------- */
/* kenapa order tidak muncul untuk driver ini */
function drvBlockedNote(){
  const bl = S.drv.blocked || [];
  let h = "";
  if(S.drv.locFresh === false && !S.drv.loc) h += '<div class="whynot">'+I("pin")+'<div><b>Lokasimu belum terkirim</b><small>Order toko hanya ditawarkan ke driver yang lokasinya aktif dalam 5 km. Izinkan akses lokasi di browser lalu biarkan halaman ini terbuka.</small></div></div>';
  bl.slice(0, 3).forEach(b => {
    const low = /saldo/i.test(b.why);
    h += '<div class="whynot'+(low ? ' low' : '')+'">'+(low ? E("money") : I("megaphone"))+'<div><b>'+(low ? 'Ada order, tapi saldomu kurang' : 'Ada order yang tidak bisa kamu ambil')+'</b>'+
      '<small>'+esc((b.code ? b.code + ' · ' : '') + b.storeName)+' — '+esc(low ? 'Saldomu di bawah minimum ' + rp((S.drv.wallet || {}).minBalance || 0) + '. Isi saldo agar order bisa kamu ambil.' : b.why + '. Pesanan ini ditawarkan ke driver lain.')+'</small>'+
      (low ? '<button class="btn sm" data-act="drv-wallet">Isi saldo</button>' : '')+'</div></div>';
  });
  return h;
}
/* jumlah driver yang bisa menerima di sekitar toko (diperbarui tiap 15 detik) */
const NEAR = {};
function nearInfo(o){
  if(!o || !o.id) return null;
  const c = NEAR[o.id];
  if(SB && (!c || (!c.busy && Date.now() - c.at > 15000))){
    NEAR[o.id] = Object.assign({}, c || {at:0}, {busy:true});
    sbStore.rpc("jt_search_near", {p_order:o.id}).then(r => { NEAR[o.id] = Object.assign({}, r || {}, {at:Date.now(), ok:!!r}); render(); })
      .catch(() => { NEAR[o.id] = {at:Date.now()}; });
  }
  return c && c.ok ? c : null;
}
function nearLine(o, compact){
  const n = nearInfo(o); if(!n) return "";
  const ride = isRide(o), where = ride ? 'titik jemput Anda' : 'toko';
  if(n.near > 0) return '<small class="nearok">'+I("checkc")+' '+n.near+' driver online siap di sekitar '+where+(ride ? ' · yang terdekat langsung ditugaskan' : '')+'</small>';
  const why = [];
  if(n.lowbal > 0) why.push(n.lowbal+' driver di dekat '+where+' saldonya kurang');
  if(n.noloc > 0) why.push(n.noloc+' driver online belum mengaktifkan lokasi');
  return '<small class="warnline">Belum ada driver online dalam 5 km dari '+where+(compact && why.length ? ' ('+esc(why.join(', '))+')' : '')+'. '+
    (isRide(o) ? 'Coba lagi sebentar.' : compact ? 'Anda bisa menunggu atau tekan “Antar sendiri”.' : 'Toko bisa mengantar sendiri bila driver belum ada.')+'</small>';
}
function searchBox(o, text, compact){
  const el = searchElapsed(o), r = radiusM(el);
  const long = el >= 210;
  return '<div class="searchbox'+(compact?' compact':'')+'"><div class="radar"><span></span><span></span>'+E("scooter")+'</div><div><b>'+esc(text)+'</b>'+
    '<small>'+(isRide(o) ? (hasLoc(o.pickup) ? 'Dari titik jemput Anda · driver terdekat (sampai 5 km) langsung ditugaskan otomatis' : 'Ditawarkan ke semua driver yang sedang online') : hasLoc(o.storeLoc) ? 'Dari lokasi toko · driver terdekat (sampai 5 km) langsung ditugaskan otomatis' : 'Ditawarkan ke semua driver yang sedang online')+'</small>'+
    (nearLine(o, compact) || '')+
    (long && !(nearInfo(o) && nearInfo(o).near === 0) ? '<small class="warnline">Belum ada driver yang mengambil. '+(isRide(o) ? 'Ketuk “Cari ulang” atau coba lagi sebentar.' : compact ? 'Anda bisa cari ulang atau antar sendiri.' : 'Toko akan mencari ulang atau mengantar sendiri.')+'</small>' : '')+'</div></div>';
}
function driverBox(o, text, compact){
  const d = o.driver || {};
  let near = "";
  if(hasLoc(o.driverLoc)){
    const target = o.status === "driver_ke_toko" ? o.storeLoc : (hasLoc(o.buyer) ? o.buyer : null);
    if(hasLoc(target)) near = fmtDist(distM(o.driverLoc, target)) + (o.status === "driver_ke_toko" ? " dari toko" : " dari lokasi Anda");
  }
  return '<div class="drvbox"><div class="drv-av">'+E("scooter")+'</div><div class="grow"><small>'+esc(text)+'</small><b>'+esc(d.name || "Driver")+' '+driverStars(o.driverId)+'</b>'+
    '<div class="small muted">'+esc([d.vehicle, d.plate].filter(Boolean).join(" · "))+(near ? ' · <b class="near">'+near+'</b>' : '')+'</div></div>'+
    chatBtn(o, compact ? "toko" : "pembeli", "Chat")+'</div>'+proofBtn(o);
}
function buyerDue(o){
  const est = ongkirEstOf(o), d = payDue(o, est || 0);
  return '<div class="buydue">'+E("money")+'<div class="grow"><small>Siapkan pembayaran ke driver</small><b>'+(est == null && !d.items ? 'Ongkir sesuai kesepakatan' : (est == null ? rp(d.items) + ' + ongkir' : '±' + rp(d.total)))+'</b><small>'+(d.items ? 'Pesanan ' + rp(d.items) + ' + ' : 'Pesanan sudah lunas · ')+'ongkir '+(est == null ? 'disepakati' : '±' + rp(est))+(d.vch ? ' − saldo JAGA ' + rp(d.vch) : '')+'. Driver akan mengonfirmasi jumlah yang Anda bayar.</small></div></div>';
}
function ongkirNego(o){
  const est = ongkirEstOf(o), cod = o.pay && o.pay.k === "cod";
  const dist = ongkirDistOf(o);
  return '<div class="ongkirbox big">'+E("money")+'<div><small>Biaya antar ('+(dist!=null?'jarak ±'+kmTxt(dist)+' · ':'')+ONGKIR_LBL+')</small><b>'+(est==null?'Dihitung driver':rp(est))+'</b>'+
    '<small>Bayar langsung ke driver. Harga antar <b>bisa dinego</b> dengan driver saat pesanan tiba.</small>'+
    (cod ? '<small class="codline">COD: siapkan '+rp(o.total)+' (barang) + ongkir yang disepakati'+(o.voucher > 0 ? ' − potongan '+rp(o.voucher) : '')+'.</small>' : '')+'</div></div>'+voucherNote(o, "buyer");
}

/* ---------- portal driver ---------- */
function driverForm(me){
  me = me || {};
  return '<form class="card pad dform" id="drvForm">'+
    '<label class="f">Nama lengkap *</label><input class="in" name="name" required value="'+esc(me.name||"")+'">'+
    '<label class="f">No. WhatsApp *</label><input class="in" name="wa" required inputmode="tel" placeholder="08xxxxxxxxxx" value="'+esc(me.wa||"")+'">'+
    '<div class="cols2"><div><label class="f">Kendaraan</label><select class="in" name="vehicle">'+["Motor","Mobil","Sepeda"].map(v=>'<option '+(me.vehicle===v?"selected":"")+'>'+v+'</option>').join("")+'</select></div>'+
    '<div><label class="f">Plat nomor *</label><input class="in" name="plate" required placeholder="BM 1234 XX" value="'+esc(me.plate||"")+'"></div></div>'+
    '<label class="f">Alamat rumah *</label><input class="in" name="address" required placeholder="Jalan, desa/kelurahan, kecamatan" value="'+esc(me.address||"")+'">'+
    '<label class="f">Area narik</label><input class="in" name="area" placeholder="Contoh: Ujungbatu" value="'+esc(me.area||"Ujungbatu")+'">'+
    '<label class="f">'+(me.name ? "Password baru (kosongkan bila tidak diganti)" : "Buat password *")+'</label><div class="pwrap"><input class="in" type="password" name="pass" autocomplete="new-password" minlength="4" '+(me.name ? "" : "required")+' placeholder="Minimal 4 karakter"><button type="button" class="pw-eye" data-act="pw-toggle" aria-label="Lihat password">'+I("eye")+'</button></div><div class="hint">Dipakai untuk masuk lagi dari HP lain: nama + plat nomor + password.</div>'+
    (me.name ? '' : '<label class="check" style="margin-top:12px"><input type="checkbox" name="agree"> Saya setuju dengan <a data-act="rules" style="color:#2f6bff;font-weight:700">Aturan JAGA</a> (1 nomor WA & 1 plat = 1 akun driver)</label>')+
    '<button class="btn block press" style="margin-top:16px">'+(me.name ? "Simpan perubahan" : "Daftar & mulai narik")+'</button>'+
    (me.name ? '<div class="hint">Ganti nomor WA atau plat nomor perlu verifikasi ulang tim JAGA.</div><button type="button" class="btn ghost block" style="margin-top:8px" data-act="drv-edit">Batal</button><button type="button" class="btn ghost block" style="margin-top:8px" data-act="drv-logout">Keluar dari akun driver di HP ini</button><div class="delcard" style="margin-top:18px"><p class="small muted" style="margin:0 0 8px">Ingin berhenti? Akun bisa dihapus setelah tidak ada order berjalan dan bagi hasil lunas.</p><button type="button" class="btn danger block" data-act="acc-del" data-role="driver">Hapus akun driver</button></div>' : '<div class="hint" style="text-align:center">Akun driver tersimpan di HP ini.</div>')+
  '</form>';
}
function drvJob(o, offer){
  if(isRide(o)) return rideJob(o, offer);
  const cod = o.pay && o.pay.k === "cod";
  let est = ongkirEstOf(o), estNote = ongkirDistOf(o) != null ? "jarak toko–pembeli ±" + kmTxt(ongkirDistOf(o)) : "";
  if(est == null && !offer && o.status === "diantar" && locOk(o.storeLoc) && S.drv.loc){ const dd = distM(o.storeLoc, S.drv.loc); est = ongkirByDist(dd); estNote = "dari jarak toko ke posisimu sekarang (±" + kmTxt(dd) + ")"; }
  const items = o.items.map(i => i.qty+'× '+esc(i.name)).join(", ");
  let h = '<div class="card djob'+(offer?' offer':'')+(offer && S.drv.me && (o.callDrv || []).includes(S.drv.me.id) ? ' asked' : '')+'">';
  if(offer){
    const asked = S.drv.me && (o.callDrv || []).includes(S.drv.me.id);
    h += '<div class="dj-head">'+E("bell")+'<b>'+(asked ? 'Diminta langsung oleh toko' : 'Order baru')+'</b>'+(o.dist!=null?'<span class="dist">'+fmtDist(o.dist)+' ke toko</span>':'')+'</div>';
  } else {
    h += '<div class="dj-head">'+statusTag(o.status)+'<span class="small muted">'+esc(o.code)+'</span></div>';
    if(o.autoAssigned && o.status === "driver_ke_toko" && !o.handedAt) h += '<div class="small" style="margin:6px 0;color:#2f6bff;font-weight:700">'+I("checkc")+' Ditugaskan otomatis — kamu driver terdekat'+(o.assignDist != null ? ' ('+fmtDist(o.assignDist)+' dari toko)' : '')+'. Tidak bisa? Tekan “Batal ambil”, pesanan langsung pindah ke driver terdekat berikutnya.</div>';
  }
  h += '<div class="dj-route">'+
    '<div class="pt a"><i></i><div><small>Ambil di toko</small><b>'+esc(o.storeName)+'</b><span>'+esc(o.storeAddress || "")+'</span>'+
      (!offer && o.status==="driver_ke_toko" ? '<div class="dj-links"><a class="navbtn" target="_blank" rel="noopener" href="'+esc(navLink(o.storeLoc, (o.storeAddress||"")+" "+(o.storeName||"")))+'">'+I("pin")+' Google Maps</a><button type="button" class="navin" data-act="nav-in" data-id="'+esc(o.id)+'">'+I("send")+' Navigasi live ke toko</button>'+'</div>' : '')+
    '</div></div>'+
    '<div class="pt b"><i></i><div><small>Antar ke</small><b>'+esc(offer ? (o.buyer.address||"").split(",")[0] : o.buyer.name)+'</b><span>'+esc(o.buyer.address||"")+'</span>'+
      (!offer && o.status==="diantar" ? '<div class="dj-links"><a class="navbtn" target="_blank" rel="noopener" href="'+esc(hasLoc(o.buyer) ? navLink(o.buyer) : (o.buyer.maps || navLink(null, o.buyer.address)))+'">'+I("pin")+' Google Maps</a><button type="button" class="navin" data-act="nav-in" data-id="'+esc(o.id)+'">'+I("send")+' Navigasi live ke pembeli</button>'+'</div>' : '')+
      (o.buyer.note ? '<span class="note">'+I("note")+' '+esc(o.buyer.note)+'</span>' : '')+
    '</div></div></div>';
  h += '<div class="small" style="margin:8px 0 2px">'+items+'</div>' + voucherNote(o, "driver");
  h += '<div class="dj-money"><div><small>Belanja</small><b>'+rp(o.total)+'</b></div><div><small>Ongkir'+(ongkirDistOf(o)!=null?' · '+kmTxt(ongkirDistOf(o)):'')+'</small><b>'+(est==null?ONGKIR_LBL:'±'+rp(est))+'</b></div><div><small>Bayar barang</small><b>'+(cod?"COD":"Lunas ke toko")+'</b></div></div>';
  if(offer){
    h += '<div class="actions"><button class="btn press grow" data-act="drv-accept" data-id="'+esc(o.id)+'">Ambil pesanan</button><button class="btn ghost press" data-act="drv-decline" data-id="'+esc(o.id)+'">Lewati</button></div>';
  } else if(o.status === "driver_ke_toko"){
    if(cod && !o.managed) h += '<div class="hint">COD: atur pembayaran barang '+rp(o.total)+' dengan toko (talangi dulu atau setor setelah diantar).</div>';
    h += '<div class="actions">'+chatBtn(o, "driver", "Chat toko & pembeli", "ghost")+'<button class="btn ghost sm" data-act="report" data-k="order" data-id="'+esc(o.id)+'">Lapor masalah</button></div>';
    if(o.managed){
      const its = (o.items || []).map(it => '<li><span>'+esc(it.qty+"× "+it.name)+'</span><b>'+rp((it.price||0)*(it.qty||1))+'</b></li>').join("");
      h += '<div class="mbuy"><div class="mbuy-h">'+I("cart")+'<b>Beli pesanan ini di toko</b></div><ul>'+its+'</ul><div class="mbuy-t"><span>Bayar ke toko</span><b>'+rp(o.subtotal || o.total || 0)+'</b></div>'+
        '<small>Toko kelolaan JAGA: bayar pakai QRIS toko atau uangmu sendiri. Pembeli mengganti <b>'+rp(o.total || 0)+' + ongkir</b> saat pesanan sampai.</small></div>';
      h += '<div class="actions"><button class="btn press grow" data-act="drv-mpick" data-id="'+esc(o.id)+'">'+I("camera")+' Sudah beli & ambil</button><button class="btn ghost sm" data-act="drv-release" data-id="'+esc(o.id)+'">Batal ambil</button></div>';
    } else if(o.pickCode && !o.handedAt){
      h += '<div class="pickcode"><small>Kode ambil pesanan</small><b>'+esc(o.pickCode.split("").join(" "))+'</b><span>Tunjukkan kode ini ke toko. Toko memasukkan kode untuk mencocokkan, lalu pesanan diserahkan kepadamu.</span></div>';
      h += '<div class="actions"><button class="btn grow" disabled>'+I("clock")+' Menunggu toko cek kode</button><button class="btn ghost sm" data-act="drv-release" data-id="'+esc(o.id)+'">Batal ambil</button></div>';
    } else if(o.pickCode){
      h += '<div class="pickok">'+I("checkc")+'<div><b>Kode cocok. Pesanan sudah kamu pegang</b><small>Pembeli sudah diberi tahu pesanan diambil dari toko.</small></div></div>';
      h += '<div class="actions"><button class="btn press grow" data-act="drv-pickup" data-id="'+esc(o.id)+'">'+I("send")+' Antar pesanan</button></div>';
    } else {
      h += '<div class="actions"><button class="btn press grow" data-act="drv-pickup" data-id="'+esc(o.id)+'">'+I("package")+' Sudah ambil di toko</button><button class="btn ghost sm" data-act="drv-release" data-id="'+esc(o.id)+'">Batal ambil</button></div>';
    }
  } else if(o.status === "diantar" && (o.pickCode || o.managed) && !o.arrivedAt){
    const v = S.drv.draft[o.id] != null ? S.drv.draft[o.id] : (est == null ? "" : est);
    h += payPanel(o, v, est, estNote) + '<div class="actions">'+chatBtn(o, "driver", "Chat pembeli & toko", "ghost")+'</div>';
  } else if(o.status === "diantar"){
    const v = S.drv.draft[o.id] != null ? S.drv.draft[o.id] : (est == null ? "" : est);
    h += payPanel(o, v, est, estNote) + '<div class="actions">'+chatBtn(o, "driver", "Chat pembeli & toko", "ghost")+'</div>';
  } else if(o.status === "selesai"){
    h += o.payRecv ? payRecvLine(o) : '<div class="small" style="margin-top:6px">Ongkir diterima: <b>'+rp(o.ongkirFinal || 0)+'</b> · '+fmtDate(o.doneAt || o.updatedAt)+'</div>';
  }
  return h + '</div>';
}

/* ---------- driver terima pembayaran dari pembeli: harga pesanan + ongkir ---------- */
const PAYM = [["tunai","Tunai"],["transfer","Transfer"],["qris","QRIS"]];
const PAYM_LBL = {tunai:"Tunai", transfer:"Transfer", qris:"QRIS"};
function payDue(o, ongkir){
  const items = (o.pay && o.pay.k === "cod") || o.managed ? (o.total || 0) : 0;
  const vch = o.voucher > 0 ? o.voucher : 0, og = Math.max(0, Math.round(Number(ongkir) || 0));
  return {items, ongkir:og, vch, total:Math.max(0, items + og - vch)};
}
function payPanel(o, v, est, estNote){
  const id = o.id, d = payDue(o, v), m = (S.drv.paym || {})[id] || "tunai", ready = !(o.pickCode || o.managed) || o.arrivedAt;
  return '<div class="paycol"><div class="pc-h">'+E("money")+'<b>'+(ready ? 'Terima pembayaran dari pembeli' : 'Rincian tagihan ke pembeli')+'</b></div>'+
    '<div class="pc-row"><span>Harga pesanan<small>'+(d.items ? (o.managed ? 'menu yang kamu belikan' : 'COD, bayar di tempat') : 'sudah dibayar ke toko')+'</small></span><b>'+(d.items ? rp(d.items) : '<em class="free">Lunas</em>')+'</b></div>'+
    '<div class="pc-row"><span>Ongkir driver<small>'+(est == null ? 'tarif '+ONGKIR_LBL : 'patokan '+rp(est)+' · boleh nego')+'</small></span><div class="rpin pc-in"><span>Rp</span><input class="in" inputmode="numeric" id="ongkir-'+esc(id)+'" data-ongkir="'+esc(id)+'" value="'+esc(v)+'"></div></div>'+
    (d.vch ? '<div class="pc-row"><span>Potongan saldo JAGA<small>diganti JAGA ke saldomu</small></span><b class="free">−'+rp(d.vch)+'</b></div>' : '')+
    '<div class="pc-tot"><span>Total diterima dari pembeli</span><b id="paytot-'+esc(id)+'">'+rp(d.total)+'</b></div>'+
    (ready ? '<div class="pc-mlbl">Dibayar dengan</div><div class="pc-m">'+PAYM.map(x => '<button type="button" data-act="drv-paym" data-id="'+esc(id)+'" data-v="'+x[0]+'" aria-pressed="'+(m === x[0])+'">'+x[1]+'</button>').join("")+'</div>' : '')+
    '<div class="hint">'+(ready ? 'Hitung uang bersama pembeli. Setelah dikonfirmasi, rincian pembayaran tampil di aplikasi pembeli.' : 'Sampai di alamat pembeli? Foto pesanan saat diserahkan, lalu konfirmasi pembayaran.')+(estNote && est != null ? ' <span class="muted">('+esc(estNote)+')</span>' : '')+'</div>'+
    (ready ? '<button class="btn press block pc-ok" data-act="drv-done" data-id="'+esc(id)+'" id="payok-'+esc(id)+'">'+I("checkc")+' Konfirmasi terima '+rp(d.total)+'</button>'
      : '<button class="btn press block pc-ok" data-act="drv-arrive" data-id="'+esc(id)+'">'+I("camera")+' Pesanan sudah sampai</button>')+'</div>';
}
function payRecvLine(o, buyer){
  const p = o.payRecv || {};
  return '<div class="payrecv">'+I("checkc")+'<div class="grow"><b>'+(buyer ? 'Dibayar ke driver ' : 'Pembayaran diterima ')+rp(p.total || 0)+'</b><small>'+
    (p.items ? 'Pesanan '+rp(p.items)+' + ' : '')+'ongkir '+rp(p.ongkir || 0)+(p.voucher ? ' − saldo JAGA '+rp(p.voucher) : '')+' · '+esc(PAYM_LBL[p.method] || "Tunai")+(p.at ? ' · '+fmtDate(p.at) : '')+'</small></div></div>';
}
document.addEventListener("input", e => {
  const id = e.target.dataset && e.target.dataset.ongkir; if(!id) return;
  const o = ((S.drv && S.drv.mine) || []).find(x => x.id === id); if(!o || isRide(o)) return;
  const d = payDue(o, e.target.value), t = document.getElementById("paytot-" + id), b = document.getElementById("payok-" + id);
  if(t) t.textContent = rp(d.total);
  if(b) b.innerHTML = I("checkc") + " Konfirmasi terima " + rp(d.total);
});
function appDriver(){
  let h = '<div class="dtop">'+JMARK()+'<div class="grow"><b>JAGA</b><small>Portal Driver</small></div>'+
    (S.drv.me && S.drv.me.id ? '<button class="ibtn sup-btn" data-act="sup-open" data-v="drv:'+esc(S.drv.me.id)+'" aria-label="Tanya tim JAGA">'+I("chat")+supBadge("drv:"+S.drv.me.id)+'</button>' : '<a class="ibtn" target="_blank" rel="noopener" href="'+esc(waLink(CONTACT.wa, "Halo JAGA, saya driver butuh bantuan."))+'" aria-label="Bantuan">'+I("chat")+'</a>')+'</div>'+
    PREVIEW_BANNER().replace("Toko & pesanan", "Akun driver & pesanan")+(S.mode === "local" ? '<div class="notice">Mode demo: data hanya tersimpan di perangkat ini.</div>' : '');
  if(!S.drv.loaded) return h + '<div class="empty">'+I("loader")+' Memuat…</div>';
  if(S.drv.err && S.drv.me === undefined) return h + '<div class="notice">'+esc(S.drv.err)+'</div>';
  const me = S.drv.me;
  if(!me){
    return h + '<section class="dhero">'+COURIER_SVG+'<h1>Jadi Driver JAGA</h1><p>Antar pesanan dari toko & penumpang Jago di sekitarmu.</p></section>'+
      drvPerks()+drvLoginCard() + '<h2 class="sec" style="margin:18px 16px 0">Belum punya akun? Daftar</h2>' + driverForm(null);
  }
  if(S.drv.editing) return h + '<h2 class="sec" style="margin:8px 16px">Ubah data driver</h2>' + driverForm(me);
  if(S.drv.walletOpen) return h + drvWallet();
  if(me.id && (S.sup.unread||{})["drv:"+me.id]) h += '<button class="supnote" data-act="sup-open" data-v="drv:'+esc(me.id)+'">'+I("chat")+'<div class="grow"><b>Ada pesan baru dari tim JAGA</b><small>Ketuk untuk membaca dan membalas</small></div><em>'+S.sup.unread["drv:"+me.id]+'</em></button>';
  if(me.suspended) h += '<div class="card pad vrfy"><div><b>Akun driver dinonaktifkan</b><p class="small muted" style="margin:6px 0 10px">Tim JAGA menonaktifkan akunmu sementara'+(me.suspendNote?': '+esc(me.suspendNote):'.')+' Kamu tidak bisa ONLINE sampai akun diaktifkan lagi.</p><button class="btn sm" data-act="sup-open" data-v="drv:'+esc(me.id)+'">'+I("chat")+' Tanya tim JAGA</button></div></div>';
  if(me.verify && me.verify !== "verified") return h + drvVerifyView(me);
  const mine = S.drv.mine || [];
  const today = new Date().toDateString();
  const doneToday = mine.filter(o => o.status === "selesai" && new Date(o.doneAt || o.updatedAt || 0).toDateString() === today);
  const active = mine.filter(o => DRV_BUSY.includes(o.status));
  const hist = mine.filter(o => ["selesai","dibatalkan"].includes(o.status)).slice(0, 10);
  h += '<div class="card dme"><div class="drv-av big">'+esc(initials(me.name))+'</div><div class="grow"><b>'+esc(me.name)+'</b><small>'+esc([me.vehicle, me.plate, me.area].filter(Boolean).join(" · "))+'</small>'+
    '<button class="linkbtn" data-act="drv-edit">Ubah data</button></div>'+
    '<button class="onsw press '+(me.online?"on":"")+'" data-act="drv-online" aria-pressed="'+(me.online?"true":"false")+'"><i></i><span>'+(me.online?"ONLINE":"OFFLINE")+'</span></button></div>';
  h += portalInstallCard("driver");
  h += '<div class="plist sndcard" style="margin:0 16px 14px">'+soundRow()+'</div>';
  if(me.online){
    h += S.drv.locErr ? '<div class="notice warnbox">'+I("pin")+' '+esc(S.drv.locErr)+'</div>'
      : '<div class="locline">'+I("pin")+(S.drv.loc ? ' Lokasi aktif — kamu terlihat oleh pesanan di sekitar' : ' Mencari lokasi GPS…')+'</div>';
  }
  h += pushCard("driver", "Order baru tetap masuk walau aplikasi ditutup atau HP terkunci.");
  h += drvWalletChip();
  h += '<div class="dstats"><div><small>Pendapatan hari ini</small><b>'+rp(doneToday.reduce((a, o) => a + (o.ongkirFinal || o.fareFinal || 0), 0))+'</b></div><div><small>Trip hari ini</small><b>'+doneToday.length+'</b></div><div><small>Total selesai</small><b>'+(S.drvStats && S.drvStats.trips != null ? S.drvStats.trips : mine.filter(o => o.status === "selesai").length)+'</b></div></div>';
  if(active.length){
    h += '<h2 class="dsec">Pesanan aktif</h2>' + active.map(o => drvJob(o, false)).join("");
  } else if(me.online){
    const offers = (S.drv.offers || []).slice().sort((x, y) => (y.id === S.drv.want) - (x.id === S.drv.want) || ((y.callDrv || []).includes(me.id)) - ((x.callDrv || []).includes(me.id)));
    h += drvWantCard(me);
    h += '<h2 class="dsec">Order masuk'+(offers.length?' <span class="cnt">'+offers.length+'</span>':'')+'</h2>';
    h += drvBlockedNote();
    h += offers.length ? offers.map(o => drvJob(o, true)).join("")
      : '<div class="dwait">'+COURIER_SVG+'<b>Menunggu order…</b><small>Order dari toko & penumpang Jago terdekat akan muncul di sini otomatis. Biarkan halaman ini terbuka.</small></div>';
  } else {
    h += drvWantCard(me);
    h += '<div class="dwait off">'+E("scooter")+'<b>Kamu sedang offline</b><small>Nyalakan ONLINE untuk mulai menerima order dari toko di sekitarmu.</small></div>';
  }
  h += drvAchieve();
  if(hist.length) h += '<h2 class="dsec">Riwayat</h2><div class="card dhist">'+hist.map(o => '<div class="row"><span><b>'+esc(isRide(o) ? 'Jago · '+(shortAddr(o.dest && o.dest.address) || 'perjalanan') : o.storeName)+'</b><small>'+esc(o.code)+' · '+fmtDate(o.doneAt || o.updatedAt)+'</small></span><span>'+(o.status === "selesai" ? '<b>'+rp(o.ongkirFinal || o.fareFinal || 0)+'</b>' : statusTag(o.status))+'</span></div>').join("")+'</div>';
  h += '<div class="small muted" style="text-align:center;margin:18px 0 30px">Akun driver tersimpan di HP ini · <button class="linkbtn" style="display:inline" data-act="leave-driver">Buka aplikasi belanja</button></div>';
  return h;
}

/* ---------- aksi ---------- */
async function drvDo(fn, ok){
  try{ await fn(); if(ok) toast(ok); }
  catch(e){ toast(((e && e.message) || "Gagal, coba lagi").replace(/^.*?:\s*/, "").slice(0, 140)); }
  S.drv.sig = ""; await drvRefresh(); render();
}
document.addEventListener("click", async e => {
  const el = e.target.closest("[data-act]"); if(!el) return;
  const a = el.dataset.act, id = el.dataset.id;
  if(a === "open-driver"){ location.hash = "driver"; return; }
  if(a === "open-seller"){ location.hash = "mitra"; return; }
  if(a === "leave-driver"){ location.hash = ""; return; }
  if(a === "drv-edit"){ S.drv.editing = !S.drv.editing; render(); return; }
  if(a === "drv-online"){
    const me = S.drv.me; if(!me) return;
    if(me.verify && me.verify !== "verified") return toast("Akun driver belum diverifikasi tim JAGA.");
    if(me.suspended && !me.online) return toast("Akun driver dinonaktifkan tim JAGA. Tanya lewat tombol pesan.");
    try{ if(!audioCtx){ const AC = window.AudioContext || window.webkitAudioContext; if(AC) audioCtx = new AC(); } else if(audioCtx.state === "suspended") audioCtx.resume(); }catch(_){}
    const on = !me.online; el.disabled = true;
    if(on){
      let c = null;
      try{ c = await getPos(); S.drv.loc = c; S.drv.locErr = ""; }catch(err){ S.drv.locErr = err.message; }
      await drvDo(() => DRV.save(Object.assign({online:true}, c || {})), "Kamu ONLINE — menunggu order");
      if(c) lastSent = Object.assign({t:Date.now()}, c);
      startGeo();
    } else { stopGeo(); await drvDo(() => DRV.save({online:false}), "Kamu OFFLINE"); }
    return;
  }
  const rj = (S.drv.offers || []).concat(S.drv.mine || []).find(o => o.id === id); const ride = isRide(rj);
  if(a === "drv-accept"){ el.disabled = true; await drvDo(() => DRV.act(id, "accept", ride ? null : {flow:"2"}), ride ? "Order Jago diambil! Segera jemput penumpang." : "Pesanan diambil! Segera menuju toko."); return; }
  if(a === "drv-decline"){ await drvDo(() => DRV.act(id, "decline")); return; }
  if(a === "drv-mpick"){
    proofConfirm("Sudah membeli dan memegang pesanan? Foto struk atau pesanannya sebagai bukti.", "Ya, antar sekarang", ph => drvDo(() => DRV.act(id, "pickup", {photo:ph}), "Selamat mengantar! Tagih harga menu + ongkir ke pembeli."), true); return; }
  if(a === "drv-arrive"){
    proofConfirm("Pesanan sudah sampai di alamat pembeli? Foto pesanan saat diserahkan.", "Ya, sudah sampai", ph => drvDo(() => DRV.act(id, "arrive", {photo:ph}), "Pembeli sudah diberi tahu pesanan sampai."), true); return; }
  if(a === "drv-pickup"){
    if(!ride && rj && rj.pickCode){ confirmModal("Mulai antar pesanan ke pembeli? Pembeli akan diberi tahu paket dalam perjalanan.", "Ya, antar sekarang", () => drvDo(() => DRV.act(id, "pickup"), "Selamat mengantar!")); return; }
    if(!ride && SB){ proofConfirm("Pesanan sudah diambil dari toko dan siap diantar?", "Ya, antar sekarang", ph => drvDo(() => DRV.act(id, "pickup", ph ? {photo:ph} : null), "Selamat mengantar!")); return; }
    confirmModal(ride ? "Penumpang sudah naik dan siap berangkat?" : "Pesanan sudah diambil dari toko dan siap diantar?", ride ? "Ya, berangkat" : "Ya, antar sekarang", () => drvDo(() => DRV.act(id, "pickup"), ride ? "Selamat jalan, hati-hati di jalan!" : "Selamat mengantar!")); return; }
  if(a === "drv-release"){ confirmModal(ride ? "Batal mengambil order Jago ini? Order langsung dipindah ke driver terdekat berikutnya." : "Batal mengambil pesanan ini? Pesanan langsung dipindah ke driver terdekat berikutnya.", "Batal ambil", () => drvDo(() => DRV.act(id, "release"), "Pesanan dilepas")); return; }
  if(a === "drv-paym"){ (S.drv.paym = S.drv.paym || {})[id] = el.dataset.v; document.querySelectorAll('[data-act="drv-paym"][data-id="'+id+'"]').forEach(b => b.setAttribute("aria-pressed", String(b.dataset.v === el.dataset.v))); return; }
  if(a === "drv-done"){
    const inp = document.getElementById("ongkir-" + id);
    const v = parseInt(String(inp ? inp.value : "").replace(/\D/g, ""), 10);
    if(!isFinite(v) || v < 0) return toast(ride ? "Isi tarif yang disepakati." : "Isi ongkir yang disepakati.");
    if(ride){ confirmModal("Sudah sampai tujuan dengan tarif " + rp(v) + "? Komisi 3% (" + rp(rideFee(v)) + ") dipotong dari saldo driver.", "Ya, selesai", () => drvDo(() => DRV.act(id, "done", {ongkir:v}).then(() => { delete S.drv.draft[id]; }), "Perjalanan selesai. Tarif " + rp(v) + " tercatat.")); return; }
    const m = (S.drv.paym || {})[id] || "tunai", d = payDue(rj || {}, v);
    const msg = "Konfirmasi pembayaran dari pembeli: " + (d.items ? "pesanan " + rp(d.items) + " + " : "") + "ongkir " + rp(v) + (d.vch ? " − saldo JAGA " + rp(d.vch) : "") + " = " + rp(d.total) + " (" + PAYM_LBL[m] + "). Uang sudah kamu terima? Potongan 3% ongkir (" + rp(rideFee(v)) + ") dari saldo driver.";
    const fin = ph => drvDo(() => DRV.act(id, "done", Object.assign({ongkir:v, method:m, collect:d.total}, ph ? {photo:ph} : {})).then(() => { delete S.drv.draft[id]; }), "Pembayaran " + rp(d.total) + " tercatat. Pesanan selesai ✓");
    if(rj && rj.arrivedAt){ confirmModal(msg, "Ya, sudah diterima", () => fin("")); return; }
    (SB ? proofConfirm : (t, l, f) => confirmModal(t, l, () => f("")))(msg, "Ya, sudah diterima", fin);
    return;
  }
  if(a === "pick-verify"){
    const inp = document.getElementById("pcode-" + id); const c = String(inp ? inp.value : "").replace(/\D/g, "");
    if(c.length !== 4) return toast("Masukkan 4 angka kode dari driver.");
    el.disabled = true;
    try{
      const r = await sbStore.rpc("jt_pick_verify", {p_id:id, p_code:c});
      if(r && r.ok){ toast("Kode cocok ✓ Serahkan pesanan ke driver."); const o2 = S.orders.find(x => x.id === id); if(o2) o2.handedAt = Date.now(); render(); }
      else { el.disabled = false; if(inp){ inp.value = ""; inp.focus(); } toast("Kode tidak cocok. Sisa " + ((r && r.left) || 0) + " kali percobaan."); }
    }catch(err){ el.disabled = false; toast(String(err.message || err).replace(/^.*?:\s*/, "")); }
    return;
  }
  if(a === "self-deliver"){
    confirmModal("Antar pesanan ini sendiri tanpa driver?", "Antar sendiri", () => setStatus(id, "diantar", {selfDelivery:true}));
    return;
  }
  if(a === "buyer-loc" || a === "store-loc"){
    const f = el.closest("form"); const txt = el.querySelector("span");
    if(txt) txt.textContent = "Mengambil lokasi…";
    try{
      const c = await getPos();
      if(!inArea(c)){ if(txt) txt.textContent = "Lokasi di luar wilayah layanan"; toast((a === "store-loc" ? "Lokasi toko harus di wilayah layanan. " : "Alamat pengantaran di luar wilayah layanan. ") + AREA_MSG); return; }
      const pre = a === "buyer-loc" ? "b" : "s";
      f.querySelector('[name="'+pre+'lat"]').value = c.lat; f.querySelector('[name="'+pre+'lng"]').value = c.lng;
      if(txt) txt.textContent = "Lokasi tersimpan ✓ ("+c.lat.toFixed(5)+", "+c.lng.toFixed(5)+")";
      if(a === "buyer-loc"){ setProf(Object.assign(getProf(), c)); render(); }
      toast(a === "store-loc" ? "Lokasi toko diambil — tekan Simpan" : "Lokasi pengantaran disimpan");
    }catch(err){ if(txt) txt.textContent = "Coba lagi ambil lokasi"; toast(err.message); }
  }
});
document.addEventListener("input", e => { const id = e.target.dataset && e.target.dataset.ongkir; if(id){ e.target.value = e.target.value.replace(/\D/g, ""); S.drv.draft[id] = e.target.value; } });
document.addEventListener("submit", async e => {
  const f = e.target; if(f.id !== "drvForm") return;
  e.preventDefault();
  const fd = new FormData(f);
  const data = {name:(fd.get("name")||"").trim(), wa:(fd.get("wa")||"").trim(), vehicle:fd.get("vehicle"), plate:(fd.get("plate")||"").trim().toUpperCase(), address:(fd.get("address")||"").trim(), area:(fd.get("area")||"").trim()};
  if(!data.name) return toast("Isi nama lengkap.");
  if(!waOk(data.wa)) return toast(WA_BAD);
  if(data.plate.replace(/[^A-Za-z0-9]/g, "").length < 3 || data.address.length < 5) return toast("Isi plat nomor dan alamat rumah.");
  if(!S.drv.me && !fd.get("agree")) return toast("Centang persetujuan Aturan JAGA untuk mendaftar.");
  const btn = f.querySelector("button"); if(btn) btn.disabled = true;
  const wasNew = !S.drv.me, pass = String(fd.get("pass") || "");
  if(pass && pass.length < 4){ if(btn) btn.disabled = false; return toast("Password minimal 4 karakter."); }
  if(wasNew && SB && !pass){ if(btn) btn.disabled = false; return toast("Buat password untuk masuk lagi nanti."); }
  S.drv.editing = false;
  await drvDo(async () => { const r = await DRV.save(data); if(pass && SB){ try{ await sbStore.rpc("jt_driver_setpass", {p_pass:pass}); }catch(e){ toast("Data tersimpan, tetapi password gagal disimpan: " + ((e && e.message) || "coba lagi")); } } return r; }, wasNew ? "Pendaftaran terkirim! Tunggu persetujuan tim JAGA." : "Data disimpan");
});
/* perbarui tampilan pencarian driver di sisi pembeli & toko */
setInterval(() => {
  if(document.hidden || typing() || S.role === "driver") return;
  if(S.orders.some(o => o.status === "mencari_driver") && ["order","seller","orders"].includes(S.view)) scheduleRender();
}, 10000);


/* ============ Login toko (nama + password) ============ */
S.storeLogins = null;
async function loadStoreLogins(){
  if(!SB) return;
  try{ const { data } = await SB.rpc("jt_store_logins", {p_key: KEY}); S.storeLogins = data || {}; }catch(e){ S.storeLogins = {}; }
  if(S.role === "seller" && !typing()) scheduleRender();
}
function storeLoginCard(){
  return '<form class="card pad slogin" id="storeLogin"><div class="sl-head">'+E("store")+'<div><h2>Masuk toko</h2><small>Untuk toko yang sudah terdaftar — konfirmasi pesanan langsung di aplikasi.</small></div></div>'+
    '<label class="f">Nama toko / login</label><input class="in" name="login" autocomplete="username" autocapitalize="none" required placeholder="Contoh: wahyu">'+
    '<label class="f">Password</label><div class="pwrap"><input class="in" type="password" name="pass" autocomplete="current-password" required><button type="button" class="pw-eye" data-act="pw-toggle" aria-label="Lihat password">'+I("eye")+'</button></div>'+
    '<button class="btn block press" style="margin-top:14px">Masuk</button></form>';
}
function storeLoginSettings(s){
  if(!SB) return '';
  const cur = S.storeLogins ? S.storeLogins[s.id] : undefined;
  if(S.storeLogins === null) loadStoreLogins();
  return '<form class="card pad" id="storeSetPass" data-id="'+esc(s.id)+'" style="margin-top:16px"><h3 class="sub">'+I("store")+' Login toko</h3>'+
    '<p class="small muted" style="margin:0 0 6px">'+(cur ? 'Login saat ini: <b>'+esc(cur)+'</b>. Siapa pun yang tahu login & password ini bisa membuka dashboard toko dari HP lain.' : 'Buat nama login & password agar toko bisa dibuka dari HP lain tanpa kode akses.')+'</p>'+
    '<div class="cols2"><div><label class="f">Nama login</label><input class="in" name="login" autocapitalize="none" required value="'+esc(cur || (s.name||"").toLowerCase())+'"></div>'+
    '<div><label class="f">Password baru</label><input class="in" type="password" name="pass" autocomplete="new-password" required minlength="4"></div></div>'+
    '<div class="hint">Gunakan password yang sulit ditebak (minimal 6 karakter, campur huruf & angka).</div>'+
    '<div class="actions"><button class="btn sm">Simpan login</button><button type="button" class="btn ghost sm" data-act="store-logout" data-id="'+esc(s.id)+'">Keluar dari toko di perangkat ini</button></div></form>'+
    '<div class="card pad delcard"><h3 class="sub">Hapus akun toko</h3><p class="small muted" style="margin:0 0 10px">Toko, produk, dan login dihapus permanen. Syarat: tidak ada pesanan berjalan dan bagi hasil sudah lunas.</p><button type="button" class="btn danger sm" data-act="acc-del" data-role="store" data-id="'+esc(s.id)+'">Hapus akun toko</button></div>';
}
let _ordSeen = null, _ordSt = null;
function notifyNewOrders(){
  if(S.role !== "seller" || (SB && !S.myStoreIds)) return;
  const ids = new Set(myStores().map(s => s.id));
  const pend = S.orders.filter(o => ids.has(o.storeId) && o.status === "menunggu_konfirmasi").map(o => o.id);
  if(_ordSeen === null){ _ordSeen = new Set(pend); return; }
  const fresh = pend.filter(id => !_ordSeen.has(id));
  pend.forEach(id => _ordSeen.add(id));
  /* driver ditugaskan → toko siapkan pesanan & cocokkan kode; pesanan selesai */
  const stk = o => o.status + (o.handedAt ? "+a" : "");
  const mineS = S.orders.filter(o => ids.has(o.storeId));
  if(_ordSt === null){ _ordSt = {}; mineS.forEach(o => _ordSt[o.id] = stk(o)); }
  else mineS.forEach(o => { const k = stk(o), old = _ordSt[o.id]; _ordSt[o.id] = k; if(!old || old === k) return;
    if(k === "driver_ke_toko") notify("Driver menuju toko Anda 🛵", (o.code || "") + " · " + ((o.driver && o.driver.name) || "Driver") + ". Siapkan pesanan, lalu cocokkan kode ambil dari driver.", {kind:"order", act:() => go("seller", {sellerTab:"pesanan"})});
    else if(o.status === "selesai") notify("Pesanan selesai ✓", (o.code || "") + " sudah diterima pembeli.", {kind:"done"});
  });
  if(fresh.length){ const o0 = S.orders.find(o => o.id === fresh[0]) || {}; notify(fresh.length > 1 ? fresh.length + " pesanan baru!" : "Pesanan baru!", (o0.buyer ? o0.buyer.name + " · " : "") + (o0.items ? o0.items.map(i => i.qty + "× " + i.name).join(", ").slice(0, 90) : "") + " — segera konfirmasi", {kind:"order", tag:"store-order", alarm:true, act:() => { go("seller", {sellerTab:"pesanan"}); }}); }
}
document.addEventListener("click", async e => {
  const el = e.target.closest("[data-act]"); if(!el) return;
  if(el.dataset.act === "pw-toggle"){ const i = el.parentElement.querySelector("input"); i.type = i.type === "password" ? "text" : "password"; return; }
  if(el.dataset.act === "store-logout"){
    const sid = el.dataset.id;
    const st = storeById(sid) || {};
    if(!SB) return toast("Keluar akun toko hanya tersedia di jagapatner.my.id/apps");
    confirmModal("Keluar dari toko “" + (st.name || "") + "” di HP ini? Untuk masuk lagi: Masuk → Toko, lalu isi nama login & password toko.", "Keluar", async () => {
      try{
        const { error } = await SB.rpc("jt_store_signout", {p_store: sid, p_key: KEY});
        if(error) throw sbErr(error);
      }catch(err){ toast(String((err && err.message) || err).replace(/^.*?:\s*/, "")); S.sellerTab = "pengaturan"; render(); return; }
      try{ localStorage.removeItem("jt_home_role"); }catch(_){}
      S.myStoreIds = null; S.sellerStoreId = null; await refreshMyStores();
      if(myStores().length){ go("seller", {sellerTab:"ringkasan"}); toast("Sudah keluar dari " + (st.name || "toko")); return; }
      S.role = "buyer"; try{ history.replaceState(null, "", location.pathname + location.search); }catch(_){ location.hash = ""; }
      go("home"); toast("Sudah keluar dari akun toko");
    });
  }
});
document.addEventListener("click", () => { try{ if(S.role === "seller" && !audioCtx){ const AC = window.AudioContext || window.webkitAudioContext; if(AC) audioCtx = new AC(); } }catch(_){} }, {once:true});
document.addEventListener("submit", async e => {
  const f = e.target;
  if(f.id === "storeLogin"){
    e.preventDefault();
    if(!SB) return toast("Login toko hanya di jagapatner.my.id/apps/#mitra — ini halaman pratinjau.");
    const fd = new FormData(f); const btn = f.querySelector("button.btn"); btn.disabled = true;
    try{
      const { data, error } = await SB.rpc("jt_store_login", {p_login: fd.get("login"), p_pass: fd.get("pass"), p_key: KEY});
      if(error) throw sbErr(error);
      if(!data || !data.ok) throw new Error((data && data.error) || "Nama toko atau password salah");
      S.myStoreIds = null; await refreshMyStores(); if(ORD_REFRESH) await ORD_REFRESH();
      S.sellerStoreId = data.storeId; go("seller", {sellerTab:"pesanan"});
      toast("Berhasil masuk. Pesanan baru tampil di sini.");
    }catch(err){ toast(String(err.message || "Gagal masuk").replace(/^.*?:\s*/, "")); btn.disabled = false; }
  }
  if(f.id === "storeSetPass"){
    e.preventDefault();
    const fd = new FormData(f); const btn = f.querySelector("button.btn"); btn.disabled = true;
    try{
      const { data, error } = await SB.rpc("jt_store_setpass", {p_store: f.dataset.id, p_login: fd.get("login"), p_pass: fd.get("pass"), p_key: KEY});
      if(error) throw sbErr(error);
      S.storeLogins = Object.assign({}, S.storeLogins, {[f.dataset.id]: data.login});
      f.querySelector('[name=pass]').value = "";
      toast("Login toko disimpan: " + data.login); render();
    }catch(err){ toast(String(err.message || "Gagal").replace(/^.*?:\s*/, "")); }
    btn.disabled = false;
  }
});

/* ============ Portal Owner (pemilik aplikasi) ============ */
S.own = {loaded:false, authed:false, data:null, tab:(function(){ try{ return localStorage.getItem("jt_own_tab") || "ringkasan"; }catch(_){ return "ringkasan"; } })(), range:"bulan", err:"", sig:""};
let ownTimer = null;
async function ownRefresh(){
  try{
    if(SB){
      const { data, error } = await SB.rpc("jt_owner_data", {p_key: KEY});
      if(error) throw sbErr(error);
      S.own.authed = !!(data && data.ok); S.own.data = S.own.authed ? data : null;
    } else {
      S.own.authed = true; S.own.data = {ok:true, now:Date.now(), stores:S.stores.map(s => Object.assign({}, s, {products:(S.products[s.id]||[]).length})), orders:S.orders.slice().sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)), drivers:S.drivers};
    }
    S.own.err = "";
  }catch(e){ S.own.err = (e && e.message) || "Gagal memuat"; }
  S.own.loaded = true;
  const sig = JSON.stringify([S.own.authed, S.own.data, S.own.err]);
  if(S.role === "owner" && sig !== S.own.sig && !typing()){ S.own.sig = sig; scheduleRender(); }
}
function startOwner(){
  if(ownTimer) return;
  ownRefresh();
  ownTimer = setInterval(() => { if(!document.hidden && S.role === "owner"){ ownRefresh(); if(["saldo","toko"].includes(S.own.tab) && !typing()) loadOwnerWallet(); if(SB){ loadOwnerRec(); loadMData(); } } }, 15000);
}
const dayKey = t => { const d = new Date(t); return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(); };
function rangeStart(r){
  const d = new Date(); d.setHours(0,0,0,0);
  if(r === "hari") return d.getTime();
  if(r === "7hari") return d.getTime() - 6*864e5;
  if(r === "bulan"){ d.setDate(1); return d.getTime(); }
  return 0;
}
const doneT = o => o.doneAt || o.updatedAt || o.createdAt || 0;
const shareVal = o => typeof o.share === "number" ? o.share : commCalc(o.total, "store");
function ownStats(D, from){
  const orders = D.orders || [];
  const created = orders.filter(o => (o.createdAt||0) >= from);
  const done = orders.filter(o => o.status === "selesai" && doneT(o) >= from);
  const cancel = created.filter(o => o.status === "dibatalkan");
  const sum = (arr, f) => arr.reduce((a, o) => a + (f(o) || 0), 0);
  return {
    created, done, cancel,
    gmv: sum(done, o => o.total), share: sum(done, shareVal), ongkir: sum(done, o => o.ongkirFinal),
    buyers: new Set(created.map(o => (o.buyer && o.buyer.wa || "").replace(/\D/g, "")).filter(Boolean)).size,
    active: orders.filter(o => !["selesai","dibatalkan"].includes(o.status))
  };
}

/* ============ Tanya jawab toko/driver <-> tim JAGA ============ */
S.sup = {unread:{}, msgs:{}, open:null};
const supLocal = () => { try{ return JSON.parse(localStorage.getItem("jt_support") || "[]"); }catch(_){ return []; } };
const supLocalSave = a => { try{ localStorage.setItem("jt_support", JSON.stringify(a.slice(-2000))); }catch(_){} };
function supTargetLocal(th){
  if(th.startsWith("store:")){ const st = storeById(th.slice(6)); return st ? {kind:"store", name:st.name, wa:st.wa, active:st.active !== false} : null; }
  if(th.startsWith("drv:")){ const d = (S.drivers || []).find(x => x.id === th.slice(4)) || (S.drv && S.drv.me && S.drv.me.id === th.slice(4) ? S.drv.me : null); return d ? {kind:"driver", name:d.name, wa:d.wa, active:!d.suspended} : null; }
  return null;
}
const SUP = {
  async send(th, body, as){
    if(SB) return await sbStore.rpc("jt_support_send", {p_thread:th, p_body:body, p_as:as});
    body = String(body || "").trim().slice(0, 1000); if(!body) throw srvErr("Tulis pesan dulu");
    const a = supLocal(), m = {id:Date.now() + Math.random(), thread:th, sender:as === "owner" ? "owner" : (th.startsWith("drv:") ? "driver" : "store"), body, at:Date.now()};
    m.ro = m.sender === "owner"; m.rp = m.sender !== "owner"; a.push(m); supLocalSave(a); return m;
  },
  async get(th, as){
    if(SB) return await sbStore.rpc("jt_support_get", {p_thread:th, p_as:as});
    const a = supLocal(); a.forEach(m => { if(m.thread !== th) return; if(as === "owner" && m.sender !== "owner") m.ro = true; if(as !== "owner" && m.sender === "owner") m.rp = true; }); supLocalSave(a);
    return {target:supTargetLocal(th), msgs:a.filter(m => m.thread === th).slice(-200)};
  },
  async threads(){
    if(SB) return await sbStore.rpc("jt_support_threads", {});
    const by = {}; supLocal().forEach(m => { const t = by[m.thread] = by[m.thread] || {thread:m.thread, unread:0}; t.body = m.body; t.sender = m.sender; t.at = m.at; if(m.sender !== "owner" && !m.ro) t.unread++; });
    return Object.values(by).map(t => Object.assign(t, {target:supTargetLocal(t.thread)})).sort((a, b) => b.at - a.at);
  },
  async unread(){
    if(SB) return (await sbStore.rpc("jt_support_unread", {})) || {};
    const out = {}; supLocal().forEach(m => { if(m.sender === "owner" && !m.rp) out[m.thread] = (out[m.thread] || 0) + 1; }); return out;
  }
};
const myThreads = () => S.role === "driver" ? (S.drv && S.drv.me && S.drv.me.id ? ["drv:" + S.drv.me.id] : []) : S.role === "seller" ? myStores().map(st => "store:" + st.id) : [];
async function loadSupUnread(){
  if(!myThreads().length) return;
  try{ const u = await SUP.unread(); const sig = JSON.stringify(u); if(sig !== JSON.stringify(S.sup.unread)){ if(S.sup._init) Object.keys(u || {}).forEach(th => { if((u[th] || 0) > ((S.sup.unread || {})[th] || 0)) notify("Pesan dari tim JAGA", "Ketuk untuk membaca dan membalas", {kind:"chat", act:() => openSupport(th)}); }); S.sup.unread = u || {}; if(!typing() && !document.getElementById("supForm")) scheduleRender(); } }catch(_){}
}
setInterval(() => { if(!document.hidden && (S.role === "seller" || S.role === "driver")) loadSupUnread().then(() => { S.sup._init = true; }); }, 20000);
setTimeout(loadSupUnread, 2500);
const supBadge = th => { const n = (S.sup.unread || {})[th] || 0; return n ? '<em class="sbadge">'+n+'</em>' : ''; };
function supBubbles(msgs, viewer){
  if(!msgs.length) return '<div class="sempty">'+E("bell")+'<b>Belum ada pesan</b><span>'+(viewer === "owner" ? "Mulai percakapan dengan menulis pesan di bawah." : "Ceritakan masalahmu, tim JAGA akan membalas di sini.")+'</span></div>';
  let last = "";
  return msgs.map(m => {
    const mine = viewer === "owner" ? m.sender === "owner" : m.sender !== "owner";
    const day = new Date(m.at).toLocaleDateString("id-ID", {weekday:"long", day:"numeric", month:"long"});
    const sep = day !== last ? '<div class="sday">'+esc(day)+'</div>' : ''; last = day;
    const who = m.sender === "owner" ? "Tim JAGA" : m.sender === "driver" ? "Driver" : "Toko";
    return sep + '<div class="sb '+(mine?"me":"them")+'">'+(!mine?'<small class="who">'+who+'</small>':'')+'<div>'+esc(m.body).replace(/\n/g,"<br>")+'</div><small>'+new Date(m.at).toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"})+'</small></div>';
  }).join("");
}
async function openSupport(th){
  S.sup.open = th;
  const md = document.getElementById("modal");
  md.innerHTML = '<div class="modal-bg" data-act="modal-bg"><div class="modal smodal"><div class="shead">'+JMARK()+'<div class="grow"><b>Tanya tim JAGA</b><small>Biasanya dibalas di hari yang sama</small></div><button class="ibtn" data-act="close-modal" aria-label="Tutup">✕</button></div>'+
    '<div class="sbody" id="supBody"><div class="empty">'+I("loader")+' Memuat…</div></div>'+
    '<div class="squick">'+["Saldo saya belum masuk","Pesanan bermasalah","Akun saya tidak bisa dipakai","Cara mengubah data"].map(q => '<button type="button" class="chip" data-act="sup-quick" data-v="'+esc(q)+'">'+esc(q)+'</button>').join("")+'</div>'+
    '<form class="scomp" id="supForm"><textarea class="in" name="body" rows="1" maxlength="1000" placeholder="Tulis pesan…" required></textarea><button class="btn" aria-label="Kirim">Kirim</button></form></div></div>';
  await supRefreshOpen(true);
}
async function supRefreshOpen(scroll){
  const th = S.sup.open, box = document.getElementById("supBody"); if(!th || !box) return;
  try{
    const r = await SUP.get(th, "party"); const msgs = (r && r.msgs) || [];
    const sig = JSON.stringify(msgs.map(m => m.id)); if(sig === box.dataset.sig) return; box.dataset.sig = sig;
    const atBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 60;
    box.innerHTML = supBubbles(msgs, "party");
    if(scroll || atBottom) box.scrollTop = box.scrollHeight;
    if((S.sup.unread || {})[th]){ S.sup.unread[th] = 0; }
  }catch(e){ box.innerHTML = '<div class="notice">'+esc(String(e.message || "Gagal memuat").replace(/^.*?:\s*/, ""))+'</div>'; }
}
setInterval(() => { if(!document.hidden && S.sup.open && document.getElementById("supBody")) supRefreshOpen(false); else if(S.sup.open && !document.getElementById("supBody")){ S.sup.open = null; scheduleRender(); } }, 5000);
async function supSend(f, th, as, after){
  const ta = f.querySelector("textarea"), body = (ta.value || "").trim(); if(!body) return;
  const btn = f.querySelector("button"); btn.disabled = true;
  const ok = await safe(() => SUP.send(th, body, as));
  btn.disabled = false; if(ok){ ta.value = ""; ta.style.height = ""; if(after) await after(); }
}
document.addEventListener("input", e => { if(e.target && e.target.matches && e.target.matches(".scomp textarea")){ e.target.style.height = "auto"; e.target.style.height = Math.min(140, e.target.scrollHeight) + "px"; } });
document.addEventListener("keydown", e => { if(e.key === "Enter" && !e.shiftKey && e.target && e.target.matches && e.target.matches(".scomp textarea") && window.innerWidth > 700){ e.preventDefault(); e.target.form.requestSubmit(); } });


document.addEventListener("click", e => {
  const el = e.target.closest("[data-act='sup-open'],[data-act='sup-quick']"); if(!el) return;
  if(el.dataset.act === "sup-open"){ openSupport(el.dataset.v); return; }
  const t = document.querySelector("#supForm textarea"); if(t){ t.value = el.dataset.v; t.focus(); }
});
/* ---------- inbox owner ---------- */
async function loadOwnThreads(){ try{ const t = await SUP.threads(); const sig = JSON.stringify(t); if(sig !== S.own.thSig){ if(S.own.threads && S.role === "owner") (t || []).forEach(x => { const old = S.own.threads.find(y => y.thread === x.thread); if(x.unread > (old ? old.unread || 0 : 0) && x.sender !== "owner") notify("Pesan masuk · " + ((x.target || {}).name || "Mitra"), x.body || "", {kind:"chat", act:() => { S.own.tab = "pesan"; S.own.thread = x.thread; loadOwnMsgs(x.thread, true); render(); }}); }); S.own.thSig = sig; S.own.threads = t || []; if(S.role === "owner" && !typing()) scheduleRender(); } }catch(_){ S.own.threads = S.own.threads || []; } }
async function loadOwnMsgs(th, scroll){
  try{ const r = await SUP.get(th, "owner"); const old = JSON.stringify(((S.own.msgs || {})[th] || {}).msgs || []);
    S.own.msgs = S.own.msgs || {}; S.own.msgs[th] = r || {msgs:[]};
    const t = (S.own.threads || []).find(x => x.thread === th); if(t) t.unread = 0;
    if(old !== JSON.stringify((r || {}).msgs || []) && !typing()){ render(); }
    if(scroll){ const b = document.getElementById("ownSupBody"); if(b) b.scrollTop = b.scrollHeight; }
  }catch(e){ toast(String(e.message || "Gagal memuat").replace(/^.*?:\s*/, "")); }
}
setInterval(() => { if(!document.hidden && S.role === "owner" && S.own && S.own.authed){ loadOwnThreads(); if(S.own.tab === "pesan" && S.own.thread) loadOwnMsgs(S.own.thread); } }, 6000);
function thName(th, D){
  if(th.startsWith("store:")){ const st = (D.stores || []).find(x => x.id === th.slice(6)); return st ? st.name : "Toko"; }
  const d = (D.drivers || []).find(x => x.id === th.slice(4)); return d ? d.name : "Driver";
}
function ownerInboxTab(D){
  const f = S.own.ifilter || "semua", q = (S.own.iq || "").toLowerCase();
  let th = (S.own.threads || []).map(t => Object.assign({}, t, {name:(t.target && t.target.name) || thName(t.thread, D), kind:t.thread.startsWith("drv:") ? "driver" : "store"}));
  const unreadN = th.filter(t => t.unread).length;
  const list = th.filter(t => (f === "semua" || (f === "baru" && t.unread) || f === t.kind) && (!q || t.name.toLowerCase().includes(q)));
  const sel = S.own.thread;
  const left = '<div class="ilist'+(sel?' hide-m':'')+'"><div class="itools"><input class="in" id="ownIq" placeholder="Cari toko atau driver…" value="'+esc(S.own.iq||"")+'" autocomplete="off"><button class="btn sm" data-act="own-msg-new">'+I("plus")+' Pesan baru</button></div>'+
    '<div class="oranges" style="margin:8px 0">'+[["semua","Semua"],["baru","Belum dibaca"+(unreadN?" ("+unreadN+")":"")],["store","Toko"],["driver","Driver"]].map(t => '<button class="chip '+(f===t[0]?"on":"")+'" data-act="own-ifilter" data-v="'+t[0]+'">'+t[1]+'</button>').join("")+'</div>'+
    (list.length ? list.map(t => '<button class="ith'+(t.thread===sel?' on':'')+(t.unread?' un':'')+'" data-act="own-thread" data-v="'+esc(t.thread)+'"><div class="drv-av'+(t.kind==="store"?" st":"")+'">'+esc(initials(t.name))+'</div><div class="grow"><div class="r1"><b>'+esc(t.name)+'</b><small>'+ago(t.at)+'</small></div><div class="r2"><span>'+(t.sender==="owner"?"Anda: ":"")+esc(String(t.body||"").slice(0,80))+'</span>'+(t.unread?'<em>'+t.unread+'</em>':'')+'</div><small class="kind">'+(t.kind==="store"?"Toko":"Driver")+(t.target && t.target.active===false?' · nonaktif':'')+'</small></div></button>').join("")
      : '<div class="sempty" style="padding:30px 10px">'+E("bell")+'<b>'+(th.length ? "Tidak ada percakapan di filter ini" : "Belum ada pesan")+'</b><span>Pertanyaan dari toko dan driver akan muncul di sini. Tekan “Pesan baru” untuk menghubungi mereka lebih dulu.</span></div>')+'</div>';
  let right = '<div class="iconv empty-c'+(sel?'':' hide-m')+'"><div class="sempty">'+E("bell")+'<b>Pilih percakapan</b><span>Atau mulai pesan baru ke toko atau driver.</span></div></div>';
  if(sel){
    const r = (S.own.msgs || {})[sel], tg = (r && r.target) || {}, name = tg.name || thName(sel, D), kind = sel.startsWith("drv:") ? "driver" : "store", id = sel.split(":")[1];
    if(!r) setTimeout(() => loadOwnMsgs(sel, true), 0);
    right = '<div class="iconv"><div class="ichead"><button class="ibtn back" data-act="own-thread" data-v="" aria-label="Kembali">←</button><div class="drv-av'+(kind==="store"?" st":"")+'">'+esc(initials(name))+'</div><div class="grow"><b>'+esc(name)+'</b><small>'+(kind==="store"?"Toko":"Driver")+(tg.active===false?' · <span class="warnc">dinonaktifkan</span>':' · aktif')+'</small></div>'+

      '<button class="btn ghost sm" data-act="own-tab" data-v="'+(kind==="store"?"toko":"driver")+'" data-focus="'+esc(id)+'">Kelola</button></div>'+
      '<div class="sbody" id="ownSupBody">'+(r ? supBubbles(r.msgs || [], "owner") : '<div class="empty">'+I("loader")+' Memuat…</div>')+'</div>'+
      '<div class="squick">'+["Baik, kami cek dulu ya.","Mohon kirim foto buktinya.","Masalah sudah kami selesaikan. Terima kasih.","Saldo sudah kami tambahkan."].map(q => '<button type="button" class="chip" data-act="own-quick" data-v="'+esc(q)+'">'+esc(q)+'</button>').join("")+'</div>'+
      '<form class="scomp" id="ownSupForm"><textarea class="in" name="body" rows="1" maxlength="1000" placeholder="Balas ke '+esc(name)+'…" required></textarea><button class="btn">Kirim</button></form></div>';
  }
  return '<div class="inbox card">'+left+right+'</div>';
}
function openOwnNewMsg(D, pre){
  const opts = '<optgroup label="Toko">'+(D.stores||[]).map(st => '<option value="store:'+esc(st.id)+'" '+(pre==="store:"+st.id?"selected":"")+'>'+esc(st.name)+'</option>').join("")+'</optgroup><optgroup label="Driver">'+(D.drivers||[]).map(d => '<option value="drv:'+esc(d.id)+'" '+(pre==="drv:"+d.id?"selected":"")+'>'+esc(d.name)+(d.plate?' · '+esc(d.plate):'')+'</option>').join("")+'</optgroup>';
  document.getElementById("modal").innerHTML = '<div class="modal-bg" data-act="modal-bg"><form class="modal" id="ownNewMsg"><h2 class="sec" style="margin-top:0">Kirim pesan</h2><label class="f">Kepada</label><select class="in" name="th" required>'+opts+'</select>'+
    '<label class="f">Pesan</label><textarea class="in" name="body" rows="4" maxlength="1000" required placeholder="Contoh: Halo, mohon perbarui foto produk dan lokasi toko ya."></textarea><div class="hint">Pesan muncul di aplikasi toko/driver dengan tanda merah sampai dibaca.</div>'+
    '<div class="actions" style="margin-top:16px"><button class="btn" style="flex:1">Kirim pesan</button><button type="button" class="btn ghost" data-act="close-modal">Batal</button></div></form></div>';
}
async function ownRpc(fn, args){ const { error, data } = await SB.rpc(fn, Object.assign({p_key: KEY}, args)); if(error) throw sbErr(error); return data; }
function ownAct(label, fn, okMsg){ return async () => { try{ await fn(); toast(okMsg); }catch(err){ toast(String(err.message || "Gagal").replace(/^.*?:\s*/, "")); } S.own.sig = ""; await ownRefresh(); loadOwnThreads(); render(); }; }
function ago(t){ const m = Math.max(0, Math.round((Date.now() - t) / 60000)); return m < 1 ? "baru saja" : m < 60 ? m + " mnt lalu" : m < 1440 ? Math.round(m/60) + " jam lalu" : Math.round(m/1440) + " hari lalu"; }
function ownLogin(){
  return '<section class="dhero" style="padding-top:26px">'+E("money")+'<h1>Portal Owner</h1><p>Pantau seluruh aplikasi JAGA.</p></section>'+
    '<form class="card pad slogin" id="ownerLogin"><label class="f">Login owner</label><input class="in" name="login" autocapitalize="none" autocomplete="username" required>'+
    '<label class="f">Password</label><div class="pwrap"><input class="in" type="password" name="pass" autocomplete="current-password" required><button type="button" class="pw-eye" data-act="pw-toggle" aria-label="Lihat password">'+I("eye")+'</button></div>'+
    '<button class="btn block press" style="margin-top:14px">Masuk</button><div class="hint" style="text-align:center">Halaman ini khusus pemilik aplikasi.</div></form>';
}
function csvDownload(name, rows){
  const q = v => '"' + String(v == null ? "" : v).replace(/"/g, '""') + '"';
  const blob = new Blob(["\ufeff" + rows.map(r => r.map(q).join(",")).join("\n")], {type:"text/csv;charset=utf-8"});
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
const csvSlug = t => String(t || "toko").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "toko";
const csvDate = t => t ? new Date(t).toLocaleString("id-ID", {dateStyle:"short", timeStyle:"short"}) : "";
function miniBars(vals, labels, fmt, cls){
  const max = Math.max(1, ...vals);
  return '<div class="obars">'+vals.map((v, i) => '<div class="ob" title="'+esc(labels[i]+': '+fmt(v))+'"><div class="col"><i class="'+(cls||'')+'" style="height:'+Math.round(v/max*100)+'%"></i></div><small>'+esc(labels[i].split(" ")[0])+'</small></div>').join("")+'</div>';
}
function bars(days){
  const max = Math.max(1, ...days.map(d => d.gmv));
  return '<div class="obars">'+days.map(d => '<div class="ob" title="'+esc(d.label+': '+rp(d.gmv)+' · bagi hasil '+rp(d.share))+'"><div class="col"><i style="height:'+Math.round(d.gmv/max*100)+'%"></i><b style="height:'+Math.round(d.share/max*100)+'%"></b></div><small>'+esc(d.short)+'</small></div>').join("")+'</div>'+
    '<div class="olegend"><span><i class="g"></i>Penjualan selesai</span><span><i class="s"></i>Bagi hasil 3%</span></div>';
}
function ownFeed(orders){
  const ev = [];
  orders.slice(0, 200).forEach(o => {
    const who = esc(o.storeName || "Toko");
    ev.push({t:o.createdAt, ic:"cart", h:'<b>Pesanan baru</b> '+esc(o.code)+' di '+who+' · '+rp(o.total)});
    if(o.acceptedAt && o.driver) ev.push({t:o.acceptedAt, ic:"scooter", h:'<b>'+esc(o.driver.name)+'</b> mengambil '+esc(o.code)});
    if(o.pickedAt) ev.push({t:o.pickedAt, ic:"package", h:esc(o.code)+' diambil dari '+who+', sedang diantar'});
    if(o.status === "selesai") ev.push({t:doneT(o), ic:"check", h:'<b>Selesai</b> '+esc(o.code)+' · '+rp(o.total)+(typeof o.ongkirFinal==="number"?' · ongkir '+rp(o.ongkirFinal):'')+' · bagi hasil '+rp(shareVal(o))});
    if(o.status === "dibatalkan") ev.push({t:o.updatedAt||o.createdAt, ic:"bell", h:'<b>Dibatalkan</b> '+esc(o.code)+(o.cancelBy?' oleh '+esc(o.cancelBy):'')});
  });
  ev.sort((a, b) => (b.t||0) - (a.t||0));
  if(!ev.length) return '<div class="muted small">Belum ada aktivitas.</div>';
  return '<div class="ofeed">'+ev.slice(0, 25).map(e => '<div class="fe">'+E(e.ic)+'<div class="grow">'+e.h+'<small>'+fmtDate(e.t)+' · '+ago(e.t)+'</small></div></div>').join("")+'</div>';
}
function ownStuck(o){
  const age = Date.now() - (o.status === "mencari_driver" ? (o.searchAt||o.updatedAt||o.createdAt) : (o.updatedAt||o.createdAt));
  return (o.status === "mencari_driver" && age > 5*60000) || (o.status === "menunggu_konfirmasi" && age > 15*60000) || (o.status === "driver_ke_toko" && age > 30*60000);
}
function ownOrderRow(o){
  const stuck = ownStuck(o);
  return '<div class="orow'+(stuck?' stuck':'')+'"><div class="grow"><b>'+esc(o.code)+'</b> · '+esc(o.storeName)+'<small>'+esc(o.buyer ? o.buyer.name : "")+' · '+esc(o.items ? o.items.map(i => i.qty+'× '+i.name).join(", ") : "")+'</small>'+
    '<small>'+fmtDate(o.createdAt)+(o.driver?' · driver '+esc(o.driver.name):'')+(stuck?' · <b class="warnc">perlu dicek ('+ago(o.updatedAt||o.createdAt)+')</b>':'')+'</small></div>'+
    '<div class="r">'+statusTag(o.status)+'<b>'+rp(o.total)+'</b>'+ownCloseBtn("order", o)+(o.buyer && o.buyer.wa ? '<a class="small" target="_blank" rel="noopener" href="'+esc(waLink(o.buyer.wa, "Halo "+o.buyer.name+", ini dari JAGA tentang pesanan "+o.code+"."))+'">WA pembeli</a>' : '')+'</div></div>';
}
function ownD(){ return (SB ? S.own.data : null) || (SB ? {stores:[], orders:[], drivers:[], rides:[]} : {stores:S.stores, orders:S.orders, drivers:S.drivers, rides:S.ridesAll}); }
function appOwner(){
  let h = '<div class="dtop otop">'+JMARK()+'<div class="grow"><b>JAGA</b><small>Portal Owner</small></div>'+(S.own.authed ? '<button class="ibtn" data-act="own-refresh" aria-label="Muat ulang">'+I("repeat")+'</button>' : '')+'</div>';
  if(!SB) h += '<div class="notice">Pratinjau: angka di bawah memakai data pratinjau. Di website asli portal ini dikunci dengan login owner.</div>';
  if(!S.own.loaded) return h + '<div class="empty">'+I("loader")+' Memuat…</div>';
  if(!S.own.authed) return h + (S.own.err ? '<div class="notice">'+esc(S.own.err)+'</div>' : '') + ownLogin();
  const D = (SB ? S.own.data : null) || (SB ? {stores:[], orders:[], drivers:[], rides:[]} : {stores:S.stores.map(s => Object.assign({}, s, {products:(S.products[s.id]||[]).length})), orders:S.orders.slice().sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)), drivers:S.drivers, rides:S.ridesAll.slice().sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)), reportsOpen:(S.localReports||[]).filter(r => r.status !== "selesai").length});
  const RD = D.rides || [];
  const pendDrv = (D.drivers||[]).filter(d => d.verify === "pending").length;
  if(SB && S.own.buyers === undefined){ S.own.buyers = null; loadOwnerBuyers(); }
  const pendBuy = S.own.buyers ? S.own.buyers.list.filter(x => x.status === "pending").length : 0;
  if(SB && S.own.rec === undefined){ S.own.rec = null; loadOwnerRec(); }
  const pendRec = (S.own.rec || []).filter(x => x.pending).length;
  if(S.own.threads === undefined){ S.own.threads = []; loadOwnThreads(); }
  const unreadMsg = (S.own.threads || []).reduce((a, t) => a + (t.unread || 0), 0);
  const stuckN = (D.orders || []).filter(ownStuck).length;
  const tabs = [["ringkasan","Ringkasan","dashboard",0],["pesanan","Pesanan","receipt",stuckN],["pesan","Pesan","chat",unreadMsg],["laporan","Laporan masalah","note",D.reportsOpen||0],["toko","Toko","store",0],["driver","Driver","truck",pendDrv],["pembeli","Pembeli","user",pendBuy],["pulih","Pemulihan akun","badge",pendRec],["mtoko","Toko JAGA","store",((S.own.m && S.own.m.orders) || []).filter(o => o.status === "menunggu_konfirmasi").length],["saldo","Saldo","cash",0],["cabang","Cabang","pin",0],["akun","Akun","settings",0]];
  const TT = {ringkasan:["Ringkasan","Kondisi bisnis JAGA secara keseluruhan"], pesanan:["Pesanan","Semua pesanan belanja dan perjalanan Jago"], pesan:["Pesan","Tanya jawab dengan toko dan driver"], laporan:["Laporan masalah","Keluhan dari pembeli, toko, dan driver"], toko:["Toko","Kelola toko mitra: pesan, nonaktifkan, atau hapus"], driver:["Driver","Verifikasi dan kelola akun driver"], pembeli:["Pembeli","Setujui pendaftaran akun pembeli"], mtoko:["Toko JAGA (percobaan)","Toko yang didaftarkan & dikelola tim JAGA"], pulih:["Pemulihan akun","Toko & driver yang lupa akun atau password"], saldo:["Saldo","Isi saldo, bagi hasil, dan komisi"], cabang:["Cabang","Wilayah layanan JAGA"], akun:["Akun","Link penting dan keamanan"]};
  const tt = TT[S.own.tab] || TT.ringkasan;
  const nav = cls => tabs.map(t => '<button class="'+(S.own.tab===t[0]?"on":"")+'" data-act="own-tab" data-v="'+t[0]+'">'+I(t[2])+'<span>'+t[1]+'</span>'+(t[3]?'<em class="'+(t[0]==="pesan"||t[0]==="driver"||t[0]==="laporan"||t[0]==="pulih"||t[0]==="mtoko"?"red":"amb")+'">'+t[3]+'</em>':'')+'</button>').join("");
  const side = '<aside class="oside"><div class="obrand">'+JMARK()+'<div><b>JAGA</b><small>Portal Owner</small></div></div><nav>'+nav()+'</nav><div class="ofoot"><a href="'+esc(APP_URL)+'" target="_blank" rel="noopener">'+I("eye")+' Buka aplikasi pembeli</a></div></aside>';
  const ranges = [["hari","Hari ini"],["7hari","7 hari"],["bulan","Bulan ini"],["semua","Semua"]];
  const rangeBar = '<div class="oranges">'+ranges.map(r => '<button class="chip '+(S.own.range===r[0]?"on":"")+'" data-act="own-range" data-v="'+r[0]+'">'+r[1]+'</button>').join("")+'</div>';
  const st = ownStats(D, rangeStart(S.own.range));
  const stores = D.stores || [], drivers = D.drivers || [];
  const now = Date.now();
  const onlineDrv = drivers.filter(d => d.online && (d.locAt||0) > now - 20*60000).length;
  const top = h;
  h = '<div class="oshell">'+side+'<div class="omain">'+top+'<div class="otabs">'+nav()+'</div><div class="owrap">'+
    '<div class="ohead"><div><h1>'+tt[0]+'</h1><p>'+tt[1]+'</p></div><div class="ohead-r">'+((S.own.tab==="ringkasan"||S.own.tab==="toko") ? rangeBar : '')+'<button class="btn ghost sm hide-m" data-act="own-refresh">'+I("repeat")+' Muat ulang</button></div></div>';
  if(S.own.tab === "ringkasan"){
    const reportsOpen = D.reportsOpen || 0, noLoc = stores.filter(s => s.active !== false && typeof s.lat !== "number").length, offStores = stores.filter(s => s.active === false).length, suspD = drivers.filter(d => d.suspended).length;
    const todo = [
      [pendDrv, "driver menunggu verifikasi", "Setujui atau tolak pendaftaran", "driver", "truck"],
      [pendRec, "permintaan pemulihan akun", "Toko/driver lupa akun, cocokkan lalu konfirmasi", "pulih", "badge"],
      [unreadMsg, "pesan belum dibaca", "Dari toko dan driver", "pesan", "chat"],
      [reportsOpen, "laporan masalah terbuka", "Tindak lanjuti dengan Garansi JAGA", "laporan", "note"],
      [stuckN, "pesanan perlu dicek", "Belum bergerak terlalu lama", "pesanan", "clock"],
      [noLoc, "toko belum mengatur lokasi", "Driver tidak bisa dicarikan otomatis", "toko", "pin"]
    ].filter(x => x[0] > 0);
    h += '<div class="card pad otodo"><div class="tdh"><h3 class="sub" style="margin:0">Perlu tindakan</h3>'+(todo.length ? '<span class="tag amber">'+todo.length+' hal</span>' : '<span class="tag green">Semua aman</span>')+'</div>'+
      (todo.length ? '<div class="tdl">'+todo.map(x => '<button class="td" data-act="own-tab" data-v="'+x[3]+'"><span class="ti">'+I(x[4])+'</span><div class="grow"><b>'+x[0]+' '+x[1]+'</b><small>'+x[2]+'</small></div><span class="go">'+I("chev")+'</span></button>').join("")+'</div>'
        : '<p class="muted small" style="margin:8px 0 0">Tidak ada driver menunggu, pesan, laporan, atau pesanan macet.'+(offStores||suspD?' '+offStores+' toko dan '+suspD+' driver sedang dinonaktifkan.':'')+'</p>')+'</div>';
    { /* ---- Ringkasan ringkas: angka utama, satu grafik, aktivitas singkat ---- */
      const f = rangeStart(S.own.range), rLbl = ranges.find(r => r[0]===S.own.range)[1].toLowerCase();
      const rDone = RD.filter(r => r.status === "selesai" && (r.doneAt||r.createdAt||0) >= f);
      const dlvFee = st.done.reduce((a,o)=>a+(o.drvFee||0),0), rideFee_ = rDone.reduce((a,r)=>a+(r.fee||0),0);
      const nominal = st.share + dlvFee + rideFee_;
      const W = S.ownW && !S.ownW.err ? S.ownW : null; if(!S.ownW) loadOwnerWallet();
      const cut = W && W.feeLog ? W.feeLog.filter(x => x[0] >= f).reduce((a,x)=>a+(+x[1]||0),0) : null;
      const gap = cut == null ? 0 : Math.max(0, nominal - cut);
      const trx = st.done.length + rDone.length, cancelPct = st.created.length ? Math.round(st.cancel.length/st.created.length*100) : 0;
      h += '<div class="ohero"><small>Pendapatan JAGA · '+esc(rLbl)+'</small><b>'+rp(cut == null ? nominal : cut)+'</b>'+
        '<span>'+(cut == null ? 'Menghitung potongan saldo…' : 'Terpotong dari saldo toko & driver')+' · '+trx+' transaksi selesai</span>'+
        '<div class="ohsplit"><div><small>Toko</small><b>'+rp(st.share)+'</b></div><div><small>Ongkir antar</small><b>'+rp(dlvFee)+'</b></div><div><small>Jago</small><b>'+rp(rideFee_)+'</b></div></div>'+
        (gap > 0 ? '<p class="ohgap">'+I("note")+' Seharusnya '+rp(nominal)+'. Sebanyak <b>'+rp(gap)+'</b> tidak terpotong dari saldo karena toko/driver dibebaskan owner atau pesanannya terjadi sebelum fitur saldo aktif.</p>' : '')+'</div>';
      const k = (lbl, v, sub) => '<div class="k"><small>'+lbl+'</small><b>'+v+'</b>'+(sub ? '<span>'+sub+'</span>' : '')+'</div>';
      h += '<div class="okpi okpi3">'+
        k("Penjualan toko", rp(st.gmv), st.done.length+" pesanan selesai")+
        k("Ongkir & tarif driver", rp(st.ongkir + rDone.reduce((a,r)=>a+(r.fareFinal||0),0)), "antar "+rp(st.ongkir)+" · Jago "+rp(rDone.reduce((a,r)=>a+(r.fareFinal||0),0)))+
        k("Pesanan masuk", String(st.created.length), st.cancel.length+" batal ("+cancelPct+"%)")+
        k("Pembeli unik", String(st.buyers), "")+
        k("Toko", stores.filter(s => s.active !== false && s.open !== false).length+'<em> buka / '+stores.length+'</em>', "")+
        k("Driver online", onlineDrv+'<em> / '+drivers.length+'</em>', st.active.length + RD.filter(r => RIDE_ACTIVE.includes(r.status)).length ? (st.active.length + RD.filter(r => RIDE_ACTIVE.includes(r.status)).length)+" order berjalan" : "tidak ada order berjalan")+
      '</div>';
      const cnt = [], inc = [], gmv = [], lab = [];
      for(let i = 13; i >= 0; i--){
        const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate() - i); const kd = dayKey(d);
        const dn = (D.orders||[]).filter(o => o.status === "selesai" && dayKey(doneT(o)) === kd), dr = RD.filter(r => r.status === "selesai" && dayKey(r.doneAt||r.createdAt||0) === kd);
        cnt.push(dn.length + dr.length); gmv.push(dn.reduce((a,o)=>a+(o.total||0),0));
        inc.push(W && W.feeLog ? W.feeLog.filter(x => dayKey(x[0]) === kd).reduce((a,x)=>a+(+x[1]||0),0) : dn.reduce((a,o)=>a+shareVal(o)+(o.drvFee||0),0) + dr.reduce((a,r)=>a+(r.fee||0),0));
        lab.push(d.toLocaleDateString("id-ID",{day:"numeric",month:"short"}));
      }
      const ch = S.own.chart || "jual", sum = a => a.reduce((x,y)=>x+y,0);
      const C = {jual:["Penjualan", gmv, rp, ""], pend:["Pendapatan JAGA", inc, rp, "gold"], trx:["Transaksi", cnt, v => v + " transaksi", ""]}[ch];
      h += '<div class="card pad ochart"><div class="ochd"><h3 class="sub" style="margin:0">14 hari terakhir</h3><div class="oseg">'+
        [["jual","Penjualan"],["pend","Pendapatan"],["trx","Transaksi"]].map(x => '<button class="'+(ch===x[0]?"on":"")+'" data-act="own-chart" data-v="'+x[0]+'">'+x[1]+'</button>').join("")+'</div></div>'+
        miniBars(C[1], lab, C[2], C[3])+'<div class="olegend"><span>'+C[0]+' per hari</span><span>Total '+(ch==="trx" ? sum(C[1]) : rp(sum(C[1])))+'</span></div>'+
        '<button class="linkbtn" data-act="own-csv" style="margin-top:8px">'+I("receipt")+' Unduh transaksi (CSV) · '+esc(rLbl)+'</button></div>';
      if(st.active.length) h += '<div class="card pad"><h3 class="sub">Sedang berjalan</h3>'+st.active.slice(0, 5).map(ownOrderRow).join("")+'</div>';
      const feed = ownFeed(D.orders || []);
      h += '<div class="card pad ofeedc'+(S.own.feedAll ? ' all' : '')+'"><h3 class="sub">Aktivitas terbaru</h3>'+feed+'<button class="linkbtn" data-act="own-feed-all">'+(S.own.feedAll ? 'Tampilkan lebih sedikit' : 'Lihat semua aktivitas')+'</button></div>';
    }
  } else if(S.own.tab === "pesanan"){
    const f = S.own.ofilter || "aktif";
    const all = D.orders || [];
    const groups = {aktif: all.filter(o => !["selesai","dibatalkan"].includes(o.status)), selesai: all.filter(o => o.status === "selesai"), batal: all.filter(o => o.status === "dibatalkan"), semua: all};
    h += '<div class="oranges">'+[["aktif","Berjalan"],["selesai","Selesai"],["batal","Batal"],["semua","Semua"]].map(t => '<button class="chip '+(f===t[0]?"on":"")+'" data-act="own-ofilter" data-v="'+t[0]+'">'+t[1]+' ('+groups[t[0]].length+')</button>').join("")+'</div>';
    const list = groups[f].slice(0, 100);
    h += '<div class="card pad">'+(list.length ? list.map(ownOrderRow).join("") : '<div class="muted small">Belum ada pesanan.</div>')+'</div>';
    const rl = RD.filter(o => f === "semua" ? true : f === "aktif" ? RIDE_ACTIVE.includes(o.status) : f === "selesai" ? o.status === "selesai" : o.status === "dibatalkan").slice(0, 100);
    h += '<h3 class="sub" style="margin:16px 4px 8px">Perjalanan Jago ('+rl.length+')</h3><div class="card pad">'+(rl.length ? rl.map(ownRideRow).join("") : '<div class="muted small">Belum ada perjalanan.</div>')+'</div>';
  } else if(S.own.tab === "pulih"){
    h += ownerRecTab();
  } else if(S.own.tab === "mtoko"){
    h += ownerMTab();
  } else if(S.own.tab === "pesan"){
    h += ownerInboxTab(D);
  } else if(S.own.tab === "toko"){
    const hTokoStart = h.length;
    const mStart = rangeStart("bulan");
    const rows = stores.map(s => {
      const os = (D.orders||[]).filter(o => o.storeId === s.id);
      const dn = os.filter(o => o.status === "selesai" && doneT(o) >= rangeStart(S.own.range));
      const billM = os.filter(o => o.status === "selesai" && doneT(o) >= mStart).reduce((a,o)=>a+shareVal(o),0);
      return {s, n:os.filter(o => (o.createdAt||0) >= rangeStart(S.own.range)).length, gmv:dn.reduce((a,o)=>a+(o.total||0),0), share:dn.reduce((a,o)=>a+shareVal(o),0), billM, last:os[0] ? os[0].createdAt : 0, reg:storeRegion(s) || "", loc:typeof s.lat === "number"};
    }).sort((a, b) => (a.s.active === false) - (b.s.active === false) || b.gmv - a.gmv || b.last - a.last);
    const sf = S.own.sf || "all", sr = S.own.sr || "";
    const cnt = {all:rows.length, on:rows.filter(r => r.s.active !== false).length, off:rows.filter(r => r.s.active === false).length, noloc:rows.filter(r => !r.loc).length};
    const regs = {}; rows.forEach(r => { const k = r.reg || "-"; regs[k] = (regs[k] || 0) + 1; });
    const vis = rows.filter(r => (sf === "all" || (sf === "on" ? r.s.active !== false : sf === "off" ? r.s.active === false : !r.loc)) && (!sr || (r.reg || "-") === sr));
    h += '<div class="card omapc"><div class="omh"><b>'+I("pin")+' Peta toko terdaftar</b><small>'+cnt.all+' toko · '+(cnt.all - cnt.noloc)+' sudah ada lokasi</small></div>'+
      '<div class="omapw"><div class="omap" data-omap="stores"></div><div class="omleg"><span><i class="on"></i>Aktif</span><span><i class="off"></i>Nonaktif</span></div></div>'+
      '<div class="oregs"><button data-act="own-sr" data-v="" aria-pressed="'+(!sr)+'">Semua wilayah</button>'+Object.keys(regs).sort((x, y) => regs[y] - regs[x]).map(k => '<button data-act="own-sr" data-v="'+esc(k)+'" aria-pressed="'+(sr === k)+'">'+esc(k === "-" ? "Belum ada wilayah" : regionName(k))+' <b>'+regs[k]+'</b></button>').join("")+'</div></div>';
    h += '<div class="otool"><input class="in" id="ownFind" placeholder="Cari nama toko…" autocomplete="off"><button class="btn ghost sm" data-act="own-msg-new">'+I("chat")+' Kirim pesan</button></div>';
    h += '<div class="osf">'+[["all","Semua"],["on","Aktif"],["off","Nonaktif"],["noloc","Tanpa lokasi"]].map(x => '<button data-act="own-sf" data-v="'+x[0]+'" aria-pressed="'+(sf === x[0])+'">'+x[1]+' <b>'+cnt[x[0]]+'</b></button>').join("")+'</div>';
    const pg = S.own.storePage && rows.find(r => r.s.id === S.own.storePage);
    if(pg){ OWN_MAP_ROWS = rows; h = h.slice(0, hTokoStart) + ownStorePage(pg); return h + '</div></div></div>'; }
    h += '<div class="otiles">'+(vis.length ? vis.map(r => {
      const s = r.s, off = s.active === false, cls = off ? 'off' : s.open === false ? 'cl' : 'on';
      const bal = S.ownW && S.ownW.balances ? (S.ownW.balances[s.id] || 0) : null, low = bal != null && bal < ((S.ownW.cfg||{}).minBalance||0);
      return '<button class="otile '+cls+' ost" data-n="'+esc(String(s.name||"").toLowerCase())+'" data-act="own-sopen" data-id="'+esc(s.id)+'">'+(low ? '<i class="lowb" title="Saldo rendah"></i>' : '')+(r.loc ? '' : '<i class="nolocb" title="Belum ada lokasi">!</i>')+
        '<em>'+esc((s.name||"?").trim().charAt(0).toUpperCase())+'</em><b>'+esc(s.name)+'</b><small>'+(r.n ? r.n+' pesanan' : esc(r.reg ? regionName(r.reg) : (s.area||"")))+'</small></button>';
    }).join("") : '<div class="pad muted small">'+(rows.length ? 'Tidak ada toko pada filter ini.' : 'Belum ada toko terdaftar.')+'</div>')+'</div>'+
    '<div class="otleg"><span><i class="on"></i>Aktif & buka</span><span><i class="cl"></i>Tutup</span><span><i class="off"></i>Nonaktif</span><span><i class="lw"></i>Saldo rendah</span></div>';
    OWN_MAP_ROWS = rows;
  } else if(S.own.tab === "pembeli"){
    h += ownerBuyersTab();
  } else if(S.own.tab === "laporan"){
    h += ownerReportsTab();
  } else if(S.own.tab === "cabang"){
    h += ownerAreasTab();
  } else if(S.own.tab === "saldo"){
    h += ownerWalletTab(D);
  } else if(S.own.tab === "driver"){
    const ds = drivers.map(d => {
      const mine = (D.orders||[]).concat(RD).filter(o => o.driverId === d.id);
      const dn = mine.filter(o => o.status === "selesai");
      const on = d.online && (d.locAt||0) > now - 20*60000;
      return {d, on, trips:dn.length, rides:dn.filter(isRide).length, ongkir:dn.reduce((a,o)=>a+(o.ongkirFinal||o.fareFinal||0),0), today:dn.filter(o => doneT(o) >= rangeStart("hari")).length, busy:mine.some(o => DRV_BUSY.includes(o.status)),
        bal:S.ownW && S.ownW.balances ? (S.ownW.balances["drv:" + d.id] || 0) : null};
    }).sort((a, b) => (b.on - a.on) || (b.trips - a.trips));
    const pend = drivers.filter(d => d.verify && d.verify !== "verified");
    if(pend.length) h += '<div class="card pad"><h3 class="sub">Menunggu verifikasi ('+pend.length+')</h3>'+pend.map(d => '<div class="orow"><div class="drv-av">'+esc(initials(d.name))+'</div><div class="grow"><b>'+esc(d.name)+'</b><small>'+esc([d.vehicle, d.plate, d.wa].filter(Boolean).join(" · "))+'</small>'+
      (d.address ? '<small>'+I("pin")+' '+esc(d.address)+'</small>' : '')+
      '<small>'+(d.verify === "rejected" ? '<b class="warnc">Ditolak</b>'+(d.verifyNote?': '+esc(d.verifyNote):'') : '<b style="color:#1f4fd1">Daftar '+(d.createdAt ? ago(d.createdAt) : '')+'</b>')+'</small></div>'+
      '<div class="r"><button class="btn sm" data-act="drv-verify" data-id="'+esc(d.id)+'" data-v="1">Setujui</button>'+(d.verify !== "rejected" ? '<button class="btn ghost sm" data-act="drv-verify" data-id="'+esc(d.id)+'" data-v="0">Tolak</button>' : '')+
      ((d.docsAt || d.hasDocs) ? '<button class="linkbtn" data-act="drv-docs" data-id="'+esc(d.id)+'" data-v="'+esc(d.name)+'">Dokumen</button>' : '')+'<button class="linkbtn small" data-act="own-msg" data-v="drv:'+esc(d.id)+'">Pesan</button>'+'</div></div>').join("")+'</div>';
    h += '<div class="otool"><input class="in" id="ownFind" placeholder="Cari nama atau plat driver…" autocomplete="off"><button class="btn ghost sm" data-act="own-msg-new">'+I("chat")+' Kirim pesan</button></div>';
    h += '<div class="card pad">'+(ds.length ? ds.map(x => {
      const d = x.d, st = d.suspended ? '<span class="tag amber">Nonaktif</span>' : d.verify && d.verify !== "verified" ? '<span class="tag">Belum verifikasi</span>' : '';
      return '<div class="orow odrv'+(d.suspended?' off':'')+(S.own.focus===d.id?' focus':'')+'" data-n="'+esc((String(d.name||"")+" "+String(d.plate||"")).toLowerCase())+'"><div class="drv-av">'+esc(initials(d.name))+'</div><div class="grow">'+
      '<div class="dhead"><span class="dstat '+(x.on?'on':'')+'"></span><b>'+esc(d.name)+'</b> '+st+' '+starTxt(((D.ratings||S.ratings).driver||{})[d.id])+exTag("d", d.id)+'</div>'+
      '<small>'+esc([d.vehicle, d.plate].filter(Boolean).join(" · "))+(x.on ? ' · <b style="color:#15803d">Online</b>'+(x.busy?' (mengantar)':'') : ' · Offline'+(d.locAt ? ' '+ago(d.locAt) : ''))+'</small>'+
      '<small>'+x.trips+' trip'+(x.rides?' ('+x.rides+' Jago)':'')+' · hari ini '+x.today+' · saldo <b>'+(x.bal == null ? '…' : rp(x.bal))+'</b></small>'+(d.suspended && d.suspendNote ? '<small class="warnc">Alasan: '+esc(d.suspendNote)+'</small>' : '')+
      accLine("driver", d.id, d.name, d.plate)+
      '<div class="oacts"><button class="btn ghost sm" data-act="own-msg" data-v="drv:'+esc(d.id)+'">'+I("chat")+' Pesan</button><button class="btn ghost sm" data-act="own-adjust" data-id="drv:'+esc(d.id)+'" data-v="Driver '+esc(d.name)+'">'+I("cash")+' Saldo</button>'+
      '<details class="kmenu"><summary class="btn ghost sm">Lainnya ▾</summary><div class="kpop"><button data-act="own-exempt" data-k="d" data-id="'+esc(d.id)+'" data-v="Driver '+esc(d.name)+'">Bebas komisi</button><button data-act="own-drv-active" data-id="'+esc(d.id)+'" data-v="'+(d.suspended?"1":"0")+'" data-name="'+esc(d.name)+'">'+(d.suspended?"Aktifkan":"Nonaktifkan")+'</button><button class="dangerc" data-act="own-drv-del" data-id="'+esc(d.id)+'" data-v="'+esc(d.name)+'">Hapus</button></div></details></div></div></div>';
    }).join("") : '<div class="muted small">Belum ada driver terdaftar. Bagikan link jagapatner.my.id/apps/#driver ke calon driver.</div>')+'</div>';
  } else {
    h += '<div class="card pad"><h3 class="sub">Link penting</h3>'+
      [["Aplikasi pembeli",APP_URL],["Portal toko",APP_URL+"#mitra"],["Portal driver",APP_URL+"#driver"]].map(l => '<div class="orow"><div class="grow"><b>'+l[0]+'</b><small>'+esc(l[1])+'</small></div><button class="btn ghost sm" data-act="copy" data-v="'+esc(l[1])+'">Salin</button></div>').join("")+'</div>';
    if(SB) h += '<form class="card pad" id="ownerPass"><h3 class="sub">Ganti password owner</h3><label class="f">Password baru (min. 8 karakter)</label><input class="in" type="password" name="pass" minlength="8" required autocomplete="new-password"><div class="hint">Setelah diganti, perangkat lain yang login owner otomatis keluar.</div><button class="btn sm" style="margin-top:10px">Simpan password</button></form>'+
      '<div class="card pad"><button class="btn danger sm" data-act="own-logout">Keluar dari portal owner</button></div>';
  }
  return h + '</div></div></div>';
}
document.addEventListener("click", async e => {
  const el = e.target.closest("[data-act]"); if(!el) return;
  const a = el.dataset.act, v = el.dataset.v, id = el.dataset.id;
  if(a === "ver-tap"){ S._vt = (S._vtT && Date.now() - S._vtT < 1500 ? (S._vt||0) : 0) + 1; S._vtT = Date.now(); if(S._vt >= 5){ S._vt = 0; location.hash = "owner"; } return; }
  if(a === "own-resetpass"){
    const kind = el.dataset.k, nm = el.dataset.v || "";
    confirmModal("Buat password sementara untuk " + (kind === "store" ? "toko" : "driver") + " “" + nm + "”? Password lama tidak berlaku lagi.", "Buat password", async () => {
      try{
        const r = await sbStore.rpc("jt_owner_resetpass", {p_kind:kind, p_id:el.dataset.id});
        const d = {plate:r.plate};
        const info = kind === "store" ? "Nama login: " + r.login + "\nPassword: " + r.pass : "Nama: " + r.name + "\nPlat: " + (d.plate || "-") + "\nPassword: " + r.pass;
        const wa = r.wa;
        const msg = "Halo, ini tim JAGA. Berikut data masuk akun " + (kind === "store" ? "toko" : "driver") + " Anda di jagapatner.my.id/apps:\n\n" + info + "\n\nSegera ganti password setelah masuk. Jangan berikan ke siapa pun.";
        document.getElementById("modal").innerHTML = '<div class="modal-bg" data-act="modal-bg"><div class="modal"><h2 class="sec">Password sementara</h2>'+
          '<div class="tmppass">'+(kind === "store" ? '<small>Nama login</small><b>'+esc(r.login)+'</b>' : '<small>Nama + plat</small><b>'+esc(r.name)+' · '+esc(d.plate || "-")+'</b>')+'<small>Password</small><b class="pw">'+esc(r.pass)+'</b></div>'+
          '<div class="hint">Password ini hanya tampil sekali. Kirim ke pemilik akun lewat WhatsApp, lalu minta ia menggantinya setelah masuk.</div>'+
          '<div class="actions">'+(wa ? '<a class="btn press" target="_blank" rel="noopener" href="'+esc(waLink(wa, msg))+'">'+I("chat")+' Kirim lewat WA</a>' : '')+'<button class="btn ghost" id="tpCopy">Salin</button><button class="btn ghost" data-act="close-modal">Tutup</button></div></div></div>';
        document.getElementById("tpCopy").onclick = () => { try{ navigator.clipboard.writeText(msg); toast("Disalin"); }catch(_){ toast("Gagal menyalin"); } };
        accLoad();
      }catch(err){ toast(String(err.message || err).replace(/^.*?:\s*/, "")); }
    }); return;
  }
  if(a === "m-new"){ S.own.mf = {id:null, d:{category:CATS[0], area:"Ujungbatu"}, menu:[{},{},{}], removed:[]}; render(); scrollTo(0, 0); return; }
  if(a === "m-cancel"){ S.own.mf = null; render(); return; }
  if(a === "m-edit"){
    const s0 = ((S.own.m || {}).stores || []).find(x => x.id === id); if(!s0) return;
    S.own.mf = {id, hasMenuPhoto:s0.hasMenuPhoto, login:s0.login || "", owners:+s0.owners || 0, d:{name:s0.name, category:s0.category, area:s0.area, hours:s0.hours, address:s0.address, wa:s0.wa || "", lat:s0.lat, lng:s0.lng},
      menu:(s0.products || []).map(p => ({id:p.id, name:p.name, price:String(p.price || ""), img:p.img || ""})).concat([{}]), removed:[]};
    render(); scrollTo(0, 0); return;
  }
  if(a === "m-row-add"){ mSync(); S.own.mf.menu.push({}); render(); return; }
  if(a === "m-row-del"){ mSync(); const m = S.own.mf.menu.splice(+v, 1)[0]; if(m && m.id) S.own.mf.removed.push(m.id); if(!S.own.mf.menu.length) S.own.mf.menu.push({}); render(); return; }
  if(a === "m-gps"){
    try{ el.disabled = true; const c = await getPos(); mSync(); S.own.mf.d.lat = c.lat; S.own.mf.d.lng = c.lng; const r = areaOf(c); render(); toast(r ? "Lokasi diambil · wilayah " + regionName(r) : "Lokasi di luar wilayah layanan JAGA"); }
    catch(err){ el.disabled = false; toast(err.message); } return;
  }
  if(a === "m-open"){
    const s0 = ((S.own.m || {}).stores || []).find(x => x.id === id); if(!s0) return;
    try{ await sbStore.rpc("jt_owner_mstore_save", {p_id:id, p_data:{name:s0.name, category:s0.category, area:s0.area, hours:s0.hours, address:s0.address, lat:s0.lat, lng:s0.lng, open:v === "1"}}); toast(v === "1" ? "Toko dibuka" : "Toko ditutup sementara"); S.own.mSig = ""; loadMData(); }
    catch(err){ toast(String(err.message || err).replace(/^.*?:\s*/, "")); } return;
  }
  if(a === "m-ok" || a === "m-no"){
    let note = "";
    if(a === "m-no"){ note = prompt("Alasan menolak (dikirim ke pembeli):", "Toko sedang tutup / menu habis"); if(note === null) return; }
    el.disabled = true;
    try{ await sbStore.rpc("jt_owner_morder_decide", {p_id:id, p_ok:a === "m-ok", p_note:note}); notifyPush("order", id); toast(a === "m-ok" ? "Disetujui · mencari driver terdekat" : "Pesanan ditolak"); S.own.mSig = ""; loadMData(); }
    catch(err){ el.disabled = false; toast(String(err.message || err).replace(/^.*?:\s*/, "")); } return;
  }
  if(a === "own-rec-ok"){
    confirmModal("Hubungkan akun “" + (el.dataset.n || "") + "” ke HP peminta? Pastikan Anda sudah memastikan pemiliknya lewat WhatsApp.", "Ya, konfirmasi", async () => {
      try{ await sbStore.rpc("jt_owner_recover_decide", {p_id:Number(el.dataset.id), p_ok:true, p_target:v, p_note:""}); toast("Akun dipulihkan. Peminta otomatis masuk dan diminta membuat password baru."); S.own.recSig = ""; loadOwnerRec(); }
      catch(err){ toast(String(err.message || err).replace(/^.*?:\s*/, "")); }
    }); return;
  }
  if(a === "own-rec-no"){
    const note = prompt("Alasan menolak (dikirim ke peminta):", "Data tidak cocok dengan akun mana pun.");
    if(note === null) return;
    try{ await sbStore.rpc("jt_owner_recover_decide", {p_id:Number(el.dataset.id), p_ok:false, p_target:null, p_note:note}); toast("Permintaan ditolak"); S.own.recSig = ""; loadOwnerRec(); }
    catch(err){ toast(String(err.message || err).replace(/^.*?:\s*/, "")); }
    return;
  }
  if(a === "own-tab"){ S.own.tab = v; if(v === "pulih"){ S.own.recSig = ""; loadOwnerRec(); } S.own.focus = el.dataset.focus || null; if(v === "laporan") loadOwnerReports(); if(v === "saldo" || v === "toko" || v === "driver") loadOwnerWallet(); if(v === "pesan") loadOwnThreads(); render(); window.scrollTo(0,0);
    if(S.own.focus) setTimeout(() => { const f = document.querySelector(".focus"); if(f) f.scrollIntoView({block:"center", behavior:"smooth"}); }, 120); return; }
  if(a === "own-thread"){ S.own.thread = v || null; render(); if(v) loadOwnMsgs(v, true); return; }
  if(a === "own-ifilter"){ S.own.ifilter = v; render(); return; }
  if(a === "own-sopen"){ S.own.storePage = id; S.own.focus = null; render(); window.scrollTo(0, 0); return; }
  if(a === "own-sback"){ const id0 = S.own.storePage; S.own.storePage = ""; render(); setTimeout(() => { const t = document.querySelector('.otile[data-id="'+id0+'"]'); if(t) t.scrollIntoView({block:"center"}); }, 60); return; }
  if(a === "own-sf"){ S.own.sf = v; render(); return; }
  if(a === "own-sr"){ S.own.sr = v; render(); ownMapFit(); return; }
  if(a === "own-msg"){ S.own.tab = "pesan"; S.own.thread = v; render(); window.scrollTo(0,0); loadOwnMsgs(v, true); return; }
  if(a === "own-msg-new"){ const D = ownD(); if(!(D.stores||[]).length && !(D.drivers||[]).length) return toast("Belum ada toko atau driver."); openOwnNewMsg(D, ""); return; }
  if(a === "own-quick"){ const t = document.querySelector("#ownSupForm textarea"); if(t){ t.value = v; t.focus(); } return; }
  if(a === "own-store-del"){
    const id = el.dataset.id;
    confirmModal("Hapus toko “"+v+"” secara permanen? Semua produk, login, dan catatan stoknya ikut terhapus. Riwayat pesanan tetap disimpan. Tindakan ini tidak bisa dibatalkan.", "Hapus toko", ownAct("del", async () => {
      if(SB) await ownRpc("jt_owner_store_delete", {p_store:id});
      else { if(S.orders.some(o => o.storeId === id && !["selesai","dibatalkan"].includes(o.status))) throw srvErr("Toko masih punya pesanan berjalan. Selesaikan atau tutup pesanan itu dulu"); for(const pr of (S.products[id]||[])) await store.del("stores/"+id+"/products/"+pr.id); await store.del("stores/"+id); }
    }, "Toko dihapus"));
    return;
  }
  if(a === "own-drv-active"){
    const id = el.dataset.id, on = v === "1", name = el.dataset.name || "driver";
    if(on){ confirmModal("Aktifkan kembali akun "+name+"? Driver bisa ONLINE dan menerima order lagi.", "Aktifkan", ownAct("on", async () => {
      if(SB) await ownRpc("jt_owner_driver_active", {p_driver:id, p_active:true, p_note:""}); else await store.update("drivers/"+id, {suspended:false, suspendNote:""});
      try{ await SUP.send("drv:"+id, "Akun driver Anda sudah diaktifkan kembali. Selamat narik lagi!", "owner"); }catch(_){}
    }, "Driver diaktifkan")); return; }
    document.getElementById("modal").innerHTML = '<div class="modal-bg" data-act="modal-bg"><form class="modal" id="ownSuspend" data-id="'+esc(id)+'"><h2 class="sec" style="margin-top:0">Nonaktifkan '+esc(name)+'?</h2><p class="muted">Driver langsung OFFLINE dan tidak bisa menerima order sampai diaktifkan lagi. Alasan dikirim ke driver lewat pesan.</p>'+
      '<label class="f">Alasan</label><textarea class="in" name="note" rows="3" maxlength="200" required placeholder="Contoh: banyak keluhan pelanggan, mohon hubungi tim JAGA."></textarea>'+
      '<div class="actions" style="margin-top:16px"><button class="btn danger" style="flex:1">Nonaktifkan</button><button type="button" class="btn ghost" data-act="close-modal">Batal</button></div></form></div>';
    return;
  }
  if(a === "own-drv-del"){
    const id = el.dataset.id;
    confirmModal("Hapus akun driver “"+v+"” secara permanen? Riwayat pesanan dan saldo tetap tercatat, tetapi akun dan pesannya terhapus. Nomor WA dan platnya bisa dipakai mendaftar lagi.", "Hapus driver", ownAct("del", async () => {
      if(SB) await ownRpc("jt_owner_driver_delete", {p_driver:id});
      else { if(S.orders.concat(S.ridesAll||[]).some(o => o.driverId === id && DRV_BUSY.includes(o.status))) throw srvErr("Driver sedang membawa pesanan. Tunggu selesai dulu"); await store.del("drivers/"+id); }
    }, "Driver dihapus"));
    return;
  }
  if(a === "own-range"){ S.own.range = v; render(); return; }
  if(a === "own-ofilter"){ S.own.ofilter = v; render(); return; }
  if(a === "buyer-check"){ await loadBuyer(); if(buyerOk()){ closeModal(); toast("Akun disetujui. Silakan memesan."); } else buyerModal(); return; }
  if(a === "own-buyer-do"){ const ok = el.dataset.v === "1"; let note = ""; if(!ok){ const n = prompt("Alasan penolakan (boleh dikosongkan)"); if(n === null) return; note = n; } await safe(async () => { await sbStore.rpc("jt_owner_buyer_decide", {p_id:el.dataset.id, p_ok:ok, p_note:note}); await loadOwnerBuyers(); }, ok ? "Pembeli disetujui" : "Pendaftaran ditolak"); return; }
  if(a === "own-buyer-gate"){ await safe(async () => { await sbStore.rpc("jt_owner_buyer_gate", {p_on:el.dataset.v === "1"}); await loadOwnerBuyers(); }, el.dataset.v === "1" ? "Pendaftaran pembeli diwajibkan" : "Pendaftaran pembeli dimatikan"); return; }
  if(a === "own-refresh"){ loadOwnerBuyers(); S.own.sig = ""; await ownRefresh(); toast("Data diperbarui"); return; }
  if(a === "own-logout"){ confirmModal("Keluar dari portal owner di perangkat ini?", "Keluar", async () => { try{ await SB.rpc("jt_owner_logout", {p_key: KEY}); }catch(_){} S.own.sig = ""; await ownRefresh(); render(); }); return; }
  if(a === "own-store-active"){
    const id = el.dataset.id, on = v === "1";
    confirmModal(on ? "Aktifkan kembali toko ini?" : "Nonaktifkan toko ini? Toko tidak akan tampil di aplikasi pembeli.", on ? "Aktifkan" : "Nonaktifkan", async () => {
      try{
        if(SB){ const { error } = await SB.rpc("jt_owner_store_active", {p_store:id, p_active:on, p_key:KEY}); if(error) throw sbErr(error); }
        else await store.update("stores/"+id, {active:on});
        toast(on ? "Toko diaktifkan" : "Toko dinonaktifkan");
      }catch(err){ toast(String(err.message||"Gagal").replace(/^.*?:\s*/, "")); }
      S.own.sig = ""; await ownRefresh(); render();
    });
  }
});
document.addEventListener("submit", async e => {
  const f = e.target;
  if(f.id === "ownerLogin"){
    e.preventDefault();
    const fd = new FormData(f), btn = f.querySelector("button.btn"); btn.disabled = true;
    try{
      const { data, error } = await SB.rpc("jt_owner_login", {p_login: fd.get("login"), p_pass: fd.get("pass"), p_key: KEY});
      if(error) throw sbErr(error);
      if(!data || !data.ok) throw new Error((data && data.error) || "Login atau password salah");
      S.own.sig = ""; await ownRefresh(); render(); toast("Selamat datang, owner!");
    }catch(err){ toast(String(err.message||"Gagal masuk").replace(/^.*?:\s*/, "")); btn.disabled = false; }
  }
  if(f.id === "ownerPass"){
    e.preventDefault();
    const p = new FormData(f).get("pass");
    try{ const { error } = await SB.rpc("jt_owner_setpass", {p_pass:p, p_key:KEY}); if(error) throw sbErr(error); f.reset(); toast("Password owner diganti"); }
    catch(err){ toast(String(err.message||"Gagal").replace(/^.*?:\s*/, "")); }
  }
});

/* ============ Chat di dalam aplikasi (per pesanan: pembeli · toko · driver) ============ */
S.chatMsgs = []; S.chatCounts = {};
let CHAT_SEEN = {}; try{ CHAT_SEEN = JSON.parse(localStorage.getItem("jt_chat_seen") || "{}") || {}; }catch(e){}
function saveSeen(){ try{ localStorage.setItem("jt_chat_seen", JSON.stringify(CHAT_SEEN)); }catch(e){} }
const ROLE_L = {pembeli:"Pembeli", toko:"Toko", driver:"Driver"};
const CHAT = {
  async list(oid, after){
    if(SB){ const r = await sbStore.rpc("jt_chat_list", {p_order:oid, p_after:after||0}); return r.msgs || []; }
    return S.chatMsgs.filter(m => m.orderId === oid && m.id > (after||0)).sort((a,b) => a.id - b.id);
  },
  async send(oid, role, name, body){
    if(SB) return sbStore.rpc("jt_chat_send", {p_order:oid, p_role:role, p_name:name, p_body:body});
    const id = Date.now();
    await store.set("chatmsgs/m" + id + Math.random().toString(36).slice(2,5), {orderId:oid, id, role, name, body:String(body).slice(0,500), at:id});
  },
  async photo(oid, role, name, data){
    if(SB) return sbStore.rpc("jt_chat_photo", {p_order:oid, p_role:role, p_name:name, p_photo:data, p_body:""});
    const id = Date.now();
    await store.set("chatmsgs/m" + id + Math.random().toString(36).slice(2,5), {orderId:oid, id, role, name, body:"📷 Foto lokasi", photo:data, at:id});
  },
  async counts(){
    if(SB) return await sbStore.rpc("jt_chat_counts", {}) || {};
    const out = {};
    S.chatMsgs.forEach(m => { const c = out[m.orderId] || (out[m.orderId] = {n:0, last:0}); c.n++; if(m.id > c.last){ c.last = m.id; c.role = m.role; c.body = m.body; } });
    return out;
  }
};
function myChatRole(){ return S.role === "seller" ? "toko" : S.role === "driver" ? "driver" : "pembeli"; }
function chatUnread(oid, role){
  const c = S.chatCounts[oid]; role = role || myChatRole();
  return !!(c && c.last > (CHAT_SEEN[oid] || 0) && c.role !== role);
}
function chatBtn(o, role, label, cls){
  const un = chatUnread(o.id, role);
  return '<button class="btn '+(cls||"sm")+' press chatbtn'+(un?' unread':'')+'" data-act="open-chat" data-id="'+esc(o.id)+'" data-role="'+role+'">'+I("chat")+' '+esc(label||"Chat")+(un?'<span class="cdot"></span>':'')+'</button>';
}
/* notifikasi pesan baru saat chat tidak dibuka */
let chatTimer = null, chatFirst = true;
async function chatPoll(){
  if(document.hidden) return;
  const role = myChatRole();
  const relevant = S.role === "driver" ? (S.drv.mine||[]).length : S.role === "owner" ? 0 : S.orders.length + (S.rides||[]).length;
  if(!relevant) return;
  try{
    const c = await CHAT.counts();
    const prev = S.chatCounts; S.chatCounts = c || {};
    if(!chatFirst){
      Object.entries(S.chatCounts).forEach(([oid, x]) => {
        const old = prev[oid];
        if(x.role !== role && (!old || x.last > old.last) && chatOpen.oid !== oid){ notify("Pesan dari " + (ROLE_L[x.role]||"chat"), x.body || "pesan baru", {kind:"chat", act:() => openChat(oid, role)}); }
      });
    }
    chatFirst = false;
    if(JSON.stringify(prev) !== JSON.stringify(S.chatCounts) && !typing()) scheduleRender();
  }catch(e){}
}
function startChatPoll(){ if(chatTimer) return; chatPoll(); chatTimer = setInterval(chatPoll, 8000); }

/* ---------- jendela chat ---------- */
const chatOpen = {oid:null, role:null, msgs:[], last:0, timer:null};
function chatOrder(oid){ return S.orders.find(o => o.id === oid) || (S.rides||[]).find(o => o.id === oid) || (S.drv.mine||[]).find(o => o.id === oid) || null; }
function chatQuick(o, role){
  const est = o && ongkirEstOf(o) != null ? rp(ongkirEstOf(o)) : "Rp…";
  if(o && isRide(o)) return role === "driver" ? ["Saya menuju titik jemput", "Saya sudah sampai di titik jemput", "Posisi tepatnya di mana?", "Tarifnya "+rp(o.fareEst||0)+" ya"] : ["Saya tunggu di titik jemput", "Saya pakai baju …", "Sudah sampai mana, Pak?", "Mohon tunggu sebentar ya"];
  if(role === "driver") return ["Saya menuju toko", "Pesanan sudah saya ambil, otw ke lokasi", "Saya sudah di depan", "Ongkirnya "+est+" ya, bisa?", "Alamatnya sesuai titik di peta?"];
  if(role === "toko") return ["Pesanan sedang disiapkan", "Pesanan sudah siap diambil", "Maaf, ada barang yang habis", "Terima kasih sudah belanja!"];
  return ["Pesanan saya sudah diproses?", "Saya tunggu di rumah ya", "Tolong kabari kalau sudah dekat", "Ongkirnya bisa "+est+"?"];
}
function chatName(o, role){
  if(role === "driver") return (S.drv.me && S.drv.me.name) || "Driver";
  if(role === "toko") return (o && o.storeName) || "Toko";
  return (o && o.buyer && o.buyer.name) || (o && o.rider && o.rider.name) || getProf().name || "Pembeli";
}
function renderChatMsgs(){
  const box = document.getElementById("chatList"); if(!box) return;
  const near = box.scrollHeight - box.scrollTop - box.clientHeight < 80;
  box.innerHTML = chatOpen.msgs.length ? chatOpen.msgs.map(m => {
    const mine = m.role === chatOpen.role;
    return '<div class="cm '+(mine?"me":"them")+' r-'+esc(m.role)+'">'+(mine?'':'<small>'+esc(ROLE_L[m.role]||m.role)+(m.name?' · '+esc(m.name):'')+'</small>')+'<div class="bub'+(m.photo?' hasph':'')+'">'+(m.photo ? '<img class="cph" src="'+esc(m.photo)+'" alt="Foto lokasi" data-act="chat-photo-view" loading="lazy">' : '')+(m.photo && m.body === "📷 Foto lokasi" ? '' : chatLinkify(m.body))+'</div><time>'+new Date(m.at).toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"})+'</time></div>';
  }).join("") : '<div class="cempty">'+E("bell")+'<b>Belum ada pesan</b><small>'+(chatOrder(chatOpen.oid) && isRide(chatOrder(chatOpen.oid)) ? 'Chat ini antara penumpang dan driver.' : 'Chat ini terlihat oleh pembeli, toko, dan driver pesanan ini.')+'</small></div>';
  if(near || chatOpen.first){ box.scrollTop = box.scrollHeight; chatOpen.first = false; }
}
async function chatLoad(){
  if(!chatOpen.oid) return;
  try{
    const add = await CHAT.list(chatOpen.oid, chatOpen.last);
    if(add.length){
      const ids = new Set(chatOpen.msgs.map(m => m.id));
      add.forEach(m => { if(!ids.has(m.id)) chatOpen.msgs.push(m); });
      chatOpen.last = Math.max(chatOpen.last, ...add.map(m => m.id));
      CHAT_SEEN[chatOpen.oid] = chatOpen.last; saveSeen();
      renderChatMsgs();
    } else if(chatOpen.first) renderChatMsgs();
  }catch(e){ const box = document.getElementById("chatList"); if(box && !chatOpen.msgs.length) box.innerHTML = '<div class="cempty"><small>'+esc(String(e.message||"Chat belum bisa dimuat").replace(/^.*?:\s*/,""))+'</small></div>'; }
}
function openChat(oid, role){
  const o = chatOrder(oid);
  chatOpen.oid = oid; chatOpen.role = role; chatOpen.msgs = []; chatOpen.last = 0; chatOpen.first = true;
  const who = [];
  if(o && isRide(o)){ if(o.driver && o.driver.name) who.push("Driver " + o.driver.name); if(o.rider && o.rider.name) who.push("Penumpang " + o.rider.name); }
  else if(o){ who.push("Toko " + (o.storeName||"")); if(o.driver && o.driver.name) who.push("Driver " + o.driver.name); if(o.buyer && o.buyer.name && role !== "driver") who.push("Pembeli " + o.buyer.name); else if(o.buyer && o.buyer.name) who.push("Pembeli " + o.buyer.name); }
  document.getElementById("modal").innerHTML = '<div class="modal-bg chatbg" data-act="modal-bg"><div class="modal chatwin" role="dialog" aria-label="Chat pesanan">'+
    '<div class="chead"><button class="ibtn" data-act="close-chat" aria-label="Tutup">'+I("back")+'</button><div class="grow"><b>Chat '+(o && isRide(o) ? 'perjalanan' : 'pesanan')+' '+esc(o ? o.code : "")+'</b><small>'+esc(who.join(" · "))+'</small></div>'+
      '</div>'+
    '<div class="clist" id="chatList"><div class="empty">'+I("loader")+'</div></div>'+
    '<div class="cquick">'+chatQuick(o, role).map(q => '<button type="button" data-act="chat-quick" data-v="'+esc(q)+'">'+esc(q)+'</button>').join("")+'</div>'+
    '<form class="cform" id="chatForm"><label class="cbtn" aria-label="Kirim foto lokasi" title="Foto lokasi">'+I("camera")+'<input type="file" accept="image/*" capture="environment" id="chatPhoto" hidden></label>'+
      (role !== "toko" ? '<button type="button" class="cbtn" data-act="chat-loc" aria-label="Kirim titik lokasi saya" title="Kirim titik lokasi">'+I("pin")+'</button>' : '')+
      '<input class="in" name="body" maxlength="500" autocomplete="off" placeholder="Tulis pesan…"><button class="btn press" aria-label="Kirim">'+I("send")+'</button></form>'+
    (o && isRide(o) && role === "pembeli" && o.status === "driver_jemput" ? '<div class="chint">'+I("camera")+' Kirim foto tempat Anda menunggu agar driver langsung menemukan Anda.</div>' : '')+
    (o && role === "driver" && ["driver_jemput","diantar"].includes(o.status) ? '<div class="chint">'+I("camera")+' Bingung lokasinya? Minta '+(isRide(o) ? "penumpang" : "pembeli")+' mengirim foto lokasi.</div>' : '')+'</div></div>';
  chatLoad();
  clearInterval(chatOpen.timer); chatOpen.timer = setInterval(() => { if(!document.getElementById("chatList")){ clearInterval(chatOpen.timer); chatOpen.oid = null; return; } if(!document.hidden) chatLoad(); }, 3000);
}
async function chatSend(body){
  body = String(body||"").trim(); if(!body || !chatOpen.oid) return;
  const o = chatOrder(chatOpen.oid);
  try{ await CHAT.send(chatOpen.oid, chatOpen.role, chatName(o, chatOpen.role), body); await chatLoad(); chatPoll(); }
  catch(e){ toast(String(e.message||"Gagal mengirim").replace(/^.*?:\s*/,"")); }
}
ICONS.send = '<path d="M14.5 21.5 22 2 2.5 9.5l8 3.5z"/><path d="m22 2-11.5 10.5"/>';
document.addEventListener("click", e => {
  const el = e.target.closest("[data-act]"); if(!el) return;
  const a = el.dataset.act;
  if(a === "open-chat"){ e.stopPropagation(); openChat(el.dataset.id, el.dataset.role); return; }
  if(a === "close-chat"){ clearInterval(chatOpen.timer); chatOpen.oid = null; closeModal(); scheduleRender(); return; }
  if(a === "chat-quick"){ chatSend(el.dataset.v); return; }
  if(a === "chat-photo-view"){ e.stopPropagation(); const v = document.createElement("div"); v.className = "phview"; v.innerHTML = '<img src="'+esc(el.getAttribute("src"))+'" alt="Foto lokasi"><button aria-label="Tutup">✕</button>'; v.onclick = () => v.remove(); document.body.appendChild(v); return; }
  if(a === "chat-loc"){
    e.stopPropagation();
    if(!navigator.geolocation) return toast("HP ini tidak mendukung lokasi");
    el.disabled = true;
    navigator.geolocation.getCurrentPosition(p => { el.disabled = false; const la = p.coords.latitude.toFixed(6), ln = p.coords.longitude.toFixed(6); chatSend("📍 Lokasi saya sekarang (±" + Math.round(p.coords.accuracy) + " m): https://www.google.com/maps/search/?api=1&query=" + la + "," + ln); },
      () => { el.disabled = false; toast("Lokasi belum didapat. Aktifkan GPS & izin lokasi."); }, {enableHighAccuracy:true, timeout:15000, maximumAge:10000});
    return;
  }
}, true);
document.addEventListener("change", async e => {
  if(e.target.id !== "chatPhoto") return;
  const f = e.target.files && e.target.files[0]; e.target.value = ""; if(!f || !chatOpen.oid) return;
  const o = chatOrder(chatOpen.oid);
  try{
    toast("Mengirim foto…");
    let d = await compressImage(f, 1280); if(d.length > 440000) d = await compressImage(f, 900); if(d.length > 440000) d = await compressImage(f, 640);
    await CHAT.photo(chatOpen.oid, chatOpen.role, chatName(o, chatOpen.role), d); await chatLoad(); chatPoll(); toast("Foto terkirim");
  }catch(err){ toast(String((err && err.message) || "Foto gagal dikirim").replace(/^.*?:\s*/, "")); }
});
function chatLinkify(t){
  return esc(t).replace(/https:\/\/www\.google\.com\/maps\/search\/\?api=1&amp;query=(-?[\d.]+),(-?[\d.]+)/g, (m, la, ln) => '<a class="cmap" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&amp;query='+la+','+ln+'">Buka di peta</a>');
}
document.addEventListener("submit", e => {
  if(e.target.id !== "chatForm") return;
  e.preventDefault();
  const inp = e.target.querySelector("input"); const v = inp.value; inp.value = ""; inp.focus();
  chatSend(v);
});

/* ============ Jago: ojek online ============ */
let JAGO_FEE = 0.03;
const RIDE_ACTIVE = ["mencari_driver","driver_jemput","dalam_perjalanan"];
const DRV_BUSY = ["driver_ke_toko","diantar","driver_jemput","dalam_perjalanan"];
const JAGO_CENTER = {lat:0.6836, lng:100.5466}; // Ujungbatu
/* Wilayah layanan. Buka cabang baru = tambah wilayah di sini (dan di fungsi server jt_in_area). */
const AREA_DEF = [{id:"rohul", name:"Kabupaten Rokan Hulu", short:"Rokan Hulu", prov:"Riau", s:0.40, n:1.45, w:100.03, e:101.00, active:true}];
let AREAS = AREA_DEF, AREA_NAME = "", AREA_MSG = "", AU = null, AREAS_ALL = AREA_DEF;
const inArea = c => locOk(c) && AREAS.some(a => c.lat >= a.s && c.lat <= a.n && c.lng >= a.w && c.lng <= a.e);
function setAreas(list){
  if(Array.isArray(list) && list.length) AREAS_ALL = list;
  const act = AREAS_ALL.filter(a => a.active !== false && isFinite(a.s) && isFinite(a.n) && isFinite(a.w) && isFinite(a.e));
  AREAS = act.length ? act : AREA_DEF;
  AREA_NAME = AREAS.map(a => a.name + (a.prov ? ", " + a.prov : "")).join("; ");
  AREA_MSG = "JAGA saat ini baru melayani " + AREA_NAME + ".";
  AU = {s:Math.min(...AREAS.map(a => a.s)), n:Math.max(...AREAS.map(a => a.n)), w:Math.min(...AREAS.map(a => a.w)), e:Math.max(...AREAS.map(a => a.e))};
}
setAreas(AREA_DEF);
const AREA_API = {
  async list(){ if(SB){ const { data, error } = await SB.rpc("jt_areas", {}); if(error) throw sbErr(error); return data || []; } return (S.areasLocal || AREA_DEF); },
  async save(list){ if(SB) return sbStore.rpc("jt_owner_areas_save", {p_areas:list}); await store.set("settings/areas", {list}); S.areasLocal = list; }
};

/* teks "3%" di layar mengikuti komisi yang diatur owner (hanya bila bukan 3%) */
(function(){
  const fix = root => {
    if(COMM.storePct === 3 && COMM.drvPct === 3) return;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null); const arr = []; let n;
    while((n = w.nextNode())) if(/(^|[^\d.,])3%/.test(n.nodeValue)) arr.push(n);
    arr.forEach(t => { const low = String(t.nodeValue + " " + (t.parentNode && t.parentNode.textContent || "")).toLowerCase(); const store = /bagi hasil|penjualan|toko/.test(low) && !/driver|jago|ongkir/.test(String(t.nodeValue).toLowerCase());
      t.nodeValue = t.nodeValue.replace(/(^|[^\d.,])3%/g, (m, a) => a + fmtPct(store ? COMM.storePct : COMM.drvPct) + "%"); });
  };
  let tm = 0; new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(() => fix(document.body), 80); }).observe(document.body, {childList:true, subtree:true, characterData:false});
})();
async function loadComm(){ try{ if(SB){ const { data } = await SB.rpc("jt_comm_cfg", {}); if(data){ applyComm(data); scheduleRender(); } } else applyComm(wCfgLocal()); }catch(e){} }
async function loadAreas(){ try{ const l = await AREA_API.list(); if(l && l.length){ setAreas(l); scheduleRender(); } }catch(e){} }
/* ---------- wilayah: pembeli hanya melihat toko di wilayahnya ---------- */
const areaOf = c => { if(!locOk(c)) return null; const a = AREAS.find(a => c.lat >= a.s && c.lat <= a.n && c.lng >= a.w && c.lng <= a.e); return a ? a.id : null; };
const storeRegion = st => (st.region && AREAS.some(a => a.id === st.region)) ? st.region : areaOf(st);
function buyerRegion(){
  if(AREAS.length < 2) return AREAS[0] ? AREAS[0].id : null;
  const r = lsGet("jt_region"); if(r && AREAS.some(a => a.id === r)) return r;
  return areaOf(getProf());
}
function regionOk(st){
  if(AREAS.length < 2) return true;
  const br = buyerRegion(); if(!br) return false;
  return storeRegion(st) === br;
}
const regionName = id => { const a = AREAS.find(x => x.id === id); return a ? (a.short || a.name) : "-"; };
/* deteksi lokasi otomatis saat aplikasi dibuka: wilayah dipilih sendiri tanpa bertanya */
const GEO = {state:"idle", at:0, out:false};
async function autoLocate(force){
  if(GEO.state === "busy" || S.role !== "buyer") return;
  if(!force && GEO.at && Date.now() - GEO.at < 10 * 60e3) return;
  if(!navigator.geolocation){ GEO.state = "fail"; return; }
  GEO.state = "busy"; GEO.at = Date.now(); if(!buyerRegion()) scheduleRender();
  try{
    const c = await getPos();
    try{ localStorage.setItem("jt_here", JSON.stringify({lat:c.lat, lng:c.lng, at:Date.now()})); }catch(_){}
    const r = areaOf(c), old = lsGet("jt_region");
    GEO.out = !r; GEO.state = "done";
    if(r && r !== old){
      lsSet("jt_region", r);
      if(S.cart && S.cart.storeId){ const cs = storeById(S.cart.storeId); if(cs && storeRegion(cs) !== r){ S.cart = {storeId:null, items:{}}; saveCart(); } }
      if(old) toast("Lokasi terdeteksi di " + regionName(r) + ". Menampilkan toko di sekitar Anda.");
    }
  }catch(_){ GEO.state = "fail"; }
  scheduleRender();
}
document.addEventListener("visibilitychange", () => { if(!document.hidden) autoLocate(); });
function regionPicker(){
  if(AREAS.length < 2) return "";
  const br = buyerRegion();
  if(!br && (GEO.state === "busy" || GEO.state === "idle")) return '<div class="regpick'+ra(1)+'">'+E("pin")+'<div class="grow"><b>Mendeteksi lokasi Anda…</b><small>Izinkan akses lokasi agar kami tampilkan toko-toko di sekitar Anda.</small></div></div>';
  if(br) return '<div class="regline">'+I("pin")+'<span>Wilayah: <b>'+esc(regionName(br))+'</b></span><button class="linkbtn small" data-act="region-pick">Ganti</button></div>';
  return '<div class="regpick'+ra(1)+'">'+E("pin")+'<div class="grow"><b>'+(GEO.out ? 'Lokasi Anda di luar wilayah layanan' : 'Pilih wilayah Anda')+'</b><small>'+(GEO.out ? 'JAGA saat ini melayani '+esc(AREAS.map(a => a.short || a.name).join(" dan "))+'. Pilih wilayah tujuan pesanan:' : 'Lokasi tidak terbaca. Izinkan akses lokasi, atau pilih wilayah secara manual:')+'</small></div>'+
    '<div class="regbtns">'+AREAS.map(a => '<button class="chip press" data-act="region-set" data-v="'+esc(a.id)+'">'+esc(a.short || a.name)+'</button>').join("")+
    '<button class="chip press" data-act="region-gps">'+I("pin")+' Pakai lokasi saya</button></div></div>';
}
function regionModal(){
  document.getElementById("modal").innerHTML = '<div class="modal-bg" data-act="modal-bg"><div class="modal"><h2 class="sec">Pilih wilayah</h2><p class="small muted" style="margin-top:0">Toko yang tampil hanya dari wilayah yang dipilih.</p><div class="regbtns col">'+
    AREAS.map(a => '<button class="btn '+(a.id === buyerRegion() ? '' : 'ghost ')+'block" data-act="region-set" data-v="'+esc(a.id)+'">'+esc(a.name)+(a.prov ? ', ' + esc(a.prov) : '')+'</button>').join("")+
    '<button class="btn ghost block" data-act="region-gps">'+I("pin")+' Pakai lokasi saya</button></div></div></div>';
}
function setRegion(id){
  lsSet("jt_region", id);
  if(S.cart && S.cart.storeId){ const cs = storeById(S.cart.storeId); if(cs && storeRegion(cs) !== id){ S.cart = {storeId:null, items:{}}; saveCart(); } }
  closeModal(); render(); toast("Menampilkan toko di " + regionName(id));
}
function areaBanner(){
  return '<div class="areabox">'+E("pin")+'<div class="grow"><b>Di luar wilayah layanan</b><small>'+esc(AREA_MSG)+'</small></div></div>';
}
S.rides = []; S.ridesAll = []; S.ridesReady = false;
S.jago = {pick:null, dest:null, mode:"pick", q:"", res:null, searching:false, gps:false, seen:{}};
const isRide = o => !!o && o.kind === "ride";
const rideFee = v => commCalc(v, "drv");
const shortAddr = a => String(a || "").split(",").slice(0, 2).join(",").trim();
const fmtLL = c => c ? c.lat.toFixed(5) + ", " + c.lng.toFixed(5) : "";
const telLink = wa => "tel:" + String(wa || "").replace(/[^\d+]/g, "");

/* ---------- data penumpang ---------- */
const RIDE = {
  async create(id, data){
    if(SB) return sbStore.rpc("jt_ride_create", {p_id:id, p_data:data});
    const r = data.rider || {}, p = data.pickup || {}, d = data.dest || {};
    if(!String(r.name || "").trim() || String(r.wa || "").replace(/\D/g, "").length < 9) throw srvErr("Isi nama dan nomor WhatsApp");
    if(!locOk(p)) throw srvErr("Atur titik jemput dulu");
    if(!locOk(d)) throw srvErr("Pilih tujuan dulu");
    const dS = distM(p, d);
    if(dS < 100) throw srvErr("Tujuan terlalu dekat dengan titik jemput");
    if(dS > 50000) throw srvErr("Jarak maksimal 50 km");
    const dist = data.roadDist >= dS && data.roadDist <= dS * 3 + 1000 ? data.roadDist : dS;
    if(S.rides.some(x => RIDE_ACTIVE.includes(x.status))) throw srvErr("Masih ada perjalanan Jago yang berjalan");
    const now = Date.now();
    const v = Object.assign({}, data, {kind:"ride", code:"JG-" + new Date().toISOString().slice(2, 10).replace(/-/g, "") + "-" + Math.random().toString(36).slice(2, 6).toUpperCase(),
      riderId:ME, dist:Math.round(dist), fareEst:ongkirByDist(dist), voucher:data.useSaldo && buyerAvail() > 0 ? Math.min(buyerAvail(), ongkirByDist(dist)) : undefined, ratePer500:2000, feeRate:JAGO_FEE, status:"mencari_driver", searchAt:now, createdAt:now, updatedAt:now});
    await store.set("rides/" + id, v);
    return Object.assign({id}, v);
  },
  async list(){ return SB ? (await sbStore.rpc("jt_rides", {}) || []) : S.ridesAll.filter(r => r.riderId === ME); },
  async act(id, act){
    if(SB) return sbStore.rpc("jt_ride_act", {p_id:id, p_act:act});
    const o = S.ridesAll.find(x => x.id === id), now = Date.now();
    if(!o) throw srvErr("Perjalanan tidak ditemukan");
    if(act === "cancel"){
      if(!["mencari_driver","driver_jemput"].includes(o.status)) throw srvErr("Perjalanan tidak bisa dibatalkan lagi");
      await store.update("rides/" + id, {status:"dibatalkan", cancelBy:"penumpang", cancelAt:now, updatedAt:now});
    } else if(act === "retry"){
      if(o.status !== "mencari_driver") throw srvErr("Driver sudah ditemukan");
      await store.update("rides/" + id, {searchAt:now, declined:[], updatedAt:now});
    }
  }
};
function rideNotify(rows){
  rows.forEach(r => {
    const old = S.jago.seen[r.id]; S.jago.seen[r.id] = r.status;
    if(!old || old === r.status) return;
    const m = {driver_jemput:"Driver Jago ditemukan! Sedang menuju titik jemput.", dalam_perjalanan:"Selamat jalan! Perjalanan dimulai.", selesai:"Perjalanan selesai. Terima kasih sudah naik Jago!"}[r.status];
    if(m){ notify("Jago " + (r.code || ""), m, {kind:r.status === "selesai" ? "done" : "ride", act:() => { go("jago", {}); S.jago.open = r.id; render(); }});
      if(typeof VA !== "undefined" && VA.used && !VA.open && window.speechSynthesis){ try{ const u = new SpeechSynthesisUtterance(m.replace("Jago", "Jago")); u.lang = "id-ID"; if(ID_VOICE) u.voice = ID_VOICE; speechSynthesis.speak(u); }catch(_){} } }
  });
}
function setRides(rows){
  const sig = JSON.stringify(rows);
  if(!S.ridesReady){ rows.forEach(r => S.jago.seen[r.id] = r.status); }
  else rideNotify(rows);
  S.ridesReady = true;
  if(sig === S._rideSig) return;
  S._rideSig = sig; S.rides = rows;
  if(S.role !== "driver" && S.role !== "owner" && ["jago","orders","home"].includes(S.view) && !typing()) scheduleRender();
}
let rideBusy = false;
async function rideRefresh(){
  if(!SB || rideBusy) return; rideBusy = true;
  try{ setRides(await RIDE.list()); }catch(e){}
  rideBusy = false;
}
setInterval(() => {
  if(document.hidden || !SB || S.role === "driver" || S.role === "owner") return;
  const live = S.rides.some(r => RIDE_ACTIVE.includes(r.status));
  if(live || S.view === "jago") rideRefresh();
}, 5000);
setInterval(() => { if(!document.hidden && SB && S.role !== "driver" && S.role !== "owner") rideRefresh(); }, 30000);

/* ---------- pencarian lokasi: Google Maps (jika ada kunci) atau OpenStreetMap ---------- */
const GKEY = String(CFG.googleMapsKey || "").trim();
let GM_P = null, GM_FAIL = false, GM_TOKEN = null;
function loadGoogle(){
  if(!GKEY || GM_FAIL) return Promise.reject(new Error("no-google"));
  if(GM_P) return GM_P;
  GM_P = new Promise((res, rej) => {
    window.__jtGm = async () => { try{ await google.maps.importLibrary("places"); await google.maps.importLibrary("geocoding"); res(); }catch(e){ rej(e); } };
    window.gm_authFailure = () => { GM_FAIL = true; };
    const sc = document.createElement("script");
    sc.src = "https://maps.googleapis.com/maps/api/js?key=" + encodeURIComponent(GKEY) + "&v=weekly&language=id&region=ID&loading=async&callback=__jtGm";
    sc.onerror = () => { GM_P = null; rej(new Error("gmaps")); };
    document.head.appendChild(sc);
  });
  return GM_P;
}
const usingGoogle = () => !!GKEY && !GM_FAIL;
const photonAddr = p => [p.name, [p.street, p.housenumber].filter(Boolean).join(" "), p.district || p.locality, p.city || p.county, p.state].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);
const PLACE = {
  async suggest(q, near){
    const c = near || JAGO_CENTER;
    if(usingGoogle()){
      try{
        await loadGoogle();
        if(!GM_TOKEN) GM_TOKEN = new google.maps.places.AutocompleteSessionToken();
        const {suggestions} = await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions({input:q, sessionToken:GM_TOKEN, language:"id", region:"id", includedRegionCodes:["id"],
          locationRestriction:{south:AU.s, north:AU.n, west:AU.w, east:AU.e}, origin:{lat:c.lat, lng:c.lng}});
        return (suggestions || []).filter(x => x.placePrediction).slice(0, 8).map(x => { const p = x.placePrediction;
          return {name:(p.mainText && p.mainText.text) || p.text.text, address:(p.secondaryText && p.secondaryText.text) || "", dist:near ? p.distanceMeters : null, pred:p}; });
      }catch(e){ if(GM_FAIL) return this.suggest(q, near); throw e; }
    }
    let out = [];
    try{
      const r = await fetch("https://photon.komoot.io/api/?limit=12&bbox=" + [AU.w, AU.s, AU.e, AU.n].join(",") + "&lat=" + c.lat + "&lon=" + c.lng + "&q=" + encodeURIComponent(q));
      const j = await r.json();
      out = (j.features || []).map(f => { const p = f.properties || {}, a = photonAddr(p), ll = {lat:+f.geometry.coordinates[1].toFixed(6), lng:+f.geometry.coordinates[0].toFixed(6)};
        return Object.assign(ll, {name:a[0] || q, address:a.slice(1, 4).join(", "), dist:near ? distM(c, ll) : null}); }).filter(inArea);
    }catch(e){}
    if(out.length < 4){ /* cadangan: Nominatim (OSM) di dalam batas wilayah, mencakup jalan, desa, dan tempat yang tidak ada di Photon */
      try{
        const r2 = await fetch("https://nominatim.openstreetmap.org/search?format=jsonv2&limit=10&accept-language=id&addressdetails=0&bounded=1&viewbox=" + [AU.w, AU.n, AU.e, AU.s].join(",") + "&q=" + encodeURIComponent(q));
        const j2 = await r2.json();
        (j2 || []).forEach(x => { const ll = {lat:+(+x.lat).toFixed(6), lng:+(+x.lon).toFixed(6)}; if(!inArea(ll)) return;
          if(out.some(o => Math.abs(o.lat - ll.lat) < 0.0004 && Math.abs(o.lng - ll.lng) < 0.0004)) return;
          const parts = String(x.display_name || "").split(", ");
          out.push(Object.assign(ll, {name:x.name || parts[0] || q, address:parts.slice(1, 4).join(", "), dist:near ? distM(c, ll) : null})); });
      }catch(e){}
    }
    return out.slice(0, 8);
  },
  async resolve(it){
    if(it.pred){
      const pl = it.pred.toPlace();
      await pl.fetchFields({fields:["location","displayName","formattedAddress"]});
      GM_TOKEN = null;
      if(!inArea({lat:pl.location.lat(), lng:pl.location.lng()})) throw new Error(AREA_MSG);
      const nm = pl.displayName || it.name, fa = String(pl.formattedAddress || it.address || "");
      return {lat:+pl.location.lat().toFixed(6), lng:+pl.location.lng().toFixed(6), address:fa.toLowerCase().startsWith(String(nm).toLowerCase()) ? fa : nm + ", " + fa};
    }
    return {lat:it.lat, lng:it.lng, address:[it.name, it.address].filter(Boolean).join(", ")};
  },
  async reverse(c){
    if(usingGoogle()){
      try{
        await loadGoogle();
        const {results} = await new google.maps.Geocoder().geocode({location:{lat:c.lat, lng:c.lng}, language:"id"});
        if(results && results[0]) return results[0].formatted_address.split(",").slice(0, 3).join(",").trim();
      }catch(e){}
    }
    try{
      const r = await fetch("https://photon.komoot.io/reverse?lat=" + c.lat + "&lon=" + c.lng);
      const j = await r.json(); const p = ((j.features || [])[0] || {}).properties;
      if(p){ const a = photonAddr(p); if(a.length) return a.slice(0, 3).join(", "); }
    }catch(e){}
    try{
      const r = await fetch("https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=18&accept-language=id&lat=" + c.lat + "&lon=" + c.lng);
      const j = await r.json(); return (j.display_name || "").split(",").slice(0, 3).join(",");
    }catch(e){ return ""; }
  }
};
const revGeo = c => PLACE.reverse(c);
/* Buku tempat JAGA (gratis): tempat + toko lokal tampil lebih dulu, lalu data peta eksternal */
const _suggestExt = PLACE.suggest.bind(PLACE);
PLACE.suggest = async function(q, near){
  const c = near || JAGO_CENTER;
  const locP = SB ? SB.rpc("jt_place_search", {p_q:q, p_lat:c.lat, p_lng:c.lng}).then(r => (r && r.data) || []).catch(() => []) : Promise.resolve([]);
  let ext = [], extErr = null;
  try{ ext = await _suggestExt(q, near); }catch(e){ extErr = e; }
  const loc = (await locP).filter(x => typeof x.lat === "number" && inArea(x)).map(x => ({lat:x.lat, lng:x.lng, name:x.name, address:(x.src === "toko" ? "Toko · " : "Tempat JAGA · ") + (x.address || ""), src:x.src, dist:near ? distM(c, x) : null}));
  if(!loc.length && extErr) throw extErr;
  const rest = ext.filter(e => !(typeof e.lat === "number" && loc.some(l => Math.abs(l.lat - e.lat) < 0.0006 && Math.abs(l.lng - e.lng) < 0.0006)));
  return loc.concat(rest).slice(0, 10);
};
function offerSavePlace(name, c, addr){
  document.getElementById("modal").innerHTML = '<div class="modal-bg" data-act="modal-bg"><form class="modal" id="placeSave" data-lat="'+c.lat+'" data-lng="'+c.lng+'" data-addr="'+esc(addr || "")+'"><h2 class="sec">Simpan di buku tempat JAGA?</h2><p class="muted" style="margin-top:0">Supaya pengguna lain mudah menemukan tempat ini. Boleh ubah namanya. <b>Jangan simpan rumah pribadi atau nomor telepon.</b></p><label class="f">Nama tempat</label><input class="in" name="name" required minlength="3" maxlength="60" value="'+esc(name)+'"><div class="actions"><button class="btn" type="submit">Ya, simpan</button><button type="button" class="btn ghost" onclick="closeModal()">Jangan</button></div></form></div>';
}
function placesCard(){
  return SB ? '<div class="card pad"><h3 class="sub">Buku tempat</h3><div class="hint">Tempat yang disimpan pengguna dan muncul di pencarian lokasi. Hapus yang salah atau pribadi.</div><button class="btn ghost sm" data-act="own-places">'+I("pin")+' Kelola tempat</button></div>' : "";
}
async function placesOpen(){
  document.getElementById("modal").innerHTML = '<div class="modal-bg" data-act="modal-bg"><div class="modal"><h2 class="sec">Buku tempat</h2><div id="plBox" class="muted small">Memuat…</div><div class="actions"><button type="button" class="btn ghost" onclick="closeModal()">Tutup</button></div></div></div>';
  try{
    const rows = await sbStore.rpc("jt_owner_places", {}); const box = document.getElementById("plBox"); if(!box) return;
    box.innerHTML = rows && rows.length ? rows.map(r => '<div class="orow"><div class="grow"><b>'+esc(r.name)+'</b><small>'+esc(r.addr || "")+'</small><small>dipakai '+r.uses+'× · '+esc(new Date(r.created_at).toLocaleDateString("id-ID"))+'</small></div><div class="r"><a class="linkbtn small" target="_blank" rel="noopener" href="'+esc(gmLink(r))+'">Peta</a><button class="btn ghost sm" data-act="own-place-del" data-id="'+esc(r.id)+'">Hapus</button></div></div>').join("") : "Belum ada tempat tersimpan.";
  }catch(err){ const box = document.getElementById("plBox"); if(box) box.textContent = "Gagal memuat: " + String(err.message || err); }
}
const gmLink = c => "https://www.google.com/maps/search/?api=1&query=" + c.lat + "," + c.lng;

/* ---------- lembar pencarian lokasi ---------- */
let PS_T = null, PS_Q = "";
function recentPlaces(kind){
  const out = [], seen = new Set();
  S.rides.forEach(r => [r.dest, r.pickup].forEach(p => { if(!locOk(p) || !p.address) return; const k = p.address; if(seen.has(k)) return; seen.add(k); out.push({lat:p.lat, lng:p.lng, name:shortAddr(p.address).split(",")[0], address:p.address, recent:true}); }));
  return out.slice(0, 5);
}
function psRows(list, title){
  S.jago.sugg = list;
  if(!list.length) return '';
  return (title ? '<div class="ps-t">'+title+'</div>' : '') + list.map((r, i) => '<button class="ps-row" data-act="ps-pick" data-v="'+i+'">'+(r.recent ? I("clock") : r.src === "toko" ? I("store") : I("pin"))+'<div class="grow"><b>'+esc(r.name)+'</b><small>'+esc(r.address || "")+'</small></div>'+(r.dist != null && r.dist < 300000 ? '<span class="ps-d">'+kmTxt(r.dist)+'</span>' : '')+'</button>').join("");
}
function openPlaceSheet(kind){
  S.jago.sheet = kind; S.jago.mode = kind; S.jago.touched = true; PS_Q = "";
  const pk = kind === "pick";
  const rec = recentPlaces(kind);
  document.getElementById("modal").innerHTML = '<div class="modal-bg psbg" data-act="modal-bg"><div class="modal psheet">'+
    '<div class="ps-head"><i class="dot '+(pk ? "a" : "b")+'"></i><b>'+(pk ? "Jemput di mana?" : "Mau ke mana?")+'</b><button class="ps-x" data-act="ps-close" aria-label="Tutup">×</button></div>'+
    '<label class="ps-in">'+I("search")+'<input id="psq" type="search" enterkeyhint="search" autocomplete="off" placeholder="'+(pk ? "Cari lokasi jemput: jalan, masjid, toko…" : "Cari tujuan: pasar, sekolah, rumah sakit…")+'"></label>'+
    '<div class="ps-quick">'+(pk ? '<button data-act="ps-gps">'+I("pin")+' Pakai lokasi saya sekarang</button>' : '')+'<button data-act="ps-map">'+I("grid")+' Pilih di peta</button></div>'+
    '<div id="psres" class="ps-res">'+psRows(rec, rec.length ? "Terakhir dipakai" : "")+'</div>'+
    '<div class="ps-foot">Wilayah layanan: '+esc(AREA_NAME)+' · '+(usingGoogle() ? 'hasil dari Google Maps' : 'data peta © OpenStreetMap')+'</div></div></div>';
  const inp = document.getElementById("psq"); setTimeout(() => { try{ inp.focus(); }catch(e){} }, 60);
  if(usingGoogle()) loadGoogle().catch(() => {});
}
async function psSearch(q){
  const box = document.getElementById("psres"); if(!box) return;
  PS_Q = q;
  if(q.length < 2){ const rec = recentPlaces(); box.innerHTML = psRows(rec, rec.length ? "Terakhir dipakai" : ""); return; }
  box.innerHTML = '<div class="ps-t">'+I("loader")+' Mencari…</div>';
  const near = S.jago.pick || (locOk(getProf()) ? getProf() : null);
  try{
    const list = await PLACE.suggest(q, near);
    if(PS_Q !== q || !document.getElementById("psres")) return;
    S.jago.sugg = S.jago.sugg || []; box.innerHTML = list.length ? psRows(list, "") : '<div class="ps-t">Belum ada “'+esc(q)+'” di data peta (banyak tempat di kampung belum terdaftar).<br>Tidak masalah: tunjuk lokasinya langsung di peta, tulisanmu dipakai sebagai nama alamat.</div><div class="ps-quick" style="margin-top:10px"><button data-act="ps-map-label" data-q="'+esc(q)+'">'+I("grid")+' Pilih di peta: '+esc(q.slice(0,28))+'</button></div>';
  }catch(e){ if(PS_Q === q) box.innerHTML = '<div class="ps-t">Pencarian gagal. Periksa koneksi internet.</div>'; }
}
document.addEventListener("input", e => { if(e.target.id !== "psq") return; clearTimeout(PS_T); const q = e.target.value.trim(); PS_T = setTimeout(() => psSearch(q), 320); });
document.addEventListener("keydown", e => { if(e.target.id === "psq" && e.key === "Enter"){ e.preventDefault(); clearTimeout(PS_T); psSearch(e.target.value.trim()); } });
document.addEventListener("click", async e => {
  const el = e.target.closest("[data-act]"); if(!el) return;
  const a = el.dataset.act;
  if(a === "jago-sheet"){ openPlaceSheet(el.dataset.v); return; }
  if(a === "ps-close"){ closeModal(); return; }
  if(a === "ps-map"){ closeModal(); render(); toast(S.jago.mode === "pick" ? "Ketuk peta atau geser pin biru untuk titik jemput" : "Ketuk peta untuk memilih tujuan"); const m = document.querySelector(".jmapbox"); if(m) m.scrollIntoView({behavior:"smooth", block:"center"}); return; }
  if(a === "ps-map-label"){ S.jago.label = {kind:S.jago.sheet, text:String(el.dataset.q || "")}; closeModal(); render(); toast("Ketuk peta di lokasi “" + S.jago.label.text.slice(0,30) + "”"); const m = document.querySelector(".jmapbox"); if(m) m.scrollIntoView({behavior:"smooth", block:"center"}); return; }
  if(a === "ps-gps"){
    el.disabled = true; el.innerHTML = I("loader") + " Mengambil lokasi…";
    try{ const c = await getPos(); setProf(Object.assign(getProf(), c)); closeModal(); if(!inArea(c)){ S.jago.outside = true; toast("Lokasimu di luar wilayah layanan. " + AREA_MSG); render(); return; } await setJagoPoint("pick", c); if(JMAP) JMAP.map.setView([c.lat, c.lng], 16); if(!S.jago.dest) openPlaceSheet("dest"); }
    catch(err){ toast(err.message); el.disabled = false; el.innerHTML = I("pin") + " Pakai lokasi saya sekarang"; }
    return;
  }
  if(a === "ps-pick"){
    const it = (S.jago.sugg || [])[+el.dataset.v], kind = S.jago.sheet; if(!it) return;
    el.classList.add("busy");
    try{
      const c = await PLACE.resolve(it);
      closeModal();
      await setJagoPoint(kind, c, c.address);
      if(kind === "pick" && !S.jago.dest) openPlaceSheet("dest");
    }catch(err){ el.classList.remove("busy"); toast(err && err.message === AREA_MSG ? "Tempat itu di luar wilayah layanan. " + AREA_MSG : "Lokasi tidak bisa diambil, coba pilih yang lain."); }
  }
});

async function setJagoPoint(kind, c, address){
  const LB = S.jago.label; let labelText = "";
  if(LB && LB.kind === kind && !address){ labelText = LB.text; S.jago.label = null; }
  if(!inArea(c)){ toast((kind === "pick" ? "Titik jemput" : "Tujuan") + " di luar wilayah layanan. " + AREA_MSG); S.jago.outside = kind === "pick" || S.jago.outside; render(); return; }
  S.jago[kind] = {lat:c.lat, lng:c.lng, address:address || ""};
  if(kind === "pick" && !S.jago.dest) S.jago.mode = "dest";
  render();
  if(!address){ const a = await revGeo(c); const cur = S.jago[kind]; if(cur && cur.lat === c.lat && cur.lng === c.lng){ cur.address = labelText ? (labelText + (a ? " (dekat " + a + ")" : "")) : (a || ("Titik " + fmtLL(c))); if(S.view === "jago") render(); if(SB && labelText) offerSavePlace(labelText, c, a || ""); } }
}

/* ---------- tampilan penumpang ---------- */
function rideSteps(o){
  if(o.status === "dibatalkan") return "";
  const flow = ["mencari_driver","driver_jemput","dalam_perjalanan","selesai"], L_ = ["Cari driver","Menjemput","Perjalanan","Selesai"];
  const idx = flow.indexOf(o.status);
  return '<div class="steps">'+flow.map((f, i) => '<div class="step '+(i <= idx ? "done" : "")+'"><div class="bar"></div>'+L_[i]+'</div>').join("")+'</div>';
}
function rideRoute(o, drv){
  const linkP = drv && o.status === "driver_jemput" ? '<div class="dj-links"><a class="navbtn" target="_blank" rel="noopener" href="'+esc(navLink(o.pickup, o.pickup && o.pickup.address))+'">'+I("pin")+' Google Maps</a><button type="button" class="navin" data-act="nav-in" data-id="'+esc(o.id)+'">'+I("send")+' Navigasi live ke titik jemput</button></div>' : '';
  const linkD = drv && o.status === "dalam_perjalanan" ? '<div class="dj-links"><a class="navbtn" target="_blank" rel="noopener" href="'+esc(navLink(o.dest, o.dest && o.dest.address))+'">'+I("pin")+' Google Maps</a><button type="button" class="navin" data-act="nav-in" data-id="'+esc(o.id)+'">'+I("send")+' Navigasi live ke tujuan</button></div>' : '';
  return '<div class="dj-route">'+
    '<div class="pt a"><i></i><div><small>Jemput'+(drv && o.rider ? ' · '+esc(o.rider.name) : '')+'</small><b>'+esc(shortAddr(o.pickup.address) || fmtLL(o.pickup))+'</b>'+(o.pickup.address && shortAddr(o.pickup.address) !== o.pickup.address ? '<span>'+esc(o.pickup.address)+'</span>' : '')+linkP+
      (o.note ? '<span class="note">'+I("note")+' '+esc(o.note)+'</span>' : '')+'</div></div>'+
    '<div class="pt b"><i></i><div><small>Tujuan</small><b>'+esc(shortAddr(o.dest.address) || fmtLL(o.dest))+'</b>'+(o.dest.address && shortAddr(o.dest.address) !== o.dest.address ? '<span>'+esc(o.dest.address)+'</span>' : '')+linkD+'</div></div></div>';
}
function rideDriverBox(o){
  const d = o.driver || {};
  return '<div class="drvbox"><div class="drv-av">'+E("scooter")+'</div><div class="grow"><small>'+(o.status === "driver_jemput" ? "Driver menuju titik jemput" : "Kamu sedang dalam perjalanan bersama")+'</small><b>'+esc(d.name || "Driver")+' '+driverStars(o.driverId)+'</b>'+
    '<div class="small muted">'+esc([d.vehicle, d.plate].filter(Boolean).join(" · "))+'</div></div>'+
    chatBtn(o, "pembeli", "Chat driver", "ghost sm")+'</div>';
}
function rideCard(o){
  let h = '<div class="card pad rcard"><div class="dj-head">'+statusTag(o.status)+'<span class="small muted">'+esc(o.code)+' · '+fmtDate(o.createdAt)+'</span></div>'+rideSteps(o);
  if(RIDE_ACTIVE.includes(o.status)) h += buyerNotifLine();
  if(o.status === "mencari_driver"){
    h += searchBox(o, "Mencari driver Jago terdekat…");
  } else if(o.status === "driver_jemput" || o.status === "dalam_perjalanan"){
    h += rideDriverBox(o) + liveMap(o, "pembeli");
  }
  h += rideRoute(o, false);
  const fare = typeof o.fareFinal === "number" ? o.fareFinal : o.fareEst;
  h += '<div class="ongkirbox big">'+E("money")+'<div><small>'+(typeof o.fareFinal === "number" ? "Tarif dibayar" : "Perkiraan tarif")+' · jarak ±'+kmTxt(o.dist)+' · '+ONGKIR_LBL+'</small><b>'+(typeof o.fareFinal === "number" ? rp(fare) : "±"+rp(fare))+'</b>'+
    (o.status === "selesai" ? '' : '<small>Bayar tunai langsung ke driver. Tarif <b>bisa dinego</b> dengan driver.</small>')+'</div></div>'+voucherNote(o, "buyer");
  if(o.status === "mencari_driver"){
    const long = searchElapsed(o) >= 210;
    h += '<div class="actions">'+(long ? '<button class="btn press grow" data-act="ride-retry" data-id="'+esc(o.id)+'">'+I("repeat")+' Cari ulang</button>' : '')+'<button class="btn ghost press'+(long?'':' grow')+'" data-act="ride-cancel" data-id="'+esc(o.id)+'">Batalkan</button></div>';
  } else if(o.status === "driver_jemput"){
    h += '<div class="actions"><button class="btn ghost sm press" data-act="ride-cancel" data-id="'+esc(o.id)+'">Batalkan perjalanan</button></div>';
  } else if(o.status === "selesai" || o.status === "dibatalkan"){
    h += '<div class="actions"><button class="btn press grow" data-act="ride-again" data-id="'+esc(o.id)+'">'+I("repeat")+' Pesan Jago lagi</button></div>';
  }
  h += trustBox(o, "ride") + (RIDE_ACTIVE.includes(o.status) ? pushCard("buyer", "Kabari saya saat driver ditemukan dan perjalanan dimulai.") : "");
  return h + '</div>';
}
function jagoForm(){
  const J = S.jago, p = getProf();
  const rdJ = locOk(J.pick) && locOk(J.dest) ? roadDist(J.pick, J.dest) : null; if(locOk(J.pick) && locOk(J.dest) && !rdJ) ensureRoad(J.pick, J.dest);
  const dist = locOk(J.pick) && locOk(J.dest) ? (rdJ || distM(J.pick, J.dest)) : null;
  let h = (S.jago.outside || (locOk(p) && !inArea(p)) ? areaBanner() : '') + '<section class="jhero">'+E("scooter")+'<div><h2>Jago</h2><p>Ojek online di '+esc(AREAS.map(a => a.short).join(", "))+'</p><span>'+ONGKIR_LBL+' · bisa nego · bayar tunai</span></div></section>';
  h += '<div class="card jcard">';
  h += '<div class="jmode"><button class="'+(J.mode==="pick"?"on":"")+'" data-act="jago-mode" data-v="pick"><i class="dot a"></i>Atur jemput</button><button class="'+(J.mode==="dest"?"on":"")+'" data-act="jago-mode" data-v="dest"><i class="dot b"></i>Atur tujuan</button></div>';
  h += '<div class="jmapbox"><div data-jmap="1" class="jmap"></div><div class="jmaphint">'+(J.mode === "pick" ? "Ketuk peta untuk titik jemput" : "Ketuk peta untuk tujuan")+'</div>'+
    '<button class="jgps press" data-act="jago-gps" aria-label="Lokasi saya">'+I("pin")+'</button></div>';
  h += '<div class="jpts">'+
    '<button class="jpt'+(J.mode==="pick"?" on":"")+'" data-act="jago-sheet" data-v="pick"><i class="dot a"></i><div class="grow"><small>Titik jemput</small><b>'+(J.pick ? esc(J.pick.address || "Mencari nama jalan…") : (J.gps ? "Mengambil lokasi…" : "Ketuk untuk cari lokasi jemput"))+'</b></div>'+
      '<span class="jlink">'+I("search")+'</span></button>'+
    '<button class="jpt'+(J.mode==="dest"?" on":"")+'" data-act="jago-sheet" data-v="dest"><i class="dot b"></i><div class="grow"><small>Tujuan</small><b>'+(J.dest ? esc(J.dest.address || "Mencari nama jalan…") : "Mau ke mana? Ketuk untuk cari")+'</b></div><span class="jlink">'+I("search")+'</span></button></div>';
  h += '</div>';
  if(dist != null){
    h += '<div class="ongkirbox big jfare">'+E("money")+'<div><small>Perkiraan tarif · jarak ±'+kmTxt(dist)+' · '+ONGKIR_LBL+'</small><b>±'+rp(ongkirByDist(dist))+'</b><small>Bayar tunai langsung ke driver, bisa nego. '+(rdJ ? 'Jarak dihitung lewat jalan yang dilalui.' : 'Menghitung jarak lewat jalan…')+'</small></div></div>';
  }
  h += '<form class="card pad jform" id="jagoForm">'+
    '<div class="cols2"><div><label class="f">Nama *</label><input class="in" name="name" required value="'+esc(p.name||"")+'"></div>'+
    '<div><label class="f">No. WhatsApp *</label><input class="in" name="wa" inputmode="tel" required placeholder="08xxxxxxxxxx" value="'+esc(p.wa||"")+'"></div></div>'+
    '<label class="f">Catatan untuk driver</label><input class="in" name="note" placeholder="Contoh: depan masjid, pakai baju biru">'+
    (dist != null ? useSaldoBox(ongkirByDist(dist), "tarif Jago") : '')+
    '<button class="btn block press" style="margin-top:14px"'+(dist == null ? ' disabled' : '')+'>'+E("scooter")+' Pesan Jago'+(dist != null ? ' · ±'+rp(ongkirByDist(dist)) : '')+'</button>'+
    (dist == null ? '<div class="hint" style="text-align:center">Atur titik jemput dan tujuan dulu.</div>' : '')+'</form>';
  return h;
}
function rideRow(o){
  const fare = typeof o.fareFinal === "number" ? rp(o.fareFinal) : "±"+rp(o.fareEst);
  return '<div class="rrow press" data-act="ride-open" data-id="'+esc(o.id)+'">'+E("scooter")+'<div class="grow"><b>'+esc(shortAddr(o.dest.address) || "Perjalanan Jago")+'</b><small>'+esc(o.code)+' · '+fmtDate(o.createdAt)+'</small></div><div class="r">'+statusTag(o.status)+'<b>'+fare+'</b></div></div>';
}
function appJago(){
  let h = appBar("Jago · Ojek online");
  const pf = getProf();
  if(!S.jago.pick && inArea(pf)) S.jago.pick = {lat:pf.lat, lng:pf.lng, address:pf.address || ""};
  if(S.jago.pick && !S.jago.dest && S.jago.mode === "pick" && !S.jago.touched) S.jago.mode = "dest";
  const act = S.rides.find(r => RIDE_ACTIVE.includes(r.status));
  const open = S.jago.open && S.rides.find(r => r.id === S.jago.open);
  if(act){
    h += '<div class="v-wrap">'+rideCard(act)+'</div>';
  } else if(open){
    h += '<div class="v-wrap">'+rideCard(open)+'<button class="btn ghost block" style="margin-top:10px" data-act="ride-close">Pesan perjalanan baru</button></div>';
  } else {
    h += '<div class="v-wrap"><button class="vcard slim press" data-act="voice"><span class="vci">'+I("mic")+'</span><div class="grow"><b>Pesan pakai suara</b><small>Sebutkan saja tujuannya, misalnya “antar saya ke pasar”</small></div></button>'+jagoForm()+'</div>';
  }
  const hist = S.rides.filter(r => !RIDE_ACTIVE.includes(r.status) && r.id !== (open && open.id)).slice(0, 10);
  if(hist.length) h += '<div class="v-wrap"><h2 class="sec" style="margin:18px 0 8px">Riwayat Jago</h2><div class="card pad rlist">'+hist.map(rideRow).join("")+'</div></div>';
  return h + '<div style="height:24px"></div>';
}
function jagoOrdersCard(){
  if(!S.rides.length) return "";
  const list = S.rides.slice(0, 5);
  return '<div class="ash" style="margin:14px 0 8px"><h2>Perjalanan Jago</h2><button data-act="nav" data-v="jago">Pesan Jago</button></div><div class="card pad rlist">'+list.map(rideRow).join("")+'</div>';
}

/* ---------- peta pemilih titik ---------- */
let JMAP = null;
function mountJagoMap(){
  const ph = document.querySelector("[data-jmap]"); if(!ph) return;
  loadLeaflet().then(() => {
    if(!ph.isConnected) return;
    if(!JMAP){
      const node = document.createElement("div"); node.className = "jmap";
      ph.replaceWith(node);
      const c = inArea(S.jago.pick) ? S.jago.pick : inArea(getProf()) ? getProf() : JAGO_CENTER;
      const A = AU, pad = .08;
      const map = L.map(node, {zoomControl:false, attributionControl:true, minZoom:10, maxBounds:[[A.s - pad, A.w - pad], [A.n + pad, A.e + pad]], maxBoundsViscosity:1}).setView([c.lat, c.lng], 15);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {maxZoom:19, attribution:"© OpenStreetMap"}).addTo(map);
      map.on("click", ev => { const ll = {lat:+ev.latlng.lat.toFixed(6), lng:+ev.latlng.lng.toFixed(6)}; setJagoPoint(S.jago.mode, ll); });
      JMAP = {node, map, mk:{}, line:null, fit:""};
    } else ph.replaceWith(JMAP.node);
    const m = JMAP, pts = [];
    const put = (k, loc, icon, cls) => {
      if(!locOk(loc)){ if(m.mk[k]){ m.map.removeLayer(m.mk[k]); delete m.mk[k]; } return; }
      const ll = [loc.lat, loc.lng]; pts.push(ll);
      if(m.mk[k]) m.mk[k].setLatLng(ll);
      else {
        m.mk[k] = L.marker(ll, {icon:mkIcon(icon, cls), draggable:true}).addTo(m.map);
        m.mk[k].on("dragend", ev => { const p = ev.target.getLatLng(); setJagoPoint(k, {lat:+p.lat.toFixed(6), lng:+p.lng.toFixed(6)}); });
      }
    };
    put("pick", S.jago.pick, "pin", "mk-buyer");
    put("dest", S.jago.dest, "star", "mk-dest");
    if(m.line){ m.map.removeLayer(m.line); m.line = null; }
    if(pts.length === 2) m.line = L.polyline(pts, {color:"#2f6bff", weight:4, dashArray:"6 8", opacity:.85}).addTo(m.map);
    const fk = pts.map(p => p.join(",")).join("|");
    setTimeout(() => {
      m.map.invalidateSize();
      if(m.fit !== fk){ m.fit = fk; if(pts.length === 2) m.map.fitBounds(pts, {padding:[50, 50], maxZoom:17}); else if(pts.length) m.map.panTo(pts[0]); }
    }, 30);
  }).catch(() => { if(ph.isConnected) ph.innerHTML = '<div class="small muted" style="padding:16px;text-align:center">Peta tidak bisa dimuat. Periksa koneksi internet.</div>'; });
}

/* ---------- aksi penumpang ---------- */
document.addEventListener("click", async e => {
  const el = e.target.closest("[data-act]"); if(!el) return;
  const a = el.dataset.act, id = el.dataset.id, v = el.dataset.v;
  if(a === "jago-mode"){ S.jago.mode = v; S.jago.touched = true; render(); return; }
  if(a === "jago-gps"){
    e.stopPropagation();
    S.jago.gps = true; render();
    try{
      const c = await getPos(); S.jago.gps = false;
      setProf(Object.assign(getProf(), c));
      if(!inArea(c)){ S.jago.outside = true; toast("Lokasimu di luar wilayah layanan. " + AREA_MSG); render(); return; }
      await setJagoPoint("pick", c);
      if(JMAP) JMAP.map.setView([c.lat, c.lng], 16);
    }catch(err){ S.jago.gps = false; toast(err.message); render(); }
    return;
  }
  if(a === "ride-cancel"){
    confirmModal("Batalkan perjalanan Jago ini?", "Ya, batalkan", async () => { try{ await RIDE.act(id, "cancel"); toast("Perjalanan dibatalkan"); }catch(err){ toast(String(err.message||"Gagal").replace(/^.*?:\s*/, "")); } if(SB) await rideRefresh(); render(); });
    return;
  }
  if(a === "ride-retry"){ try{ await RIDE.act(id, "retry"); toast("Mencari driver lagi…"); }catch(err){ toast(String(err.message||"Gagal").replace(/^.*?:\s*/, "")); } if(SB) await rideRefresh(); render(); return; }
  if(a === "ride-open"){ go("jago", {}); S.jago.open = id; render(); window.scrollTo(0, 0); return; }
  if(a === "ride-close"){ S.jago.open = null; render(); return; }
  if(a === "ride-again"){
    const o = S.rides.find(x => x.id === id); S.jago.open = null;
    if(o){ S.jago.pick = Object.assign({}, o.pickup); S.jago.dest = Object.assign({}, o.dest); S.jago.mode = "dest"; }
    render(); window.scrollTo(0, 0); return;
  }
});
document.addEventListener("submit", async e => {
  const f = e.target;
  if(f.id === "buyerForm"){
    e.preventDefault();
    const fd = new FormData(f), data = {name:(fd.get("name")||"").trim(), wa:(fd.get("wa")||"").trim(), address:(fd.get("address")||"").trim()};
    if(!waOk(data.wa)) return toast(WA_BAD);
    const btn = f.querySelector("button[type=submit]"); if(btn) btn.disabled = true;
    try{ const r = await sbStore.rpc("jt_buyer_register", {p_data:data}); BUYER.gate = !!(r && r.gate); BUYER.me = (r && r.me) || null; BUYER.loaded = true; setProf(Object.assign(getProf(), data)); buyerModal(); toast("Pendaftaran terkirim"); }
    catch(err){ toast(String((err && err.message) || "Gagal, coba lagi").replace(/^.*?:\s*/, "").slice(0, 140)); if(btn) btn.disabled = false; }
    return;
  }
  if(f.id === "jagoForm"){
    e.preventDefault();
    if(!(await ensureBuyer())) return;
    const fd = new FormData(f), J = S.jago;
    const rider = {name:(fd.get("name")||"").trim(), wa:(fd.get("wa")||"").trim()};
    if(!rider.name || rider.wa.replace(/\D/g, "").length < 9) return toast("Isi nama dan nomor WhatsApp yang benar.");
    if(!locOk(J.pick)) return toast("Atur titik jemput dulu.");
    if(!locOk(J.dest)) return toast("Pilih tujuan dulu.");
    setProf(Object.assign(getProf(), {name:rider.name, wa:rider.wa}));
    const btn = f.querySelector("button"); if(btn) btn.disabled = true;
    const data = {riderId:ME, rider, pickup:{lat:J.pick.lat, lng:J.pick.lng, address:J.pick.address || ""}, dest:{lat:J.dest.lat, lng:J.dest.lng, address:J.dest.address || ""}, note:(fd.get("note")||"").trim()};
    { const rd = roadDist(J.pick, J.dest) || await Promise.race([ensureRoad(J.pick, J.dest), new Promise(r => setTimeout(() => r(null), 4000))]); if(rd) data.roadDist = Math.round(rd); }
    if(fd.get("useSaldo")) data.useSaldo = true;
    try{
      const r = await RIDE.create(uid("r"), data);
      if(data.useSaldo) loadPts("buyer", true);
      if(r && r.id) S.jago.seen[r.id] = r.status;
      S.jago.dest = null; S.jago.res = null; S.jago.q = ""; S.jago.open = null;
      toast("Order Jago dibuat. Mencari driver terdekat…"); buyerNotifAsk("ride");
      try{ if(!audioCtx){ const AC = window.AudioContext || window.webkitAudioContext; if(AC) audioCtx = new AC(); } }catch(_){}
      if(SB) await rideRefresh();
    }catch(err){ toast(String(err.message||"Gagal").replace(/^.*?:\s*/, "").slice(0, 140)); }
    if(btn) btn.disabled = false;
    render(); window.scrollTo(0, 0);
  }
});

/* ---------- driver: kartu order Jago ---------- */
function rideJob(o, offer){
  const est = o.fareEst;
  let h = '<div class="card djob'+(offer?' offer':'')+' rjob">';
  h += offer ? '<div class="dj-head">'+E("bell")+'<b>Order Jago</b><span class="jtag">Penumpang</span>'+(o.dist!=null?'<span class="dist">'+fmtDist(o.dist)+' ke penjemputan</span>':'')+'</div>'
    : '<div class="dj-head">'+statusTag(o.status)+'<span class="jtag">Jago</span><span class="small muted">'+esc(o.code)+'</span></div>';
  h += rideRoute(o, !offer);
  if(!offer && o.rider && RIDE_ACTIVE.includes(o.status))
    h += '<div class="actions" style="margin-top:8px">'+chatBtn(o, "driver", "Chat penumpang", "ghost")+'<button class="btn ghost sm" data-act="report" data-k="ride" data-id="'+esc(o.id)+'">Lapor masalah</button></div>';
  h += '<div class="dj-money"><div><small>Jarak</small><b>'+kmTxt(o.dist)+'</b></div><div><small>Tarif</small><b>'+(typeof o.fareFinal === "number" ? rp(o.fareFinal) : '±'+rp(est))+'</b></div><div><small>Komisi 3%</small><b>'+rp(typeof o.fee === "number" ? o.fee : rideFee(typeof o.fareFinal === "number" ? o.fareFinal : est))+'</b></div></div>' + voucherNote(o, "driver");
  if(offer){
    h += '<div class="actions"><button class="btn press grow" data-act="drv-accept" data-id="'+esc(o.id)+'">Ambil order Jago</button><button class="btn ghost press" data-act="drv-decline" data-id="'+esc(o.id)+'">Lewati</button></div>';
  } else if(o.status === "driver_jemput"){
    if(o.autoAssigned) h += '<div class="small" style="margin:6px 0;color:#2f6bff;font-weight:700">'+I("checkc")+' Ditugaskan otomatis — kamu driver terdekat'+(o.assignDist != null ? ' ('+fmtDist(o.assignDist)+' dari titik jemput)' : '')+'. Tidak bisa? Tekan “Batal ambil”, order langsung pindah ke driver terdekat berikutnya.</div>';
    h += liveMap(o, "driver");
    h += '<div class="actions"><button class="btn press grow" data-act="drv-pickup" data-id="'+esc(o.id)+'">'+I("checkc")+' Penumpang sudah naik</button><button class="btn ghost sm" data-act="drv-release" data-id="'+esc(o.id)+'">Batal ambil</button></div>';
  } else if(o.status === "dalam_perjalanan"){
    const v = S.drv.draft[o.id] != null ? S.drv.draft[o.id] : est;
    h += liveMap(o, "driver");
    h += '<div class="negobox"><label class="f">Tarif yang disepakati dengan penumpang</label><div class="rpin"><span>Rp</span><input class="in" inputmode="numeric" id="ongkir-'+esc(o.id)+'" data-ongkir="'+esc(o.id)+'" value="'+esc(v)+'"></div>'+
      '<div class="hint">Patokan '+ONGKIR_LBL+' = '+rp(est)+' (±'+kmTxt(o.dist)+'). Boleh nego. Tagih tunai ke penumpang. Komisi 3% dipotong otomatis dari saldo driver.</div></div>'+voucherNote(o, "driver")+
      '<div class="actions"><button class="btn press grow" data-act="drv-done" data-id="'+esc(o.id)+'">'+I("checkc")+' Sampai tujuan</button></div>';
  } else if(o.status === "selesai"){
    h += '<div class="small" style="margin-top:6px">Tarif diterima: <b>'+rp(o.fareFinal || 0)+'</b> · komisi '+rp(o.fee || 0)+' · '+fmtDate(o.doneAt || o.updatedAt)+'</div>';
  } else if(o.status === "dibatalkan"){
    h += '<div class="small muted" style="margin-top:6px">Dibatalkan penumpang</div>';
  }
  return h + '</div>';
}

/* ---------- driver: saldo ---------- */
const DWAL = {
  wid: () => "drv:" + (S.drv.me ? S.drv.me.id : DRIVER_ID_LOCAL),
  async get(){
    if(SB) return await sbStore.rpc("jt_driver_wallet", {});
    const wid = this.wid(), c = wCfgLocal();
    await localDrvBonus(S.drv.me ? S.drv.me.id : DRIVER_ID_LOCAL);
    const txs = S.walletTx.filter(t => t.storeId === wid).sort((a, b) => (b.at||0) - (a.at||0)).map(t => Object.assign({}, t, {hasProof:!!t.proof, proof:undefined}));
    return {balance:balLocal(wid), pending:S.walletTx.filter(t => t.storeId === wid && t.status === "pending").reduce((a,t)=>a+t.amount,0), cfg:{minBalance:c.minBalance, bank:c.bank, pay:c.pay || [], qris:c.qris}, txs};
  },
  async topup(amount, proof){
    if(SB) return sbStore.rpc("jt_driver_topup", {p_amount:amount, p_proof:proof});
    if(!(amount >= 10000)) throw srvErr("Jumlah isi saldo minimal Rp10.000");
    await store.set("wallettx/t" + Date.now(), {storeId:this.wid(), kind:"topup", amount:Math.round(amount), status:"pending", note:"Isi saldo", proof, at:Date.now()});
  }
};
async function localDrvBonus(did){
  const b = wCfgLocal().bonus || 0, wid = "drv:" + did;
  const dd = S.drivers.find(d => d.id === did);
  if(!SB && b > 0 && dd && (!dd.verify || dd.verify === "verified") && !S.walletTx.some(t => t.storeId === wid && t.kind === "bonus")) await localTx("bonus_" + wid.replace(":", "_"), {storeId:wid, kind:"bonus", amount:b, note:"Saldo gratis driver baru"});
}
function drvCanRide(did, o){
  const c = wCfgLocal(); const need = Math.max(c.minBalance || 0, rideFee(isRide(o) ? o.fareEst : (ongkirEstOf(o) || 0)));
  return balLocal("drv:" + did) >= need;
}
async function loadDrvWallet(){
  try{ S.drv.wal = Object.assign(await DWAL.get() || {}, {loaded:true}); }catch(e){ S.drv.wal = {loaded:true, err:e.message}; }
  if(S.role === "driver" && !typing()) scheduleRender();
}
function drvWalletChip(){
  const w = S.drv.wallet; if(!w) return "";
  const low = w.balance < (w.minBalance || 0);
  return '<div class="wchip dw'+(low?' low':'')+'" data-act="drv-wallet">'+E("money")+'<div class="grow"><small>Saldo driver</small><b>'+rp(w.balance)+'</b>'+
    (low ? '<span>Saldo di bawah '+rp(w.minBalance)+' — order tidak masuk. Isi saldo atau hubungi JAGA.</span>' : '<span>Potongan 3% per order selesai · kumpulkan poin harian</span>')+'</div><b class="go">'+(low?'Isi saldo':'Lihat')+' ›</b></div>';
}
function drvWallet(){
  const w = S.drv.wal;
  let h = '<div class="abar dbar"><button class="ibtn press" data-act="drv-wallet-close" aria-label="Kembali">'+I("back")+'</button><h1>Saldo driver</h1></div><div class="v-wrap">';
  if(!w || !w.loaded){ if(!w) loadDrvWallet(); return h + '<div class="empty">'+I("loader")+' Memuat saldo…</div></div>'; }
  if(w.err && w.balance == null) return h + '<div class="notice">'+esc(w.err)+'</div></div>';
  const c = w.cfg || {}, low = w.balance < (c.minBalance || 0);
  if(low) h += lowBlock(S.drv.me && S.drv.me.id ? "drv:" + S.drv.me.id : "", c.minBalance || 0, "driver");
  h += '<div class="wbig'+(low?' low':'')+'"><small>Saldo driver</small><b>'+rp(w.balance)+'</b><span>Minimal saldo untuk menerima order: '+rp(c.minBalance||0)+(w.pending ? ' · '+rp(w.pending)+' menunggu dicek' : '')+'</span></div>';
  h += ptsCard("driver", "driver");
  h += '<div class="card pad whow"><h3 class="sub">Cara kerja potongan 3%</h3><ol>'+
    '<li>Driver baru dapat saldo gratis untuk mulai narik.</li>'+
    '<li>Ongkir antar dan tarif Jago dibayar tunai oleh pembeli/penumpang langsung ke kamu.</li>'+
    '<li>Setiap order <b>selesai</b> (antar barang maupun Jago), potongan 3% dipotong otomatis dari saldo ini.</li>'+
    '<li>Jika saldo di bawah '+rp(c.minBalance||0)+', order tidak masuk sampai saldo diisi.</li>'+
    '<li>Isi saldo lewat bank, virtual account, e-wallet, atau QRIS JAGA, lalu unggah bukti transfer. Saldo masuk setelah dicek.</li></ol></div>';
  h += '<form class="card pad" id="dtopupForm"><h3 class="sub">'+I("plus")+' Isi saldo</h3>'+
    '<div class="wchips">'+[20000,50000,100000].map(x => '<button type="button" class="chip" data-act="topup-amt" data-v="'+x+'">'+rp(x)+'</button>').join("")+'</div>'+
    '<label class="f">Jumlah (Rp)</label><input class="in" name="amount" inputmode="numeric" required placeholder="Minimal 10000">'+
    payDest(c, "driver")+
    '<label class="f">Foto bukti transfer</label><input type="file" accept="image/*" class="in" id="dtopupProof" required>'+
    '<button class="btn block" style="margin-top:12px">Kirim pengisian saldo</button></form>';
  const txs = w.txs || [];
  h += '<div class="card pad"><h3 class="sub">Riwayat saldo</h3>'+(txs.length ? txs.map(t => txRow(t)).join("") : '<div class="muted small">Belum ada mutasi.</div>')+'</div>';
  return h + '</div>';
}
document.addEventListener("click", e => {
  const el = e.target.closest("[data-act]"); if(!el) return;
  const a = el.dataset.act;
  if(a === "drv-wallet"){ S.drv.walletOpen = true; S.drv.wal = null; loadDrvWallet(); render(); window.scrollTo(0, 0); }
  if(a === "drv-wallet-close"){ S.drv.walletOpen = false; S.drv.sig = ""; drvRefresh(); render(); }
});
document.addEventListener("submit", async e => {
  const f = e.target; if(f.id !== "dtopupForm") return;
  e.preventDefault();
  const amt = parseInt(String(new FormData(f).get("amount")||"").replace(/\D/g, ""), 10);
  if(!(amt >= 10000)) return toast("Jumlah isi saldo minimal Rp10.000.");
  const file = document.getElementById("dtopupProof").files[0];
  if(!file) return toast("Unggah foto bukti transfer.");
  const btn = f.querySelector("button.btn.block"); btn.disabled = true;
  try{ const img = await compressImage(file, 1000); await DWAL.topup(amt, img); toast("Pengisian terkirim. Saldo masuk setelah dicek JAGA."); f.reset(); }
  catch(err){ toast(String(err.message||"Gagal").replace(/^.*?:\s*/,"")); }
  btn.disabled = false; await loadDrvWallet(); render();
});

/* ============ Asisten suara (gratis, berjalan di HP: pengenalan suara + suara bacaan bawaan browser) ============ */
ICONS.mic = '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><path d="M12 17v4M8 21h8"/>';
ICONS.keyboard = '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 13h.01M18 13h.01M8 16h8"/>';
const SR_CLS = window.SpeechRecognition || window.webkitSpeechRecognition;
const VA = {open:false, step:"", ctx:{}, rec:null, listening:false, speaking:false, heard:"", used:false, typing:false};
const vNorm = t => String(t || "").toLowerCase().replace(/[.,!?;:"'()]/g, " ").replace(/\s+/g, " ").trim();
const YES = /\b(iya|iyah|ya|yah|yak|betul|benar|bener|boleh|oke|ok|okey|jadi|setuju|pesan|pesankan|lanjut|mau|sip|siap|gas)\b/;
const NO = /\b(tidak|tak|nggak|ngga|gak|ga|enggak|engga|bukan|batal|jangan|salah|ganti|lain)\b/;
const NUMW = {nol:0, kosong:0, satu:1, se:1, dua:2, tiga:3, empat:4, lima:5, enam:6, tujuh:7, delapan:8, sembilan:9, sepuluh:10, sebelas:11, "dua belas":12, setengah:0.5};
function vNum(tok){ if(/^\d+([.,]\d+)?$/.test(tok)) return parseFloat(tok.replace(",", ".")); return NUMW[tok] != null ? NUMW[tok] : null; }
function sayRp(n){ n = Math.round(n || 0); if(n >= 1000 && n % 1000 === 0) return (n / 1000).toLocaleString("id-ID") + " ribu rupiah"; return n.toLocaleString("id-ID") + " rupiah"; }
function sayKm(m){ return m < 1000 ? Math.round(m / 10) * 10 + " meter" : (m / 1000).toFixed(1).replace(".", " koma ").replace(" koma 0", "") + " kilo"; }
function callName(){ const n = (getProf().name || "").trim().split(/\s+/)[0]; return n ? n : ""; }

/* ---------- bicara & mendengar ---------- */
let ID_VOICE = null;
function pickVoice(){ try{ const vs = speechSynthesis.getVoices(); ID_VOICE = vs.find(v => /^id(-|_)?/i.test(v.lang) && /google/i.test(v.name)) || vs.find(v => /^id/i.test(v.lang)) || null; }catch(e){} }
try{ if(window.speechSynthesis){ pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; } }catch(e){}
function vSay(text, then){
  VA.ai = text; vPaint();
  vStop();
  if(!window.speechSynthesis){ if(then) setTimeout(then, 400); return; }
  try{
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/Rp\s?([\d.]+)/g, (m, x) => sayRp(+x.replace(/\./g, ""))).replace(/(\d+),(\d+) km/g, "$1 koma $2 kilometer").replace(/(\d+) km/g, "$1 kilometer").replace(/(\d+) m\b/g, "$1 meter"));
    u.lang = "id-ID"; if(ID_VOICE) u.voice = ID_VOICE; u.rate = .95; u.pitch = 1.05;
    VA.speaking = true; vPaint();
    let done = false; const fin = () => { if(done) return; done = true; VA.speaking = false; vPaint(); if(then && VA.open) setTimeout(then, 250); };
    u.onend = fin; u.onerror = fin;
    setTimeout(fin, 2500 + text.length * 120);
    speechSynthesis.speak(u);
  }catch(e){ VA.speaking = false; if(then) then(); }
}
function vStop(){ try{ if(VA.rec){ VA.rec.onend = null; VA.rec.abort(); } }catch(e){} VA.rec = null; VA.listening = false; }
function vListen(){
  if(!VA.open) return;
  if(!SR_CLS || VA.typing){ VA.typing = true; vPaint(); return; }
  vStop();
  const r = new SR_CLS(); r.lang = "id-ID"; r.interimResults = true; r.maxAlternatives = 3; r.continuous = false;
  let finalTxt = "";
  r.onresult = ev => {
    let interim = "";
    for(let i = ev.resultIndex; i < ev.results.length; i++){ const x = ev.results[i]; if(x.isFinal) finalTxt += x[0].transcript; else interim += x[0].transcript; }
    VA.heard = (finalTxt + " " + interim).trim(); vPaint();
  };
  r.onerror = ev => { VA.listening = false; VA.err = ev.error; vPaint(); };
  r.onend = () => {
    VA.listening = false; VA.rec = null;
    const t = finalTxt.trim() || (VA.err ? "" : VA.heard.trim());
    if(t){ VA.err = ""; vHandle(t); }
    else if(VA.err === "not-allowed" || VA.err === "service-not-allowed"){ VA.hint = "Mikrofon belum diizinkan. Izinkan di pengaturan browser, atau ketik di bawah."; VA.typing = true; vPaint(); }
    else { VA.hint = "Ketuk tombol mikrofon, lalu bicara"; vPaint(); }
  };
  VA.heard = ""; VA.err = ""; VA.hint = "";
  try{ r.start(); VA.rec = r; VA.listening = true; }catch(e){ VA.listening = false; }
  vPaint();
}

/* ---------- tampilan ---------- */
function openVoice(){
  VA.open = true; VA.used = true; VA.step = "start"; VA.ctx = {}; VA.heard = ""; VA.opts = null; VA.ask = null; VA.typing = !SR_CLS;
  try{ if(!audioCtx){ const AC = window.AudioContext || window.webkitAudioContext; if(AC) audioCtx = new AC(); } }catch(_){}
  document.getElementById("modal").innerHTML = '<div class="vbg" id="vbox"></div>';
  const nm = callName();
  vSay(greet() + (nm ? ", " + nm : "") + ". Mau ke mana, atau mau pesan apa hari ini?", vListen);
}
function closeVoice(){ VA.open = false; vStop(); try{ speechSynthesis.cancel(); }catch(e){} closeModal(); }
function vPaint(){
  const box = document.getElementById("vbox"); if(!box || !VA.open) return;
  const st = VA.listening ? "listen" : VA.speaking ? "speak" : VA.busy ? "busy" : "idle";
  let h = '<div class="vtop"><span>'+JMARK()+'<b>Asisten Jaga</b></span><button class="vx" data-act="v-close" aria-label="Tutup">×</button></div>';
  h += '<div class="vai">'+esc(VA.ai || "")+'</div>';
  if(VA.opts && VA.opts.length) h += '<div class="vopts">'+VA.opts.map((o, i) => '<button class="vopt press'+(o.on?' on':'')+'" data-act="v-opt" data-v="'+i+'">'+(o.e ? E(o.e) : '')+'<div class="grow"><b>'+esc(o.t)+'</b>'+(o.s ? '<small>'+esc(o.s)+'</small>' : '')+'</div>'+(o.r ? '<span class="vr">'+esc(o.r)+'</span>' : '')+'</button>').join("")+'</div>';
  h += '<div class="vyou'+(VA.heard ? '' : ' empty')+'">'+(VA.heard ? '“'+esc(VA.heard)+'”' : (VA.listening ? 'Silakan bicara…' : esc(VA.hint || '')))+'</div>';
  h += '<div class="vmicwrap"><button class="vmic '+st+' press" data-act="v-mic" aria-label="Bicara">'+(st === "busy" ? I("loader") : I("mic"))+'</button>'+
    '<div class="vstate">'+(st === "listen" ? "Mendengarkan…" : st === "speak" ? "Asisten berbicara…" : st === "busy" ? "Sedang mencari…" : "Ketuk untuk bicara")+'</div></div>';
  if(VA.ask === "yesno") h += '<div class="vyn"><button class="vno press" data-act="v-no">✗<span>Tidak</span></button><button class="vyes press" data-act="v-yes">✓<span>Iya, pesan</span></button></div>';
  h += VA.typing ? '<form class="vtype" id="vtype"><input class="in" name="t" autocomplete="off" placeholder="Atau ketik di sini…"><button class="btn sm">Kirim</button></form>'
    : '<button class="vkb" data-act="v-kb">'+I("keyboard")+' Ketik saja</button>';
  box.innerHTML = h;
}

/* ---------- memahami permintaan ---------- */
const RIDE_W = /\b(antar(kan|in)?\s*(saya|aku|ibu|kami)|jemput|pergi|berangkat|ojek|ojeg|jago|naik motor|pulang|ke rumah|mau ke|minta antar|mau jalan)\b/;
const SHOP_W = /\b(beli|belikan|pesan|pesankan|order|lapar|makan|minum|belanja|cari|mau)\b/;
const FILL = new Set("saya aku ibu bu bapak pak mas mbak dek kak tolong dong ya yah deh nih sih mau ingin pengen pingin beli belikan pesan pesankan order cari carikan minta yang untuk buat hari ini sekarang juga aja saja lagi tadi nya kah yuk ayo".split(" "));
const UNIT = /^(kilo|kg|kilogram|liter|ltr|gram|gr|ons)$/;
function prodTokens(name){ return vNorm(name).split(" ").filter(w => w.length >= 3 && !/^\d/.test(w) && !UNIT.test(w)); }
function tokHit(w, words){ return words.some(u => u === w || (u.length >= 4 && w.length >= 4 && (u.startsWith(w.slice(0, 4)) && w.startsWith(u.slice(0, 4))))); }
function parseShop(text){
  const t = vNorm(text);
  const segs = t.split(/\s(?:dan|sama|terus|trus|plus|serta|lalu|tambah)\s|,/).map(x => x.trim()).filter(Boolean);
  const stores = S.stores.filter(s => visibleStore(s) && s.open !== false);
  let best = null;
  stores.forEach(s => {
    const prods = (S.products[s.id] || []).filter(p => p.active !== false && !(typeof p.stock === "number" && p.stock <= 0));
    const items = [];
    segs.forEach(seg => {
      const words = seg.split(" ").filter(w => !FILL.has(w));
      if(!words.length) return;
      let top = null;
      prods.forEach(p => {
        const pt = prodTokens(p.name); if(!pt.length) return;
        const hit = pt.filter(w => tokHit(w, words)).length;
        if(!hit) return;
        const score = hit / pt.length + hit * .5;
        if(!top || score > top.score) top = {p, score};
      });
      if(!top) return;
      let qty = 1;
      for(let i = 0; i < words.length; i++){
        const n = vNum(words[i]); if(n == null) continue;
        const next = words[i + 1] || "";
        const inName = vNorm(top.p.name).includes(String(n)) && (UNIT.test(next) || /^\d/.test(words[i]));
        if(!inName && n >= 1 && n <= 50 && Number.isInteger(n)) qty = n;
        break;
      }
      if(!items.some(x => x.p.id === top.p.id)) items.push({p:top.p, qty, score:top.score});
    });
    if(!items.length) return;
    const cod = payMethodsOf(s).some(m => m.k === "cod");
    const sc = items.reduce((a, x) => a + x.score, 0) + (cod ? .3 : 0);
    if(!best || sc > best.sc) best = {s, items, cod, sc};
  });
  return best;
}
function rideDest(text){
  const t = vNorm(text);
  let m = t.match(/(?:^|\s)(?:ke|kek|menuju|arah)\s+(.+)$/);
  let d = m ? m[1] : "";
  if(!d && /\bpulang\b/.test(t)) return "";
  d = d.split(" ").filter(w => !["ya","dong","sekarang","bang","pak","bu","mas","deh","aja","saja","tolong"].includes(w)).join(" ").trim();
  return d;
}
async function vHandle(text){
  VA.heard = text; VA.opts = null; vPaint();
  const t = vNorm(text);
  const step = VA.step;
  if(/\b(tutup|keluar|sudah|udah|selesai|nggak jadi|gak jadi|batal)\b/.test(t) && !["confirm-ride","confirm-shop","pick-dest"].includes(step)){ vSay("Baik. Sampai jumpa lagi.", closeVoice); return; }
  if(step === "ask-name"){ const nm = text.replace(/^(nama (saya|aku|ibu)( adalah)?|saya|aku)\s+/i, "").trim().replace(/\b\w/g, c => c.toUpperCase()); setProf(Object.assign(getProf(), {name:nm})); VA.step = VA.after; return vNext(); }
  if(step === "ask-wa"){
    let digits = text.replace(/\D/g, "");
    if(digits.length < 9){ digits = vNorm(text).split(" ").map(w => { const n = vNum(w); return n != null && n < 10 && Number.isInteger(n) ? String(n) : /^\d+$/.test(w) ? w : ""; }).join(""); }
    if(digits.length < 9 || digits.length > 14){ vSay("Maaf, nomornya belum lengkap. Coba sebutkan nomor WhatsApp pelan-pelan.", vListen); return; }
    if(digits.startsWith("62")) digits = "0" + digits.slice(2);
    setProf(Object.assign(getProf(), {wa:digits})); VA.step = VA.after; return vNext();
  }
  if(step === "confirm-ride" || step === "confirm-shop"){
    if(NO.test(t) && !/\bmau\b/.test(t.replace(/\b(tidak|nggak|gak|enggak) mau\b/, ""))) return vNo();
    if(YES.test(t)) return vYes();
    // jawaban lain dianggap permintaan baru
  }
  if(step === "pick-dest"){
    if(NO.test(t)) return vNo();
    if(YES.test(t)) return vYes();
    const n = t.match(/\b(pertama|kedua|ketiga|satu|dua|tiga|1|2|3)\b/);
    if(n){ const i = {pertama:0, satu:0, "1":0, kedua:1, dua:1, "2":1, ketiga:2, tiga:2, "3":2}[n[1]]; if(VA.ctx.places && VA.ctx.places[i]){ VA.ctx.idx = i; return vRideOffer(); } }
  }
  if(step === "which"){
    if(/\b(pergi|ojek|jago|antar|jalan|ke)\b/.test(t) && !/\bbeli|belanja\b/.test(t)){ VA.step = "ask-dest"; vSay("Ibu mau ke mana? Sebutkan nama tempatnya.", vListen); return; }
    if(/\b(beli|belanja|pesan|makan|minum)\b/.test(t) && !rideDest(t) && t.split(" ").length <= 2){ VA.step = "ask-item"; vSay("Mau beli apa? Sebutkan nama barangnya.", vListen); return; }
  }
  if(step === "ask-dest"){ return vStartRide(rideDest(t) || t.replace(/^(ke|mau ke)\s+/, "")); }
  // permintaan baru
  const dest = rideDest(t);
  const wantsRide = RIDE_W.test(t) || (!!dest && !/\b(beli|belanja|pesan)\b/.test(t));
  const shop = step === "ask-item" || !wantsRide ? parseShop(t) : null;
  if(wantsRide && dest) return vStartRide(dest);
  if(wantsRide && !dest){ VA.step = "ask-dest"; vSay("Baik. Ibu mau ke mana? Sebutkan nama tempatnya.", vListen); return; }
  if(shop) return vStartShop(shop);
  if(SHOP_W.test(t) || step === "ask-item"){ VA.step = "ask-item"; vSay("Maaf, barang itu belum ketemu di toko sekitar. Coba sebutkan nama barang lain, atau sebut lebih singkat. Misalnya, beras, atau mie ayam.", vListen); return; }
  VA.step = "which";
  VA.opts = [{e:"scooter", t:"Mau pergi (ojek Jago)", act:"ride"}, {e:"cart", t:"Mau beli sesuatu", act:"shop"}];
  vSay("Maaf, saya belum paham. Ibu mau pergi ke suatu tempat, atau mau beli sesuatu?", vListen);
}

/* ---------- alur ojek ---------- */
async function vStartRide(dest){
  if(!dest){ VA.step = "ask-dest"; vSay("Ibu mau ke mana? Sebutkan nama tempatnya.", vListen); return; }
  if(S.rides.some(r => RIDE_ACTIVE.includes(r.status))){ vSay("Ibu masih punya perjalanan Jago yang berjalan. Saya bukakan halamannya ya.", () => { closeVoice(); go("jago"); }); return; }
  VA.busy = true; VA.ai = "Mencari " + dest + "…"; vPaint();
  let pick = null;
  try{ pick = await getPos(); setProf(Object.assign(getProf(), pick)); }
  catch(e){ VA.busy = false; vSay("Lokasi Ibu belum ketemu. Nyalakan GPS di HP, lalu coba lagi.", vListen); VA.step = "ask-dest"; return; }
  if(!inArea(pick)){ VA.busy = false; VA.step = "done"; vSay("Maaf, lokasi Ibu di luar wilayah layanan. " + AREA_MSG); return; }
  let list = [];
  try{ list = await PLACE.suggest(dest, pick); }catch(e){}
  list = list.filter(x => x.dist == null || x.dist < 60000).slice(0, 3);
  VA.busy = false;
  if(!list.length){ VA.step = "ask-dest"; vSay("Maaf, tempat " + dest + " belum ketemu di " + AREA_NAME + ". Coba sebutkan nama tempat lain yang dekat, misalnya nama masjid, pasar, atau sekolah.", vListen); return; }
  const places = [];
  for(const it of list){ try{ places.push(Object.assign(await PLACE.resolve(it), {name:it.name})); }catch(e){} }
  if(!places.length){ VA.step = "ask-dest"; vSay("Maaf, tempatnya belum ketemu. Coba sebutkan lagi.", vListen); return; }
  VA.ctx = {pick, places, idx:0};
  vRideOffer();
}
function vRideOffer(){
  const c = VA.ctx, p = c.places[c.idx], d = distM(c.pick, p), fare = ongkirByDist(d);
  c.dist = d; c.fare = fare;
  VA.opts = c.places.map((x, i) => ({e:i === c.idx ? "pin" : "", t:x.name, s:shortAddr(x.address), r:kmTxt(distM(c.pick, x)), on:i === c.idx, act:"place", i}));
  if(d < 100){ VA.step = "ask-dest"; vSay("Tempat itu dekat sekali dari posisi Ibu sekarang. Coba sebutkan tujuan lain.", vListen); return; }
  const prof = getProf();
  if(!prof.name){ VA.step = "ask-name"; VA.after = "ride-offer"; vSay("Sebelum memesan, siapa nama Ibu?", vListen); return; }
  if(!prof.wa){ VA.step = "ask-wa"; VA.after = "ride-offer"; vSay("Nomor WhatsApp Ibu berapa? Supaya driver bisa menelepon.", vListen); return; }
  VA.step = "confirm-ride"; VA.ask = "yesno";
  vSay("Ke " + p.name + ", " + shortAddr(p.address).split(",").slice(1, 2).join("") + ". Jaraknya " + kmTxt(d) + ", ongkosnya sekitar " + rp(fare) + ", bayar tunai ke driver. Ibu dijemput di lokasi sekarang. Pesan sekarang?", vListen);
}
async function vBookRide(){
  const c = VA.ctx, p = c.places[c.idx], prof = getProf();
  VA.busy = true; VA.ask = null; VA.ai = "Memesan Jago…"; vPaint();
  try{
    const addr = await PLACE.reverse(c.pick);
    const r = await RIDE.create(uid("r"), {riderId:ME, rider:{name:prof.name, wa:prof.wa}, pickup:{lat:c.pick.lat, lng:c.pick.lng, address:addr || ""}, dest:{lat:p.lat, lng:p.lng, address:p.address}, note:"Dipesan lewat suara"});
    if(r && r.id) S.jago.seen[r.id] = r.status;
    if(SB) await rideRefresh();
    VA.busy = false; VA.step = "done";
    vSay("Sudah dipesan. Saya sedang mencari driver terdekat. Nanti saya kabari kalau driver sudah ditemukan.", () => { closeVoice(); go("jago"); });
  }catch(e){ VA.busy = false; vSay("Maaf, pesanan gagal. " + String(e.message || "").replace(/^.*?:\s*/, ""), vListen); }
}

/* ---------- alur belanja ---------- */
function vStartShop(m){
  const items = m.items.map(x => ({pid:x.p.id, name:x.p.name, price:x.p.price, img:x.p.img || "", qty:x.qty}));
  const sub = items.reduce((a, x) => a + x.price * x.qty, 0);
  VA.ctx = {s:m.s, items, sub, cod:m.cod};
  VA.opts = items.map(x => ({e:catE(m.s.category), t:x.qty + "× " + x.name, r:rp(x.price * x.qty)}));
  const prof = getProf();
  if(!prof.name){ VA.step = "ask-name"; VA.after = "shop-offer"; vSay("Sebelum memesan, siapa nama Ibu?", vListen); return; }
  if(!prof.wa){ VA.step = "ask-wa"; VA.after = "shop-offer"; vSay("Nomor WhatsApp Ibu berapa? Supaya toko dan driver bisa menghubungi.", vListen); return; }
  vShopOffer();
}
function vShopOffer(){
  const c = VA.ctx;
  VA.opts = c.items.map(x => ({e:catE(c.s.category), t:x.qty + "× " + x.name, r:rp(x.price * x.qty)}));
  VA.step = "confirm-shop"; VA.ask = "yesno";
  const list = c.items.map(x => x.qty + " " + x.name).join(", ");
  vSay("Di " + c.s.name + ": " + list + ". Totalnya " + rp(c.sub) + ", ditambah ongkir dua ribu rupiah per lima ratus meter. " + (c.cod ? "Bayar di tempat saat barang sampai. " : "") + "Pesan sekarang?", vListen);
}
async function vPlaceShop(){
  const c = VA.ctx, prof = getProf();
  S.cart = {storeId:c.s.id, items:{}}; c.items.forEach(x => S.cart.items[x.pid] = x); saveCart();
  if(!c.cod){ VA.step = "done"; VA.ask = null; vSay("Toko ini belum menerima bayar di tempat. Barangnya sudah saya masukkan ke keranjang. Minta bantuan keluarga untuk menyelesaikan pembayarannya, ya.", () => { closeVoice(); go("cart"); }); return; }
  VA.busy = true; VA.ask = null; VA.ai = "Mengambil lokasi Ibu…"; vPaint();
  let loc = null; try{ loc = await getPos(); }catch(e){}
  if(loc && !inArea(loc)){ VA.busy = false; VA.step = "done"; vSay("Maaf, lokasi Ibu di luar wilayah layanan. " + AREA_MSG); return; }
  let address = prof.address || "";
  if(!address && loc) address = await PLACE.reverse(loc);
  if(!address){ VA.busy = false; VA.step = "done"; vSay("Lokasi Ibu belum ketemu. Barang sudah di keranjang. Nyalakan GPS, lalu tekan tombol pesan di halaman keranjang.", () => { closeVoice(); go("cart"); }); return; }
  const f = document.createElement("form");
  const add = (n, v) => { const i = document.createElement("input"); i.name = n; i.value = v == null ? "" : v; f.appendChild(i); };
  add("name", prof.name); add("wa", prof.wa); add("address", address); add("note", "Dipesan lewat suara"); add("pay", "cod");
  if(loc){ add("blat", loc.lat); add("blng", loc.lng); }
  VA.ai = "Mengirim pesanan…"; vPaint();
  const before = S.view;
  await placeOrder(f);
  VA.busy = false;
  if(S.view === "order" && before !== "order"){ VA.step = "done"; VA.open = true; document.getElementById("modal").innerHTML = '<div class="vbg" id="vbox"></div>'; vSay("Pesanan sudah dikirim ke " + c.s.name + ". Tunggu toko mengonfirmasi, lalu driver akan mengantar ke tempat Ibu.", closeVoice); }
  else { VA.open = true; document.getElementById("modal").innerHTML = '<div class="vbg" id="vbox"></div>'; vSay("Maaf, pesanan belum berhasil. Coba lagi sebentar.", vListen); }
}

/* ---------- jawaban iya / tidak ---------- */
function vNext(){ if(VA.after === "ride-offer") return vRideOffer(); if(VA.after === "shop-offer") return vShopOffer(); }
function vYes(){
  if(VA.step === "confirm-ride" || VA.step === "pick-dest") return vBookRide();
  if(VA.step === "confirm-shop") return vPlaceShop();
}
function vNo(){
  VA.ask = null;
  if(VA.step === "confirm-ride" || VA.step === "pick-dest"){
    const c = VA.ctx;
    if(c.places && c.idx < c.places.length - 1){ c.idx++; VA.step = "pick-dest"; return vRideOffer(); }
    VA.step = "ask-dest"; VA.opts = null; vSay("Baik. Coba sebutkan lagi nama tempat tujuannya, lebih lengkap.", vListen); return;
  }
  if(VA.step === "confirm-shop"){ VA.step = "ask-item"; VA.opts = null; vSay("Baik, tidak jadi. Mau beli apa? Sebutkan lagi nama barangnya.", vListen); return; }
}

/* ---------- aksi ---------- */
document.addEventListener("click", e => {
  const el = e.target.closest("[data-act]"); if(!el) return;
  const a = el.dataset.act;
  if(a === "voice"){ openVoice(); return; }
  if(!VA.open) return;
  if(a === "v-close"){ closeVoice(); return; }
  if(a === "v-mic"){ if(SR_CLS) VA.typing = false; if(VA.listening){ try{ VA.rec.stop(); }catch(_){} return; } try{ speechSynthesis.cancel(); }catch(_){} VA.speaking = false; vListen(); return; }
  if(a === "v-yes"){ try{ speechSynthesis.cancel(); }catch(_){} vStop(); vYes(); return; }
  if(a === "v-no"){ try{ speechSynthesis.cancel(); }catch(_){} vStop(); vNo(); return; }
  if(a === "v-kb"){ VA.typing = true; vStop(); vPaint(); setTimeout(() => { const i = document.querySelector("#vtype input"); if(i) i.focus(); }, 50); return; }
  if(a === "v-opt"){
    const o = (VA.opts || [])[+el.dataset.v]; if(!o) return;
    try{ speechSynthesis.cancel(); }catch(_){} vStop();
    if(o.act === "ride"){ VA.step = "ask-dest"; VA.opts = null; vSay("Ibu mau ke mana? Sebutkan nama tempatnya.", vListen); }
    else if(o.act === "shop"){ VA.step = "ask-item"; VA.opts = null; vSay("Mau beli apa? Sebutkan nama barangnya.", vListen); }
    else if(o.act === "place"){ VA.ctx.idx = o.i; vRideOffer(); }
  }
});
document.addEventListener("submit", e => {
  if(e.target.id !== "vtype") return;
  e.preventDefault();
  const i = e.target.querySelector("input"), v = i.value.trim(); i.value = "";
  if(v){ try{ speechSynthesis.cancel(); }catch(_){} vStop(); vHandle(v); }
});


/* ---------- owner: cabang / wilayah layanan ---------- */
S.oa = {res:null, busy:false, q:""};
function ownerAreasTab(){
  const list = AREAS_ALL;
  let h = '<div class="card pad"><h3 class="sub">Wilayah layanan (cabang)</h3><div class="small muted" style="margin:-4px 0 10px">Peta, pencarian lokasi, Jago, dan pengantaran hanya berlaku di cabang yang aktif. Pengguna di luar wilayah ini tidak bisa memesan.</div>'+
    list.map((a, i) => '<div class="orow oarea"><div class="grow"><b>'+esc(a.name)+(a.prov ? ', '+esc(a.prov) : '')+'</b><small>'+(a.active !== false ? '<b style="color:#15803d">● Aktif</b>' : '<span class="muted">○ Nonaktif</span>')+' · '+a.s.toFixed(2)+'°–'+a.n.toFixed(2)+'° lintang · '+a.w.toFixed(2)+'°–'+a.e.toFixed(2)+'° BT</small></div>'+
      '<div class="r"><button class="btn ghost sm" data-act="oa-toggle" data-v="'+i+'">'+(a.active !== false ? 'Nonaktifkan' : 'Aktifkan')+'</button>'+(list.length > 1 ? '<button class="linkbtn" data-act="oa-del" data-v="'+i+'">Hapus</button>' : '')+'</div></div>').join("")+'</div>';
  h += '<form class="card pad" id="oaForm"><h3 class="sub">'+I("plus")+' Buka cabang baru</h3>'+
    '<label class="f">Nama kabupaten / kota</label><div class="jsearch" style="margin-top:0"><input class="in" name="q" placeholder="Contoh: Kabupaten Kampar, Kota Pekanbaru" value="'+esc(S.oa.q)+'"><button class="btn sm"'+(S.oa.busy?' disabled':'')+'>'+(S.oa.busy?'…':'Cari')+'</button></div>'+
    '<div class="hint">Cari wilayahnya, pilih yang benar, lalu cabang langsung aktif. Batas wilayah diambil dari OpenStreetMap.</div>';
  if(S.oa.res) h += '<div class="jres">'+(S.oa.res.length ? S.oa.res.map((r, i) => '<button type="button" data-act="oa-add" data-v="'+i+'">'+I("pin")+'<div class="grow"><b>'+esc(r.name)+'</b><small>'+esc(r.full)+'</small></div><span class="btn sm">Buka</span></button>').join("") : '<div class="small muted" style="padding:10px">Wilayah tidak ditemukan. Tulis lengkap, misalnya “Kabupaten Kampar”.</div>')+'</div>';
  return h + '</form>';
}
async function oaSave(list, msg){
  try{ await AREA_API.save(list); setAreas(list); toast(msg); }catch(err){ toast(String(err.message || "Gagal").replace(/^.*?:\s*/, "")); }
  render();
}
document.addEventListener("submit", async e => {
  if(e.target.id !== "oaForm") return;
  e.preventDefault();
  const q = (new FormData(e.target).get("q") || "").trim(); S.oa.q = q;
  if(q.length < 3) return toast("Tulis nama kabupaten/kota.");
  S.oa.busy = true; render();
  try{
    const r = await fetch("https://nominatim.openstreetmap.org/search?format=jsonv2&countrycodes=id&limit=8&accept-language=id&addressdetails=1&q=" + encodeURIComponent(q));
    const j = await r.json();
    S.oa.res = (j || []).filter(x => x.category === "boundary" || x.class === "boundary" || /administrative/.test(x.type || "")).map(x => {
      const bb = (x.boundingbox || []).map(Number), ad = x.address || {};
      const name = String(x.name || x.display_name.split(",")[0]);
      return {name, full:x.display_name, prov:ad.state || "", s:bb[0], n:bb[1], w:bb[2], e:bb[3]};
    }).filter(x => [x.s, x.n, x.w, x.e].every(isFinite) && x.n - x.s < 4 && x.e - x.w < 4);
  }catch(err){ S.oa.res = []; toast("Pencarian gagal, periksa koneksi."); }
  S.oa.busy = false; render();
});
document.addEventListener("click", e => {
  const el = e.target.closest("[data-act]"); if(!el) return;
  const a = el.dataset.act, i = +el.dataset.v;
  if(a === "oa-add"){
    const r = (S.oa.res || [])[i]; if(!r) return;
    const short = r.name.replace(/^(kabupaten|kab\.?|kota)\s+/i, "").trim();
    const id = short.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || ("w" + Date.now());
    if(AREAS_ALL.some(x => x.id === id)) return toast("Cabang ini sudah ada.");
    confirmModal("Buka cabang JAGA di " + r.name + (r.prov ? ", " + r.prov : "") + "? Pengguna di wilayah ini langsung bisa memesan.", "Buka cabang", () => {
      S.oa.res = null; S.oa.q = "";
      oaSave(AREAS_ALL.concat([{id, name:r.name, short, prov:r.prov, s:+r.s.toFixed(4), n:+r.n.toFixed(4), w:+r.w.toFixed(4), e:+r.e.toFixed(4), active:true, createdAt:Date.now()}]), "Cabang " + short + " dibuka");
    });
  }
  if(a === "oa-toggle"){
    const list = AREAS_ALL.map(x => Object.assign({}, x)); const x = list[i]; if(!x) return;
    x.active = x.active === false;
    if(!list.some(y => y.active !== false)) return toast("Minimal satu cabang harus aktif.");
    confirmModal((x.active ? "Aktifkan" : "Nonaktifkan") + " cabang " + x.name + "?", x.active ? "Aktifkan" : "Nonaktifkan", () => oaSave(list, "Cabang " + x.short + (x.active ? " diaktifkan" : " dinonaktifkan")));
  }
  if(a === "oa-del"){
    const list = AREAS_ALL.filter((_, k) => k !== i);
    if(!list.some(y => y.active !== false)) return toast("Minimal satu cabang harus aktif.");
    confirmModal("Hapus cabang " + AREAS_ALL[i].name + "?", "Hapus", () => oaSave(list, "Cabang dihapus"));
  }
});

/* ============ JAGA: kepercayaan — verifikasi driver, lapor masalah, rating, notifikasi, link toko ============ */
const VAPID_PUB = "BJuLAIjJbZVhFkZAgeKVyLsriwzaK6wkJUwcf8AOYYmvTAReXkNxRcRiux_GTHGAUudrVauIzeFOoYq575MfAIc";
S.reports = []; S.myRatings = {}; S.ratings = {store:{}, driver:{}};
const lsGet = k => { try{ return localStorage.getItem(k); }catch(e){ return null; } };
const lsSet = (k, v) => { try{ localStorage.setItem(k, v); }catch(e){} };

/* ---------- notifikasi push ---------- */
const PUSH_OK = !!SB && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
const pushOn = role => PUSH_OK && Notification.permission === "granted" && lsGet("jt_push_" + role) === "1";
function b64u(s){ const p = "=".repeat((4 - s.length % 4) % 4); const b = atob((s + p).replace(/-/g, "+").replace(/_/g, "/")); return Uint8Array.from(b, c => c.charCodeAt(0)); }
async function pushEnable(role){
  if(!PUSH_OK) return toast("HP/browser ini belum mendukung notifikasi. Pakai Chrome dan pasang aplikasi JAGA di layar utama.");
  try{
    const perm = await Notification.requestPermission();
    if(perm !== "granted") return toast("Notifikasi belum diizinkan. Izinkan di pengaturan browser.");
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if(!sub) sub = await reg.pushManager.subscribe({userVisibleOnly:true, applicationServerKey:b64u(VAPID_PUB)});
    await sbStore.rpc("jt_push_save", {p_sub:sub.toJSON(), p_role:role});
    lsSet("jt_push_" + role, "1"); lsSet("jt_pushsync_" + role, sub.endpoint.slice(-24) + "|" + new Date().toISOString().slice(0, 10));
    toast("Siaga order aktif. Kamu diberi tahu walau aplikasi ditutup.");
    if(siagaNow()) keepAwake(true);
  }catch(e){ toast("Notifikasi gagal diaktifkan: " + String(e.message || e).replace(/^.*?:\s*/, "").slice(0, 80)); }
  render();
}
/* ajakan aktifkan notifikasi untuk pemesan/penumpang */
const IS_IOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const IS_STANDALONE = (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;
function buyerNotifState(){
  if(pushOn("buyer")) return "on";
  if(!SB) return "on";
  if(!PUSH_OK) return IS_IOS && !IS_STANDALONE ? "ios" : "none";
  if(Notification.permission === "denied") return "denied";
  return "off";
}
function buyerNotifAsk(kind){
  const st = buyerNotifState(); if(st === "on" || st === "none") return;
  const last = Number(lsGet("jt_notif_ask") || 0); if(Date.now() - last < 6 * 3600e3) return;
  lsSet("jt_notif_ask", String(Date.now()));
  const ride = kind === "ride";
  const what = ride ? "driver Jago ditemukan, sudah dekat, dan perjalanan selesai" : "pesanan diambil driver, sedang diantar, dan sudah sampai";
  const body = st === "ios"
    ? '<p class="small" style="margin:0 0 10px">Di iPhone, notifikasi hanya bisa aktif setelah JAGA dipasang ke layar utama:</p><ol class="nsteps"><li>Ketuk tombol <b>Bagikan</b> (kotak dengan panah ke atas) di Safari</li><li>Pilih <b>Tambah ke Layar Utama</b></li><li>Buka JAGA dari ikon di layar utama, lalu aktifkan notifikasi</li></ol>'
    : st === "denied"
    ? '<p class="small" style="margin:0">Notifikasi JAGA sedang diblokir di browser. Ketuk ikon gembok/ⓘ di samping alamat situs → <b>Notifikasi</b> → <b>Izinkan</b>, lalu muat ulang halaman.</p>'
    : '<p class="small" style="margin:0">Kami kabari langsung di HP saat '+what+', walaupun aplikasi JAGA sedang ditutup.</p>';
  setTimeout(() => {
    const m = document.getElementById("modal"); if(!m || m.innerHTML.trim()) return;
    m.innerHTML = '<div class="modal-bg" data-act="modal-bg"><div class="modal nask"><div class="nask-ic">'+E("bell")+'</div><h2 class="sec" style="text-align:center">'+(ride ? 'Mau tahu kapan driver datang?' : 'Mau tahu kapan pesanan sampai?')+'</h2>'+body+
      '<div class="actions" style="margin-top:14px">'+(st === "off" ? '<button class="btn block press" data-act="nask-on">Aktifkan notifikasi</button>' : '')+
      '<button class="btn ghost block" data-act="close-modal">'+(st === "off" ? 'Nanti saja' : 'Mengerti')+'</button></div></div></div>';
  }, 1800);
}
function buyerNotifLine(){
  const st = buyerNotifState(); if(st === "on" || st === "none") return "";
  return '<div class="nline">'+E("bell")+'<span class="grow">'+(st === "ios" ? 'Pasang JAGA ke layar utama agar dapat kabar pesanan walau aplikasi ditutup.' : st === "denied" ? 'Notifikasi diblokir. Izinkan di pengaturan browser agar dapat kabar pesanan.' : 'Notifikasi mati. Anda tidak dikabari bila aplikasi ditutup.')+'</span>'+
    (st === "off" ? '<button class="linkbtn small" data-act="push-on" data-v="buyer">Aktifkan</button>' : '<button class="linkbtn small" data-act="nask-help">Caranya</button>')+'</div>';
}
function pushCard(role, text){
  if(!SB) return "";
  if(role === "buyer") return !PUSH_OK || pushOn(role) ? "" : '<div class="pushcard">'+E("bell")+'<div class="grow"><b>Aktifkan notifikasi</b><small>'+esc(text)+'</small></div><button class="btn sm press" data-act="push-on" data-v="'+role+'">Aktifkan</button></div>';
  if(pushOn(role)){
    const wake = !!navigator.wakeLock;
    return '<div class="siaga">'+E("bell")+'<div class="grow"><b>Siaga order aktif</b><small>Notifikasi masuk walau aplikasi ditutup atau HP terkunci'+(wake ? ' · layar tetap menyala selama aplikasi dibuka' : '')+'.</small></div><button class="btn ghost sm" data-act="push-test" data-v="'+role+'">Tes</button></div>';
  }
  const st = !PUSH_OK ? (IS_IOS && !IS_STANDALONE ? "ios" : "none") : Notification.permission === "denied" ? "denied" : "off";
  if(st === "none") return '<div class="pushcard off">'+E("bell")+'<div class="grow"><b>Notifikasi belum didukung</b><small>Buka JAGA dengan Chrome, lalu pasang ke layar utama agar order tetap masuk.</small></div></div>';
  if(st === "ios") return '<div class="pushcard off">'+E("bell")+'<div class="grow"><b>Pasang JAGA ke layar utama</b><small>Di iPhone: Safari → Bagikan → Tambah ke Layar Utama, lalu buka JAGA dari ikon dan aktifkan notifikasi.</small></div></div>';
  if(st === "denied") return '<div class="pushcard off">'+E("bell")+'<div class="grow"><b>Notifikasi diblokir</b><small>Ketuk ikon gembok/ⓘ di samping alamat situs → Notifikasi → Izinkan, lalu muat ulang. Tanpa ini order bisa terlewat.</small></div></div>';
  return '<div class="pushcard">'+E("bell")+'<div class="grow"><b>Aktifkan notifikasi</b><small>'+esc(text)+'</small></div><button class="btn sm press" data-act="push-on" data-v="'+role+'">Aktifkan</button></div>';
}
function siagaNow(){
  if(document.hidden || !SB) return false;
  if(S.role === "driver") return !!(S.drv && S.drv.me && S.drv.me.online) && pushOn("driver");
  if(S.role === "seller") return pushOn("store");
  if(S.role === "owner") return pushOn("owner");
  return false;
}
/* langganan notifikasi disegarkan otomatis tiap hari & saat aplikasi dibuka, agar tidak putus */
let _pushSyncAt = 0;
async function pushResync(force){
  if(!PUSH_OK || Notification.permission !== "granted") return;
  const roles = ["driver", "store", "owner", "buyer"].filter(r => lsGet("jt_push_" + r) === "1"); if(!roles.length) return;
  if(!force && Date.now() - _pushSyncAt < 60e3) return; _pushSyncAt = Date.now();
  try{
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if(!sub) sub = await reg.pushManager.subscribe({userVisibleOnly:true, applicationServerKey:b64u(VAPID_PUB)});
    const day = new Date().toISOString().slice(0, 10), sig = sub.endpoint.slice(-24) + "|" + day;
    for(const r of roles){
      if(!force && lsGet("jt_pushsync_" + r) === sig) continue;
      try{ await sbStore.rpc("jt_push_save", {p_sub:sub.toJSON(), p_role:r}); lsSet("jt_pushsync_" + r, sig); }catch(_){}
    }
  }catch(_){}
}
setTimeout(() => pushResync(true), 4000);
setInterval(() => { if(siagaNow()) keepAwake(true); }, 20000);
async function pushTest(){
  try{
    const reg = await navigator.serviceWorker.ready;
    await reg.showNotification("Tes notifikasi JAGA ✓", {body:"Notifikasi berfungsi. Order baru akan muncul seperti ini walau aplikasi ditutup.", icon:"icons/icon-192.png", badge:"icons/icon-192.png", tag:"jt-test", renotify:true, vibrate:[400, 150, 400, 150, 600], requireInteraction:false});
    loudTone("order"); toast("Notifikasi tes dikirim. Cek bilah notifikasi HP.");
  }catch(e){ toast("Tes gagal: " + String(e.message || e).slice(0, 80)); }
  pushResync(true);
}
const NOTIFY_RPC = {jt_order_create:"order", jt_order_update:"order", jt_driver_act:"auto", jt_ride_create:"ride", jt_ride_act:"ride", jt_owner_order_set:null, jt_pick_verify:"order"};
function notifyPush(kind, id){
  if(!SB || !id) return;
  try{
    fetch(String(CFG.supabaseUrl).replace(/\/$/, "") + "/functions/v1/notify", {method:"POST", keepalive:true,
      headers:{"content-type":"application/json", apikey:CFG.supabaseAnonKey, authorization:"Bearer " + CFG.supabaseAnonKey}, body:JSON.stringify({kind, id})}).catch(() => {});
  }catch(e){}
}
if(SB){
  const _rpc = sbStore.rpc.bind(sbStore);
  sbStore.rpc = async function(fn, args){
    const r = await _rpc(fn, args);
    if(fn in NOTIFY_RPC && args && args.p_id){
      const kind = fn === "jt_owner_order_set" ? args.p_kind : NOTIFY_RPC[fn];
      setTimeout(() => notifyPush(kind, args.p_id), 300);
    }
    return r;
  };
}

/* ---------- rating ---------- */
const RATE = {
  async summary(){
    if(SB){ const { data } = await SB.rpc("jt_rating_summary", {}); return data || {store:{}, driver:{}}; }
    const out = {store:{}, driver:{}};
    (S.localRatings || []).forEach(r => { const m = out[r.target][r.targetId] = out[r.target][r.targetId] || {sum:0, n:0}; m.sum += r.stars; m.n++; });
    ["store","driver"].forEach(t => Object.values(out[t]).forEach(m => { m.avg = Math.round(m.sum / m.n * 10) / 10; }));
    return out;
  },
  async mine(){
    if(SB) return await sbStore.rpc("jt_my_ratings", {}) || {};
    const o = {}; (S.localRatings || []).forEach(r => { if(r.rater === ME) o[r.ref + ":" + r.target] = r.stars; }); return o;
  },
  async rate(kind, ref, target, stars, comment){
    if(SB) return sbStore.rpc("jt_rate", {p_kind:kind, p_ref:ref, p_target:target, p_stars:stars, p_comment:comment || ""});
    const o = kind === "ride" ? S.ridesAll.find(x => x.id === ref) : S.orders.find(x => x.id === ref);
    if(!o || o.status !== "selesai") throw srvErr("Nilai bisa diberikan setelah pesanan selesai");
    const tid = target === "driver" ? o.driverId : o.storeId;
    if(!tid) throw srvErr("Tidak ada yang bisa dinilai");
    await store.set("ratings/" + ref + "_" + target, {kind, ref, target, targetId:tid, stars, comment:comment || "", rater:ME, at:Date.now()});
  }
};
async function loadRatings(){
  try{ S.ratings = await RATE.summary() || S.ratings; S.myRatings = await RATE.mine() || {}; }catch(e){}
  if(!typing()) scheduleRender();
}
const starBar = a => '<span class="sbar" aria-hidden="true">★★★★★<span style="width:'+Math.max(0, Math.min(100, (Number(a)||0) / 5 * 100)).toFixed(0)+'%">★★★★★</span></span>';
const starTxt = (r, showNew) => r && r.n ? '<span class="rstar" aria-label="Nilai '+String(r.avg).replace(".", ",")+' dari 5, '+r.n+' penilaian">'+starBar(r.avg)+' <b>'+String(r.avg).replace(".", ",")+'</b> <i>('+r.n+')</i></span>' : (showNew ? '<span class="rstar new" aria-label="Belum ada penilaian">'+starBar(0)+' <i>Baru</i></span>' : '');
const storeStars = id => starTxt((S.ratings.store || {})[id], true);
const driverStars = id => starTxt((S.ratings.driver || {})[id], true);

/* ---------- laporan masalah ---------- */
const REASONS = {
  order:["Pesanan tidak sampai","Barang kurang / salah","Barang rusak / basi","Driver tidak sopan","Toko tidak merespons","Lainnya"],
  ride:["Driver tidak datang","Driver tidak sopan / tidak aman","Tarif tidak sesuai","Barang tertinggal","Lainnya"]
};
const REP = {
  async create(kind, ref, reason, body, photo){
    if(SB) return sbStore.rpc("jt_report_create", {p_kind:kind, p_ref:ref, p_reason:reason, p_body:body, p_photo:photo || ""});
    const o = kind === "ride" ? S.ridesAll.find(x => x.id === ref) : S.orders.find(x => x.id === ref);
    await store.set("reports/r" + Date.now(), {kind, ref, code:o ? o.code : "", reporter:ME, role:S.role === "driver" ? "driver" : S.role === "seller" ? "toko" : (kind === "ride" ? "penumpang" : "pembeli"),
      name:getProf().name || "", wa:getProf().wa || "", reason, body, photo:photo || "", status:"baru", note:"", at:Date.now()});
  },
  async mine(){ if(SB) return await sbStore.rpc("jt_my_reports", {}) || []; return (S.localReports || []).filter(r => r.reporter === ME); },
  async all(){ if(SB) return await sbStore.rpc("jt_owner_reports", {}) || []; return (S.localReports || []).slice().sort((a, b) => (a.status === "selesai") - (b.status === "selesai") || b.at - a.at); },
  async set(id, status, note){ if(SB) return sbStore.rpc("jt_owner_report_set", {p_id:id, p_status:status, p_note:note || ""}); await store.update("reports/" + id, {status, note:note || ""}); }
};
async function loadMyReports(){ try{ S.reports = await REP.mine(); }catch(e){} if(!typing()) scheduleRender(); }
const REP_ST = {baru:["Laporan diterima","blue"], diproses:["Sedang ditangani",""], selesai:["Selesai","green"]};
function openReport(kind, ref){
  const rs = REASONS[kind] || REASONS.order;
  document.getElementById("modal").innerHTML = '<div class="modal-bg" data-act="modal-bg"><form class="modal" id="repForm" data-kind="'+esc(kind)+'" data-ref="'+esc(ref)+'">'+
    '<h2 class="sec" style="display:flex;gap:8px;align-items:center">'+E("bell")+' Laporkan masalah</h2>'+
    '<div class="garansi">'+I("badge")+'<div><b>Garansi JAGA</b><small>Laporkan dalam 24 jam bila pesanan tidak sampai atau bermasalah. Tim JAGA akan menghubungi Anda lewat WhatsApp dan membantu penyelesaiannya.</small></div></div>'+
    '<label class="f">Apa masalahnya?</label><div class="repr">'+rs.map((r, i) => '<label><input type="radio" name="reason" value="'+esc(r)+'"'+(i===0?' checked':'')+'><span>'+esc(r)+'</span></label>').join("")+'</div>'+
    '<label class="f">Ceritakan singkat</label><textarea class="in" name="body" rows="3" placeholder="Apa yang terjadi?"></textarea>'+
    '<label class="f">Foto (opsional)</label><input type="file" accept="image/*" class="in" id="repPhoto">'+
    '<div class="actions" style="margin-top:14px"><button class="btn" style="flex:1">Kirim laporan</button><button type="button" class="btn ghost" data-act="close-modal">Batal</button></div></form></div>';
}
function trustBox(o, kind){
  if(!o) return "";
  let h = '<div class="trustbox">';
  if(o.status === "selesai" && S.role !== "driver" && S.role !== "seller"){
    const targets = [];
    if(o.driverId) targets.push(["driver", "Driver" + (o.driver && o.driver.name ? " " + o.driver.name : "")]);
    if(kind === "order") targets.push(["store", "Toko " + (o.storeName || "")]);
    targets.forEach(([t, label]) => {
      const mine = S.myRatings[o.id + ":" + t];
      h += '<div class="rate"><small>'+(mine ? 'Nilai kamu untuk '+esc(label) : 'Beri nilai '+esc(label))+'</small><div class="stars">'+[1,2,3,4,5].map(n => '<button class="'+(mine && n <= mine ? 'on' : '')+'" data-act="rate" data-v="'+n+'" data-t="'+t+'" data-k="'+kind+'" data-id="'+esc(o.id)+'" aria-label="'+n+' bintang">★</button>').join("")+'</div></div>';
    });
  }
  const reps = (S.reports || []).filter(r => r.ref === o.id);
  reps.forEach(r => { const st = REP_ST[r.status] || [r.status, ""]; h += '<div class="repst"><span class="tag '+st[1]+'">'+st[0]+'</span><b>'+esc(r.reason)+'</b>'+(r.note ? '<small>Tanggapan JAGA: '+esc(r.note)+'</small>' : '<small>Tim JAGA akan menghubungi lewat WhatsApp.</small>')+'</div>'; });
  if(o.status !== "menunggu_pembayaran") h += '<button class="linkbtn rep" data-act="report" data-k="'+kind+'" data-id="'+esc(o.id)+'">'+I("bell")+' Laporkan masalah · Garansi JAGA</button>';
  return h + '</div>';
}

/* ---------- verifikasi driver ---------- */
const DOCS = [["ktp","Foto KTP"],["sim","Foto SIM"],["stnk","Foto STNK kendaraan"],["selfie","Selfie sambil memegang KTP"]];
S.drvDocs = {};
async function drvSubmitDocs(docs){
  if(SB) return sbStore.rpc("jt_driver_docs_submit", {p_docs:docs});
  const id = S.drv.me ? S.drv.me.id : DRIVER_ID_LOCAL;
  await store.set("driverdocs/" + id, Object.assign({at:Date.now()}, docs));
  await store.update("drivers/" + id, {verify:"pending", docsAt:Date.now(), verifyNote:""});
}
function drvVerifyView(me){
  const rej = me.verify === "rejected";
  let h = '<div class="card dme"><div class="drv-av big">'+esc(initials(me.name))+'</div><div class="grow"><b>'+esc(me.name)+'</b><small>'+esc([me.vehicle, me.plate, me.area].filter(Boolean).join(" · "))+'</small><button class="linkbtn" data-act="drv-edit">Ubah data</button></div></div>';
  h += '<div class="vrfy '+(rej ? 'rej' : 'wait')+'">'+E(rej ? "bell" : "clock")+'<div><b>'+(rej ? "Pendaftaran ditolak" : "Menunggu persetujuan tim JAGA")+'</b>'+
    '<small>'+(rej ? esc(me.verifyNote || "Data belum sesuai.")+' Perbaiki lewat “Ubah data”, lalu pendaftaran dikirim ulang.' :
      'Demi <b>JAminan Driver dan toko Aman</b>, setiap driver disetujui tim JAGA dulu sebelum menerima order. Tim JAGA mungkin menghubungi kamu lewat WhatsApp.')+'</small></div></div>';
  h += '<div class="card pad" style="margin:0 16px"><h3 class="sub">Data pendaftaran</h3>'+
    [["Nama", me.name], ["WhatsApp", me.wa], ["Kendaraan", me.vehicle], ["Plat nomor", me.plate], ["Alamat", me.address], ["Area narik", me.area]].map(r => '<div class="row"><span class="muted">'+r[0]+'</span><span>'+esc(r[1] || "-")+'</span></div>').join("")+'</div>';
  h += '<div class="small muted" style="text-align:center;margin:14px">Ingin cepat diproses? <a target="_blank" rel="noopener" href="'+esc(waLink(CONTACT.wa, "Halo JAGA, saya "+me.name+" (plat "+(me.plate||"-")+") sudah daftar driver, mohon diverifikasi."))+'">WhatsApp JAGA</a></div>';
  return h;
}
document.addEventListener("change", async e => {
  const k = e.target.dataset && e.target.dataset.doc; if(!k) return;
  const f = e.target.files && e.target.files[0]; if(!f) return;
  try{ S.drvDocs[k] = await compressImage(f, 1100); }catch(err){ toast("Foto tidak bisa dibaca, coba foto lain."); }
  render();
});

/* ---------- owner: verifikasi, laporan, tutup pesanan ---------- */
const OWNX = {
  async docs(id){ if(SB) return await sbStore.rpc("jt_owner_driver_docs", {p_driver:id}) || {}; return S.localDriverDocs && S.localDriverDocs[id] || {}; },
  async verify(id, ok, note){
    if(SB) return sbStore.rpc("jt_owner_driver_verify", {p_driver:id, p_ok:ok, p_note:note || ""});
    await store.update("drivers/" + id, Object.assign({verify:ok ? "verified" : "rejected", verifyNote:note || ""}, ok ? {} : {online:false}));
    if(ok) await localDrvBonus(id);
  },
  async close(kind, id, status, note){
    if(SB) return sbStore.rpc("jt_owner_order_set", {p_kind:kind, p_id:id, p_status:status, p_note:note || ""});
    const now = Date.now();
    if(kind === "ride"){
      const o = S.ridesAll.find(x => x.id === id); const fare = o.fareFinal != null ? o.fareFinal : o.fareEst || 0;
      await store.update("rides/" + id, status === "selesai" ? {status, fareFinal:fare, fee:rideFee(fare), doneAt:now, updatedAt:now, closedBy:"owner"} : {status, cancelBy:"JAGA", updatedAt:now, closedBy:"owner"});
    } else {
      const o = S.orders.find(x => x.id === id);
      await store.update("orders/" + id, status === "selesai" ? {status, doneAt:now, updatedAt:now, closedBy:"owner"} : {status, cancelBy:"JAGA", updatedAt:now, closedBy:"owner"});
      if(status === "selesai" && o) await localChargeFee(o);
    }
  }
};
S.own.reports = null;
async function loadOwnerReports(){ try{ S.own.reports = await REP.all(); }catch(e){ S.own.reports = []; } if(S.role === "owner" && !typing()) scheduleRender(); }
/* ---------- Toko kelolaan JAGA (percobaan 30 toko) — diisi tim JAGA lewat portal owner ---------- */
async function loadMData(){
  if(!SB || S.own.mBusy) return; S.own.mBusy = true;
  try{
    const r = await sbStore.rpc("jt_owner_mdata", {}); const sig = JSON.stringify(r);
    const pend = (r.orders || []).filter(o => o.status === "menunggu_konfirmasi").map(o => o.id);
    if(S.own.mPend && S.role === "owner"){ const fresh = pend.filter(id => !S.own.mPend.includes(id)); if(fresh.length){ const o0 = r.orders.find(o => o.id === fresh[0]) || {}; notify("Pesanan toko JAGA perlu disetujui", (o0.code || "") + " · " + (o0.storeName || "") + " · " + rp(o0.total || 0), {kind:"order", act:() => { S.own.tab = "mtoko"; render(); }}); } }
    S.own.mPend = pend;
    if(sig !== S.own.mSig){ S.own.mSig = sig; S.own.m = r; if(!typing()) scheduleRender(); }
  }catch(e){ S.own.m = S.own.m || {stores:[], orders:[], limit:30}; S.own.mErr = String((e && e.message) || e); }
  S.own.mBusy = false;
}
function mOrderCard(o){
  const items = (o.items || []).map(it => esc(it.qty + "× " + it.name)).join(", ");
  let h = '<div class="card mord"><div class="mord-h"><div><b>'+esc(o.storeName || "-")+'</b><small>'+esc(o.code || "")+' · '+fmtDate(o.createdAt)+'</small></div>'+statusTag(o.status)+'</div>'+
    '<div class="mord-b"><div>'+items+'</div><div class="small muted">Untuk: '+esc((o.buyer && o.buyer.name) || "-")+' · '+esc((o.buyer && o.buyer.address) || "")+'</div>'+
    '<div class="mord-t"><span>Harga menu <b>'+rp(o.subtotal || o.total || 0)+'</b></span><span>Ongkir ±<b>'+rp(o.ongkirEst || 0)+'</b></span><span>Ditagih ke pembeli ±<b>'+rp((o.total || 0) + (o.ongkirEst || 0))+'</b></span></div>'+
    (o.driver ? '<div class="small" style="margin-top:4px">Driver: <b>'+esc(o.driver.name)+'</b> '+esc(o.driver.plate || "")+'</div>' : '')+'</div>';
  if(o.status === "menunggu_konfirmasi") h += '<div class="actions"><button class="btn press grow" data-act="m-ok" data-id="'+esc(o.id)+'">'+I("checkc")+' Setujui & cari driver</button><button class="btn danger sm" data-act="m-no" data-id="'+esc(o.id)+'">Tolak</button></div>';
  return h + '</div>';
}
function ownerMTab(){
  if(!SB && !S.own.m) return '<div class="card pad muted small">Toko kelolaan JAGA aktif di website asli (terhubung database).</div>';
  if(S.own.m === undefined){ S.own.m = null; loadMData(); }
  if(S.own.mf) return mStoreForm();
  const M = S.own.m; if(!M) return '<div class="card pad muted small">Memuat…</div>';
  const st = M.stores || [], od = M.orders || [];
  const pend = od.filter(o => o.status === "menunggu_konfirmasi"), run = od.filter(o => !["menunggu_konfirmasi","selesai","dibatalkan"].includes(o.status)), done = od.filter(o => ["selesai","dibatalkan"].includes(o.status));
  let h = '<div class="jmtop"><div class="mstats"><div><small>Toko percobaan</small><b>'+st.length+'<i>/'+(M.limit || 30)+'</i></b></div><div><small>Perlu disetujui</small><b class="'+(pend.length ? 'red' : '')+'">'+pend.length+'</b></div><div><small>Pesanan berjalan</small><b>'+run.length+'</b></div></div>'+
    '<div class="jmbtns"><button class="btn press" data-act="m-new"'+(st.length >= (M.limit || 30) ? ' disabled' : '')+'>'+I("plus")+' Daftarkan toko</button>'+(pushOn("owner") ? '' : '<button class="btn ghost" data-act="push-on" data-v="owner">'+I("megaphone")+' Aktifkan notifikasi pesanan</button>')+'</div>'+
    '<div class="hint">Toko yang didaftarkan di sini langsung tampil di aplikasi pembeli seperti toko biasa. Pesanan masuk ke portal ini untuk disetujui. Driver membeli pesanan di toko (QRIS toko atau uang driver), lalu pembeli membayar harga menu + ongkir ke driver saat pesanan sampai.</div></div>';
  if(pend.length) h += '<h3 class="sub" style="margin:16px 4px 8px">Perlu disetujui ('+pend.length+')</h3>'+pend.map(mOrderCard).join("");
  if(run.length) h += '<h3 class="sub" style="margin:16px 4px 8px">Pesanan berjalan ('+run.length+')</h3>'+run.map(mOrderCard).join("");
  h += '<h3 class="sub" style="margin:16px 4px 8px">Toko percobaan ('+st.length+')</h3>';
  h += st.length ? '<div class="mgrid">'+st.map(s => '<div class="card mst"><div class="mst-h">'+avatarHtml(s)+'<div class="grow"><b>'+esc(s.name)+'</b><small>'+esc(s.category)+' · '+esc(s.area || "")+' · '+esc(regionName(s.region))+'</small></div>'+(s.open === false ? '<span class="tag gray">Tutup</span>' : '<span class="tag green">Buka</span>')+'</div>'+
      (s.login ? '<div class="small muted" style="margin-top:6px">'+I("badge")+' Login pemilik: <b>'+esc(s.login)+'</b>'+(s.owners ? ' · aktif di '+s.owners+' HP' : ' · belum dipakai')+'</div>' : '<div class="small muted" style="margin-top:6px">Belum ada akun pemilik toko</div>')+
      '<div class="mst-k"><span><b>'+(s.products || []).length+'</b> menu</span><span><b>'+(s.nDone || 0)+'</b> selesai</span><span><b>'+rp(s.omzet || 0)+'</b> omzet</span></div>'+
      '<div class="actions"><button class="btn ghost sm" data-act="m-edit" data-id="'+esc(s.id)+'">'+I("settings")+' Ubah toko & menu</button><button class="btn ghost sm" data-act="m-open" data-id="'+esc(s.id)+'" data-v="'+(s.open === false ? '1' : '0')+'">'+(s.open === false ? 'Buka toko' : 'Tutup sementara')+'</button></div></div>').join("")+'</div>'
    : '<div class="card pad muted small">Belum ada toko. Tekan “Daftarkan toko”, isi nama, menu, dan ambil lokasi saat berada di toko.</div>';
  if(done.length) h += '<h3 class="sub" style="margin:16px 4px 8px">Selesai / batal (3 hari terakhir)</h3>'+done.slice(0, 20).map(mOrderCard).join("");
  return h;
}
function mStoreForm(){
  const f = S.own.mf, d = f.d;
  const row = (m, i) => '<div class="mrow"><label class="mimg" title="Foto menu">'+(m.img ? '<img alt="" src="'+esc(m.img)+'">' : I("camera"))+'<input type="file" accept="image/*" data-mimg="'+i+'" hidden></label>'+
    '<input class="in" name="mname'+i+'" placeholder="Nama menu" value="'+esc(m.name || "")+'"><input class="in mprice" name="mprice'+i+'" inputmode="numeric" placeholder="Harga" value="'+esc(m.price || "")+'">'+
    '<button type="button" class="ibtn" data-act="m-row-del" data-v="'+i+'" aria-label="Hapus menu">✕</button></div>';
  return '<form id="mForm" class="card pad mform"><div class="row-b"><h3 class="sub" style="margin:0">'+(f.id ? 'Ubah toko' : 'Daftarkan toko percobaan')+'</h3><button type="button" class="btn ghost sm" data-act="m-cancel">Batal</button></div>'+
    '<div class="cols2"><div><label class="f">Nama toko *</label><input class="in" name="name" required value="'+esc(d.name || "")+'" placeholder="Contoh: Soto Pak Kumis"></div>'+
    '<div><label class="f">Kategori *</label><select class="in" name="category">'+CATS.map(c => '<option'+(d.category === c ? ' selected' : '')+'>'+esc(c)+'</option>').join("")+'</select></div></div>'+
    '<div class="cols2"><div><label class="f">Daerah</label><input class="in" name="area" value="'+esc(d.area || "Ujungbatu")+'"></div><div><label class="f">Jam buka</label><input class="in" name="hours" value="'+esc(d.hours || "")+'" placeholder="08.00–22.00"></div></div>'+
    '<label class="f">Alamat</label><input class="in" name="address" value="'+esc(d.address || "")+'" placeholder="Jl. … dekat …">'+
    '<label class="f">No. WhatsApp pemilik toko</label><input class="in" name="wa" inputmode="tel" value="'+esc(d.wa || "")+'" placeholder="08…">'+
    '<div class="macc"><b>'+I("badge")+' Akun pemilik toko</b><small>Buat nama login & password agar pemilik toko yang asli bisa masuk lewat halaman Masuk → Toko, memantau pesanan, dan mengubah menu sendiri.'+(f.login ? ' Login sekarang: <b>'+esc(f.login)+'</b>'+(f.owners ? ' · dipakai di '+f.owners+' HP' : '')+'. Isi password baru untuk menggantinya.' : '')+'</small>'+
    '<div class="cols2"><div><label class="f">Nama login</label><input class="in" name="login" autocapitalize="none" autocomplete="off" value="'+esc(d.login || f.login || "")+'" placeholder="contoh: tehdesa"></div>'+
    '<div><label class="f">Password'+(f.login ? ' baru' : '')+'</label><input class="in" name="pass" autocomplete="off" value="'+esc(d.pass || "")+'" placeholder="min. 4 karakter"></div></div></div>'+
    '<label class="f">Titik lokasi toko *</label><div class="mloc"><input class="in" name="ll" value="'+(typeof d.lat === "number" ? d.lat + ", " + d.lng : "")+'" placeholder="Ketuk tombol saat di toko, atau tempel koordinat Google Maps"><button type="button" class="btn ghost" data-act="m-gps">'+I("pin")+' Lokasi saya</button></div>'+
    '<div class="cols2" style="margin-top:6px"><div><label class="f">Logo / foto toko</label><label class="mlogo">'+(d.logo ? '<img alt="" src="'+esc(d.logo)+'">' : I("camera")+'<span>Pilih foto</span>')+'<input type="file" accept="image/*" data-mlogo="1" hidden></label></div>'+
    '<div><label class="f">Foto daftar menu (arsip)</label><label class="mlogo">'+(d.menuPhoto || f.hasMenuPhoto ? (d.menuPhoto ? '<img alt="" src="'+esc(d.menuPhoto)+'">' : I("checkc")+'<span>Tersimpan</span>') : I("camera")+'<span>Pilih foto</span>')+'<input type="file" accept="image/*" data-mmenu="1" hidden></label></div></div>'+
    '<label class="f" style="margin-top:12px">Menu *</label><div class="mrows">'+f.menu.map(row).join("")+'</div>'+
    '<button type="button" class="btn ghost sm" data-act="m-row-add">'+I("plus")+' Tambah menu</button>'+
    '<button class="btn block press" style="margin-top:16px">'+(f.id ? 'Simpan perubahan' : 'Daftarkan & terbitkan')+'</button></form>';
}
function mAccModal(a){
  const msg = "Halo, ini tim JAGA. Toko " + a.name + " sudah tampil di aplikasi JAGA (jagapatner.my.id/apps).\n\nUntuk masuk sebagai pemilik toko:\nBuka aplikasi → Masuk → Toko\nNama login: " + a.login + "\nPassword: " + a.pass + "\n\nSegera ganti password setelah masuk. Jangan berikan ke siapa pun.";
  document.getElementById("modal").innerHTML = '<div class="modal-bg" data-act="modal-bg"><div class="modal"><h2 class="sec">Akun pemilik toko siap</h2>'+
    '<div class="tmppass"><small>Toko</small><b>'+esc(a.name)+'</b><small>Nama login</small><b>'+esc(a.login)+'</b><small>Password</small><b class="pw">'+esc(a.pass)+'</b></div>'+
    '<div class="hint">Pemilik toko masuk lewat halaman <b>Masuk → Toko</b>. Pesanan toko percobaan tetap juga masuk ke portal owner.</div>'+
    '<div class="actions">'+(a.wa ? '<a class="btn press" target="_blank" rel="noopener" href="'+esc(waLink(a.wa, msg))+'">'+I("chat")+' Kirim ke WA pemilik</a>' : '')+'<button class="btn ghost" id="maCopy">Salin</button><button class="btn ghost" data-act="close-modal">Tutup</button></div></div></div>';
  document.getElementById("maCopy").onclick = () => { try{ navigator.clipboard.writeText(msg); toast("Disalin"); }catch(_){ toast("Gagal menyalin"); } };
}
function mSync(){
  const form = document.getElementById("mForm"); if(!form || !S.own.mf) return;
  const fd = new FormData(form), f = S.own.mf;
  ["name","category","area","hours","address","wa","login","pass"].forEach(k => { f.d[k] = String(fd.get(k) || ""); });
  const ll = String(fd.get("ll") || "").match(/(-?\d+(?:\.\d+)?)\s*[, ]\s*(-?\d+(?:\.\d+)?)/);
  if(ll){ f.d.lat = +ll[1]; f.d.lng = +ll[2]; } else { delete f.d.lat; delete f.d.lng; }
  f.menu.forEach((m, i) => { m.name = String(fd.get("mname"+i) || "").trim(); m.price = String(fd.get("mprice"+i) || "").replace(/\D/g, ""); });
}
async function mSave(){
  mSync(); const f = S.own.mf, d = f.d;
  const menu = f.menu.filter(m => m.name || m.price || m.img);
  if(!menu.length) return toast("Isi minimal 1 menu");
  if(menu.some(m => !m.name || !(+m.price > 0))) return toast("Lengkapi nama dan harga setiap menu");
  if(typeof d.lat !== "number") return toast("Ambil titik lokasi toko dulu");
  S.own.mSaving = true; const btn = document.querySelector("#mForm button.btn.block"); if(btn) btn.disabled = true;
  try{
    const body = {name:d.name, category:d.category, area:d.area, hours:d.hours, address:d.address, wa:d.wa, lat:d.lat, lng:d.lng};
    if(d.logo !== undefined) body.logo = await mediaUp(d.logo); if(d.menuPhoto !== undefined) body.menuPhoto = await mediaUp(d.menuPhoto);
    const r = await sbStore.rpc("jt_owner_mstore_save", {p_id:f.id || null, p_data:body});
    const sid = r.id;
    for(const m of menu){ const pd = {name:m.name, price:+m.price, active:true}; if(m.imgNew) pd.img = await mediaUp(m.img); await sbStore.rpc("jt_owner_mprod_save", {p_store:sid, p_pid:m.id || null, p_data:pd}); }
    for(const pid of (f.removed || [])) await sbStore.rpc("jt_owner_mprod_del", {p_store:sid, p_pid:pid});
    let acc = null;
    if(d.pass.trim()){
      if(!d.login.trim()) throw new Error("Isi nama login pemilik toko");
      acc = await sbStore.rpc("jt_owner_mstore_setlogin", {p_store:sid, p_login:d.login.trim(), p_pass:d.pass.trim()});
      acc.pass = d.pass.trim(); acc.name = d.name;
    }
    S.own.mf = null;
    if(acc) setTimeout(() => mAccModal(acc), 300); S.own.mSig = ""; toast(f.id ? "Toko diperbarui" : "Toko terdaftar & langsung tampil di aplikasi"); await loadMData(); render();
  }catch(err){ if(btn) btn.disabled = false; toast(String(err.message || err).replace(/^.*?:\s*/, "")); }
  S.own.mSaving = false;
}
document.addEventListener("change", async e => {
  const t = e.target; if(!S.own || !S.own.mf || !t.files || !t.files[0]) return;
  try{
    if(t.dataset.mimg != null){ mSync(); const m = S.own.mf.menu[+t.dataset.mimg]; m.img = await compressImage(t.files[0], 600); m.imgNew = true; render(); }
    else if(t.dataset.mlogo){ mSync(); S.own.mf.d.logo = await compressImage(t.files[0], 300); render(); }
    else if(t.dataset.mmenu){ mSync(); S.own.mf.d.menuPhoto = await compressImage(t.files[0], 1100); render(); }
  }catch(_){ toast("Gambar tidak bisa dibaca."); }
});
document.addEventListener("submit", e => { if(e.target.id === "mForm"){ e.preventDefault(); mSave(); } });

async function loadOwnerRec(){
  if(!SB) return;
  try{ const r = await sbStore.rpc("jt_owner_recover_list", {}); const sig = JSON.stringify(r); if(sig !== S.own.recSig){ S.own.recSig = sig; S.own.rec = r || []; if(!typing()) render(); } }catch(e){ S.own.rec = S.own.rec || []; }
}
/* akun login toko & driver di portal owner (password tersimpan terenkripsi, jadi owner membuat password sementara) */
function accLoad(){ if(!SB || S.own.accBusy) return; S.own.accBusy = true; sbStore.rpc("jt_owner_accounts", {}).then(r => { S.own.acc = r || {stores:{}, drivers:{}}; render(); }).catch(() => { S.own.acc = {stores:{}, drivers:{}}; }).finally(() => { S.own.accBusy = false; }); }
function accLine(kind, id, name, plate){
  if(SB && S.own.acc === undefined){ S.own.acc = null; accLoad(); }
  const A = S.own.acc; if(!A && SB) return "";
  const a = A ? (kind === "store" ? A.stores : A.drivers)[id] : null;
  const who = kind === "store" ? (a ? 'Login: <b>'+esc(a.login)+'</b>' : '<span class="warnc">Belum punya login</span>')
    : 'Login: <b>'+esc(name || "-")+'</b> + plat <b>'+esc(plate || "-")+'</b>'+(a ? '' : ' · <span class="warnc">belum punya password</span>');
  return '<div class="oacc">'+I("badge")+'<span class="grow">'+who+(a && a.locked ? ' · <span class="warnc">terkunci (salah password)</span>' : '')+(a ? ' · Password: <b>••••••</b>' : '')+'</span>'+
    '<button class="linkbtn small" data-act="own-resetpass" data-k="'+kind+'" data-id="'+esc(id)+'" data-v="'+esc(name || "")+'">'+(a ? 'Reset password' : 'Buat login')+'</button></div>';
}
function ownerRecTab(){
  if(!SB && !S.own.rec) return '<div class="card pad muted small">Pemulihan akun aktif di website asli (terhubung database).</div>';
  const L = S.own.rec || [];
  if(!L.length) return '<div class="card pad muted small">Belum ada permintaan pemulihan akun. Saat toko atau driver menekan “Lupa akun atau password?”, permintaannya muncul di sini.</div>';
  const mt = (ok, t) => '<span class="mt'+(ok ? '' : ' no')+'">'+(ok ? '✓ ' : '')+t+'</span>';
  return '<div class="hint" style="margin:0 0 10px">Cocokkan data dengan akun yang ada. Sebaiknya hubungi nomor WhatsApp-nya dulu untuk memastikan pemiliknya asli, lalu tekan <b>Konfirmasi</b>. Akun akan langsung terhubung ke HP peminta dan ia diminta membuat password baru.</div><div class="orec">'+
    L.map(r => {
      const drv = r.role === "driver";
      let h = '<div class="card rq"><div class="rq-h"><div><b>'+esc(r.name || "-")+'</b> <span class="tag '+(drv?'blue':'amber')+'">'+(drv?'Driver':'Toko')+'</span>'+
        '<div class="rq-meta">WA '+esc(r.wa)+(r.plate?' · Plat '+esc(r.plate):'')+' · '+fmtDate(r.at)+(r.note?'<br>“'+esc(r.note)+'”':'')+'</div></div>'+
        (r.pending ? '<span class="tag amber">Menunggu</span>' : r.status === "ok" ? '<span class="tag green">Dikonfirmasi</span>' : '<span class="tag gray">Ditolak</span>')+'</div>';
      if(r.pending){
        h += '<div class="actions" style="margin-top:8px"><a class="btn ghost sm" target="_blank" rel="noopener" href="'+esc(waLink(r.wa, "Halo, ini tim JAGA. Kami menerima permintaan pemulihan akun "+(drv?"driver":"toko")+" atas nama "+r.name+". Benar Anda yang mengajukan?"))+'">'+I("chat")+' Hubungi WA</a></div>';
        const C = r.cands || [];
        h += C.length ? C.map(c => '<div class="cand"><div><b>'+esc(c.name || "-")+'</b><small>'+
            (drv ? esc((c.plate || "-") + ' · WA ' + (c.wa || "-") + ' · ' + (c.trips || 0) + ' trip') : esc((c.login ? 'login: ' + c.login : 'belum punya login') + ' · WA ' + (c.wa || "-") + ' · ' + (c.orders || 0) + ' pesanan'))+'</small>'+
            '<div style="margin-top:4px">'+mt(c.waMatch, "WA")+mt(c.nameMatch, "Nama")+(drv ? mt(c.plateMatch, "Plat") : '')+'</div></div>'+
            '<button class="btn sm press" data-act="own-rec-ok" data-id="'+esc(r.id)+'" data-v="'+esc(c.id)+'" data-n="'+esc(c.name || "")+'">Konfirmasi</button></div>').join("")
          : '<div class="muted small" style="margin-top:8px">Tidak ada akun yang cocok dengan WA atau nama ini.</div>';
        h += '<div class="actions" style="margin-top:10px"><button class="btn danger sm" data-act="own-rec-no" data-id="'+esc(r.id)+'">Tolak</button></div>';
      } else if(r.ownerNote) h += '<div class="small muted" style="margin-top:6px">Catatan: '+esc(r.ownerNote)+'</div>';
      return h + '</div>';
    }).join("")+'</div>';
}
async function loadOwnerBuyers(){
  if(!SB) return;
  try{ S.own.buyers = await sbStore.rpc("jt_owner_buyers", {}); }catch(e){ S.own.buyers = {gate:false, list:[], err:true}; }
  render();
}
function ownerBuyersTab(){
  if(!SB) return '<div class="card pad muted small">Pendaftaran pembeli aktif di website asli (terhubung database).</div>';
  const B = S.own.buyers;
  if(!B) return '<div class="empty">'+I("loader")+' Memuat…</div>';
  if(B.err) return '<div class="card pad muted small">Fitur akun pembeli belum aktif di database.</div>';
  const pend = B.list.filter(x => x.status === "pending"), rest = B.list.filter(x => x.status !== "pending");
  const stTag = st => st === "approved" ? '<span class="tag green">Disetujui</span>' : '<span class="tag amber">Ditolak</span>';
  let h = '<div class="card pad"><div class="orow"><div class="grow"><b>Wajib daftar untuk memesan</b><small>'+(B.gate ? 'AKTIF: pembeli baru harus disetujui owner dulu. Tamu tetap bisa melihat-lihat.' : 'MATI: siapa pun bisa memesan.')+'</small></div>'+
    '<div class="r"><button class="btn sm'+(B.gate?' ghost':'')+'" data-act="own-buyer-gate" data-v="'+(B.gate?"0":"1")+'">'+(B.gate?"Matikan":"Aktifkan")+'</button></div></div></div>';
  h += '<div class="card pad"><h3 class="sub">Menunggu persetujuan ('+pend.length+')</h3>'+(pend.length ? pend.map(x =>
    '<div class="orow"><div class="drv-av">'+esc(initials(x.name))+'</div><div class="grow"><b>'+esc(x.name)+'</b><small>'+esc(x.wa)+'</small><small>'+I("pin")+' '+esc(x.address)+'</small><small>Daftar '+ago(x.at)+'</small></div>'+
    '<div class="r"><button class="btn sm" data-act="own-buyer-do" data-id="'+esc(x.id)+'" data-v="1">Setujui</button><button class="btn ghost sm" data-act="own-buyer-do" data-id="'+esc(x.id)+'" data-v="0">Tolak</button></div></div>').join("") : '<div class="muted small">Tidak ada pendaftar baru.</div>')+'</div>';
  h += '<div class="card pad"><h3 class="sub">Semua pembeli ('+rest.length+')</h3>'+(rest.length ? rest.slice(0, 100).map(x =>
    '<div class="orow"><div class="drv-av">'+esc(initials(x.name))+'</div><div class="grow"><b>'+esc(x.name)+'</b> '+stTag(x.status)+'<small>'+esc(x.wa)+' · '+esc(x.address)+'</small></div>'+
    '<div class="r">'+(x.status === "approved" ? '<button class="linkbtn small dangerc" data-act="own-buyer-do" data-id="'+esc(x.id)+'" data-v="0">Cabut</button>' : '<button class="linkbtn small" data-act="own-buyer-do" data-id="'+esc(x.id)+'" data-v="1">Setujui</button>')+'</div></div>').join("") : '<div class="muted small">Belum ada.</div>')+'</div>';
  return h;
}
function ownerReportsTab(){
  const list = S.own.reports;
  if(!list){ loadOwnerReports(); return '<div class="empty">'+I("loader")+' Memuat laporan…</div>'; }
  if(!list.length) return '<div class="card pad"><div class="muted small">Belum ada laporan masalah. 🎉</div></div>';
  return '<div class="card pad">'+list.map(r => { const st = REP_ST[r.status] || [r.status, ""];
    return '<div class="orow rep'+(r.status === "selesai" ? ' done' : '')+'"><div class="grow"><b>'+esc(r.reason)+'</b> <span class="tag '+st[1]+'">'+st[0]+'</span>'+
      '<small>'+(r.kind === "ride" ? "Jago " : "Pesanan ")+esc(r.code || r.ref)+' · '+esc(r.role)+': '+esc(r.name || "-")+' · '+fmtDate(r.at)+'</small>'+
      (r.body ? '<div class="small" style="margin-top:4px">'+esc(r.body)+'</div>' : '')+
      (r.photo ? '<details><summary class="small" style="cursor:pointer;font-weight:700">Lihat foto</summary><img class="proof" alt="Foto laporan" src="'+esc(r.photo)+'"></details>' : '')+
      (r.note ? '<small>Tanggapan: '+esc(r.note)+'</small>' : '')+'</div>'+
      '<div class="r">'+(r.wa ? '<a class="btn ghost sm" target="_blank" rel="noopener" href="'+esc(waLink(r.wa, "Halo "+(r.name||"")+", ini tim JAGA tentang laporan Anda ("+r.reason+") untuk "+(r.code||"")+"."))+'">WA</a>' : '')+
      (r.status !== "selesai" ? '<button class="btn ghost sm" data-act="rep-set" data-id="'+r.id+'" data-v="'+(r.status === "baru" ? "diproses" : "selesai")+'">'+(r.status === "baru" ? "Tangani" : "Selesaikan")+'</button>' : '')+'</div></div>';
  }).join("")+'</div>';
}
function ownCloseBtn(kind, o){
  if(["selesai","dibatalkan"].includes(o.status)) return "";
  return '<button class="btn ghost sm" data-act="own-close" data-k="'+kind+'" data-id="'+esc(o.id)+'" data-v="'+esc(o.code || "")+'">Tutup</button>';
}
function ownRideRow(o){
  return '<div class="orow"><div class="grow"><b>'+esc(o.code)+'</b> · Jago<small>'+esc(o.rider ? o.rider.name : "")+' · '+esc(shortAddr(o.pickup && o.pickup.address) || "jemput")+' → '+esc(shortAddr(o.dest && o.dest.address) || "tujuan")+'</small>'+
    '<small>'+fmtDate(o.createdAt)+(o.driver ? ' · driver '+esc(o.driver.name) : '')+'</small></div><div class="r">'+statusTag(o.status)+'<b>'+rp(o.fareFinal != null ? o.fareFinal : o.fareEst || 0)+'</b>'+ownCloseBtn("ride", o)+'</div></div>';
}
async function openDriverDocs(id, name){
  document.getElementById("modal").innerHTML = '<div class="modal-bg" data-act="modal-bg"><div class="modal"><h2 class="sec">Dokumen '+esc(name)+'</h2><div id="ddocs" class="empty">'+I("loader")+' Memuat…</div></div></div>';
  let d = {}; try{ d = await OWNX.docs(id); }catch(e){}
  const box = document.getElementById("ddocs"); if(!box) return;
  box.className = "ddocs";
  box.innerHTML = DOCS.map(([k, l]) => '<div><small>'+l+'</small>'+(d[k] ? '<img alt="'+l+'" src="'+esc(d[k])+'">' : '<div class="muted small">Belum diunggah</div>')+'</div>').join("")+
    '<div class="actions" style="margin-top:12px"><button class="btn" data-act="drv-verify" data-id="'+esc(id)+'" data-v="1">Setujui driver</button><button class="btn danger" data-act="drv-verify" data-id="'+esc(id)+'" data-v="0">Tolak</button><button class="btn ghost" data-act="close-modal">Tutup</button></div>';
}

/* ---------- link khusus toko ---------- */
const storeLink = id => APP_URL + "#toko-" + id;
function openStoreFromHash(){
  let h = ""; try{ h = location.hash; }catch(e){}
  const m = h.match(/^#toko-([A-Za-z0-9_-]+)$/); if(!m) return false;
  S.role = "buyer"; try{ lsSet("jt_onb", "1"); }catch(e){}
  go("store", {storeId:m[1]}); return true;
}

/* ---------- aksi ---------- */
document.addEventListener("click", async e => {
  const el = e.target.closest("[data-act]"); if(!el) return;
  const a = el.dataset.act, id = el.dataset.id, v = el.dataset.v;
  if(a === "push-on"){ pushEnable(v); return; }
  if(a === "push-test"){ pushTest(); return; }
  if(a === "region-set"){ setRegion(v); return; }
  if(a === "region-pick"){ regionModal(); return; }
  if(a === "region-gps"){
    try{ const c = await getPos(); const r = areaOf(c); if(!r){ closeModal(); return toast("Lokasi Anda di luar wilayah layanan JAGA. Pilih wilayah secara manual."); } setProf(Object.assign(getProf(), {lat:c.lat, lng:c.lng})); setRegion(r); }
    catch(_){ toast("Lokasi tidak bisa dibaca. Pilih wilayah secara manual."); }
    return;
  }
  if(a === "nask-on"){ closeModal(); pushEnable("buyer"); return; }
  if(a === "nask-help"){ lsSet("jt_notif_ask", "0"); buyerNotifAsk("order"); return; }
  if(a === "report"){ openReport(el.dataset.k, id); return; }
  if(a === "rate"){
    const n = +v; el.parentNode.querySelectorAll("button").forEach((b, i) => b.classList.toggle("on", i < n));
    try{ await RATE.rate(el.dataset.k, id, el.dataset.t, n, ""); S.myRatings[id + ":" + el.dataset.t] = n; toast("Terima kasih! Nilai " + n + " bintang tersimpan."); loadRatings(); }
    catch(err){ toast(String(err.message || "Gagal").replace(/^.*?:\s*/, "")); }
    return;
  }
  if(a === "store-link"){ copyText(storeLink(id)); toast("Link toko disalin. Bagikan ke pelanggan lewat WhatsApp/status."); return; }
  if(a === "drv-docs"){ openDriverDocs(id, v); return; }
  if(a === "drv-verify"){
    const ok = v === "1";
    const go2 = async note => { try{ await OWNX.verify(id, ok, note); toast(ok ? "Driver disetujui dan langsung bisa menerima order." : "Verifikasi ditolak."); closeModal(); }catch(err){ toast(String(err.message||"Gagal").replace(/^.*?:\s*/, "")); } ownRefresh(); };
    if(ok) confirmModal("Setujui driver ini? Pastikan nama, plat nomor, dan alamatnya sudah dicek (misalnya lewat WhatsApp).", "Setujui", () => go2(""));
    else { const note = prompt("Alasan penolakan (dikirim ke driver):", "Foto dokumen kurang jelas"); if(note !== null) go2(note); }
    return;
  }
  if(a === "own-close"){
    const k = el.dataset.k, code = v;
    document.getElementById("modal").innerHTML = '<div class="modal-bg" data-act="modal-bg"><div class="modal"><h2 class="sec">Tutup '+(k === "ride" ? "perjalanan" : "pesanan")+' '+esc(code)+'</h2>'+
      '<p class="small muted">Pakai ini untuk '+(k === "ride" ? "perjalanan" : "pesanan")+' yang tertahan. "Selesai" mencatat '+(k === "ride" ? "tarif & komisi 3% driver" : "bagi hasil toko")+' seperti biasa. "Batalkan" mengembalikan stok.</p>'+
      '<label class="f">Catatan</label><input class="in" id="closeNote" placeholder="Contoh: sudah dikonfirmasi pembeli lewat WA">'+
      '<div class="actions" style="margin-top:14px"><button class="btn" data-act="own-close-do" data-k="'+k+'" data-id="'+esc(id)+'" data-v="selesai">Tandai selesai</button><button class="btn danger" data-act="own-close-do" data-k="'+k+'" data-id="'+esc(id)+'" data-v="dibatalkan">Batalkan</button><button class="btn ghost" data-act="close-modal">Kembali</button></div></div></div>';
    return;
  }
  if(a === "own-close-do"){
    const note = (document.getElementById("closeNote") || {}).value || "";
    el.disabled = true;
    try{ await OWNX.close(el.dataset.k, id, v, note); toast(v === "selesai" ? "Ditandai selesai." : "Dibatalkan."); closeModal(); }catch(err){ el.disabled = false; toast(String(err.message||"Gagal").replace(/^.*?:\s*/, "")); }
    ownRefresh(); return;
  }
  if(a === "rep-set"){
    const note = prompt(v === "selesai" ? "Tanggapan untuk pelapor (terlihat di aplikasinya):" : "Catatan penanganan (opsional):", "");
    if(note === null) return;
    try{ await REP.set(+id || id, v, note); toast("Laporan diperbarui."); }catch(err){ toast(String(err.message||"Gagal").replace(/^.*?:\s*/, "")); }
    loadOwnerReports(); ownRefresh(); return;
  }
});
document.addEventListener("submit", async e => {
  const f = e.target;
  if(f.id === "repForm"){
    e.preventDefault();
    const fd = new FormData(f), file = document.getElementById("repPhoto").files[0];
    const btn = f.querySelector("button.btn"); btn.disabled = true;
    try{
      const photo = file ? await compressImage(file, 1000) : "";
      await REP.create(f.dataset.kind, f.dataset.ref, fd.get("reason"), (fd.get("body") || "").trim(), photo);
      closeModal(); toast("Laporan terkirim. Tim JAGA akan segera menghubungi Anda."); loadMyReports();
    }catch(err){ btn.disabled = false; toast(String(err.message||"Gagal").replace(/^.*?:\s*/, "")); }
  }
  if(f.id === "docForm"){
    e.preventDefault();
    if(!DOCS.every(([k]) => S.drvDocs[k])) return toast("Lengkapi semua foto dulu.");
    const btn = f.querySelector("button.btn"); btn.disabled = true; btn.textContent = "Mengirim…";
    try{ await drvSubmitDocs(S.drvDocs); S.drvDocs = {}; toast("Dokumen terkirim. Tunggu verifikasi tim JAGA."); }
    catch(err){ btn.disabled = false; btn.textContent = "Kirim untuk verifikasi"; toast(String(err.message||"Gagal").replace(/^.*?:\s*/, "")); }
    S.drv.sig = ""; await drvRefresh(); render();
  }
});



function ownStorePage(r){
  const s = r.s, off = s.active === false, cls = off ? 'off' : s.open === false ? 'cl' : 'on';
  const bal = S.ownW && S.ownW.balances ? (S.ownW.balances[s.id] || 0) : null, low = bal != null && bal < ((S.ownW.cfg||{}).minBalance||0);
  const row = (k, v) => '<div class="spr"><span>'+k+'</span><b>'+v+'</b></div>';
  return '<button class="back" data-act="own-sback">← Semua toko</button>'+
    '<div class="card sphead '+cls+'"><em>'+esc((s.name||"?").trim().charAt(0).toUpperCase())+'</em><div class="grow"><b>'+esc(s.name)+'</b><small>'+esc(s.category||"")+' · '+esc(r.reg ? regionName(r.reg) : (s.area||"-"))+'</small></div><span class="tag '+(off?'amber':'green')+'">'+(off?'Nonaktif':s.open===false?'Tutup':'Aktif · Buka')+'</span></div>'+
    '<div class="card pad"><div class="om spm"><div><small>Pesanan</small><b>'+r.n+'</b></div><div><small>Penjualan</small><b>'+rp(r.gmv)+'</b></div><div><small>Bagi hasil</small><b>'+rp(r.share)+'</b></div></div>'+
      '<div class="small muted" style="margin-top:6px">Periode: '+esc(({hari:"hari ini",minggu:"7 hari",bulan:"bulan ini",semua:"semua waktu"})[S.own.range] || "terpilih")+'. Ganti periode di halaman daftar toko.</div></div>'+
    '<div class="card pad"><h3 class="sub" style="margin-top:0">Informasi toko</h3>'+
      row("Kategori", esc(s.category||"-"))+row("Alamat / area", esc(s.address || s.area || "-"))+row("Wilayah layanan", esc(r.reg ? regionName(r.reg) : "-"))+row("Jumlah produk", (s.products||0)+" produk")+
      row("Status", off ? '<span class="warnc">Dinonaktifkan tim JAGA</span>' : s.open === false ? 'Tutup' : 'Buka')+row("Pesanan terakhir", r.last ? ago(r.last) : "belum ada")+
      row("Saldo toko", '<span class="'+(low?'neg':'')+'">'+(bal != null ? rp(bal) : '…')+'</span>'+(low ? ' <small class="warnc">di bawah minimum</small>' : ''))+
      (s.wa ? row("WhatsApp", '<a target="_blank" rel="noopener" href="'+esc(waLink(s.wa, "Halo "+(s.name||"")+", ini tim JAGA."))+'">'+esc(s.wa)+'</a>') : '')+
      accLine("store", s.id, s.name)+'</div>'+
    '<div class="card pad"><h3 class="sub" style="margin-top:0">Lokasi</h3>'+(r.loc ? '<div class="omap one" data-omap="one" data-id="'+esc(s.id)+'"></div><a class="btn ghost sm" style="margin-top:8px" target="_blank" rel="noopener" href="'+esc(navLink({lat:s.lat, lng:s.lng}))+'">'+I("pin")+' Buka di Google Maps</a>' : '<div class="notice warnbox" style="margin:0">'+I("pin")+' Lokasi toko belum diatur. Minta pemilik toko menekan "Lokasi saya" di portal mitra.</div>')+'</div>'+
    '<div class="card pad"><h3 class="sub" style="margin-top:0">Tindakan</h3><div class="oacts spacts"><button class="btn ghost sm" data-act="own-msg" data-v="store:'+esc(s.id)+'">'+I("chat")+' Kirim pesan</button><button class="btn ghost sm" data-act="own-exempt" data-k="s" data-id="'+esc(s.id)+'" data-v="'+esc(s.name)+'">'+I("percent")+' Bebas komisi</button>'+exTag("s", s.id)+'<button class="btn ghost sm" data-act="own-adjust" data-id="'+esc(s.id)+'" data-v="'+esc(s.name)+'">'+I("cash")+' Atur saldo</button>'+
      '<button class="btn ghost sm" data-act="own-store-active" data-id="'+esc(s.id)+'" data-v="'+(off?"1":"0")+'">'+(off?"Aktifkan toko":"Nonaktifkan toko")+'</button><button class="btn ghost sm dangerc" data-act="own-store-del" data-id="'+esc(s.id)+'" data-v="'+esc(s.name)+'">Hapus toko</button></div></div>';
}
let ONE_MAP = null;
function mountOneMap(){
  const ph = document.querySelector('[data-omap="one"]'); if(!ph) return;
  const r = (OWN_MAP_ROWS || []).find(x => x.s.id === ph.dataset.id); if(!r || !r.loc) return;
  loadLeaflet().then(() => {
    if(!ph.isConnected) return;
    if(ONE_MAP){ try{ ONE_MAP.remove(); }catch(_){} ONE_MAP = null; }
    const node = document.createElement("div"); node.className = "omap one"; ph.replaceWith(node);
    ONE_MAP = L.map(node, {zoomControl:true, attributionControl:true, scrollWheelZoom:false}).setView([r.s.lat, r.s.lng], 16);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {maxZoom:19, attribution:"© OpenStreetMap"}).addTo(ONE_MAP);
    const off = r.s.active === false;
    L.marker([r.s.lat, r.s.lng], {icon:L.divIcon({className:"smk", html:'<i class="'+(off?'off':'on')+' big">'+esc((r.s.name||"?").trim().charAt(0).toUpperCase())+'</i>', iconSize:[40,40], iconAnchor:[20,20]})}).addTo(ONE_MAP);
  }).catch(() => {});
}

/* ---------- toko meminta driver tertentu (WA + link langsung ke pesanan) ---------- */
const DRV_LINK = "https://jagapatner.my.id/apps/";
function callDrvLine(o){
  const ids = o.callDrv || []; if(!ids.length) return "";
  const nm = ids.map(i => (o.callNames || {})[i] || "driver").slice(-3).join(", ");
  return '<div class="calledln">'+I("send")+'<span>Sudah diminta: <b>'+esc(nm)+'</b>'+(o.callAt ? ' · '+ago(o.callAt) : '')+'. Menunggu driver membuka link & menerima.</span></div>';
}
function callDrvMsg(o, d){
  const est = ongkirEstOf(o), dist = ongkirDistOf(o), cod = (o.pay && o.pay.k === "cod") || o.managed;
  const n = (o.items || []).reduce((a, i) => a + (i.qty || 0), 0);
  return "Halo " + (d.name || "") + ", saya dari toko " + (o.storeName || "") + " (JAGA). Ada pesanan antar " + (o.code || "") + ":\n" +
    "📦 " + n + " barang\n" +
    "🏪 Ambil di: " + (o.storeName || "") + (o.storeAddress ? ", " + o.storeAddress : "") + "\n" +
    "🏠 Antar ke: " + (shortAddr(o.buyer && o.buyer.address) || "alamat pembeli") + (dist != null ? " (±" + kmTxt(dist) + ")" : "") + "\n" +
    "💰 Ongkir " + (est != null ? "±" + rp(est) : "sesuai kesepakatan") + (cod ? " · tagih pesanan " + rp(o.total || 0) + " ke pembeli" : "") + "\n\n" +
    "Bisa antar sekarang? Buka link ini, nyalakan ONLINE, lalu tekan Terima:\n" + DRV_LINK + "?ambil=" + o.id + "#driver";
}
async function openCallDrv(id){
  const o = S.orders.find(x => x.id === id); if(!o) return;
  const m = document.getElementById("modal");
  m.innerHTML = '<div class="modal-bg" data-act="modal-bg"><div class="modal cdm"><h2 class="sec">Minta driver mengantar</h2><div class="pad muted small">Memuat daftar driver…</div></div></div>';
  let r;
  try{
    r = SB ? await sbStore.rpc("jt_store_drivers", {p_id:id})
      : {drivers:(S.drivers || []).filter(d => !d.suspended).map(d => ({id:d.id, name:d.name, wa:d.wa, vehicle:d.vehicle || "", plate:d.plate || "", online:!!d.online, free:!!d.online, can:true, dist:null, called:(o.callDrv || []).includes(d.id)}))};
  }catch(e){ m.innerHTML = ""; return toast(String(e.message || e)); }
  const list = (r && r.drivers) || [];
  const row = d => {
    const st = d.declined ? ['gray', 'Sudah menolak pesanan ini'] : d.free && d.can ? ['ok', 'Online · siap' + (d.dist != null ? ' · ' + fmtDist(d.dist) + ' dari toko' : '')]
      : d.free ? ['warn', 'Online · saldo driver kurang'] : d.online ? ['busy', 'Sedang mengantar pesanan lain'] : ['off', 'Offline' + (d.seen ? ' · aktif ' + ago(d.seen) : '')];
    const wa = d.wa && !d.declined ? '<a class="btn sm press" href="'+esc(waLink(d.wa, callDrvMsg(o, d)))+'" target="_blank" rel="noopener" data-calldrv="'+esc(d.id)+'" data-oid="'+esc(o.id)+'">'+I("chat")+' WA</a>' : '';
    const tel = d.wa ? '<a class="btn ghost sm" href="tel:'+esc(String(d.wa).replace(/[^\d+]/g, ""))+'">'+I("phone")+'</a>' : '';
    return '<div class="cdr"><div class="drv-av">'+esc(initials(d.name))+'</div><div class="grow"><b>'+esc(d.name || "Driver")+(d.called ? ' <span class="tag blue">Sudah diminta</span>' : '')+'</b><small>'+esc([d.vehicle, d.plate, d.area].filter(Boolean).join(" · "))+'</small>'+
      '<small class="cds '+st[0]+'"><i></i>'+esc(st[1])+'</small></div><div class="cdb">'+wa+tel+'</div></div>';
  };
  m.innerHTML = '<div class="modal-bg" data-act="modal-bg"><div class="modal cdm"><h2 class="sec">Minta driver mengantar</h2>'+
    '<div class="cdo"><b>'+esc(o.code || "")+'</b> · antar ke '+esc(shortAddr(o.buyer && o.buyer.address) || "pembeli")+(ongkirEstOf(o) != null ? ' · ongkir ±'+rp(ongkirEstOf(o)) : '')+'</div>'+
    (list.length ? '<div class="cdl">'+list.map(row).join("")+'</div>' : '<div class="notice">Belum ada driver terdaftar di sekitar toko. Anda bisa mengantar sendiri.</div>')+
    '<div class="hint" style="margin-top:10px">Ketuk <b>WA</b> untuk mengirim permintaan. Driver yang Anda minta <b>bisa menerima pesanan ini walau di luar radius</b>, dan link di pesan WA langsung membuka pesanan ini di aplikasi driver. Status pesanan berubah otomatis saat driver menerima.</div>'+
    '<button type="button" class="btn ghost block" style="margin-top:10px" data-act="modal-close">Tutup</button></div></div>';
}
document.addEventListener("click", e => {
  const a = e.target.closest && e.target.closest("a[data-calldrv]"); if(!a) return;
  const oid = a.dataset.oid, did = a.dataset.calldrv, o = S.orders.find(x => x.id === oid);
  if(SB) sbStore.rpc("jt_store_call_driver", {p_id:oid, p_driver:did}).then(r => {
    if(o){ o.callDrv = (o.callDrv || []).filter(x => x !== did).concat(did); o.callNames = Object.assign({}, o.callNames, {[did]:r && r.name}); o.callAt = Date.now(); }
    toast((r && r.name ? r.name : "Driver") + " diminta. " + (r && r.free ? "Ia bisa langsung menerima di aplikasi." : "Minta ia membuka link & menyalakan ONLINE."));
    render();
  }).catch(err => toast(String(err.message || err)));
  else if(o){ o.callDrv = (o.callDrv || []).filter(x => x !== did).concat(did); o.callAt = Date.now(); const d = (S.drivers || []).find(x => x.id === did); o.callNames = Object.assign({}, o.callNames, {[did]:d && d.name}); render(); }
}, true);
/* driver membuka link permintaan toko: ?ambil=ID#driver */
(function(){ try{ const q = new URLSearchParams(location.search).get("ambil"); if(q && /^[\w-]{4,64}$/.test(q)){ (S.drv = S.drv || {}).want = q; history.replaceState(null, "", location.pathname + location.hash); } }catch(_){} })();
function drvWantCard(me){
  const id = S.drv.want; if(!id) return "";
  if(!me.online) return '<div class="card wantc">'+E("bell")+'<div class="grow"><b>Toko meminta kamu mengantar pesanan</b><small>Nyalakan <b>ONLINE</b> agar pesanan yang diminta muncul di sini, lalu tekan Terima.</small></div><button class="btn sm press" data-act="drv-online">Nyalakan ONLINE</button></div>';
  if(!S.drv.loaded) return "";
  if((S.drv.offers || []).some(o => o.id === id) || (S.drv.mine || []).some(o => o.id === id)) return "";
  return '<div class="card wantc gone">'+I("megaphone")+'<div class="grow"><b>Pesanan yang diminta sudah tidak tersedia</b><small>Mungkin sudah diambil driver lain, diantar sendiri oleh toko, atau dibatalkan.</small></div><button class="btn ghost sm" data-act="drv-want-x">Tutup</button></div>';
}
/* ---------- peta sebaran toko di portal owner ---------- */
let OWN_MAP_ROWS = [], OWN_MAP = {node:null, map:null, mk:{}, sig:""};
function ownMapFit(){
  const m = OWN_MAP.map; if(!m) return;
  let sr = S.own.sr || "";
  if(!sr){ const c = {}; OWN_MAP_ROWS.forEach(r => { if(r.loc){ const k = r.reg || "-"; c[k] = (c[k] || 0) + 1; } }); sr = Object.keys(c).sort((a, b) => c[b] - c[a])[0] || ""; }
  const pts = OWN_MAP_ROWS.filter(r => r.loc && (!sr || (r.reg || "-") === sr)).map(r => [r.s.lat, r.s.lng]);
  if(pts.length === 1) m.setView(pts[0], 15); else if(pts.length) m.fitBounds(pts, {padding:[28, 28], maxZoom:15});
}
function mountOwnerMap(){
  const ph = document.querySelector('[data-omap="stores"]'); if(!ph) return;
  loadLeaflet().then(() => {
    if(!ph.isConnected) return;
    if(!OWN_MAP.map){
      const node = document.createElement("div"); node.className = "omap"; ph.replaceWith(node);
      const map = L.map(node, {zoomControl:true, attributionControl:true, scrollWheelZoom:false});
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {maxZoom:19, attribution:"© OpenStreetMap"}).addTo(map);
      map.setView([0.71, 100.55], 11);
      OWN_MAP = {node, map, mk:{}, sig:""};
    } else { ph.replaceWith(OWN_MAP.node); setTimeout(() => OWN_MAP.map.invalidateSize(), 50); }
    const m = OWN_MAP, seen = {};
    OWN_MAP_ROWS.forEach(r => {
      if(!r.loc) return; const s = r.s, off = s.active === false; seen[s.id] = 1;
      const icon = L.divIcon({className:"smk", html:'<i class="'+(off?'off':'on')+'">'+esc((s.name||"?").trim().charAt(0).toUpperCase())+'</i>', iconSize:[30,30], iconAnchor:[15,15]});
      const pop = '<b>'+esc(s.name)+'</b><br><small>'+esc(s.category||"")+' · '+esc(r.reg ? regionName(r.reg) : (s.area||""))+'</small><br><small>'+(off?'Nonaktif':'Aktif')+' · '+r.n+' pesanan · '+rp(r.gmv)+'</small><br><button class="linkbtn small" data-act="own-sopen-map" data-id="'+esc(s.id)+'">Buka rincian</button>';
      if(m.mk[s.id]){ m.mk[s.id].setLatLng([s.lat, s.lng]).setIcon(icon).setPopupContent(pop); }
      else m.mk[s.id] = L.marker([s.lat, s.lng], {icon}).bindPopup(pop).addTo(m.map);
    });
    Object.keys(m.mk).forEach(id => { if(!seen[id]){ m.map.removeLayer(m.mk[id]); delete m.mk[id]; } });
    const sig = OWN_MAP_ROWS.filter(r => r.loc).map(r => r.s.id).join(",") + "|" + (S.own.sr || "");
    if(sig !== m.sig){ m.sig = sig; ownMapFit(); }
  }).catch(() => { const n = document.querySelector('[data-omap="stores"]'); if(n) n.innerHTML = '<div class="pad small muted">Peta tidak bisa dimuat. Periksa koneksi internet.</div>'; });
}
document.addEventListener("click", e => {
  const b = e.target.closest('[data-act="own-sopen-map"]'); if(!b) return;
  e.preventDefault(); e.stopPropagation();
  S.own.storePage = b.dataset.id; if(OWN_MAP.map) OWN_MAP.map.closePopup(); render(); window.scrollTo(0, 0);
}, true);
/* ============ Peta live posisi driver ============ */
let LEAF_P = null;
function loadLeaflet(){
  if(window.L && window.L.map) return Promise.resolve();
  if(LEAF_P) return LEAF_P;
  LEAF_P = new Promise((res, rej) => {
    const c = document.createElement("link"); c.rel = "stylesheet"; c.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"; document.head.appendChild(c);
    const s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"; s.onload = () => res(); s.onerror = () => { LEAF_P = null; rej(new Error("peta")); }; document.head.appendChild(s);
  });
  return LEAF_P;
}
const MAPS = {};
function etaTxt(m){ const min = Math.max(1, Math.round(m / 1000 / 22 * 60)); return min < 60 ? "±" + min + " menit" : "±" + Math.round(min / 60) + " jam"; }
function liveMap(o, viewer){
  if(!locOk(o.driverLoc)) return '<div class="lmwait">'+E("scooter")+'<span>Menunggu lokasi GPS driver…</span></div>';
  const toStore = o.status === "driver_ke_toko";
  const target = liveTarget(o);
  let meta = "";
  if(isRide(o)){
    const jm = o.status === "driver_jemput";
    if(locOk(target)){ const d = distM(o.driverLoc, target); meta = '<b>'+(d < 80 ? (jm ? "Driver sudah di titik jemput" : "Hampir sampai tujuan!") : (jm ? "Driver " + kmTxt(d) + " dari titik jemput" : kmTxt(d) + " lagi ke tujuan") + ' · ' + etaTxt(d))+'</b>'; }
  } else if(locOk(target)){
    const d = distM(o.driverLoc, target);
    meta = '<b>'+(d < 80 ? (toStore ? "Driver sudah di toko" : "Driver sudah dekat sekali!") : (toStore ? "Driver " + kmTxt(d) + " dari toko" : "Driver " + kmTxt(d) + " dari " + (viewer === "pembeli" ? "lokasimu" : "pembeli")) + ' · ' + etaTxt(d))+'</b>';
  } else meta = '<b>'+(toStore ? "Driver menuju toko" : "Driver sedang mengantar")+'</b>';
  meta += '<small>Lokasi diperbarui '+ago(o.driverLoc.at || Date.now())+'</small>';
  return '<div class="livemap"><div class="lmap" data-map="'+esc(o.id)+'"></div><div class="lmeta"><span class="livedot"></span><div>'+meta+'</div></div></div>';
}
function liveTarget(o){
  if(isRide(o)) return o.status === "driver_jemput" ? o.pickup : o.dest;
  return o.status === "driver_ke_toko" ? o.storeLoc : (locOk(o.buyer) ? o.buyer : null);
}
function mkIcon(name, cls){ return L.divIcon({html:'<div class="mkin">'+E(name)+'</div>', className:"mk " + (cls||""), iconSize:[40,40], iconAnchor:[20,36]}); }
function mountMaps(){
  const els = [...document.querySelectorAll("[data-map]")];
  Object.keys(MAPS).forEach(id => { if(!els.some(e => e.dataset.map === id) && !MAPS[id].node.isConnected){ /* simpan untuk dipakai lagi */ } });
  if(!els.length) return;
  loadLeaflet().then(() => {
    els.forEach(ph => {
      if(!ph.isConnected) return;
      const oid = ph.dataset.map;
      const o = S.orders.find(x => x.id === oid) || (S.drv && S.drv.mine || []).find(x => x.id === oid) || S.rides.find(x => x.id === oid);
      if(!o) return;
      let m = MAPS[oid];
      if(!m){
        const node = document.createElement("div"); node.className = "lmap";
        ph.replaceWith(node);
        const map = L.map(node, {zoomControl:false, attributionControl:true, scrollWheelZoom:false});
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {maxZoom:19, attribution:"© OpenStreetMap"}).addTo(map);
        m = MAPS[oid] = {node, map, mk:{}, line:null, fitKey:""};
      } else ph.replaceWith(m.node);
      const pts = [];
      const put = (key, loc, icon, cls) => {
        if(!locOk(loc)){ if(m.mk[key]){ m.map.removeLayer(m.mk[key]); delete m.mk[key]; } return; }
        const ll = [loc.lat, loc.lng]; pts.push(ll);
        if(m.mk[key]) m.mk[key].setLatLng(ll); else m.mk[key] = L.marker(ll, {icon:mkIcon(icon, cls), zIndexOffset: key === "drv" ? 1000 : 0}).addTo(m.map);
      };
      put("store", o.storeLoc, "store", "mk-store");
      put("buyer", isRide(o) ? o.pickup : o.buyer, "pin", "mk-buyer");
      put("dest", isRide(o) ? o.dest : null, "star", "mk-dest");
      put("drv", o.driverLoc, "scooter", "mk-drv");
      const target = liveTarget(o);
      if(m.line){ m.map.removeLayer(m.line); m.line = null; }
      if(locOk(o.driverLoc) && locOk(target)) m.line = L.polyline([[o.driverLoc.lat, o.driverLoc.lng], [target.lat, target.lng]], {color:"#2f6bff", weight:4, dashArray:"6 8", opacity:.8}).addTo(m.map);
      const fk = o.status + "|" + pts.length;
      setTimeout(() => {
        m.map.invalidateSize();
        if(m.fitKey !== fk){ m.fitKey = fk; if(pts.length > 1) m.map.fitBounds(pts, {padding:[40, 40], maxZoom:17}); else if(pts.length) m.map.setView(pts[0], 16); }
      }, 30);
    });
  }).catch(() => { els.forEach(ph => { if(ph.isConnected) ph.innerHTML = '<div class="small muted" style="padding:16px;text-align:center">Peta tidak bisa dimuat. Periksa koneksi internet.</div>'; }); });
}
/* pembeli/toko yang sedang membuka pesanan dalam perjalanan: segarkan lebih sering */
setInterval(() => {
  if(document.hidden || !SB || !ORD_REFRESH) return;
  const live = S.orders.some(o => ["driver_ke_toko","diantar"].includes(o.status) && (S.view === "order" ? o.id === S.orderId : S.role === "seller"));
  if(live) ORD_REFRESH();
}, 5000);

/* ============ Saldo toko (top-up, potong bagi hasil 3% otomatis) ============ */
S.wallet = {}; S.walletTx = []; S.walletCfg = null; S.ownW = null;
const WCFG_DEF = {minBalance:10000, bonus:15000, bank:{name:"", no:"", holder:""}, pay:[], qris:"", ptTarget:10, ptEarn:5, ptRedeem:5, ptValue:2000, storePct:3, drvPct:3, minTx:0, round:1};
const wCfgLocal = () => Object.assign({}, WCFG_DEF, S.walletCfg || {});
const balLocal = sid => S.walletTx.filter(t => t.storeId === sid && t.status === "ok").reduce((a, t) => a + (t.amount || 0), 0);
const WAL = {
  async get(sid){
    if(SB) return await sbStore.rpc("jt_wallet", {p_store:sid});
    const c = wCfgLocal();
    const txs = S.walletTx.filter(t => t.storeId === sid).sort((a, b) => (b.at||0) - (a.at||0)).map(t => Object.assign({}, t, {hasProof:!!t.proof, proof:undefined}));
    return {balance:balLocal(sid), pending:S.walletTx.filter(t => t.storeId === sid && t.status === "pending").reduce((a,t)=>a+t.amount,0), cfg:{minBalance:c.minBalance, bank:c.bank, pay:c.pay || [], qris:c.qris}, txs};
  },
  async topup(sid, amount, proof){
    if(SB) return sbStore.rpc("jt_wallet_topup", {p_store:sid, p_amount:amount, p_proof:proof});
    if(!(amount >= 10000)) throw srvErr("Jumlah isi saldo minimal Rp10.000");
    const id = "t" + Date.now();
    await store.set("wallettx/" + id, {storeId:sid, kind:"topup", amount:Math.round(amount), status:"pending", note:"Isi saldo", proof, at:Date.now()});
  }
};
async function localTx(id, data){ await store.set("wallettx/" + id, Object.assign({status:"ok", at:Date.now()}, data)); }
async function localChargeFee(o){
  if(SB || !o || S.walletTx.some(t => t.id === "fee_" + o.id)) return;
  const share = typeof o.share === "number" ? o.share : commCalc(o.total, "store");
  if(share > 0) await localTx("fee_" + o.id, {storeId:o.storeId, kind:"fee", amount:-share, orderId:o.id, note:"Bagi hasil 3% pesanan " + (o.code||"") + " (" + rp(o.total) + ")"});
}
async function localBonus(sid){ const b = wCfgLocal().bonus || 0; if(!SB && b > 0 && !S.walletTx.some(t => t.storeId === sid && t.kind === "bonus")) await localTx("bonus_" + sid, {storeId:sid, kind:"bonus", amount:b, note:"Saldo gratis toko baru"}); }
async function loadWallet(sid, quiet){
  if(!sid) return;
  try{ S.wallet[sid] = Object.assign(await WAL.get(sid) || {}, {loaded:true}); }
  catch(e){ S.wallet[sid] = Object.assign(S.wallet[sid] || {}, {loaded:true, err:e.message}); }
  if(S.role === "seller" && !quiet && !typing()) scheduleRender();
}
setInterval(() => { if(!document.hidden && S.role === "seller" && S.sellerStoreId && !typing()) loadWallet(S.sellerStoreId); }, 20000);
document.addEventListener("visibilitychange", () => { if(!document.hidden && S.role === "seller" && S.sellerStoreId) loadWallet(S.sellerStoreId); });
function walletNeed(sid, share){ const w = S.wallet[sid]; if(!w || !w.loaded || w.balance == null) return null; return Math.max((w.cfg && w.cfg.minBalance) || 0, share || 0); }
function walletLow(sid, share){ const w = S.wallet[sid]; const need = walletNeed(sid, share); return need != null && w.balance < need; }
function walletChip(s){
  const w = S.wallet[s.id];
  if(!w || !w.loaded){ if(!w) loadWallet(s.id); return ""; }
  const low = walletLow(s.id, 0);
  return '<div class="wchip'+(low?' low':'')+'" data-act="nav" data-v="seller" data-t="saldo">'+E("money")+'<div class="grow"><small>Saldo toko</small><b>'+rp(w.balance)+'</b>'+
    (low ? '<span>Saldo di bawah minimum '+rp(w.cfg.minBalance)+' — isi saldo atau hubungi JAGA agar bisa menerima pesanan</span>' : '<span>Bagi hasil 3% per pesanan selesai · kumpulkan poin harian</span>')+'</div><b class="go">'+(low?'Isi saldo':'Lihat')+' ›</b></div>';
}
const TX_L = {topup:["Isi saldo","money"], fee:["Bagi hasil 3%","receipt"], bonus:["Bonus","gift"], adjust:["Penyesuaian","bell"], reward:["Tukar poin","gift"], voucher:["Potongan saldo JAGA","percent"]};
function walletName(id){
  id = String(id || "");
  if(id.startsWith("drv:")){ const did = id.slice(4); const d = ((S.own.data && S.own.data.drivers) || S.drivers || []).find(x => x.id === did); return "Driver " + (d ? d.name : did.slice(0, 6)); }
  return (storeById(id)||{}).name || ((S.own.data && (S.own.data.stores||[]).find(x => x.id === id)) || {}).name || id;
}
function txRow(t, withStore){
  const st = t.status === "pending" ? '<span class="tag warn">Menunggu dicek</span>' : t.status === "rejected" ? '<span class="tag red">Ditolak</span>' : '';
  const sname = withStore ? walletName(t.storeId) : "";
  const lbl = t.kind === "fee" && String(t.orderId||"").startsWith("ride:") ? "Komisi Jago 3%" : t.kind === "fee" && String(t.orderId||"").startsWith("dlv:") ? "Potongan 3% ongkir" : (TX_L[t.kind]||[t.kind])[0];
  return '<div class="txr">'+E((TX_L[t.kind]||["","money"])[1])+'<div class="grow"><b>'+esc(withStore ? sname : lbl)+'</b><small>'+esc(t.note||"")+'</small><small>'+fmtDate(t.at)+'</small></div>'+
    '<div class="r"><b class="'+(t.amount<0?'neg':'pos')+(t.status!=="ok"?' dim':'')+'">'+(t.amount<0?'−':'+')+rp(Math.abs(t.amount))+'</b>'+st+'</div></div>';
}
function sellerWallet(s){
  const w = S.wallet[s.id];
  if(!w || !w.loaded){ loadWallet(s.id); return '<div class="empty">'+I("loader")+' Memuat saldo…</div>'; }
  if(w.err && w.balance == null) return '<div class="notice">'+esc(w.err)+'</div>';
  const c = w.cfg || {}, low = walletLow(s.id, 0);
  let h = (low ? lowBlock("store:" + s.id, c.minBalance || 0, "toko") : '') + '<div class="wbig'+(low?' low':'')+'"><small>Saldo toko</small><b>'+rp(w.balance)+'</b>'+
    '<span>Minimal saldo untuk menerima pesanan: '+rp(c.minBalance||0)+(w.pending ? ' · '+rp(w.pending)+' menunggu dicek' : '')+'</span></div>';
  h += ptsCard(s.id, "toko");
  h += '<div class="card pad whow"><h3 class="sub">Cara kerja bagi hasil</h3><ol>'+
    '<li>Toko baru dapat saldo gratis untuk mulai berjualan.</li>'+
    '<li>Setiap pesanan <b>selesai</b>, bagi hasil 3% dipotong otomatis dari saldo. Pesanan batal tidak dipotong.</li>'+
    '<li>Jika saldo di bawah '+rp(c.minBalance||0)+', toko tidak bisa menerima pesanan baru sampai saldo diisi.</li>'+
    '<li>Isi saldo lewat bank, virtual account, e-wallet, atau QRIS JAGA, lalu unggah bukti transfer. Saldo masuk setelah dicek tim JAGA.</li></ol></div>';
  h += '<form class="card pad" id="topupForm" data-id="'+esc(s.id)+'"><h3 class="sub">'+I("plus")+' Isi saldo</h3>'+
    '<div class="wchips">'+[25000,50000,100000,200000].map(v => '<button type="button" class="chip" data-act="topup-amt" data-v="'+v+'">'+rp(v)+'</button>').join("")+'</div>'+
    '<label class="f">Jumlah (Rp)</label><input class="in" name="amount" inputmode="numeric" required placeholder="Minimal 10000">'+
    payDest(c, "toko "+s.name)+
    '<label class="f">Foto bukti transfer</label><input type="file" accept="image/*" class="in" id="topupProof" required>'+
    '<button class="btn block" style="margin-top:12px">Kirim pengisian saldo</button></form>';
  const txs = w.txs || [];
  h += '<div class="card pad"><h3 class="sub">Riwayat saldo</h3>'+(txs.length ? txs.map(t => txRow(t)).join("") : '<div class="muted small">Belum ada mutasi.</div>')+'</div>';
  return h;
}
/* ---------- tujuan isi saldo, saldo minimum, poin JAGA ---------- */
const PAY_T = {bank:"Transfer bank", va:"Virtual account", ewallet:"E-wallet"};
function payList(c){
  const list = (c.pay || []).filter(x => x && x.no);
  if(!list.length && c.bank && c.bank.no) list.push({type:"bank", name:c.bank.name || "Bank", no:c.bank.no, holder:c.bank.holder || ""});
  return list;
}
function payDest(c, who){
  const list = payList(c);
  let h = '<div class="wpay2"><small class="wplbl">Transfer ke salah satu tujuan JAGA</small>';
  ["bank","va","ewallet"].forEach(t => {
    const xs = list.filter(x => x.type === t); if(!xs.length) return;
    h += '<div class="wpg"><em>'+PAY_T[t]+'</em>'+xs.map(x => '<div class="wpd"><div class="grow"><b>'+esc(x.name)+'</b><span class="mono">'+esc(x.no)+'</span>'+(x.holder ? '<small>a.n. '+esc(x.holder)+'</small>' : '')+'</div><button type="button" class="btn ghost sm" data-act="copy" data-v="'+esc(x.no)+'">Salin</button></div>').join("")+'</div>';
  });
  if(c.qris) h += '<div class="wpg"><em>QRIS JAGA</em><img class="qris" alt="QRIS JAGA" src="'+esc(c.qris)+'"><small class="muted">Scan dengan m-banking atau e-wallet apa pun</small></div>';
  if(!list.length && !c.qris) h += '<span>Tujuan transfer JAGA belum diatur. Hubungi <a target="_blank" rel="noopener" href="'+esc(waLink(CONTACT.wa, "Halo JAGA, saya "+(who||"mitra")+" mau isi saldo."))+'">WhatsApp JAGA</a> untuk info rekening.</span>';
  return h + '<div class="hint">Setelah transfer, <b>wajib unggah foto bukti transfer</b> di bawah. Saldo bertambah setelah dicek tim JAGA.</div></div>';
}
function lowBlock(th, min, who){
  return '<div class="wblock">'+E("bell")+'<div class="grow"><b>Saldo di bawah '+rp(min)+' — perlu isi saldo</b><small>'+(who === "driver" ? "Order antar barang & Jago tidak masuk" : "Toko tidak bisa menerima pesanan baru")+' sampai saldo diisi. Isi saldo lewat bank, virtual account, e-wallet, atau QRIS JAGA, lalu kirim bukti transfer. Butuh bantuan? Hubungi tim JAGA.</small>'+
    '<div class="actions"><button type="button" class="btn sm" data-act="wtopup-go">'+I("plus")+' Isi saldo</button>'+(th ? '<button type="button" class="btn ghost sm" data-act="sup-open" data-v="'+esc(th)+'">'+I("chat")+' Hubungi JAGA</button>' : '<a class="btn ghost sm" target="_blank" rel="noopener" href="'+esc(waLink(CONTACT.wa, "Halo JAGA, saldo saya perlu diisi."))+'">'+I("chat")+' Hubungi JAGA</a>')+'</div></div></div>';
}
S.pts = {};
const ptWid = party => party === "buyer" ? "buy:" + ME : party === "driver" ? "drv:" + (S.drv.me ? S.drv.me.id : DRIVER_ID_LOCAL) : party;
function localPts(party){
  const c = wCfgLocal(), w = ptWid(party);
  const done = S.orders.concat(S.ridesAll || []).filter(o => o.status === "selesai" && (
    party === "buyer" ? (o.buyerId === ME || o.riderId === ME) : party === "driver" ? ("drv:" + o.driverId) === w : (!isRide(o) && o.storeId === party)));
  const days = {}; done.forEach(o => { const d = dayKey(o.doneAt || o.updatedAt || 0); days[d] = (days[d] || 0) + 1; });
  const hist = []; let earned = 0;
  Object.keys(days).forEach(d => { const k = Math.floor(days[d] / c.ptTarget); if(k > 0){ earned += k * c.ptEarn; hist.push({pts:k * c.ptEarn, kind:"earn", note:"Capai " + (k * c.ptTarget) + " transaksi selesai dalam sehari", at:new Date(d.replace(/-(\d)(?!\d)/g, "-0$1")).getTime() || 0}); } });
  const red = S.walletTx.filter(t => t.storeId === w && t.kind === "reward");
  red.forEach(t => hist.push({pts:-(t.pts || 0), kind:"redeem", note:"Tukar jadi saldo " + rp(t.amount), at:t.at}));
  const r = {target:c.ptTarget, earn:c.ptEarn, redeem:c.ptRedeem, value:c.ptValue, points:earned - red.reduce((a, t) => a + (t.pts || 0), 0), today:days[dayKey(Date.now())] || 0, hist:hist.sort((a, b) => (b.at || 0) - (a.at || 0))};
  if(party === "buyer"){
    const act = S.orders.concat(S.rides || []).filter(o => (o.buyerId === ME || o.riderId === ME) && !["selesai","dibatalkan"].includes(o.status)).reduce((a, o) => a + (o.voucher || 0), 0);
    r.balance = balLocal(w); r.avail = Math.max(0, r.balance - act); r.txs = S.walletTx.filter(t => t.storeId === w).sort((a, b) => (b.at || 0) - (a.at || 0));
  }
  return r;
}
const PTS = {
  async info(party){ return SB ? await sbStore.rpc("jt_points_info", {p_party:party}) : localPts(party); },
  async redeem(party){
    if(SB) return sbStore.rpc("jt_points_redeem", {p_party:party});
    const p = localPts(party), u = Math.floor(p.points / p.redeem);
    if(u < 1) throw srvErr("Poin belum cukup. Butuh " + p.redeem + " poin untuk ditukar");
    await localTx("rw" + Date.now(), {storeId:ptWid(party), kind:"reward", amount:u * p.value, pts:u * p.redeem, note:"Tukar " + (u * p.redeem) + " poin"});
    return {ok:true, pts:u * p.redeem, amount:u * p.value};
  }
};
async function loadPts(party, quiet){
  try{ S.pts[party] = Object.assign(await PTS.info(party) || {}, {loaded:true}); }catch(e){ S.pts[party] = {loaded:true, err:e.message}; }
  if(!quiet && !typing()) scheduleRender();
}
function ptsCard(party, who){
  const p = S.pts[party];
  if(!p){ loadPts(party); return '<div class="card pad ptcard"><div class="muted small">'+I("loader")+' Memuat poin…</div></div>'; }
  if(p.points == null) return '';
  const tg = p.target || 10, step = p.today % tg, pct = Math.round(step / tg * 100), can = p.points >= p.redeem;
  const unit = who === "buyer" ? "pesanan/perjalanan selesai" : who === "driver" ? "order selesai" : "pesanan selesai";
  return '<div class="card pad ptcard"><div class="pthead">'+E("gift")+'<div class="grow"><small>Poin JAGA</small><b>'+p.points+' poin</b><span>'+p.redeem+' poin = '+rp(p.value)+(who === "buyer" ? ' saldo JAGA' : ' masuk saldo')+'</span></div>'+
    (can ? '<button type="button" class="btn sm" data-act="pts-redeem" data-v="'+esc(party)+'">Tukar '+rp(Math.floor(p.points / p.redeem) * p.value)+'</button>' : '')+'</div>'+
    '<div class="ptbar"><i style="width:'+pct+'%"></i></div>'+
    '<div class="ptrow"><span>Hari ini <b>'+p.today+'</b> '+unit+'</span><span>'+(tg - step)+' lagi → +'+p.earn+' poin</span></div>'+
    '<div class="hint">Setiap '+tg+' '+unit+' dalam sehari dapat '+p.earn+' poin. Tukar '+p.redeem+' poin jadi '+rp(p.value)+(who === "buyer" ? ' saldo JAGA untuk potong ongkir atau tarif Jago.' : ' di saldo.')+'</div>'+
    ((p.hist || []).length ? '<details class="pthist"><summary>Riwayat poin</summary>'+p.hist.slice(0, 15).map(x => '<div class="txr"><div class="grow"><small>'+esc(x.note || "")+'</small><small>'+fmtDate(x.at)+'</small></div><div class="r"><b class="'+(x.pts < 0 ? 'neg' : 'pos')+'">'+(x.pts > 0 ? '+' : '')+x.pts+'</b></div></div>').join("")+'</details>' : '')+'</div>';
}
function buyerAvail(){ const p = S.pts.buyer; if(!p) { loadPts("buyer", true).then(() => scheduleRender()); return 0; } return Math.max(0, Math.round(p.avail || 0)); }
function useSaldoBox(base, what){
  const a = buyerAvail(); if(!(a > 0) || !(base > 0)) return "";
  const v = Math.min(a, base);
  return '<label class="check usaldo"><input type="checkbox" name="useSaldo" checked> Pakai saldo JAGA '+rp(v)+' untuk potong '+what+'<small>Saldo kamu '+rp(a)+'. Bayar ke driver lebih sedikit; JAGA yang mengganti ke driver.</small></label>';
}
function voucherNote(o, who){
  if(!(o && o.voucher > 0)) return "";
  if(who === "driver") return '<div class="vnote">'+I("percent")+' Pembeli pakai saldo JAGA <b>'+rp(o.voucher)+'</b>: terima tunai '+(isRide(o) ? "tarif" : "ongkir")+' dikurangi '+rp(o.voucher)+'. JAGA mengganti '+rp(o.voucher)+' ke saldomu saat order selesai.</div>';
  return '<div class="vnote">'+I("percent")+' Potongan saldo JAGA <b>−'+rp(o.voucher)+'</b> dari '+(isRide(o) ? "tarif" : "ongkir")+'. Bayar ke driver dikurangi '+rp(o.voucher)+'.</div>';
}
function appPoin(){
  const p = S.pts.buyer;
  let h = appBar("Poin & saldo JAGA");
  if(!p){ loadPts("buyer"); return h + '<div class="empty">'+I("loader")+' Memuat…</div>'; }
  if(p.err && p.points == null) return h + '<div class="notice">'+esc(p.err)+'</div>';
  h += '<div class="v-wrap"><div class="wbig"><small>Saldo JAGA kamu</small><b>'+rp(p.balance || 0)+'</b><span>Bisa dipakai memotong ongkir antar atau tarif Jago'+((p.balance || 0) > (p.avail || 0) ? ' · '+rp((p.balance || 0) - (p.avail || 0))+' sedang dipakai di pesanan berjalan' : '')+'</span></div>';
  h += ptsCard("buyer", "buyer");
  const txs = p.txs || [];
  h += '<div class="card pad"><h3 class="sub">Riwayat saldo</h3>'+(txs.length ? txs.map(t => txRow(t)).join("") : '<div class="muted small">Belum ada mutasi. Kumpulkan poin dari pesanan & perjalanan yang selesai.</div>')+'</div></div>';
  return h;
}
document.addEventListener("click", e => {
  const el = e.target.closest("[data-act]"); if(!el) return;
  const a = el.dataset.act;
  if(a === "wtopup-go"){ const f = document.getElementById("topupForm") || document.getElementById("dtopupForm"); if(f){ f.scrollIntoView({behavior:"smooth", block:"start"}); const i = f.querySelector("[name=amount]"); if(i) setTimeout(() => i.focus(), 350); } }
  if(a === "pts-redeem"){
    const party = el.dataset.v, p = S.pts[party] || {}, u = Math.floor((p.points || 0) / (p.redeem || 5));
    confirmModal("Tukar " + (u * (p.redeem || 5)) + " poin jadi saldo " + rp(u * (p.value || 0)) + "?", "Tukar poin", async () => {
      try{ const r = await PTS.redeem(party); toast("Berhasil! " + rp((r && r.amount) || 0) + " masuk ke saldo."); }catch(err){ toast(String(err.message || "Gagal").replace(/^.*?:\s*/, "")); }
      await loadPts(party, true);
      if(party === "driver") await loadDrvWallet(); else if(party !== "buyer") await loadWallet(party, true);
      render();
    });
  }
});
setInterval(() => { if(!document.hidden && !typing()) Object.keys(S.pts).forEach(k => loadPts(k, true)); }, 60000);
/* ---------- owner ---------- */
const OWAL = {
  async get(){
    if(SB) return await sbStore.rpc("jt_owner_wallet", {});
    const ok = S.walletTx.filter(t => t.status === "ok");
    const sum = (arr) => arr.reduce((a, t) => a + (t.amount||0), 0);
    const m0 = rangeStart("bulan");
    const by = (f) => { const o = {}; ok.filter(f).filter(t => !String(t.storeId).startsWith("buy:")).forEach(t => { o[t.storeId] = (o[t.storeId]||0) + t.amount; }); return o; };
    const fees = {}; Object.entries(by(t => t.kind === "fee")).forEach(([k, v]) => fees[k] = -v);
    return {cfg:wCfgLocal(), pending:S.walletTx.filter(t => t.status === "pending").sort((a,b)=>a.at-b.at), balances:by(() => true), fees,
      totals:{fee:-sum(ok.filter(t => t.kind === "fee")), feeMonth:-sum(ok.filter(t => t.kind === "fee" && t.at >= m0)), topup:sum(ok.filter(t => t.kind === "topup")), bonus:sum(ok.filter(t => t.kind === "bonus")), reward:sum(ok.filter(t => t.kind === "reward")), saldo:sum(ok.filter(t => !String(t.storeId).startsWith("buy:")))},
      feeLog:ok.filter(t => t.kind === "fee").map(t => [t.at || 0, -(t.amount||0)]),
      recent:S.walletTx.filter(t => t.status !== "pending" && !String(t.storeId).startsWith("buy:")).sort((a,b)=>b.at-a.at).slice(0,60)};
  },
  async decide(id, okk){ if(SB) return sbStore.rpc("jt_owner_topup_decide", {p_id:id, p_ok:okk}); await store.update("wallettx/" + id, {status: okk ? "ok" : "rejected", note: okk ? "Isi saldo (disetujui)" : "Isi saldo ditolak — hubungi JAGA"}); },
  async cfg(d){ if(SB) return sbStore.rpc("jt_owner_wallet_cfg", {p_data:d}); await store.set("settings/wallet", Object.assign(wCfgLocal(), d)); },
  async adjust(sid, amt, note){ if(SB) return sbStore.rpc("jt_owner_wallet_adjust", {p_store:sid, p_amount:amt, p_note:note}); await localTx("a" + Date.now(), {storeId:sid, kind:"adjust", amount:Math.round(amt), note:note || "Penyesuaian oleh JAGA"}); }
};
async function loadOwnerWallet(){
  try{ S.ownW = await OWAL.get(); S.ownW.err = ""; }catch(e){ S.ownW = {err:e.message}; }
  if(SB){ try{ S.ownEx = await sbStore.rpc("jt_owner_exempt_list", {}); }catch(_){} }
  if(S.role === "owner" && !typing()) scheduleRender();
}
let PAYROW_N = 0;
function payRow(x){
  x = x || {}; const n = "_" + (PAYROW_N++);
  return '<div class="payrow"><select class="in" name="ptype'+n+'">'+Object.keys(PAY_T).map(k => '<option value="'+k+'"'+(x.type === k ? ' selected' : '')+'>'+PAY_T[k]+'</option>').join("")+'</select>'+
    '<input class="in" name="pname'+n+'" placeholder="BRI / BCA VA / DANA / OVO" value="'+esc(x.name||"")+'"><input class="in" name="pno'+n+'" inputmode="numeric" placeholder="Nomor" value="'+esc(x.no||"")+'">'+
    '<input class="in" name="pholder'+n+'" placeholder="Atas nama" value="'+esc(x.holder||"")+'"><button type="button" class="ibtn" data-act="pay-row-del" aria-label="Hapus">×</button></div>';
}
document.addEventListener("click", e => {
  const el = e.target.closest("[data-act]"); if(!el) return;
  if(el.dataset.act === "pay-row-add"){ const box = document.getElementById("payRows"); if(box && box.children.length < 12) box.insertAdjacentHTML("beforeend", payRow({})); else toast("Maksimal 12 tujuan transfer."); }
  if(el.dataset.act === "pay-row-del"){ const r = el.closest(".payrow"); if(r) r.remove(); }
});
function ownerWalletTab(D){
  const W = S.ownW;
  if(!W){ loadOwnerWallet(); return '<div class="empty">'+I("loader")+' Memuat…</div>'; }
  if(W.err && !W.totals) return '<div class="notice">'+esc(W.err)+'</div>';
  const T = W.totals || {}, c = Object.assign({}, WCFG_DEF, W.cfg || {}), PT = W.points || {};
  const sname = id => String(id).startsWith("drv:") ? walletName(id) : (((D.stores||[]).find(s => s.id === id) || storeById(id) || {}).name || id);
  let h = '<div class="okpi">'+
    '<div class="k main"><small>Bagi hasil & komisi Jago bulan ini</small><b>'+rp(T.feeMonth||0)+'</b><span>Total sejak awal: '+rp(T.fee||0)+'</span></div>'+
    '<div class="k"><small>Top-up masuk (disetujui)</small><b>'+rp(T.topup||0)+'</b></div>'+
    '<div class="k"><small>Saldo seluruh toko & driver</small><b>'+rp(T.saldo||0)+'</b><span>uang titipan toko</span></div>'+
    '<div class="k"><small>Bonus diberikan</small><b>'+rp(T.bonus||0)+'</b><span>Poin ditukar: '+rp(T.reward||0)+'</span></div>'+
    '<div class="k"><small>Menunggu dicek</small><b>'+(W.pending||[]).length+'</b></div></div>';
  h += '<div class="card pad"><h3 class="sub">Pengisian saldo menunggu dicek</h3>'+((W.pending||[]).length ? W.pending.map(t =>
    '<div class="wpend"><div class="grow"><b>'+esc(sname(t.storeId))+'</b><small>'+fmtDate(t.at)+'</small><b class="pos" style="font-size:18px">'+rp(t.amount)+'</b>'+
    '<div class="actions"><button class="btn sm" data-act="own-topup" data-id="'+esc(t.id)+'" data-v="1">✓ Setujui</button><button class="btn danger sm" data-act="own-topup" data-id="'+esc(t.id)+'" data-v="0">Tolak</button></div>'+
    '<div class="hint">Cek dulu mutasi rekening JAGA sebelum menyetujui.</div></div>'+
    (t.proof ? '<img class="wproof" alt="Bukti transfer" src="'+esc(t.proof)+'" data-act="own-proof" data-v="'+esc(t.proof)+'">' : '')+'</div>').join("") : '<div class="muted small">Tidak ada pengisian yang menunggu.</div>')+'</div>';
  const stores = (D.stores||[]).slice().sort((a, b) => ((W.balances||{})[a.id]||0) - ((W.balances||{})[b.id]||0));
  h += '<div class="card pad"><h3 class="sub">Saldo per toko</h3>'+(stores.length ? stores.map(s => {
    const b = (W.balances||{})[s.id] || 0, f = (W.fees||{})[s.id] || 0, low = b < (c.minBalance||0);
    return '<div class="orow"><div class="grow"><b>'+esc(s.name)+'</b><small>Bagi hasil terpotong: '+rp(f)+' · '+(PT[s.id]||0)+' poin</small></div><div class="r"><b class="'+(low?'neg':'')+'">'+rp(b)+'</b>'+(low?'<small class="warnc">di bawah minimum</small>':'')+
      '<button class="btn ghost sm" data-act="own-adjust" data-id="'+esc(s.id)+'" data-v="'+esc(s.name)+'">Sesuaikan</button>'+(low ? '<button class="linkbtn small" data-act="own-msg" data-v="store:'+esc(s.id)+'">Ingatkan lewat pesan</button>':'')+'</div></div>';
  }).join("") : '<div class="muted small">Belum ada toko.</div>')+'</div>';
  const drvs = (D.drivers||[]).slice().sort((a, b) => ((W.balances||{})["drv:"+a.id]||0) - ((W.balances||{})["drv:"+b.id]||0));
  h += '<div class="card pad"><h3 class="sub">Saldo per driver (potongan 3%)</h3>'+(drvs.length ? drvs.map(d => {
    const b = (W.balances||{})["drv:"+d.id] || 0, f = (W.fees||{})["drv:"+d.id] || 0, low = b < (c.minBalance||0);
    return '<div class="orow"><div class="grow"><b>'+esc(d.name)+'</b><small>Potongan 3% terpotong: '+rp(f)+' · '+(PT["drv:"+d.id]||0)+' poin</small></div><div class="r"><b class="'+(low?'neg':'')+'">'+rp(b)+'</b>'+(low?'<small class="warnc">order tidak masuk</small>'+'<button class="linkbtn small" data-act="own-msg" data-v="drv:'+esc(d.id)+'">Ingatkan lewat pesan</button>':'')+
      '<button class="btn ghost sm" data-act="own-adjust" data-id="drv:'+esc(d.id)+'" data-v="Driver '+esc(d.name)+'">Sesuaikan</button></div></div>';
  }).join("") : '<div class="muted small">Belum ada driver.</div>')+'</div>';
  h += fraudCard();
  h += placesCard();
  h += '<div class="card pad"><h3 class="sub">Jejak audit</h3><div class="hint">Catatan permanen semua tindakan owner (saldo, verifikasi, hapus, pengaturan). Tidak bisa diubah atau dihapus.</div><button class="btn ghost sm" data-act="own-audit">'+I("receipt")+' Lihat 100 catatan terakhir</button></div>';
  h += '<form class="card pad" id="walletCfg"><h3 class="sub">Pengaturan saldo</h3>'+
    '<div class="cols2"><div><label class="f">Minimal saldo (Rp)</label><input class="in" name="minBalance" inputmode="numeric" value="'+esc(c.minBalance)+'"></div><div><label class="f">Bonus toko/driver baru (Rp)</label><input class="in" name="bonus" inputmode="numeric" value="'+esc(c.bonus)+'"></div></div>'+
    '<h3 class="sub" style="margin-top:16px">Komisi JAGA</h3><div class="cols2"><div><label class="f">Komisi penjualan toko (%)</label><input class="in" name="storePct" inputmode="decimal" value="'+esc(c.storePct)+'"></div><div><label class="f">Komisi ongkir/tarif driver (%)</label><input class="in" name="drvPct" inputmode="decimal" value="'+esc(c.drvPct)+'"></div></div>'+
    '<div class="cols2"><div><label class="f">Transaksi minimum kena komisi (Rp)</label><input class="in" name="minTx" inputmode="numeric" value="'+esc(c.minTx)+'"></div><div><label class="f">Pembulatan komisi</label><select class="in" name="round">'+[1,10,100,500,1000].map(v => '<option value="'+v+'"'+(+c.round === v ? ' selected' : '')+'>Rp'+v+'</option>').join("")+'</select></div></div>'+
    '<div class="hint">Berlaku untuk pesanan baru. Pesanan yang sudah dibuat tetap memakai komisi saat dibuat. Standar: 3%.</div>'+
    '<h3 class="sub" style="margin-top:16px">Poin harian</h3><div class="cols2"><div><label class="f">Target transaksi selesai / hari</label><input class="in" name="ptTarget" inputmode="numeric" value="'+esc(c.ptTarget)+'"></div><div><label class="f">Poin didapat</label><input class="in" name="ptEarn" inputmode="numeric" value="'+esc(c.ptEarn)+'"></div></div>'+
    '<div class="cols2"><div><label class="f">Poin untuk ditukar</label><input class="in" name="ptRedeem" inputmode="numeric" value="'+esc(c.ptRedeem)+'"></div><div><label class="f">Nilai tukar (Rp)</label><input class="in" name="ptValue" inputmode="numeric" value="'+esc(c.ptValue)+'"></div></div>'+
    '<div class="hint">Berlaku untuk toko, driver, dan pembeli. Pembeli memakai hasil tukar poin untuk memotong ongkir/tarif Jago; JAGA mengganti potongan itu ke saldo driver.</div>'+
    '<h3 class="sub" style="margin-top:16px">Tujuan isi saldo (bank, virtual account, e-wallet)</h3><div id="payRows">'+payList(c).concat([{}]).map(payRow).join("")+'</div>'+
    '<button type="button" class="btn ghost sm" data-act="pay-row-add">'+I("plus")+' Tambah tujuan</button>'+
    '<div class="hint">Toko dan driver melihat semua tujuan ini di menu Saldo, transfer ke salah satunya, lalu wajib mengunggah bukti transfer.</div>'+
    '<label class="f">QRIS JAGA (opsional)</label>'+(c.qris ? '<img class="qris" alt="QRIS" src="'+esc(c.qris)+'"><label class="check"><input type="checkbox" name="qrisRemove"> Hapus QRIS</label>' : '')+'<input type="file" accept="image/*" class="in" id="wQris">'+
    '<button class="btn sm" style="margin-top:12px">Simpan pengaturan</button></form>';
  h += '<div class="card pad"><h3 class="sub">Mutasi terbaru</h3>'+((W.recent||[]).length ? W.recent.map(t => txRow(t, true)).join("") : '<div class="muted small">Belum ada mutasi.</div>')+'</div>';
  return h;
}
/* ---------- aksi ---------- */
document.addEventListener("click", async e => {
  const el = e.target.closest("[data-act]"); if(!el) return;
  const a = el.dataset.act;
  if(a === "topup-amt"){ const f = el.closest("form"); f.querySelector('[name=amount]').value = el.dataset.v; return; }
  if(a === "own-topup"){
    const okk = el.dataset.v === "1", id = el.dataset.id;
    confirmModal(okk ? "Setujui pengisian saldo ini? Pastikan uangnya sudah masuk ke rekening JAGA." : "Tolak pengisian saldo ini?", okk ? "Setujui" : "Tolak", async () => {
      try{ await OWAL.decide(isNaN(+id) ? id : +id, okk); toast(okk ? "Saldo ditambahkan" : "Pengisian ditolak"); }catch(err){ toast(String(err.message||"Gagal").replace(/^.*?:\s*/,"")); }
      await loadOwnerWallet(); render();
    });
    return;
  }
  if(a === "own-proof"){
    document.getElementById("modal").innerHTML = '<div class="modal-bg" data-act="modal-bg"><div class="modal"><img alt="Bukti transfer" src="'+esc(el.dataset.v)+'" style="width:100%;border-radius:12px"><button class="btn block" style="margin-top:12px" onclick="closeModal()">Tutup</button></div></div>';
    return;
  }
  if(a === "rep-days"){ S.repDays = parseInt(el.dataset.v, 10) || 7; render(); return; }
  if(a === "rep-csv"){
    const s = storeById(S.sellerStoreId); if(!s) return; const PD = S.repDays || 7, from = Date.now() - PD * 86400000;
    const os = S.orders.filter(o => o.storeId === s.id && (o.createdAt || 0) >= from).sort((a,b) => (a.createdAt||0) - (b.createdAt||0));
    const rows = [["Tanggal","Kode","Status","Barang","Subtotal (Rp)","Komisi JAGA (Rp)","Diterima toko (Rp)","Pembayaran"]].concat(os.map(o => [csvDate(o.createdAt), o.code, o.status, (o.items||[]).map(i => i.qty + "x " + i.name).join("; "), o.total || 0, o.status === "selesai" ? shareVal(o) : 0, o.status === "selesai" ? (o.total||0) - shareVal(o) : 0, o.pay ? o.pay.type : ""]));
    const done = os.filter(o => o.status === "selesai"), om = done.reduce((x,o)=>x+(o.total||0),0), sh = done.reduce((x,o)=>x+shareVal(o),0);
    rows.push([]); rows.push(["","","","TOTAL selesai ("+done.length+" pesanan)", om, sh, om - sh, ""]);
    csvDownload("laporan-" + csvSlug(s.name) + "-" + PD + "hari-" + new Date().toISOString().slice(0,10) + ".csv", rows); toast("Laporan diunduh"); return;
  }
  if(a === "own-csv"){
    const D = ownD(), f = rangeStart(S.own.range), RD = D.rides || [];
    const rows = [["Jenis","Tanggal","Kode","Toko/Pembeli","Status","Nilai transaksi (Rp)","Komisi toko (Rp)","Komisi ongkir antar (Rp)","Komisi Jago (Rp)"]];
    (D.orders || []).filter(o => (o.createdAt || 0) >= f).sort((a,b) => (a.createdAt||0) - (b.createdAt||0)).forEach(o => rows.push(["Pesanan", csvDate(o.createdAt), o.code, o.storeName || "", o.status, o.total || 0, o.status === "selesai" ? shareVal(o) : 0, o.status === "selesai" ? (o.drvFee || 0) : 0, 0]));
    RD.filter(r => (r.createdAt || 0) >= f).sort((a,b) => (a.createdAt||0) - (b.createdAt||0)).forEach(r => rows.push(["Jago", csvDate(r.createdAt), r.code || r.id, "", r.status, r.fareFinal || r.fareEst || 0, 0, 0, r.status === "selesai" ? (r.fee || 0) : 0]));
    csvDownload("transaksi-jaga-" + new Date().toISOString().slice(0,10) + ".csv", rows); toast("Transaksi diunduh"); return;
  }
  if(a === "own-places"){ placesOpen(); return; }
  if(a === "own-place-del"){ try{ await sbStore.rpc("jt_owner_place_del", {p_id:el.dataset.id}); }catch(err){ toast(String(err.message||"Gagal").replace(/^.*?:\s*/,"")); } placesOpen(); return; }
  if(a === "pg-more"){ S.pgN = S.pgN || {}; S.pgN[el.dataset.k] = (S.pgN[el.dataset.k] || 20) + 20; render(); return; }
  if(a === "promo-open"){ promoOpen(el.dataset.id); return; }
  if(a === "promo-toggle"){ try{ await sbStore.rpc("jt_promo_toggle", {p_sid:el.dataset.id, p_code:el.dataset.code, p_active:el.dataset.v === "1"}); }catch(err){ toast(String(err.message||"Gagal").replace(/^.*?:\s*/,"")); } promoOpen(el.dataset.id); return; }
  if(a === "promo-apply"){
    const code = (document.getElementById("promoCode").value || "").trim().toUpperCase(); const msg = document.getElementById("promoMsg");
    const t = cartTotals();
    if(!code){ S.promo = null; render(); return; }
    try{
      const { data, error } = await SB.rpc("jt_promo_check", {p_sid:S.cart.storeId, p_code:code, p_sub:t.subtotal}); if(error) throw sbErr(error);
      if(!data || !data.ok){ S.promo = null; if(msg) msg.textContent = (data && data.msg) || "Kode tidak berlaku"; toast((data && data.msg) || "Kode tidak berlaku"); return; }
      const snap = []; document.querySelectorAll("#checkout [name]").forEach(x => snap.push([x.name, x.value, (x.type === "radio" || x.type === "checkbox") ? x.checked : null]));
      S.promo = {sid:S.cart.storeId, code:data.code, disc:data.disc, sub:t.subtotal}; toast("Promo dipakai: hemat " + rp(data.disc)); render();
      setTimeout(() => snap.forEach(([nm, v, c]) => { document.querySelectorAll('#checkout [name="'+nm+'"]').forEach(x => { if(c === null) x.value = v; else if(x.value === v) x.checked = c; }); }), 0);
    }catch(err){ toast(String(err.message||"Gagal cek promo").replace(/^.*?:\s*/,"")); }
    return;
  }
  if(a === "own-exempt"){
    document.getElementById("modal").innerHTML = '<div class="modal-bg" data-act="modal-bg"><form class="modal" id="exForm" data-k="'+esc(el.dataset.k)+'" data-id="'+esc(el.dataset.id)+'"><h2 class="sec">Bebas komisi</h2><p class="muted" style="margin-top:0">'+esc(el.dataset.v)+'</p><label class="f">Lama (hari, 0 = cabut)</label><input class="in" name="days" type="number" min="0" max="365" value="30" required><div class="hint">Selama aktif, komisi JAGA untuk akun ini Rp0. Tercatat di jejak audit.</div><div class="actions"><button class="btn" type="submit">Simpan</button><button type="button" class="btn ghost" onclick="closeModal()">Batal</button></div></form></div>';
    return;
  }
  if(a === "proof-view"){ proofView(el.dataset.id); return; }
  if(a === "own-fraud"){ fraudOpen(); return; }
  if(a === "own-audit"){
    const AL = {"wallet.adjust":"Sesuaikan saldo","wallet.cfg":"Ubah pengaturan saldo/komisi","topup.decide":"Putusan isi saldo","place.delete":"Hapus tempat", "comm.exempt":"Bebas komisi", "fraud.cfg":"Aturan kecurangan", "buyer.decide":"Putusan akun pembeli", "buyer.gate":"Gerbang akun pembeli", "driver.verify":"Verifikasi driver","driver.active":"Aktif/nonaktif driver","driver.delete":"Hapus driver","store.active":"Aktif/nonaktif toko","store.delete":"Hapus toko","order.set":"Ubah status order","report.set":"Tangani laporan","areas.save":"Ubah wilayah","owner.setpass":"Ganti password owner"};
    document.getElementById("modal").innerHTML = '<div class="modal-bg" data-act="modal-bg"><div class="modal"><h2 class="sec">Jejak audit</h2><div id="auditBox" class="muted small">Memuat…</div><div class="actions"><button type="button" class="btn ghost" onclick="closeModal()">Tutup</button></div></div></div>';
    try{
      const rows = SB ? await sbStore.rpc("jt_owner_audit", {p_limit:100}) : [];
      const box = document.getElementById("auditBox"); if(!box) return;
      box.innerHTML = !SB ? 'Jejak audit aktif pada mode online.' : (rows && rows.length ? rows.map(r => { const d = r.detail || {}; const bits = Object.keys(d).filter(k => d[k] !== null && d[k] !== "" && k !== "keys").map(k => esc(k) + ": " + esc(typeof d[k] === "object" ? JSON.stringify(d[k]) : String(d[k]))).join(" · ");
        return '<div class="orow"><div class="grow"><b>'+esc(AL[r.action] || r.action)+'</b><small>'+esc(r.target || "")+(bits ? ' · '+bits : '')+'</small></div><div class="r"><small>'+esc(new Date(r.at).toLocaleString("id-ID"))+'</small><small>'+esc(r.actor)+'</small></div></div>'; }).join("") : 'Belum ada catatan.');
    }catch(err){ const box = document.getElementById("auditBox"); if(box) box.textContent = "Gagal memuat: " + String(err.message || err); }
    return;
  }
  if(a === "own-adjust"){
    const sid = el.dataset.id;
    document.getElementById("modal").innerHTML = '<div class="modal-bg" data-act="modal-bg"><form class="modal" id="adjForm" data-id="'+esc(sid)+'"><h2 class="sec">Sesuaikan saldo</h2><p class="muted" style="margin-top:0">'+esc(el.dataset.v)+'</p>'+
      '<label class="f">Jumlah (pakai minus untuk mengurangi, contoh -5000)</label><input class="in" name="amt" required inputmode="numeric">'+
      '<label class="f">Keterangan</label><input class="in" name="note" placeholder="Contoh: koreksi, hadiah, promo">'+
      '<div class="actions"><button class="btn">Simpan</button><button type="button" class="btn ghost" onclick="closeModal()">Batal</button></div></form></div>';
  }
});
document.addEventListener("submit", async e => {
  const f = e.target;
  if(f.id === "topupForm"){
    e.preventDefault();
    const amt = parseInt(String(new FormData(f).get("amount")||"").replace(/\D/g, ""), 10);
    if(!(amt >= 10000)) return toast("Jumlah isi saldo minimal Rp10.000.");
    const file = document.getElementById("topupProof").files[0];
    if(!file) return toast("Unggah foto bukti transfer.");
    const btn = f.querySelector("button.btn.block"); btn.disabled = true;
    try{ const img = await compressImage(file, 1000); await WAL.topup(f.dataset.id, amt, img); toast("Pengisian terkirim. Saldo masuk setelah dicek JAGA."); f.reset(); }
    catch(err){ toast(String(err.message||"Gagal").replace(/^.*?:\s*/,"")); }
    btn.disabled = false; await loadWallet(f.dataset.id); render();
  }
  if(f.id === "walletCfg"){
    e.preventDefault();
    const fd = new FormData(f); const num = k => parseInt(String(fd.get(k)||"0").replace(/\D/g,""), 10) || 0;
    const pay = [...f.querySelectorAll(".payrow")].map(r => ({type:r.querySelector("[name^=ptype]").value, name:r.querySelector("[name^=pname]").value.trim(), no:r.querySelector("[name^=pno]").value.trim(), holder:r.querySelector("[name^=pholder]").value.trim()})).filter(x => x.name || x.no);
    if(pay.some(x => !x.name || !x.no)) return toast("Lengkapi nama dan nomor setiap tujuan transfer.");
    const b0 = pay.find(x => x.type === "bank") || {};
    const dec = k => { const v = parseFloat(String(fd.get(k)||"0").replace(",", ".")); return isFinite(v) ? Math.max(0, Math.min(30, Math.round(v * 100) / 100)) : 0; };
    const d = {storePct:dec("storePct"), drvPct:dec("drvPct"), minTx:num("minTx"), round:parseInt(fd.get("round"), 10) || 1, minBalance:num("minBalance"), bonus:num("bonus"), ptTarget:Math.max(1, num("ptTarget")), ptEarn:num("ptEarn"), ptRedeem:Math.max(1, num("ptRedeem")), ptValue:num("ptValue"), pay, bank:{name:b0.name||"", no:b0.no||"", holder:b0.holder||""}};
    const q = document.getElementById("wQris").files[0];
    try{
      if(q) d.qris = await compressImage(q, 900); else if(fd.get("qrisRemove")) d.qris = "";
      await OWAL.cfg(d); applyComm(d); toast("Pengaturan saldo disimpan");
    }catch(err){ toast(String(err.message||"Gagal").replace(/^.*?:\s*/,"")); }
    await loadOwnerWallet(); render();
  }
  if(f.id === "promoForm"){
    e.preventDefault(); const fd = new FormData(f); const dys = parseInt(fd.get("days"), 10);
    try{ await sbStore.rpc("jt_promo_save", {p_sid:f.dataset.id, p_data:{code:String(fd.get("code")||"").trim(), kind:fd.get("kind"), value:+fd.get("value"), min_sub:+fd.get("min_sub")||0, max_disc:+fd.get("max_disc")||0, quota:parseInt(fd.get("quota"),10)||0, expires:dys > 0 ? Date.now() + dys*86400000 : 0}}); toast("Kode promo disimpan"); promoOpen(f.dataset.id); }
    catch(err){ toast(String(err.message||"Gagal").replace(/^.*?:\s*/,"")); }
    return;
  }
  if(f.id === "exForm"){
    e.preventDefault(); const fd = new FormData(f);
    try{ S.ownEx = await sbStore.rpc("jt_owner_exempt", {p_kind:f.dataset.k, p_id:f.dataset.id, p_days:parseInt(fd.get("days"),10)||0}); closeModal(); toast("Pengaturan bebas komisi disimpan"); render(); }
    catch(err){ toast(String(err.message||"Gagal").replace(/^.*?:\s*/,"")); }
    return;
  }
  if(f.id === "placeSave"){
    e.preventDefault(); const fd = new FormData(f);
    try{ await sbStore.rpc("jt_place_save", {p_name:String(fd.get("name")||"").trim(), p_addr:f.dataset.addr || "", p_lat:+f.dataset.lat, p_lng:+f.dataset.lng}); closeModal(); toast("Tempat disimpan. Terima kasih!"); }
    catch(err){ toast(String(err.message||"Gagal").replace(/^.*?:\s*/,"")); }
    return;
  }
  if(f.id === "frCfg"){
    e.preventDefault(); const fd = new FormData(f);
    try{ await sbStore.rpc("jt_owner_fraud_cfg", {p_data:{proofReq:fd.get("proofReq") === "on", fastSec:+fd.get("fastSec"), ongkirX:+fd.get("ongkirX"), pairN:+fd.get("pairN"), cancelN:+fd.get("cancelN")}}); S.proofReq = undefined; toast("Aturan disimpan"); fraudOpen(); }
    catch(err){ toast(String(err.message||"Gagal").replace(/^.*?:\s*/,"")); }
    return;
  }
  if(f.id === "adjForm"){
    e.preventDefault();
    const fd = new FormData(f); const amt = parseInt(String(fd.get("amt")||"").replace(/[^\d-]/g, ""), 10);
    if(!amt) return toast("Isi jumlah penyesuaian.");
    try{ await OWAL.adjust(f.dataset.id, amt, (fd.get("note")||"").trim()); closeModal(); toast("Saldo disesuaikan"); }catch(err){ toast(String(err.message||"Gagal").replace(/^.*?:\s*/,"")); }
    await loadOwnerWallet(); render();
  }
});

/* ============ Mulai ============ */
function startListening(){
  const slowT = setTimeout(() => { S.slow = true; render(); }, 10000);
  store.listen("stores", (rows, fromCache) => {
    if(rows){ S.stores = rows.map(r => CAT_ALIAS[r.category] ? Object.assign({}, r, {category:CAT_ALIAS[r.category]}) : r); syncProductSubs(); }
    if(!fromCache){ S.ready.stores = true; S.slow = false; clearTimeout(slowT); }
    else if(rows && rows.length) S.ready.stores = true;
    render();
  });
  if(!SB) store.listen("wallettx", rows => { if(rows){ S.walletTx = rows; if(S.sellerStoreId) loadWallet(S.sellerStoreId, S.role !== "seller"); } });
  if(!SB) store.listen("settings", rows => { if(rows){ S.walletCfg = rows.find(r => r.id === "wallet") || null; const ar = rows.find(r => r.id === "areas"); if(ar && ar.list){ S.areasLocal = ar.list; setAreas(ar.list); } } });
  if(SB) loadAreas().then(() => autoLocate()); else autoLocate();
  loadComm();
  if(!SB) store.listen("chatmsgs", rows => { if(rows) S.chatMsgs = rows; });
  if(!SB) store.listen("drivers", rows => { if(rows) S.drivers = rows; if(S.role === "driver") drvRefresh(); });
  if(!SB) store.listen("rides", rows => { if(!rows) return; S.ridesAll = rows; setRides(rows.filter(r => r.riderId === ME).sort((a, b) => (b.createdAt||0) - (a.createdAt||0))); if(S.role === "driver") drvRefresh(); });
  if(SB) rideRefresh();
  if(!SB){
    store.listen("ratings", rows => { if(!rows) return; S.localRatings = rows; loadRatings(); });
    store.listen("reports", rows => { if(!rows) return; S.localReports = rows; loadMyReports(); if(S.role === "owner") loadOwnerReports(); });
    store.listen("driverdocs", rows => { if(!rows) return; S.localDriverDocs = {}; rows.forEach(r => S.localDriverDocs[r.id] = r); });
  } else { loadRatings(); loadMyReports(); setInterval(() => { if(!document.hidden && ["order","jago","orders"].includes(S.view)) loadMyReports(); }, 60000); setInterval(() => { if(!document.hidden) loadRatings(); }, 300000); }
  setTimeout(openStoreFromHash, 50);
  store.listen("orders", (rows, fromCache) => {
    const sig = rows ? JSON.stringify(rows) : null;
    const same = sig !== null && sig === S._ordSig && S.ready.orders;
    if(rows){ S.orders = rows; S._ordSig = sig; notifyNewOrders(); buyerOrderNotify(); }
    if(!fromCache || (rows && rows.length)) S.ready.orders = true;
    if(!same) render();
  });
}
(async function init(){
  showSplash();
  let db = null, user = null;
  if(SB){
    S.mode = "supabase";
    try{ ME = localStorage.getItem("jt_uid") || ""; if(!ME){ ME = uid("u"); localStorage.setItem("jt_uid", ME); } }catch(e){ ME = uid("u"); }
    refreshMyStores(); loadBuyer(); startListening(); if(S.role === "driver") startDriver(); if(S.role === "owner") startOwner(); startChatPoll(); render(); return;
  }
  try{
    if(window.claude && typeof window.claude.use === "function"){
      const t = new Promise(r => setTimeout(() => r(null), 10000));
      [db, user] = await Promise.all([Promise.race([window.claude.use("db"), t]), Promise.race([window.claude.use("user"), t])]);
    }
  }catch(e){ db = null; }
  if(db){
    DB = db; S.mode = "db";
    try{ const i = user ? await user.id() : null; if(i) ME = i; }catch(e){}
  } else {
    S.mode = "local";
    try{ ME = localStorage.getItem("jt_uid") || ""; if(!ME){ ME = uid("u"); localStorage.setItem("jt_uid", ME); } }catch(e){}
  }
  startListening();
  if(S.role === "driver") startDriver();
  if(S.role === "owner") startOwner();
  startChatPoll();
  render();
})();
render();


/* ===== Ajakan pasang otomatis saat aplikasi dibuka (panduan langsung di notifikasi) ===== */
const UA2 = navigator.userAgent || "";
const isInApp2 = () => /FBAN|FBAV|FB_IAB|Instagram|Line\/|MicroMessenger|TikTok|Twitter|Snapchat|GSA\/|; wv\)|WhatsApp|Telegram/i.test(UA2);
function instSnoozed(){ try{ return Date.now() < (+localStorage.getItem("jt_inst_snooze") || 0); }catch(e){ return false; } }
function closeInstSheet(){ const s = document.getElementById("instsheet"); if(!s) return; s.classList.add("out"); setTimeout(() => s.remove(), 260); }
function instSheetMode(){ if(isInApp2()) return "inapp"; if(isIOS()) return "ios"; return INSTALL_EVT ? "native" : "manual"; }
function instSheetAction(m){
  if(m === "native") return '<button class="btn block press" data-ia="go">Pasang sekarang</button><p class="ihelp">Kotak pasang akan muncul otomatis saat Anda menyentuh layar. Tinggal ketuk <b>Instal</b>.</p>';
  if(m === "ios") return '<ol class="isteps"><li>Ketuk tombol <b>Bagikan</b> <span class="ish2">⬆︎</span> di Safari</li><li>Pilih <b>Tambah ke Layar Utama</b></li><li>Ketuk <b>Tambah</b></li></ol>';
  if(m === "inapp"){ const it = "intent://" + location.host + location.pathname + location.search + "#Intent;scheme=https;package=com.android.chrome;end"; return '<p class="ihelp" style="margin:0 0 10px">Browser ini tidak bisa memasang aplikasi. Buka dulu di browser utama.</p>' + (/android/i.test(UA2) ? '<a class="btn block press" href="'+it+'">Buka di Chrome</a>' : '<ol class="isteps"><li>Ketuk menu <b>⋯</b> atau <b>Bagikan</b></li><li>Pilih <b>Buka di Safari</b></li></ol>'); }
  return '<ol class="isteps"><li>Ketuk menu <b>⋮</b> di pojok kanan atas browser</li><li>Pilih <b>Instal aplikasi</b> atau <b>Tambahkan ke layar utama</b></li></ol>';
}
const onRegPage = () => !!document.getElementById("loginForm");
function showInstSheet(){
  if(isStandalone() || instSnoozed() || !onRegPage()) return;
  if(/^#(mitra|driver)/.test(location.hash)) return;
  const m = instSheetMode(); let el = document.getElementById("instsheet");
  if(el && el.dataset.m === m) return;
  if(!el){ el = document.createElement("div"); el.id = "instsheet"; el.setAttribute("role", "dialog"); el.setAttribute("aria-label", "Pasang JAGA di perangkat Anda"); document.body.appendChild(el); }
  el.dataset.m = m;
  el.innerHTML = '<div class="ish"><div class="isg"></div><div class="ist"><img src="icons/icon-192.png" alt=""><div><b>Pasang JAGA di perangkat Anda</b><small>Untuk HP, iPad, atau tablet. Buka lebih cepat dari layar utama</small></div></div>' + instSheetAction(m) + '<button class="isl" data-ia="later">Nanti saja</button></div>';
}
document.addEventListener("click", e => {
  const b = e.target.closest("[data-ia]"); if(!b) return;
  if(b.dataset.ia === "go"){ if(INSTALL_EVT){ closeInstSheet(); doInstall(""); } else { doInstall(""); } }
  else { try{ localStorage.setItem("jt_inst_snooze", String(Date.now() + 3*864e5)); }catch(_){} closeInstSheet(); }
});
window.addEventListener("appinstalled", closeInstSheet);
window.addEventListener("beforeinstallprompt", () => { setTimeout(showInstSheet, 600); });
setTimeout(showInstSheet, 2000);

/* Sentuhan pertama di mana saja langsung memunculkan kotak pasang bawaan browser (syarat browser: harus ada sentuhan pengunjung) */
let AUTO_TRIED = false;
function autoPrompt(){
  if(AUTO_TRIED || !INSTALL_EVT || !onRegPage() || isStandalone() || instSnoozed() || /^#(mitra|driver)/.test(location.hash)) return;
  AUTO_TRIED = true; const ev = INSTALL_EVT;
  try{ ev.prompt(); (ev.userChoice || Promise.resolve()).then(r => { INSTALL_EVT = null; closeInstSheet(); if(r && r.outcome === "dismissed"){ try{ localStorage.setItem("jt_inst_snooze", String(Date.now() + 864e5)); }catch(_){} } }).catch(() => {}); }catch(e){ AUTO_TRIED = false; }
}
["pointerup","touchend","click"].forEach(t => document.addEventListener(t, autoPrompt, {capture:true, passive:true}));

/* ajakan pasang hanya di halaman awal pendaftaran: hilang saat pindah halaman, muncul lagi bila kembali ke halaman itu */
setInterval(() => { if(document.getElementById("instsheet") && !onRegPage()) closeInstSheet(); else if(!document.getElementById("instsheet") && onRegPage()) showInstSheet(); }, 700);


/* ============ Hapus akun sendiri (pembeli, toko, driver): harus tanpa pesanan berjalan & bagi hasil lunas ============ */
const ACC = {
  async status(role, id){
    if(SB) return sbStore.rpc("jt_account_status", {p_role:role, p_id:id || null});
    const wid = role === "store" ? id : role === "driver" ? "drv:" + (S.drv.me ? S.drv.me.id : DRIVER_ID_LOCAL) : "";
    const bal = wid ? balLocal(wid) : 0, fin = o => ["selesai","dibatalkan"].includes(o.status);
    const act = role === "store" ? S.orders.filter(o => o.storeId === id && !fin(o)).length : role === "buyer" ? S.orders.concat(S.rides || []).filter(o => (o.buyerId === ME || o.riderId === ME) && !fin(o)).length : 0;
    const why = []; if(act) why.push("Masih ada " + act + " pesanan berjalan. Selesaikan atau batalkan dulu."); if(bal < 0) why.push("Masih ada tanggungan bagi hasil " + rp(-bal) + ". Lunasi dulu lewat Isi saldo.");
    return {name:"", balance:bal, due:Math.max(-bal, 0), pending:0, active:act, ok:!why.length, why};
  },
  async del(role, id){
    if(SB) return sbStore.rpc("jt_account_delete", {p_role:role, p_id:id || null});
    if(role === "store") await store.del("stores/" + id); else if(role === "driver" && S.drv.me) await store.del("drivers/" + S.drv.me.id);
    return {ok:true};
  }
};
async function openAccDel(role, id){
  const M = document.getElementById("modal"), label = ({buyer:"akun pembeli", store:"akun toko", driver:"akun driver"})[role];
  M.innerHTML = '<div class="modal-bg" data-act="modal-bg"><div class="modal"><h2 class="sec">Hapus '+label+'</h2><p class="muted">Memeriksa pesanan dan bagi hasil…</p></div></div>';
  let st; try{ st = await ACC.status(role, id); }catch(e){ M.innerHTML = '<div class="modal-bg" data-act="modal-bg"><div class="modal"><h2 class="sec">Hapus '+label+'</h2><p>'+esc((e && e.message) || "Gagal memeriksa akun. Coba lagi.")+'</p><div class="actions"><button class="btn ghost" data-act="close-modal">Tutup</button></div></div></div>'; return; }
  const money = role !== "buyer", row = (l, v, bad) => '<div class="accrow'+(bad?' bad':'')+'"><span>'+l+'</span><b>'+v+'</b></div>';
  let h = '<div class="modal-bg" data-act="modal-bg"><div class="modal accdel"><h2 class="sec">Hapus '+label+(st.name ? ' “'+esc(st.name)+'”' : '')+'</h2>'+
    '<div class="accbox">'+row("Pesanan berjalan", st.active ? st.active + " pesanan" : "Tidak ada ✓", st.active > 0)+
    (money ? row("Tanggungan bagi hasil", st.due > 0 ? rp(st.due) : "Lunas ✓", st.due > 0) + row("Isi saldo menunggu", st.pending > 0 ? rp(st.pending) : "Tidak ada ✓", st.pending > 0) + row("Sisa saldo", rp(Math.max(st.balance, 0))) : '')+'</div>';
  if(!st.ok){
    h += '<div class="notice warnbox" style="margin:12px 0"><b>Akun belum bisa dihapus.</b><ul style="margin:6px 0 0;padding-left:18px">'+(st.why||[]).map(w => '<li>'+esc(w)+'</li>').join("")+'</ul></div>'+
      '<div class="actions">'+(money && st.due > 0 ? '<button class="btn" data-act="acc-pay" data-role="'+role+'" data-id="'+esc(id||"")+'">Isi saldo untuk melunasi</button>' : '')+'<button class="btn ghost" data-act="close-modal">Tutup</button></div>';
  } else {
    h += '<p class="small" style="margin:12px 0 6px">'+(role === "buyer" ? 'Data akun (nama, WhatsApp, alamat) dihapus permanen. Riwayat pesanan lama tetap tersimpan di toko untuk pembukuan.' : 'Semua tanggung jawab sudah selesai. Akun dihapus <b>permanen</b> dan tidak bisa dikembalikan.'+(st.balance > 0 ? ' Sisa saldo '+rp(st.balance)+' tidak ikut berpindah: hubungi tim JAGA <b>sebelum</b> menghapus bila ingin menanyakannya.' : ''))+'</p>'+
      '<label class="f">Ketik <b>HAPUS</b> untuk melanjutkan</label><input class="in" id="accWord" autocomplete="off" autocapitalize="characters" placeholder="HAPUS">'+
      '<div class="actions" style="margin-top:14px"><button class="btn danger" id="accGo" disabled>Hapus permanen</button><button class="btn ghost" data-act="close-modal">Batal</button></div>';
  }
  M.innerHTML = h + '</div></div>';
  const w = document.getElementById("accWord"), g = document.getElementById("accGo"); if(!w || !g) return;
  w.oninput = () => { g.disabled = w.value.trim().toUpperCase() !== "HAPUS"; };
  g.onclick = async () => {
    g.disabled = true; g.textContent = "Menghapus…";
    try{ await ACC.del(role, id); }catch(e){ toast((e && e.message) || "Gagal menghapus akun"); g.disabled = false; g.textContent = "Hapus permanen"; return; }
    closeModal();
    try{
      if(role === "buyer"){ localStorage.removeItem("st_buyer"); localStorage.removeItem("jt_onb"); if(typeof BUYER !== "undefined") BUYER.me = null; go("login"); }
      else if(role === "store"){ S.myStoreIds = null; S.stores = S.stores.filter(x => x.id !== id); if(S.sellerStoreId === id) S.sellerStoreId = null; await refreshMyStores(); go("seller", {sellerTab:"ringkasan"}); }
      else { S.drv.me = null; S.drv.editing = false; S.drv.offers = []; S.drv.mine = []; S.drv.sig = ""; render(); drvRefresh(); }
    }catch(_){ render(); }
    toast("Akun sudah dihapus. Terima kasih sudah memakai JAGA.");
  };
}
document.addEventListener("click", e => {
  const el = e.target.closest("[data-act]"); if(!el) return; const a = el.dataset.act;
  if(a === "acc-del"){ e.preventDefault(); openAccDel(el.dataset.role, el.dataset.id || ""); }
  else if(a === "acc-pay"){ closeModal(); if(el.dataset.role === "store") go("seller", {sellerTab:"saldo"}); else { const b = document.querySelector('[data-act="drv-wallet"]'); if(b) b.click(); else toast("Buka menu Saldo driver untuk mengisi saldo"); } }
});

/* ============ Halaman masuk untuk yang sudah punya akun toko / driver ============ */
S.masukTab = "toko";
const pwField = (name, ac) => '<div class="pwrap"><input class="in" type="password" name="'+name+'" autocomplete="'+ac+'" required><button type="button" class="pw-eye" data-act="pw-toggle" aria-label="Lihat password">'+I("eye")+'</button></div>';
function drvLoginCard(){
  return '<form class="card pad slogin" id="drvLogin" autocomplete="on"><div class="sl-head">'+E("scooter")+'<div><h2>Masuk driver</h2><small>Sudah punya akun driver? Masuk dengan nama, plat nomor, dan password.</small></div></div>'+
    '<label class="f">Nama lengkap</label><input class="in" name="name" autocomplete="name" required placeholder="Sesuai saat mendaftar">'+
    '<label class="f">Plat nomor</label><input class="in" name="plate" autocapitalize="characters" autocomplete="off" required placeholder="Contoh: BM 1234 AB">'+
    '<label class="f">Password</label>'+pwField("pass", "current-password")+
    '<button class="btn block press" style="margin-top:14px">Masuk</button>'+
    '<div class="hint" style="text-align:center">Belum pernah membuat password? Buka akun dari HP tempat mendaftar, ketuk <b>Ubah data</b>, lalu isi password.</div></form>';
}
function storeLoginCard2(){
  return '<form class="card pad slogin" id="storeLogin2" autocomplete="on"><div class="sl-head">'+E("store")+'<div><h2>Masuk toko</h2><small>Sudah punya akun toko? Masuk dengan nama login dan password toko.</small></div></div>'+
    '<label class="f">Nama toko / login</label><input class="in" name="login" autocomplete="username" autocapitalize="none" required placeholder="Contoh: wahyu">'+
    '<label class="f">Password</label>'+pwField("pass", "current-password")+
    '<button class="btn block press" style="margin-top:14px">Masuk</button>'+
    '<div class="hint" style="text-align:center">Nama login & password dibuat di menu <b>Pengaturan → Login toko</b>.</div></form>';
}
/* ---------- pemulihan akun (lupa akun / password) ---------- */
function recLoad(){
  if(!SB || S.recBusy) return; S.recBusy = true;
  sbStore.rpc("jt_recover_status", {}).then(r => { const sig = JSON.stringify(r); if(sig !== JSON.stringify(S.rec)){ S.rec = r || null; if(S.view === "masuk" && !typing()) render(); } })
    .catch(() => {}).finally(() => { S.recBusy = false; });
}
function recForm(t){
  const drv = t === "driver";
  return '<form class="card pad slogin" id="recForm" autocomplete="on"><div class="sl-head">'+E(drv ? "scooter" : "store")+'<div><h2>Pulihkan akun '+(drv ? 'driver' : 'toko')+'</h2><small>Isi data saat mendaftar. Tim JAGA akan mencocokkan, menghubungi Anda lewat WhatsApp, lalu menghubungkan akun ke HP ini.</small></div></div>'+
    '<input type="hidden" name="role" value="'+(drv ? 'driver' : 'store')+'">'+
    '<label class="f">Nomor WhatsApp saat daftar</label><input class="in" name="wa" inputmode="tel" autocomplete="tel" required placeholder="08…">'+
    '<label class="f">'+(drv ? 'Nama lengkap driver' : 'Nama toko')+'</label><input class="in" name="name" required placeholder="'+(drv ? 'Sesuai saat mendaftar' : 'Contoh: Toko Aksel')+'">'+
    (drv ? '<label class="f">Plat nomor</label><input class="in" name="plate" autocapitalize="characters" autocomplete="off" placeholder="Contoh: BM 1234 AB">' : '')+
    '<label class="f">Keterangan (opsional)</label><input class="in" name="note" maxlength="300" placeholder="Contoh: HP hilang, lupa password">'+
    '<button class="btn block press" style="margin-top:14px">Kirim ke tim JAGA</button>'+
    '<button type="button" class="btn ghost block" style="margin-top:8px" data-act="rec-close">Kembali ke halaman masuk</button></form>';
}
function recStatusCard(){
  const r = S.rec; if(!r) return "";
  if(r.status === "pending") return '<div class="recst wait">'+I("clock")+'<div><b>Permintaan pemulihan sedang dicek</b><small>Tim JAGA akan mencocokkan data dan menghubungi Anda lewat WhatsApp. Biarkan halaman ini, akun otomatis terhubung setelah dikonfirmasi.</small></div></div>';
  if(r.status === "rejected" && !r.seen) return '<div class="recst no">'+I("megaphone")+'<div><b>Permintaan pemulihan belum bisa dikonfirmasi</b><small>'+esc(r.note || "Data tidak cocok dengan akun mana pun.")+' Hubungi JAGA lewat WhatsApp atau kirim ulang dengan data yang benar.</small><button class="btn ghost sm" data-act="rec-dismiss">Tutup</button></div></div>';
  return "";
}
function recDoneCard(){
  const r = S.rec, drv = r.role === "driver";
  return '<form class="card pad slogin" id="recPass"><div class="recst ok" style="margin:0 0 12px">'+I("checkc")+'<div><b>Akun dipulihkan ✓</b><small>'+esc((drv ? 'Akun driver ' : 'Akun toko ') + (r.name || ''))+' sudah terhubung ke HP ini. Buat password baru agar bisa masuk lagi kapan saja.</small></div></div>'+
    (drv ? '' : '<label class="f">Nama login</label><input class="in" name="login" autocapitalize="none" autocomplete="username" required value="'+esc(r.login || "")+'" placeholder="Contoh: tokoaksel">')+
    '<label class="f">Password baru</label>'+pwField("pass", "new-password")+
    '<button class="btn block press" style="margin-top:14px">Simpan & buka '+(drv ? 'portal driver' : 'toko')+'</button>'+
    '<button type="button" class="btn ghost block" style="margin-top:8px" data-act="rec-skip">Nanti saja</button></form>';
}
async function recFinish(){
  const r = S.rec; if(!r) return;
  try{ await sbStore.rpc("jt_recover_seen", {p_id:r.id}); }catch(_){}
  r.seen = true; try{ localStorage.removeItem("jt_rec"); }catch(_){}
  if(r.role === "driver"){ try{ localStorage.setItem("jt_home_role", "driver"); }catch(_){} S.drv.sig = ""; S.drv.loaded = false; location.hash = "driver"; }
  else { try{ localStorage.setItem("jt_home_role", "seller"); }catch(_){} S.myStoreIds = null; await refreshMyStores(); if(ORD_REFRESH) await ORD_REFRESH(); S.sellerStoreId = r.targetId; location.hash = "mitra"; }
}
setInterval(() => { if(!document.hidden && SB && (S.view === "masuk" || (S.rec && S.rec.status === "pending"))) recLoad(); }, 15000);
setTimeout(() => { try{ if(SB && localStorage.getItem("jt_rec")) sbStore.rpc("jt_recover_status", {}).then(r => { S.rec = r || null; if(r && r.status === "ok" && !r.seen){ toast("Akun Anda sudah dipulihkan tim JAGA ✓"); go("masuk"); } }).catch(() => {}); }catch(_){} }, 2500);
function appMasuk(){
  if(S.rec === undefined){ S.rec = null; recLoad(); }
  const t = S.masukTab === "driver" ? "driver" : "toko";
  return '<div class="masuk"><div class="mhead"><button class="ibtn press" data-act="masuk-back" aria-label="Kembali">'+I("back")+'</button><div class="wmk">'+JMARK()+'<b>JAGA</b></div></div>'+
    '<h1>Masuk ke akun Anda</h1><p class="msub">Untuk mitra toko dan driver yang sudah terdaftar.</p>'+
    '<div class="mtabs" role="tablist"><button role="tab" class="'+(t==="toko"?"on":"")+'" data-act="masuk-tab" data-v="toko">'+E("store")+' Mitra toko</button><button role="tab" class="'+(t==="driver"?"on":"")+'" data-act="masuk-tab" data-v="driver">'+E("scooter")+' Driver</button></div>'+
    (S.rec && S.rec.status === "ok" && !S.rec.seen ? recDoneCard() : S.masukForgot ? recForm(t) : (t === "toko" ? storeLoginCard2() : drvLoginCard()) + recStatusCard() +
      '<p class="mfoot"><a data-act="rec-open">Lupa akun atau password?</a></p>')+
    '<p class="mfoot">Belum punya akun? '+(t === "toko" ? '<a data-act="mitra-info">Daftar jadi mitra toko</a>' : '<a data-act="open-driver">Daftar jadi driver</a>')+'</p></div>';
}
document.addEventListener("click", async e => {
  const el = e.target.closest("[data-act]"); if(!el) return; const a = el.dataset.act;
  if(a === "masuk-tab"){ S.masukTab = el.dataset.v; render(); }
  else if(a === "rec-open"){ if(!SB) return toast("Pemulihan akun hanya tersedia di jagapatner.my.id/apps"); S.masukForgot = true; render(); }
  else if(a === "rec-close"){ S.masukForgot = false; render(); }
  else if(a === "rec-dismiss"){ if(S.rec){ sbStore.rpc("jt_recover_seen", {p_id:S.rec.id}).catch(() => {}); S.rec.seen = true; } render(); }
  else if(a === "rec-skip"){ await recFinish(); toast("Akun terhubung. Buat password nanti di menu pengaturan."); }
  else if(a === "masuk-back"){ let onb = false; try{ onb = !!localStorage.getItem("jt_onb"); }catch(_){} go(onb ? "home" : "login"); }
  else if(a === "drv-logout"){
    confirmModal("Keluar dari akun driver di HP ini? Anda bisa masuk lagi dengan nama, plat nomor, dan password.", "Keluar", async () => {
      if(!SB) return toast("Keluar akun driver hanya tersedia di jagapatner.my.id");
      try{
        const r = await sbStore.rpc("jt_driver_logout", {});
        if(r && r.linked){ S.drv.me = null; S.drv.editing = false; S.drv.offers = []; S.drv.mine = []; S.drv.sig = ""; render(); await drvRefresh(); toast("Sudah keluar dari akun driver"); }
        else toast("HP ini adalah HP pendaftar akun, jadi tetap terhubung.");
      }catch(err){ toast((err && err.message) || "Gagal keluar"); }
    });
  }
});
document.addEventListener("submit", async e => {
  const f = e.target;
  if(f.id === "recForm" || f.id === "recPass"){
    e.preventDefault(); const fd = new FormData(f), btn = f.querySelector("button.btn"); btn.disabled = true;
    try{
      if(f.id === "recForm"){
        const r = await sbStore.rpc("jt_recover_request", {p_role:fd.get("role"), p_wa:String(fd.get("wa")||""), p_name:String(fd.get("name")||""), p_plate:String(fd.get("plate")||""), p_note:String(fd.get("note")||"")});
        try{ localStorage.setItem("jt_rec", String(r && r.id || 1)); }catch(_){}
        S.masukForgot = false; S.rec = undefined; render(); toast("Permintaan terkirim. Tim JAGA akan menghubungi Anda lewat WhatsApp.");
      } else {
        const pass = String(fd.get("pass") || "");
        if(S.rec.role === "driver") await sbStore.rpc("jt_driver_setpass", {p_pass:pass});
        else await sbStore.rpc("jt_store_setpass", {p_store:S.rec.targetId, p_login:String(fd.get("login")||""), p_pass:pass});
        await recFinish(); toast("Password baru tersimpan. Selamat datang kembali!");
      }
    }catch(err){ btn.disabled = false; toast(String((err && err.message) || "Gagal").replace(/^.*?:\s*/, "")); }
    return;
  }
  if(f.id !== "drvLogin" && f.id !== "storeLogin2") return;
  e.preventDefault();
  if(!SB) return toast("Masuk akun hanya tersedia di jagapatner.my.id/apps. Ini halaman pratinjau.");
  const fd = new FormData(f), btn = f.querySelector("button.btn"); btn.disabled = true; btn.textContent = "Memeriksa…";
  try{
    if(f.id === "drvLogin"){
      const r = await sbStore.rpc("jt_driver_login", {p_name:String(fd.get("name")||"").trim(), p_plate:String(fd.get("plate")||"").trim(), p_pass:String(fd.get("pass")||"")});
      if(!r || !r.ok) throw new Error((r && r.error) || "Nama, plat nomor, atau password salah");
      try{ localStorage.setItem("jt_home_role", "driver"); }catch(_){}
      S.drv.sig = ""; S.drv.loaded = false;
      if(S.role === "driver"){ await drvRefresh(); render(); } else location.hash = "driver";
      toast("Berhasil masuk. Selamat narik lagi!");
    } else {
      const { data, error } = await SB.rpc("jt_store_login", {p_login: fd.get("login"), p_pass: fd.get("pass"), p_key: KEY});
      if(error) throw sbErr(error);
      if(!data || !data.ok) throw new Error((data && data.error) || "Nama toko atau password salah");
      try{ localStorage.setItem("jt_home_role", "seller"); }catch(_){}
      S.myStoreIds = null; await refreshMyStores(); if(ORD_REFRESH) await ORD_REFRESH();
      S.sellerStoreId = data.storeId;
      if(S.role === "seller") go("seller", {sellerTab:"pesanan"}); else location.hash = "mitra";
      toast("Berhasil masuk. Pesanan baru tampil di sini.");
    }
  }catch(err){ toast(String((err && err.message) || "Gagal masuk").replace(/^.*?:\s*/, "")); btn.disabled = false; btn.textContent = "Masuk"; }
});

/* ============ Keuntungan driver: angka diambil dari aturan yang berlaku di server ============ */
let PUB_RULES = null;
async function loadRules(){
  try{ PUB_RULES = SB ? await sbStore.rpc("jt_public_rules", {}) : Object.assign({}, WCFG_DEF, wCfgLocal()); }catch(e){ PUB_RULES = null; }
  if(PUB_RULES && S.role === "driver" && !(S.drv && S.drv.me)) scheduleRender();
}
function drvPerks(){
  const r = Object.assign({}, WCFG_DEF, PUB_RULES || {}), pct = fmtPct(PUB_RULES && PUB_RULES.drvPct != null ? PUB_RULES.drvPct : COMM.drvPct) + "%";
  const per = rp(ONGKIR_PER) + " per " + ONGKIR_STEP + " m";
  const it = (e, t, d) => '<div>'+E(e)+'<b>'+t+'</b><span>'+d+'</span></div>';
  return '<div class="dperks">'+
    it("pin", "Order terdekat", "Order dicari mulai radius 1 km dari lokasimu, melebar sampai 5 km")+
    it("money", "Ongkir untukmu", "Antar barang: ongkir "+per+", bisa nego dan dibayar pembeli langsung ke kamu. Potongan JAGA "+pct+" dari ongkir")+
    it("scooter", "Order ojek Jago", "Antar penumpang dengan tarif "+per+". Potongan JAGA "+pct+" dari tarif")+
    it("card", "Saldo minimal "+rp(r.minBalance), "Potongan diambil otomatis dari saldo driver. Order baru masuk selama saldo minimal "+rp(r.minBalance))+
    it("check", "Daftar mudah", "Cukup nama, WA, plat, alamat & password. Setelah disetujui tim JAGA, dapat saldo gratis "+rp(r.bonus))+
    it("gift", "Poin harian", r.ptTarget+" order selesai sehari = "+r.ptEarn+" poin. Setiap "+r.ptRedeem+" poin = "+rp(r.ptValue)+" saldo")+
  '</div>';
}
loadRules();

/* ============ Navigasi langsung setelah menerima order + lokasi live untuk tamu ============ */
const NAV_SEEN = {}; let NAV_INIT = false;
function navTarget(o){
  const ride = isRide(o);
  if(o.status === "driver_jemput") return {t:"Jemput penumpang", who:o.rider && o.rider.name, loc:o.pickup, addr:o.pickup && o.pickup.address, lbl:"titik jemput"};
  if(o.status === "dalam_perjalanan") return {t:"Antar ke tujuan", who:o.rider && o.rider.name, loc:o.dest, addr:o.dest && o.dest.address, lbl:"tujuan"};
  if(!ride && o.status === "driver_ke_toko") return {t:"Ambil pesanan di toko", who:o.storeName, loc:o.storeLoc, addr:((o.storeAddress||"") + " " + (o.storeName||"")).trim(), lbl:"toko"};
  if(!ride && o.status === "diantar") return {t:"Antar ke pembeli", who:o.buyer && o.buyer.name, loc:o.buyer, addr:o.buyer && o.buyer.address, lbl:"pembeli", url:o.buyer && !hasLoc(o.buyer) ? o.buyer.maps : ""};
  return null;
}
function navSheet(o){
  const n = navTarget(o); if(!n) return;
  const url = n.url || navLink(hasLoc(n.loc) ? n.loc : null, n.addr), me = S.drv.loc;
  const dist = me && hasLoc(n.loc) ? fmtDist(distM(me, n.loc)) : "";
  const M = document.getElementById("modal");
  M.innerHTML = '<div class="modal-bg" data-act="modal-bg"><div class="modal navsheet"><div class="nvhead">'+E(n.lbl === "toko" ? "store" : "pin")+'<div><small>'+esc(n.t)+'</small><b>'+esc(n.who || "")+'</b></div>'+(dist ? '<span class="nvdist">'+dist+'</span>' : '')+'</div>'+
    '<p class="nvaddr">'+esc(shortAddr(n.addr) || (hasLoc(n.loc) ? fmtLL(n.loc) : "Alamat belum ada"))+'</p>'+
    '<button class="btn block press nvgo" data-act="nav-in" data-id="'+esc(o.id)+'">'+I("send")+' Mulai navigasi ke '+n.lbl+'</button>'+
    '<a class="btn ghost block nvg2" target="_blank" rel="noopener" href="'+esc(url)+'" data-act="nav-go">'+I("pin")+' Buka di Google Maps</a>'+
    '<p class="nvnote">Navigasi di JAGA menjaga lokasimu tetap live untuk '+(["driver_jemput","dalam_perjalanan"].includes(o.status) ? "penumpang" : o.status === "driver_ke_toko" ? "toko dan pembeli" : "pembeli")+'. Kalau memakai Google Maps, lokasimu berhenti terkirim sampai kamu kembali ke JAGA.</p>'+
    '<button class="linkbtn" style="display:block;margin:4px auto 0" data-act="close-modal">Nanti saja</button></div></div>';
}
function navCheck(){
  const mine = (S.drv && S.drv.mine) || [];
  if(!NAV_INIT){ mine.forEach(o => { NAV_SEEN[o.id + ":" + o.status] = 1; }); NAV_INIT = !!(S.drv && S.drv.me); return; }
  for(const o of mine){
    const k = o.id + ":" + o.status; if(NAV_SEEN[k]) continue; NAV_SEEN[k] = 1;
    if(navTarget(o) && S.role === "driver" && !document.getElementById("modal").innerHTML.trim()){ if(S.drv.loc) sendLoc(S.drv.loc); navSheet(o); break; }
  }
  keepAwake(mine.some(o => DRV_BUSY.includes(o.status)) || siagaNow());
}
{ const _dr = drvRefresh; drvRefresh = async function(){ const r = await _dr.apply(this, arguments); try{ navCheck(); }catch(_){} return r; }; }
document.addEventListener("click", e => { const a = e.target.closest('[data-act="nav-go"]'); if(a) setTimeout(closeModal, 400); });
/* layar tetap menyala selama membawa order, dan kirim lokasi segera saat kembali ke aplikasi */
let WAKE = null;
async function keepAwake(on){
  try{
    if(on && !WAKE && navigator.wakeLock && !document.hidden){ WAKE = await navigator.wakeLock.request("screen"); WAKE.addEventListener("release", () => { WAKE = null; }); }
    else if(!on && WAKE){ await WAKE.release(); WAKE = null; }
  }catch(_){ WAKE = null; }
}
document.addEventListener("visibilitychange", () => {
  if(!document.hidden){ pushResync(); if(siagaNow()) keepAwake(true); }
  if(document.hidden || S.role !== "driver") return;
  const busy = ((S.drv && S.drv.mine) || []).some(o => DRV_BUSY.includes(o.status));
  if(!busy) return;
  keepAwake(true);
  if(navigator.geolocation) navigator.geolocation.getCurrentPosition(p => { const c = {lat:+p.coords.latitude.toFixed(6), lng:+p.coords.longitude.toFixed(6)}; S.drv.loc = c; sendLoc(c); }, () => {}, {enableHighAccuracy:true, maximumAge:5000, timeout:15000});
});

/* ============ Navigasi live di dalam JAGA: rute jalan, petunjuk belokan, suara; lokasi driver tetap terkirim ============ */
const NAVX = {open:false, id:"", route:null, idx:1, fetchAt:0, fetching:false, map:null, mk:{}, line:null, follow:true, voice:(() => { try{ return localStorage.getItem("jt_nav_voice") !== "0"; }catch(_){ return true; } })(), said:"", tick:null, arrived:false, key:""};
const TURN_ID = {"left":"Belok kiri", "right":"Belok kanan", "slight left":"Ambil kiri", "slight right":"Ambil kanan", "sharp left":"Belok tajam ke kiri", "sharp right":"Belok tajam ke kanan", "straight":"Lurus terus", "uturn":"Putar balik"};
const TURN_DEG = {"left":-90, "right":90, "slight left":-45, "slight right":45, "sharp left":-135, "sharp right":135, "straight":0, "uturn":180};
function navStepText(st, lbl){
  if(st.text && (st.maneuver || {}).type !== "arrive") return st.text;
  const m = st.maneuver || {}, nm = st.name ? " ke " + st.name : "", t = TURN_ID[m.modifier] || "Lurus terus";
  if(m.type === "arrive") return "Sampai di " + lbl;
  if(m.type === "depart") return "Mulai jalan" + (st.name ? " di " + st.name : "");
  if(/roundabout|rotary/.test(m.type || "")) return "Di bundaran, ambil keluar ke-" + (m.exit || 1) + nm;
  if(m.type === "fork") return "Ambil cabang " + (/left/.test(m.modifier || "") ? "kiri" : "kanan") + nm;
  if(m.type === "end of road") return "Di ujung jalan, " + t.toLowerCase() + nm;
  if(m.type === "merge") return "Masuk ke jalur" + (st.name ? " " + st.name : " utama");
  if((m.type === "continue" || m.type === "new name") && (!m.modifier || m.modifier === "straight")) return "Lurus terus" + (st.name ? " di " + st.name : "");
  return t + nm;
}
const navArrow = deg => '<svg class="nvarr" viewBox="0 0 48 48" style="transform:rotate('+deg+'deg)" aria-hidden="true"><path d="M24 4 L38 22 H29 V44 H19 V22 H10 Z" fill="currentColor"/></svg>';
function navSay(t){
  if(!NAVX.voice || !window.speechSynthesis || NAVX.said === t) return; NAVX.said = t;
  try{ speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t.replace(/(\d+) m\b/g, "$1 meter").replace(/(\d+),(\d+) km/g, "$1 koma $2 kilometer").replace(/(\d+) km/g, "$1 kilometer")); u.lang = "id-ID"; if(typeof ID_VOICE !== "undefined" && ID_VOICE) u.voice = ID_VOICE; u.rate = 1; speechSynthesis.speak(u); }catch(_){}
}
function navJob(){ return ((S.drv && S.drv.mine) || []).find(o => o.id === NAVX.id); }
async function navFetch(from, to){
  if(NAVX.fetching) return; NAVX.fetching = true; NAVX.fetchAt = Date.now();
  const r = await roadRoute(from, to, true);
  NAVX.route = r ? Object.assign({to:to.lat + "," + to.lng}, r) : {pts:[from, to], steps:[], to:to.lat + "," + to.lng, straight:true};
  NAVX.idx = 1; NAVX.said = ""; NAVX.fetching = false; navPaint(true);
}
function navOffRoute(loc){
  const p = NAVX.route && NAVX.route.pts; if(!p || p.length < 2 || NAVX.route.straight) return 0;
  let best = 1e9; for(let i = 0; i < p.length; i += Math.max(1, Math.floor(p.length / 400))){ const d = distM(loc, p[i]); if(d < best) best = d; }
  return best;
}
function navProg(loc){
  const p = NAVX.route && NAVX.route.pts; if(!p || p.length < 2) return null;
  const k = Math.cos(loc.lat * Math.PI / 180); let best = {d:1e9, si:0, f:0};
  for(let i = 0; i < p.length - 1; i++){
    const ax = p[i].lng * k, ay = p[i].lat, bx = p[i+1].lng * k, by = p[i+1].lat, px = loc.lng * k, py = loc.lat;
    const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy; let f = L2 ? ((px - ax) * dx + (py - ay) * dy) / L2 : 0; f = Math.max(0, Math.min(1, f));
    const q = {lat:ay + f * dy, lng:(ax + f * dx) / k}, d = distM(loc, q); if(d < best.d) best = {d, si:i, f, q};
  }
  return best;
}
function navRemain(loc){
  const p = NAVX.route && NAVX.route.pts, g = navProg(loc); if(!g) return null;
  let sum = g.d + distM(g.q, p[g.si + 1]); for(let i = g.si + 1; i < p.length - 1; i++) sum += distM(p[i], p[i + 1]); return sum;
}
function openNav(id){
  const o = ((S.drv && S.drv.mine) || []).find(x => x.id === id); const n = o && navTarget(o);
  if(!n) return toast("Order ini tidak punya tujuan navigasi saat ini.");
  if(!hasLoc(n.loc)) return toast("Titik " + n.lbl + " belum punya lokasi peta. Pakai tombol Google Maps.");
  closeModal(); if(typeof startGeo === "function") startGeo();
  Object.assign(NAVX, {open:true, id, route:null, idx:1, fetchAt:0, follow:true, said:"", arrived:false, key:o.status});
  let el = document.getElementById("navx"); if(!el){ el = document.createElement("div"); el.id = "navx"; document.body.appendChild(el); }
  el.innerHTML = '<div class="nvtop"><div class="nvicon"></div><div class="nvtxt"><b>Mencari rute…</b><small></small></div></div><div class="nvmap"></div>'+
    '<button class="nvrecenter" data-act="nav-center" hidden>'+I("pin")+' Ikuti posisi saya</button>'+
    '<div class="nvbot"><div class="nvinfo"><b class="nvrem">–</b><small class="nvto"></small></div><button class="nvbtn" data-act="nav-voice" aria-label="Suara navigasi">'+(NAVX.voice ? "🔊" : "🔇")+'</button><a class="nvbtn" target="_blank" rel="noopener" data-act="nav-gm" aria-label="Google Maps">'+I("pin")+'</a><button class="nvbtn end" data-act="nav-close">Tutup</button></div>';
  document.documentElement.classList.add("navopen");
  loadLeaflet().then(() => {
    const node = el.querySelector(".nvmap"); NAVX.map = L.map(node, {zoomControl:false, attributionControl:true});
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {maxZoom:19, attribution:"© OpenStreetMap"}).addTo(NAVX.map);
    NAVX.mk = {}; NAVX.line = null;
    NAVX.map.on("dragstart", () => { NAVX.follow = false; const b = el.querySelector(".nvrecenter"); if(b) b.hidden = false; });
    const me = S.drv.loc || (o.driverLoc && hasLoc(o.driverLoc) ? o.driverLoc : null);
    NAVX.map.setView(me ? [me.lat, me.lng] : [n.loc.lat, n.loc.lng], 16);
    navTickFn(); NAVX.tick = setInterval(navTickFn, 1000);
  }).catch(() => { el.querySelector(".nvtxt b").textContent = "Peta tidak bisa dimuat. Periksa internet."; });
  keepAwake(true);
}
function closeNav(){
  NAVX.open = false; clearInterval(NAVX.tick); NAVX.tick = null; try{ speechSynthesis.cancel(); }catch(_){}
  if(NAVX.map){ NAVX.map.remove(); NAVX.map = null; }
  const el = document.getElementById("navx"); if(el) el.remove(); document.documentElement.classList.remove("navopen");
}
function navTickFn(){
  if(!NAVX.open) return;
  const o = navJob(); const n = o && navTarget(o);
  if(!o || !n){ closeNav(); toast("Order sudah selesai atau dialihkan."); return; }
  if(o.status !== NAVX.key){ NAVX.key = o.status; NAVX.route = null; NAVX.arrived = false; NAVX.said = ""; NAVX.fetchAt = 0; }
  const me = S.drv.loc;
  const tgt = n.loc;
  if(me && hasLoc(tgt) && (!NAVX.route || NAVX.route.to !== tgt.lat + "," + tgt.lng || (Date.now() - NAVX.fetchAt > 12000 && navOffRoute(me) > 50) || Date.now() - NAVX.fetchAt > 120000)) navFetch(me, tgt);
  navPaint(false);
}
function navPaint(fit){
  const el = document.getElementById("navx"); if(!el || !NAVX.map) return;
  const o = navJob(), n = o && navTarget(o); if(!n) return;
  const me = S.drv.loc, tgt = n.loc, R = NAVX.route;
  const put = (k, loc, icon, cls) => { if(!loc || !hasLoc(loc)) return; const ll = [loc.lat, loc.lng]; if(NAVX.mk[k]) NAVX.mk[k].setLatLng(ll); else NAVX.mk[k] = L.marker(ll, {icon:mkIcon(icon, cls), zIndexOffset:k === "me" ? 1000 : 0}).addTo(NAVX.map); };
  put("to", tgt, n.lbl === "toko" ? "store" : n.lbl === "tujuan" ? "star" : "pin", n.lbl === "toko" ? "mk-store" : "mk-buyer");
  put("me", me, "scooter", "mk-drv");
  if(R && (fit || !NAVX.line)){ if(NAVX.line) NAVX.map.removeLayer(NAVX.line); NAVX.line = L.polyline(R.pts.map(p => [p.lat, p.lng]), {color:"#2f6bff", weight:7, opacity:.85, dashArray:R.straight ? "8 10" : null}).addTo(NAVX.map); }
  if(me && NAVX.follow) NAVX.map.setView([me.lat, me.lng], Math.max(NAVX.map.getZoom(), 16), {animate:true});
  const top = el.querySelector(".nvtop"), ic = el.querySelector(".nvicon"), tb = el.querySelector(".nvtxt b"), ts = el.querySelector(".nvtxt small");
  el.querySelector(".nvto").textContent = n.t + (n.who ? " · " + n.who : "");
  const gm = el.querySelector('[data-act="nav-gm"]'); if(gm) gm.href = n.url || navLink(tgt, n.addr);
  if(!me){ tb.textContent = "Menunggu sinyal GPS…"; ts.textContent = "Pastikan lokasi HP menyala"; ic.innerHTML = navArrow(0); return; }
  const dT = distM(me, tgt), rem = R && !R.straight ? (navRemain(me) || dT) : dT;
  el.querySelector(".nvrem").textContent = fmtDist(rem) + " · " + etaTxt(rem);
  if(dT < 40){
    top.classList.add("arrived"); ic.innerHTML = E(n.lbl === "toko" ? "store" : "pin");
    tb.textContent = "Kamu sudah sampai di " + n.lbl; ts.textContent = n.lbl === "titik jemput" ? "Kabari penumpang lewat chat bila belum terlihat" : "Tutup navigasi untuk lanjut ke langkah berikutnya";
    if(!NAVX.arrived){ NAVX.arrived = true; navSay("Kamu sudah sampai di " + n.lbl); }
    return;
  }
  top.classList.remove("arrived");
  if(!R || R.straight || !R.steps.length){
    const brg = Math.atan2(tgt.lng - me.lng, tgt.lat - me.lat) * 180 / Math.PI;
    ic.innerHTML = navArrow(brg); tb.textContent = R ? "Menuju " + n.lbl + " · " + fmtDist(dT) : "Mencari rute…"; ts.textContent = R ? "Rute jalan tidak tersedia, ikuti arah panah" : ""; return;
  }
  const g = navProg(me), pos = g ? g.si + g.f : 0;
  let k = 1; while(k < R.steps.length - 1 && (R.steps[k].ri <= pos + 0.02 || distM(me, {lat:R.steps[k].maneuver.location[1], lng:R.steps[k].maneuver.location[0]}) < 15)) k++;
  if(k !== NAVX.idx){ NAVX.idx = k; NAVX.said = ""; }
  const st = R.steps[NAVX.idx] || R.steps[R.steps.length - 1], ml = {lat:st.maneuver.location[1], lng:st.maneuver.location[0]}, dM = distM(me, ml);
  const txt = navStepText(st, n.lbl), nx = R.steps[NAVX.idx + 1];
  ic.innerHTML = st.maneuver.type === "arrive" ? E("pin") : navArrow(/roundabout|rotary/.test(st.maneuver.type) ? 90 : (TURN_DEG[st.maneuver.modifier] || 0));
  tb.textContent = fmtDist(dM) + " · " + txt; const nt = nx && nx.maneuver.type !== "arrive" ? navStepText(nx, n.lbl) : ""; ts.textContent = nt ? "Lalu " + nt.charAt(0).toLowerCase() + nt.slice(1) : "";
  if(dM < 35) navSay(txt + " sekarang"); else if(dM < 220) navSay("Dalam " + (Math.round(dM / 50) * 50) + " m, " + txt.charAt(0).toLowerCase() + txt.slice(1));
}
document.addEventListener("click", e => {
  const el = e.target.closest("[data-act]"); if(!el) return; const a = el.dataset.act;
  if(a === "nav-in"){ e.preventDefault(); openNav(el.dataset.id); }
  else if(a === "nav-close") closeNav();
  else if(a === "nav-center"){ NAVX.follow = true; el.hidden = true; navPaint(false); }
  else if(a === "nav-voice"){ NAVX.voice = !NAVX.voice; try{ localStorage.setItem("jt_nav_voice", NAVX.voice ? "1" : "0"); }catch(_){} el.textContent = NAVX.voice ? "🔊" : "🔇"; toast(NAVX.voice ? "Suara navigasi menyala" : "Suara navigasi dimatikan"); if(!NAVX.voice) try{ speechSynthesis.cancel(); }catch(_){} }
});

/* ============ Rute & jarak lewat jalan: Google Routes (mode motor) bila ada kunci, cadangan OpenStreetMap ============ */
const ROAD = {}, ROAD_P = {};
const roadKey = (a, b) => [a.lat, a.lng, b.lat, b.lng].map(v => (+v).toFixed(5)).join(",");
function roadDist(a, b){ const r = ROAD[roadKey(a, b)]; return r && r.dist ? r.dist : null; }
function ensureRoad(a, b){ return roadRoute(a, b, false).then(r => r ? r.dist : null); }
function decodePoly(str){
  const out = []; let i = 0, lat = 0, lng = 0;
  while(i < str.length){
    let b, sh = 0, res = 0; do{ b = str.charCodeAt(i++) - 63; res |= (b & 31) << sh; sh += 5; }while(b >= 32); lat += (res & 1) ? ~(res >> 1) : res >> 1;
    sh = 0; res = 0; do{ b = str.charCodeAt(i++) - 63; res |= (b & 31) << sh; sh += 5; }while(b >= 32); lng += (res & 1) ? ~(res >> 1) : res >> 1;
    out.push({lat:lat / 1e5, lng:lng / 1e5});
  }
  return out;
}
const G_MAN = {TURN_LEFT:["turn","left"], TURN_RIGHT:["turn","right"], TURN_SLIGHT_LEFT:["turn","slight left"], TURN_SLIGHT_RIGHT:["turn","slight right"], TURN_SHARP_LEFT:["turn","sharp left"], TURN_SHARP_RIGHT:["turn","sharp right"],
  UTURN_LEFT:["turn","uturn"], UTURN_RIGHT:["turn","uturn"], STRAIGHT:["continue","straight"], NAME_CHANGE:["new name","straight"], MERGE:["merge","straight"], FORK_LEFT:["fork","slight left"], FORK_RIGHT:["fork","slight right"],
  RAMP_LEFT:["turn","slight left"], RAMP_RIGHT:["turn","slight right"], ROUNDABOUT_LEFT:["roundabout","left"], ROUNDABOUT_RIGHT:["roundabout","right"], DEPART:["depart","straight"], FERRY:["continue","straight"]};
async function gRoute(a, b){
  const ctl = new AbortController(), tm = setTimeout(() => ctl.abort(), 9000);
  const r = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {method:"POST", signal:ctl.signal,
    headers:{"Content-Type":"application/json", "X-Goog-Api-Key":GKEY, "X-Goog-FieldMask":"routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline,routes.legs.steps.distanceMeters,routes.legs.steps.startLocation,routes.legs.steps.navigationInstruction"},
    body:JSON.stringify({origin:{location:{latLng:{latitude:a.lat, longitude:a.lng}}}, destination:{location:{latLng:{latitude:b.lat, longitude:b.lng}}}, travelMode:"TWO_WHEELER", languageCode:"id", regionCode:"ID", units:"METRIC"})});
  clearTimeout(tm);
  const j = await r.json(); const rt = j && j.routes && j.routes[0];
  if(!r.ok || !rt || !rt.distanceMeters) throw new Error((j && j.error && j.error.message) || "Google route gagal");
  const pts = rt.polyline && rt.polyline.encodedPolyline ? decodePoly(rt.polyline.encodedPolyline) : [a, b];
  const steps = [];
  ((rt.legs || [])[0] || {}).steps && rt.legs.forEach(l => (l.steps || []).forEach(st => {
    const ni = st.navigationInstruction || {}, m = G_MAN[ni.maneuver] || ["continue","straight"], ll = st.startLocation && st.startLocation.latLng;
    if(ll) steps.push({maneuver:{type:steps.length ? m[0] : "depart", modifier:m[1], location:[ll.longitude, ll.latitude]}, text:steps.length ? (ni.instructions || "").split("\n")[0] : "", name:""});
  }));
  steps.push({maneuver:{type:"arrive", location:[b.lng, b.lat]}, name:""});
  return {dist:rt.distanceMeters, pts, steps, src:"google"};
}
async function oRoute(a, b){
  const ctl = new AbortController(), tm = setTimeout(() => ctl.abort(), 9000);
  const r = await fetch("https://router.project-osrm.org/route/v1/driving/" + a.lng + "," + a.lat + ";" + b.lng + "," + b.lat + "?overview=full&geometries=geojson&steps=true", {signal:ctl.signal}); clearTimeout(tm);
  const j = await r.json(); const rt = j && j.routes && j.routes[0]; if(!rt) throw new Error("no route");
  const steps = []; (rt.legs || []).forEach(l => (l.steps || []).forEach(st => steps.push(st)));
  return {dist:rt.distance, pts:rt.geometry.coordinates.map(c => ({lat:c[1], lng:c[0]})), steps, src:"osm"};
}
function roadRoute(a, b, fresh){
  if(!locOk(a) || !locOk(b)) return Promise.resolve(null);
  const k = roadKey(a, b);
  if(!fresh && ROAD[k] && !(ROAD[k].fail && Date.now() - ROAD[k].fail > 60000)) return Promise.resolve(ROAD[k].fail ? null : ROAD[k]);
  if(!fresh && ROAD_P[k]) return ROAD_P[k];
  const p = (async () => {
    let r = null;
    if(GKEY) try{ r = await gRoute(a, b); }catch(e){ r = null; }
    if(!r) try{ r = await oRoute(a, b); }catch(e){ r = null; }
    if(r){
      r.pts.length > 1 && r.steps.forEach(st => { const ml = {lat:st.maneuver.location[1], lng:st.maneuver.location[0]}; let bi = 0, bd = 1e9; r.pts.forEach((q, i) => { const d = distM(ml, q); if(d < bd){ bd = d; bi = i; } }); st.ri = bi; });
      const straight = distM(a, b); if(r.dist < straight || r.dist > straight * 3 + 1000) r.dist = null;
      ROAD[k] = r; if(!fresh && !typing()) scheduleRender();
    } else ROAD[k] = {fail:Date.now(), dist:null};
    delete ROAD_P[k]; return r;
  })();
  if(!fresh) ROAD_P[k] = p;
  return p;
}

document.addEventListener("click", e => {
  const el = e.target.closest("[data-act]"); if(!el) return;
  if(el.dataset.act === "own-chart"){ S.own.chart = el.dataset.v; render(); }
  else if(el.dataset.act === "own-feed-all"){ S.own.feedAll = !S.own.feedAll; render(); }
});

/* ============ Prestasi driver: bintang dari tamu, level, peringkat ============ */
S.drvStats = null; let DSTAT_AT = 0, DSTAT_BUSY = false;
async function loadDrvStats(force){
  if(DSTAT_BUSY || (!force && Date.now() - DSTAT_AT < 60000)) return;
  DSTAT_BUSY = true; DSTAT_AT = Date.now();
  try{
    if(SB) S.drvStats = await sbStore.rpc("jt_driver_stats", {});
    else { const mine = (S.drv && S.drv.mine) || [], m0 = rangeStart("bulan"); const done = mine.filter(o => o.status === "selesai");
      S.drvStats = {avg:null, n:0, dist:{}, streak5:0, reviews:[], trips:done.length, monthTrips:done.filter(o => (o.doneAt || o.updatedAt || 0) >= m0).length, rank:null, drivers:1}; }
  }catch(e){}
  DSTAT_BUSY = false; if(S.role === "driver" && !typing()) scheduleRender();
}
const DRV_LEVELS = [[0,"Pemula","🌱"],[10,"Perunggu","🥉"],[50,"Perak","🥈"],[150,"Emas","🥇"],[500,"Berlian","💎"]];
function drvAchieve(){
  const me = S.drv && S.drv.me; if(!me || !me.id) return "";
  loadDrvStats(false);
  const st = S.drvStats; if(!st) return '<div class="card dach"><div class="muted small">Memuat prestasimu…</div></div>';
  const trips = st.trips || 0; let li = 0; DRV_LEVELS.forEach((l, i) => { if(trips >= l[0]) li = i; });
  const L = DRV_LEVELS[li], NX = DRV_LEVELS[li + 1];
  const pct = NX ? Math.round((trips - L[0]) / (NX[0] - L[0]) * 100) : 100;
  const avg = st.avg != null ? Number(st.avg) : null, n = st.n || 0;
  const msg = !n ? "Belum ada penilaian. Layani tamu dengan ramah & tepat waktu, mereka bisa memberimu bintang setelah order selesai."
    : avg >= 4.8 ? "Luar biasa! Tamu sangat puas dengan layananmu. Pertahankan!"
    : avg >= 4.3 ? "Bagus! Sedikit lagi menuju bintang sempurna."
    : avg >= 3.5 ? "Cukup baik. Sapa tamu, kabari lewat chat, dan antar tepat waktu supaya bintangmu naik."
    : "Yuk tingkatkan layanan: datang tepat waktu, ramah, dan jaga barang tamu.";
  const dist = st.dist || {}, dmax = Math.max(1, ...[5,4,3,2,1].map(k => +dist[k] || 0));
  let h = '<div class="card dach"><div class="dach-h"><h3>Prestasimu</h3><span class="dlvl">'+L[2]+' '+L[1]+'</span></div>'+
    '<div class="dach-top"><div class="dach-score"><b>'+(avg != null ? String(avg).replace(".", ",") : "–")+'</b>'+starBar(avg || 0)+'<small>'+(n ? n + " penilaian tamu" : "belum dinilai")+'</small></div>'+
    '<div class="dach-dist">'+[5,4,3,2,1].map(k => '<div><span>'+k+'★</span><i><em style="width:'+Math.round((+dist[k] || 0) / dmax * 100)+'%"></em></i><small>'+(+dist[k] || 0)+'</small></div>').join("")+'</div></div>'+
    '<p class="dach-msg">'+esc(msg)+'</p>'+
    '<div class="dach-chips">'+
      (st.streak5 >= 2 ? '<span>🔥 '+st.streak5+'× bintang 5 berturut-turut</span>' : '')+
      (st.rank ? '<span>🏆 Peringkat #'+st.rank+' bulan ini</span>' : '')+
      '<span>🛵 '+trips+' trip selesai</span><span>📅 '+(st.monthTrips || 0)+' trip bulan ini</span></div>'+
    '<div class="dach-lv"><div><small>'+(NX ? (NX[0] - trips)+' trip lagi menuju '+NX[2]+' '+NX[1] : 'Level tertinggi tercapai! 💎')+'</small></div><i><em style="width:'+pct+'%"></em></i></div>';
  if((st.reviews || []).length) h += '<div class="dach-rev"><small>Kata tamu</small>'+st.reviews.slice(0, 3).map(r => '<div>'+starBar(r.s)+'<p>“'+esc(r.c)+'”</p><time>'+ago(r.at)+'</time></div>').join("")+'</div>';
  return h + '</div>';
}

/* ============ Ajak tamu memberi bintang otomatis setelah pesanan / perjalanan selesai ============ */
let RATE_ASKED = {}; try{ RATE_ASKED = JSON.parse(localStorage.getItem("jt_rate_asked") || "{}") || {}; }catch(_){}
const RATE_TAGS = {good:["Ramah","Cepat sampai","Tepat waktu","Hati-hati di jalan","Barang aman","Motor bersih"], bad:["Terlambat","Kurang ramah","Sulit dihubungi","Ngebut","Barang rusak","Salah alamat"]};
const RATE_TAGS_STORE = {good:["Barang sesuai","Cepat disiapkan","Kemasan rapi","Harga pas"], bad:["Barang kurang","Lama disiapkan","Kemasan rusak","Tidak sesuai"]};
let RATE_Q = null;
function rateCandidates(){
  if(S.role === "driver" || S.role === "seller" || S.role === "owner" || S.view === "login" || S.view === "masuk") return [];
  const now = Date.now(), out = [];
  (S.orders || []).forEach(o => { if(o.buyerId === ME && o.status === "selesai" && o.driverId && now - (o.doneAt || o.updatedAt || 0) < 48 * 3600e3) out.push(["order", o]); });
  (S.rides || []).forEach(o => { if(o.riderId === ME && o.status === "selesai" && o.driverId && now - (o.doneAt || o.updatedAt || 0) < 48 * 3600e3) out.push(["ride", o]); });
  return out.filter(([k, o]) => !RATE_ASKED[o.id] && !(S.myRatings || {})[o.id + ":driver"]);
}
function rateAskCheck(){
  if(RATE_Q || document.hidden || NAVX.open) return;
  const M = document.getElementById("modal"); if(M && M.innerHTML.trim()) return;
  const c = rateCandidates()[0]; if(!c) return;
  const [kind, o] = c; RATE_ASKED[o.id] = Date.now(); try{ localStorage.setItem("jt_rate_asked", JSON.stringify(RATE_ASKED)); }catch(_){}
  const targets = [["driver", o.driver && o.driver.name ? o.driver.name : "Driver", "driver"]];
  if(kind === "order") targets.push(["store", o.storeName || "Toko", "toko"]);
  RATE_Q = {kind, id:o.id, code:o.code, targets, i:0, stars:0, tags:[]};
  rateSheet();
}
function rateSheet(){
  const q = RATE_Q; if(!q) return; const t = q.targets[q.i];
  const tg = t[0] === "store" ? RATE_TAGS_STORE : RATE_TAGS, list = q.stars ? (q.stars >= 4 ? tg.good : tg.bad) : [];
  const lbl = ["", "Sangat kurang", "Kurang", "Cukup", "Bagus", "Luar biasa!"][q.stars] || "Ketuk bintang";
  document.getElementById("modal").innerHTML = '<div class="modal-bg" data-act="rate-later"><div class="modal ratesheet" onclick="event.stopPropagation()">'+
    (q.i === 0 ? '<div class="rsh-top">'+E("party")+'<div><b>'+(q.kind === "ride" ? "Perjalanan selesai!" : "Pesanan selesai!")+'</b><small>'+esc(q.code || "")+'</small></div></div>' : '')+
    '<h2 class="sec" style="margin:10px 0 2px">Bagaimana '+(t[0] === "store" ? "toko " : "driver ")+esc(t[1])+'?</h2><p class="muted small" style="margin:0">Bintangmu menyemangati '+t[2]+' dan membantu tamu lain memilih.</p>'+
    '<div class="rsh-stars">'+[1,2,3,4,5].map(n => '<button class="'+(n <= q.stars ? "on" : "")+'" data-act="rsh-star" data-v="'+n+'" aria-label="'+n+' bintang">★</button>').join("")+'</div><div class="rsh-lbl">'+lbl+'</div>'+
    (list.length ? '<div class="rsh-tags">'+list.map(x => '<button class="'+(q.tags.includes(x) ? "on" : "")+'" data-act="rsh-tag" data-v="'+esc(x)+'">'+esc(x)+'</button>').join("")+'</div>'+
      '<textarea class="in" id="rshNote" rows="2" maxlength="200" placeholder="Tulis pesan untuk '+t[2]+' (opsional)">'+esc(q.note || "")+'</textarea>' : '')+
    '<div class="actions" style="margin-top:14px"><button class="btn grow" data-act="rsh-send"'+(q.stars ? '' : ' disabled')+'>'+(q.i < q.targets.length - 1 ? "Kirim & lanjut" : "Kirim penilaian")+'</button><button class="btn ghost" data-act="rate-later">Nanti saja</button></div></div></div>';
}
document.addEventListener("click", async e => {
  const el = e.target.closest("[data-act]"); if(!el || !RATE_Q) return; const a = el.dataset.act, q = RATE_Q;
  const keepNote = () => { const n = document.getElementById("rshNote"); if(n) q.note = n.value; };
  if(a === "rsh-star"){ keepNote(); const prevGood = q.stars >= 4; q.stars = +el.dataset.v; if((q.stars >= 4) !== prevGood) q.tags = []; rateSheet(); }
  else if(a === "rsh-tag"){ keepNote(); const v = el.dataset.v; q.tags = q.tags.includes(v) ? q.tags.filter(x => x !== v) : q.tags.concat(v); rateSheet(); }
  else if(a === "rate-later"){ if(e.target.closest(".ratesheet") && el.classList.contains("modal-bg")) return; RATE_Q = null; closeModal(); }
  else if(a === "rsh-send"){
    keepNote(); const t = q.targets[q.i], comment = [q.tags.join(", "), (q.note || "").trim()].filter(Boolean).join(". ").slice(0, 300);
    el.disabled = true;
    try{ await RATE.rate(q.kind, q.id, t[0], q.stars, comment); S.myRatings[q.id + ":" + t[0]] = q.stars; }
    catch(err){ toast(String((err && err.message) || "Gagal menyimpan").replace(/^.*?:\s*/, "")); el.disabled = false; return; }
    if(q.i < q.targets.length - 1){ q.i++; q.stars = 0; q.tags = []; q.note = ""; rateSheet(); }
    else { RATE_Q = null; closeModal(); toast("Terima kasih! Penilaianmu sudah terkirim ⭐"); loadRatings(); scheduleRender(); }
  }
}, true);
setInterval(rateAskCheck, 3000);
