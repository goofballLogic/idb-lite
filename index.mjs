var state = {};

function opendb() {
    state.promisedb = state.promisedb || new Promise(function (res, rej) {
        var req = indexedDB.open("keyval-store");
        req.onerror = function (e) { rej(e); }
        req.onupgradeneeded = function () { req.result.createObjectStore("keyval"); }
        req.onsuccess = function () { res(req.result); };
    });
    return state.promisedb;
}

function execute(mode, strategy) {
    return opendb().then(function (db) {
        return new Promise(function (res, rej) {
            var req = db.transaction("keyval", mode);
            req.onabort = req.onerror = function () { rej(req.error); };
            req.oncomplete = function () { res(); }
            strategy(req.objectStore("keyval"));
        });
    });
}

export function set(key, value) {

    function strategy(store) { store.put(value, key); }
    return execute("readwrite", strategy);

}

function get(key) {

    var req;
    function strategy(store) { req = store.get(key); }
    return execute("readonly", strategy).then(function () { return req.result; });

}

function keys() {

    var req;
    function strategy(store) { req = store.getAllKeys(); }
    return execute("readonly", strategy).then(function () { return req.result; });

}

function closeAll() {
    if (state.promisedb) {
        state.promisedb.then(function (db) { db.close(); });
        state.promisedb = null;
    }
}

function del(key) {

    function strategy(store) { store.delete(key); }
    return execute("readwrite", strategy);

}