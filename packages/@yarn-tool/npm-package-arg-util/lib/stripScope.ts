export function stripScope(packageName: string)
{
	let index = packageName.indexOf('/') + 1;

	return packageName.slice(index)
}
