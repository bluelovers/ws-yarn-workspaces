import SemVer from 'semver/classes/semver';
import { parseOptionsOrLoose } from './internal/parseOptionsOrLoose';
import SemverRange from './Range';
import { IOptionsOrLoose } from './types';
import { hasInvalidCharacter } from './util/assert';

/**
 * Return the valid range or null if it's not valid
 */
export function validRange(range: string, optionsOrLoose?: IOptionsOrLoose)
{
	optionsOrLoose = parseOptionsOrLoose(optionsOrLoose)

	if (typeof range !== 'string')
	{
		throw new TypeError(`range should be string, but got ${range}`)
	}

	if (hasInvalidCharacter(range, optionsOrLoose))
	{
		return null
	}

	try
	{
		return new SemverRange(range, optionsOrLoose).toRangeString()
	}
	catch (er)
	{
		return null
	}

}

export default validRange
