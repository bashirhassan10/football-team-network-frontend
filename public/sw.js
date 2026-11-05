/* Conservative NFN service worker: installation support without caching private data. */
const CACHE = "nfn-static-v1";
const OFFLINE_ASSETS = ["/nfn-mark.svg"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(OFFLINE_ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil(Promise.all([
    self.clients.claim(),
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
  ]));
});
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  // Never cache HTML, API responses, login state, verification documents or payments.
  if (request.mode === "navigate" || request.url.includes("/api/")) return;
  if (!new URL(request.url).pathname.match(/^\/(?:nfn-mark\.svg|icon-(?:192|512)\.png)$/)) return;
  event.respondWith(caches.match(request).then(hit => hit || fetch(request)));
});
