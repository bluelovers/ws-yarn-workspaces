import { ObjectEncodingOptions } from "fs";

/**
 * 讀取結果的可能形狀：Buffer 或字串，
 * 依 readFileSync 是否傳入 encoding 決定。
 *
 * Possible shapes of a read result: Buffer or string, depending on whether an encoding
 * was passed to readFileSync.
 */
export type IBufferOrString = Buffer | string;

/**
 * 讀取 yarn.lock 檔案的選項，沿用 fs 的 ObjectEncodingOptions 並允許自訂 flag。
 *
 * Options for reading a yarn.lock file; extends fs's ObjectEncodingOptions and allows a
 * custom flag.
 */
export interface IOptionsReadFile extends ObjectEncodingOptions
{
	/**
	 * 檔案開啟模式（如 `r` / `rs`）
	 */
	flag?: string;
}

/**
 * yarn.lock 讀取結果：以單一形狀回傳路徑、是否存在與原始內容，
 * 讓呼叫端不必個別處理各種讀取分支。
 *
 * Read result of yarn.lock: reports path, existence and raw content in one shape so
 * callers need not handle each read branch individually.
 */
export interface IFsYarnLockReturnType
{
	/**
	 * yarn.lock 的完整路徑
	 */
	yarnlock_file: string;
	/**
	 * 檔案是否存在且內容非空
	 */
	yarnlock_exists: boolean;
	/**
	 * 讀取到的原始內容
	 */
	yarnlock_old: string;
}
