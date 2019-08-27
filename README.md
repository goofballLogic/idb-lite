# idb-lite

Implementation of idb-keyval API

## file sizes

The tiny size of idb-keyval, as well as the possibility of treeshaking are important to the original project, so I list the files sizes here for comparison.

Some notes on the comparison:

1. In each case "idb-keyval" has been replaced with "index".
2. These files contain the extract function "closeAll" which closes connections to open databases

| file              | size       | idb-keyval size |
| ----------------- | ---------- | --------------- |
| index-cjs.js      | 1.79 KB    | 2.38 KB         |
| index-iife.js     | 1.88 KB    | 2.38 KB         |
| index-iife.min.js | 1000 Bytes | 1.06 KB         |
| index.mjs         | 1.77 KB    | 2.38 KB         |
