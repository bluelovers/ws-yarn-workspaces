/**
 * 組合驗證結果並計算有效性旗標
 * Combine validation results and compute the validity flags
 *
 * @module @yarn-tool/validate-npm-package-name/lib/handleResult
 */
import { IResult } from './types';
/**
 * 依 warnings 與 errors 產生最終驗證結果
 * Produce the final validation result from warnings and errors
 *
 * `validForNewPackages` 要求完全沒有警告與錯誤，
 * `validForOldPackages` 只排除錯誤——這正是區分「新名稱」與「舊名稱」的方式。
 * `validForNewPackages` requires both warnings and errors to be empty,
 * while `validForOldPackages` only excludes errors — this is what separates "new name" from "legacy name".
 *
 * @param {string[]} warnings - 警告訊息 / Warning messages
 * @param {string[]} errors - 錯誤訊息 / Error messages
 * @returns {IResult} 驗證結果；空陣列會被移除以免佔用回傳物件 / Validation result; empty arrays are dropped to keep the payload small
 */
export declare function handleResult(warnings: string[], errors: string[]): IResult;
