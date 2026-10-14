import { defaultOrder, defaultOrderGlobal, findPkgModuleCachePath } from './finder';
import { array_unique_overwrite } from 'array-hyper-unique';
import { findPkgModulePath, findPkgPath } from './finder/findPkgModuleCachePath';
import { existsSync } from "fs";
import { ensureDirSync } from 'fs-extra';
import { isWritableDirectorySync } from '@lazy-node/is-writeable-path';
import { resolve } from "upath2";
import { IOptions } from './types';
import { ITSToWriteableArray } from 'ts-type';

/**
 * 整理並補齊快取選項，讓呼叫端可以只傳字串（視為 cwd）或部分選項
 * Normalize and fill in cache options so callers may pass only a string (treated as cwd) or a partial object
 *
 * @param {IOptions | string} [options] - 選項物件或單一字串 cwd / Options object or a plain cwd string
 * @returns {IOptions} 已補齊預設值的選項 / Options with defaults resolved
 */
export function handleOptions(options?: IOptions | string): IOptions
{
	/**
	 * 字串形式是為了讓 `getCacheRoot('/some/dir')` 這類呼叫不必包一層物件
	 * A string is wrapped so calls like `getCacheRoot('/some/dir')` need no object literal
	 */
	if (typeof options === 'string')
	{
		options = {
			cwd: options,
		}
	}

	/**
	 * 參數可能完全省略，退回空物件以避免後續解構失敗
	 * The argument may be omitted entirely; fall back to an empty object so later destructuring is safe
	 */
	options ??= {};

	/**
	 * 依 useGlobalDefaultFailback 挑選兜底順序：
	 * 預設為專案內優先的 defaultOrder，設為 true 時改用全域優先的 defaultOrderGlobal
	 * Pick the fallback order from useGlobalDefaultFailback:
	 * in-project-first defaultOrder by default, global-first defaultOrderGlobal when true
	 */
	const defaultOrderFailback = options.useGlobalDefaultFailback ? defaultOrderGlobal : defaultOrder;

	let {
		cwd = process.cwd(),
		fnOrder = defaultOrderFailback,
	} = options as Omit<IOptions, "fnOrder"> & {
		fnOrder: ITSToWriteableArray<IOptions["fnOrder"]>;
	};

	/**
	 * 自訂順序找不到結果時仍需兜底順序（defaultOrderFailback），否則專案外的環境會直接失敗；
	 * disableDefaultFailback 可關閉這個兜底行為，
	 * 而兜底順序本身由 useGlobalDefaultFailback 決定（專案內優先或全域優先）
	 * Custom order still needs the fallback order (defaultOrderFailback), otherwise non-project environments fail outright;
	 * disableDefaultFailback turns that fallback off,
	 * while useGlobalDefaultFailback selects which order is used (in-project first or global first)
	 */
	if (!options.disableDefaultFailback && options.fnOrder && fnOrder !== defaultOrderFailback)
	{
		/**
		 * fnOrder 的型別為互斥的函式聯集，concat 會推導出不相容的陣列型別，
		 * 此處執行期安全，故以 @ts-ignore 壓過
		 * fnOrder is a union of mutually exclusive function types, so concat infers an incompatible array type;
		 * it is safe at runtime, hence the @ts-ignore
		 */
		fnOrder = fnOrder.concat(defaultOrderFailback);

		/**
		 * 重複來源只會浪費 spawn 呼叫，去重後保留首次出現的順序
		 * Duplicated sources only waste spawn calls; dedupe while keeping first-seen order
		 */
		fnOrder = array_unique_overwrite(fnOrder);
	}

	/**
	 * 統一轉為絕對路徑，避免各 finder 以相對路徑比較目錄
	 * Resolve to an absolute path so finders never compare directories as relative paths
	 */
	options.cwd = resolve(cwd);
	options.fnOrder = fnOrder;
	options.processEnv ??= process.env;
	/**
	 * 明確布林化，讓呼叫端不必自己處理 truthy/falsy 混用
	 * Explicitly coerce to boolean so callers need not juggle truthy/falsy values
	 */
	options.create = !!options.create;

	return options
}

/**
 * 判斷該快取來源是否允許建立目錄
 * Whether the given cache source is allowed to create its directory
 *
 * 專案內的 node_modules 來源必定可建立；其餘來源需明確設定 create，
 * 以免在唯讀或系統級位置擅自開目錄。
 * The in-project node_modules source is always creatable; other sources require an explicit create,
 * to avoid creating directories in read-only or system-wide locations.
 *
 * @param {IOptions} options - 已整理的選項 / Normalized options
 * @param {Function} fn - 目前嘗試的快取來源函式 / Cache source function currently being tried
 * @returns {boolean} 是否可建立目錄 / Whether the directory may be created
 */
export function _createAble(options: IOptions, fn)
{
	return (options?.create === true || fn === findPkgModuleCachePath || fn === findPkgModulePath || fn === findPkgPath)
}

/**
 * 驗證快取路徑可用性，必要時建立目錄
 * Validate that the cache path is usable, creating it when required
 *
 * 依序檢查「有回傳值」、「型別為字串」、「存在與可寫入」，
 * 每一層都給出不同的錯誤訊息，方便呼叫端分辨是找不到來源還是來源不可寫。
 * Checks value presence, string type, then existence/writability in order;
 * each layer yields a distinct error so callers can tell "no source" from "not writable".
 *
 * @param {string} dir - 待驗證的路徑 / Path to validate
 * @param {IOptions} options - 已整理的選項 / Normalized options
 * @returns {boolean} 驗證通過時回傳 true / True when validation passes
 * @throws {Error} 路徑無效、不存在或不可寫入時 / When the path is missing, absent, or read-only
 */
export function _check(dir: string, options: IOptions)
{
	/**
	 * 未找到任何來源時 dir 會是 undefined 或空字串，
	 * 與「找到但不存在」需用不同錯誤區分
	 * When no source matched, dir is undefined or empty; this must be distinguished
	 * from "found but missing" so callers know whether to widen fnOrder
	 */
	if (!dir?.length)
	{
		throw new Error(`can't found cache path`)
	}
	/**
	 * 回傳非字串代表來源實作有誤（例如指令輸出未轉型），
	 * 提早拋錯避免下游把數字當路徑使用
	 * A non-string return indicates a broken source (e.g. uncoerced command output);
	 * fail early so downstream code never treats a number as a path
	 */
	else if (typeof dir !== 'string')
	{
		throw new Error(`not a path '${dir}'`)
	}
	/**
	 * 目錄尚未存在時依 create 決定建立或報錯，
	 * 預設不建立是為了避免在無意間污染使用者的檔案系統
	 * A missing directory is either created or reported based on create;
	 * defaulting to not creating avoids polluting the user's filesystem unexpectedly
	 */
	else if (!existsSync(dir))
	{
		if (options.create)
		{
			ensureDirSync(dir)
		}
		else
		{
			throw new Error(`path not exists '${dir}'`)
		}
	}

	/**
	 * 只讀目錄會讓後續寫入快取失敗，因此即使存在也視為不可用
	 * A read-only directory would break later cache writes, so it counts as unusable even when it exists
	 */
	if (!isWritableDirectorySync(dir))
	{
		throw new Error(`path is not writeable '${dir}'`)
	}

	return true
}
