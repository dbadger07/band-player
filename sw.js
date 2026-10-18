// Network first so updates show up right away; the cache is only the offline fallback.
const CACHE = 'band-player';
const FILES = ['./', 'index.html', 'manifest.json', 'icon.svg', 'icon-512.png',
  'vendor/alphaTab.min.js', 'vendor/soundfont/sonivox.sf3', 'vendor/font/Bravura.woff2', 'vendor/font/Bravura.woff'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return r;
  }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
