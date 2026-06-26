const CACHE_NAME = 'pulse-v2-20260607';
const PRECACHE = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/manifest.json',
  '/icon-192.svg',
  '/icon-512.svg'
];

// Install — cache core shell
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate — clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — network-first with cache fallback.
// SKIP Netlify Functions entirely — they're dynamic data endpoints (leaderboard,
// trending, library list, etc.) and must always hit network for fresh results.
// Caching them was leaving stale "Loading…" states on the homepage.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (!e.request.url.startsWith(self.location.origin)) return;
  if (e.request.url.includes('/.netlify/functions/')) return; // never SW-cache function calls

  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
