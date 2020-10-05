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
    caches.open('wittr-static-v1').then(cache => cache.addAll(urlsToCache))
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