import { set, get, closeAll, keys, del, clear, Store } from "/dist/index.mjs";

window.addEventListener("DOMContentLoaded", () => {

    idbTest({ closeAll }, (test, { deleteDatabase, assertEqual, assertDeepEqual }) => [

        test("set then get should work for a string", async function () {

            const expected = "world";
            await set("hello", expected)
            const actual = await get("hello");
            assertEqual(expected, actual);

        }),

        test("set then get should work for an array", async function () {

            const expected = [1, "a", null];
            await set("arr", expected)
            const actual = await get("arr");
            assertDeepEqual(expected, actual);

        }),

        test("set then get should work for an object", async function () {

            const expected = { hello: { "there": "world", number: 42 } };
            await set("obj", expected);
            const actual = await get("obj");
            assertDeepEqual(expected, actual);

        }),

        test("unset value should return undefined", async function () {

            const actual = await get("notset")
            assertEqual(undefined, actual);

        }),

        test("keys should return only the keys which have been set", async function () {

            await deleteDatabase("keyval-store");
            await set("hello", "world");
            await set("goodbye", "heaven");
            const actual = await keys();
            assertDeepEqual(["goodbye", "hello"], actual);

        }),

        test("del should remove a key which has been set", async function () {

            await deleteDatabase("keyval-store");
            await set("hello", "world");
            await set("goodbye", "heaven");
            await del("hello");
            const actual = await keys();
            assertDeepEqual(["goodbye"], actual);

        }),

        test("clear should remove all keys which have been set", async function () {

            await set("hello", "world")
            await set("goodbye", "heaven");
            await clear();
            const actual = await keys();
            assertDeepEqual([], actual);

        }),

        test("set a key to both default and custom stores, get from both, ensure both values are correctly preserved", async function () {

            const customStore = new Store("custom-store", "custom");
            const expectedCustomStoreValue = "custom store value";
            const expectedDefaultStoreValue = "default store value";
            await set("hello", expectedDefaultStoreValue);
            await set("hello", expectedCustomStoreValue, customStore);
            const actualCustomStoreValue = await get("hello");
            assertEqual(expectedDefaultStoreValue, actualCustomStoreValue);
            const actualDefaultStoreValue = await get("hello", customStore);
            assertEqual(expectedCustomStoreValue, actualDefaultStoreValue);

        }),

        test("for a custom store, keys should return only keys in the custom store", async function () {

            const customStore = new Store("custom-store", "custom");
            await deleteDatabase("keyval-store");
            await deleteDatabase("custom-store");
            await set("goodbye", "heaven");
            await set("hello", "world", customStore);
            const actual = await keys(customStore);
            assertDeepEqual(["hello"], actual);

        }),

        test("for a custom store, del should remove a set key", async function () {

            const customStore = new Store("custom-store", "custom");
            await deleteDatabase("custom-store");
            await set("hello", "world", customStore);
            await set("goodbye", "heaven", customStore);
            await del("goodbye", customStore);
            const actual = await keys(customStore);
            assertDeepEqual(["hello"], actual);
        }),

        test("for a custom store, clear should remove all keys which have been set", async function () {

            const customStore = new Store("custom-store", "custom");
            await set("hello", "world", customStore);
            await set("goodbye", "heaven", customStore);
            await clear(customStore);
            const actual = await keys(customStore);
            assertDeepEqual([], actual);

        })

    ]);

});