/**
 * Created by user on 2020/4/8.
 */
import { IRunLifecycleScriptOptions, IResult, IResultNotExists } from './lib/types';
/**
 * 執行生命週期腳本
 * Run lifecycle script
 *
 * @async
 * @function runLifecycleScript
 * @param {IRunLifecycleScriptOptions} options - 執行選項 (Execution options)
 * @returns {Promise<(IResultNotExists | IResult)[]>} 執行結果陣列 (Array of execution results)
 * @description 執行指定的生命週期腳本，自動處理前置 (pre) 和後置 (post) 腳本
 *              Executes the specified lifecycle script, automatically handling pre and post scripts
 *
 * 執行順序 (Execution order):
 * 1. 前置腳本 (pre-scripts)，如 preinstall
 * 2. 主要腳本 (main script)，如 install
 * 3. 後置腳本 (post-scripts)，如 postinstall
 *
 * @example
 * // 執行 build 生命週期腳本
 * // Run build lifecycle script
 * const results = await runLifecycleScript({
 *   event: 'build',
 *   path: '/path/to/package',
 *   stdio: 'inherit'
 * });
 *
 * // 檢查執行結果
 * // Check execution results
 * results.forEach(result => {
 *   if (result.code === 0) {
 *     console.log(`${result.event} completed successfully`);
 *   }
 * });
 *
 * @throws {IError} 當腳本執行失敗時拋出錯誤 (Throws error when script execution fails)
 */
export declare function runLifecycleScript(options: IRunLifecycleScriptOptions): Promise<(IResult | IResultNotExists)[]>;
export default runLifecycleScript;
