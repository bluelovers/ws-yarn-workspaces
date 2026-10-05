import { workspacesPackagesList } from 'ws-pkg-list/lib/listpkg';
import { checkPkgDir } from './pkg';
import { IPackageJson } from '@ts-type/package-dts';

/**
 * 列出 workspace 內所有套件並逐一執行單套件檢查。
 * 回傳完整陣列而非只回傳失敗者，讓 CLI 能同時呈現通過與失敗的套件。
 *
 * List every package in the workspace and run the single-package check on each.
 * Returns the full array (not only failures) so the CLI can render both passing
 * and failing packages.
 *
 * @param cwd workspace 根目錄 / workspace root directory
 */
export function checkWorkspaces(cwd: string = process.cwd())
{
	return workspacesPackagesList(cwd)
		.map(cwd => checkPkgDir(cwd))
	;
}
