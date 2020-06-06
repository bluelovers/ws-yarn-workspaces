#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
let cwd = process.cwd();
console.log(`check and try fix links from: ${cwd}`);
index_1.default(cwd, {
    verbose: true,
    runYarnAfter: process.argv.includes('--runYarnAfter'),
});
//# sourceMappingURL=fix-ws-links.js.map