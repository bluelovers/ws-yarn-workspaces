"use strict";
/**
 * @lazy-node/semver-parse 版本字串化器
 * Version stringifier for @lazy-node/semver-parse
 *
 * 此模組提供 semver 物件轉換為字串的功能
 * This module provides functionality to convert semver objects to strings
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifySimpleSemVer = stringifySimpleSemVer;
exports.stringifySemverFull = stringifySemverFull;
const checker_1 = require("./checker");
/**
 * 將 semver 物件轉換為版本字串
 * Convert a semver object to a version string
 *
 * 將 SimpleSemVer 物件轉換為標準版本字串格式。
 * 不包含運算子，僅返回版本部分。
 *
 * Converts a SimpleSemVer object to standard version string format.
 * Does not include operator, returns only the version part.
 *
 * @param {ISimpleSemVerObject | SimpleSemVer} obj - semver 物件 / Semver object
 * @returns {string} 版本字串 / Version string
 * @throws {TypeError} 當物件不是有效的版本物件時 / When object is not a valid version object
 *
 * @example
 * ```typescript
 * stringifySimpleSemVer({ major: '1', minor: '2', patch: '3' });
 * // => '1.2.3'
 *
 * stringifySimpleSemVer({ major: '1', minor: '0', patch: '0', release: 'beta.1' });
 * // => '1.0.0-beta.1'
 *
 * stringifySimpleSemVer({ major: '1', minor: '0', patch: '0', build: 'build.123' });
 * // => '1.0.0+build.123'
 *
 * stringifySimpleSemVer({ major: '1', minor: '0', patch: '0', release: 'beta.1', build: 'build.123' });
 * // => '1.0.0-beta.1+build.123'
 *
 * // 缺少的版本部分會以 '0' 填充 / Missing version parts are filled with '0'
 * stringifySimpleSemVer({ major: '1' });
 * // => '1.0.0'
 * ```
 */
function stringifySimpleSemVer(obj, options) {
    var _a, _b, _c, _d, _e;
    // 斷言物件為有效的版本物件
    // Assert object is a valid version object
    (0, checker_1.assertSimpleSemVerObjectLike)(obj);
    let str = '';
    // 組合主版本號 / Compose major version
    str += (_a = obj.major) !== null && _a !== void 0 ? _a : '0';
    str += '.';
    // 組合次版本號 / Compose minor version
    str += (_b = obj.minor) !== null && _b !== void 0 ? _b : '0';
    str += '.';
    // 組合修補版本號 / Compose patch version
    str += (_c = obj.patch) !== null && _c !== void 0 ? _c : '0';
    if (!(options === null || options === void 0 ? void 0 : options.removeRelease)) {
        // 添加預發布標籤 / Add pre-release tag
        if (((_d = obj.release) === null || _d === void 0 ? void 0 : _d.length) > 0) {
            str += "-" /* EnumVersionExtra.release */ + obj.release;
        }
        // 添加建置元資料 / Add build metadata
        if (!(options === null || options === void 0 ? void 0 : options.removeBuild) && ((_e = obj.build) === null || _e === void 0 ? void 0 : _e.length) > 0) {
            str += "+" /* EnumVersionExtra.build */ + obj.build;
        }
    }
    return str;
}
/**
 * 將 semver 物件轉換為完整版本字串（含運算子）
 * Convert a semver object to full version string (with operator)
 *
 * 將 SimpleSemVer 物件轉換為包含運算子的完整版本字串。
 *
 * Converts a SimpleSemVer object to full version string including operator.
 *
 * @param {ISimpleSemVerObject | SimpleSemVer} obj - semver 物件 / Semver object
 * @returns {string} 完整版本字串 / Full version string
 *
 * @example
 * ```typescript
 * stringifySemverFull({ operator: '>=', major: '1', minor: '2', patch: '3' });
 * // => '>=1.2.3'
 *
 * stringifySemverFull({ operator: '^', major: '1', minor: '0', patch: '0', release: 'beta.1' });
 * // => '^1.0.0-beta.1'
 *
 * stringifySemverFull({ major: '1', minor: '0', patch: '0' });
 * // => '1.0.0' (無運算子 / No operator)
 * ```
 */
function stringifySemverFull(obj) {
    var _a;
    return ((_a = obj.operator) !== null && _a !== void 0 ? _a : '') + stringifySimpleSemVer(obj);
}
exports.default = stringifySimpleSemVer;
//# sourceMappingURL=stringifySimpleSemVer.js.map