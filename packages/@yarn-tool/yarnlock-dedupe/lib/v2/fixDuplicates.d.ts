import { IOptionsDedupe } from '../types';
/**
 * 修正 yarn.lock Berry（v2/v3）中的重複項目，委派給 yarn-berry-deduplicate 實作。
 *
 * Fixes duplicated entries in a yarn.lock Berry (v2/v3), delegating to
 * yarn-berry-deduplicate.
 *
 * @param yarnlock_old Berry 格式的 lockfile 內容 / Berry-format lockfile content
 * @param options 去重篩選選項 / dedupe filtering options
 * @returns 去重後的 lockfile 字串 / the deduplicated lockfile string
 */
export declare function fixDuplicates(yarnlock_old: Buffer | string, options?: IOptionsDedupe): string;
