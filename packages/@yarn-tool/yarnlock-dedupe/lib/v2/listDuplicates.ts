import { fixDuplicates as _fixDuplicates, listDuplicates as _listDuplicates } from 'yarn-berry-deduplicate';
import { IOptionsDedupe } from '../types';

/**
 * 列出 yarn.lock Berry（v2/v3）中的重複項目，委派給 yarn-berry-deduplicate 實作。
 *
 * Lists duplicated entries in a yarn.lock Berry (v2/v3), delegating to
 * yarn-berry-deduplicate.
 *
 * @param yarnlock_old Berry 格式的 lockfile 內容 / Berry-format lockfile content
 * @param options 去重篩選選項 / dedupe filtering options
 * @returns 重複項目鍵值的陣列 / an array of duplicated entry keys
 */
export function listDuplicates(yarnlock_old: Buffer | string, options?: IOptionsDedupe): string[]
{
	return _listDuplicates(yarnlock_old.toString(), options)
}
