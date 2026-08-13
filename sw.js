/* ==========================================================================
   sw.js — offline cache for Stacks.
   The whole app is static, so everything is pre-cached on install and served
   cache-first. Bump CACHE when you change any file, or the old copy sticks.
   ========================================================================== */
const CACHE = 'stacks-v3';

const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './app/css/app.css',
  './app/css/reels.css',
  './app/js/library.js',
  './app/js/icons.js',
  './app/js/store.js',
  './app/js/srs.js',
  './app/js/ui.js',
  './app/js/reels.js',
  './app/js/views.js',
  './app/js/app.js',
  './app/data/references.js',
  './app/data/medicine.js',
  './app/data/anatomy.js',
  './app/data/physiology.js',
  './app/data/kinesiology.js',
  './app/data/nutrition.js',
  './app/data/recovery.js',
  './app/data/mind.js',
  './app/data/behavior.js',
  './app/data/influence.js',
  './app/data/wisdom.js',
  './app/data/world.js',
  './app/data/medicine2.js',
  './app/data/bodywork2.js',
  './app/data/health2.js',
  './app/data/psyche2.js',
  './app/data/world2.js',
  './app/icons/icon-192.png',
  './app/icons/icon-512.png',
  './app/icons/icon-maskable-512.png',
  './app/icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // cache individually so one bad URL cannot fail the whole install
    await Promise.all(ASSETS.map(url =>
      cache.add(new Request(url, { cache: 'reload' })).catch(err =>
        console.warn('[sw] could not cache', url, err))
    ));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Google Fonts: use the network when available, fall back to whatever is cached.
  if (url.hostname.endsWith('gstatic.com') || url.hostname.endsWith('googleapis.com')) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const fresh = await fetch(req);
        cache.put(req, fresh.clone());
        return fresh;
      } catch (e) {
        const hit = await cache.match(req);
        return hit || new Response('', { status: 504 });
      }
    })());
    return;
  }

  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    try {
      const fresh = await fetch(req);
      if (fresh.ok) cache.put(req, fresh.clone());
      return fresh;
    } catch (e) {
      // offline and unseen: navigations still get the app shell
      if (req.mode === 'navigate') {
        const shell = await cache.match('./index.html');
        if (shell) return shell;
      }
      return new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
    }
  })());
});
