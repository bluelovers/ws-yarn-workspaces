import { otherScriptNames, defaultNpmScriptsOrder, omitKey } from './util';
import type { ISortPackageJsonScriptsOptions, ISortPackageJsonScriptsOptionsRequired } from './types';

/**
 * 處理排序選項，回傳包含所有必要欄位的選項物件
 * Handle sorting options, return options object with all required fields
 *
 * 此函式負責：
 * 1. 處理可選的選項參數
 * 2. 為未指定的選項填入預設值
 * 3. 回傳完整的必需選項類型
 *
 * @param opts - 可選的排序選項
 * @returns 完整的排序選項物件（包含所有預設值）
 *
 * @example
 * const options = handleOptions({
 *   otherScriptNames: ['prettier'],
 *   defaultNpmScriptsOrder: ['build', 'test'],
 * });
 */
export function handleOptions(opts?: ISortPackageJsonScriptsOptions): ISortPackageJsonScriptsOptionsRequired
{
	return {
		/**
		 * 展開可選參數（如果存在）
		 * Spread optional parameters (if exist)
		 */
		...(opts ?? {}),
		/**
		 * 其他腳本名稱 - 預設值來自 util 模組
		 * Other script names - default value from util module
		 */
		otherScriptNames: opts?.otherScriptNames ?? otherScriptNames,
		/**
		 * NPM 腳本順序 - 預設值來自 util 模組
		 * NPM scripts order - default value from util module
		 */
		defaultNpmScriptsOrder: opts?.defaultNpmScriptsOrder ?? defaultNpmScriptsOrder,
		/**
		 * 鍵值提取函式 - 預設值為 omitKey 函式
		 * Key extraction function - default is omitKey function
		 */
		omitKeyFn: opts?.omitKeyFn ?? omitKey,
		/**
		 * 自定義排序函式 - 如果未提供則為 undefined
		 * Custom sort function - undefined if not provided
		 */
		sortKeyFn: opts?.sortKeyFn,
	}
}

export default handleOptions
