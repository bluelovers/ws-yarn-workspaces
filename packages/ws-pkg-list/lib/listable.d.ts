import { IListableRow, IReadPackage, IOptionsPkgListable } from './types';
import IPackageJson from '@ts-type/package-dts';
/**
 * 將 readPackages() 的索引結果轉換為列（Row）清單。
 * Convert the index produced by `readPackages()` into a list of rows.
 *
 * @param readed 以套件名稱為鍵的已讀取資料。The read packages keyed by package name.
 * @param options 可提供 handler 自訂每列。Optional `handler` to customize each row.
 * @returns 轉換後的列清單；handler 回傳值會經過必要欄位檢查。The converted rows; values returned by `handler` are validated for required fields.
 */
export declare function wsPkgListableFromReaded<R extends IListableRow = IListableRow, T = IPackageJson>(readed: {
    [k: string]: IReadPackage<T>;
}, options?: IOptionsPkgListable<R>): R[];
/**
 * 從一組套件路徑建立列清單，內部會先 readPackages() 再轉換。
 * Build a list of rows from package paths, internally calling `readPackages()` first.
 *
 * @param paths 套件資料夾路徑清單。List of package folder paths.
 * @param cwd 解析相對路徑的基準目錄，預設為 process.cwd()。Base directory for resolving relative paths; defaults to `process.cwd()`.
 * @param options 可提供 handler 自訂每列。Optional `handler` to customize each row.
 */
export declare function wsPkgListableFromPaths<R extends IListableRow = IListableRow>(paths: string[], cwd?: string, options?: IOptionsPkgListable<R>): R[];
/**
 * 一次完成「找工作區 → 列出套件 → 轉成列」的常用流程。
 * Convenience wrapper that locates the workspace, lists its packages, and converts them into rows in one call.
 *
 * @param cwd 工作區根目錄，預設為 process.cwd()。Workspace root; defaults to `process.cwd()`.
 * @param options 可提供 handler 自訂每列。Optional `handler` to customize each row.
 */
export declare function wsPkgListable<R extends IListableRow = IListableRow>(cwd?: string, options?: IOptionsPkgListable<R>): R[];
export default wsPkgListable;
