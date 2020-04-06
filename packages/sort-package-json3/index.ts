// @ts-ignore
import { sortPackageJson as sortPackageJsonCore } from 'sort-package-json';
import sortPackageJsonScripts from 'sort-package-json-scripts';

export function sortPackageJson<T extends Record<string, any>>(pkg: T): T
{
	pkg = sortPackageJsonCore(pkg);

	if (typeof pkg.scripts === 'object')
	{
		// @ts-ignore
		pkg.scripts = sortPackageJsonScripts(pkg.scripts)
	}

	if (typeof pkg.betterScripts === 'object')
	{
		// @ts-ignore
		pkg.betterScripts = sortPackageJsonScripts(pkg.betterScripts)
	}

	return pkg
}

export default sortPackageJson
