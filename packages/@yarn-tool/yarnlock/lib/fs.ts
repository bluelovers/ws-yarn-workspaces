/**
 * Created by user on 2020/6/11.
 */

/**
 * yarn.lock 檔案操作的轉出口：實作位於相依套件 @yarn-tool/yarnlock-fs，
 * 此處僅 re-export，讓使用端維持單一 import 來源（SSoT）而不必記住跨套件路徑。
 *
 * fs re-exports for yarn.lock: implementation lives in the @yarn-tool/yarnlock-fs
 * dependency; re-exported here so consumers keep a single import source (SSoT)
 * without memorising cross-package paths.
 */
import { checkAndReadYarnLockFileSafe } from '@yarn-tool/yarnlock-fs/lib/readYarnLockFile';
import { writeYarnLockFile } from '@yarn-tool/yarnlock-fs/lib/writeYarnLockFile';
import { IFsYarnLockReturnType } from '@yarn-tool/yarnlock-fs/lib/types';

/**
 * 查找並讀取 yarn.lock；以 Safe 版本呼叫是為了讓檔案不存在時回傳可判斷的結果，而非直接拋錯。
 *
 * Locates and reads yarn.lock; the Safe variant is used so a missing file yields a
 * checkable result instead of throwing.
 */
export { checkAndReadYarnLockFileSafe }

/**
 * 寫入 yarn.lock 內容，供去重等流程回寫處理結果。
 *
 * Writes yarn.lock content so flows such as dedupe can persist their results.
 */
export { writeYarnLockFile }

/**
 * checkAndReadYarnLockFileSafe / writeYarnLockFile 的回傳型別，供呼叫端描述快取狀態。
 *
 * Return type of checkAndReadYarnLockFileSafe / writeYarnLockFile, used by callers
 * to describe the cache state.
 */
export type { IFsYarnLockReturnType }
