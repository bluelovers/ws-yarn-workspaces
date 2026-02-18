/**
 * Static file ID type / 靜態檔案 ID 類型
 *
 * Extracts the union type of all possible file IDs from the static files map array.
 * 從靜態檔案映射陣列中提取所有可能的檔案 ID 聯合類型。
 */
import { defaultCopyStaticFiles, defaultCopyStaticFilesRootOnly } from './const';

export type IStaticFilesID<T = typeof defaultCopyStaticFiles & typeof defaultCopyStaticFilesRootOnly> =
	T extends ({
			[n: number]: IStaticFilesMapArrayEntry<infer U>
		} | {
			readonly [n: number]: IStaticFilesMapArrayEntry<infer U>;
		})
		? U
		: never
	;

/**
 * Static files map array entry type / 靜態檔案映射陣列條目類型
 *
 * Represents a single entry in the static files map array.
 * 表示靜態檔案映射陣列中的單個條目。
 *
 * @template K - The target file path type / 目標檔案路徑類型
 *
 * @param targetFile - Target file path to copy to / 要複製到的目標檔案路徑
 * @param staticFile - Source static file path / 來源靜態檔案路徑
 * @param detectFile - Optional file path to detect if target already exists / 可選的檢測檔案路徑，用於判斷目標是否已存在
 */
export type IStaticFilesMapArrayEntry<K extends string> =
	[targetFile: K, staticFile: string, detectFile?: string]

/**
 * Static files map object type (internal) / 靜態檔案映射物件類型（內部使用）
 * @internal
 */
type IStaticFilesMap01<K extends string> = {
	[P in K]: IStaticFilesMapArrayEntry<P>
}

/**
 * Static files map record type / 靜態檔案映射記錄類型
 *
 * A record mapping target file paths to source file paths.
 * 將目標檔案路徑映射到來源檔案路徑的記錄類型。
 *
 * @template K - The target file path type / 目標檔案路徑類型
 */
export type IStaticFilesMapRecord<K extends string> = {
	[P in K]: string
}

/**
 * Static files map array type / 靜態檔案映射陣列類型
 *
 * An array of static file mapping entries.
 * 靜態檔案映射條目的陣列。
 *
 * @template K - The target file path type / 目標檔案路徑類型
 */
export type IStaticFilesMapArray<K extends string> =
	IStaticFilesMapArrayEntry<K>[]

/**
 * Static files map type / 靜態檔案映射類型
 *
 * Can be either an array of entries or a record mapping.
 * 可以是條目陣列或記錄映射。
 *
 * @template K - The target file path type / 目標檔案路徑類型
 */
export type IStaticFiles<K extends string> = IStaticFilesMapArray<K> | IStaticFilesMapRecord<K>

/**
 * Base options for copying static files / 複製靜態檔案的基本選項
 *
 * @template K - The target file path type / 目標檔案路徑類型
 *
 * @property cwd - Current working directory / 當前工作目錄
 * @property staticRoot - Root directory of static files / 靜態檔案的根目錄
 * @property overwrite - Whether to overwrite existing files / 是否覆蓋已存在的檔案
 */
export interface ICopyStaticFilesOptionsBase<K extends string = string>
{
	cwd: string,
	staticRoot?: string,
	overwrite?: boolean,
}

/**
 * Options for copying static files / 複製靜態檔案的選項
 *
 * Extends the base options with file map configuration.
 * 擴展基本選項，加入檔案映射配置。
 *
 * @template K - The target file path type / 目標檔案路徑類型
 *
 * @property file_map - Custom file mapping configuration / 自訂檔案映射配置
 */
export interface ICopyStaticFilesOptions<K extends string = string> extends ICopyStaticFilesOptionsBase<K>
{
	file_map?: IStaticFiles<K>,
}

/**
 * Extracts the key type from static files map / 從靜態檔案映射中提取鍵類型
 *
 * Utility type to extract the union type of target file paths from various static file map formats.
 * 工具類型，用於從各種靜態檔案映射格式中提取目標檔案路徑的聯合類型。
 *
 * @template T - The static files map type / 靜態檔案映射類型
 */
export type IStaticFilesKey<T extends IStaticFiles<string> | readonly any[]> = T extends IStaticFilesMapArray<infer K>
	? K
	: T extends readonly IStaticFilesMapArrayEntry<infer K>[]
		? K
		: T extends IStaticFilesMapRecord<infer K> ? K
			: _Key<T>
	;

/**
 * Internal key extraction type / 內部鍵提取類型
 * @internal
 */
export type _Key<T> = T extends readonly (infer U)[] | (infer U)[]
	? (U extends [infer K, string, string] | readonly [infer K, string, string] ? K : never)
	: never
