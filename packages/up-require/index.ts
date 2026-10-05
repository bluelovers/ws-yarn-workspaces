/// <reference types="node" />

/**
 * 從模組層級鏈的最上層或指定模組清單 require 套件模組。
 *
 * Require a package module from the top of the module parent chain or from a
 * given module list.
 *
 * @module up-require
 */

/**
 * Node 的模組找不到錯誤碼；以常數匯出供呼叫端比對，
 * 避免各處硬編碼字串造成拼寫不一致。
 *
 * Node's "module not found" error code; exported as a constant so callers can
 * compare against it instead of hard-coding the string everywhere.
 */
const MODULE_NOT_FOUND = 'MODULE_NOT_FOUND' as const;

export { MODULE_NOT_FOUND }

/**
 * 擴充後的錯誤介面 (Error Interface)。
 *
 * Extended error interface.
 *
 * 在 NodeJS.ErrnoException 之上補上本套件除錯所需的欄位，
 * 讓 catch 到的錯誤不必再行斷言即可取得搜尋細節。
 *
 * Adds the fields this package attaches for debugging on top of
 * NodeJS.ErrnoException, so caught errors expose the search details without
 * extra assertions.
 */
export interface IErrnoException extends NodeJS.ErrnoException, Error
{
	/**
	 * 錯誤碼；找不到模組時為 `'MODULE_NOT_FOUND'`。
	 *
	 * Error code; `'MODULE_NOT_FOUND'` when the module was not found.
	 */
	code?: string | typeof MODULE_NOT_FOUND,
	/**
	 * 最後一次嘗試 require 失敗的模組。
	 *
	 * The last module whose `require` attempt failed.
	 */
	module?: NodeModule,
	/**
	 * 搜尋的起始模組。
	 *
	 * The module the search started from.
	 */
	startModule?: NodeModule,
	/**
	 * all module list for search
	 *
	 * 用於搜尋的完整模組清單。
	 */
	list?: NodeModule[],
}

/**
 * 從最高的父模組 require 指定模組。
 *
 * Require a module from the highest parent module.
 *
 * 與 requireFromParentUp 的差別在於：本函式不跳過起始模組本身，
 * 因此連最上層（root）安裝的版本也找得到。
 *
 * Unlike requireFromParentUp, this does not skip the starting module itself,
 * so even a version installed at the very top (root) can be found.
 *
 * @typeParam T - 回傳模組的型別 / Type of the returned module
 * @param id - 要 require 的模組 id / Module id to require
 * @param startModule - 搜尋的起始模組，預設為 `module.parent` / Start module,
 * defaults to `module.parent`
 */
export function requireFromTopParent<T = any>(id: string, startModule?: NodeModule)
{
	let ls = getAllModule(startModule);

	return requireFromModuleList<T>(id, ls, ls[0]);
}

/**
 * 取得起始模組及其所有父模組。
 *
 * Get the starting module together with all of its parent modules.
 *
 * @param startModule - 起始模組，預設為 `module.parent` / Start module, defaults
 * to `module.parent`
 * @throws {TypeError} startModule 不是有效模組物件時 / when startModule is not a
 * valid module object
 */
export function getAllModule(startModule: NodeModule = module.parent): NodeModule[]
{
	/**
	 * module.parent 在某些執行環境（例如 REPL 或動態載入）可能為空，
	 * 先檢查型別可避免後續存取 .parent 時拋出難懂的錯誤。
	 *
	 * `module.parent` can be null in some environments (REPL or dynamic
	 * loading); checking the type up front avoids a confusing error when
	 * dereferencing `.parent` later.
	 */
	if (!startModule || typeof startModule !== 'object')
	{
		throw new TypeError(`startModule is not valid`);
	}

	let pm = startModule;
	let ls: NodeModule[] = [];

	/**
	 * do...while 確保起始模組本身一定會被收進清單，
	 * 再一路沿 parent 上溯到鏈的頂端。
	 *
	 * do...while guarantees the starting module itself is included, then walks
	 * up the parent chain to its top.
	 */
	do
	{
		ls.push(pm);
	}
	while (pm = pm.parent);

	return ls;
}

/**
 * 從模組清單中 require 指定模組。
 *
 * Require a module from a list of modules.
 *
 * （清單由後往前搜尋 / order is desc, from last one to first one）
 *
 * @typeParam T - 回傳模組的型別 / Type of the returned module
 * @param id - 要 require 的模組 id / Module id to require
 * @param ls - 模組清單，越靠後越優先 / Module list; later entries win
 * @param startModule - 起始模組，未指定時取 `ls[0]` / Start module; takes `ls[0]`
 * when omitted
 * @throws {IErrnoException} 清單內全部找不到時，`code` 為 `'MODULE_NOT_FOUND'` /
 * when none match, with `code` set to `'MODULE_NOT_FOUND'`
 */
export function requireFromModuleList<T = any>(id: string, ls: NodeModule[], startModule: NodeModule): T
{
	/**
	 * 允許呼叫端省略 startModule；此處無法用預設參數語法，
	 * 因為要判斷的是「完全未傳入」而非 falsy。
	 *
	 * Lets callers omit startModule; a default parameter cannot be used here
	 * because the check is for "not passed at all", not for falsy.
	 */
	if (typeof startModule === 'undefined')
	{
		startModule = ls[0]
	}

	let pm: NodeModule;
	let err: IErrnoException;
	let tm: NodeModule;

	let i = ls.length;

	/**
	 * 由清單尾端往回搜尋（最上層優先），
	 * 每次失敗就記住最後一個錯誤，供所有嘗試失敗後還原細節。
	 *
	 * Searches from the end of the list (top-most first), keeping the last error
	 * so its details can be restored after every attempt has failed.
	 */
	while (i > 0)
	{
		tm = ls[--i];

		try
		{
			pm = tm;
			return pm.require(id);
		}
		catch (e)
		{
			/**
			 * 這裡刻意不中斷：其他模組仍可能有該套件，
			 * 只有全部落空才把最後的錯誤丟出去。
			 *
			 * Deliberately does not bail out: another module may still hold the
			 * package; only after every candidate fails is the last error thrown.
			 */
			err = e;
		}
	}

	err = _createError(err, {
		id,
		module: pm,
		startModule,
		list: ls,
	});

	throw err;
}

/**
 * `requireFromTopParent` 的別名 (Alias)。
 *
 * Alias of `requireFromTopParent`.
 *
 * @typeParam T - 回傳模組的型別 / Type of the returned module
 * @param id - 要 require 的模組 id / Module id to require
 * @param startModule - 搜尋的起始模組 / Start module of the search
 */
export function upRequire<T = any>(id: string, startModule?: NodeModule)
{
	return requireFromTopParent<T>(id, startModule);
}

/**
 * `requireFromTopParent` 的別名 (Alias)。
 *
 * Alias of `requireFromTopParent`.
 *
 * @typeParam T - 回傳模組的型別 / Type of the returned module
 * @param id - 要 require 的模組 id / Module id to require
 * @param startModule - 搜尋的起始模組 / Start module of the search
 */
export function requireUp<T = any>(id: string, startModule?: NodeModule)
{
	return requireFromTopParent<T>(id, startModule);
}

/**
 * 以父模組的 require 來 require 套件模組。
 *
 * Require a package module using the parent module's require.
 *
 * @typeParam T - 回傳模組的型別 / Type of the returned module
 * @param id - 要 require 的模組 id / Module id to require
 * @param startModule - 要使用其 parent 的模組 / Module whose parent is used
 * @throws {TypeError} startModule 不是有效模組物件時 / when startModule is not a
 * valid module object
 */
export function requireParent<T = any>(id: string, startModule: NodeModule): T
{
	/**
	 * 與 getAllModule 相同的防禦：module.parent 可能為空，
	 * 提早拋出 TypeError 比讓 .require 變成 null dereference 更清楚。
	 *
	 * Same defence as in getAllModule: `module.parent` may be null, and an early
	 * TypeError reads better than a null dereference on `.require`.
	 */
	if (!startModule || typeof startModule !== 'object')
	{
		throw new TypeError(`startModule is not valid`);
	}

	return startModule.parent.require(id);
}

/**
 * 從父模組開始向上 require 套件模組。
 *
 * Require a package module starting from the parent module.
 *
 * 會先移除起始模組本身，因此只搜尋其祖先；
 * 想連起始模組一起搜尋請改用 requireFromTopParent。
 *
 * The starting module itself is shifted off first, so only ancestors are
 * searched; use requireFromTopParent to include it as well.
 *
 * @typeParam T - 回傳模組的型別 / Type of the returned module
 * @param id - 要 require 的模組 id / Module id to require
 * @param startModule - 搜尋的起始模組，預設為 `module.parent` / Start module,
 * defaults to `module.parent`
 */
export function requireFromParentUp<T = any>(id: string, startModule?: NodeModule)
{
	let ls = getAllModule(startModule);

	/**
	 * shift 拿掉起始模組，再 reverse 成「由近而遠」的順序，
	 * 讓 requireFromModuleList 由尾端往回搜尋時等於由近而遠。
	 *
	 * `shift` removes the starting module and `reverse` makes the order
	 * near-to-far, so requireFromModuleList's tail-first walk means near-to-far.
	 */
	startModule = ls.shift();

	return requireFromModuleList<T>(id, ls.reverse(), startModule);
}

/**
 * 整理錯誤資料以利除錯。
 *
 * Normalize error data for debugging.
 *
 * @param err - 來源錯誤；無則建立新的 / Source error; a new one is created if absent
 * @param data - 附加到錯誤上的除錯資料 / Debug data to attach to the error
 * @returns 附加完成的錯誤物件 / The enriched error object
 */
export function _createError(err: IErrnoException, data: {
	id?: string,
	code?: string | typeof MODULE_NOT_FOUND
	module?: NodeModule,
	startModule?: NodeModule,
	list?: NodeModule[],
}): IErrnoException
{
	let msg = `Cannot find module '${data.id}'`;

	if (!err)
	{
		/**
		 * 所有候選模組都沒拋錯（例如清單為空）時仍要有一個標準錯誤，
		 * 且 code 固定為 MODULE_NOT_FOUND，讓呼叫端的判斷邏輯一致。
		 *
		 * When no candidate threw (e.g. an empty list), a standard error is still
		 * needed, with code fixed to MODULE_NOT_FOUND so caller checks behave
		 * consistently.
		 */
		err = new Error(msg);
		err.code = data.code || MODULE_NOT_FOUND;

		Error.captureStackTrace(err, _createError)
	}
	else
	{
		//err.message = msg;
	}

	/**
	 * 來源錯誤保留原本的 message，只補上搜尋脈絡欄位，
	 * 以免覆寫掉真正有用的原始訊息。
	 *
	 * The source error keeps its original message; only the search-context fields
	 * are added, so the genuinely useful original message is not overwritten.
	 */
	err.startModule = data.startModule;
	err.module = data.module;
	err.list = data.list;

	return err;
}

/**
 * 依 exports 找回模組。
 *
 * Find a module by its exports.
 *
 * @typeParam T - exports 的型別 / Type of the exports
 * @param exportModule - 要比對的 exports 物件 / The exports object to match
 * @param req - 使用的 require，可注入自訂實例 / The require to use; injectable
 * @returns 找到的模組，找不到為 null / The module found, or null
 */
export function getModuleByExports<T = any>(exportModule: T, req = require): INodeModule<T>
{
	let ks = Object.keys(req.cache);

	let i = ks.length;

	/**
	 * 由 cache 尾端往回掃（新載入的較可能在後面），
	 * `--i` 讓迴圈停在 index 0 之前，跳過第一筆。
	 *
	 * Scans the cache from the end (recently loaded entries tend to be later);
	 * `--i` stops before index 0, skipping the first entry.
	 */
	while (--i)
	{
		let key = ks[i];
		let mod: NodeModule = req.cache[key];

		if (mod.exports === exportModule)
		{
			// @ts-ignore
			return mod;
		}
	}

	return null;
}

/**
 * 依完整檔案路徑找回模組。
 *
 * Find a module by its full file path.
 *
 * @typeParam T - exports 的型別 / Type of the exports
 * @param file - 檔案完整路徑 / Full file path
 * @param requireIfNotExists - 尚未載入時是否自動 require / Whether to require it
 * when not loaded yet
 * @param req - 使用的 require，可注入自訂實例 / The require to use; injectable
 * @returns 找到的模組，找不到為 null / The module found, or null
 */
export function getModuleByFile<T = any>(file: string, requireIfNotExists?: boolean, req = require): INodeModule<T>
{
	let cache = getRequireCache(req);
	let ks = Object.keys(cache);

	let i = ks.length;

	while (--i)
	{
		let key = ks[i];
		let mod = cache[key];

		// @ts-ignore
		if (mod.filename === file)
		{
			// @ts-ignore
			return mod;
		}
	}

	/**
	 * 未命中且允許自動載入時才 require；
	 * 以 try/catch 包住是因為 require 可能因模組本身的錯誤而失敗，
	 * 此時不應把錯誤往上拋，回傳 null 讓呼叫端視為「找不到」。
	 *
	 * Only requires when the lookup missed and auto-loading is allowed; wrapped
	 * in try/catch because `require` may fail due to the module's own error, in
	 * which case it should not propagate — returning null means "not found" to
	 * the caller.
	 */
	if (requireIfNotExists)
	{
		try
		{
			req(file);

			/**
			 * 以 requireIfNotExists=false 重新搜尋，避免 require 成功後
			 * 若仍未出現在 cache 中造成無限遞迴。
			 *
			 * Re-searches with requireIfNotExists=false so a successful require
			 * that never lands in the cache cannot recurse forever.
			 */
			return getModuleByFile(file, false, req);
		}
		catch (e)
		{

		}
	}

	return null;
}

/**
 * `require.cache` 的索引簽名 (Index Signature)。
 *
 * Index signature for `require.cache`.
 *
 * 以字串鍵對應 NodeModule，補足 TypeScript 未定義的 cache 型別。
 *
 * Maps string keys to NodeModule, supplying the cache type TypeScript lacks.
 */
export interface INodeRequireCache
{
	[k: string]: NodeModule
}

/**
 * 回傳 require.cache 以供 TypeScript 使用。
 *
 * Return `require.cache` with TypeScript-friendly typing.
 *
 * @param req - 使用的 require，可注入自訂實例 / The require to use; injectable
 */
export function getRequireCache(req = require): INodeRequireCache
{
	return req.cache
}

/**
 * 已具備完整欄位型別的 NodeModule。
 *
 * NodeModule with fully-typed fields.
 *
 * Node 的 NodeModule 部分欄位型別過寬或為 any，
 * 此介面讓查詢函式的回傳值可直接使用。
 *
 * Node's `NodeModule` types some fields loosely or as `any`; this interface lets
 * the lookup functions return something directly usable.
 *
 * @typeParam T - exports 的型別 / Type of the exports
 */
export interface INodeModule<T = any> extends NodeModule
{
	exports: T;
	require: NodeRequire;
	id: string;
	filename: string;
	loaded: boolean;
	parent: NodeModule | null;
	children: NodeModule[];
	paths: string[];
}

/**
 * 取得主模組 (Main Module)。
 *
 * Get the main module.
 *
 * @typeParam T - exports 的型別 / Type of the exports
 * @param id - 要尋找的模組 id，預設 `'.'` / Module id to find, defaults to `'.'`
 * @returns 找到的模組，找不到為 null / The module found, or null
 */
export function getMainModule<T = any>(id = '.'): INodeModule<T>
{
	let pm = module;

	// @ts-ignore
	/**
	 * 由目前模組沿 parent 鏈往上找，直到 id 相符或走到鏈頂端。
	 *
	 * Walks up the parent chain from the current module until the id matches or
	 * the chain runs out.
	 */
	do
	{
		if (pm.id === id)
		{
			// @ts-ignore
			return pm;
		}
	}
	while (pm = pm.parent);

	return null;
}

/**
 * 以 package id（同 `require(id)` 寫法）取得模組。
 *
 * Get a module by package id (same notation as `require(id)`).
 *
 * @typeParam T - exports 的型別 / Type of the exports
 * @param id - 模組 id / Module id
 * @param requireIfNotExists - 尚未載入時是否自動 require / Whether to require it
 * when not loaded yet
 * @param req - 使用的 require，可注入自訂實例 / The require to use; injectable
 * @returns 找到的模組，找不到為 null / The module found, or null
 */
export function getModuleByID<T = any>(id: string, requireIfNotExists?: boolean, req = require)
{
	/**
	 * '.' 代表入口模組本身，無法以檔案路徑解析，改走 getMainModule。
	 *
	 * `'.'` refers to the entry module itself, which cannot be resolved as a file
	 * path, so getMainModule handles it instead.
	 */
	if (id === '.')
	{
		return getMainModule<T>(id);
	}

	return getModuleByFile<T>(req.resolve(id), requireIfNotExists, req);
}

/**
 * 預設匯出：`requireFromTopParent`。
 *
 * Default export: `requireFromTopParent`.
 */
export default requireFromTopParent
