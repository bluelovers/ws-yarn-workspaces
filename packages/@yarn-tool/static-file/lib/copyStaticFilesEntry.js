"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyStaticFilesEntry = copyStaticFilesEntry;
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const __root_1 = require("../__root");
/**
 * Copy a single static file entry / 複製單個靜態檔案條目
 *
 * Copies a single static file from the static root to the target directory.
 * 從靜態根目錄複製單個靜態檔案到目標目錄。
 *
 * @param entry - The static file entry / 靜態檔案條目
 * @param entry.0 - targetFile: Target file path / 目標檔案路徑
 * @param entry.1 - staticFile: Source static file path / 來源靜態檔案路徑
 * @param entry.2 - detectFile: Optional file to check for existence / 可選的檢測檔案
 *
 * @param cwd - Current working directory / 當前工作目錄
 * @param staticRoot - Root directory of static files (defaults to package root) / 靜態檔案根目錄（預設為套件根目錄）
 * @param overwrite - Whether to overwrite existing files (defaults to false) / 是否覆蓋已存在的檔案（預設為 false）
 *
 * @returns true if file was copied, undefined if skipped (detect file exists) / 如果檔案已複製則返回 true，如果跳過（檢測檔案存在）則返回 undefined
 *
 * @throws {Error} When the source static file does not exist / 當來源靜態檔案不存在時
 *
 * @example
 * ```typescript
 * import { copyStaticFilesEntry } from '@yarn-tool/static-file';
 *
 * // Copy a single file
 * // 複製單個檔案
 * const result = copyStaticFilesEntry(
 *   ['.gitignore', 'file/gitignore'],
 *   '/path/to/project',
 *   '/path/to/static/root',
 *   false
 * );
 *
 * // With detect file - skips if detect file exists
 * // 使用檢測檔案 - 如果檢測檔案存在則跳過
 * const result = copyStaticFilesEntry(
 *   ['tsconfig.json', 'file/tsconfig.json.tpl', 'tsconfig.json'],
 *   '/path/to/project'
 * );
 * // Skips copy if tsconfig.json already exists in the project
 * // 如果 tsconfig.json 已存在於專案中則跳過複製
 * ```
 */
function copyStaticFilesEntry(entry, cwd, staticRoot = __root_1.__STATIC_ROOT, overwrite) {
    const [targetFile, staticFile, detectFile] = entry;
    /**
     * 檢查檢測檔案 (detect file) 是否存在，存在即跳過複製
     * Check if detect file exists - skip copy if it does
     *
     * 用於「範本檔」情境：專案已有正式設定檔時不應被樣板覆蓋
     * For template scenarios: an existing real config file must not be overwritten by the template
     */
    if (detectFile === null || detectFile === void 0 ? void 0 : detectFile.length) {
        const fc = (0, path_1.resolve)(cwd, detectFile);
        if ((0, fs_extra_1.existsSync)(fc)) {
            return;
        }
    }
    /**
     * 解析來源檔案路徑
     * Resolve source file path
     *
     * 以靜態根目錄為基準，樣板路徑可為巢狀（如 file/test/…）
     * Resolved against the static root; template paths may be nested (e.g. file/test/…)
     */
    const fb = (0, path_1.resolve)(staticRoot, staticFile);
    /**
     * 驗證來源檔案是否存在
     * Verify source file exists
     *
     * 來源缺失代表清單與 file/ 目錄不同步，應立即失敗而非複製出殘缺結果
     * A missing source means the map is out of sync with file/; fail instead of producing a partial copy
     */
    if (!(0, fs_extra_1.existsSync)(fb)) {
        throw new Error(`file not exists. ${fb}`);
    }
    /**
     * 解析目標檔案路徑
     * Resolve target file path
     */
    const fa = (0, path_1.resolve)(cwd, targetFile);
    /**
     * 確保目標目錄存在
     * Ensure target directory exists
     *
     * 目標可能位於子目錄（如 .github/workflows/），需先建立
     * Targets may live in subdirectories (e.g. .github/workflows/), which must be created first
     */
    (0, fs_extra_1.ensureDirSync)((0, path_1.dirname)(fa));
    /**
     * 複製檔案
     * Copy the file
     *
     * overwrite 預設關閉並搭配 errorOnExist: false，讓已存在的目標維持原狀且不中斷批次
     * overwrite defaults off with errorOnExist: false so existing targets stay untouched and the batch continues
     */
    (0, fs_extra_1.copySync)(fb, fa, {
        overwrite: overwrite || false,
        preserveTimestamps: true,
        errorOnExist: false,
    });
    return true;
}
//# sourceMappingURL=copyStaticFilesEntry.js.map