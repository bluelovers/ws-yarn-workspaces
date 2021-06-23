"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minSatisfying = void 0;
const tslib_1 = require("tslib");
const min_satisfying_1 = (0, tslib_1.__importDefault)(require("semver/ranges/min-satisfying"));
const handleVersionRange_1 = require("./handleVersionRange");
function minSatisfying(versions, range, optionsOrLoose) {
    return (0, min_satisfying_1.default)(versions, (0, handleVersionRange_1.handleVersionRange)(range), optionsOrLoose);
}
exports.minSatisfying = minSatisfying;
exports.default = minSatisfying;
//# sourceMappingURL=minSatisfying.js.map