const fs = require("fs");
const path = require("path");
const UglifyJS = require("uglify-js");
const raw_filename = path.resolve(__dirname, "../src/main.js");

console.log("Reading", raw_filename);
const content = fs.readFileSync(raw_filename).toString();

var exportKeys = [ "set", "get", "closeAll", "keys", "del", "clear", "Store" ];

generate("../dist/index-cjs.js", cjs);
generate("../dist/index.mjs", mjs);
generate("../dist/index-iife.js", iife);
generate("../dist/index-iife.min.js", miniife);

function generate(relative, strategy) {
    const filename = path.resolve(__dirname, relative);
    console.log("Generating", filename);
    fs.writeFileSync(filename, strategy(content));
}

function miniife(raw) {

    return UglifyJS.minify(iife(raw)).code;

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