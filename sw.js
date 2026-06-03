const CACHE_NAME = 'marvel-guide-site-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './manifest.webmanifest',
  './sw.js',
  './icon-192.png',
  './icon-512.png',
  './img/logo.png',
  './img/fond.jpg',
  './img/intro.mp4'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (c) {
      return c.addAll(ASSETS);
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

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(function (cached) {
      return cached || fetch(e.request);
    })
  );
});
