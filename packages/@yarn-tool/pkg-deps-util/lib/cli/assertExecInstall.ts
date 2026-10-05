/**
 * 檢查安裝指令的執行結果 (Assert the result of an install command)
 *
 * 安裝失敗時若靜默忽略非零結束碼，後續會產生難以追蹤的錯誤，
 * 因此統一在此處轉成帶錯誤碼的例外。
 *
 * Silently ignoring a non-zero exit code leads to hard-to-trace failures
 * later, so the check is centralised here and turned into a coded error.
 */
import { sync as crossSpawn } from 'cross-spawn-extra';
import errcode from 'err-code';
import console from 'debug-color2';

/**
 * 檢查子行程結束碼 (Check the child process exit status)
 *
 * Throw when the subprocess did not exit successfully.
 *
 * @param cp `cross-spawn` 的執行結果 (Result returned by `cross-spawn`)
 *
 * @returns 結束碼為 0 時回傳同一個 `cp`，方便直接鏈式使用；
 * 否則拋出 `EXIT_CODE` 錯誤，錯誤物件上附有 `status` 與完整的 `cp`。
 *
 * Returns the same `cp` when the exit code is 0 for convenient chaining;
 * otherwise throws an `EXIT_CODE` error carrying `status` and the full `cp`.
 */
export function assertExecInstall<T extends Record<any, any>>(cp: T)
{
	/**
	 * 只檢查非零：`spawn` 本身失敗時 `status` 可能為 `null`，
	 * 那種情況由 `cross-spawn` 自行回報，這裡不重複處理。
	 *
	 * Only non-zero is checked: `status` may be null when spawn itself failed,
	 * which cross-spawn already reports and is not re-handled here.
	 */
	if (cp.status)
	{
		throw errcode(new Error(`Process finished with exit code ${cp.status}`), 'EXIT_CODE', {
			status: cp.status as number,
			cp,
		})
	}

	return cp;
}
