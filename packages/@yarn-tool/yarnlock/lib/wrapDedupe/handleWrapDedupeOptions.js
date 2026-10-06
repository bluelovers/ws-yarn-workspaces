"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWrapDedupeOptions = handleWrapDedupeOptions;
const upath2_1 = require("upath2");
const find_root_1 = require("@yarn-tool/find-root");
const read_1 = require("@yarn-tool/yarnlock-fs/lib/read");
/**
 * 初始化 `wrapDedupe` 的選項與快取：補上 cwd 預設值、重置步驟狀態、
 * 解析專案根目錄與 yarn.lock 快取，讓每個步驟拿到一致的起始狀態。
 *
 * Initialises wrapDedupe options and cache: fills the cwd default, resets step status,
 * resolves the project root and yarn.lock cache so every step starts from the same state.
 *
 * @throws TypeError 未能取得 cwd / when cwd cannot be resolved
 */
function handleWrapDedupeOptions(yarg, argv, options) {
    /**
     * 允許呼叫端透過 options.cache 注入部分快取；
     * 未注入時建立全新物件，避免殘留上一次執行的狀態。
     *
     * Callers may inject a partial cache via options.cache; otherwise a fresh object is
     * created so state from a previous run cannot leak in.
     */
    let cache = options.cache || {};
    // @ts-ignore
    cache.cwd = cache.cwd || argv.cwd;
    if (!cache.cwd) {
        /**
         * 沒有 cwd 就無法定位專案根目錄，提前拋錯避免後續路徑運算產生錯誤結果。
         *
         * Without cwd the project root cannot be located; fail fast to prevent later
         * path computations from producing wrong results.
         */
        throw new TypeError(`cache.cwd is '${cache.cwd}'`);
    }
    // @ts-ignore
    cache.cwd = (0, upath2_1.resolve)(cache.cwd);
    /**
     * 每次初始化都重置 ret 與 diff 訊息，
     * 確保本次執行不會讀到上一次殘留的步驟狀態。
     *
     * `ret` and the diff message are reset on every init so this run never reads
     * step status left over from a previous run.
     */
    // @ts-ignore
    cache.ret = {};
    cache.yarnlock_msg = undefined;
    /**
     * 統一管線的輸出口：console 供一般訊息、consoleDebug 供除錯訊息，
     * 兩者都補上預設值，讓各步驟不用各自處理缺失情況。
     *
     * Unifies pipeline output: `console` for general messages, `consoleDebug` for debug
     * ones; both get defaults so individual steps need not handle their absence.
     */
    // @ts-ignore
    cache.console = cache.console || console;
    // @ts-ignore
    cache.consoleDebug = cache.consoleDebug || options.consoleDebug;
    /**
     * 以 cwd 解析專案根目錄（第三參數 true 代表忽略 cwd 本身即為根目錄的情況），
     * 是因為 yarn.lock 可能位於 monorepo 的上層而非 cwd 底下。
     *
     * Resolves the project root from cwd (third arg `true` also accepts cwd itself as
     * root) because in a monorepo the yarn.lock may live above cwd.
     */
    // @ts-ignore
    cache.rootData = cache.rootData || (0, find_root_1.findRoot)({
        ...argv,
        cwd: cache.cwd,
    }, true);
    /**
     * 讀取目前的 yarn.lock 快取並取回原始內容作為 diff 基準，
     * 檔案不存在時 fsYarnLockSafe 會回傳可判斷的結果而不拋錯。
     *
     * Reads the current yarn.lock cache and its original content as the diff baseline;
     * fsYarnLockSafe returns a checkable result instead of throwing when missing.
     */
    // @ts-ignore
    cache.yarnlock_cache = cache.yarnlock_cache || (0, read_1.fsYarnLockSafe)(cache.rootData.root);
    // @ts-ignore
    cache.yarnlock_old = cache.yarnlock_cache.yarnlock_old;
    /**
     * 以原始內容同時作為後備基準，供最終 diff 使用。
     *
     * The original content doubles as the fallback baseline for the final diff.
     */
    cache.yarnlock_old2 = cache.yarnlock_old;
    // @ts-ignore
    cache.yarnlock_old_exists = cache.yarnlock_cache.yarnlock_exists;
    return {
        options,
        cache,
    };
}
//# sourceMappingURL=handleWrapDedupeOptions.js.map