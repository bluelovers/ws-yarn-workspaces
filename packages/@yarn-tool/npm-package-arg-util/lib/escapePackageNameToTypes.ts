import { stripScope } from '@yarn-tool/pkg-name-util';

export function escapePackageNameToTypes(options: {
	scope?: string,
	name: string,
}, prefix?: string)
{
	prefix ??= '@types';

	const name = stripScope(options.name);

	if (options.scope?.length > 0 && options.scope !== prefix)
	{
		return options.scope.replace('@', '') + '__' + name
	}

	return name;
}
