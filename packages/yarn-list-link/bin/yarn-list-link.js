#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../core");
let cwd = process.cwd();
let ls = (0, core_1.yarnListLink)(cwd);
if (ls && ls.length) {
    ls.forEach(v => console.log(v));
}
else {
    console.error(`not exists any yarn link in path '${cwd}'`);
    process.exit(1);
}
//# sourceMappingURL=yarn-list-link.js.map