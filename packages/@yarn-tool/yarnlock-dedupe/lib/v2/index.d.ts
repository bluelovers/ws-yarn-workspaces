import { fixDuplicates } from './fixDuplicates';
import { listDuplicates } from './listDuplicates';
import { IOptionsDedupe } from '../types';
/**
 * yarn.lock Berry（v2/v3）專用的去重入口，由根目錄依偵測結果分派至此。
 *
 * Dedupe entry point dedicated to yarn.lock Berry (v2/v3); the package root
 * dispatches here once the format is detected.
 *
 * @param yarnlock_old Berry 格式的 lockfile 內容 / Berry-format lockfile content
 * @param options 去重篩選選項 / dedupe filtering options
 */
export declare function yarnDedupe(yarnlock_old: string, options?: IOptionsDedupe): {
    /**
     * 執行前的 yarn.lock / the yarn.lock before the run
     */
    yarnlock_old: string;
    /**
     * 執行後的 yarn.lock / the yarn.lock after the run
     */
    yarnlock_new: string;
    /**
     * yarn.lock 是否有變動 / whether the yarn.lock changed
     */
    yarnlock_changed: boolean;
};
/**
 * 重新匯出 Berry 的兩個核心函式，讓根目錄能以具名匯入 (named import) 直接分派。
 *
 * Re-exports the two core Berry functions so the package root can dispatch
 * to them via named imports.
 */
export { fixDuplicates, listDuplicates, };
/**
 * Berry 實作的彙整物件，結構與 v1 保持一致以便根目錄分派。
 *
 * Object grouping the Berry implementation; kept structurally identical to v1
 * so the root dispatch can treat both uniformly.
 */
declare const v2: {
    fixDuplicates: typeof fixDuplicates;
    listDuplicates: typeof listDuplicates;
    yarnDedupe: typeof yarnDedupe;
};
export default v2;
