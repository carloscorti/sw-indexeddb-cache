import PostsView from './views/Posts';
import ToastsView from './views/Toasts';
import idb from 'idb';

const openDataBase = () => {
  if(!navigator.serviceWorker) return Promise.resolve();
  return idb.open('wittr', 1, function(upgradeDb) {
        const wittrsStore = upgradeDb.createObjectStore('wittrs', {keyPath: 'id'});
        wittrsStore.createIndex('by-date', 'time');  
      });
  };

export default function IndexController(container) {
  this._container = container;
  this._postsView = new PostsView(this._container);
  this._toastsView = new ToastsView(this._container);
  this._lostConnectionToast = null;
  this._openSocket();
  this._registerServiceWorker();
}


// register service wotrker
IndexController.prototype._registerServiceWorker = function() {
  let indexController = this;
  if (navigator.serviceWorker) {
    navigator.serviceWorker.register('/sw.js') // regards sw.js in build folder made by gulp
      .then((reg)=>{
        if (navigator.serviceWorker.controller){
          console.log('service worker has control, :)¡¡');
  
          reg.addEventListener('updatefound', () => {
            // if (reg.installing) {
              const newSw = reg.installing;
              console.log('new service worker installing');
              newSw.addEventListener('statechange', () => {
                if (newSw.state === 'installed'){
                console.log('service worker waiting, close and open tag');
                const toast = indexController._toastsView.show('just appear a new service worker¡¡¡¡', {buttons: ['Update New']});
                toast.answer.then(msg=>newSw.postMessage(msg));
                }
              });
              return;
            // }
          });

          if (reg.waiting) {
            const waitSw = reg.waiting;
            console.log('service worker waiting, update¡¡¡¡');
            const toast = indexController._toastsView.show('service worker waiting, update¡¡¡¡', {buttons: ['Update']});
            toast.answer.then(msg=>waitSw.postMessage(msg));
          }
          return;

        }
            console.log('no service worker avaiable, fetching fron the network');
            if (reg.installing){
              const initSw = reg.installing;
              console.log('service worker installing');
              initSw.addEventListener('statechange', () => {
                if (initSw.state === 'activated'){
                  console.log('first service worker aviable, please reload');
                  const toast = indexController._toastsView.show('first service worker aviable', {buttons: ['Reload']});
                  toast.answer.then(msg=>{
                    window.location.reload();
                    initSw.postMessage(msg);
                  });
                } 
              });
            }
            return;
      })
      .catch((err) => {
        return console.log(`error on loading sw: ${err}`);
      });

    navigator.serviceWorker.addEventListener('controllerchange', ()=>{
      window.location.reload();
    });
  }
  console.log('waiting for the servcie worker');

};

// open a connection to the server for live updates
IndexController.prototype._openSocket = function() {
  var indexController = this;
  var latestPostDate = this._postsView.getLatestPostDate();

  // create a url pointing to /updates with the ws protocol
  var socketUrl = new URL('/updates', window.location);
  socketUrl.protocol = 'ws';

  if (latestPostDate) {
    socketUrl.search = 'since=' + latestPostDate.valueOf();
  }

  // this is a little hack for the settings page's tests,
  // it isn't needed for Wittr
  socketUrl.search += '&' + location.search.slice(1);

  var ws = new WebSocket(socketUrl.href);

  // add listeners
  ws.addEventListener('open', function() {
    if (indexController._lostConnectionToast) {
      indexController._lostConnectionToast.hide();
    }
  });

  ws.addEventListener('message', function(event) {
    requestAnimationFrame(function() {
      indexController._onSocketMessage(event.data);
    });
  });

  ws.addEventListener('close', function() {
    // tell the user
    if (!indexController._lostConnectionToast) {
      indexController._lostConnectionToast = indexController._toastsView.show("Unable to connect. Retrying…");
    }

    // try and reconnect in 5 seconds
    setTimeout(function() {
      indexController._openSocket();
    }, 5000);
  });
};

// called when the web socket sends message data
IndexController.prototype._onSocketMessage = function(data) {      
  var messages = JSON.parse(data);
  openDataBase().then((db) => {
    if (!db) return;
    const transax = db.transaction('wittrs', 'readwrite');
    const wittrsStore = transax.objectStore('wittrs');  
    messages.forEach(msg => {
      wittrsStore.put(msg);
    });
    return transax.complete;
  }).then(()=> {
    console.log(`Added post: to wittrs`);
  });
  this._postsView.addPosts(messages);
};