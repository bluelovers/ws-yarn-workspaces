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
declare const MODULE_NOT_FOUND: "MODULE_NOT_FOUND";
export { MODULE_NOT_FOUND };
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
export interface IErrnoException extends NodeJS.ErrnoException, Error {
    /**
     * 錯誤碼；找不到模組時為 `'MODULE_NOT_FOUND'`。
     *
     * Error code; `'MODULE_NOT_FOUND'` when the module was not found.
     */
    code?: string | typeof MODULE_NOT_FOUND;
    /**
     * 最後一次嘗試 require 失敗的模組。
     *
     * The last module whose `require` attempt failed.
     */
    module?: NodeModule;
    /**
     * 搜尋的起始模組。
     *
     * The module the search started from.
     */
    startModule?: NodeModule;
    /**
     * all module list for search
     *
     * 用於搜尋的完整模組清單。
     */
    list?: NodeModule[];
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
export declare function requireFromTopParent<T = any>(id: string, startModule?: NodeModule): T;
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
export declare function getAllModule(startModule?: NodeModule): NodeModule[];
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
export declare function requireFromModuleList<T = any>(id: string, ls: NodeModule[], startModule: NodeModule): T;
/**
 * `requireFromTopParent` 的別名 (Alias)。
 *
 * Alias of `requireFromTopParent`.
 *
 * @typeParam T - 回傳模組的型別 / Type of the returned module
 * @param id - 要 require 的模組 id / Module id to require
 * @param startModule - 搜尋的起始模組 / Start module of the search
 */
export declare function upRequire<T = any>(id: string, startModule?: NodeModule): T;
/**
 * `requireFromTopParent` 的別名 (Alias)。
 *
 * Alias of `requireFromTopParent`.
 *
 * @typeParam T - 回傳模組的型別 / Type of the returned module
 * @param id - 要 require 的模組 id / Module id to require
 * @param startModule - 搜尋的起始模組 / Start module of the search
 */
export declare function requireUp<T = any>(id: string, startModule?: NodeModule): T;
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
export declare function requireParent<T = any>(id: string, startModule: NodeModule): T;
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
export declare function requireFromParentUp<T = any>(id: string, startModule?: NodeModule): T;
/**
 * 整理錯誤資料以利除錯。
 *
 * Normalize error data for debugging.
 *
 * @param err - 來源錯誤；無則建立新的 / Source error; a new one is created if absent
 * @param data - 附加到錯誤上的除錯資料 / Debug data to attach to the error
 * @returns 附加完成的錯誤物件 / The enriched error object
 */
export declare function _createError(err: IErrnoException, data: {
    id?: string;
    code?: string | typeof MODULE_NOT_FOUND;
    module?: NodeModule;
    startModule?: NodeModule;
    list?: NodeModule[];
}): IErrnoException;
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
export declare function getModuleByExports<T = any>(exportModule: T, req?: NodeJS.Require): INodeModule<T>;
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
export declare function getModuleByFile<T = any>(file: string, requireIfNotExists?: boolean, req?: NodeJS.Require): INodeModule<T>;
/**
 * `require.cache` 的索引簽名 (Index Signature)。
 *
 * Index signature for `require.cache`.
 *
 * 以字串鍵對應 NodeModule，補足 TypeScript 未定義的 cache 型別。
 *
 * Maps string keys to NodeModule, supplying the cache type TypeScript lacks.
 */
export interface INodeRequireCache {
    [k: string]: NodeModule;
}
/**
 * 回傳 require.cache 以供 TypeScript 使用。
 *
 * Return `require.cache` with TypeScript-friendly typing.
 *
 * @param req - 使用的 require，可注入自訂實例 / The require to use; injectable
 */
export declare function getRequireCache(req?: NodeJS.Require): INodeRequireCache;
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
export interface INodeModule<T = any> extends NodeModule {
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
export declare function getMainModule<T = any>(id?: string): INodeModule<T>;
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
export declare function getModuleByID<T = any>(id: string, requireIfNotExists?: boolean, req?: NodeJS.Require): INodeModule<T>;
/**
 * 預設匯出：`requireFromTopParent`。
 *
 * Default export: `requireFromTopParent`.
 */
export default requireFromTopParent;
