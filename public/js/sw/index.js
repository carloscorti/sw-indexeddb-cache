self.addEventListener('fetch', (event) => {
  // console.log(event.request);
  // console.log('just hello hello¡¡:):)');
  event.respondWith(new Response('Hello <b class=a-winner-is-me>world</b>', {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      }
    })
  );

});
