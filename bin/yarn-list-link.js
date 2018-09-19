#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
let cwd = process.cwd();
let ls = __1.default(cwd);
if (ls && ls.length) {
    ls.forEach(v => console.log(v));
}
else {
    console.error(`not exists any yarn link in path '${cwd}'`);
    process.exit(1);
}
