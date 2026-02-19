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
    // Check if detect file exists - skip copy if it does / 檢查檢測檔案是否存在 - 如果存在則跳過複製
    if (detectFile === null || detectFile === void 0 ? void 0 : detectFile.length) {
        const fc = (0, path_1.resolve)(cwd, detectFile);
        if ((0, fs_extra_1.existsSync)(fc)) {
            return;
        }
    }
    // Resolve source file path / 解析來源檔案路徑
    const fb = (0, path_1.resolve)(staticRoot, staticFile);
    // Verify source file exists / 驗證來源檔案是否存在
    if (!(0, fs_extra_1.existsSync)(fb)) {
        throw new Error(`file not exists. ${fb}`);
    }
    // Resolve target file path / 解析目標檔案路徑
    const fa = (0, path_1.resolve)(cwd, targetFile);
    // Ensure target directory exists / 確保目標目錄存在
    (0, fs_extra_1.ensureDirSync)((0, path_1.dirname)(fa));
    // Copy the file / 複製檔案
    (0, fs_extra_1.copySync)(fb, fa, {
        overwrite: overwrite || false,
        preserveTimestamps: true,
        errorOnExist: false,
    });
    return true;
}
//# sourceMappingURL=copyStaticFilesEntry.js.map