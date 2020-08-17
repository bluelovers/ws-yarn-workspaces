import _npa, { AliasResult, FileResult, RegistryResult, HostedGitResult, URLResult } from 'npm-package-arg';
import { IResult } from './lib/types';

export type { AliasResult, FileResult, RegistryResult, HostedGitResult, URLResult }
export type { IResult }

export { getSemverFromNpaResult } from './lib/getSemverFromNpaResult';

export function npa(arg: string, where?: string): IResult
{
	return _npa(arg, where) as IResult
}

export default npa
