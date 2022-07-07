#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const fix_ws_pkgs_link_1 = require("@yarn-tool/fix-ws-pkgs-link");
let cwd = process.cwd();
console.log(`check and try fix links from: ${cwd}`);
(0, index_1.fixYarnWorkspaceLinks)(cwd, {
    verbose: true,
    runYarnAfter: process.argv.includes('--runYarnAfter'),
});
let wsp = (0, fix_ws_pkgs_link_1.fixWorkspacesPackageLinks)(cwd);
if (wsp.length) {
    console.log(`node_modules links fixed`);
    wsp.forEach(r => r.name);
}
//# sourceMappingURL=fix-ws-links.js.map