import { pathExistsSync } from 'fs-extra';
import { readFileSync } from 'fs-extra';
import { notEmpty } from './notEmpty';
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
export function checkAndReadYarnLockFileSafe<T extends IBufferOrString = Buffer>(file: string, options?: IOptionsReadFile | BufferEncoding | null,)
{
	/**
	 * 先檢查存在性再讀取：避免對不存在的路徑直接 readFileSync 拋出 ENOENT。
	 *
	 * Existence is checked before reading to avoid an ENOENT throw from reading a
	 * non-existent path directly.
	 */
	if (pathExistsSync(file))
	{
		let buf = readFileSync(file, options) as T

		/**
		 * 空白檔案視為「不存在」：
		 * 0 位元組的 yarn.lock 對後續解析沒有意義，回傳 undefined 可避免誤判為有效內容。
		 *
		 * A blank file counts as "non-existent": a zero-byte yarn.lock is useless for
		 * parsing, and returning undefined prevents mistaking it for valid content.
		 */
		if (notEmpty(buf))
		{
			return buf
		}
	}
}
