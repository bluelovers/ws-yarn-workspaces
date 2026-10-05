/**
 * Remap static files map array / 重新映射靜態檔案映射陣列
 *
 * This module provides a function to remap target file paths in a static files map.
 * 此模組提供重新映射靜態檔案映射中目標檔案路徑的函數。
 *
 * @module reMapStaticFilesMapArray
 */
import { IStaticFiles, IStaticFilesKey, IStaticFilesMapArray, IStaticFilesMapArrayEntry } from './types';
import { parseStaticMap } from './parseStaticMap';
import { getRowOfStaticFilesMapArray } from './getRowOfStaticFilesMapArray';
import { replaceTargetOfStaticFilesMapArrayEntry } from './replaceTargetOfStaticFilesMapArrayEntry';
import { array_unique_overwrite } from 'array-hyper-unique';

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
export function reMapStaticFilesMapArray<T extends IStaticFiles<string>, N extends string>(file_map: T,
	replaceMap: Record<N, IStaticFilesKey<T>>,
)
{
	/**
	 * 解析來源檔案映射
	 * Parse the source file map
	 *
	 * 先正規化成陣列，之後才能依 key 查找並重複合成
	 * Normalize into an array first, so entries can be looked up by key and merged later
	 */
	const ls = parseStaticMap(file_map);

	/**
	 * 逐筆處理替換映射：把「新路徑 → 舊路徑」轉成新的條目
	 * Process each replacement mapping: turn "new path → old path" into new entries
	 */
	const arr = (Object.entries(replaceMap) as [N, IStaticFilesKey<T>][])
		.reduce((arr, [targetNew, targetOld]) =>
		{

			/**
			 * 查找原始條目
			 * Find the original entry
			 */
			let old = getRowOfStaticFilesMapArray(ls, targetOld)

			/**
			 * 原始條目不存在時略過（例如清單中沒有該檔案），避免產生無來源的條目
			 * Skip when the original entry is absent (e.g. the file is not in the list) to avoid source-less entries
			 */
			if (old?.length)
			{
				arr.push(replaceTargetOfStaticFilesMapArrayEntry(old, targetNew))
			}

			return arr
		}, [] as IStaticFilesMapArray<N>)
	;

	/**
	 * 合併重新映射的條目與原始條目並移除重複項
	 * Combine remapped entries with original entries and remove duplicates
	 *
	 * 重新映射的條目排在原始條目之前，去重結果決定同鍵條目的保留者
	 * Remapped entries come before the originals; dedup decides which entry survives for the same key
	 */
	return array_unique_overwrite(arr.concat(ls as any)) as IStaticFilesMapArray<IStaticFilesKey<T> | N>
}
