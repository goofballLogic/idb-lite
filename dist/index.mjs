"use strict";
var dbs = {};

function exec(mode, config, method, params, returnResult) {
    var storeName = config ? config.name : "keyval";
    var dbName = config ? config.dbName : "keyval-store";
    var key = encodeURI(dbName) + "|" + encodeURI(storeName);
    if (!dbs[key]) {
        dbs[key] = new Promise(function (resolve, reject) {
            var req = indexedDB.open(dbName);
            req.onerror = reject;
            req.onupgradeneeded = function () { req.result.createObjectStore(storeName); }
            req.onsuccess = function () { resolve(req.result); };
        });
    }
    return dbs[key].then(function (db) {
        return new Promise(function (resolve, reject) {
            var req = db.transaction(storeName, mode);
            req.onabort = req.onerror = reject;
            req.oncomplete = function () { resolve(returnResult && methodReq.result); }
            var store = req.objectStore(storeName);
            var methodReq = store[method].apply(store, params);
        });
    });
}
// jaffacake protocol

export function set(key, value, config) { return exec("readwrite", config, "put", [value, key]); }

export function get(key, config) { return exec("readonly", config, "get", [key], true); }

export function keys(config) { return exec("readonly", config, "getAllKeys", null, true); }

export function del(key, config) { return exec("readwrite", config, "delete", [key]); }

export function clear(config) { return exec("readwrite", config, "clear"); }

export function Store(dbName, name) { this.dbName = dbName; this.name = name; }

// helper protocol

export function closeAll() {
    return Promise.all(Object.keys(dbs).map(function (key) {
        var dbp = dbs[key];
        delete dbs[key];
        return dbp.then(function (db) { return db.close(); });
    }));
}