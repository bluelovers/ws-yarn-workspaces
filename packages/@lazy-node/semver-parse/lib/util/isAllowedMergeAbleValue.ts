/**
 * @lazy-node/semver-parse 合併值驗證工具
 * Merge value validation utility for @lazy-node/semver-parse
 *
 * 此模組提供驗證 semver 值是否允許合併的功能
 * This module provides functionality to validate if semver values are allowed for merging
 *
 * @packageDocumentation
 */

import { EnumSemverWildcard } from '../types';

/**
 * 檢查值是否允許用於合併
 * Check if value is allowed for merging
 *
 * 判斷給定的值是否為有效的合併候選值。
 * 有效的值必須是非空字串，且不是萬用字元（* 或 x）。
 *
 * Determines if the given value is a valid merge candidate.
 * Valid values must be non-empty strings and not wildcards (* or x).
 *
 * @param {string} value - 要檢查的值 / Value to check
 * @returns {boolean} 是否允許合併 / Whether merging is allowed
 *
 * @example
 * ```typescript
 * isAllowedMergeAbleValue('1');     // true
 * isAllowedMergeAbleValue('beta');  // true
 * isAllowedMergeAbleValue('');      // false (空字串 / Empty string)
 * isAllowedMergeAbleValue('*');     // false (萬用字元 / Wildcard)
 * isAllowedMergeAbleValue('x');     // false (萬用字元 / Wildcard)
 * isAllowedMergeAbleValue(null);    // false (非字串 / Not a string)
 * isAllowedMergeAbleValue(undefined); // false (非字串 / Not a string)
 * ```
 */
export function isAllowedMergeAbleValue(value: string)
{
	// 值必須是字串、長度大於 0、且不是 '*' 或 'x' 萬用字元
	// Value must be a string, length > 0, and not '*' or 'x' wildcard
	return (typeof value === 'string' && value.length > 0 && value !== EnumSemverWildcard.star && value !== EnumSemverWildcard.x)
}
