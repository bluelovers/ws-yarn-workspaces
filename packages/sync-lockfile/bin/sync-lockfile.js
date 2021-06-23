#!/usr/bin/env node
"use strict";
/**
 * Created by user on 2020/1/8.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const yargs_1 = (0, tslib_1.__importDefault)(require("yargs"));
const index_1 = (0, tslib_1.__importDefault)(require("../index"));
let argv = yargs_1.default
    .option('cwd', {
    alias: ['c'],
    default: process.cwd(),
    normalize: true,
    string: true,
})
    .option('silent', {
    boolean: true,
})
    .help(true)
    .showHelpOnFail(true)
    .argv;
(0, index_1.default)(argv.cwd, {
    print: !argv.silent,
});
//# sourceMappingURL=sync-lockfile.js.map