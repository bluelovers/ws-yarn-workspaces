/**
 * Static files root directory constant / 靜態檔案根目錄常量
 *
 * This module exports the root directory path where static files are located.
 * 此模組匯出靜態檔案所在的根目錄路徑。
 *
 * The `__STATIC_ROOT` constant is used internally to locate the static files
 * that will be copied to target directories.
 * `__STATIC_ROOT` 常量在內部用於定位將被複製到目標目錄的靜態檔案。
 *
 * @module __root
 *
 * @example
 * ```typescript
 * import { __STATIC_ROOT } from '@yarn-tool/static-file/__root';
 *
 * console.log(__STATIC_ROOT);
 * // Outputs the path to the static files directory
 * // 輸出靜態檔案目錄的路徑
 * ```
 */

/**
 * The root directory path of the static files / 靜態檔案的根目錄路徑
 *
 * This is the directory where the `file/` folder containing all static
 * configuration templates is located.
 * 這是包含所有靜態配置模板的 `file/` 資料夾所在的目錄。
 */
export const __STATIC_ROOT = __dirname;
