// @ts-ignore
import { sortPackageJson as sortPackageJsonCore } from 'sort-package-json';
import { sortPackageJsonScripts } from 'sort-package-json-scripts';
import isPlainObject from 'is-plain-obj';
import { IPackageJson } from '@ts-type/package-dts/package-json';
import { sortPackageJsonExports } from '@yarn-tool/sort-package-json-exports';
import { sortOrder } from '@yarn-tool/sort-package-json-order';

export function sortPackageJson<T extends Record<string, any> = IPackageJson>(pkg: T): T
{
	pkg = sortPackageJsonCore(pkg, {
		sortOrder,
	});

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

	if (isPlainObject(pkg.exports))
	{
		// @ts-ignore
		pkg.exports = sortPackageJsonExports(pkg.exports);
	}

	return pkg
}

export default sortPackageJson
