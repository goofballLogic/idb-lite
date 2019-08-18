module.exports={ set, get, closeAll, keys, del, clear, Store };

var dbs = {};

var storeConfig = { name: "keyval", dbName: "keyval-store" };

function execute(mode, config, strategy) {
    const storeName = config.name;
    const dbName = config.dbName;
    var key = encodeURI(storeName) + "|" + encodeURI(dbName);
    if (!dbs[key]) {
        dbs[key] = new Promise(function (res, rej) {
            var req = indexedDB.open(dbName);
            req.onerror = function (e) { rej(e); }
            req.onupgradeneeded = function () { req.result.createObjectStore(storeName); }
            req.onsuccess = function () { res(req.result); };
            req.onblocked = function () { console.error("blocked opening" + dbName); }
        });
    }
    return dbs[key].then(function (db) {
        db.onclose = function () { console.error("closed", dbName); };
        return new Promise(function (res, rej) {
            var req = db.transaction(storeName, mode);
            req.onabort = req.onerror = function () { rej(req.error); };
            req.oncomplete = function () { res(); }
            strategy(req.objectStore(storeName));
        });
    });
}

// jaffacake protocol
function set(key, value, config) {

    function strategy(store) { store.put(value, key); }
    return execute("readwrite", config || storeConfig, strategy);

}

function get(key, config) {

    var req;
    function strategy(store) { req = store.get(key); }
    return execute("readonly", config || storeConfig, strategy).then(function () { return req.result; });

}

function keys() {

    var req;
    function strategy(store) { req = store.getAllKeys(); }
    return execute("readonly", storeConfig, strategy).then(function () { return req.result; });

}

function del(key) {

    function strategy(store) { store.delete(key); }
    return execute("readwrite", storeConfig, strategy);

}

function clear() {

    function strategy(store) { store.clear(); }
    return execute("readwrite", storeConfig, strategy);

}

function Store(dbName, name) { return { dbName: dbName, name: name }; }

// helper protocol

function closeAll() {
    var keys = Object.keys(dbs);
    return Promise.all(keys.map(function (key) {
        var promisedb = dbs[key];
        dbs[key] = null;
        return promisedb.then(function (db) { return db.close(); });
    }));
}
