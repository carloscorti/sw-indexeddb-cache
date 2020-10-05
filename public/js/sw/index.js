self.addEventListener('fetch', (event) => {
  // console.log(event.request);
  // console.log('just hello hello¡¡:):)');
  const urlEnd = event.request.url.split('.').pop();
  console.log(urlEnd);
  if (urlEnd == 'jpg') {
    console.log('si')
    event.respondWith(
      fetch('imgs/dr-evil.gif')
    );
  }
});
