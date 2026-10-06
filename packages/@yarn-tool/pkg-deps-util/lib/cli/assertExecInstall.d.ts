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
export declare function assertExecInstall<T extends Record<any, any>>(cp: T): T;
