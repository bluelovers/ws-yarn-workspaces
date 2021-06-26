"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.satisfies = void 0;
const tslib_1 = require("tslib");
const satisfies_1 = (0, tslib_1.__importDefault)(require("semver/functions/satisfies"));
const handleAmpersandAndSpaces_1 = require("./handleAmpersandAndSpaces");
function satisfies(version, range, optionsOrLoose) {
    return (0, satisfies_1.default)(version, (0, handleAmpersandAndSpaces_1.handleAmpersandAndSpaces)(range), optionsOrLoose);
}
exports.satisfies = satisfies;
exports.default = satisfies;
//# sourceMappingURL=satisfies.js.map