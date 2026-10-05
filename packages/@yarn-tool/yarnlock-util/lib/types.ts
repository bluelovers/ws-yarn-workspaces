import { IResult } from '@yarn-tool/npm-package-arg-util';

/**
 * 列解析（Row Parse）的統一回傳型別，供 v1 與 v2 解析器共用。
 * The shared row-parse result type used by both the v1 and v2 parsers.
 *
 * 以 `Pick` 只取 npa 結果的 `type` / `raw` 而不是整個 `IResult`：
 * npa 的其他欄位（`fetchSpec`、`saveSpec` 等）對 lockfile 比對沒有意義，
 * 保留整包會讓回傳值難以序列化與測試。
 * `Pick` keeps only `type` / `raw` from the npa result instead of the whole `IResult`: the
 * remaining npa fields (`fetchSpec`, `saveSpec`, …) are irrelevant to lockfile comparison, and
 * carrying them along would make the result harder to serialize and test.
 */
export interface IParseNameAndVersionWithNpaResult extends Pick<IResult, 'type' | 'raw'>
{
	/**
	 * 套件名稱，不含版本範圍（例如 `@babel/core`）。
	 * The package name without its version range (for example `@babel/core`).
	 */
	name: string;
	/**
	 * 實際解析到的版本；Berry 的 `npm:` 前綴已被移除。
	 * The resolved version; the Berry `npm:` prefix has been stripped.
	 */
	version: string;
	/**
	 * 列鍵中的版本範圍（Range），例如 `^4.17.0`；npa 無法解析時可能為空。
	 * The version range from the row key, for example `^4.17.0`; may be empty when npa cannot
	 * parse it.
	 */
	semver: string,
}
