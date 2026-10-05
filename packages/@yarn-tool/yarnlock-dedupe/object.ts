import { IOptionsDedupe } from './lib/types';
import { listDuplicates as _listDuplicates, fixDuplicates as _fixDuplicates, yarnDedupe as _yarnDedupe } from './index';
import { yarnLockStringify } from '@yarn-tool/yarnlock-stringify';

/**
 * 接受 Record 形式的 lockfile 輸入，序列化後委派給根目錄的 listDuplicates。
 *
 * Accepts a Record-shaped lockfile input, serialises it, then delegates to the
 * root listDuplicates.
 *
 * @deprecated 請改用套件根目錄匯出的同名函式 / use the same-named export from the package root instead
 */
export function listDuplicates(yarnlock_old: Record<string, any> | Buffer | string, options?: IOptionsDedupe): string[]
{
	return _listDuplicates(yarnLockStringify(yarnlock_old), options)
}

/**
 * 接受 Record 形式的 lockfile 輸入，序列化後委派給根目錄的 fixDuplicates。
 *
 * Accepts a Record-shaped lockfile input, serialises it, then delegates to the
 * root fixDuplicates.
 *
 * @deprecated 請改用套件根目錄匯出的同名函式 / use the same-named export from the package root instead
 */
export function fixDuplicates(yarnlock_old: Record<string, any> | Buffer | string, options?: IOptionsDedupe): string
{
	return _fixDuplicates(yarnLockStringify(yarnlock_old), options)
}

/**
 * 接受 Record 形式的 lockfile 輸入，序列化後委派給根目錄的 yarnDedupe。
 *
 * Accepts a Record-shaped lockfile input, serialises it, then delegates to the
 * root yarnDedupe.
 *
 * @deprecated 請改用套件根目錄匯出的同名函式 / use the same-named export from the package root instead
 */
export function yarnDedupe(yarnlock_old: string, options?: IOptionsDedupe)
{
	return _yarnDedupe(yarnLockStringify(yarnlock_old), options)
}

/**
 * 彙整上述已棄用函式，維持與根目錄預設匯出相同的表面。
 *
 * Groups the deprecated functions above, keeping the same surface as the root
 * default export.
 *
 * @deprecated 請改用套件根目錄的預設匯出 / use the default export from the package root instead
 */
const auto = {
	listDuplicates,
	fixDuplicates,
	yarnDedupe,
} as const

/**
 * 以已棄用的函式物件作為預設匯出。
 *
 * Default export of the deprecated function object.
 *
 * @deprecated 請改用套件根目錄的預設匯出 / use the default export from the package root instead
 */
export default auto
