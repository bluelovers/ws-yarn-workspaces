/**
 * 公眾 API 匯出層：把迭代器、內容／檔案來源函式與型別集中匯出，
 * 讓使用端從單一入口即可建立 yarn.lock 條目迭代器（SSoT）。
 *
 * Public API barrel: gathers the iterator, content/file sources and types so consumers
 * build yarn.lock entry iterators from a single entry point (SSoT).
 */
import { YarnLockIterator } from './lib/YarnLockIterator';
import { fromContentAsync, fromContent } from './lib/fromContent';
import { fromFileAsync, fromFile } from './lib/fromFile';
export * from './lib/types';
/**
 * 內容來源的同步／非同步版本一起匯出，
 * 讓呼叫端可依呼叫情境（同步腳本或 async 流程）選擇，而不必改用不同入口。
 *
 * Both sync and async content sources are exported so callers pick per calling context
 * (sync script or async flow) without switching entry points.
 */
export { fromContentAsync, fromContent };
/**
 * 檔案來源的同步／非同步版本，理由同上。
 *
 * File sources in sync and async flavours, for the same reason as above.
 */
export { fromFileAsync, fromFile };
export { YarnLockIterator };
/**
 * 預設匯出 `fromContent`，讓「拿到字串就解析」成為最常見用法的捷徑。
 *
 * Default-exports `fromContent` as the shortcut for the common "string in, entries out" use.
 */
export default fromContent;
