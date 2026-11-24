/* Public offline shell only. Never cache authenticated pages or API responses. */
const CACHE = "nfn-static-v2";
const OFFLINE_ASSETS = ["/nfn-mark.svg", "/offline.html"];
self.addEventListener("install", event => {
 event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(OFFLINE_ASSETS)));
 self.skipWaiting();
});
self.addEventListener("activate", event => {
 event.waitUntil(Promise.all([self.clients.claim(),caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith("nfn-")&&key!==CACHE).map(key=>caches.delete(key))))]));
});
self.addEventListener("fetch", event => {
 const request=event.request,url=new URL(request.url);
 if(request.method!=="GET"||url.origin!==self.location.origin||url.pathname.startsWith("/api/"))return;
 if(request.mode==="navigate"){
  event.respondWith(fetch(request).catch(async()=>await caches.match("/offline.html")||new Response("You are offline. Reconnect and retry.",{status:503,headers:{"Content-Type":"text/plain","Cache-Control":"no-store"}})));
  return;
 }
 if(!OFFLINE_ASSETS.includes(url.pathname))return;
 event.respondWith(caches.match(url.pathname).then(hit=>hit||fetch(request)));
});
