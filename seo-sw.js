// seo-sw.js — minimal service worker for the installable "Pulse SEO" PWA (/seo).
// Network-first with cache fallback so the dashboard works offline + is installable.
const CACHE = 'pulse-seo-v1';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['/seo'])).then(() => self.skipWaiting()).catch(() => self.skipWaiting()));
});
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => {
      // cache the /seo shell for offline open
      if (e.request.url.includes('/seo')) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); }
      return r;
    }).catch(() => caches.match(e.request))
  );
});
