import { dirname, normalize, sep, resolve } from 'upath2';
import type { IPackageJson } from '@ts-type/package-dts';
import { sync as pkgDir } from 'pkg-dir';

/**
 * @see RequireResolve
 */
export interface IOptions
{
	paths?: string[];
}

export function resolvePackageCore(moduleName: string, options?: IOptions)
{
	const entryPointLocation = require.resolve(moduleName, options);
	const pkgRoot = pkgDir(entryPointLocation);

	return {
		name: moduleName,
		pkgRoot,
		entryPointLocation,
	}
}

export function resolvePackageRoot(moduleName: string, options?: IOptions)
{
	return resolvePackageCore(moduleName, options).pkgRoot
}

export function resolvePackageJsonLocation(moduleName: string, options?: IOptions)
{
	return resolve(resolvePackageCore(moduleName, options).pkgRoot, 'package.json')
}

export function createResolveLocationFn(moduleName: string, options?: IOptions)
{
	const { pkgRoot } = resolvePackageCore(moduleName, options);
	return (path: string, ...paths: string[]) => resolve(pkgRoot, path, ...paths)
}

export function readModulePackageJson<P extends IPackageJson>(moduleName: string, options?: IOptions): P
{
	return require(resolvePackageJsonLocation(moduleName, options))
}

export function resolvePackage<P extends IPackageJson>(moduleName: string, options?: IOptions)
{
	const _ = resolvePackageCore(moduleName, options);
	const { pkgRoot } = _;

	const pkgJsonLocation: string = resolve(pkgRoot, 'package.json');

	return {
		..._,
		pkg: require(pkgJsonLocation) as any as P,
		pkgJsonLocation,
		resolveLocation(path: string, ...paths: string[])
		{
			return resolve(pkgRoot, path, ...paths)
		},
	}
}

export default resolvePackage
