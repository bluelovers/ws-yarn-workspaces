"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maxSatisfying = void 0;
const tslib_1 = require("tslib");
const max_satisfying_1 = (0, tslib_1.__importDefault)(require("semver/ranges/max-satisfying"));
const handleVersionRange_1 = require("./handleVersionRange");
function maxSatisfying(versions, range, optionsOrLoose) {
    return (0, max_satisfying_1.default)(versions, (0, handleVersionRange_1.handleVersionRange)(range), optionsOrLoose);
}
exports.maxSatisfying = maxSatisfying;
exports.default = maxSatisfying;
//# sourceMappingURL=maxSatisfying.js.map