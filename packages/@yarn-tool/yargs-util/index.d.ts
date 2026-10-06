/**
 * @yarn-tool/yargs-util
 *
 * yargs 參數處理的實用工具，提供 Argv 型別解包與程序結束處理
 * Utilities for yargs argument handling, providing Argv type unpacking and process exit handling
 *
 * @packageDocumentation
 */
import { Argv } from 'yargs';
/**
 * 從 yargs 的 Argv 型別解包出參數物件的型別
 * Unpack the arguments object type from a yargs Argv type
 *
 * yargs 的 option() 會以泛型逐步收斂參數型別，此工具讓呼叫端
 * 只需傳入任一階段的 Argv 即可取得最終的參數形狀
 * yargs narrows argument types progressively via generics; this helper lets
 * callers pass any stage of Argv and obtain the final argument shape
 *
 * @template T - 來源 Argv 型別 / Source Argv type
 * @template D - 無法解包時的後備型別 / Fallback type when unpacking fails
 *
 * 無法解包時回傳 D（預設 any），避免型別錯誤中斷編譯
 * Returns D (any by default) when unpacking fails, so type errors do not break compilation
 */
export type IUnpackYargsArgv<T extends Argv, D = any> = T extends Argv<infer U> ? U : D;
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
export declare function yargsProcessExit(msg: string | Error, code?: number): void;
