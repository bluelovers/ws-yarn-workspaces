#!/usr/bin/env node
"use strict";
/**
 * Created by user on 2020/1/8.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const index_1 = __importDefault(require("../index"));
let argv = yargs_1.default.
    option('cwd', {
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
index_1.default(argv.cwd, {
    print: !argv.silent
});
//# sourceMappingURL=sync-lockfile.js.map