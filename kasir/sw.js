// Jaga Kasir: simpan aplikasi di perangkat supaya kasir tetap jalan tanpa internet.
const VERSION = 'jaga-kasir-v28';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png', 'vendor/zxing.min.js'];
self.addEventListener('install', e => e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) {
    // font dari Google: pakai simpanan bila ada, perbarui di belakang
    if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
      e.respondWith(caches.open(VERSION).then(c => c.match(req).then(hit => {
        const net = fetch(req).then(r => { c.put(req, r.clone()); return r; }).catch(() => hit);
        return hit || net;
      })));
    }
    return;
  }
  // halaman: jaringan dulu supaya pembaruan cepat sampai, simpanan bila offline
  // hanya halaman aplikasi yang disimpan sebagai index.html; halaman lain (tentang, privasi, pemilik) tidak menimpanya
  const appPath = new URL('./', self.registration.scope).pathname;
  const isApp = url.pathname === appPath || url.pathname === appPath + 'index.html';
  if (req.mode === 'navigate' && !isApp) { e.respondWith(fetch(req).catch(() => caches.match(req).then(h => h || caches.match('index.html')))); return; }
  if (isApp) {
    e.respondWith(fetch(req).then(r => { caches.open(VERSION).then(c => c.put('index.html', r.clone())); return r; })
      .catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok) caches.open(VERSION).then(c => c.put(req, r.clone()));
    return r;
  })));
});
