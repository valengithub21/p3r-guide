const CACHE_NAME = 'p3r-guide-v37'; // Sube la versión para aplicar los cambios

// Archivos críticos que se cachean al instalar
const urlsToCache = [
  './index.html',
  './manifest.json',
  './icon.png',
  './js/compendium_data.js',
  './js/social_links.js',
  './js/answers.js', 
  './img/persona-3-reload2.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // Borra cachés viejos
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 1. Si está en la caché, lo devuelve (rápido y offline)
        if (response) {
          return response;
        }

        // 2. Si no está en la caché, lo busca en internet
        return fetch(event.request).then(networkResponse => {
          // 3. CACHÉ DINÁMICO: Si es una imagen nueva (de la carpeta img o de la web), la guardamos para la próxima vez
          if (event.request.url.match(/\.(png|jpg|jpeg|svg|gif)$/) || event.request.destination === 'image') {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        });
      })
  );
});
