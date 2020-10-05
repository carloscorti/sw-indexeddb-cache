self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).then(res => {
      console.log(res.status);
      if(res.status==404){
        console.log('not found');
        return fetch('imgs/dr-evil.gif');
        // return fetch('imgs/dr-evil.gif').then(gif => {
        //   return new Response(gif.body, { 
        //       headers: {
        //         'content-type': 'image/gif'
        //       }
        //     }
        //   );
        // });
      }
      return res;
    }).catch((err)=>{
      console.log(`not network: ${err}`);
      return new Response('cant make the request');
    })
  );
});

// self.addEventListener('fetch', async (event) => {
//   const res = await fetch(event.request);
//   if(res.status==404){
//     try {
//       const gitFetch = await fetch('imgs/dr-evil.gif');
//       return event.respondWith(new Response(gitFetch.body));
//     } 
//     catch (err) {
//       console.log(`not network: ${err}`);
//       return event.respondWith(new Response('cant make the request'));
//     }
//   }
// });
