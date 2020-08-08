"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.simplifyRange = exports.validRange = exports.minSatisfying = exports.maxSatisfying = exports.satisfies = exports.handleVersionRange = void 0;
const satisfies_1 = __importDefault(require("semver/functions/satisfies"));
const max_satisfying_1 = __importDefault(require("semver/ranges/max-satisfying"));
const min_satisfying_1 = __importDefault(require("semver/ranges/min-satisfying"));
const valid_1 = __importDefault(require("semver/ranges/valid"));
const simplify_1 = __importDefault(require("semver/ranges/simplify"));
function handleVersionRange(versionRange) {
    if (typeof versionRange === 'string') {
        return versionRange.replace(/[&\s]+/g, ' ').trim();
    }
    return versionRange;
}
exports.handleVersionRange = handleVersionRange;
function satisfies(version, range, optionsOrLoose) {
    return satisfies_1.default(version, handleVersionRange(range), optionsOrLoose);
}
exports.satisfies = satisfies;
function maxSatisfying(versions, range, optionsOrLoose) {
    return max_satisfying_1.default(versions, handleVersionRange(range), optionsOrLoose);
}
exports.maxSatisfying = maxSatisfying;
function minSatisfying(versions, range, optionsOrLoose) {
    return min_satisfying_1.default(versions, handleVersionRange(range), optionsOrLoose);
}
exports.minSatisfying = minSatisfying;
function validRange(range, optionsOrLoose) {
    return valid_1.default(handleVersionRange(range), optionsOrLoose);
}
exports.validRange = validRange;
function simplifyRange(ranges, range, options) {
    return simplify_1.default(ranges, handleVersionRange(range), options);
}
exports.simplifyRange = simplifyRange;
exports.default = {
    satisfies,
    maxSatisfying,
    minSatisfying,
    validRange,
    simplifyRange,
    handleVersionRange,
};
//# sourceMappingURL=index.js.map