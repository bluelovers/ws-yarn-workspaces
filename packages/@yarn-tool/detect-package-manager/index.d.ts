import { ITSAsyncGenerator, ITSGenerator, ITSTypeAndStringLiteral } from 'ts-type';
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
 * 合併使用者指定的優先順序與預設順序
 * Merge user-specified priority with default order
 */
export declare function _handleClientsToCheck(npmClients?: IPackageManager[] | undefined): IPackageManager[];
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
 * @param returnDefault - 當找不到時是否返回預設值 / Whether to return default when not found
 * @yield - 可用的套件管理器元組 [名稱, 路徑] / Available package manager tuple [name, path]
 */
export declare function _whichPackageManagerAsyncGenerator(npmClients?: IPackageManager[] | undefined, returnDefault?: boolean): ITSAsyncGenerator<IResultDetectPackageManagerRaw>;
/**
 * 非同步生成器核心實作 - 依序檢查每個套件管理器是否可用
 * Async generator core implementation - sequentially check each package manager for availability
 *
 * @typeParam T - 套件管理器類型 / Package manager type
 * @param clientsToCheck - 要檢查的套件管理器列表 / List of package managers to check
 * @param returnDefault - 當找不到時是否返回預設值 / Whether to return default when not found
 * @yield - 可用的套件管理器元組 [名稱, 路徑] / Available package manager tuple [name, path]
 */
export declare function _whichAsyncGeneratorCore<T extends string = IPackageManager>(clientsToCheck: T[], returnDefault?: boolean): ITSAsyncGenerator<IResultDetectRawCore<T>>;
/**
 * 使用 which 依序檢查套件管理器列表，返回第一個可用的
 * Sequentially check package managers using which, return the first available one
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @returns 可用的套件管理器名稱 / Available package manager name
 */
export declare function whichPackageManagerAsync(npmClients?: IPackageManager[] | undefined, returnDefault?: boolean): Promise<IPackageManager>;
/**
 * 使用 which 依序檢查套件管理器列表，返回所有可用的套件管理器陣列
 * Sequentially check package managers using which, return all available package managers as array
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @returns 所有可用的套件管理器陣列 / Array of all available package managers
 */
export declare function whichPackageManagerAsyncAll(npmClients?: IPackageManager[] | undefined, returnDefault?: boolean): Promise<IPackageManager[]>;
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
 * @param returnDefault - 當找不到時是否返回預設值 / Whether to return default when not found
 * @yield - 可用的套件管理器元組 [名稱, 路徑] / Available package manager tuple [name, path]
 */
export declare function _whichPackageManagerSyncGenerator(npmClients?: IPackageManager[] | undefined, returnDefault?: boolean): ITSGenerator<IResultDetectPackageManagerRaw>;
/**
 * 同步生成器核心實作 - 依序檢查每個套件管理器是否可用
 * Sync generator core implementation - sequentially check each package manager for availability
 *
 * @typeParam T - 套件管理器類型 / Package manager type
 * @param clientsToCheck - 要檢查的套件管理器列表 / List of package managers to check
 * @param returnDefault - 當找不到時是否返回預設值 / Whether to return default when not found
 * @yield - 可用的套件管理器元組 [名稱, 路徑] / Available package manager tuple [name, path]
 */
export declare function _whichSyncGeneratorCore<T extends string = IPackageManager>(clientsToCheck: T[], returnDefault?: boolean): ITSGenerator<IResultDetectRawCore<T>>;
/**
 * 使用 which 依序檢查套件管理器列表，返回所有可用的套件管理器陣列（同步版本）
 * Sequentially check package managers using which, return all available package managers as array (sync version)
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @returns 所有可用的套件管理器陣列 / Array of all available package managers
 */
export declare function whichPackageManagerSyncAll(npmClients?: IPackageManager[] | undefined, returnDefault?: boolean): IPackageManager[];
/**
 * 使用 which 依序檢查套件管理器列表，返回第一個可用的
 * Sequentially check package managers using which, return the first available one
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @returns 可用的套件管理器名稱 / Available package manager name
 */
export declare function whichPackageManagerSync(npmClients?: IPackageManager[] | undefined, returnDefault?: boolean): IPackageManager;
export default whichPackageManagerSync;
