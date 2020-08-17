"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flagsYarnAdd = void 0;
const lazyFlags_1 = require("../util/lazyFlags");
function flagsYarnAdd(argv) {
    return lazyFlags_1.lazyFlags([
        'dev',
        'peer',
        'optional',
        'exact',
        'tilde',
        'ignore-workspace-root-check',
        'audit',
    ], argv);
}
exports.flagsYarnAdd = flagsYarnAdd;
//# sourceMappingURL=flagsYarnAdd.js.map