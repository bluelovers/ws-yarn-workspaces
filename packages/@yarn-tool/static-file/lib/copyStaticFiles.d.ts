/**
 * Copy static files main function / 複製靜態檔案主函數
 *
 * This module provides the main function for copying static files to a target directory.
 * 此模組提供將靜態檔案複製到目標目錄的主函數。
 *
 * @module copyStaticFiles
 */
import { ICopyStaticFilesOptions, IStaticFilesMapArrayEntry } from './types';
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
 *
 * @returns Array of entries that were successfully copied / 成功複製的條目陣列
 *
 * @throws {TypeError} When options.cwd is not a valid string / 當 options.cwd 不是有效的字串時
 * @throws {TypeError} When options.cwd directory does not exist / 當 options.cwd 目錄不存在時
 * @throws {TypeError} When file_map is invalid / 當 file_map 無效時
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
export declare function copyStaticFiles<K extends string>(options: ICopyStaticFilesOptions<K>): IStaticFilesMapArrayEntry<string | K>[];
