'use strict';

const STATIC_CACHE = "fortune_cookie";

const STATIC_FILES = [
  'css/bootstrap.min.css',
  'css/cookie.css',
  'fonts/PatrickHand-Regular.ttf',
  'js/axios.min.js',
  'js/bootstrap.bundle.min.js',
  'js/cookie.js',
  'js/jquery-3.7.0.min.js',
  'resource/heart_full.svg',
  'resource/heart_stroke.svg',
  'resource/trash-can.svg',
  'index.html'
]


self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      cache.addAll(STATIC_FILES)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request)
    })
  )
})


// self.addEventListener("install", (evt) => {
//   evt.waitUntil(
//     caches.open(STATIC_CACHE).then((cache) => {
//       return cache.addAll(STATIC_FILES);
//     })
//   );

//   self.skipWaiting();
// });

// self.addEventListener("install", (evt) => {
//   evt.waitUntil(
//     caches.keys().then((keylist) => {
//       return Promise.all(keylist.map((key) => {
//         if (key !== STATIC_CACHE) {
//           return caches.delete(key);
//         }
//       }));
//     })
//   );
// });

// self.addEventListener("fetch", (evt) => {
//   if (evt.request.mode !== 'navigate') {
//     return;
//   }
//   evt.respondWith(
//     fetch(evt.request).catch(() => {
//       return caches.open(STATIC_CACHE).then((cache) => {
//         return cache.match('offline.html');
//       });
//     })
//   );
// });