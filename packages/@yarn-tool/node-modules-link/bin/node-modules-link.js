#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const yargs_1 = tslib_1.__importDefault(require("yargs"));
const index_1 = tslib_1.__importDefault(require("../index"));
let argv = yargs_1.default
    .option('name', {
    string: true,
})
    .option('targetNodeModulesPath', {
    string: true,
    normalize: true,
})
    .option('sourcePackagePath', {
    string: true,
    normalize: true,
})
    .option('cwd', {
    string: true,
    normalize: true,
})
    .option('targetNodeModulesName', {
    string: true,
})
    .option('skipCheckWorkspace', {
    alias: [
        'W',
    ],
    boolean: true,
})
    .parseSync();
console.dir((0, index_1.default)({
    ...argv,
    throwError: true,
}));
//# sourceMappingURL=node-modules-link.js.map