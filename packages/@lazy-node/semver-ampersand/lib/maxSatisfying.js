"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maxSatisfying = void 0;
const tslib_1 = require("tslib");
const max_satisfying_1 = (0, tslib_1.__importDefault)(require("semver/ranges/max-satisfying"));
const handleAmpersandAndSpaces_1 = require("./handleAmpersandAndSpaces");
function maxSatisfying(versions, range, optionsOrLoose) {
    return (0, max_satisfying_1.default)(versions, (0, handleAmpersandAndSpaces_1.handleAmpersandAndSpaces)(range), optionsOrLoose);
}
exports.maxSatisfying = maxSatisfying;
exports.default = maxSatisfying;
//# sourceMappingURL=maxSatisfying.js.map