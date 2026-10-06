/**
 * 解析與分類 workspaces 設定的核心模組
 * Core module for parsing and classifying workspaces configuration
 *
 * 從 package.json 讀取 `workspaces` 欄位，正規化兩種設定格式，
 * 並將樣式分類為靜態路徑與 glob 前綴，供 monorepo 初始化工具使用。
 * Reads the `workspaces` field from package.json, normalizes both configuration formats,
 * and classifies patterns into static paths and glob prefixes for monorepo scaffolding tools.
 *
 * Created by user on 2018/5/14/014.
 *
 * @packageDocumentation
 */
import findPkg from 'find-pkg-ws';
/**
 * workspaces 的物件格式設定
 * Object-format workspaces configuration
 */
export type WorkspacesConfig = {
    /** 套件樣式列表 / List of package patterns */
    packages?: WorkspacesConfigArray;
    /** Yarn 1 的 nohoist 設定，原樣保留 / Yarn 1 nohoist setting, preserved as-is */
    nohoist?: Array<string>;
};
/**
 * workspaces 的樣式陣列（陣列格式）
 * Array of workspace patterns (array format)
 */
export type WorkspacesConfigArray = Array<string>;
/**
 * 讀取指定目錄所屬 package.json 的 workspaces 設定
 * Read the workspaces configuration of the package.json owning the given directory
 *
 * @param {string} [cwd] - 起始目錄，預設為目前目錄 / Starting directory, defaults to current working directory
 * @returns {WorkspacesConfig} 正規化後的 workspaces 設定 / Normalized workspaces configuration
 * @throws {RangeError} 找不到 package.json 時拋出，代表該目錄不屬於任何套件
 *                     Thrown when no package.json is found, meaning the directory does not belong to any package
 *
 * @example
 * getConfig(); // => { packages: ['packages/*'] }
 */
export declare function getConfig(cwd?: string): WorkspacesConfig;
/**
 * 將兩種 workspaces 格式正規化為物件格式
 * Normalize both workspaces formats into the object format
 *
 * 陣列格式會被包成 `{ packages: [...] }`，其餘情況原樣回傳，
 * 讓下游函式只需處理一種結構。
 * Array format is wrapped as `{ packages: [...] }` and everything else is returned as-is,
 * so downstream functions only deal with a single shape.
 *
 * @param {WorkspacesConfig|WorkspacesConfigArray} workspaces - 任一格式的 workspaces 設定 / Workspaces configuration in either format
 * @returns {WorkspacesConfig} 物件格式的設定 / Configuration in object format
 */
export declare function parseWorkspaces(workspaces: WorkspacesConfig | WorkspacesConfigArray): WorkspacesConfig;
/**
 * parseStaticPackagesPaths 的回傳結構
 * Return structure of parseStaticPackagesPaths
 */
export interface IParseStaticPackagesPathsReturnType {
    /** 所有片段皆為純名稱的靜態路徑，如 `packages/foo` / Static paths whose segments are all plain names, e.g. `packages/foo` */
    static: string[];
    /** 前綴樣式的最上層名稱，如 `packages` / Top-level name of a prefix pattern, e.g. `packages` */
    prefixRoot: string[];
    /** 前綴樣式的完整路徑，如 `packages` 或 `@scope/pkg` / Full path of a prefix pattern, e.g. `packages` or `@scope/pkg` */
    prefix: string[];
    /** 前綴去掉第一段後的路徑，單段前綴時為空字串 / Prefix minus its first segment, empty string for a single-segment prefix */
    prefixSub: string[];
    /** 原始樣式列表，不論是否可解析皆會收錄 / Original patterns, collected whether or not they could be parsed */
    all: string[];
}
/**
 * 將 workspaces 樣式分類為靜態路徑與 glob 前綴
 * Classify workspace patterns into static paths and glob prefixes
 *
 * 判定關鍵在於「第一個無法通過名稱檢查的片段」：
 * 全部片段皆有效代表這是可直接對應資料夾的靜態路徑；
 * 只有前半段有效則代表其餘為 glob，該有效前半段即為前綴。
 * The key is the first segment that fails the name check: all-valid segments mean a static folder path,
 * while only a valid leading portion means the rest is a glob and that portion is the prefix.
 *
 * @param {WorkspacesConfig|WorkspacesConfigArray} workspaces - 任一格式的 workspaces 設定 / Workspaces configuration in either format
 * @returns {IParseStaticPackagesPathsReturnType} 分類結果 / Classification result
 *
 * @example
 * parseStaticPackagesPaths(['packages/*']);
 * // => { static: [], prefixRoot: ['packages'], prefix: ['packages'], prefixSub: [''], all: ['packages/*'] }
 *
 * @example
 * parseStaticPackagesPaths(['packages/foo']);
 * // => { static: ['packages/foo'], prefixRoot: [], prefix: [], prefixSub: [], all: ['packages/foo'] }
 */
export declare function parseStaticPackagesPaths(workspaces: WorkspacesConfig | WorkspacesConfigArray): IParseStaticPackagesPathsReturnType;
/**
 * 轉發 find-pkg-ws，讓使用者不需額外安裝即可取得尋找 package.json 的能力
 * Re-export find-pkg-ws so consumers can locate package.json without an extra dependency
 */
export { findPkg };
/**
 * 預設匯出讀取設定的入口函式，`require('workspaces-config')` 即可直接呼叫
 * Default-exports the config reader so `require('workspaces-config')` can call it directly
 */
export default getConfig;
