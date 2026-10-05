import { PathLike, readFileSync } from "fs";
import { fromContent } from './fromContent';
import { IYarnLockParsedV1, IYarnLockParsedV2 } from '@yarn-tool/yarnlock-types';

/**
 * 讀取 yarn.lock 檔案並建立條目迭代器。
 * 以同步 `readFileSync` 讀取是為了與 `fromFileAsync` 共用同一條解析路徑，
 * 讀取後的處理完全委由 `fromContent`。
 *
 * Reads a yarn.lock file and builds the entry iterator.
 * A synchronous `readFileSync` is used so both variants share one parsing path with
 * `fromFileAsync`; post-read handling is fully delegated to `fromContent`.
 *
 * @param yarnlock_file yarn.lock 檔案路徑 / path of the yarn.lock file
 */
export function fromFile<T extends IYarnLockParsedV1 | IYarnLockParsedV2>(yarnlock_file: PathLike)
{
	return fromContent<T>(readFileSync(yarnlock_file))
}

/**
 * `fromFile` 的非同步版本：
 * 以 async 函式包裝以維持與其他 Async API 一致的呼叫介面（回傳 Promise）。
 *
 * Asynchronous version of `fromFile`: wrapped in an async function to keep a Promise
 * based interface consistent with the other Async APIs.
 *
 * @param yarnlock_file yarn.lock 檔案路徑 / path of the yarn.lock file
 */
export async function fromFileAsync<T extends IYarnLockParsedV1 | IYarnLockParsedV2>(yarnlock_file: PathLike)
{
	return fromFile<T>(yarnlock_file)
}
