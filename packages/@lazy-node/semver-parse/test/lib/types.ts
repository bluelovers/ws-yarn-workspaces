/**
 * @lazy-node/semver-parse 測試類型定義
 * Test type definitions for @lazy-node/semver-parse
 *
 * 此模組定義了測試 fixtures 的類型
 * This module defines types for test fixtures
 *
 * @packageDocumentation
 */

import { ISimpleSemVer, ISimpleSemVerObject, ISimpleSemVerObjectBase } from "../../lib/types";

/**
 * 測試 fixtures 項目核心介面
 * Core interface for test fixture entries
 *
 * 定義測試案例的基本結構
 * Defines the basic structure of test cases
 *
 * @template T - 預期結果的類型 / Type of expected result
 *
 * @property {string} input - 輸入字串 / Input string
 * @property {string} [description] - 測試案例描述 / Test case description
 * @property {T} [expected] - 預期結果 / Expected result
 * @property {string} [reason] - 測試原因或說明 / Test reason or explanation
 */
export interface IFixturesEntryCore<T>
{
	/** 輸入字串 / Input string */
	input: string;
	/** 測試案例描述 / Test case description */
	description?: string;
	/** 預期結果 / Expected result */
	expected?: T;
	/** 測試原因或說明 / Test reason or explanation */
	reason?: string;
}

/**
 * 多版本範圍測試 fixtures 項目介面
 * Multiple version range test fixture entry interface
 *
 * 用於測試支援多個版本範圍組合的函數（如 parseRange）
 * Used for testing functions that support multiple version range combinations (e.g., parseRange)
 *
 * @example
 * ```typescript
 * const fixture: IFixturesEntryMultipleVersionRange = {
 *   input: '>=1.0.0 <2.0.0',
 *   expected: [
 *     { operator: '>=', major: '1', minor: '0', patch: '0' },
 *     { operator: '<', major: '2', minor: '0', patch: '0' }
 *   ]
 * };
 * ```
 */
export interface IFixturesEntryMultipleVersionRange extends IFixturesEntryCore<Partial<ISimpleSemVerObjectBase>[]>
{

}

/**
 * 單一版本範圍測試 fixtures 項目介面
 * Single version range test fixture entry interface
 *
 * 用於測試僅支援單一版本範圍的函數（如 parse）
 * Used for testing functions that only support single version range (e.g., parse)
 *
 * @example
 * ```typescript
 * const fixture: IFixturesEntrySingleVersionRange = {
 *   input: '>=1.2.3-beta.1',
 *   expected: {
 *     operator: '>=',
 *     major: '1',
 *     minor: '2',
 *     patch: '3',
 *     release: 'beta.1'
 *   }
 * };
 * ```
 */
export interface IFixturesEntrySingleVersionRange extends IFixturesEntryCore<Partial<ISimpleSemVerObjectBase>>
{

}
