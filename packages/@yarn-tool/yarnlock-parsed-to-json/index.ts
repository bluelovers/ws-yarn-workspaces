import { newYarnLockParsedVersionError } from '@yarn-tool/yarnlock-error';
import { assertYarnLockParsed, isYarnLockParsedV1, isYarnLockParsedV2 } from '@yarn-tool/yarnlock-parse-assert';
import {
	IYarnLockParsed,
	IYarnLockParsedV1,
	IYarnLockParsedV2,
	IYarnLockSource,
	IYarnLockRawSourceV1,
	IYarnLockRawSourceV2,
	IYarnLockParsedLoose,
} from '@yarn-tool/yarnlock-types';

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
export function yarnLockParsedV1ToRawJSON(parsedObject: IYarnLockParsedV1): IYarnLockRawSourceV1
{
	return {
		...parsedObject.meta,
		object: parsedObject.data,
	} as any
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
export function yarnLockParsedV2ToRawJSON(parsedObject: IYarnLockParsedV2): IYarnLockRawSourceV2
{
	return {
		__metadata: parsedObject.meta,
		...parsedObject.data,
	} as any
}

/**
 * yarnLockParsedToRawJSON 的選項。
 * Options for yarnLockParsedToRawJSON.
 */
export interface IOptionsYarnLockParsedToRawJSON
{
	/**
	 * 未命中任何版本分支時，是否拋出 YarnLockParsedVersionError（預設回傳 undefined）。
	 * Whether to throw YarnLockParsedVersionError when no version branch matched (returns undefined by default).
	 */
	throwError?: boolean,
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
export function yarnLockParsedToRawJSON(parsedObject: IYarnLockParsedV1,
	options?: IOptionsYarnLockParsedToRawJSON,
): IYarnLockRawSourceV1
export function yarnLockParsedToRawJSON(parsedObject: IYarnLockParsedV2,
	options?: IOptionsYarnLockParsedToRawJSON,
): IYarnLockRawSourceV2
export function yarnLockParsedToRawJSON(parsedObject: IYarnLockParsed | IYarnLockParsedLoose,
	options?: IOptionsYarnLockParsedToRawJSON,
): IYarnLockSource
export function yarnLockParsedToRawJSON(parsedObject: IYarnLockParsed | IYarnLockParsedLoose, options?: IOptionsYarnLockParsedToRawJSON)
{
	/**
	 * 先驗證再分流：無效資料不應進入任何一支轉換函式。
	 * Validate before branching: invalid data must not reach any converter.
	 */
	assertYarnLockParsed(parsedObject);

	/**
	 * v2 / v3 優先判斷（共用同一結構），再退回 v1。
	 * Check v2 / v3 first (shared structure), then fall back to v1.
	 */
	if (isYarnLockParsedV2(parsedObject))
	{
		return yarnLockParsedV2ToRawJSON(parsedObject)
	}
	else if (isYarnLockParsedV1(parsedObject))
	{
		return yarnLockParsedV1ToRawJSON(parsedObject)
	}

	/**
	 * 邊界情況：通過驗證卻仍無法辨識格式 → 依選項決定回傳 undefined 或拋錯。
	 * Edge case: passed validation but the format is still unknown →
	 * return undefined or throw, depending on the option.
	 */
	if (options?.throwError)
	{
		throw newYarnLockParsedVersionError();
	}
}

/**
 * default 匯出主要轉換函式，方便以 `import toRawJSON from ...` 直接使用。
 * Default-export the main converter for `import toRawJSON from ...` convenience.
 */
export default yarnLockParsedToRawJSON
