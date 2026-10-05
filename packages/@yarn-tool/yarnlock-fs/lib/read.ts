import { IFsYarnLockReturnType } from './types';
import { join } from "path";
import { checkAndReadYarnLockFileSafe } from './readYarnLockFile';
import { notEmpty } from './notEmpty';
import { pathExistsSync, readFileSync } from 'fs-extra';

/**
 * 由根目錄讀取 yarn.lock 的舊版實作：
 * 以 `pathExistsSync` 判斷存在性，檔案為空時 `yarnlock_old` 為 `null`。
 * 請改用 `fsYarnLockSafe`，其以「空白 = 不存在」的語意回傳一致的字串型別。
 *
 * Legacy root-based yarn.lock reader: uses `pathExistsSync` for existence and yields
 * `null` in `yarnlock_old` for an empty file. Prefer `fsYarnLockSafe`, which treats
 * "blank = missing" and keeps a consistent string type.
 *
 * @param root 專案根目錄 / project root
 * @deprecated 請改用 fsYarnLockSafe / use fsYarnLockSafe instead
 */
export function fsYarnLock(root: string): IFsYarnLockReturnType
{
	let yarnlock_file = join(root, 'yarn.lock');

	let yarnlock_exists = pathExistsSync(yarnlock_file);

	/**
	 * 只有檔案存在才讀取，且空白內容會因 `&& ... || null` 的運算子特性轉為 `null`。
	 *
	 * Read only when the file exists; blank content falls back to `null` via the
	 * `&& ... || null` operator behaviour.
	 */
	let yarnlock_old = yarnlock_exists && readFileSync(yarnlock_file, 'utf8') || null;

	return {
		yarnlock_file,
		yarnlock_exists,
		yarnlock_old,
	}
}

/**
 * 由根目錄讀取 yarn.lock 的安全版本（預設匯出）：
 * 路徑、讀取與空白判斷集中一次完成，
 * `yarnlock_exists` 代表「存在且內容非空」，與 `yarnlock_old` 的語意一致。
 *
 * Safe root-based yarn.lock reader (default export): path, read and blank check happen
 * in one place; `yarnlock_exists` means "exists and non-blank", consistent with the
 * meaning of `yarnlock_old`.
 *
 * @param root 專案根目錄 / project root
 */
export function fsYarnLockSafe(root: string): IFsYarnLockReturnType
{
	const yarnlock_file = join(root, 'yarn.lock');

	const yarnlock_old = checkAndReadYarnLockFileSafe<string>(yarnlock_file, 'utf8');

	/**
	 * 存在性由內容推導而非另查檔案系統：
	 * 讀取與判斷綁在一起可避免兩者之間檔案狀態改變造成不一致。
	 *
	 * Existence is derived from the content instead of a second filesystem probe, keeping
	 * read and check consistent even if the file changes in between.
	 */
	const yarnlock_exists = notEmpty(yarnlock_old);

	return {
		yarnlock_file,
		yarnlock_exists,
		yarnlock_old,
	}
}

export default fsYarnLockSafe;
