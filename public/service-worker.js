
// Names of the two caches used in this version of the service worker.
// Change to v2, etc. when you update any of the local resources, which will
// in turn trigger the install event again.
var VERSION = 42;
var PRECACHE  = 'mienDicPreCache-V' + VERSION;
var RUNTIME   = 'runtime-V'         + VERSION;

// A list of local resources we always want to be cached.
var PRECACHE_URLS = [
  '/'
  ,'/index.html'
  ,'/src/app.js'
  ,'/src/data.js'
  ,'/images/icons/home-icon-24.png'
  ,'/images/icons/nice-icon-192.png'
  ,'/images/icons/nice-icon-192.ico'
  ,'/images/gear.png'
];



// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(PRECACHE).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(PRECACHE_URLS);
    })
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  var currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});


// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {
  // Skip cross-origin requests, like those for Google Analytics.
  if (event.request.url.startsWith(self.location.origin)) {
    console.log('[ServiceWorker] caching ' + event.request.url )
    event.respondWith(
      caches.match(event.request, {ignoreSearch: true} )
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return caches.open(RUNTIME).then(cache => {
            return fetch(event.request).then(response => {
              // Put a copy of the response in the runtime cache.
              return cache.put(event.request, response.clone()).then(() => {
                return response;
              });
            });
          });
        })
    );
  }
});