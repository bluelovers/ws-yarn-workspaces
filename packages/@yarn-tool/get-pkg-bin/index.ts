import { resolve } from 'upath2';
import { handlePackageBins, getPackageBins, getPackageInfo, firstPackageBin } from './util';
import { IPackageJsonLike, IOptions } from './lib/types';

export * from './lib/types';
export * from './util';

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
