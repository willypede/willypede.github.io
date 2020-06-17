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
          './receipe-post.html',
          './add-recipe.html',
          './js/app.js',
          './js/db.js',
          './js/feed.js',
          './js/promise.js',
          './js/fetch.js',
          './js/material.min.js',
          './css/animate.css',
          './css/bootstrap.min.css',
          './css/classy-nav.min.css',
          './css/custom-icon.css',
          './css/font-awesome.min.css',
          './css/magnific-popup.css',
          './css/nice-select.min.css',
          './css/owl.carousel.min.css',
          './images/main-image.jpg',
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
          './img/core-img/salad.png'
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

function isInArray(string, array) {
  var cachePath;
  if (string.indexOf(self.origin) === 0) { // request targets domain where we serve the page from (i.e. NOT a CDN)
    console.log('matched ', string);
    cachePath = string.substring(self.origin.length); // take the part of the URL AFTER the domain (e.g. after localhost:8080)
  } else {
    cachePath = string; // store the full request (for CDNs)
  }
  return array.indexOf(cachePath) > -1;
}

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
  } else if (isInArray(event.request.url, STATIC_FILES)) {
    event.respondWith(
      caches.match(event.request)
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
                    if (event.request.headers.get('accept').includes('text/html')) {
                      return cache.match('/index.html');
                    }
                  });
              });
          }
        })
    );
  }
});
