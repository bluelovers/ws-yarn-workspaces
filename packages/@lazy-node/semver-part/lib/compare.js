"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryCompare = exports.cmp = exports.lte = exports.lt = exports.gte = exports.gt = exports.neq = exports.eq = exports.compare = void 0;
const tslib_1 = require("tslib");
/**
 * Created by user on 2020/6/11.
 */
const _core_1 = require("./_core");
const compare_1 = (0, tslib_1.__importDefault)(require("semver/functions/compare"));
const cmp_1 = (0, tslib_1.__importDefault)(require("semver/functions/cmp"));
function compare(part1, part2, optionsOrLoose) {
    return (0, compare_1.default)(...(0, _core_1._part)(part1, part2), optionsOrLoose);
}
exports.compare = compare;
function eq(part1, part2, optionsOrLoose) {
    return compare(part1, part2, optionsOrLoose) === 0;
}
exports.eq = eq;
function neq(part1, part2, optionsOrLoose) {
    return compare(part1, part2, optionsOrLoose) !== 0;
}
exports.neq = neq;
function gt(part1, part2, optionsOrLoose) {
    return compare(part1, part2, optionsOrLoose) > 0;
}
exports.gt = gt;
function gte(part1, part2, optionsOrLoose) {
    return compare(part1, part2, optionsOrLoose) >= 0;
}
exports.gte = gte;
function lt(part1, part2, optionsOrLoose) {
    return compare(part1, part2, optionsOrLoose) < 0;
}
exports.lt = lt;
function lte(part1, part2, optionsOrLoose) {
    return compare(part1, part2, optionsOrLoose) <= 0;
}
exports.lte = lte;
function cmp(part1, operator, part2, optionsOrLoose) {
    const [v1, v2] = (0, _core_1._part)(part1, part2);
    return (0, cmp_1.default)(v1, operator, v2, optionsOrLoose);
}
exports.cmp = cmp;
function tryCompare(v1, v2, optionsOrLoose) {
    try {
        return compare(v1, v2, optionsOrLoose);
    }
    catch (e) { }
}
exports.tryCompare = tryCompare;
//# sourceMappingURL=compare.js.map