/**
 * Static file ID type / 靜態檔案 ID 類型
 *
 * Extracts the union type of all possible file IDs from the static files map array.
 * 從靜態檔案映射陣列中提取所有可能的檔案 ID 聯合類型。
 */
import { defaultCopyStaticFiles, defaultCopyStaticFilesRootOnly } from './const';
import type { IgnoreFile } from '@yarn-tool/ignore/lib/IgnoreFile';

/**
 * 既有 ignore 檔案的快照 / Snapshot of existing ignore files
 *
 * 以相對目標路徑（如 `.gitignore`）為鍵，保存 reset 前讀取到的內容。
 * Keyed by the relative target path (e.g. `.gitignore`), holding the content read before the reset.
 *
 * @see _readIgnoreFilesSnapshot
 * @see mergeIgnoreFiles
 */
export type IIgnoreFilesSnapshot = Map<string, IgnoreFile>;

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
	file_map?: IStaticFiles<K>;

	/**
	 * reset 前建立的既有 ignore 檔快照
	 * Snapshot of existing ignore files taken before the reset
	 *
	 * 提供時會在複製完成後自動合併 ignore 檔案；未提供則不做任何合併。
	 * When provided, ignore files are auto-merged after the copy; when omitted nothing is merged.
	 *
	 * @see mergeIgnoreFiles
	 */
	ignoreFilesSnapshot?: IIgnoreFilesSnapshot;
}

export interface ICopyStaticFilesOptionsRuntime<K extends string = string> extends Omit<Required<ICopyStaticFilesOptions<K>>, 'file_map' | 'ignoreFilesSnapshot'>
{
	file_map: IStaticFilesMapArray<K>;

	/**
	 * reset 前建立的既有 ignore 檔快照；未提供時不執行任何合併
	 * Snapshot of existing ignore files taken before the reset; nothing is merged when omitted
	 *
	 * @see mergeIgnoreFiles
	 */
	ignoreFilesSnapshot?: IIgnoreFilesSnapshot;
}

/**
 * 單個靜態檔案條目的執行期複製資訊 / Runtime copy info for a single static file entry
 *
 * 由 _copyStaticFilesEntryCore 解析產生；條目被 detectFile 跳過時該函式回傳 undefined，不會產生此物件。
 * Produced by _copyStaticFilesEntryCore; when an entry is skipped by detectFile the function returns undefined and no such object is produced.
 *
 * @template K - 目標檔案路徑類型 / Target file path type
 *
 * @see _copyStaticFilesEntryCore
 */
export interface IStaticFilesEntryRuntime<K extends string = string>
{
	/** 目標檔案路徑（相對於 cwd）/ Target file path (relative to cwd) */
	readonly targetFile: K;

	/** 來源靜態檔案路徑（相對於 staticRoot）/ Source static file path (relative to staticRoot) */
	readonly staticFile: string;

	/** 以 cwd 為基準解析出的目標檔案完整路徑 / Fully resolved target file path against cwd */
	readonly targetFileFull: string;

	/** 以 staticRoot 為基準解析出的來源檔案完整路徑 / Fully resolved source file path against staticRoot */
	readonly staticFileFull: string;

	/** 是否覆蓋已存在的檔案，未指定選項時為 false / Whether to overwrite an existing file; false when the option is omitted */
	readonly overwrite: boolean;
}

/**
 * 靜態檔案清單產生器的產出項目 / Item yielded by the static file list generator
 *
 * 包含條目、其執行期複製資訊，以及由呼叫端決定是否執行的複製動作。
 * Holds the entry, its runtime copy info, and the copy action whose execution is decided by the caller.
 *
 * @template K - 目標檔案路徑類型 / Target file path type
 *
 * @see _copyStaticFilesCoreListGenerator
 */
export interface IStaticFilesEntryGeneratorItem<K extends string = string>
{
	/** 靜態檔案條目 / Static file entry */
	entry: IStaticFilesMapArrayEntry<K>;

	/** 執行期複製資訊 / Runtime copy info */
	runtime: IStaticFilesEntryRuntime<K>;

	/** 執行實際複製；不呼叫即不寫入任何檔案 / Perform the actual copy; nothing is written unless it is called */
	copy(): void;
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
