(function(ns) { ns.set = set;
ns.get = get;
ns.closeAll = closeAll;
ns.keys = keys;
ns.del = del;
ns.clear = clear;
ns.Store = Store;
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

function keys(config) {

    var req;
    function strategy(store) { req = store.getAllKeys(); }
    return execute("readonly", config || storeConfig, strategy).then(function () { return req.result; });

}

function del(key, config) {

    function strategy(store) { store.delete(key); }
    return execute("readwrite", config || storeConfig, strategy);

}

function clear(config) {

    function strategy(store) { store.clear(); }
    return execute("readwrite", config || storeConfig, strategy);

}

function Store(dbName, name) { return { dbName: dbName, name: name }; }

// helper protocol

function closeAll() {
    return Promise.all(Object.keys(dbs).map(function (key) {
        var promisedb = dbs[key];
        delete dbs[key];
        return promisedb.then(function (db) { return db.close(); });
    }));
}
}(window.idbLite = {}));