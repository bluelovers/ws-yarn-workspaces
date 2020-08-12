import _npa, {
	Result,
	AliasResult,
	FileResult,
	HostedGit,
	RegistryResult,
	HostedGitResult,
	URLResult,
} from 'npm-package-arg';

export type IResult = AliasResult | FileResult | RegistryResult | HostedGitResult | URLResult;

export function npa(arg: string, where?: string): IResult
{
	return _npa(arg, where) as IResult
}

export function getSemverFromNpaResult(npaResult: IResult)
{
	let semver: string;

	switch (npaResult.type)
	{
		case 'alias':
			semver = (npaResult as AliasResult).subSpec.rawSpec;
			break;
		default:
			semver = npaResult.rawSpec;
			break;
	}

	return semver;
}

export default npa
