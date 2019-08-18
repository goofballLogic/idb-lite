const fs = require("fs");
const path = require("path");
const raw_filename = path.resolve(__dirname, "../src.js");

console.log("Reading", raw_filename);
const content = fs.readFileSync(raw_filename).toString();

var exportKeys = [ "set", "get", "closeAll", "keys", "del", "clear", "Store" ];

generate("../index.js", cjs);
generate("../index.mjs", mjs);
generate("../index-browser.js", iife);

function generate(relative, strategy) {
    const filename = path.resolve(__dirname, relative);
    console.log("Generating", filename);
    fs.writeFileSync(filename, strategy(content));
}

function iife(raw) {

    var assignments = exportKeys.map( x => `ns.${x} = ${x};` ).join( "\n" );
    return `(function(ns) { ${assignments}\n${raw}\n}(window.idbLite = {}));`

}

function mjs(raw) {

    return exportKeys.reduce((prev, key) => {
        return prev.replace( new RegExp("^function\\s*" + key + "\\(", "m"), "export $&" );
    }, raw);

}

function cjs(raw) {

    return `module.exports={ ${exportKeys.join(", ")} };\n\n${raw}\n`;

}