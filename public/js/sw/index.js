const newCacheVersion = 'wittr-static-v7';
const contentImgsCache = 'wittr-content-imgs';

const allCaches = [
  newCacheVersion,
  contentImgsCache
];


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
          cacheList.filter(cacheName => cacheName.startsWith('wittr-') && cacheName != newCacheVersion && cacheName != contentImgsCache)
          // cacheList.filter(cacheName => cacheName.startsWith('wittr-') && !allCaches.includes(cacheName))
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
  // console.log(event.request.url)
  // console.log((event.request.url.startsWith(`${location.origin}/photos/`) && event.request.url.endsWith('.jpg')));

  switch (event.request.url) {
    case `${location.origin}/`:
    case `${location.origin}/?no-socket`:
      return event.respondWith(
        caches.match('/skeleton')
      );
    default:
      console.log('default request')
      if ((event.request.url.startsWith(`${location.origin}/photos/`) && event.request.url.endsWith('.jpg'))){
          return event.respondWith(
            caches.match(event.request.url.replace(/-\d+px\.jpg$/, ''))
                .then((res)=>{
                  return res ? res : 
                    fetch(event.request).then((netwkRes)=>{
                      return caches.open(contentImgsCache)
                        .then((cache)=>{
                          cache.put(event.request.url.replace(/-\d+px\.jpg$/, ''), netwkRes.clone());
                          return netwkRes;
                        })

                    });
                  })
              )
      }
      return event.respondWith(
        caches.match(event.request).then(res=>{
          return res ? res : fetch(event.request);
        })
      );
  }
});
