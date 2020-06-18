var CACHE_STATIC_NAME = 'static-v12';
var CACHE_DYNAMIC_NAME = 'dynamic-v2';

self.addEventListener('install', function (event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(function (cache) {
        console.log('[Service Worker] Precaching App Shell');
        cache.addAll([
          './',
          './index.html',
          './add-recipe.html',
          './receipe-post.html',
          './offline.html',
          './manifest.json',
          './style.css',
          './css/animate.css',
          './css/bootstrap.min.css',
          './css/classy-nav.min.css',
          './css/custom-icon.css',
          './css/font-awesome.min.css',
          './css/magnific-popup.css',
          './css/nice-select.min.css',
          './css/owl.carousel.min.css',
          './fonts/classy.eot',
          './fonts/classy.svg',
          './fonts/classy.ttf',
          './fonts/classy.woff',
          './fonts/FontAwesome.otf',
          './fonts/fontawesome-webfont.eot',
          './fonts/fontawesome-webfont.svg',
          './fonts/fontawesome-webfont.ttf',
          './fonts/fontawesome-webfont.woff',
          './fonts/fontawesome-webfont.woff2',
          './fonts/icomoon.eot',
          './fonts/icomoon.svg',
          './fonts/icomoon.ttf',
          './fonts/icomoon.woff',
          './img/core-img/salad.png',
          './img/core-img/favicon.ico',
          './img/icons/app-icon-48x48.png',
          './img/icons/app-icon-96x96.png',
          './img/icons/app-icon-144x144.png',
          './img/icons/app-icon-192x192.png',
          './img/icons/app-icon-256x256.png',
          './img/icons/app-icon-512x512.png',
        ]);
      })
  )
});

self.addEventListener('activate', function (event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys()
      .then(function (keyList) {
        return Promise.all(keyList.map(function (key) {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log('[Service Worker] Removing old cache.', key);
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim();
});



self.addEventListener('fetch', function (event) {
  var url = 'https://httpbin.org/get';

  if (event.request.url.indexOf(url) > -1) {
    event.respondWith(
      caches.open(CACHE_DYNAMIC_NAME)
        .then(function (cache) {
          return fetch(event.request)
            .then(function (res) {
              cache.put(event.request, res.clone());
              return res;
            });
        })
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(function (response) {
          if (response) {
            return response;
          } else {
            return fetch(event.request)
              .then(function (res) {
                return caches.open(CACHE_DYNAMIC_NAME)
                  .then(function (cache) {
                    cache.put(event.request.url, res.clone());
                    return res;
                  })
              })
              .catch(function (err) {
                return caches.open(CACHE_STATIC_NAME)
                  .then(function (cache) {
                    return cache.match('/offline.html');
                  });
              });
          }
        })
    );
  }
});

