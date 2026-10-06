/**
 * 公眾 API 匯出層：集中匯出 yarn.lock 的讀取、寫入與回傳型別，
 * 讓使用端從單一入口完成檔案操作（SSoT）。
 *
 * Public API barrel: gathers yarn.lock read, write and return types so consumers finish
 * file operations from a single entry point (SSoT).
 */
import { checkAndReadYarnLockFileSafe } from './lib/readYarnLockFile';
import { writeYarnLockFile } from './lib/writeYarnLockFile';
import { IFsYarnLockReturnType } from './lib/types';
import { fsYarnLockSafe } from './lib/read';
/**
 * 指定路徑的安全讀取：不存在或空白內容回傳 undefined 而非拋錯，
 * 讓「有沒有 yarn.lock」成為可分支判斷的資料而非例外。
 *
 * Safe read by path: returns undefined instead of throwing when missing or empty, turning
 * "has yarn.lock or not" into branchable data rather than an exception.
 */
export { checkAndReadYarnLockFileSafe };
/**
 * 寫入 yarn.lock：序列化後一次寫入，供去重等流程回寫結果。
 *
 * Writes yarn.lock: serializes then writes in one call, letting flows such as dedupe
 * persist results.
 */
export { writeYarnLockFile };
/**
 * 讀取結果的統一型別，供各流程描述 yarn.lock 的路徑、存在狀態與原始內容。
 *
 * Unified read-result type so flows can describe the path, existence and raw content of
 * yarn.lock.
 */
export type { IFsYarnLockReturnType };
/**
 * 由專案根目錄讀取的入口，也是本套件的預設匯出。
 *
 * Entry point reading from a project root; also the default export of this package.
 */
export { fsYarnLockSafe };
/**
 * 預設匯出 `fsYarnLockSafe`，讓「根目錄 → 讀取結果」成為最常見用法的捷徑。
 *
 * Default-exports `fsYarnLockSafe` as the shortcut for the common "root → read result" use.
 */
export default fsYarnLockSafe;
