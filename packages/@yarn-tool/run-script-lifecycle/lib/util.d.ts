/**
 * Created by user on 2020/4/9.
 */
import { IRunLifecycleScriptOptions, IResultNotExists, IResult, IPackageJson2 } from './types';
/**
 * 格式化腳本執行結果輸出
 * Format script execution result output
 *
 * @param {IResult} result - 腳本執行結果 (Script execution result)
 * @returns {string} 格式化後的輸出字串 (Formatted output string)
 * @example
 * const output = formatOutput(result);
 * // 輸出格式 (Output format):
 * // > pkg-name@1.0.0 install
 * // > npm run build
 * // ... stdout content ...
 */
export declare function formatOutput(result: IResult): string;
/**
 * 設定預設選項
 * Set default options
 *
 * @param {IRunLifecycleScriptOptions} options - 原始選項 (Original options)
 * @returns {IRunLifecycleScriptOptions} 合併預設值後的選項 (Options with merged defaults)
 * @description 合併使用者選項與預設值，確保必要的配置存在
 *              Merges user options with defaults to ensure required configurations exist
 *
 * @example
 * const opts = _options({ event: 'install', path: '/path/to/pkg' });
 * // 返回包含預設 stdio: 'inherit' 的完整選項
 * // Returns complete options with default stdio: 'inherit'
 */
export declare function _options(options: IRunLifecycleScriptOptions): IRunLifecycleScriptOptions;
/**
 * 執行腳本並處理結果的鉤子函數
 * Hook function for executing scripts and handling results
 *
 * @param {IRunLifecycleScriptOptions} options - 執行選項 (Execution options)
 * @param {Function} [fn=runScript] - 執行腳本的函數 (Function to run the script)
 * @returns {Promise<IResultNotExists | IResult>} 執行結果 Promise (Execution result promise)
 * @description 執行腳本並統一處理成功與失敗的情況，確保 stdio 配置正確傳遞
 *              Executes script and uniformly handles success and failure cases,
 *              ensuring stdio configuration is correctly passed
 */
export declare function _hook(options: IRunLifecycleScriptOptions, fn?: any): Promise<IResultNotExists | IResult>;
/**
 * 執行生命週期腳本的核心函數
 * Core function for running lifecycle scripts
 *
 * @param {IRunLifecycleScriptOptions} options - 執行選項 (Execution options)
 * @param {Function} [fn] - 執行腳本的函數 (Function to run the script)
 * @returns {Promise<IResultNotExists | IResult>} 執行結果 Promise (Execution result promise)
 * @description 結合 _options 和 _hook 來執行生命週期腳本
 *              Combines _options and _hook to run lifecycle scripts
 *
 * @example
 * const result = await runLifecycleScriptCore({
 *   event: 'install',
 *   path: '/path/to/package'
 * });
 */
export declare function runLifecycleScriptCore(options: IRunLifecycleScriptOptions, fn?: any): Promise<IResultNotExists | IResult>;
/**
 * 執行多個生命週期腳本
 * Run multiple lifecycle scripts
 *
 * @param {Object} options - 執行選項 (Execution options)
 * @param {IRunLifecycleScriptOptions} options.tmpOptions - 執行腳本的選項 (Options for running scripts)
 * @param {string[]} options.eventList - 要執行的事件列表 (List of events to run)
 * @param {IPackageJson2} options.pkg - 套件的 package.json 物件 (Package's package.json object)
 * @returns {Promise<(IResultNotExists | IResult)[]>} 所有執行結果的陣列 (Array of all execution results)
 * @description 依序執行指定的事件列表中的腳本，只執行在 package.json scripts 中存在的事件
 *              Sequentially executes scripts in the specified event list,
 *              only running events that exist in package.json scripts
 *
 * @example
 * const results = await runLifecycleScriptList({
 *   tmpOptions: { path: '/path/to/pkg', stdio: 'inherit' },
 *   eventList: ['preinstall', 'postinstall'],
 *   pkg: packageJson
 * });
 */
export declare function runLifecycleScriptList(options: {
    tmpOptions: IRunLifecycleScriptOptions;
    eventList: string[];
    pkg: IPackageJson2;
}): Promise<(IResultNotExists | IResult)[]>;
