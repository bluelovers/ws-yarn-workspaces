/**
 * Created by user on 2020/6/5.
 */

import IPackageJson from '@ts-type/package-dts';
import { resolve, join } from "upath2";
import { readFileSync } from "fs-extra";
import { IReadPackage, IReadedPackages } from './types';

/**
 * 讀取一組套件路徑下的 package.json，並以套件名稱為鍵建立索引。
 * Read the `package.json` of each given package path and build an index keyed by package name.
 *
 * @param ls 套件資料夾路徑清單，通常來自 workspacesPackagesList()。List of package folder paths, usually from `workspacesPackagesList()`.
 * @param cwd 解析相對路徑的基準目錄，預設為 process.cwd()。Base directory used to resolve relative paths; defaults to `process.cwd()`.
 * @returns 以 name 為鍵的 IReadedPackages 物件。An `IReadedPackages` object keyed by package name.
 */
export function readPackages<T = IPackageJson>(ls: string[], cwd?: string)
{
	cwd = cwd || process.cwd();

	// 以 reduce 累積成一個物件；遇到同名套件時後者會覆蓋前者（Workspaces 內預期名稱唯一）。
	// Accumulate into a single object via `reduce`; duplicate names overwrite earlier entries (names are expected to be unique within a workspace).
	return ls.reduce(function (a, p)
	{
		// 先解析出套件資料夾，再拼出 package.json 的實際位置。
		// Resolve the package folder first, then derive the actual `package.json` location.
		let pp = resolve(cwd, p);
		let f = join(pp, 'package.json');

		// 同步讀取並解析 JSON；檔案不存在時 readFileSync/JSON.parse 會直接拋錯，讓呼叫端得知輸入有誤。
		// Read and parse the JSON synchronously; a missing file makes `readFileSync`/`JSON.parse` throw so callers learn about bad input.
		let pkg = JSON.parse(readFileSync(f).toString());

		a[pkg.name] = {
			name: pkg.name,
			path: p,
			fullpath: pp,
			config: pkg,
			manifestLocation: f,
		};

		return a;
	}, {} as IReadedPackages<T>);
}

export default readPackages
