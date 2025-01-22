const CACHE_NAME = 'drivejav-cache-v1';
const urlsToCache = [
  '/', 
  '/index.html', 
  '/style.css', 
  '/script.js', 
  '/manifest.json', 
  '/icon/android-chrome-192x192.png', 
  '/icon/android-chrome-512x512.png' 
];


self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app shell');
      return cache.addAll(urlsToCache);
    })
  );
});


self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});


self.addEventListener('fetch', (event) => {
  console.log('[Service Worker] Fetching:', event.request.url);
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log('[Service Worker] Returning cached response:', event.request.url);
        return cachedResponse;
      }
      console.log('[Service Worker] Fetching from network:', event.request.url);
      return fetch(event.request).then((networkResponse) => {

        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    }).catch(() => {
      console.error('[Service Worker] Fetch failed; returning offline page');
      return caches.match('/index.html'); 
    })
  );
});
