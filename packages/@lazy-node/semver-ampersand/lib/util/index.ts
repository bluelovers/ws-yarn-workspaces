import { reAmpersandAndSpaces } from '../const';

/**
 * 檢查字串是否包含 ampersand 或空白
 * Check whether a string contains an ampersand or whitespace
 *
 * 用於快速判斷是否需要走 handleAmpersandAndSpaces 的字串正規化。
 * Used as a fast pre-check for whether string normalization via
 * handleAmpersandAndSpaces is needed at all.
 *
 * @param input - 輸入字串 / Input string
 * @returns 是否含 `&` 或空白 / Whether it contains `&` or whitespace
 */
export function hasAmpersandAndSpaces(input: string)
{
	return reAmpersandAndSpaces.test(input)
}

/**
 * 判斷是否為純物件（plain object）
 * Check whether a value is a plain object
 *
 * 除了原型必須是 Object.prototype 或 null，還先檢查
 * Object.prototype.toString，以排除跨 realm 的物件與類陣列型別。
 * Besides requiring the prototype to be Object.prototype or null, the
 * Object.prototype.toString check up front rules out cross-realm objects and
 * array-likes.
 *
 * @param value - 要檢查的值 / Value to check
 * @returns 是否為純物件 / Whether it is a plain object
 */
export function isPlainObject(value): value is object
{
	if (Object.prototype.toString.call(value) !== '[object Object]')
	{
		return false;
	}

	const prototype = Object.getPrototypeOf(value);
	return prototype === null || prototype === Object.prototype;
}
