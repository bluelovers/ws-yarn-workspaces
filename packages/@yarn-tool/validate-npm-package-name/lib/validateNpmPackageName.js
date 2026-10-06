"use strict";
/**
 * npm 套件名稱驗證的對外入口
 * Public entry of npm package name validation
 *
 * 在核心規則之上補上 scoped 套件切分、throwErr 選項
 * 與參數相容處理。
 * Builds on the core rules by adding scoped package splitting,
 * the throwErr option, and argument compatibility handling.
 *
 * @module @yarn-tool/validate-npm-package-name/lib/validateNpmPackageName
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNpmPackageName = validateNpmPackageName;
const validateNpmPackageNameCore_1 = require("./validateNpmPackageNameCore");
const types_1 = require("./types");
/**
 * 驗證 npm 套件名稱
 * Validate an npm package name
 *
 * @param {string} name - 待驗證的名稱 / The name to validate
 * @param {boolean | IOptions} [options] - 布林值相容舊版 throwErr 用法，或完整選項物件 /
 * A boolean for the legacy throwErr shorthand, or the full options object
 * @returns {IValidateNpmPackageNameReturnType} 附帶名稱與 scope 資訊的驗證結果 / Validation result enriched with name and scope info
 * @throws {RangeError} 設定 throwErr 且驗證發生錯誤時 / When throwErr is set and validation produced errors
 *
 * @example
 * validateNpmPackageName('@npm/thingy');
 * // => { validForNewPackages: true, scopedPackagePattern: true, user: 'npm', subname: 'thingy', ... }
 */
function validateNpmPackageName(name, options) {
    var _a;
    /**
     * 舊版 API 允許直接傳布林值作為第二個參數，
     * 此處轉成物件以維持向後相容
     * The legacy API allowed a plain boolean as the second argument;
     * it is wrapped into an object here to stay backward compatible
     */
    if (typeof options !== 'object') {
        options = {
            throwErr: options,
        };
    }
    const ret = (0, validateNpmPackageNameCore_1.validate)(name, options);
    /**
     * 核心不保留原始輸入，補回讓呼叫端能取得被驗證的名稱
     * The core does not keep the raw input; it is attached back so callers can read the validated name
     */
    ret.name = name;
    /**
     * 只有在沒有錯誤時才嘗試切分 scope：
     * 錯誤名稱的切分結果沒有意義，也避免誤導呼叫端
     * Scope splitting is attempted only when there are no errors:
     * splitting an invalid name is meaningless and would mislead the caller
     */
    if (!((_a = ret.errors) === null || _a === void 0 ? void 0 : _a.length)) {
        const nameMatch = name.match(types_1.scopedPackagePattern);
        if (nameMatch) {
            ret.scopedPackagePattern = true;
            ret.user = nameMatch[1];
            ret.subname = nameMatch[2];
        }
        else {
            ret.scopedPackagePattern = false;
        }
    }
    /**
     * throwErr 只在有錯誤時生效，警告仍以回傳值表達，
     * 讓呼叫端可以只對致命錯誤中斷流程
     * throwErr only takes effect when there are errors; warnings stay in the return value,
     * so callers can halt only on fatal problems
     */
    else if (options.throwErr) {
        throw new RangeError(ret.errors.concat(ret.warnings || []).join(' ; '));
    }
    return ret;
}
exports.default = validateNpmPackageName;
//# sourceMappingURL=validateNpmPackageName.js.map