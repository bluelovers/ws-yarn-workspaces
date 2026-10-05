import { IYarnLockParsed, IYarnLockParsedLoose } from '@yarn-tool/yarnlock-types';

/**
 * 從 parser 的解析結果讀取格式版本。
 *
 * Reads the format version straight out of a parser result.
 *
 * @param parsedObject `@yarn-tool/yarnlock-parse-raw` 的解析結果 /
 * a parse result from @yarn-tool/yarnlock-parse-raw
 * @returns 解析結果具備標準結構時回傳其 `verType`，否則回傳 undefined /
 * the `verType` when the result has the expected shape, otherwise undefined
 */
export function detectYarnLockVersionByParsed(parsedObject: IYarnLockParsed | IYarnLockParsedLoose)
{
	/**
	 * 同時檢查 `verType` 與 `meta` / `data` 鍵值：
	 * 僅有 `verType` 的鬆散 (loose) 輸入不可信，避免把不完整的結構誤判為已知格式。
	 *
	 * Both `verType` and the `meta`/`data` keys are required: a loose input
	 * carrying only `verType` is not trustworthy, preventing incomplete
	 * structures from being reported as a known format.
	 */
	if (parsedObject.verType && 'meta' in parsedObject && 'data' in parsedObject)
	{
		return parsedObject.verType
	}
}
