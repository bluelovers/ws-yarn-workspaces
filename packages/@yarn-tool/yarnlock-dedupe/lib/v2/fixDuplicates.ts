import { fixDuplicates as _fixDuplicates, listDuplicates as _listDuplicates } from 'yarn-berry-deduplicate';
import { IOptionsDedupe } from '../types';
import { existsYarnLockBanner } from '@yarn-tool/yarnlock-banner';

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
export function fixDuplicates(yarnlock_old: Buffer | string, options?: IOptionsDedupe): string
{
	yarnlock_old = yarnlock_old.toString();

	/**
	 * 先拆出開頭的橫幅註解 (banner)：只把正文交給去重器，避免橫幅被改寫，
	 * 最後再原樣拼回輸出。
	 *
	 * Split off the leading banner first: only the body goes through the
	 * deduplicator so the banner stays untouched, then it is re-attached.
	 */
	const { banner, content } = existsYarnLockBanner(yarnlock_old);

	const output = _fixDuplicates(content, options);
	return `${banner}${output}`
}
