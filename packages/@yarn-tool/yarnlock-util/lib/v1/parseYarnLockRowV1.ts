import { IYarnLockDataRowV1 } from '@yarn-tool/yarnlock-types';
import { PACKAGE_REGEX } from '../const';
import { IParseNameAndVersionWithNpaResult } from '../types';
import { npaTry } from '@yarn-tool/npm-package-arg-util';
import { getSemverFromNpaResult } from '@yarn-tool/npm-package-arg-util/lib/getSemverFromNpaResult';
import { IResult } from '@yarn-tool/npm-package-arg-util/lib/types';

/**
 * 解析 Yarn v1 的列鍵（Row Key），回傳統一的名稱／版本／範圍結構。
 * Parse a Yarn v1 row key into the shared name/version/range structure.
 *
 * @param packageName 列鍵，例如 `lodash@^4.17.0`、`@babel/core@^7.0.0` /
 *                    The row key, for example `lodash@^4.17.0`, `@babel/core@^7.0.0`
 * @param packageData 該列的資料，`version` 為實際解析到的版本 /
 *                     The row data; `version` is the resolved version
 * @returns 解析結果；名稱取不到時回傳 `undefined` / The parse result, or `undefined` when no
 *          name can be determined
 */
export function parseYarnLockRowV1(packageName: string, packageData: IYarnLockDataRowV1): IParseNameAndVersionWithNpaResult
{
	/**
	 * 先用 `npaTry` 而非 `npa`：npa 對非標準列鍵（例如 `pkg@*`、
	 * 多範圍逗號串接）會丟例外，而 lockfile 內允許這類鍵，
	 * 用可失敗版本才能退回到正則後備。
	 * `npaTry` is used instead of `npa` because npa throws on non-standard row keys (such as
	 * `pkg@*` or comma-joined ranges), which are legal inside a lockfile; the non-throwing
	 * variant allows falling back to the regex.
	 */
	let parsed: IResult = npaTry(packageName);

	/**
	 * `??` 後備順序是刻意的：npa 的語意解析最準確，
	 * 只有它回傳空時才用 `PACKAGE_REGEX` 拆字串，避免正則的寬鬆匹配蓋過正確結果。
	 * The `??` fallback order is deliberate: npa's semantic parse is the most accurate, and the
	 * looser `PACKAGE_REGEX` string split is only used when npa yields nothing, so it can never
	 * override a correct result.
	 */
	const name =
		parsed?.name ?? PACKAGE_REGEX.exec(packageName)?.groups?.['packageName'];

	/**
	 * `name?.length` 而非 `if (name)`：解析可能回傳空字串，
	 * 空名稱對下游沒有意義，直接走到函式結尾回傳 `undefined` 讓呼叫端略過該列。
	 * `name?.length` rather than `if (name)`: parsing may yield an empty string, which is useless
	 * downstream, so the function falls through and returns `undefined` for the caller to skip
	 * the row.
	 */
	if (name?.length)
	{
		let semver = getSemverFromNpaResult(parsed);

		return {
			name,
			version: packageData.version,
			type: parsed.type,
			raw: parsed.raw,
			semver,
		}
	}
}
