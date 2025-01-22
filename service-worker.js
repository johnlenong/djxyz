const CACHE_NAME = 'drivejav-cache-v1';
const urlsToCache = [
	'/',
	'/js/index.js',
	'/css/index.css',
	'/manifest.json',
	'/icon/android-chrome-192x192.png',
	'/icon/android-chrome-512x512.png'
];


self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll(urlsToCache);
		})
	);
});


self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cache) => {
					if (cache !== CACHE_NAME) {
						return caches.delete(cache);
					}
				})
			);
		})
	);
});


self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.match(event.request).then((cachedResponse) => {
			if (cachedResponse) {
				return cachedResponse;
			}
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
