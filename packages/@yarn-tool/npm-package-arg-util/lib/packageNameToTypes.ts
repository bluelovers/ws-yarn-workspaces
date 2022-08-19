import { escapePackageNameToTypes } from './escapePackageNameToTypes';
import { parsePackageName } from './parseArgvPkgName';
import { IParsePackageName } from './types';
import { assertScope, formatPackageName } from '@yarn-tool/pkg-name-util';

export function packageNameToTypes(packageName: string, prefix?: string): IParsePackageName
{
	let ret = parsePackageName(packageName);

	prefix ??= '@types';

	assertScope(prefix, true);

	let { result } = ret;

	let scope = prefix;

	let subname = escapePackageNameToTypes(result, prefix);

	let name = formatPackageName({
		scope: prefix,
		name: subname,
	});

	return {
		...ret,
		name,
		scope,
		subname,
	}
}
