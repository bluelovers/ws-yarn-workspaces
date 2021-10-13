#!/usr/bin/env node
"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const upath2_1 = require("upath2");
let argv = process.argv.slice(2);
let input = (0, upath2_1.resolve)(process.cwd(), (_a = argv[0]) !== null && _a !== void 0 ? _a : '');
console.log(`input: ${input}`);
const file = (0, index_1.getWorkspacesRootChangelogPath)(input);
const cwd = (0, upath2_1.dirname)(file);
console.log(`target dir: ${cwd}`);
let ret = (0, index_1.outputWorkspacesRootChangelog)(cwd, file);
console.log(`output file: ${ret.file}`);
//# sourceMappingURL=ws-root-changelog.js.map