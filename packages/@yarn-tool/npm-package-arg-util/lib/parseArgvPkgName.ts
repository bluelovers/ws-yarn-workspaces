import { npa, getSemverFromNpaResult} from '../index';
import { stripScope } from '@yarn-tool/pkg-name-util';
import { IParsePackageName, IResult } from './types';

/**
 * @deprecated
 */
export function parseArgvPkgName(input: string)
{
	const result = npa(input)

	if (result)
	{
		return {
			input,
			namespace: result.scope,
			name: stripScope(result.name),
			version: getSemverFromNpaResult(result),
			result,
		}
	}
}

export function parsePackageName(packageName: string): IParsePackageName
{
	const result = npa(packageName)

	const subname = stripScope(result.name);

	let semver = getSemverFromNpaResult(result);

	if (!semver?.length)
	{
		semver = void 0;
	}

	return {
		type: result.type,
		name: result.name,
		scope: result.scope,
		subname,
		semver,
		result,
	}
}
