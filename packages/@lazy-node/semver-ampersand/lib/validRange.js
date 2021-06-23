"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validRange = void 0;
const tslib_1 = require("tslib");
const valid_1 = (0, tslib_1.__importDefault)(require("semver/ranges/valid"));
const handleVersionRange_1 = require("./handleVersionRange");
function validRange(range, optionsOrLoose) {
    return (0, valid_1.default)((0, handleVersionRange_1.handleVersionRange)(range), optionsOrLoose);
}
exports.validRange = validRange;
exports.default = validRange;
//# sourceMappingURL=validRange.js.map