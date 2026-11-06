"use strict";
/**
 * 創建 Workspaces 工具模組
 *
 * 提供初始化 Workspaces 專案結構的功能，
 * 包含 package.json 設定、
 * Lerna 整合、
 * 目錄創建與靜態檔案複製等功能。
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createYarnWorkspaces = createYarnWorkspaces;
exports.createYarnWorkspacesAsync = createYarnWorkspacesAsync;
const tslib_1 = require("tslib");
const core_1 = require("./lib/core");
const check_env_1 = require("./lib/check-env");
tslib_1.__exportStar(require("./lib/index"), exports);
tslib_1.__exportStar(require("./lib/util"), exports);
/**
 * 創建 Workspaces 主函式（同步）
 *
 * 檢查並創建 Workspaces 專案結構，處理已存在 Package 與父層 Workspaces 的情況。
 * 不支援互動介面：環境檢查發現疑似錯誤路徑時僅印出警告並繼續執行。
 *
 * @param cwd - 工作目錄路徑
 * @param options - 配置選項
 * @returns 是否成功創建
 *
 * @deprecated 請改用 `createYarnWorkspacesAsync` 以獲得更好的互動體驗
 */
function createYarnWorkspaces(cwd, options = {}) {
    const precheck = (0, core_1._precheckYarnWorkspaces)(cwd, options);
    if (!precheck.ok) {
        return false;
    }
    const report = (0, check_env_1._checkEnv)(precheck.targetPath, precheck.options);
    if (report.suspicious) {
        /** sync 版本不支援互動介面：印出警告後繼續執行（原有邏輯機制）。 */
        (0, check_env_1._warnCheckEnv)(report);
    }
    return (0, core_1._createYarnWorkspaces)(precheck.targetPath, precheck.options);
}
/**
 * 創建 Workspaces 主函式（非同步）
 *
 * 與 {@link createYarnWorkspaces} 相同，但當 `options.interactive` 啟用且環境具備 TTY 時，
 * 會依環境檢查報告透過互動介面詢問是否繼續；
 * 未啟用互動介面（或不具備 TTY）時與同步版本相同，僅印出警告並繼續執行。
 *
 * @param cwd - 工作目錄路徑
 * @param options - 配置選項
 * @returns 是否成功創建；使用者在互動介面取消時回傳 false
 */
async function createYarnWorkspacesAsync(cwd, options = {}) {
    const precheck = (0, core_1._precheckYarnWorkspaces)(cwd, options);
    if (!precheck.ok) {
        return false;
    }
    const report = (0, check_env_1._checkEnv)(precheck.targetPath, precheck.options);
    if (report.suspicious) {
        if (precheck.options.interactive && (0, check_env_1._checkInteractive)()) {
            /** 依 _checkEnv 結果詢問是否疑似在錯誤路徑執行、仍要繼續 */
            if (!await (0, check_env_1._confirmCheckEnv)(report)) {
                return false;
            }
        }
        else {
            /** 未啟用互動介面：印出警告但繼續執行（原有邏輯機制） */
            (0, check_env_1._warnCheckEnv)(report);
        }
    }
    return (0, core_1._createYarnWorkspaces)(precheck.targetPath, precheck.options);
}
/**
 * 預設導出創建函式
 */
exports.default = createYarnWorkspaces;
//# sourceMappingURL=index.js.map