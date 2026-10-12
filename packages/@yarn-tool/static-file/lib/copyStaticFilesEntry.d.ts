/**
 * Copy single static file entry / 複製單個靜態檔案條目
 *
 * This module provides the function for copying a single static file entry.
 * 此模組提供複製單個靜態檔案條目的函數。
 *
 * @module copyStaticFilesEntry
 */
import { IStaticFilesEntryRuntime, IStaticFilesMapArrayEntry } from './types';
/**
 * 解析單個靜態檔案條目的複製資訊 / Resolve copy info for a single static file entry
 *
 * 只做路徑解析與存在性檢查，不寫入任何檔案；真正的複製交給 _copyStaticFilesEntryCoreCopy。
 * Only resolves paths and checks existence — nothing is written; the actual copy is done by _copyStaticFilesEntryCoreCopy.
 *
 * @param entry - 靜態檔案條目 / Static file entry
 * @param entry.0 - targetFile：目標檔案路徑 / Target file path
 * @param entry.1 - staticFile：來源靜態檔案路徑 / Source static file path
 * @param entry.2 - detectFile：可選的檢測檔案 / Optional file to check for existence
 *
 * @param cwd - 當前工作目錄 / Current working directory
 * @param staticRoot - 靜態檔案根目錄（預設為套件根目錄）/ Root directory of static files (defaults to package root)
 * @param overwrite - 是否覆蓋已存在的檔案（預設為 false）/ Whether to overwrite existing files (defaults to false)
 *
 * @returns 解析後的複製資訊；被 detectFile 跳過時回傳 undefined / Resolved copy info, or undefined when skipped by detectFile
 * @throws {Error} 當來源靜態檔案不存在時 / When the source static file does not exist
 *
 * @example
 * ```typescript
 * import { _copyStaticFilesEntryCore, _copyStaticFilesEntryCoreCopy } from '@yarn-tool/static-file/lib/copyStaticFilesEntry';
 *
 * // 複製單個檔案 / Copy a single file
 * const runtime = _copyStaticFilesEntryCore(
 *   ['.gitignore', 'file/gitignore'],
 *   '/path/to/project',
 *   '/path/to/static/root',
 *   false,
 * );
 *
 * if (runtime)
 * {
 *   _copyStaticFilesEntryCoreCopy(runtime);
 * }
 *
 * // 使用檢測檔案：正式設定檔已存在時跳過 / With detect file: skip when the real config already exists
 * _copyStaticFilesEntryCore(
 *   ['tsconfig.json', 'file/tsconfig.json.tpl', 'tsconfig.json'],
 *   '/path/to/project',
 * );
 * // 專案已有 tsconfig.json 時回傳 undefined / Returns undefined when tsconfig.json already exists
 * ```
 */
export declare function _copyStaticFilesEntryCore<K extends string>(entry: IStaticFilesMapArrayEntry<K>, cwd: string, staticRoot?: string, overwrite?: boolean): IStaticFilesEntryRuntime<K>;
/**
 * 執行單個靜態檔案的實際複製 / Perform the actual copy of a single static file entry
 *
 * @param runtime - _copyStaticFilesEntryCore 解析出的複製資訊 / Copy info resolved by _copyStaticFilesEntryCore
 * @throws {TypeError} 當 runtime 為 undefined 時（detectFile 命中）/ When runtime is undefined (detectFile matched)
 */
export declare function _copyStaticFilesEntryCoreCopy<K extends string>(runtime: IStaticFilesEntryRuntime<K>): void;
/**
 * 複製單個靜態檔案到目標目錄 / Copy a single static file into the target directory
 *
 * 先解析再複製；被 detectFile 跳過時不會寫入任何檔案。
 * Resolves first, then copies; nothing is written when detectFile skips the entry.
 *
 * @param entry - 靜態檔案條目 / Static file entry
 * @param entry.0 - targetFile：目標檔案路徑 / Target file path
 * @param entry.1 - staticFile：來源靜態檔案路徑 / Source static file path
 * @param entry.2 - detectFile：可選的檢測檔案 / Optional file to check for existence
 *
 * @param cwd - 當前工作目錄 / Current working directory
 * @param staticRoot - 靜態檔案根目錄（預設為套件根目錄）/ Root directory of static files (defaults to package root)
 * @param overwrite - 是否覆蓋已存在的檔案（預設為 false）/ Whether to overwrite existing files (defaults to false)
 *
 * @returns 已複製時回傳 true；被 detectFile 跳過時回傳 undefined / Returns true when copied, undefined when skipped by detectFile
 * @throws {Error} 當來源靜態檔案不存在時 / When the source static file does not exist
 *
 * @example
 * ```typescript
 * import { copyStaticFilesEntry } from '@yarn-tool/static-file/lib/copyStaticFilesEntry';
 *
 * // 複製單個檔案 / Copy a single file
 * const copied = copyStaticFilesEntry(
 *   ['.gitignore', 'file/gitignore'],
 *   '/path/to/project',
 *   '/path/to/static/root',
 *   false,
 * );
 *
 * // 使用檢測檔案：已存在則跳過 / With detect file: skip when it already exists
 * const skipped = copyStaticFilesEntry(
 *   ['tsconfig.json', 'file/tsconfig.json.tpl', 'tsconfig.json'],
 *   '/path/to/project',
 * );
 * // 專案已有 tsconfig.json 時 skipped 為 undefined / skipped is undefined when tsconfig.json already exists
 * ```
 */
export declare function copyStaticFilesEntry<K extends string>(entry: IStaticFilesMapArrayEntry<K>, cwd: string, staticRoot?: string, overwrite?: boolean): boolean;
