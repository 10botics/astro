const CACHE_NAME = '10botics-v1';
const urlsToCache = [
  '/',
  '/images/logo_website_700x200-300x86.png',
  '/images/hero-image.jpg',
  '/favicon.svg',
  '/favicon-100x100.jpg',
  '/favicon-300x300.jpg'
];

// Install event - cache critical resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when possible
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Cache API responses for better performance
self.addEventListener('fetch', event => {
  if (event.request.url.includes('/api/') || event.request.url.includes('/news/')) {
    event.respondWith(
      caches.open(CACHE_NAME)
        .then(cache => {
          return fetch(event.request)
            .then(response => {
              // Cache the response
              cache.put(event.request, response.clone());
              return response;
            })
            .catch(() => {
              // Return cached version if network fails
              return cache.match(event.request);
            });
        })
    );
  }
});

// Background sync for offline functionality
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Handle background sync tasks
  console.log('Background sync triggered');
} 