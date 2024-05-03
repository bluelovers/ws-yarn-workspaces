"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minSatisfying = minSatisfying;
const tslib_1 = require("tslib");
const min_satisfying_1 = tslib_1.__importDefault(require("semver/ranges/min-satisfying"));
const handleAmpersandAndSpaces_1 = require("./handleAmpersandAndSpaces");
function minSatisfying(versions, range, optionsOrLoose) {
    return (0, min_satisfying_1.default)(versions, (0, handleAmpersandAndSpaces_1.handleAmpersandAndSpaces)(range), optionsOrLoose);
}
exports.default = minSatisfying;
//# sourceMappingURL=minSatisfying.js.map