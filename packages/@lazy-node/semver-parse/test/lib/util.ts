/**
 * Created by user on 2026/2/24.
 */
import { SemVer } from "semver";
import { parseSimpleSemVer } from '../../lib/parseSimpleSemVer';
import { parseSimpleSemVerRange } from '../../lib/parseSimpleSemVerRange';

export function _lazyReturnResult<T extends any>(fn: (...argv) => T, input: string)
{
	let result: T;
	try
	{
		result = fn(input);
	}
	catch(err)
	{
		return {
			input,
			err: err as Error,
		}
	}

	return {
		input,
		result,
	}
}

export function fnOriginalSemver(input: string)
{
	return new SemVer(input)
}

export function _lazyReturnResultAll(input: string)
{
	return {
		input,
		originalSemver: _lazyReturnResult(fnOriginalSemver, input),
		parseSimpleSemVer: _lazyReturnResult(parseSimpleSemVer, input),
		parseSimpleSemVerRange: _lazyReturnResult(parseSimpleSemVerRange, input),
	}
}

export function _lazyThrowError<E extends Error>(e: E)
{
	throw e
}
