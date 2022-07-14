import { parseArgvPkgName } from '@yarn-tool/npm-package-arg-util/lib/parseArgvPkgName';

const sep = '__';
const reNamespacedName = /^(?:(@[^\/]+)\/)?([^@]+)$/;
const reNamespacedNameWithVersion = /^(?:(@[^\/]+)\/)?([^@]+)(?:@(.+))?$/;

export { sep, reNamespacedName, reNamespacedNameWithVersion }

export { parseArgvPkgName }

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
