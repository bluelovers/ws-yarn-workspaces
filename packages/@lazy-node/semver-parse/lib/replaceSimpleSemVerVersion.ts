/**
 * @lazy-node/semver-parse 版本替換器
 * Version replacer for @lazy-node/semver-parse
 *
 * 此模組提供 semver 版本替換功能
 * This module provides semver version replacement functionality
 *
 * **注意：此函數僅支援單一版本範圍，不支援多個版本範圍組合（如 `>=1.0.0 <2.0.0` 或 `^1.0.0 || ^2.0.0`）。**
 * **Note: This function only supports single version range, not multiple version range combinations (e.g., `>=1.0.0 <2.0.0` or `^1.0.0 || ^2.0.0`).**
 *
 * 若需解析多個版本範圍組合，請使用 `parseSimpleSemVerRange` 函數。
 * For parsing multiple version range combinations, use the `parseSimpleSemVerRange` function.
 *
 * @packageDocumentation
 */

import { ISimpleSemVer, ISimpleSemVerObject } from './types';
import { parseSimpleSemVer } from './parseSimpleSemVer';
import { assertSimpleSemVerObjectOrOperatorLike } from './checker';

/**
 * 替換 SimpleSemVer 物件的版本部分
 * Replace the version part of a SimpleSemVer object
 *
 * 保留原始 semver 物件的運算子，僅替換版本部分。
 * 這在需要更新版本號但保持相同範圍運算子時非常有用。
 *
 * Preserves the operator of the original semver object, only replacing the version part.
 * This is useful when you need to update the version number but keep the same range operator.
 *
 * @param {string | ISimpleSemVer} oldSemVer - 原始 semver 字串或物件 / Original semver string or object
 * @param {string} new_version - 新的版本字串 / New version string
 * @returns {IToSimpleSemVerObject<SimpleSemVer<IToSimpleSemVerObject<ISimpleSemVerObject>>>} 新的 SimpleSemVer 物件 / New SimpleSemVer object
 * @throws {TypeError} 當 oldSemVer 不是有效的 semver 時 / When oldSemVer is not a valid semver
 *
 * @example
 * ```typescript
 * // 從字串替換 / Replace from string
 * replaceSimpleSemVerVersion('>=1.2.3', '2.0.0');
 * // => SimpleSemVer { operator: '>=', major: '2', minor: '0', patch: '0' }
 *
 * // 從物件替換 / Replace from object
 * const oldVersion = parseSimpleSemVer('^1.0.0-beta.1');
 * replaceSimpleSemVerVersion(oldVersion, '2.3.4');
 * // => SimpleSemVer { operator: '^', major: '2', minor: '3', patch: '4' }
 *
 * // 保留運算子 / Preserves operator
 * replaceSimpleSemVerVersion('||', '1.0.0');
 * // => SimpleSemVer { operator: '||', major: '1', minor: '0', patch: '0' }
 * ```
 */
export function replaceSimpleSemVerVersion(oldSemVer: string | ISimpleSemVer, new_version: string)
{
	// 如果輸入是字串，先解析為 semver 物件
	// If input is a string, parse it to semver object first
	if (typeof oldSemVer === 'string')
	{
		oldSemVer = parseSimpleSemVer(oldSemVer);
	}

	// 斷言 oldSemVer 是有效的 semver 物件或運算子
	// Assert oldSemVer is a valid semver object or operator
	assertSimpleSemVerObjectOrOperatorLike(oldSemVer);

	// 保留原始運算子
	// Preserve original operator
	const operator = oldSemVer.operator;

	// 解析新版本字串
	// Parse new version string
	const obj = parseSimpleSemVer(new_version);

	// 將原始運算子附加到新物件
	// Attach original operator to new object
	// @ts-ignore
	obj.operator = operator;

	return obj
}
