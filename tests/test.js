window.addEventListener("DOMContentLoaded", function () {

    var idbLite = window.idbLite;

    idbTest(idbLite, function (test, utils) {

        var deleteDatabase = utils.deleteDatabase;
        var assertEqual = utils.assertEqual;
        var assertDeepEqual = utils.assertDeepEqual;

        return [

            test("there should be a global idbLite property exposed", function () {

                if (!window.idbLite) throw new Error("Missing window.idbLite property");
                var typeofIdbLite = typeof window.idbLite;
                if (typeofIdbLite !== "object") throw new Error("Expected idbLite object, found " + typeofIdbLite);

            }),

            test("set then get should work for a string", function () {

                var expected = "world";
                return idbLite.set("hello", expected)
                    .then(function () { return idbLite.get("hello"); })
                    .then(function (actual) { assertEqual(expected, actual); });

            }),

            test("set then get should work for an array", function () {

                var expected = [1, "a", null];
                return idbLite.set("arr", expected)
                    .then(function () { return idbLite.get("arr"); })
                    .then(function (actual) { assertDeepEqual(expected, actual); });

            }),

            test("set then get should work for an object", function () {

                var expected = { hello: { "there": "world", number: 42 } };
                return idbLite.set("obj", expected)
                    .then(function () { return idbLite.get("obj"); })
                    .then(function (actual) { assertDeepEqual(expected, actual); });

            }),

            test("unset value should return undefined", function () {

                return idbLite.get("notset")
                    .then(function (actual) { assertEqual(undefined, actual); });

            }),

            test("keys should return only the keys which have been set", function () {

                return deleteDatabase("keyval-store")
                    .then(function () { return idbLite.set("hello", "world"); })
                    .then(function () { return idbLite.set("goodbye", "heaven"); })
                    .then(function () { return idbLite.keys(); })
                    .then(function (actual) { assertDeepEqual(["goodbye", "hello"], actual); });

            }),

            test("del should remove a key which has been set", function () {

                return deleteDatabase("keyval-store")
                    .then(function () { return idbLite.set("hello", "world"); })
                    .then(function () { return idbLite.set("goodbye", "heaven"); })
                    .then(function () { return idbLite.del("hello"); })
                    .then(function () { return idbLite.keys(); })
                    .then(function (actual) { assertDeepEqual(["goodbye"], actual); });

            }),

            test("clear should remove all keys which have been set", function () {

                return idbLite.set("hello", "world")
                    .then(function () { return idbLite.set("goodbye", "heaven"); })
                    .then(function () { return idbLite.clear(); })
                    .then(function () { return idbLite.keys(); })
                    .then(function (actual) { assertDeepEqual([], actual); });

            }),

            test("set a key to both default and custom stores, get from both, ensure both values are correctly preserved", function () {

                var customStore = new idbLite.Store("custom-store", "custom");
                var expectedCustomStoreValue = "custom store value";
                var expectedDefaultStoreValue = "default store value";
                return idbLite.set("hello", expectedDefaultStoreValue)
                    .then(function () { return idbLite.set("hello", expectedCustomStoreValue, customStore); })
                    .then(function () { return idbLite.get("hello"); })
                    .then(function (actual) { assertEqual(expectedDefaultStoreValue, actual); })
                    .then(function () { return idbLite.get("hello", customStore); })
                    .then(function (actual) { assertEqual(expectedCustomStoreValue, actual); });

            }),

            test("for a custom store, keys should return only keys in the custom store", function () {

                var customStore = new idbLite.Store("custom-store", "custom");
                return deleteDatabase("keyval-store")
                    .then(function () { return deleteDatabase("custom-store"); })
                    .then(function () { return idbLite.set("goodbye", "heaven"); })
                    .then(function () { return idbLite.set("hello", "world", customStore); })
                    .then(function () { return idbLite.keys(customStore); })
                    .then(function (actual) { assertDeepEqual(["hello"], actual); });

            }),

            test("for a custom store, del should remove a set key", function () {

                var customStore = new idbLite.Store("custom-store", "custom");
                return deleteDatabase("custom-store")
                    .then(function () { return idbLite.set("hello", "world", customStore); })
                    .then(function () { return idbLite.set("goodbye", "heaven", customStore); })
                    .then(function () { return idbLite.del("goodbye", customStore); })
                    .then(function () { return idbLite.keys(customStore); })
                    .then(function (actual) { assertDeepEqual(["hello"], actual); });
            }),

            test("for a custom store, clear should remove all keys which have been set", function () {

                var customStore = new idbLite.Store("custom-store", "custom");
                return idbLite.set("hello", "world", customStore)
                    .then(function () { return idbLite.set("goodbye", "heaven", customStore); })
                    .then(function () { return idbLite.clear(customStore); })
                    .then(function () { return idbLite.keys(customStore); })
                    .then(function (actual) { assertDeepEqual([], actual); });

            })

        ];

    });

});