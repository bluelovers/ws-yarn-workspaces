"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasInvalidCharacter = hasInvalidCharacter;
exports.assertInvalidCharacter = assertInvalidCharacter;
exports.assertInvalidComparatorSet = assertInvalidComparatorSet;
const parseOptionsOrLoose_1 = require("../internal/parseOptionsOrLoose");
const const_1 = require("../const");
function hasInvalidCharacter(semver, optionsOrLoose) {
    return ((0, parseOptionsOrLoose_1.parseOptionsOrLoose)(optionsOrLoose).noAmpersand
        ? const_1.reInvalidCharacter
        : const_1.reInvalidCharacterOrAmpersand).test(semver);
}
function assertInvalidCharacter(semver, optionsOrLoose) {
    const m = semver.match((0, parseOptionsOrLoose_1.parseOptionsOrLoose)(optionsOrLoose).noAmpersand
        ? const_1.reInvalidCharacter
        : const_1.reInvalidCharacterOrAmpersand);
    if (m === null || m === void 0 ? void 0 : m.length) {
        throw new TypeError(`Invalid SemVer Character: '${m[0]}' at index ${m.index} of '${semver}'`);
    }
}
function assertInvalidComparatorSet(comparatorsSet, message) {
    if (!(comparatorsSet === null || comparatorsSet === void 0 ? void 0 : comparatorsSet.length) || !Array.isArray(comparatorsSet)) {
        throw new TypeError(message !== null && message !== void 0 ? message : `Invalid ComparatorSet: ${comparatorsSet}`);
    }
}
//# sourceMappingURL=assert.js.map