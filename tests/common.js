window.idbTest = function(idbLite, buildTests) {

    var main = document.getElementsByTagName("main")[0];
    if (!main) alert(new Error("No main tag found - aborting").stack);

    var messageTemplate = "<div class=\"message\"><span class=\"when\">WHEN</span>CONTENT</div";
    var resultTemplate = "<div class=\"TEST_CLASS\">CONTENT</div>";
    var errorTemplate = "<span class=\"test-error\">CONTENT</span>";
    var logTemplate = "<div class=\"log\">CONTENT</div>";

    var utilities = {
        deleteDatabase: deleteDatabase,
        assertEqual: assertEqual,
        assertDeepEqual: assertDeepEqual
    };

    runAll(buildTests(test, utilities));

    function log(content) {

        write(logTemplate.replace("CONTENT", content));
        console.log(content);

    }

    function logError(err) {

        write(logTemplate.replace("CONTENT", (err && err.stack) || err));
        console.error ? console.error(err) : console.log(err);

    }

    function runAll(tests) {

        log("Running " + tests.length + " tests");
        tests
            .reduce(function (prev, curr, index) { return prev.then(curr.bind(this, index + 1)); }, Promise.resolve())
            .then(function () { log("Tests complete"); })
            .catch(function (err) { logError(err); });

    }

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

                return idbLite.closeAll();

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

};
