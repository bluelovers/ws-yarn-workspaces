import _npa, { AliasResult, FileResult, RegistryResult, HostedGitResult, URLResult } from 'npm-package-arg';
import { IResult, IResultType } from './lib/types';

export type { AliasResult, FileResult, RegistryResult, HostedGitResult, URLResult }
export type { IResult, IResultType }

export { getSemverFromNpaResult } from './lib/getSemverFromNpaResult';

export function npa<T extends IResult>(arg: string, where?: string): T
{
	return _npa(arg, where) as T
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
