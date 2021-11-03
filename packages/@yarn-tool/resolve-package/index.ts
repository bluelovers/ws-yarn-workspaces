import { dirname, normalize, sep, resolve } from 'upath2';
import type { IPackageJson } from '@ts-type/package-dts';
import { sync as pkgDir } from 'pkg-dir';

export function resolvePackage(name: string, options?: {
	/**
	 * @see RequireResolve
	 */
	paths?: string[];
})
{
	const entryPointLocation = require.resolve(name, options);
	const pkgRoot = pkgDir(entryPointLocation);

	const pkgConfigLocation: string = resolve(pkgRoot, 'package.json');

	return {
		name,
		pkgRoot,
		pkg: require(pkgConfigLocation) as any as IPackageJson,
		pkgConfigLocation,
		entryPointLocation,
		resolveLocation(path: string, ...paths: string[])
		{
			return resolve(pkgRoot, path, ...paths)
		},
	}
}

export default resolvePackage
