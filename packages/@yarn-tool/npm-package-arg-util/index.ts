/**
 * @fileoverview npm-package-arg utility functions for Yarn tool
 * @description npm-package-arg 工具函數，用於解析和處理 npm 套件參數
 * 
 * This module provides utility functions for parsing npm package arguments,
 * including support for various package formats like registry packages,
 * git repositories, local files, and aliases.
 * 
 * 本模組提供解析 npm 套件參數的工具函數，
 * 支援多種套件格式，包括 registry 套件、git 儲存庫、本地檔案和別名。
 */

import _npa, { AliasResult, FileResult, HostedGitResult, RegistryResult, URLResult } from 'npm-package-arg';
import { IResult, IResultType } from './lib/types';
import { assertNpaResultHasName } from './lib/assert';

// Re-export types for external usage
// 重新匯出類型供外部使用
export type { AliasResult, FileResult, RegistryResult, HostedGitResult, URLResult }
export type { IResult, IResultType }

// Re-export utility function for extracting semver from npa result
// 重新匯出從 npa 結果提取 semver 的工具函數
export { getSemverFromNpaResult } from './lib/getSemverFromNpaResult';

/**
 * Parse an npm package argument and return detailed information
 * 解析 npm 套件參數並返回詳細資訊
 * 
 * @template T - The type of result to return, extends IResult
 * @template T - 返回結果的類型，繼承自 IResult
 * 
 * @param {string} arg - The package argument to parse (e.g., "lodash@4.17.21", "@types/node@^18.0.0")
 * @param {string} arg - 要解析的套件參數（例如："lodash@4.17.21"、"@types/node@^18.0.0"）
 * 
 * @param {string} [where] - Optional base directory for resolving relative paths
 * @param {string} [where] - 可選的基礎目錄，用於解析相對路徑
 * 
 * @returns {T} The parsed result containing package information
 * @returns {T} 包含套件資訊的解析結果
 * 
 * @throws {Error} Throws if the package argument is invalid or has no name
 * @throws {Error} 如果套件參數無效或沒有名稱則拋出錯誤
 * 
 * @example
 * // Parse a simple package with version
 * // 解析帶版本號的簡單套件
 * const result = npa('lodash@4.17.21');
 * // result.name === 'lodash'
 * // result.type === 'version'
 * 
 * @example
 * // Parse a scoped package with range
 * // 解析帶版本範圍的範圍套件
 * const result = npa('@types/node@^18.0.0');
 * // result.name === '@types/node'
 * // result.type === 'range'
 * 
 * @example
 * // Parse a GitHub repository
 * // 解析 GitHub 儲存庫
 * const result = npa('user/repo#branch');
 * // result.type === 'git'
 */
export function npa<T extends IResult>(arg: string, where?: string): T
{
	// Parse the argument using npm-package-arg
	// 使用 npm-package-arg 解析參數
	const result = _npa(arg, where) as T

	// Assert that the result has a valid name
	// 斷言結果具有有效的名稱
	assertNpaResultHasName(result);

	return result
}

/**
 * Try to parse an npm package argument without throwing errors
 * 嘗試解析 npm 套件參數，不拋出錯誤
 * 
 * This is a safe wrapper around npa() that catches any errors
 * and returns undefined instead of throwing.
 * 
 * 這是 npa() 的安全包裝函數，會捕獲任何錯誤
 * 並返回 undefined 而不是拋出異常。
 * 
 * @template T - The type of result to return, extends IResult
 * @template T - 返回結果的類型，繼承自 IResult
 * 
 * @param {string} arg - The package argument to parse
 * @param {string} arg - 要解析的套件參數
 * 
 * @param {string} [where] - Optional base directory for resolving relative paths
 * @param {string} [where] - 可選的基礎目錄，用於解析相對路徑
 * 
 * @returns {T | undefined} The parsed result or undefined if parsing fails
 * @returns {T | undefined} 解析結果，如果解析失敗則返回 undefined
 * 
 * @example
 * // Valid package argument
 * // 有效的套件參數
 * const result = npaTry('lodash@4.17.21');
 * // result.name === 'lodash'
 * 
 * @example
 * // Invalid package argument
 * // 無效的套件參數
 * const result = npaTry('invalid-package-arg');
 * // result === undefined
 */
export function npaTry<T extends IResult>(arg: string, where?: string): T
{
	try
	{
		return npa(arg, where)
	}
	catch (e)
	{
		// Return undefined on error instead of throwing
		// 錯誤時返回 undefined 而不是拋出
	}
}

// Default export for convenience
// 預設匯出以方便使用
export default npa