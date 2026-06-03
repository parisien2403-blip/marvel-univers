const CACHE_NAME = 'marvel-guide-site-v5';
const CORE = ['./index.html', './manifest.json', './manifest.webmanifest', './sw.js'];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (c) {
      return c.addAll(CORE);
    }).catch(function () {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE_NAME; }).map(function (k) {
        return caches.delete(k);
      }));
    })
  );
  self.clients.claim();
});

function isMedia(url) {
  return /\.(jpg|jpeg|png|webp|avif|mp4|webm)(\?|$)/i.test(url);
}

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var url = e.request.url;
  if (isMedia(url)) {
    e.respondWith(
      fetch(e.request).then(function (res) {
        if (res && res.ok) {
          var copy = res.clone();
          caches.open(CACHE_NAME).then(function (c) { c.put(e.request, copy); });
        }
        return res;
      }).catch(function () {
        return caches.match(e.request);
      })
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(function (cached) {
      return cached || fetch(e.request);
    })
  );
});
