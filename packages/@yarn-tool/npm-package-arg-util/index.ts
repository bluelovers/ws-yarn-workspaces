import _npa, { AliasResult, FileResult, RegistryResult, HostedGitResult, URLResult } from 'npm-package-arg';
export { getSemverFromNpaResult } from './lib/getSemverFromNpaResult';

export type IResult = AliasResult | FileResult | RegistryResult | HostedGitResult | URLResult;

export function npa(arg: string, where?: string): IResult
{
	return _npa(arg, where) as IResult
}

export default npa
