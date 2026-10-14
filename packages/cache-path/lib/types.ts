import { DirOptions, dirSync } from 'tmp';
import { ITSArrayListMaybeReadonly, ITSToWriteableArray } from 'ts-type';

/**
 * 快取路徑 thunk 函數 (Thunk)：接收子路徑片段並回傳完整路徑
 * Cache path thunk: takes path segments and returns the joined full path
 *
 * 以函數取代字串回傳，可延後組合子路徑，避免過早決定檔案位置。
 * Returning a function instead of a string defers path composition,
 * so callers decide the final file location later.
 */
export type ICachePathThunk = ((p1?: string, ...args: string[]) => string);

export type IFindCachePathFn = ((cwd?: string, processEnv?: NodeJS.ProcessEnv, options?: IOptions) => string) | ((cwd?: string, processEnv?: NodeJS.ProcessEnv, options?: IOptions) => any);

/**
 * 快取路徑查詢選項，延伸 tmp 的 DirOptions（隨機目錄需透傳給 tmp）
 * Cache path options, extends tmp's DirOptions (random dir options must be forwarded to tmp)
 */
export interface IOptions extends DirOptions
{
	/**
	 * 快取根目錄下的基礎目錄名稱
	 * Base directory name under the cache root
	 */
	base?: string,
	/**
	 * 快取名稱，會經過 normalizeName 正規化
	 * Cache name, normalized by normalizeName
	 */
	name?: string,

	/**
	 * 搜尋起始目錄，預設為 process.cwd()
	 * Starting directory for the search, defaults to process.cwd()
	 */
	cwd?: string,

	/**
	 * 依序嘗試的快取來源函式陣列，取得第一個有效回傳值即停止
	 * Cache source finder functions tried in order; stops at the first value returned
	 *
	 * 置於此處可自訂快取來源的優先順序，而不必修改套件原始碼。
	 * Declared here so callers can reorder cache sources without patching the package.
	 */
	fnOrder?: ITSArrayListMaybeReadonly<IFindCachePathFn>,

	/**
	 * 目錄不存在時是否自動建立
	 * Whether to create the directory automatically when it does not exist
	 */
	create?: boolean,
	/**
	 * 回傳可組合子路徑的 thunk 函數，而非字串路徑
	 * Return a path-composing thunk function instead of a plain string path
	 */
	thunk?: boolean,

	/**
	 * 將名稱轉為雜湊 (Hash) 目錄名，確保名稱唯一且長度固定
	 * Hash the name into a directory name to keep it unique and fixed-length
	 *
	 * 可傳入 true 使用內建 hash-sum，或傳入自訂函數決定演算法。
	 * Pass true to use the built-in hash-sum, or a custom function to control the algorithm.
	 */
	hash?: boolean | ((input: string) => string),

	/**
	 * 僅在設定了 fnOrder 時生效
	 * Only takes effect when fnOrder is set
	 *
	 * 若為 true，fnOrder 找不到結果時不再回退至預設順序，
	 * 可用來強制只使用自訂來源並於失敗時明確報錯。
	 * When true, the default order is not used as a fallback after fnOrder fails,
	 * which forces custom-only sources and surfaces the failure explicitly.
	 */
	disableDefaultFailback?: boolean,

	/**
	 * 兜底順序改用全域優先的 defaultOrderGlobal
	 * Use the global-first defaultOrderGlobal as the fallback order
	 *
	 * 僅在發生兜底時影響結果：未設定 fnOrder，或 fnOrder 失敗且未啟用 disableDefaultFailback。
	 * 為 true 時先嘗試 yarn / npm / tmp 等全域快取，最後才回到專案內的 node_modules。
	 * Only affects the run when a fallback happens: no fnOrder given, or fnOrder failed while disableDefaultFailback is off.
	 * When true it tries the global caches (yarn / npm / tmp) first and only falls back to the in-project node_modules last.
	 */
	useGlobalDefaultFailback?: boolean,

	/**
	 * 傳給各快取來源函式的環境變數，預設為 process.env
	 * Environment variables passed to cache source finders, defaults to process.env
	 */
	processEnv?: NodeJS.ProcessEnv,

	/**
	 * 未指定 name 時是否建立隨機暫存目錄（使用 tmp）
	 * Create a random temp directory (via tmp) when no name is given
	 */
	randomIfNoName?: boolean,
}
