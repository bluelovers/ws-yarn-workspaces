/**
 * Remap static files map array / 重新映射靜態檔案映射陣列
 *
 * This module provides a function to remap target file paths in a static files map.
 * 此模組提供重新映射靜態檔案映射中目標檔案路徑的函數。
 *
 * @module reMapStaticFilesMapArray
 */
import { IStaticFiles, IStaticFilesKey, IStaticFilesMapArray } from './types';
/**
 * Remap static files map array with new target paths / 使用新目標路徑重新映射靜態檔案映射陣列
 *
 * Creates a new static files map array by replacing target file paths according to the provided mapping.
 * 根據提供的映射關係，通過替換目標檔案路徑來創建新的靜態檔案映射陣列。
 *
 * This is useful when you want to copy the same static file to different target locations.
 * 當您想將同一個靜態檔案複製到不同的目標位置時，這非常有用。
 *
 * @template T - The source static files map type / 來源靜態檔案映射類型
 * @template N - The new target file path type / 新目標檔案路徑類型
 *
 * @param file_map - The source static files map / 來源靜態檔案映射
 * @param replaceMap - A record mapping new target paths to old target paths / 將新路徑映射到舊路徑的記錄
 *
 * @returns A new static files map array with remapped entries / 重新映射條目的新靜態檔案映射陣列
 *
 * @example
 * ```typescript
 * import { reMapStaticFilesMapArray } from '@yarn-tool/static-file';
 * import { defaultCopyStaticFiles } from '@yarn-tool/static-file/lib/const';
 *
 * // Remap tsconfig.json.tpl to tsconfig.json
 * // 將 tsconfig.json.tpl 重新映射為 tsconfig.json
 * const remapped = reMapStaticFilesMapArray(defaultCopyStaticFiles, {
 *   'tsconfig.json': 'tsconfig.json.tpl'
 * });
 * // The result will have an entry for 'tsconfig.json' instead of 'tsconfig.json.tpl'
 * // 結果將包含 'tsconfig.json' 的條目，而不是 'tsconfig.json.tpl'
 * ```
 */
export declare function reMapStaticFilesMapArray<T extends IStaticFiles<string>, N extends string>(file_map: T, replaceMap: Record<N, IStaticFilesKey<T>>): IStaticFilesMapArray<IStaticFilesKey<T> | N>;
