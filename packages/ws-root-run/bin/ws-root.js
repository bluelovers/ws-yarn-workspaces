#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
let argv = process.argv.slice(2);
let cp;
if (argv[0] === 'run') {
    index_1.spawnWsRootRunSync(argv.slice(1));
}
else if (argv[0] === 'exec') {
    index_1.spawnWsRootExecSync(argv.slice(1));
}
else {
    throw new Error(`failed spawn script, ${argv}`);
}
if (cp.status) {
    process.exit(cp.status);
}
//# sourceMappingURL=ws-root.js.map