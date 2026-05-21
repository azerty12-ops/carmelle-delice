const CACHE_NAME = 'carmel-delice-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/logo192.png',
  '/logo512.png'
];

self.addEventListener('install', event => {
  // Force l'installation immédiate du nouveau service worker
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  // Supprime les anciens caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    // Stratégie Network-First pour toujours avoir la dernière version
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
