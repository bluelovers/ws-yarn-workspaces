/**
 * Copy single static file entry / 複製單個靜態檔案條目
 *
 * This module provides the function for copying a single static file entry.
 * 此模組提供複製單個靜態檔案條目的函數。
 *
 * @module copyStaticFilesEntry
 */
import { IStaticFilesMapArrayEntry } from './types';
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
export declare function copyStaticFilesEntry(entry: IStaticFilesMapArrayEntry<string>, cwd: string, staticRoot?: string, overwrite?: boolean): boolean;
