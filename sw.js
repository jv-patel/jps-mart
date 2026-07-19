// JPs Mart Service Worker v3.0
const CACHE_VERSION = 3;
const CACHE_NAME = `jpsmart-v${CACHE_VERSION}`;
const STATIC_CACHE = `jpsmart-static-v${CACHE_VERSION}`;
const DYNAMIC_CACHE = `jpsmart-dynamic-v${CACHE_VERSION}`;

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/app.html',
  '/style.css',
  '/js/script.js',
  '/js/products.js',
  '/js/cart.js',
  '/js/auth.js',
  '/js/admin.js',
  '/js/gamification.js',
  '/js/reviews.js',
  '/js/wishlist.js',
  '/manifest.json',
  '/images/placeholder.png',
  'https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;800&family=Poppins:wght@300;400;600;700;800&display=swap',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install — cache static assets
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('Some assets failed to cache:', err);
      });
    })
  );
});

// Activate — clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch — stale-while-revalidate for static, network-first for API
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and Firebase/API calls
  if (request.method !== 'GET') return;
  if (!request.url.startsWith('http')) return;
  if (url.hostname.includes('firestore.googleapis.com')) return;
  if (url.hostname.includes('firebase')) return;
  if (url.hostname.includes('googleapis.com')) return;

  // Unsplash images — cache-first
  if (url.hostname.includes('unsplash.com') || url.hostname.includes('images.unsplash')) {
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then(cache =>
        cache.match(request).then(cached => {
          if (cached) return cached;
          return fetch(request).then(response => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          }).catch(() => {
            return cached || caches.match('/images/placeholder.png').then(res => res || new Response('', { status: 408, statusText: 'Network Timeout' }));
          });
        })
      )
    );
    return;
  }

  // Navigation requests — serve app.html from cache (SPA) or fallback to offline HTML Response
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('/app.html').then(cached => {
        return cached || fetch(request).catch(() => {
          return new Response(
            `<!DOCTYPE html><html><head><title>Offline - JPs Mart</title></head>
            <body style="font-family:sans-serif;text-align:center;padding:50px;background:#0a1f16;color:white;">
            <h1>🛒 JPs Mart</h1>
            <p>You are offline. Please check your connection.</p>
            <button onclick="location.reload()" style="background:#2E7D32;color:white;padding:12px 24px;border:none;border-radius:24px;cursor:pointer;font-weight:700;margin-top:10px;">Retry</button>
            </body></html>`,
            { headers: { 'Content-Type': 'text/html' } }
          );
        });
      })
    );
    return;
  }

  // Static assets — stale-while-revalidate
  event.respondWith(
    caches.open(STATIC_CACHE).then(cache =>
      cache.match(request).then(cached => {
        const networkFetch = fetch(request).then(response => {
          if (response.ok) cache.put(request, response.clone());
          return response;
        }).catch(() => {
          return cached || new Response('', { status: 408, statusText: 'Network Timeout' });
        });
        return cached || networkFetch;
      })
    )
  );
});

// Push Notifications
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'JPs Mart';
  const options = {
    body: data.body || 'Your order update is here!',
    icon: 'https://via.placeholder.com/192x192/2E7D32/ffffff?text=SM',
    badge: 'https://via.placeholder.com/72x72/2E7D32/ffffff?text=SM',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/' },
    actions: [
      { action: 'track', title: 'Track Order' },
      { action: 'close', title: 'Dismiss' }
    ]
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'track') {
    clients.openWindow('/?section=tracking');
  } else {
    clients.openWindow('/');
  }
});

self.addEventListener('message', event => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
