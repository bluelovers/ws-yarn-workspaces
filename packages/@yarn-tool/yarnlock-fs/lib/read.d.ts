import { IFsYarnLockReturnType } from './types';
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
export declare function fsYarnLock(root: string): IFsYarnLockReturnType;
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
export declare function fsYarnLockSafe(root: string): IFsYarnLockReturnType;
export default fsYarnLockSafe;
