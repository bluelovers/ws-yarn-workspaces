import SemVer from 'semver/classes/semver';
import { parseOptionsOrLoose } from './internal/parseOptionsOrLoose';
import SemverRange from './Range';
import { IOptionsOrLoose } from './types';
import { hasInvalidCharacter } from './util/assert';

/**
 * 回傳規範化後的範圍，無效時回傳 null
 * Return the valid range, or null if it's not valid
 *
 * 先以正則過濾無效字元（依 noAmpersand 決定 `&` 是否算無效），
 * 再交由 Range 嘗試解析；任何解析例外都會被吞掉並統一回傳 null，
 * 讓呼叫端只用「truthy / null」即可判斷，不必自行包 try/catch。
 * Invalid characters are filtered first (whether `&` counts as invalid depends
 * on noAmpersand), then Range tries to parse; any parsing error is swallowed
 * and normalized to null so callers only need a truthy/null check instead of
 * wrapping their own try/catch.
 *
 * @param range - 範圍字串 / Range string
 * @param optionsOrLoose - 選項或寬鬆旗標 / Options or loose flag
 * @returns 規範化後的範圍字串，無效時為 null / Normalized range string, or null when invalid
 * @throws {TypeError} 當 range 不是字串時 / When range is not a string
 */
export function validRange(range: string, optionsOrLoose?: IOptionsOrLoose)
{
	if (typeof range !== 'string')
	{
		throw new TypeError(`range should be string, but got ${range}`)
	}

	optionsOrLoose = parseOptionsOrLoose(optionsOrLoose)

	try
	{
		if (!hasInvalidCharacter(range, optionsOrLoose))
		{
			return new SemverRange(range, optionsOrLoose).toRangeString()
		}
	}
	catch (er)
	{

	}

	return null
}

export default validRange
