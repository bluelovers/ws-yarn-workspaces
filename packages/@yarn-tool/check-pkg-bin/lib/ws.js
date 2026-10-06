"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkWorkspaces = checkWorkspaces;
const listpkg_1 = require("ws-pkg-list/lib/listpkg");
const pkg_1 = require("./pkg");
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
function checkWorkspaces(cwd = process.cwd()) {
    return (0, listpkg_1.workspacesPackagesList)(cwd)
        .map(cwd => (0, pkg_1.checkPkgDir)(cwd));
}
//# sourceMappingURL=ws.js.map