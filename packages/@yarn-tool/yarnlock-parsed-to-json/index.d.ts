import { IYarnLockParsed, IYarnLockParsedV1, IYarnLockParsedV2, IYarnLockSource, IYarnLockRawSourceV1, IYarnLockRawSourceV2, IYarnLockParsedLoose } from '@yarn-tool/yarnlock-types';
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
export declare function yarnLockParsedV1ToRawJSON(parsedObject: IYarnLockParsedV1): IYarnLockRawSourceV1;
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
export declare function yarnLockParsedV2ToRawJSON(parsedObject: IYarnLockParsedV2): IYarnLockRawSourceV2;
/**
 * yarnLockParsedToRawJSON 的選項。
 * Options for yarnLockParsedToRawJSON.
 */
export interface IOptionsYarnLockParsedToRawJSON {
    /**
     * 未命中任何版本分支時，是否拋出 YarnLockParsedVersionError（預設回傳 undefined）。
     * Whether to throw YarnLockParsedVersionError when no version branch matched (returns undefined by default).
     */
    throwError?: boolean;
}
/**
 * 將任意版本的解析結果轉回對應的原始 JSON 結構（依輸入型別 overload 回傳）。
 * Convert a parsed result of any version back to the matching raw JSON shape (overloaded by input type).
 *
 * @param parsedObject - v1 或 v2 / v3 的解析結果
 *                       - a v1 or v2 / v3 parsed result
 * @param options - 行為選項，見 IOptionsYarnLockParsedToRawJSON
 *                  - behaviour options, see IOptionsYarnLockParsedToRawJSON
 * @returns v1 回傳 IYarnLockRawSourceV1、v2 / v3 回傳 IYarnLockRawSourceV2
 *          - v1 returns IYarnLockRawSourceV1, v2 / v3 returns IYarnLockRawSourceV2
 *
 * @remarks
 * 先以 assertYarnLockParsed 驗證輸入，因此無效輸入會在轉換前就拋錯；
 * throwError 只影響「通過驗證卻未命中分支」的罕見情況。
 * assertYarnLockParsed validates first, so invalid input throws before any
 * conversion; throwError only governs the rare validated-but-unmatched case.
 */
export declare function yarnLockParsedToRawJSON(parsedObject: IYarnLockParsedV1, options?: IOptionsYarnLockParsedToRawJSON): IYarnLockRawSourceV1;
export declare function yarnLockParsedToRawJSON(parsedObject: IYarnLockParsedV2, options?: IOptionsYarnLockParsedToRawJSON): IYarnLockRawSourceV2;
export declare function yarnLockParsedToRawJSON(parsedObject: IYarnLockParsed | IYarnLockParsedLoose, options?: IOptionsYarnLockParsedToRawJSON): IYarnLockSource;
/**
 * default 匯出主要轉換函式，方便以 `import toRawJSON from ...` 直接使用。
 * Default-export the main converter for `import toRawJSON from ...` convenience.
 */
export default yarnLockParsedToRawJSON;
