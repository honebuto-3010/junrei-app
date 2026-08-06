const CACHE_NAME = "junrei-v2";
const urlsToCache = [
  "index.html",
  "css/style.css",
  "js/main.js",
  "images/192-icon.png",
  "images/512-icon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
