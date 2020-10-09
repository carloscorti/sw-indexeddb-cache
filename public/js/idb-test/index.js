import idb from 'idb';

var dbPromise = idb.open('test-db', 4, function(upgradeDb) {
  let peopleStore
  switch (upgradeDb.oldVersion) {
    case 0:
      var keyValStore = upgradeDb.createObjectStore('keyval');
      keyValStore.put("world", "hello");
    case 1:
      upgradeDb.createObjectStore('people', {keyPath: 'name'});
    case 2:
      peopleStore = upgradeDb.transaction.objectStore('people');
      peopleStore.createIndex('animal', 'favoriteAnimal');
    case 3:
      peopleStore = upgradeDb.transaction.objectStore('people');
      peopleStore.createIndex('age', 'age');

  }
});

// read "hello" in "keyval"
dbPromise.then(function(db) {
  var tx = db.transaction('keyval');
  var keyValStore = tx.objectStore('keyval');
  return keyValStore.get('hello');
}).then(function(val) {
  console.log('The value of "hello" is:', val);
});

// set "foo" to be "bar" in "keyval"
dbPromise.then(function(db) {
  var tx = db.transaction('keyval', 'readwrite');
  var keyValStore = tx.objectStore('keyval');
  keyValStore.put('bar', 'foo');
  return tx.complete;
}).then(function() {
  console.log('Added foo:bar to keyval');
});

dbPromise.then((db) => {
  const transax = db.transaction('keyval', 'readwrite');
  const keyValStore = transax.objectStore('keyval');
  keyValStore.put('cat', 'favoriteAnimal');
  return transax.complete;
}).then(()=> {
  console.log(`Added favoriteAnimal: to keyval`);
})

dbPromise.then((db) => {
  const transax = db.transaction('people', 'readwrite');
  const peopleStore = transax.objectStore('people');
  const peopleList = [
    {
      name: 'Gonza',
      age: 36,
      favoriteAnimal: 'dog'
    },

    {
      name: 'Naty',
      age: 28,
      favoriteAnimal: 'cat'
    },

    {
      name: 'Carli',
      age: 35,
      favoriteAnimal: 'lion'
    },

    {
      name: 'Galo',
      age: 34,
      favoriteAnimal: 'cat'
    }
  ];

  peopleList.forEach(person => {
    peopleStore.put(person);
  });
  return transax.complete;
}).then(()=> {
  console.log(`Added person list: to person`);
})

dbPromise.then((db) => {
  const transax = db.transaction('people');
  const peopleStore = transax.objectStore('people');
  return peopleStore.getAll();
}).then((persons)=> {
  console.log('Perosons: ', persons);
});


dbPromise.then((db) => {
  const transax = db.transaction('people');
  const peopleStore = transax.objectStore('people');
  const animalIndex = peopleStore.index('animal');
  return animalIndex.getAll();
}).then((persons)=> {
  console.log('Perosons indexed by animal: ', persons);
});

dbPromise.then((db) => {
  const transax = db.transaction('people');
  const peopleStore = transax.objectStore('people');
  const animalIndex = peopleStore.index('animal');
  return animalIndex.getAll('cat');
}).then((persons)=> {
  console.log('Perosons indexed by animal query by cat: ', persons);
});





 
