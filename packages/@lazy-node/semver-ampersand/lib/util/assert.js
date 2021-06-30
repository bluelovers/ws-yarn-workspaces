"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertInvalidCharacter = exports.hasInvalidCharacter = void 0;
const tslib_1 = require("tslib");
const parse_options_1 = (0, tslib_1.__importDefault)(require("semver/internal/parse-options"));
const const_1 = require("../const");
function hasInvalidCharacter(semver, optionsOrLoose) {
    return ((0, parse_options_1.default)(optionsOrLoose).noAmpersand
        ? const_1.reInvalidCharacter
        : const_1.reInvalidCharacterOrAmpersand).test(semver);
}
exports.hasInvalidCharacter = hasInvalidCharacter;
function assertInvalidCharacter(semver, optionsOrLoose) {
    const m = semver.match((0, parse_options_1.default)(optionsOrLoose).noAmpersand
        ? const_1.reInvalidCharacter
        : const_1.reInvalidCharacterOrAmpersand);
    if (m === null || m === void 0 ? void 0 : m.length) {
        throw new TypeError(`Invalid SemVer Character: '${m[0]}' at index ${m.index} of '${semver}'`);
    }
}
exports.assertInvalidCharacter = assertInvalidCharacter;
//# sourceMappingURL=assert.js.map