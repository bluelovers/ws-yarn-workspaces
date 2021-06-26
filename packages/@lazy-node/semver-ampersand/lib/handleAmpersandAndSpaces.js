"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAmpersandAndSpaces = void 0;
const const_1 = require("./const");
function handleAmpersandAndSpaces(versionRange) {
    if (typeof versionRange === 'string') {
        return versionRange.replace(const_1.reAmpersandAndSpaces, ' ').trim();
    }
    return versionRange;
}
exports.handleAmpersandAndSpaces = handleAmpersandAndSpaces;
exports.default = handleAmpersandAndSpaces;
//# sourceMappingURL=handleAmpersandAndSpaces.js.map