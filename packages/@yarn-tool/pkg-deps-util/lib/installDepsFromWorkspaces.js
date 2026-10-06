"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installDepsFromWorkspaces = installDepsFromWorkspaces;
/**
 * 將套件安裝到 workspace 內的本地套件 (Install into local workspace packages)
 *
 * 對於工作區內已存在的套件，不需要連線至 registry，
 * 直接把 `^目前版本` 寫入該套件的 `package.json` 即可。
 *
 * Packages that already exist inside the workspace do not need the registry;
 * their current version is written as `^x.y.z` into that package.json directly.
 */
const listable_1 = require("ws-pkg-list/lib/listable");
const find_root_1 = require("@yarn-tool/find-root");
const package_dts_1 = require("@ts-type/package-dts");
const path_1 = require("path");
const npm_package_arg_util_1 = require("@yarn-tool/npm-package-arg-util");
const pkg_deps_add_1 = require("@yarn-tool/pkg-deps-add");
const sortDependencies_1 = require("./util/sortDependencies");
/**
 * 安裝工作區內的本地套件 (Install workspace-local packages)
 *
 * Install local packages that exist inside the workspace.
 *
 * @param packageNames 要安裝的套件名稱或查詢字串 (Names or specifiers to install)
 * @param options 安裝選項，可指定 `cwd`、`pkg` 等 (Install options such as `cwd` / `pkg`)
 *
 * @returns 回傳 `added`、`exists`、`others`、`updated` 與被修改的 `pkg`；
 * 嚴格模式下若根目錄不是 workspace，會直接拋出例外。
 *
 * Returns `added`, `exists`, `others`, `updated` and the mutated `pkg`;
 * throws when the root is not a valid workspace, because this function is
 * only meaningful in that context.
 */
function installDepsFromWorkspaces(packageNames, options = {}) {
    var _a, _b;
    const cwd = (_a = options.cwd) !== null && _a !== void 0 ? _a : (options.cwd = process.cwd());
    /**
     * 強制覆寫為嚴格檢查：此函式只有在正確的 workspace 結構下才有意義，
     * 容錯模式反而可能把依賴寫進錯誤的 `package.json`。
     *
     * Forces strict checks: this function is only meaningful under a correct
     * workspace layout, and being lenient could write into the wrong package.json.
     */
    options = {
        ...options,
        cwd,
        throwError: true,
        skipCheckWorkspace: false,
        shouldHasWorkspaces: true,
        shouldNotWorkspacesRoot: true,
    };
    const rootData = (0, find_root_1.findRoot)(options);
    /**
     * 不符合 workspace 結構時立即失敗，避免後續在錯誤的根目錄上操作
     *
     * Fails fast on an invalid layout so we never operate on the wrong root.
     */
    (0, find_root_1.assertHasAndNotWorkspacesRoot)(rootData);
    /**
     * 允許呼叫端帶入已讀取的 `package.json`，重複執行時可避免多餘的檔案 I/O
     *
     * Lets callers pass an already-loaded package.json to avoid repeated file I/O.
     */
    const pkg = (_b = options.pkg) !== null && _b !== void 0 ? _b : (0, package_dts_1.readPackageJson)((0, path_1.join)(rootData.pkg, 'package.json'));
    /**
     * 先把工作區內所有套件攤平成名稱索引，讓每個輸入只需 O(1) 查找
     *
     * Flattens every workspace package into a name index so each lookup is O(1).
     */
    const record = (0, listable_1.wsPkgListable)(rootData.root)
        .reduce((a, b) => {
        a[b.name] = b;
        return a;
    }, {});
    const added = [];
    const exists = [];
    const others = packageNames
        .filter(packageName => {
        /**
         * 用 `npa` 解析，因為輸入可能是 `pkg@1.2.3`、`tag` 或遠端網址等形式
         *
         * npa is used because the input may be `pkg@1.2.3`, a tag, or even a URL.
         */
        const result = (0, npm_package_arg_util_1.npa)(packageName);
        const { name } = result;
        const row = record[name];
        if (row) {
            /**
             * 工作區內的本地套件一律以 `^目前版本` 寫入，保持 workspace 內相依版本一致
             *
             * Workspace-local packages always get `^currentVersion` so all workspace
             * dependencies stay consistent.
             */
            const semver = `^${row.version}`;
            let bool = (0, pkg_deps_add_1.addDependenciesIfNotExists)(pkg, name, semver, options).bool;
            /**
             * 區分「本次新增」與「本來就存在」，兩者都不需再交給後續流程
             *
             * Distinguishes newly added from already present; neither needs further handling.
             */
            if (bool === 2 /* EnumResultAddDependencies.changed */) {
                added.push([name, semver]);
            }
            else {
                exists.push(name);
            }
            /**
             * 已由本地套件處理，從待安裝清單中移除
             *
             * Handled locally, so remove it from the pending list.
             */
            return false;
        }
        else {
            /**
             * 不在工作區內，保留給呼叫端決定如何安裝
             *
             * Not in the workspace, so keep it for the caller to handle.
             */
            return true;
        }
    });
    /**
     * 只要有任一項目被本地處理就視為有更新，避免多餘的排序與寫檔
     *
     * Treats any locally handled item as a change to avoid needless sorting/writing.
     */
    const updated = others.length !== packageNames.length;
    if (updated) {
        (0, sortDependencies_1.sortDependencies)(pkg);
    }
    const result = {
        cwd,
        rootData,
        added,
        exists,
        others,
        pkg,
        updated,
    };
    /**
     * 僅作為型別檢查：不改變執行期行為，但讓回傳值符合 `IResultInstallDeps`
     *
     * Type-level assertion only: no runtime effect, but keeps the return value
     * conforming to IResultInstallDeps.
     */
    result;
    return result;
}
//# sourceMappingURL=installDepsFromWorkspaces.js.map