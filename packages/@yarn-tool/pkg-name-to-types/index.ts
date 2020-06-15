import { array_unique_overwrite } from 'array-hyper-unique/core';

const sep = '__';
const reNamespacedName = /^(?:(@[^\/]+)\/)?([^@]+)$/;
const reNamespacedNameWithVersion = /^(?:(@[^\/]+)\/)?([^@]+)(?:@(.+))?$/;

export { sep, reNamespacedName, reNamespacedNameWithVersion }

export function parseArgvPkgName(input: string)
{
	let m = input.match(reNamespacedNameWithVersion);

	if (m)
	{
		return {
			input,
			namespace: m[1],
			name: m[2],
			version: m[3],
		}
	}
}

export function isNamespacedName(packageName: string)
{
	return reNamespacedName.test(packageName)
}

export function escapePackageName(packageName: string)
{
	return packageName
		.replace(/^@/, '')
		.replace(/[/\\]/, '__')
	;
}

export function listToTypes(input: string[], includeVersion?: boolean)
{
	return array_unique_overwrite(input.reduce(function (a, b)
	{
		a.push(pkgNameToTypes(b, includeVersion));

		return a;
	}, [] as string[]));
}

export function extractName(packageName: string)
{
	return parseArgvPkgName(packageName).name
}

export function pkgNameToTypes(packageName: string, includeVersion?: boolean)
{
	let m = parseArgvPkgName(packageName);

	let { version, name, namespace } = m;

	if (namespace)
	{
		name = escapePackageName(namespace) + '__' + name;
	}

	let typeName = `@types/${name}`

	if (includeVersion && m.version?.length)
	{
		typeName += `${version}`
	}

	return typeName;
}

export default pkgNameToTypes
