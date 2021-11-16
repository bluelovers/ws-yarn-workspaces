import _npa, { AliasResult, FileResult, HostedGitResult, RegistryResult, URLResult } from 'npm-package-arg';
import { IResult, IResultType } from './lib/types';
import { assertNpaResultHasName } from './lib/assert';

export type { AliasResult, FileResult, RegistryResult, HostedGitResult, URLResult }
export type { IResult, IResultType }

export { getSemverFromNpaResult } from './lib/getSemverFromNpaResult';

export function npa<T extends IResult>(arg: string, where?: string): T
{
	const result = _npa(arg, where) as T

	assertNpaResultHasName(result);

	return result
}

export function npaTry<T extends IResult>(arg: string, where?: string): T
{
	try
	{
		return npa(arg, where)
	}
	catch (e)
	{

	}
}

export default npa
