const newCacheVersion = 'wittr-static-v4';

self.addEventListener('install', (event) => {
  const urlsToCache = [
    '/skeleton',
    'js/main.js',
    'css/main.css',
    '/imgs/icon.png',
    'https://fonts.gstatic.com/s/roboto/v15/2UX7WLTfW3W8TclTUvlFyQ.woff',
    'https://fonts.gstatic.com/s/roboto/v15/d-6IYplOFocCacKzxwXSOD8E0i7KZn-EPnyo3HZu7kw.woff'
  ];

  event.waitUntil(
    caches.open(newCacheVersion).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(cacheList => {
        return Promise.all(
          cacheList.filter(cacheName => cacheName.startsWith('wittr-') && cacheName != newCacheVersion)
            .map(cacheName => {
              caches.delete(cacheName);
            }
          ));
        }
      ),
    // caches.delete('wittr-static-v1')
  );
});

self.addEventListener('message', (event) => {
  console.log(event.data);
  console.log(event.data.startsWith('Update'));
  if (event.data.startsWith('Update')){
    self.skipWaiting();
  }
});



self.addEventListener('fetch', (event) => {
  switch (event.request.url) {
    case `${location.origin}/`:
      return event.respondWith(
        caches.match('/skeleton')
      );
    default:
      return event.respondWith(
        caches.match(event.request).then(res=>{
          return res ? res : fetch(event.request);
        })
      );
  }
});
