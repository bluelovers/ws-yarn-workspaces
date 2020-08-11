"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleVersionRange = void 0;
const const_1 = require("./const");
function handleVersionRange(versionRange) {
    if (typeof versionRange === 'string') {
        return versionRange.replace(const_1.reHandleVersionRange, ' ').trim();
    }
    return versionRange;
}
exports.handleVersionRange = handleVersionRange;
//# sourceMappingURL=handleVersionRange.js.map