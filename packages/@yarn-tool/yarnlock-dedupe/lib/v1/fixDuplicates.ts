import { fixDuplicates as _fixDuplicates, listDuplicates as _listDuplicates } from 'yarn-deduplicate';
import { IOptionsDedupe } from '../types';
import { existsYarnLockBanner } from '@yarn-tool/yarnlock-banner';

/**
 * 修正 yarn.lock v1 中的重複項目，委派給 yarn-deduplicate 實作。
 *
 * Fixes duplicated entries in a yarn.lock v1, delegating to yarn-deduplicate.
 *
 * @param yarnlock_old v1 格式的 lockfile 內容 / v1-format lockfile content
 * @param options 去重篩選選項 / dedupe filtering options
 * @returns 去重後的 lockfile 字串 / the deduplicated lockfile string
 */
export function fixDuplicates(yarnlock_old: Buffer | string, options?: IOptionsDedupe): string
{
	yarnlock_old = yarnlock_old.toString();

	/**
	 * v1 鎖定檔不處理橫幅註解 (banner)：直接採用 yarn-deduplicate 的輸出，
	 * 該行拆解呼叫保留為註解供日後參考。
	 *
	 * No banner handling for v1: the yarn-deduplicate output is used as-is
	 * and the banner-splitting call is kept commented out for future reference.
	 */
	//let { banner, content } = existsYarnLockBanner(yarnlock_old)

	const output = _fixDuplicates(yarnlock_old, options);
	return `${output}`
}
