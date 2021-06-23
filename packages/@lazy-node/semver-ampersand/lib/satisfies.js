"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.satisfies = void 0;
const tslib_1 = require("tslib");
const satisfies_1 = (0, tslib_1.__importDefault)(require("semver/functions/satisfies"));
const handleVersionRange_1 = require("./handleVersionRange");
function satisfies(version, range, optionsOrLoose) {
    return (0, satisfies_1.default)(version, (0, handleVersionRange_1.handleVersionRange)(range), optionsOrLoose);
}
exports.satisfies = satisfies;
exports.default = satisfies;
//# sourceMappingURL=satisfies.js.map