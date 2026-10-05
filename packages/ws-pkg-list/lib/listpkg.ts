/**
 * Created by user on 2020/6/5.
 */

import findWorkspaceRoot from 'find-yarn-workspace-root2/core';
import { getConfig } from 'workspaces-config';
import { join, dirname, relative } from "upath2";
import fg from '@bluelovers/fast-glob';

/**
 * 列出目前 Yarn Workspaces（工作區）內所有套件的資料夾路徑。
 * List the folder paths of every package inside the current Yarn Workspace.
 *
 * @param cwd 起始目錄，用來尋找工作區根目錄；也可直接傳入布林值當作 absolute。Starting directory used to locate the workspace root; a boolean may also be passed as `absolute` for backward compatibility.
 * @param absolute 是否回傳絕對路徑，false 時回傳相對於 cwd 的路徑。Whether to return absolute paths; when false, paths are relative to `cwd`.
 */
export function workspacesPackagesList(absolute?: boolean): string[]
export function workspacesPackagesList(cwd?: string, absolute?: boolean): string[]
export function workspacesPackagesList(cwd?, absolute?: boolean): string[]
{
	// 第一個參數為布林值時，代表舊版只有 absolute 的呼叫形式，需重新對應參數位置。
	// When the first argument is a boolean it represents the legacy `absolute`-only call form, so remap the parameters.
	if (typeof cwd === 'boolean')
	{
		// @ts-ignore
		[cwd, absolute] = [null, cwd];
	}

	cwd = cwd || process.cwd();

	// 以 not_absolute 標記是否要轉成相對路徑，避免在迴圈內重複比對 absolute 的多種 falsy 值。
	// Track `not_absolute` once so the loop does not re-evaluate the several falsy forms of `absolute`.
	let not_absolute = absolute === false;

	// 從 cwd 向上尋找工作區根目錄；找不到時 find-yarn-workspace-root2 會回傳 null，交由 getConfig 處理。
	// Walk up from `cwd` to find the workspace root; if not found `find-yarn-workspace-root2` returns null and `getConfig` handles it.
	let root = findWorkspaceRoot(cwd);

	// 將 workspaces 設定的 glob 展開成每個套件的 package.json 路徑。
	// Expand the configured workspace globs into a `package.json` path per package.
	let ps = getConfig(root).packages.map(function (v)
	{
		return join(v, 'package.json')
	});

	// 同步比對所有 package.json 並取其所在資料夾；absolute:false 時轉為相對路徑。
	// Glob-match every `package.json` synchronously and reduce to its folder; convert to relative paths when `absolute:false`.
	return fg.sync(ps, {
		cwd: root,
		absolute: true,
	}).map(function (v: string)
	{
		let p = dirname(v);

		if (not_absolute)
		{
			p = relative(cwd, p);

			// relative() 在相同目錄時回傳空字串，改以 '.' 表示根套件本身，方便直接拼接路徑。
			// `relative()` returns an empty string for the same directory; use '.' for the root package so paths can be concatenated directly.
			if (p == '')
			{
				p = '.';
			}
		}

		return p;
	});
}

export default workspacesPackagesList;
