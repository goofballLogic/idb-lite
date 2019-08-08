window.addEventListener("DOMContentLoaded", function () {

    var main = document.getElementsByTagName("main")[0];
    if (!main) alert(new Error("No main tag found - aborting").stack);

    var messageTemplate = "<div class=\"message\"><span class=\"when\">WHEN</span>CONTENT</div";
    var resultTemplate = "<div class=\"TEST_CLASS\">CONTENT</div>";
    var errorTemplate = "<span class=\"test-error\">CONTENT</span>";

    [

        test("there should be a global idbLite property exposed", function () {

            if (!window.idbLite) throw new Error("Missing window.idbLite property");
            var typeofIdbLite = typeof window.idbLite;
            if (typeofIdbLite !== "object") throw new Error("Expected idbLite object, found " + typeofIdbLite);

        }),

        test("set then get should work for a string", function () {

            var expected = "world";
            return window.idbLite.set("hello", expected)
                .then(function () { return window.idbLite.get("hello"); })
                .then(function (actual) { assertEqual(expected, actual); });

        }),

        test("set then get should work for an array", function () {

            var expected = [1, "a", null];
            return window.idbLite.set("arr", expected)
                .then(function () { return window.idbLite.get("arr"); })
                .then(function (actual) { assertDeepEqual(expected, actual); });

        }),

        test("set then get should work for an object", function () {

            var expected = { hello: { "there": "world", number: 42 } };
            return window.idbLite.set("arr", expected)
                .then(function () { return window.idbLite.get("arr"); })
                .then(function (actual) { assertDeepEqual(expected, actual); });

        })

    ].reduce(function (prev, curr) { return prev.then(curr); }, Promise.resolve());

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

        return function () {

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

                    var testClass = "test-result " + (maybeError ? "test-fail" : "test-pass");
                    var testContent = what + maybeError;
                    write(resultTemplate.replace("TEST_CLASS", testClass).replace("CONTENT", testContent));

                }

            });

        };

    }


});