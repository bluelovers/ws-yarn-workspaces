import { ITSAsyncGenerator, ITSGenerator, ITSTypeAndStringLiteral, ITSArrayListMaybeReadonly } from 'ts-type';
/**
 * 支援的套件管理器類型
 * Supported package manager types
 */
export declare const enum EnumPackageManager {
    'yarn' = "yarn",
    'npm' = "npm",
    'pnpm' = "pnpm"
}
/**
 * 支援的套件管理器類型
 * Supported package manager types
 */
export type IPackageManager = ITSTypeAndStringLiteral<EnumPackageManager>;
export type IPackageManager2<T extends string> = IPackageManager | T;
/**
 * 偵測結果類型 - 包含套件管理器名稱和命令路徑
 * Detection result type - contains package manager name and command path
 *
 * @typeParam T - 套件管理器類型 / Package manager type
 */
export type IResultDetectPackageManagerRaw<T extends IPackageManager = IPackageManager> = IResultDetectRawCore<T>;
/**
 * 偵測結果核心類型 - 元組 [名稱, 路徑?]
 * Detection result core type - tuple [name, path?]
 *
 * @typeParam T - 字串類型 / String type
 */
export type IResultDetectRawCore<T extends string = IPackageManager> = readonly [T, string?];
/**
 * 選項配置介面
 * Options configuration interface
 */
export interface IOptionsWhichPackageManager {
    /**
     * 當找不到時是否返回預設值
     * Whether to return default when not found
     */
    returnDefault?: boolean;
    /**
     * 只使用使用者指定的套件管理器
     * 不合併使用者指定的優先順序與預設順序
     * Only use user-specified package managers
     * Do not merge user-specified priority with default order
     */
    noUseDefaultClients?: boolean;
}
/**
 * 選項輸入類型 - 可接受布林值或選項物件
 * Options input type - accepts boolean or options object
 */
export type IRuntimeOptionInput = boolean | IOptionsWhichPackageManager;
/**
 * 核心選項處理函數 - 將輸入轉換為標準選項物件
 * Core options handler function - converts input to standard options object
 *
 * @param returnDefaultOrOptions - 布林值或選項物件 / Boolean or options object
 * @returns 標準選項物件 / Standard options object
 */
export declare function _handleOptionsWhichPackageManagerCore(returnDefaultOrOptions?: IRuntimeOptionInput): IOptionsWhichPackageManager;
/**
 * 處理套件管理器選項與客戶端列表
 * Handle package manager options and client list
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @param returnDefaultOrOptions - 選項輸入 / Options input
 * @returns 包含選項與檢查列表的物件 / Object containing options and check list
 */
export declare function handleOptionsWhichPackageManager<T extends string = IPackageManager>(npmClients?: ITSArrayListMaybeReadonly<IPackageManager2<T>> | undefined, returnDefaultOrOptions?: IRuntimeOptionInput): {
    options: IOptionsWhichPackageManager;
    /**
     * 合併使用者指定的優先順序與預設順序
     * Merge user-specified priority with default order
     */
    clientsToCheck: readonly IPackageManager2<T>[];
};
/**
 * 合併使用者指定的優先順序與預設順序
 * Merge user-specified priority with default order
 */
export declare function _handleClientsToCheck<T extends string = IPackageManager>(npmClients?: ITSArrayListMaybeReadonly<T> | undefined, options?: IOptionsWhichPackageManager): readonly IPackageManager2<T>[];
/**
 * 使用 which 依序檢查套件管理器列表，返回第一個可用的
 * Sequentially check package managers using which, return the first available one
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @returns 可用的套件管理器名稱 / Available package manager name
 */
/**
 * 非同步生成器 - 使用 which 依序檢查套件管理器列表
 * Async generator - sequentially check package managers using which
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @param returnDefaultOrOptions - 選項輸入 (布林值或 IOptionsWhichPackageManager) / Options input (boolean or IOptionsWhichPackageManager)
 * @yield - 可用的套件管理器元組 [名稱, 路徑] / Available package manager tuple [name, path]
 */
export declare function _whichPackageManagerAsyncGenerator<T extends string = IPackageManager>(npmClients?: ITSArrayListMaybeReadonly<IPackageManager2<T>> | undefined, returnDefaultOrOptions?: IRuntimeOptionInput): ITSAsyncGenerator<IResultDetectPackageManagerRaw<IPackageManager2<T>>>;
/**
 * 非同步生成器核心實作 - 依序檢查每個套件管理器是否可用
 * Async generator core implementation - sequentially check each package manager for availability
 *
 * @typeParam T - 套件管理器類型 / Package manager type
 * @param clientsToCheck - 要檢查的套件管理器列表 / List of package managers to check
 * @param options - 選項 / Options
 * @yield - 可用的套件管理器元組 [名稱, 路徑] / Available package manager tuple [name, path]
 */
export declare function _whichAsyncGeneratorCore<T extends string = IPackageManager>(clientsToCheck: ITSArrayListMaybeReadonly<T>, options: IOptionsWhichPackageManager): ITSAsyncGenerator<IResultDetectRawCore<T>>;
/**
 * 使用 which 依序檢查套件管理器列表，返回第一個可用的
 * Sequentially check package managers using which, return the first available one
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @returns 可用的套件管理器名稱 / Available package manager name
 */
export declare function whichPackageManagerAsync(npmClients?: ITSArrayListMaybeReadonly<IPackageManager> | undefined, returnDefaultOrOptions?: IRuntimeOptionInput): Promise<IPackageManager>;
/**
 * 使用 which 依序檢查套件管理器列表，返回所有可用的套件管理器陣列
 * Sequentially check package managers using which, return all available package managers as array
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @returns 所有可用的套件管理器陣列 / Array of all available package managers
 */
export declare function whichPackageManagerAsyncAll(npmClients?: ITSArrayListMaybeReadonly<IPackageManager> | undefined, returnDefaultOrOptions?: IRuntimeOptionInput): Promise<IPackageManager[]>;
/**
 * 使用 which 依序檢查套件管理器列表，以同步生成器方式 yield 所有可用的套件管理器
 * Sequentially check package managers using which, yield all available package managers via sync generator
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @returns 可用的套件管理器（透過 yield）/ Available package manager (via yield)
 */
/**
 * 同步生成器 - 使用 which 依序檢查套件管理器列表
 * Sync generator - sequentially check package managers using which
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @param returnDefaultOrOptions - 選項輸入 (布林值或 IOptionsWhichPackageManager) / Options input (boolean or IOptionsWhichPackageManager)
 * @yield - 可用的套件管理器元組 [名稱, 路徑] / Available package manager tuple [name, path]
 */
export declare function _whichPackageManagerSyncGenerator<T extends string = IPackageManager>(npmClients?: ITSArrayListMaybeReadonly<IPackageManager2<T>> | undefined, returnDefaultOrOptions?: IRuntimeOptionInput): ITSGenerator<IResultDetectPackageManagerRaw<IPackageManager2<T>>>;
/**
 * 同步生成器核心實作 - 依序檢查每個套件管理器是否可用
 * Sync generator core implementation - sequentially check each package manager for availability
 *
 * @typeParam T - 套件管理器類型 / Package manager type
 * @param clientsToCheck - 要檢查的套件管理器列表 / List of package managers to check
 * @param options - 選項 / Options
 * @yield - 可用的套件管理器元組 [名稱, 路徑] / Available package manager tuple [name, path]
 */
export declare function _whichSyncGeneratorCore<T extends string = IPackageManager>(clientsToCheck: ITSArrayListMaybeReadonly<T>, options: IOptionsWhichPackageManager): ITSGenerator<IResultDetectRawCore<T>>;
/**
 * 使用 which 依序檢查套件管理器列表，返回所有可用的套件管理器陣列（同步版本）
 * Sequentially check package managers using which, return all available package managers as array (sync version)
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @returns 所有可用的套件管理器陣列 / Array of all available package managers
 */
export declare function whichPackageManagerSyncAll(npmClients?: ITSArrayListMaybeReadonly<IPackageManager> | undefined, returnDefaultOrOptions?: IRuntimeOptionInput): IPackageManager[];
/**
 * 使用 which 依序檢查套件管理器列表，返回第一個可用的
 * Sequentially check package managers using which, return the first available one
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @returns 可用的套件管理器名稱 / Available package manager name
 */
export declare function whichPackageManagerSync(npmClients?: ITSArrayListMaybeReadonly<IPackageManager> | undefined, returnDefaultOrOptions?: IRuntimeOptionInput): IPackageManager;
export default whichPackageManagerSync;
