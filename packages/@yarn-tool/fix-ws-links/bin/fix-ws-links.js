#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_1 = (0, tslib_1.__importDefault)(require("../index"));
let cwd = process.cwd();
console.log(`check and try fix links from: ${cwd}`);
(0, index_1.default)(cwd, {
    verbose: true,
    runYarnAfter: process.argv.includes('--runYarnAfter'),
});
//# sourceMappingURL=fix-ws-links.js.map