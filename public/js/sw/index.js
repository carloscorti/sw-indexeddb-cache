const newCacheVersion = 'wittr-static-v2';

self.addEventListener('install', (event) => {
  const urlsToCache = [
    '/',
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
        cacheList.filter(cacheName => cacheName.startsWith('wittr-') && cacheName != newCacheVersion)
          .map(cacheName => {
            caches.delete(cacheName);
          });
        }
      )
    // caches.delete('wittr-static-v1')
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(res=>{
      return res ? res : fetch(event.request);
    })
    // caches.open('wittr-static-v1')
    //   .then(cache=>cache.keys())
    //   .then(keys=>{
    //     if (keys.map(key=>key.url).includes(event.request.url)) {
    //     // if (keys.includes(event.request)) {
    //       console.log('from cache')
    //       return caches.match(event.request);
    //     }
    //     return fetch(event.request);
    //   })
  );



  
  // event.respondWith(
  //   caches.match(event.request)


    // caches.open('wittr-static-v1').then(cache=>cache.keys()).then(keys=>fetch(keys[0].url))
    
    
    // fetch(event.request).then(res => {
    //   if(res.status==404){
    //     console.log('not found');
    //     return fetch('imgs/dr-evil.gif');
    //   }
    //   return res;
    // }).catch((err)=>{
    //   console.log(`not network: ${err}`);
    //   return new Response('cant make the request');
    // })
  // );
});