window.addEventListener("DOMContentLoaded", function () {

    var main = document.getElementsByTagName("main")[0];
    if (!main) alert(new Error("No main tag found - aborting").stack);

    var messageTemplate = "<div class=\"message\"><span class=\"when\">WHEN</span>CONTENT</div";
    var resultTemplate = "<div class=\"TEST_CLASS\">CONTENT</div>";
    var errorTemplate = "<span class=\"test-error\">CONTENT</span>";
    var logTemplate = "<div class=\"log\">CONTENT</div>";

    var idbLite = null;

    runAll([

        function beforeAll() {

            idbLite = window.idbLite;

        },

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

    ]);

    function log(content) {

        write(logTemplate.replace("CONTENT", content));
        console.log(content);

    }

    function logError(err) {

        write(logTemplate.replace("CONTENT", (err && err.stack) || err));
        console.error ? console.error(err) : console.log(err);

    }

    function runAll(tests) {

        log("Running " + (tests.length - 1) + " tests");
        tests
            .reduce(function (prev, curr, index) { return prev.then(curr.bind(this, index)); }, Promise.resolve())
            .then(function () { log("Tests complete"); })
            .catch(function (err) { logError(err); });

    }
    // helpers
    function assertEqual(expected, actual, expectedDescription, actualDescription) {

        expectedDescription = expectedDescription || "Expected";
        actualDescription = actualDescription || "Actual";
        if (actual !== expected)
            throw new Error([expectedDescription, expected, actualDescription, actual].join(" | "));

    }

    function assertDeepEqual(expected, actual) {

        assertEqual(JSON.stringify(expected), JSON.stringify(actual));

    }

    function write(message) {

        var now = (new Date()).toISOString().split("T")[1];
        main.innerHTML = main.innerHTML + messageTemplate.replace("WHEN", now).replace("CONTENT", message);

    }

    function populateError(err) {

        return errorTemplate.replace("CONTENT", err.stack || err);

    }

    function test(what, how) {

        return function (index) {

            var start = Date.now();
            return new Promise(function (resolve) {

                var maybeError = "";
                try {

                    (how() || Promise.resolve()).then(function () {

                        reportResult();
                        resolve();

                    }).catch(function (err) {

                        maybeError = populateError(err);
                        reportResult();
                        resolve();

                    });

                } catch (err) {

                    maybeError = populateError(err);
                    reportResult();
                    resolve();

                }

                function reportResult() {

                    var duration = Date.now() - start;
                    var testClass = "test-result " + (maybeError ? "test-fail" : "test-pass");
                    var testContent = index + ". " + what + " [" + duration + "ms] " + maybeError;
                    write(resultTemplate.replace("TEST_CLASS", testClass).replace("CONTENT", testContent));

                }

            }).then(function () {

                return window.idbLite.closeAll();

            });

        };

    }

    function deleteDatabase(dbname) {

        return new Promise(function (resolve, reject) {

            var req = window.indexedDB.deleteDatabase(dbname);
            req.onerror = reject;
            req.onsuccess = resolve;

        });

    }

});