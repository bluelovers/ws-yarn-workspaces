/**
 * Parse static file map / 解析靜態檔案映射
 *
 * This module provides functions to parse different static file map formats
 * into a unified array format.
 * 此模組提供將不同靜態檔案映射格式解析為統一陣列格式的函數。
 *
 * @module parseStaticMap
 */
import {
	IStaticFiles,
	IStaticFilesID,
	IStaticFilesMapArray,
	IStaticFilesMapRecord,
	IStaticFilesMapArrayEntry,
} from './types';

/**
 * Parse static file map from array format / 從陣列格式解析靜態檔案映射
 *
 * Converts an array-based file map to a normalized array format.
 * 將基於陣列的檔案映射轉換為標準化陣列格式。
 *
 * @template K - The target file path type / 目標檔案路徑類型
 * @param file_map - The array-based file map / 基於陣列的檔案映射
 * @returns Normalized array of file map entries / 標準化的檔案映射條目陣列
 */
export function parseStaticMap<K extends string>(file_map: IStaticFilesMapArray<K>): IStaticFilesMapArray<K | IStaticFilesID>

/**
 * Parse static file map from record format / 從記錄格式解析靜態檔案映射
 *
 * Converts a record-based file map to a normalized array format.
 * 將基於記錄的檔案映射轉換為標準化陣列格式。
 *
 * @template K - The target file path type / 目標檔案路徑類型
 * @param file_map - The record-based file map / 基於記錄的檔案映射
 * @returns Normalized array of file map entries / 標準化的檔案映射條目陣列
 */
export function parseStaticMap<K extends string>(file_map: IStaticFilesMapRecord<K>): IStaticFilesMapArray<K | IStaticFilesID>

/**
 * Parse static file map from any supported format / 從任何支援的格式解析靜態檔案映射
 *
 * Unified function that handles both array and record formats.
 * 處理陣列和記錄格式的統一函數。
 *
 * @template K - The target file path type / 目標檔案路徑類型
 * @param file_map - The file map in any supported format / 任何支援格式的檔案映射
 * @returns Normalized array of file map entries / 標準化的檔案映射條目陣列
 */
export function parseStaticMap<K extends string>(file_map: IStaticFiles<K>): IStaticFilesMapArray<K | IStaticFilesID>

/**
 * Implementation of parseStaticMap / parseStaticMap 的實現
 * @internal
 */
export function parseStaticMap<K extends string>(file_map: IStaticFiles<K>): IStaticFilesMapArray<K | IStaticFilesID>
{
	let ls: IStaticFilesMapArray<K>;

	// Handle array format / 處理陣列格式
	if (Array.isArray(file_map))
	{
		ls = Object.values(file_map)
	}
	// Handle record format / 處理記錄格式
	else
	{
		// @ts-ignore
		ls = Object.entries(file_map)
	}

	// Filter out invalid entries / 過濾無效條目
	return ls.filter(v => v && Array.isArray(v) && v.length > 1);
}
