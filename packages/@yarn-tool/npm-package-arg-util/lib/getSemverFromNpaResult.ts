import { AliasResult } from 'npm-package-arg';
import { IResult } from './types';

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

export default getSemverFromNpaResult
