const version = "1.1.0";
const cacheName = `zac-land-${version}`;

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache
        .addAll([
          `/`,
          `/index.html`,
          `/images/icons/notepad-16x16.png`,
          `/images/icons/notepad-192x192.png`,
          `/images/icons/notepad-512x512.png`
        ])
        .then(() => self.skipWaiting());
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches
    .open(cacheName)
    .then(cache => cache.match(event.request, {
      ignoreSearch: true
    }))
    .then(response => {
      return response || fetch(event.request);
    })
  );
});
