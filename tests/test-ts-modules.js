var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { set, get, closeAll, keys, del, clear, Store } from "../dist/index.module.js";
window.addEventListener("DOMContentLoaded", () => {
    idbTest({ closeAll }, (test, utils) => [
        test("set then get should work for a string", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const expected = "world";
                yield set("hello", expected);
                const actual = yield get("hello");
                utils.assertEqual(expected, actual);
            });
        }),
        test("set then get should work for an array", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const expected = [1, "a", null];
                yield set("arr", expected);
                const actual = yield get("arr");
                utils.assertDeepEqual(expected, actual);
            });
        }),
        test("set then get should work for an object", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const expected = { hello: { "there": "world", number: 42 } };
                yield set("obj", expected);
                const actual = yield get("obj");
                utils.assertDeepEqual(expected, actual);
            });
        }),
        test("unset value should return undefined", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const actual = yield get("notset");
                utils.assertEqual(undefined, actual);
            });
        }),
        test("keys should return only the keys which have been set", function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield utils.deleteDatabase("keyval-store");
                yield set("hello", "world");
                yield set("goodbye", "heaven");
                const actual = yield keys();
                utils.assertDeepEqual(["goodbye", "hello"], actual);
            });
        }),
        test("del should remove a key which has been set", function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield utils.deleteDatabase("keyval-store");
                yield set("hello", "world");
                yield set("goodbye", "heaven");
                yield del("hello");
                const actual = yield keys();
                utils.assertDeepEqual(["goodbye"], actual);
            });
        }),
        test("clear should remove all keys which have been set", function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield set("hello", "world");
                yield set("goodbye", "heaven");
                yield clear();
                const actual = yield keys();
                utils.assertDeepEqual([], actual);
            });
        }),
        test("set a key to both default and custom stores, get from both, ensure both values are correctly preserved", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const customStore = new Store("custom-store", "custom");
                const expectedCustomStoreValue = "custom store value";
                const expectedDefaultStoreValue = "default store value";
                yield set("hello", expectedDefaultStoreValue);
                yield set("hello", expectedCustomStoreValue, customStore);
                const actualDefaultStoreValue = yield get("hello");
                utils.assertEqual(expectedDefaultStoreValue, actualDefaultStoreValue);
                const actualCustomStoreValue = yield get("hello", customStore);
                utils.assertEqual(expectedCustomStoreValue, actualCustomStoreValue);
            });
        }),
        test("for a custom store, keys should return only keys in the custom store", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const customStore = new Store("custom-store", "custom");
                yield utils.deleteDatabase("keyval-store");
                yield utils.deleteDatabase("custom-store");
                yield set("goodbye", "heaven");
                yield set("hello", "world", customStore);
                const actual = yield keys(customStore);
                utils.assertDeepEqual(["hello"], actual);
            });
        }),
        test("for a custom store, del should remove a set key", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const customStore = new Store("custom-store", "custom");
                yield utils.deleteDatabase("custom-store");
                yield set("hello", "world", customStore);
                yield set("goodbye", "heaven", customStore);
                yield del("goodbye", customStore);
                const actual = yield keys(customStore);
                utils.assertDeepEqual(["hello"], actual);
            });
        }),
        test("for a custom store, clear should remove all keys which have been set", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const customStore = new Store("custom-store", "custom");
                yield set("hello", "world", customStore);
                yield set("goodbye", "heaven", customStore);
                yield clear(customStore);
                const actual = yield keys(customStore);
                utils.assertDeepEqual([], actual);
            });
        })
    ]);
});
