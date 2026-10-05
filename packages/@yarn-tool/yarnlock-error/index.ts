
/**
 * @yarn-tool/yarnlock-error 的唯一入口：集中提供 yarn.lock 版本偵測失敗時的錯誤工廠，
 * 讓各套件對同一情況拋出一致的 TypeError 與訊息（SSoT）。
 *
 * Sole entry of @yarn-tool/yarnlock-error: provides the error factory used when yarn.lock
 * version detection fails, so every package throws a consistent TypeError with one
 * shared message (SSoT).
 */

/**
 * 建立「無法偵測 yarn.lock 版本」的錯誤：
 * 以 TypeError 而非一般 Error，是因為這類失敗多源自傳入資料的型別／結構不符合預期，
 * TypeError 能讓除錯時更快定位問題來源。
 *
 * Creates the "cannot detect yarn.lock version" error: a TypeError rather than a plain
 * Error because such failures usually come from data whose type/structure does not match
 * expectations, making the origin easier to pinpoint while debugging.
 *
 * @param msg 自訂錯誤訊息；省略或為 null / undefined 時使用預設訊息
 *            custom message; falls back to the default when omitted or null / undefined
 * @returns 建立的 TypeError / the created TypeError
 * @example ```
 throw newYarnLockParsedVersionError('current object not v1 yarnlock');
 ```
 */
export function newYarnLockParsedVersionError(msg?: string)
{
	/**
	 * 以 `??` 只替換 null / undefined：空字串代表呼叫端刻意提供的訊息，應予保留。
	 *
	 * `??` replaces only null / undefined: an empty string is a deliberately provided
	 * message and must be preserved.
	 */
	return new TypeError(msg ?? 'can\'t detect yarn.lock version')
}

/**
 * 預設匯出錯誤工廠，讓 `import newYarnLockParsedVersionError from` 即可直接使用。
 *
 * Default-exports the error factory so `import newYarnLockParsedVersionError from` works
 * out of the box.
 */
export default newYarnLockParsedVersionError;
