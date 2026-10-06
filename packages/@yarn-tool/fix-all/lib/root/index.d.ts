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
import { IFillPkgHostedInfoOptions } from '@yarn-tool/pkg-hosted-info';
import { PackageJsonLoader } from 'npm-package-json-loader';
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
export declare function _fixRoot(options: Required<IFillPkgHostedInfoOptions>): {
    root_file_package_json: string;
    root_pkg_json: PackageJsonLoader<import("@ts-type/package-dts").IPackageJson<unknown>>;
    targetDir: string;
    rootData: import("@yarn-tool/find-root").IFindRootReturnType;
    hostedGitInfo: import("@yarn-tool/pkg-git-info").INpmHostedGitInfo;
    branch: string;
    overwriteHostedGitInfo: boolean;
};
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
export declare function _fixWsRoot(options: ITSRequiredPick<IFillPkgHostedInfoOptions, 'hostedGitInfo' | 'rootData' | 'overwriteHostedGitInfo' | 'branch'>): {
    root_file_package_json: string;
    root_pkg_json: PackageJsonLoader<import("@ts-type/package-dts").IPackageJson<unknown>>;
    targetDir: string;
    rootData: import("@yarn-tool/find-root").IFindRootReturnType;
    hostedGitInfo: import("@yarn-tool/pkg-git-info").INpmHostedGitInfo;
    branch: string;
    overwriteHostedGitInfo: boolean;
};
