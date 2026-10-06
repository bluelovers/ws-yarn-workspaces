/**
 * 從 cwd 向上逐層搜尋 node_modules/.bin 的底層實作（不含 findRoot 推斷）。
 * 回傳 result（實際存在的 bin 目錄）與 history（所有檢查過的目錄，供除錯）。
 *
 * Low-level implementation searching upward from cwd for node_modules/.bin (without findRoot inference).
 * Returns result (existing bin dirs) and history (all dirs checked, for debugging).
 *
 * @param options cwd 與 stopPath / cwd and stopPath
 * @returns result 與 history / result and history
 */
export declare function findBinPathCore(options?: {
    cwd?: string;
    stopPath?: string | string[];
}): {
    result: string[];
    history: string[];
};
/**
 * 預設匯出 (Default Export)：findBinPathCore，便於以預設方式載入。
 *
 * Default export: findBinPathCore, for loading the core search directly.
 */
export default findBinPathCore;
