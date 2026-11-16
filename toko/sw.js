// JAGA — service worker sederhana: aplikasi cepat dibuka & tetap tampil saat sinyal lemah.
const CACHE = "jt-v41";
const SHELL = ["./", "./index.html", "./app.css?v=41", "./app.js?v=41", "./config.js", "./manifest.webmanifest", "./icons/icon-192.png"]; // angka ?v= harus sama dengan CACHE
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).catch(() => {}).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request; const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return; // database & CDN tidak disentuh
  if (/\/(emoji|icons)\//.test(url.pathname)) {
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put(req, cp)); return res; })));
    return;
  }
  e.respondWith(fetch(req, {cache: "no-cache"}).then(res => { if (res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(req, cp)); } return res; }).catch(() => caches.match(req).then(r => r || caches.match("./index.html"))));
});
// Notifikasi push: tetap muncul walau aplikasi ditutup.
self.addEventListener("push", e => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch (_) { d = {title: "JAGA", body: e.data ? e.data.text() : ""}; }
  e.waitUntil(self.clients.matchAll({type: "window", includeUncontrolled: true}).then(list => {
    const vis = list.filter(c => c.visibilityState === "visible");
    // aplikasi sedang dibuka: tampilkan notifikasi melayang + nada keras di dalam aplikasi
    if (vis.length) { vis.forEach(c => c.postMessage({type: "jt-push", title: d.title || "JAGA", body: d.body || "", url: d.url || ""})); return; }
    return self.registration.showNotification(d.title || "JAGA", {
      body: d.body || "", icon: "./icons/icon-192.png", badge: "./icons/icon-192.png", tag: d.tag || undefined, renotify: !!d.tag,
      silent: false, vibrate: [400, 150, 400, 150, 600, 150, 600], requireInteraction: true, data: {url: d.url || "./"}
    });
  }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  const target = new URL((e.notification.data && e.notification.data.url) || "./", self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({type: "window", includeUncontrolled: true}).then(list => {
    for (const c of list) { if (c.url.split("#")[0] === target.split("#")[0] && "focus" in c) { c.navigate(target).catch(() => {}); return c.focus(); } }
    return self.clients.openWindow(target);
  }));
});
