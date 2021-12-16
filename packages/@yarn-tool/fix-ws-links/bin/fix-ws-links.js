#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_1 = tslib_1.__importDefault(require("../index"));
const fix_ws_pkgs_link_1 = tslib_1.__importDefault(require("@yarn-tool/fix-ws-pkgs-link"));
let cwd = process.cwd();
console.log(`check and try fix links from: ${cwd}`);
(0, index_1.default)(cwd, {
    verbose: true,
    runYarnAfter: process.argv.includes('--runYarnAfter'),
});
let wsp = (0, fix_ws_pkgs_link_1.default)(cwd);
if (wsp.length) {
    console.log(`node_modules links fixed`);
    wsp.forEach(r => r.name);
}
//# sourceMappingURL=fix-ws-links.js.map