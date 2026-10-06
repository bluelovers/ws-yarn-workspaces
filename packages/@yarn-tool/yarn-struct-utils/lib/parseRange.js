"use strict";
/**
 * Yarn 範圍解析 (Range Parsing) 的型別化包裝
 * Typed wrapper around Yarn range parsing
 *
 * 轉呼叫 @yarnpkg/core 的 structUtils.parseRange，
 * 並透過條件型別讓回傳值隨選項收窄，
 * 使呼叫端在要求必填欄位時不必再手動斷言。
 * Delegates to structUtils.parseRange from @yarnpkg/core and narrows the return type
 * conditionally on the given options, so callers never need manual assertions for required fields.
 *
 * @module @yarn-tool/yarn-struct-utils/lib/parseRange
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRange = parseRange;
const core_1 = require("@yarnpkg/core");
/**
 * 解析 Yarn 範圍字串
 * Parse a Yarn range string
 *
 * @param {string} range - 範圍字串，例如 `npm:4.17.21` / Range string, e.g. `npm:4.17.21`
 * @param {IParseRangeOptions} [opts] - 驗證與解析選項 / Validation and parsing options
 * @returns {IParseRangeReturnType<Opts>} 依選項收窄後的解析結果 / Parse result narrowed by the given options
 *
 * @example
 * parseRange('npm:4.17.21', { requireProtocol: 'npm' }).protocol; // 'npm'
 */
function parseRange(range, opts) {
    /**
     * 純轉呼叫：所有語法細節都交給 @yarnpkg/core，
     * 本套件只負責型別，避免兩份實作日後偏離
     * Pure delegation: all syntax details live in @yarnpkg/core,
     * while this package only owns the types so the two implementations never drift apart
     */
    return core_1.structUtils.parseRange(range, opts);
}
//# sourceMappingURL=parseRange.js.map