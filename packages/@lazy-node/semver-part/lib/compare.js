"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compare = compare;
exports.eq = eq;
exports.neq = neq;
exports.gt = gt;
exports.gte = gte;
exports.lt = lt;
exports.lte = lte;
exports.cmp = cmp;
exports.tryCompare = tryCompare;
const tslib_1 = require("tslib");
/**
 * Created by user on 2020/6/11.
 */
const _core_1 = require("./_core");
const compare_1 = tslib_1.__importDefault(require("semver/functions/compare"));
const cmp_1 = tslib_1.__importDefault(require("semver/functions/cmp"));
function compare(part1, part2, optionsOrLoose) {
    return (0, compare_1.default)(...(0, _core_1._part)(part1, part2), optionsOrLoose);
}
function eq(part1, part2, optionsOrLoose) {
    return compare(part1, part2, optionsOrLoose) === 0;
}
function neq(part1, part2, optionsOrLoose) {
    return compare(part1, part2, optionsOrLoose) !== 0;
}
function gt(part1, part2, optionsOrLoose) {
    return compare(part1, part2, optionsOrLoose) > 0;
}
function gte(part1, part2, optionsOrLoose) {
    return compare(part1, part2, optionsOrLoose) >= 0;
}
function lt(part1, part2, optionsOrLoose) {
    return compare(part1, part2, optionsOrLoose) < 0;
}
function lte(part1, part2, optionsOrLoose) {
    return compare(part1, part2, optionsOrLoose) <= 0;
}
function cmp(part1, operator, part2, optionsOrLoose) {
    const [v1, v2] = (0, _core_1._part)(part1, part2);
    return (0, cmp_1.default)(v1, operator, v2, optionsOrLoose);
}
function tryCompare(v1, v2, optionsOrLoose) {
    try {
        return compare(v1, v2, optionsOrLoose);
    }
    catch (e) { }
}
//# sourceMappingURL=compare.js.map