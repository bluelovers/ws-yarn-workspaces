"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.satisfies = satisfies;
const tslib_1 = require("tslib");
const satisfies_1 = tslib_1.__importDefault(require("semver/functions/satisfies"));
const handleAmpersandAndSpaces_1 = require("./handleAmpersandAndSpaces");
function satisfies(version, range, optionsOrLoose) {
    return (0, satisfies_1.default)(version, (0, handleAmpersandAndSpaces_1.handleAmpersandAndSpaces)(range), optionsOrLoose);
}
exports.default = satisfies;
//# sourceMappingURL=satisfies.js.map