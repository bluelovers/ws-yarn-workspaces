#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const index_1 = __importDefault(require("../index"));
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
    .argv;
console.dir(index_1.default({
    ...argv,
    throwError: true,
}));
//# sourceMappingURL=node-modules-link.js.map