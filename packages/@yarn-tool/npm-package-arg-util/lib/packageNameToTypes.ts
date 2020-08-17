import { escapePackageNameToTypes } from './escapePackageNameToTypes';
import { parsePackageName } from './parseArgvPkgName';
import { IParsePackageName } from './types';

export function packageNameToTypes(packageName: string, prefix?: string): IParsePackageName
{
	let ret = parsePackageName(packageName);

	prefix ??= '@types';

	if (prefix[0] !== '@' || prefix.includes('/'))
	{
		throw new TypeError(`invalid scope '${prefix}'`)
	}

	let { result } = ret;

	let scope = prefix;

	let subname = escapePackageNameToTypes(result);

	let name = prefix + '/' + escapePackageNameToTypes(result);

	return {
		...ret,
		name,
		scope,
		subname,
	}
}
