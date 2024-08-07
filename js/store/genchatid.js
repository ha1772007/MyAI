if (!indexedDB) {
    alert('Your browser does not support IndexedDB Switch TO lastest Browser.\n You will be redirect to a detailed guide to handle this error')
}
const request = indexedDB.open('conversations', 1);
request.onerror = (event) => {
    console.error(`Database error: ${event.target.errorCode}`);
};

request.onsuccess = (event) => {
    // add implementation here
};
// create the Contacts object store and indexes
request.onupgradeneeded = (event) => {
    let db = event.target.result;

    // create the Contacts object store 
    // with auto-increment id
    let store = db.createObjectStore('chats', {
        autoIncrement: true
    });
    let makechatid = store.createIndex('chatid', 'chatid', {
        unique: true
    });
    let makeembedding = store.createIndex('embeddings', 'embeddings', {
        unique: false
    })

    // create an index on the email property
    let index = store.createIndex('chat', 'chat', {
        unique: false
    });

};
function generate_chaid() {
        
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    
    return text;
}