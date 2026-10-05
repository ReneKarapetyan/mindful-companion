// Offline աջակցություն. stale-while-revalidate։ Ֆայլեր փոխելիս ավելացրու CACHE-ի տարբերակը։
const CACHE = 'mc-v8';
const SHELL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './data/quotes.js',
  './data/content.js',
  './data/mood-quotes.js',
  './data/journal.js',
  './data/emotions.js',
  './data/reflect.js',
  './data/work.js',
  './icon.svg',
  './manifest.webmanifest'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((hit) => {
      const net = fetch(e.request)
        .then((res) => {
          if (res.ok || res.type === 'opaque') {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
          }
          return res;
        })
        .catch(() => hit);
      return hit || net;
    })
  );
});
