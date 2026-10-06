import { IYarnLockUpdate } from './types';
/**
 * 更新 yarn.lock（v1 與 Berry）中的 `tag` 與 `npm:` 別名 (alias) 項目，
 * 回傳新舊 lockfile 內容與差異報告；不直接寫入磁碟。
 *
 * Updates `tag` and `npm:` alias entries in a yarn.lock (v1 and Berry),
 * returning the old/new lockfile content and a diff report without touching
 * the disk.
 *
 * @param yarnlock_old 原始 lockfile 內容 / the original lockfile content
 * @returns 標準化的新舊內容、是否改變與更新報告 /
 * normalised old/new content, whether it changed, and the update report
 */
export declare function updateYarnLockTag(yarnlock_old: Buffer | string): Promise<IYarnLockUpdate>;
