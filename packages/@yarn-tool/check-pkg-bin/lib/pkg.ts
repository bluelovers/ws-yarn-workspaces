/**
 * Created by user on 2020/6/13.
 */

import { readPackageJson } from '@ts-type/package-dts';
import { join } from 'upath2';
import { checkPkgJson } from './core';

/**
 * 讀取指定目錄的 package.json，並檢查其所有 bin 檔案是否含 shebang。
 * 預設使用 process.cwd()，讓 CLI 與 API 在未指定路徑時行為一致。
 *
 * Read the package.json of a directory and check whether all of its bin files
 * contain a shebang. Defaults to process.cwd() so CLI and API behave the same
 * when no path is given.
 *
 * @param pkgDir 套件根目錄 / package root directory
 */
export function checkPkgDir(pkgDir: string = process.cwd())
{
	const pkg = readPackageJson(join(pkgDir, 'package.json'));

	const result = checkPkgJson(pkg, pkgDir)

	return {
		name: pkg.name as string,
		pkg,
		pkgDir,
		result,
		// valid 只描述「已存在的 bin 是否皆通過」；
		// 沒有任何 bin 時 result 為空、every 回傳 true，
		// 由呼叫方以 result.length 決定是否顯示為 none。
		// valid only describes whether existing bins all pass; with no bins the
		// result is empty and every() is true, so callers show "none" based on
		// result.length instead.
		valid: result.every(r => r.hasShebang),
	}
}
