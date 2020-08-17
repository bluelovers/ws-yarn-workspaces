import { stripScope } from './stripScope';

export function escapePackageNameToTypes(options: {
	scope?: string,
	name: string,
})
{
	const name = stripScope(options.name);

	if (options.scope?.length > 0)
	{
		return options.scope.replace('@', '') + '__' + name
	}

	return name;
}
