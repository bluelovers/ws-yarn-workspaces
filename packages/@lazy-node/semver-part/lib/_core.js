"use strict";
/**
 * 核心版本部分處理工具 / Core version part handling utilities
 *
 * @module @lazy-node/semver-part/lib/_core
 *
 * 此模組提供內部工具函數，用於將版本部分字串轉換為有效的 semver 版本字串。
 * This module provides internal utility functions for converting version part
 * strings into valid semver version strings.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports._versionUnsafe = _versionUnsafe;
exports._versionSafe = _versionSafe;
exports._part = _part;
exports.partsToVersion = partsToVersion;
exports.versionToParts = versionToParts;
/**
 * 將部分版本轉換為不安全的完整版本字串
 * Convert a partial version to an unsafe full version string
 *
 * 當版本部分不完整時，使用 0.0.x 格式填補
 * When version parts are incomplete, pads with 0.0.x format
 *
 * @param part - 版本部分字串 / Version part string
 * @param defaultValue - 預設值 / Default value
 * @returns 完整版本字串 / Full version string
 *
 * @example
 * ```typescript
 * _versionUnsafe('5'); // '0.0.5'
 * _versionUnsafe('5', '10'); // '0.0.5'
 * _versionUnsafe(undefined, '10'); // '0.0.10'
 * ```
 */
function _versionUnsafe(part, defaultValue) {
    var _a;
    return `0.0.${(_a = part !== null && part !== void 0 ? part : defaultValue) !== null && _a !== void 0 ? _a : 0}`;
}
/**
 * 將部分版本安全地轉換為完整版本字串
 * Safely convert a partial version to a full version string
 *
 * 嘗試智慧地補全版本字串
 * Attempts to intelligently complete version strings
 *
 * @param part - 版本部分字串 / Version part string
 * @returns 完整版本字串 / Full version string
 *
 * @example
 * ```typescript
 * _versionSafe('1.2.3'); // '1.2.3' (已是完整版本)
 * _versionSafe('2.3'); // '0.2.3' (補上 major)
 * _versionSafe('5'); // '0.0.5' (僅有 patch)
 * ```
 */
function _versionSafe(part) {
    /**
     * 已具備 major.minor 前綴（如 1.2.3、1.2.3-beta）者直接沿用，
     * 避免重新補齊時改寫 pre-release / build 等既有版本語意。
     * Already carries a major.minor prefix (e.g. 1.2.3, 1.2.3-beta) → reuse
     * as-is, so re-padding never rewrites pre-release/build semantics.
     */
    if (/^\d+\.\d+\./.test(part)) {
        return part;
    }
    /**
     * 只有兩段的形式（如 2.3、9.3-alpha）補上 major 0，
     * 因為 semver 必須具備三段才會被視為可解析的版本。
     * Two-segment form (e.g. 2.3, 9.3-alpha) gets major 0 prefixed, because
     * semver only parses as valid when three segments are present.
     */
    else if (/^\d+\.(?:[^\.]+)$/.test(part)) {
        return '0.' + part;
    }
    /**
     * 其餘形式（單一數字、含非數字字元等）無法推斷缺少的段落，
     * 退回 0.0.x 補齊以維持函式回傳值永遠是完整版本字串。
     * Any other shape (single number, non-numeric chars, …) gives no clue
     * about the missing segment, so fall back to 0.0.x padding to keep the
     * return value a complete version string in every case.
     */
    return _versionUnsafe(part);
}
/**
 * 將兩個版本部分標準化為相同格式的完整版本
 * Normalize two version parts to full versions of the same format
 *
 * 根據輸入的版本部分格式，智慧地選擇適當的補全策略
 * Intelligently selects appropriate completion strategy based on input format
 *
 * @param part1 - 第一個版本部分 / First version part
 * @param part2 - 第二個版本部分 / Second version part
 * @returns 標準化後的版本元組 / Normalized version tuple
 *
 * @example
 * ```typescript
 * _part('1.2.3', '1.3.0'); // ['1.2.3', '1.3.0']
 * _part('2.3', '3.4'); // ['0.2.3', '0.3.4']
 * _part('5', '10'); // ['0.0.5', '0.0.10']
 * ```
 */
function _part(part1, part2) {
    /**
     * 兩者皆為三段以上的完整形式 → 直接沿用，
     * 不補齊可保留 pre-release（如 beta/rc）的原始語意。
     * Both are complete (3+ segments) → use as-is; skipping padding keeps
     * pre-release (beta/rc) semantics untouched.
     */
    if (/^\d+\.\d+\./.test(part1) && /^\d+\.\d+\./.test(part2)) {
        return [part1, part2];
    }
    /**
     * 兩者皆為兩段形式 → 同時補上 major 0，
     * 讓兩邊格式一致，比較結果才不會因補齊方式不同而失真。
     * Both are two-segment → pad both with major 0 so the two sides share
     * the same shape; otherwise mismatched padding would skew the result.
     */
    else if (/^\d+\.(?:[^\.]+)$/.test(part1) && /^\d+\.(?:[^\.]+)$/.test(part2)) {
        return ['0.' + part1, '0.' + part2];
    }
    /**
     * 格式混雜（或任一方無法推斷段落）→ 一律退回 0.0.x 補齊；
     * 此處刻意不猜測格式，只求兩邊以相同規則標準化。
     * 注意邊界情況：若一方已是完整三段、另一方卻不完整，
     * 完整方會被再補上 0.0 前綴而產生非標準版本字串，
     * 因此混用長度不同的版本部分前應先自行對齊格式。
     * Mixed shapes (or either side is unpaddable) → always fall back to
     * 0.0.x padding; no format guessing here, only one consistent rule.
     * Boundary case: when one side is a full 3-segment version and the other
     * is not, the full side gains a 0.0 prefix and yields a non-standard
     * string — align the formats yourself before mixing part lengths.
     */
    return [_versionUnsafe(part1), _versionUnsafe(part2)];
}
/**
 * 將版本部分陣列合併為版本字串
 * Join version parts array into a version string
 *
 * @param parts - 版本部分陣列 / Array of version parts
 * @returns 版本字串 / Version string
 *
 * @example
 * ```typescript
 * partsToVersion(['1', '2', '3']); // '1.2.3'
 * partsToVersion(['1', '2', '3', 'beta']); // '1.2.3.beta'
 * ```
 */
function partsToVersion(parts) {
    return parts.join('.');
}
/**
 * 將版本字串分割為版本部分陣列
 * Split a version string into an array of version parts
 *
 * 最多返回三個部分，超過三個的部分會合併為第三個部分
 * Returns at most three parts; excess parts are merged into the third part
 *
 * @param version - 版本字串 / Version string
 * @returns 版本部分陣列 / Array of version parts
 *
 * @example
 * ```typescript
 * versionToParts('1.2.3'); // ['1', '2', '3']
 * versionToParts('1.2.3-beta.1'); // ['1', '2', '3-beta.1']
 * versionToParts('1.2'); // ['1', '2']
 * ```
 */
function versionToParts(version) {
    // 以 '.' 切割；pre-release/build 中的 '.' 會一併被切開，稍後於第三段還原
    // Split on '.'; dots inside pre-release/build get split too and are restored in the third part below
    let parts = version.split('.');
    /**
     * 超過三段時，把多餘段落重新合併回第三段
     * （例如 1.2.3-beta.1 → ['1','2','3-beta.1']），
     * 否則 pre-release 的後綴會被誤判成獨立的版本段落。
     * When there are more than three segments, rejoin the extras into the
     * third part (e.g. 1.2.3-beta.1 → ['1','2','3-beta.1']); otherwise the
     * pre-release suffix would be mistaken for a separate version segment.
     */
    if (parts.length > 3) {
        return [parts[0], parts[1], partsToVersion(parts.slice(2))];
    }
    return parts;
}
//# sourceMappingURL=_core.js.map