
export interface IPackageNameInfo
{
	scope?: string,
	name: string,
}

export function formatPackageName(data: IPackageNameInfo)
{
	if (!data.name?.length)
	{
		throw new TypeError(`Invalid package name`)
	}

	if (data.scope?.length > 0)
	{
		assertScope(data.scope);

		const prefix = data.scope[0] === '@' ? '' : '@';

		return `${prefix}${data.scope}/${data.name}`;
	}

	return data.name
}

export function stripScope(packageName: string)
{
	const index = packageName.indexOf('/') + 1;
	return packageName.slice(index)
}

export function assertScope(scope: string, includeAtSign?: boolean): asserts scope is string
{
	if (typeof includeAtSign === 'boolean' && includeAtSign !== (scope[0] === '@'))
	{
		throw new TypeError(`Invalid scope '${scope}' when includeAtSign is ${includeAtSign}`)
	}

	let _scope = scope.replace(/^@/, '');

	if (!_scope.length || _scope.split(/[^\w\-_]/, 2).length !== 1)
	{
		throw new TypeError(`Invalid scope '${scope}'`)
	}
}

export function validScope(scope: string, includeAtSign?: boolean): scope is string
{
	try
	{
		assertScope(scope, includeAtSign);
		return true;
	}
	catch (e)
	{

	}
	return false;
}

export default formatPackageName
