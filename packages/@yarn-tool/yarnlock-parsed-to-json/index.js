"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yarnLockParsedV1ToRawJSON = yarnLockParsedV1ToRawJSON;
exports.yarnLockParsedV2ToRawJSON = yarnLockParsedV2ToRawJSON;
exports.yarnLockParsedToRawJSON = yarnLockParsedToRawJSON;
const yarnlock_error_1 = require("@yarn-tool/yarnlock-error");
const yarnlock_parse_assert_1 = require("@yarn-tool/yarnlock-parse-assert");
/**
 * 將 v1 解析結果轉回原始 JSON：meta 展開於頂層、data 放回 object 鍵。
 * Convert a v1 parsed result back to raw JSON: spread `meta` at top level, put `data` under `object`.
 *
 * @param parsedObject - 由 @yarn-tool/yarnlock-parse 產生的 v1 解析結果
 *                       - the v1 parsed result produced by @yarn-tool/yarnlock-parse
 * @remarks
 * 與 yarnLockRawV1ToParsed 的拆解步驟互為逆運算。
 * This is the exact inverse of the split done by yarnLockRawV1ToParsed.
 */
function yarnLockParsedV1ToRawJSON(parsedObject) {
    return {
        ...parsedObject.meta,
        object: parsedObject.data,
    };
}
/**
 * 將 v2 / v3 解析結果轉回原始 JSON：meta 放回 __metadata、data 展開於頂層。
 * Convert a v2 / v3 parsed result back to raw JSON: put `meta` under `__metadata`, spread `data` at top level.
 *
 * @param parsedObject - 由 @yarn-tool/yarnlock-parse 產生的 v2 / v3 解析結果
 *                       - the v2 / v3 parsed result produced by @yarn-tool/yarnlock-parse
 * @remarks
 * 與 yarnLockRawV2ToParsed 的拆解步驟互為逆運算。
 * This is the exact inverse of the split done by yarnLockRawV2ToParsed.
 */
function yarnLockParsedV2ToRawJSON(parsedObject) {
    return {
        __metadata: parsedObject.meta,
        ...parsedObject.data,
    };
}
function yarnLockParsedToRawJSON(parsedObject, options) {
    /**
     * 先驗證再分流：無效資料不應進入任何一支轉換函式。
     * Validate before branching: invalid data must not reach any converter.
     */
    (0, yarnlock_parse_assert_1.assertYarnLockParsed)(parsedObject);
    /**
     * v2 / v3 優先判斷（共用同一結構），再退回 v1。
     * Check v2 / v3 first (shared structure), then fall back to v1.
     */
    if ((0, yarnlock_parse_assert_1.isYarnLockParsedV2)(parsedObject)) {
        return yarnLockParsedV2ToRawJSON(parsedObject);
    }
    else if ((0, yarnlock_parse_assert_1.isYarnLockParsedV1)(parsedObject)) {
        return yarnLockParsedV1ToRawJSON(parsedObject);
    }
    /**
     * 邊界情況：通過驗證卻仍無法辨識格式 → 依選項決定回傳 undefined 或拋錯。
     * Edge case: passed validation but the format is still unknown →
     * return undefined or throw, depending on the option.
     */
    if (options === null || options === void 0 ? void 0 : options.throwError) {
        throw (0, yarnlock_error_1.newYarnLockParsedVersionError)();
    }
}
/**
 * default 匯出主要轉換函式，方便以 `import toRawJSON from ...` 直接使用。
 * Default-export the main converter for `import toRawJSON from ...` convenience.
 */
exports.default = yarnLockParsedToRawJSON;
//# sourceMappingURL=index.js.map