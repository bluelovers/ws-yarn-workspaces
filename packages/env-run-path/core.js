"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findBinPathCore = findBinPathCore;
const path_1 = require("path");
const fs_1 = require("fs");
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
function findBinPathCore(options = {}) {
    let { cwd = process.cwd(), stopPath, } = options;
    /**
     * 正規化 stopPath 成已 resolve 的陣列：
     * 字串轉單元素陣列、非陣列清空、陣列先複製再 resolve，避免改動呼叫端傳入的原陣列
     *
     * Normalize stopPath into a resolved array:
     * wrap a string into a single-element array, clear non-arrays, and copy arrays before resolving to avoid mutating the caller's input
     */
    if (typeof stopPath === 'string') {
        stopPath = [stopPath];
    }
    else if (!Array.isArray(stopPath)) {
        stopPath = [];
    }
    else {
        stopPath = stopPath.slice();
    }
    let bool = true;
    let current = (0, path_1.resolve)(cwd);
    let prev;
    let result = [];
    let history = [];
    /**
     * 統一 resolve，確保 stopPath 與 current 的比對不受相對路徑或結尾分隔符號影響
     *
     * Resolve uniformly so comparing stopPath against current is unaffected by relative paths or trailing separators
     */
    stopPath = stopPath.map(v => {
        return (0, path_1.resolve)(v);
    });
    /**
     * 逐層向上直到抵達檔案系統根目錄；
     * prev == current 表示已無法再向上（根目錄），避免無限迴圈
     *
     * Walk upward until reaching the filesystem root;
     * prev == current means no further parent exists (root), preventing an infinite loop
     */
    while (bool) {
        if (prev == current) {
            break;
        }
        let dir = (0, path_1.resolve)(current, './node_modules/.bin/');
        history.push(dir);
        let stat;
        /**
         * statSync 在目錄不存在時會拋例外，於此吞掉以繼續向上搜尋，
         * 僅在確實為目錄時才納入 result
         *
         * statSync throws when the directory is missing; the error is swallowed to keep searching upward,
         * and only real directories are collected into result
         */
        try {
            stat = (0, fs_1.statSync)(dir);
            if (stat.isDirectory()) {
                result.push(dir);
            }
        }
        catch (e) {
        }
        /**
         * 先檢查 stopPath：即使該層存在 bin 目錄也不再向上，
         * 讓 stopPath 含義為「此層（含）為止」
         *
         * Check stopPath first: even if this level has a bin dir, stop here,
         * making stopPath mean "up to and including this level"
         */
        if (stopPath.length && stopPath.includes(current)) {
            break;
        }
        prev = current;
        current = (0, path_1.resolve)(current, '..');
    }
    return {
        result,
        history,
    };
}
/**
 * 預設匯出 (Default Export)：findBinPathCore，便於以預設方式載入。
 *
 * Default export: findBinPathCore, for loading the core search directly.
 */
exports.default = findBinPathCore;
//# sourceMappingURL=core.js.map