// Alamat lama /toko/: hapus service worker lama supaya aplikasi terbuka di /apps/.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.map(k => caches.delete(k))))
    .then(() => self.registration.unregister())
    .then(() => self.clients.matchAll({type: "window"}))
    .then(list => list.forEach(c => c.navigate(c.url.replace("/toko/", "/apps/"))))
));
