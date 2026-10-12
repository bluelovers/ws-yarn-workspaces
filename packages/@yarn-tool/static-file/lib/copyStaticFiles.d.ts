/**
 * Copy static files main function / 複製靜態檔案主函數
 *
 * This module provides the main function for copying static files to a target directory.
 * 此模組提供將靜態檔案複製到目標目錄的主函數。
 *
 * @module copyStaticFiles
 */
import { ICopyStaticFilesOptions, ICopyStaticFilesOptionsRuntime, IStaticFilesMapArray, IStaticFilesMapArrayEntry } from './types';
/**
 * Copy static files to a target directory / 將靜態檔案複製到目標目錄
 *
 * Copies static files based on the provided file map configuration.
 * 根據提供的檔案映射配置複製靜態檔案。
 *
 * @template K - The target file path type / 目標檔案路徑類型
 *
 * @param options - Copy options / 複製選項
 * @param options.cwd - Current working directory (required) / 當前工作目錄（必填）
 * @param options.staticRoot - Root directory of static files (defaults to package root) / 靜態檔案根目錄（預設為套件根目錄）
 * @param options.overwrite - Whether to overwrite existing files / 是否覆蓋已存在的檔案
 * @param options.file_map - Custom file mapping configuration / 自訂檔案映射配置
 * @param options.ignoreFilesSnapshot - Snapshot of existing ignore files; enables auto-merge when given / reset 前建立的既有 ignore 檔快照；提供時啟用自動合併
 *
 * @returns Array of entries that were successfully copied / 成功複製的條目陣列
 *
 * @throws {TypeError} When options.cwd is not a valid string / 當 options.cwd 不是有效的字串時
 * @throws {TypeError} When options.cwd directory does not exist / 當 options.cwd 目錄不存在時
 * @throws {TypeError} When file_map is invalid / 當 file_map 無效時
 *
 * @see mergeIgnoreFiles
 *
 * @example
 * ```typescript
 * import { copyStaticFiles } from '@yarn-tool/static-file';
 *
 * // Copy default static files to current directory
 * // 複製預設靜態檔案到當前目錄
 * copyStaticFiles({
 *   cwd: process.cwd(),
 *   overwrite: true
 * });
 *
 * // Copy with custom file map
 * // 使用自訂檔案映射複製
 * copyStaticFiles({
 *   cwd: '/path/to/project',
 *   file_map: [
 *     ['.gitignore', 'file/gitignore'],
 *     ['README.md', 'file/README.md']
 *   ]
 * });
 * ```
 */
export declare function copyStaticFiles<K extends string>(options: ICopyStaticFilesOptions<K>): IStaticFilesMapArray<K>;
/**
 * 驗證並補齊複製選項 / Validate and fill in copy options
 *
 * 回傳的選項保證 cwd 為已存在的字串、file_map 已解析成陣列、staticRoot 已有明確值。
 * The returned options guarantee an existing string cwd, an array-form file_map, and a resolved staticRoot.
 *
 * @template K - 目標檔案路徑類型 / Target file path type
 *
 * @param options - 呼叫端傳入的原始選項 / Raw options passed by the caller
 * @returns 補齊預設值後的選項 / Options with defaults resolved
 *
 * @throws {TypeError} 當 cwd 不是字串或目錄不存在、或 file_map 解析結果為空時 / When cwd is not a string or does not exist, or the parsed file map is empty
 *
 * @example
 * ```typescript
 * import { _handleCopyStaticFilesOptions } from '@yarn-tool/static-file/lib/copyStaticFiles';
 *
 * // 只需傳入必填的 cwd，其餘取預設值 / Only the required cwd is passed; the rest use defaults
 * const options = _handleCopyStaticFilesOptions({ cwd: '/path/to/project' });
 *
 * console.log(options.staticRoot); // 本套件的 file/ 目錄 / this package's file/ directory
 * console.log(options.file_map);   // 預設靜態檔案清單 / default static file list
 * ```
 */
export declare function _handleCopyStaticFilesOptions<K extends string>(options: ICopyStaticFilesOptions<K>): ICopyStaticFilesOptionsRuntime<K>;
/**
 * 逐項產出可複製的靜態檔案 / Yield each static file ready to be copied
*
 * 只負責驗證、解析與過濾，本身不寫入任何檔案；是否複製由呼叫端決定（執行 yield 出來的 copy()）。
 * Only validates, resolves and filters — it never writes files; the caller decides whether to run the yielded copy().
 *
 * @template K - 目標檔案路徑類型 / Target file path type
 *
 * @param options - 複製選項 / Copy options
 * @yields 解析完成的條目、其複製資訊與複製動作 / The resolved entry, its copy info, and the copy action
 *
 * @throws {TypeError} 當選項驗證失敗時 / When option validation fails
 * @throws {Error} 當來源靜態檔案不存在時 / When the source static file does not exist
 *
 * @example
 * ```typescript
 * import { _copyStaticFilesCoreListGenerator } from '@yarn-tool/static-file/lib/copyStaticFiles';
 *
 * for (const { entry, runtime, copy } of _copyStaticFilesCoreListGenerator({ cwd: '/path/to/project' }))
 * {
 *   console.log(entry[0], '=>', runtime.targetFileFull);
 *
 *   // 決定權交給呼叫端；不呼叫 copy() 就不會寫入任何檔案 / The caller decides; without copy() nothing is written
 *   copy();
 * }
 * ```
 */
export declare function _copyStaticFilesCoreListGenerator<K extends string>(options: ICopyStaticFilesOptions<K>): Generator<{
    entry: IStaticFilesMapArrayEntry<K>;
    runtime: import("./types").IStaticFilesEntryRuntime<K>;
    copy(): void;
}, void, unknown>;
