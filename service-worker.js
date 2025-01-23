const CACHE_NAME = 'drivejav-cache-v1';
const urlsToCache = [
	'/',
	'/js/index.js',
	'/css/index.css',
	'/manifest.json',
	'/icon/android-chrome-192x192.png',
	'/icon/android-chrome-512x512.png'
];
const MAX_CACHE_SIZE = 100 * 1024 * 1024; // 100 MB in bytes

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
					// Check cache size and clean up if necessary
					checkCacheSizeAndCleanUp();
					return networkResponse;
				});
			});
		}).catch(() => {
			console.error('[Service Worker] Fetch failed; returning offline page');
			return caches.match('/index.html');
		})
	);
});

// Function to check cache size and remove old items if it exceeds MAX_CACHE_SIZE
function checkCacheSizeAndCleanUp() {
	caches.open(CACHE_NAME).then((cache) => {
		cache.keys().then((keys) => {
			let totalSize = 0;
			const itemsToDelete = [];

			Promise.all(
				keys.map((request) => {
					return cache.match(request).then((response) => {
						if (response) {
							return response.blob().then((blob) => {
								totalSize += blob.size;
								if (totalSize > MAX_CACHE_SIZE) {
									itemsToDelete.push(request);
								}
							});
						}
					});
				})
			).then(() => {
				// Delete excess items
				itemsToDelete.forEach((request) => {
					cache.delete(request);
				});
			});
		});
	});
}
