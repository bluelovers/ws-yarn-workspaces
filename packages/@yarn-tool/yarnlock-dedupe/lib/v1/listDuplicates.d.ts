import { IOptionsDedupe } from '../types';
/**
 * 列出 yarn.lock v1 中的重複項目，委派給 yarn-deduplicate 實作。
 *
 * Lists duplicated entries in a yarn.lock v1, delegating to yarn-deduplicate.
 *
 * @param yarnlock_old v1 格式的 lockfile 內容 / v1-format lockfile content
 * @param options 去重篩選選項 / dedupe filtering options
 * @returns 重複項目鍵值的陣列 / an array of duplicated entry keys
 */
export declare function listDuplicates(yarnlock_old: Buffer | string, options?: IOptionsDedupe): string[];
