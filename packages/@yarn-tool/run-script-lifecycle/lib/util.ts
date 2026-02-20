/**
 * Created by user on 2020/4/9.
 */

/**
 * 生命週期腳本執行工具函數
 * Utility functions for lifecycle script execution
 *
 * @module @yarn-tool/run-script-lifecycle/lib/util
 * @description 提供執行 npm/yarn 生命週期腳本的輔助函數
 *              Provides helper functions for running npm/yarn lifecycle scripts
 */

import runScript from '@npmcli/run-script';
import runScriptPkg from '@npmcli/run-script/lib/run-script-pkg';

import { IRunLifecycleScriptOptions, IResultNotExists, IResult, IError, IPackageJson2 } from './types';

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
export function formatOutput(result: IResult)
{
	return `> ${result.pkgid} ${result.event}\n> ${result.script}\n${result.stdout}`
}

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
export function _options(options: IRunLifecycleScriptOptions): IRunLifecycleScriptOptions
{
	return {
		args: [],
		//stdioString: true,
		...options,
		stdio: 'inherit',
	}
}

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
export function _hook(options: IRunLifecycleScriptOptions, fn = runScript): Promise<IResultNotExists | IResult>
{
	return fn(options)
		.then((result: IResult) =>
		{
			result.stdio = options.stdio;
			return result
		})
		.catch((e: IError) =>
		{
			e.stdio = options.stdio;
			return Promise.reject(e)
		})
		;
}

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
export function runLifecycleScriptCore(options: IRunLifecycleScriptOptions, fn?)
{
	return _hook(_options(options), fn);
}

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
export async function runLifecycleScriptList(options: {
	tmpOptions: IRunLifecycleScriptOptions,
	eventList: string[],
	pkg: IPackageJson2,
})
{
	const { tmpOptions, eventList, pkg } = options;

	/**
	 * 儲存所有執行結果的陣列
	 * Array storing all execution results
	 */
	const results: (IResultNotExists | IResult)[] = [];

	if (pkg.scripts)
	{
		// 遍歷事件列表，執行存在於 package.json scripts 中的腳本
		// Iterate through event list, run scripts that exist in package.json scripts
		for (const event of eventList)
		{
			// 檢查腳本是否存在於 package.json 的 scripts 區段
			// Check if script exists in package.json scripts section
			if (event in pkg.scripts)
			{
				let result = await _hook({
					...tmpOptions,
					event,
					pkg,
				}, runScriptPkg);

				results.push(result as any)
			}
		}
	}

	return results
}
