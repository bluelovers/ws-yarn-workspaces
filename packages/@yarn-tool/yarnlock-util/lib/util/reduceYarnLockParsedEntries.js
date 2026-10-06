"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reduceYarnLockParsedEntries = reduceYarnLockParsedEntries;
const yarnlock_parse_assert_1 = require("@yarn-tool/yarnlock-parse-assert");
/**
 * 對一份已解析的 lockfile 逐列執行自訂歸約（Reduce），是本套件整檔處理的最底層工具。
 * Run a custom reduction over every row of one parsed lockfile; this is the lowest-level
 * whole-file tool in this package.
 *
 * 採用 `reduce` 語意而非回傳新陣列，是因為使用者常要把結果累積成 map、
 * 計數或字串，一次走訪即可完成，不必先產生中間資料。
 * A `reduce` shape is used instead of returning a new array because callers usually accumulate
 * into a map, a counter, or a string; a single pass finishes the job without an intermediate
 * structure.
 *
 * @param alreadyComputedPackage 初始累積值（例如 `{}` 或 `[]`） / The initial accumulator
 *                               (for example `{}` or `[]`)
 * @param parsedOldPackage 已解析的 v1 或 v2 lockfile / A parsed v1 or v2 lockfile
 * @param fn 每列呼叫一次，回傳下一轮的累積值 / Called once per row, returns the next accumulator
 * @returns 歸約後的結果 / The reduced result
 * @throws lockfile 版本不受支援時拋出 / Thrown when the lockfile version is unsupported
 */
function reduceYarnLockParsedEntries(alreadyComputedPackage, parsedOldPackage, fn) {
    /**
     * 這裡只驗證不分支：版本差異已由上層的解析器處理，
     * 此函式本身對 v1/v2 一視同仁，因此只需確保版本在支援範圍內。
     * Only validation happens here, no branching: version differences are handled by the parser
     * upstream, and this function treats v1/v2 identically, so it only has to guarantee the
     * version is supported.
     */
    (0, yarnlock_parse_assert_1.assertYarnLockParsedIsSupported)(parsedOldPackage);
    /**
     * 以 `Object.entries` 取列是因為 `data` 的鍵在型別上只是字串索引，
     * 直接迭代才能同時拿到列鍵與列資料並傳給 `fn`。
     * Rows come from `Object.entries` because `data` is only string-indexed by type; iterating
     * that way yields both the row key and the row data for `fn`.
     */
    return Object.entries(parsedOldPackage.data)
        .reduce((alreadyComputedPackage, row, index) => {
        return fn(alreadyComputedPackage, row, index, parsedOldPackage);
    }, alreadyComputedPackage);
}
//# sourceMappingURL=reduceYarnLockParsedEntries.js.map