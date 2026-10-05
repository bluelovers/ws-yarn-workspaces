/**
 * Created by user on 2020/6/5.
 */

import { readPackages } from './readpkg';
import { array_unique } from 'array-hyper-unique';
import { join } from "upath2";
import workspacesPackagesList from './listpkg';

/**
 * 產生 tsconfig.json 的 compilerOptions.paths 映射。
 * Build the `compilerOptions.paths` mapping for `tsconfig.json`.
 *
 * @param ls 可為工作區 cwd 字串、套件路徑清單或 readPackages() 的回傳值。May be a workspace `cwd` string, a list of package paths, or the result of `readPackages()`.
 * @returns 以 `套件名/*` 為鍵、相對與絕對路徑清單為值的物件。An object keyed by `pkgName/*` with relative and absolute path arrays as values.
 */
export function tsConfigPaths(cwd?: string): {
	[k: string]: string[],
}
export function tsConfigPaths(ls: string[]): {
	[k: string]: string[],
}
export function tsConfigPaths(ls: ReturnType<typeof workspacesPackagesList>): {
	[k: string]: string[],
}
export function tsConfigPaths(ls: ReturnType<typeof readPackages>): {
	[k: string]: string[],
}
export function tsConfigPaths(ls: string[] | ReturnType<typeof workspacesPackagesList> | ReturnType<typeof readPackages>): {
	[k: string]: string[],
}
export function tsConfigPaths(ls: string | string[] | ReturnType<typeof workspacesPackagesList> | ReturnType<typeof readPackages>): {
	[k: string]: string[],
}
{
	let cwd: string;

	// 傳入字串時視為 cwd，先取得路徑清單再往下解析。
	// A string argument is treated as `cwd`; list the package paths first before further resolution.
	if (typeof ls == 'string')
	{
		cwd = ls;

		ls = workspacesPackagesList(cwd);
	}

	// 清單元素為字串時尚未讀取 manifest，需先轉成 readPackages() 的索引結構。
	// When the list still contains strings the manifests have not been read yet, so convert via `readPackages()` first.
	if (typeof ls[0] == 'string')
	{
		ls = readPackages(ls as string[], cwd)
	}

	// 路徑為 '.' 或空字串代表工作區根套件本身；不產生 paths 映射，避免 tsconfig 出現自我指向的模糊路徑。
	// A path of '.' or '' is the workspace root package itself; skip it to avoid a self-referencing, ambiguous path mapping in tsconfig.
	return Object.values(ls).reduce(function (a, v)
	{
		if (v.path !== '.' && v.path !== '')
		{
			a[v.name + '/*'] = array_unique([
				join(v.path, '*'),
				join(v.fullpath, '*'),
			]);
		}
		return a;
	}, {} as {
		[k: string]: string[],
	});
}

export default tsConfigPaths
