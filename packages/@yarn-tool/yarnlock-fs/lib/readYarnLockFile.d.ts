import { IBufferOrString, IOptionsReadFile } from './types';
/**
 * 讀取指定路徑的 yarn.lock：檔案不存在或內容空白時回傳 undefined，
 * 讓呼叫端以「有沒有資料」分支，而不必自行 try/catch 讀取例外。
 *
 * Reads the yarn.lock at a path: returns undefined when the file is missing or blank so
 * callers branch on "has data or not" instead of try/catching read errors.
 *
 * @param file yarn.lock 檔案路徑 / path of the yarn.lock file
 * @param options 傳給 readFileSync 的讀取選項 / options passed to readFileSync
 * @returns 檔案內容，失敗時為 undefined / file content, or undefined when unavailable
 */
export declare function checkAndReadYarnLockFileSafe<T extends IBufferOrString = Buffer>(file: string, options?: IOptionsReadFile | BufferEncoding | null): T;
