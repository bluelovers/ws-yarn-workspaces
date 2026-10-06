"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertExecInstall = assertExecInstall;
const tslib_1 = require("tslib");
const err_code_1 = tslib_1.__importDefault(require("err-code"));
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
function assertExecInstall(cp) {
    /**
     * 只檢查非零：`spawn` 本身失敗時 `status` 可能為 `null`，
     * 那種情況由 `cross-spawn` 自行回報，這裡不重複處理。
     *
     * Only non-zero is checked: `status` may be null when spawn itself failed,
     * which cross-spawn already reports and is not re-handled here.
     */
    if (cp.status) {
        throw (0, err_code_1.default)(new Error(`Process finished with exit code ${cp.status}`), 'EXIT_CODE', {
            status: cp.status,
            cp,
        });
    }
    return cp;
}
//# sourceMappingURL=assertExecInstall.js.map