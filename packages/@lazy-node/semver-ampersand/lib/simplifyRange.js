"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simplifyRange = simplifyRange;
const tslib_1 = require("tslib");
const simplify_1 = tslib_1.__importDefault(require("semver/ranges/simplify"));
const handleAmpersandAndSpaces_1 = require("./handleAmpersandAndSpaces");
function simplifyRange(ranges, range, options) {
    return (0, simplify_1.default)(ranges, (0, handleAmpersandAndSpaces_1.handleAmpersandAndSpaces)(range), options);
}
exports.default = simplifyRange;
//# sourceMappingURL=simplifyRange.js.map