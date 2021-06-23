#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = (0, tslib_1.__importDefault)(require("../core"));
let cwd = process.cwd();
let ls = (0, core_1.default)(cwd);
if (ls && ls.length) {
    ls.forEach(v => console.log(v));
}
else {
    console.error(`not exists any yarn link in path '${cwd}'`);
    process.exit(1);
}
//# sourceMappingURL=yarn-list-link.js.map