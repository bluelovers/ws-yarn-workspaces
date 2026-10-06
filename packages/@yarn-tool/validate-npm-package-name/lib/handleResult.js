"use strict";
/**
 * 組合驗證結果並計算有效性旗標
 * Combine validation results and compute the validity flags
 *
 * @module @yarn-tool/validate-npm-package-name/lib/handleResult
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleResult = handleResult;
/**
 * 依 warnings 與 errors 產生最終驗證結果
 * Produce the final validation result from warnings and errors
 *
 * `validForNewPackages` 要求完全沒有警告與錯誤，
 * `validForOldPackages` 只排除錯誤——這正是區分「新名稱」與「舊名稱」的方式。
 * `validForNewPackages` requires both warnings and errors to be empty,
 * while `validForOldPackages` only excludes errors — this is what separates "new name" from "legacy name".
 *
 * @param {string[]} warnings - 警告訊息 / Warning messages
 * @param {string[]} errors - 錯誤訊息 / Error messages
 * @returns {IResult} 驗證結果；空陣列會被移除以免佔用回傳物件 / Validation result; empty arrays are dropped to keep the payload small
 */
function handleResult(warnings, errors) {
    const result = {
        validForNewPackages: errors.length === 0 && warnings.length === 0,
        validForOldPackages: errors.length === 0,
        warnings: warnings,
        errors: errors,
    };
    /**
     * 空的 warnings/errors 對呼叫端沒有資訊量，
     * 刪除後可讓成功的結果保持精簡、也較易序列化
     * Empty warnings/errors carry no information for callers;
     * deleting them keeps a passing result compact and easier to serialize
     */
    if (!result.warnings.length)
        delete result.warnings;
    if (!result.errors.length)
        delete result.errors;
    return result;
}
//# sourceMappingURL=handleResult.js.map