/**
 * Created by user on 2020/6/13.
 */
import { IOptionsPkgListable, IListableRowExtraWithDeps } from './types';
/**
 * 取得含各種依賴欄位的套件列清單（含相對於根目錄的 prefix）。
 * Build a list of package rows that includes dependency fields and a `prefix` relative to the root.
 *
 * @param cwd 起始目錄，會向上尋找工作區根目錄；找不到時拋出錯誤。Starting directory; walks up to the workspace root, throwing when not found.
 * @param options 可提供 handler 自訂每列，會在內建處理之後被呼叫。Optional `handler` to customize each row; it runs after the built-in processing.
 * @returns 含依賴欄位的列清單。Rows carrying the dependency fields.
 */
export declare function wsPkgDepsListable<R extends IListableRowExtraWithDeps>(cwd?: string, options?: IOptionsPkgListable<R>): R[];
/**
 * 取得含依賴資訊的套件列，並轉成以套件名稱為鍵的記錄（Record）。
 * Build dependency-bearing rows and convert them into a record keyed by package name.
 *
 * @param cwd 起始目錄，會向上尋找工作區根目錄。Starting directory; walks up to the workspace root.
 * @param options 可提供 handler 自訂每列。Optional `handler` to customize each row.
 * @returns 以 name 為鍵的依賴列記錄。A record of dependency rows keyed by `name`.
 */
export declare function wsPkgDepsListableRecord<R extends IListableRowExtraWithDeps>(cwd?: string, options?: IOptionsPkgListable<R>): Record<string, R>;
export default wsPkgDepsListableRecord;
