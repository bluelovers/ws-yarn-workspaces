"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yargsProcessExit = yargsProcessExit;
/**
 * 以 yargs 的方式輸出錯誤訊息並結束程序
 * Print an error message in yargs style and exit the process
 *
 * 一般字串會先包裝成 Error，再交由 yargs.exit() 與 process.exit() 接力結束，
 * 確保 CLI 回傳的結束代碼 (Exit code) 與錯誤訊息一致
 * A plain string is first wrapped into an Error, then handed to yargs.exit() and process.exit() in turn,
 * so the CLI's exit code and error message stay consistent
 *
 * @param {string | Error} msg - 要輸出的錯誤訊息 / Error message to print
 * @param {number} [code=1] - 結束代碼 / Exit code
 */
function yargsProcessExit(msg, code = 1) {
    /**
     * 只有非 Error 輸入才需要包裝並補上 code：
     * 保留呼叫端傳入的 Error（其 code 屬性不被覆寫）
     * Only non-Error input needs wrapping and a code assignment:
     * an Error passed by the caller keeps its own code property
     */
    if (!(msg instanceof Error)) {
        msg = new Error(msg);
        // @ts-ignore
        msg.code = code;
    }
    /**
     * 先以 console.error 輸出訊息（stderr），
     * 再由 yargs.exit() 依其慣例處理，最後以 process.exit() 確保程序真正結束
     * Print via console.error (stderr) first, then let yargs.exit() handle it by convention,
     * and finally call process.exit() to guarantee the process terminates
     */
    console.error(msg.message);
    require('yargs').exit(code, msg);
    process.exit(code);
}
//# sourceMappingURL=index.js.map