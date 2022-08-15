import { IResult, npa } from '@yarn-tool/npm-package-arg-util';
import { buildRangeSet } from '@lazy-node/semver-ampersand/lib/range/buildRangeSet';
import { stringifyRangeSet } from '@lazy-node/semver-ampersand/lib/range/stringifyRangeSet';
import { toRangeString } from '@lazy-node/semver-ampersand/lib/range/toRangeString';
import { EnumSemverVersion } from '@lazy-node/semver-ampersand/lib/const';
import { SemverRange } from '@lazy-node/semver-ampersand/lib/Range';

const FAKE_NAME = '@fake/fake' as const

export function normalizeResultToDepsValue(result: ReturnType<typeof _getNpaResult>)
{
	let value: string;
	if (typeof result === 'string')
	{
		value = result;
	}
	else if (result)
	{
		if (result.type === 'range')
		{
			const rangeSet = buildRangeSet(result.rawSpec);
			value = toRangeString(stringifyRangeSet(rangeSet))
		}
		else if (result.type === 'tag' && result.rawSpec === EnumSemverVersion.ANY && result.raw !== `${FAKE_NAME}@`)
		{
			value = result.name
		}
		else
		{
			value = result.rawSpec
		}
	}
	if (value === EnumSemverVersion.ANY)
	{
		value = void 0;
	}

	return value ?? EnumSemverVersion.STAR
}

export function _getNpaResult(value: string)
{
	let result: IResult | string;

	try
	{
		let sr = new SemverRange(value);
		result = npa(`${FAKE_NAME}@${value}`)
	}
	catch (e)
	{
		try
		{
			result = npa(`${value}`)
		}
		catch (e)
		{
			try
			{
				result = npa(`${FAKE_NAME}@${value}`)
			}
			catch (e2)
			{
				throw e
			}
		}
	}

	return result
}

export function normalizeDepsValue(value: string)
{
	const result = _getNpaResult(value);
	return normalizeResultToDepsValue(result)
}

export default normalizeDepsValue
