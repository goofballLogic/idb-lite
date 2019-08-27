# idb-lite

Implementation of @jakearchibald 's excellent idb-keyval API. See https://github.com/jakearchibald/idb-keyval for the original.

## Purpose

The intent of this version is to add some functionality not included in Jake's version, including:

1. Allows multiple stores within the same browser session
2. Reuse connection to same underlying store (helps in older versions of IE)
3. Work in ES5+

## Important differences

Care has been taken to replicate the API of the original library. However, note that certain "private" properties are not currently exposed (e.g. the _dbp property of a Store object). Feel free to suggest additions if you need these.

Because this library reuses the same underlying connection when database and store match, they will not be automatically closed when references are released. You should use the `closeAll` method to close connections if you are worried about releasing this memory. Although this could be achieved automatically using a WeakMap, we have chosen not to do so at this time (as it would create a breaking change between older and newer browsers).

## File sizes

The tiny size of idb-keyval, as well as support for treeshaking, are important characteristics of the original library, so care has been taken to produce assets which are at least no bigger than the originals.

Some notes on the comparison:

1. In each case "idb-keyval" has been replaced with "index".
2. These files contain the extract function "closeAll" which closes connections to open databases
3. File sizes are as reported when viewed in GitHub on 2019-08-27

| file              | size       | idb-keyval size |
| ----------------- | ---------- | --------------- |
| index-cjs.js      | 1.79 KB    | 2.38 KB         |
| index-iife.js     | 1.88 KB    | 2.38 KB         |
| index-iife.min.js | 1000 Bytes | 1.06 KB         |
| index.mjs         | 1.77 KB    | 2.38 KB         |
