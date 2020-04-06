// @ts-ignore
import { sortPackageJson as sortPackageJsonCore } from 'sort-package-json';
import sortPackageJsonScripts from 'sort-package-json-scripts';
import isPlainObject from 'is-plain-obj';

export function sortPackageJson<T extends Record<string, any>>(pkg: T): T
{
	pkg = sortPackageJsonCore(pkg);

	if (isPlainObject(pkg.scripts))
	{
		// @ts-ignore
		pkg.scripts = sortPackageJsonScripts(pkg.scripts)
	}

	if (isPlainObject(pkg.betterScripts))
	{
		// @ts-ignore
		pkg.betterScripts = sortPackageJsonScripts(pkg.betterScripts)
	}

	return pkg
}

export default sortPackageJson
