// Jaga Kosan: simpan aplikasi di perangkat supaya kasir tetap jalan tanpa internet.
const VERSION = 'jaga-kosan-v4';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png'];
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
  if (req.mode === 'navigate' || url.pathname.endsWith('index.html')) {
    e.respondWith(fetch(req).then(r => { caches.open(VERSION).then(c => c.put('index.html', r.clone())); return r; })
      .catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok) caches.open(VERSION).then(c => c.put(req, r.clone()));
    return r;
  })));
});
