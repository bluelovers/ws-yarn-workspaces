"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSamePath = isSamePath;
const path_1 = require("path");
const path_is_same_1 = require("path-is-same");
/**
 * @deprecated
 */
function isSamePath(p1, p2) {
    if (!p1 || !p2) {
        return false;
    }
    else if ((0, path_is_same_1.pathIsSame)(p1, p2)) {
        return true;
    }
    let s = (0, path_1.relative)(p1, p2);
    return (s === '.' || s === '');
}
//# sourceMappingURL=util.js.map