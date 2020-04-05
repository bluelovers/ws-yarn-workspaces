// @ts-ignore
import { sortPackageJson as sortPackageJsonCore } from 'sort-package-json';
import sortPackageJsonScript from 'sort-package-json-scripts';

export function sortPackageJson<T extends Record<string, any>>(pkg: T): T
{
	pkg = sortPackageJsonCore(pkg);

	if (typeof pkg.scripts === 'object')
	{
		// @ts-ignore
		pkg.scripts = sortPackageJsonScript(pkg.scripts)
	}

	if (typeof pkg.betterScripts === 'object')
	{
		// @ts-ignore
		pkg.betterScripts = sortPackageJsonScript(pkg.betterScripts)
	}

	return pkg
}

export default sortPackageJson
