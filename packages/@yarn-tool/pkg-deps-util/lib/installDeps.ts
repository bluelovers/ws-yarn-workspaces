/**
 * 依 workspace 結構過濾要安裝的套件 (Filter install targets by workspace layout)
 *
 * 當使用者在 workspace 根目錄執行指令時，安裝應改由工作區內的本地套件承接，
 * 因此這裡先辨識根目錄角色，再決定是否委派給 `installDepsFromWorkspaces`。
 *
 * When a command runs at the workspace root, installs must be handled by the
 * local workspace packages instead, so the root role is detected first and the
 * work is delegated to `installDepsFromWorkspaces` when appropriate.
 */
import { IOptionsCheckInstallTarget, IOptionsInstallDepsFromWorkspaces } from './types';
import { installDepsFromWorkspaces } from './installDepsFromWorkspaces';
import { findRoot, IFindRootOptions } from '@yarn-tool/find-root';
import { IPackageJson } from '@ts-type/package-dts';

/**
 * `filterInstallDeps` 的選項 (Options for `filterInstallDeps`)
 *
 * 目前與 workspace 安裝選項相同，保留別名是為了日後可單獨擴充。
 * Alias of the workspace install options, kept so it can diverge later.
 */
export interface IOptionsInstallDeps extends IOptionsInstallDepsFromWorkspaces
{

}

/**
 * 過濾出不屬於工作區本地套件的套件名稱
 *
 * Filter out package names that are not local workspace packages.
 *
 * @param packageNames 要安裝的套件名稱或查詢字串 (Names or specifiers to install)
 * @param options 安裝選項，預設使用 `process.cwd()` (Install options, defaults to `process.cwd()`)
 *
 * @returns 若目前位於 workspace 根目錄，回傳由本地套件處理後的結果；
 * 否則只回傳 `cwd` 與原封不動的 `packageNames`，表示沒有任何項目被處理。
 *
 * Returns the outcome produced by local packages when running at a workspace
 * root; otherwise only `cwd` and the untouched `packageNames`, meaning nothing
 * was handled.
 */
export function filterInstallDeps(packageNames: string[], options: IOptionsInstallDeps = {})
{
	/**
	 * 回寫 `cwd`，確保後續共用同一個目錄，避免各函式各自取 `process.cwd()` 造成不一致
	 *
	 * Writes back `cwd` so every downstream step shares one directory instead of
	 * each function calling `process.cwd()` independently.
	 */
	const cwd = options.cwd ??= process.cwd();

	/**
	 * 允許呼叫端明確略過檢查，例如已確認不在 workspace 內的狀況
	 *
	 * Allows callers to skip the check entirely, e.g. when they already know
	 * they are not inside a workspace.
	 */
	if (!options.skipCheckWorkspace)
	{
		const rootData = findRoot({
			...options,
			cwd,
		})

		/**
		 * 只有「根目錄含 workspace 但目前並非 workspace 成員」時才需要改由本地套件處理；
		 * 若目前就在某個 member 內，直接回到一般安裝流程即可。
		 *
		 * Only when the root has a workspace but the current dir is not a member
		 * must local packages take over; inside a member we fall through to the
		 * normal install flow.
		 */
		if (rootData.hasWorkspace && !rootData.isWorkspace)
		{
			let data = installDepsFromWorkspaces(packageNames, options);

			/**
			 * 本地套件已消化的項目不會出現在 `others`，其餘交還給呼叫端
			 *
			 * Names consumed by local packages disappear from `others`; the rest
			 * are handed back to the caller.
			 */
			packageNames = data.others

			return {
				cwd,
				packageNames,
				pkg: data.pkg as IPackageJson,
				rootData,
				added: data.added,
				exists: data.exists,
				updated: data.updated,
			};
		}
	}

	/**
	 * 未經 workspace 處理時沒有 `pkg`/`rootData`，型別上自然區分成另一種回傳形狀
	 *
	 * Without workspace handling there is no `pkg`/`rootData`, so the return shape
	 * differs and is distinguishable on the type level.
	 */
	return {
		cwd,
		packageNames,
	}
}
