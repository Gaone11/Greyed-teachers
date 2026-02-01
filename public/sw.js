const CACHE_NAME = 'greyed-v1.0.0';
const RUNTIME_CACHE = 'greyed-runtime';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.json'
];

const CACHE_STRATEGIES = {
  fonts: 'cache-first',
  images: 'cache-first',
  api: 'network-first',
  static: 'cache-first',
  default: 'network-first'
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
          })
          .map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') {
    return;
  }

  if (url.origin !== location.origin && !url.hostname.includes('supabase')) {
    return;
  }

  const strategy = getStrategy(request);

  if (strategy === 'cache-first') {
    event.respondWith(cacheFirst(request));
  } else if (strategy === 'network-first') {
    event.respondWith(networkFirst(request));
  }
});

function getStrategy(request) {
  const url = new URL(request.url);
  const extension = url.pathname.split('.').pop();

  if (['woff', 'woff2', 'ttf', 'otf'].includes(extension)) {
    return CACHE_STRATEGIES.fonts;
  }

  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'ico'].includes(extension)) {
    return CACHE_STRATEGIES.images;
  }

  if (url.hostname.includes('supabase') || url.pathname.startsWith('/api/')) {
    return CACHE_STRATEGIES.api;
  }

  if (['js', 'css', 'html'].includes(extension)) {
    return CACHE_STRATEGIES.static;
  }

  return CACHE_STRATEGIES.default;
}

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return new Response('Offline - Resource not available', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'text/plain'
      })
    });
  }
}

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    if (request.destination === 'document') {
      const offlineResponse = await caches.match('/index.html');
      if (offlineResponse) {
        return offlineResponse;
      }
    }

    return new Response('Offline - Please check your connection', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'text/plain'
      })
    });
  }
}

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from GreyEd',
    icon: '/icon-192.png',
    badge: '/favicon.svg',
    vibrate: [200, 100, 200],
    tag: 'greyed-notification',
    requireInteraction: false,
    actions: [
      {
        action: 'open',
        title: 'Open App'
      },
      {
        action: 'close',
        title: 'Dismiss'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('GreyEd', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
