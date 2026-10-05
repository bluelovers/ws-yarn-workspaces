/**
 * Created by user on 2020/6/13.
 */

import { existsSync, readFileSync } from 'fs-extra';
import { matchShebang } from '@yarn-tool/shebang';
import { IPackageJson } from '@ts-type/package-dts';
import { getPackageBins } from '@yarn-tool/get-pkg-bin';
import { join } from 'upath2';

/**
 * 判斷任意內容是否含 shebang（`#!`）開頭。
 * 回傳布林值而非直接依賴 truthy，是為了讓「無 shebang」與「比對失敗」都明確視為 false。
 *
 * Detect whether arbitrary content starts with a shebang (`#!`).
 * Returning an explicit boolean keeps "no shebang" and "match failure" both false.
 */
export function hasShebang(buf: Buffer | string)
{
	return matchShebang(buf.toString())?.script?.length > 0
}

/**
 * 檢查單一檔案是否存在且含 shebang。
 * 檔案不存在時回傳 undefined（而非 false），讓呼叫方得以區分
 * 「檔案缺少」與「檔案存在但沒有 shebang」兩種不同的失敗原因。
 *
 * Check whether a single file exists and contains a shebang.
 * Returns undefined (not false) when missing, so callers can distinguish
 * "file missing" from "file exists but lacks a shebang".
 */
export function checkFile(file: string)
{
	if (existsSync(file))
	{
		return hasShebang(readFileSync(file))
	}
}

/**
 * 依 package.json 的 bin 欄位逐檔檢查 shebang，
 * 並以 reduce 累積成固定的明細結構（而非僅回傳布林），
 * 以便 CLI 能對每一支可執行檔顯示檔案路徑與檢查結果。
 *
 * Check every bin entry from package.json for a shebang, accumulating a fixed
 * detail structure via reduce (instead of a bare boolean) so the CLI can show
 * the path and result for each executable.
 *
 * @param pkg 已解析的 package.json 物件 / parsed package.json object
 * @param cwd 套件根目錄，用於將 bin 的相對路徑解析為絕對路徑 /
 *           package root used to resolve relative bin paths to absolute ones
 */
export function checkPkgJson(pkg: IPackageJson, cwd: string)
{
	/**
	 * getPackageBins 可能回傳 undefined（無 bin 欄位），
	 * 以 ?? [] 落成空陣列，讓 result 為空即可判定「無 bin 需檢查」。
	 *
	 * getPackageBins may return undefined (no bin field); coalesce with ?? []
	 * so an empty result signals "no bins to check" to the caller.
	 */
	return Object.entries(getPackageBins(pkg) ?? [])
		.reduce((a, row) =>
		{

			let filename = row[1];
			let file = join(cwd, filename);
			let bool = checkFile(file)

			a.push({
				file,
				filename,
				hasShebang: bool,
			})

			return a
		}, [] as {
			file: string,
			filename: string,
			hasShebang: boolean,
		}[])
}

