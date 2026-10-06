"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixDuplicates = fixDuplicates;
const yarn_deduplicate_1 = require("yarn-deduplicate");
/**
 * 修正 yarn.lock v1 中的重複項目，委派給 yarn-deduplicate 實作。
 *
 * Fixes duplicated entries in a yarn.lock v1, delegating to yarn-deduplicate.
 *
 * @param yarnlock_old v1 格式的 lockfile 內容 / v1-format lockfile content
 * @param options 去重篩選選項 / dedupe filtering options
 * @returns 去重後的 lockfile 字串 / the deduplicated lockfile string
 */
function fixDuplicates(yarnlock_old, options) {
    yarnlock_old = yarnlock_old.toString();
    /**
     * v1 鎖定檔不處理橫幅註解 (banner)：直接採用 yarn-deduplicate 的輸出，
     * 該行拆解呼叫保留為註解供日後參考。
     *
     * No banner handling for v1: the yarn-deduplicate output is used as-is
     * and the banner-splitting call is kept commented out for future reference.
     */
    //let { banner, content } = existsYarnLockBanner(yarnlock_old)
    const output = (0, yarn_deduplicate_1.fixDuplicates)(yarnlock_old, options);
    return `${output}`;
}
//# sourceMappingURL=fixDuplicates.js.map