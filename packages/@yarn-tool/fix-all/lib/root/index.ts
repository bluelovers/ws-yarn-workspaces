/**
 * @yarn-tool/fix-all/lib/root
 *
 * 根目錄 package.json 的修復模組
 * Fix module for root package.json
 *
 * 分別處理「單一套件根目錄」與「workspace 根目錄」兩種情境：
 * 補齊 hosted git 資訊、workspace 專用腳本與必要的開發依賴
 * Handles both "single package root" and "workspace root" cases:
 * fills in hosted git info, workspace-specific scripts, and required dev dependencies
 */
import { ITSRequiredPick } from 'ts-type/lib/type/record';
import { fillPkgHostedInfo, IFillPkgHostedInfoOptions } from '@yarn-tool/pkg-hosted-info';
import { join } from 'upath2';
import { npmHostedGitInfoLazy } from '@yarn-tool/pkg-git-info';
import { PackageJsonLoader } from 'npm-package-json-loader';
import { WorkspacesScope } from '@yarn-tool/ws-scope';
import { sortPackageJson } from 'sort-package-json3';
import { defaultWorkspaceRootScripts } from '@yarn-tool/pkg-entry-util/lib/preset/scripts/ws-root-scripts';
import { fillDummyScripts } from '@yarn-tool/pkg-entry-util/lib/preset/scripts/dummy';
import { _checkDependenciesExistsAll } from '@yarn-tool/pkg-deps-add';

/**
 * 修復單一套件根目錄的 package.json
 * Fix package.json of a single package root
 *
 * 流程：載入 package.json → 填充 hosted git 資訊 → 排序 → 寫回磁碟。
 * hostedGitInfo 未傳入時會嘗試從當前目錄自動推導，推導失敗則完全略過修復
 * Flow: load package.json → fill hosted git info → sort → write back to disk.
 * When hostedGitInfo is not given it is derived from the current directory; if
 * derivation fails the fix is skipped entirely (nothing is written)
 *
 * @param options - 修復選項，需包含 rootData / hostedGitInfo / branch / overwriteHostedGitInfo / targetDir
 * @param options.targetDir - 要修復的根目錄路徑 / Root directory to fix
 * @returns 回傳執行過程中的各項資料，供呼叫端續用 / Returns runtime data for the caller to reuse
 */
export function _fixRoot(options: Required<IFillPkgHostedInfoOptions>)
{
	let { rootData, branch, overwriteHostedGitInfo, hostedGitInfo, targetDir } = options;

	const root_file_package_json = join(targetDir, 'package.json');

	let root_pkg_json = new PackageJsonLoader(root_file_package_json);

	/**
	 * 未提供 hostedGitInfo 時，嘗試從 git remote 惰性推導；
	 * 推導結果為 falsy 時下方 if 不成立，代表無法取得 git 資訊，此時不寫入任何變更
	 * Lazily derive hostedGitInfo from git remote when not provided;
	 * a falsy result makes the if below fail, meaning no git info is available
	 * and no changes are written
	 */
	hostedGitInfo ??= npmHostedGitInfoLazy();

	if (hostedGitInfo)
	{
		fillPkgHostedInfo(root_pkg_json.data, {
			targetDir,
			rootData,
			hostedGitInfo,
			branch,
			overwriteHostedGitInfo,
		});

		/**
		 * 排序欄位以減少 git diff 的雜訊
		 * Sort fields to reduce noise in git diff
		 */
		root_pkg_json.data = sortPackageJson(root_pkg_json.data);

		root_pkg_json.write();
	}

	return {
		root_file_package_json,
		root_pkg_json,
		targetDir,
		rootData,
		hostedGitInfo,
		branch,
		overwriteHostedGitInfo,
	}
}

/**
 * 修復 workspace 根目錄（ws）的 package.json
 * Fix package.json of the workspace root (ws)
 *
 * 在 _fixRoot 的基礎上額外：
 * 1. 檢查 ws 目錄有效性（無效時拋錯）
 * 2. 補上 workspace 根目錄專用的預設腳本（僅補缺失項，不覆寫既有腳本）
 * 3. 確保共用開發依賴存在（缺漏時以 * 加入 devDependencies）
 * 4. 同步 workspace 內各套件的版本號
 * On top of _fixRoot it additionally:
 * 1. Validates the ws directory (throws when invalid)
 * 2. Adds default workspace-root scripts (only fills missing ones, never overwrites)
 * 3. Ensures shared dev dependencies exist (adds them with * when missing)
 * 4. Syncs versions across workspace packages
 *
 * @param options - 需包含 rootData / hostedGitInfo / branch / overwriteHostedGitInfo
 * @returns 與 _fixRoot 相同的執行期資料 / Same runtime data as _fixRoot
 */
export function _fixWsRoot(options: ITSRequiredPick<IFillPkgHostedInfoOptions, 'hostedGitInfo' | 'rootData' | 'overwriteHostedGitInfo' | 'branch'>)
{
	/**
	 * ws 為空代表這不是有效的 workspace 結構，
	 * 與其在後續流程產生難以理解的錯誤，不如在此明確中斷
	 * An empty ws means this is not a valid workspace; failing fast here
	 * is clearer than an obscure error later in the pipeline
	 */
	if (!options.rootData.ws?.length)
	{
		throw new Error(`Invalid workspaces`)
	}

	let runtime = _fixRoot({
		...options,
		targetDir: options.rootData.ws,
	});

	/**
	 * 只在腳本不存在（??=）時才填入預設值，
	 * 避免覆蓋使用者自訂的同名腳本
	 * Fill defaults only when the script is absent (??=),
	 * so user-defined scripts with the same name are preserved
	 */
	Object.entries(fillDummyScripts(defaultWorkspaceRootScripts())).forEach(([key, value]) =>
	{
		runtime.root_pkg_json.data.scripts[key] ??= value;
	});

	/**
	 * 這些是 workspace 根目錄常見的共用開發依賴，
	 * 逐一檢查 devDependencies / dependencies，皆不存在才補上，
	 * 使用 '*' 而非固定版本，交由 workspace 內統一控管版本
	 * These are commonly shared dev dependencies at the workspace root;
	 * each is checked against devDependencies / dependencies and only added
	 * when absent. Uses '*' instead of a pinned version so the workspace
	 * controls versions centrally
	 */
	[
		'@yarn-tool/ws-find-up-paths',
		'@types/node',
		'@bluelovers/tsconfig',
		'@yarn-tool/require-resolve',
	].forEach(name => {
		const _check = _checkDependenciesExistsAll(runtime.root_pkg_json.data, [
			'devDependencies',
			'dependencies',
		], name);

		if (!_check._exists)
		{
			runtime.root_pkg_json.data.devDependencies ??= {};
			runtime.root_pkg_json.data.devDependencies[name] = '*';
		}
	});

	/**
	 * 任何欄位增補後都需要重新排序並寫回
	 * Re-sort and write back after any field additions
	 */
	runtime.root_pkg_json.data = sortPackageJson(runtime.root_pkg_json.data);

	runtime.root_pkg_json.write();

	/**
	 * 同步 workspace 內各套件的依賴版本號並儲存，
	 * 確保內部互相依賴的版本一致
	 * Sync dependency version numbers across workspace packages and save,
	 * keeping internal cross-dependencies consistent
	 */
	let wss = new WorkspacesScope(runtime.rootData.ws);
	wss.syncValue();
	wss.save();

	return runtime
}
