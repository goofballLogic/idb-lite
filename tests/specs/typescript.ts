import { set, get, closeAll, keys, del, clear, Store } from "../../dist/index.module.js";
import { TestType, UtilitiesType, TestReturnType } from "../shared/test";

declare function idbTest(idbLite: any, buildTests: (test: TestType, utils: UtilitiesType) => Array<TestReturnType>): void;

window.addEventListener("DOMContentLoaded", () => {

    idbTest({ closeAll }, (test: TestType, utils: UtilitiesType) => [

        test("set then get should work for a string", async function () {

            const expected = "world";
            await set("hello", expected)
            const actual = await get("hello");
            utils.assertEqual(expected, actual);

        }),

        test("set then get should work for an array", async function () {

            const expected = [1, "a", null];
            await set("arr", expected)
            const actual = await get("arr");
            utils.assertDeepEqual(expected, actual);

        }),

        test("set then get should work for an object", async function () {

            const expected = { hello: { "there": "world", number: 42 } };
            await set("obj", expected);
            const actual = await get("obj");
            utils.assertDeepEqual(expected, actual);

        }),

        test("unset value should return undefined", async function () {

            const actual = await get("notset");
            utils.assertEqual(undefined, actual);

        }),

        test("keys should return only the keys which have been set", async function () {

            await utils.deleteDatabase("keyval-store");
            await set("hello", "world");
            await set("goodbye", "heaven");
            const actual = await keys();
            utils.assertDeepEqual(["goodbye", "hello"], actual);

        }),

        test("del should remove a key which has been set", async function () {

            await utils.deleteDatabase("keyval-store")
            await set("hello", "world");
            await set("goodbye", "heaven");
            await del("hello");
            const actual = await keys();
            utils.assertDeepEqual(["goodbye"], actual);

        }),

        test("clear should remove all keys which have been set", async function () {

            await set("hello", "world")
            await set("goodbye", "heaven");
            await clear();
            const actual = await keys();
            utils.assertDeepEqual([], actual);

        }),

        test("set a key to both default and custom stores, get from both, ensure both values are correctly preserved", async function () {

            const customStore = new Store("custom-store", "custom");
            const expectedCustomStoreValue = "custom store value";
            const expectedDefaultStoreValue = "default store value";
            await set("hello", expectedDefaultStoreValue);
            await set("hello", expectedCustomStoreValue, customStore);
            const actualDefaultStoreValue = await get("hello");
            utils.assertEqual(expectedDefaultStoreValue, actualDefaultStoreValue);
            const actualCustomStoreValue = await get("hello", customStore);
            utils.assertEqual(expectedCustomStoreValue, actualCustomStoreValue);

        }),

        test("for a custom store, keys should return only keys in the custom store", async function () {

            const customStore = new Store("custom-store", "custom");
            await utils.deleteDatabase("keyval-store");
            await utils.deleteDatabase("custom-store");
            await set("goodbye", "heaven");
            await set("hello", "world", customStore);
            const actual = await keys(customStore);
            utils.assertDeepEqual(["hello"], actual);

        }),

        test("for a custom store, del should remove a set key", async function () {

            const customStore = new Store("custom-store", "custom");
            await utils.deleteDatabase("custom-store")
            await set("hello", "world", customStore);
            await set("goodbye", "heaven", customStore);
            await del("goodbye", customStore);
            const actual = await keys(customStore);
            utils.assertDeepEqual(["hello"], actual);

        }),

        test("for a custom store, clear should remove all keys which have been set", async function () {

            const customStore = new Store("custom-store", "custom");
            await set("hello", "world", customStore)
            await set("goodbye", "heaven", customStore);
            await clear(customStore);
            const actual = await keys(customStore);
            utils.assertDeepEqual([], actual);

        })

    ]);

});