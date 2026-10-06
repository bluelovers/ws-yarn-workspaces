"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixWorkspacesPackageLinks = fixWorkspacesPackageLinks;
/**
 * @yarn-tool/fix-ws-pkgs-link
 *
 * 修復 workspace 套件在 node_modules 的符號連結
 * Sync workspace package symlinks in node_modules
 *
 * 將 workspace 內每個套件重新連結到根目錄的 node_modules，
 * 修正缺失、指向錯誤或被實體目錄取代的連結
 * Re-links each workspace package into the root node_modules, fixing
 * missing links, wrong targets, or real directories that replaced them
 */
const listable_1 = require("ws-pkg-list/lib/listable");
const find_root_1 = require("@yarn-tool/find-root");
const util_1 = require("@yarn-tool/node-modules/lib/util");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const path_is_same_1 = require("path-is-same");
const fs_stat_1 = require("fs-stat");
const fs_symlink_extra_1 = require("fs-symlink-extra");
/**
 * 修復 workspace 套件的符號連結
 * Fix symlinks for workspace packages
 *
 * 對每個套件檢查 `<node_modules>/<套件名>`：
 * 1. 連結不存在 → 直接建立
 * 2. 是實體檔案/目錄但 realpath 與套件路徑不同 → 先改名備份再建立連結
 * 3. 已是正確連結 → 略過（不列入回傳值）
 *
 * Checks `<node_modules>/<name>` for each package:
 * 1. Link missing → create it directly
 * 2. Real file/dir whose realpath differs from the package location →
 *    rename it as a backup, then create the link
 * 3. Already a correct link → skipped (not included in the return value)
 *
 * 以 rename 而非刪除保留既有檔案，避免使用者自製連結或實體安裝被永久破壞
 * Uses rename instead of delete to preserve existing files, so handmade
 * links or real installations are not destroyed permanently
 *
 * @param {string} [cwd] - 起始目錄，預設由 findRootLazy() 解析 / Starting directory; resolved by findRootLazy() when omitted
 * @returns 實際重建連結的套件項目 / Entries whose links were actually rebuilt
 */
function fixWorkspacesPackageLinks(cwd) {
    /**
     * 惰性尋找 workspace 根目錄，失敗時不拋錯、由下游處理
     * Lazily find the workspace root; failure surfaces downstream instead of throwing here
     */
    const rootData = (0, find_root_1.findRootLazy)({
        cwd,
    });
    /**
     * 根目錄的 node_modules 路徑
     * node_modules path of the root
     */
    const node_modules = (0, util_1.getModulesDir)(rootData.root);
    /**
     * 列出 workspace 內所有套件
     * List all packages inside the workspace
     */
    const listable = (0, listable_1.wsPkgListable)(rootData.root);
    return listable.filter((entry) => {
        /**
         * 期望的連結位置
         * Expected link location
         */
        let target = (0, path_1.join)(node_modules, entry.name);
        /**
         * 需要修復的條件：
         * - 目標不存在（連結遺失）
         * - 存在但不是符號連結，且 realpath 與套件實際路徑不同
         *   （若 realpath 相同則視為等價連結，無需重建）
         * Conditions requiring a fix:
         * - Target does not exist (link lost)
         * - Exists but is not a symlink and its realpath differs from the
         *   package location (equal realpath counts as equivalent; no rebuild)
         */
        if (!(0, fs_extra_1.pathExistsSync)(target) || !(0, fs_stat_1.isSymbolicLinkSync)(target) && !(0, path_is_same_1.fsSameRealpath)(target, entry.location)) {
            /**
             * 目標已被實體檔案/目錄佔用時，改名備份而非刪除，
             * `Math.random()` 確保備份檔名不會互相覆蓋
             * When the target is occupied by a real file/dir, rename it as a
             * backup instead of deleting; `Math.random()` avoids name collisions
             */
            if ((0, fs_extra_1.pathExistsSync)(target)) {
                (0, fs_extra_1.renameSync)(target, target + '.old_' + Math.random());
            }
            /**
             * 以 overwrite 建立連結，涵蓋 TOCTOU 期間連結剛好出現的情境
             * Create the link with overwrite to cover the case where a link
             * appears between the check above and this call (TOCTOU)
             */
            (0, fs_symlink_extra_1.fsSymlinkSync)(entry.location, target, {
                overwrite: true,
            });
            /**
             * 回傳 true 表示此套件已被修復
             * Return true to mark this package as fixed
             */
            return true;
        }
    });
}
exports.default = fixWorkspacesPackageLinks;
//# sourceMappingURL=index.js.map