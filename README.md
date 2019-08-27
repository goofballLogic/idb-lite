:sparkles: **PSA - this is an alpha version. Not tested in older browsers yet. File issues at will...** :sparkles:

# idb-lite

[![size](http://img.badgesize.io/https://cdn.jsdelivr.net/npm/idb-lite/dist/index-iife.min.js?compression=gzip)]

Implementation of [@jakearchibald](https://github.com/jakearchibald)'s excellent idb-keyval API. See https://github.com/jakearchibald/idb-keyval for the original.

## Purpose

The intent of this version is to add some functionality not included in Jake's version, including:

1. Allows multiple stores within the same browser session
2. Reuse connection to same underlying store (helps in older versions of IE)
3. Allow explicit closing of database connections
4. **TBD** Allow multiple stores per database (https://github.com/goofballLogic/idb-lite/issues/1)

It also includes tests which can easily be executed in various different browsers

## Important differences

### Private API

Care has been taken to replicate the API of the original library. However, note that certain "private" properties are not currently exposed (e.g. the _dbp property of a Store object). Feel free to suggest additions if you need these.

### Closing database connections

Because this library reuses the same underlying connection when database and store match, they will not be automatically closed when references are released. You should use the `closeAll` method to close connections if you are worried about releasing this memory. Although this could be achieved automatically using a WeakMap, we have chosen not to do so at this time (as it would create a breaking change between older and newer browsers).

### Implementation

The original library is written in typescript and compiled down to ES6 and ES5. This version is written in ES5, with a manually written typescript definition file. It also avoids class constructs and the original's "private" API, producing a slightly smaller output.

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

## Building

`npm run build` or `npm run build_watch`

## Building tests

N.B. You only need to "build" the typescript tests - all others are written by hand.
`npm run build_ts_tests` or `npm run build_ts_tests_watch`

## Running tests

Tests are deliberately manually executed by loading a browser page to ease with testing in legacy browsers.

`npm run test` then navigate to `http://localhost:8080/tests`

## Documentation

As this is an implementation of a pre-defined API, please use the documentation found at https://github.com/jakearchibald/idb-keyval.

### Extended functionality

#### closeAll

This function returns a promise to close all the database connections that have been opened in this session
