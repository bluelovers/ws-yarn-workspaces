"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prunedSimpleSemVer = exports.pruned = void 0;
const const_1 = require("../const");
/**
 * Returns a new object with all of the undefined properties removed from the given object
 */
function pruned(obj, o = {}) {
    for (const key in obj) {
        if ('undefined' !== typeof obj[key]) {
            o[key] = obj[key];
        }
    }
    return o;
}
exports.pruned = pruned;
function prunedSimpleSemVer(obj, o = {}) {
    for (const key of const_1.simpleSemVerKeys) {
        if ('undefined' !== typeof obj[key]) {
            // @ts-ignore
            o[key] = obj[key];
        }
    }
    return o;
}
exports.prunedSimpleSemVer = prunedSimpleSemVer;
exports.default = prunedSimpleSemVer;
//# sourceMappingURL=pruned.js.map