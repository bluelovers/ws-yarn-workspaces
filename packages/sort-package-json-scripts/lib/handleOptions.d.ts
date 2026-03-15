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
export declare function handleOptions(opts?: ISortPackageJsonScriptsOptions): ISortPackageJsonScriptsOptionsRequired;
export default handleOptions;
