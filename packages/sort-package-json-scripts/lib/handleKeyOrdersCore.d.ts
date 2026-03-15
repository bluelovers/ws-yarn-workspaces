import type { ISortPackageJsonScriptsOptions, ISortPackageJsonScriptsOptionsRequired } from './types';
/**
 * 處理腳本鍵值順序的核心函式
 * Core function for handling script key ordering
 *
 * 此函式負責將腳本名稱按照 npm 生命週期順序進行排序和分組。
 * 排序邏輯：
 * 1. 首先檢查完整名稱是否為 npm 內建腳本
 * 2. 接著檢查去除前綴（如 pre/post）的名稱是否為內建腳本
 * 3. 然後檢查是否為其他腳本（otherScriptNames）
 * 4. 最後處理帶有前綴的腳本（如 prepublish、postinstall 等）
 *
 * 排序結果會確保相關的腳本（pretest、test、posttest）按順序排列。
 *
 * @param names - 要排序的腳本名稱陣列
 * @param opts - 排序選項，包含 otherScriptNames、defaultNpmScriptsOrder、omitKeyFn、sortKeyFn
 * @returns 排序後的腳本名稱陣列
 *
 * @example
 * handleKeyOrdersCore(['test', 'pretest', 'posttest', 'build'], opts)
 * // 返回: ['pretest', 'test', 'posttest', 'build']
 */
export declare function handleKeyOrdersCore(names: string[], { otherScriptNames, defaultNpmScriptsOrder, omitKeyFn, sortKeyFn, }: ISortPackageJsonScriptsOptions | ISortPackageJsonScriptsOptionsRequired): string[];
export default handleKeyOrdersCore;
