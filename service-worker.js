const CACHE_NAME = 'drivejav-cache-v1';
const urlsToCache = [
    '/',
    '/js/index.js',
    '/css/index.css',
    '/manifest.json',
    '/icon/android-chrome-192x192.png',
    '/icon/android-chrome-512x512.png'
];
//const CACHE_LIFETIME = 6 * 60 * 60 * 1000; // 6 hours
const CACHE_LIFETIME = 1 * 60 * 1000; // 1 minutes

// Install event: Caching resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache.map((url) => {
                return new Request(url, { credentials: 'same-origin' });
            }));
        })
    );
});

// Activate event: Clean up old caches
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

// Fetch event: Serve cached resources and enforce expiration
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.open(CACHE_NAME).then(async (cache) => {
            const cachedResponse = await cache.match(event.request);

            if (cachedResponse) {
                const metadata = await getCacheMetadata(event.request, cache);
                const isExpired = metadata && Date.now() > metadata.expireAt;

                if (!isExpired) {
                    return cachedResponse; // Return valid cached response
                }

                // If expired, delete the cached response
                await cache.delete(event.request);
            }

            // Fetch from network and cache the response with expiration metadata
            return fetch(event.request).then((networkResponse) => {
                cache.put(event.request, networkResponse.clone());
                setCacheMetadata(event.request, cache, CACHE_LIFETIME);
                return networkResponse;
            });
        })
    );
});

// Function to store expiration metadata in a dedicated cache
function setCacheMetadata(request, cache, lifetime) {
    const metadata = {
        expireAt: Date.now() + lifetime, // Current time + lifetime
    };
    const metadataKey = getMetadataKey(request);
    return cache.put(
        metadataKey,
        new Response(JSON.stringify(metadata), { headers: { 'Content-Type': 'application/json' } })
    );
}

// Function to retrieve expiration metadata from the cache
function getCacheMetadata(request, cache) {
    const metadataKey = getMetadataKey(request);
    return cache.match(metadataKey).then((response) => {
        if (!response) return null;
        return response.json(); // Parse the JSON metadata
    });
}

// Helper to create a unique key for metadata
function getMetadataKey(request) {
    return new Request(`${request.url}-metadata`, { credentials: 'same-origin' });
}
