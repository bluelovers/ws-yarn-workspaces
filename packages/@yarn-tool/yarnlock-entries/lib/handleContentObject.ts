import { YarnLockIterator } from './YarnLockIterator';
import { IYarnLockParsedV1, IYarnLockParsedV2 } from '@yarn-tool/yarnlock-types';

/**
 * 由已解析的 yarn.lock 資料建立迭代器：
 * 抽成獨立函式是為了讓「解析」與「建立迭代器」可分開替換或測試。
 *
 * Builds an iterator from already-parsed yarn.lock data: kept as a separate function so
 * "parsing" and "building the iterator" can be replaced or tested independently.
 *
 * @param data 已解析的 v1 / v2 資料 / parsed v1 / v2 data
 */
export function handleContentObject<T extends IYarnLockParsedV1 | IYarnLockParsedV2>(data: T)
{
	return new YarnLockIterator<T>(data)
}

/**
 * `handleContentObject` 的非同步版本：
 * 以 async 函式包裝以維持與其他 Async API 一致的呼叫介面（回傳 Promise）。
 *
 * Asynchronous version of `handleContentObject`: wrapped in an async function to keep a
 * Promise based interface consistent with the other Async APIs.
 *
 * @param data 已解析的 v1 / v2 資料 / parsed v1 / v2 data
 */
export async function handleContentObjectAsync<T extends IYarnLockParsedV1 | IYarnLockParsedV2>(data: T)
{
	return handleContentObject(data)
}
