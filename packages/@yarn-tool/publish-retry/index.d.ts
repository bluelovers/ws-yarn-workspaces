/**
 * 發布 cwd 底下所有尚未發布的 workspace 套件
 * Publish all unpublished workspace packages under cwd
 *
 * @param cwd - 專案根目錄；省略時交由 wsPkgListable 決定 / Project root; omitted leaves it to wsPkgListable
 * @returns 全部套件處理完成後 resolve / Resolves once every package has been processed
 */
export declare function publishRetry(cwd?: string): Promise<void[]>;
/**
 * 預設匯出：此套件只有單一主要操作，具名與預設匯出等價
 * Default export: the package has one main operation, so both exports are equivalent
 */
export default publishRetry;
