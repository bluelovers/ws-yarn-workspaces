"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validRange = void 0;
const tslib_1 = require("tslib");
const valid_1 = (0, tslib_1.__importDefault)(require("semver/ranges/valid"));
const handleAmpersandAndSpaces_1 = require("./handleAmpersandAndSpaces");
function validRange(range, optionsOrLoose) {
    return (0, valid_1.default)((0, handleAmpersandAndSpaces_1.handleAmpersandAndSpaces)(range), optionsOrLoose);
}
exports.validRange = validRange;
exports.default = validRange;
//# sourceMappingURL=validRange.js.map