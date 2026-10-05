import { parseSyml, stringifySyml } from '@yarnpkg/parsers';
import { IYarnLockRawSourceV2 } from '@yarn-tool/yarnlock-types';
import { EnumYarnLockBanner } from '@yarn-tool/yarnlock-banner';
import { EnumLineBreak } from 'crlf-normalize';

/**
 * 擴充 @yarnpkg/parsers 的 parseSyml 宣告為泛型，讓呼叫端能指定回傳型別。
 * Widen @yarnpkg/parsers' parseSyml declaration to generic so callers can pick the return type.
 *
 * @remarks
 * 兩個簽名重複是為了同時保留「不給泛型時的預設型別」與「給泛型時的推導型別」。
 * The duplicated signatures preserve both the default type (no type argument)
 * and the inferred type (with a type argument).
 */
declare module '@yarnpkg/parsers'
{
	function parseSyml<T extends IYarnLockRawSourceV2 = IYarnLockRawSourceV2>(source: string): T
	function parseSyml(source: string): IYarnLockRawSourceV2
}

/**
 * 解析 v2 / v3 格式的 yarn.lock，保留 { __metadata, ...entries } 原始結構。
 * Parse a v2 / v3 yarn.lock and keep the raw { __metadata, ...entries } structure.
 *
 * @param source - lock 檔內容，接受 Buffer 或字串
 *                 - lockfile content, accepts Buffer or string
 * @remarks
 * v2 與 v3 的原始格式相同，故共用此一支解析器。
 * v2 and v3 share the same raw format, so one parser serves both.
 */
export function parseYarnLockRawV2<T extends IYarnLockRawSourceV2 = IYarnLockRawSourceV2>(source: string | Buffer): T
{
	return parseSyml(source?.toString()) as any
}

/**
 * 驗證 v2 原始結果不該帶有 v1 的 object 鍵，並回傳其本身。
 * Verify a raw v2 result does not carry the v1 `object` key and return it as-is.
 *
 * @remarks
 * v2 的根節點就是整份結果本身（不像 v1 需要取 object）；
 * 若帶有 object 鍵代表拿錯格式，明確拋錯避免資料被誤讀。
 * The v2 root is the result itself (unlike v1, which needs `object`);
 * an `object` key means the wrong format was passed, so it throws explicitly
 * instead of letting the data be misread.
 */
export function getYarnLockRawV2Root(input: IYarnLockRawSourceV2)
{
	if (('object' in input))
	{
		throw new TypeError(`'object' key should not exists in input object`)
	}
	return input
}

/**
 * v2 格式沒有根節點差異，Root 變體與一般版本行為完全相同。
 * v2 has no root difference, so the Root variant behaves exactly like the normal one.
 */
export { parseYarnLockRawV2 as parseYarnLockRawV2Root }

/**
 * 將 v2 資料寫回 yarn.lock 字串。
 * Write v2 data back into a yarn.lock string.
 *
 * @param json - 要寫回的 v2 資料
 *               - the v2 data to write back
 * @param noHeader - 是否省略 v2 banner 標頭
 *                   - whether to omit the v2 banner header
 * @remarks
 * 標頭與內容以兩個 LF（空行）分隔並統一使用 LF 換行，
 * 確保輸出在各平台一致、且符合 yarn.lock 的慣例格式。
 * Header and body are separated by two LFs (blank line) with LF endings
 * everywhere, keeping output platform-independent and yarn.lock-conventional.
 */
export function stringifyYarnLockRawV2(json: any, noHeader?: boolean)
{
	const list = [EnumYarnLockBanner.v2, stringifySyml(json)];

	/**
	 * noHeader 時移除標頭而非條件組裝，讓後續 join 邏輯只有一條路徑。
	 * With noHeader the banner is removed instead of conditionally built, so join has a single path.
	 */
	if (noHeader)
	{
		list.shift();
	}

	return list.join(EnumLineBreak.LF + EnumLineBreak.LF)
}
