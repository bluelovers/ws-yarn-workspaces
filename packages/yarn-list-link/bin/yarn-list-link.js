#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __importDefault(require("../core"));
let cwd = process.cwd();
let ls = core_1.default(cwd);
if (ls && ls.length) {
    ls.forEach(v => console.log(v));
}
else {
    console.error(`not exists any yarn link in path '${cwd}'`);
    process.exit(1);
}
//# sourceMappingURL=yarn-list-link.js.map