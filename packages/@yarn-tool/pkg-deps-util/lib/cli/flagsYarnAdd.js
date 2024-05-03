"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flagsYarnAdd = flagsYarnAdd;
const lazyFlags_1 = require("../util/lazyFlags");
function flagsYarnAdd(argv) {
    return (0, lazyFlags_1.lazyFlags)([
        'dev',
        'peer',
        'optional',
        'exact',
        'tilde',
        'ignore-workspace-root-check',
        'audit',
    ], argv);
}
//# sourceMappingURL=flagsYarnAdd.js.map