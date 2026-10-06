import { IOptionsDedupe } from './lib/types';
/**
 * 依自動偵測到的 yarn.lock 格式分派，列出目前存在的重複依賴項目。
 *
 * Detects the yarn.lock format automatically and lists the duplicated
 * dependency entries it currently contains.
 *
 * @param yarnlock_old lockfile 內容 / the lockfile content
 * @param options 去重篩選選項 / dedupe filtering options
 * @returns 重複項目鍵值的陣列 / an array of duplicated entry keys
 */
export declare function listDuplicates(yarnlock_old: Buffer | string, options?: IOptionsDedupe): string[];
/**
 * 依自動偵測到的 yarn.lock 格式分派，回傳去重後的 lockfile 內容。
 *
 * Detects the yarn.lock format automatically and returns the deduplicated
 * lockfile content.
 *
 * @param yarnlock_old lockfile 內容 / the lockfile content
 * @param options 去重篩選選項 / dedupe filtering options
 * @returns 去重後的 lockfile 字串 / the deduplicated lockfile string
 */
export declare function fixDuplicates(yarnlock_old: Buffer | string, options?: IOptionsDedupe): string;
/**
 * 以檔案路徑讀取 yarn.lock 並執行去重，省去呼叫端自行讀檔的步驟。
 *
 * Reads a yarn.lock from disk and deduplicates it, saving callers from
 * handling the file read themselves.
 *
 * @param yarnlock_old_file yarn.lock 檔案路徑 / path of the yarn.lock file
 * @param options 去重篩選選項 / dedupe filtering options
 */
export declare function yarnDedupeFile(yarnlock_old_file: string, options?: IOptionsDedupe): {
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
 * 執行去重並回傳新舊內容與是否變動的比較結果。
 *
 * Deduplicates the input and returns the old/new content plus a flag telling
 * whether anything changed.
 *
 * @param yarnlock_old lockfile 內容 / the lockfile content
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
 * 以常數物件彙整三個主要函式，作為預設匯出的穩定表面。
 *
 * Groups the three main functions into a constant object, forming the stable
 * default export surface.
 */
declare const auto: {
    readonly listDuplicates: typeof listDuplicates;
    readonly fixDuplicates: typeof fixDuplicates;
    readonly yarnDedupe: typeof yarnDedupe;
};
export default auto;
