/**
 * Workspace 版本修復工具
 * Workspace version fix utility
 *
 * 用於同步和修復 monorepo workspace 中的套件版本依賴
 * Used to sync and fix package version dependencies in monorepo workspaces
 */
import { IListableRow, IListableRowExtraWithDeps } from 'ws-pkg-list/lib/types';
import { IPackageJsonDependenciesField, IDependency } from '@ts-type/package-dts/lib/package-json/types';
import { ITSPartialRecord } from 'ts-type/lib/type/record';
import { ITSRequireAtLeastOne } from 'ts-type/lib/type/record';
/**
 * 版本修復結果映射介面
 * Version fix result map interface
 */
export interface IMap<R extends IListableRow> {
    /** 已變更的套件列表 / List of changed packages */
    changed: R[];
    /** 未變更的套件列表 / List of unchanged packages */
    others: R[];
    /** 版本資料映射 / Version data mapping */
    data: Record<string, string>;
}
/**
 * 執行時快取介面
 * Runtime cache interface
 */
export interface ICache<R extends IListableRow = IListableRow> {
    /** 可列出的套件列表 / Listable packages list */
    listable?: R[];
    /** 套件名稱到資料的映射 / Package name to data mapping */
    record?: Record<string, R>;
    /** 套件名稱列表 / Package names list */
    names?: string[];
    /** 結果映射 / Result map */
    map?: IMap<R>;
}
/**
 * 快取輸入類型（至少需要 listable 或 record）
 * Cache input type (requires at least listable or record)
 */
export type ICacheInput<R extends IListableRow = IListableRow> = ITSRequireAtLeastOne<ICache<R>, 'listable' | 'record'>;
/**
 * 處理執行時快取，初始化所有必要欄位
 * Process runtime cache, initialize all required fields
 *
 * @param {ICacheInput<R>} cache - 輸入快取物件 / Input cache object
 * @returns {Required<ICache<R>>} 完整快取物件 / Complete cache object
 */
export declare function handleRuntimeCache<R extends IListableRow>(cache: ICacheInput<R>): Required<ICache<R>>;
/**
 * 修復套件依賴版本的核心函數
 * Core function for fixing package dependency versions
 *
 * 將 workspace 內部套件的依賴版本更新為當前實際版本
 * Updates dependency versions of internal workspace packages to current actual versions
 *
 * @param {T} row - 套件 package.json 的依賴欄位 / Package.json dependency fields
 * @param {ICacheInput<R>} cache - 快取資料 / Cache data
 * @returns {Object} 修復結果 / Fix result
 */
export declare function fixPkgDepsVersionsCore<T extends ITSPartialRecord<IPackageJsonDependenciesField, IDependency>, R extends IListableRow>(row: T, cache: ICacheInput<R>): {
    row: T;
    map: IMap<R>;
    changed: boolean;
    cache: ICache<R>;
};
/**
 * 修復 Workspace 版本的核心函數
 * Core function for fixing workspace versions
 *
 * 遍歷所有 workspace 套件並同步其內部依賴版本
 * Iterates through all workspace packages and syncs their internal dependency versions
 *
 * @param {R[]} listable - 可列出的套件列表 / Listable packages list
 * @param {string} [cwd] - 當前工作目錄 / Current working directory
 * @returns {Object} 修復結果包含變更與未變更的套件 / Fix result with changed and unchanged packages
 */
export declare function fixWsVersionsCore<R extends IListableRowExtraWithDeps>(listable: R[], cwd?: string): {
    /** 已變更的套件列表 / List of changed packages */
    changed: R[];
    /** 未變更的套件列表 / List of unchanged packages */
    others: R[];
    /** 版本資料映射 / Version data mapping */
    data: Record<string, string>;
    cwd: string;
    listable: R[];
    record: Record<string, R>;
    names: string[];
};
/**
 * 修復 Workspace 版本的主要入口函數
 * Main entry function for fixing workspace versions
 *
 * 自動偵測 workspace 中的所有套件並同步版本
 * Automatically detects all packages in workspace and syncs versions
 *
 * @param {string} [cwd] - 當前工作目錄，預設為 process.cwd() / Current working directory, defaults to process.cwd()
 * @returns {Object} 修復結果 / Fix result
 *
 * @example
 * // 修復當前目錄的 workspace 版本
 * const result = fixWsVersions();
 * console.log(`Changed: ${result.changed.length} packages`);
 */
export declare function fixWsVersions(cwd?: string): {
    /** 已變更的套件列表 / List of changed packages */
    changed: IListableRowExtraWithDeps[];
    /** 未變更的套件列表 / List of unchanged packages */
    others: IListableRowExtraWithDeps[];
    /** 版本資料映射 / Version data mapping */
    data: Record<string, string>;
    cwd: string;
    listable: IListableRowExtraWithDeps[];
    record: Record<string, IListableRowExtraWithDeps>;
    names: string[];
};
/** 預設導出 / Default export */
export default fixWsVersions;
