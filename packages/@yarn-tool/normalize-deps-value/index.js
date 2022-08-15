"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeDepsValue = exports._getNpaResult = exports.normalizeResultToDepsValue = void 0;
const npm_package_arg_util_1 = require("@yarn-tool/npm-package-arg-util");
const buildRangeSet_1 = require("@lazy-node/semver-ampersand/lib/range/buildRangeSet");
const stringifyRangeSet_1 = require("@lazy-node/semver-ampersand/lib/range/stringifyRangeSet");
const toRangeString_1 = require("@lazy-node/semver-ampersand/lib/range/toRangeString");
const Range_1 = require("@lazy-node/semver-ampersand/lib/Range");
const FAKE_NAME = '@fake/fake';
function normalizeResultToDepsValue(result) {
    let value;
    if (typeof result === 'string') {
        value = result;
    }
    else if (result) {
        if (result.type === 'range') {
            const rangeSet = (0, buildRangeSet_1.buildRangeSet)(result.rawSpec);
            value = (0, toRangeString_1.toRangeString)((0, stringifyRangeSet_1.stringifyRangeSet)(rangeSet));
        }
        else if (result.type === 'tag' && result.rawSpec === "" /* EnumSemverVersion.ANY */ && result.raw !== `${FAKE_NAME}@`) {
            value = result.name;
        }
        else {
            value = result.rawSpec;
        }
    }
    if (value === "" /* EnumSemverVersion.ANY */) {
        value = void 0;
    }
    return value !== null && value !== void 0 ? value : "*" /* EnumSemverVersion.STAR */;
}
exports.normalizeResultToDepsValue = normalizeResultToDepsValue;
function _getNpaResult(value) {
    let result;
    try {
        let sr = new Range_1.SemverRange(value);
        result = (0, npm_package_arg_util_1.npa)(`${FAKE_NAME}@${value}`);
    }
    catch (e) {
        try {
            result = (0, npm_package_arg_util_1.npa)(`${value}`);
        }
        catch (e) {
            try {
                result = (0, npm_package_arg_util_1.npa)(`${FAKE_NAME}@${value}`);
            }
            catch (e2) {
                throw e;
            }
        }
    }
    return result;
}
exports._getNpaResult = _getNpaResult;
function normalizeDepsValue(value) {
    const result = _getNpaResult(value);
    return normalizeResultToDepsValue(result);
}
exports.normalizeDepsValue = normalizeDepsValue;
exports.default = normalizeDepsValue;
//# sourceMappingURL=index.js.map