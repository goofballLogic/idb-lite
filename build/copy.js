const fs = require("fs");
const path = require("path");

function copy(relativeFrom, relativeTo) {

    const x = path.resolve(__dirname, relativeFrom);
    const y = path.resolve(__dirname, relativeTo);
    console.log( "Copying", x, "to", y);
    fs.copyFileSync(x, y);
}
copy("../src/main.d.ts", "../dist/index.d.ts");

// this is a work around for TypeScript's current inability to import .mjs files
copy("../dist/index.mjs", "../dist/index.module.js");
copy("../src/main.d.ts", "../dist/index.module.d.ts");