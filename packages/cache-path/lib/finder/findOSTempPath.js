"use strict";
/**
 * 作業系統暫存路徑尋找模組
 * OS Temp Path Finder Module
 *
 * @module cache-path/lib/finder/findOSTempPath
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOSTempPath = findOSTempPath;
const os_1 = require("os");
/**
 * 取得作業系統暫存目錄
 * Get OS temporary directory
 *
 * 回傳作業系統的預設暫存目錄路徑。
 * Returns the operating system's default temporary directory path.
 *
 * 各作業系統的常見路徑 / Common paths for different operating systems:
 * - macOS: '/var/folders/...'
 * - Linux: '/tmp'
 * - Windows: 'C:\Users\USER\AppData\Local\Temp'
 *
 * @param {string} [cwd] - 此參數未使用，僅為介面一致性保留 / This parameter is not used, kept for interface consistency
 * @param {NodeJS.ProcessEnv} [processEnv=process.env] - 此參數未使用，僅為介面一致性保留 / This parameter is not used, kept for interface consistency
 * @returns {string} 作業系統暫存目錄路徑 / OS temporary directory path
 *
 * @example
 * const tempPath = findOSTempPath();
 * console.log(tempPath); // '/tmp' (Linux) 或 '/var/folders/...' (macOS) / or '/var/folders/...' (macOS)
 */
function findOSTempPath(cwd, processEnv = process.env, options) {
    return (0, os_1.tmpdir)();
}
//# sourceMappingURL=findOSTempPath.js.map