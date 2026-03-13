// Service Worker for Biologisch Vleesch Atelier PWA
// Strategy: Network First (always try fresh), fallback to Cache (offline support)
// API calls: Network Only (never cached)

const CACHE_NAME = 'Romano-loyalty-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing v2 (Network First)...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating v2...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Helper function to check if URL is an API call
function isApiCall(url) {
  return url.includes('/api/') || 
         url.includes('/health') || 
         url.includes('/barcode') || 
         url.includes('/google-wallet');
}

// Fetch event - Network First with Cache Fallback
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  const requestUrl = event.request.url;

  // API CALLS: Network Only (never use cache)
  if (isApiCall(requestUrl)) {
    console.log('[Service Worker] API call - Network only:', requestUrl);
    event.respondWith(
      fetch(event.request)
        .catch((error) => {
          console.log('[Service Worker] API call failed (offline):', error);
          return new Response(
            JSON.stringify({ 
              error: 'No internet connection. API data requires network access.' 
            }),
            {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({ 'Content-Type': 'application/json' })
            }
          );
        })
    );
    return;
  }

  // STATIC ASSETS: Network First, fallback to Cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Network success - cache the response and return it
        console.log('[Service Worker] Network success (fresh):', requestUrl);
        
        // Clone the response before caching
        const responseToCache = response.clone();
        
        // Update cache with fresh content
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        
        return response;
      })
      .catch((error) => {
        // Network failed - try cache
        console.log('[Service Worker] Network failed, trying cache:', requestUrl);
        
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              console.log('[Service Worker] Serving from cache (offline):', requestUrl);
              return cachedResponse;
            }
            
            // No cache available either
            console.log('[Service Worker] No cache available for:', requestUrl);
            return caches.match('/offline.html').then((offlinePage) => {
              return offlinePage || new Response(
                'Offline - No cached version available',
                { status: 503, statusText: 'Service Unavailable' }
              );
            });
          });
      })
  );
});

// Background sync for offline barcode scans
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  if (event.tag === 'sync-barcode-usage') {
    event.waitUntil(syncBarcodeUsage());
  }
});

async function syncBarcodeUsage() {
  // Sync barcode usage data when back online
  console.log('[Service Worker] Syncing barcode usage...');
  // Implementation depends on your backend API
}

// Push notifications (optional - for future use)
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification received');
  const options = {
    body: event.data ? event.data.text() : 'Nieuwe aanbieding beschikbaar!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Bekijk nu',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Sluiten',
        icon: '/icons/close.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Biologisch Vleesch Atelier', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click:', event.action);
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('https://biologischvleeschatelier.profile.elysia.marketing')
    );
  }
});
