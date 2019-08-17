var state = {};

var storeConfig = { name: "keyval", dbName: "keyval-store" };

function execute(mode, store, strategy) {
    if (!state.promisedb) {
        state.promisedb = new Promise(function (res, rej) {
            var req = indexedDB.open(store.dbName);
            req.onerror = function (e) { rej(e); }
            req.onupgradeneeded = function () { req.result.createObjectStore(store.name); }
            req.onsuccess = function () { res(req.result); };
        });
    }
    return state.promisedb.then(function (db) {
        return new Promise(function (res, rej) {
            var req = db.transaction(store.name, mode);
            req.onabort = req.onerror = function () { rej(req.error); };
            req.oncomplete = function () { res(); }
            strategy(req.objectStore(store.name));
        });
    });
}

// jaffacake protocol

export function set(key, value) {

    function strategy(store) { store.put(value, key); }
    return execute("readwrite", storeConfig, strategy);

}

function get(key) {

    var req;
    function strategy(store) { req = store.get(key); }
    return execute("readonly", storeConfig, strategy).then(function () { return req.result; });

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

// helper protocol

function closeAll() {
    if (state.promisedb) {
        state.promisedb.then(function (db) { db.close(); });
        state.promisedb = null;
    }
}