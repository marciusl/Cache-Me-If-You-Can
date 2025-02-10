const CACHE_NAME = "v2";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME));

  // event.waitUntil(self.skipWaiting()); // @demo - bug fix - about updating the service worker. The case when you not always want to update all service workers to avoid
  // breaking the app or having changes not saved yet. That's why we have notification for.
});

// Activate event - take control of the page. Comming from ServiceWorkerBase component
self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") {
    self.skipWaiting();
  }
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim()); // @demo - bug fix - about updating the service worker. The case when you not always want to update all service workers to avoid
  // breaking the app or having changes not saved yet. Thats why we have notification for.

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

// Cache-First Strategy
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    console.error("Cache-First Strategy Error:", error);
    throw error;
  }
}

// Network-First Strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    console.log("Network request failed, falling back to cache:", error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Stale-While-Revalidate Strategy
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);

  const cachedResponse = await caches.match(request);
  const fetchPromise = fetch(request).then((networkResponse) => {
    cache.put(request, networkResponse.clone());
    return networkResponse;
  });

  if (cachedResponse) {
    return cachedResponse;
  }
  return fetchPromise;
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (url.pathname.startsWith("/api/cache-first")) {
    event.respondWith(cacheFirst(event.request));
  } else if (url.pathname.startsWith("/api/network-first")) {
    event.respondWith(networkFirst(event.request));
  } else if (url.pathname.startsWith("/api/stale-while-revalidate")) {
    event.respondWith(staleWhileRevalidate(event.request));
  }
});
