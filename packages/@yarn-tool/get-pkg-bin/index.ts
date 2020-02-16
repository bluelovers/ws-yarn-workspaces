import { resolve } from 'upath2';
import type { IPackageJson } from '@ts-type/package-dts';
import resolvePackage from '@yarn-tool/resolve-package';
import { handlePackageBins, getPackageBins, getPackageInfo, firstPackageBin, IPackageJsonLike } from './util';

export type IOptions = {
	pkgRoot?: string,
	usePathResolve?: boolean,
} & ({
	name?: string,
	pkg: IPackageJsonLike,
} | {
	name: string,
	pkg?: IPackageJsonLike,
});

export function normalizePackageBins(options: IOptions)
{
	let { pkgRoot, pkg, name } = getPackageInfo(options);

	let bins = getPackageBins(pkg) || {};

	if (pkgRoot != null)
	{
		const resolveFn = (options.usePathResolve) ? ((bin) => resolve(pkgRoot, bin)) : ((bin) => require.resolve(bin, {
			paths: [
				pkgRoot,
			],
		}));

		return handlePackageBins(bins, resolveFn)
	}

	return handlePackageBins(bins);
}

export function defaultPackageBin(options: IOptions, defaultKey?: string)
{
	let { pkgRoot, pkg, name } = getPackageInfo(options);

	let bins = normalizePackageBins({
		...options,
		pkgRoot,
		pkg,
		name,
	});

	if (defaultKey == null && typeof name === 'string')
	{
		defaultKey = name.split('/').pop();
	}

	if (typeof defaultKey === 'string' && defaultKey in bins)
	{
		return bins[defaultKey]
	}

	return firstPackageBin(bins)
}

export default normalizePackageBins
