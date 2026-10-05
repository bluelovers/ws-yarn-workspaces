import { IOptionsDedupe } from './lib/types';
import { detectYarnLockVersion } from '@yarn-tool/detect-yarnlock-version/lib/detectYarnLockVersion';
import v2 from './lib/v2';
import v1 from './lib/v1';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { EnumDetectYarnLock } from '@yarn-tool/yarnlock-types';

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
export function listDuplicates(yarnlock_old: Buffer | string, options?: IOptionsDedupe): string[]
{
	yarnlock_old = yarnlock_old.toString();
	let verType = detectYarnLockVersion(yarnlock_old)

	/**
	 * v2 與 v3 皆為 Berry 格式，可共用同一套 yarn-berry-deduplicate 實作。
	 *
	 * v2 and v3 are both Berry formats and can share the yarn-berry-deduplicate
	 * implementation.
	 */
	switch (verType)
	{
		case EnumDetectYarnLock.v3:
		case EnumDetectYarnLock.v2:
			return v2.listDuplicates(yarnlock_old, options)
		case EnumDetectYarnLock.v1:
			return v1.listDuplicates(yarnlock_old, options)
	}

	/**
	 * 偵測結果不屬於已知格式時，明確丟錯比回傳空結果更容易除錯。
	 *
	 * Throwing for an unknown format is easier to debug than returning an
	 * empty result.
	 */
	throw new TypeError(`can't detect yarn.lock version`)
}

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
export function fixDuplicates(yarnlock_old: Buffer | string, options?: IOptionsDedupe): string
{
	yarnlock_old = yarnlock_old.toString();
	let verType = detectYarnLockVersion(yarnlock_old)

	/**
	 * 與 listDuplicates 使用同一套分派邏輯，確保列印與修正行為一致。
	 *
	 * Uses the same dispatch logic as listDuplicates so listing and fixing
	 * stay consistent.
	 */
	switch (verType)
	{
		case EnumDetectYarnLock.v3:
		case EnumDetectYarnLock.v2:
			return v2.fixDuplicates(yarnlock_old, options)
		case EnumDetectYarnLock.v1:
			return v1.fixDuplicates(yarnlock_old, options)
	}

	/**
	 * 與 listDuplicates 相同：偵測失敗時明確丟錯，避免靜默回傳未變動的內容。
	 *
	 * Same as listDuplicates: fail loudly on an unknown format instead of
	 * silently returning unchanged content.
	 */
	throw new TypeError(`can't detect yarn.lock version`)
}

/**
 * 以檔案路徑讀取 yarn.lock 並執行去重，省去呼叫端自行讀檔的步驟。
 *
 * Reads a yarn.lock from disk and deduplicates it, saving callers from
 * handling the file read themselves.
 *
 * @param yarnlock_old_file yarn.lock 檔案路徑 / path of the yarn.lock file
 * @param options 去重篩選選項 / dedupe filtering options
 */
export function yarnDedupeFile(yarnlock_old_file: string, options?: IOptionsDedupe)
{
	return yarnDedupe(readFileSync(yarnlock_old_file) as any, options)
}

/**
 * 執行去重並回傳新舊內容與是否變動的比較結果。
 *
 * Deduplicates the input and returns the old/new content plus a flag telling
 * whether anything changed.
 *
 * @param yarnlock_old lockfile 內容 / the lockfile content
 * @param options 去重篩選選項 / dedupe filtering options
 */
export function yarnDedupe(yarnlock_old: string, options?: IOptionsDedupe)
{
	yarnlock_old = yarnlock_old.toString();
	const yarnlock_new = fixDuplicates(yarnlock_old, options);

	return {
		/**
		 * 執行前的 yarn.lock / the yarn.lock before the run
		 */
		yarnlock_old,
		/**
		 * 執行後的 yarn.lock / the yarn.lock after the run
		 */
		yarnlock_new,
		/**
		 * yarn.lock 是否有變動 / whether the yarn.lock changed
		 */
		yarnlock_changed: yarnlock_old !== yarnlock_new,
	}
}

/**
 * 以常數物件彙整三個主要函式，作為預設匯出的穩定表面。
 *
 * Groups the three main functions into a constant object, forming the stable
 * default export surface.
 */
const auto = {
	listDuplicates,
	fixDuplicates,
	yarnDedupe,
} as const

export default auto
