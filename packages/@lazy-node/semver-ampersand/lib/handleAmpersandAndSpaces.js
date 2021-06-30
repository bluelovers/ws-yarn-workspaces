"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAmpersandAndSpaces = void 0;
const const_1 = require("./const");
function handleAmpersandAndSpaces(versionRange, options) {
    if (typeof versionRange === 'string') {
        return versionRange.replace((options === null || options === void 0 ? void 0 : options.noAmpersand) ? const_1.reSpaces : const_1.reAmpersandAndSpaces, ' ').trim();
    }
    return versionRange;
}
exports.handleAmpersandAndSpaces = handleAmpersandAndSpaces;
exports.default = handleAmpersandAndSpaces;
//# sourceMappingURL=handleAmpersandAndSpaces.js.map