"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._fixRoot = _fixRoot;
exports._fixWsRoot = _fixWsRoot;
const pkg_hosted_info_1 = require("@yarn-tool/pkg-hosted-info");
const upath2_1 = require("upath2");
const pkg_git_info_1 = require("@yarn-tool/pkg-git-info");
const npm_package_json_loader_1 = require("npm-package-json-loader");
const ws_scope_1 = require("@yarn-tool/ws-scope");
const sort_package_json3_1 = require("sort-package-json3");
const ws_root_scripts_1 = require("@yarn-tool/pkg-entry-util/lib/preset/scripts/ws-root-scripts");
const dummy_1 = require("@yarn-tool/pkg-entry-util/lib/preset/scripts/dummy");
const pkg_deps_add_1 = require("@yarn-tool/pkg-deps-add");
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
function _fixRoot(options) {
    let { rootData, branch, overwriteHostedGitInfo, hostedGitInfo, targetDir } = options;
    const root_file_package_json = (0, upath2_1.join)(targetDir, 'package.json');
    let root_pkg_json = new npm_package_json_loader_1.PackageJsonLoader(root_file_package_json);
    /**
     * 未提供 hostedGitInfo 時，嘗試從 git remote 惰性推導；
     * 推導結果為 falsy 時下方 if 不成立，代表無法取得 git 資訊，此時不寫入任何變更
     * Lazily derive hostedGitInfo from git remote when not provided;
     * a falsy result makes the if below fail, meaning no git info is available
     * and no changes are written
     */
    hostedGitInfo !== null && hostedGitInfo !== void 0 ? hostedGitInfo : (hostedGitInfo = (0, pkg_git_info_1.npmHostedGitInfoLazy)());
    if (hostedGitInfo) {
        (0, pkg_hosted_info_1.fillPkgHostedInfo)(root_pkg_json.data, {
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
        root_pkg_json.data = (0, sort_package_json3_1.sortPackageJson)(root_pkg_json.data);
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
    };
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
function _fixWsRoot(options) {
    var _a;
    /**
     * ws 為空代表這不是有效的 workspace 結構，
     * 與其在後續流程產生難以理解的錯誤，不如在此明確中斷
     * An empty ws means this is not a valid workspace; failing fast here
     * is clearer than an obscure error later in the pipeline
     */
    if (!((_a = options.rootData.ws) === null || _a === void 0 ? void 0 : _a.length)) {
        throw new Error(`Invalid workspaces`);
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
    Object.entries((0, dummy_1.fillDummyScripts)((0, ws_root_scripts_1.defaultWorkspaceRootScripts)())).forEach(([key, value]) => {
        var _a;
        var _b;
        (_a = (_b = runtime.root_pkg_json.data.scripts)[key]) !== null && _a !== void 0 ? _a : (_b[key] = value);
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
        var _a;
        var _b;
        const _check = (0, pkg_deps_add_1._checkDependenciesExistsAll)(runtime.root_pkg_json.data, [
            'devDependencies',
            'dependencies',
        ], name);
        if (!_check._exists) {
            (_a = (_b = runtime.root_pkg_json.data).devDependencies) !== null && _a !== void 0 ? _a : (_b.devDependencies = {});
            runtime.root_pkg_json.data.devDependencies[name] = '*';
        }
    });
    /**
     * 任何欄位增補後都需要重新排序並寫回
     * Re-sort and write back after any field additions
     */
    runtime.root_pkg_json.data = (0, sort_package_json3_1.sortPackageJson)(runtime.root_pkg_json.data);
    runtime.root_pkg_json.write();
    /**
     * 同步 workspace 內各套件的依賴版本號並儲存，
     * 確保內部互相依賴的版本一致
     * Sync dependency version numbers across workspace packages and save,
     * keeping internal cross-dependencies consistent
     */
    let wss = new ws_scope_1.WorkspacesScope(runtime.rootData.ws);
    wss.syncValue();
    wss.save();
    return runtime;
}
//# sourceMappingURL=index.js.map