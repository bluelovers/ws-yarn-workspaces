/**
 * @lazy-node/semver-parse 版本字串化器
 * Version stringifier for @lazy-node/semver-parse
 *
 * 此模組提供 semver 物件轉換為字串的功能
 * This module provides functionality to convert semver objects to strings
 *
 * @packageDocumentation
 */

import { IOptionsSimpleSemVerStringify, ISimpleSemVerObject } from './types';
import { EnumVersionExtra } from './const';
import SimpleSemVer from './SimpleSemVer';
import { assertSimpleSemVerOperatorLike, assertSimpleSemVerObjectLike } from './checker';

/**
 * 將 semver 物件轉換為版本字串
 * Convert a semver object to a version string
 *
 * 將 SimpleSemVer 物件轉換為標準版本字串格式。
 * 不包含運算子，僅返回版本部分。
 *
 * Converts a SimpleSemVer object to standard version string format.
 * Does not include operator, returns only the version part.
 *
 * @param {ISimpleSemVerObject | SimpleSemVer} obj - semver 物件 / Semver object
 * @returns {string} 版本字串 / Version string
 * @throws {TypeError} 當物件不是有效的版本物件時 / When object is not a valid version object
 *
 * @example
 * ```typescript
 * stringifySimpleSemVer({ major: '1', minor: '2', patch: '3' });
 * // => '1.2.3'
 *
 * stringifySimpleSemVer({ major: '1', minor: '0', patch: '0', release: 'beta.1' });
 * // => '1.0.0-beta.1'
 *
 * stringifySimpleSemVer({ major: '1', minor: '0', patch: '0', build: 'build.123' });
 * // => '1.0.0+build.123'
 *
 * stringifySimpleSemVer({ major: '1', minor: '0', patch: '0', release: 'beta.1', build: 'build.123' });
 * // => '1.0.0-beta.1+build.123'
 *
 * // 缺少的版本部分會以 '0' 填充 / Missing version parts are filled with '0'
 * stringifySimpleSemVer({ major: '1' });
 * // => '1.0.0'
 * ```
 */
export function stringifySimpleSemVer(obj: ISimpleSemVerObject | SimpleSemVer, options?: IOptionsSimpleSemVerStringify)
{
	// 斷言物件為有效的版本物件
	// Assert object is a valid version object
	assertSimpleSemVerObjectLike(obj);

	let str = '';

	// 組合主版本號 / Compose major version
	str += obj.major ?? '0';
	str += '.';
	// 組合次版本號 / Compose minor version
	str += obj.minor ?? '0';
	str += '.';
	// 組合修補版本號 / Compose patch version
	str += obj.patch ?? '0';

	if (!options?.removeRelease)
	{
		// 添加預發布標籤 / Add pre-release tag
		if (obj.release?.length > 0)
		{
			str += EnumVersionExtra.release + obj.release;
		}

		// 添加建置元資料 / Add build metadata
		if (!options?.removeBuild && obj.build?.length > 0)
		{
			str += EnumVersionExtra.build + obj.build;
		}
	}

	return str;
}

/**
 * 將 semver 物件轉換為完整版本字串（含運算子）
 * Convert a semver object to full version string (with operator)
 *
 * 將 SimpleSemVer 物件轉換為包含運算子的完整版本字串。
 *
 * Converts a SimpleSemVer object to full version string including operator.
 *
 * @param {ISimpleSemVerObject | SimpleSemVer} obj - semver 物件 / Semver object
 * @returns {string} 完整版本字串 / Full version string
 *
 * @example
 * ```typescript
 * stringifySemverFull({ operator: '>=', major: '1', minor: '2', patch: '3' });
 * // => '>=1.2.3'
 *
 * stringifySemverFull({ operator: '^', major: '1', minor: '0', patch: '0', release: 'beta.1' });
 * // => '^1.0.0-beta.1'
 *
 * stringifySemverFull({ major: '1', minor: '0', patch: '0' });
 * // => '1.0.0' (無運算子 / No operator)
 * ```
 */
export function stringifySemverFull(obj: ISimpleSemVerObject | SimpleSemVer)
{
	return (obj.operator ?? '') + stringifySimpleSemVer(obj)
}

export default stringifySimpleSemVer
