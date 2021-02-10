window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

if (!window.indexedDB) {
   window.alert("Your browser doesn't support a stable version of IndexedDB")
}

var db;
var request = window.indexedDB.open("database", 1);

//connection failed
request.onerror = function(event) {
    console.log("error: failto connect database ");
};

//connected with database
request.onsuccess = function(event) {
db = request.result;
console.log("success: "+ db);
};

//upgrade database
request.onupgradeneeded = function(event) {
    var db = event.target.result;
    var objectStore = db.createObjectStore("scheduler", {keyPath: "id"});
    for (var i in schedulerData) {
        objectStore.add(schedulerData[i]);
    }
}
// add new entry
function read(id) {
    var transaction = db.transaction(["scheduler"]);
    var objectStore = transaction.objectStore("scheduler");
    var request = objectStore.get(id);
    
    request.onerror = function(event) {
       alert("Unable to retrieve daa from database!");
    };
    
    request.onsuccess = function(event) {
       // Do something with the request.result!
       if(request.result) {
         return request.result
       } else {
          return null
       }
    };
 }
 // read all entry
 function readAll() {
    let data=[]
    var objectStore = db.transaction("scheduler").objectStore("scheduler");
    
    objectStore.openCursor().onsuccess = function(event) {
       var cursor = event.target.result;
       
       if (cursor) {
          alert("Name for id " + cursor.key + " is " + cursor.value.name + ", 
             Age: " + cursor.value.age + ", Email: " + cursor.value.email);
          cursor.continue();
       } 
    };
    return data
 }
 
 function add() {
    var request = db.transaction(["scheduler"], "readwrite")
    .objectStore("scheduler")
    .add({ id: "00-03", name: "Kenny", age: 19, email: "kenny@planet.org" });
    
    request.onsuccess = function(event) {
       alert("Kenny has been added to your database.");
    };
    
    request.onerror = function(event) {
       alert("Unable to add data\r\nKenny is aready exist in your database! ");
    }
 }
 
 function remove(id) {
    var request = db.transaction(["scheduler"], "readwrite")
    .objectStore("scheduler")
    .delete(id);
    
    request.onsuccess = function(event) {
       
    };
 }