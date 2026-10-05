"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._isAddStaticFiles = _isAddStaticFiles;
exports._isAddStaticFilesWithReset = _isAddStaticFilesWithReset;
/**
 * 判定 noStaticFiles 與 addStaticFiles 的結果
 * Resolve the result of noStaticFiles and addStaticFiles
 *
 * - noStaticFiles = true 時，addStaticFiles 視為 false
 *   When noStaticFiles is true, addStaticFiles is treated as false
 * - 兩者皆未指定時，退回 defaultValue
 *   Falls back to defaultValue when neither is specified
 *
 * @param {IStaticFilesOptionsLike} [options] - 選項物件 / Options object
 * @param {boolean} [defaultValue=false] - addStaticFiles 未指定時的預設值 / Default when addStaticFiles is not given
 * @returns {boolean} 是否要加入靜態檔案 / Whether to add static files
 */
function _isAddStaticFiles(options, defaultValue) {
    var _a;
    if (options === null || options === void 0 ? void 0 : options.noStaticFiles) {
        return false;
    }
    return (_a = options === null || options === void 0 ? void 0 : options.addStaticFiles) !== null && _a !== void 0 ? _a : defaultValue;
}
/**
 * 判定 resetStaticFiles + 以上組合的結果
 * Resolve resetStaticFiles combined with the result above
 *
 * resetStaticFiles = true 時會強制觸發（優先於 noStaticFiles / addStaticFiles）
 * When resetStaticFiles is true it forces the add (takes precedence over noStaticFiles / addStaticFiles)
 *
 * @param {IStaticFilesOptionsLike} [options] - 選項物件 / Options object
 * @param {boolean} [defaultValue=false] - addStaticFiles 未指定時的預設值 / Default when addStaticFiles is not given
 * @returns {boolean} 是否要加入靜態檔案 / Whether to add static files
 */
function _isAddStaticFilesWithReset(options, defaultValue = false) {
    return !!(options === null || options === void 0 ? void 0 : options.resetStaticFiles) || _isAddStaticFiles(options, defaultValue);
}
//# sourceMappingURL=staticFiles.js.map